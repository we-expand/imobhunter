# 🔧 SOLUÇÃO: DADOS DEMO/MOCKADOS

## ❌ PROBLEMA ATUAL:
**Você está vendo resultados DEMO (fictícios) mesmo tendo a API key do Apollo.**

---

## 🎯 CHECKLIST DE SOLUÇÃO (SIGA NA ORDEM):

### ✅ **PASSO 1: VERIFICAR SE A KEY ESTÁ NO SUPABASE**

1. Abrir: https://supabase.com/dashboard
2. Selecionar seu projeto
3. Settings (menu lateral) → Edge Functions → Secrets
4. Procurar: **APOLLO_API_KEY**

**RESULTADO ESPERADO:**
```
✅ Se aparecer na lista = Está configurada
❌ Se NÃO aparecer = Precisa adicionar
```

**SE NÃO APARECER, ADICIONAR:**
- Clicar "Add Secret"
- Nome: `APOLLO_API_KEY`
- Valor: `R31HOQYiof3eK9B5uxqePA`
- Salvar

---

### ✅ **PASSO 2: REINICIAR EDGE FUNCTIONS**

1. Supabase Dashboard
2. Edge Functions (menu lateral)
3. Encontrar: **make-server-9e4b8b7c**
4. Clicar nos 3 pontos (...) → **Restart**
5. **AGUARDAR 2-3 MINUTOS** (IMPORTANTE!)

**⚠️ CRÍTICO:** Não testar imediatamente! Aguardar o servidor reiniciar completamente.

---

### ✅ **PASSO 3: LIMPAR CACHE DO NAVEGADOR**

```bash
# Opção 1: Hard Refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Opção 2: Limpar cache completo
Ctrl + Shift + Delete
→ Selecionar "Cache" e "Cookies"
→ Limpar
```

---

### ✅ **PASSO 4: TESTAR A API KEY MANUALMENTE**

Antes de configurar no Supabase, teste se a key funciona:

1. Ir em **Configurações → Segurança**
2. Clicar no banner laranja "**Vendo Dados DEMO?**"
3. Clicar "**Executar Diagnóstico Completo**"
4. Aguardar resultado

**RESULTADO ESPERADO:**
```
✅ APOLLO FUNCIONANDO
   - API Key válida
   - 25 leads REAIS retornados
   - Fonte: Apollo.io

❌ APOLLO NÃO FUNCIONANDO
   - Verá qual é o problema específico
   - Receberá solução passo a passo
```

---

### ✅ **PASSO 5: SE AINDA NÃO FUNCIONAR**

#### **OPÇÃO A: Gerar Nova API Key**

Sua key pode ter expirado. Gerar nova:

1. Login em: https://app.apollo.io
2. Settings → API & Integrations
3. Clicar "Generate New API Key"
4. Copiar a nova key
5. Substituir no Supabase
6. Reiniciar Edge Functions
7. Aguardar 3 minutos
8. Testar

#### **OPÇÃO B: Verificar Plano Apollo**

Talvez acabaram os créditos:

1. Login em apollo.io
2. Dashboard (tela inicial)
3. Ver: "**X credits remaining**"

**Se zero créditos:**
- Plano Free: Aguardar próximo mês
- OU fazer upgrade para Pro ($49/mês)

#### **OPÇÃO C: Verificar Logs do Servidor**

Ver o que está acontecendo:

1. Supabase Dashboard
2. Logs → Edge Functions
3. Procurar por:
   - `🎭 [DEMO MODE]` = Entrando em modo demo
   - `❌ [APOLLO]` = Erro do Apollo
   - `401` = Key inválida
   - `403` = Sem permissão
   - `429` = Rate limit (muitas requests)

---

## 🧪 **FERRAMENTA DE DIAGNÓSTICO (NO APP)**

Criamos uma ferramenta visual para te ajudar:

### **Como usar:**

1. Ir em **Configurações** (menu lateral)
2. Aba **Segurança**
3. Banner laranja no topo: "**Vendo Dados DEMO?**"
4. Clicar "**Executar Diagnóstico Completo**"

### **O que ela faz:**

```
✅ Verifica se APOLLO_API_KEY está no Supabase
✅ Testa se Apollo aceita a key
✅ Faz busca real de leads
✅ Identifica causa raiz do problema
✅ Mostra solução específica
✅ Links diretos para resolver
```

---

## 💡 **CAUSAS MAIS COMUNS:**

### **1. Key não está no Supabase (50%)**

**SINTOMA:** Diagnóstico mostra "API Key não configurada"

**SOLUÇÃO:**
- Adicionar APOLLO_API_KEY nas Secrets
- Valor: `R31HOQYiof3eK9B5uxqePA`
- Reiniciar Edge Functions

---

### **2. Edge Functions não reiniciadas (30%)**

**SINTOMA:** Key está no Supabase mas ainda retorna DEMO

**SOLUÇÃO:**
- Reiniciar Edge Functions manualmente
- Aguardar 2-3 minutos (cache)
- Limpar cache do navegador
- Testar novamente

---

### **3. API Key inválida/expirada (15%)**

**SINTOMA:** Diagnóstico mostra "API Key rejeitada - Status 401"

**SOLUÇÃO:**
- Verificar se key está correta (sem espaços)
- Gerar nova key no Apollo
- Verificar se conta Apollo está ativa
- Confirmar que tem créditos disponíveis

---

### **4. Espaços extras na key (3%)**

**SINTOMA:** Key parece certa mas não funciona

**SOLUÇÃO:**
```javascript
// ❌ ERRADO (com espaços):
" R31HOQYiof3eK9B5uxqePA "

// ✅ CERTO (sem espaços):
"R31HOQYiof3eK9B5uxqePA"
```

- Copiar novamente do Apollo
- Colar no Notepad primeiro
- Verificar que não tem espaços
- Copiar do Notepad para Supabase

---

### **5. Créditos Apollo esgotados (2%)**

**SINTOMA:** Funcionava antes, parou de repente

**SOLUÇÃO:**
- Verificar créditos em apollo.io
- Aguardar reset mensal (plano free)
- OU fazer upgrade para Pro

---

## 🎯 **TESTE RÁPIDO (30 SEGUNDOS)**

Depois de configurar, teste:

```
1. Ir em "Buscar Leads"
2. Digitar: Cargo = "CEO"
3. Clicar "Iniciar Busca"
4. Aguardar 20 segundos
5. Verificar:
   
   ✅ FUNCIONOU:
      - "25 leads encontrados"
      - "Fontes: Apollo.io"
      - Nome real (não "João Silva")
      - Email real (não "@example.com")
   
   ❌ AINDA DEMO:
      - "25 leads DEMO"
      - "Fontes: Demo Data"
      - Nomes fictícios
      - Emails fake
```

---

## 📞 **PRECISA DE AJUDA?**

Se nada disso resolver:

### **1. Executar Diagnóstico Completo**
- App → Configurações → Segurança
- Banner "Vendo Dados DEMO?"
- Executar diagnóstico
- Printar resultado completo

### **2. Verificar Logs**
- Supabase → Edge Functions → Logs
- Copiar mensagens de erro
- Procurar por "DEMO MODE" ou "APOLLO"

### **3. Teste Manual da Key**
```bash
# No terminal ou Postman:
curl https://api.apollo.io/v1/mixed_people/search \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "R31HOQYiof3eK9B5uxqePA",
    "page": 1,
    "per_page": 1,
    "person_titles": ["CEO"]
  }'

# Se retornar dados = Key funciona
# Se retornar erro 401 = Key inválida
```

### **4. Me enviar:**
- Screenshot do diagnóstico
- Logs do Supabase (últimas 20 linhas)
- Resultado do teste manual
- Plano do Apollo (free/pro)

---

## ✅ **CHECKLIST FINAL:**

Antes de pedir ajuda, confirmar que fez TUDO:

- [ ] APOLLO_API_KEY está nas Secrets do Supabase
- [ ] Valor da key: `R31HOQYiof3eK9B5uxqePA` (sem espaços)
- [ ] Reiniciei Edge Functions
- [ ] Aguardei 2-3 minutos após reiniciar
- [ ] Limpei cache do navegador (Ctrl+Shift+R)
- [ ] Executei diagnóstico completo no app
- [ ] Verifiquei logs do Supabase
- [ ] Testei a key manualmente
- [ ] Confirmei que tenho créditos no Apollo
- [ ] Tentei gerar nova key no Apollo

---

## 🚀 **PRÓXIMOS PASSOS:**

### **SE FUNCIONAR:**
```
✅ Parabéns! Agora você tem:
   - Acesso a dados REAIS do LinkedIn
   - 50 leads/mês (plano free)
   - Emails verificados
   - Perfis completos

DICA: Se quiser escalar, upgrade para Pro:
      - $49/mês = 10.000 leads
      - ROI: 1 venda paga o ano inteiro!
```

### **SE NÃO FUNCIONAR:**
```
❌ Me avise com:
   1. Screenshot do diagnóstico
   2. Logs do Supabase
   3. Resultado do teste manual
   4. Qual passo você está travado

Vou te ajudar a resolver! 🛠️
```

---

**🎯 RESUMO DE 1 MINUTO:**

```
PROBLEMA: Dados DEMO
CAUSA: Apollo não configurado

SOLUÇÃO RÁPIDA:
1. Supabase → Settings → Edge Functions → Secrets
2. Add Secret: APOLLO_API_KEY = R31HOQYiof3eK9B5uxqePA
3. Restart Edge Functions
4. Aguardar 3 minutos
5. Ctrl+Shift+R (limpar cache)
6. Testar busca de "CEO"
7. Verificar se retorna dados REAIS

TEMPO: 5 minutos
CUSTO: $0
RESULTADO: Leads REAIS!
```

---

**BOA SORTE! 🍀**

**Use o diagnóstico no app - ele vai te guiar passo a passo!**
