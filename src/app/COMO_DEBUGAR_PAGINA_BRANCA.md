# 🔍 Como Debugar Página em Branco - GUIA RÁPIDO

## Passo 1: Abrir Console do Navegador

### Chrome/Edge:
- Pressione **F12** ou **Ctrl+Shift+I** (Windows/Linux)
- Pressione **Cmd+Option+I** (Mac)

### Firefox:
- Pressione **F12** ou **Ctrl+Shift+K** (Windows/Linux)
- Pressione **Cmd+Option+K** (Mac)

## Passo 2: Verificar Logs

Na aba **Console**, você deve ver:

### ✅ Logs Normais (tudo OK):
```
🔍 Verificando autenticação...
📌 AUTH_MODE: local
ℹ️ Nenhuma sessão encontrada, indo para Landing Page
✅ Verificação de auth completa
🎯 Renderizando view: landing | User: undefined
```

### ❌ Se ver erro:
Copie o erro completo e me envie!

## Passo 3: Teste Rápido

Abra o Console e execute este comando:

```javascript
localStorage.clear(); location.reload();
```

Isso vai:
1. Limpar todos os dados salvos
2. Recarregar a página

## Passo 4: Se ainda não funcionar

Execute no Console:

```javascript
// Ver estado atual
console.log('View:', localStorage.getItem('currentView'));
console.log('User:', localStorage.getItem('userSession'));
console.log('Auth:', localStorage.getItem('auth_local_session'));
```

E me envie o resultado!

## Solução de Emergência: Usar Landing Simples

Se a página complexa não carregar, você pode usar uma versão simples:

1. Abra o arquivo `/App.tsx`
2. Na **linha 158**, troque:

```typescript
// TROQUE ISTO:
<LandingPage 
  onGetStarted={handleGetStarted}
  onLogin={handleGetStarted}
/>

// POR ISTO:
<SimpleTestPage 
  onGetStarted={handleGetStarted}
  onLogin={handleGetStarted}
/>
```

3. Salve e recarregue

## O que enviar se precisar de ajuda:

1. **Screenshot do Console** (com todos os logs)
2. **Screenshot da página em branco**
3. **Resultado** dos comandos do Passo 4
4. **Browser usado** (Chrome 120, Firefox 121, etc.)

## Checklist Rápido:

- [ ] Console aberto (F12)
- [ ] Verificou se há erros vermelhos
- [ ] Executou `localStorage.clear(); location.reload();`
- [ ] Verificou os logs com emoji (🔍 ✅ 🎯)
- [ ] Se nada funcionar: trocou para `SimpleTestPage`

---

**💡 Dica:** O sistema está configurado com logs detalhados. Se algo der errado, o Console vai te dizer exatamente o que é!
