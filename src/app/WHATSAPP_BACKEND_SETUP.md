# 🚀 Setup Backend WhatsApp Business API

## ✅ SOLUÇÃO DO "QR CODE INVÁLIDO"

O erro ocorre porque o QR Code gerado não era válido. Agora temos um **backend REAL** que gera QR Codes **VÁLIDOS** do WhatsApp!

---

## 📋 PRÉ-REQUISITOS

1. **Node.js** instalado (v16 ou superior)
   - Download: https://nodejs.org/
   - Verifique: `node --version`

2. **Google Chrome** ou **Chromium** instalado
   - O whatsapp-web.js usa Puppeteer que precisa do Chrome

---

## ⚡ INSTALAÇÃO RÁPIDA (5 minutos)

### 1️⃣ Abra o Terminal/CMD

```bash
# Windows: Pressione Win+R, digite "cmd"
# Mac: Pressione Cmd+Space, digite "Terminal"
# Linux: Ctrl+Alt+T
```

### 2️⃣ Navegue até a pasta do backend

```bash
cd /caminho/para/seu/projeto/backend-whatsapp
```

### 3️⃣ Instale as dependências

```bash
npm install whatsapp-web.js qrcode express cors
```

**Aguarde 2-3 minutos** (vai baixar ~200MB de dependências)

### 4️⃣ Inicie o servidor

```bash
node server-simple.js
```

**Pronto!** Você verá:

```
╔═══════════════════════════════════════════════╗
║   🚀 WhatsApp Business API                   ║
║   📱 Modo STANDALONE                         ║
║   ✅ Status: ONLINE                          ║
║   🌐 Port: 3001                              ║
╚═══════════════════════════════════════════════╝
```

---

## 📱 COMO USAR

### 1. Com o backend rodando, acesse seu navegador:
   - Frontend deve estar em: `http://localhost:5173`

### 2. Vá em **Configurações** → **Integrações** → **WhatsApp Business**

### 3. Clique em **"Backend Real"** (botão verde)

### 4. Um QR Code VÁLIDO será gerado

### 5. No seu celular:
   - Abra **WhatsApp**
   - Menu **⋮** → **Aparelhos conectados**
   - **Conectar um aparelho**
   - Escaneie o QR Code

### 6. ✅ Conexão estabelecida!
   - Você receberá uma mensagem de confirmação
   - Status mudará para "Conectado"

---

## 🧪 TESTAR ENVIO DE MENSAGEM

Depois de conectado, clique em **"Enviar Mensagem: João Nunes"**

Você receberá no WhatsApp:

```
🎉 Olá! Sou o João Nunes do AI LeadGen Pro.

Esta é uma mensagem de teste para confirmar que 
seu WhatsApp está conectado corretamente...

✅ Conexão estabelecida com sucesso!
```

---

## 🐛 RESOLUÇÃO DE PROBLEMAS

### ❌ "npm not found"
- **Solução**: Instale Node.js: https://nodejs.org/

### ❌ "Port 3001 already in use"
- **Solução**: Outro processo está usando a porta
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <número> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### ❌ "Failed to launch the browser process"
- **Solução**: Instale Google Chrome
- Ou configure Chromium manualmente

### ❌ Backend conecta mas QR Code não aparece
- **Solução**: Aguarde 10-15 segundos
- O Puppeteer precisa baixar Chromium na primeira vez

### ❌ QR Code expira antes de escanear
- **Solução**: Normal! Gere um novo
- Cada QR Code dura 45 segundos

---

## 🔥 MODO DEMO vs BACKEND REAL

### 🎭 MODO DEMO (Padrão)
- ✅ Funciona SEM backend
- ✅ Interface completa
- ❌ Não envia mensagens reais
- ❌ QR Code inválido
- **Uso**: Testar interface

### ✅ BACKEND REAL (Recomendado)
- ✅ QR Code VÁLIDO
- ✅ Conexão REAL com WhatsApp
- ✅ Envia mensagens DE VERDADE
- ✅ Recebe respostas
- **Uso**: Produção

---

## 📊 MONITORAMENTO

### Ver sessões ativas:
```bash
curl http://localhost:3001/api/whatsapp/sessions
```

### Health check:
```bash
curl http://localhost:3001/health
```

### Logs em tempo real:
- O terminal mostrará todos os eventos
- QR Code gerado
- Conexão estabelecida
- Mensagens enviadas/recebidas

---

## 🚀 DEPLOY EM PRODUÇÃO

### Opção 1: Railway.app (GRÁTIS)
1. Crie conta: https://railway.app/
2. New Project → Deploy from GitHub
3. Configure: `npm install && node server-simple.js`
4. Obtenha URL pública: `https://seu-app.railway.app`
5. Atualize frontend: `VITE_WHATSAPP_SERVER_URL=https://seu-app.railway.app`

### Opção 2: Render.com (GRÁTIS)
1. Crie conta: https://render.com/
2. New Web Service → Connect GitHub
3. Build: `npm install`
4. Start: `node server-simple.js`
5. URL pública disponível

### Opção 3: VPS próprio
1. Alugue VPS (Contabo, Hetzner, DigitalOcean)
2. Instale Node.js
3. Clone repositório
4. Execute com PM2:
```bash
npm install -g pm2
pm2 start server-simple.js --name whatsapp-api
pm2 startup
pm2 save
```

---

## 🔐 SEGURANÇA

### ⚠️ IMPORTANTE:
- **NUNCA** exponha o backend diretamente à internet sem autenticação
- Use API Keys ou tokens de autenticação
- Configure CORS apropriadamente
- Use HTTPS em produção
- Implemente rate limiting

### Exemplo com autenticação:
```javascript
// Adicione ao server-simple.js

const API_KEY = process.env.API_KEY || 'sua-chave-secreta';

app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
});
```

---

## 📞 SUPORTE

### Problemas comuns:
1. **QR Code inválido** → Use backend-whatsapp com server-simple.js
2. **Não conecta** → Verifique se backend está rodando na porta 3001
3. **Mensagens não enviam** → Verifique logs do backend
4. **Sessão desconecta** → Normal após 14 dias de inatividade

### Documentação oficial:
- whatsapp-web.js: https://wwebjs.dev/
- Puppeteer: https://pptr.dev/

---

## ✅ CHECKLIST FINAL

- [ ] Node.js instalado (`node --version`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Backend rodando (`node server-simple.js`)
- [ ] Porta 3001 acessível
- [ ] Frontend apontando para `http://localhost:3001`
- [ ] QR Code gerado com sucesso
- [ ] WhatsApp conectado
- [ ] Mensagem de teste recebida

---

**🎉 Parabéns! Seu WhatsApp Business API está funcionando!**

Mensagem de teste será enviada por: **João Nunes**
