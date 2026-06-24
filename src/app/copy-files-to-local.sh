#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 📦 IMOBHUNTER - COPIAR ARQUIVOS PARA DIRETÓRIO LOCAL
# ═══════════════════════════════════════════════════════════════════════

PROJECT_DIR="$HOME/Downloads/ImobHunter"
SERVER_DIR="$PROJECT_DIR/supabase/functions/server"

echo "📦 COPIANDO ARQUIVOS PARA O DIRETÓRIO LOCAL..."
echo ""

# Criar diretório se não existir
mkdir -p "$SERVER_DIR"

echo "✅ Diretório criado/verificado: $SERVER_DIR"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# INSTRUÇÕES PARA COPIAR OS ARQUIVOS
# ═══════════════════════════════════════════════════════════════════════

echo "📝 INSTRUÇÕES:"
echo ""
echo "Você precisa copiar os seguintes arquivos do projeto Figma Make"
echo "para o diretório local:"
echo ""
echo "1️⃣ /supabase/functions/server/simple-auth.ts"
echo "   → $SERVER_DIR/simple-auth.ts"
echo ""
echo "2️⃣ /supabase/functions/server/index.ts (atualizado)"
echo "   → $SERVER_DIR/index.ts"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "💡 OPÇÃO 1 - Copiar manualmente:"
echo ""
echo "   1. Abra o projeto Figma Make no navegador"
echo "   2. Copie o conteúdo de cada arquivo"
echo "   3. Cole nos arquivos locais correspondentes"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "💡 OPÇÃO 2 - Criar os arquivos aqui (RECOMENDADO):"
echo ""
echo "   Execute os comandos abaixo para criar os arquivos:"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# MOSTRAR OS COMANDOS PARA CRIAR OS ARQUIVOS
# ═══════════════════════════════════════════════════════════════════════

cat << 'CMDEOF'

# =============================================================================
# COMANDO 1: Criar simple-auth.ts
# =============================================================================

cat > ~/Downloads/ImobHunter/supabase/functions/server/simple-auth.ts << 'EOF'
[CONTEÚDO DO ARQUIVO simple-auth.ts]
EOF

# =============================================================================
# COMANDO 2: Atualizar index.ts
# =============================================================================

# Backup do arquivo original
cp ~/Downloads/ImobHunter/supabase/functions/server/index.ts ~/Downloads/ImobHunter/supabase/functions/server/index.ts.backup

# Atualizar o arquivo
[COMANDOS DE ATUALIZAÇÃO]

CMDEOF

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Depois de copiar os arquivos, execute:"
echo ""
echo "   cd ~/Downloads/ImobHunter"
echo "   supabase functions deploy server --project-ref evdyqlrssgsktctjruuq"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Verificar se os arquivos já existem
if [ -f "$SERVER_DIR/simple-auth.ts" ]; then
  echo "✅ simple-auth.ts encontrado!"
  ls -lh "$SERVER_DIR/simple-auth.ts"
else
  echo "❌ simple-auth.ts NÃO encontrado"
fi

echo ""

if [ -f "$SERVER_DIR/index.ts" ]; then
  echo "✅ index.ts encontrado!"
  ls -lh "$SERVER_DIR/index.ts"
else
  echo "❌ index.ts NÃO encontrado"
fi

echo ""
echo "✨ Script concluído!"
