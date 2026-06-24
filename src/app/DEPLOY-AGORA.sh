#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 IMOBHUNTER - DEPLOY FORÇADO AGORA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# PASSO 1: DELETAR FUNÇÃO ANTIGA
echo "🗑️  DELETANDO função antiga (se existir)..."
supabase functions delete server 2>/dev/null || echo "   Função 'server' não existia"
echo ""

# PASSO 2: FAZER DEPLOY
echo "📦 FAZENDO DEPLOY da função 'server'..."
supabase functions deploy server

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERRO NO DEPLOY!"
    echo ""
    echo "Execute estes comandos manualmente:"
    echo "  cd ~/Downloads/ImobHunter"
    echo "  supabase link --project-ref evdyqlrssgsktctjruuq"
    echo "  supabase functions deploy server"
    exit 1
fi

echo ""
echo "✅ Deploy concluído!"
echo ""

# PASSO 3: AGUARDAR
echo "⏳ AGUARDANDO 40 segundos para servidor iniciar..."
for i in {40..1}; do
    printf "\r   ⏰ %2d segundos..." $i
    sleep 1
done
echo ""
echo ""

# PASSO 4: TESTAR
echo "🧪 TESTANDO servidor..."
echo ""

RESULT=$(curl -s https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping)

if echo "$RESULT" | grep -q "alive"; then
    echo "✅✅✅ FUNCIONANDO! ✅✅✅"
    echo ""
    echo "Resposta:"
    echo "$RESULT"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 SUCESSO! Agora você pode fazer login!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Próximos passos:"
    echo "1. Abra o navegador na aplicação"
    echo "2. Pressione F12 (Console)"
    echo "3. Execute: localStorage.clear()"
    echo "4. Execute: location.reload()"
    echo "5. Tente fazer login novamente"
    echo ""
else
    echo "❌ AINDA NÃO FUNCIONANDO"
    echo ""
    echo "Resposta recebida:"
    echo "$RESULT"
    echo ""
    echo "Execute e me envie o resultado:"
    echo "  supabase functions list"
    echo "  supabase functions logs server --limit 20"
fi
