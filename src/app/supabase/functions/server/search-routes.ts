console.log('[search-routes] Iniciando imports...');

import { Hono } from 'npm:hono';
console.log('[search-routes] ✅ Hono importado');

import {
  enrichCompanyData,
  enrichPersonData,
  advancedWebSearch,
  searchNews,
  detectTechnologies,
} from './web-search-service.ts';
console.log('[search-routes] ✅ web-search-service importado');

import { generateDemoLeads } from './demo-leads-generator.ts';
console.log('[search-routes] ✅ demo-leads-generator importado');

import * as kvStore from './kv_store.tsx';
console.log('[search-routes] ✅ kv_store importado');

import { detectSeniority, calculateExperience, calculateMatchScore } from './lead-helpers.ts';
console.log('[search-routes] ✅ lead-helpers importado');

console.log('[search-routes] Criando app Hono...');
const app = new Hono();
console.log('[search-routes] ✅ App criado, configurando rotas...');

// 🔥 ROTA: Configuração de API Keys
// Montada como: /make-server-9e4b8b7c/search/config/api-keys (via index.tsx)
app.post('/config/api-keys', async (c) => {
  try {
    console.log('📡 Rota /config/api-keys chamada (POST)');
    
    const body = await c.req.json();
    console.log('📦 Body recebido:', JSON.stringify(body, null, 2));
    
    const { apolloKey, hunterKey, pdlKey, rocketKey, proxycurlKey } = body;
    
    console.log('🔧 Salvando API Keys no KV Store...');
    
    // Salva as keys no KV store (persistente)
    const updates: any = {};
    if (apolloKey !== undefined) updates['api_key_apollo'] = apolloKey;
    if (hunterKey !== undefined) updates['api_key_hunter'] = hunterKey;
    if (pdlKey !== undefined) updates['api_key_pdl'] = pdlKey;
    if (rocketKey !== undefined) updates['api_key_rocketreach'] = rocketKey;
    if (proxycurlKey !== undefined) updates['api_key_proxycurl'] = proxycurlKey;
    
    console.log('💾 Updates para salvar:', Object.keys(updates));
    
    if (Object.keys(updates).length > 0) {
      // 🔥 FIX: mset espera dois arrays (keys, values), não um objeto!
      const keys = Object.keys(updates);
      const values = Object.values(updates);
      
      console.log('🔑 Keys:', keys);
      console.log('📦 Values:', values.map(v => typeof v === 'string' ? v.substring(0, 8) + '...' : v));
      
      await kvStore.mset(keys, values);
      console.log('✅ API Keys salvas com sucesso no KV Store!');
    } else {
      console.log('⚠️ Nenhuma key para salvar');
    }
    
    console.log('📤 Enviando resposta de sucesso...');
    
    return c.json({
      success: true,
      message: 'API Keys atualizadas com sucesso!'
    });
  } catch (error) {
    console.error('❌ Erro ao salvar API Keys:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'N/A');
    
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// 🔥 ROTA: Buscar API Keys (apenas primeiros 8 caracteres para segurança)
// Montada como: /make-server-9e4b8b7c/search/config/api-keys (via index.tsx)
app.get('/config/api-keys', async (c) => {
  try {
    console.log('📖 Buscando API Keys...');
    
    // 🔥 FIX: Buscar uma por uma para garantir que pegamos o valor certo
    const apolloKey = await kvStore.get('api_key_apollo');
    const hunterKey = await kvStore.get('api_key_hunter');
    const pdlKey = await kvStore.get('api_key_pdl');
    const rocketKey = await kvStore.get('api_key_rocketreach');
    const proxycurlKey = await kvStore.get('api_key_proxycurl');
    
    console.log('📦 Keys encontradas:');
    console.log('   Apollo:', apolloKey ? apolloKey.substring(0, 8) + '...' : 'null');
    console.log('   Hunter:', hunterKey ? hunterKey.substring(0, 8) + '...' : 'null');
    console.log('   PDL:', pdlKey ? pdlKey.substring(0, 8) + '...' : 'null');
    console.log('   RocketReach:', rocketKey ? rocketKey.substring(0, 8) + '...' : 'null');
    console.log('   Proxycurl:', proxycurlKey ? proxycurlKey.substring(0, 8) + '...' : 'null');
    
    return c.json({
      success: true,
      keys: {
        apollo: apolloKey ? apolloKey.substring(0, 8) + '...' : null,
        hunter: hunterKey ? hunterKey.substring(0, 8) + '...' : null,
        pdl: pdlKey ? pdlKey.substring(0, 8) + '...' : null,
        rocketreach: rocketKey ? rocketKey.substring(0, 8) + '...' : null,
        proxycurl: proxycurlKey ? proxycurlKey.substring(0, 8) + '...' : null,
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar API Keys:', error);
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'N/A');
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// 🔥 ROTA: Testar status das APIs (diagnóstico)
// Montada como: /make-server-9e4b8b7c/search/test-apis (via index.tsx)
app.get('/test-apis', async (c) => {
  try {
    console.log('🧪 Iniciando teste de APIs...');
    
    // 🔥 FIX: Buscar uma por uma do KV Store
    const kvApolloKey = await kvStore.get('api_key_apollo');
    const kvHunterKey = await kvStore.get('api_key_hunter');
    const kvPdlKey = await kvStore.get('api_key_pdl');
    const kvRocketKey = await kvStore.get('api_key_rocketreach');
    const kvRapidApiKey = await kvStore.get('api_key_rapidapi');
    const kvLushaKey = await kvStore.get('api_key_lusha');
    const kvProxycurlKey = await kvStore.get('api_key_proxycurl');
    
    console.log('📦 Keys do KV Store:');
    console.log('   Apollo:', kvApolloKey ? kvApolloKey.substring(0, 8) + '...' : 'null');
    console.log('   Hunter:', kvHunterKey ? kvHunterKey.substring(0, 8) + '...' : 'null');
    console.log('   PDL:', kvPdlKey ? 'configurada' : 'null');
    console.log('   RocketReach:', kvRocketKey ? 'configurada' : 'null');
    console.log('   RapidAPI:', kvRapidApiKey ? kvRapidApiKey.substring(0, 8) + '...' : 'null');
    console.log('   Lusha:', kvLushaKey ? kvLushaKey.substring(0, 8) + '...' : 'null');
    console.log('   Proxycurl:', kvProxycurlKey ? kvProxycurlKey.substring(0, 8) + '...' : 'null');
    
    // Fallback para Environment Variables
    let apolloKey = kvApolloKey || Deno.env.get('APOLLO_API_KEY');
    let hunterKey = kvHunterKey || Deno.env.get('HUNTER_API_KEY');
    let pdlKey = kvPdlKey || Deno.env.get('PDL_API_KEY');
    let rocketKey = kvRocketKey || Deno.env.get('ROCKETREACH_API_KEY');
    let rapidApiKey = kvRapidApiKey || Deno.env.get('RAPIDAPI_KEY');
    let lushaKey = kvLushaKey || Deno.env.get('LUSHA_API_KEY');
    let proxycurlKey = kvProxycurlKey || Deno.env.get('PROXYCURL_API_KEY');
    
    const apiStatus = {
      apollo: {
        configured: !!(apolloKey && apolloKey !== 'YOUR_APOLLO_API_KEY'),
        key_preview: apolloKey ? apolloKey.substring(0, 8) + '...' : null,
        status: 'unknown'
      },
      hunter: {
        configured: !!(hunterKey && hunterKey !== 'YOUR_HUNTER_API_KEY'),
        key_preview: hunterKey ? hunterKey.substring(0, 8) + '...' : null,
        status: 'unknown'
      },
      rapidapi: {
        configured: !!(rapidApiKey && rapidApiKey !== 'YOUR_RAPIDAPI_KEY'),
        key_preview: rapidApiKey ? rapidApiKey.substring(0, 8) + '...' : null,
        status: 'unknown'
      },
      lusha: {
        configured: !!(lushaKey && lushaKey !== 'YOUR_LUSHA_API_KEY'),
        key_preview: lushaKey ? lushaKey.substring(0, 8) + '...' : null,
        status: 'unknown'
      },
      pdl: {
        configured: !!(pdlKey && pdlKey !== 'YOUR_PDL_API_KEY'),
        key_preview: pdlKey ? pdlKey.substring(0, 8) + '...' : null,
        status: 'unknown'
      },
      rocketreach: {
        configured: !!(rocketKey && rocketKey !== 'YOUR_ROCKETREACH_API_KEY'),
        key_preview: rocketKey ? rocketKey.substring(0, 8) + '...' : null,
        status: 'unknown'
      },
      proxycurl: {
        configured: !!(proxycurlKey && proxycurlKey !== 'YOUR_PROXYCURL_API_KEY'),
        key_preview: proxycurlKey ? proxycurlKey.substring(0, 8) + '...' : null,
        status: 'unknown'
      }
    };
    
    console.log('📊 Status das APIs:');
    console.log(JSON.stringify(apiStatus, null, 2));
    
    return c.json({
      success: true,
      apis: apiStatus,
      message: 'Diagnóstico completo'
    });
    
  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error);
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'N/A');
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// 📧 ROTA: Enviar resultados de busca por email
// Montada como: /make-server-9e4b8b7c/search/send-results-email (via index.tsx)
app.post('/send-results-email', async (c) => {
  try {
    const body = await c.req.json();
    const { email, results, filters } = body;
    
    if (!email) {
      return c.json({
        success: false,
        error: 'Email não fornecido'
      }, 400);
    }
    
    console.log(`📧 Enviando resultados para: ${email}`);
    console.log(`📊 Total de leads: ${results?.length || 0}`);
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY não configurada!');
      return c.json({
        success: false,
        error: 'RESEND_API_KEY não configurada. Configure a chave nas variáveis de ambiente do Supabase.'
      }, 500);
    }
    
    // Validação básica do formato da API key
    if (!resendApiKey.startsWith('re_')) {
      console.error('❌ RESEND_API_KEY tem formato inválido! Deve começar com "re_"');
      return c.json({
        success: false,
        error: 'RESEND_API_KEY inválida. A chave deve começar com "re_". Obtenha uma nova em https://resend.com/api-keys'
      }, 500);
    }
    
    console.log('✅ RESEND_API_KEY configurada:', resendApiKey.substring(0, 10) + '...');
    
    // Cria HTML do email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resultados da Busca</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Resultados da Busca</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Lead Generation Platform</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #667eea; margin-top: 0;">📊 Resumo</h2>
    <p><strong>Total de Leads:</strong> ${results?.length || 0}</p>
    <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
    ${filters?.fullName ? `<p><strong>Nome pesquisado:</strong> ${filters.fullName}</p>` : ''}
    ${filters?.currentCompany ? `<p><strong>Empresa:</strong> ${filters.currentCompany}</p>` : ''}
    ${filters?.currentTitle ? `<p><strong>Cargo:</strong> ${filters.currentTitle}</p>` : ''}
  </div>
  
  <h2 style="color: #667eea;">👥 Leads Encontrados</h2>
  
  ${results?.slice(0, 10).map((lead: any, index: number) => `
    <div style="background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
      <div style="display: flex; align-items: start; gap: 15px;">
        <img src="${lead.avatar}" alt="${lead.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
        <div style="flex: 1;">
          <h3 style="margin: 0 0 5px 0; color: #333; font-size: 18px;">${lead.name}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
            <strong>${lead.title}</strong> @ ${lead.company}
          </p>
          <p style="margin: 0 0 8px 0; color: #999; font-size: 13px;">
            📍 ${lead.location}
          </p>
          ${lead.email ? `<p style="margin: 0 0 5px 0; color: #667eea; font-size: 14px;">
            📧 <a href="mailto:${lead.email}" style="color: #667eea;">${lead.email}</a>
          </p>` : ''}
          ${lead.phone ? `<p style="margin: 0 0 5px 0; color: #667eea; font-size: 14px;">
            📞 ${lead.phone}
          </p>` : ''}
          ${lead.linkedinUrl ? `<p style="margin: 0; font-size: 13px;">
            <a href="${lead.linkedinUrl}" style="color: #0077b5; text-decoration: none;">🔗 Ver no LinkedIn</a>
          </p>` : ''}
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e9ecef;">
            <span style="background: #667eea; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">
              Match: ${lead.matchScore}%
            </span>
            <span style="background: #f8f9fa; color: #666; padding: 3px 10px; border-radius: 12px; font-size: 11px; margin-left: 8px;">
              Fonte: ${lead.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  `).join('')}
  
  ${results?.length > 10 ? `
    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
      <p style="margin: 0; color: #856404;">
        <strong>+${results.length - 10} leads adicionais</strong> encontrados. 
        Acesse a plataforma para ver todos os resultados.
      </p>
    </div>
  ` : ''}
  
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
    <p style="margin: 0; color: #666; font-size: 13px;">
      Este email foi gerado automaticamente pela plataforma de Lead Generation.
    </p>
  </div>
</body>
</html>
    `.trim();
    
    // Envia email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lead Generation <onboarding@resend.dev>',
        to: [email],
        subject: `🎯 ${results?.length || 0} Leads Encontrados - Lead Generation Platform`,
        html: htmlContent,
      }),
    });
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('❌ Erro ao enviar email:', errorText);
      return c.json({
        success: false,
        error: `Erro ao enviar email: ${errorText}`
      }, 500);
    }
    
    const resendData = await resendResponse.json();
    console.log('✅ Email enviado com sucesso!', resendData);
    
    return c.json({
      success: true,
      message: 'Email enviado com sucesso!',
      emailId: resendData.id
    });
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// 🔥 ROTA: Buscar pessoas
// Montada como: /make-server-9e4b8b7c/search/people (via index.tsx)
app.post('/people', async (c) => {
  try {
    const body = await c.req.json();
    
    // 🔥 PRIORIDADE 1: Buscar API Keys do KV Store (configuradas na UI)
    console.log('📡 Buscando API Keys do KV Store...');
    const kvApolloKey = await kvStore.get('api_key_apollo');
    const kvHunterKey = await kvStore.get('api_key_hunter');
    const kvPdlKey = await kvStore.get('api_key_pdl');
    const kvRocketKey = await kvStore.get('api_key_rocketreach');
    const kvRapidApiKey = await kvStore.get('api_key_rapidapi');
    const kvLushaKey = await kvStore.get('api_key_lusha');
    const kvProxycurlKey = await kvStore.get('api_key_proxycurl');
    
    // 🔥 PRIORIDADE 2: Fallback para Environment Variables (se não existir no KV)
    let apolloKey = kvApolloKey || Deno.env.get('APOLLO_API_KEY');
    let hunterKey = kvHunterKey || Deno.env.get('HUNTER_API_KEY');
    let pdlKey = kvPdlKey || Deno.env.get('PDL_API_KEY');
    let rocketKey = kvRocketKey || Deno.env.get('ROCKETREACH_API_KEY');
    let rapidApiKey = kvRapidApiKey || Deno.env.get('RAPIDAPI_KEY');
    let lushaKey = kvLushaKey || Deno.env.get('LUSHA_API_KEY');
    let proxycurlKey = kvProxycurlKey || Deno.env.get('PROXYCURL_API_KEY');
    
    // 🔥 LOG DE DIAGNÓSTICO (sem expor as keys completas)
    console.log('🔑 API Keys Status:');
    console.log(`   Apollo: ${apolloKey ? '✅ Configurada (' + apolloKey.substring(0, 8) + '...)' : '❌ Não configurada'}`);
    console.log(`   Hunter: ${hunterKey ? '✅ Configurada (' + hunterKey.substring(0, 8) + '...)' : '❌ Não configurada'}`);
    console.log(`   PDL: ${pdlKey ? '✅ Configurada' : '❌ Não configurada'}`);
    console.log(`   RocketReach: ${rocketKey ? '✅ Configurada' : '❌ Não configurada'}`);
    console.log(`   RapidAPI (LinkedIn): ${rapidApiKey ? '✅ Configurada (' + rapidApiKey.substring(0, 8) + '...)' : '❌ Não configurada'}`);
    console.log(`   Lusha: ${lushaKey ? '✅ Configurada (' + lushaKey.substring(0, 8) + '...)' : '❌ Não configurada'}`);
    console.log(`   Proxycurl: ${proxycurlKey ? '✅ Configurada (' + proxycurlKey.substring(0, 8) + '...)' : '❌ Não configurada'}`);
    console.log('');
    
    // 🔥 VALIDAÇÃO: Se nenhuma API configurada, retorna DEMO imediatamente
    const hasAnyApi = apolloKey || hunterKey || pdlKey || rocketKey || rapidApiKey || lushaKey || proxycurlKey;
    
    if (!hasAnyApi) {
      console.log('❌ MOTIVO: NENHUMA API KEY CONFIGURADA!');
      console.log('');
      console.log('📝 AÇÃO NECESSÁRIA:');
      console.log('   1. Acesse o Dashboard do Supabase');
      console.log('   2. Vá em Edge Functions → Secrets');
      console.log('   3. Configure as seguintes variáveis:');
      console.log('      - APOLLO_API_KEY');
      console.log('      - HUNTER_API_KEY');
      console.log('      - PDL_API_KEY');
      console.log('      - ROCKETREACH_API_KEY');
      console.log('      - PROXYCURL_API_KEY');
      console.log('');
      console.log('⚠️ Retornando dados DEMO...');
      const mockResults = generateDemoLeads({
        currentTitle,
        currentCompany,
        city,
        country,
        industry,
        seniority,
        limit
      });
      
      return c.json({
        success: true,
        results: mockResults,
        total: mockResults.length,
        sources: ['demo'],
        message: '❌ NENHUMA API KEY CONFIGURADA - Configure as API keys no Supabase Dashboard → Edge Functions → Secrets'
      });
    }

    const {
      firstName,
      lastName,
      fullName, // NOVO: Nome completo
      currentTitle,
      currentCompany,
      city,
      country,
      industry,
      seniority,
      keywords,
      hasEmail,
      hasPhone,
      limit = 25
    } = body;

    // 🔥 Se fullName foi fornecido, divide em firstName e lastName automaticamente
    let searchFirstName = firstName;
    let searchLastName = lastName;
    let searchKeywords = keywords;
    
    if (fullName && fullName.trim()) {
      const nameParts = fullName.trim().split(' ');
      if (nameParts.length >= 2) {
        searchFirstName = nameParts[0];
        searchLastName = nameParts.slice(1).join(' ');
        console.log(`📝 Nome completo detectado: "${fullName}" → Primeiro: "${searchFirstName}", Sobrenome: "${searchLastName}"`);
      } else {
        // Se só tem 1 palavra, adiciona às keywords para busca mais ampla
        searchKeywords = fullName;
        console.log(`📝 Nome único detectado: "${fullName}" → Adicionado às keywords`);
      }
    }

    const results: any[] = [];

    // 🔥 LOG DETALHADO DOS FILTROS RECEBIDOS
    console.log('');
    console.log('🔍 ═══════════════════════════════════════════════════════');
    console.log('🔍 FILTROS RECEBIDOS PARA BUSCA:');
    console.log('🔍 ═══════════════════════════════════════════════════════');
    console.log(`   📝 Nome Completo: ${fullName || 'N/A'}`);
    console.log(`   👤 Primeiro Nome: ${searchFirstName || 'N/A'}`);
    console.log(`   👤 Sobrenome: ${searchLastName || 'N/A'}`);
    console.log(`   💼 Cargo: ${currentTitle || 'N/A'}`);
    console.log(`   🏢 Empresa: ${currentCompany || 'N/A'}`);
    console.log(`   🌆 Cidade: ${city || 'N/A'}`);
    console.log(`   🌍 País: ${country ? country.join(', ') : 'N/A'}`);
    console.log(`   🏭 Indústria: ${industry ? industry.join(', ') : 'N/A'}`);
    console.log(`   📊 Senioridade: ${seniority ? seniority.join(', ') : 'N/A'}`);
    console.log(`   🔑 Keywords: ${searchKeywords || 'N/A'}`);
    console.log(`   📧 Somente com Email: ${hasEmail ? 'SIM' : 'NÃO'}`);
    console.log(`   📞 Somente com Telefone: ${hasPhone ? 'SIM' : 'NÃO'}`);
    console.log(`   📊 Limite: ${limit}`);
    console.log('🔍 ═══════════════════════════════════════════════════════');
    console.log('');

    // 1️⃣ APOLLO.IO - API principal para busca de pessoas
    if (apolloKey && apolloKey !== 'YOUR_APOLLO_API_KEY') {
      try {
        console.log('📡 Buscando no Apollo.io...');
        
        // 🔥 CONSTRUIR PAYLOAD EXATO COMO LINKEDIN
        const apolloPayload: any = {
          // Configurações
          page: 1,
          per_page: Math.min(limit, 25),
          
          // Retornar contatos quando disponíveis
          reveal_personal_emails: hasEmail || false,
          reveal_phone_number: hasPhone || false,
        };
        
        // 🔥 NOME - Prioridade máxima (BUSCA EXATA E RESTRITIVA!)
        if (searchFirstName || searchLastName || fullName) {
          const fullNameSearch = fullName || [searchFirstName, searchLastName].filter(Boolean).join(' ');
          // 🔥 USAR BUSCA EXATA DE NOME (não person_names que é amplo demais!)
          apolloPayload.q_person_name = fullNameSearch;
          console.log(`   🔍 Buscando nome EXATO: "${fullNameSearch}"`);

        }
        
        // Filtros adicionais (TODOS RESTRITIVOS!)
        if (currentTitle) {
          apolloPayload.person_titles = [currentTitle];
          console.log(`   💼 Cargo EXATO: "${currentTitle}"`);
        }
        
        if (currentCompany) {
          apolloPayload.organization_names = [currentCompany];
          console.log(`   🏢 Empresa EXATA: "${currentCompany}"`);
        }
        
        // 🔥 FIX: Verificar se country é array antes de usar .join()
        if (city || (country && Array.isArray(country) && country.length > 0)) {
          const locationStr = city || country.join(', ');
          apolloPayload.person_locations = [locationStr];
          console.log(`   📍 Localização: "${locationStr}"`);
        }
        
        if (seniority && Array.isArray(seniority) && seniority.length > 0) {
          apolloPayload.person_seniorities = seniority;
          console.log(`   🎯 Senioridade: ${seniority.join(', ')}`);
        }
        
        if (industry && Array.isArray(industry) && industry.length > 0) {
          apolloPayload.q_organization_keyword_tags = industry;
          console.log(`   🏭 Indústria: ${industry.join(', ')}`);
        }
        
        if (searchKeywords) {
          apolloPayload.q_keywords = searchKeywords;
          console.log(`   🔑 Keywords: "${searchKeywords}"`);
        }
        
        console.log('   📦 Payload completo:', JSON.stringify(apolloPayload, null, 2));
        console.log('   🌐 Endpoint:', 'https://api.apollo.io/api/v1/mixed_people/api_search');
        console.log('   🔑 API Key:', apolloKey ? `${apolloKey.substring(0, 10)}...` : 'NENHUMA');
        console.log('');
        
        // 🔥 FIX: Usar o NOVO endpoint do Apollo.io (api_search, não search!)
        // Documentação: https://docs.apollo.io/reference/people-api-search
        const apolloResponse = await fetch('https://api.apollo.io/api/v1/mixed_people/api_search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'X-Api-Key': apolloKey,
          },
          body: JSON.stringify(apolloPayload),
        });

        if (apolloResponse.ok) {
          const apolloData = await apolloResponse.json();
          console.log(`✅ Apollo.io: ${apolloData.people?.length || 0} resultados`);
          
          // 🔥 LOG DETALHADO DA RESPOSTA - Mostra estrutura E dados
          if (apolloData.people && apolloData.people.length > 0) {
            console.log(`   📊 TODOS os ${apolloData.people.length} resultados retornados pelo Apollo:`);
            apolloData.people.forEach((p: any, index: number) => {
              console.log(`   ${index + 1}. ${p.name || `${p.first_name} ${p.last_name}`} - ${p.title} @ ${p.organization?.name || 'N/A'}`);
            });
            console.log('');
          } else {
            console.log(`   ⚠️ Apollo retornou 0 resultados. Resposta completa:`);
            console.log(JSON.stringify(apolloData, null, 2));
          }
          
          if (apolloData.people && apolloData.people.length > 0) {
            // 🔥 FIX: FILTRAGEM RESTRITIVA - Aceita apenas se corresponder aos filtros
            console.log(`   🔍 Aplicando filtros restritivos nos ${apolloData.people.length} resultados...`);
            
            apolloData.people.forEach((person: any) => {
              // ✅ VALIDAÇÃO 1: Se nome foi especificado, deve corresponder EXATAMENTE (palavra por palavra)
              if (fullName || searchFirstName || searchLastName) {
                const searchName = (fullName || `${searchFirstName} ${searchLastName}`).toLowerCase().trim();
                const personName = (person.name || `${person.first_name} ${person.last_name}`).toLowerCase().trim();
                
                console.log(`   🔍 Comparando: Buscado="${searchName}" vs Retornado="${personName}"`);
                
                // 🔥 VALIDAÇÃO RESTRITIVA: Todas as palavras do nome buscado devem estar no nome retornado
                const searchWords = searchName.split(/\s+/).filter(w => w.length > 0); // ["cleber", "couto"]
                const personWords = personName.split(/\s+/).filter(w => w.length > 0); // ["john", "smith"]
                
                console.log(`      Palavras buscadas: [${searchWords.join(', ')}]`);
                console.log(`      Palavras retornadas: [${personWords.join(', ')}]`);
                
                // Verifica se TODAS as palavras do nome buscado existem no nome retornado
                const matchResults = searchWords.map(searchWord => {
                  const matched = personWords.some(personWord => 
                    personWord.includes(searchWord) || searchWord.includes(personWord)
                  );
                  console.log(`      "${searchWord}" encontrado? ${matched ? '✅' : '❌'}`);
                  return matched;
                });
                
                const allWordsMatch = matchResults.every(r => r);
                
                if (!allWordsMatch) {
                  console.log(`   ❌ REJEITADO por nome: "${person.name}" não contém todas as palavras de "${searchName}"`);
                  return; // Pula este resultado
                }
                
                console.log(`   ✅ Nome aprovado: "${person.name}" corresponde a "${searchName}"`);
              }
              
              // ✅ VALIDAÇÃO 2: Se cargo foi especificado, deve conter as palavras-chave
              if (currentTitle && person.title) {
                const searchTitle = currentTitle.toLowerCase().trim();
                const personTitle = person.title.toLowerCase().trim();
                
                // Para cargos, usamos includes (mais flexível) pois "CEO" pode ser "Chief Executive Officer"
                const titleWords = searchTitle.split(/\s+/);
                const titleMatches = titleWords.some(word => personTitle.includes(word));
                
                if (!titleMatches) {
                  console.log(`   ❌ REJEITADO por cargo: "${person.title}" não contém "${currentTitle}"`);
                  return; // Pula este resultado
                }
              }
              
              // ✅ VALIDAÇÃO 3: Se empresa foi especificada, deve corresponder
              if (currentCompany && person.organization?.name) {
                const searchCompany = currentCompany.toLowerCase().trim();
                const personCompany = person.organization.name.toLowerCase().trim();
                
                // Para empresas, usamos includes (mais flexível) pois "Tesla" pode ser "Tesla Inc."
                if (!personCompany.includes(searchCompany) && !searchCompany.includes(personCompany)) {
                  console.log(`   ❌ REJEITADO por empresa: "${person.organization.name}" não contém "${currentCompany}"`);
                  return; // Pula este resultado
                }
              }
              
              // ✅ PASSOU NAS VALIDAÇÕES - Adiciona ao resultado
              console.log(`   ✅ APROVADO: ${person.name} (${person.title} @ ${person.organization?.name})`);
              
              results.push({
                id: `apollo-${person.id}`,
                name: person.name || `${person.first_name} ${person.last_name}`,
                firstName: person.first_name,
                lastName: person.last_name,
                title: person.title || 'N/A',
                company: person.organization?.name || 'N/A',
                location: `${person.city || ''}, ${person.country || ''}`.replace(/^, |, $/, ''),
                country: person.country,
                avatar: person.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=150`,
                linkedinUrl: person.linkedin_url || '',
                email: person.email || '',
                phone: person.phone_numbers?.[0]?.raw_number || '',
                industry: person.organization?.industry || 'N/A',
                companySize: person.organization?.estimated_num_employees?.toString() || 'N/A',
                seniority: person.seniority || 'N/A',
                yearsExperience: 0,
                skills: person.keywords || [],
                matchScore: calculateMatchScore(person, body),
                source: 'apollo',
                confidence: person.email ? 95 : 75,
                enrichmentData: {
                  apolloId: person.id,
                  contactStage: person.contact_stage_id,
                  departments: person.departments,
                  functions: person.functions,
                },
              });
            });
            
            console.log(`   📊 Resultado da filtragem: ${results.length} leads aprovados de ${apolloData.people.length} retornados`);
          }
        } else {
          // 🔥 ERRO DETALHADO DA API
          const errorText = await apolloResponse.text();
          let errorJson;
          try {
            errorJson = JSON.parse(errorText);
          } catch {
            errorJson = { message: errorText };
          }
          
          // Log simplificado e discreto
          if (apolloResponse.status === 401) {
            console.warn('⚠️ Apollo.io: API Key inválida ou expirada. Usando dados DEMO como fallback.');
            console.log('💡 Dica: Gere uma nova key em https://app.apollo.io/#/settings/integrations/api');
          } else if (apolloResponse.status === 422) {
            console.error('❌ Apollo.io erro 422: Parâmetros de busca inválidos');
            console.error('   Resposta da API:', JSON.stringify(errorJson, null, 2));
            
            // Verifica se é erro de endpoint deprecated
            if (errorJson.error && errorJson.error.includes('deprecated')) {
              console.log('');
              console.log('⚠️ ═══════════════════════════════════════════════════════════════');
              console.log('⚠️ ENDPOINT APOLLO DEPRECATED - JÁ CORRIGIDO NO CÓDIGO');
              console.log('⚠️ ═══════════════════════════════════════════════════════════════');
              console.log('');
              console.log('✅ Solução aplicada: Usando novo endpoint /api/v1/mixed_people/api_search');
              console.log('📖 Documentação: https://docs.apollo.io/reference/people-api-search');
              console.log('');
              console.log('⚠️ Se ainda ver este erro, significa que há cache do código antigo.');
              console.log('💡 Recarregue a página e tente novamente.');
              console.log('');
            } else {
              console.error('   Payload enviado:', JSON.stringify(apolloPayload, null, 2));
              console.error('💡 Possíveis causas:');
              console.error('   - Formato de nome inválido');
              console.error('   - Empresa não encontrada');
              console.error('   - Combinação de filtros não suportada');
            }
          } else if (apolloResponse.status === 429) {
            console.warn('⚠️ Apollo.io: Rate limit excedido. Aguarde alguns minutos.');
          } else if (apolloResponse.status === 402) {
            console.warn('⚠️ Apollo.io: Créditos esgotados. Aguarde renovação mensal.');
          } else {
            console.error(`❌ Apollo.io erro ${apolloResponse.status}: ${errorJson.message || 'Desconhecido'}`);
          }
          
          // 🔥 FALLBACK: Retorna dados DEMO se Apollo falhar com 401
          if (apolloResponse.status === 401) {
            console.log('⚠️ Apollo.io falhou (401 Unauthorized) - Retornando dados DEMO...');
            const mockResults = generateDemoLeads({
              currentTitle,
              currentCompany,
              city,
              country,
              industry,
              seniority,
              limit
            });
            
            return c.json({
              success: true,
              results: mockResults,
              total: mockResults.length,
              sources: ['demo'],
              warning: 'apollo_key_invalid',
              message: '⚠️ API Key do Apollo.io INVÁLIDA - Configure uma nova key em Configurações → Segurança. Exibindo dados DEMO.'
            });
          }
        }
      } catch (error) {
        console.error('❌ Erro no Apollo.io:', error);
      }
    }

    // 2️⃣ LINKEDIN SALES NAVIGATOR - Busca primária e enriquecimento (via RapidAPI)
    // rapidApiKey já foi declarado no topo da função (linha 391)
    if (rapidApiKey && rapidApiKey !== 'YOUR_RAPIDAPI_KEY') {
      try {
        console.log('📡 Buscando no LinkedIn Sales Navigator...');
        
        // 🔥 CONSTRUIR QUERY PARA LINKEDIN
        const linkedinFilters: any = {};
        
        if (fullName || searchFirstName || searchLastName) {
          const fullNameSearch = fullName || `${searchFirstName} ${searchLastName}`.trim();
          linkedinFilters.keywords = fullNameSearch;
          console.log(`   🔍 Nome: "${fullNameSearch}"`);
        }
        
        if (currentTitle) {
          linkedinFilters.currentTitle = currentTitle;
          console.log(`   💼 Cargo: "${currentTitle}"`);
        }
        
        if (currentCompany) {
          linkedinFilters.currentCompany = currentCompany;
          console.log(`   🏢 Empresa: "${currentCompany}"`);
        }
        
        if (city) {
          linkedinFilters.geoUrn = city;
          console.log(`   📍 Localização: "${city}"`);
        }
        
        if (industry && industry.length > 0) {
          linkedinFilters.industries = industry;
          console.log(`   🏭 Indústria: ${industry.join(', ')}`);
        }
        
        if (seniority && seniority.length > 0) {
          linkedinFilters.seniority = seniority;
          console.log(`   🎯 Senioridade: ${seniority.join(', ')}`);
        }
        
        const linkedinPayload = {
          ...linkedinFilters,
          count: Math.min(limit, 25),
          start: 0
        };
        
        console.log('   📦 Payload LinkedIn:', JSON.stringify(linkedinPayload, null, 2));
        
        // 🔥 CHAMADA À API LINKEDIN (usando RapidAPI como proxy)
        const linkedinResponse = await fetch('https://linkedin-api8.p.rapidapi.com/search-people', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'linkedin-api8.p.rapidapi.com'
          },
          body: JSON.stringify(linkedinPayload)
        });
        
        if (linkedinResponse.ok) {
          const linkedinData = await linkedinResponse.json();
          console.log(`✅ LinkedIn: ${linkedinData.elements?.length || 0} resultados`);
          
          if (linkedinData.elements && linkedinData.elements.length > 0) {
            console.log(`   📊 TODOS os ${linkedinData.elements.length} resultados do LinkedIn:`);
            linkedinData.elements.forEach((p: any, index: number) => {
              console.log(`   ${index + 1}. ${p.firstName} ${p.lastName} - ${p.headline} @ ${p.companyName || 'N/A'}`);
            });
            console.log('');
            
            linkedinData.elements.forEach((person: any) => {
              const fullName = `${person.firstName} ${person.lastName}`;
              
              // Verifica se já existe (evita duplicatas)
              if (!results.some(r => r.linkedinUrl === person.publicIdentifier)) {
                results.push({
                  id: `linkedin-${person.publicIdentifier}`,
                  name: fullName,
                  firstName: person.firstName,
                  lastName: person.lastName,
                  title: person.headline || person.occupation || 'N/A',
                  company: person.companyName || 'N/A',
                  location: person.geoLocationName || 'N/A',
                  country: person.geoCountryName || '',
                  avatar: person.profilePictureDisplayImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=150`,
                  linkedinUrl: `https://linkedin.com/in/${person.publicIdentifier}`,
                  email: '', // LinkedIn não retorna email direto
                  phone: '', // LinkedIn não retorna telefone direto
                  industry: person.industryName || 'N/A',
                  companySize: 'N/A',
                  seniority: detectSeniority(person.headline || ''),
                  yearsExperience: 0,
                  skills: [],
                  matchScore: 95, // LinkedIn tem alta confiança
                  source: 'linkedin',
                  confidence: 98,
                  enrichmentData: {
                    linkedinId: person.publicIdentifier,
                    headline: person.headline,
                    connections: person.numOfConnections || 0,
                    premium: person.premium || false
                  }
                });
              }
            });
          }
        } else {
          const errorText = await linkedinResponse.text();
          let errorObj;
          try {
            errorObj = JSON.parse(errorText);
          } catch {
            errorObj = { message: errorText };
          }
          
          console.error(`❌ LinkedIn erro ${linkedinResponse.status}:`, JSON.stringify(errorObj, null, 2));
          
          // 🔥 ERRO 403: Não subscrito à API
          if (linkedinResponse.status === 403) {
            console.log('');
            console.log('⚠️ ═══════════════════════════════════════════════════════════════');
            console.log('⚠️ ERRO: VOCÊ NÃO ESTÁ SUBSCRITO À API DO LINKEDIN NO RAPIDAPI');
            console.log('⚠️ ═══════════════════════════════════════════════════════════════');
            console.log('');
            console.log('📋 Como resolver:');
            console.log('1. Acesse: https://rapidapi.com/rockapis-rockapis-default/api/linkedin-api8');
            console.log('2. Clique em "Subscribe to Test"');
            console.log('3. Escolha o plano "Basic" (GRÁTIS - 100 requests/mês)');
            console.log('4. Confirme a subscrição');
            console.log('5. Certifique-se que está usando a mesma conta que gerou a RAPIDAPI_KEY');
            console.log('');
            console.log('💡 Dica: Verifique se a key está correta e se a subscrição está ativa');
            console.log('');
          }
        }
      } catch (error) {
        console.error('❌ Erro no LinkedIn:', error);
      }
    }

    // 3️⃣ HUNTER.IO - Para encontrar emails
    if (hunterKey && hunterKey !== 'YOUR_HUNTER_API_KEY' && currentCompany && (firstName || lastName)) {
      try {
        console.log('📧 Buscando email no Hunter.io...');
        
        const domainResponse = await fetch(
          `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(currentCompany)}&api_key=${hunterKey}&limit=10`
        );
        
        if (domainResponse.ok) {
          const domainData = await domainResponse.json();
          
          if (domainData.data?.emails) {
            domainData.data.emails.forEach((email: any) => {
              if (results.some(r => r.email === email.value)) return;
              
              results.push({
                id: `hunter-${email.value}`,
                name: `${email.first_name} ${email.last_name}`,
                firstName: email.first_name,
                lastName: email.last_name,
                title: email.position || currentTitle || 'N/A',
                company: currentCompany,
                location: city || country?.[0] || 'N/A',
                country: country?.[0],
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.first_name)}+${encodeURIComponent(email.last_name)}&size=150`,
                linkedinUrl: email.linkedin || '',
                email: email.value,
                phone: email.phone_number || '',
                industry: domainData.data.organization?.industry || 'N/A',
                companySize: 'N/A',
                seniority: email.seniority || 'N/A',
                yearsExperience: 0,
                skills: [],
                matchScore: email.confidence,
                source: 'hunter',
                confidence: email.confidence,
                enrichmentData: {
                  emailType: email.type,
                  emailSources: email.sources,
                },
              });
            });
          }
        }
      } catch (error) {
        console.error('❌ Erro no Hunter.io:', error);
      }
    }

    // 🟢 3️⃣ RAPIDAPI - LINKEDIN DATA (ALTERNATIVA FÁCIL)
    if (rapidApiKey && rapidApiKey !== 'YOUR_RAPIDAPI_KEY') {
      try {
        console.log('');
        console.log('🟢 ═══════════════════════════════════════════════════════');
        console.log('🟢 BUSCANDO NO LINKEDIN VIA RAPIDAPI (FÁCIL E RÁPIDO)');
        console.log('🟢 ═══════════════════════════════════════════════════════');
        console.log('');
        
        // RapidAPI: Fresh LinkedIn Profile Data
        // Endpoint: https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile
        
        if ((searchFirstName || searchLastName) && currentCompany) {
          const linkedinSearchQuery = `${searchFirstName || ''} ${searchLastName || ''} ${currentCompany}`.trim();
          console.log(`   🔍 Buscando: "${linkedinSearchQuery}"`);
          
          const rapidApiResponse = await fetch(
            `https://fresh-linkedin-profile-data.p.rapidapi.com/search-linkedin-profiles?query=${encodeURIComponent(linkedinSearchQuery)}&limit=5`,
            {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': rapidApiKey,
                'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com',
              },
            }
          );
          
          if (rapidApiResponse.ok) {
            const rapidData = await rapidApiResponse.json();
            console.log(`✅ RapidAPI: ${rapidData.data?.length || 0} perfis encontrados`);
            
            if (rapidData.data && rapidData.data.length > 0) {
              rapidData.data.forEach((profile: any) => {
                // Verifica duplicata
                if (results.some(r => r.linkedinUrl === profile.linkedin_url)) return;
                
                results.push({
                  id: `rapidapi-${profile.public_id || Math.random().toString(36).substring(7)}`,
                  name: profile.full_name || `${profile.first_name} ${profile.last_name}`,
                  firstName: profile.first_name,
                  lastName: profile.last_name,
                  title: profile.headline || profile.occupation || 'N/A',
                  company: profile.company_name || currentCompany || 'N/A',
                  location: profile.location || `${city || ''}, ${country?.[0] || ''}`.replace(/^, |, $/, ''),
                  country: profile.country || country?.[0],
                  avatar: profile.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&size=150`,
                  linkedinUrl: profile.linkedin_url || '',
                  email: '', // RapidAPI não fornece email direto
                  phone: '', // RapidAPI não fornece telefone direto
                  industry: profile.industry || 'N/A',
                  companySize: 'N/A',
                  seniority: detectSeniority(profile.headline || ''),
                  yearsExperience: 0,
                  skills: profile.skills || [],
                  matchScore: 90, // RapidAPI tem boa confiança
                  source: 'rapidapi-linkedin',
                  confidence: 92,
                  enrichmentData: {
                    linkedinId: profile.public_id,
                    headline: profile.headline,
                    summary: profile.summary,
                    connections: profile.connections_count,
                  },
                });
                
                console.log(`   ✅ Lead adicionado: ${profile.full_name} (${profile.headline})`);
              });
            }
          } else {
            const errorText = await rapidApiResponse.text();
            let errorObj;
            try {
              errorObj = JSON.parse(errorText);
            } catch {
              errorObj = { message: errorText };
            }
            
            console.error(`   ❌ RapidAPI erro ${rapidApiResponse.status}:`, JSON.stringify(errorObj, null, 2));
            
            if (rapidApiResponse.status === 403) {
              console.log('');
              console.log('⚠️ ═══════════════════════════════════════════════════════════════');
              console.log('⚠️ ERRO 403: NÃO SUBSCRITO À API "Fresh LinkedIn Profile Data"');
              console.log('⚠️ ═══════════════════════════════════════════════════════════════');
              console.log('');
              console.log('📋 Como resolver:');
              console.log('1. Acesse: https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data');
              console.log('2. Clique em "Subscribe to Test"');
              console.log('3. Escolha o plano "Basic" (GRÁTIS - 500 requests/mês)');
              console.log('4. Confirme a subscrição');
              console.log('5. Use a mesma conta que gerou sua RAPIDAPI_KEY');
              console.log('');
            } else if (rapidApiResponse.status === 401) {
              console.error('   💡 API Key inválida. Verifique em https://rapidapi.com/developer/security');
            } else if (rapidApiResponse.status === 429) {
              console.error('   💡 Rate limit excedido. Upgrade o plano ou aguarde.');
            }
          }
        } else {
          console.log('⚠️ RapidAPI: Nome OU Empresa não fornecidos - pulando busca');
        }
        
        console.log('🟢 ═══════════════════════════════════════════════════════');
        console.log('');
      } catch (error) {
        console.error('❌ Erro no RapidAPI:', error);
      }
    }

    // 🟣 4️⃣ LUSHA - LINKEDIN + EMAILS + TELEFONES (MUITO POPULAR)
    if (lushaKey && lushaKey !== 'YOUR_LUSHA_API_KEY') {
      try {
        console.log('');
        console.log('🟣 ═══════════════════════════════════════════════════════');
        console.log('🟣 BUSCANDO NO LUSHA (EMAILS + TELEFONES + LINKEDIN)');
        console.log('🟣 ═══════════════════════════════════════════════════════');
        console.log('');
        
        // Lusha API: Person Enrichment
        // Endpoint: https://api.lusha.com/person
        
        if ((searchFirstName || searchLastName) && currentCompany) {
          console.log(`   👤 Nome: ${searchFirstName} ${searchLastName}`);
          console.log(`   🏢 Empresa: ${currentCompany}`);
          
          const lushaPayload: any = {
            data: {
              person: {}
            }
          };
          
          if (searchFirstName) lushaPayload.data.person.firstName = searchFirstName;
          if (searchLastName) lushaPayload.data.person.lastName = searchLastName;
          if (currentCompany) lushaPayload.data.person.company = { name: currentCompany };
          
          const lushaResponse = await fetch(
            'https://api.lusha.com/person',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'api_key': lushaKey,
              },
              body: JSON.stringify(lushaPayload),
            }
          );
          
          if (lushaResponse.ok) {
            const lushaData = await lushaResponse.json();
            console.log(`✅ Lusha: Perfil enriquecido!`);
            
            if (lushaData.data) {
              const person = lushaData.data;
              
              // Verifica duplicata
              const existingByEmail = person.emailAddress ? results.find(r => r.email === person.emailAddress) : null;
              
              if (!existingByEmail) {
                results.push({
                  id: `lusha-${person.id || Math.random().toString(36).substring(7)}`,
                  name: `${person.firstName || ''} ${person.lastName || ''}`.trim(),
                  firstName: person.firstName,
                  lastName: person.lastName,
                  title: person.currentPosition?.title || currentTitle || 'N/A',
                  company: person.currentPosition?.companyName || currentCompany || 'N/A',
                  location: person.location || `${city || ''}, ${country?.[0] || ''}`.replace(/^, |, $/, ''),
                  country: person.country || country?.[0],
                  avatar: person.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.firstName || 'User')}+${encodeURIComponent(person.lastName || '')}&size=150`,
                  linkedinUrl: person.linkedInUrl || '',
                  email: person.emailAddress || '', // 🔥 Lusha FORNECE EMAIL!
                  phone: person.phoneNumbers?.[0]?.internationalNumber || '', // 🔥 Lusha FORNECE TELEFONE!
                  industry: person.currentPosition?.industry || 'N/A',
                  companySize: person.currentPosition?.companySize || 'N/A',
                  seniority: person.currentPosition?.seniority || 'N/A',
                  yearsExperience: 0,
                  skills: [],
                  matchScore: person.emailAddress ? 98 : 85, // Com email = alta confiança
                  source: 'lusha',
                  confidence: person.emailAddress ? 98 : 85,
                  enrichmentData: {
                    lushaId: person.id,
                    emailStatus: person.emailStatus,
                    phoneNumbers: person.phoneNumbers,
                    socialProfiles: person.socialProfiles,
                    positions: person.positions?.slice(0, 3),
                  },
                });
                
                console.log(`   ✅ Lead adicionado: ${person.firstName} ${person.lastName}`);
                console.log(`      📧 Email: ${person.emailAddress || 'N/A'}`);
                console.log(`      📞 Telefone: ${person.phoneNumbers?.[0]?.internationalNumber || 'N/A'}`);
              } else {
                // Enriquece o lead existente com dados do Lusha
                console.log(`   🔄 Enriquecendo lead existente com dados do Lusha...`);
                if (person.emailAddress && !existingByEmail.email) {
                  existingByEmail.email = person.emailAddress;
                  console.log(`      ✅ Email adicionado: ${person.emailAddress}`);
                }
                if (person.phoneNumbers?.[0] && !existingByEmail.phone) {
                  existingByEmail.phone = person.phoneNumbers[0].internationalNumber;
                  console.log(`      ✅ Telefone adicionado: ${person.phoneNumbers[0].internationalNumber}`);
                }
                if (person.linkedInUrl && !existingByEmail.linkedinUrl) {
                  existingByEmail.linkedinUrl = person.linkedInUrl;
                  console.log(`      ✅ LinkedIn adicionado: ${person.linkedInUrl}`);
                }
                existingByEmail.matchScore = Math.max(existingByEmail.matchScore, 98);
                existingByEmail.confidence = Math.max(existingByEmail.confidence, 98);
              }
            }
          } else {
            const errorText = await lushaResponse.text();
            let errorJson;
            try {
              errorJson = JSON.parse(errorText);
            } catch {
              errorJson = { message: errorText };
            }
            
            console.error(`   ❌ Lusha erro ${lushaResponse.status}: ${JSON.stringify(errorJson, null, 2)}`);
            
            if (lushaResponse.status === 401) {
              console.error('   💡 API Key inválida. Gere uma nova em https://www.lusha.com/settings/api/');
            } else if (lushaResponse.status === 402) {
              console.error('   💡 Créditos esgotados. Upgrade o plano em https://www.lusha.com/pricing/');
            } else if (lushaResponse.status === 404) {
              console.error('   ℹ️ Pessoa não encontrada na base do Lusha.');
            } else if (lushaResponse.status === 429) {
              console.error('   💡 Rate limit excedido. Aguarde ou upgrade o plano.');
            }
          }
        } else {
          console.log('⚠️ Lusha: Nome E Empresa são obrigatórios - pulando busca');
        }
        
        console.log('🟣 ═══════════════════════════════════════════════════════');
        console.log('');
      } catch (error) {
        console.error('❌ Erro no Lusha:', error);
      }
    }

    // 🔵 5️⃣ PROXYCURL - API OFICIAL DO LINKEDIN (MELHOR QUALIDADE!)
    if (proxycurlKey && proxycurlKey !== 'YOUR_PROXYCURL_API_KEY') {
      try {
        console.log('');
        console.log('🔵 ═══════════════════════════════════════════════════════');
        console.log('🔵 BUSCANDO NO LINKEDIN VIA PROXYCURL (API PROFISSIONAL)');
        console.log('🔵 ═══════════════════════════════════════════════════════');
        console.log('');
        
        // MÉTODO 1: Busca por nome + empresa (mais preciso)
        if ((searchFirstName || searchLastName) && currentCompany) {
          console.log('📡 Método: Busca por Nome + Empresa');
          
          const searchParams = new URLSearchParams();
          if (searchFirstName) searchParams.append('first_name', searchFirstName);
          if (searchLastName) searchParams.append('last_name', searchLastName);
          if (currentCompany) searchParams.append('current_company_name', currentCompany);
          if (currentTitle) searchParams.append('title', currentTitle);
          if (city) searchParams.append('city', city);
          if (country?.[0]) searchParams.append('country', country[0]);
          searchParams.append('enrich_profiles', 'enrich'); // 🔥 Enriquece automaticamente
          
          console.log(`   🔍 Query: ${searchParams.toString()}`);
          
          const proxycurlResponse = await fetch(
            `https://nubela.co/proxycurl/api/linkedin/profile/resolve?${searchParams.toString()}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${proxycurlKey}`,
              },
            }
          );
          
          if (proxycurlResponse.ok) {
            const linkedinData = await proxycurlResponse.json();
            console.log(`✅ Proxycurl: Perfil encontrado!`);
            console.log(`   URL: ${linkedinData.url}`);
            
            // Agora busca o perfil COMPLETO
            if (linkedinData.url) {
              const profileResponse = await fetch(
                `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(linkedinData.url)}`,
                {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${proxycurlKey}`,
                  },
                }
              );
              
              if (profileResponse.ok) {
                const profile = await profileResponse.json();
                console.log(`✅ Perfil completo enriquecido!`);
                
                // Verifica se já existe
                if (!results.some(r => r.linkedinUrl === profile.public_identifier)) {
                  results.push({
                    id: `linkedin-${profile.public_identifier}`,
                    name: profile.full_name,
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    title: profile.occupation || profile.headline || 'N/A',
                    company: profile.experiences?.[0]?.company || currentCompany || 'N/A',
                    location: `${profile.city || ''}, ${profile.country_full_name || ''}`.replace(/^, |, $/, ''),
                    country: profile.country_full_name,
                    avatar: profile.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&size=150`,
                    linkedinUrl: `https://linkedin.com/in/${profile.public_identifier}`,
                    email: '', // Proxycurl não retorna email direto
                    phone: '', // Proxycurl não retorna telefone direto
                    industry: profile.experiences?.[0]?.company_linkedin_profile_url ? 'Tech' : 'N/A',
                    companySize: 'N/A',
                    seniority: detectSeniority(profile.headline || profile.occupation || ''),
                    yearsExperience: calculateExperience(profile.experiences || []),
                    skills: profile.skills || [],
                    matchScore: 95, // LinkedIn tem alta confiança
                    source: 'linkedin', // 🔥 Fonte oficial!
                    confidence: 98,
                    enrichmentData: {
                      linkedinId: profile.public_identifier,
                      headline: profile.headline,
                      summary: profile.summary,
                      connections: profile.connections,
                      followerCount: profile.follower_count,
                      experiences: profile.experiences?.slice(0, 3).map((exp: any) => ({
                        title: exp.title,
                        company: exp.company,
                        startDate: exp.starts_at,
                        endDate: exp.ends_at,
                        description: exp.description,
                      })),
                      education: profile.education?.slice(0, 2).map((edu: any) => ({
                        school: edu.school,
                        degree: edu.degree_name,
                        field: edu.field_of_study,
                      })),
                      certifications: profile.certifications?.slice(0, 3),
                      languages: profile.languages,
                    },
                  });
                  
                  console.log(`   ✅ Lead adicionado: ${profile.full_name} (${profile.occupation})`);
                }
              } else {
                const errorText = await profileResponse.text();
                console.error(`    Erro ao buscar perfil completo: ${profileResponse.status}`);
                console.error(`   Mensagem: ${errorText}`);
              }
            }
          } else {
            const errorText = await proxycurlResponse.text();
            let errorJson;
            try {
              errorJson = JSON.parse(errorText);
            } catch {
              errorJson = { message: errorText };
            }
            
            console.error('');
            console.error('════════════════════════════════════════════════════════');
            console.error('❌ PROXYCURL (LINKEDIN) RETORNOU ERRO!');
            console.error('════════════════════════════════════════════════════════');
            console.error(`   Status: ${proxycurlResponse.status} ${proxycurlResponse.statusText}`);
            console.error(`   Erro: ${JSON.stringify(errorJson, null, 2)}`);
            console.error('');
            console.error('🔍 POSSÍVEIS CAUSAS:');
            
            if (proxycurlResponse.status === 401) {
              console.error('   ❌ API Key INVÁLIDA ou EXPIRADA');
              console.error('   ✅ Solução: Gere uma nova key em https://nubela.co/proxycurl/');
            } else if (proxycurlResponse.status === 429) {
              console.error('   ❌ LIMITE DE REQUISIÇÕES EXCEDIDO (rate limit)');
              console.error('   ✅ Solução: Aguarde alguns minutos ou upgrade o plano');
            } else if (proxycurlResponse.status === 404) {
              console.error('   ⚠️ PERFIL NÃO ENCONTRADO no LinkedIn');
              console.error('   💡 Tente ajustar os filtros de busca');
            } else if (proxycurlResponse.status === 402) {
              console.error('   ❌ CRÉDITOS ESGOTADOS');
              console.error('   ✅ Solução: Compre mais créditos em https://nubela.co/proxycurl/pricing');
            } else {
              console.error(`   ❌ Erro ${proxycurlResponse.status}: ${errorJson.message || 'Desconhecido'}`);
            }
            
            console.error('════════════════════════════════════════════════════════');
            console.error('');
          }
        } else {
          console.log('⚠️ Proxycurl: Nome OU Empresa não fornecidos - pulando busca');
        }
        
        console.log('🔵 ═══════════════════════════════════════════════════════');
        console.log('');
      } catch (error) {
        console.error('❌ Erro no Proxycurl (LinkedIn):', error);
      }
    }

    // 🔥 MERGE INTELIGENTE: Combina dados de múltiplas fontes
    console.log('');
    console.log('🔗 ENRIQUECIMENTO MULTI-FONTE...');
    console.log(`   Leads antes do merge: ${results.length}`);
    
    const mergedResults: any[] = [];
    const processedIds = new Set<string>();
    
    results.forEach(lead => {
      // Identifica leads similares por nome + empresa
      const leadKey = `${lead.firstName?.toLowerCase()}-${lead.lastName?.toLowerCase()}-${lead.company?.toLowerCase()}`;
      
      if (processedIds.has(leadKey)) {
        // Já processado - apenas enriquece o existente
        const existing = mergedResults.find(r => 
          r.firstName?.toLowerCase() === lead.firstName?.toLowerCase() &&
          r.lastName?.toLowerCase() === lead.lastName?.toLowerCase() &&
          r.company?.toLowerCase() === lead.company?.toLowerCase()
        );
        
        if (existing) {
          // 🔥 ENRIQUECIMENTO: Preenche campos vazios com dados da nova fonte
          if (!existing.email && lead.email) existing.email = lead.email;
          if (!existing.phone && lead.phone) existing.phone = lead.phone;
          if (!existing.linkedinUrl && lead.linkedinUrl) existing.linkedinUrl = lead.linkedinUrl;
          if (!existing.avatar && lead.avatar) existing.avatar = lead.avatar;
          if ((!existing.skills || existing.skills.length === 0) && lead.skills?.length > 0) {
            existing.skills = lead.skills;
          }
          
          // Adiciona às fontes
          if (!existing.enrichmentData) existing.enrichmentData = {};
          if (!existing.enrichmentData.sources) existing.enrichmentData.sources = [existing.source];
          if (!existing.enrichmentData.sources.includes(lead.source)) {
            existing.enrichmentData.sources.push(lead.source);
          }
          
          // Aumenta match score se tiver mais dados
          existing.matchScore = Math.min(100, existing.matchScore + 5);
          existing.confidence = Math.min(100, existing.confidence + 2);
          
          console.log(`   ✅ ENRIQUECIDO: ${existing.name} (${existing.enrichmentData.sources.join(' + ')})`);
        }
        return;
      }
      
      // Novo lead - adiciona à lista
      processedIds.add(leadKey);
      mergedResults.push(lead);
    });
    
    console.log(`   Leads após merge: ${mergedResults.length}`);
    console.log(`   Leads enriquecidos: ${mergedResults.filter(r => r.enrichmentData?.sources?.length > 1).length}`);
    
    // Remove duplicatas finais (por email ou ID)
    const uniqueResults = Array.from(
      new Map(mergedResults.map(r => [r.email || r.id, r])).values()
    );

    // Ordena por matchScore
    uniqueResults.sort((a, b) => b.matchScore - a.matchScore);

    console.log('');
    console.log('📊 RESULTADO FINAL:');
    console.log(`   Total bruto: ${results.length} leads`);
    console.log(`   Após remover duplicatas: ${uniqueResults.length} leads`);
    console.log(`   Retornando: ${uniqueResults.slice(0, limit).length} leads`);
    console.log(`   Fontes: ${[...new Set(uniqueResults.map(r => r.source))].join(', ')}`);
    
    if (uniqueResults.length === 0) {
      console.log('');
      console.log('⚠️ NENHUM RESULTADO ENCONTRADO!');
      console.log('   Possíveis razões:');
      console.log('   1. Nenhuma API configurada');
      console.log('   2. APIs retornaram erro');
      console.log('   3. Filtros muito restritivos (especialmente nome completo)');
      console.log('   4. Pessoa não existe nas bases de dados do Apollo.io');
      console.log('');
      console.log('💡 SUGESTÕES:');
      console.log('   - Tente buscar SEM o nome, apenas com Cargo + Empresa');
      console.log('   - Exemplo: "CEO" + "Tesla" (sem nome específico)');
      console.log('   - Isso retornará TODOS os CEOs da empresa especificada');
      console.log('');
      console.log('🔄 ATIVANDO SISTEMA DE FALLBACK COM DADOS DEMO...');
      
      // 🎯 GERADOR INTELIGENTE DE LEADS DEMO
      const mockResults = generateDemoLeads({
        currentTitle,
        currentCompany,
        city,
        country,
        industry,
        seniority,
        limit
      });
      
      console.log(`✅ Retornando ${mockResults.length} leads DEMO para teste`);
      console.log('💡 Configure API keys em Configurações → Segurança para buscar leads reais');
      console.log(`📋 Leads gerados baseados em:`);
      console.log(`   - Cargo: ${currentTitle || 'automático'}`);
      console.log(`   - Empresa: ${currentCompany || 'automático'}`);
      console.log(`   - Cidade: ${city || 'automático'}`);
      console.log(`   - País: ${country?.[0] || 'Portugal'}`);
      console.log(`   - Indústria: ${industry?.[0] || 'automático'}`);
      console.log(`   - Seniority: ${seniority?.[0] || 'automático'}`);
      console.log(`   - Quantidade: ${limit}`);
      
      // 🔥 Mensagem personalizada baseada nos filtros usados
      let suggestionMessage = '⚠️ Nenhum resultado encontrado. ';
      
      if (fullName || searchFirstName || searchLastName) {
        suggestionMessage += `A pessoa "${fullName || `${searchFirstName} ${searchLastName}`}" pode não existir na base do Apollo.io. `;
        suggestionMessage += '💡 Tente buscar SEM o nome, apenas com Cargo + Empresa para ver todos os profissionais que correspondem.';
      } else {
        suggestionMessage += 'Os filtros aplicados são muito restritivos ou a combinação não existe na base de dados. ';
        suggestionMessage += '💡 Tente remover alguns filtros ou usar critérios mais amplos.';
      }
      
      return c.json({
        success: true,
        results: mockResults,
        total: mockResults.length,
        sources: ['demo'],
        warning: 'no_results_found',
        message: suggestionMessage
      });
    }
    
    console.log('═══════════════════════════════════════════════');
    console.log('');

    return c.json({
      success: true,
      results: uniqueResults.slice(0, limit),
      total: uniqueResults.length,
      sources: [...new Set(uniqueResults.map(r => r.source))],
    });
  } catch (error: any) {
    console.error('❌ Erro na busca de pessoas:', error);
    return c.json({
      success: false,
      error: error.message,
      results: [],
    }, 500);
  }
});

// Função auxiliar para calcular match score
function calculateMatchScore(person: any, searchParams: any): number {
  let score = 70;
  
  if (person.email) score += 15;
  if (person.phone_numbers?.length > 0) score += 10;
  if (person.linkedin_url) score += 5;
  
  return Math.min(100, score);
}

console.log('✅ search-routes.ts carregado com sucesso!');

export default app;