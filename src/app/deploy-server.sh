#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 SCRIPT DE DEPLOY AUTOMÁTICO - IMOBHUNTER SERVER v1.3.5
# NOVO PROJETO: evdyqlrssgsktctjruuq
# ═══════════════════════════════════════════════════════════════════════

echo "═══════════════════════════════════════════════════════════════════════"
echo "🚀 IMOBHUNTER - Deploy Automático do Servidor"
echo "🆕 PROJETO NOVO: evdyqlrssgsktctjruuq"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI não encontrado!"
    echo ""
    echo "📦 Instale com um dos comandos:"
    echo "   - macOS/Linux: brew install supabase/tap/supabase"
    echo "   - Windows: scoop install supabase"
    echo "   - Qualquer OS: npm install -g supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI encontrado!"
echo ""

# Project ID padrão (NOVO)
DEFAULT_PROJECT_ID="evdyqlrssgsktctjruuq"

# Pedir Project ID (com valor padrão)
read -p "📋 Digite o Project ID do Supabase [$DEFAULT_PROJECT_ID]: " PROJECT_ID
PROJECT_ID=${PROJECT_ID:-$DEFAULT_PROJECT_ID}

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID não pode ser vazio!"
    exit 1
fi

echo ""
echo "🔗 Fazendo login no Supabase..."
supabase login

if [ $? -ne 0 ]; then
    echo "❌ Erro no login!"
    exit 1
fi

echo ""
echo "🔗 Linkando projeto $PROJECT_ID..."
supabase link --project-ref $PROJECT_ID

if [ $? -ne 0 ]; then
    echo "❌ Erro ao linkar projeto!"
    echo "💡 Certifique-se de que o Project ID está correto"
    exit 1
fi

echo ""
echo "🚀 Fazendo deploy da função 'server'..."
echo "⏳ Isso pode levar 30-60 segundos..."
echo ""

supabase functions deploy make-server-v2 --project-ref $PROJECT_ID --no-verify-jwt

if [ $? -ne 0 ]; then
    echo "❌ Erro no deploy!"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "🧪 Testando servidor..."
echo ""

# Testar o servidor
RESPONSE=$(curl -s "https://$PROJECT_ID.supabase.co/functions/v1/make-server-v2/ping")

echo "📥 Resposta do servidor:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q "1.3.6-ISOLATED"; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════"
    echo "🎉 SUCESSO! Servidor em MODO DIAGNÓSTICO respondeu corretamente!"
    echo "═══════════════════════════════════════════════════════════════════════"
    echo ""
    echo "🎯 O pipeline de deploy está funcionando."
    echo "   Agora vamos restaurar o servidor principal."
    echo ""
else
    echo ""
    echo "⚠️ Deploy feito, mas a resposta não foi a esperada."
    echo "   Resposta recebida: $RESPONSE"
    echo "⏳ Aguarde 30 segundos e teste novamente."
fi

echo "═══════════════════════════════════════════════════════════════════════"