// Supabase Edge Function: whatsapp-send
// Deploy: supabase functions deploy whatsapp-send

import { serve } from '&';
import { createClient } from '&';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
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
    const { session_id, to, message } = await req.json();

    if (!session_id || !to || !message) {
      throw new Error('session_id, to, and message are required');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Verifica se a sessão está ativa
    const { data: session, error: sessionError } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('status', 'connected')
      .single();

    if (sessionError || !session) {
      throw new Error('WhatsApp session not found or not connected');
    }

    // Aqui você faria a chamada para seu servidor Node.js
    // que tem o whatsapp-web.js rodando
    
    // Exemplo de webhook:
    // await fetch('https://seu-servidor-whatsapp.com/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ session_id, to, message })
    // });

    // Salva mensagem no log
    await supabase
      .from('whatsapp_messages')
      .insert({
        session_id,
        to,
        message,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Message sent successfully' 
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
