# 🚀 Guia Completo: WhatsApp Business API REAL

## ✨ O que você está configurando

Um sistema REAL de WhatsApp Business que:
- ✅ Gera QR Code verdadeiro
- ✅ Conecta ao seu celular instantaneamente
- ✅ Envia mensagens automáticas pelo seu número
- ✅ Recebe respostas em tempo real
- ✅ Funciona 24/7 mesmo com celular offline

---

## 📋 Passo a Passo (15-20 minutos)

### ETAPA 1: Configurar Supabase (5 min)

#### 1.1 Criar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Click em **"New Project"**
3. Preencha:
   - Nome: `ai-leadgen-whatsapp`
   - Database Password: (crie uma senha forte)
   - Region: **Europe West (Londres)** ← Importante para GDPR
4. Click **"Create new project"**
5. Aguarde 2-3 minutos

#### 1.2 Criar Tabelas do Banco de Dados
1. No painel Supabase, vá em **SQL Editor**
2. Click em **"New Query"**
3. Cole este código:

```sql
-- Tabela de sessões WhatsApp
CREATE TABLE whatsapp_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('disconnected', 'qr', 'connecting', 'connected', 'error')),
  qr_code TEXT,
  phone_number TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES whatsapp_sessions(id),
  from_number TEXT,
  to_number TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  is_from_me BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sessions_user_id ON whatsapp_sessions(user_id);
CREATE INDEX idx_messages_session_id ON whatsapp_messages(session_id);

-- Ativar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_sessions;
```

4. Click **"Run"**
5. Deve aparecer "Success. No rows returned"

#### 1.3 Pegar as Credenciais
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**: `https://abc123.supabase.co`
   - **anon public**: `eyJhbGc...` (key grande)
   - **service_role**: `eyJhbGc...` (outra key)

---

### ETAPA 2: Deploy do Servidor WhatsApp (5 min)

#### Opção A: Render.com (GRÁTIS - RECOMENDADO)

1. **Criar conta no Render**
   - Acesse [render.com](https://render.com)
   - Click **"Get Started"** → Login com GitHub

2. **Fazer Fork do Projeto**
   - Fork este repositório no GitHub
   - Ou faça upload da pasta `/backend-whatsapp`

3. **Criar Web Service**
   - No Render, click **"New +" → "Web Service"**
   - Conecte seu repositório GitHub
   - Preencha:
     - **Name**: `ai-leadgen-whatsapp`
     - **Root Directory**: `backend-whatsapp`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: **Free**

4. **Adicionar Variáveis de Ambiente**
   - Click em **"Environment"**
   - Adicione:
     ```
     SUPABASE_URL = https://abc123.supabase.co
     SUPABASE_SERVICE_KEY = eyJhbGc...sua-service-role-key
     PORT = 10000
     ```

5. **Deploy**
   - Click **"Create Web Service"**
   - Aguarde 3-5 minutos
   - Copie a URL: `https://ai-leadgen-whatsapp.onrender.com`

#### Opção B: Railway.app (Alternativa)

```bash
# Instale Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend folder
cd backend-whatsapp

# Deploy
railway up

# Configure env vars
railway variables set SUPABASE_URL=https://abc123.supabase.co
railway variables set SUPABASE_SERVICE_KEY=eyJ...
```

---

### ETAPA 3: Configurar Frontend (2 min)

1. **Criar arquivo `.env` na raiz do projeto**

```env
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...sua-anon-key
VITE_WHATSAPP_SERVER_URL=https://ai-leadgen-whatsapp.onrender.com
```

2. **Reiniciar o servidor de desenvolvimento**

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

---

### ETAPA 4: Configurar Edge Functions do Supabase (5 min)

1. **Instalar Supabase CLI**

```bash
npm install -g supabase
```

2. **Login no Supabase**

```bash
supabase login
```

3. **Link ao seu projeto**

```bash
supabase link --project-ref abc123
# Substitua abc123 pelo seu project ID (está na URL do Supabase)
```

4. **Deploy das Functions**

```bash
supabase functions deploy whatsapp-init
supabase functions deploy whatsapp-send
supabase functions deploy whatsapp-disconnect
```

5. **Configurar variável de ambiente nas Functions**
   - No painel Supabase, vá em **Edge Functions**
   - Click em cada function e adicione:
     ```
     WHATSAPP_SERVER_URL = https://ai-leadgen-whatsapp.onrender.com
     ```

---

### ETAPA 5: TESTAR! 🎉

1. **Abra a aplicação**
   - `http://localhost:5173`

2. **Faça login**

3. **Vá em Configurações → Integrações**

4. **Click em "Gerar QR Code e Conectar"**

5. **Aguarde o QR Code aparecer** (15-30 segundos)

6. **No seu celular:**
   - Abra WhatsApp
   - Toque em ⋮ (Mais opções)
   - **Aparelhos conectados**
   - **Conectar um aparelho**
   - Escaneie o QR Code

7. **PRONTO!** 🎉
   - Você verá uma mensagem de boas-vindas no WhatsApp
   - Status mudará para "Conectado"
   - Agora pode enviar mensagens automáticas!

---

## 🧪 Teste de Envio de Mensagem

1. Click em **"Enviar Teste"**
2. Verifique seu WhatsApp
3. Deve receber: "✅ Teste de conexão bem-sucedido!"

---

## 🔍 Troubleshooting

### ❌ QR Code não aparece
**Solução:**
```bash
# Verifique logs do servidor Render
# No painel Render, vá em "Logs"
# Procure por erros

# Teste se servidor está online
curl https://ai-leadgen-whatsapp.onrender.com/health
```

### ❌ "Session not found"
**Solução:**
- Aguarde 30 segundos (servidor pode estar "dormindo" no plano free)
- Tente gerar novo QR Code

### ❌ Mensagens não enviam
**Solução:**
- Verifique se status está "Conectado"
- Confirme que WhatsApp está aberto no celular
- Veja logs: `supabase functions logs whatsapp-send`

### ❌ Erro "Failed to fetch"
**Solução:**
```bash
# Verifique variáveis de ambiente
cat .env

# Reinicie servidor
npm run dev
```

---

## 📊 Monitoramento

### Ver logs do servidor Node.js
```bash
# No Render.com
Dashboard → Logs (ao vivo)

# No Railway
railway logs
```

### Ver logs do Supabase
```bash
supabase functions logs whatsapp-init --tail
supabase functions logs whatsapp-send --tail
```

### Verificar sessões ativas
```sql
-- No Supabase SQL Editor
SELECT * FROM whatsapp_sessions 
WHERE status = 'connected' 
ORDER BY created_at DESC;
```

---

## 🚀 Próximos Passos

Agora que está funcionando:

1. **Automatize cadências**
   - Configure sequências de mensagens
   - Define intervalos entre envios

2. **Configure templates**
   - Crie mensagens personalizadas
   - Use variáveis dinâmicas

3. **Monitore métricas**
   - Taxa de entrega
   - Taxa de resposta
   - Leads qualificados

---

## 🔐 Segurança em Produção

Antes de colocar em produção:

- [ ] Configure HTTPS (Render faz automaticamente)
- [ ] Ative Row Level Security no Supabase
- [ ] Configure rate limiting (Cloudflare ou nginx)
- [ ] Monitore uso de API
- [ ] Faça backup do banco regularmente
- [ ] Configure alertas (Sentry, LogRocket)

---

## 💰 Custos Estimados

**Gratuito (até 1000 mensagens/mês):**
- ✅ Supabase: Free tier (500MB DB)
- ✅ Render.com: Free tier (750h/mês)
- ✅ WhatsApp: Grátis via WhatsApp Web

**Produção (5000+ mensagens/mês):**
- Render.com: $7/mês (Starter plan)
- Supabase: $25/mês (Pro plan - opcional)
- **Total: ~$7-32/mês**

---

## 🆘 Precisa de Ajuda?

1. **Verifique logs primeiro** (90% dos problemas estão nos logs)
2. **Teste conexão** com `curl`
3. **Reinicie serviços** (às vezes resolve tudo)
4. **Contate suporte** se persistir

---

## ✅ Checklist de Sucesso

- [ ] Projeto Supabase criado
- [ ] Tabelas criadas no banco
- [ ] Servidor Node.js deployado no Render
- [ ] Variáveis de ambiente configuradas
- [ ] Edge Functions deployadas
- [ ] QR Code gerado com sucesso
- [ ] WhatsApp conectado
- [ ] Mensagem de teste enviada
- [ ] **🎉 FUNCIONANDO!**

---

**Parabéns! Você tem um WhatsApp Business API REAL funcionando! 🚀**
