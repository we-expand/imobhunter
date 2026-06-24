# 🚀 ImobHunter - Sistema SaaS de Lead Generation & Nurturing

## 🆕 **PROJETO MIGRADO PARA NOVO SUPABASE**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ✅ MIGRAÇÃO CONCLUÍDA!                                    │
│                                                             │
│  🆔 Novo Project ID: evdyqlrssgsktctjruuq                  │
│  🌐 URL: https://evdyqlrssgsktctjruuq.supabase.co         │
│  📅 Data: 17 de Dezembro de 2025                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **COMECE AQUI:**

### **👉 [CLIQUE AQUI PARA COMEÇAR: INICIO_AQUI.md](./INICIO_AQUI.md)** ⭐⭐⭐

Ou escolha o guia que precisa:

| Guia | Descrição | Tempo |
|------|-----------|-------|
| **[📄 INICIO_AQUI.md](./INICIO_AQUI.md)** | ⭐ COMECE POR AQUI - Guia completo | 5 min |
| **[📄 COMANDOS_COPIAR_COLAR.txt](./COMANDOS_COPIAR_COLAR.txt)** | Comandos prontos para copiar | 2 min |
| **[📄 MIGRACAO_RESUMO.md](./MIGRACAO_RESUMO.md)** | Resumo visual da migração | 3 min |
| **[📄 INDEX_GUIAS.md](./INDEX_GUIAS.md)** | Índice de TODOS os guias | - |

---

## 📋 **O QUE FOI FEITO:**

✅ **Frontend atualizado** com novo Project ID  
✅ **Credenciais configuradas** no código  
✅ **Scripts de deploy** prontos (Linux, macOS, Windows)  
✅ **Documentação completa** com 17 guias  
✅ **Servidor v1.2.0** pronto para deploy  

---

## ⏳ **O QUE VOCÊ PRECISA FAZER:**

### **1️⃣ DEPLOY DO SERVIDOR (5 minutos)**

**Opção A - Script Automático (RECOMENDADO):**
```bash
# Linux/macOS
chmod +x deploy-server.sh && ./deploy-server.sh

# Windows PowerShell
.\deploy-server.ps1
```

**Opção B - Comandos Manuais:**
```bash
npm install -g supabase
supabase login
supabase link --project-ref evdyqlrssgsktctjruuq
cd /caminho/para/projeto
supabase functions deploy server
```

---

### **2️⃣ CONFIGURAR SECRETS (10 minutos)**

Acesse: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/functions

**Configure estas 4 secrets principais (⚠️ USE ESPAÇOS):**

```
Nome: SUPABASE URL
Valor: https://evdyqlrssgsktctjruuq.supabase.co

Nome: SUPABASE ANON KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw

Nome: SUPABASE SERVICE ROLE KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3OTU3MCwiZXhwIjoyMDgxNTU1NTcwfQ.NRxdwErN6MlaaMINbnnSui4XNm14xBRNfW5WS5SCH10

Nome: SUPABASE DB URL
Valor: [PEGAR EM Settings → Database → Connection String]
```

**E mais 14 secrets das integrações** (veja [COMANDOS_COPIAR_COLAR.txt](./COMANDOS_COPIAR_COLAR.txt))

---

### **3️⃣ TESTAR (2 minutos)**

**Via Terminal:**
```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

**Via Interface:**
1. Abra ImobHunter
2. Faça login
3. Clique em "VERIFICAR VERSÃO DO SERVIDOR"
4. Deve mostrar "1.2.0" em VERDE ✅

---

## 📚 **DOCUMENTAÇÃO COMPLETA:**

| Categoria | Guias |
|-----------|-------|
| **🎯 Início Rápido** | INICIO_AQUI.md, MIGRACAO_RESUMO.md, COMANDOS_COPIAR_COLAR.txt |
| **🚀 Deploy** | README_DEPLOY_URGENTE.md, deploy-server.sh, deploy-server.ps1 |
| **🔑 Secrets** | SUPABASE-SECRETS-SETUP.md, SECRETS-CONFIG-COMPLETA.md |
| **🆘 Troubleshooting** | TROUBLESHOOTING-SERVIDOR.md, DEBUG_BUSCA_AGORA.md |
| **📋 Referência** | INDEX_GUIAS.md (lista completa) |

---

## 🏗️ **ARQUITETURA:**

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                      │
│  - App.tsx (entry point)                               │
│  - Components (Dashboard, Leads, etc.)                 │
│  - Supabase Client (evdyqlrssgsktctjruuq)             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTION                     │
│  - Hono Server (v1.2.0)                                │
│  - Route: /make-server-9e4b8b7c/*                      │
│  - Integrações: Apollo, LinkedIn, Hunter, etc.         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  SUPABASE BACKEND                       │
│  - PostgreSQL (kv_store_9e4b8b7c)                      │
│  - Auth (usuários e sessões)                           │
│  - Storage (buckets privados)                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│               INTEGRAÇÕES EXTERNAS                      │
│  - Apollo.io (busca de leads)                          │
│  - LinkedIn (enriquecimento)                           │
│  - Hunter.io, Clearbit, RocketReach, etc.             │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 **TECNOLOGIAS:**

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Supabase Edge Functions (Deno), Hono
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **APIs:** Apollo.io, LinkedIn (via PDL), Hunter.io, Clearbit, RocketReach, Lusha, PeopleDataLabs
  - ⚠️ **Nota:** Proxycurl foi descontinuado e substituído por PDL + RocketReach ([veja migração](./PROXYCURL_MIGRATION.md))

---

## 🔗 **LINKS IMPORTANTES:**

| Recurso | URL |
|---------|-----|
| **Dashboard** | https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq |
| **Functions** | https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions |
| **Secrets** | https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/functions |
| **API Keys** | https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/api |
| **Logs** | https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions/server/logs |

---

## ⏱️ **TEMPO ESTIMADO:**

| Tarefa | Tempo |
|--------|-------|
| Deploy do servidor | 5 min |
| Configurar secrets | 10 min |
| Testar sistema | 2 min |
| **TOTAL** | **~17 min** |

---

## ✅ **CHECKLIST DE SETUP:**

```
┌─ SETUP IMOBHUNTER ───────────────────────┐
│                                          │
│  ✅ Código frontend atualizado          │
│  ✅ Scripts de deploy prontos           │
│  ✅ Documentação completa                │
│                                          │
│  ⏳ Deploy do backend                   │
│  ⏳ Configurar 18 secrets                │
│  ⏳ Testar versão 1.2.0                  │
│  ⏳ Testar Apollo API                    │
│  ⏳ Sistema 100% funcional               │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🚨 **ATENÇÃO:**

### **⚠️ IMPORTANTE:**
1. Use **ESPAÇOS** nos nomes das secrets (não underscores!)
   - ❌ Errado: `SUPABASE_URL`
   - ✅ Correto: `SUPABASE URL`

2. Aguarde **60 segundos** após cada deploy

3. Limpe cache do navegador após mudanças (Ctrl+Shift+R)

4. Verifique logs se algo não funcionar

---

## 🆘 **PRECISA DE AJUDA?**

### **Erro: "Failed to fetch"**
→ Edge Function não foi deployada. Execute o deploy.

### **Erro: "Missing environment variable"**
→ Secrets não configuradas. Adicione no Supabase.

### **Apollo retorna erro 422**
→ API key incorreta ou não configurada.

**📚 Guia completo de troubleshooting:** [TROUBLESHOOTING-SERVIDOR.md](./TROUBLESHOOTING-SERVIDOR.md)

---

## 📞 **COMANDOS ÚTEIS:**

```bash
# Ver logs
supabase functions logs server --project-ref evdyqlrssgsktctjruuq

# Redeploy
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq

# Testar
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

---

## 🎉 **RECURSOS DO SISTEMA:**

- ✅ **Busca automática** de leads no LinkedIn e outras fontes
- ✅ **Qualificação inteligente** via múltiplas APIs
- ✅ **Aquecimento multi-canal** (Email, SMS, WhatsApp, Instagram)
- ✅ **Dashboard visual** com métricas em tempo real
- ✅ **Multi-idioma** (600+ traduções)
- ✅ **Controle de autonomia** da IA
- ✅ **Pipeline automatizado** de nurturing

---

## 🚀 **COMEÇAR AGORA:**

```bash
# 1. Clone ou abra o projeto
cd /caminho/para/imobhunter

# 2. Execute o script de deploy
chmod +x deploy-server.sh && ./deploy-server.sh

# 3. Configure secrets no Supabase
# Veja: COMANDOS_COPIAR_COLAR.txt

# 4. Teste
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping

# 5. Pronto! 🎉
```

---

## 📝 **LICENÇA:**

Projeto privado - ImobHunter SaaS Platform

---

## 📧 **SUPORTE:**

Consulte os guias na pasta raiz do projeto ou verifique os logs em:
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions/server/logs

---

**🎯 PRÓXIMO PASSO:** Abra [INICIO_AQUI.md](./INICIO_AQUI.md) e siga o guia!

**⏱️ Tempo total: ~17 minutos para setup completo**

**✅ Última atualização: 17 de Dezembro de 2025**