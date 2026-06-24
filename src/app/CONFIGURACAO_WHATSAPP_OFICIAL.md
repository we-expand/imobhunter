# 🔐 CONFIGURAÇÃO WHATSAPP BUSINESS API OFICIAL

## 📋 Credenciais Necessárias

Após completar o cadastro na Meta, você terá estas credenciais:

```
WHATSAPP_TOKEN=EAAAxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
WHATSAPP_API_VERSION=v18.0
```

---

## 🔧 Como Configurar no Projeto

### 1. Criar arquivo `.env` na raiz do projeto

```bash
# Na raiz do projeto, crie o arquivo .env
touch .env
```

### 2. Adicionar credenciais no arquivo `.env`

```env
# WhatsApp Business API Oficial
WHATSAPP_TOKEN=seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_business_account_id_aqui
WHATSAPP_API_VERSION=v18.0
```

### 3. Substitua os valores:

- **WHATSAPP_TOKEN:** Token copiado do Meta for Developers
- **WHATSAPP_PHONE_NUMBER_ID:** ID do número no painel WhatsApp
- **WHATSAPP_BUSINESS_ACCOUNT_ID:** ID da conta Business
- **WHATSAPP_API_VERSION:** Mantenha `v18.0` (versão atual)

---

## 🌐 Onde Encontrar Cada Credencial

### 1. Token de Acesso (WHATSAPP_TOKEN)

**Local:** Meta for Developers
**Caminho:**
1. Acesse: https://developers.facebook.com/
2. Meus apps → AI LeadGen WhatsApp
3. WhatsApp → API Setup
4. Seção: "Configuração temporária"
5. Copie: **Token de acesso temporário**

**Exemplo:** `EAAABxxxxxxxxxxxxxxxxxxxxxx`

---

### 2. Phone Number ID (WHATSAPP_PHONE_NUMBER_ID)

**Local:** Meta for Developers  
**Caminho:**
1. Meus apps → AI LeadGen WhatsApp
2. WhatsApp → API Setup
3. Seção: "De"
4. Embaixo do número, tem: **Phone number ID**

**Exemplo:** `123456789012345`

---

### 3. Business Account ID (WHATSAPP_BUSINESS_ACCOUNT_ID)

**Local:** Meta Business Suite
**Caminho:**
1. Acesse: https://business.facebook.com/
2. Configurações de negócio
3. Contas → WhatsApp Business
4. Clique no nome da conta
5. Na URL, veja: `https://business.facebook.com/wa/manage/home/?waba_id=XXXXXXXXX`
6. O número `XXXXXXXXX` é o Business Account ID

**Exemplo:** `987654321098765`

---

## ✅ Verificar Configuração

Após preencher o `.env`, teste se as credenciais estão corretas:

```bash
# No terminal, na raiz do projeto
node backend-whatsapp-oficial/test-credentials.js
```

Deve retornar:
```
✅ Token válido
✅ Phone Number ID correto
✅ Business Account ID correto
🎉 Configuração OK!
```

---

## 🔒 Segurança

⚠️ **NUNCA compartilhe seu token de acesso!**
⚠️ **Adicione `.env` no `.gitignore`**
⚠️ **Use variáveis de ambiente em produção**

---

## 📞 Exemplo de `.env` Completo

```env
# WhatsApp Business API Oficial - Meta
WHATSAPP_TOKEN=EAABsbCS1iHgBO3kZBfxBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
WHATSAPP_API_VERSION=v18.0

# Configurações do Servidor
PORT=3002
NODE_ENV=development

# Webhook (opcional - para receber mensagens)
WEBHOOK_VERIFY_TOKEN=meu_token_secreto_123
```

---

## 🎯 Próximos Passos

Após configurar o `.env`:

1. ✅ Instalar dependências: `npm install`
2. ✅ Iniciar servidor: `npm start`
3. ✅ Testar envio: Interface web
4. ✅ Configurar webhooks (opcional)
5. ✅ Criar templates de mensagens

---

**Criado para: AI LeadGen Pro | KW Portugal**
