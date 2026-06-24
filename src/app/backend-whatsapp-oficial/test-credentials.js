require('dotenv').config();
const axios = require('axios');

// ═══════════════════════════════════════════════════════════════
// TESTE DE CREDENCIAIS WHATSAPP BUSINESS API
// ═══════════════════════════════════════════════════════════════

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v18.0';

console.log('\n╔═══════════════════════════════════════════════╗');
console.log('║                                               ║');
console.log('║   🔍 Testando Credenciais WhatsApp           ║');
console.log('║                                               ║');
console.log('╚═══════════════════════════════════════════════╝\n');

async function testCredentials() {
  let errors = 0;

  // Teste 1: Verificar se variáveis estão definidas
  console.log('📋 Verificando variáveis de ambiente...\n');

  if (!WHATSAPP_TOKEN) {
    console.log('❌ WHATSAPP_TOKEN não definido');
    errors++;
  } else {
    console.log(`✅ WHATSAPP_TOKEN: ${WHATSAPP_TOKEN.substring(0, 20)}...`);
  }

  if (!PHONE_NUMBER_ID) {
    console.log('❌ WHATSAPP_PHONE_NUMBER_ID não definido');
    errors++;
  } else {
    console.log(`✅ WHATSAPP_PHONE_NUMBER_ID: ${PHONE_NUMBER_ID}`);
  }

  if (!BUSINESS_ACCOUNT_ID) {
    console.log('❌ WHATSAPP_BUSINESS_ACCOUNT_ID não definido');
    errors++;
  } else {
    console.log(`✅ WHATSAPP_BUSINESS_ACCOUNT_ID: ${BUSINESS_ACCOUNT_ID}`);
  }

  console.log(`✅ WHATSAPP_API_VERSION: ${API_VERSION}`);

  if (errors > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Erro: Variáveis de ambiente não configuradas');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('1. Copie o arquivo .env.example para .env');
    console.log('2. Preencha as credenciais no arquivo .env');
    console.log('3. Veja: CONFIGURACAO_WHATSAPP_OFICIAL.md\n');
    process.exit(1);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Teste 2: Verificar Phone Number
  console.log('📞 Testando Phone Number ID...\n');

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      }
    });

    console.log('✅ Phone Number ID válido!');
    console.log(`   Número: ${response.data.display_phone_number}`);
    console.log(`   Status: ${response.data.verified_name || 'Verificado'}`);
    console.log(`   Quality: ${response.data.quality_rating || 'N/A'}`);

  } catch (error) {
    console.log('❌ Erro ao validar Phone Number ID');
    console.log(`   ${error.response?.data?.error?.message || error.message}`);
    errors++;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Teste 3: Verificar Business Account
  console.log('🏢 Testando Business Account ID...\n');

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${BUSINESS_ACCOUNT_ID}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      }
    });

    console.log('✅ Business Account ID válido!');
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Status: ${response.data.account_review_status || 'OK'}`);

  } catch (error) {
    console.log('❌ Erro ao validar Business Account ID');
    console.log(`   ${error.response?.data?.error?.message || error.message}`);
    errors++;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Teste 4: Listar Templates
  console.log('📝 Verificando templates disponíveis...\n');

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${BUSINESS_ACCOUNT_ID}/message_templates`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`
      }
    });

    const templates = response.data.data;
    console.log(`✅ ${templates.length} template(s) encontrado(s)`);
    
    if (templates.length > 0) {
      console.log('\n   Templates aprovados:');
      templates.forEach((template, i) => {
        console.log(`   ${i + 1}. ${template.name} (${template.status})`);
      });
    } else {
      console.log('   ⚠️  Nenhum template aprovado ainda');
      console.log('   💡 Você precisará criar templates na Meta Business Suite');
    }

  } catch (error) {
    console.log('⚠️  Não foi possível listar templates');
    console.log(`   ${error.response?.data?.error?.message || error.message}`);
  }

  console.log('\n╔═══════════════════════════════════════════════╗');
  
  if (errors === 0) {
    console.log('║                                               ║');
    console.log('║   🎉 CONFIGURAÇÃO VÁLIDA!                    ║');
    console.log('║                                               ║');
    console.log('║   ✅ Todas as credenciais estão corretas     ║');
    console.log('║   ✅ API funcionando                         ║');
    console.log('║   ✅ Pronto para enviar mensagens            ║');
    console.log('║                                               ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    console.log('🚀 Próximo passo: Inicie o servidor');
    console.log('   npm start\n');
  } else {
    console.log('║                                               ║');
    console.log('║   ⚠️  CONFIGURAÇÃO INCOMPLETA                ║');
    console.log('║                                               ║');
    console.log('║   ❌ Algumas credenciais estão incorretas    ║');
    console.log('║                                               ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    console.log('📝 Verifique o arquivo .env');
    console.log('💡 Consulte: CONFIGURACAO_WHATSAPP_OFICIAL.md\n');
  }
}

testCredentials().catch(error => {
  console.error('❌ Erro ao testar:', error.message);
  process.exit(1);
});
