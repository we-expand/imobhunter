// @ts-nocheck
console.log('🚀 IMOBHUNTER SERVER V2 STARTING - FULL VERSION...');

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// Middleware
app.use('*', logger(console.log));

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

    if (filters.location) apolloPayload.person_locations = [filters.location];
    if (filters.jobTitle) apolloPayload.person_titles = [filters.jobTitle];
    if (filters.company) apolloPayload.q_organization_name = filters.company;
    if (filters.industry) apolloPayload.organization_industry_tag_ids = [filters.industry];
    if (filters.companySize) {
      const sizeMap: any = {
        '1-10': ['1-10'], '11-50': ['11-50'], '51-200': ['51-200'],
        '201-500': ['201-500'], '501-1000': ['501-1000'],
        '1001-5000': ['1001-5000'], '5001+': ['5001+']
      };
      apolloPayload.organization_num_employees_ranges = sizeMap[filters.companySize] || [];
    }

    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
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
      { headers: { 'Authorization': `Bearer ${PROXYCURL_API_KEY}` } }
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
// 🤖 SCORING & MERGE
// ======================================
function calculateLeadScore(lead: any, filters: any): number {
  let score = 0;
  if (filters.keywords) {
    const keywords = filters.keywords.toLowerCase().split(' ');
    const searchableText = [lead.name, lead.jobTitle, lead.company, lead.headline, lead.summary].join(' ').toLowerCase();
    keywords.forEach((keyword: string) => { if (searchableText.includes(keyword)) score += 5; });
    score = Math.min(score, 20);
  }
  if (filters.jobTitle && lead.jobTitle && lead.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())) score += 25;
  if (filters.location && lead.location && lead.location.toLowerCase().includes(filters.location.toLowerCase())) score += 20;
  if (filters.company && lead.company && lead.company.toLowerCase().includes(filters.company.toLowerCase())) score += 15;
  if (lead.email) score += 10;
  if (lead.phone) score += 10;
  if (lead.seniority && ['VP', 'Director', 'Manager', 'Head'].some(s => lead.seniority.includes(s) || (lead.jobTitle || '').includes(s))) score += 10;
  return Math.min(score, 100);
}

function mergeAndRankLeads(apolloLeads: any[], linkedinLeads: any[], filters: any) {
  const leadsMap = new Map();
  const normalizeKey = (name: string, company: string) => {
    const normName = (name || '').toLowerCase().trim().replace(/[^a-z]/g, '');
    const normCompany = (company || '').toLowerCase().trim().replace(/[^a-z]/g, '');
    return `${normName}_${normCompany}`;
  };

  apolloLeads.forEach(lead => {
    lead.score = calculateLeadScore(lead, filters);
    leadsMap.set(normalizeKey(lead.name, lead.company), lead);
  });

  linkedinLeads.forEach(lead => {
    lead.score = calculateLeadScore(lead, filters);
    const key = normalizeKey(lead.name, lead.company);
    if (leadsMap.has(key)) {
      const existing = leadsMap.get(key);
      leadsMap.set(key, {
        ...existing, ...lead,
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

  return Array.from(leadsMap.values()).sort((a, b) => b.score - a.score);
}

// ======================================
// 🎯 ROTAS (Adaptadas para make-server-v2)
// ======================================

// O prefixo da função é /make-server-v2
const BASE_PATH = "/make-server-v2";

app.get(`${BASE_PATH}/health`, (c) => {
  return c.json({
    status: "ok",
    version: "3.0.0-full-v2",
    timestamp: new Date().toISOString(),
    message: "ImobHunter Backend V2 Online - Full Version!",
    apis: { apollo: !!APOLLO_API_KEY, proxycurl: !!PROXYCURL_API_KEY }
  });
});

app.get(`${BASE_PATH}/ping`, (c) => {
  return c.json({
    status: "alive",
    version: "3.0.0-full-v2", // Updated version
    message: "Server is online (V2 Stable)",
    timestamp: new Date().toISOString()
  });
});

app.post(`${BASE_PATH}/advanced-search`, async (c) => {
  try {
    const body = await c.req.json();
    const { searchType, filters } = body;
    console.log('📥 Request (V2):', { searchType, filters });

    if (!APOLLO_API_KEY && !PROXYCURL_API_KEY) {
      return c.json({
        success: false,
        error: 'Nenhuma API key configurada (V2).',
        results: [],
        metadata: { timestamp: new Date().toISOString() }
      });
    }

    const [apolloLeads, linkedinLeads] = await Promise.all([
      searchApollo(filters),
      searchLinkedIn(filters)
    ]);

    const mergedLeads = mergeAndRankLeads(apolloLeads, linkedinLeads, filters);

    return c.json({
      success: true,
      results: mergedLeads,
      metadata: {
        searchType, filters,
        sources: { apollo: apolloLeads.length, linkedin: linkedinLeads.length, merged: mergedLeads.length },
        timestamp: new Date().toISOString(),
        message: `V2: Encontrados ${mergedLeads.length} leads`
      }
    });
  } catch (error: any) {
    console.error('❌ Error V2:', error);
    return c.json({ success: false, error: error.message, results: [] }, 500);
  }
});

// Fallback para qualquer outra rota (ajuda no debug)
app.all('*', (c) => {
  return c.json({
    status: "not_found",
    path: c.req.path,
    message: "Route not found in make-server-v2",
    available_routes: [`${BASE_PATH}/ping`, `${BASE_PATH}/health`, `${BASE_PATH}/advanced-search`]
  }, 404);
});

console.log('🚀 Server V2 ready to serve!');
Deno.serve(app.fetch);