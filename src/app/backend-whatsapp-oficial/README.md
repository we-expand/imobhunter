# 🚀 WhatsApp Business API Oficial - Backend

Backend Node.js para integração oficial com WhatsApp Business API (Meta Platform).

---

## 📋 Pré-requisitos

- Node.js v18+ ([Download](https://nodejs.org/))
- Conta Meta Business
- WhatsApp Business API configurado
- Credenciais da Meta

---

## ⚡ Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar credenciais
cp .env.example .env
# Edite o .env com suas credenciais

# 3. Testar configuração
npm test

# 4. Iniciar servidor
npm start
```

---

## 🔐 Configuração

### Obter Credenciais

Você precisa de 3 credenciais da Meta:

1. **WHATSAPP_TOKEN**
   - Meta for Developers → App → WhatsApp → API Setup
   - Copie: "Token de acesso temporário"

2. **WHATSAPP_PHONE_NUMBER_ID**
   - Mesmo local acima
   - Embaixo do número de telefone

3. **WHATSAPP_BUSINESS_ACCOUNT_ID**
   - Meta Business → WhatsApp → Configurações
   - Ou veja na URL: `waba_id=XXXXXXXXX`

### Arquivo .env

```env
WHATSAPP_TOKEN=seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
WHATSAPP_API_VERSION=v18.0

PORT=3002
NODE_ENV=development
WEBHOOK_VERIFY_TOKEN=meu_token_secreto
```

---

## 🛠️ Scripts Disponíveis

```bash
# Testar credenciais
npm test

# Iniciar servidor (produção)
npm start

# Modo desenvolvimento (auto-reload)
npm run dev
```

---

## 📡 API Endpoints

### Health Check

```bash
GET http://localhost:3002/health
```

**Resposta:**
```json
{
  "status": "ok",
  "service": "WhatsApp Business API Oficial",
  "version": "v18.0",
  "timestamp": "2024-...",
  "phone_number_id": "123456789012345",
  "configured": true
}
```

### Enviar Mensagem

```bash
POST http://localhost:3002/api/whatsapp/send
Content-Type: application/json

{
  "to": "+351912345678",
  "message": "Olá! Mensagem de teste."
}
```

**Resposta:**
```json
{
  "success": true,
  "message_id": "wamid.HBgNMzUxOTE...",
  "data": {...}
}
```

### Enviar Template

```bash
POST http://localhost:3002/api/whatsapp/send
Content-Type: application/json

{
  "to": "+351912345678",
  "template": {
    "name": "leadgen_saudacao",
    "language": "pt_BR",
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Maria Silva" },
          { "type": "text", "text": "Lisboa" }
        ]
      }
    ]
  }
}
```

### Listar Templates

```bash
GET http://localhost:3002/api/whatsapp/templates
```

**Resposta:**
```json
{
  "success": true,
  "templates": [
    {
      "name": "leadgen_saudacao",
      "status": "APPROVED",
      "language": "pt_BR",
      ...
    }
  ]
}
```

### Webhook (Receber Mensagens)

```bash
# Verificação (Meta usa isso para validar)
GET http://localhost:3002/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=CHALLENGE

# Receber mensagens
POST http://localhost:3002/webhook
```

---

## 🔒 Segurança

⚠️ **IMPORTANTE:**

- **NUNCA** commit o arquivo `.env`
- **NUNCA** compartilhe seu token
- Use variáveis de ambiente em produção
- Renove tokens regularmente
- Use HTTPS em produção
- Valide webhooks

---

## 🌐 Deploy Produção

### Heroku

```bash
heroku create leadgen-whatsapp-api
heroku config:set WHATSAPP_TOKEN=seu_token
heroku config:set WHATSAPP_PHONE_NUMBER_ID=123456789012345
heroku config:set WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
git push heroku main
```

### DigitalOcean / AWS / Azure

1. Configure variáveis de ambiente
2. Instale Node.js no servidor
3. Clone repositório
4. `npm install --production`
5. Use PM2 para manter rodando:
   ```bash
   npm install -g pm2
   pm2 start server.js --name whatsapp-api
   pm2 startup
   pm2 save
   ```

---

## 📊 Monitoramento

### Logs

O servidor loga todas as operações:

```
✅ Mensagem enviada com sucesso!
❌ Erro ao enviar mensagem:
📩 Webhook recebido:
📱 Nova mensagem:
📊 Status da mensagem:
```

### Status da API Meta

Verifique: https://developers.facebook.com/status/

---

## 🐛 Troubleshooting

### Erro: "Invalid OAuth access token"

**Causa:** Token expirado ou inválido  
**Solução:** Gere novo token no Meta for Developers

### Erro: "Phone number is not a WhatsApp Business account"

**Causa:** Número não configurado corretamente  
**Solução:** Verifique configuração no Meta Business

### Erro: "Template not found"

**Causa:** Template não aprovado ou nome incorreto  
**Solução:** Verifique templates em Meta Business Suite

### Erro: "Message quota exceeded"

**Causa:** Limite de mensagens atingido  
**Solução:** Aguarde ou solicite aumento de limite

---

## 📚 Documentação Adicional

- [Guia Completo](../GUIA_COMPLETO_WHATSAPP_OFICIAL.md)
- [Início Rápido](../INICIO_RAPIDO_WHATSAPP.md)
- [Configuração Detalhada](../CONFIGURACAO_WHATSAPP_OFICIAL.md)
- [Meta WhatsApp Docs](https://developers.facebook.com/docs/whatsapp)

---

## 📄 Licença

MIT

---

## 🤝 Suporte

- Meta Business Support: https://business.facebook.com/help
- Developer Docs: https://developers.facebook.com/docs/whatsapp
- Status API: https://developers.facebook.com/status/

---

**Criado para: AI LeadGen Pro | KW Portugal**

**Sistema Oficial Meta Platform** ✅
