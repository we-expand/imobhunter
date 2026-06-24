# 🎯 SETUP COMPLETO - NOVO PROJETO IMOB_HUNTER

## 📋 **INFORMAÇÕES DO PROJETO:**

```
Nome: imob_hunter
Project ID: evdyqlrssgsktctjruuq
URL: https://evdyqlrssgsktctjruuq.supabase.co
```

**Dashboard:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq

---

## 🔑 **CREDENCIAIS (JÁ CONFIGURADAS NO CÓDIGO):**

✅ **SUPABASE_URL:**
```
https://evdyqlrssgsktctjruuq.supabase.co
```

✅ **SUPABASE_ANON_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw
```

✅ **SUPABASE_SERVICE_ROLE_KEY:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3OTU3MCwiZXhwIjoyMDgxNTU1NTcwfQ.NRxdwErN6MlaaMINbnnSui4XNm14xBRNfW5WS5SCH10
```

---

## ⚙️ **PASSO 1: CONFIGURAR SECRETS NO SUPABASE**

### 🌐 **Acesse:**
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/functions

### 📝 **Clique em "Add new secret" e adicione CADA UMA destas:**

⚠️ **ATENÇÃO: USE ESPAÇOS NOS NOMES, NÃO UNDERSCORES!**

---

#### **1. SUPABASE URL** ← (COM ESPAÇO)
```
Value: https://evdyqlrssgsktctjruuq.supabase.co
```

#### **2. SUPABASE ANON KEY** ← (COM ESPAÇOS)
```
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw
```

#### **3. SUPABASE SERVICE ROLE KEY** ← (COM ESPAÇOS)
```
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3OTU3MCwiZXhwIjoyMDgxNTU1NTcwfQ.NRxdwErN6MlaaMINbnnSui4XNm14xBRNfW5WS5SCH10
```

#### **4. SUPABASE DB URL** ← (COM ESPAÇOS)
```
Value: postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
⚠️ **Como obter:**
1. Vá em: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/database
2. Seção "Connection String"
3. Mode: "Session"
4. Copie o valor completo

---

### 🔌 **SECRETS DAS INTEGRAÇÕES (APIs Externas):**

Como você já tem estas keys configuradas no projeto antigo, **copie os mesmos valores**:

#### **5. RESEND API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **6. PIPL API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **7. HUNTER API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **8. APOLLO API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **9. CLEARBIT API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **10. PDL API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **11. FULLCONTACT API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **12. ROCKETREACH API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **13. PROXYCURL API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **14. LINKEDIN CLIENT ID**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **15. LINKEDIN CLIENT SECRET**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **16. LUSHA API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **17. RAPIDAPI KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

#### **18. LINKEDIN API KEY**
```
Value: [COPIE DO PROJETO ANTIGO]
```

---

## 🚀 **PASSO 2: DEPLOY DO SERVIDOR VIA CLI**

### **Opção A: Script Automático (RECOMENDADO)**

```bash
# Linux/macOS
chmod +x deploy-server.sh
./deploy-server.sh

# Windows PowerShell
.\deploy-server.ps1
```

Quando pedir o Project ID, digite: **evdyqlrssgsktctjruuq**

---

### **Opção B: Comandos Manuais**

```bash
# 1. Instalar CLI (se ainda não tem)
npm install -g supabase

# 2. Login
supabase login

# 3. Linkar ao NOVO projeto
supabase link --project-ref evdyqlrssgsktctjruuq

# 4. Navegar até a pasta do projeto
cd /caminho/para/este/projeto

# 5. Deploy da função server
supabase functions deploy server

# 6. Aguardar 60 segundos
```

---

## ✅ **PASSO 3: VERIFICAR SE FUNCIONOU**

### **Teste 1: Via cURL**
```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

**Resposta esperada:**
```json
{
  "status": "alive",
  "version": "1.2.0 - Apollo Direct Route + Header Fix ✅",
  "timestamp": "2025-12-17T...",
  "message": "Servidor está funcionando! ✅"
}
```

### **Teste 2: Via Interface ImobHunter**
1. Abra o app: http://localhost:5173 (ou URL de produção)
2. Faça login
3. Clique no botão roxo no canto superior direito: **"VERIFICAR VERSÃO DO SERVIDOR"**
4. Deve mostrar: **"Versão atual: 1.2.0"** em VERDE ✅
5. Clique em **"CLIQUE AQUI PARA TESTAR A API"**
6. Deve retornar: **"✅ Apollo OK! X contatos encontrados"**

### **Teste 3: Verificar Secrets**
```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/debug/env-vars
```

**Deve mostrar:**
```json
{
  "SUPABASE_URL": "https://evdyqlrssgsktctjruuq.supabase.co",
  "SUPABASE_ANON_KEY": "eyJhbG...",
  "APOLLO_API_KEY": "***CONFIGURADO***",
  "LINKEDIN_API_KEY": "***CONFIGURADO***",
  ...
}
```

---

## 🆘 **TROUBLESHOOTING**

### ❌ **Erro: "Failed to fetch"**
**Causa:** Edge Function não está deployada ainda.
**Solução:** Execute o PASSO 2 acima (deploy via CLI)

### ❌ **Erro: "Missing environment variable"**
**Causa:** Secrets não foram configuradas.
**Solução:** Execute o PASSO 1 acima (adicionar todas as 18 secrets)

### ❌ **Versão ainda mostra 1.0.0**
**Causa:** Deploy não foi feito ou ainda está processando.
**Solução:** 
1. Aguarde 60 segundos
2. Limpe cache do navegador (Ctrl+Shift+R)
3. Verifique logs: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions/server/logs

### ❌ **Apollo retorna erro 422**
**Causa:** API key não está sendo enviada corretamente.
**Solução:** 
1. Verifique se a secret "APOLLO API KEY" está configurada
2. Faça redeploy: `supabase functions deploy server --project-ref evdyqlrssgsktctjruuq`
3. Aguarde 60 segundos e teste novamente

---

## 📊 **CHECKLIST DE MIGRAÇÃO COMPLETA:**

- [x] ✅ Código atualizado com novo Project ID
- [ ] ⏳ Secrets configuradas no Supabase (18 no total)
- [ ] ⏳ Edge Function deployada via CLI
- [ ] ⏳ Teste /ping retorna versão 1.2.0
- [ ] ⏳ Teste Apollo retorna sucesso
- [ ] ⏳ Interface mostra versão correta
- [ ] ⏳ Sistema 100% funcional

---

## 🎯 **PRÓXIMOS PASSOS:**

1. **AGORA:** Configure as 18 secrets (PASSO 1)
2. **DEPOIS:** Faça deploy via CLI (PASSO 2)
3. **POR FIM:** Teste tudo (PASSO 3)

---

## 📞 **COMANDOS ÚTEIS:**

Ver logs em tempo real:
```bash
supabase functions logs server --project-ref evdyqlrssgsktctjruuq
```

Listar funções deployadas:
```bash
supabase functions list --project-ref evdyqlrssgsktctjruuq
```

Fazer redeploy:
```bash
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
```

---

**🎉 BOA SORTE! Qualquer dúvida, consulte os logs ou a documentação!**
