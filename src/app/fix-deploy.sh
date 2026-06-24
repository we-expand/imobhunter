#!/bin/bash

# Script de Correção e Deploy (Robust Fix)
# Salve como fix-deploy.sh e rode: sh fix-deploy.sh

echo "🛠️  Iniciando Correção do Ambiente..."

# Garantir que estamos na raiz
cd "$(dirname "$0")"

# 1. Verificar e Corrigir Pastas
if [ -d "supabase/functions/server" ] && [ ! -d "supabase/functions/make-server" ]; then
    echo "📂 Renomeando 'server' para 'make-server'..."
    mv supabase/functions/server supabase/functions/make-server
elif [ -d "supabase/functions/server" ] && [ -d "supabase/functions/make-server" ]; then
    echo "⚠️  Ambas as pastas existem. Mesclando conteúdo em 'make-server'..."
    cp -r supabase/functions/server/* supabase/functions/make-server/
    rm -rf supabase/functions/server
fi

# 2. Verificar Entrypoint (index.ts vs index.tsx)
if [ -d "supabase/functions/make-server" ]; then
    if [ ! -f "supabase/functions/make-server/index.ts" ] && [ -f "supabase/functions/make-server/index.tsx" ]; then
        echo "📄 Criando index.ts a partir de index.tsx para compatibilidade..."
        # No Deno/Supabase, index.ts tem precedência. Vamos garantir que o index.ts aponte para o código certo.
        # Se index.tsx é o principal, vamos renomear ou criar um wrapper.
        # Melhor estratégia: Se index.ts não existe, copiar index.tsx para index.ts
        cp supabase/functions/make-server/index.tsx supabase/functions/make-server/index.ts
    fi
else
    echo "❌ ERRO CRÍTICO: Pasta 'supabase/functions/make-server' não encontrada!"
    echo "   Por favor, baixe o projeto novamente."
    exit 1
fi

# 3. Deploy
echo "🚀 Iniciando Deploy..."
npx supabase functions deploy make-server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt --force

echo "✅ Processo finalizado!"
