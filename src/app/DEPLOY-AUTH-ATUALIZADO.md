# 🚀 DEPLOY DO SISTEMA DE AUTENTICAÇÃO - PASSO A PASSO

## ❗ IMPORTANTE: Correção Aplicada

Foi corrigido o erro na rota de autenticação que estava causando:
> "Erro ao conectar com o servidor"

### **O que foi corrigido:**
- ❌ Rota antiga (INCORRETA): `/server/make-server-9e4b8b7c/auth`
- ✅ Rota nova (CORRETA): `/make-server-9e4b8b7c/auth`

---

## 📋 PASSO 1: Deploy do Servidor Atualizado

### **Execute este comando no terminal:**

```bash
cd ~/Downloads/ImobHunter && supabase functions deploy server
```

### **Aguarde a mensagem:**
```
✅ Deployed Function server (version: xxx)
```

**Tempo estimado:** 15-30 segundos

---

## 📋 PASSO 2: Limpar Sessões Antigas

### **Abra o Console do Navegador (F12) e execute:**

```javascript
clearOldSessions()
window.location.reload()
```

**OU limpe manualmente:**

```javascript
localStorage.clear()
window.location.reload()
```

---

## 📋 PASSO 3: Teste Completo

### **3.1 - Verificar se o servidor está respondendo:**

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
```

**Deve retornar:**
```json
{
  "status": "alive",
  "version": "1.3.0",
  "timestamp": "2024-..."
}
```

### **3.2 - Testar na Interface:**

1. **Acesse a aplicação** → Deve ver a **Landing Page**

2. **Clique em "Começar Grátis"**

3. **Vá para a tab "Criar Conta":**
   - Nome: `Seu Nome`
   - Email: `teste@exemplo.com`
   - Senha: `123456`
   - Confirmar Senha: `123456`

4. **Clique em "Criar Conta Grátis"**
   - ✅ Deve mostrar: "Conta criada com sucesso!"

5. **Vá para a tab "Entrar":**
   - Email: `teste@exemplo.com`
   - Senha: `123456`

6. **Clique em "Entrar"**
   - ✅ Deve entrar no Dashboard

7. **Faça Logout**
   - ✅ Deve voltar para Landing Page

---

## 🔍 DIAGNÓSTICO DE ERROS

### **Se ainda der erro de conexão:**

#### **1. Verifique os logs no console (F12):**

Procure por estas mensagens:

```
🔐 [AUTH SERVICE] Iniciando login...
📍 [AUTH SERVICE] URL: https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/auth/login
📧 [AUTH SERVICE] Email: teste@exemplo.com
📡 [AUTH SERVICE] Response status: ???
📡 [AUTH SERVICE] Response ok: ???
```

#### **2. Possíveis erros e soluções:**

| Erro | Causa | Solução |
|------|-------|---------|
| `Response status: 404` | Servidor não encontrou a rota | Refaça o deploy |
| `Response status: 500` | Erro interno no servidor | Verifique logs do Supabase |
| `Response status: 401` | Problema de autenticação | Verifique o publicAnonKey |
| `TypeError: Failed to fetch` | Servidor offline ou CORS | Aguarde 30s após deploy |

#### **3. Verificar se o deploy foi feito:**

```bash
supabase functions list
```

Deve mostrar:
```
┌────────┬─────────────────────┬──────────────┬────────┐
│ NAME   │ CREATED AT          │ VERSION      │ STATUS │
├────────┼─────────────────────┼──────────────┼────────┤
│ server │ 2024-xx-xx xx:xx:xx │ vXXX         │ ACTIVE │
└────────┴─────────────────────┴──────────────┴────────┘
```

#### **4. Ver logs em tempo real:**

```bash
supabase functions logs server --follow
```

Faça login na interface e veja os logs aparecerem.

---

## 🧪 TESTE MANUAL DA API

### **Criar uma conta (signup):**

```bash
curl -X POST \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "123456",
    "name": "Teste Usuario"
  }'
```

**Resposta esperada:**
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

### **Fazer login:**

```bash
curl -X POST \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/auth/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "123456"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "user": {
    "id": "...",
    "email": "teste@exemplo.com",
    "name": "Teste Usuario",
    "role": "user"
  },
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "...",
    "expires_at": 1234567890
  }
}
```

---

## ✅ CHECKLIST FINAL

- [ ] Deploy do servidor realizado
- [ ] Servidor respondendo no `/ping`
- [ ] Sessões antigas limpas
- [ ] Landing Page aparecendo
- [ ] Consegue criar nova conta
- [ ] Consegue fazer login
- [ ] Consegue fazer logout
- [ ] Dashboard aparecendo após login

---

## 📞 SUPORTE

Se todos os passos acima falharem:

1. **Copie os logs do console (F12)**
2. **Execute:** `supabase functions logs server --limit 50`
3. **Compartilhe os logs para análise**

---

## 🎯 RESUMO

```bash
# 1. Deploy
cd ~/Downloads/ImobHunter && supabase functions deploy server

# 2. Aguarde 30 segundos

# 3. Teste no navegador
# - Abra F12 → Console
# - Execute: clearOldSessions()
# - Execute: window.location.reload()

# 4. Crie uma conta e faça login!
```

**Sistema pronto! 🚀**
