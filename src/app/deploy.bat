@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM ========================================
REM 🚀 DEPLOY SCRIPT - IMOBHUNTER (Windows)
REM ========================================

echo.
echo ╔════════════════════════════════════════╗
echo ║   🚀 ImobHunter Deploy Script         ║
echo ╚════════════════════════════════════════╝
echo.

REM ========================================
REM VERIFICAÇÕES PRÉ-DEPLOY
REM ========================================

echo 🔍 Verificando ambiente...
echo.

REM Verificar se está no diretório correto
if not exist "supabase\functions\server\index.tsx" (
    echo ❌ ERRO: Arquivo index.tsx não encontrado!
    echo.
    echo 📍 Você está aqui: %CD%
    echo 📁 Mas precisa estar no diretório raiz do projeto.
    echo.
    echo 🔧 Solução:
    echo    1. Abra o Prompt de Comando ou PowerShell
    echo    2. cd C:\caminho\completo\do\seu\projeto
    echo    3. deploy.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Arquivo index.tsx encontrado!

REM Verificar se Supabase CLI está instalado
where supabase > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Supabase CLI não está instalado!
    echo.
    echo 📦 Instalando via NPM...
    npm install -g supabase
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Falha na instalação!
        echo.
        echo 🔧 Instale manualmente:
        echo    npm install -g supabase
        echo.
        echo    OU use o instalador: https://supabase.com/docs/guides/cli
        echo.
        pause
        exit /b 1
    )
)

echo ✅ Supabase CLI instalado!
echo.

REM ========================================
REM INFORMAÇÕES DO DEPLOY
REM ========================================

echo 📋 Informações do Deploy:
echo    • Projeto: evdyqlrssgsktctjruuq
echo    • Função: server
echo    • Arquivo: supabase\functions\server\index.tsx
echo.

REM ========================================
REM CONFIRMAÇÃO
REM ========================================

set /p confirm="🚀 Iniciar deploy? (S/N) "
if /i not "%confirm%"=="S" (
    echo ❌ Deploy cancelado.
    pause
    exit /b 1
)

REM ========================================
REM DEPLOY
REM ========================================

echo.
echo 📦 Fazendo deploy...
echo.
echo ────────────────────────────────────────

REM Tentar deploy
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt

REM ========================================
REM RESULTADO
REM ========================================

if %errorlevel% equ 0 (
    echo.
    echo ────────────────────────────────────────
    echo.
    echo ✅ ✅ ✅ DEPLOY CONCLUÍDO COM SUCESSO! ✅ ✅ ✅
    echo.
    echo 🎉 O servidor ImobHunter foi atualizado!
    echo.
    echo 📋 Próximos passos:
    echo    1. ⏱️  Aguarde 30 segundos para o servidor inicializar
    echo    2. 🔄 Recarregue a aplicação (Ctrl+Shift+R)
    echo    3. 🔍 Faça uma busca - agora com DADOS REAIS!
    echo.
    echo 🧪 Testar o servidor:
    echo    curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/ping
    echo.
    echo ════════════════════════════════════════
    echo.
    pause
) else (
    echo.
    echo ────────────────────────────────────────
    echo.
    echo ❌ ERRO NO DEPLOY!
    echo.
    echo 🔧 Tente o método alternativo (Dashboard):
    echo.
    echo 1. Acesse: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
    echo 2. Clique em 'server' ou 'Create Function'
    echo 3. Cole o conteúdo de: supabase\functions\server\index.tsx
    echo 4. Clique em 'Deploy'
    echo.
    echo 📞 Ou compartilhe o erro completo para mais ajuda
    echo.
    echo ════════════════════════════════════════
    echo.
    pause
    exit /b 1
)
