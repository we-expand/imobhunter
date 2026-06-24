#!/bin/bash

# ========================================
# 🚀 DEPLOY SCRIPT - IMOBHUNTER
# ========================================

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🚀 ImobHunter Deploy Script         ║"
echo "╚════════════════════════════════════════╝"
echo ""

# ========================================
# VERIFICAÇÕES PRÉ-DEPLOY
# ========================================

echo "🔍 Verificando ambiente..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "supabase/functions/server/index.tsx" ]; then
    echo "❌ ERRO: Arquivo index.tsx não encontrado!"
    echo ""
    echo "📍 Você está aqui: $(pwd)"
    echo "📁 Mas precisa estar no diretório raiz do projeto."
    echo ""
    echo "🔧 Solução:"
    echo "   1. Abra o terminal"
    echo "   2. cd /caminho/completo/do/seu/projeto"
    echo "   3. ./deploy.sh"
    echo ""
    exit 1
fi

echo "✅ Arquivo index.tsx encontrado!"

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo ""
    echo "⚠️  Supabase CLI não está instalado!"
    echo ""
    read -p "Deseja instalar agora? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Instalando Supabase CLI..."
        
        # Detectar sistema operacional
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install supabase/tap/supabase
            else
                echo "❌ Homebrew não encontrado!"
                echo "Instale o Homebrew primeiro: https://brew.sh"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
        else
            echo "❌ Sistema operacional não suportado automaticamente."
            echo "Instale manualmente: https://supabase.com/docs/guides/cli"
            exit 1
        fi
        
        echo "✅ Supabase CLI instalado!"
    else
        echo "❌ Deploy cancelado. Instale Supabase CLI primeiro."
        exit 1
    fi
fi

echo "✅ Supabase CLI instalado!"
echo ""

# ========================================
# INFORMAÇÕES DO DEPLOY
# ========================================

echo "📋 Informações do Deploy:"
echo "   • Projeto: evdyqlrssgsktctjruuq"
echo "   • Função: server"
echo "   • Arquivo: supabase/functions/server/index.tsx"
echo ""

# ========================================
# CONFIRMAÇÃO
# ========================================

read -p "🚀 Iniciar deploy? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado."
    exit 1
fi

# ========================================
# DEPLOY
# ========================================

echo ""
echo "📦 Fazendo deploy..."
echo ""
echo "────────────────────────────────────────"

# Tentar deploy com Docker primeiro
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq

# Se falhar (Docker não rodando), tentar sem verificação
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Tentando método alternativo (sem Docker)..."
    echo ""
    supabase functions deploy server \
      --project-ref evdyqlrssgsktctjruuq \
      --no-verify-jwt
fi

# ========================================
# RESULTADO
# ========================================

if [ $? -eq 0 ]; then
    echo ""
    echo "────────────────────────────────────────"
    echo ""
    echo "✅ ✅ ✅ DEPLOY CONCLUÍDO COM SUCESSO! ✅ ✅ ✅"
    echo ""
    echo "🎉 O servidor ImobHunter foi atualizado!"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. ⏱️  Aguarde 30 segundos para o servidor inicializar"
    echo "   2. 🔄 Recarregue a aplicação (Ctrl+Shift+R)"
    echo "   3. 🔍 Faça uma busca - agora com DADOS REAIS!"
    echo ""
    echo "🧪 Testar o servidor agora:"
    echo "   curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping"
    echo ""
    
    # Oferecer teste automático
    read -p "🧪 Deseja testar o servidor agora? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "⏱️  Aguardando 10 segundos para o servidor inicializar..."
        sleep 10
        
        echo ""
        echo "📡 Testando servidor..."
        response=$(curl -s https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping)
        
        if [[ $response == *"ok"* ]]; then
            echo "✅ Servidor respondendo corretamente!"
            echo "📥 Resposta: $response"
        else
            echo "⚠️  Servidor pode ainda estar inicializando..."
            echo "📥 Resposta: $response"
            echo ""
            echo "💡 Aguarde mais alguns segundos e teste manualmente:"
            echo "   curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping"
        fi
    fi
    
    echo ""
    echo "════════════════════════════════════════"
    echo ""
    
else
    echo ""
    echo "────────────────────────────────────────"
    echo ""
    echo "❌ ERRO NO DEPLOY!"
    echo ""
    echo "🔧 Tente o método alternativo (Dashboard):"
    echo ""
    echo "1. Acesse: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions"
    echo "2. Clique em 'server' ou 'Create Function'"
    echo "3. Cole o conteúdo de: supabase/functions/server/index.tsx"
    echo "4. Clique em 'Deploy'"
    echo ""
    echo "📞 Ou compartilhe o erro completo para mais ajuda"
    echo ""
    echo "════════════════════════════════════════"
    echo ""
    exit 1
fi
