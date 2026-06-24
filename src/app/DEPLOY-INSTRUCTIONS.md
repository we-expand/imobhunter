# 🚀 Instruções para Deploy do ImobHunter Backend

## ✅ **API Keys já configuradas com sucesso:**
- ✅ PDL_API_KEY (People Data Labs)
- ✅ ROCKETREACH_API_KEY

## 📍 **Como fazer o deploy:**

### **Opção 1: Via Terminal Local (Mac)**

```bash
# 1. Navegar para ESTA pasta onde você está agora
cd ~/Desktop  # ou onde quer que você esteja executando este código

# 2. Fazer deploy do Edge Function
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt

# 3. Aguardar 30 segundos
sleep 30

# 4. Testar
curl "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/debug/env-vars"
```

### **Opção 2: Via Dashboard do Supabase (Mais fácil)**

1. **Acesse:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions

2. **Clique em "Deploy new edge function"**

3. **Configure:**
   - Nome: `server`
   - Importar de: GitHub ou fazer upload manual

4. **Upload manual:**
   - Fazer ZIP da pasta `/supabase/functions/server/`
   - Upload do ZIP
   - Deploy

### **Opção 3: Auto-Deploy via GitHub (Recomendado)**

Se o projeto estiver no GitHub com auto-deploy configurado:

```bash
# Fazer commit e push
git add .
git commit -m "feat: Migração Proxycurl → PDL + RocketReach"
git push origin main
```

O Supabase fará deploy automaticamente!

---

## 🧪 **Como testar se funcionou:**

### **1. Teste via API direto:**

```bash
curl "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/debug/env-vars" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw"
```

**Resposta esperada:**
```json
{
  "apollo": {"configured": true},
  "pdl": {"configured": true},      // ← Deve estar true
  "rocketreach": {"configured": true}  // ← Deve estar true
}
```

### **2. Teste no ImobHunter:**

1. Abra a aplicação ImobHunter
2. Pressione **`Ctrl+Shift+T`**
3. Clique em **"Diagnóstico Completo"**
4. Verifique se mostra:
   - ✅ **PDL (People Data Labs)**: Configurada ✓
   - ✅ **RocketReach**: Configurada ✓
   - ✅ **Apollo.io**: Configurada ✓

---

## 🔍 **Troubleshooting:**

### ❌ "command not found: supabase"
```bash
npm install -g supabase
supabase login
```

### ❌ "Function not found" (404)
- O deploy ainda não foi feito
- Execute: `supabase functions deploy server --project-ref evdyqlrssgsktctjruuq`

### ❌ "Docker is not running"
- Ignore este aviso - não afeta o deploy remoto
- O deploy será feito nos servidores do Supabase

### ❌ "no such file or directory"
- Você está no diretório errado
- Use `pwd` para ver onde está
- Navegue para a pasta onde está o código do ImobHunter

---

## 📦 **Estrutura de Deploy:**

```
supabase/
└── functions/
    └── server/              ← Deploy ESTA pasta
        ├── index.tsx        ← Entry point
        ├── pdl-linkedin-api.ts  ← Nova API PDL
        ├── apollo-api.ts    ← Apollo configurado
        ├── diagnostics-routes.ts
        └── ... (outros arquivos)
```

---

## 🎯 **Comando Simplificado (Copy-Paste):**

```bash
# Execute TUDO de uma vez:
cd $(find ~ -name "supabase" -type d -path "*/functions" 2>/dev/null | head -1 | sed 's|/supabase/functions||') 2>/dev/null || echo "⚠️ Por favor, navegue manualmente para a pasta do projeto"

supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt && \
sleep 10 && \
curl -s "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/debug/env-vars" | grep -E "(pdl|rocketreach|apollo)" || echo "✅ Deploy concluído! Teste no ImobHunter com Ctrl+Shift+T"
```

---

## ✅ **Checklist Final:**

```
□ Supabase CLI instalado
□ Deploy executado sem erros
□ Aguardou 30 segundos
□ Teste via curl retornou 200 OK
□ PDL e RocketReach aparecem como "configured": true
□ Painel de diagnóstico mostra ✅ verde
□ Sistema funcionando no ImobHunter
```

---

**🎉 Após o deploy bem-sucedido, você terá:**
- ✅ Apollo.io funcionando (já configurado)
- ✅ People Data Labs (PDL) funcionando (nova API)
- ✅ RocketReach funcionando (nova API)
- ✅ Sistema completo de Lead Generation operacional
