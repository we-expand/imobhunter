# 🚀 GUIA COMPLETO - WhatsApp Business API Oficial

## 📋 ÍNDICE

1. [Pré-requisitos](#pré-requisitos)
2. [Criar Meta Business Account](#criar-meta-business-account)
3. [Configurar WhatsApp Business API](#configurar-whatsapp-business-api)
4. [Obter Credenciais](#obter-credenciais)
5. [Configurar no Projeto](#configurar-no-projeto)
6. [Testar](#testar)
7. [Criar Templates](#criar-templates)
8. [FAQ](#faq)

---

## ✅ PRÉ-REQUISITOS

Antes de começar, você precisa ter:

- [ ] **Conta Facebook** (pessoal ou empresarial)
- [ ] **Email de trabalho** válido
- [ ] **Número de telefone** dedicado (não pode estar em WhatsApp pessoal)
- [ ] **Documentos da empresa** (CNPJ, NIF, etc) - para verificação
- [ ] **Node.js** instalado (v18+)
- [ ] **30 minutos** de tempo

---

## 🏢 CRIAR META BUSINESS ACCOUNT

### PASSO 1: Acessar Meta Business Suite

1. Abra: https://business.facebook.com/
2. Clique: **"Criar conta"**
3. Se já tem conta, faça login

### PASSO 2: Criar Conta Business

**Preencha os dados:**

```
Nome da empresa: KW Portugal - AI LeadGen
Seu nome: [Seu nome completo]
Email de trabalho: [seu@email.com]
```

**Informações da empresa:**

```
Endereço da empresa: [Endereço completo]
Número de telefone: [Telefone da empresa]
Website: [www.seusite.com]
```

**Clique:** "Enviar"

✅ **Meta Business Account criada!**

---

## 📱 CONFIGURAR WHATSAPP BUSINESS API

### PASSO 3: Adicionar WhatsApp ao Business

1. **No painel Meta Business:**
   - Menu lateral esquerdo
   - Clique: **"Contas"** ou **"Accounts"**
   - Procure: **"WhatsApp Business"**
   - Clique: **"Adicionar"** ou **"Add"**

2. **Escolha:**
   - "Criar uma nova conta do WhatsApp Business"
   - Clique: **"Avançar"**

### PASSO 4: Configurar Perfil WhatsApp

**Informações do perfil:**

```
Nome de exibição: AI LeadGen Pro
Categoria: Imóveis / Real Estate
Descrição: Plataforma de geração e nutrição de leads para o mercado imobiliário
Website: [www.seusite.com]
Email: [contato@seusite.com]
Endereço: [Endereço da empresa]
```

**Clique:** "Avançar"

### PASSO 5: Adicionar Número de Telefone

⚠️ **IMPORTANTE:** O número NÃO pode estar cadastrado em WhatsApp pessoal

**Opções:**

**A) Usar número novo:**
1. Compre um chip novo
2. Insira o número no formato: `+351912345678`
3. Receberá SMS com código
4. Digite o código
5. Clique: "Verificar"

**B) Migrar número existente WhatsApp Business:**
1. Escolha: "Migrar número existente"
2. Siga instruções na tela
3. Confirme no app WhatsApp Business

✅ **Número verificado!**

---

## 🔑 OBTER CREDENCIAIS

### PASSO 6: Criar App no Meta for Developers

1. **Acesse:** https://developers.facebook.com/
2. **Login** com sua conta Facebook
3. **Clique:** "Meus apps" (canto superior direito)
4. **Clique:** "Criar app"

### PASSO 7: Configurar App

**Tipo de app:**
- Selecione: **"Empresa"** ou **"Business"**
- Clique: "Avançar"

**Detalhes do app:**

```
Nome do app: AI LeadGen WhatsApp API
Email de contato: [seu@email.com]
Conta do Business: [Selecione: KW Portugal - AI LeadGen]
```

**Clique:** "Criar app"

🔐 **Pode pedir senha do Facebook - digite**

✅ **App criado!**

### PASSO 8: Adicionar Produto WhatsApp

1. **No painel do app:**
   - Você verá lista de produtos
   - Encontre: **"WhatsApp"**
   - Clique: **"Configurar"** ou **"Set up"**

2. **Selecione:**
   - WhatsApp Business Account: (criada nos passos anteriores)
   - Clique: "Continuar"

✅ **WhatsApp conectado ao app!**

### PASSO 9: Obter Token de Acesso

1. **Ainda na página WhatsApp → API Setup:**

Você verá uma seção: **"Configuração temporária"** ou **"Temporary access token"**

```
╔══════════════════════════════════════════╗
║  Token de acesso temporário              ║
║  ────────────────────────────            ║
║  EAAABsbCS1iHgBO3kZBfxB...               ║
║  [Copiar]                                ║
╚══════════════════════════════════════════╝
```

2. **Clique:** "Copiar"

3. **GUARDE ESTE TOKEN!** ⚠️
   - Cole num arquivo temporário
   - Você vai usar logo mais

### PASSO 10: Obter Phone Number ID

**No mesmo local (API Setup):**

Procure seção: **"De"** ou **"From"**

Você verá seu número de telefone e embaixo:

```
+351 912 345 678
Phone number ID: 123456789012345
```

**Copie o Phone Number ID:** `123456789012345`

### PASSO 11: Obter Business Account ID

**Método 1 - Pela URL:**

1. Acesse: https://business.facebook.com/
2. Clique: "Configurações de negócio"
3. Clique: "Contas" → "WhatsApp Business"
4. Na URL, procure: `waba_id=XXXXXXXXX`
5. Copie o número `XXXXXXXXX`

**Método 2 - Pela API:**

No Meta for Developers:
1. WhatsApp → API Setup
2. Procure: "WhatsApp Business Account ID"
3. Copie o ID

✅ **Todas as credenciais obtidas!**

**Resumo do que você tem:**

```
✅ Token de acesso: EAAABsbCS1iHgBO3kZBfxB...
✅ Phone Number ID: 123456789012345
✅ Business Account ID: 987654321098765
```

---

## 💻 CONFIGURAR NO PROJETO

### PASSO 12: Configurar Variáveis de Ambiente

1. **Abra o Terminal**

2. **Navegue até a pasta do backend:**

```bash
cd backend-whatsapp-oficial
```

3. **Copie o arquivo de exemplo:**

```bash
cp .env.example .env
```

4. **Abra o arquivo .env:**

```bash
# Mac
open .env

# Ou use qualquer editor de texto
code .env
nano .env
```

5. **Preencha com suas credenciais:**

```env
# WhatsApp Business API Oficial
WHATSAPP_TOKEN=cole_seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=cole_seu_phone_number_id_aqui
WHATSAPP_BUSINESS_ACCOUNT_ID=cole_seu_business_account_id_aqui
WHATSAPP_API_VERSION=v18.0

# Servidor
PORT=3002
NODE_ENV=development

# Webhook
WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123
```

**Substitua:**
- `cole_seu_token_aqui` → Seu token EAAA...
- `cole_seu_phone_number_id_aqui` → Seu Phone Number ID
- `cole_seu_business_account_id_aqui` → Seu Business Account ID

6. **Salve o arquivo** (Cmd+S ou Ctrl+S)

### PASSO 13: Instalar Dependências

**No Terminal, na pasta `backend-whatsapp-oficial`:**

```bash
npm install
```

⏱️ **Aguarde 1-2 minutos**

Você verá:
```
added 156 packages...
```

✅ **Dependências instaladas!**

---

## 🧪 TESTAR

### PASSO 14: Testar Credenciais

**Antes de iniciar o servidor, teste se as credenciais estão corretas:**

```bash
npm test
```

**Você verá:**

```
╔═══════════════════════════════════════════════╗
║   🔍 Testando Credenciais WhatsApp           ║
╚═══════════════════════════════════════════════╝

📋 Verificando variáveis de ambiente...

✅ WHATSAPP_TOKEN: EAAABsbCS1iHgBO3kZBfxB...
✅ WHATSAPP_PHONE_NUMBER_ID: 123456789012345
✅ WHATSAPP_BUSINESS_ACCOUNT_ID: 987654321098765
✅ WHATSAPP_API_VERSION: v18.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 Testando Phone Number ID...

✅ Phone Number ID válido!
   Número: +351912345678
   Status: Verificado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Testando Business Account ID...

✅ Business Account ID válido!
   ID: 987654321098765
   Status: OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 CONFIGURAÇÃO VÁLIDA!

✅ Todas as credenciais estão corretas
✅ API funcionando
✅ Pronto para enviar mensagens
```

✅ **Se viu isso, está tudo certo!**

❌ **Se deu erro:**
- Verifique se copiou as credenciais corretamente
- Certifique-se que não tem espaços extras
- Verifique se o token não expirou

### PASSO 15: Iniciar Servidor

```bash
npm start
```

**Você verá:**

```
╔═══════════════════════════════════════════════╗
║   🚀 WhatsApp Business API Oficial           ║
║   📱 Meta Platform                           ║
╚═══════════════════════════════════════════════╝

✅ Status: ONLINE
🌐 Port: 3002
📞 Phone ID: 123456789012345
🏢 Business ID: 987654321098765
📡 API Version: v18.0

💡 Servidor rodando em http://localhost:3002
🔗 Health check: http://localhost:3002/health
```

✅ **Servidor iniciado!**

**DEIXE O TERMINAL ABERTO!**

### PASSO 16: Testar no Navegador

1. **Abra o navegador**
2. **Vá para:** http://localhost:5173
3. **Navegue:** Configurações → Integrações
4. **Encontre:** "WhatsApp Business API Oficial"
5. **Status deve mostrar:** "✅ Configurado"

**Teste enviando mensagem:**

1. Digite um número: `+351912345678`
2. Digite mensagem: `Olá, teste!`
3. Clique: "Enviar Mensagem"

⏱️ **Aguarde 2-5 segundos**

✅ **Mensagem enviada!**

Verifique o WhatsApp do número de destino.

---

## 📝 CRIAR TEMPLATES

Templates são mensagens pré-aprovadas pela Meta.

### PASSO 17: Acessar Meta Business Suite

1. **Acesse:** https://business.facebook.com/
2. **Clique:** WhatsApp Manager
3. **Menu:** "Message templates" ou "Modelos de mensagem"

### PASSO 18: Criar Novo Template

**Clique:** "Create template" ou "Criar modelo"

**Exemplo de template:**

```
Nome do template: leadgen_saudacao
Categoria: MARKETING
Idioma: Portuguese (BR)

Conteúdo:
─────────────────────────────────────
Olá {{1}}! 👋

Sou o *João Nunes* do AI LeadGen Pro.

Encontrei um imóvel que pode interessar:

📍 {{2}}
💰 {{3}}
🏠 {{4}}

Gostaria de agendar uma visita?
─────────────────────────────────────

Variáveis:
{{1}} - Nome do lead
{{2}} - Localização
{{3}} - Preço
{{4}} - Descrição
```

**Clique:** "Enviar"

⏱️ **Aprovação leva 1-24 horas**

✅ **Template criado!**

### PASSO 19: Usar Template no Código

Após aprovação, use assim:

```javascript
const response = await fetch('http://localhost:3002/api/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+351912345678',
    template: {
      name: 'leadgen_saudacao',
      language: 'pt_BR',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: 'Maria Silva' },
            { type: 'text', text: 'Lisboa, Avenidas Novas' },
            { type: 'text', text: '€450.000' },
            { type: 'text', text: 'T3, 120m², varanda' }
          ]
        }
      ]
    }
  })
});
```

---

## ❓ FAQ

### P: Quanto custa?

**R:** WhatsApp Business API é **pago por mensagem**:
- **Primeiras 1.000 conversas/mês:** GRÁTIS
- **Após isso:** €0,004 - €0,10 por mensagem (varia por país)
- **Portugal:** ~€0,02/mensagem

### P: Posso enviar qualquer mensagem?

**R:** Depende:
- **Primeira mensagem:** Apenas templates aprovados
- **Após resposta do usuário:** Mensagens livres por 24h
- **Após 24h sem resposta:** Apenas templates novamente

### P: Preciso de servidor?

**R:** Sim, precisa de:
- Servidor Node.js rodando (pode ser seu Mac para testes)
- Para produção: AWS, Heroku, DigitalOcean, etc

### P: E se o token expirar?

**R:** Tokens temporários expiram em 24h-90 dias.

**Solução:** Gerar token permanente:
1. Meta for Developers
2. Ferramentas → Token de acesso
3. Gerar com permissões adequadas
4. Nunca expira (até revogar)

### P: Posso usar meu número pessoal?

**R:** **NÃO!** Use um número dedicado para a empresa.

### P: Quantos números posso ter?

**R:** Depende do plano Meta Business. Geralmente 1-5 números.

### P: Como receber mensagens?

**R:** Configure webhooks:
1. Meta for Developers → WhatsApp → Configuration
2. Callback URL: `https://seu-servidor.com/webhook`
3. Verify Token: (o que você definiu no .env)
4. Subscribe to fields: messages, message_status

---

## 🎉 RESUMO FINAL

**✅ O que você fez:**

1. ✅ Criou Meta Business Account
2. ✅ Configurou WhatsApp Business API
3. ✅ Obteve credenciais (Token, Phone ID, Business ID)
4. ✅ Configurou .env no projeto
5. ✅ Testou credenciais
6. ✅ Iniciou servidor
7. ✅ Enviou mensagem de teste
8. ✅ Criou templates

**🚀 Próximos passos:**

- [ ] Criar mais templates
- [ ] Configurar webhooks
- [ ] Integrar com CRM
- [ ] Deploy em servidor cloud
- [ ] Automatizar campanhas

---

**Precisa de ajuda?**

- 📚 Documentação Meta: https://developers.facebook.com/docs/whatsapp
- 💬 Suporte Meta Business: https://business.facebook.com/help
- 🛠️ Status API: https://developers.facebook.com/status/

---

**Criado para: AI LeadGen Pro | KW Portugal**

**Sistema 100% Oficial e Legal** ✅
