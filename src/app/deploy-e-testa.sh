#!/bin/bash

echo "🚀 ═══════════════════════════════════════════════════════"
echo "🚀 IMOBHUNTER - DEPLOY E TESTE AUTOMÁTICO"
echo "🚀 ═══════════════════════════════════════════════════════"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw"
BASE_URL="https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c"

# ═══════════════════════════════════════════════════════════
# 1. FAZER DEPLOY
# ═══════════════════════════════════════════════════════════
echo -e "${BLUE}📦 PASSO 1: DEPLOY DA FUNÇÃO${NC}"
echo "────────────────────────────────────────────────────────"

supabase functions deploy server

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro no deploy!${NC}"
    echo ""
    echo "Possíveis causas:"
    echo "  - Você não está logado no Supabase CLI"
    echo "  - Você não está no diretório correto"
    echo "  - Problemas de conexão"
    echo ""
    echo "Tente:"
    echo "  cd ~/Downloads/ImobHunter"
    echo "  supabase link --project-ref evdyqlrssgsktctjruuq"
    echo "  supabase functions deploy server"
    exit 1
fi

echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 2. AGUARDAR SERVIDOR INICIAR
# ═══════════════════════════════════════════════════════════
echo -e "${YELLOW}⏳ PASSO 2: AGUARDANDO SERVIDOR INICIAR (30s)${NC}"
echo "────────────────────────────────────────────────────────"

for i in {30..1}; do
    printf "\r   ${YELLOW}⏰ %2d segundos restantes...${NC}" $i
    sleep 1
done
echo ""
echo -e "${GREEN}✅ Aguarde concluído!${NC}"
echo ""

# ═══════════════════════════════════════════════════════════
# 3. TESTAR ROTAS
# ═══════════════════════════════════════════════════════════
echo -e "${BLUE}🧪 PASSO 3: TESTANDO ROTAS${NC}"
echo "────────────────────────────────────────────────────────"
echo ""

# Teste 1: PING
echo -e "${BLUE}🔍 Teste 1/4: Rota /ping${NC}"
PING_RESULT=$(curl -s -w "\n%{http_code}" "${BASE_URL}/ping")
HTTP_CODE=$(echo "$PING_RESULT" | tail -n1)
RESPONSE=$(echo "$PING_RESULT" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ Status: 200 OK${NC}"
    echo "   📊 Resposta: $RESPONSE"
else
    echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
    echo "   📊 Resposta: $RESPONSE"
    echo -e "   ${RED}   ERRO: Servidor não está respondendo na rota /ping${NC}"
fi
echo ""

# Teste 2: AUTH-TEST
echo -e "${BLUE}🔍 Teste 2/4: Rota /auth-test${NC}"
AUTH_TEST_RESULT=$(curl -s -w "\n%{http_code}" "${BASE_URL}/auth-test")
HTTP_CODE=$(echo "$AUTH_TEST_RESULT" | tail -n1)
RESPONSE=$(echo "$AUTH_TEST_RESULT" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ Status: 200 OK${NC}"
    echo "   📊 Resposta: $RESPONSE"
else
    echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
    echo "   📊 Resposta: $RESPONSE"
    echo -e "   ${RED}   ERRO: Rota de autenticação não encontrada${NC}"
fi
echo ""

# Teste 3: SIGNUP
echo -e "${BLUE}🔍 Teste 3/4: Rota /auth/signup (criar conta)${NC}"
RANDOM_EMAIL="teste-$(date +%s)@exemplo.com"
SIGNUP_RESULT=$(curl -s -w "\n%{http_code}" -X POST \
  "${BASE_URL}/auth/signup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"123456\",\"name\":\"Teste Usuario\"}")

HTTP_CODE=$(echo "$SIGNUP_RESULT" | tail -n1)
RESPONSE=$(echo "$SIGNUP_RESULT" | head -n-1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ Status: $HTTP_CODE OK${NC}"
    echo "   📧 Email criado: $RANDOM_EMAIL"
    echo "   📊 Resposta: $RESPONSE"
    SIGNUP_SUCCESS=true
else
    echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
    echo "   📊 Resposta: $RESPONSE"
    echo -e "   ${RED}   ERRO: Não foi possível criar conta${NC}"
    SIGNUP_SUCCESS=false
fi
echo ""

# Teste 4: LOGIN (só se signup funcionou)
if [ "$SIGNUP_SUCCESS" = true ]; then
    echo -e "${BLUE}🔍 Teste 4/4: Rota /auth/login${NC}"
    LOGIN_RESULT=$(curl -s -w "\n%{http_code}" -X POST \
      "${BASE_URL}/auth/login" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{\"email\":\"$RANDOM_EMAIL\",\"password\":\"123456\"}")

    HTTP_CODE=$(echo "$LOGIN_RESULT" | tail -n1)
    RESPONSE=$(echo "$LOGIN_RESULT" | head -n-1)

    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "   ${GREEN}✅ Status: 200 OK${NC}"
        echo "   📊 Resposta: $RESPONSE"
    else
        echo -e "   ${RED}❌ Status: $HTTP_CODE${NC}"
        echo "   📊 Resposta: $RESPONSE"
        echo -e "   ${RED}   ERRO: Login falhou${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Teste 4/4: PULADO (signup falhou)${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════
# 4. RESUMO FINAL
# ═══════════════════════════════════════════════════════════
echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 TESTES CONCLUÍDOS!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Se TODOS os testes passaram (✅):"
echo "   → Abra o navegador"
echo "   → Pressione F12 (Console)"
echo "   → Execute: clearOldSessions()"
echo "   → Execute: window.location.reload()"
echo "   → Tente fazer login na interface"
echo ""
echo "2. Se ALGUM teste falhou (❌):"
echo "   → Veja os logs: supabase functions logs server"
echo "   → Compartilhe a saída deste script comigo"
echo ""
echo "3. Para ver logs em tempo real:"
echo "   → supabase functions logs server --follow"
echo ""
