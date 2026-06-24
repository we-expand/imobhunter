# 🚀 WhatsApp Business API - Backend Real

Servidor Node.js para integração REAL do WhatsApp Business com AI LeadGen Pro.

---

## ⚡ QUICK START (Modo Simples - SEM Supabase)

### 🎯 **SOLUÇÃO DO "QR CODE INVÁLIDO"**

Use o **server-simple.js** que funciona STANDALONE sem Supabase!

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor simples
npm run start:simple

# 3. Pronto! Backend rodando em http://localhost:3001
```

**Agora o QR Code será VÁLIDO!** ✅

---

## 📋 Pré-requisitos

- **Node.js 18+** instalado → [Download](https://nodejs.org/)
- **Google Chrome** ou Chromium (usado pelo Puppeteer)
- **2GB RAM** mínimo (recomendado 4GB)

---

## 🔧 Instalação

### 1️⃣ Navegue até a pasta

```bash
cd backend-whatsapp
```

### 2️⃣ Instale as dependências

```bash
npm install
```

**Dependências instaladas:**
- `whatsapp-web.js` - Biblioteca oficial WhatsApp Web
- `qrcode` - Gerador de QR Code em base64
- `express` - Servidor HTTP
- `cors` - CORS habilitado

*Aguarde 2-3 minutos na primeira vez (~200MB)*

### 3️⃣ Escolha o modo

#### **Opção A: Modo Simples (RECOMENDADO)**
Funciona sem Supabase, apenas API local.

```bash
npm run start:simple
```

#### **Opção B: Modo Completo (Com Supabase)**
Requer Supabase configurado.

```bash
# Configure .env primeiro
cp .env.example .env
# Edite com suas credenciais

npm start
```

---

## 📡 Endpoints da API

### 🟢 POST `/api/whatsapp/init`
Inicia nova sessão e gera QR Code.

```bash
curl -X POST http://localhost:3001/api/whatsapp/init \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user"}'
```

**Resposta:**
```json
{
  "success": true,
  "session_id": "wa-1234567890-test-user",
  "qr_code": "data:image/png;base64,...",
  "message": "QR Code gerado. Escaneie com WhatsApp."
}
```

### 🟢 GET `/api/whatsapp/status/:session_id`
Verifica status da sessão.

```bash
curl http://localhost:3001/api/whatsapp/status/wa-123456789
```

**Resposta:**
```json
{
  "status": "connected",
  "phone_number": "+351 912 345 678",
  "raw_phone": "+351912345678"
}
```

### 🟢 POST `/api/whatsapp/send`
Envia mensagem.

```bash
curl -X POST http://localhost:3001/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "wa-123456789",
    "to": "351912345678",
    "message": "Olá! Mensagem de teste."
  }'
```

### 🟢 POST `/api/whatsapp/disconnect/:session_id`
Desconecta sessão.

```bash
curl -X POST http://localhost:3001/api/whatsapp/disconnect/wa-123456789
```

### 🟢 GET `/health`
Health check.

```bash
curl http://localhost:3001/health
```

### 🟢 GET `/api/whatsapp/sessions`
Lista todas as sessões ativas.

```bash
curl http://localhost:3001/api/whatsapp/sessions
```

---

## 📱 Como Usar

### 1️⃣ Backend rodando

Certifique-se que o servidor está ativo:

```
╔═══════════════════════════════════════════════╗
║   🚀 WhatsApp Business API                   ║
║   ✅ Status: ONLINE                          ║
║   🌐 Port: 3001                              ║
╚═══════════════════════════════════════════════╝
```

### 2️⃣ Frontend conectado

No navegador, acesse `http://localhost:5173`:
- Vá em **Configurações** → **Integrações**
- Na seção **WhatsApp Business API**
- Clique em **"Backend Real"** (botão verde)

### 3️⃣ QR Code gerado

Um QR Code VÁLIDO aparecerá na tela.

### 4️⃣ Escaneie com WhatsApp

No celular:
1. Abra **WhatsApp**
2. Menu **⋮** → **Aparelhos conectados**
3. **Conectar um aparelho**
4. Aponte para o QR Code

### 5️⃣ Conectado!

Você receberá uma mensagem:

```
🎉 Conexão Estabelecida!

✅ Seu WhatsApp está conectado ao AI LeadGen Pro

📱 Número: +351 XXX XXX XXX
🔐 Conexão criptografada
🤖 Sistema de IA ativo

Mensagem de: João Nunes
AI LeadGen Pro - KW Portugal
```

---

## 🧪 Testar Envio de Mensagem

Após conectar, clique em **"Enviar Mensagem: João Nunes"** no frontend.

Você receberá:

```
🎉 Olá! Sou o João Nunes do AI LeadGen Pro.

Esta é uma mensagem de teste para confirmar que 
seu WhatsApp está conectado corretamente...

✅ Conexão estabelecida com sucesso!

Agora você pode:
• Enviar campanhas automáticas
• Nutrir leads com IA
• Responder automaticamente

Bem-vindo à revolução da prospecção! 🚀
```

---

## 🔧 Dois Modos Disponíveis

### 🎯 Modo Simples (`server-simple.js`)
**✅ RECOMENDADO para começar**

- ✅ Funciona standalone (sem Supabase)
- ✅ Setup em 2 minutos
- ✅ QR Code válido
- ✅ Conexão real com WhatsApp
- ✅ Envio de mensagens
- ✅ API REST completa
- ❌ Sem persistência em banco
- ❌ Sem webhooks
- ❌ Sem Realtime channels

**Uso**: Testes, desenvolvimento, MVP

```bash
npm run start:simple
```

### 🔥 Modo Completo (`server.js`)
**Para produção com múltiplos usuários**

- ✅ Tudo do modo simples +
- ✅ Integração com Supabase
- ✅ Persistência em banco de dados
- ✅ Webhooks configuráveis
- ✅ Realtime updates
- ✅ Multi-tenant (vários usuários)
- ✅ Logs e auditoria

**Uso**: Produção, SaaS, múltiplos clientes

```bash
npm start
```

---

## 🌐 Deploy em Produção

### Opção 1: Railway.app (GRÁTIS - Mais Fácil)

1. Crie conta: https://railway.app/
2. **New Project** → **Deploy from GitHub**
3. Selecione seu repositório
4. Configure:
   - **Root Directory**: `backend-whatsapp`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start:simple`
5. Railway gera URL pública automaticamente
6. Copie URL: `https://seu-app.up.railway.app`
7. Atualize frontend:
   ```env
   VITE_WHATSAPP_SERVER_URL=https://seu-app.up.railway.app
   ```

### Opção 2: Render.com (GRÁTIS)

1. Crie conta: https://render.com/
2. **New +** → **Web Service**
3. Conecte GitHub
4. Configure:
   - **Build**: `cd backend-whatsapp && npm install`
   - **Start**: `cd backend-whatsapp && npm run start:simple`
5. Deploy automático
6. URL pública disponível

### Opção 3: VPS (DigitalOcean, Hetzner, Contabo)

```bash
# SSH no servidor
ssh root@seu-servidor.com

# Instale Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Clone projeto
git clone https://github.com/seu-repo/ai-leadgen-pro.git
cd ai-leadgen-pro/backend-whatsapp

# Instale dependências
npm install

# Instale PM2
npm install -g pm2

# Inicie servidor
pm2 start server-simple.js --name whatsapp-api

# Configure auto-start
pm2 startup
pm2 save

# Configure Nginx reverse proxy
apt install nginx
nano /etc/nginx/sites-available/whatsapp-api

# Cole:
server {
    listen 80;
    server_name api.seudominio.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ative
ln -s /etc/nginx/sites-available/whatsapp-api /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Configure SSL (Let's Encrypt)
apt install certbot python3-certbot-nginx
certbot --nginx -d api.seudominio.com
```

---

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Com PM2
pm2 logs whatsapp-api

# Modo desenvolvimento
npm run dev:simple
```

### Status das Sessões

```bash
# Lista todas as sessões
curl http://localhost:3001/api/whatsapp/sessions

# Status específica
curl http://localhost:3001/api/whatsapp/status/wa-123456789
```

### Health Check

```bash
curl http://localhost:3001/health

# Resposta:
# {
#   "status": "online",
#   "sessions": 2,
#   "timestamp": "2024-12-13T10:36:00.000Z"
# }
```

---

## 🐛 Resolução de Problemas

### ❌ "npm not found"
**Causa**: Node.js não instalado  
**Solução**: https://nodejs.org/ → Instale LTS

### ❌ "Port 3001 already in use"
**Causa**: Outro processo usando a porta  
**Solução**:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <número>

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### ❌ "Failed to launch browser"
**Causa**: Chromium não instalado  
**Solução**: Aguarde download automático ou instale Chrome

### ❌ QR Code não aparece
**Causa**: Primeira execução baixando Chromium  
**Solução**: Aguarde 10-20 segundos

### ❌ "QR code inválido" no WhatsApp
**Causa**: Usando Modo Demo (sem backend)  
**Solução**: Execute `npm run start:simple` e use botão "Backend Real"

### ❌ Sessão desconecta sozinha
**Causa**: Normal após 14 dias de inatividade  
**Solução**: Reconecte gerando novo QR Code

### ❌ Mensagem não envia
**Causa**: Sessão não conectada ou número inválido  
**Solução**: 
- Verifique status: `GET /api/whatsapp/status/:id`
- Formato número: `351912345678` (sem + ou espaços)

---

## 🔐 Segurança

### ⚠️ IMPORTANTE

- **NUNCA** exponha backend diretamente à internet sem autenticação
- Use **API Keys** ou **tokens JWT**
- Configure **CORS** para domínios específicos
- Use **HTTPS** em produção (obrigatório)
- Implemente **rate limiting**
- Faça **backup** das sessões

### Exemplo de Autenticação

Adicione ao `server-simple.js`:

```javascript
const API_KEY = process.env.API_KEY || 'sua-chave-super-secreta';

// Middleware de autenticação
app.use((req, res, next) => {
  // Ignora health check
  if (req.path === '/health') return next();
  
  const authHeader = req.headers.authorization;
  
  if (authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
});
```

### CORS Restrito

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://seu-dominio.com'
  ],
  credentials: true
}));
```

---

## 📚 Documentação Adicional

- **Setup Completo**: `/WHATSAPP_BACKEND_SETUP.md`
- **Quick Start**: `/QUICK_START_WHATSAPP.md`
- **Guia Original**: `/WHATSAPP_SETUP_GUIDE.md`
- **whatsapp-web.js**: https://wwebjs.dev/

---

## 📄 Licença

MIT - AI LeadGen Pro

---

## 🤝 Suporte

Problemas? Dúvidas?

1. Leia a documentação completa
2. Verifique os logs: `pm2 logs whatsapp-api`
3. Teste endpoints com `curl`
4. Abra issue no GitHub

---

## ✅ Checklist de Validação

Antes de marcar como "funcionando":

- [ ] Node.js instalado (`node --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado (`npm run start:simple`)
- [ ] Backend mostra "Status: ONLINE"
- [ ] Health check responde: `curl http://localhost:3001/health`
- [ ] Frontend conecta ao backend
- [ ] Botão "Backend Real" clicado
- [ ] QR Code VÁLIDO gerado (não dá erro no WhatsApp)
- [ ] WhatsApp escaneou com sucesso
- [ ] Status mudou para "Conectado"
- [ ] Mensagem de boas-vindas recebida
- [ ] Teste de envio funcionou (mensagem de João Nunes)
- [ ] Logs sem erros

---

**🎉 WhatsApp Business API funcionando 100%!**

Criado para **AI LeadGen Pro** | **KW Portugal**
