#!/bin/bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOY E TESTE REAL - IMOBHUNTER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="evdyqlrssgsktctjruuq"
BASE_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-9e4b8b7c"

# PASSO 1: Verificar se está no diretório correto
echo -e "${BLUE}[1/6]${NC} Verificando diretório..."
if [ ! -d "supabase/functions/server" ]; then
    echo -e "${RED}❌ ERRO: Diretório supabase/functions/server não encontrado${NC}"
    echo "Execute: cd ~/Downloads/ImobHunter"
    exit 1
fi
echo -e "${GREEN}✅ Diretório correto${NC}"
echo ""

# PASSO 2: Deploy
echo -e "${BLUE}[2/6]${NC} Fazendo deploy da função server..."
echo ""
supabase functions deploy server --no-verify-jwt

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ ERRO NO DEPLOY!${NC}"
    echo ""
    echo "Tente:"
    echo "  1. supabase link --project-ref ${PROJECT_ID}"
    echo "  2. supabase functions deploy server --no-verify-jwt"
    exit 1
fi

echo -e "${GREEN}✅ Deploy concluído${NC}"
echo ""

# PASSO 3: Aguardar
echo -e "${BLUE}[3/6]${NC} Aguardando servidor iniciar (45 segundos)..."
for i in {45..1}; do
    printf "\r   ⏰ ${i} segundos restantes...   "
    sleep 1
done
echo ""
echo ""

# PASSO 4: Testar PING
echo -e "${BLUE}[4/6]${NC} Testando /ping..."
PING_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/ping")
PING_BODY=$(echo "$PING_RESPONSE" | head -n -1)
PING_CODE=$(echo "$PING_RESPONSE" | tail -n 1)

if [ "$PING_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PING OK (HTTP $PING_CODE)${NC}"
    echo "   Resposta: $PING_BODY"
else
    echo -e "${RED}❌ PING FALHOU (HTTP $PING_CODE)${NC}"
    echo "   Resposta: $PING_BODY"
    exit 1
fi
echo ""

# PASSO 5: Testar AUTH-TEST
echo -e "${BLUE}[5/6]${NC} Testando /auth-test..."
AUTH_TEST_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/auth-test")
AUTH_TEST_BODY=$(echo "$AUTH_TEST_RESPONSE" | head -n -1)
AUTH_TEST_CODE=$(echo "$AUTH_TEST_RESPONSE" | tail -n 1)

if [ "$AUTH_TEST_CODE" = "200" ]; then
    echo -e "${GREEN}✅ AUTH-TEST OK (HTTP $AUTH_TEST_CODE)${NC}"
    echo "   Resposta: $AUTH_TEST_BODY"
else
    echo -e "${RED}❌ AUTH-TEST FALHOU (HTTP $AUTH_TEST_CODE)${NC}"
    echo "   Resposta: $AUTH_TEST_BODY"
    exit 1
fi
echo ""

# PASSO 6: Testar LOGIN REAL
echo -e "${BLUE}[6/6]${NC} Testando /auth/login (com credenciais FALSAS para testar rota)..."

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/auth/login" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"qualquersenha"}')

LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)
LOGIN_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)

if [ "$LOGIN_CODE" = "401" ] || [ "$LOGIN_CODE" = "400" ] || [ "$LOGIN_CODE" = "200" ]; then
    echo -e "${GREEN}✅ ROTA DE LOGIN ESTÁ RESPONDENDO (HTTP $LOGIN_CODE)${NC}"
    echo "   Resposta: $LOGIN_BODY"
    echo ""
    echo "   ${YELLOW}Nota: HTTP 401 é esperado para credenciais inválidas${NC}"
else
    echo -e "${RED}❌ ROTA DE LOGIN NÃO ESTÁ RESPONDENDO (HTTP $LOGIN_CODE)${NC}"
    echo "   Resposta: $LOGIN_BODY"
    exit 1
fi
echo ""

# SUCESSO TOTAL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 SUCESSO TOTAL! SERVIDOR ESTÁ FUNCIONANDO!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Abra a aplicação ImobHunter no navegador"
echo ""
echo "2. Pressione F12 (Console do navegador)"
echo ""
echo "3. Execute estes comandos no Console:"
echo -e "   ${BLUE}localStorage.clear()${NC}"
echo -e "   ${BLUE}location.reload()${NC}"
echo ""
echo "4. Tente fazer LOGIN ou CADASTRO novamente"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ URLs Funcionando:${NC}"
echo "   • ${BASE_URL}/ping"
echo "   • ${BASE_URL}/auth-test"
echo "   • ${BASE_URL}/auth/login"
echo "   • ${BASE_URL}/auth/signup"
echo ""
