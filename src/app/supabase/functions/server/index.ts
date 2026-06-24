const APOLLO_API_KEY = Deno.env.get('APOLLO_API_KEY') || '';

console.log('🚀 Server v12.0-FINAL - Apollo key:', !!APOLLO_API_KEY);

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (url.pathname.includes('/ping')) {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        version: '12.0-FINAL',
        time: new Date().toISOString() 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (url.pathname.includes('/search/leads') && req.method === 'POST') {
      console.log('🔍 Search received');
      
      const body = await req.json();
      const filters = body.filters || {};
      
      if (!APOLLO_API_KEY) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'No API key' 
        }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const apolloQuery: any = { page: 1, per_page: 25 };
      
      if (filters.firstName && filters.lastName) {
        apolloQuery.q_keywords = `${filters.firstName} ${filters.lastName}`;
      } else if (filters.name) {
        apolloQuery.q_keywords = filters.name;
      } else if (body.query) {
        apolloQuery.q_keywords = body.query;
      }
      
      if (filters.title) apolloQuery.person_titles = [filters.title];
      if (filters.company) apolloQuery.organization_names = [filters.company];
      if (filters.location) apolloQuery.person_locations = [filters.location];

      console.log('📤 Query:', apolloQuery);

      const res = await fetch('https://api.apollo.io/api/v1/mixed_people/api_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': APOLLO_API_KEY },
        body: JSON.stringify(apolloQuery),
      });

      console.log('📥 Status:', res.status);

      if (!res.ok) {
        const error = await res.text();
        console.error('❌ Error:', error);
        return new Response(JSON.stringify({ success: false, error }), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const data = await res.json();
      console.log('✅ Got', data.people?.length || 0, 'results');

      const results = (data.people || []).map((p: any) => ({
        id: p.id || `apollo-${Math.random()}`,
        source: 'apollo',
        name: (p.first_name && p.last_name) ? `${p.first_name} ${p.last_name}` : 'N/A',
        title: p.title || 'N/A',
        email: p.email || 'N/A',
        phone: p.phone_numbers?.[0]?.raw_number || p.direct_phone || 'N/A',
        company: p.organization?.name || 'N/A',
        linkedin: p.linkedin_url || '',
        location: [p.city, p.state, p.country].filter(Boolean).join(', ') || 'N/A',
      }));

      console.log('✅ Converted to', results.length, 'leads');

      return new Response(JSON.stringify({
        success: true,
        results: results,
        total: data.total_entries || 0,
        timestamp: new Date().toISOString()
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('❌ Server error:', err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

console.log('✅ Server ready!');
