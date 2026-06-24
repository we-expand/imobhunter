# 🔧 Troubleshooting - Erro HTTP 503 "BOOT_ERROR"

## 🚨 Problema

Ao tentar salvar a API key do Apollo, o sistema retorna:

```
Erro HTTP 503
Code: "BOOT_ERROR"
message: "Function failed to start (release check vgs)?"
```

---

## 🔍 O Que Significa?

**HTTP 503** = Serviço Indisponível  
**BOOT_ERROR** = O servidor Supabase Edge Function não conseguiu **iniciar**

Isso **NÃO** é um erro na sua API key! O servidor está falhando ao carregar os módulos antes mesmo de processar sua requisição.

---

## 🛠️ Diagnóstico Implementado

Adicionamos logs detalhados em **TODOS os imports** do servidor:

```typescript
[BOOT] 1/13 - Importando Hono...
[BOOT] 2/13 - Importando CORS...
[BOOT] 3/13 - Importando Logger...
[BOOT] 4/13 - Importando KV Store...
[BOOT] 5/13 - Importando Supabase Client...
[BOOT] 6/13 - Importando Search Routes...
[BOOT] 7/13 - Importando LinkedIn Routes...
[BOOT] 8/13 - Importando LinkedIn Auth Routes...
[BOOT] 9/13 - Importando Diagnostics Routes...
[BOOT] 10/13 - Importando Excel Import Routes...
[BOOT] 11/13 - Importando AI Feedback Routes...
[BOOT] 12/13 - Importando Intelligent Search...
[BOOT] 13/13 - Importando Leads Database...
[BOOT] ✅ Todos os imports concluídos!
```

E também no `search-routes.ts`:

```typescript
[search-routes] Iniciando imports...
[search-routes] ✅ Hono importado
[search-routes] ✅ web-search-service importado
[search-routes] ✅ demo-leads-generator importado
[search-routes] ✅ kv_store importado
[search-routes] Criando app Hono...
[search-routes] ✅ App criado, configurando rotas...
✅ search-routes.ts carregado com sucesso!
```

---

## 🔎 Como Diagnosticar

### **Passo 1: Acesse os logs do Supabase**

1. Vá em **Supabase Dashboard**
2. Clique em **Edge Functions**
3. Selecione **make-server-9e4b8b7c**
4. Clique em **Logs** (aba superior)

### **Passo 2: Identifique onde travou**

Procure pela última linha de log antes do erro:

#### **Cenário A - Travou no início:**
```
[BOOT] 1/13 - Importando Hono...
[BOOT] 2/13 - Importando CORS...
[BOOT] 3/13 - Importando Logger...
❌ ERRO
```
**Problema:** Dependências npm não estão carregando  
**Solução:** Problema com o Deno/Supabase (fora do nosso controle)

#### **Cenário B - Travou no search-routes:**
```
[BOOT] 6/13 - Importando Search Routes...
[search-routes] Iniciando imports...
[search-routes] ✅ Hono importado
[search-routes] ✅ web-search-service importado
❌ ERRO
```
**Problema:** Erro no `demo-leads-generator.ts` ou `kv_store.tsx`  
**Solução:** Verificar esses arquivos

#### **Cenário C - Carregou tudo mas falhou depois:**
```
[BOOT] ✅ Todos os imports concluídos!
🚀 Servidor iniciando...
❌ ERRO
```
**Problema:** Erro na configuração inicial do Hono  
**Solução:** Verificar configuração de rotas

---

## ✅ Correções Já Implementadas

### **1. Tipo explícito no array results**
```typescript
// ❌ ANTES (podia causar erro em Deno strict)
const results = [];

// ✅ AGORA
const results: any[] = [];
```

### **2. Logs de diagnóstico**
Todos os módulos agora logam quando são carregados, permitindo identificar exatamente onde o erro ocorre.

### **3. Tratamento robusto de erros**
Todas as rotas têm try/catch com logs detalhados.

---

## 🧪 Teste Manual

Se o problema persistir, podemos criar uma **versão minimalista** do servidor para isolar o problema:

```typescript
// index-minimal.tsx
import { Hono } from "npm:hono";

console.log('✅ Servidor minimalista iniciando...');

const app = new Hono();

app.get('/make-server-9e4b8b7c/health', (c) => {
  return c.json({ status: 'ok', message: 'Servidor funcionando!' });
});

console.log('✅ Rota /health configurada');

Deno.serve(app.fetch);

console.log('✅ Servidor iniciado com sucesso!');
```

Se isso funcionar, significa que o problema está em um dos módulos específicos.

---

## 🔄 Próximos Passos

1. **Aguarde o servidor reiniciar** (Supabase faz deploy automático)
2. **Tente salvar a API key novamente**
3. **Copie os logs** do Console (F12) ou Supabase Dashboard
4. **Identifique onde travou** usando os logs `[BOOT]`

---

## 📞 O Que Fazer Se Persistir?

1. **Copie os logs completos** do Supabase Dashboard
2. **Tire um print** do erro HTTP 503
3. **Informe qual foi a última linha de log** antes do erro

Isso vai permitir identificar exatamente qual módulo está causando o problema!

---

**Status Atual:**  
✅ Logs de diagnóstico implementados  
🔄 Aguardando próximo teste para identificar módulo problemático

---

**Última atualização:** Dezembro 2024
