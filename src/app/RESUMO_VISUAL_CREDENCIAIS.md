# 🎯 RESUMO VISUAL - Obter Credenciais WhatsApp

## 📍 IMPORTANTE: São 2 Sites Diferentes!

```
🌐 SITE 1: Meta for Developers
   https://developers.facebook.com/
   ↓
   Aqui você CRIA O APP
   ↓
   Aqui você pega CREDENCIAL 1 e 2

🌐 SITE 2: Meta Business / WhatsApp Manager  
   https://business.facebook.com/
   ↓
   Aqui você pega CREDENCIAL 3
```

---

## 🔄 FLUXO COMPLETO

```
┌─────────────────────────────────────────────┐
│ 1️⃣ CRIAR APP                                │
│    https://developers.facebook.com/         │
│    → Meus apps → Criar app → Empresa       │
│    → Nome: "AI LeadGen WhatsApp"           │
│    → Criar                                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2️⃣ ADICIONAR WHATSAPP                       │
│    No painel do app                         │
│    → Procurar card "WhatsApp"              │
│    → Clicar "Configurar"                   │
│    → Selecionar sua conta WhatsApp         │
│    → Continuar                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3️⃣ COPIAR CREDENCIAL 1: TOKEN              │
│    Página: WhatsApp → API Setup            │
│    Seção: "Configuração temporária"        │
│    Token: EAAA...                          │
│    → Clicar "Copiar"                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 4️⃣ COPIAR CREDENCIAL 2: PHONE NUMBER ID    │
│    Mesma página                             │
│    Seção: "De:" ou "From:"                 │
│    Phone number ID: 123456789012345        │
│    → Copiar os números                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 5️⃣ COPIAR CREDENCIAL 3: BUSINESS ID        │
│    Mudar de site!                           │
│    https://business.facebook.com/wa/        │
│    → Olhar URL                             │
│    → Copiar waba_id=XXXXXXXXX              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 6️⃣ COLAR NO ARQUIVO .env                   │
│    cd backend-whatsapp-oficial              │
│    cp .env.example .env                    │
│    open .env                               │
│    → Colar as 3 credenciais                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 7️⃣ TESTAR                                   │
│    npm install                              │
│    npm test                                │
│    npm start                               │
└─────────────────────────────────────────────┘
```

---

## 🎫 AS 3 CREDENCIAIS

### CREDENCIAL 1: TOKEN

```
ONDE ENCONTRAR:
┌──────────────────────────────────────────────┐
│ https://developers.facebook.com/             │
│ → Meus apps                                  │
│ → AI LeadGen WhatsApp                        │
│ → WhatsApp (menu lateral)                    │
│ → API Setup                                  │
│ → Seção "Configuração temporária"            │
│ → Token de acesso: EAAA... [Copiar]          │
└──────────────────────────────────────────────┘

FORMATO:
  EAAABsbCS1iHgBO3kZBfxB4hR8ZAMN37u...
  ↑
  Sempre começa com EAAA
  50-300 caracteres

USAR COMO:
  WHATSAPP_TOKEN=EAAABsbCS1iHgBO3kZBfxB...
```

---

### CREDENCIAL 2: PHONE NUMBER ID

```
ONDE ENCONTRAR:
┌──────────────────────────────────────────────┐
│ Mesma página do TOKEN                        │
│ → Procure seção "De:" ou "From:"             │
│ → Embaixo do seu número:                     │
│   +351 912 345 678                          │
│   Phone number ID: 123456789012345          │
│                    ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑           │
│                    COPIE ISTO                │
└──────────────────────────────────────────────┘

FORMATO:
  123456789012345
  ↑
  Apenas números (15 dígitos)

USAR COMO:
  WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

---

### CREDENCIAL 3: BUSINESS ACCOUNT ID

```
ONDE ENCONTRAR (3 MÉTODOS):

┌─ MÉTODO 1: VIA URL (MAIS FÁCIL) ─────────────┐
│ https://business.facebook.com/wa/manage/home/│
│                                              │
│ Olhe a URL no navegador:                     │
│ ...?waba_id=123456789012345&...             │
│             ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑                  │
│             COPIE ISTO                       │
└──────────────────────────────────────────────┘

┌─ MÉTODO 2: VIA CONFIGURAÇÕES ────────────────┐
│ https://business.facebook.com/wa/manage/home/│
│ → Menu lateral: "Configurações"              │
│ → Primeira linha:                            │
│   WhatsApp Business Account ID: 123456...    │
└──────────────────────────────────────────────┘

┌─ MÉTODO 3: VIA BUSINESS SETTINGS ────────────┐
│ https://business.facebook.com/settings/      │
│ → Contas → WhatsApp Business                 │
│ → Clicar no nome da conta                   │
│ → Ver ID no painel lateral                  │
└──────────────────────────────────────────────┘

FORMATO:
  987654321098765
  ↑
  Apenas números (15 dígitos)

USAR COMO:
  WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
```

---

## 📝 EXEMPLO DE ARQUIVO .env COMPLETO

```env
# ═══════════════════════════════════════════════
# CREDENCIAIS WHATSAPP BUSINESS API
# ═══════════════════════════════════════════════

# CREDENCIAL 1: Token de acesso
WHATSAPP_TOKEN=EAAABsbCS1iHgBO3kZBfxB4hR8ZAMN37uZCwcyUcOZCEXFJiVV4SZAGPnD

# CREDENCIAL 2: Phone Number ID
WHATSAPP_PHONE_NUMBER_ID=123456789012345

# CREDENCIAL 3: Business Account ID
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765

# Versão da API (não mudar)
WHATSAPP_API_VERSION=v18.0

# ═══════════════════════════════════════════════
# CONFIGURAÇÕES DO SERVIDOR
# ═══════════════════════════════════════════════

PORT=3002
NODE_ENV=development
WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123
```

---

## ✅ CHECKLIST RÁPIDO

### CRIAR APP:
- [ ] Acessei https://developers.facebook.com/
- [ ] Cliquei "Meus apps"
- [ ] Cliquei "Criar app"
- [ ] Escolhi "Empresa"
- [ ] Preenchi nome: "AI LeadGen WhatsApp"
- [ ] Cliquei "Criar app"

### ADICIONAR WHATSAPP:
- [ ] No painel do app
- [ ] Encontrei card "WhatsApp"
- [ ] Cliquei "Configurar"
- [ ] Selecionei conta WhatsApp
- [ ] Cliquei "Continuar"

### COPIAR CREDENCIAIS:
- [ ] Copiei TOKEN (começa com EAAA)
- [ ] Copiei PHONE NUMBER ID (15 números)
- [ ] Copiei BUSINESS ACCOUNT ID (15 números)
- [ ] Salvei num arquivo de texto

### CONFIGURAR PROJETO:
- [ ] Abri Terminal
- [ ] `cd backend-whatsapp-oficial`
- [ ] `cp .env.example .env`
- [ ] `open .env`
- [ ] Colei as 3 credenciais
- [ ] Salvei arquivo

### TESTAR:
- [ ] `npm install`
- [ ] `npm test` → ✅ passou
- [ ] `npm start` → servidor rodando

---

## 🎯 ATALHOS DIRETOS

```bash
# CREDENCIAL 1 e 2:
https://developers.facebook.com/apps/

# CREDENCIAL 3:
https://business.facebook.com/wa/manage/home/

# TESTAR CREDENCIAIS:
cd backend-whatsapp-oficial
npm test

# INICIAR SERVIDOR:
npm start
```

---

## 🆘 ERROS COMUNS

### ❌ "Token inválido"
→ Token expirou, copie novo

### ❌ "Phone Number ID not found"
→ Verifique se copiou apenas os números

### ❌ "Não vejo WhatsApp no app"
→ Certifique-se que criou app tipo "Empresa"

### ❌ "waba_id não aparece na URL"
→ Tente Método 2 ou 3 para Business ID

---

## 💡 DICAS

✅ **Copie credenciais uma por uma** - não se apresse
✅ **Cole num arquivo de texto primeiro** - para verificar
✅ **Sem espaços extras** - no .env
✅ **Sem aspas** - no .env
✅ **Token completo** - até o final

---

## 🎉 RESUMO DOS SITES

| Credencial | Site | Caminho |
|-----------|------|---------|
| TOKEN | developers.facebook.com | App → WhatsApp → API Setup |
| PHONE ID | developers.facebook.com | Mesma página, seção "De:" |
| BUSINESS ID | business.facebook.com | URL ou Configurações |

---

**AGORA É SÓ SEGUIR O PASSO A PASSO!** 🚀

**Veja guia detalhado: GUIA_CREDENCIAIS_WHATSAPP.md**
