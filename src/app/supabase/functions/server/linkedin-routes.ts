import { Hono } from 'npm:hono';
import { getEnv } from './env-helper.ts';

const app = new Hono();

/**
 * 🔗 LINKEDIN SALES NAVIGATOR SEARCH
 * Usando Proxycurl - API oficial para dados do LinkedIn
 * Docs: https://nubela.co/proxycurl/docs
 */

// 🔍 BUSCA DE PESSOAS NO LINKEDIN
app.post('/people-search', async (c) => {
  try {
    const body = await c.req.json();
    console.log('🔗 Busca LinkedIn pessoas:', body);

    // 🔒 PROXYCURL DESABILITADO - SEMPRE USA DADOS MOCKADOS
    // Para habilitar, remova este bloco e descomente o código abaixo
    console.log('📊 Usando dados de demonstração (Proxycurl desabilitado)');
    return c.json({
      success: true,
      results: getMockPeopleResults(body),
      total: 3,
      nextPage: null,
      message: 'Dados de demonstração'
    });

    /* CÓDIGO PROXYCURL COMENTADO - DESABILITADO
    const {
      keywords,
      jobTitle,
      company,
      location,
      industry,
      seniority,
      yearsOfExperience,
      school,
      degree,
      skills,
      currentCompanyOnly = false,
      limit = 25
    } = body;

    const proxycurlKey = getEnv('PROXYCURL_API_KEY');
    
    // Se não configurada, retorna dados mockados silenciosamente
    if (!proxycurlKey || proxycurlKey === 'YOUR_PROXYCURL_API_KEY') {
      console.log('📊 Proxycurl não configurada - Retornando dados mockados');
      return c.json({
        success: true,
        results: getMockPeopleResults(body),
        total: 3,
        nextPage: null,
        message: 'Dados de demonstração'
      });
    }

    // Construir query de busca
    const searchParams: any = {
      country: location?.country || 'pt', // Portugal por padrão
      enrich_profiles: 'enrich', // Enriquecer perfis automaticamente
      page_size: Math.min(limit, 100), // Max 100 por página
      use_cache: 'if-recent' // Usar cache se disponível
    };

    // Adicionar filtros
    if (keywords) {
      searchParams.keyword_first_name = keywords.split(' ')[0];
      searchParams.keyword_last_name = keywords.split(' ')[1];
    }
    if (jobTitle) searchParams.current_job_title = jobTitle;
    if (company) searchParams.current_company_name = company;
    if (location?.city) searchParams.city = location.city;
    if (industry && industry.length > 0) searchParams.industries = industry.join(',');
    if (school) searchParams.education_school_name = school;
    if (degree) searchParams.education_degree_name = degree;
    
    // Filtro de experiência
    if (yearsOfExperience?.min) searchParams.total_years_experience_min = yearsOfExperience.min;
    if (yearsOfExperience?.max) searchParams.total_years_experience_max = yearsOfExperience.max;

    console.log('📡 Chamando Proxycurl com params:', searchParams);

    // Chamar Proxycurl Person Search API
    // Construir URL com query params
    const queryString = new URLSearchParams(searchParams).toString();
    const apiUrl = `https://nubela.co/proxycurl/api/search/person/?${queryString}`;
    
    console.log('🔗 URL completa:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${proxycurlKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro Proxycurl (retornando dados mockados):', response.status);
      // Retorna dados mockados em vez de erro
      return c.json({
        success: true,
        results: getMockPeopleResults(body),
        total: 3,
        nextPage: null,
        message: 'Dados de demonstração'
      });
    }

    const data = await response.json();
    console.log(`✅ LinkedIn: ${data.results?.length || 0} perfis encontrados`);

    // Transformar resultados para formato padrão
    const results = (data.results || []).map((person: any, index: number) => ({
      id: `linkedin-${person.public_identifier || index}`,
      name: person.full_name || `${person.first_name || ''} ${person.last_name || ''}`.trim(),
      firstName: person.first_name,
      lastName: person.last_name,
      title: person.occupation || person.headline || 'N/A',
      company: person.experiences?.[0]?.company || 'N/A',
      location: `${person.city || ''}, ${person.country || ''}`.replace(/^, |, $/, '') || 'N/A',
      country: person.country || 'N/A',
      avatar: person.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.full_name || 'User')}&size=150`,
      linkedinUrl: person.linkedin_profile_url || `https://www.linkedin.com/in/${person.public_identifier}`,
      email: person.personal_emails?.[0] || '',
      phone: person.personal_numbers?.[0] || '',
      industry: person.industry || 'N/A',
      companySize: person.experiences?.[0]?.company_linkedin_profile_url ? 'N/A' : 'N/A',
      seniority: determineSeniority(person.occupation || person.headline),
      yearsExperience: calculateYearsExperience(person.experiences || []),
      skills: person.skills || [],
      matchScore: calculateMatchScore(person, body),
      source: 'linkedin',
      confidence: 90,
      enrichmentData: {
        linkedinPublicId: person.public_identifier,
        headline: person.headline,
        summary: person.summary,
        connectionsCount: person.connections,
        followerCount: person.follower_count,
        experiences: person.experiences?.slice(0, 3).map((exp: any) => ({
          title: exp.title,
          company: exp.company,
          startDate: exp.starts_at,
          endDate: exp.ends_at,
          description: exp.description
        })),
        education: person.education?.slice(0, 2).map((edu: any) => ({
          school: edu.school,
          degree: edu.degree_name,
          field: edu.field_of_study,
          startDate: edu.starts_at,
          endDate: edu.ends_at
        })),
        certifications: person.certifications?.slice(0, 3),
        languages: person.languages,
        groups: person.groups?.slice(0, 5)
      }
    }));

    // Ordenar por match score
    results.sort((a: any, b: any) => b.matchScore - a.matchScore);

    return c.json({
      success: true,
      results,
      total: data.total_result_count || results.length,
      nextPage: data.next_page || null,
      message: `${results.length} perfis encontrados no LinkedIn`
    });
    FIM DO CÓDIGO PROXYCURL COMENTADO */

  } catch (error: any) {
    console.error('❌ Erro na busca LinkedIn:', error.message);
    // Retorna dados mockados em vez de erro
    return c.json({
      success: true,
      results: getMockPeopleResults({}),
      total: 3,
      nextPage: null,
      message: 'Dados de demonstração'
    });
  }
});

// 🏢 BUSCA DE EMPRESAS NO LINKEDIN
app.post('/company-search', async (c) => {
  try {
    const body = await c.req.json();
    console.log('🔗 Busca LinkedIn empresas:', body);

    // 🔒 BUSCA DE EMPRESAS DESABILITADA - Retorna array vazio
    console.log('📊 Busca de empresas não disponível em modo demonstração');
    return c.json({
      success: true,
      results: [],
      total: 0,
      nextPage: null,
      message: 'Busca de empresas não disponível'
    });

    /* CÓDIGO PROXYCURL COMENTADO - DESABILITADO
    const {
      companyName,
      industry,
      location,
      companySize,
      founded,
      keywords,
      limit = 25
    } = body;

    const proxycurlKey = getEnv('PROXYCURL_API_KEY');
    
    if (!proxycurlKey || proxycurlKey === 'YOUR_PROXYCURL_API_KEY') {
      return c.json({
        success: false,
        message: 'Configure PROXYCURL_API_KEY para buscar empresas',
        results: []
      }, 400);
    }

    // Construir query
    const searchParams: any = {
      enrich_profiles: 'enrich',
      page_size: Math.min(limit, 100),
      use_cache: 'if-recent'
    };

    if (companyName) searchParams.name = companyName;
    if (location?.country) searchParams.country = location.country;
    if (location?.city) searchParams.city = location.city;
    if (industry && industry.length > 0) searchParams.industries = industry.join(',');
    if (founded?.min) searchParams.founded_after_year = founded.min;
    if (founded?.max) searchParams.founded_before_year = founded.max;

    console.log('📡 Chamando Proxycurl Company Search:', searchParams);

    // Construir URL com query params
    const queryString = new URLSearchParams(searchParams).toString();
    const apiUrl = `https://nubela.co/proxycurl/api/search/company/?${queryString}`;
    
    console.log('🔗 URL completa:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${proxycurlKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro Proxycurl:', errorText);
      return c.json({
        success: false,
        message: 'Erro ao buscar empresas',
        error: errorText,
        results: []
      }, response.status);
    }

    const data = await response.json();
    console.log(`✅ LinkedIn: ${data.results?.length || 0} empresas encontradas`);

    const results = (data.results || []).map((company: any, index: number) => ({
      id: `linkedin-company-${company.linkedin_internal_id || index}`,
      name: company.name,
      website: company.website,
      domain: company.domain,
      industry: company.industry,
      description: company.description,
      founded: company.founded_year,
      headquarters: `${company.city || ''}, ${company.country || ''}`.replace(/^, |, $/, ''),
      employeeCount: company.company_size_on_linkedin || company.company_size || 0,
      linkedinUrl: company.linkedin_profile_url,
      logo: company.logo_url || `https://logo.clearbit.com/${company.domain}`,
      specialties: company.specialities || [],
      companyType: company.company_type,
      followerCount: company.follower_count,
      matchScore: 80,
      source: 'linkedin',
      enrichmentData: {
        linkedinId: company.linkedin_internal_id,
        hq_city: company.city,
        hq_country: company.country,
        locations: company.locations,
        updates: company.updates?.slice(0, 5),
        affiliatedCompanies: company.affiliated_companies
      }
    }));

    return c.json({
      success: true,
      results,
      total: data.total_result_count || results.length,
      nextPage: data.next_page || null,
      message: `${results.length} empresas encontradas`
    });
    FIM DO CÓDIGO PROXYCURL COMENTADO */

  } catch (error: any) {
    console.error('❌ Erro na busca de empresas:', error.message);
    return c.json({
      success: true,
      results: [],
      total: 0,
      nextPage: null,
      message: 'Busca de empresas não disponível'
    });
  }
});

// 📊 ENRIQUECER PERFIL DO LINKEDIN (por URL)
app.post('/enrich-profile', async (c) => {
  try {
    const { linkedinUrl } = await c.req.json();
    
    if (!linkedinUrl) {
      return c.json({ success: false, message: 'LinkedIn URL é obrigatória' }, 400);
    }

    const proxycurlKey = getEnv('PROXYCURL_API_KEY');
    
    // Se não configurada, retorna null silenciosamente
    if (!proxycurlKey || proxycurlKey === 'YOUR_PROXYCURL_API_KEY') {
      console.log('📊 Proxycurl não configurada - Enriquecimento desabilitado');
      return c.json({
        success: false,
        message: 'Enriquecimento não disponível em modo demonstração'
      }, 400);
    }

    console.log('📡 Enriquecendo perfil:', linkedinUrl);

    const response = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(linkedinUrl)}&use_cache=if-recent`,
      {
        headers: {
          'Authorization': `Bearer ${proxycurlKey}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao enriquecer (API indisponível):', response.status);
      return c.json({
        success: false,
        message: 'Erro ao enriquecer perfil - API indisponível'
      }, 400);
    }

    const profile = await response.json();
    console.log('✅ Perfil enriquecido:', profile.full_name);

    return c.json({
      success: true,
      profile,
      message: 'Perfil enriquecido com sucesso'
    });

  } catch (error: any) {
    console.error('❌ Erro ao enriquecer perfil:', error.message);
    return c.json({
      success: false,
      message: 'Erro ao enriquecer perfil'
    }, 400);
  }
});

// 🎯 HELPERS

function determineSeniority(title: string = ''): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('ceo') || titleLower.includes('founder') || titleLower.includes('president')) {
    return 'C-Level';
  }
  if (titleLower.includes('director') || titleLower.includes('vp') || titleLower.includes('head of')) {
    return 'Director';
  }
  if (titleLower.includes('manager') || titleLower.includes('lead')) {
    return 'Manager';
  }
  if (titleLower.includes('senior') || titleLower.includes('sr.')) {
    return 'Senior';
  }
  if (titleLower.includes('junior') || titleLower.includes('jr.')) {
    return 'Junior';
  }
  if (titleLower.includes('intern') || titleLower.includes('trainee')) {
    return 'Entry-level';
  }
  
  return 'Mid-level';
}

function calculateYearsExperience(experiences: any[]): number {
  if (!experiences || experiences.length === 0) return 0;
  
  let totalMonths = 0;
  experiences.forEach(exp => {
    if (exp.starts_at && exp.ends_at) {
      const start = new Date(exp.starts_at.year, exp.starts_at.month || 0);
      const end = exp.ends_at.year ? new Date(exp.ends_at.year, exp.ends_at.month || 0) : new Date();
      const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      totalMonths += months;
    }
  });
  
  return Math.floor(totalMonths / 12);
}

function calculateMatchScore(person: any, filters: any): number {
  let score = 50; // Base score
  
  // Título corresponde
  if (filters.jobTitle && person.occupation?.toLowerCase().includes(filters.jobTitle.toLowerCase())) {
    score += 20;
  }
  
  // Empresa corresponde
  if (filters.company && person.experiences?.[0]?.company?.toLowerCase().includes(filters.company.toLowerCase())) {
    score += 15;
  }
  
  // Localização corresponde
  if (filters.location?.city && person.city?.toLowerCase() === filters.location.city.toLowerCase()) {
    score += 10;
  }
  
  // Tem email
  if (person.personal_emails && person.personal_emails.length > 0) {
    score += 5;
  }
  
  return Math.min(score, 100);
}

function getMockPeopleResults(filters: any): any[] {
  return [
    {
      id: 'linkedin-123456789',
      name: 'João Silva',
      firstName: 'João',
      lastName: 'Silva',
      title: 'Engenheiro de Software',
      company: 'Tech Solutions',
      location: 'São Paulo, Brasil',
      country: 'Brasil',
      avatar: 'https://ui-avatars.com/api/?name=João+Silva&size=150',
      linkedinUrl: 'https://www.linkedin.com/in/joao-silva',
      email: 'joao.silva@techsolutions.com',
      phone: '+55 11 98765-4321',
      industry: 'Tecnologia',
      companySize: 'N/A',
      seniority: 'Mid-level',
      yearsExperience: 5,
      skills: ['JavaScript', 'React', 'Node.js'],
      matchScore: 85,
      source: 'linkedin',
      confidence: 90,
      enrichmentData: {
        linkedinPublicId: '123456789',
        headline: 'Engenheiro de Software na Tech Solutions',
        summary: 'Experiência em desenvolvimento web e mobile.',
        connectionsCount: 500,
        followerCount: 1000,
        experiences: [
          {
            title: 'Engenheiro de Software',
            company: 'Tech Solutions',
            startDate: '2018-01-01',
            endDate: '2023-12-31',
            description: 'Desenvolvimento de aplicações web.'
          }
        ],
        education: [
          {
            school: 'Universidade de São Paulo',
            degree: 'Bacharel em Ciência da Computação',
            field: 'Tecnologia da Informação',
            startDate: '2010-01-01',
            endDate: '2014-12-31'
          }
        ],
        certifications: [
          'Certificado de JavaScript',
          'Certificado de React'
        ],
        languages: ['Português', 'Inglês'],
        groups: [
          'Desenvolvedores de Software',
          'Tecnologia e Inovação'
        ]
      }
    },
    {
      id: 'linkedin-987654321',
      name: 'Maria Oliveira',
      firstName: 'Maria',
      lastName: 'Oliveira',
      title: 'Analista de Sistemas',
      company: 'Inovação Digital',
      location: 'Rio de Janeiro, Brasil',
      country: 'Brasil',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Oliveira&size=150',
      linkedinUrl: 'https://www.linkedin.com/in/maria-oliveira',
      email: 'maria.oliveira@inovacaodigital.com',
      phone: '+55 21 98765-4321',
      industry: 'Tecnologia',
      companySize: 'N/A',
      seniority: 'Mid-level',
      yearsExperience: 4,
      skills: ['Python', 'Django', 'SQL'],
      matchScore: 80,
      source: 'linkedin',
      confidence: 90,
      enrichmentData: {
        linkedinPublicId: '987654321',
        headline: 'Analista de Sistemas na Inovação Digital',
        summary: 'Experiência em desenvolvimento de sistemas.',
        connectionsCount: 400,
        followerCount: 800,
        experiences: [
          {
            title: 'Analista de Sistemas',
            company: 'Inovação Digital',
            startDate: '2019-01-01',
            endDate: '2023-12-31',
            description: 'Desenvolvimento de sistemas internos.'
          }
        ],
        education: [
          {
            school: 'Universidade Federal do Rio de Janeiro',
            degree: 'Bacharel em Ciência da Computação',
            field: 'Tecnologia da Informação',
            startDate: '2009-01-01',
            endDate: '2013-12-31'
          }
        ],
        certifications: [
          'Certificado de Python',
          'Certificado de Django'
        ],
        languages: ['Português', 'Inglês'],
        groups: [
          'Desenvolvedores de Software',
          'Tecnologia e Inovação'
        ]
      }
    },
    {
      id: 'linkedin-135792468',
      name: 'Pedro Costa',
      firstName: 'Pedro',
      lastName: 'Costa',
      title: 'Desenvolvedor(a) Front-end',
      company: 'Web Designers',
      location: 'Belo Horizonte, Brasil',
      country: 'Brasil',
      avatar: 'https://ui-avatars.com/api/?name=Pedro+Costa&size=150',
      linkedinUrl: 'https://www.linkedin.com/in/pedro-costa',
      email: 'pedro.costa@webdesigners.com',
      phone: '+55 31 98765-4321',
      industry: 'Tecnologia',
      companySize: 'N/A',
      seniority: 'Mid-level',
      yearsExperience: 3,
      skills: ['HTML', 'CSS', 'JavaScript'],
      matchScore: 75,
      source: 'linkedin',
      confidence: 90,
      enrichmentData: {
        linkedinPublicId: '135792468',
        headline: 'Desenvolvedor(a) Front-end na Web Designers',
        summary: 'Experiência em desenvolvimento web.',
        connectionsCount: 300,
        followerCount: 600,
        experiences: [
          {
            title: 'Desenvolvedor(a) Front-end',
            company: 'Web Designers',
            startDate: '2020-01-01',
            endDate: '2023-12-31',
            description: 'Desenvolvimento de interfaces web.'
          }
        ],
        education: [
          {
            school: 'Universidade Federal de Minas Gerais',
            degree: 'Bacharel em Ciência da Computação',
            field: 'Tecnologia da Informação',
            startDate: '2008-01-01',
            endDate: '2012-12-31'
          }
        ],
        certifications: [
          'Certificado de HTML',
          'Certificado de CSS'
        ],
        languages: ['Português', 'Inglês'],
        groups: [
          'Desenvolvedores de Software',
          'Tecnologia e Inovação'
        ]
      }
    }
  ];
}

export default app;