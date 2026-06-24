#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🧪 IMOBHUNTER - TESTE DE AUTENTICAÇÃO SIMPLES
# ═══════════════════════════════════════════════════════════════════════

API_BASE="https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c"

echo "🚀 INICIANDO TESTES DE AUTENTICAÇÃO..."
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 1️⃣ TESTE DE HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════
echo "1️⃣ Testando Health Check..."
curl -s "$API_BASE/health" | python3 -m json.tool
echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 2️⃣ TESTE DE SIGNUP
# ═══════════════════════════════════════════════════════════════════════
echo "2️⃣ Testando Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_BASE/simple-auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@imobhunter.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }')

echo "$SIGNUP_RESPONSE" | python3 -m json.tool
echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 3️⃣ TESTE DE LOGIN
# ═══════════════════════════════════════════════════════════════════════
echo "3️⃣ Testando Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/simple-auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@imobhunter.com",
    "password": "senha123"
  }')

echo "$LOGIN_RESPONSE" | python3 -m json.tool

# Extrair token
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('session', {}).get('access_token', ''))" 2>/dev/null)

echo ""
echo "🔑 Token extraído: ${TOKEN:0:50}..."
echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════
# 4️⃣ TESTE DE /ME (com token)
# ═══════════════════════════════════════════════════════════════════════
if [ ! -z "$TOKEN" ]; then
  echo "4️⃣ Testando /me com token..."
  curl -s -X GET "$API_BASE/simple-auth/me" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
  echo ""
  echo ""
else
  echo "❌ Token não encontrado, pulando teste /me"
  echo ""
fi

# ═══════════════════════════════════════════════════════════════════════
# 5️⃣ TESTE DE LOGOUT
# ═══════════════════════════════════════════════════════════════════════
echo "5️⃣ Testando Logout..."
curl -s -X POST "$API_BASE/simple-auth/logout" \
  -H "Content-Type: application/json" | python3 -m json.tool
echo ""
echo ""

echo "✅ TESTES CONCLUÍDOS!"
