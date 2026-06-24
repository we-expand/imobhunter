/**
 * ✅ SERVIDOR WHATSAPP BUSINESS API SIMPLES
 * 
 * Sem Supabase - Funciona standalone!
 * 
 * Instalar dependências:
 * npm install whatsapp-web.js qrcode express cors
 * 
 * Executar:
 * node server-simple.js
 * 
 * O QR Code será REAL e válido!
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Armazena sessões ativas
const sessions = new Map();
const qrCodes = new Map();
const sessionStatus = new Map();

// Função para criar sessão WhatsApp
function createWhatsAppSession(sessionId) {
  console.log(`🚀 Criando sessão: ${sessionId}`);

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
        '--disable-gpu'
      ],
    },
  });

  // QR Code gerado
  client.on('qr', async (qr) => {
    console.log(`📱 QR Code gerado para: ${sessionId}`);
    
    try {
      // Converte QR em base64
      const qrBase64 = await QRCode.toDataURL(qr, {
        width: 400,
        margin: 2,
        color: {
          dark: '#128C7E',
          light: '#FFFFFF'
        }
      });
      
      qrCodes.set(sessionId, qrBase64);
      sessionStatus.set(sessionId, { status: 'qr', qr: qrBase64 });
      
      console.log('✅ QR Code pronto (base64)');
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  });

  // Autenticado
  client.on('authenticated', () => {
    console.log(`✅ Autenticado: ${sessionId}`);
    sessionStatus.set(sessionId, { status: 'authenticating' });
  });

  // Pronto para usar
  client.on('ready', async () => {
    const info = client.info;
    const phoneNumber = `+${info.wid.user}`;
    const formattedPhone = phoneNumber.replace(/(\d{3})(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4 $5');
    
    console.log(`✅ WhatsApp CONECTADO! Número: ${formattedPhone}`);
    
    sessionStatus.set(sessionId, { 
      status: 'connected', 
      phone_number: formattedPhone,
      raw_phone: phoneNumber
    });
    
    qrCodes.delete(sessionId);
    
    // Envia mensagem de boas-vindas
    try {
      await client.sendMessage(
        `${info.wid.user}@c.us`,
        '🎉 *Conexão Estabelecida!*\n\n' +
        '✅ Seu WhatsApp está conectado ao *AI LeadGen Pro*\n\n' +
        '📱 Número: ' + formattedPhone + '\n' +
        '🔐 Conexão criptografada\n' +
        '🤖 Sistema de IA ativo\n\n' +
        '_Mensagem de: João Nunes_\n' +
        '_AI LeadGen Pro - KW Portugal_'
      );
      console.log('📤 Mensagem de boas-vindas enviada');
    } catch (error) {
      console.error('Erro ao enviar boas-vindas:', error);
    }
  });

  // Desconectado
  client.on('disconnected', (reason) => {
    console.log(`❌ Desconectado: ${sessionId} - ${reason}`);
    sessionStatus.set(sessionId, { status: 'disconnected' });
    sessions.delete(sessionId);
    qrCodes.delete(sessionId);
  });

  // Erro de autenticação
  client.on('auth_failure', (msg) => {
    console.error(`❌ Falha autenticação: ${sessionId}`, msg);
    sessionStatus.set(sessionId, { status: 'error', error: msg });
  });

  // Mensagem recebida
  client.on('message', async (message) => {
    console.log(`📨 Mensagem de ${message.from}: ${message.body.substring(0, 50)}`);
  });

  // Inicializa
  client.initialize();
  sessions.set(sessionId, client);

  return client;
}

// ===== ROTAS API =====

// Iniciar sessão
app.post('/api/whatsapp/init', async (req, res) => {
  try {
    const { user_id } = req.body;
    const sessionId = `wa-${Date.now()}-${user_id || 'default'}`;

    console.log(`\n🔌 Nova requisição de conexão`);
    console.log(`Session ID: ${sessionId}`);

    // Verifica se já existe
    if (sessions.has(sessionId)) {
      const status = sessionStatus.get(sessionId);
      return res.json({ 
        session_id: sessionId,
        status: status?.status || 'unknown',
        qr_code: qrCodes.get(sessionId) || null
      });
    }

    // Cria nova sessão
    createWhatsAppSession(sessionId);

    // Aguarda QR Code ser gerado (timeout 30s)
    let attempts = 0;
    const maxAttempts = 60;
    
    while (!qrCodes.has(sessionId) && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    const qrCode = qrCodes.get(sessionId);
    
    if (!qrCode) {
      return res.status(500).json({ error: 'Timeout ao gerar QR Code' });
    }

    res.json({ 
      success: true,
      session_id: sessionId,
      qr_code: qrCode,
      message: 'QR Code gerado. Escaneie com WhatsApp.'
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Status da sessão
app.get('/api/whatsapp/status/:session_id', (req, res) => {
  const { session_id } = req.params;
  const status = sessionStatus.get(session_id);
  
  if (!status) {
    return res.json({ status: 'not_found' });
  }
  
  res.json(status);
});

// Enviar mensagem
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { session_id, to, message } = req.body;

    if (!session_id || !to || !message) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: session_id, to, message' 
      });
    }

    const client = sessions.get(session_id);
    
    if (!client) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    // Formata número
    let phoneNumber = to.replace(/\D/g, '');
    
    // Se não tiver código de país, assume Portugal (+351)
    if (phoneNumber.length === 9) {
      phoneNumber = '351' + phoneNumber;
    }
    
    const chatId = `${phoneNumber}@c.us`;

    console.log(`📤 Enviando mensagem para: ${chatId}`);

    // Envia
    await client.sendMessage(chatId, message);

    console.log('✅ Mensagem enviada com sucesso');

    res.json({ 
      success: true, 
      message: 'Mensagem enviada',
      to: chatId 
    });

  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Desconectar
app.post('/api/whatsapp/disconnect/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;
    const client = sessions.get(session_id);
    
    if (client) {
      await client.destroy();
      sessions.delete(session_id);
      sessionStatus.delete(session_id);
      qrCodes.delete(session_id);
      console.log(`🔌 Sessão desconectada: ${session_id}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao desconectar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    sessions: sessions.size,
    timestamp: new Date().toISOString()
  });
});

// Lista sessões ativas
app.get('/api/whatsapp/sessions', (req, res) => {
  const allSessions = [];
  
  for (const [id, status] of sessionStatus.entries()) {
    allSessions.push({ id, ...status });
  }
  
  res.json({ sessions: allSessions });
});

// Inicia servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🚀 WhatsApp Business API                   ║
  ║   📱 Modo STANDALONE (sem Supabase)          ║
  ║                                               ║
  ║   ✅ Status: ONLINE                          ║
  ║   🌐 Port: ${PORT}                              ║
  ║   💾 Sessões: 0                              ║
  ║                                               ║
  ║   📡 Endpoints:                              ║
  ║   POST   /api/whatsapp/init                  ║
  ║   GET    /api/whatsapp/status/:id            ║
  ║   POST   /api/whatsapp/send                  ║
  ║   POST   /api/whatsapp/disconnect/:id        ║
  ║   GET    /api/whatsapp/sessions              ║
  ║   GET    /health                             ║
  ║                                               ║
  ║   🔗 Frontend: http://localhost:5173         ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
  
  console.log('💡 Aguardando conexões...\n');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Encerrando servidor...');
  
  for (const [sessionId, client] of sessions) {
    console.log(`   Desconectando: ${sessionId}`);
    try {
      await client.destroy();
    } catch (error) {
      console.error(`   Erro ao desconectar ${sessionId}:`, error.message);
    }
  }
  
  console.log('✅ Servidor encerrado\n');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});
