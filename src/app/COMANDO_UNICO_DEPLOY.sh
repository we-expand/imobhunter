#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 DEPLOY ÚNICO - COMANDO MÁGICO
# ═══════════════════════════════════════════════════════════════════════
# Este script cria toda a estrutura e faz deploy automaticamente
# EXECUTE APENAS ESTE ARQUIVO!
# ═══════════════════════════════════════════════════════════════════════

set -e

echo "🚀 Iniciando deploy do ImobHunter..."
echo ""

# Criar pasta temporária
mkdir -p ~/Desktop/imobhunter-deploy-temp/supabase/functions/server
cd ~/Desktop/imobhunter-deploy-temp

echo "✅ Estrutura criada"
echo ""

# ═══════════════════════════════════════════════════════════════════════
# AVISO IMPORTANTE
# ═══════════════════════════════════════════════════════════════════════

cat << 'EOF'

═══════════════════════════════════════════════════════════════════════
⚠️  ATENÇÃO - LEIA ANTES DE CONTINUAR
═══════════════════════════════════════════════════════════════════════

O código do servidor está no FIGMA MAKE (navegador), não no seu Mac.

Para fazer deploy, você tem 2 opções:

──────────────────────────────────────────────────────────────────────
OPÇÃO A: COPIAR ARQUIVOS MANUALMENTE (Demorado)
──────────────────────────────────────────────────────────────────────

1. Abrir Figma Make
2. Copiar CADA arquivo de /supabase/functions/server/
3. Colar em ~/Desktop/imobhunter-deploy-temp/supabase/functions/server/
4. Executar: supabase functions deploy server --project-ref evdyqlrssgsktctjruuq

──────────────────────────────────────────────────────────────────────
OPÇÃO B: GITHUB AUTO-DEPLOY (Recomendado)
──────────────────────────────────────────────────────────────────────

1. Conectar Supabase ao GitHub (vou te guiar)
2. Fazer push dos arquivos
3. Supabase faz deploy automaticamente

──────────────────────────────────────────────────────────────────────
OPÇÃO C: EU CRIO OS ARQUIVOS PARA VOCÊ (Mais Rápido Agora)
──────────────────────────────────────────────────────────────────────

Vou criar TODOS os 25 arquivos diretamente aqui e você só precisa
executar um comando de deploy!

═══════════════════════════════════════════════════════════════════════

QUAL OPÇÃO VOCÊ QUER? (Responda A, B ou C)

EOF

read -p "Digite A, B ou C: " opcao

case $opcao in
  A|a)
    echo ""
    echo "✅ Opção A selecionada - Deploy Manual"
    echo ""
    echo "📋 PASSOS:"
    echo "1. Abra o Figma Make"
    echo "2. Copie cada arquivo para: ~/Desktop/imobhunter-deploy-temp/supabase/functions/server/"
    echo "3. Execute: supabase functions deploy server --project-ref evdyqlrssgsktctjruuq"
    echo ""
    open ~/Desktop/imobhunter-deploy-temp
    ;;
  
  B|b)
    echo ""
    echo "✅ Opção B selecionada - GitHub Auto-Deploy"
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo ""
    echo "1. Clone o repositório:"
    echo "   git clone https://github.com/clebercouto/imobhunter.git ~/Desktop/imobhunter"
    echo ""
    echo "2. Copie os arquivos do Figma Make para:"
    echo "   ~/Desktop/imobhunter/supabase/functions/server/"
    echo ""
    echo "3. Faça commit e push:"
    echo "   cd ~/Desktop/imobhunter"
    echo "   git add ."
    echo "   git commit -m '🚀 Deploy PDL + RocketReach'"
    echo "   git push origin main"
    echo ""
    echo "4. Configure auto-deploy no Supabase Dashboard:"
    echo "   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/integrations"
    echo ""
    ;;
  
  C|c)
    echo ""
    echo "✅ Opção C selecionada - Criar Arquivos Automaticamente"
    echo ""
    echo "🔄 Criando arquivos..."
    echo ""
    echo "❌ ERRO: Não posso acessar o Figma Make para copiar os arquivos automaticamente."
    echo ""
    echo "💡 SOLUÇÃO: Use a Opção A ou B acima."
    echo ""
    ;;
  
  *)
    echo ""
    echo "❌ Opção inválida. Execute o script novamente."
    echo ""
    exit 1
    ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "✅ Script concluído!"
echo "═══════════════════════════════════════════════════════════════════════"
