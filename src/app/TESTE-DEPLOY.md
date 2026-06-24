# 🔍 DIAGNÓSTICO COMPLETO - Erro de Conexão

## ❌ ERRO ATUAL
```
Erro ao conectar com o servidor. Verifique se o servidor está rodando.
```

## 🎯 PASSO 1: Verificar se você fez o deploy

**Execute este comando:**
```bash
supabase functions list
```

**Deve mostrar algo como:**
```
┌────────┬─────────────────────┬──────────────┬────────┐
│ NAME   │ CREATED AT          │ VERSION      │ STATUS │
├────────┼─────────────────────┼──────────────┼────────┤
│ server │ 2024-xx-xx xx:xx:xx │ vXXX         │ ACTIVE │
└────────┴─────────────────────┴──────────────┴────────┘
```

### ❗ SE NÃO APARECER ou STATUS não for ACTIVE:

**Faça o deploy agora:**
```bash
cd ~/Downloads/ImobHunter
supabase functions deploy server
```

**Aguarde até ver:**
```
✅ Deployed Function server (version: xxx)
```

---

## 🎯 PASSO 2: Testar a rota de PING (Servidor básico)

**Execute este comando no terminal:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

### ✅ RESPOSTA ESPERADA:
```json
{
  "status": "alive",
  "version": "1.3.0 - ROTAS CORRIGIDAS ✅",
  "timestamp": "2024-..."
}
```

### ❌ SE DER ERRO:
- `404 Not Found` → Servidor não está deployado ou nome está errado
- `Connection refused` → Supabase offline (improvável)
- `Timeout` → Servidor está iniciando (aguarde 30s)

---

## 🎯 PASSO 3: Testar a rota de SIGNUP (Autenticação)

**Execute este comando:**
```bash
curl -X POST \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "123456",
    "name": "Teste Usuario"
  }'
```

### ✅ RESPOSTA ESPERADA:
```json
{
  "success": true,
  "message": "Usuário criado com sucesso! Você já pode fazer login.",
  "user": {
    "id": "...",
    "email": "teste@exemplo.com",
    "name": "Teste Usuario",
    "role": "user"
  }
}
```

### ❌ POSSÍVEIS ERROS:

| Erro | Causa | Solução |
|------|-------|---------|
| `404 Not Found` | Rota `/auth/signup` não existe | Verifique se o deploy foi feito |
| `400 - Email já cadastrado` | Usuário já existe | Use outro email ou tente fazer login |
| `500 - Internal Server Error` | Erro no Supabase Auth | Veja os logs: `supabase functions logs server` |

---

## 🎯 PASSO 4: Ver logs do servidor em tempo real

**Execute:**
```bash
supabase functions logs server --follow
```

**Deixe este comando rodando em um terminal separado**

Agora, **no navegador**, tente fazer login novamente.

### 📊 LOGS QUE VOCÊ DEVE VER:

```
🔐 [LOGIN] Nova requisição recebida
📧 [LOGIN] Email: teste@exemplo.com
🔍 [LOGIN] Tentando autenticar...
✅ [LOGIN] Login bem-sucedido!
📊 [LOGIN] User ID: xxxxx
🔑 [LOGIN] Access Token criado
```

### ❌ SE NÃO APARECER NENHUM LOG:
- A requisição não está chegando no servidor
- Pode ser problema de CORS ou URL incorreta

---

## 🎯 PASSO 5: Verificar no Console do Navegador

### **Abra o Console (F12) e procure por:**

```
🔐 [AUTH SERVICE] Iniciando login...
📍 [AUTH SERVICE] URL: https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/login
📧 [AUTH SERVICE] Email: teste@exemplo.com
```

### ✅ URL CORRETA:
```
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/login
```

### ❌ SE A URL ESTIVER DIFERENTE:
- Força o refresh: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
- Limpe o cache do navegador
- Feche e abra o navegador novamente

---

## 🎯 PASSO 6: Teste Manual com JavaScript

### **Copie e cole no Console do Navegador (F12):**

```javascript
// Teste direto da API de signup
fetch('https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw'
  },
  body: JSON.stringify({
    email: 'teste2@exemplo.com',
    password: '123456',
    name: 'Teste 2'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Resposta:', data))
.catch(err => console.error('❌ Erro:', err));
```

### ✅ DEVE MOSTRAR:
```javascript
✅ Resposta: {
  success: true,
  message: "Usuário criado com sucesso!",
  user: {...}
}
```

### ❌ SE DER ERRO:
```javascript
❌ Erro: TypeError: Failed to fetch
```

**Isso significa:**
- Servidor não está rodando
- URL incorreta
- Problema de CORS (improvável, pois configuramos)

---

## 🎯 PASSO 7: Verificar o nome da função no Supabase

### **Acesse o Dashboard do Supabase:**
```
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
```

### **Verifique:**
1. Se a função `server` aparece na lista
2. Se o status é `ACTIVE` (verde)
3. Clique na função e veja os logs

---

## 📋 CHECKLIST FINAL

Execute esta checklist na ordem:

- [ ] **Deploy feito:** `supabase functions deploy server`
- [ ] **Aguardei 30 segundos após deploy**
- [ ] **Rota /ping funciona:** `curl ...ping` retorna JSON
- [ ] **Rota /auth/signup funciona:** `curl ...signup` retorna JSON
- [ ] **Cache limpo:** `Ctrl+Shift+R` no navegador
- [ ] **Console mostra URL correta:** sem `/server/` duplicado
- [ ] **Logs do servidor rodando:** `supabase functions logs server --follow`

---

## 🚨 SOLUÇÃO RÁPIDA (Se nada funcionar)

### **1. Force o re-deploy:**
```bash
cd ~/Downloads/ImobHunter
supabase functions delete server
supabase functions deploy server
```

### **2. Aguarde 60 segundos**

### **3. Teste novamente com curl:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

---

## 📞 PRÓXIMO PASSO

**Execute o PASSO 1 primeiro e me informe o resultado:**

```bash
supabase functions list
```

**Copie e cole aqui o que aparecer!**
