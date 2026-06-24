# ⚡ INÍCIO RÁPIDO - WhatsApp Oficial

## 🎯 RESUMO: O que você precisa fazer

```
1. Criar conta Meta Business (15 min)
2. Obter 3 credenciais (10 min)
3. Configurar .env (2 min)
4. Testar (3 min)
5. PRONTO! ✅
```

---

## 📝 LISTA DE TAREFAS

### FASE 1: Contas Meta (15 minutos)

- [ ] Criar Meta Business Account
  - Acesse: https://business.facebook.com/
  - Criar conta → Preencher dados empresa

- [ ] Adicionar WhatsApp Business
  - Contas → WhatsApp Business → Adicionar
  - Criar nova conta
  - Verificar número de telefone

- [ ] Criar App no Meta for Developers
  - Acesse: https://developers.facebook.com/
  - Meus apps → Criar app → Empresa
  - Adicionar produto WhatsApp

### FASE 2: Obter Credenciais (10 minutos)

Você precisa de **3 credenciais**:

**1. Token de Acesso**
- Local: Meta for Developers → Meus apps → WhatsApp → API Setup
- Copie: "Token de acesso temporário"
- Exemplo: `EAAABsbCS1iHgBO3kZBfxB...`

**2. Phone Number ID**
- Local: Mesmo lugar acima
- Embaixo do seu número
- Exemplo: `123456789012345`

**3. Business Account ID**
- Local: Meta Business → WhatsApp → Configurações
- Ou na URL: `waba_id=XXXXXXXXX`
- Exemplo: `987654321098765`

### FASE 3: Configurar Projeto (5 minutos)

```bash
# 1. Entre na pasta
cd backend-whatsapp-oficial

# 2. Copie arquivo de configuração
cp .env.example .env

# 3. Edite o .env
# Cole suas 3 credenciais

# 4. Instale dependências
npm install

# 5. Teste credenciais
npm test

# 6. Inicie servidor
npm start
```

### FASE 4: Testar (3 minutos)

```bash
# Com servidor rodando, abra navegador:
http://localhost:5173

# Vá em:
Configurações → Integrações → WhatsApp Oficial

# Envie mensagem de teste!
```

---

## 🔐 ARQUIVO .env

Copie este modelo e preencha:

```env
# Cole suas credenciais aqui:
WHATSAPP_TOKEN=cole_aqui_seu_token_EAAA...
WHATSAPP_PHONE_NUMBER_ID=cole_aqui_phone_id
WHATSAPP_BUSINESS_ACCOUNT_ID=cole_aqui_business_id
WHATSAPP_API_VERSION=v18.0

PORT=3002
NODE_ENV=development
WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123
```

---

## ✅ CHECKLIST RÁPIDO

**Antes de começar:**
- [ ] Tenho conta Facebook
- [ ] Tenho número de telefone dedicado
- [ ] Tenho 30 minutos livres

**Configuração:**
- [ ] Meta Business Account criada
- [ ] WhatsApp Business adicionado
- [ ] Número verificado
- [ ] App criado no Meta for Developers
- [ ] WhatsApp conectado ao app
- [ ] Token copiado
- [ ] Phone Number ID copiado
- [ ] Business Account ID copiado

**Projeto:**
- [ ] Arquivo .env criado
- [ ] 3 credenciais coladas no .env
- [ ] `npm install` executado
- [ ] `npm test` passou ✅
- [ ] `npm start` rodando
- [ ] Mensagem de teste enviada ✅

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Token inválido"
→ Gere novo token no Meta for Developers

### ❌ "Phone Number ID não encontrado"
→ Verifique se copiou o ID correto (apenas números)

### ❌ "npm: command not found"
→ Instale Node.js: https://nodejs.org/

### ❌ "Cannot send message"
→ Primeira mensagem deve usar template aprovado

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, veja:

- **`GUIA_COMPLETO_WHATSAPP_OFICIAL.md`** - Passo a passo detalhado
- **`CONFIGURACAO_WHATSAPP_OFICIAL.md`** - Configuração técnica
- **Meta Docs:** https://developers.facebook.com/docs/whatsapp

---

## 💰 CUSTOS

- **1.000 conversas/mês:** GRÁTIS
- **Depois:** ~€0,02/mensagem (Portugal)
- **Sem mensalidade fixa**

---

## 🚀 COMANDOS RÁPIDOS

```bash
# Testar credenciais
npm test

# Iniciar servidor
npm start

# Verificar status
curl http://localhost:3002/health

# Ver templates
curl http://localhost:3002/api/whatsapp/templates \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 📞 LINKS ÚTEIS

- **Meta Business:** https://business.facebook.com/
- **Meta Developers:** https://developers.facebook.com/
- **Docs WhatsApp:** https://developers.facebook.com/docs/whatsapp
- **Status API:** https://developers.facebook.com/status/

---

**🎉 FUNCIONA 100%! BASTA SEGUIR OS PASSOS!**

**Criado para: AI LeadGen Pro | KW Portugal**
