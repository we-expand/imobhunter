#!/bin/bash

# ═══════════════════════════════════════════════
#  🚀 INICIAR WHATSAPP BACKEND - AUTOMÁTICO
# ═══════════════════════════════════════════════

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

# ═══════════════════════════════════════════════
#  1. VERIFICAR NODE.JS
# ═══════════════════════════════════════════════

echo "🔍 Verificando Node.js..."
echo ""

if ! command -v node &> /dev/null
then
    echo "❌ Node.js NÃO encontrado!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  SOLUÇÃO:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Acesse: https://nodejs.org/"
    echo "2. Baixe a versão LTS (recomendada)"
    echo "3. Instale"
    echo "4. Execute este script novamente"
    echo ""
    exit 1
fi

echo "   ✅ Node.js: $(node --version)"
echo "   ✅ npm: $(npm --version)"
echo ""
sleep 1

# ═══════════════════════════════════════════════
#  2. VERIFICAR PASTA
# ═══════════════════════════════════════════════

echo "🔍 Verificando arquivos..."
echo ""

if [ ! -f "server-simple.js" ]; then
    echo "❌ Arquivo server-simple.js NÃO encontrado!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  SOLUÇÃO:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Certifique-se de estar na pasta 'backend-whatsapp'"
    echo ""
    echo "Execute:"
    echo "  cd backend-whatsapp"
    echo "  ./INICIAR.sh"
    echo ""
    exit 1
fi

echo "   ✅ Arquivos encontrados"
echo ""
sleep 1

# ═══════════════════════════════════════════════
#  3. INSTALAR DEPENDÊNCIAS
# ═══════════════════════════════════════════════

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    echo ""
    echo "⏱️  AGUARDE 2-3 minutos (só acontece na primeira vez)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    npm install
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   ✅ Dependências instaladas!"
    echo ""
    sleep 1
else
    echo "   ✅ Dependências já instaladas"
    echo ""
fi

# ═══════════════════════════════════════════════
#  4. INICIAR SERVIDOR
# ═══════════════════════════════════════════════

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║                                               ║"
echo "║   🚀 INICIANDO WHATSAPP BUSINESS API...      ║"
echo "║                                               ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo ""
echo "⚠️  ATENÇÃO:"
echo ""
echo "   • Esta janela DEVE permanecer ABERTA"
echo "   • Para parar o servidor: pressione Ctrl+C"
echo "   • Acesse: http://localhost:3001"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Agora vá ao navegador e clique 'Tentar Novamente'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
sleep 2

# Inicia o servidor
node server-simple.js
