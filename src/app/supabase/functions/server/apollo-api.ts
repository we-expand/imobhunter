/**
 * Apollo.io API Integration
 * API Docs: https://apolloio.github.io/apollo-api-docs/
 */

const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY');
const APOLLO_BASE_URL = 'https://api.apollo.io/v1';

interface ApolloPersonSearchParams {
  name?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  seniorityLevel?: string[];
  industry?: string;
}

interface ApolloCompanySearchParams {
  companyName?: string;
  location?: string;
  industry?: string;
  companySize?: string[];
  revenue?: { min?: number; max?: number };
}

export async function searchApolloPeople(params: ApolloPersonSearchParams) {
  console.log('🟣 Apollo API - Buscando pessoas:', params);

  try {
    const requestBody: any = {
      api_key: APOLLO_API_KEY,
      page: 1,
      per_page: 25,
      person_titles: params.jobTitle ? [params.jobTitle] : undefined,
      q_organization_name: params.company,
      person_locations: params.location ? [params.location] : undefined,
      person_seniorities: params.seniorityLevel,
    };

    // Remove undefined fields
    Object.keys(requestBody).forEach(key => 
      requestBody[key] === undefined && delete requestBody[key]
    );

    const response = await fetch(
      `${APOLLO_BASE_URL}/mixed_people/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Apollo API Error:', response.status, errorText);
      throw new Error(`Apollo API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Apollo API - Pessoas encontradas:', data.people?.length || 0);

    return (data.people || []).map((person: any) => ({
      source: 'apollo',
      name: person.name || `${person.first_name} ${person.last_name}`,
      title: person.title,
      company: person.organization_name || person.organization?.name,
      location: person.city ? `${person.city}, ${person.state || person.country}` : person.country,
      email: person.email,
      phone: person.phone_numbers?.[0]?.sanitized_number || person.corporate_phone,
      linkedinUrl: person.linkedin_url,
      profileUrl: person.linkedin_url,
      photoUrl: person.photo_url,
      
      // Apollo specific data
      emailStatus: person.email_status,
      emailConfidence: person.email_confidence,
      phoneStatus: person.phone_numbers?.[0]?.status,
      
      // Organization data
      companyDomain: person.organization?.primary_domain,
      companyIndustry: person.organization?.industry,
      companySize: person.organization?.estimated_num_employees,
      
      skills: person.departments || [],
      seniority: person.seniority,
      
      rawData: person
    }));

  } catch (error: any) {
    console.error('❌ Apollo search error:', error);
    throw error;
  }
}

export async function searchApolloCompanies(params: ApolloCompanySearchParams) {
  console.log('🟣 Apollo API - Buscando empresas:', params);

  try {
    const requestBody: any = {
      api_key: APOLLO_API_KEY,
      page: 1,
      per_page: 25,
      organization_names: params.companyName ? [params.companyName] : undefined,
      organization_locations: params.location ? [params.location] : undefined,
      q_organization_keyword_tags: params.industry ? [params.industry] : undefined,
    };

    // Company size mapping
    if (params.companySize && params.companySize.length > 0) {
      requestBody.organization_num_employees_ranges = params.companySize.map(range => {
        const [min, max] = range.split('-');
        return max === '+' ? `${min},` : `${min},${max}`;
      });
    }

    // Revenue mapping
    if (params.revenue) {
      const revenueRanges = [];
      if (params.revenue.min !== undefined && params.revenue.max !== undefined) {
        revenueRanges.push(`${params.revenue.min},${params.revenue.max}`);
      }
      if (revenueRanges.length > 0) {
        requestBody.revenue_range = revenueRanges;
      }
    }

    // Remove undefined fields
    Object.keys(requestBody).forEach(key => 
      requestBody[key] === undefined && delete requestBody[key]
    );

    const response = await fetch(
      `${APOLLO_BASE_URL}/mixed_companies/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Apollo Company API Error:', response.status, errorText);
      throw new Error(`Apollo Company API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Apollo API - Empresas encontradas:', data.organizations?.length || 0);

    return (data.organizations || []).map((company: any) => ({
      source: 'apollo',
      companyName: company.name,
      domain: company.primary_domain || company.website_url,
      industry: company.industry,
      size: company.estimated_num_employees ? `${company.estimated_num_employees}` : null,
      employeeCount: company.estimated_num_employees,
      description: company.short_description || company.description,
      headquarters: company.city ? `${company.city}, ${company.state || company.country}` : company.country,
      website: company.website_url,
      linkedinUrl: company.linkedin_url,
      founded: company.founded_year,
      revenue: company.annual_revenue ? `$${company.annual_revenue}` : null,
      
      // Apollo specific
      technologies: company.technologies || company.current_technologies || [],
      keywords: company.keywords || [],
      phone: company.phone,
      
      rawData: company
    }));

  } catch (error: any) {
    console.error('❌ Apollo company search error:', error);
    throw error;
  }
}

export async function enrichApolloEmail(firstName: string, lastName: string, domain: string) {
  console.log('🟣 Apollo API - Enriquecendo email:', { firstName, lastName, domain });

  try {
    const requestBody = {
      api_key: APOLLO_API_KEY,
      first_name: firstName,
      last_name: lastName,
      domain: domain
    };

    const response = await fetch(
      `${APOLLO_BASE_URL}/people/match`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      throw new Error(`Apollo Email Enrich error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Apollo API - Email enriquecido:', data.person?.email);

    return {
      email: data.person?.email,
      emailStatus: data.person?.email_status,
      emailConfidence: data.person?.email_confidence,
      phone: data.person?.phone_numbers?.[0]?.sanitized_number,
      linkedinUrl: data.person?.linkedin_url,
      title: data.person?.title,
      seniority: data.person?.seniority
    };

  } catch (error: any) {
    console.error('❌ Apollo email enrich error:', error);
    return null;
  }
}
