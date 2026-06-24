# ═══════════════════════════════════════════════════════════════════════
# 🚀 SCRIPT DE DEPLOY AUTOMÁTICO - IMOBHUNTER SERVER v1.2.0 (Windows)
# NOVO PROJETO: evdyqlrssgsktctjruuq
# ═══════════════════════════════════════════════════════════════════════

Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 IMOBHUNTER - Deploy Automático do Servidor" -ForegroundColor Yellow
Write-Host "🆕 PROJETO NOVO: evdyqlrssgsktctjruuq" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar se Supabase CLI está instalado
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "❌ Supabase CLI não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📦 Instale com:" -ForegroundColor Yellow
    Write-Host "   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git" -ForegroundColor White
    Write-Host "   scoop install supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "   OU" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   npm install -g supabase" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Supabase CLI encontrado!" -ForegroundColor Green
Write-Host ""

# Project ID padrão (NOVO)
$DEFAULT_PROJECT_ID = "evdyqlrssgsktctjruuq"

# Pedir Project ID (com valor padrão)
$PROJECT_ID = Read-Host "📋 Digite o Project ID do Supabase [$DEFAULT_PROJECT_ID]"
if ([string]::IsNullOrWhiteSpace($PROJECT_ID)) {
    $PROJECT_ID = $DEFAULT_PROJECT_ID
}

Write-Host ""
Write-Host "🔗 Fazendo login no Supabase..." -ForegroundColor Cyan
supabase login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no login!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔗 Linkando projeto $PROJECT_ID..." -ForegroundColor Cyan
supabase link --project-ref $PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao linkar projeto!" -ForegroundColor Red
    Write-Host "💡 Certifique-se de que o Project ID está correto" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Fazendo deploy da função 'server'..." -ForegroundColor Cyan
Write-Host "⏳ Isso pode levar 30-60 segundos..." -ForegroundColor Yellow
Write-Host ""

supabase functions deploy server --project-ref $PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no deploy!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ DEPLOY CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Testando servidor..." -ForegroundColor Cyan
Write-Host ""

# Testar o servidor
try {
    $response = Invoke-RestMethod -Uri "https://$PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/ping" -Method Get
    
    Write-Host "📥 Resposta do servidor:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
    if ($response.version -match "1.2.0") {
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "🎉 SUCESSO! Servidor v1.2.0 está funcionando!" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🎯 Próximos passos:" -ForegroundColor Yellow
        Write-Host "   1. Volte ao ImobHunter" -ForegroundColor White
        Write-Host "   2. Clique em 'VERIFICAR VERSÃO DO SERVIDOR'" -ForegroundColor White
        Write-Host "   3. Deve mostrar versão 1.2.0 em VERDE ✅" -ForegroundColor White
        Write-Host "   4. Clique em 'TESTAR API' para validar o Apollo" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "⚠️ Deploy feito, mas versão ainda não está correta." -ForegroundColor Yellow
        Write-Host "⏳ Aguarde 30 segundos e teste novamente." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Erro ao testar o servidor: $_" -ForegroundColor Yellow
}

Write-Host "═══════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan