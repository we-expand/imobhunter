/**
 * SERVIDOR WHATSAPP BUSINESS API REAL
 * 
 * Instalar dependências:
 * npm install whatsapp-web.js qrcode-terminal express cors dotenv @supabase/supabase-js
 * 
 * Executar:
 * node server.js
 * 
 * Deploy: Render.com, Railway.app, ou seu VPS
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Armazena as sessões ativas
const sessions = new Map();

// Função para criar/iniciar sessão WhatsApp
function createWhatsAppSession(sessionId, userId) {
  console.log(`🚀 Criando sessão WhatsApp: ${sessionId}`);

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: sessionId,
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
    },
  });

  // Quando QR Code é gerado
  client.on('qr', async (qr) => {
    console.log(`📱 QR Code gerado para sessão: ${sessionId}`);
    
    // Exibe no terminal (para debug)
    qrcode.generate(qr, { small: true });

    // Atualiza no Supabase
    await supabase
      .from('whatsapp_sessions')
      .update({
        qr_code: qr,
        status: 'qr',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    // Envia via Realtime Channel
    const channel = supabase.channel(`whatsapp:${sessionId}`);
    await channel.send({
      type: 'broadcast',
      event: 'qr_code',
      payload: { qr },
    });
  });

  // Quando autenticado com sucesso
  client.on('authenticated', async () => {
    console.log(`✅ Sessão autenticada: ${sessionId}`);
  });

  // Quando pronto para usar
  client.on('ready', async () => {
    const info = client.info;
    const phoneNumber = info.wid.user;
    
    console.log(`✅ WhatsApp pronto! Número: ${phoneNumber}`);

    // Atualiza no Supabase
    await supabase
      .from('whatsapp_sessions')
      .update({
        status: 'connected',
        phone_number: phoneNumber,
        qr_code: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    // Notifica frontend via Realtime
    const channel = supabase.channel(`whatsapp:${sessionId}`);
    await channel.send({
      type: 'broadcast',
      event: 'authenticated',
      payload: { phone_number: phoneNumber },
    });

    // Envia mensagem de boas-vindas
    await client.sendMessage(
      `${phoneNumber}@c.us`,
      '🎉 *WhatsApp conectado ao AI LeadGen Pro!*\n\n' +
      'Sua conta está agora integrada e pronta para enviar mensagens automáticas.\n\n' +
      '✅ Conexão estabelecida\n' +
      '✅ Permissões concedidas\n' +
      '✅ Sistema operacional\n\n' +
      'Você pode gerenciar tudo pelo painel da plataforma.'
    );
  });

  // Quando desconectado
  client.on('disconnected', async (reason) => {
    console.log(`❌ Sessão desconectada: ${sessionId} - Razão: ${reason}`);
    
    await supabase
      .from('whatsapp_sessions')
      .update({
        status: 'disconnected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    sessions.delete(sessionId);
  });

  // Quando há erro
  client.on('auth_failure', async (message) => {
    console.error(`❌ Erro de autenticação: ${sessionId}`, message);
    
    await supabase
      .from('whatsapp_sessions')
      .update({
        status: 'error',
        error_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    // Notifica frontend
    const channel = supabase.channel(`whatsapp:${sessionId}`);
    await channel.send({
      type: 'broadcast',
      event: 'error',
      payload: { message },
    });
  });

  // Quando recebe mensagem
  client.on('message', async (message) => {
    console.log(`📨 Mensagem recebida: ${message.from} - ${message.body}`);
    
    // Salva mensagem recebida no Supabase
    await supabase
      .from('whatsapp_messages')
      .insert({
        session_id: sessionId,
        from: message.from,
        message: message.body,
        is_from_me: message.fromMe,
        received_at: new Date().toISOString(),
      });
  });

  // Inicializa cliente
  client.initialize();
  
  // Armazena na memória
  sessions.set(sessionId, client);

  return client;
}

// ===== ROTAS API =====

// Webhook do Supabase para iniciar sessão
app.post('/api/whatsapp/init', async (req, res) => {
  try {
    const { session_id, user_id } = req.body;

    if (!session_id || !user_id) {
      return res.status(400).json({ error: 'session_id and user_id are required' });
    }

    // Verifica se sessão já existe
    if (sessions.has(session_id)) {
      return res.json({ message: 'Session already exists' });
    }

    // Cria nova sessão
    createWhatsAppSession(session_id, user_id);

    res.json({ success: true, message: 'WhatsApp session created' });
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    res.status(500).json({ error: error.message });
  }
});

// Enviar mensagem
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { session_id, to, message } = req.body;

    if (!session_id || !to || !message) {
      return res.status(400).json({ error: 'session_id, to, and message are required' });
    }

    const client = sessions.get(session_id);
    
    if (!client) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Formata número (remove caracteres especiais)
    const phoneNumber = to.replace(/\D/g, '');
    const chatId = `${phoneNumber}@c.us`;

    // Envia mensagem
    await client.sendMessage(chatId, message);

    // Salva no Supabase
    await supabase
      .from('whatsapp_messages')
      .insert({
        session_id,
        to: chatId,
        message,
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Desconectar sessão
app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    const { session_id } = req.body;

    const client = sessions.get(session_id);
    
    if (client) {
      await client.destroy();
      sessions.delete(session_id);
    }

    res.json({ success: true, message: 'Session disconnected' });
  } catch (error) {
    console.error('Erro ao desconectar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Status da sessão
app.get('/api/whatsapp/status/:session_id', (req, res) => {
  const { session_id } = req.params;
  const client = sessions.get(session_id);
  
  res.json({
    exists: !!client,
    connected: client ? client.info !== undefined : false,
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    sessions: sessions.size,
    timestamp: new Date().toISOString(),
  });
});

// Inicia servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   🚀 WhatsApp Business API Server         ║
  ║                                            ║
  ║   Status: ONLINE                           ║
  ║   Port: ${PORT}                              ║
  ║   Sessions: 0                              ║
  ║                                            ║
  ║   Endpoints:                               ║
  ║   POST /api/whatsapp/init                  ║
  ║   POST /api/whatsapp/send                  ║
  ║   POST /api/whatsapp/disconnect            ║
  ║   GET  /api/whatsapp/status/:id            ║
  ║   GET  /health                             ║
  ╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  
  // Desconecta todas as sessões
  for (const [sessionId, client] of sessions) {
    console.log(`Desconectando sessão: ${sessionId}`);
    await client.destroy();
  }
  
  process.exit(0);
});
