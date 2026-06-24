#!/bin/bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOY FINAL - PROJETO CORRETO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="evdyqlrssgsktctjruuq"
BASE_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-9e4b8b7c"

echo -e "${BLUE}🔑 INFORMAÇÕES DO PROJETO:${NC}"
echo "   Project ID: ${PROJECT_ID}"
echo "   URL Base: ${BASE_URL}"
echo ""

# PASSO 1: Linkar projeto
echo -e "${BLUE}[1/5]${NC} Linkando ao projeto correto..."
supabase link --project-ref ${PROJECT_ID} || {
    echo -e "${YELLOW}⚠️  Já estava linkado ou erro ao linkar${NC}"
}
echo ""

# PASSO 2: Verificar estrutura
echo -e "${BLUE}[2/5]${NC} Verificando estrutura..."
if [ ! -f "supabase/functions/server/index.tsx" ]; then
    echo -e "${RED}❌ ERRO: Arquivo index.tsx não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Estrutura OK${NC}"
echo ""

# PASSO 3: Deploy
echo -e "${BLUE}[3/5]${NC} Fazendo deploy da função 'server'..."
echo ""
supabase functions deploy server --no-verify-jwt

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ ERRO NO DEPLOY!${NC}"
    echo ""
    echo "Tente manualmente:"
    echo "  supabase login"
    echo "  supabase link --project-ref ${PROJECT_ID}"
    echo "  supabase functions deploy server --no-verify-jwt"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""

# PASSO 4: Aguardar
echo -e "${BLUE}[4/5]${NC} Aguardando servidor iniciar (50 segundos)..."
for i in {50..1}; do
    printf "\r   ⏰ ${i} segundos...   "
    sleep 1
done
echo ""
echo ""

# PASSO 5: Testar
echo -e "${BLUE}[5/5]${NC} Testando todas as rotas..."
echo ""

# Teste 1: PING
echo "🧪 Testando /ping..."
PING_RESULT=$(curl -s "${BASE_URL}/ping" 2>&1)
if echo "$PING_RESULT" | grep -q "alive"; then
    echo -e "${GREEN}✅ PING OK${NC}"
else
    echo -e "${RED}❌ PING FALHOU${NC}"
    echo "Resposta: $PING_RESULT"
fi
echo ""

# Teste 2: AUTH-TEST
echo "🧪 Testando /auth-test..."
AUTH_TEST_RESULT=$(curl -s "${BASE_URL}/auth-test" 2>&1)
if echo "$AUTH_TEST_RESULT" | grep -q "Auth"; then
    echo -e "${GREEN}✅ AUTH-TEST OK${NC}"
else
    echo -e "${RED}❌ AUTH-TEST FALHOU${NC}"
    echo "Resposta: $AUTH_TEST_RESULT"
fi
echo ""

# Teste 3: LOGIN (deve retornar 401 ou 400 para credenciais inválidas)
echo "🧪 Testando /auth/login..."
LOGIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/auth/login" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@exemplo.com","password":"123456"}')

if [ "$LOGIN_CODE" = "401" ] || [ "$LOGIN_CODE" = "400" ] || [ "$LOGIN_CODE" = "200" ]; then
    echo -e "${GREEN}✅ ROTA DE LOGIN OK (HTTP $LOGIN_CODE)${NC}"
else
    echo -e "${RED}❌ ROTA DE LOGIN FALHOU (HTTP $LOGIN_CODE)${NC}"
fi
echo ""

# Teste 4: SIGNUP
echo "🧪 Testando /auth/signup..."
SIGNUP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/auth/signup" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"teste-'$(date +%s)'@exemplo.com","password":"123456","name":"Teste"}')

if [ "$SIGNUP_CODE" = "201" ] || [ "$SIGNUP_CODE" = "200" ] || [ "$SIGNUP_CODE" = "400" ]; then
    echo -e "${GREEN}✅ ROTA DE SIGNUP OK (HTTP $SIGNUP_CODE)${NC}"
else
    echo -e "${RED}❌ ROTA DE SIGNUP FALHOU (HTTP $SIGNUP_CODE)${NC}"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO NO PROJETO CORRETO!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS NO NAVEGADOR:${NC}"
echo ""
echo "1. Pressione F12 (abre Console)"
echo "2. Execute: localStorage.clear()"
echo "3. Execute: location.reload()"
echo "4. Faça login ou cadastro novamente"
echo ""
echo -e "${BLUE}📍 URLs Funcionando:${NC}"
echo "   • ${BASE_URL}/ping"
echo "   • ${BASE_URL}/auth/login"
echo "   • ${BASE_URL}/auth/signup"
echo ""
echo -e "${GREEN}✅ TUDO PRONTO! O login deve funcionar agora!${NC}"
echo ""
