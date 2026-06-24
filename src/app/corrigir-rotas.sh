#!/bin/bash

echo "🔧 Corrigindo rotas do servidor..."

cd ~/Downloads/ImobHunter

# Fazer backup
cp supabase/functions/server/index.tsx supabase/functions/server/index.tsx.backup

# Substituir todas as rotas /make-server por /server/make-server
sed -i '' 's|"/make-server-9e4b8b7c/|"/server/make-server-9e4b8b7c/|g' supabase/functions/server/index.tsx
sed -i '' "s|'/make-server-9e4b8b7c/|'/server/make-server-9e4b8b7c/|g" supabase/functions/server/index.tsx

# Também corrigir rotas de imobhunter-api
sed -i '' 's|"/imobhunter-api/|"/server/imobhunter-api/|g' supabase/functions/server/index.tsx
sed -i '' "s|'/imobhunter-api/|'/server/imobhunter-api/|g" supabase/functions/server/index.tsx

echo "✅ Rotas corrigidas!"
echo ""
echo "Verificando mudanças:"
grep -n "app.get\|app.post\|app.put\|app.delete\|app.route" supabase/functions/server/index.tsx | head -20

echo ""
echo "📦 Fazendo deploy..."
supabase functions deploy server

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🧪 Testando..."
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
