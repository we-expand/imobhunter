#!/bin/bash

echo "🚀 DEPLOY SERVIDOR CORRIGIDO - ImobHunter v9.0"
echo ""
echo "======================================================"
echo "Este script irá:"
echo "1. Copiar o servidor corrigido para o deploy"
echo "2. Fazer deploy no Supabase"
echo "3. Testar a conexão"
echo "======================================================"
echo ""

# Variáveis
DEPLOY_DIR=~/Desktop/imobhunter-deploy
SOURCE_DIR=~/Downloads/codigo_ImobHunter

# 1. Copiar arquivo corrigido
echo "📋 1. Copiando servidor corrigido..."
cp "$SOURCE_DIR/src/supabase/functions/server/index-FIXED.ts" "$DEPLOY_DIR/supabase/functions/server/index.ts"

if [ $? -eq 0 ]; then
  echo "✅ Arquivo copiado com sucesso!"
else
  echo "❌ Erro ao copiar arquivo"
  exit 1
fi

# 2. Navegar para pasta de deploy
cd "$DEPLOY_DIR" || exit 1

# 3. Fazer deploy
echo ""
echo "🚀 2. Fazendo deploy no Supabase..."
echo ""
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
else
  echo ""
  echo "❌ Erro no deploy"
  exit 1
fi

# 4. Testar servidor
echo ""
echo "🔍 3. Testando servidor..."
echo ""

PING_RESPONSE=$(curl -s "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping")

echo "Resposta do ping:"
echo "$PING_RESPONSE" | jq . 2>/dev/null || echo "$PING_RESPONSE"

echo ""
echo "======================================================"
echo "✅ DEPLOY FINALIZADO!"
echo ""
echo "Próximos passos:"
echo "1. Abra o ImobHunter no navegador"
echo "2. Faça uma busca por 'Cleber Couto'"
echo "3. Verifique os logs no console (F12)"
echo ""
echo "URLs importantes:"
echo "- Servidor: https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c"
echo "- Ping: https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping"
echo "======================================================"
