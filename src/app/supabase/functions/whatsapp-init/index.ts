// Supabase Edge Function: whatsapp-init
// Deploy: supabase functions deploy whatsapp-init

import { serve } from 'https://deno.land/std';
import { createClient } from 'https://esm.sh/';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WHATSAPP_SERVER_URL = Deno.env.get('WHATSAPP_SERVER_URL') || 'http://localhost:3001';

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { session_id, user_id } = await req.json();

    if (!session_id || !user_id) {
      throw new Error('session_id and user_id are required');
    }

    // Cria cliente Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Salva sessão no banco
    const { error: dbError } = await supabase
      .from('whatsapp_sessions')
      .insert({
        id: session_id,
        user_id: user_id,
        status: 'qr',
        qr_code: null,
        phone_number: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (dbError) throw dbError;

    // Chama servidor Node.js para iniciar sessão WhatsApp REAL
    const nodeResponse = await fetch(`${WHATSAPP_SERVER_URL}/api/whatsapp/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        user_id,
      }),
    });

    if (!nodeResponse.ok) {
      throw new Error('Failed to initialize WhatsApp session on Node.js server');
    }

    const nodeData = await nodeResponse.json();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        session_id,
        message: 'WhatsApp session initiated. QR code will be generated shortly...',
        node_response: nodeData
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});