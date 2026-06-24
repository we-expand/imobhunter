# 🚨 SOLUÇÃO: "Failed to fetch"

## ❌ O QUE ESTÁ ACONTECENDO:

Você viu este erro porque o **backend Node.js NÃO está rodando**.

O WhatsApp precisa de um servidor local para funcionar.

---

## ✅ SOLUÇÃO EM 4 PASSOS:

### 1️⃣ Abra o Terminal (Mac)

Pressione: `Cmd + Space`  
Digite: `Terminal`  
Aperte: `Enter`

### 2️⃣ Navegue até a pasta do backend

```bash
cd backend-whatsapp
```

**💡 Dica**: Digite `cd ` e arraste a pasta `backend-whatsapp` para o Terminal.

### 3️⃣ Instale as dependências (PRIMEIRA VEZ)

```bash
npm install
```

Aguarde 2-3 minutos. Você verá:
```
added 156 packages in 2m
```

### 4️⃣ Inicie o servidor

```bash
npm run start:simple
```

**✅ SUCESSO!** Você verá:

```
╔═══════════════════════════════════════════════╗
║   🚀 WhatsApp Business API                   ║
║   ✅ Status: ONLINE                          ║
║   🌐 Port: 3001                              ║
╚═══════════════════════════════════════════════╝
```

---

## 📱 AGORA NO NAVEGADOR:

1. Volte para o Chrome
2. Clique em **"Tentar Novamente"**
3. QR Code aparecerá! ✅
4. Escaneie com WhatsApp
5. Pronto! 🎉

---

## ⚠️ IMPORTANTE:

**NÃO FECHE O TERMINAL!**

Enquanto usar WhatsApp, deixe o Terminal aberto.

Para parar: `Ctrl + C`  
Para reiniciar: `npm run start:simple`

---

## 🎯 RESUMO VISUAL:

```
Terminal:
  cd backend-whatsapp
  npm install          (primeira vez)
  npm run start:simple (sempre)

Navegador:
  Tentar Novamente → QR Code → Escanear → ✅
```

---

## 🆘 AINDA COM PROBLEMA?

### "npm: command not found"
→ Instale Node.js: https://nodejs.org/

### "Port 3001 already in use"
```bash
lsof -ti:3001 | xargs kill -9
npm run start:simple
```

### QR Code não aparece
→ Aguarde 10-15 segundos (primeira vez)

---

**Qualquer dúvida, veja:**
- `/backend-whatsapp/LEIA_ME.txt`
- `/COMO_INICIAR_BACKEND.md`

**🚀 Vai funcionar!**
