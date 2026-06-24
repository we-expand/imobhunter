# 📸 Configuração da Integração com Instagram

## 🎯 Objetivo
Permitir que a IA converse automaticamente com leads via Instagram Direct Messages (DM), enviando mensagens de prospecção e respondendo automaticamente.

## 📋 Pré-requisitos
1. **Conta Instagram Business ou Creator**
2. **Facebook Developer Account**
3. **Página do Facebook conectada à conta Instagram**

---

## 🚀 Passo a Passo

### 1. Criar um App no Facebook for Developers

1. Acesse: https://developers.facebook.com/
2. Clique em "Meus Apps" > "Criar App"
3. Escolha o tipo: **"Negócio"**
4. Preencha:
   - Nome do App: **"LeadGen AI - Real Estate"**
   - Email de contato
   - Propósito: **Business Integration**
5. Clique em "Criar App"

### 2. Configurar o Instagram Basic Display API

1. No painel do seu app, vá em **"Produtos"** (Products)
2. Adicione o produto: **"Instagram Basic Display"**
3. Clique em "Configurar" (Set Up)
4. Vá em **"Basic Display"**
5. Clique em "Criar Novo App"
6. Preencha:
   - Nome da exibição: **LeadGen AI**
   - Website URL: `https://seu-projeto.supabase.co`
   - Privacy Policy URL: `https://seu-projeto.supabase.co/privacy`
   - Terms of Service URL: `https://seu-projeto.supabase.co/terms`

### 3. Configurar OAuth Redirect URI

1. Na página do Instagram Basic Display
2. Em **"OAuth Redirect URIs"**, adicione:
   ```
   https://seu-projeto.supabase.co/functions/v1/make-server-9e4b8b7c/instagram/callback
   ```
3. Em **"Deauthorize Callback URL"**:
   ```
   https://seu-projeto.supabase.co/functions/v1/make-server-9e4b8b7c/instagram/disconnect
   ```
4. Em **"Data Deletion Request URL"**:
   ```
   https://seu-projeto.supabase.co/functions/v1/make-server-9e4b8b7c/instagram/data-deletion
   ```
5. Clique em "Salvar Alterações"

### 4. Obter Credenciais

1. Vá em **"Instagram Basic Display"** > **"Basic Display"**
2. Copie:
   - **Instagram App ID**
   - **Instagram App Secret** (clique em "Mostrar")

### 5. Adicionar o Instagram Graph API (para enviar mensagens)

1. Volte ao painel do App
2. Adicione o produto: **"Instagram Graph API"**
3. Vá em **"Configurações"** > **"Básico"**
4. Copie:
   - **ID do App** (App ID)
   - **Chave Secreta do App** (App Secret)

### 6. Configurar Variáveis de Ambiente no Supabase

1. Acesse seu projeto Supabase
2. Vá em **Settings** > **Edge Functions** > **Environment Variables**
3. Adicione as seguintes variáveis:

```bash
INSTAGRAM_APP_ID=SEU_APP_ID_AQUI
INSTAGRAM_APP_SECRET=SUA_APP_SECRET_AQUI
INSTAGRAM_REDIRECT_URI=https://seu-projeto.supabase.co/functions/v1/make-server-9e4b8b7c/instagram/callback
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=leadgen_ai_webhook_2024
```

**⚠️ IMPORTANTE:** Substitua `seu-projeto` pelo ID real do seu projeto Supabase.

### 7. Configurar Webhooks (para receber mensagens)

1. No painel do Facebook App, vá em **"Webhooks"**
2. Clique em **"Configurar Webhooks"** para Instagram
3. Preencha:
   - **Callback URL**: 
     ```
     https://seu-projeto.supabase.co/functions/v1/make-server-9e4b8b7c/instagram/webhook
     ```
   - **Verify Token**: `leadgen_ai_webhook_2024`
4. Selecione os eventos:
   - ✅ `messages`
   - ✅ `messaging_postbacks`
   - ✅ `messaging_optins`
5. Clique em "Verificar e Salvar"

### 8. Conectar sua Conta Instagram

1. Vá no app LeadGen AI
2. Entre em **Integrações** > **Instagram**
3. Clique em **"Conectar Instagram"**
4. Faça login com sua conta Instagram Business
5. Autorize as permissões solicitadas

---

## 🤖 Funcionalidades Disponíveis

### ✅ O que a IA pode fazer:

1. **Enviar DMs automaticamente** para leads qualificados
2. **Responder mensagens recebidas** em até 30 segundos
3. **Manter conversas contextualizadas** sobre imóveis
4. **Agendar visitas** e enviar informações de propriedades
5. **Qualificar leads** através de perguntas inteligentes
6. **Escalabilidade ilimitada** - pode conversar com centenas de pessoas simultaneamente

### 📊 Métricas Rastreadas:

- Mensagens enviadas
- Mensagens recebidas
- Conversas ativas
- Taxa de resposta
- Leads qualificados
- Agendamentos gerados

---

## 🔐 Segurança & Privacidade

- **Tokens criptografados** - Todas as credenciais são armazenadas com criptografia
- **RGPD Compliant** - Respeitamos todas as leis de proteção de dados
- **Opt-out automático** - Usuários podem cancelar a qualquer momento
- **Rate limiting** - Respeitamos os limites da Instagram API
- **Audit logs** - Todas as ações são registradas para compliance

---

## 🆘 Troubleshooting

### Erro: "Instagram não conectado"
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Confirme que o REDIRECT_URI está exatamente igual no Facebook e no código

### Erro: "Invalid OAuth access token"
- Token expirado - reconecte a conta Instagram
- Verifique se a conta é Business ou Creator (contas pessoais não funcionam)

### Mensagens não estão sendo enviadas
- Confirme que a IA está ATIVADA no painel
- Verifique os webhooks no painel do Facebook
- Veja os logs do Supabase Edge Functions

### Webhook não está sendo verificado
- Verifique se o VERIFY_TOKEN está correto
- Confirme que a URL do webhook está acessível publicamente
- Veja os logs de erro no Facebook Webhooks

---

## 📚 Referências Oficiais

- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Instagram Messaging API](https://developers.facebook.com/docs/messenger-platform/instagram)
- [Facebook Webhooks](https://developers.facebook.com/docs/graph-api/webhooks)

---

## 💡 Dicas Pro

1. **Use templates salvos** - Crie modelos de mensagens para agilizar
2. **Configure horários** - Defina quando a IA pode enviar mensagens
3. **Personalize respostas** - Adapte o tom e linguagem da IA
4. **Teste primeiro** - Use o botão "Enviar Mensagem de Teste"
5. **Monitore métricas** - Ajuste estratégias baseado em dados reais

---

## 🎯 Próximos Passos

Após configurar o Instagram:

1. ✅ Configure mensagens de boas-vindas personalizadas
2. ✅ Defina palavras-chave que ativam respostas específicas  
3. ✅ Crie workflows de qualificação automatizados
4. ✅ Integre com seu CRM para sincronizar leads
5. ✅ Configure notificações para leads quentes

---

**🚀 Pronto! Sua IA agora pode conversar automaticamente no Instagram!**

Para suporte, entre em contato: support@leadgen.ai
