#!/bin/bash
echo "🚀 Iniciando servidor WhatsApp..."

# Verifica se a pasta existe
if [ -d "backend-whatsapp" ]; then
  cd backend-whatsapp
  
  echo "📦 Instalando dependências..."
  npm install
  
  echo "✅ Iniciando servidor..."
  npm run start:simple
else
  echo "❌ Pasta backend-whatsapp não encontrada!"
  echo "Você está no diretório correto?"
  pwd
  ls -F
fi
