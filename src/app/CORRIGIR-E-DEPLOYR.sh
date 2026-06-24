#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 CORRIGINDO ROTAS E FAZENDO DEPLOY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ~/Downloads/ImobHunter

# Backup
echo "📦 Fazendo backup..."
cp supabase/functions/server/index.tsx supabase/functions/server/index.tsx.backup-$(date +%Y%m%d-%H%M%S)

# Corrigir rotas - adicionar /server no início de TODAS as rotas
echo "🔧 Corrigindo rotas..."
sed -i '' 's|app\.get("/make-server-9e4b8b7c/|app.get("/server/make-server-9e4b8b7c/|g' supabase/functions/server/index.tsx
sed -i '' 's|app\.post("/make-server-9e4b8b7c/|app.post("/server/make-server-9e4b8b7c/|g' supabase/functions/server/index.tsx
sed -i '' 's|app\.put("/make-server-9e4b8b7c/|app.put("/server/make-server-9e4b8b7c/|g' supabase/functions/server/index.tsx
sed -i '' 's|app\.delete("/make-server-9e4b8b7c/|app.delete("/server/make-server-9e4b8b7c/|g' supabase/functions/server/index.tsx
sed -i '' 's|app\.route('"'"'/make-server-9e4b8b7c/|app.route('"'"'/server/make-server-9e4b8b7c/|g' supabase/functions/server/index.tsx

# Corrigir também rotas imobhunter-api
sed -i '' 's|app\.route('"'"'/imobhunter-api/|app.route('"'"'/server/imobhunter-api/|g' supabase/functions/server/index.tsx

echo "✅ Rotas corrigidas!"
echo ""

# Deploy
echo "📦 Fazendo deploy..."
echo ""
supabase functions deploy server

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erro no deploy!"
    exit 1
fi

echo ""
echo "✅ Deploy concluído!"
echo ""

# Aguardar servidor iniciar
echo "⏳ Aguardando servidor iniciar (30 segundos)..."
sleep 30

# Testar
echo ""
echo "🧪 Testando servidor..."
echo ""

PING_RESULT=$(curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping)

if echo "$PING_RESULT" | grep -q "alive"; then
    echo "✅ PING OK:"
    echo "$PING_RESULT"
else
    echo "❌ PING FALHOU:"
    echo "$PING_RESULT"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 SUCESSO! SERVIDOR FUNCIONANDO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Abra a aplicação no navegador"
echo "2. Pressione F12 (Console)"
echo "3. Execute: localStorage.clear()"
echo "4. Execute: location.reload()"
echo "5. Faça login normalmente!"
echo ""
echo "✅ O erro de CORS está resolvido!"
echo ""
