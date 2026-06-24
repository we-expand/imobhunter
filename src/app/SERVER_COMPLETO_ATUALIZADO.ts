console.log('🚀 IMOBHUNTER SERVER STARTING - FULL VERSION WITH REAL APIs...');
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// Middleware de logging
app.use('*', logger(console.log));

// CORS aberto
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: false
}));

// ======================================
// 🔑 API KEYS
// ======================================
const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY') || '';
const PROXYCURL_API_KEY = Deno.env.get('PROXYCURL_API_KEY') || '';

console.log('🔑 API Keys loaded:', {
  apollo: APOLLO_API_KEY ? '✅' : '❌',
  proxycurl: PROXYCURL_API_KEY ? '✅' : '❌'
});

// ======================================
// 🎯 APOLLO.IO API
// ======================================
async function searchApollo(filters: any) {
  if (!APOLLO_API_KEY) {
    console.log('⚠️ Apollo API key não configurada');
    return [];
  }

  try {
    console.log('🔍 Buscando no Apollo.io:', filters);

    const apolloPayload: any = {
      api_key: APOLLO_API_KEY,
      q_keywords: filters.keywords || '',
      per_page: 25
    };

    // Mapear filtros para Apollo
    if (filters.location) apolloPayload.person_locations = [filters.location];
    if (filters.jobTitle) apolloPayload.person_titles = [filters.jobTitle];
    if (filters.company) apolloPayload.q_organization_name = filters.company;
    if (filters.industry) apolloPayload.organization_industry_tag_ids = [filters.industry];
    if (filters.companySize) {
      const sizeMap: any = {
        '1-10': ['1-10'],
        '11-50': ['11-50'],
        '51-200': ['51-200'],
        '201-500': ['201-500'],
        '501-1000': ['501-1000'],
        '1001-5000': ['1001-5000'],
        '5001+': ['5001+']
      };
      apolloPayload.organization_num_employees_ranges = sizeMap[filters.companySize] || [];
    }

    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(apolloPayload)
    });

    if (!response.ok) {
      console.error('❌ Apollo error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    console.log('✅ Apollo resultados:', data.people?.length || 0);

    return (data.people || []).map((person: any) => ({
      source: 'apollo',
      id: person.id,
      name: person.name,
      firstName: person.first_name,
      lastName: person.last_name,
      email: person.email,
      phone: person.phone_numbers?.[0]?.raw_number || null,
      jobTitle: person.title,
      company: person.organization?.name,
      companyDomain: person.organization?.primary_domain,
      location: person.city ? `${person.city}, ${person.country}` : person.country,
      linkedinUrl: person.linkedin_url,
      photoUrl: person.photo_url,
      seniority: person.seniority,
      departments: person.departments || [],
      score: 0
    }));

  } catch (error: any) {
    console.error('❌ Erro Apollo:', error.message);
    return [];
  }
}

// ======================================
// 🔗 LINKEDIN API (via Proxycurl)
// ======================================
async function searchLinkedIn(filters: any) {
  if (!PROXYCURL_API_KEY) {
    console.log('⚠️ Proxycurl API key não configurada');
    return [];
  }

  try {
    console.log('🔍 Buscando no LinkedIn (Proxycurl):', filters);

    const searchParams = new URLSearchParams();
    
    if (filters.keywords) searchParams.append('keyword_search', filters.keywords);
    if (filters.location) searchParams.append('geo_regions', filters.location);
    if (filters.jobTitle) searchParams.append('current_job_title', filters.jobTitle);
    if (filters.company) searchParams.append('current_company_name', filters.company);
    
    searchParams.append('enrich_profiles', 'enrich');
    searchParams.append('page_size', '25');

    const response = await fetch(
      `https://nubela.co/proxycurl/api/search/person/?${searchParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${PROXYCURL_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      console.error('❌ LinkedIn error:', response.status, await response.text());
      return [];
    }

    const data = await response.json();
    console.log('✅ LinkedIn resultados:', data.results?.length || 0);

    return (data.results || []).map((person: any) => ({
      source: 'linkedin',
      id: person.linkedin_profile_url,
      name: person.full_name,
      firstName: person.first_name,
      lastName: person.last_name,
      email: null,
      phone: null,
      jobTitle: person.occupation,
      company: person.company,
      companyDomain: person.company_domain,
      location: `${person.city || ''}, ${person.country || ''}`.trim(),
      linkedinUrl: person.linkedin_profile_url,
      photoUrl: person.profile_pic_url,
      headline: person.headline,
      summary: person.summary,
      score: 0
    }));

  } catch (error: any) {
    console.error('❌ Erro LinkedIn:', error.message);
    return [];
  }
}

// ======================================
// 🤖 ALGORITMO DE SCORING INTELIGENTE
// ======================================
function calculateLeadScore(lead: any, filters: any): number {
  let score = 0;

  if (filters.keywords) {
    const keywords = filters.keywords.toLowerCase().split(' ');
    const searchableText = [
      lead.name,
      lead.jobTitle,
      lead.company,
      lead.headline,
      lead.summary
    ].join(' ').toLowerCase();

    keywords.forEach((keyword: string) => {
      if (searchableText.includes(keyword)) score += 5;
    });
    score = Math.min(score, 20);
  }

  if (filters.jobTitle && lead.jobTitle) {
    if (lead.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())) {
      score += 25;
    }
  }

  if (filters.location && lead.location) {
    if (lead.location.toLowerCase().includes(filters.location.toLowerCase())) {
      score += 20;
    }
  }

  if (filters.company && lead.company) {
    if (lead.company.toLowerCase().includes(filters.company.toLowerCase())) {
      score += 15;
    }
  }

  if (lead.email) score += 10;
  if (lead.phone) score += 10;

  if (lead.seniority && ['VP', 'Director', 'Manager', 'Head'].some(s => 
    lead.seniority.includes(s) || (lead.jobTitle || '').includes(s)
  )) {
    score += 10;
  }

  return Math.min(score, 100);
}

// ======================================
// 🔀 MERGE INTELIGENTE DE RESULTADOS
// ======================================
function mergeAndRankLeads(apolloLeads: any[], linkedinLeads: any[], filters: any) {
  console.log('🔀 Mesclando resultados:', {
    apollo: apolloLeads.length,
    linkedin: linkedinLeads.length
  });

  const leadsMap = new Map();

  apolloLeads.forEach(lead => {
    lead.score = calculateLeadScore(lead, filters);
    const key = normalizeKey(lead.name, lead.company);
    leadsMap.set(key, lead);
  });

  linkedinLeads.forEach(lead => {
    lead.score = calculateLeadScore(lead, filters);
    const key = normalizeKey(lead.name, lead.company);
    
    if (leadsMap.has(key)) {
      const existing = leadsMap.get(key);
      leadsMap.set(key, {
        ...existing,
        ...lead,
        email: existing.email || lead.email,
        phone: existing.phone || lead.phone,
        linkedinUrl: existing.linkedinUrl || lead.linkedinUrl,
        photoUrl: existing.photoUrl || lead.photoUrl,
        source: 'both',
        score: Math.max(existing.score, lead.score) + 10
      });
    } else {
      leadsMap.set(key, lead);
    }
  });

  const mergedLeads = Array.from(leadsMap.values())
    .sort((a, b) => b.score - a.score);

  console.log('✅ Leads mesclados:', mergedLeads.length);
  return mergedLeads;
}

function normalizeKey(name: string, company: string): string {
  const normName = (name || '').toLowerCase().trim().replace(/[^a-z]/g, '');
  const normCompany = (company || '').toLowerCase().trim().replace(/[^a-z]/g, '');
  return `${normName}_${normCompany}`;
}

// ======================================
// 🎯 ROTAS PRINCIPAIS (EXISTENTES)
// ======================================

app.get("/make-server-9e4b8b7c/health", (c) => {
  console.log('✅ Health check called');
  return c.json({
    status: "ok",
    version: "3.0.0-full",
    timestamp: new Date().toISOString(),
    message: "ImobHunter Backend Online - Full Version with Real APIs!",
    apis: {
      apollo: !!APOLLO_API_KEY,
      proxycurl: !!PROXYCURL_API_KEY
    }
  });
});

app.get("/make-server-9e4b8b7c/ping", (c) => {
  console.log('✅ Ping called');
  return c.json({
    status: "alive",
    version: "3.0.0-full",
    timestamp: new Date().toISOString()
  });
});

app.post("/make-server-9e4b8b7c/advanced-search", async (c) => {
  console.log('🔍 Advanced search called');
  
  try {
    const body = await c.req.json();
    const { searchType, filters } = body;
    
    console.log('📥 Request:', { searchType, filters });

    if (!APOLLO_API_KEY && !PROXYCURL_API_KEY) {
      return c.json({
        success: false,
        error: 'Nenhuma API key configurada. Configure APOLLO_API_KEY ou PROXYCURL_API_KEY.',
        results: [],
        metadata: {
          searchType,
          filters,
          sources: { apollo: 0, linkedin: 0, merged: 0 },
          timestamp: new Date().toISOString()
        }
      });
    }

    const [apolloLeads, linkedinLeads] = await Promise.all([
      searchApollo(filters),
      searchLinkedIn(filters)
    ]);

    const mergedLeads = mergeAndRankLeads(apolloLeads, linkedinLeads, filters);

    console.log('✅ Busca concluída:', {
      apollo: apolloLeads.length,
      linkedin: linkedinLeads.length,
      merged: mergedLeads.length
    });

    return c.json({
      success: true,
      results: mergedLeads,
      metadata: {
        searchType,
        filters,
        sources: {
          apollo: apolloLeads.length,
          linkedin: linkedinLeads.length,
          merged: mergedLeads.length
        },
        timestamp: new Date().toISOString(),
        message: `Encontrados ${mergedLeads.length} leads de ${apolloLeads.length + linkedinLeads.length} resultados totais`
      }
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    return c.json({
      success: false,
      error: error.message,
      results: [],
      metadata: {
        timestamp: new Date().toISOString()
      }
    }, 500);
  }
});

// ======================================
// 🆕 ROTAS DE PROXY (NOVAS - PARA O FRONTEND)
// ======================================

// Status endpoint para verificar se APIs estão configuradas
app.get('/make-server-9e4b8b7c/api-proxy/status', (c) => {
  console.log('✅ Status check called');
  return c.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    apis: {
      apollo: {
        configured: !!APOLLO_API_KEY,
        endpoint: '/make-server-9e4b8b7c/api-proxy/apollo/search',
      },
      proxycurl: {
        configured: !!PROXYCURL_API_KEY,
        endpoints: {
          search: '/make-server-9e4b8b7c/api-proxy/proxycurl/search',
          profile: '/make-server-9e4b8b7c/api-proxy/proxycurl/profile',
        },
      },
    },
    message: (APOLLO_API_KEY && PROXYCURL_API_KEY) 
      ? '✅ Todas as APIs configuradas' 
      : '⚠️ Configure as API keys nas environment variables',
  });
});

// Proxy para Apollo.io
app.post('/make-server-9e4b8b7c/api-proxy/apollo/search', async (c) => {
  if (!APOLLO_API_KEY) {
    return c.json({ success: false, error: 'Apollo API key not configured' }, 500);
  }

  try {
    const body = await c.req.json();
    console.log('📤 Apollo Proxy Request:', JSON.stringify(body, null, 2));

    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'x-api-key': APOLLO_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('📥 Apollo Proxy Response:', response.status, JSON.stringify(data).slice(0, 200));

    if (!response.ok) {
      return c.json({ success: false, error: data, status: response.status }, response.status);
    }

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Apollo Proxy Error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Proxy para Proxycurl - Search
app.get('/make-server-9e4b8b7c/api-proxy/proxycurl/search', async (c) => {
  if (!PROXYCURL_API_KEY) {
    return c.json({ success: false, error: 'Proxycurl API key not configured' }, 500);
  }

  try {
    const queryParams = c.req.query();
    const searchParams = new URLSearchParams(queryParams);
    
    console.log('📤 Proxycurl Search Proxy:', searchParams.toString());

    const response = await fetch(`https://nubela.co/proxycurl/api/search/person?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PROXYCURL_API_KEY}`,
      },
    });

    const data = await response.json();
    console.log('📥 Proxycurl Search Response:', response.status, JSON.stringify(data).slice(0, 200));

    if (!response.ok) {
      return c.json({ success: false, error: data, status: response.status }, response.status);
    }

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Proxycurl Search Proxy Error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Proxy para Proxycurl - Profile
app.get('/make-server-9e4b8b7c/api-proxy/proxycurl/profile', async (c) => {
  if (!PROXYCURL_API_KEY) {
    return c.json({ success: false, error: 'Proxycurl API key not configured' }, 500);
  }

  try {
    const queryParams = c.req.query();
    const searchParams = new URLSearchParams(queryParams);
    
    console.log('📤 Proxycurl Profile Proxy:', searchParams.toString());

    const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PROXYCURL_API_KEY}`,
      },
    });

    const data = await response.json();
    console.log('📥 Proxycurl Profile Response:', response.status, JSON.stringify(data).slice(0, 200));

    if (!response.ok) {
      return c.json({ success: false, error: data, status: response.status }, response.status);
    }

    return c.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Proxycurl Profile Proxy Error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Root endpoint
app.get('/make-server-9e4b8b7c', (c) => {
  return c.json({
    message: 'ImobHunter API Proxy Server',
    version: '3.1.0-full-with-proxy',
    endpoints: {
      health: 'GET /make-server-9e4b8b7c/health',
      ping: 'GET /make-server-9e4b8b7c/ping',
      advancedSearch: 'POST /make-server-9e4b8b7c/advanced-search',
      status: 'GET /make-server-9e4b8b7c/api-proxy/status',
      apollo: 'POST /make-server-9e4b8b7c/api-proxy/apollo/search',
      proxycurl_search: 'GET /make-server-9e4b8b7c/api-proxy/proxycurl/search',
      proxycurl_profile: 'GET /make-server-9e4b8b7c/api-proxy/proxycurl/profile',
    },
  });
});

console.log('✅ Servidor COMPLETO pronto com Apollo + LinkedIn + Proxies!');
console.log('🔑 Apollo API:', APOLLO_API_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('🔑 Proxycurl API:', PROXYCURL_API_KEY ? '✅ Configurada' : '❌ Não configurada');

Deno.serve(app.fetch);
