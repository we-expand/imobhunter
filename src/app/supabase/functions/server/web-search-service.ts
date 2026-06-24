/**
 * 🌐 WEB SEARCH SERVICE
 * Busca dados REAIS na internet usando múltiplas fontes
 */

import { getEnv } from './env-helper.ts';

interface WebSearchResult {
  title: string;
  snippet: string;
  link: string;
  source: string;
}

interface EnrichedCompanyData {
  name: string;
  domain: string;
  description: string;
  industry: string;
  employees: number | string;
  founded: number;
  revenue: string;
  location: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  technologies: string[];
  news: string[];
  funding: string;
  source: string;
}

interface EnrichedPersonData {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
  }>;
  source: string;
}

/**
 * 🔎 BING SEARCH API
 * Alternativa ao Google
 */
async function searchBing(query: string): Promise<WebSearchResult[]> {
  try {
    const apiKey = getEnv('BING_SEARCH_API_KEY');
    
    if (!apiKey) {
      console.log('⚠️ Bing Search não configurado');
      return [];
    }

    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=10`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error('Bing Search error:', response.status);
      return [];
    }

    const data = await response.json();
    
    return (data.webPages?.value || []).map((item: any) => ({
      title: item.name,
      snippet: item.snippet,
      link: item.url,
      source: 'bing',
    }));
  } catch (error) {
    console.error('❌ Erro no Bing Search:', error);
    return [];
  }
}

/**
 * 🌐 CRUNCHBASE API
 * Dados de empresas e funding
 */
async function searchCrunchbase(companyName: string): Promise<any> {
  try {
    const apiKey = getEnv('CRUNCHBASE_API_KEY');
    
    if (!apiKey) {
      console.log('⚠️ Crunchbase não configurado');
      return null;
    }

    const response = await fetch(
      `https://api.crunchbase.com/api/v4/entities/organizations?query=${encodeURIComponent(companyName)}`,
      {
        headers: {
          'X-cb-user-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Crunchbase error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.entities && data.entities.length > 0) {
      const company = data.entities[0].properties;
      return {
        name: company.name,
        description: company.short_description,
        industry: company.categories?.map((c: any) => c.value).join(', '),
        founded: company.founded_on?.value,
        employees: company.num_employees_enum,
        funding: company.total_funding_usd,
        website: company.website_url,
        linkedinUrl: company.linkedin_url,
        location: company.location_identifiers?.map((l: any) => l.value).join(', '),
        source: 'crunchbase',
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Erro no Crunchbase:', error);
    return null;
  }
}

/**
 * 📰 NEWS API
 * Notícias recentes sobre empresas/pessoas
 */
async function searchNews(query: string): Promise<string[]> {
  try {
    const apiKey = getEnv('NEWS_API_KEY');
    
    if (!apiKey) {
      console.log('⚠️ News API não configurado');
      return [];
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`
    );

    if (!response.ok) {
      console.error('News API error:', response.status);
      return [];
    }

    const data = await response.json();
    
    return (data.articles || []).map((article: any) => article.title);
  } catch (error) {
    console.error('❌ Erro no News API:', error);
    return [];
  }
}

/**
 * 🏢 WAPPALYZER / BUILTWITH
 * Detecta tecnologias usadas em websites
 */
async function detectTechnologies(domain: string): Promise<string[]> {
  try {
    const apiKey = getEnv('WAPPALYZER_API_KEY');
    
    if (!apiKey) {
      console.log('⚠️ Wappalyzer não configurado');
      return [];
    }

    const response = await fetch(
      `https://api.wappalyzer.com/v2/lookup/?url=${encodeURIComponent(domain)}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      console.error('Wappalyzer error:', response.status);
      return [];
    }

    const data = await response.json();
    
    const technologies: string[] = [];
    
    if (data && Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.technologies && Array.isArray(item.technologies)) {
          item.technologies.forEach((tech: any) => {
            if (tech.name) technologies.push(tech.name);
          });
        }
      });
    }

    return [...new Set(technologies)]; // Remove duplicatas
  } catch (error) {
    console.error('❌ Erro no Wappalyzer:', error);
    return [];
  }
}

/**
 * 🎯 ENRICHMENT COMPLETO DE EMPRESA
 * Combina dados de múltiplas fontes
 */
async function enrichCompanyData(companyName: string, domain?: string): Promise<EnrichedCompanyData | null> {
  try {
    console.log(`🔍 Enriquecendo dados da empresa: ${companyName}`);

    const enrichedData: Partial<EnrichedCompanyData> = {
      name: companyName,
      domain: domain || '',
    };

    // 1️⃣ Buscar no Bing
    const bingResults = await searchBing(companyName + ' company');
    if (bingResults.length > 0) {
      const linkedinResult = bingResults.find(r => r.link.includes('linkedin.com/company'));
      if (linkedinResult) {
        enrichedData.linkedinUrl = linkedinResult.link;
        enrichedData.description = linkedinResult.snippet;
      } else {
        enrichedData.description = bingResults[0].snippet;
      }
    }

    // 2️⃣ Buscar no Crunchbase
    const crunchbaseData = await searchCrunchbase(companyName);
    if (crunchbaseData) {
      enrichedData.description = enrichedData.description || crunchbaseData.description;
      enrichedData.industry = crunchbaseData.industry;
      enrichedData.founded = crunchbaseData.founded;
      enrichedData.employees = crunchbaseData.employees;
      enrichedData.funding = crunchbaseData.funding;
      enrichedData.location = crunchbaseData.location;
      if (!enrichedData.linkedinUrl) enrichedData.linkedinUrl = crunchbaseData.linkedinUrl;
    }

    // 3️⃣ Buscar notícias
    const news = await searchNews(companyName);
    enrichedData.news = news;

    // 4️⃣ Detectar tecnologias (se temos domain)
    if (domain) {
      const technologies = await detectTechnologies(domain);
      enrichedData.technologies = technologies;
    }

    console.log('✅ Dados enriquecidos:', enrichedData);

    return enrichedData as EnrichedCompanyData;
  } catch (error) {
    console.error('❌ Erro ao enriquecer empresa:', error);
    return null;
  }
}

/**
 * 🎯 ENRICHMENT COMPLETO DE PESSOA
 * Combina dados de múltiplas fontes
 */
async function enrichPersonData(
  firstName: string,
  lastName: string,
  company?: string
): Promise<EnrichedPersonData | null> {
  try {
    const fullName = `${firstName} ${lastName}`;
    console.log(`🔍 Enriquecendo dados da pessoa: ${fullName}`);

    const enrichedData: Partial<EnrichedPersonData> = {
      name: fullName,
      firstName,
      lastName,
    };

    // 1️⃣ Buscar no Bing (LinkedIn profile)
    const searchQuery = company 
      ? `${fullName} ${company} site:linkedin.com/in`
      : `${fullName} site:linkedin.com/in`;
      
    const bingResults = await searchBing(searchQuery);
    if (bingResults.length > 0) {
      const linkedinResult = bingResults.find(r => r.link.includes('linkedin.com/in'));
      if (linkedinResult) {
        enrichedData.linkedinUrl = linkedinResult.link;
        enrichedData.summary = linkedinResult.snippet;
        
        // Extrair título e empresa do snippet
        const snippetMatch = linkedinResult.snippet.match(/(.+?)\s+(?:at|@)\s+(.+?)(?:\s*-|\.|$)/);
        if (snippetMatch) {
          enrichedData.title = snippetMatch[1].trim();
          enrichedData.company = snippetMatch[2].trim();
        }
      }
    }

    console.log('✅ Dados enriquecidos:', enrichedData);

    return enrichedData as EnrichedPersonData;
  } catch (error) {
    console.error('❌ Erro ao enriquecer pessoa:', error);
    return null;
  }
}

/**
 * 🔎 BUSCA AVANÇADA NA WEB
 * Usa Bing e outras fontes
 */
async function advancedWebSearch(query: string, type: 'company' | 'person' = 'company'): Promise<WebSearchResult[]> {
  const results: WebSearchResult[] = [];

  // Buscar no Bing
  const bingResults = await searchBing(query);
  results.push(...bingResults);

  // Remove duplicatas baseado na URL
  const uniqueResults = Array.from(
    new Map(results.map(r => [r.link, r])).values()
  );

  return uniqueResults;
}

// Exportar todas as funções
export {
  searchBing,
  searchCrunchbase,
  searchNews,
  detectTechnologies,
  enrichCompanyData,
  enrichPersonData,
  advancedWebSearch,
};

// Default export para import completo
export default {
  searchBing,
  searchCrunchbase,
  searchNews,
  detectTechnologies,
  enrichCompanyData,
  enrichPersonData,
  advancedWebSearch,
};