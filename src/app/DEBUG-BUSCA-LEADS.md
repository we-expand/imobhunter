# 🔍 DEBUG: Busca de Leads não está Funcionando

## **📊 CHECKLIST DE DIAGNÓSTICO**

Siga este guia passo a passo para identificar e resolver o problema.

---

## **PASSO 1: Verificar se as API Keys estão configuradas**

### ✅ Teste no Diagnóstico de APIs

1. Vá em: **Configurações** → Aba **"Segurança"**
2. Role até a seção **"Diagnóstico de API Keys"** (fundo amarelo/laranja)
3. Clique em **"Verificar Status das APIs"**
4. Veja quais APIs estão:
   - ✅ **Verde**: Configurada e funcionando
   - ⚠️ **Amarelo**: Configurada mas inválida
   - ❌ **Vermelho**: Não configurada

**RESULTADO ESPERADO:**
- Pelo menos **1 API deve estar verde** (Apollo, Hunter, PDL, RocketReach ou Clearbit)
- Se TODAS estiverem vermelhas = **problema identificado** ⬇️

---

## **PASSO 2: Ver os Logs do Servidor (IMPORTANTÍSSIMO)**

### 🖥️ Abrir Console do Supabase

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em **"Edge Functions"**
4. Clique na função **"make-server-9e4b8b7c"** ou **"server"**
5. Clique na aba **"Logs"** (ou "Invocations")
6. Deixe esta tela ABERTA

### 🔍 Fazer uma Busca de Teste

1. Volte para a plataforma
2. Vá em **Busca de Leads** → **LinkedIn Sales Navigator**
3. Preencha APENAS UM filtro simples:
   - **Cargo Atual:** "CEO" ou "Founder" ou "Director"
4. Clique em **"Buscar Leads"**
5. **VOLTE IMEDIATAMENTE** para a tela de Logs do Supabase

### 📝 Analisar os Logs

Você deve ver algo como:

```
═══════════════════════════════════════════════
🔍 BUSCA DE PESSOAS - INICIADA
═══════════════════════════════════════════════
📋 Parâmetros recebidos: {...}

🔑 Status das API Keys:
   Apollo.io:     ✅ Configurada
   Hunter.io:     ❌ NÃO configurada
   PDL:           ❌ NÃO configurada
   RocketReach:   ❌ NÃO configurada

📡 Buscando no Apollo.io...
✅ Apollo.io: 15 resultados
```

**CENÁRIOS POSSÍVEIS:**

#### ❌ Cenário 1: NENHUMA API Configurada
```
🔑 Status das API Keys:
   Apollo.io:     ❌ NÃO configurada
   Hunter.io:     ❌ NÃO configurada
   PDL:           ❌ NÃO configurada
   RocketReach:   ❌ NÃO configurada
```

**SOLUÇÃO:** Configure pelo menos 1 API key ⬇️ (vá para PASSO 3)

---

#### ❌ Cenário 2: API Configurada mas COM ERRO
```
📡 Buscando no Apollo.io...
❌ Erro no Apollo.io: 401 Unauthorized
```

**SOLUÇÃO:** API key inválida ou expirada ⬇️ (vá para PASSO 3)

---

#### ✅ Cenário 3: API Funcionando mas SEM RESULTADOS
```
✅ Apollo.io: 0 resultados
```

**SOLUÇÃO:** Os filtros estão muito restritivos ⬇️ (vá para PASSO 4)

---

#### ❌ Cenário 4: NÃO APARECE NADA nos Logs
**SOLUÇÃO:** A requisição nem está chegando no servidor ⬇️ (vá para PASSO 5)

---

## **PASSO 3: Configurar API Keys (se necessário)**

Se o diagnóstico mostrou que nenhuma API está configurada:

### 🔑 Opção A: Apollo.io (RECOMENDADO - Melhor para B2B)

1. Crie conta grátis em: https://app.apollo.io/
2. Vá em **Settings** → **API**
3. Copie a **API Key**
4. Me forneça a key aqui no chat

**Plano Grátis Apollo.io:**
- ✅ 50 créditos/mês
- ✅ Busca de pessoas
- ✅ Emails verificados
- ✅ Dados de empresa

---

### 🔑 Opção B: Hunter.io (Bom para Emails)

1. Crie conta grátis em: https://hunter.io/
2. Vá em **API** → **API Keys**
3. Copie a key
4. Me forneça aqui

**Plano Grátis Hunter.io:**
- ✅ 25 buscas/mês
- ✅ Verificação de email
- ✅ Domain search

---

### 🔑 Opção C: People Data Labs

1. Crie conta em: https://www.peopledatalabs.com/
2. Obtenha API key
3. Me forneça

---

## **PASSO 4: Ajustar Filtros de Busca**

Se as APIs estão funcionando mas não retornam resultados:

### ✅ Busca CORRETA (Ampla)
```
Cargo Atual: CEO
```
ou
```
Empresa: Microsoft
```
ou
```
Localização: Portugal
```

### ❌ Busca INCORRETA (Muito Restritiva)
```
Nome: João
Sobrenome: Silva
Cargo: CEO
Empresa: Empresa XYZ Ltda
Cidade: Vila Nova de Gaia
Indústria: Real Estate
```

**REGRA DE OURO:**
- Use **1 a 3 filtros no máximo**
- Comece com filtros amplos
- Vá refinando aos poucos

---

## **PASSO 5: Verificar Console do Navegador**

1. Abra o **DevTools** do navegador:
   - Chrome/Edge: `F12` ou `Ctrl+Shift+I`
   - Firefox: `F12`
   - Safari: `Cmd+Option+I`

2. Vá na aba **"Console"**

3. Faça uma busca de teste

4. Procure por mensagens como:
```
═══════════════════════════════════════════════
🔍 BUSCA AVANÇADA LINKEDIN SALES NAVIGATOR
═══════════════════════════════════════════════
📋 Filtros atuais: {...}
📡 URL da API: https://...
📡 Payload enviado: {...}
📡 Status da resposta: 200
✅ Dados recebidos do servidor: {...}
```

**CENÁRIOS:**

#### ❌ Erro de CORS
```
Access to fetch at 'https://...' from origin '...' has been blocked by CORS
```
**SOLUÇÃO:** Problema no servidor Supabase (raro, me avise)

---

#### ❌ Erro 500
```
❌ Erro na resposta da API: 500 Internal Server Error
```
**SOLUÇÃO:** Erro no servidor, veja os Logs do Supabase (PASSO 2)

---

#### ❌ Erro 404
```
❌ Erro na resposta da API: 404 Not Found
```
**SOLUÇÃO:** Rota não encontrada (me avise imediatamente)

---

## **PASSO 6: Teste com Dados REAIS**

Faça um teste com dados que você TEM CERTEZA que existem:

### ✅ Exemplo 1: Buscar CEOs da Microsoft
```
Cargo Atual: CEO
Empresa Atual: Microsoft
```

### ✅ Exemplo 2: Buscar pessoas em Portugal
```
País: Portugal
Cargo Atual: Director
```

### ✅ Exemplo 3: Buscar por indústria
```
Indústria: Technology
```

---

## **PASSO 7: Me Envie os Resultados**

Por favor, me envie:

1. ✅ **Screenshot do Diagnóstico de APIs** (da aba Segurança)
2. ✅ **Screenshot dos Logs do Supabase** (após fazer uma busca)
3. ✅ **Screenshot do Console do Navegador** (mensagens de erro, se houver)
4. ✅ **Quais filtros você usou na busca**

---

## **🔥 SOLUÇÃO RÁPIDA (Teste Imediato)**

Se você quer testar AGORA mesmo sem API keys:

### Busca de Fallback (Mock Data)

O sistema já tem **fallback automático** que retorna dados DEMO se as APIs não estiverem configuradas.

**MAS** você precisa me dizer:
- ❓ A busca retorna **"Nenhum resultado encontrado"**?
- ❓ Ou retorna **dados DEMO** (leads fictícios para teste)?

Se retornar "Nenhum resultado encontrado" mesmo sem APIs = há um bug que preciso corrigir.

---

## **📞 PRÓXIMOS PASSOS**

Faça o teste acima e me diga:

1. Qual foi o resultado do **Diagnóstico de APIs** (PASSO 1)?
2. O que apareceu nos **Logs do Supabase** (PASSO 2)?
3. Qual **erro** apareceu no Console do navegador (PASSO 5)?

Com essas informações, vou conseguir identificar EXATAMENTE o problema! 🎯
