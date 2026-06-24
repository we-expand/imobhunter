# ⚡ GUIA RÁPIDO - Sistema Admin Real

## 🎯 O Que Foi Criado

✅ **Backend completo** com Node.js + Express + MongoDB  
✅ **Autenticação JWT** real  
✅ **Dashboard admin** com dados reais (sem mocks)  
✅ **Registro e login** de usuários  
✅ **Rastreamento** de leads e mensagens  
✅ **Atividades** em tempo real  
✅ **Métricas** da plataforma  

---

## 🚀 Setup em 5 Minutos

### 1️⃣ MongoDB Atlas (Gratuito)

```
1. https://www.mongodb.com/cloud/atlas/register
2. Create a Database → Shared (FREE)
3. Create User: admin / [senha forte]
4. Network Access → 0.0.0.0/0
5. Copy connection string
```

### 2️⃣ Configurar Backend

```bash
cd backend-admin
cp .env.example .env
open .env
```

Cole no .env:
```env
MONGODB_URI=mongodb+srv://admin:SUA_SENHA@cluster0.xxxxx.mongodb.net/
DB_NAME=ai_leadgen_pro
JWT_SECRET=chave-secreta-forte-123456
ADMIN_PORT=3003
```

### 3️⃣ Inicializar

```bash
npm install
npm run init-db
npm start
```

**Pronto! Backend rodando em http://localhost:3003** ✅

---

## 🔐 Login

### Frontend (http://localhost:5173)

```
Email: joao@kw.pt
Senha: admin123
```

### Depois do Login

1. Clique **"Configurações"** (⚙️)
2. Tab **"Admin"** (👑)
3. Veja dados reais!

---

## 📊 O Que Você Verá

### Dashboard Admin:
- **💰 MRR** - Receita mensal real
- **👥 Usuários** - Totais registrados
- **🟢 Online** - Em tempo real
- **💾 Storage** - MongoDB usado

### Tabs:
- **Usuários** - Lista completa com busca
- **Métricas** - Gráficos e estatísticas
- **Atividade** - Timeline de ações

---

## ✨ Funcionalidades

### Para Qualquer Usuário:
- ✅ Registrar conta
- ✅ Fazer login
- ✅ Criar leads
- ✅ Enviar mensagens
- ✅ Ver histórico

### Para Admin:
- ✅ Ver todos usuários
- ✅ Métricas da plataforma
- ✅ Exportar relatórios
- ✅ Monitorar atividades
- ✅ Gerenciar storage

---

## 📁 Arquivos Principais

```
backend-admin/
├── server.js           → API principal
├── init-database.js    → Cria admin e estrutura
├── package.json        → Dependências
├── .env.example        → Template config
└── README.md           → Docs

components/
└── admin-platform-dashboard-real.tsx → Interface admin

/SISTEMA_ADMIN_REAL.md → Documentação completa
```

---

## 🧪 Testar

### Via Terminal:

```bash
# Health check
curl http://localhost:3003/health

# Login admin
curl -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@kw.pt","password":"admin123"}'

# Copie o token retornado, depois:
curl http://localhost:3003/api/admin/metrics \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Via Navegador:

1. Login no frontend
2. F12 → Console
3. Digite: `localStorage.getItem('authToken')`
4. Use esse token nas chamadas API

---

## 📊 Collections MongoDB

| Collection | Descrição |
|-----------|-----------|
| `users` | Usuários e admins |
| `leads` | Leads dos usuários |
| `messages` | Mensagens enviadas |
| `activity` | Log de atividades |
| `metrics` | Métricas agregadas |

---

## 🔒 Segurança

- ✅ Senhas com bcrypt
- ✅ JWT com expiração (7 dias)
- ✅ Rotas protegidas
- ✅ Role-based access (admin vs user)
- ✅ .env em .gitignore

---

## 🐛 Problemas Comuns

### ❌ "MongoDB connection failed"
→ Verifique MONGODB_URI no .env (senha correta!)

### ❌ "Backend não está rodando"
→ Execute: `cd backend-admin && npm start`

### ❌ "Token inválido"
→ Faça login novamente

### ❌ "Cannot find module"
→ Execute: `npm install`

---

## 📈 Diferenças do Anterior

| Aspecto | Antes | Agora |
|---------|-------|-------|
| **Dados** | Mock (fake) | Real (MongoDB) |
| **Usuários** | 20 fixos | Dinâmico |
| **Autenticação** | localStorage | JWT + DB |
| **Leads** | Simulados | Persistentes |
| **Atividades** | Mock | Rastreadas |
| **Storage** | N/A | MongoDB Atlas |
| **Produção** | ❌ | ✅ Pronto |

---

## 🎉 Próximos Passos

### Criar Mais Usuários:

Via API:
```bash
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "maria@kw.pt",
    "password": "senha123",
    "plan": "pro"
  }'
```

Via Interface:
1. Implemente tela de registro no frontend
2. Use endpoint `/api/auth/register`

### Adicionar Leads:

```bash
curl -X POST http://localhost:3003/api/leads \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "cluster": "investidores"
  }'
```

### Ver no Dashboard:
- Dados atualizam em tempo real
- Clique "Atualizar" para sync manual

---

## 📚 Documentação Completa

Veja **`SISTEMA_ADMIN_REAL.md`** para:
- API completa
- Estrutura de dados
- Deploy em produção
- Troubleshooting avançado
- Exemplos de código

---

## ✅ Checklist

- [ ] MongoDB Atlas criado
- [ ] Connection string copiada
- [ ] .env configurado
- [ ] `npm install` executado
- [ ] `npm run init-db` com sucesso
- [ ] `npm start` rodando
- [ ] Login funcionando (joao@kw.pt)
- [ ] Dashboard mostrando dados reais

---

## 🎯 Resultado Final

✅ **Sistema admin 100% funcional**  
✅ **Dados reais no MongoDB**  
✅ **Autenticação segura**  
✅ **Interface moderna**  
✅ **Pronto para produção**  

**Zero mocks, zero fake data!** 🚀

---

**Tempo total de setup: ~10 minutos** ⏱️

**Dúvidas? Consulte `SISTEMA_ADMIN_REAL.md`** 📖
