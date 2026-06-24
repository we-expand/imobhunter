#!/bin/bash

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_ID="evdyqlrssgsktctjruuq"

echo -e "${YELLOW}🚀 INICIANDO DEPLOY DE EMERGÊNCIA (V2)...${NC}"
echo -e "${YELLOW}📋 Projeto: $PROJECT_ID${NC}"

# 1. Tentar deploy da nova função V2
echo ""
echo -e "${YELLOW}📦 Deploying make-server-v2...${NC}"
npx supabase functions deploy make-server-v2 --no-verify-jwt --project-ref $PROJECT_ID

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deploy da V2 concluído!${NC}"
    
    # 2. Testar V2
    echo ""
    echo -e "${YELLOW}🧪 Testando V2...${NC}"
    RESPONSE=$(curl -s "https://$PROJECT_ID.supabase.co/functions/v1/make-server-v2/ping")
    echo "   Resposta: $RESPONSE"
    
    if echo "$RESPONSE" | grep -q "3.0.0-full-v2"; then
        echo ""
        echo -e "${GREEN}🎉 SUCESSO TOTAL! A função V2 está respondendo corretamente.${NC}"
        echo -e "${GREEN}✅ O problema de 'versão travada' foi resolvido criando uma nova função.${NC}"
        echo ""
        echo -e "${YELLOW}👉 Agora vou atualizar o código da V2 para ser o servidor real.${NC}"
    else
        echo -e "${RED}❌ A V2 respondeu, mas não com a mensagem esperada.${NC}"
    fi
else
    echo -e "${RED}❌ Falha no deploy da V2.${NC}"
fi
