# 🚨 ERRO: "Failed to fetch"

## ❌ O QUE ESTÁ ACONTECENDO:

O **backend NÃO ESTÁ RODANDO**. 

O WhatsApp precisa do servidor Node.js ativo para funcionar.

---

## ✅ SOLUÇÃO (2 PASSOS):

### 📍 PASSO 1: Abrir Terminal

**No Mac** (você está usando Mac):
1. Pressione `Cmd + Space`
2. Digite: `Terminal`
3. Aperte Enter

### 📍 PASSO 2: Navegar até a pasta

No Terminal, digite:

```bash
cd /Users/SeuNome/caminho/para/ai-leadgen-pro/backend-whatsapp
```

💡 **DICA FÁCIL**: 
- Digite `cd ` (com espaço no final)
- Arraste a pasta `backend-whatsapp` para o Terminal
- Aperte Enter

### 📍 PASSO 3: Instalar (PRIMEIRA VEZ APENAS)

```bash
npm install
```

**Aguarde 2-3 minutos.** Vai baixar ~200MB.

Você verá:
```
added 156 packages in 2m
```

✅ Pronto! **Só precisa fazer isso UMA VEZ.**

### 📍 PASSO 4: Iniciar Backend

```bash
npm run start:simple
```

**SUCESSO!** Você verá:

```
╔═══════════════════════════════════════════════╗
║   🚀 WhatsApp Business API                   ║
║   📱 Modo STANDALONE                         ║
║                                               ║
║   ✅ Status: ONLINE                          ║
║   🌐 Port: 3001                              ║
║   💾 Sessões: 0                              ║
╚═══════════════════════════════════════════════╝

💡 Aguardando conexões...
```

✅ **BACKEND RODANDO!**

---

## 📱 AGORA NO NAVEGADOR:

1. Volte para o navegador (Chrome)
2. Vá em: **Configurações** → **Integrações**
3. Clique: **"Tentar Novamente"** ou **"Conectar WhatsApp"**
4. QR Code vai aparecer! ✅
5. Escaneie com seu WhatsApp

---

## 🎯 RESUMO VISUAL:

```
┌─────────────────────────────────────┐
│  1. Abrir Terminal (Cmd + Space)   │
│  2. cd backend-whatsapp             │
│  3. npm install (primeira vez)      │
│  4. npm run start:simple            │
│  5. Ver "Status: ONLINE"            │
│  6. Voltar ao navegador             │
│  7. Clicar "Conectar WhatsApp"      │
│  8. Escanear QR Code                │
│  9. PRONTO! ✅                      │
└─────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE:

**DEIXE O TERMINAL ABERTO!**

Se fechar o Terminal, o backend para de funcionar.

Para parar o backend:
- Pressione `Ctrl + C` no Terminal

Para iniciar novamente:
```bash
npm run start:simple
```

---

## 🆘 AINDA COM PROBLEMA?

### Erro: "npm: command not found"
→ **Node.js não instalado**
→ Baixe: https://nodejs.org/
→ Instale e tente novamente

### Erro: "Port 3001 already in use"
→ **Porta já está sendo usada**
→ Mate o processo:
```bash
lsof -ti:3001 | xargs kill -9
```
→ Tente novamente: `npm run start:simple`

### Backend inicia mas QR Code não aparece
→ **Aguarde 10-15 segundos**
→ Primeira vez demora (baixando Chromium)

---

## 📞 CHECKLIST:

- [ ] Terminal aberto
- [ ] Pasta correta: `backend-whatsapp/`
- [ ] `npm install` executado (primeira vez)
- [ ] `npm run start:simple` rodando
- [ ] Terminal mostra "Status: ONLINE"
- [ ] Terminal PERMANECE ABERTO
- [ ] Voltei ao navegador
- [ ] Cliquei "Conectar WhatsApp"
- [ ] QR Code apareceu
- [ ] Funcionou! ✅

---

**DEPOIS QUE FUNCIONAR:**

Você pode:
1. Minimizar o Terminal (não feche!)
2. Usar o WhatsApp normalmente
3. Enviar mensagens automáticas

---

**🎉 PRONTO PARA FUNCIONAR!**
