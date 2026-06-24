import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

const instagramRouter = new Hono();

// 🔐 Instagram API Configuration
// IMPORTANTE: Configurar estas variáveis de ambiente no Supabase:
// - INSTAGRAM_APP_ID
// - INSTAGRAM_APP_SECRET
// - INSTAGRAM_REDIRECT_URI

console.log('📸 [Instagram] Carregando rotas do Instagram...');

// ✅ Status da conexão Instagram
instagramRouter.get('/status', async (c) => {
  try {
    console.log('📸 [Instagram] Verificando status da conexão...');
    
    // Buscar token de acesso armazenado
    const accessTokenData = await kv.get('instagram_access_token');
    const userDataStored = await kv.get('instagram_user_data');
    const aiEnabledData = await kv.get('instagram_ai_enabled');
    const statsData = await kv.get('instagram_stats');

    const isConnected = !!accessTokenData;
    
    console.log(`📸 [Instagram] Status: ${isConnected ? 'Conectado' : 'Não conectado'}`);

    return c.json({
      connected: isConnected,
      account: userDataStored ? JSON.parse(userDataStored) : null,
      aiAutomationEnabled: aiEnabledData === 'true',
      stats: statsData ? JSON.parse(statsData) : {
        messagesSent: 0,
        messagesReceived: 0,
        activeConversations: 0,
        responseRate: 0
      }
    });
  } catch (error: any) {
    console.error('❌ [Instagram] Erro ao verificar status:', error);
    return c.json({ 
      connected: false, 
      error: error.message 
    }, 500);
  }
});

// 🔑 Iniciar autenticação OAuth
instagramRouter.post('/auth', async (c) => {
  try {
    console.log('📸 [Instagram] Iniciando autenticação OAuth...');

    const INSTAGRAM_APP_ID = Deno.env.get('INSTAGRAM_APP_ID');
    const REDIRECT_URI = Deno.env.get('INSTAGRAM_REDIRECT_URI') || 
                        `https://${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-9e4b8b7c/instagram/callback`;

    if (!INSTAGRAM_APP_ID) {
      console.warn('⚠️ [Instagram] INSTAGRAM_APP_ID não configurado');
      return c.json({ 
        success: false, 
        error: 'Instagram não configurado. Configure INSTAGRAM_APP_ID e INSTAGRAM_APP_SECRET no Supabase Dashboard → Edge Functions → Secrets.',
        configured: false
      }, 400);
    }

    // URL de autorização do Instagram Basic Display API
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;

    console.log('📸 [Instagram] URL de autenticação gerada');
    console.log('📸 [Instagram] Redirect URI:', REDIRECT_URI);

    return c.json({
      success: true,
      authUrl
    });
  } catch (error: any) {
    console.error('❌ [Instagram] Erro ao iniciar autenticação:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 400);
  }
});

// 🔄 Callback OAuth
instagramRouter.get('/callback', async (c) => {
  try {
    const code = c.req.query('code');
    
    if (!code) {
      throw new Error('Código de autorização não recebido');
    }

    console.log('📸 [Instagram] Callback recebido com código');

    const INSTAGRAM_APP_ID = Deno.env.get('INSTAGRAM_APP_ID');
    const INSTAGRAM_APP_SECRET = Deno.env.get('INSTAGRAM_APP_SECRET');
    const REDIRECT_URI = Deno.env.get('INSTAGRAM_REDIRECT_URI') || 
                        `https://${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-9e4b8b7c/instagram/callback`;

    if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) {
      console.warn('⚠️ [Instagram] Credenciais não configuradas');
      return c.html(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Configuração Necessária</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
              }
              .icon { font-size: 64px; margin-bottom: 20px; }
              h1 { color: #333; margin: 0 0 10px 0; }
              p { color: #666; margin: 0 0 20px 0; font-size: 14px; }
              .code {
                background: #f5f5f5;
                padding: 8px 12px;
                border-radius: 4px;
                font-family: monospace;
                margin: 10px 0;
              }
              button {
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">⚙️</div>
              <h1>Instagram Não Configurado</h1>
              <p>Para conectar o Instagram, você precisa configurar as seguintes variáveis de ambiente no Supabase Dashboard → Edge Functions → Secrets:</p>
              <div class="code">INSTAGRAM_APP_ID</div>
              <div class="code">INSTAGRAM_APP_SECRET</div>
              <p style="margin-top: 20px;">Após configurar, tente conectar novamente.</p>
              <button onclick="window.close()">Fechar</button>
            </div>
          </body>
        </html>
      `);
    }

    // Trocar código por token de acesso
    console.log('📸 [Instagram] Trocando código por access token...');
    
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_APP_ID,
        client_secret: INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ [Instagram] Erro ao obter token:', errorText);
      throw new Error(`Erro ao obter token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ [Instagram] Access token obtido com sucesso');

    // Buscar dados do perfil
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${tokenData.access_token}`
    );

    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error('❌ [Instagram] Erro ao buscar perfil:', errorText);
      throw new Error(`Erro ao buscar perfil: ${errorText}`);
    }

    const profileData = await profileResponse.json();
    console.log('✅ [Instagram] Dados do perfil obtidos');

    // Armazenar token e dados do usuário
    await kv.set('instagram_access_token', tokenData.access_token);
    await kv.set('instagram_user_id', profileData.id);
    await kv.set('instagram_user_data', JSON.stringify({
      id: profileData.id,
      username: profileData.username,
      name: profileData.username,
      profilePicUrl: '',
      followersCount: 0,
      followingCount: 0,
      isConnected: true
    }));

    console.log('✅ [Instagram] Dados armazenados no KV store');

    // Redirecionar para página de sucesso
    return c.html(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Instagram Conectado</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              text-align: center;
            }
            .icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            h1 { color: #333; margin: 0 0 10px 0; }
            p { color: #666; margin: 0 0 20px 0; }
            button {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              cursor: pointer;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">✅</div>
            <h1>Instagram Conectado!</h1>
            <p>Sua conta @${profileData.username} foi conectada com sucesso.</p>
            <button onclick="window.close()">Fechar</button>
          </div>
          <script>
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('❌ [Instagram] Erro no callback:', error);
    return c.html(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Erro na Conexão</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.2);
              text-align: center;
              max-width: 400px;
            }
            .icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #333; margin: 0 0 10px 0; }
            p { color: #666; margin: 0 0 20px 0; font-size: 14px; }
            button {
              background: #ff6b6b;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              cursor: pointer;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">❌</div>
            <h1>Erro na Conexão</h1>
            <p>${error.message}</p>
            <button onclick="window.close()">Fechar</button>
          </div>
        </body>
      </html>
    `);
  }
});

// 🔌 Desconectar Instagram
instagramRouter.post('/disconnect', async (c) => {
  try {
    console.log('📸 [Instagram] Desconectando conta...');

    // Remover tokens e dados
    await kv.del('instagram_access_token');
    await kv.del('instagram_user_id');
    await kv.del('instagram_user_data');
    await kv.del('instagram_ai_enabled');

    console.log('✅ [Instagram] Conta desconectada com sucesso');

    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ [Instagram] Erro ao desconectar:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 🤖 Ativar/Desativar automação com IA
instagramRouter.post('/ai-automation', async (c) => {
  try {
    const { enabled } = await c.req.json();
    
    console.log(`📸 [Instagram] ${enabled ? 'Ativando' : 'Desativando'} automação com IA...`);

    await kv.set('instagram_ai_enabled', enabled ? 'true' : 'false');

    console.log(`✅ [Instagram] Automação ${enabled ? 'ativada' : 'desativada'}`);

    return c.json({ success: true, enabled });
  } catch (error: any) {
    console.error('❌ [Instagram] Erro ao alterar automação:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 💬 Enviar mensagem de teste
instagramRouter.post('/send-test', async (c) => {
  try {
    const { message } = await c.req.json();
    
    console.log('📸 [Instagram] Enviando mensagem de teste...');

    const accessToken = await kv.get('instagram_access_token');
    
    if (!accessToken) {
      throw new Error('Instagram não conectado');
    }

    // Aqui você implementaria o envio real da mensagem via Instagram Graph API
    // Por enquanto, simulamos sucesso
    console.log('📸 [Instagram] Mensagem:', message);
    console.log('✅ [Instagram] Mensagem de teste enviada (simulação)');

    // Atualizar stats
    const statsData = await kv.get('instagram_stats');
    const stats = statsData ? JSON.parse(statsData) : {
      messagesSent: 0,
      messagesReceived: 0,
      activeConversations: 0,
      responseRate: 0
    };
    
    stats.messagesSent += 1;
    await kv.set('instagram_stats', JSON.stringify(stats));

    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ [Instagram] Erro ao enviar mensagem:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 🔄 Webhook para receber mensagens (Instagram Graph API)
instagramRouter.post('/webhook', async (c) => {
  try {
    const body = await c.req.json();
    
    console.log('📸 [Instagram] Webhook recebido:', JSON.stringify(body, null, 2));

    // Verificar se IA está ativa
    const aiEnabled = await kv.get('instagram_ai_enabled');
    
    if (aiEnabled === 'true') {
      console.log('🤖 [Instagram] IA ativa - processando mensagem...');
      
      // Aqui você implementaria a lógica de resposta automática com IA
      // Por exemplo:
      // 1. Extrair mensagem recebida
      // 2. Enviar para seu modelo de IA
      // 3. Gerar resposta contextualizada
      // 4. Enviar resposta via Instagram API
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ [Instagram] Erro no webhook:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Verificação do webhook (Instagram exige)
instagramRouter.get('/webhook', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');

  const VERIFY_TOKEN = Deno.env.get('INSTAGRAM_WEBHOOK_VERIFY_TOKEN') || 'leadgen_ai_webhook_2024';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ [Instagram] Webhook verificado');
    return c.text(challenge || '');
  } else {
    console.warn('⚠️ [Instagram] Falha na verificação do webhook');
    return c.json({ error: 'Forbidden' }, 403);
  }
});

console.log('✅ [Instagram] Rotas carregadas com sucesso');

export default instagramRouter;