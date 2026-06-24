#!/bin/bash

echo "🚀 ImobHunter - Quick Deploy Script"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI não encontrado. Instalando..."
    npm install -g supabase
    echo ""
fi

# Login no Supabase (se necessário)
echo "🔐 Verificando autenticação..."
supabase login 2>/dev/null || true
echo ""

# Fazer deploy
echo "📦 Fazendo deploy do Edge Function 'server'..."
echo ""

supabase functions deploy server \
  --project-ref evdyqlrssgsktctjruuq \
  --no-verify-jwt

DEPLOY_STATUS=$?

echo ""

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo "✅ Deploy bem-sucedido!"
    echo ""
    echo "⏳ Aguardando 15 segundos para propagação..."
    sleep 15
    echo ""
    
    echo "🧪 Testando configuração das APIs..."
    echo ""
    
    RESPONSE=$(curl -s "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/debug/env-vars" \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw")
    
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    echo ""
    
    echo "═══════════════════════════════════════════════════════════"
    echo "✅ Deploy concluído com sucesso!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "📝 Próximos passos:"
    echo "  1. Abra o ImobHunter"
    echo "  2. Pressione Ctrl+Shift+T"
    echo "  3. Clique em 'Diagnóstico Completo'"
    echo "  4. Verifique se PDL e RocketReach estão ✅"
    echo ""
else
    echo "❌ Erro no deploy!"
    echo ""
    echo "Por favor, tente:"
    echo "  1. Verificar se você está na pasta correta do projeto"
    echo "  2. Executar: supabase link --project-ref evdyqlrssgsktctjruuq"
    echo "  3. Tentar novamente: ./quick-deploy.sh"
    echo ""
    echo "Ou siga as instruções em DEPLOY-INSTRUCTIONS.md"
    echo ""
fi
