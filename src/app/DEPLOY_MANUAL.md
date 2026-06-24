# 🚀 MANUAL COMPLETO DE DEPLOY - IMOBHUNTER

## ❗ PROBLEMA IDENTIFICADO

O erro ocorre porque você está executando o comando do **diretório errado**.

```bash
clebercouto@Mac ~ %   # ❌ Você está aqui (diretório home)
```

O comando `supabase functions deploy` precisa ser executado **de dentro do diretório do projeto**.

---

## ✅ SOLUÇÃO - 3 MÉTODOS DIFERENTES

### 🎯 **MÉTODO 1: Via Terminal (Recomendado)**

#### Passo 1: Navegar até o diretório do projeto

```bash
# Primeiro, descubra onde está seu projeto
# Abra o Figma Make e veja o caminho completo do projeto

# Exemplo de caminhos possíveis:
cd ~/Documents/figma-make/imobhunter
# OU
cd ~/Projects/imobhunter
# OU
cd ~/Desktop/imobhunter
```

#### Passo 2: Verificar se está no lugar certo

```bash
# Verifique se o arquivo existe:
ls -la supabase/functions/server/index.tsx

# Deve mostrar algo como:
# -rw-r--r--  1 clebercouto  staff  12345 Jan 27 10:30 supabase/functions/server/index.tsx
```

#### Passo 3: Fazer o deploy

```bash
# Agora sim, rode o comando:
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
```

---

### 🎯 **MÉTODO 2: Deploy Direto (Sem Docker)**

Se o Docker não estiver rodando, use o flag `--no-verify-jwt`:

```bash
# 1. Certifique-se de estar no diretório do projeto
cd /caminho/do/seu/projeto

# 2. Deploy sem Docker
supabase functions deploy server \
  --project-ref evdyqlrssgsktctjruuq \
  --no-verify-jwt
```

---

### 🎯 **MÉTODO 3: Via Dashboard Supabase (Mais Simples)**

Se continuar com problemas no terminal, use o dashboard web:

#### Passo 1: Copiar o código do servidor

```bash
# No terminal, copie o conteúdo do arquivo:
cat supabase/functions/server/index.tsx | pbcopy
```

Ou abra o arquivo manualmente e copie todo o conteúdo.

#### Passo 2: Fazer upload no Dashboard

1. **Acesse:** https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions

2. **Clique** na função `server` (ou crie uma nova se não existir)

3. **Cole o código** copiado

4. **Clique em "Deploy"**

5. **Aguarde** ~30 segundos

---

## 🔍 **MÉTODO 4: Script Automático**

Vou criar um script que faz tudo automaticamente:

### Para macOS/Linux:

Salve este código em um arquivo chamado `deploy.sh`:

```bash
#!/bin/bash

# Deploy Script - ImobHunter
echo "🚀 Iniciando deploy do ImobHunter..."

# Verificar se está no diretório correto
if [ ! -f "supabase/functions/server/index.tsx" ]; then
    echo "❌ ERRO: Arquivo index.tsx não encontrado!"
    echo "📍 Você precisa estar no diretório raiz do projeto."
    echo ""
    echo "Execute:"
    echo "  cd /caminho/do/seu/projeto"
    echo "  ./deploy.sh"
    exit 1
fi

echo "✅ Arquivo encontrado!"

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não está instalado!"
    echo ""
    echo "Instalando..."
    brew install supabase/tap/supabase
fi

echo "✅ Supabase CLI instalado!"

# Fazer deploy
echo ""
echo "📦 Fazendo deploy..."
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt

# Verificar se funcionou
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅ DEPLOY CONCLUÍDO COM SUCESSO! ✅ ✅ ✅"
    echo ""
    echo "🎉 O servidor foi atualizado!"
    echo ""
    echo "📋 Próximos passos:"
    echo "  1. Aguarde 30 segundos"
    echo "  2. Recarregue a aplicação (Ctrl+Shift+R)"
    echo "  3. Faça uma busca - agora com DADOS REAIS!"
    echo ""
    echo "🧪 Testar o servidor:"
    echo "  curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping"
else
    echo ""
    echo "❌ ERRO no deploy!"
    echo ""
    echo "Tente o Método 3 (Dashboard):"
    echo "  https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions"
fi
```

### Como usar o script:

```bash
# 1. Tornar executável
chmod +x deploy.sh

# 2. Executar
./deploy.sh
```

---

## 🛠️ **TROUBLESHOOTING**

### Erro: "Docker is not running"

**Solução 1:** Ignorar Docker
```bash
supabase functions deploy server \
  --project-ref evdyqlrssgsktctjruuq \
  --no-verify-jwt
```

**Solução 2:** Usar o Dashboard (Método 3 acima)

---

### Erro: "no such file or directory"

**Causa:** Você está no diretório errado

**Solução:**
```bash
# Descobrir onde você está:
pwd

# Ir para o diretório correto:
cd /caminho/completo/do/projeto

# Verificar:
ls supabase/functions/server/index.tsx
```

---

### Erro: "supabase: command not found"

**Solução:** Instalar Supabase CLI

```bash
# macOS (Homebrew):
brew install supabase/tap/supabase

# Linux:
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh

# Windows (PowerShell):
choco install supabase
```

---

## ✅ **VERIFICAR SE DEU CERTO**

Depois do deploy, teste:

```bash
# Teste 1: Ping
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping

# Deve retornar: {"status":"ok","message":"Server is running","version":"1.0.0"}

# Teste 2: CORS Preflight
curl -X OPTIONS \
  https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/proxycurl/search \
  -H "Origin: https://bring-aroma-99987345.figma.site" \
  -H "Access-Control-Request-Method: POST" \
  -i

# Deve retornar HTTP 204 com headers CORS
```

---

## 🎯 **RESUMO RÁPIDO**

```bash
# 1. Ir para o diretório do projeto
cd /seu/caminho/do/projeto

# 2. Verificar
ls supabase/functions/server/index.tsx

# 3. Deploy
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt

# 4. Aguardar 30s

# 5. Testar
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping

# 6. Recarregar app (Ctrl+Shift+R)

# 7. Fazer busca → DADOS REAIS! 🎉
```

---

## 💡 **DICA PRO**

Se você usa VS Code, pode fazer deploy direto da extensão Supabase:

1. Instale a extensão "Supabase" no VS Code
2. Conecte ao projeto
3. Clique com botão direito na pasta `supabase/functions/server`
4. Selecione "Deploy Function"

---

## 📞 **PRECISA DE AJUDA?**

Se nenhum método funcionar:

1. **Compartilhe o output completo do erro**
2. **Mostre onde está:** `pwd`
3. **Verifique se o arquivo existe:** `ls supabase/functions/server/index.tsx`

Vou te ajudar com o método específico para sua situação!
