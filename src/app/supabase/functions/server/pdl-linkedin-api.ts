/**
 * LinkedIn Data via People Data Labs (PDL) + RocketReach
 * Substitui Proxycurl que foi descontinuado
 * 
 * APIs:
 * - PDL: https://www.peopledatalabs.com/
 * - RocketReach: https://rocketreach.co/
 */

const PDL_API_KEY = Deno.env.get('PDL_API_KEY');
const ROCKETREACH_API_KEY = Deno.env.get('ROCKETREACH_API_KEY');

interface LinkedInPersonSearchParams {
  name?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  country?: string;
  seniorityLevel?: string[];
  industry?: string;
  pastCompany?: string;
  education?: string;
}

interface LinkedInCompanySearchParams {
  companyName?: string;
  location?: string;
  industry?: string;
  companySize?: string[];
  foundedYear?: { min?: number; max?: number };
  companyType?: string[];
}

/**
 * Busca pessoas no LinkedIn via People Data Labs
 */
export async function searchLinkedInPeople(params: LinkedInPersonSearchParams) {
  console.log('🔵 PDL API - Buscando pessoas LinkedIn:', params);

  if (!PDL_API_KEY) {
    console.warn('⚠️ PDL_API_KEY não configurada, usando fallback');
    return [];
  }

  try {
    // Construir query do PDL
    const pdlQuery: any = {
      dataset: 'all',
      min_likelihood: 6, // Mínimo de confiança
    };

    // SQL-like query para PDL
    const sqlParts: string[] = [];
    
    if (params.name) {
      const nameParts = params.name.trim().split(' ');
      if (nameParts.length > 1) {
        sqlParts.push(`full_name:"${params.name}"`);
      } else {
        sqlParts.push(`(first_name:"${nameParts[0]}" OR last_name:"${nameParts[0]}")`);
      }
    }
    
    if (params.jobTitle) {
      sqlParts.push(`job_title_role:"${params.jobTitle}"`);
    }
    
    if (params.company) {
      sqlParts.push(`job_company_name:"${params.company}"`);
    }
    
    if (params.location) {
      sqlParts.push(`location_name:"${params.location}"`);
    }
    
    if (params.country) {
      sqlParts.push(`location_country:"${params.country}"`);
    }

    if (params.industry) {
      sqlParts.push(`industry:"${params.industry}"`);
    }

    pdlQuery.sql = sqlParts.join(' AND ');
    pdlQuery.size = 20; // Máximo de resultados

    console.log('📤 PDL Query:', pdlQuery.sql);

    const response = await fetch('https://api.peopledatalabs.com/v5/person/search', {
      method: 'POST',
      headers: {
        'X-Api-Key': PDL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pdlQuery)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ PDL API Error:', response.status, errorText);
      throw new Error(`PDL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ PDL API - Pessoas encontradas:', data.data?.length || 0);

    // Mapear para formato padrão
    return (data.data || []).map((person: any) => ({
      source: 'linkedin_pdl',
      name: person.full_name || `${person.first_name} ${person.last_name}`,
      title: person.job_title || person.job_title_role,
      company: person.job_company_name,
      location: person.location_name,
      profileUrl: person.linkedin_url,
      linkedinUrl: person.linkedin_url,
      photoUrl: person.photo_url,
      summary: person.summary,
      email: person.emails?.[0]?.address || person.work_email,
      phone: person.phone_numbers?.[0] || person.mobile_phone,
      skills: person.skills || [],
      experience: person.experience || [],
      education: person.education || [],
      likelihood: person.likelihood,
      rawData: person
    }));

  } catch (error: any) {
    console.error('❌ PDL search error:', error);
    // Não fazer throw, retornar array vazio para permitir fallback
    return [];
  }
}

/**
 * Busca empresas no LinkedIn via People Data Labs
 */
export async function searchLinkedInCompanies(params: LinkedInCompanySearchParams) {
  console.log('🔵 PDL API - Buscando empresas LinkedIn:', params);

  if (!PDL_API_KEY) {
    console.warn('⚠️ PDL_API_KEY não configurada');
    return [];
  }

  try {
    const pdlQuery: any = {
      dataset: 'all',
      min_likelihood: 6,
    };

    const sqlParts: string[] = [];
    
    if (params.companyName) {
      sqlParts.push(`name:"${params.companyName}"`);
    }
    
    if (params.location) {
      sqlParts.push(`location_name:"${params.location}"`);
    }
    
    if (params.industry) {
      sqlParts.push(`industry:"${params.industry}"`);
    }

    pdlQuery.sql = sqlParts.join(' AND ');
    pdlQuery.size = 20;

    const response = await fetch('https://api.peopledatalabs.com/v5/company/search', {
      method: 'POST',
      headers: {
        'X-Api-Key': PDL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pdlQuery)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ PDL Company API Error:', response.status, errorText);
      throw new Error(`PDL Company API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ PDL API - Empresas encontradas:', data.data?.length || 0);

    return (data.data || []).map((company: any) => ({
      source: 'linkedin_pdl',
      companyName: company.name,
      domain: company.website,
      industry: company.industry,
      size: company.size ? `${company.size}` : company.employee_count ? `${company.employee_count}` : null,
      employeeCount: company.employee_count,
      description: company.summary,
      headquarters: company.location_name,
      website: company.website,
      linkedinUrl: company.linkedin_url,
      founded: company.founded,
      companyType: company.type,
      rawData: company
    }));

  } catch (error: any) {
    console.error('❌ PDL company search error:', error);
    return [];
  }
}

/**
 * Enriquece perfil via RocketReach (contatos + LinkedIn)
 */
export async function enrichProfileWithRocketReach(profile: any) {
  console.log('🚀 RocketReach - Enriquecendo perfil:', profile.name);

  if (!ROCKETREACH_API_KEY) {
    console.warn('⚠️ ROCKETREACH_API_KEY não configurada');
    return profile;
  }

  try {
    const response = await fetch('https://api.rocketreach.co/v2/api/lookupProfile', {
      method: 'POST',
      headers: {
        'Api-Key': ROCKETREACH_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: profile.name,
        current_employer: profile.company,
        linkedin_url: profile.linkedinUrl
      })
    });

    if (!response.ok) {
      console.warn('⚠️ RocketReach enrich failed:', response.status);
      return profile;
    }

    const data = await response.json();
    console.log('✅ RocketReach - Perfil enriquecido');

    // Merge dados do RocketReach
    return {
      ...profile,
      email: data.emails?.[0] || profile.email,
      phone: data.phones?.[0] || profile.phone,
      linkedinUrl: data.linkedin_url || profile.linkedinUrl,
      photoUrl: data.profile_pic || profile.photoUrl,
      rocketReachData: data
    };

  } catch (error: any) {
    console.error('❌ RocketReach enrich error:', error);
    return profile;
  }
}

/**
 * Busca perfil completo do LinkedIn por URL
 */
export async function getLinkedInProfile(linkedinUrl: string) {
  console.log('🔵 PDL API - Buscando perfil:', linkedinUrl);

  if (!PDL_API_KEY) {
    throw new Error('PDL_API_KEY não configurada');
  }

  try {
    const response = await fetch('https://api.peopledatalabs.com/v5/person/enrich', {
      method: 'POST',
      headers: {
        'X-Api-Key': PDL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile: linkedinUrl,
        min_likelihood: 6
      })
    });

    if (!response.ok) {
      throw new Error(`PDL Profile API error: ${response.status}`);
    }

    const person = await response.json();
    console.log('✅ PDL API - Perfil obtido:', person.full_name);

    const profile = {
      source: 'linkedin_pdl',
      name: person.full_name,
      title: person.job_title,
      company: person.job_company_name,
      location: person.location_name,
      profileUrl: linkedinUrl,
      linkedinUrl: linkedinUrl,
      photoUrl: person.photo_url,
      summary: person.summary,
      email: person.emails?.[0]?.address || person.work_email,
      phone: person.phone_numbers?.[0] || person.mobile_phone,
      skills: person.skills || [],
      experience: person.experience || [],
      education: person.education || [],
      rawData: person
    };

    // Tentar enriquecer com RocketReach
    return await enrichProfileWithRocketReach(profile);

  } catch (error: any) {
    console.error('❌ PDL profile error:', error);
    throw error;
  }
}
