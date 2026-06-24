# 🔐 Admin API - Backend Real

API REST com autenticação JWT e MongoDB para gerenciamento administrativo da plataforma.

---

## ⚡ Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env
cp .env.example .env
# Edite o .env com suas credenciais

# 3. Inicializar banco
npm run init-db

# 4. Iniciar servidor
npm start
```

---

## 🗄️ MongoDB Atlas Setup

### Criar Cluster Gratuito (5 min)

1. **Registrar:** https://www.mongodb.com/cloud/atlas/register
2. **Criar cluster:**
   - Shared (gratuito)
   - AWS, região Frankfurt
   - Cluster Name: Cluster0
3. **Criar usuário:**
   - Database Access → Add User
   - Username: `admin`
   - Password: [gere senha forte]
4. **Permitir IPs:**
   - Network Access → Add IP
   - `0.0.0.0/0` (qualquer IP)
5. **Copiar Connection String:**
   - Connect → Drivers → Node.js
   - `mongodb+srv://admin:<password>@...`

---

## 🔧 Configuração

### Arquivo .env

```env
# Servidor
ADMIN_PORT=3003
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://admin:sua-senha@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=ai_leadgen_pro

# JWT
JWT_SECRET=sua-chave-secreta-forte-aqui
```

---

## 🚀 Scripts

```bash
# Desenvolvimento (auto-reload)
npm run dev

# Produção
npm start

# Inicializar banco
npm run init-db
```

---

## 📡 API Endpoints

### Autenticação

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/verify
```

### Admin (requer role: admin)

```http
GET /api/admin/metrics
GET /api/admin/users
GET /api/admin/users/:userId
PATCH /api/admin/users/:userId
DELETE /api/admin/users/:userId
GET /api/admin/activity
```

### Usuários

```http
POST /api/leads
GET /api/leads
POST /api/messages
```

### Health

```http
GET /health
```

---

## 🔒 Autenticação

Todas as rotas (exceto login/register) requerem JWT:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

Rotas admin requerem `role: 'admin'`.

---

## 🗂️ Collections

- `users` - Usuários e admins
- `leads` - Leads dos usuários
- `messages` - Mensagens enviadas
- `activity` - Log de atividades
- `metrics` - Métricas agregadas

---

## 👑 Usuário Admin Padrão

Após `npm run init-db`:

```
Email: joao@kw.pt
Senha: admin123
Role: admin
```

**⚠️ MUDE A SENHA EM PRODUÇÃO!**

---

## 🧪 Testar

```bash
# Health check
curl http://localhost:3003/health

# Login
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@kw.pt","password":"admin123"}'

# Métricas (com token)
curl http://localhost:3003/api/admin/metrics \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📊 Monitoramento

### Logs no Terminal
```bash
✅ MongoDB conectado com sucesso!
✅ Status: ONLINE
🌐 Port: 3003
```

### MongoDB Atlas
```
https://cloud.mongodb.com/
→ Ver métricas, storage, conexões
```

---

## 🐛 Troubleshooting

### Erro de Conexão MongoDB

**Verifique:**
1. MONGODB_URI correto no .env
2. Senha sem `<password>` placeholder
3. Network Access: 0.0.0.0/0
4. Cluster está ativo

### Token Inválido

**Verifique:**
1. JWT_SECRET é o mesmo
2. Token não expirou (7 dias)
3. Header: `Authorization: Bearer TOKEN`

---

## 📚 Dependências

- **express** - Framework web
- **mongodb** - Driver MongoDB
- **jsonwebtoken** - Autenticação JWT
- **bcryptjs** - Hash de senhas
- **cors** - Cross-Origin
- **dotenv** - Variáveis de ambiente

---

## 🚀 Deploy

### Heroku

```bash
heroku create nome-app
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
git push heroku main
```

### PM2 (VPS)

```bash
npm install -g pm2
pm2 start server.js --name admin-api
pm2 startup
pm2 save
```

---

**Sistema pronto para produção!** ✅
