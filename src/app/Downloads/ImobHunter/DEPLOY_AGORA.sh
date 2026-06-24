#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 SCRIPT DE DEPLOY - IMOBHUNTER
# ═══════════════════════════════════════════════════════════════════════
# Execute este script para fazer deploy da Edge Function no Supabase
# ═══════════════════════════════════════════════════════════════════════

echo "════════════════════════════════════════════════════════════════"
echo "🚀 DEPLOY IMOBHUNTER - EDGE FUNCTION"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não está instalado!"
    echo "Execute: brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Supabase CLI encontrado"
echo ""

# Verificar se está logado
echo "🔐 Verificando login..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Você não está logado no Supabase!"
    echo "Execute: supabase login"
    exit 1
fi

echo "✅ Login verificado"
echo ""

# Ir para a pasta do projeto
echo "📂 Navegando para a pasta do projeto..."
cd "$(dirname "$0")"
echo "✅ Pasta atual: $(pwd)"
echo ""

# Linkar ao projeto
echo "🔗 Linkando ao projeto evdyqlrssgsktctjruuq..."
if supabase link --project-ref evdyqlrssgsktctjruuq --password 'temp123' 2>/dev/null; then
    echo "✅ Projeto linkado com sucesso"
else
    echo "⚠️  Projeto já estava linkado ou erro ignorável"
fi
echo ""

# Deploy da função
echo "🚀 Fazendo deploy da função server..."
echo "⏳ Aguarde 30-60 segundos..."
echo ""

if supabase functions deploy server; then
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "🔍 Aguarde 60 segundos e teste o endpoint:"
    echo ""
    echo "curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server/ping"
    echo ""
    echo "📊 Dashboard: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions"
    echo "📝 Logs: supabase functions logs server --follow"
    echo ""
else
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "❌ ERRO NO DEPLOY"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "🔍 Verifique:"
    echo "1. Se você tem permissões no projeto"
    echo "2. Se o Supabase CLI está atualizado: brew upgrade supabase"
    echo "3. Os logs acima para mais detalhes"
    echo ""
    exit 1
fi
