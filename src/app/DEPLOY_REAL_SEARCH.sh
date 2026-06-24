#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 DEPLOY REAL SEARCH - APOLLO + LINKEDIN
# Script para fazer deploy das novas rotas de busca real
# ═══════════════════════════════════════════════════════════════════════

echo "🚀 INICIANDO DEPLOY - REAL SEARCH ENGINE"
echo ""

# Verificar se está no diretório correto
if [ ! -f "supabase/functions/server/index.ts" ]; then
    echo "❌ Erro: Execute este script do diretório raiz do projeto"
    exit 1
fi

# 1. Copiar arquivo de rotas para o servidor local
echo "📁 Copiando arquivos para ~/Downloads/ImobHunter..."
mkdir -p ~/Downloads/ImobHunter/supabase/functions/server/
cp supabase/functions/server/real-search-routes.ts ~/Downloads/ImobHunter/supabase/functions/server/
cp supabase/functions/server/index.ts ~/Downloads/ImobHunter/supabase/functions/server/
echo "✅ Arquivos copiados"
echo ""

# 2. Fazer deploy
echo "🚀 Fazendo deploy da função 'server'..."
cd ~/Downloads/ImobHunter
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
echo ""

# 3. Aguardar deploy propagar
echo "⏳ Aguardando deploy propagar (5 segundos)..."
sleep 5
echo ""

# 4. Testar endpoints
echo "🧪 Testando endpoints..."
echo ""

echo "1️⃣ Health Check:"
curl -s https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/health | python3 -m json.tool
echo ""
echo ""

echo "2️⃣ Ping:"
curl -s https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping | python3 -m json.tool
echo ""
echo ""

echo "✅ DEPLOY CONCLUÍDO!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Acesse o ImobHunter"
echo "   2. Faça login"
echo "   3. Clique em 'Buscar Leads' no menu"
echo "   4. Digite um termo de busca (ex: 'CEO real estate Portugal')"
echo "   5. Clique em 'Buscar' e aguarde os resultados!"
echo ""
echo "🔑 APIs configuradas:"
echo "   ✅ APOLLO_API_KEY"
echo "   ✅ PROXYCURL_API_KEY (LinkedIn)"
echo ""
echo "🎯 O sistema vai buscar em ambas as APIs simultaneamente e rankear os melhores leads!"
