# 📸 GUIA VISUAL - Como deve ficar no Supabase

## 🎯 URL da tela de configuração

```
https://app.supabase.com/project/nooknoilfqpfzujoddlp/settings/functions
```

---

## 📋 Como deve ficar a lista de Secrets

Após configurar tudo, sua tela deve mostrar exatamente isto:

```
┌─────────────────────────────────┬──────────────────────────┬─────────┐
│ Name                            │ Value                    │ Actions │
├─────────────────────────────────┼──────────────────────────┼─────────┤
│ SUPABASE URL                    │ https://nooknoilfqp...   │ Edit    │
├─────────────────────────────────┼──────────────────────────┼─────────┤
│ SUPABASE ANON KEY               │ eyJhbGciOiJIUzI1Ni...    │ Edit    │
├─────────────────────────────────┼──────────────────────────┼─────────┤
│ SUPABASE SERVICE ROLE KEY       │ eyJhbGciOiJIUzI1Ni...    │ Edit    │
├─────────────────────────────────┼──────────────────────────┼─────────┤
│ APOLLO API KEY                  │ 2MzD573PNPMUDo1kBR...    │ Edit    │
└─────────────────────────────────┴──────────────────────────┴─────────┘
```

---

## ✅ CHECKLIST VISUAL

### ✓ Nome das Secrets (primeira coluna)

Certifique-se que os nomes têm **ESPAÇOS** (não underscores):

- ✅ `SUPABASE URL` ← Correto (tem espaço)
- ❌ `SUPABASE_URL` ← Errado (tem underscore)

- ✅ `SUPABASE ANON KEY` ← Correto
- ❌ `SUPABASE_ANON_KEY` ← Errado

- ✅ `SUPABASE SERVICE ROLE KEY` ← Correto (2 espaços)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` ← Errado

- ✅ `APOLLO API KEY` ← Correto
- ❌ `APOLLO_API_KEY` ← Errado

---

## 🔍 Como verificar cada Secret

### 1️⃣ SUPABASE URL

**Clique em "Edit" ao lado de "SUPABASE URL"**

Deve aparecer:

```
┌──────────────────────────────────────────────────┐
│ Edit Secret                                      │
├──────────────────────────────────────────────────┤
│ Name:                                            │
│ SUPABASE URL                                     │
│                                                  │
│ Value:                                           │
│ https://nooknoilfqpfzujoddlp.supabase.co        │
│                                                  │
│ [Cancel]                           [Save Secret] │
└──────────────────────────────────────────────────┘
```

---

### 2️⃣ SUPABASE ANON KEY

**Clique em "Edit" ao lado de "SUPABASE ANON KEY"**

Deve aparecer:

```
┌──────────────────────────────────────────────────┐
│ Edit Secret                                      │
├──────────────────────────────────────────────────┤
│ Name:                                            │
│ SUPABASE ANON KEY                                │
│                                                  │
│ Value:                                           │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi │
│ JzdXBhYmFzZSIsInJlZiI6Im5vb2tub2lsZnFwZnp1am9k │
│ ZGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjA3Nz │
│ csImV4cCI6MjA4MTE5Njc3N30.wced3DsQJ9onkBLSP6rW │
│ myuCHRuZc0emirIiekKt7ss                          │
│                                                  │
│ [Cancel]                           [Save Secret] │
└──────────────────────────────────────────────────┘
```

---

### 3️⃣ SUPABASE SERVICE ROLE KEY

**Clique em "Edit" ao lado de "SUPABASE SERVICE ROLE KEY"**

Deve aparecer:

```
┌──────────────────────────────────────────────────┐
│ Edit Secret                                      │
├──────────────────────────────────────────────────┤
│ Name:                                            │
│ SUPABASE SERVICE ROLE KEY                        │
│                                                  │
│ Value:                                           │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi... │
│ (muito maior que a ANON KEY - ~280-300 chars)    │
│                                                  │
│ [Cancel]                           [Save Secret] │
└──────────────────────────────────────────────────┘
```

⚠️ **Se você ainda NÃO configurou esta, veja como pegar:**

1. Abra nova aba: https://app.supabase.com/project/nooknoilfqpfzujoddlp/settings/api
2. Procure a seção **"Project API keys"**
3. Encontre a linha **"service_role"** (tem um ícone de "secret")
4. Clique em **"Reveal"** ou **"Copy"**
5. Cole no Value desta secret

---

### 4️⃣ APOLLO API KEY

**Clique em "Edit" ao lado de "APOLLO API KEY"**

Deve aparecer:

```
┌──────────────────────────────────────────────────┐
│ Edit Secret                                      │
├──────────────────────────────────────────────────┤
│ Name:                                            │
│ APOLLO API KEY                                   │
│                                                  │
│ Value:                                           │
│ 2MzD573PNPMUDo1kBRJUuA                           │
│                                                  │
│ [Cancel]                           [Save Secret] │
└──────────────────────────────────────────────────┘
```

---

## 🚨 ERRO MAIS COMUM

Se você vir isto:

```
┌─────────────────────────────────┬──────────────────────────┐
│ APOLLOAPIKEY                    │ 2MzD573PNPMUDo1kBR...    │  ❌ ERRADO!
│ SUPABASEURL                     │ https://nooknoilfqp...   │  ❌ ERRADO!
│ SUPABASEANONKEY                 │ eyJhbGciOiJIUzI1Ni...    │  ❌ ERRADO!
└─────────────────────────────────┴──────────────────────────┘
```

**Problema:** Os nomes estão GRUDADOS (sem espaços)

**Solução:** Delete todas e recrie com ESPAÇOS entre as palavras!

---

## ✅ CORRETO vs ❌ ERRADO

### Nome: APOLLO API KEY

```
✅ Correto:  A P O L L O   A P I   K E Y
             ↑           ↑   ↑
             Tem espaços aqui

❌ Errado:   A P O L L O _ A P I _ K E Y
             ↑           ↑   ↑
             Underscores (não funciona!)
```

---

## 🔄 Se precisar recriar

1. **Delete a secret errada:** Clique no ícone de lixeira
2. **Clique em "Add new secret"**
3. **Nome:** Digite com ESPAÇOS (ex: `APOLLO API KEY`)
4. **Value:** Cole o valor exato
5. **Save**

---

## 🧪 Teste final

Após salvar as 4 secrets, abra os **Logs das Edge Functions**:

```
Settings → Edge Functions → Logs
```

Procure por estas linhas:

```
✅ APOLLO_API_KEY: 2MzD573PNP... (22 chars)
✅ SUPABASE_URL: https://noo... (48 chars)
✅ SUPABASE_ANON_KEY: eyJhbGc... (235 chars)
✅ SUPABASE_SERVICE_ROLE_KEY: eyJhbGc... (289 chars)
```

Se aparecer `❌ NÃO CONFIGURADA`, algo está errado!

---

## 📞 Precisa de ajuda?

Tire um **screenshot** da sua tela de Secrets e compartilhe para diagnóstico.

Deve mostrar os 4 nomes COM ESPAÇOS (não com underscores).

---

**Última atualização:** Dezembro 2024
