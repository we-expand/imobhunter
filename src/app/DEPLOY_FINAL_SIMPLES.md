# 🎯 DEPLOY FINAL - MÉTODO MAIS SIMPLES DO MUNDO

## ✅ **O QUE VAMOS FAZER**

Em vez de copiar 25 arquivos manualmente, vamos usar o **Supabase CLI** que já está instalado no seu Mac!

---

## 🚀 **PASSO A PASSO COMPLETO (3 minutos)**

### **PASSO 1: Navegar para o diretório correto**

O problema antes foi que você tentou fazer deploy da **pasta errada** (home do seu Mac).

O código está no **Figma Make**, mas o Supabase CLI pode fazer deploy diretamente daqui!

Execute no Terminal Mac:

```bash
# Criar pasta temporária
mkdir -p ~/Desktop/imobhunter-temp
cd ~/Desktop/imobhunter-temp
```

---

### **PASSO 2: Baixar o código-fonte atual**

O código já está deployado no Supabase. Vamos baixá-lo:

```bash
supabase functions download server --project-ref evdyqlrssgsktctjruuq
```

**Isso vai baixar o código ATUAL da função `server`.**

---

### **PASSO 3: Verificar se baixou**

```bash
ls -la supabase/functions/server/
```

**Você deve ver:** `index.ts` ou `index.tsx`

---

### **PASSO 4: Substituir pelo código atualizado**

Agora, vou te dar o código atualizado para substituir.

**Abra o arquivo:**
```bash
nano supabase/functions/server/index.tsx
```

**Delete todo o conteúdo** (Ctrl+K várias vezes)

**Cole o código atualizado** que vou te fornecer em seguida.

---

## ⚠️ **WAIT! HÁ UM PROBLEMA...**

O comando `supabase functions download` pode não funcionar se a função foi deployada via Dashboard.

---

## 💡 **SOLUÇÃO REAL - SEM PRECISAR DE ARQUIVOS LOCAIS**

### **MÉTODO: Deploy via Dashboard do Supabase**

1. **Abra:**
   ```
   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions/server
   ```

2. **Procure por um botão "Edit" ou "Code Editor"**

3. **ME DIGA O QUE VOCÊ VÊ:**
   - Você vê o código da função?
   - Tem um botão de editar?
   - Tem uma aba "Code"?

**Tire um print e me mostre!**

---

## 🔥 **ALTERNATIVA EXTREMA - CRIAR NOVA FUNÇÃO**

Se não conseguir editar, podemos:

1. Criar uma nova função chamada `server-v2`
2. Atualizar o frontend para usar a nova URL
3. Deletar a função antiga depois

---

## 📞 **PRÓXIMO PASSO**

**Me envie um print da página:**
```
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions/server
```

Com isso, vou saber exatamente como proceder! 🎯
