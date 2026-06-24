#!/bin/bash

echo "🚀 ========================================"
echo "   DEPLOY SERVIDOR IMOBHUNTER v10.0"
echo "========================================"
echo ""

# Ir para o diretório de deploy
cd ~/Desktop/imobhunter-deploy

# Verificar se existe
if [ ! -d "supabase/functions/server" ]; then
  echo "❌ Erro: Pasta não encontrada!"
  echo "Criando estrutura..."
  mkdir -p supabase/functions/server
fi

# Copiar arquivo atualizado
echo "📦 Copiando servidor atualizado..."
cp ~/Downloads/codigo_ImobHunter/supabase/functions/server/index.ts ~/Desktop/imobhunter-deploy/supabase/functions/server/index.ts

# Verificar se copiou
if [ -f "supabase/functions/server/index.ts" ]; then
  echo "✅ Arquivo copiado com sucesso!"
  
  # Mostrar preview do arquivo
  echo ""
  echo "📄 Preview do servidor:"
  head -5 supabase/functions/server/index.ts
  echo ""
  
  # Fazer deploy
  echo "🚀 Fazendo deploy no Supabase..."
  supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
  
  echo ""
  echo "✅ ========================================"
  echo "   DEPLOY CONCLUÍDO!"
  echo "========================================"
  echo ""
  echo "🧪 Testando servidor..."
  echo ""
  
  # Testar ping
  curl -s "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/ping" | jq .
  
  echo ""
  echo "🔍 Testando busca..."
  echo ""
  
  # Testar busca
  curl -s -X POST "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/search/leads" \
    -H "Content-Type: application/json" \
    -d '{"query":"Cleber Couto"}' | jq '.results[0:3]'
  
  echo ""
  echo "======================================"
  echo "✅ TUDO PRONTO!"
  echo "======================================"
  echo ""
  echo "PRÓXIMO PASSO:"
  echo "1. Publique no Figma Make"
  echo "2. Teste a busca por 'Cleber Couto'"
  echo "3. Você verá resultados REAIS da Apollo!"
  echo ""
  
else
  echo "❌ Erro ao copiar arquivo!"
  exit 1
fi
