# 🧪 Guia de Teste de APIs - ImobHunter

## ✅ O Que Foi Criado

Criei um **Painel de Diagnóstico de APIs** completo que permite testar todas as integrações do ImobHunter de forma visual, sem precisar usar o terminal.

---

## 🚀 Como Acessar o Painel de Testes

### Método 1: Tecla de Atalho (Recomendado)

1. Abra a aplicação no navegador: `http://localhost:3000`
2. Na Landing Page, pressione: **`Ctrl + Shift + T`** (Windows/Linux) ou **`Cmd + Shift + T`** (Mac)
3. Um botão flutuante 🧪 **"Painel de Testes"** aparecerá no canto inferior direito
4. Clique no botão para abrir o painel de diagnóstico

### Método 2: Via URL Direta

Atualmente o painel está acessível apenas via o botão flutuante. Para ter acesso direto, você pode adicionar `/api-test` à URL (requer implementação de roteamento).

---

## 🔧 Funcionalidades do Painel

O painel possui 4 botões principais:

### 1️⃣ **Testar Servidor**
- Verifica se a Edge Function está online
- URL testada: `/server/make-server-9e4b8b7c/health`
- Resultado: ✅ Online ou ❌ Offline

### 2️⃣ **Verificar API Keys**
- Verifica quais API keys estão configuradas no Supabase
- APIs verificadas:
  - ✅ Apollo.io
  - ✅ Proxycurl (LinkedIn)
  - ⚠️ Hunter.io (opcional)
  - ⚠️ PDL (opcional)
- Mostra preview das keys (primeiros 10 caracteres)

### 3️⃣ **Testar Busca Real**
- Executa uma busca real de teste
- Query: "real estate agent" em "Porto, Portugal"
- Retorna resultados de:
  - Apollo.io
  - LinkedIn (Proxycurl)
  - IA Merged (resultados combinados)

### 4️⃣ **Diagnóstico Completo**
- Executa todos os testes acima em sequência
- Ideal para validação completa do sistema

---

## 📋 Passo a Passo: Configurar API Keys

### Problema Atual
Você está recebendo "Nenhuma API key configurada" porque faltam:
- `APOLLO_API_KEY` ✅ (você já tem esta)
- `PROXYCURL_API_KEY` ❌ (precisa adicionar)

### Solução

#### 1. Obter API Key do Proxycurl

1. Acesse: https://nubela.co/proxycurl/
2. Crie uma conta gratuita
3. Faça login e vá para o Dashboard: https://nubela.co/proxycurl/dashboard
4. Copie sua API key (algo como: `abc123xyz...`)

#### 2. Adicionar no Supabase

1. Acesse o dashboard do Supabase:
   ```
   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/functions
   ```

2. Vá para a aba **"Secrets"** ou **"Environment Variables"**

3. Adicione a secret:
   ```
   Name: PROXYCURL_API_KEY
   Value: [Cole sua API key do Proxycurl aqui]
   ```

4. Salve e aguarde ~30 segundos

#### 3. Verificar se Funcionou

1. Volte para o **Painel de Testes**
2. Clique em **"Verificar API Keys"**
3. Deve mostrar:
   - ✅ Apollo.io: Configurada
   - ✅ Proxycurl (LinkedIn): Configurada

4. Agora clique em **"Testar Busca Real"**
5. Deve retornar leads reais! 🎉

---

## 🐛 Troubleshooting

### Problema: "Servidor retornou erro"
**Solução**: A Edge Function pode não estar implantada ou está com erro.
- Verifique os logs no Supabase Dashboard
- Faça redeploy da função se necessário

### Problema: "Não foi possível conectar ao servidor"
**Solução**: Verifique a URL do projeto:
- Project ID: `evdyqlrssgsktctjruuq`
- URL deve ser: `https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/...`

### Problema: "APIs não configuradas"
**Solução**: 
1. Verifique se adicionou as secrets no Supabase
2. Aguarde ~30 segundos após adicionar
3. Reinicie a Edge Function se necessário
4. Teste novamente

### Problema: "API key com formato inválido"
**Solução**:
- Apollo.io: A key deve começar com letras/números
- Proxycurl: A key geralmente é longa (~40+ caracteres)
- Verifique se copiou a key completa (sem espaços)

---

## 📊 Resultados Esperados

Após configurar tudo corretamente, você deve ver:

```
✅ Status do Servidor: Online
✅ Apollo.io: Configurada (40 chars)
✅ Proxycurl (LinkedIn): Configurada (42 chars)

Resultados da Busca:
✅ Apollo.io: 3 resultados
✅ LinkedIn (Proxycurl): 2 resultados
✅ IA Merged (Best Results): 5 resultados
```

---

## 🎯 Comandos via Terminal (Alternativa)

Se preferir testar via terminal, use:

### Testar Servidor
```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/health
```

### Verificar API Keys
```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/debug/env-vars
```

### Testar Busca Real
```bash
curl -X POST https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/advanced-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNTg3MDcsImV4cCI6MjA0OTkzNDcwN30.lNQTIpEqNZ4o_K7cFHtCPYJPDyH0RDmjpXh8b9BnlW0" \
  -d '{
    "searchType": "people",
    "filters": {
      "query": "real estate agent",
      "location": "Porto, Portugal",
      "maxResults": 3
    }
  }'
```

---

## 📌 Próximos Passos

1. ✅ Configure a `PROXYCURL_API_KEY` no Supabase
2. ✅ Teste usando o Painel de Diagnóstico
3. ✅ Verifique se os leads estão sendo retornados
4. 🚀 Comece a usar o sistema real!

---

## 💡 Dicas

- **Mantenha as API keys seguras**: Nunca compartilhe ou exponha no código
- **Monitore os limites**: Apollo e Proxycurl têm limites de chamadas por mês
- **Use o painel regularmente**: Valide as integrações após mudanças
- **Tecla secreta**: `Ctrl+Shift+T` para mostrar/ocultar o botão de testes

---

**Criado com ❤️ para o ImobHunter**
_Versão 1.0 - Dezembro 2024_
