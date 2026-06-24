require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.ADMIN_PORT || 3003;

// ═══════════════════════════════════════════════════════════════
// MONGODB SETUP
// ═══════════════════════════════════════════════════════════════

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'ai_leadgen_pro';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

let db;
let usersCollection;
let leadsCollection;
let messagesCollection;
let activityCollection;
let metricsCollection;

// Conectar ao MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    
    // Collections
    usersCollection = db.collection('users');
    leadsCollection = db.collection('leads');
    messagesCollection = db.collection('messages');
    activityCollection = db.collection('activity');
    metricsCollection = db.collection('metrics');
    
    // Criar índices
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await activityCollection.createIndex({ timestamp: -1 });
    await leadsCollection.createIndex({ userId: 1 });
    
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    process.exit(1);
  }
}

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para admin apenas
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado: apenas administradores' });
  }
  next();
};

// ═══════════════════════════════════════════════════════════════
// ROTAS DE AUTENTICAÇÃO
// ═══════════════════════════════════════════════════════════════

// Registrar novo usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, plan = 'free' } = req.body;

    // Validar dados
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Verificar se usuário já existe
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const newUser = {
      name,
      email,
      password: hashedPassword,
      plan,
      role: 'user',
      status: 'active',
      createdAt: new Date(),
      lastLogin: null,
      totalLeads: 0,
      messagesSent: 0,
      mrr: plan === 'pro' ? 99 : plan === 'enterprise' ? 299 : 0,
      settings: {
        notifications: true,
        twoFactorEnabled: false
      }
    };

    const result = await usersCollection.insertOne(newUser);
    
    // Registrar atividade
    await activityCollection.insertOne({
      userId: result.insertedId,
      userName: name,
      action: 'Novo usuário registrado',
      type: 'register',
      timestamp: new Date()
    });

    // Gerar token
    const token = jwt.sign(
      { userId: result.insertedId, email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: result.insertedId,
        name,
        email,
        plan,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Atualizar último login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date(), status: 'online' } }
    );

    // Registrar atividade
    await activityCollection.insertOne({
      userId: user._id,
      userName: user.name,
      action: 'Login bem-sucedido',
      type: 'login',
      timestamp: new Date()
    });

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        twoFactorEnabled: user.settings?.twoFactorEnabled || false
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Verificar token
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        status: user.status,
        totalLeads: user.totalLeads,
        messagesSent: user.messagesSent
      }
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({ error: 'Erro ao verificar token' });
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS DE ADMIN - MÉTRICAS
// ═══════════════════════════════════════════════════════════════

// Obter métricas da plataforma
app.get('/api/admin/metrics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Contar usuários
    const totalUsers = await usersCollection.countDocuments();
    const activeUsers = await usersCollection.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const onlineNow = await usersCollection.countDocuments({ status: 'online' });

    // Calcular MRR
    const users = await usersCollection.find({}).toArray();
    const mrr = users.reduce((sum, user) => sum + (user.mrr || 0), 0);
    const totalRevenue = mrr * 12; // ARR estimado

    // Contar leads e mensagens
    const totalLeads = await leadsCollection.countDocuments();
    const messagesSent = await messagesCollection.countDocuments();

    // API calls (estimado)
    const apiCalls = totalLeads * 2 + messagesSent * 3;

    // Storage usado
    const dbStats = await db.stats();
    const storageUsed = (dbStats.dataSize / (1024 * 1024 * 1024)).toFixed(2); // GB

    res.json({
      success: true,
      metrics: {
        totalUsers,
        activeUsers,
        onlineNow,
        totalRevenue: Math.round(totalRevenue),
        mrr: Math.round(mrr),
        totalLeads,
        messagesSent,
        apiCalls,
        storageUsed: parseFloat(storageUsed),
        uptime: 99.97 // Pode ser integrado com serviço de monitoring
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS DE ADMIN - USUÁRIOS
// ═══════════════════════════════════════════════════════════════

// Listar todos usuários
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await usersCollection.find(
      {},
      { projection: { password: 0 } }
    ).sort({ createdAt: -1 }).toArray();

    // Enriquecer dados com estatísticas
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const leadsCount = await leadsCollection.countDocuments({ userId: user._id.toString() });
      const messagesCount = await messagesCollection.countDocuments({ userId: user._id.toString() });
      
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        status: user.status,
        lastLogin: user.lastLogin,
        totalLeads: leadsCount,
        messagesSent: messagesCount,
        createdAt: user.createdAt,
        mrr: user.mrr || 0
      };
    }));

    res.json({
      success: true,
      users: enrichedUsers,
      count: enrichedUsers.length
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Obter detalhes de um usuário
app.get('/api/admin/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Buscar dados relacionados
    const leads = await leadsCollection.find({ userId }).toArray();
    const messages = await messagesCollection.find({ userId }).toArray();
    const activities = await activityCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    res.json({
      success: true,
      user: {
        ...user,
        id: user._id,
        leads,
        messages,
        activities
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Atualizar usuário
app.patch('/api/admin/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Não permitir atualizar senha ou email por aqui
    delete updates.password;
    delete updates._id;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Registrar atividade
    await activityCollection.insertOne({
      userId: new ObjectId(req.user.userId),
      userName: req.user.email,
      action: `Atualizou dados do usuário ${userId}`,
      type: 'admin_action',
      timestamp: new Date()
    });

    res.json({ success: true, message: 'Usuário atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// Deletar usuário
app.delete('/api/admin/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Deletar usuário e dados relacionados
    await Promise.all([
      usersCollection.deleteOne({ _id: new ObjectId(userId) }),
      leadsCollection.deleteMany({ userId }),
      messagesCollection.deleteMany({ userId }),
      activityCollection.insertOne({
        userId: new ObjectId(req.user.userId),
        userName: req.user.email,
        action: `Deletou usuário ${userId}`,
        type: 'admin_action',
        timestamp: new Date()
      })
    ]);

    res.json({ success: true, message: 'Usuário deletado' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS DE ADMIN - ATIVIDADES
// ═══════════════════════════════════════════════════════════════

// Listar atividades recentes
app.get('/api/admin/activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const activities = await activityCollection
      .find({})
      .sort({ timestamp: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .toArray();

    const total = await activityCollection.countDocuments();

    res.json({
      success: true,
      activities,
      pagination: {
        total,
        skip: parseInt(skip),
        limit: parseInt(limit),
        hasMore: total > (parseInt(skip) + parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades' });
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS DE USUÁRIO - LEADS
// ═══════════════════════════════════════════════════════════════

// Criar lead
app.post('/api/leads', authenticateToken, async (req, res) => {
  try {
    const leadData = {
      ...req.body,
      userId: req.user.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await leadsCollection.insertOne(leadData);

    // Atualizar contador do usuário
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $inc: { totalLeads: 1 } }
    );

    // Registrar atividade
    await activityCollection.insertOne({
      userId: new ObjectId(req.user.userId),
      userName: req.user.email,
      action: `Criou novo lead: ${leadData.name || 'Sem nome'}`,
      type: 'lead_created',
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      lead: { id: result.insertedId, ...leadData }
    });
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

// Listar leads do usuário
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await leadsCollection
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, leads });
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    res.status(500).json({ error: 'Erro ao buscar leads' });
  }
});

// ═══════════════════════════════════════════════════════════════
// ROTAS DE USUÁRIO - MENSAGENS
// ═══════════════════════════════════════════════════════════════

// Registrar envio de mensagem
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      userId: req.user.userId,
      sentAt: new Date()
    };

    const result = await messagesCollection.insertOne(messageData);

    // Atualizar contador do usuário
    await usersCollection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $inc: { messagesSent: 1 } }
    );

    // Registrar atividade
    await activityCollection.insertOne({
      userId: new ObjectId(req.user.userId),
      userName: req.user.email,
      action: `Enviou mensagem ${messageData.channel || 'email'}`,
      type: 'message_sent',
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: { id: result.insertedId, ...messageData }
    });
  } catch (error) {
    console.error('Erro ao registrar mensagem:', error);
    res.status(500).json({ error: 'Erro ao registrar mensagem' });
  }
});

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Admin API',
    timestamp: new Date(),
    mongodb: db ? 'connected' : 'disconnected'
  });
});

// ═══════════════════════════════════════════════════════════════
// INICIAR SERVIDOR
// ═══════════════════════════════════════════════════════════════

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║                                               ║');
    console.log('║   🔐 Admin API - AI LeadGen Pro              ║');
    console.log('║   📊 Sistema de Gerenciamento Real           ║');
    console.log('║                                               ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
    console.log(`✅ Status: ONLINE`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🗄️  Database: ${DB_NAME}`);
    console.log(`💡 API: http://localhost:${PORT}\n`);
  });
});

process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promise rejeitada:', error);
});
