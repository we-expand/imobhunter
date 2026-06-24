#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 COMANDOS PARA EXECUTAR NO MAC - COPIE UM POR VEZ
# ═══════════════════════════════════════════════════════════════════════

echo "════════════════════════════════════════════════════════════════"
echo "🎯 PASSO 1: Navegue até a pasta do projeto ImobHunter"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "COLE ESTE COMANDO (substitua pelo caminho correto):"
echo ""
echo "cd ~/Desktop/ImobHunter"
echo ""
echo "OU se está em outro lugar:"
echo "cd /caminho/completo/para/o/projeto"
echo ""
echo "Pressione ENTER e continue..."
read

echo "════════════════════════════════════════════════════════════════"
echo "🎯 PASSO 2: Linkar ao projeto Supabase"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "COLE ESTE COMANDO:"
echo ""
echo "supabase link --project-ref evdyqlrssgsktctjruuq"
echo ""
echo "Pressione ENTER e continue..."
read

echo "════════════════════════════════════════════════════════════════"
echo "🎯 PASSO 3: Fazer deploy da função server"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "COLE ESTE COMANDO:"
echo ""
echo "supabase functions deploy server"
echo ""
echo "Aguarde 30-60 segundos..."
echo ""
echo "Pressione ENTER quando terminar..."
read

echo "════════════════════════════════════════════════════════════════"
echo "🎯 PASSO 4: Testar se funcionou"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "COLE ESTE COMANDO:"
echo ""
echo "curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping"
echo ""
echo "Deve retornar: \"version\": \"1.2.0\""
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "✅ PRONTO! Se viu version 1.2.0, está funcionando!"
echo "════════════════════════════════════════════════════════════════"
