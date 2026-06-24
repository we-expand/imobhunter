/**
 * 🚀 IMOBHUNTER SUPABASE EDGE FUNCTION
 * Proxy para APIs reais: Apollo.io e Proxycurl
 * Versão: 9.0-REAL-API-INTEGRATION
 */

import { createClient } from 'npm:';

// ==================== ENV CONFIG ====================
const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY') || '';
const PROXYCURL_API_KEY = Deno.env.get('PROXYCURL_API_KEY') || '';

console.log('🚀 ImobHunter Server v9.0 - Real API Integration');
console.log('✅ Apollo API:', APOLLO_API_KEY ? `Configured (${APOLLO_API_KEY.substring(0, 8)}...)` : '❌ Missing');
console.log('✅ Proxycurl API:', PROXYCURL_API_KEY ? `Configured (${PROXYCURL_API_KEY.substring(0, 8)}...)` : '❌ Missing');

// ==================== CORS HEADERS ====================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400',
};

// ==================== MAIN HANDLER ====================
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname;

  console.log(`📥 ${req.method} ${path}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // ==================== HEALTH CHECK ====================
    if (path.includes('/make-server-9e4b8b7c/ping') || path.includes('/ping')) {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          version: '9.0-REAL-API',
          timestamp: new Date().toISOString(),
          apis: {
            apollo: !!APOLLO_API_KEY,
            proxycurl: !!PROXYCURL_API_KEY,
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // ==================== APOLLO SEARCH ====================
    if (path.includes('/make-server-9e4b8b7c/search/leads') && req.method === 'POST') {
      if (!APOLLO_API_KEY) {
        return new Response(
          JSON.stringify({ 
            error: 'Apollo API key not configured',
            message: 'Set APOLLO_API_KEY environment variable'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const body = await req.json();
      console.log('📤 Apollo Request Body:', JSON.stringify(body, null, 2));

      // ✅ Extrair parâmetros enviados pelo frontend
      const apolloQuery: any = {
        page: body.page || 1,
        per_page: body.per_page || 25,
      };

      // Adicionar filtros
      if (body.person_name) apolloQuery.person_name = body.person_name;
      if (body.q_keywords) apolloQuery.q_keywords = body.q_keywords;
      if (body.first_name) apolloQuery.first_name = body.first_name;
      if (body.last_name) apolloQuery.last_name = body.last_name;
      if (body.person_titles) apolloQuery.person_titles = body.person_titles;
      if (body.organization_names) apolloQuery.organization_names = body.organization_names;
      if (body.person_locations) apolloQuery.person_locations = body.person_locations;
      if (body.person_industry_tag_ids) apolloQuery.person_industry_tag_ids = body.person_industry_tag_ids;

      console.log('📤 Sending to Apollo:', JSON.stringify(apolloQuery, null, 2));

      // ✅ Chamar Apollo API REAL
      const apolloResponse = await fetch('https://api.apollo.io/api/v1/mixed_people/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': APOLLO_API_KEY,
        },
        body: JSON.stringify(apolloQuery),
      });

      console.log('📥 Apollo Response Status:', apolloResponse.status);

      if (!apolloResponse.ok) {
        const errorText = await apolloResponse.text();
        console.error('❌ Apollo Error:', errorText);
        
        return new Response(
          JSON.stringify({ 
            error: 'Apollo API error',
            status: apolloResponse.status,
            message: errorText.substring(0, 200)
          }),
          { 
            status: apolloResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const apolloData = await apolloResponse.json();
      console.log('✅ Apollo returned:', apolloData.people?.length || 0, 'people');

      // ✅ Retornar dados reais da Apollo
      return new Response(
        JSON.stringify(apolloData),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // ==================== PROXYCURL SEARCH ====================
    if (path.includes('/make-server-9e4b8b7c/proxycurl/search') && req.method === 'POST') {
      if (!PROXYCURL_API_KEY) {
        return new Response(
          JSON.stringify({ 
            error: 'Proxycurl API key not configured',
            message: 'Set PROXYCURL_API_KEY environment variable'
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const body = await req.json();
      console.log('📤 Proxycurl Request:', body);

      // Construir query para Proxycurl
      const params = new URLSearchParams();
      if (body.first_name) params.append('first_name', body.first_name);
      if (body.last_name) params.append('last_name', body.last_name);
      if (body.title) params.append('title', body.title);
      if (body.company) params.append('company_name', body.company);
      if (body.location) params.append('location', body.location);

      const proxycurlUrl = `https://nubela.co/proxycurl/api/v2/search/person?${params.toString()}`;
      
      const proxycurlResponse = await fetch(proxycurlUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PROXYCURL_API_KEY}`,
          'Accept': 'application/json',
        },
      });

      console.log('📥 Proxycurl Response Status:', proxycurlResponse.status);

      if (!proxycurlResponse.ok) {
        const errorText = await proxycurlResponse.text();
        console.error('❌ Proxycurl Error:', errorText);
        
        return new Response(
          JSON.stringify({ 
            error: 'Proxycurl API error',
            status: proxycurlResponse.status,
            message: errorText.substring(0, 200)
          }),
          { 
            status: proxycurlResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const proxycurlData = await proxycurlResponse.json();
      console.log('✅ Proxycurl returned:', proxycurlData.results?.length || 0, 'results');

      return new Response(
        JSON.stringify(proxycurlData),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // ==================== 404 ====================
    return new Response(
      JSON.stringify({ 
        error: 'Not Found',
        path: path,
        available_endpoints: [
          'GET  /make-server-9e4b8b7c/ping',
          'POST /make-server-9e4b8b7c/search/leads',
          'POST /make-server-9e4b8b7c/proxycurl/search'
        ]
      }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('❌ Server Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
        stack: error.stack?.substring(0, 500)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

console.log('✅ ImobHunter Server Ready - Listening for requests...');
