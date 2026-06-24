#!/bin/bash

# ╔═══════════════════════════════════════════════╗
# ║  🚀 SCRIPT DE INICIALIZAÇÃO AUTOMÁTICA       ║
# ║  WhatsApp Business API                        ║
# ╚═══════════════════════════════════════════════╝

clear

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║   🚀 WhatsApp Business API - Starter         ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não encontrado!"
    echo ""
    echo "Por favor, instale Node.js:"
    echo "https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Verifica se está na pasta correta
if [ ! -f "server-simple.js" ]; then
    echo "❌ Arquivo server-simple.js não encontrado!"
    echo ""
    echo "Certifique-se de estar na pasta backend-whatsapp"
    echo ""
    exit 1
fi

echo "✅ Pasta correta confirmada"
echo ""

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    echo "⏱️  Aguarde 2-3 minutos (só acontece na primeira vez)"
    echo ""
    npm install
    echo ""
    echo "✅ Dependências instaladas!"
    echo ""
fi

# Inicia o servidor
echo "🚀 Iniciando WhatsApp Business API..."
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║  ATENÇÃO:                                     ║"
echo "║  • Deixe esta janela ABERTA                   ║"
echo "║  • Para parar: pressione Ctrl+C               ║"
echo "║  • Acesse: http://localhost:3001              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
sleep 2

node server-simple.js
