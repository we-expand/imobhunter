#!/bin/bash

# ═══════════════════════════════════════════════
#  🚀 DUPLO CLIQUE PARA INICIAR WHATSAPP
#  Script automático para Mac
# ═══════════════════════════════════════════════

# Obtém o diretório onde o script está
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Limpa a tela
clear

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║   🚀 WhatsApp Business API - Auto Start      ║"
echo "║   AI LeadGen Pro | KW Portugal                ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo ""

# Navega para a pasta backend
cd "$DIR/backend-whatsapp"

echo "📂 Pasta: $PWD"
echo ""

# Verifica Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js NÃO instalado!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Por favor, instale Node.js:"
    echo "  https://nodejs.org/"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Pressione qualquer tecla para abrir o site..."
    read -n 1
    open "https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Instala dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    echo "⏱️  Aguarde 2-3 minutos..."
    echo ""
    npm install
    echo ""
    echo "✅ Instalação completa!"
    echo ""
fi

# Inicia o servidor
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║   🚀 INICIANDO SERVIDOR...                   ║"
echo "║                                               ║"
echo "║   ⚠️  NÃO FECHE ESTA JANELA!                 ║"
echo "║                                               ║"
echo "║   Para parar: Ctrl+C                          ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "🌐 Servidor: http://localhost:3001"
echo "🎯 Agora abra o navegador e conecte o WhatsApp"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Inicia o servidor
node server-simple.js
