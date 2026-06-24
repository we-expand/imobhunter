import { Hono } from 'npm:hono';
import { filterMockPeople, filterMockCompanies } from './mock-data.ts';
import { getEnv } from './env-helper.ts';

const searchRouter = new Hono();

// 🔍 Endpoint de teste para verificar configuração das APIs
searchRouter.get('/test-apis', async (c) => {
  console.log('🔍 ═══════════════════════════════════════════════════════');
  console.log('🔍 TESTE DE CONFIGURAÇÃO DAS API KEYS');
  console.log('🔍 ═══════════════════════════════════════════════════════');
  
  // 🔥 DEBUG EXTREMO - Mostrar TUDO da variável de ambiente
  const apolloKeyRaw = getEnv('APOLLO_API_KEY');
  console.log('🔥 [DEBUG EXTREMO] Apollo Key RAW:');
  console.log('   - Tipo:', typeof apolloKeyRaw);
  console.log('   - Valor:', apolloKeyRaw);
  console.log('   - Length:', apolloKeyRaw?.length || 0);
  console.log('   - Bytes:', apolloKeyRaw ? new TextEncoder().encode(apolloKeyRaw).length : 0);
  console.log('   - Has spaces?', apolloKeyRaw ? apolloKeyRaw.includes(' ') : false);
  console.log('   - Has newlines?', apolloKeyRaw ? apolloKeyRaw.includes('\n') : false);
  console.log('   - Has tabs?', apolloKeyRaw ? apolloKeyRaw.includes('\t') : false);
  console.log('   - Trimmed length:', apolloKeyRaw?.trim().length || 0);
  console.log('   - Char codes:', apolloKeyRaw ? Array.from(apolloKeyRaw).map(c => c.charCodeAt(0)).join(',') : 'N/A');
  
  const apiStatus: any = {
    apollo: {
      configured: !!apolloKeyRaw,
      keyLength: apolloKeyRaw?.length || 0,
      keyLengthTrimmed: apolloKeyRaw?.trim().length || 0,
      preview: apolloKeyRaw ? apolloKeyRaw.substring(0, 10) + '...' : 'N/A',
      fullKey: apolloKeyRaw, // 🔥 TEMPORÁRIO - REMOVER EM PRODUÇÃO
      valid: false,
      error: null
    },
    pdl: {
      configured: !!getEnv('PDL_API_KEY'),
      keyLength: getEnv('PDL_API_KEY')?.length || 0,
      preview: getEnv('PDL_API_KEY') ? getEnv('PDL_API_KEY')!.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    },
    hunter: {
      configured: !!getEnv('HUNTER_API_KEY'),
      keyLength: getEnv('HUNTER_API_KEY')?.length || 0,
      preview: getEnv('HUNTER_API_KEY') ? getEnv('HUNTER_API_KEY')!.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    },
    clearbit: {
      configured: !!getEnv('CLEARBIT_API_KEY'),
      keyLength: getEnv('CLEARBIT_API_KEY')?.length || 0,
      preview: getEnv('CLEARBIT_API_KEY') ? getEnv('CLEARBIT_API_KEY')!.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    },
    proxycurl: {
      configured: !!getEnv('PROXYCURL_API_KEY'),
      keyLength: getEnv('PROXYCURL_API_KEY')?.length || 0,
      preview: getEnv('PROXYCURL_API_KEY') ? getEnv('PROXYCURL_API_KEY')!.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    },
    rocketreach: {
      configured: !!getEnv('ROCKETREACH_API_KEY'),
      keyLength: getEnv('ROCKETREACH_API_KEY')?.length || 0,
      preview: getEnv('ROCKETREACH_API_KEY') ? getEnv('ROCKETREACH_API_KEY')!.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    },
    lusha: {
      configured: !!getEnv('LUSHA_API_KEY'),
      keyLength: getEnv('LUSHA_API_KEY')?.length || 0,
      preview: getEnv('LUSHA_API_KEY') ? getEnv('LUSHA_API_KEY')!.substring(0, 10) + '...' : 'N/A',
      valid: false,
      error: null
    }
  };

  // Testar Apollo.io com request real
  if (apiStatus.apollo.configured) {
    try {
      const apolloKey = getEnv('APOLLO_API_KEY')!.trim();
      console.log('🧪 Testando Apollo.io...');
      console.log('   Key preview:', apolloKey.substring(0, 15) + '...');
      console.log('   Key length:', apolloKey.length);
      
      // 🔥 TESTE COM ENDPOINT COMPLETO (que retorna dados reais, não ofuscados)
      const testBody = {
        api_key: apolloKey,
        person_titles: ['CEO'],
        per_page: 1,
        reveal_personal_emails: false  // Não revelar para economizar créditos no teste
      };
      
      const testResponse = await fetch('https://api.apollo.io/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(testBody)
      });

      const responseText = await testResponse.text();
      
      if (testResponse.ok) {
        apiStatus.apollo.valid = true;
        console.log('   ✅ Apollo: API key válida!');
        
        // Checar se temos créditos
        try {
          const testData = JSON.parse(responseText);
          console.log('   📊 Apollo credits info:', testData.credits_used);
        } catch (e) {
          // Ignorar erro de parse
        }
      } else {
        apiStatus.apollo.error = `Status ${testResponse.status}: ${responseText}`;
        console.log('   ❌ Apollo: API key inválida');
        console.log('   Response:', responseText);
      }
    } catch (error: any) {
      apiStatus.apollo.error = error.message;
      console.log('   ❌ Apollo: Erro ao testar -', error.message);
    }
  }

  // Testar PDL com request real
  if (apiStatus.pdl.configured) {
    try {
      const pdlKey = getEnv('PDL_API_KEY')!.trim();
      console.log('🧪 Testando PeopleDataLabs...');
      console.log('   Key preview:', pdlKey.substring(0, 15) + '...');
      console.log('   Key length:', pdlKey.length);
      
      const testResponse = await fetch('https://api.peopledatalabs.com/v5/person/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': pdlKey
        },
        body: JSON.stringify({
          query: {
            job_title_role: ['ceo']
          },
          size: 1
        })
      });

      const responseText = await testResponse.text();
      
      if (testResponse.ok) {
        apiStatus.pdl.valid = true;
        console.log('   ✅ PDL: API key válida!');
      } else {
        apiStatus.pdl.error = `Status ${testResponse.status}: ${responseText}`;
        console.log('   ❌ PDL: API key inválida');
        console.log('   Response:', responseText);
      }
    } catch (error: any) {
      apiStatus.pdl.error = error.message;
      console.log('   ❌ PDL: Erro ao testar -', error.message);
    }
  }

  // Testar Hunter.io com request real
  if (apiStatus.hunter.configured) {
    try {
      const hunterKey = getEnv('HUNTER_API_KEY')!.trim();
      console.log('🧪 Testando Hunter.io...');
      console.log('   Key preview:', hunterKey.substring(0, 15) + '...');
      console.log('   Key length:', hunterKey.length);
      
      const testResponse = await fetch(
        `https://api.hunter.io/v2/domain-search?domain=google.com&limit=1&api_key=${hunterKey}`
      );

      const responseText = await testResponse.text();
      
      if (testResponse.ok) {
        apiStatus.hunter.valid = true;
        console.log('   ✅ Hunter: API key válida!');
      } else {
        apiStatus.hunter.error = `Status ${testResponse.status}: ${responseText}`;
        console.log('   ❌ Hunter: API key inválida');
        console.log('   Response:', responseText);
      }
    } catch (error: any) {
      apiStatus.hunter.error = error.message;
      console.log('   ❌ Hunter: Erro ao testar -', error.message);
    }
  }

  Object.entries(apiStatus).forEach(([name, status]: [string, any]) => {
    if (status.configured) {
      if (status.valid) {
        console.log(`   ✅ ${name.toUpperCase()}: VÁLIDA - ${status.preview} (${status.keyLength} chars)`);
      } else {
        console.log(`   ⚠️  ${name.toUpperCase()}: CONFIGURADA MAS INVÁLIDA - ${status.preview} (${status.keyLength} chars)`);
        if (status.error) {
          console.log(`      Erro: ${status.error}`);
        }
      }
    } else {
      console.log(`   ❌ ${name.toUpperCase()}: NÃO CONFIGURADA`);
    }
  });

  console.log('🔍 ═══════════════════════════════════════════════════════');

  // Instruções para configurar
  const instructions = {
    message: 'Para configurar as API keys, siga os passos:',
    steps: [
      '1. Acesse o Supabase Dashboard: https://app.supabase.com',
      '2. Selecione seu projeto',
      '3. Vá em Settings > Edge Functions > Secrets',
      '4. Adicione as seguintes variáveis de ambiente:',
      '',
      '   APOLLO_API_KEY     - Obtenha em: https://app.apollo.io/settings/integrations',
      '   PDL_API_KEY        - Obtenha em: https://dashboard.peopledatalabs.com/api-keys',
      '   HUNTER_API_KEY     - Obtenha em: https://hunter.io/api-keys',
      '   CLEARBIT_API_KEY   - Obtenha em: https://dashboard.clearbit.com/api',
      '   PROXYCURL_API_KEY  - Obtenha em: https://nubela.co/proxycurl/dashboard',
      '   ROCKETREACH_API_KEY- Obtenha em: https://rocketreach.co/api',
      '   LUSHA_API_KEY      - Obtenha em: https://www.lusha.com/api/',
      '',
      '5. IMPORTANTE: Cole a API key EXATAMENTE como fornecida (sem espaços extras)',
      '6. Após adicionar as keys, reinicie as Edge Functions'
    ]
  };

  return c.json({
    success: true,
    apis: apiStatus,
    instructions: instructions,
    summary: {
      total: Object.keys(apiStatus).length,
      configured: Object.values(apiStatus).filter((s: any) => s.configured).length,
      valid: Object.values(apiStatus).filter((s: any) => s.valid).length,
      invalid: Object.values(apiStatus).filter((s: any) => s.configured && !s.valid).length,
      missing: Object.values(apiStatus).filter((s: any) => !s.configured).length
    }
  });
});

// Busca de Pessoas - Integração com múltiplas APIs
searchRouter.post('/people', async (c) => {
  try {
    console.log('🔍 ═══════════════════════════════════════════════════════');
    console.log('🔍 [PEOPLE SEARCH] Recebendo requisição de busca de pessoas');
    
    const body = await c.req.json();
    console.log('🔍 [PEOPLE SEARCH] Body recebido:', JSON.stringify(body, null, 2));
    
    const filters = body.filters || {};
    console.log('🔍 [PEOPLE SEARCH] Filtros extraídos:', JSON.stringify(filters, null, 2));

    // Array para armazenar resultados de todas as APIs
    const allResults: any[] = [];
    const apiErrors: any[] = [];
    const apiSuccess: string[] = [];

    // 1. APOLLO.IO
    console.log('🔍 [PEOPLE SEARCH] Tentando Apollo.io...');
    try {
      const apolloResults = await searchApollo(filters);
      if (apolloResults.length > 0) {
        console.log(`✅ [PEOPLE SEARCH] Apollo retornou ${apolloResults.length} resultados`);
        allResults.push(...apolloResults);
        apiSuccess.push('Apollo.io');
      } else {
        console.log('⚠️ [PEOPLE SEARCH] Apollo não retornou resultados');
        // Adicionar sugestão se a busca foi muito genérica
        if (filters.personName && !filters.jobTitles?.length && !filters.companies?.length && !filters.locations?.length) {
          apiErrors.push({
            api: 'Apollo.io',
            error: 'Nenhum resultado encontrado com os filtros atuais',
            solution: '💡 Dica: Buscar apenas por nome é muito genérico. Adicione filtros como Cargo, Empresa ou Localização para melhores resultados.',
            type: 'no_results'
          });
        }
      }
    } catch (error: any) {
      console.warn('⚠️ [PEOPLE SEARCH] Apollo falhou (esperado se não configurado):', error.message);
      apiErrors.push({
        api: 'Apollo.io',
        error: error.message,
        solution: 'Obtenha uma API key válida em https://app.apollo.io/settings/integrations',
        type: 'api_error'
      });
    }

    // 2. PEOPLEDATALABS
    console.log('🔍 [PEOPLE SEARCH] Tentando PeopleDataLabs...');
    try {
      const pdlResults = await searchPDL(filters);
      if (pdlResults.length > 0) {
        console.log(`✅ [PEOPLE SEARCH] PDL retornou ${pdlResults.length} resultados`);
        allResults.push(...pdlResults);
        apiSuccess.push('PeopleDataLabs');
      } else {
        console.log('⚠️ [PEOPLE SEARCH] PDL não retornou resultados');
        // Adicionar sugestão se busca muito genérica
        if (filters.personName && !filters.jobTitles?.length && !filters.companies?.length && !filters.locations?.length) {
          apiErrors.push({
            api: 'PeopleDataLabs',
            error: 'Nenhum resultado encontrado com os filtros atuais',
            solution: '💡 Dica: PDL funciona melhor com filtros específicos como Cargo ou Setor.',
            type: 'no_results'
          });
        }
      }
    } catch (error: any) {
      console.warn('⚠️ [PEOPLE SEARCH] PDL falhou (esperado se não configurado):', error.message);
      apiErrors.push({
        api: 'PeopleDataLabs',
        error: error.message,
        solution: 'Obtenha uma API key válida em https://dashboard.peopledatalabs.com/api-keys',
        type: 'api_error'
      });
    }

    // 3. HUNTER.IO
    console.log('🔍 [PEOPLE SEARCH] Tentando Hunter.io...');
    try {
      const hunterResults = await searchHunter(filters);
      if (hunterResults.length > 0) {
        console.log(`✅ [PEOPLE SEARCH] Hunter retornou ${hunterResults.length} resultados`);
        allResults.push(...hunterResults);
        apiSuccess.push('Hunter.io');
      } else {
        console.log('⚠️ [PEOPLE SEARCH] Hunter não retornou resultados');
      }
    } catch (error: any) {
      console.warn('⚠️ [PEOPLE SEARCH] Hunter falhou (esperado se não configurado):', error.message);
      apiErrors.push({
        api: 'Hunter.io',
        error: error.message,
        solution: 'Obtenha uma API key válida em https://hunter.io/api-keys'
      });
    }

    console.log(`🔍 [PEOPLE SEARCH] Total de resultados coletados: ${allResults.length}`);
    console.log(`🔍 [PEOPLE SEARCH] APIs com sucesso: ${apiSuccess.join(', ') || 'Nenhuma'}`);
    console.log(`🔍 [PEOPLE SEARCH] APIs com erro: ${apiErrors.length}`);
    
    // 🎭 FALLBACK: Se todas as APIs falharam OU não há filtros, usar dados mock para demonstração
    if (allResults.length === 0) {
      console.log('🎭 [DEMO MODE] ═══════════════════════════════════════');
      console.log('🎭 [DEMO MODE] Nenhum resultado das APIs - Usando dados mock');
      console.log('🎭 [DEMO MODE] Filtros recebidos:', JSON.stringify(filters, null, 2));
      
      // Remover searchType dos filtros antes de passar para mock
      const { searchType, ...cleanFilters } = filters;
      console.log('🎭 [DEMO MODE] Filtros limpos (sem searchType):', JSON.stringify(cleanFilters, null, 2));
      
      const mockResults = filterMockPeople(cleanFilters);
      console.log(`🎭 [DEMO MODE] ${mockResults.length} leads mock retornados`);
      
      if (mockResults.length > 0) {
        console.log('🎭 [DEMO MODE] Primeiros 3 leads:', JSON.stringify(mockResults.slice(0, 3), null, 2));
        allResults.push(...mockResults);
      } else {
        console.log('⚠️ [DEMO MODE] Nenhum lead mock corresponde aos filtros - Retornando todos');
        allResults.push(...filterMockPeople({})); // Retornar TODOS se não houver correspondência
      }
      
      console.log('🎭 [DEMO MODE] ═══════════════════════════════════════');
    }
    
    console.log('🔍 ═══════════════════════════════════════════════════════');

    // Remover duplicados
    const uniqueResults = deduplicateResults(allResults);
    console.log(`🔍 [PEOPLE SEARCH] Antes da deduplicação: ${allResults.length} leads`);
    console.log(`🔍 [PEOPLE SEARCH] Após deduplicação: ${uniqueResults.length} leads únicos`);
    
    // Se perdemos muitos leads na deduplicação, logar quais foram removidos
    if (allResults.length - uniqueResults.length > 2) {
      console.warn(`⚠️ [PEOPLE SEARCH] ${allResults.length - uniqueResults.length} leads duplicados foram removidos!`);
    }

    // Contar apenas APIs reais (não mock) como working
    const realWorkingApis = apiSuccess.filter(api => api !== 'Demo Data (Mock)').length;

    return c.json({
      success: true,
      results: uniqueResults,
      total: uniqueResults.length,
      sources: {
        apollo: uniqueResults.filter(r => r.source === 'apollo').length,
        pdl: uniqueResults.filter(r => r.source === 'pdl').length,
        hunter: uniqueResults.filter(r => r.source === 'hunter').length,
        demo: uniqueResults.filter(r => r.source === 'demo').length
      },
      apiStatus: {
        apiSuccess: apiSuccess,
        errors: apiErrors,
        totalApis: 3,
        workingApis: realWorkingApis,
        failedApis: apiErrors.length
      }
    });
  } catch (error: any) {
    console.error('❌ [PEOPLE SEARCH] Erro geral:', error);
    console.log('🔍 ═══════════════════════════════════════════════════════');
    return c.json({ 
      success: false, 
      error: error.message,
      results: [],
      message: 'Erro ao processar a busca. Verifique os logs para mais detalhes.'
    }, 500);
  }
});

// Busca de Empresas
searchRouter.post('/companies', async (c) => {
  try {
    const body = await c.req.json();
    const { filters } = body;

    console.log('🏢 Iniciando busca de empresas com filtros:', filters);

    const results: any[] = [];
    const errors: string[] = [];

    // 1. CLEARBIT API
    if (getEnv('CLEARBIT_API_KEY')) {
      try {
        console.log('📡 Consultando Clearbit...');
        const clearbitResults = await searchClearbit(filters);
        results.push(...clearbitResults);
      } catch (error) {
        console.error('❌ Erro Clearbit:', error);
        errors.push(`Clearbit: ${error.message}`);
      }
    }

    // 2. APOLLO.IO API (Companies)
    if (getEnv('APOLLO_API_KEY')) {
      try {
        console.log('📡 Consultando Apollo.io (empresas)...');
        const apolloResults = await searchApolloCompanies(filters);
        results.push(...apolloResults);
      } catch (error) {
        console.error('❌ Erro Apollo:', error);
        errors.push(`Apollo: ${error.message}`);
      }
    }

    const uniqueResults = deduplicateCompanies(results);

    console.log(`✅ Busca concluída: ${uniqueResults.length} empresas encontradas`);

    return c.json({
      success: true,
      results: uniqueResults,
      total: uniqueResults.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Erro geral na busca de empresas:', error);
    return c.json({
      success: false,
      error: error.message,
      results: []
    }, 500);
  }
});

// ==================== FUNÇÕES DE INTEGRAÇÃO COM APIs ====================

// APOLLO.IO - Busca de Pessoas
async function searchApollo(filters: any) {
  const apiKey = getEnv('APOLLO_API_KEY')?.trim();
  
  // 🔍 DEBUG DETALHADO
  console.log('🔍 [APOLLO DEBUG] ═══════════════════════════════════');
  console.log('🔍 [APOLLO DEBUG] API Key configurada?', !!apiKey);
  if (apiKey) {
    console.log('🔍 [APOLLO DEBUG] API Key length:', apiKey.length);
    console.log('🔍 [APOLLO DEBUG] API Key preview:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
  } else {
    console.log('❌ [APOLLO DEBUG] API Key NÃO ENCONTRADA nas variáveis de ambiente!');
  }
  console.log('🔍 [APOLLO DEBUG] ═══════════════════════════════════');
  
  if (!apiKey) return [];

  // 🔥 CORREÇÃO: Apollo tem 2 endpoints:
  // - /api/v1/mixed_people/api_search → DADOS OFUSCADOS (gratuito, header auth)
  // - /api/v1/mixed_people/search → DADOS COMPLETOS (pago, body auth, consome créditos)
  
  // Vamos usar o endpoint COMPLETO com body JSON
  const requestBody: any = {
    api_key: apiKey,
    page: 1,
    per_page: 25,
    // 🔥 IMPORTANTE: Revelar emails pessoais (consome créditos)
    reveal_personal_emails: true,
    reveal_phone_number: true
  };

  // Mapear filtros para formato Apollo
  if (filters.personName) {
    requestBody.q_keywords = filters.personName;
  }
  
  if (filters.jobTitles && filters.jobTitles.length > 0) {
    requestBody.person_titles = filters.jobTitles;
  }
  
  if (filters.seniority && filters.seniority.length > 0) {
    // Mapear níveis de senioridade para formato Apollo
    const seniorityMap: any = {
      'Entry level': 'entry',
      'Associate': 'associate',
      'Mid-Senior level': 'senior',
      'Director': 'director',
      'Executive': 'vp',
      'C-Level': 'c_suite'
    };
    requestBody.person_seniorities = filters.seniority.map(
      (s: string) => seniorityMap[s] || s.toLowerCase()
    );
  }
  
  if (filters.locations && filters.locations.length > 0) {
    requestBody.person_locations = filters.locations;
  }
  
  if (filters.keywords && filters.keywords.length > 0) {
    requestBody.q_keywords = filters.keywords.join(' OR ');
  }

  if (filters.companySize && filters.companySize.length > 0) {
    requestBody.organization_num_employees_ranges = filters.companySize;
  }

  // 🔥 ENDPOINT CORRETO: /v1/mixed_people/search (não /api/v1/mixed_people/api_search)
  const url = 'https://api.apollo.io/v1/mixed_people/search';
  console.log('📤 Apollo URL:', url);
  console.log('📤 Apollo Request Body:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
      // 🔥 NÃO usar x-api-key no header - API key vai no body!
    },
    body: JSON.stringify(requestBody)
  });

  const responseText = await response.text();
  console.log('📥 Apollo response status:', response.status);
  
  if (!response.ok) {
    // 401 é esperado quando a API key é inválida ou não está configurada
    if (response.status === 401) {
      console.warn('⚠️ [APOLLO] API key inválida ou expirada (esperado se não configurado corretamente)');
      console.warn('💡 [APOLLO] Sistema funcionará em modo demonstração com dados mock');
    } else if (response.status === 422) {
      console.warn('⚠️ [APOLLO] Erro 422 - Possivelmente sem créditos ou plano insuficiente');
      console.warn('📄 Response:', responseText);
    } else {
      console.warn(`⚠️ [APOLLO] API retornou status ${response.status}:`, responseText);
    }
    throw new Error(`Apollo API não disponível (status ${response.status})`);
  }

  const data = JSON.parse(responseText);
  console.log(`📊 Apollo retornou ${data.people?.length || 0} pessoas de ${data.pagination?.total_entries || 0} total`);
  
  if (!data.people || data.people.length === 0) {
    return [];
  }
  
  // 🔥 PROCESSAR dados - agora devem vir COMPLETOS
  return data.people.map((person: any) => {
    // Construir nome completo
    const fullName = person.name || 
      `${person.first_name || ''} ${person.last_name || ''}`.trim();
    
    return {
      source: 'apollo',
      name: fullName,
      firstName: person.first_name,
      lastName: person.last_name || '',  // Agora deve vir completo, não ofuscado
      title: person.title || 'N/A',
      company: person.organization?.name,
      // 🔥 Agora emails e phones devem vir COMPLETOS
      email: person.email || (person.email_status === 'verified' ? person.email : null),
      phone: person.phone_numbers && person.phone_numbers.length > 0 
        ? person.phone_numbers[0].sanitized_number || person.phone_numbers[0].raw_number
        : null,
      linkedinUrl: person.linkedin_url,
      location: [person.city, person.state, person.country].filter(Boolean).join(', '),
      city: person.city,
      state: person.state,
      country: person.country,
      seniority: person.seniority,
      photo: person.photo_url,
      headline: person.headline,
      // Metadados adicionais
      _meta: {
        emailStatus: person.email_status,
        lastRefreshed: person.last_refreshed_at,
        apolloId: person.id
      }
    };
  });
}

// PEOPLEDATALABS (PDL)
async function searchPDL(filters: any) {
  const apiKey = getEnv('PDL_API_KEY')?.trim();
  if (!apiKey) return [];

  // PDL usa endpoint de search, não SQL para busca básica
  const payload: any = {
    query: {},
    size: 25
  };

  // Construir query object para PDL
  if (filters.jobTitles && filters.jobTitles.length > 0) {
    payload.query.job_title_role = filters.jobTitles;
  }

  if (filters.locations && filters.locations.length > 0) {
    payload.query.location_country = filters.locations;
  }

  if (filters.industries && filters.industries.length > 0) {
    payload.query.industry = filters.industries;
  }

  if (filters.companyName) {
    payload.query.job_company_name = filters.companyName;
  }

  console.log('📤 PDL payload:', JSON.stringify(payload, null, 2));

  const response = await fetch('https://api.peopledatalabs.com/v5/person/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  console.log('📥 PDL response status:', response.status);

  if (!response.ok) {
    // 401 é esperado quando a API key é inválida ou não está configurada
    if (response.status === 401) {
      console.warn('⚠️ [PDL] API key inválida ou expirada (esperado se não configurado corretamente)');
      console.warn('💡 [PDL] Sistema funcionará em modo demonstração com dados mock');
    } else {
      console.warn(`⚠️ [PDL] API retornou status ${response.status}:`, responseText);
    }
    throw new Error(`PDL API não disponível (status ${response.status})`);
  }

  const data = JSON.parse(responseText);
  console.log(`📊 PDL retornou ${data.data?.length || 0} pessoas`);

  if (!data.data || data.data.length === 0) {
    return [];
  }

  return data.data.map((person: any) => ({
    source: 'pdl',
    name: person.full_name,
    firstName: person.first_name,
    lastName: person.last_name,
    title: person.job_title,
    company: person.job_company_name,
    email: person.emails?.[0]?.address,
    phone: person.phone_numbers?.[0],
    linkedinUrl: person.linkedin_url,
    location: person.location_name,
    seniority: person.job_title_levels?.[0],
    skills: person.skills
  }));
}

// HUNTER.IO
async function searchHunter(filters: any) {
  const apiKey = getEnv('HUNTER_API_KEY');
  if (!apiKey) return [];

  // Hunter é melhor para encontrar emails de domínios específicos
  if (!filters.companyName) return [];

  const response = await fetch(
    `https://api.hunter.io/v2/domain-search?domain=${filters.companyName}&api_key=${apiKey}`
  );

  if (!response.ok) {
    // Avisos amigáveis para erros de Hunter
    if (response.status === 401) {
      console.warn('⚠️ [HUNTER] API key inválida ou expirada (esperado se não configurado corretamente)');
      console.warn('💡 [HUNTER] Sistema funcionará em modo demonstração com dados mock');
    } else {
      console.warn(`⚠️ [HUNTER] API retornou status ${response.status}`);
    }
    throw new Error(`Hunter API não disponível (status ${response.status})`);
  }

  const data = await response.json();

  return (data.data?.emails || []).map((email: any) => ({
    source: 'hunter',
    name: `${email.first_name} ${email.last_name}`,
    firstName: email.first_name,
    lastName: email.last_name,
    title: email.position,
    email: email.value,
    company: filters.companyName,
    linkedinUrl: email.linkedin,
    phone: email.phone_number
  }));
}

// PROXYCURL (LinkedIn Data)
async function searchProxycurl(filters: any) {
  const apiKey = getEnv('PROXYCURL_API_KEY');
  if (!apiKey) return [];

  // Proxycurl requer LinkedIn URLs ou busca específica
  // Aqui implementamos busca por empresa ou título
  const params = new URLSearchParams();
  
  if (filters.companyName) {
    params.append('current_company_name', filters.companyName);
  }
  if (filters.jobTitles && filters.jobTitles.length > 0) {
    params.append('current_role_title', filters.jobTitles[0]);
  }
  if (filters.locations && filters.locations.length > 0) {
    params.append('country', filters.locations[0]);
  }

  const response = await fetch(
    `https://nubela.co/proxycurl/api/linkedin/profile?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Proxycurl API error: ${response.status}`);
  }

  const data = await response.json();

  return [{
    source: 'proxycurl',
    name: `${data.first_name} ${data.last_name}`,
    firstName: data.first_name,
    lastName: data.last_name,
    title: data.headline,
    company: data.company,
    location: data.city,
    linkedinUrl: data.linkedin_url,
    summary: data.summary,
    experiences: data.experiences
  }];
}

// CLEARBIT - Busca de Empresas
async function searchClearbit(filters: any) {
  const apiKey = getEnv('CLEARBIT_API_KEY');
  if (!apiKey) return [];

  const params = new URLSearchParams();
  
  if (filters.companyName) {
    params.append('query', filters.companyName);
  }

  const response = await fetch(
    `https://company.clearbit.com/v2/companies/find?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Clearbit API error: ${response.status}`);
  }

  const data = await response.json();

  return [{
    source: 'clearbit',
    name: data.name,
    domain: data.domain,
    industry: data.category?.industry,
    employees: data.metrics?.employees,
    location: `${data.geo?.city}, ${data.geo?.country}`,
    description: data.description,
    logo: data.logo,
    website: data.domain
  }];
}

// APOLLO.IO - Busca de Empresas
async function searchApolloCompanies(filters: any) {
  const apiKey = getEnv('APOLLO_API_KEY');
  if (!apiKey) return [];

  const payload: any = {
    api_key: apiKey,
    page: 1,
    per_page: 25
  };

  if (filters.companyName) {
    payload.q_organization_name = filters.companyName;
  }
  if (filters.companyIndustry) {
    payload.organization_industry_tag_ids = [filters.companyIndustry];
  }

  const response = await fetch('https://api.apollo.io/v1/mixed_companies/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Apollo API (companies) error: ${response.status}`);
  }

  const data = await response.json();

  return (data.organizations || []).map((org: any) => ({
    source: 'apollo',
    name: org.name,
    domain: org.website_url,
    industry: org.industry,
    employees: org.estimated_num_employees,
    location: `${org.city}, ${org.country}`,
    description: org.short_description,
    logo: org.logo_url,
    website: org.website_url
  }));
}

// Função para remover duplicados
function deduplicateResults(results: any[]) {
  const seen = new Set();
  return results.filter((item) => {
    const key = item.email || item.linkedinUrl || `${item.name}_${item.company}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function deduplicateCompanies(results: any[]) {
  const seen = new Set();
  return results.filter((item) => {
    const key = item.domain || item.name;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export default searchRouter;