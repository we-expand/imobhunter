# 🔍 DEBUG - BUSCA DE LEADS

## ✅ O QUE FOI FEITO:

1. ✅ Atualizado `/utils/supabase/info.tsx` com projeto correto (`nooknoilfqpfzujoddlp`)
2. ✅ Adicionado componente `DebugInfo` que testa a conexão backend
3. ✅ Componente aparece automaticamente quando você faz login

---

## 📋 PRÓXIMOS PASSOS:

### **PASSO 1: RECARREGUE A PÁGINA**

Pressione `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac) para forçar recarga completa.

---

### **PASSO 2: FAÇA LOGIN**

Após login, você verá um **card azul no canto inferior direito** com:
- ✅ ou ❌ Status das Edge Functions
- Informações de conexão
- Erros (se houver)

---

### **PASSO 3: VERIFIQUE OS RESULTADOS**

O card vai testar automaticamente:

#### ✅ **SE DER CERTO:**
- ✅ `imobhunter-api` responde → **FUNCIONA!**
- Pode usar a busca normalmente

#### ❌ **SE DER ERRO:**
- ❌ `make-server-9e4b8b7c` → Função não existe no projeto novo
- ❌ `imobhunter-api` → Precisa ser redeployada

---

## 🎯 **CENÁRIOS POSSÍVEIS:**

### **CENÁRIO A: Ambas dão erro 404**
**Significado:** Nenhuma Edge Function está deployada no projeto `nooknoilfqpfzujoddlp`

**Solução:**
1. Você precisa deployar uma das funções
2. Opção mais rápida: Deploy da `imobhunter-api` (já temos o código)

---

### **CENÁRIO B: `imobhunter-api` funciona**
**Significado:** Backend está OK!

**Problema:** Frontend ainda chama rotas antigas `/make-server-9e4b8b7c/*`

**Solução:** Eu atualizo TODOS os componentes para usar `/imobhunter-api/*`

---

### **CENÁRIO C: `make-server-9e4b8b7c` funciona**
**Significado:** Você já deployou a função antiga no projeto novo!

**Solução:** Nada a fazer! Sistema deve funcionar.

---

## 🚀 **FAÇA AGORA:**

1. **Recarregue a página** (Ctrl + Shift + R)
2. **Faça login**
3. **Olhe o card azul no canto inferior direito**
4. **Me diga o que aparece** (tire screenshot se possível)

---

## 🔧 **PROBLEMA DE CONFIGURAÇÕES (TELA BRANCA):**

O componente `SettingsPage` está tentando carregar dados do `localStorage` que podem não existir.

**SOLUÇÃO RÁPIDA:**
1. Abra o Console do Navegador (F12)
2. Digite: `localStorage.setItem('current-user', JSON.stringify({email: 'seu@email.com', name: 'Seu Nome'}))`
3. Recarregue a página

**SOLUÇÃO PERMANENTE:** Vou corrigir o componente para não depender desses dados.

---

## 📸 **ME ENVIE:**

1. Screenshot do card de debug (canto inferior direito)
2. Console do navegador (F12 → aba Console)
3. O que acontece quando clica em "Buscar Leads"

**👉 COM ISSO EU CONSIGO RESOLVER TUDO! 🚀**
