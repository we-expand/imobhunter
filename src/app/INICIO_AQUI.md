# 🎯 COMECE AQUI - MIGRAÇÃO PARA NOVO PROJETO

## ✅ **O QUE JÁ FOI FEITO:**

1. ✅ Código do frontend atualizado para o novo projeto
2. ✅ Project ID: `evdyqlrssgsktctjruuq`
3. ✅ URL: `https://evdyqlrssgsktctjruuq.supabase.co`
4. ✅ Credenciais configuradas no código
5. ✅ Scripts de deploy atualizados

---

## ⏳ **O QUE VOCÊ PRECISA FAZER AGORA:**

### **📋 OPÇÃO 1: DEPLOY RÁPIDO VIA SCRIPT (RECOMENDADO)**

#### **Linux/macOS:**
```bash
chmod +x deploy-server.sh
./deploy-server.sh
```

#### **Windows PowerShell:**
```powershell
.\deploy-server.ps1
```

**O script vai:**
- ✅ Verificar se Supabase CLI está instalado
- ✅ Fazer login automaticamente
- ✅ Linkar ao projeto `evdyqlrssgsktctjruuq`
- ✅ Fazer deploy da Edge Function
- ✅ Testar se está funcionando

---

### **📋 OPÇÃO 2: DEPLOY MANUAL (5 COMANDOS)**

```bash
# 1. Instalar CLI (se ainda não tem)
npm install -g supabase

# 2. Login
supabase login

# 3. Linkar ao NOVO projeto
supabase link --project-ref evdyqlrssgsktctjruuq

# 4. Navegar até a pasta do projeto (onde está supabase/functions/server)
cd /caminho/para/este/projeto

# 5. Deploy!
supabase functions deploy server
```

**Aguarde 60 segundos e pronto!** ✅

---

## 🔑 **DEPOIS DO DEPLOY: CONFIGURAR SECRETS**

Vá em: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/functions

Clique em **"Add new secret"** e adicione **CADA UMA** destas (⚠️ **USE ESPAÇOS nos nomes**):

### **Secrets Obrigatórias do Supabase:**

1. **SUPABASE URL** ← (com espaço)
   ```
   https://evdyqlrssgsktctjruuq.supabase.co
   ```

2. **SUPABASE ANON KEY** ← (com espaços)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw
   ```

3. **SUPABASE SERVICE ROLE KEY** ← (com espaços)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3OTU3MCwiZXhwIjoyMDgxNTU1NTcwfQ.NRxdwErN6MlaaMINbnnSui4XNm14xBRNfW5WS5SCH10
   ```

4. **SUPABASE DB URL** ← (com espaços)
   - Vá em: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/database
   - Copie o "Connection String" (mode: Session)

### **Secrets das Integrações (copie do projeto antigo):**

Se você já tinha configurado estas no projeto antigo (`nooknoilfqpfzujoddlp`), copie os mesmos valores:

5. **APOLLO API KEY**
6. **LINKEDIN API KEY**
7. **HUNTER API KEY**
8. **PIPL API KEY**
9. **CLEARBIT API KEY**
10. **PDL API KEY**
11. **FULLCONTACT API KEY**
12. **ROCKETREACH API KEY**
13. **PROXYCURL API KEY**
14. **LINKEDIN CLIENT ID**
15. **LINKEDIN CLIENT SECRET**
16. **LUSHA API KEY**
17. **RAPIDAPI KEY**
18. **RESEND API KEY**

---

## ✅ **TESTAR SE ESTÁ FUNCIONANDO:**

### **Teste 1: cURL**
```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

**Deve retornar:**
```json
{
  "status": "alive",
  "version": "1.2.0 - Apollo Direct Route + Header Fix ✅"
}
```

### **Teste 2: Interface ImobHunter**
1. Abra o app
2. Faça login
3. Clique no botão roxo: **"VERIFICAR VERSÃO DO SERVIDOR"**
4. Deve mostrar: **"Versão atual: 1.2.0"** em VERDE ✅
5. Clique em: **"TESTAR API"**
6. Deve retornar: **"✅ Apollo OK!"**

---

## 📂 **ARQUIVOS IMPORTANTES:**

```
/INICIO_AQUI.md                      ← VOCÊ ESTÁ AQUI
/NOVO_PROJETO_SETUP_COMPLETO.md      ← Guia detalhado com todas as secrets
/README_DEPLOY_URGENTE.md            ← Resumo rápido do deploy
/deploy-server.sh                    ← Script Linux/macOS
/deploy-server.ps1                   ← Script Windows
/utils/supabase/info.tsx             ← Já atualizado com novo projeto ✅
```

---

## 🎯 **ORDEM DE EXECUÇÃO:**

1. **AGORA:** Execute o script de deploy (Opção 1 ou 2 acima)
2. **DEPOIS:** Configure as 18 secrets no Supabase
3. **POR FIM:** Teste se está tudo funcionando

---

## 🆘 **PROBLEMAS COMUNS:**

### ❌ **"supabase command not found"**
```bash
npm install -g supabase
```

### ❌ **"Failed to fetch" na interface**
- Significa que a Edge Function não foi deployada ainda
- Execute o script de deploy

### ❌ **"Missing environment variable"**
- Configure as secrets no Supabase (passo 2 acima)

### ❌ **Apollo erro 422**
- Verifique se a secret "APOLLO API KEY" está configurada
- Aguarde 60s após configurar
- Faça redeploy: `supabase functions deploy server --project-ref evdyqlrssgsktctjruuq`

---

## 📞 **COMANDOS ÚTEIS:**

Ver logs em tempo real:
```bash
supabase functions logs server --project-ref evdyqlrssgsktctjruuq
```

Fazer redeploy:
```bash
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
```

Listar funções:
```bash
supabase functions list --project-ref evdyqlrssgsktctjruuq
```

---

## 🔗 **LINKS IMPORTANTES:**

- **Dashboard:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq
- **Functions:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
- **Secrets:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/functions
- **API Keys:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/api
- **Database:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/database

---

**🚀 PRONTO! Comece pelo deploy (Opção 1 ou 2) e depois configure as secrets!**

**⏱️ Tempo total estimado: 10-15 minutos**
