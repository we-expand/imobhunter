require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'ai_leadgen_pro';

async function initDatabase() {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   🗄️  Inicializando Banco de Dados          ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  try {
    // Conectar
    console.log('📡 Conectando ao MongoDB...');
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    console.log('✅ Conectado!\n');

    // Limpar dados existentes
    console.log('🗑️  Limpando dados antigos...');
    await db.collection('users').deleteMany({});
    await db.collection('leads').deleteMany({});
    await db.collection('messages').deleteMany({});
    await db.collection('activity').deleteMany({});
    await db.collection('metrics').deleteMany({});
    console.log('✅ Dados limpos!\n');

    // Criar usuário admin
    console.log('👑 Criando usuário administrador...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = {
      name: 'João Nunes',
      email: 'joao@kw.pt',
      password: adminPassword,
      plan: 'enterprise',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      lastLogin: null,
      totalLeads: 0,
      messagesSent: 0,
      mrr: 0,
      settings: {
        notifications: true,
        twoFactorEnabled: false
      }
    };

    const adminResult = await db.collection('users').insertOne(adminUser);
    console.log('✅ Admin criado!');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Senha: admin123`);
    console.log(`   ID: ${adminResult.insertedId}\n`);

    // Registrar atividade inicial
    await db.collection('activity').insertOne({
      userId: adminResult.insertedId,
      userName: adminUser.name,
      action: 'Sistema inicializado',
      type: 'system',
      timestamp: new Date()
    });

    // Criar índices
    console.log('📑 Criando índices...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('activity').createIndex({ timestamp: -1 });
    await db.collection('leads').createIndex({ userId: 1 });
    await db.collection('messages').createIndex({ userId: 1 });
    console.log('✅ Índices criados!\n');

    // Estatísticas
    const stats = await db.stats();
    console.log('📊 Estatísticas do Banco:');
    console.log(`   Database: ${DB_NAME}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Tamanho: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   Documentos: ${stats.objects}`);

    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║   ✅ BANCO DE DADOS PRONTO!                  ║');
    console.log('╚═══════════════════════════════════════════════╝\n');

    console.log('🚀 Próximos passos:');
    console.log('   1. npm start (iniciar servidor)');
    console.log('   2. Fazer login com:');
    console.log('      Email: joao@kw.pt');
    console.log('      Senha: admin123\n');

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao inicializar banco:', error);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('connect')) {
      console.log('\n💡 Dica: Verifique se:');
      console.log('   1. MongoDB está rodando');
      console.log('   2. MONGODB_URI está correto no .env');
      console.log('   3. Se usando Atlas, IP está permitido');
      console.log('   4. Usuário e senha estão corretos\n');
    }
    
    process.exit(1);
  }
}

initDatabase();
