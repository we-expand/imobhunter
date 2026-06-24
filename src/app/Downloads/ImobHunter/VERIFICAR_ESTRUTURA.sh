#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🔍 SCRIPT DE VERIFICAÇÃO - ESTRUTURA DO PROJETO IMOBHUNTER
# ═══════════════════════════════════════════════════════════════════════

echo "════════════════════════════════════════════════════════════════"
echo "🔍 VERIFICANDO ESTRUTURA DO PROJETO IMOBHUNTER"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Ir para a pasta do projeto
cd "$(dirname "$0")"
echo "📂 Pasta atual: $(pwd)"
echo ""

# Função para verificar se arquivo existe
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1"
        return 0
    else
        echo "❌ $1 (FALTANDO!)"
        return 1
    fi
}

# Função para verificar se diretório existe
check_dir() {
    if [ -d "$1" ]; then
        echo "✅ $1/"
        return 0
    else
        echo "❌ $1/ (FALTANDO!)"
        return 1
    fi
}

echo "📋 ARQUIVOS PRINCIPAIS:"
check_file "README.md"
check_file "LEIA-PRIMEIRO.md"
check_file "🚀-COMECE-AQUI.txt"
check_file "COMANDOS.txt"
check_file "DEPLOY_AGORA.sh"
check_file "package.json"
check_file ".gitignore"
echo ""

echo "📁 ESTRUTURA SUPABASE:"
check_dir "supabase"
check_file "supabase/config.toml"
check_dir "supabase/functions"
check_dir "supabase/functions/server"
echo ""

echo "⚡ ARQUIVOS DA EDGE FUNCTION:"
check_file "supabase/functions/server/index.tsx"
check_file "supabase/functions/server/kv_store.tsx"
check_file "supabase/functions/server/env-helper.ts"
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "📊 ESTATÍSTICAS:"
echo "════════════════════════════════════════════════════════════════"

# Contar linhas de código
if [ -f "supabase/functions/server/index.tsx" ]; then
    lines_index=$(wc -l < "supabase/functions/server/index.tsx")
    echo "📄 index.tsx: $lines_index linhas"
fi

if [ -f "supabase/functions/server/kv_store.tsx" ]; then
    lines_kv=$(wc -l < "supabase/functions/server/kv_store.tsx")
    echo "📄 kv_store.tsx: $lines_kv linhas"
fi

if [ -f "supabase/functions/server/env-helper.ts" ]; then
    lines_env=$(wc -l < "supabase/functions/server/env-helper.ts")
    echo "📄 env-helper.ts: $lines_env linhas"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ VERIFICAÇÃO CONCLUÍDA!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🎯 Próximos passos:"
echo "1. Abra o arquivo: 🚀-COMECE-AQUI.txt"
echo "2. Siga as instruções para fazer o deploy"
echo "3. OU execute: ./DEPLOY_AGORA.sh"
echo ""
