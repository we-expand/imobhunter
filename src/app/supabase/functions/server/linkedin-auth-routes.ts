import { Hono } from 'npm:hono';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

/**
 * 🔗 LINKEDIN OAUTH 2.0 AUTHENTICATION
 * Autenticação real do LinkedIn com QR Code
 * Docs: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
 */

// 📱 GERAR QR CODE PARA LOGIN LINKEDIN
app.get('/generate-qr', async (c) => {
  try {
    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!clientId || clientId === 'YOUR_LINKEDIN_CLIENT_ID') {
      return c.json({
        success: false,
        message: 'Configure LINKEDIN_CLIENT_ID no Admin Dashboard',
        instructions: 'Acesse https://www.linkedin.com/developers/apps e crie um app'
      }, 400);
    }

    // Gerar state único para segurança (CSRF protection)
    const state = crypto.randomUUID();
    const sessionId = crypto.randomUUID();

    // Salvar state no KV store (expira em 10 minutos)
    await kv.set(`linkedin_oauth_state:${state}`, {
      sessionId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });

    // Construir URL de autorização do LinkedIn
    const redirectUri = `${supabaseUrl}/functions/v1/make-server-9e4b8b7c/linkedin-auth/callback`;
    const scope = 'openid profile email w_member_social'; // Permissões necessárias

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', scope);

    console.log('✅ QR Code gerado para LinkedIn OAuth:', { state, sessionId });

    return c.json({
      success: true,
      authUrl: authUrl.toString(),
      state,
      sessionId,
      expiresIn: 600, // 10 minutos
      message: 'Escaneie o QR code com seu celular para conectar'
    });

  } catch (error: any) {
    console.error('❌ Erro ao gerar QR code:', error);
    return c.json({
      success: false,
      message: error.message
    }, 500);
  }
});

// 🔄 CALLBACK DO LINKEDIN OAUTH
app.get('/callback', async (c) => {
  try {
    const code = c.req.query('code');
    const state = c.req.query('state');
    const error = c.req.query('error');
    const errorDescription = c.req.query('error_description');

    // Verificar se houve erro
    if (error) {
      console.error('❌ LinkedIn OAuth error:', error, errorDescription);
      return c.html(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Erro na Conexão</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              max-width: 500px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            h1 {
              color: #e53e3e;
              margin-bottom: 10px;
            }
            p {
              color: #666;
              line-height: 1.6;
            }
            button {
              margin-top: 20px;
              padding: 12px 32px;
              background: #667eea;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              cursor: pointer;
              transition: all 0.3s;
            }
            button:hover {
              background: #5568d3;
              transform: translateY(-2px);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="error-icon">❌</div>
            <h1>Erro na Conexão</h1>
            <p><strong>Erro:</strong> ${error}</p>
            <p>${errorDescription || 'Não foi possível conectar ao LinkedIn'}</p>
            <button onclick="window.close()">Fechar</button>
          </div>
        </body>
        </html>
      `);
    }

    if (!code || !state) {
      throw new Error('Código ou state ausente');
    }

    // Verificar state para prevenir CSRF
    const stateData = await kv.get(`linkedin_oauth_state:${state}`);
    if (!stateData) {
      throw new Error('State inválido ou expirado');
    }

    // Deletar state usado
    await kv.del(`linkedin_oauth_state:${state}`);

    // Trocar code por access token
    const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const redirectUri = `${supabaseUrl}/functions/v1/make-server-9e4b8b7c/linkedin-auth/callback`;

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Erro ao trocar code por token:', errorText);
      throw new Error('Falha ao obter access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in; // segundos

    console.log('✅ Access token obtido do LinkedIn');

    // Buscar informações do usuário
    const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Falha ao buscar dados do usuário');
    }

    const userData = await userResponse.json();

    console.log('✅ Dados do usuário LinkedIn:', userData);

    // Salvar token e dados do usuário no KV
    const sessionId = stateData.sessionId;
    await kv.set(`linkedin_session:${sessionId}`, {
      accessToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      user: {
        sub: userData.sub,
        name: userData.name,
        givenName: userData.given_name,
        familyName: userData.family_name,
        picture: userData.picture,
        email: userData.email,
        emailVerified: userData.email_verified,
      },
      connectedAt: new Date().toISOString(),
    });

    console.log('✅ Sessão LinkedIn salva:', sessionId);

    // Página de sucesso
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Conectado com Sucesso!</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease-out;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
            animation: bounce 0.6s ease-out;
          }
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          h1 {
            color: #48bb78;
            margin-bottom: 10px;
          }
          .user-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
            padding: 15px;
            background: #f7fafc;
            border-radius: 12px;
          }
          .avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 3px solid #667eea;
          }
          .user-details {
            text-align: left;
          }
          .user-name {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 4px;
          }
          .user-email {
            font-size: 14px;
            color: #718096;
          }
          p {
            color: #666;
            line-height: 1.6;
            margin: 10px 0;
          }
          .linkedin-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: #0077b5;
            color: white;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 10px;
          }
          button {
            margin-top: 20px;
            padding: 12px 32px;
            background: #48bb78;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
          }
          button:hover {
            background: #38a169;
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Conectado com Sucesso!</h1>
          
          <div class="user-info">
            <img src="${userData.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.name)}" 
                 alt="${userData.name}" 
                 class="avatar" />
            <div class="user-details">
              <div class="user-name">${userData.name}</div>
              <div class="user-email">${userData.email}</div>
            </div>
          </div>

          <div class="linkedin-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn Conectado
          </div>

          <p>Agora você pode usar todas as funcionalidades de busca e enriquecimento do LinkedIn!</p>
          
          <button onclick="window.close()">Fechar e Voltar</button>
          
          <script>
            // Notificar a janela pai que a conexão foi bem-sucedida
            if (window.opener) {
              window.opener.postMessage({
                type: 'LINKEDIN_CONNECTED',
                sessionId: '${sessionId}',
                user: ${JSON.stringify(userData)}
              }, '*');
            }
          </script>
        </div>
      </body>
      </html>
    `);

  } catch (error: any) {
    console.error('❌ Erro no callback OAuth:', error);
    return c.html(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Erro na Conexão</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .error-icon { font-size: 64px; margin-bottom: 20px; }
          h1 { color: #e53e3e; margin-bottom: 10px; }
          p { color: #666; line-height: 1.6; }
          button {
            margin-top: 20px;
            padding: 12px 32px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">❌</div>
          <h1>Erro na Conexão</h1>
          <p>${error.message}</p>
          <button onclick="window.close()">Fechar</button>
        </div>
      </body>
      </html>
    `);
  }
});

// 🔍 VERIFICAR STATUS DA CONEXÃO
app.get('/status/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    
    if (!sessionId) {
      return c.json({ connected: false, message: 'Session ID ausente' }, 400);
    }

    const session = await kv.get(`linkedin_session:${sessionId}`);

    if (!session) {
      return c.json({ 
        connected: false, 
        message: 'Sessão não encontrada ou expirada' 
      });
    }

    // Verificar se o token ainda é válido
    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    
    if (now >= expiresAt) {
      await kv.del(`linkedin_session:${sessionId}`);
      return c.json({ 
        connected: false, 
        message: 'Token expirado',
        expired: true 
      });
    }

    return c.json({
      connected: true,
      user: session.user,
      expiresAt: session.expiresAt,
      connectedAt: session.connectedAt,
    });

  } catch (error: any) {
    console.error('❌ Erro ao verificar status:', error);
    return c.json({ 
      connected: false, 
      message: error.message 
    }, 500);
  }
});

// 🔓 DESCONECTAR LINKEDIN
app.delete('/disconnect/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    
    if (!sessionId) {
      return c.json({ success: false, message: 'Session ID ausente' }, 400);
    }

    await kv.del(`linkedin_session:${sessionId}`);

    console.log('✅ Sessão LinkedIn desconectada:', sessionId);

    return c.json({
      success: true,
      message: 'LinkedIn desconectado com sucesso'
    });

  } catch (error: any) {
    console.error('❌ Erro ao desconectar:', error);
    return c.json({
      success: false,
      message: error.message
    }, 500);
  }
});

export default app;
