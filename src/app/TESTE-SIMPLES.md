# 🔍 TESTE SIMPLES - PASSO A PASSO

## ❗ ERRO ATUAL: "Not Found"

Isso significa que a rota não está sendo encontrada pelo Supabase.

---

## 📋 PASSO 1: FAZER O DEPLOY

**Execute este comando:**

```bash
cd ~/Downloads/ImobHunter
supabase functions deploy server
```

**AGUARDE até ver:**
```
Bundling server...
Deploying...  
✅ Deployed Function server (version: xxx)
```

**⏳ IMPORTANTE: Aguarde 30 segundos após o deploy antes de testar!**

---

## 📋 PASSO 2: TESTAR ROTAS NA ORDEM

### **2.1 - Testar a rota básica (PING):**

```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

**✅ Deve retornar:**
```json
{"status":"alive","version":"..."}
```

**❌ Se retornar `Not Found`:**
- A função não foi deployada corretamente
- Aguarde mais 30 segundos e tente novamente

---

### **2.2 - Testar a rota de teste de AUTH:**

```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth-test
```

**✅ Deve retornar:**
```json
{
  "success": true,
  "message": "Rota de autenticação está funcionando!",
  "routes": [
    "POST /make-server-9e4b8b7c/auth/signup",
    "POST /make-server-9e4b8b7c/auth/login",
    ...
  ]
}
```

**❌ Se retornar `Not Found`:**
- O deploy não incluiu as novas alterações
- Tente deletar e redeployar:
  ```bash
  supabase functions delete server
  supabase functions deploy server
  ```

---

### **2.3 - Testar SIGNUP (criar conta):**

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

**✅ Deve retornar:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso!",
  "user": {...}
}
```

**❌ Se retornar `Not Found`:**
- As subrotas não estão sendo registradas
- Veja os logs: `supabase functions logs server`

---

### **2.4 - Testar LOGIN:**

```bash
curl -X POST \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "123456"
  }'
```

**✅ Deve retornar:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "user": {...},
  "session": {...}
}
```

---

## 📋 PASSO 3: VER LOGS EM TEMPO REAL

**Abra um terminal separado e execute:**

```bash
supabase functions logs server --follow
```

**Deixe rodando e faça os testes acima novamente.**

**Você deve ver:**
```
🔐 [SIGNUP] Nova requisição recebida
📧 [SIGNUP] Email: teste@exemplo.com
✅ [SIGNUP] Usuário criado com sucesso!
```

**❌ Se NÃO aparecer NENHUM log:**
- A requisição não está chegando ao servidor
- Verifique se a URL está correta
- Verifique se você está usando `https://` (não `http://`)

---

## 📋 PASSO 4: VERIFICAR NO DASHBOARD SUPABASE

1. **Acesse:**
   ```
   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
   ```

2. **Verifique:**
   - Se a função `server` aparece
   - Se o status é `ACTIVE` (verde)
   - Qual é a versão atual
   - Quando foi o último deploy

3. **Clique na função `server`** e veja:
   - Logs em tempo real
   - Configurações
   - Variáveis de ambiente

---

## 🚨 SOLUÇÃO SE NADA FUNCIONAR

### **Opção 1: Delete e Redeploy**

```bash
cd ~/Downloads/ImobHunter

# 1. Deletar a função antiga
supabase functions delete server

# 2. Aguardar 10 segundos
sleep 10

# 3. Fazer novo deploy
supabase functions deploy server

# 4. Aguardar 30 segundos
sleep 30

# 5. Testar
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

### **Opção 2: Verificar se o Supabase CLI está logado**

```bash
# Ver qual projeto está ativo
supabase projects list

# Se não aparecer "imob_hunter", fazer link
supabase link --project-ref evdyqlrssgsktctjruuq

# Fazer deploy novamente
supabase functions deploy server
```

---

## 📞 COPIE E COLE O RESULTADO

**Execute estes comandos e me envie a saída:**

```bash
# 1. Lista de funções
echo "=== LISTA DE FUNÇÕES ==="
supabase functions list

# 2. Teste de ping
echo "=== TESTE PING ==="
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping

# 3. Teste de auth-test
echo "=== TESTE AUTH-TEST ==="
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth-test

# 4. Último deploy
echo "=== INFORMAÇÕES DO PROJETO ==="
supabase projects list
```

**Copie TODA a saída e me envie!**

---

## ✅ CHECKLIST

- [ ] Executei `supabase functions deploy server`
- [ ] Aguardei 30 segundos após deploy
- [ ] Rota `/ping` retorna JSON (não "Not Found")
- [ ] Rota `/auth-test` retorna JSON
- [ ] Logs aparecem com `supabase functions logs server --follow`
- [ ] Copiei os resultados para enviar

---

**Execute o PASSO 1 (deploy) agora e me informe o resultado! 🚀**
