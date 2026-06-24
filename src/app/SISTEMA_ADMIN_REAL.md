# 🔐 Sistema Administrativo Real - AI LeadGen Pro

## 📋 Visão Geral

Sistema completo de administração com **dados reais** armazenados no MongoDB Atlas, incluindo autenticação JWT, gerenciamento de usuários, métricas em tempo real e rastreamento de atividades.

---

## ✨ Funcionalidades

### 🎯 Para Usuários:
- ✅ Registro e login com autenticação JWT
- ✅ Gerenciamento de leads pessoais
- ✅ Tracking de mensagens enviadas
- ✅ Histórico de atividades
- ✅ Dados persistentes no MongoDB

### 👑 Para Administradores:
- ✅ Dashboard com métricas em tempo real
- ✅ Lista completa de usuários registrados
- ✅ Estatísticas de uso da plataforma
- ✅ Monitoramento de atividades
- ✅ Exportação de relatórios
- ✅ Gestão de storage (MongoDB Atlas)

---

## 🗄️ Arquitetura

```
┌─────────────────────────────────────────────────┐
│  Frontend (React + TypeScript)                  │
│  - AdminPlatformDashboardReal                   │
│  - Autenticação via localStorage                │
│  - Requisições HTTP com JWT                     │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP + JWT
                 ↓
┌─────────────────────────────────────────────────┐
│  Backend API (Node.js + Express)                │
│  - Autenticação JWT                             │
│  - Rotas protegidas                             │
│  - Middleware de autorização                    │
└────────────────┬────────────────────────────────┘
                 │
                 │ MongoDB Driver
                 ↓
┌─────────────────────────────────────────────────┐
│  MongoDB Atlas (Cloud)                          │
│  - Cluster gratuito 512MB                       │
│  - 5 Collections:                               │
│    • users                                      │
│    • leads                                      │
│    • messages                                   │
│    • activity                                   │
│    • metrics                                    │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Configuração

### PASSO 1: MongoDB Atlas (Gratuito)

1. **Criar Conta:**
   ```
   https://www.mongodb.com/cloud/atlas/register
   ```

2. **Criar Cluster Gratuito:**
   - Clique: "Build a Database"
   - Escolha: "Shared" (gratuito)
   - Provider: AWS
   - Região: Mais próxima (ex: Frankfurt)
   - Clique: "Create"

3. **Criar Usuário do Banco:**
   - Security → Database Access
   - Add New Database User
   - Username: `admin`
   - Password: `[gere uma senha forte]`
   - Role: Atlas Admin
   - Add User

4. **Permitir Conexões:**
   - Security → Network Access
   - Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0`
   - Confirm

5. **Obter Connection String:**
   - Databases → Connect
   - Connect your application
   - Driver: Node.js
   - Copie a string: `mongodb+srv://admin:<password>@...`

### PASSO 2: Configurar Backend

```bash
# Entrar na pasta
cd backend-admin

# Copiar .env
cp .env.example .env

# Editar .env
open .env
```

**Preencha o .env:**

```env
# Servidor
ADMIN_PORT=3003
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://admin:SUA_SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=ai_leadgen_pro

# JWT Secret (MUDE!)
JWT_SECRET=uma-chave-super-secreta-aqui-123456
```

⚠️ **Substitua:**
- `SUA_SENHA` → Senha do usuário MongoDB
- `cluster0.xxxxx` → Seu cluster ID
- `JWT_SECRET` → Gere uma chave forte

### PASSO 3: Instalar e Inicializar

```bash
# Instalar dependências
npm install

# Inicializar banco de dados
npm run init-db
```

**Você verá:**

```
╔═══════════════════════════════════════════════╗
║   🗄️  Inicializando Banco de Dados          ║
╚═══════════════════════════════════════════════╝

📡 Conectando ao MongoDB...
✅ Conectado!

🗑️  Limpando dados antigos...
✅ Dados limpos!

👑 Criando usuário administrador...
✅ Admin criado!
   Email: joao@kw.pt
   Senha: admin123
   ID: 6751...

📑 Criando índices...
✅ Índices criados!

╔═══════════════════════════════════════════════╗
║   ✅ BANCO DE DADOS PRONTO!                  ║
╚═══════════════════════════════════════════════╝
```

### PASSO 4: Iniciar Servidor

```bash
npm start
```

**Servidor rodando:**

```
╔═══════════════════════════════════════════════╗
║   🔐 Admin API - AI LeadGen Pro              ║
║   📊 Sistema de Gerenciamento Real           ║
╚═══════════════════════════════════════════════╝

✅ Status: ONLINE
🌐 Port: 3003
🗄️  Database: ai_leadgen_pro
💡 API: http://localhost:3003
```

**DEIXE O TERMINAL ABERTO!**

### PASSO 5: Fazer Login na Aplicação

1. **Abra o navegador:**
   ```
   http://localhost:5173
   ```

2. **Faça login com credenciais admin:**
   - Email: `joao@kw.pt`
   - Senha: `admin123`

3. **Acesse Configurações → Admin**

4. **Você verá os dados reais!** ✅

---

## 📡 API Endpoints

### Autenticação

#### Registrar Usuário
```http
POST http://localhost:3003/api/auth/register
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@kw.pt",
  "password": "senha123",
  "plan": "pro"
}
```

**Resposta:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6751abc123...",
    "name": "Maria Silva",
    "email": "maria@kw.pt",
    "plan": "pro",
    "role": "user"
  }
}
```

#### Login
```http
POST http://localhost:3003/api/auth/login
Content-Type: application/json

{
  "email": "joao@kw.pt",
  "password": "admin123"
}
```

#### Verificar Token
```http
GET http://localhost:3003/api/auth/verify
Authorization: Bearer SEU_TOKEN_AQUI
```

### Admin (Requer role: admin)

#### Obter Métricas
```http
GET http://localhost:3003/api/admin/metrics
Authorization: Bearer SEU_TOKEN_ADMIN
```

**Resposta:**
```json
{
  "success": true,
  "metrics": {
    "totalUsers": 15,
    "activeUsers": 12,
    "onlineNow": 3,
    "totalRevenue": 12400,
    "mrr": 1033,
    "totalLeads": 234,
    "messagesSent": 567,
    "apiCalls": 1935,
    "storageUsed": 0.02,
    "uptime": 99.97
  },
  "timestamp": "2024-12-13T..."
}
```

#### Listar Usuários
```http
GET http://localhost:3003/api/admin/users
Authorization: Bearer SEU_TOKEN_ADMIN
```

#### Detalhes de Usuário
```http
GET http://localhost:3003/api/admin/users/:userId
Authorization: Bearer SEU_TOKEN_ADMIN
```

#### Atualizar Usuário
```http
PATCH http://localhost:3003/api/admin/users/:userId
Authorization: Bearer SEU_TOKEN_ADMIN
Content-Type: application/json

{
  "plan": "enterprise",
  "status": "active"
}
```

#### Deletar Usuário
```http
DELETE http://localhost:3003/api/admin/users/:userId
Authorization: Bearer SEU_TOKEN_ADMIN
```

#### Atividades Recentes
```http
GET http://localhost:3003/api/admin/activity?limit=50&skip=0
Authorization: Bearer SEU_TOKEN_ADMIN
```

### Usuário (Requer autenticação)

#### Criar Lead
```http
POST http://localhost:3003/api/leads
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "+351912345678",
  "cluster": "investidores",
  "status": "frio"
}
```

#### Listar Leads
```http
GET http://localhost:3003/api/leads
Authorization: Bearer SEU_TOKEN
```

#### Registrar Mensagem
```http
POST http://localhost:3003/api/messages
Authorization: Bearer SEU_TOKEN
Content-Type: application/json

{
  "leadId": "6751...",
  "channel": "whatsapp",
  "content": "Olá! Temos um imóvel...",
  "status": "sent"
}
```

---

## 🗂️ Estrutura do Banco de Dados

### Collection: `users`
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,         // unique index
  password: String,      // bcrypt hash
  plan: String,          // 'free' | 'pro' | 'enterprise'
  role: String,          // 'user' | 'admin'
  status: String,        // 'active' | 'inactive' | 'online'
  createdAt: Date,
  lastLogin: Date,
  totalLeads: Number,
  messagesSent: Number,
  mrr: Number,
  settings: {
    notifications: Boolean,
    twoFactorEnabled: Boolean
  }
}
```

### Collection: `leads`
```javascript
{
  _id: ObjectId,
  userId: String,        // index
  name: String,
  email: String,
  phone: String,
  cluster: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: `messages`
```javascript
{
  _id: ObjectId,
  userId: String,        // index
  leadId: String,
  channel: String,       // 'email' | 'sms' | 'whatsapp'
  content: String,
  status: String,
  sentAt: Date
}
```

### Collection: `activity`
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  userName: String,
  action: String,
  type: String,
  timestamp: Date        // index desc
}
```

---

## 🎨 Interface Admin

### Dashboard Real

**KPIs Principais:**
- 💰 MRR (Receita Mensal Recorrente)
- 👥 Usuários Totais
- 🟢 Online Agora (tempo real)
- 💾 Storage MongoDB

**Tabs:**

1. **👥 Usuários:**
   - Lista completa de usuários registrados
   - Busca por nome/email
   - Ordenação por atividade
   - Badges de plano e status
   - Métricas individuais (leads, mensagens, MRR)

2. **📊 Métricas:**
   - Distribuição por plano (Free/Pro/Enterprise)
   - Gráficos de receita
   - Estatísticas de uso
   - Storage consumido

3. **🔥 Atividade:**
   - Timeline de ações em tempo real
   - Filtros por tipo
   - Usuário e timestamp

**Funcionalidades:**
- ✅ Atualização em tempo real
- ✅ Exportação para CSV
- ✅ Busca e filtros
- ✅ Paginação
- ✅ Sem dados mockados

---

## 🔒 Segurança

### JWT Authentication
```javascript
// Token contém:
{
  userId: String,
  email: String,
  role: String,
  iat: Number,
  exp: Number  // 7 dias
}
```

### Middleware de Autenticação
```javascript
// Todas as rotas /api/* requerem token
Authorization: Bearer TOKEN

// Rotas /api/admin/* requerem role: 'admin'
```

### Senhas
- Hashed com bcrypt (salt rounds: 10)
- Nunca retornadas em queries
- Validação no backend

### MongoDB
- Connection string em variável de ambiente
- Atlas Network Access configurado
- Índices únicos em campos sensíveis

---

## 📊 Monitoramento

### Health Check
```bash
curl http://localhost:3003/health
```

**Resposta:**
```json
{
  "status": "ok",
  "service": "Admin API",
  "timestamp": "2024-12-13T...",
  "mongodb": "connected"
}
```

### Logs do Servidor
```bash
# No terminal onde rodou npm start
✅ MongoDB conectado com sucesso!
✅ Status: ONLINE
🌐 Port: 3003
```

### MongoDB Atlas Dashboard
```
https://cloud.mongodb.com/
→ Seu cluster
→ Metrics
→ Database
```

Veja:
- Storage usado
- Operações/segundo
- Conexões ativas
- Slow queries

---

## 🧪 Testes

### Criar Usuários de Teste

```bash
# Via API
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Silva",
    "email": "teste@kw.pt",
    "password": "teste123",
    "plan": "pro"
  }'
```

### Criar Leads de Teste

```bash
# Primeiro, faça login e pegue o token
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3003/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lead Teste",
    "email": "lead@exemplo.com",
    "phone": "+351912345678",
    "cluster": "investidores"
  }'
```

---

## 🐛 Troubleshooting

### ❌ "MongoDB connection failed"

**Problema:** Não consegue conectar ao Atlas

**Soluções:**
1. Verifique MONGODB_URI no .env
2. Substitua `<password>` pela senha real
3. Verifique Network Access (IP 0.0.0.0/0)
4. Tente URL encode da senha se tiver caracteres especiais

### ❌ "Token inválido"

**Problema:** Autenticação falhando

**Soluções:**
1. Verifique se fez login
2. Token está no localStorage?
3. JWT_SECRET é o mesmo no .env?
4. Token expirou? (válido por 7 dias)

### ❌ "Acesso negado: apenas administradores"

**Problema:** Tentando acessar rota admin sem permissão

**Soluções:**
1. Faça login com usuário admin (joao@kw.pt)
2. Verifique role no token
3. Rode `npm run init-db` para criar admin

### ❌ "Cannot find module"

**Problema:** Dependências não instaladas

**Solução:**
```bash
cd backend-admin
npm install
```

---

## 🚀 Deploy em Produção

### Variáveis de Ambiente

```env
# Produção
NODE_ENV=production
ADMIN_PORT=3003
MONGODB_URI=mongodb+srv://...
JWT_SECRET=[gere chave forte de 64+ caracteres]
```

### Heroku

```bash
# Criar app
heroku create leadgen-admin-api

# Configurar variáveis
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=sua-chave-forte
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### DigitalOcean / AWS

```bash
# No servidor
git clone seu-repo
cd backend-admin
npm install --production

# PM2 para manter rodando
npm install -g pm2
pm2 start server.js --name admin-api
pm2 startup
pm2 save

# Nginx reverse proxy
# Apontar para localhost:3003
```

---

## 📈 Próximos Passos

### Funcionalidades Futuras:
- [ ] Webhooks para eventos
- [ ] Sistema de notificações push
- [ ] Relatórios PDF automáticos
- [ ] Gráficos interativos (Chart.js)
- [ ] Filtros avançados
- [ ] Bulk operations
- [ ] Audit trail completo
- [ ] Rate limiting
- [ ] API versioning

### Otimizações:
- [ ] Redis cache
- [ ] Query optimization
- [ ] Aggregation pipelines
- [ ] Pagination melhorada
- [ ] WebSocket para real-time
- [ ] Background jobs (Bull)

---

## 📚 Recursos

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **MongoDB Node Driver:** https://mongodb.github.io/node-mongodb-native/
- **JWT:** https://jwt.io/
- **Express:** https://expressjs.com/
- **bcrypt:** https://github.com/kelektiv/node.bcrypt.js

---

## ✅ Checklist de Configuração

- [ ] MongoDB Atlas cluster criado
- [ ] Usuário do banco criado
- [ ] Network Access configurado (0.0.0.0/0)
- [ ] Connection string copiada
- [ ] Arquivo .env criado
- [ ] MONGODB_URI preenchido
- [ ] JWT_SECRET gerado
- [ ] `npm install` executado
- [ ] `npm run init-db` executado com sucesso
- [ ] `npm start` rodando
- [ ] Login no frontend funcionando
- [ ] Dashboard admin mostrando dados reais

---

**Sistema 100% funcional com dados reais!** ✅

**Sem mocks, sem dados falsos, tudo persistente no MongoDB!** 🎉
