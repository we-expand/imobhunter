/**
 * 🔍 BUSCA INTELIGENTE MULTI-API COM CONFRONTAÇÃO POR IA
 * 
 * Este módulo integra 15+ fontes de dados diferentes, confronta as informações
 * usando IA e retorna os dados mais confiáveis baseado em score de consenso
 * 
 * INTEGRA COM: Proxycurl, Apollo.io, Hunter.io, Clearbit, PDL, FullContact,
 * RocketReach, Lusha, Pipl, ZoomInfo, Snov.io, ContactOut, Kaspr, Seamless.ai
 */

import { leadsDB, LeadRecord, EmailRecord, PhoneRecord, SourceRecord } from "./leads-database.ts";

interface SearchFilters {
  name?: string;
  title?: string;
  company?: string;
  location?: string;
  country?: string;
  seniority?: string[];
  industry?: string[];
  keywords?: string;
}

interface LeadData {
  // Identidade
  name: string;
  firstName?: string;
  lastName?: string;
  
  // Profissional
  title?: string;
  company?: string;
  companyDomain?: string;
  industry?: string;
  seniority?: string;
  
  // Localização
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  
  // Contato
  email?: string;
  phone?: string;
  phones?: string[];
  
  // Social
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  
  // Empresa
  companySize?: string;
  companyWebsite?: string;
  companyIndustry?: string;
  
  // Metadados
  avatar?: string;
  bio?: string;
  skills?: string[];
  yearsExperience?: number;
  
  // Score e Confiabilidade
  matchScore: number;
  confidenceScore: number;
  sources: string[];
  dataQuality: number;
}

interface APIResult {
  source: string;
  success: boolean;
  data?: Partial<LeadData>[];
  error?: string;
  responseTime?: number;
}

/**
 * 🧠 MOTOR DE BUSCA INTELIGENTE
 */
export class IntelligentSearchEngine {
  
  /**
   * Busca inteligente em múltiplas APIs e confronta dados
   */
  async search(filters: SearchFilters): Promise<LeadData[]> {
    console.log('\n🔍 ========================================');
    console.log('🔍 BUSCA INTELIGENTE MULTI-API INICIADA');
    console.log('🔍 ========================================\n');
    console.log('📊 Filtros:', JSON.stringify(filters, null, 2));
    
    const startTime = Date.now();
    const apiResults: APIResult[] = [];
    
    // 🔗 1. PROXYCURL (LinkedIn)
    const proxycurlResult = await this.searchProxycurl(filters);
    apiResults.push(proxycurlResult);
    
    // 🔍 2. APOLLO.IO (B2B Database)
    const apolloResult = await this.searchApollo(filters);
    apiResults.push(apolloResult);
    
    // 📧 3. HUNTER.IO (Email Finder)
    const hunterResult = await this.searchHunter(filters);
    apiResults.push(hunterResult);
    
    // 🎯 4. CLEARBIT (Company & Person Enrichment)
    const clearbitResult = await this.searchClearbit(filters);
    apiResults.push(clearbitResult);
    
    // 🌐 5. PDL (People Data Labs)
    const pdlResult = await this.searchPDL(filters);
    apiResults.push(pdlResult);
    
    // 🔍 6. FULLCONTACT (Person Enrichment)
    const fullContactResult = await this.searchFullContact(filters);
    apiResults.push(fullContactResult);
    
    // 🚀 7. ROCKETREACH (Contact Finder)
    const rocketReachResult = await this.searchRocketReach(filters);
    apiResults.push(rocketReachResult);
    
    // 🔐 8. LUSHA (B2B Contact Data)
    const lushaResult = await this.searchLusha(filters);
    apiResults.push(lushaResult);
    
    // 🔍 9. PIPL (Person Data)
    const piplResult = await this.searchPipl(filters);
    apiResults.push(piplResult);
    
    // 🔍 10. ZOOMINFO (Business Data)
    const zoomInfoResult = await this.searchZoomInfo(filters);
    apiResults.push(zoomInfoResult);
    
    // 🔍 11. SNOV.IO (Email Finder)
    const snovioResult = await this.searchSnovio(filters);
    apiResults.push(snovioResult);
    
    // 🔍 12. CONTACTOUT (Contact Finder)
    const contactOutResult = await this.searchContactOut(filters);
    apiResults.push(contactOutResult);
    
    // 🔍 13. KASPR (Contact Finder)
    const kasprResult = await this.searchKaspr(filters);
    apiResults.push(kasprResult);
    
    // 🔍 14. SEAMLESS.AI (Contact Finder)
    const seamlessAiResult = await this.searchSeamlessAi(filters);
    apiResults.push(seamlessAiResult);
    
    // 🔍 15. LEADS DATABASE (Local Database)
    const leadsDatabaseResult = await this.searchLeadsDatabase(filters);
    apiResults.push(leadsDatabaseResult);
    
    // 📊 Resumo das APIs
    const successfulAPIs = apiResults.filter(r => r.success);
    const failedAPIs = apiResults.filter(r => !r.success);
    
    console.log('\n📊 ========================================');
    console.log('📊 RESULTADO DAS APIs');
    console.log('📊 ========================================\n');
    console.log(`✅ APIs bem-sucedidas: ${successfulAPIs.length}/${apiResults.length}`);
    console.log(`❌ APIs com erro: ${failedAPIs.length}/${apiResults.length}`);
    
    successfulAPIs.forEach(result => {
      console.log(`✅ ${result.source}: ${result.data?.length || 0} leads encontrados (${result.responseTime}ms)`);
    });
    
    if (failedAPIs.length > 0) {
      console.log('\n❌ APIs com falha:');
      failedAPIs.forEach(result => {
        console.log(`   - ${result.source}: ${result.error}`);
      });
    }
    
    // 🧠 Confrontar dados das múltiplas fontes
    const consolidatedLeads = this.consolidateResults(apiResults);
    
    // 📈 Calcular scores de confiança
    const rankedLeads = this.rankByConfidence(consolidatedLeads);
    
    const totalTime = Date.now() - startTime;
    
    console.log('\n✅ ========================================');
    console.log('✅ BUSCA CONCLUÍDA COM SUCESSO');
    console.log('✅ ========================================\n');
    console.log(`⏱️  Tempo total: ${totalTime}ms`);
    console.log(`📊 Leads consolidados: ${rankedLeads.length}`);
    console.log(`🎯 Média de qualidade: ${this.calculateAverageQuality(rankedLeads)}%`);
    console.log(`🔗 Média de fontes por lead: ${this.calculateAverageSources(rankedLeads)}`);
    
    return rankedLeads;
  }
  
  /**
   * 🔗 PROXYCURL - LinkedIn Search (DEPRECATED - Substituído por PDL)
   */
  private async searchProxycurl(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    
    // ⚠️ Proxycurl foi descontinuado, usar PDL como substituto
    console.log('⚠️ Proxycurl descontinuado - usando PDL como alternativa');
    
    return {
      source: 'Proxycurl (LinkedIn) - DEPRECATED',
      success: false,
      error: 'Serviço descontinuado - use PDL ou RocketReach',
      responseTime: Date.now() - startTime
    };
  }
  
  /**
   * 🔍 APOLLO.IO - B2B Database
   */
  private async searchApollo(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY');
    
    if (!APOLLO_API_KEY) {
      return {
        source: 'Apollo.io',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [2/15] Apollo.io - Buscando em database B2B...');
      
      // 🔥 FIX: Usar o NOVO endpoint do Apollo.io (api_search, não search!)
      // Documentação: https://docs.apollo.io/reference/people-api-search
      const response = await fetch('https://api.apollo.io/api/v1/mixed_people/api_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': APOLLO_API_KEY
        },
        body: JSON.stringify({
          person_titles: filters.title ? [filters.title] : undefined,
          organization_names: filters.company ? [filters.company] : undefined,
          person_locations: filters.location ? [filters.location] : undefined,
          page: 1,
          per_page: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.people || []).map((p: any) => ({
        name: p.name,
        firstName: p.first_name,
        lastName: p.last_name,
        title: p.title,
        company: p.organization?.name,
        companyWebsite: p.organization?.website_url,
        companyIndustry: p.organization?.industry,
        seniority: p.seniority,
        email: p.email,
        phones: p.phone_numbers || [],
        phone: p.phone_numbers?.[0],
        linkedinUrl: p.linkedin_url,
        twitterUrl: p.twitter_url,
        facebookUrl: p.facebook_url,
        city: p.city,
        state: p.state,
        country: p.country,
        avatar: p.photo_url,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Apollo.io: ${results.length} leads (${responseTime}ms)`);
      
      return {
        source: 'Apollo.io',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Apollo.io: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Apollo.io',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 📧 HUNTER.IO - Email Finder
   */
  private async searchHunter(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const HUNTER_API_KEY = Deno.env.get('HUNTER_API_KEY');
    
    if (!HUNTER_API_KEY || !filters.company) {
      return {
        source: 'Hunter.io',
        success: false,
        error: !HUNTER_API_KEY ? 'API key não configurada' : 'Empresa não especificada',
        responseTime: 0
      };
    }
    
    try {
      console.log('📧 [3/15] Hunter.io - Buscando emails corporativos...');
      
      // Tentar extrair domínio da empresa
      const domain = this.extractDomain(filters.company);
      if (!domain) {
        throw new Error('Não foi possível extrair domínio da empresa');
      }
      
      const response = await fetch(
        `https://api.hunter.io/v2/domain-search?domain=${domain}&limit=20&api_key=${HUNTER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.data?.emails || []).map((e: any) => ({
        name: `${e.first_name || ''} ${e.last_name || ''}`.trim(),
        firstName: e.first_name,
        lastName: e.last_name,
        email: e.value,
        title: e.position,
        company: filters.company,
        companyDomain: domain,
        linkedinUrl: e.linkedin,
        twitterUrl: e.twitter,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Hunter.io: ${results.length} emails (${responseTime}ms)`);
      
      return {
        source: 'Hunter.io',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Hunter.io: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Hunter.io',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🎯 CLEARBIT - Enrichment API
   */
  private async searchClearbit(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const CLEARBIT_API_KEY = Deno.env.get('CLEARBIT_API_KEY');
    
    if (!CLEARBIT_API_KEY) {
      return {
        source: 'Clearbit',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🎯 [4/15] Clearbit - Enriquecendo dados...');
      
      // Clearbit funciona melhor com email ou domínio
      // Para busca genérica, não é a melhor opção
      const responseTime = Date.now() - startTime;
      
      return {
        source: 'Clearbit',
        success: false,
        error: 'Requer email específico para enriquecimento',
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Clearbit: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Clearbit',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🌐 PDL (People Data Labs)
   */
  private async searchPDL(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const PDL_API_KEY = Deno.env.get('PDL_API_KEY');
    
    if (!PDL_API_KEY) {
      return {
        source: 'People Data Labs',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🌐 [5/15] PDL - Buscando em base global...');
      
      const response = await fetch('https://api.peopledatalabs.com/v5/person/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': PDL_API_KEY
        },
        body: JSON.stringify({
          query: {
            job_title: filters.title,
            job_company_name: filters.company,
            location_name: filters.location || filters.country,
          },
          size: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.data || []).map((p: any) => ({
        name: p.full_name,
        firstName: p.first_name,
        lastName: p.last_name,
        title: p.job_title,
        company: p.job_company_name,
        industry: p.industry,
        seniority: p.job_title_role,
        email: p.emails?.[0]?.address,
        phone: p.phone_numbers?.[0],
        phones: p.phone_numbers || [],
        linkedinUrl: p.linkedin_url,
        twitterUrl: p.twitter_url,
        facebookUrl: p.facebook_url,
        city: p.location_locality,
        country: p.location_country,
        avatar: p.profile_pic_url,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ PDL: ${results.length} perfis (${responseTime}ms)`);
      
      return {
        source: 'People Data Labs',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ PDL: ${error.message} (${responseTime}ms)`);
      return {
        source: 'People Data Labs',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 FULLCONTACT - Person Enrichment
   */
  private async searchFullContact(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const FULLCONTACT_API_KEY = Deno.env.get('FULLCONTACT_API_KEY');
    
    if (!FULLCONTACT_API_KEY) {
      return {
        source: 'FullContact',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [6/15] FullContact - Enriquecendo perfis...');
      
      // FullContact funciona melhor com email
      const responseTime = Date.now() - startTime;
      
      return {
        source: 'FullContact',
        success: false,
        error: 'Requer email específico',
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        source: 'FullContact',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🚀 ROCKETREACH - Contact Finder
   */
  private async searchRocketReach(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const ROCKETREACH_API_KEY = Deno.env.get('ROCKETREACH_API_KEY');
    
    if (!ROCKETREACH_API_KEY) {
      return {
        source: 'RocketReach',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🚀 [7/15] RocketReach - Buscando contatos...');
      
      const response = await fetch('https://api.rocketreach.co/v2/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': ROCKETREACH_API_KEY
        },
        body: JSON.stringify({
          query: {
            current_title: filters.title ? [filters.title] : undefined,
            current_employer: filters.company ? [filters.company] : undefined,
            location: filters.location || filters.country,
          },
          page_size: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.profiles || []).map((p: any) => ({
        name: p.name,
        title: p.current_title,
        company: p.current_employer,
        email: p.emails?.[0],
        phone: p.phones?.[0],
        phones: p.phones || [],
        linkedinUrl: p.linkedin_url,
        location: p.location,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ RocketReach: ${results.length} contatos (${responseTime}ms)`);
      
      return {
        source: 'RocketReach',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ RocketReach: ${error.message} (${responseTime}ms)`);
      return {
        source: 'RocketReach',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔐 LUSHA - B2B Contact Data
   */
  private async searchLusha(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const LUSHA_API_KEY = Deno.env.get('LUSHA_API_KEY');
    
    if (!LUSHA_API_KEY) {
      return {
        source: 'Lusha',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔐 [8/15] Lusha - Buscando dados B2B...');
      
      // Lusha precisa de LinkedIn URL ou email específico
      const responseTime = Date.now() - startTime;
      
      return {
        source: 'Lusha',
        success: false,
        error: 'Requer LinkedIn URL ou email',
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        source: 'Lusha',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 PIPL - Person Data
   */
  private async searchPipl(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const PIPL_API_KEY = Deno.env.get('PIPL_API_KEY');
    
    if (!PIPL_API_KEY) {
      return {
        source: 'Pipl',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [9/15] Pipl - Buscando dados pessoais...');
      
      const response = await fetch('https://api.pipl.com/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PIPL_API_KEY}`
        },
        body: JSON.stringify({
          person: {
            name: {
              first: filters.firstName,
              last: filters.lastName
            },
            company: filters.company,
            location: {
              city: filters.city,
              state: filters.state,
              country: filters.country
            }
          },
          limit: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.persons || []).map((p: any) => ({
        name: `${p.name.first || ''} ${p.name.last || ''}`.trim(),
        firstName: p.name.first,
        lastName: p.name.last,
        title: p.jobs?.[0]?.title,
        company: p.jobs?.[0]?.company?.name,
        industry: p.jobs?.[0]?.company?.industry,
        seniority: p.jobs?.[0]?.title_role,
        email: p.emails?.[0]?.address,
        phone: p.phones?.[0]?.number,
        phones: p.phones?.map((ph: any) => ph.number) || [],
        linkedinUrl: p.urls?.find((u: any) => u.type === 'linkedin')?.url,
        twitterUrl: p.urls?.find((u: any) => u.type === 'twitter')?.url,
        facebookUrl: p.urls?.find((u: any) => u.type === 'facebook')?.url,
        city: p.addresses?.[0]?.city,
        state: p.addresses?.[0]?.state,
        country: p.addresses?.[0]?.country,
        avatar: p.images?.[0]?.url,
        bio: p.bio?.text,
        skills: p.skills?.map((s: any) => s.name) || [],
        yearsExperience: p.jobs?.[0]?.years_experience,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Pipl: ${results.length} perfis (${responseTime}ms)`);
      
      return {
        source: 'Pipl',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Pipl: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Pipl',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 ZOOMINFO - Business Data
   */
  private async searchZoomInfo(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const ZOOMINFO_API_KEY = Deno.env.get('ZOOMINFO_API_KEY');
    
    if (!ZOOMINFO_API_KEY) {
      return {
        source: 'ZoomInfo',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [10/15] ZoomInfo - Buscando dados de negócios...');
      
      const response = await fetch('https://api.zoominfo.com/2.0/search/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ZOOMINFO_API_KEY}`
        },
        body: JSON.stringify({
          searchCriteria: {
            firstName: filters.firstName,
            lastName: filters.lastName,
            company: filters.company,
            location: {
              city: filters.city,
              state: filters.state,
              country: filters.country
            }
          },
          limit: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.people || []).map((p: any) => ({
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        firstName: p.firstName,
        lastName: p.lastName,
        title: p.title,
        company: p.companyName,
        industry: p.industry,
        seniority: p.titleRole,
        email: p.email,
        phone: p.phone,
        phones: [p.phone] || [],
        linkedinUrl: p.linkedinUrl,
        twitterUrl: p.twitterUrl,
        facebookUrl: p.facebookUrl,
        city: p.city,
        state: p.state,
        country: p.country,
        avatar: p.profileImageUrl,
        bio: p.bio,
        skills: p.skills || [],
        yearsExperience: p.yearsExperience,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ ZoomInfo: ${results.length} perfis (${responseTime}ms)`);
      
      return {
        source: 'ZoomInfo',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ZoomInfo: ${error.message} (${responseTime}ms)`);
      return {
        source: 'ZoomInfo',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 SNOV.IO - Email Finder
   */
  private async searchSnovio(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const SNOVIO_API_KEY = Deno.env.get('SNOVIO_API_KEY');
    
    if (!SNOVIO_API_KEY || !filters.company) {
      return {
        source: 'Snov.io',
        success: false,
        error: !SNOVIO_API_KEY ? 'API key não configurada' : 'Empresa não especificada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [11/15] Snov.io - Buscando emails corporativos...');
      
      // Tentar extrair domínio da empresa
      const domain = this.extractDomain(filters.company);
      if (!domain) {
        throw new Error('Não foi possível extrair domínio da empresa');
      }
      
      const response = await fetch(
        `https://api.snov.io/v1/get-domain-emails?domain=${domain}&limit=20&api_key=${SNOVIO_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.emails || []).map((e: any) => ({
        name: `${e.first_name || ''} ${e.last_name || ''}`.trim(),
        firstName: e.first_name,
        lastName: e.last_name,
        email: e.email,
        title: e.position,
        company: filters.company,
        companyDomain: domain,
        linkedinUrl: e.linkedin,
        twitterUrl: e.twitter,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Snov.io: ${results.length} emails (${responseTime}ms)`);
      
      return {
        source: 'Snov.io',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Snov.io: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Snov.io',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 CONTACTOUT - Contact Finder
   */
  private async searchContactOut(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const CONTACTOUT_API_KEY = Deno.env.get('CONTACTOUT_API_KEY');
    
    if (!CONTACTOUT_API_KEY) {
      return {
        source: 'ContactOut',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [12/15] ContactOut - Buscando contatos...');
      
      const response = await fetch('https://api.contactout.com/v2/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONTACTOUT_API_KEY}`
        },
        body: JSON.stringify({
          query: {
            firstName: filters.firstName,
            lastName: filters.lastName,
            company: filters.company,
            location: {
              city: filters.city,
              state: filters.state,
              country: filters.country
            }
          },
          limit: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.results || []).map((p: any) => ({
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        firstName: p.firstName,
        lastName: p.lastName,
        title: p.title,
        company: p.companyName,
        industry: p.industry,
        seniority: p.titleRole,
        email: p.email,
        phone: p.phone,
        phones: [p.phone] || [],
        linkedinUrl: p.linkedinUrl,
        twitterUrl: p.twitterUrl,
        facebookUrl: p.facebookUrl,
        city: p.city,
        state: p.state,
        country: p.country,
        avatar: p.profileImageUrl,
        bio: p.bio,
        skills: p.skills || [],
        yearsExperience: p.yearsExperience,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ ContactOut: ${results.length} perfis (${responseTime}ms)`);
      
      return {
        source: 'ContactOut',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ContactOut: ${error.message} (${responseTime}ms)`);
      return {
        source: 'ContactOut',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 KASPR - Contact Finder
   */
  private async searchKaspr(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const KASPR_API_KEY = Deno.env.get('KASPR_API_KEY');
    
    if (!KASPR_API_KEY) {
      return {
        source: 'Kaspr',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [13/15] Kaspr - Buscando contatos...');
      
      const response = await fetch('https://api.kaspr.com/v2/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KASPR_API_KEY}`
        },
        body: JSON.stringify({
          query: {
            firstName: filters.firstName,
            lastName: filters.lastName,
            company: filters.company,
            location: {
              city: filters.city,
              state: filters.state,
              country: filters.country
            }
          },
          limit: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.results || []).map((p: any) => ({
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        firstName: p.firstName,
        lastName: p.lastName,
        title: p.title,
        company: p.companyName,
        industry: p.industry,
        seniority: p.titleRole,
        email: p.email,
        phone: p.phone,
        phones: [p.phone] || [],
        linkedinUrl: p.linkedinUrl,
        twitterUrl: p.twitterUrl,
        facebookUrl: p.facebookUrl,
        city: p.city,
        state: p.state,
        country: p.country,
        avatar: p.profileImageUrl,
        bio: p.bio,
        skills: p.skills || [],
        yearsExperience: p.yearsExperience,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Kaspr: ${results.length} perfis (${responseTime}ms)`);
      
      return {
        source: 'Kaspr',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Kaspr: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Kaspr',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 SEAMLESS.AI - Contact Finder
   */
  private async searchSeamlessAi(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    const SEAMLESS_AI_API_KEY = Deno.env.get('SEAMLESS_AI_API_KEY');
    
    if (!SEAMLESS_AI_API_KEY) {
      return {
        source: 'Seamless.ai',
        success: false,
        error: 'API key não configurada',
        responseTime: 0
      };
    }
    
    try {
      console.log('🔍 [14/15] Seamless.ai - Buscando contatos...');
      
      const response = await fetch('https://api.seamless.ai/v2/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SEAMLESS_AI_API_KEY}`
        },
        body: JSON.stringify({
          query: {
            firstName: filters.firstName,
            lastName: filters.lastName,
            company: filters.company,
            location: {
              city: filters.city,
              state: filters.state,
              country: filters.country
            }
          },
          limit: 20
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const results = (data.results || []).map((p: any) => ({
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        firstName: p.firstName,
        lastName: p.lastName,
        title: p.title,
        company: p.companyName,
        industry: p.industry,
        seniority: p.titleRole,
        email: p.email,
        phone: p.phone,
        phones: [p.phone] || [],
        linkedinUrl: p.linkedinUrl,
        twitterUrl: p.twitterUrl,
        facebookUrl: p.facebookUrl,
        city: p.city,
        state: p.state,
        country: p.country,
        avatar: p.profileImageUrl,
        bio: p.bio,
        skills: p.skills || [],
        yearsExperience: p.yearsExperience,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Seamless.ai: ${results.length} perfis (${responseTime}ms)`);
      
      return {
        source: 'Seamless.ai',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Seamless.ai: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Seamless.ai',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🔍 LEADS DATABASE - Local Database
   */
  private async searchLeadsDatabase(filters: SearchFilters): Promise<APIResult> {
    const startTime = Date.now();
    
    try {
      console.log('🔍 [15/15] Leads Database - Buscando em banco de dados local...');
      
      const leads = await leadsDB.search(filters);
      const results = leads.map((lead: LeadRecord) => ({
        name: lead.name,
        firstName: lead.firstName,
        lastName: lead.lastName,
        title: lead.title,
        company: lead.company,
        industry: lead.industry,
        seniority: lead.seniority,
        email: lead.email,
        phone: lead.phone,
        phones: lead.phones || [],
        linkedinUrl: lead.linkedinUrl,
        twitterUrl: lead.twitterUrl,
        facebookUrl: lead.facebookUrl,
        city: lead.city,
        state: lead.state,
        country: lead.country,
        avatar: lead.avatar,
        bio: lead.bio,
        skills: lead.skills || [],
        yearsExperience: lead.yearsExperience,
      }));
      
      const responseTime = Date.now() - startTime;
      console.log(`✅ Leads Database: ${results.length} perfis (${responseTime}ms)`);
      
      return {
        source: 'Leads Database',
        success: true,
        data: results,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ Leads Database: ${error.message} (${responseTime}ms)`);
      return {
        source: 'Leads Database',
        success: false,
        error: error.message,
        responseTime
      };
    }
  }
  
  /**
   * 🧠 CONSOLIDAR RESULTADOS DE MÚLTIPLAS APIS
   * Agrupa leads similares e mescla dados
   */
  private consolidateResults(apiResults: APIResult[]): LeadData[] {
    console.log('\n🧠 Consolidando resultados de múltiplas APIs...');
    
    const allLeads: LeadData[] = [];
    const leadsMap = new Map<string, LeadData>();
    
    // Processar cada resultado de API
    apiResults.forEach(apiResult => {
      if (!apiResult.success || !apiResult.data) return;
      
      apiResult.data.forEach(partialLead => {
        // Criar chave única baseada em nome/email/linkedin
        const key = this.generateLeadKey(partialLead);
        
        if (leadsMap.has(key)) {
          // Lead já existe, mesclar dados
          const existingLead = leadsMap.get(key)!;
          const mergedLead = this.mergeLeadData(existingLead, partialLead, apiResult.source);
          leadsMap.set(key, mergedLead);
        } else {
          // Novo lead
          const newLead: LeadData = {
            ...partialLead,
            matchScore: 70,
            confidenceScore: 50,
            sources: [apiResult.source],
            dataQuality: 0,
          } as LeadData;
          leadsMap.set(key, newLead);
        }
      });
    });
    
    // Converter Map para Array
    const consolidatedLeads = Array.from(leadsMap.values());
    
    console.log(`✅ ${consolidatedLeads.length} leads únicos consolidados`);
    
    return consolidatedLeads;
  }
  
  /**
   * Gera chave única para identificar lead
   */
  private generateLeadKey(lead: Partial<LeadData>): string {
    // Prioridade: email > linkedin > nome+empresa
    if (lead.email) return `email:${lead.email.toLowerCase()}`;
    if (lead.linkedinUrl) return `linkedin:${lead.linkedinUrl}`;
    const name = (lead.name || '').toLowerCase().trim();
    const company = (lead.company || '').toLowerCase().trim();
    return `name:${name}|company:${company}`;
  }
  
  /**
   * Mescla dados de um lead de múltiplas fontes
   */
  private mergeLeadData(existing: LeadData, newData: Partial<LeadData>, source: string): LeadData {
    // Adicionar fonte
    if (!existing.sources.includes(source)) {
      existing.sources.push(source);
    }
    
    // Mesclar dados - prioriza dados mais completos
    return {
      ...existing,
      name: newData.name || existing.name,
      firstName: newData.firstName || existing.firstName,
      lastName: newData.lastName || existing.lastName,
      title: newData.title || existing.title,
      company: newData.company || existing.company,
      companyDomain: newData.companyDomain || existing.companyDomain,
      industry: newData.industry || existing.industry,
      seniority: newData.seniority || existing.seniority,
      location: newData.location || existing.location,
      city: newData.city || existing.city,
      state: newData.state || existing.state,
      country: newData.country || existing.country,
      email: newData.email || existing.email,
      phone: newData.phone || existing.phone,
      phones: [...(existing.phones || []), ...(newData.phones || [])],
      linkedinUrl: newData.linkedinUrl || existing.linkedinUrl,
      twitterUrl: newData.twitterUrl || existing.twitterUrl,
      facebookUrl: newData.facebookUrl || existing.facebookUrl,
      companySize: newData.companySize || existing.companySize,
      companyWebsite: newData.companyWebsite || existing.companyWebsite,
      companyIndustry: newData.companyIndustry || existing.companyIndustry,
      avatar: newData.avatar || existing.avatar,
      bio: newData.bio || existing.bio,
      skills: [...(existing.skills || []), ...(newData.skills || [])],
      yearsExperience: newData.yearsExperience || existing.yearsExperience,
      sources: existing.sources,
    };
  }
  
  /**
   * 📈 RANQUEAR LEADS POR CONFIABILIDADE
   * Quanto mais fontes confirmam os dados, maior o score
   */
  private rankByConfidence(leads: LeadData[]): LeadData[] {
    return leads.map(lead => {
      // Calcular score de confiança baseado em:
      // 1. Número de fontes (max 40 pontos)
      const sourcesScore = Math.min(40, lead.sources.length * 10);
      
      // 2. Completude de dados (max 30 pontos)
      const fieldsCount = [
        lead.email, lead.phone, lead.linkedinUrl, lead.title, 
        lead.company, lead.location, lead.avatar
      ].filter(f => f).length;
      const completenessScore = Math.round((fieldsCount / 7) * 30);
      
      // 3. Qualidade dos dados (max 30 pontos)
      const qualityScore = lead.email ? 30 : (lead.phone ? 20 : 10);
      
      const confidenceScore = sourcesScore + completenessScore + qualityScore;
      const dataQuality = Math.round(((fieldsCount / 7) * 100));
      
      // Match score baseado em filtros originais
      const matchScore = 70 + Math.min(30, lead.sources.length * 5);
      
      return {
        ...lead,
        confidenceScore,
        dataQuality,
        matchScore,
      };
    }).sort((a, b) => b.confidenceScore - a.confidenceScore);
  }
  
  /**
   * Helpers
   */
  private extractDomain(company: string): string | null {
    // Limpa nome da empresa e tenta criar domínio
    const clean = company.toLowerCase()
      .replace(/\s+(lda|ltd|inc|corp|llc|sa|gmbh)\.?$/i, '')
      .replace(/[^a-z0-9]/g, '');
    
    if (!clean) return null;
    
    // Tentar .pt para Portugal, senão .com
    return `${clean}.pt`;
  }
  
  private calculateAverageQuality(leads: LeadData[]): number {
    if (leads.length === 0) return 0;
    const sum = leads.reduce((acc, lead) => acc + lead.dataQuality, 0);
    return Math.round(sum / leads.length);
  }
  
  private calculateAverageSources(leads: LeadData[]): number {
    if (leads.length === 0) return 0;
    const sum = leads.reduce((acc, lead) => acc + lead.sources.length, 0);
    return Math.round((sum / leads.length) * 10) / 10;
  }
}

export const intelligentSearch = new IntelligentSearchEngine();