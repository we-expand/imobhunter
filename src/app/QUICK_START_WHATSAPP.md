# ⚡ Quick Start - WhatsApp Business API

## 🚀 EM 3 PASSOS:

### 1️⃣ Abra o Terminal

```bash
cd backend-whatsapp
```

### 2️⃣ Instale as dependências (primeira vez)

```bash
npm install
```

*Aguarde 2-3 minutos*

### 3️⃣ Inicie o servidor

```bash
npm run start:simple
```

**Pronto!** Backend rodando em `http://localhost:3001`

---

## 📱 CONECTAR WHATSAPP

### No navegador:

1. Vá em **Configurações** → **Integrações**
2. Na seção **WhatsApp Business API**
3. Clique em **"Conectar WhatsApp"**
4. Um QR Code REAL será gerado
5. Escaneie com WhatsApp no celular:
   - Abra WhatsApp
   - Menu ⋮ → **Aparelhos conectados**
   - **Conectar um aparelho**
   - Aponte para o QR Code

### ✅ Conectado!

Você receberá uma mensagem de confirmação:

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

## 🧪 TESTAR ENVIO

Após conectar, clique em **"Enviar Mensagem: João Nunes"**

Você receberá uma mensagem de teste no seu WhatsApp!

---

## ❓ PROBLEMAS?

### "npm not found"
→ Instale Node.js: https://nodejs.org/

### "Port 3001 in use"
→ Outra aplicação está usando a porta

### "Erro ao conectar"
→ Certifique-se que o backend está rodando:
```bash
cd backend-whatsapp
npm run start:simple
```

### QR Code não aparece
→ Aguarde 10-15 segundos (primeira vez baixa Chromium)

### QR Code expira
→ Normal! Dura 45 segundos. Clique "Gerar Novo"

---

## 📂 ARQUIVOS

```
backend-whatsapp/
├── server-simple.js      ← Backend standalone
├── package.json          ← Dependências
└── README.md             ← Documentação

components/
└── whatsapp-real-connection.tsx  ← Componente React
```

---

## 🔥 COMANDOS ÚTEIS

```bash
# Instalar dependências
npm install

# Iniciar backend
npm run start:simple

# Ver sessões ativas
curl http://localhost:3001/api/whatsapp/sessions

# Health check
curl http://localhost:3001/health
```

---

## ✅ CHECKLIST

- [ ] Node.js instalado
- [ ] Terminal aberto em `backend-whatsapp/`
- [ ] `npm install` executado
- [ ] `npm run start:simple` rodando
- [ ] Backend mostra "Status: ONLINE"
- [ ] Frontend aberto em navegador
- [ ] Botão "Conectar WhatsApp" clicado
- [ ] QR Code válido gerado
- [ ] WhatsApp escaneou QR Code
- [ ] Mensagem de confirmação recebida
- [ ] Teste de envio funcionou

---

**🎉 WhatsApp conectado DE VERDADE!**

**Criado para: KW Portugal | AI LeadGen Pro**
