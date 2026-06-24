# 🐛 TESTE DE DEBUG - Busca de Leads

## Como Testar Agora:

### **1. Abra o Console do Navegador**
Pressione **F12** → Aba **Console**

### **2. Clique em "Iniciar Busca"**

### **3. Procure por estas mensagens no console:**

---

## ✅ **SE O BOTÃO FUNCIONA, VOCÊ VERÁ:**

```
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
🚨 ATENÇÃO: handleSearch FOI CHAMADA!
🚨 Se você vê esta mensagem, o botão ESTÁ FUNCIONANDO
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
```

---

## 📡 **SE A REQUISIÇÃO FOI ENVIADA, VOCÊ VERÁ:**

```
═══════════════════════════════════════════════
🔍 BUSCA AVANÇADA LINKEDIN SALES NAVIGATOR
═══════════════════════════════════════════════
📋 Filtros atuais: {...}
📡 URL da API: https://xxx.supabase.co/functions/v1/...
📡 Payload enviado: {...}
📡 Status da resposta: 200
📡 Status OK: true
```

---

## ✅ **SE OS DADOS CHEGARAM, VOCÊ VERÁ:**

```
✅ Dados recebidos do servidor: {...}
✅ 10 resultados encontrados!
🎨 [UI] ========================================
🎨 [UI] FORMATAÇÃO DOS RESULTADOS
🎨 [UI] ========================================
🎨 [UI] Resultados formatados: 10 leads
✅ [UI] setResults foi chamado com 10 items!
✅ [UI] setSearching(false) chamado - loading deve desaparecer
```

---

## 🎨 **SE OS RESULTADOS ESTÃO SENDO RENDERIZADOS, VOCÊ VERÁ:**

```
🎨 [RENDER] Renderizando resultados. Total: 10
🎨 [RENDER] Array results: [...]
🎨 [RENDER] Renderizando lead: João Silva
🎨 [RENDER] Renderizando lead: Maria Santos
...
```

---

## ❌ **SE HOUVER ERRO, VOCÊ VERÁ:**

```
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
🚨 ERRO CAPTURADO NO CATCH!
🚨 Tipo: Error
🚨 Mensagem: [mensagem do erro]
🚨 Stack: [stack trace]
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
```

---

## 📊 **RESULTADO ESPERADO:**

### **Sem API Keys (DEMO MODE):**
- ✅ Você deve ver mensagem: `⚠️ 10 perfis DEMO encontrados`
- ✅ 10 cards de leads devem aparecer na tela
- ⚠️ Aviso amarelo: "Dados DEMO"

### **Com API Keys (REAL MODE):**
- ✅ Você deve ver mensagem: `✅ 15 perfis REAIS encontrados!`
- ✅ 15 cards de leads reais devem aparecer
- ✅ Fontes: Apollo.io, Hunter.io, etc.

---

## 🐛 **DIAGNÓSTICO:**

### **Problema 1: Não vejo a mensagem 🚨 ATENÇÃO**
**Causa:** O botão não está executando a função
**Solução:** Verificar se o onClick está correto

### **Problema 2: Vejo 🚨 ATENÇÃO mas não vejo 📡 URL da API**
**Causa:** Erro antes de fazer a requisição
**Solução:** Verificar o erro no catch

### **Problema 3: Vejo 📡 URL mas não vejo ✅ Dados recebidos**
**Causa:** Erro na requisição ou resposta inválida
**Solução:** Verificar status da resposta

### **Problema 4: Vejo ✅ Dados recebidos mas não vejo 🎨 RENDER**
**Causa:** setResults não está atualizando o estado
**Solução:** Problema no React state

### **Problema 5: Vejo 🎨 RENDER mas nada aparece na tela**
**Causa:** Problema na renderização dos cards
**Solução:** Verificar o JSX dos cards

---

## 🎯 **APÓS TESTAR, ME ENVIE:**

1. **Qual foi a ÚLTIMA mensagem que você viu no console?**
2. **Teve algum erro em vermelho?**
3. **Apareceu algum toast (notificação) na tela?**
4. **Os cards de leads aparecem na tela?**

---

**Isso vai nos dizer EXATAMENTE onde o problema está!** 🔍
