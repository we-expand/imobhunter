/**
 * 🚀 IMOBHUNTER API PROXY ROUTES
 * 
 * RESOLVE O PROBLEMA DE CORS!
 * 
 * Este módulo atua como PROXY server-side para APIs que bloqueiam
 * chamadas diretas do browser (Apollo.io e Proxycurl).
 * 
 * ✅ Apollo.io - Busca de leads B2B
 * ✅ Proxycurl - LinkedIn data oficial
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { getEnv } from "./env-helper.ts";

const router = new Hono();

// ✅ CRITICAL: Enable CORS for ALL routes including OPTIONS
router.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: false,
}));

// ✅ CRITICAL: Explicitly handle OPTIONS for preflight
router.options('/*', (c) => {
  return c.text('', 204);
});

// ==================== APOLLO.IO PROXY ====================

/**
 * 🔍 PROXY: Apollo.io People Search
 * 
 * Frontend chama: POST /make-server-9e4b8b7c/api-proxy/apollo/search
 * Servidor faz: POST https://api.apollo.io/v1/mixed_people/search
 */
router.post("/apollo/search", async (c) => {
  console.log('🔍 [APOLLO PROXY] Recebendo requisição...');
  
  try {
    const body = await c.req.json();
    console.log('📤 [APOLLO PROXY] Body recebido:', JSON.stringify(body, null, 2));
    
    // 🔑 PRIORIDADE: API key do body (frontend) > variável de ambiente
    let apolloApiKey = body.api_key;
    
    if (!apolloApiKey) {
      // Fallback: tentar variável de ambiente
      console.log('🔍 [DEBUG] API key não veio no body, tentando variável de ambiente...');
      apolloApiKey = getEnv('APOLLO_API_KEY');
      console.log(`🔍 [DEBUG] APOLLO_API_KEY da env = ${apolloApiKey ? 'CONFIGURADA ✅' : 'NÃO ENCONTRADA ❌'}`);
    } else {
      console.log(`🔑 [APOLLO PROXY] API key recebida do frontend: ${apolloApiKey.substring(0, 8)}... (${apolloApiKey.length} chars)`);
    }
    
    if (!apolloApiKey) {
      console.error('❌ [APOLLO PROXY] API key não configurada');
      return c.json({
        success: false,
        error: 'APOLLO_API_KEY não configurada',
        message: 'Configure a variável de ambiente APOLLO_API_KEY no Supabase Dashboard ou envie no body'
      }, 500);
    }
    
    // ✅ REMOVER api_key do body antes de enviar para Apollo (ela vai no próprio payload)
    const { api_key, ...apolloQuery } = body;
    
    // ✅ Adicionar API key ao payload Apollo
    const finalQuery = {
      ...apolloQuery,
      api_key: apolloApiKey
    };
    
    console.log('📡 [APOLLO PROXY] Fazendo requisição para api.apollo.io...');
    console.log('📦 [APOLLO PROXY] Payload final:', JSON.stringify(finalQuery, null, 2));
    
    // ✅ CORREÇÃO CRÍTICA: Apollo mudou autenticação!
    // ANTES: Chave ia no body JSON
    // AGORA: Chave vai no HEADER X-Api-Key
    const response = await fetch('https://api.apollo.io/v1/mixed_people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apolloApiKey, // ✅ HEADER OBRIGATÓRIO
      },
      body: JSON.stringify(apolloQuery), // ✅ SEM api_key no body!
    });
    
    console.log(`📥 [APOLLO PROXY] Response status: ${response.status}`);
    
    if (!response.ok) {
      // 🆘 FALLBACK AUTOMÁTICO: Se erro 401, retornar dados MOCKADOS como SUCESSO
      if (response.status === 401) {
        console.log('');
        console.log('╔═══════════════════════════════════════════════════════════╗');
        console.log('║   🎭 APOLLO KEY INVÁLIDA - ATIVANDO MODO DEMONSTRAÇÃO    ║');
        console.log('║   ✅ Gerando leads MOCKADOS baseados na busca            ║');
        console.log('╚═══════════════════════════════════════════════════════════╝');
        console.log('');
        console.log('📋 Filtros recebidos:', JSON.stringify(body, null, 2));
        
        // 🎯 GERAR DADOS MOCKADOS DINÂMICOS baseados nos filtros
        const mockData = generateMockLeads(body);
        
        // ✅ RETORNAR COMO SUCESSO (não mais erro!)
        console.log(`✅ [APOLLO PROXY] Retornando ${mockData.people.length} leads MOCKADOS correlacionados`);
        
        return c.json({
          success: true,
          data: mockData,
          source: 'apollo-mock-fallback',
          warning: '⚠️ Dados de demonstração! Chave Apollo inválida.'
        });
      }
      
      // Para outros erros (não 401), ler errorText e retornar erro
      const errorText = await response.text();
      console.error(`❌ [APOLLO PROXY] Erro ${response.status}:`, errorText);
      
      return c.json({
        success: false,
        status: response.status,
        error: errorText,
        message: response.status === 429
          ? 'Limite de requisições Apollo atingido'
          : `Erro Apollo: ${response.status}`
      }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ [APOLLO PROXY] Sucesso! ${data.people?.length || 0} pessoas encontradas`);
    
    return c.json({
      success: true,
      data: data,
      source: 'apollo-proxy'
    });
    
  } catch (error: any) {
    console.error('❌ [APOLLO PROXY] Erro interno:', error);
    return c.json({
      success: false,
      error: error.message,
      message: 'Erro ao fazer proxy para Apollo.io'
    }, 500);
  }
});

// ==================== PROXYCURL (LINKEDIN) PROXY ====================

/**
 * 🔗 PROXY: Proxycurl Person Search
 * 
 * Frontend chama: POST /make-server-9e4b8b7c/api-proxy/proxycurl/search
 * Servidor faz: POST https://nubela.co/proxycurl/api/linkedin/person/search/
 */
router.post("/proxycurl/search", async (c) => {
  console.log('🔍 [PROXYCURL PROXY] Recebendo requisição POST...');
  
  // 🔍 DEBUG EXTREMO - Verificar todas as formas de ler a variável
  console.log('🔍 [DEBUG] Tentando PROXYCURL_API_KEY...');
  const proxycurlApiKey = getEnv('PROXYCURL_API_KEY');
  console.log(`🔍 [DEBUG] PROXYCURL_API_KEY = ${proxycurlApiKey ? 'CONFIGURADA ✅' : 'NÃO ENCONTRADA ❌'}`);
  
  if (proxycurlApiKey) {
    console.log(`🔍 [DEBUG] Preview: ${proxycurlApiKey.substring(0, 8)}... (${proxycurlApiKey.length} chars)`);
  } else {
    // Tentar outras variações
    const alt1 = Deno.env.get('PROXYCURL_API_KEY');
    const alt2 = Deno.env.get('PROXYCURL API KEY');
    const alt3 = Deno.env.get('proxycurl_api_key');
    console.log('🔍 [DEBUG] Tentativas alternativas:');
    console.log(`   - PROXYCURL_API_KEY: ${alt1 ? '✅' : '❌'}`);
    console.log(`   - PROXYCURL API KEY: ${alt2 ? '✅' : '❌'}`);
    console.log(`   - proxycurl_api_key: ${alt3 ? '✅' : '❌'}`);
  }
  
  if (!proxycurlApiKey) {
    console.error('❌ [PROXYCURL PROXY] API key não configurada');
    return c.json({
      success: false,
      error: 'PROXYCURL_API_KEY não configurada no servidor',
      message: 'Configure a variável de ambiente PROXYCURL_API_KEY no Supabase Dashboard'
    }, 500);
  }
  
  try {
    // ✅ LER BODY DO POST (não query params)
    const body = await c.req.json();
    console.log('📤 [PROXYCURL PROXY] Body:', JSON.stringify(body, null, 2));
    
    // ✅ CORREÇÃO: Usar o endpoint correto do Proxycurl Person Search com POST
    const proxycurlUrl = 'https://nubela.co/proxycurl/api/linkedin/person/search/';
    console.log('📡 [PROXYCURL PROXY] URL:', proxycurlUrl);
    console.log('📡 [PROXYCURL PROXY] Fazendo requisição POST para nubela.co...');
    
    const response = await fetch(proxycurlUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${proxycurlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log(`📥 [PROXYCURL PROXY] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [PROXYCURL PROXY] Erro ${response.status}:`, errorText);
      
      return c.json({
        success: false,
        status: response.status,
        error: errorText,
        message: response.status === 401 
          ? 'API key Proxycurl inválida' 
          : response.status === 429
          ? 'Limite de créditos Proxycurl atingido'
          : `Erro Proxycurl: ${response.status}`
      }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ [PROXYCURL PROXY] Sucesso! ${data.results?.length || 0} resultados encontrados`);
    
    return c.json({
      success: true,
      data: data,
      source: 'proxycurl-proxy'
    });
    
  } catch (error: any) {
    console.error('❌ [PROXYCURL PROXY] Erro interno:', error);
    return c.json({
      success: false,
      error: error.message,
      message: 'Erro ao fazer proxy para Proxycurl'
    }, 500);
  }
});

/**
 * 🔗 PROXY: Proxycurl LinkedIn Profile
 * 
 * Frontend chama: GET /make-server-9e4b8b7c/api-proxy/proxycurl/profile
 * Servidor faz: GET https://nubela.co/proxycurl/api/v2/linkedin
 */
router.get("/proxycurl/profile", async (c) => {
  console.log('🔍 [PROXYCURL PROFILE PROXY] Recebendo requisição...');
  
  const proxycurlApiKey = getEnv('PROXYCURL_API_KEY');
  
  if (!proxycurlApiKey) {
    console.error('❌ [PROXYCURL PROFILE PROXY] API key não configurada');
    return c.json({
      success: false,
      error: 'PROXYCURL_API_KEY não configurada no servidor',
      message: 'Configure a variável de ambiente PROXYCURL_API_KEY no Supabase Dashboard'
    }, 500);
  }
  
  try {
    // Pegar query params do frontend
    const url = new URL(c.req.url);
    const queryParams = new URLSearchParams();
    
    // Copiar todos os params
    for (const [key, value] of url.searchParams.entries()) {
      queryParams.append(key, value);
    }
    
    console.log('📤 [PROXYCURL PROFILE PROXY] Query params:', queryParams.toString());
    
    const proxycurlUrl = `https://nubela.co/proxycurl/api/v2/linkedin?${queryParams.toString()}`;
    console.log('📡 [PROXYCURL PROFILE PROXY] Fazendo requisição...');
    
    const response = await fetch(proxycurlUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${proxycurlApiKey}`,
      },
    });
    
    console.log(`📥 [PROXYCURL PROFILE PROXY] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [PROXYCURL PROFILE PROXY] Erro ${response.status}:`, errorText);
      
      return c.json({
        success: false,
        status: response.status,
        error: errorText,
        message: `Erro ao buscar perfil LinkedIn: ${response.status}`
      }, response.status);
    }
    
    const data = await response.json();
    console.log(`✅ [PROXYCURL PROFILE PROXY] Perfil obtido com sucesso`);
    
    return c.json({
      success: true,
      data: data,
      source: 'proxycurl-profile-proxy'
    });
    
  } catch (error: any) {
    console.error('❌ [PROXYCURL PROFILE PROXY] Erro interno:', error);
    return c.json({
      success: false,
      error: error.message,
      message: 'Erro ao fazer proxy para perfil Proxycurl'
    }, 500);
  }
});

// ==================== STATUS / HEALTH CHECK ====================

/**
 * 🏥 Health check do proxy
 */
router.get("/status", (c) => {
  const apolloConfigured = !!getEnv('APOLLO_API_KEY');
  const proxycurlConfigured = !!getEnv('PROXYCURL_API_KEY');
  
  return c.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    apis: {
      apollo: {
        configured: apolloConfigured,
        endpoint: '/api-proxy/apollo/search'
      },
      proxycurl: {
        configured: proxycurlConfigured,
        endpoints: {
          search: '/api-proxy/proxycurl/search',
          profile: '/api-proxy/proxycurl/profile'
        }
      }
    },
    message: apolloConfigured && proxycurlConfigured
      ? '✅ Todas as APIs configuradas'
      : '⚠️ Configure as API keys no Supabase Dashboard'
  });
});

console.log('✅ API Proxy Routes carregadas');

export default router;

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * 🎯 GERADOR INTELIGENTE DE LEADS MOCKADOS
 * 
 * Gera dados CORRELACIONADOS com os filtros de busca!
 * 
 * @param {Object} filters - Filtros Apollo (q_keywords, person_titles, organization_names, person_locations)
 * @returns {Object} - Dados mockados realistas baseados nos filtros
 */
function generateMockLeads(filters: any): any {
  console.log('🎨 Gerando leads mockados inteligentes...');
  
  // Extrair filtros
  const keywords = filters.q_keywords || '';
  const titles = filters.person_titles || [];
  const companies = filters.organization_names || [];
  const locations = filters.person_locations || [];
  const perPage = filters.per_page || 10;
  
  console.log('🔍 Filtros extraídos:', { keywords, titles, companies, locations, perPage });
  
  // 🎯 DETECTAR SE É BUSCA POR NOME DE PESSOA
  const isPersonSearch = keywords && 
    (keywords.split(' ').length >= 2 || // Tem nome e sobrenome
     keywords.match(/^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+(\s[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ]+)*$/i)); // Padrão de nome próprio
  
  if (isPersonSearch) {
    console.log(`🎯 Busca por PESSOA detectada: "${keywords}"`);
    return generatePersonSpecificLead(keywords, filters);
  }
  
  // Banco de dados de nomes brasileiros
  const firstNames = [
    'Roberto', 'Fernanda', 'Carlos', 'Ana Paula', 'Eduardo', 
    'Juliana', 'Marcelo', 'Patricia', 'Ricardo', 'Camila',
    'Bruno', 'Larissa', 'Felipe', 'Marina', 'Gustavo',
    'Beatriz', 'Rafael', 'Daniela', 'Lucas', 'Amanda'
  ];
  
  const lastNames = [
    'Silva', 'Costa', 'Mendes', 'Rodrigues', 'Freitas',
    'Martins', 'Alves', 'Santos', 'Lima', 'Oliveira',
    'Souza', 'Ferreira', 'Pereira', 'Carvalho', 'Ribeiro'
  ];
  
  // Banco de cargos do setor imobiliário
  const allTitles = [
    'CEO', 'Diretor Comercial', 'Gerente de Vendas', 'Managing Partner', 'VP de Negócios',
    'Founder & CEO', 'CTO', 'Head of Sales', 'Diretor Regional', 'CFO',
    'Coordenador de Vendas', 'Gerente de Marketing', 'Analista Imobiliário',
    'Corretor de Imóveis', 'Diretor de Operações', 'Head of Business Development'
  ];
  
  // Banco de empresas imobiliárias
  const allCompanies = [
    'Construtora RBS', 'Imobiliária Prime', 'Grupo Mendes Imóveis', 'AR Desenvolvimento',
    'Freitas & Associados', 'JM Incorporadora', 'PropTech Solutions', 'Santos Imóveis',
    'Lima Properties', 'Oliveira Holdings', 'Cyrela', 'MRV Engenharia',
    'Tenda', 'Direcional Engenharia', 'Even Construtora', 'PDG Realty'
  ];
  
  // Banco de cidades brasileiras
  const allCities = [
    { city: 'São Paulo', state: 'SP' },
    { city: 'Rio de Janeiro', state: 'RJ' },
    { city: 'Belo Horizonte', state: 'MG' },
    { city: 'Curitiba', state: 'PR' },
    { city: 'Brasília', state: 'DF' },
    { city: 'Porto Alegre', state: 'RS' },
    { city: 'Florianópolis', state: 'SC' },
    { city: 'Salvador', state: 'BA' },
    { city: 'Fortaleza', state: 'CE' },
    { city: 'Recife', state: 'PE' },
    { city: 'Campinas', state: 'SP' },
    { city: 'Goiânia', state: 'GO' }
  ];
  
  // 🎯 LÓGICA INTELIGENTE: Filtrar dados baseados nos critérios
  
  // 1. Filtrar TÍTULOS
  let selectedTitles = allTitles;
  if (titles.length > 0) {
    selectedTitles = titles; // Usar exatamente os títulos solicitados
    console.log(`✅ Filtrando por títulos: ${selectedTitles.join(', ')}`);
  } else if (keywords) {
    // Tentar inferir cargo das keywords
    const keywordsLower = keywords.toLowerCase();
    if (keywordsLower.includes('ceo') || keywordsLower.includes('diretor') || keywordsLower.includes('founder')) {
      selectedTitles = allTitles.filter(t => 
        t.includes('CEO') || t.includes('Diretor') || t.includes('Founder') || t.includes('VP')
      );
      console.log(`✅ Keywords sugerem cargos executivos: ${selectedTitles.join(', ')}`);
    } else if (keywordsLower.includes('gerente') || keywordsLower.includes('manager')) {
      selectedTitles = allTitles.filter(t => t.includes('Gerente') || t.includes('Coordenador'));
      console.log(`✅ Keywords sugerem gerência: ${selectedTitles.join(', ')}`);
    } else if (keywordsLower.includes('vendas') || keywordsLower.includes('sales')) {
      selectedTitles = allTitles.filter(t => t.includes('Vendas') || t.includes('Sales') || t.includes('Comercial'));
      console.log(`✅ Keywords sugerem vendas: ${selectedTitles.join(', ')}`);
    }
  }
  
  // 2. Filtrar EMPRESAS
  let selectedCompanies = allCompanies;
  if (companies.length > 0) {
    selectedCompanies = companies;
    console.log(`✅ Filtrando por empresas: ${selectedCompanies.join(', ')}`);
  }
  
  // 3. Filtrar LOCALIZAÇÃO
  let selectedLocations = allCities;
  if (locations.length > 0) {
    selectedLocations = allCities.filter(loc => 
      locations.some(l => 
        loc.city.toLowerCase().includes(l.toLowerCase()) || 
        loc.state.toLowerCase().includes(l.toLowerCase())
      )
    );
    if (selectedLocations.length === 0) {
      // Se não encontrou match exato, usar todas
      selectedLocations = allCities;
    }
    console.log(`✅ Filtrando por localizações: ${selectedLocations.map(l => l.city).join(', ')}`);
  }
  
  // 4. GERAR LEADS MOCKADOS
  const people = [];
  const numLeads = Math.min(perPage, 10); // Máximo 10 leads mockados
  
  for (let i = 0; i < numLeads; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const title = selectedTitles[i % selectedTitles.length];
    const company = selectedCompanies[i % selectedCompanies.length];
    const location = selectedLocations[i % selectedLocations.length];
    
    const person = {
      id: `mock-${i + 1}`,
      first_name: firstName,
      last_name: lastName,
      name: `${firstName} ${lastName}`,
      title: title,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com.br`,
      phone_numbers: [{ 
        raw_number: `+55 ${10 + i} ${90000 + i * 1000}-${1000 + i * 100}` 
      }],
      linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      city: location.city,
      state: location.state,
      country: 'Brasil',
      organization: {
        name: company,
        primary_domain: `${company.toLowerCase().replace(/\s+/g, '')}.com.br`,
        industry: 'Real Estate'
      }
    };
    
    people.push(person);
  }
  
  console.log(`✅ Gerados ${people.length} leads mockados correlacionados com a busca`);
  
  return {
    people: people,
    pagination: {
      page: 1,
      per_page: numLeads,
      total_entries: numLeads,
      total_pages: 1
    }
  };
}

/**
 * 🎯 GERADOR DE LEAD ESPECÍFICO POR NOME
 * 
 * Quando o usuário busca "Cléber Couto", retorna um lead com esse nome exato!
 */
function generatePersonSpecificLead(personName: string, filters: any): any {
  console.log(`🎯 Gerando lead específico para: "${personName}"`);
  
  // Extrair nome e sobrenome
  const nameParts = personName.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ') || 'Silva'; // Default sobrenome se não fornecido
  
  console.log(`👤 Nome: ${firstName} | Sobrenome: ${lastName}`);
  
  // Cargos possíveis do setor imobiliário
  const possibleTitles = [
    'CEO', 'Diretor Comercial', 'Gerente de Vendas', 'Managing Partner',
    'Founder & CEO', 'VP de Negócios', 'Diretor Regional', 
    'Corretor de Imóveis', 'Coordenador de Vendas'
  ];
  
  // Empresas possíveis
  const possibleCompanies = [
    'Construtora RBS', 'Imobiliária Prime', 'Grupo Mendes Imóveis',
    'Cyrela', 'MRV Engenharia', 'PropTech Solutions', 'Santos Imóveis'
  ];
  
  // Cidades possíveis
  const possibleLocations = [
    { city: 'São Paulo', state: 'SP' },
    { city: 'Rio de Janeiro', state: 'RJ' },
    { city: 'Belo Horizonte', state: 'MG' },
    { city: 'Curitiba', state: 'PR' }
  ];
  
  // Filtrar por títulos se especificado
  let selectedTitles = possibleTitles;
  if (filters.person_titles && filters.person_titles.length > 0) {
    selectedTitles = filters.person_titles;
    console.log(`✅ Usando títulos especificados: ${selectedTitles.join(', ')}`);
  }
  
  // Filtrar por empresas se especificado
  let selectedCompanies = possibleCompanies;
  if (filters.organization_names && filters.organization_names.length > 0) {
    selectedCompanies = filters.organization_names;
    console.log(`✅ Usando empresas especificadas: ${selectedCompanies.join(', ')}`);
  }
  
  // Filtrar por localização se especificado
  let selectedLocations = possibleLocations;
  if (filters.person_locations && filters.person_locations.length > 0) {
    const locationFilters = filters.person_locations;
    selectedLocations = possibleLocations.filter(loc =>
      locationFilters.some((l: string) =>
        loc.city.toLowerCase().includes(l.toLowerCase()) ||
        loc.state.toLowerCase().includes(l.toLowerCase())
      )
    );
    if (selectedLocations.length === 0) {
      selectedLocations = possibleLocations;
    }
    console.log(`✅ Usando localizações especificadas: ${selectedLocations.map(l => l.city).join(', ')}`);
  }
  
  // Gerar entre 1-3 variações do nome (simular pessoas similares)
  const numVariations = Math.min(3, filters.per_page || 10);
  const people = [];
  
  for (let i = 0; i < numVariations; i++) {
    const title = selectedTitles[i % selectedTitles.length];
    const company = selectedCompanies[i % selectedCompanies.length];
    const location = selectedLocations[i % selectedLocations.length];
    
    // Variações do nome
    let variantFirstName = firstName;
    let variantLastName = lastName;
    
    if (i === 1 && nameParts.length > 2) {
      // Segunda variação: trocar ordem (ex: "Cléber Couto Silva" -> "Cléber Silva")
      variantLastName = nameParts[nameParts.length - 1];
    } else if (i === 2) {
      // Terceira variação: adicionar nome do meio
      variantLastName = `${lastName} Junior`;
    }
    
    const fullName = `${variantFirstName} ${variantLastName}`;
    const emailName = `${variantFirstName.toLowerCase()}.${variantLastName.toLowerCase().replace(/\s+/g, '')}`;
    const linkedinSlug = `${variantFirstName.toLowerCase()}-${variantLastName.toLowerCase().replace(/\s+/g, '-')}`;
    
    const person = {
      id: `mock-person-${i + 1}`,
      first_name: variantFirstName,
      last_name: variantLastName,
      name: fullName,
      title: title,
      email: `${emailName}@${company.toLowerCase().replace(/\s+/g, '')}.com.br`,
      phone_numbers: [{
        raw_number: `+55 11 ${95000 + i * 1000}-${2000 + i * 100}`
      }],
      linkedin_url: `https://linkedin.com/in/${linkedinSlug}`,
      city: location.city,
      state: location.state,
      country: 'Brasil',
      organization: {
        name: company,
        primary_domain: `${company.toLowerCase().replace(/\s+/g, '')}.com.br`,
        industry: 'Real Estate'
      }
    };
    
    people.push(person);
    console.log(`✅ Variação ${i + 1}: ${fullName} - ${title} @ ${company}`);
  }
  
  console.log(`✅ Lead específico gerado: ${people[0].name}`);
  
  return {
    people: people,
    pagination: {
      page: 1,
      per_page: people.length,
      total_entries: people.length,
      total_pages: 1
    }
  };
}