# 🚨 DIAGNÓSTICO URGENTE - NOT FOUND

## ⚡ AÇÃO IMEDIATA

### **OPÇÃO 1: Teste no Navegador (MAIS RÁPIDO)**

1. **Abra este arquivo no navegador:**
   ```
   file:///[caminho-do-projeto]/TESTE-NAVEGADOR.html
   ```
   
   Ou arraste o arquivo `TESTE-NAVEGADOR.html` para o navegador

2. **Clique nos botões na ordem:**
   - Teste 1: PING
   - Teste 2: AUTH-TEST
   - Teste 3: SIGNUP
   - Teste 4: LOGIN

3. **Veja qual teste falha primeiro e me informe**

---

### **OPÇÃO 2: Teste no Terminal**

```bash
# 1. Teste PING
curl -v https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping

# 2. Teste AUTH-TEST
curl -v https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth-test

# 3. Teste SIGNUP
curl -v -X POST https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
  -d '{"email":"teste@exemplo.com","password":"123456","name":"Teste"}'
```

---

## 🔍 POSSÍVEIS CAUSAS DO "NOT FOUND"

### **Causa 1: Função não foi deployada**
```bash
# Verificar se a função existe
supabase functions list
```

**❌ Se não aparecer "server" na lista:**
```bash
cd ~/Downloads/ImobHunter
supabase functions deploy server
```

---

### **Causa 2: Nome da função está errado**

**Verifique o nome exato da função no Supabase:**
```bash
supabase functions list
```

**Se o nome for diferente de "server", precisamos ajustar a URL**

---

### **Causa 3: Projeto não está linkado**

```bash
# Verificar projeto atual
supabase projects list

# Se não aparecer "imob_hunter", fazer link
supabase link --project-ref evdyqlrssgsktctjruuq
```

---

### **Causa 4: Edge Function tem outro nome**

**Acesse o Dashboard:**
```
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
```

**Veja qual é o nome EXATO da função que aparece lá**

Se for diferente de "server", a URL deve ser:
```
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/[NOME-DA-FUNCAO]/make-server-9e4b8b7c/ping
```

---

## 🔧 SOLUÇÃO DEFINITIVA

### **1. Verificar nome da função no Supabase**

Acesse:
```
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
```

**Qual nome aparece lá?**
- [ ] server
- [ ] make-server-9e4b8b7c
- [ ] Outro: ______________

---

### **2. Testar com o nome correto**

Se o nome no dashboard for `make-server-9e4b8b7c`, a URL seria:
```
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

Se o nome no dashboard for `server`, a URL seria:
```
https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
```

---

### **3. Deploy FORÇADO**

```bash
cd ~/Downloads/ImobHunter

# Deletar função antiga (se existir)
supabase functions delete server 2>/dev/null || true
supabase functions delete make-server-9e4b8b7c 2>/dev/null || true

# Aguardar 10 segundos
sleep 10

# Deploy novo
supabase functions deploy server

# Aguardar 30 segundos
sleep 30

# Testar
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
```

---

## 📋 CHECKLIST COMPLETO

Execute na ordem e me informe onde para:

- [ ] **1. Verificar projeto**
  ```bash
  supabase projects list
  ```
  
- [ ] **2. Verificar funções existentes**
  ```bash
  supabase functions list
  ```
  
- [ ] **3. Ver qual nome aparece no dashboard**
  Acesse: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
  
- [ ] **4. Fazer deploy**
  ```bash
  supabase functions deploy server
  ```
  
- [ ] **5. Aguardar 30 segundos**
  ```bash
  sleep 30
  ```
  
- [ ] **6. Testar todas as combinações de URL**
  ```bash
  # Opção 1
  curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
  
  # Opção 2
  curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
  
  # Opção 3
  curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/ping
  ```

---

## 🎯 RESPONDA ESTAS PERGUNTAS

Para eu poder ajudar melhor, preciso saber:

1. **Você fez o deploy?**
   ```bash
   supabase functions deploy server
   ```
   - [ ] Sim, fiz agora
   - [ ] Sim, fiz antes
   - [ ] Não, deu erro
   - [ ] Não sei como fazer

2. **O que aparece em `supabase functions list`?**
   - Copie e cole aqui

3. **O que aparece no Dashboard do Supabase?**
   - Acesse: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
   - Tem alguma função lá?
   - Qual o nome?
   - Qual o status?

4. **Qual erro EXATO aparece ao fazer login na interface?**
   - Abra o Console (F12)
   - Tente fazer login
   - Copie e cole TODO o erro que aparece

---

## ⚡ TESTE RÁPIDO AGORA

**Execute este comando AGORA e me envie o resultado:**

```bash
curl -v https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping 2>&1 | head -20
```

**Copie e cole TODA a saída aqui!**
