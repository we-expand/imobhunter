import { Hono } from '&';
import * as kv from './kv_store.tsx';

const app = new Hono();

// 🧠 Interface para histórico de busca
interface SearchHistory {
  timestamp: string;
  userId: string;
  filters: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    company?: string;
    location?: string;
    industry?: string;
    socialNetworks?: string[];
    hasEmail?: boolean;
    hasPhone?: boolean;
  };
  resultsCount: number;
  selectedLeadsCount: number;
  addedToPipelineCount: number;
}

// 🎯 Interface para padrão detectado
interface UserPattern {
  userId: string;
  patterns: {
    mostSearchedJobTitles: { title: string; count: number }[];
    mostSearchedIndustries: { industry: string; count: number }[];
    mostSearchedLocations: { location: string; count: number }[];
    mostSearchedCompanies: { company: string; count: number }[];
    preferredSocialNetworks: string[];
    averageMatchScore: number;
    searchFrequency: number;
    conversionRate: number; // % de leads selecionados vs. encontrados
    lastAnalyzed: string;
  };
}

// 🤖 Interface para sugestão do AI
interface AISuggestion {
  id: string;
  userId: string;
  type: 'lead' | 'search_filter' | 'campaign' | 'insight';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  suggestedFilters?: any;
  suggestedLeads?: any[];
  confidence: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// ================================================================
// 📊 ROTA 1: Salvar histórico de busca
// ================================================================
app.post('/save-search', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, filters, resultsCount, selectedLeadsCount, addedToPipelineCount } = body;

    if (!userId) {
      return c.json({ error: 'userId é obrigatório' }, 400);
    }

    const searchHistory: SearchHistory = {
      timestamp: new Date().toISOString(),
      userId,
      filters,
      resultsCount: resultsCount || 0,
      selectedLeadsCount: selectedLeadsCount || 0,
      addedToPipelineCount: addedToPipelineCount || 0
    };

    // Salvar no KV store com chave única
    const key = `search_history:${userId}:${Date.now()}`;
    await kv.set(key, searchHistory);

    console.log('✅ [AI-BRAIN] Busca salva:', key);

    // Disparar análise assíncrona (não bloqueia a resposta)
    analyzeUserPatternsAsync(userId).catch(err => 
      console.error('⚠️ [AI-BRAIN] Erro na análise assíncrona:', err)
    );

    return c.json({
      success: true,
      message: 'Busca salva com sucesso',
      key
    });

  } catch (error: any) {
    console.error('❌ [AI-BRAIN] Erro ao salvar busca:', error);
    return c.json({ 
      error: 'Erro ao salvar busca', 
      details: error.message 
    }, 500);
  }
});

// ================================================================
// 🧠 ROTA 2: Analisar padrões do usuário
// ================================================================
app.get('/analyze-patterns/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    console.log('🧠 [AI-BRAIN] Analisando padrões para usuário:', userId);

    const patterns = await analyzeUserPatterns(userId);

    return c.json({
      success: true,
      patterns
    });

  } catch (error: any) {
    console.error('❌ [AI-BRAIN] Erro ao analisar padrões:', error);
    return c.json({ 
      error: 'Erro ao analisar padrões', 
      details: error.message 
    }, 500);
  }
});

// ================================================================
// 🤖 ROTA 3: Gerar sugestões inteligentes
// ================================================================
app.post('/generate-suggestions', async (c) => {
  try {
    const { userId } = await c.req.json();

    if (!userId) {
      return c.json({ error: 'userId é obrigatório' }, 400);
    }

    console.log('🤖 [AI-BRAIN] Gerando sugestões para:', userId);

    // 1. Analisar padrões do usuário
    const patterns = await analyzeUserPatterns(userId);

    // 2. Gerar sugestões baseadas nos padrões
    const suggestions = await generateSuggestions(userId, patterns);

    // 3. Salvar sugestões no KV
    for (const suggestion of suggestions) {
      const key = `suggestion:${userId}:${suggestion.id}`;
      await kv.set(key, suggestion);
    }

    console.log(`✅ [AI-BRAIN] ${suggestions.length} sugestões geradas`);

    return c.json({
      success: true,
      suggestions,
      patterns
    });

  } catch (error: any) {
    console.error('❌ [AI-BRAIN] Erro ao gerar sugestões:', error);
    return c.json({ 
      error: 'Erro ao gerar sugestões', 
      details: error.message 
    }, 500);
  }
});

// ================================================================
// 📥 ROTA 4: Obter sugestões pendentes
// ================================================================
app.get('/suggestions/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const suggestions = await kv.getByPrefix(`suggestion:${userId}:`);
    
    // Filtrar apenas pendentes e ordenar por prioridade
    const pendingSuggestions = (suggestions || [])
      .filter((s: AISuggestion) => s.status === 'pending')
      .sort((a: AISuggestion, b: AISuggestion) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    return c.json({
      success: true,
      suggestions: pendingSuggestions,
      count: pendingSuggestions.length
    });

  } catch (error: any) {
    console.error('❌ [AI-BRAIN] Erro ao obter sugestões:', error);
    return c.json({ 
      error: 'Erro ao obter sugestões', 
      details: error.message 
    }, 500);
  }
});

// ================================================================
// ✅ ROTA 5: Aceitar/Rejeitar sugestão
// ================================================================
app.post('/suggestion/:suggestionId/respond', async (c) => {
  try {
    const suggestionId = c.req.param('suggestionId');
    const { userId, action } = await c.req.json();

    if (!['accepted', 'rejected'].includes(action)) {
      return c.json({ error: 'action deve ser "accepted" ou "rejected"' }, 400);
    }

    const key = `suggestion:${userId}:${suggestionId}`;
    const suggestions = await kv.getByPrefix(key);
    
    if (!suggestions || suggestions.length === 0) {
      return c.json({ error: 'Sugestão não encontrada' }, 404);
    }

    const suggestion = suggestions[0] as AISuggestion;
    suggestion.status = action;

    await kv.set(key, suggestion);

    console.log(`✅ [AI-BRAIN] Sugestão ${suggestionId} ${action}`);

    return c.json({
      success: true,
      message: `Sugestão ${action === 'accepted' ? 'aceita' : 'rejeitada'}`,
      suggestion
    });

  } catch (error: any) {
    console.error('❌ [AI-BRAIN] Erro ao responder sugestão:', error);
    return c.json({ 
      error: 'Erro ao responder sugestão', 
      details: error.message 
    }, 500);
  }
});

// ================================================================
// 🧠 FUNÇÃO: Analisar padrões do usuário
// ================================================================
async function analyzeUserPatterns(userId: string): Promise<UserPattern> {
  // Buscar todo o histórico de buscas do usuário
  const searches = await kv.getByPrefix(`search_history:${userId}:`);

  if (!searches || searches.length === 0) {
    return {
      userId,
      patterns: {
        mostSearchedJobTitles: [],
        mostSearchedIndustries: [],
        mostSearchedLocations: [],
        mostSearchedCompanies: [],
        preferredSocialNetworks: [],
        averageMatchScore: 0,
        searchFrequency: 0,
        conversionRate: 0,
        lastAnalyzed: new Date().toISOString()
      }
    };
  }

  const jobTitleCounts = new Map<string, number>();
  const industryCounts = new Map<string, number>();
  const locationCounts = new Map<string, number>();
  const companyCounts = new Map<string, number>();
  const socialNetworkCounts = new Map<string, number>();
  
  let totalResults = 0;
  let totalSelected = 0;

  for (const search of searches as SearchHistory[]) {
    // Contar job titles
    if (search.filters.jobTitle) {
      jobTitleCounts.set(
        search.filters.jobTitle, 
        (jobTitleCounts.get(search.filters.jobTitle) || 0) + 1
      );
    }

    // Contar indústrias
    if (search.filters.industry) {
      industryCounts.set(
        search.filters.industry, 
        (industryCounts.get(search.filters.industry) || 0) + 1
      );
    }

    // Contar localizações
    if (search.filters.location) {
      locationCounts.set(
        search.filters.location, 
        (locationCounts.get(search.filters.location) || 0) + 1
      );
    }

    // Contar empresas
    if (search.filters.company) {
      companyCounts.set(
        search.filters.company, 
        (companyCounts.get(search.filters.company) || 0) + 1
      );
    }

    // Contar redes sociais
    if (search.filters.socialNetworks) {
      for (const network of search.filters.socialNetworks) {
        socialNetworkCounts.set(
          network, 
          (socialNetworkCounts.get(network) || 0) + 1
        );
      }
    }

    totalResults += search.resultsCount || 0;
    totalSelected += search.selectedLeadsCount || 0;
  }

  // Calcular taxa de conversão
  const conversionRate = totalResults > 0 ? (totalSelected / totalResults) * 100 : 0;

  // Ordenar e pegar top 5
  const sortMap = (map: Map<string, number>) => 
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ title: name, count }));

  const patterns: UserPattern = {
    userId,
    patterns: {
      mostSearchedJobTitles: sortMap(jobTitleCounts).map(item => ({ title: item.title, count: item.count })),
      mostSearchedIndustries: sortMap(industryCounts).map(item => ({ industry: item.title, count: item.count })),
      mostSearchedLocations: sortMap(locationCounts).map(item => ({ location: item.title, count: item.count })),
      mostSearchedCompanies: sortMap(companyCounts).map(item => ({ company: item.title, count: item.count })),
      preferredSocialNetworks: Array.from(socialNetworkCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([network]) => network),
      averageMatchScore: 0,
      searchFrequency: searches.length,
      conversionRate: Math.round(conversionRate * 10) / 10,
      lastAnalyzed: new Date().toISOString()
    }
  };

  // Salvar padrões analisados
  await kv.set(`patterns:${userId}`, patterns);

  return patterns;
}

// ================================================================
// 🤖 FUNÇÃO: Gerar sugestões baseadas em padrões
// ================================================================
async function generateSuggestions(userId: string, patterns: UserPattern): Promise<AISuggestion[]> {
  const suggestions: AISuggestion[] = [];

  // SUGESTÃO 1: Expansão de cargo
  if (patterns.patterns.mostSearchedJobTitles.length > 0) {
    const topJobTitle = patterns.patterns.mostSearchedJobTitles[0];
    
    // Gerar variações do cargo
    const jobVariations = generateJobTitleVariations(topJobTitle.title);
    
    suggestions.push({
      id: `suggestion-job-${Date.now()}-1`,
      userId,
      type: 'search_filter',
      priority: 'high',
      title: `Expandir busca de "${topJobTitle.title}"`,
      description: `Você buscou ${topJobTitle.count}x por "${topJobTitle.title}". Experimente variações similares!`,
      reasoning: `Baseado em ${topJobTitle.count} buscas anteriores, detectamos padrão forte neste cargo.`,
      suggestedFilters: {
        jobTitle: jobVariations,
        industry: patterns.patterns.mostSearchedIndustries[0]?.industry
      },
      confidence: 95,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
  }

  // SUGESTÃO 2: Nova indústria relacionada
  if (patterns.patterns.mostSearchedIndustries.length > 0) {
    const topIndustry = patterns.patterns.mostSearchedIndustries[0];
    const relatedIndustries = getRelatedIndustries(topIndustry.industry);
    
    suggestions.push({
      id: `suggestion-industry-${Date.now()}-2`,
      userId,
      type: 'insight',
      priority: 'medium',
      title: `Explore indústrias relacionadas a "${topIndustry.industry}"`,
      description: `${relatedIndustries.join(', ')} podem ter leads similares ao seu perfil ideal.`,
      reasoning: `Análise de ${topIndustry.count} buscas em ${topIndustry.industry} sugere alta afinidade.`,
      suggestedFilters: {
        industries: relatedIndustries
      },
      confidence: 82,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
  }

  // SUGESTÃO 3: Rede social sugerida
  if (patterns.patterns.preferredSocialNetworks.length > 0) {
    const topNetwork = patterns.patterns.preferredSocialNetworks[0];
    const complementaryNetworks = getComplementaryNetworks(topNetwork);
    
    suggestions.push({
      id: `suggestion-social-${Date.now()}-3`,
      userId,
      type: 'search_filter',
      priority: 'medium',
      title: `Adicione ${complementaryNetworks[0]} às suas buscas`,
      description: `Você usa muito ${topNetwork}. Combiná-lo com ${complementaryNetworks[0]} pode aumentar resultados em 40%.`,
      reasoning: `Padrão detectado: alta preferência por ${topNetwork}. Combinação aumenta taxa de conversão.`,
      suggestedFilters: {
        socialNetworks: [topNetwork, ...complementaryNetworks]
      },
      confidence: 78,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
  }

  // SUGESTÃO 4: Melhoria na taxa de conversão
  if (patterns.patterns.conversionRate < 30) {
    suggestions.push({
      id: `suggestion-conversion-${Date.now()}-4`,
      userId,
      type: 'insight',
      priority: 'high',
      title: `Taxa de conversão baixa: ${patterns.patterns.conversionRate}%`,
      description: `Ajuste seus filtros para leads mais qualificados. Sugerimos aumentar Match Score mínimo para 80%.`,
      reasoning: `Taxa de seleção de ${patterns.patterns.conversionRate}% indica muitos leads irrelevantes.`,
      suggestedFilters: {
        minMatchScore: 80,
        hasEmail: true
      },
      confidence: 88,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
  }

  // SUGESTÃO 5: Localização expandida
  if (patterns.patterns.mostSearchedLocations.length > 0) {
    const topLocation = patterns.patterns.mostSearchedLocations[0];
    const nearbyLocations = getNearbyLocations(topLocation.location);
    
    suggestions.push({
      id: `suggestion-location-${Date.now()}-5`,
      userId,
      type: 'search_filter',
      priority: 'low',
      title: `Expandir para regiões próximas a ${topLocation.location}`,
      description: `Cidades próximas: ${nearbyLocations.join(', ')} podem ter leads similares.`,
      reasoning: `${topLocation.count} buscas em ${topLocation.location}. Expansão geográfica recomendada.`,
      suggestedFilters: {
        locations: [topLocation.location, ...nearbyLocations]
      },
      confidence: 72,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
  }

  return suggestions;
}

// ================================================================
// 🔧 FUNÇÕES AUXILIARES
// ================================================================

function generateJobTitleVariations(jobTitle: string): string[] {
  const variations: { [key: string]: string[] } = {
    'CEO': ['Chief Executive Officer', 'President', 'Managing Director', 'Founder'],
    'CTO': ['Chief Technology Officer', 'VP Engineering', 'Head of Technology'],
    'CFO': ['Chief Financial Officer', 'Finance Director', 'VP Finance'],
    'CMO': ['Chief Marketing Officer', 'Marketing Director', 'VP Marketing'],
    'COO': ['Chief Operating Officer', 'Operations Director', 'VP Operations'],
    'Manager': ['Director', 'Head of', 'Team Lead', 'Supervisor'],
    'Developer': ['Engineer', 'Programmer', 'Software Developer', 'Coder'],
    'Designer': ['UI Designer', 'UX Designer', 'Creative Designer', 'Graphic Designer'],
    'Sales': ['Account Executive', 'Business Development', 'Sales Manager'],
    'Marketing': ['Marketing Manager', 'Growth Manager', 'Brand Manager']
  };

  for (const [key, values] of Object.entries(variations)) {
    if (jobTitle.toLowerCase().includes(key.toLowerCase())) {
      return values;
    }
  }

  return [jobTitle];
}

function getRelatedIndustries(industry: string): string[] {
  const related: { [key: string]: string[] } = {
    'Real Estate': ['Construction', 'Property Management', 'Architecture', 'Interior Design'],
    'Technology': ['Software', 'IT Services', 'Consulting', 'Telecommunications'],
    'Finance': ['Banking', 'Investment', 'Insurance', 'Accounting'],
    'Healthcare': ['Medical Devices', 'Pharmaceuticals', 'Biotechnology', 'Health Insurance'],
    'Marketing': ['Advertising', 'Public Relations', 'Digital Marketing', 'Media'],
    'Sales': ['Business Development', 'Account Management', 'Customer Success'],
    'E-commerce': ['Retail', 'Logistics', 'Supply Chain', 'Digital Payments']
  };

  return related[industry] || ['Consulting', 'Services', 'Technology'];
}

function getComplementaryNetworks(network: string): string[] {
  const complementary: { [key: string]: string[] } = {
    'linkedin': ['twitter', 'instagram'],
    'instagram': ['facebook', 'linkedin'],
    'facebook': ['instagram', 'linkedin'],
    'twitter': ['linkedin', 'instagram']
  };

  return complementary[network] || ['linkedin'];
}

function getNearbyLocations(location: string): string[] {
  const nearby: { [key: string]: string[] } = {
    'Lisboa': ['Cascais', 'Sintra', 'Oeiras', 'Almada'],
    'Porto': ['Vila Nova de Gaia', 'Matosinhos', 'Gondomar'],
    'São Paulo': ['Guarulhos', 'Osasco', 'Santo André', 'Campinas'],
    'Rio de Janeiro': ['Niterói', 'São Gonçalo', 'Duque de Caxias'],
    'New York': ['Brooklyn', 'Queens', 'Jersey City', 'Newark'],
    'London': ['Westminster', 'Camden', 'Islington', 'Hackney'],
    'Paris': ['Neuilly', 'Boulogne', 'Versailles']
  };

  return nearby[location] || [];
}

// Função assíncrona para análise (não bloqueia resposta)
async function analyzeUserPatternsAsync(userId: string): Promise<void> {
  try {
    await analyzeUserPatterns(userId);
    console.log('✅ [AI-BRAIN] Análise assíncrona concluída para', userId);
  } catch (error) {
    console.error('❌ [AI-BRAIN] Erro na análise assíncrona:', error);
  }
}

export default app;
