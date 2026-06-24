# 🔍 DEBUG - Página em Branco

## Problema
Ao acessar o link do Figma Make, aparece uma página em branco.

## Diagnóstico

### 1️⃣ Verificar o Console do Navegador
Abra o DevTools (F12 ou Cmd+Option+I) e vá na aba **Console**. Procure por:
- ❌ Erros em vermelho
- ⚠️ Warnings em amarelo
- 🔵 Logs do sistema (começam com emoji)

### 2️⃣ Verificar o Network
Na aba **Network** do DevTools, verifique:
- Se os arquivos estão carregando (200 OK)
- Se há erros 404 (arquivos não encontrados)
- Se há erros 500 (erro no servidor)

### 3️⃣ Logs Esperados no Console
Quando o app carregar corretamente, você deve ver:
```
🔍 Verificando autenticação...
ℹ️ Nenhuma sessão encontrada, indo para Landing Page
🎯 Renderizando view: landing | User: undefined
```

## Soluções

### Solução 1: Limpar Cache e Recarregar
1. Abra o DevTools (F12)
2. Clique com botão direito no botão de refresh
3. Selecione "Limpar cache e forçar recarga" ou "Hard Reload"

### Solução 2: Usar Landing Page Simples (TESTE)
Se a landing page complexa está causando problema, teste com a versão simples:

**Edite `/App.tsx` linha 158:**
```typescript
// ANTES:
{currentView === 'landing' && (
  <LandingPage 
    onGetStarted={handleGetStarted}
    onLogin={handleGetStarted}
  />
)}

// DEPOIS (TESTE):
{currentView === 'landing' && (
  <SimpleTestPage 
    onGetStarted={handleGetStarted}
    onLogin={handleGetStarted}
  />
)}
```

### Solução 3: Verificar Componentes Importados
A `LandingPage` importa vários componentes complexos que podem estar causando erro:
- `GeminiNeuralBackground`
- `DotPatternBackground`
- `AnimatedStatCard`
- `FloatingElements`
- `AnimatedFeatureIcon`
- `CreativeCTASection`
- `DemoVideoModal`
- `AIContactFooter`

**Teste:** Comente um por vez para identificar qual está causando problema.

### Solução 4: Verificar Erros em Providers
O app usa 2 providers que envolvem tudo:
- `LanguageProvider` (multi-idioma)
- `ThemeProvider` (dark/light mode)

**Verifique os arquivos:**
- `/lib/i18n/LanguageContext.tsx`
- `/lib/ThemeContext.tsx`

### Solução 5: Modo de Emergência
Se nada funcionar, force o app a ir direto para autenticação:

**Edite `/App.tsx` linha 100 (dentro do useEffect):**
```typescript
// Adicione no final do checkAuth, antes de setIsCheckingAuth(false):
console.log('⚠️ MODO EMERGÊNCIA: Forçando autenticação');
setCurrentView('auth');
```

## Comandos Úteis

### Limpar LocalStorage
Abra o Console e execute:
```javascript
localStorage.clear();
location.reload();
```

### Ver estado atual
```javascript
console.log('CurrentView:', localStorage.getItem('currentView'));
console.log('User:', localStorage.getItem('userSession'));
console.log('Auth Local:', localStorage.getItem('auth_local_session'));
```

### Reset completo
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Verificação de Arquivos

### Arquivos Críticos que devem existir:
- ✅ `/App.tsx`
- ✅ `/components/landing-page.tsx`
- ✅ `/components/simple-test-page.tsx` (fallback)
- ✅ `/components/auth-page-local.tsx`
- ✅ `/components/dashboard.tsx`
- ✅ `/lib/local-auth-service.ts`
- ✅ `/lib/i18n/LanguageContext.tsx`
- ✅ `/lib/ThemeContext.tsx`

### Verificar se existe:
```bash
ls -la /App.tsx
ls -la /components/landing-page.tsx
ls -la /components/simple-test-page.tsx
ls -la /lib/local-auth-service.ts
```

## Próximos Passos

1. **Abra o Console do navegador** e copie TODOS os logs
2. **Tire um print** da aba Network mostrando os arquivos carregados
3. **Teste a SimpleTestPage** (Solução 2)
4. **Se ainda não funcionar**, force modo emergência (Solução 5)

## Suporte

Se o problema persistir, envie:
1. Screenshot do Console (com erros)
2. Screenshot do Network
3. Resultado de `localStorage` e `sessionStorage`
4. Browser e versão (Chrome 120, Firefox 121, etc)
