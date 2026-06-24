require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3002;

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v18.0';
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'meu_token_secreto';

const WHATSAPP_API_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════════════════
// VALIDAÇÃO DE CREDENCIAIS
// ═══════════════════════════════════════════════════════════════

function validateCredentials() {
  const errors = [];
  
  if (!WHATSAPP_TOKEN) errors.push('❌ WHATSAPP_TOKEN não configurado no .env');
  if (!PHONE_NUMBER_ID) errors.push('❌ WHATSAPP_PHONE_NUMBER_ID não configurado no .env');
  if (!BUSINESS_ACCOUNT_ID) errors.push('❌ WHATSAPP_BUSINESS_ACCOUNT_ID não configurado no .env');
  
  if (errors.length > 0) {
    console.error('\n╔═══════════════════════════════════════════════╗');
    console.error('║  ⚠️  ERRO DE CONFIGURAÇÃO                    ║');
    console.error('╚═══════════════════════════════════════════════╝\n');
    errors.forEach(err => console.error(err));
    console.error('\n📝 Veja o arquivo: CONFIGURACAO_WHATSAPP_OFICIAL.md');
    console.error('💡 Copie .env.example para .env e preencha as credenciais\n');
    process.exit(1);
  }
}

validateCredentials();

// ═══════════════════════════════════════════════════════════════
// ROTAS - HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WhatsApp Business API Oficial',
    version: API_VERSION,
    timestamp: new Date().toISOString(),
    phone_number_id: PHONE_NUMBER_ID,
    configured: true
  });
});

// ═══════════════════════════════════════════════════════════════
// ROTAS - ENVIAR MENSAGEM
// ═══════════════════════════════════════════════════════════════

app.post('/api/whatsapp/send', async (req, res) => {
  const { to, message, template } = req.body;

  if (!to) {
    return res.status(400).json({ 
      success: false, 
      error: 'Número de destino (to) é obrigatório' 
    });
  }

  if (!message && !template) {
    return res.status(400).json({ 
      success: false, 
      error: 'Mensagem ou template é obrigatório' 
    });
  }

  try {
    // Formata o número (remove caracteres não numéricos)
    const phoneNumber = to.replace(/\D/g, '');

    // Payload para envio de mensagem simples
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    };

    // Se for template, usa estrutura diferente
    if (template) {
      payload.type = 'template';
      payload.template = {
        name: template.name,
        language: {
          code: template.language || 'pt_BR'
        },
        components: template.components || []
      };
      delete payload.text;
    }

    console.log('📤 Enviando mensagem WhatsApp:', {
      to: phoneNumber,
      type: template ? 'template' : 'text',
      message: message?.substring(0, 50) || template?.name
    });

    const response = await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Mensagem enviada com sucesso!', response.data);

    res.json({
      success: true,
      message_id: response.data.messages[0].id,
      data: response.data
    });

  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message,
      details: error.response?.data
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS - WEBHOOK (Receber Mensagens)
// ═══════════════════════════════════════════════════════════════

// Verificação do webhook (Meta exige isso)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('✅ Webhook verificado!');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Token de verificação inválido');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Receber mensagens do webhook
app.post('/webhook', (req, res) => {
  const body = req.body;

  console.log('📩 Webhook recebido:', JSON.stringify(body, null, 2));

  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach(entry => {
      entry.changes?.forEach(change => {
        if (change.field === 'messages') {
          const value = change.value;
          
          if (value.messages) {
            value.messages.forEach(message => {
              console.log('📱 Nova mensagem:', {
                from: message.from,
                id: message.id,
                timestamp: message.timestamp,
                type: message.type,
                text: message.text?.body
              });

              // Aqui você pode processar a mensagem recebida
              // Salvar no banco, acionar IA, etc.
            });
          }

          if (value.statuses) {
            value.statuses.forEach(status => {
              console.log('📊 Status da mensagem:', {
                id: status.id,
                status: status.status,
                timestamp: status.timestamp
              });
            });
          }
        }
      });
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS - TEMPLATES
// ═══════════════════════════════════════════════════════════════

app.get('/api/whatsapp/templates', async (req, res) => {
  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${BUSINESS_ACCOUNT_ID}/message_templates`;
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      }
    });

    res.json({
      success: true,
      templates: response.data.data
    });

  } catch (error) {
    console.error('❌ Erro ao buscar templates:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// INICIAR SERVIDOR
// ═══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║                                               ║');
  console.log('║   🚀 WhatsApp Business API Oficial           ║');
  console.log('║   📱 Meta Platform                           ║');
  console.log('║                                               ║');
  console.log('╚═══════════════════════════════════════════════╝\n');
  console.log(`✅ Status: ONLINE`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`📞 Phone ID: ${PHONE_NUMBER_ID}`);
  console.log(`🏢 Business ID: ${BUSINESS_ACCOUNT_ID}`);
  console.log(`📡 API Version: ${API_VERSION}`);
  console.log(`\n💡 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// ═══════════════════════════════════════════════════════════════
// TRATAMENTO DE ERROS
// ═══════════════════════════════════════════════════════════════

process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promise rejeitada:', error);
});
