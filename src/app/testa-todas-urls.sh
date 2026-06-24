#!/bin/bash

echo "🔍 ═══════════════════════════════════════════════════════"
echo "🔍 TESTANDO TODAS AS COMBINAÇÕES DE URL POSSÍVEIS"
echo "🔍 ═══════════════════════════════════════════════════════"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE="https://evdyqlrssgsktctjruuq.supabase.co/functions/v1"

# Array de combinações possíveis
declare -a URLS=(
    "$BASE/make-server-9e4b8b7c/ping"
    "$BASE/server/make-server-9e4b8b7c/ping"
    "$BASE/server/ping"
    "$BASE/make-server-9e4b8b7c/auth/login"
    "$BASE/server/make-server-9e4b8b7c/auth/login"
    "$BASE/server/auth/login"
)

echo "🧪 Testando ${#URLS[@]} combinações de URL..."
echo ""

SUCCESS_COUNT=0
FAIL_COUNT=0

for url in "${URLS[@]}"; do
    echo "────────────────────────────────────────────────────────"
    echo "🔗 URL: $url"
    echo ""
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ SUCCESS - HTTP $HTTP_CODE${NC}"
        echo ""
        echo "📊 Resposta:"
        curl -s "$url" | jq . 2>/dev/null || curl -s "$url"
        echo ""
        echo -e "${GREEN}🎯 ESTA É A URL CORRETA!${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    elif [ "$HTTP_CODE" = "404" ]; then
        echo -e "${RED}❌ NOT FOUND - HTTP 404${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    else
        echo -e "${YELLOW}⚠️  OUTRO STATUS - HTTP $HTTP_CODE${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    echo ""
done

echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Sucessos: $SUCCESS_COUNT${NC}"
echo -e "${RED}❌ Falhas: $FAIL_COUNT${NC}"
echo "════════════════════════════════════════════════════════"
echo ""

if [ $SUCCESS_COUNT -eq 0 ]; then
    echo -e "${RED}🚨 NENHUMA URL FUNCIONOU!${NC}"
    echo ""
    echo "Possíveis causas:"
    echo "1. A função não foi deployada"
    echo "2. O nome da função está diferente"
    echo "3. O servidor ainda está iniciando"
    echo ""
    echo "Execute:"
    echo "  supabase functions list"
    echo "  supabase functions deploy server"
    echo ""
fi
