# 🚀 INSTRUÇÕES DE DEPLOY - CORREÇÃO DE CORS

## ❗ IMPORTANTE: O servidor precisa ser deployado para funcionar

O código já foi corrigido nos arquivos, mas as mudanças ainda não estão no servidor ativo.

## 📋 Como fazer o deploy:

### Opção 1: Via CLI (Recomendado)

```bash
# 1. Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# 2. Login no Supabase
supabase login

# 3. Link com seu projeto
supabase link --project-ref evdyqlrssgsktctjruuq

# 4. Deploy da função
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq

# 5. Aguardar ~30 segundos para o deploy completar

# 6. Testar
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

### Opção 2: Via Dashboard Supabase

1. Acesse: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
2. Clique na função `server`
3. Clique em "Deploy New Version"
4. Cole todo o conteúdo de `/supabase/functions/server/index.tsx`
5. Clique em "Deploy"

### Opção 3: Via API

```bash
# Fazer upload do arquivo
curl -L -X POST \
  'https://api.supabase.com/v1/projects/evdyqlrssgsktctjruuq/functions/server/deploy' \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "verify_jwt": false
  }'
```

## ✅ Verificar se o deploy funcionou:

```bash
# Teste 1: Ping
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping

# Teste 2: CORS Preflight
curl -X OPTIONS \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/proxycurl/search \
  -H "Origin: https://bring-aroma-99987345.figma.site" \
  -H "Access-Control-Request-Method: POST" \
  -i

# Deve retornar HTTP 204 ou 200 com headers CORS
```

## 🔍 Depois do deploy:

1. Aguarde 30 segundos
2. Recarregue a aplicação (Ctrl+Shift+R)
3. Faça uma busca
4. Agora deve funcionar com dados REAIS! ✅

---

## ⚠️ NÃO CONSEGUE FAZER DEPLOY AGORA?

Se não puder fazer deploy imediatamente, a aplicação continuará usando **dados mockados de demonstração**.

As buscas funcionarão normalmente, mas mostrando dados simulados ao invés de dados reais das APIs.

Para obter dados REAIS, o deploy é **obrigatório**.
