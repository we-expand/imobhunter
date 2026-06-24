#!/bin/bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOY COM VERIFICAÇÃO TOTAL - IMOBHUNTER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="evdyqlrssgsktctjruuq"
BASE_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-9e4b8b7c"

# PASSO 0: Verificar se Supabase CLI está instalado
echo -e "${BLUE}[0/7]${NC} Verificando Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI não está instalado!${NC}"
    echo ""
    echo "Instale com:"
    echo "  brew install supabase/tap/supabase"
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ Supabase CLI instalado${NC}"
echo ""

# PASSO 1: Verificar login
echo -e "${BLUE}[1/7]${NC} Verificando autenticação..."
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Não está autenticado${NC}"
    echo ""
    echo "Autenticando..."
    supabase login
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha na autenticação${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Autenticado no Supabase${NC}"
echo ""

# PASSO 2: Verificar se projeto existe
echo -e "${BLUE}[2/7]${NC} Verificando projeto..."
if ! supabase projects list | grep -q "$PROJECT_ID"; then
    echo -e "${RED}❌ Projeto $PROJECT_ID não encontrado na sua conta!${NC}"
    echo ""
    echo "Projetos disponíveis:"
    supabase projects list
    echo ""
    exit 1
fi
echo -e "${GREEN}✅ Projeto encontrado${NC}"
echo ""

# PASSO 3: Linkar projeto
echo -e "${BLUE}[3/7]${NC} Linkando ao projeto..."
supabase link --project-ref $PROJECT_ID 2>&1 | grep -v "already linked" || true
echo -e "${GREEN}✅ Projeto linkado${NC}"
echo ""

# PASSO 4: Verificar estrutura
echo -e "${BLUE}[4/7]${NC} Verificando arquivos..."
if [ ! -f "supabase/functions/server/index.tsx" ]; then
    echo -e "${RED}❌ Arquivo supabase/functions/server/index.tsx não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Arquivos encontrados${NC}"
echo ""

# PASSO 5: Deploy
echo -e "${BLUE}[5/7]${NC} Fazendo deploy da função 'server'..."
echo ""
echo -e "${YELLOW}Isso pode levar 1-2 minutos...${NC}"
echo ""

supabase functions deploy server --no-verify-jwt

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ ERRO NO DEPLOY!${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Possíveis causas:"
    echo "  1. Você não tem permissão no projeto"
    echo "  2. Token expirado (tente: supabase login)"
    echo "  3. Erro de sintaxe no código"
    echo ""
    echo "Tente:"
    echo "  supabase login"
    echo "  supabase link --project-ref $PROJECT_ID"
    echo "  supabase functions deploy server --no-verify-jwt"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""

# PASSO 6: Aguardar servidor iniciar
echo -e "${BLUE}[6/7]${NC} Aguardando servidor iniciar..."
echo ""

for i in {60..1}; do
    printf "\r   ⏰ Aguardando ${i} segundos para servidor inicializar...   "
    sleep 1
done

echo ""
echo ""

# PASSO 7: Testar rotas
echo -e "${BLUE}[7/7]${NC} Testando rotas..."
echo ""

TESTS_PASSED=0
TESTS_FAILED=0

# Teste 1: PING
echo "🧪 [1/4] Testando /ping..."
PING_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/ping" 2>&1)
PING_CODE=$(echo "$PING_RESPONSE" | tail -n 1)

if [ "$PING_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ PING OK (HTTP 200)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "   ${RED}❌ PING FALHOU (HTTP $PING_CODE)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Teste 2: AUTH-TEST
echo "🧪 [2/4] Testando /auth-test..."
AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/auth-test" 2>&1)
AUTH_CODE=$(echo "$AUTH_RESPONSE" | tail -n 1)

if [ "$AUTH_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ AUTH-TEST OK (HTTP 200)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "   ${RED}❌ AUTH-TEST FALHOU (HTTP $AUTH_CODE)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Teste 3: LOGIN (OPTIONS - CORS preflight)
echo "🧪 [3/4] Testando CORS (OPTIONS /auth/login)..."
OPTIONS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$BASE_URL/auth/login" \
    -H "Origin: https://bring-aroma-99987345.figma.site" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")

if [ "$OPTIONS_CODE" = "200" ] || [ "$OPTIONS_CODE" = "204" ]; then
    echo -e "   ${GREEN}✅ CORS OK (HTTP $OPTIONS_CODE)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "   ${RED}❌ CORS FALHOU (HTTP $OPTIONS_CODE)${NC}"
    echo -e "   ${YELLOW}⚠️  Isso pode causar erro no navegador${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Teste 4: LOGIN (POST real)
echo "🧪 [4/4] Testando POST /auth/login..."
LOGIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"teste@exemplo.com","password":"123456"}')

if [ "$LOGIN_CODE" = "401" ] || [ "$LOGIN_CODE" = "400" ] || [ "$LOGIN_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ LOGIN RESPONDENDO (HTTP $LOGIN_CODE)${NC}"
    echo -e "   ${YELLOW}   Nota: 401/400 é esperado para credenciais inválidas${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "   ${RED}❌ LOGIN NÃO RESPONDENDO (HTTP $LOGIN_CODE)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# RESULTADO FINAL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCESSO TOTAL! TODOS OS TESTES PASSARAM! (${TESTS_PASSED}/4)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${GREEN}✅ Servidor deployado e funcionando!${NC}"
    echo ""
    echo -e "${YELLOW}📋 PRÓXIMOS PASSOS NO NAVEGADOR:${NC}"
    echo ""
    echo "1. Abra a aplicação: https://bring-aroma-99987345.figma.site"
    echo "2. Pressione F12 (abre Console)"
    echo "3. Execute: localStorage.clear()"
    echo "4. Execute: location.reload()"
    echo "5. Faça login ou cadastro"
    echo ""
    echo -e "${BLUE}📍 URLs funcionando:${NC}"
    echo "   • $BASE_URL/ping"
    echo "   • $BASE_URL/auth/login"
    echo "   • $BASE_URL/auth/signup"
    echo ""
else
    echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM (${TESTS_PASSED}/4 passaram, ${TESTS_FAILED}/4 falharam)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${YELLOW}Possíveis problemas:${NC}"
    echo "  • Servidor ainda está inicializando (aguarde 1-2 minutos)"
    echo "  • Problema no código da função"
    echo "  • CORS não configurado corretamente"
    echo ""
    echo "Veja os logs do servidor:"
    echo "  supabase functions logs server --limit 50"
    echo ""
fi
