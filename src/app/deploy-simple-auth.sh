#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 IMOBHUNTER - DEPLOY DO NOVO SISTEMA DE AUTH
# ═══════════════════════════════════════════════════════════════════════

PROJECT_DIR="$HOME/Downloads/ImobHunter"

echo "🚀 INICIANDO DEPLOY DO NOVO SISTEMA DE AUTENTICAÇÃO..."
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 1️⃣ COPIAR ARQUIVO NOVO PARA O DIRETÓRIO LOCAL
# ═══════════════════════════════════════════════════════════════════════
echo "1️⃣ Copiando simple-auth.ts para diretório local..."

# Criar diretório se não existir
mkdir -p "$PROJECT_DIR/supabase/functions/server"

# Copiar arquivo (você precisa copiar manualmente ou usar o comando abaixo)
echo "   ℹ️  Certifique-se de que simple-auth.ts está em:"
echo "   $PROJECT_DIR/supabase/functions/server/simple-auth.ts"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 2️⃣ FAZER DEPLOY
# ═══════════════════════════════════════════════════════════════════════
echo "2️⃣ Fazendo deploy da função server..."
cd "$PROJECT_DIR"

supabase functions deploy server --project-ref evdyqlrssgsktctjruuq

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deploy concluído com sucesso!"
  echo ""
else
  echo ""
  echo "❌ Erro no deploy!"
  exit 1
fi

# ═══════════════════════════════════════════════════════════════════════
# 3️⃣ TESTAR ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════
echo "3️⃣ Testando endpoints..."
echo ""

sleep 3

echo "🔍 Testando /health..."
curl -s "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/health"
echo ""
echo ""

echo "🔍 Testando /simple-auth/login (sem credenciais)..."
curl -s -X POST "https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/simple-auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"teste"}'
echo ""
echo ""

echo "✅ DEPLOY E TESTES CONCLUÍDOS!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Execute: bash test-auth.sh"
echo "   2. Acesse o frontend e teste o login"
echo ""
