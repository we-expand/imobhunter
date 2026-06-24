# 🧹 Como Limpar Sessões Antigas e Ver a Landing Page

## ❓ Problema
A plataforma está iniciando direto no Dashboard ao invés da Landing Page por causa de sessões antigas armazenadas.

## ✅ Solução Rápida (Via Console do Navegador)

### **Método 1: Usando a função automática**

1. **Abra o Console do Navegador:**
   - Chrome/Edge: `F12` ou `Cmd+Option+J` (Mac) / `Ctrl+Shift+J` (Windows)
   - Firefox: `F12` ou `Cmd+Option+K` (Mac) / `Ctrl+Shift+K` (Windows)

2. **Cole este comando e pressione Enter:**
   ```javascript
   clearOldSessions()
   ```

3. **Recarregue a página:**
   ```javascript
   window.location.reload()
   ```

### **Método 2: Limpeza manual**

Cole este código no console:

```javascript
localStorage.removeItem('userSession');
localStorage.removeItem('app-users');
localStorage.removeItem('supabase_auth_session');
localStorage.removeItem('supabase_auth_user');
window.location.reload();
```

### **Método 3: Limpar todo o localStorage (mais drástico)**

```javascript
localStorage.clear();
window.location.reload();
```

---

## 🔧 O Que Foi Corrigido

### 1. **Sistema de Verificação de Autenticação Melhorado**
   - ✅ Agora verifica se há sessão **válida** do Supabase
   - ✅ Limpa automaticamente sessões antigas do sistema anterior
   - ✅ Valida token antes de restaurar sessão
   - ✅ Inicia sempre na Landing Page se não houver autenticação válida

### 2. **Limpeza Automática de Sessões Antigas**
   - ✅ Detecta e remove sessões do sistema anterior (localStorage)
   - ✅ Valida formato do token (JWT do Supabase)
   - ✅ Remove dados obsoletos automaticamente

### 3. **Loading Screen**
   - ✅ Mostra tela de carregamento enquanto verifica autenticação
   - ✅ Evita "flash" de conteúdo incorreto

---

## 🎯 Fluxo Correto Agora

### **Para Usuários Não Autenticados:**
```
1. Landing Page (inicial)
   ↓
2. Clica em "Começar Grátis" ou "Entrar"
   ↓
3. Tela de Login/Cadastro
   ↓
4. Após login → Dashboard
```

### **Para Usuários Já Autenticados:**
```
1. Verifica sessão do Supabase
   ↓
2. Valida token com servidor
   ↓
3. Se válido → Dashboard
   ↓
4. Se inválido → Landing Page
```

---

## 📋 Próximos Passos

### **1. Limpe as sessões antigas (escolha um método acima)**

### **2. Deploy do servidor atualizado:**
```bash
cd ~/Downloads/ImobHunter && supabase functions deploy server
```

### **3. Aguarde 10-15 segundos para o servidor reiniciar**

### **4. Teste o fluxo completo:**
   - [ ] Recarregue a página → Deve ver a **Landing Page**
   - [ ] Clique em "Começar Grátis"
   - [ ] Crie uma nova conta
   - [ ] Faça login
   - [ ] Acesse o Dashboard
   - [ ] Faça logout
   - [ ] Deve voltar para a **Landing Page**

---

## 🐛 Troubleshooting

### **Ainda indo direto para Dashboard?**

1. **Verifique o console do navegador** para ver os logs:
   ```
   🔍 Verificando autenticação...
   ℹ️ Nenhuma sessão encontrada, indo para Landing Page
   ```

2. **Limpe o cache do navegador:**
   - Chrome: `Cmd+Shift+Delete` (Mac) / `Ctrl+Shift+Delete` (Windows)
   - Marque "Cookies e outros dados do site"
   - Clique em "Limpar dados"

3. **Teste em aba anônima:**
   - `Cmd+Shift+N` (Mac) / `Ctrl+Shift+N` (Windows)
   - Deve iniciar direto na Landing Page

### **Erro ao fazer login?**

Verifique se o servidor está rodando:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Nzk1NzAsImV4cCI6MjA4MTU1NTU3MH0.7Z71n-3HpwqI-T5vrc6XnG-Es_nlWLxDEX2AvqGXzDw" https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
```

Deve retornar:
```json
{"status":"alive","version":"1.3.0 - ROTAS CORRIGIDAS ✅",...}
```

---

## 📞 Suporte

Se ainda tiver problemas:
1. Abra o console do navegador (F12)
2. Procure por mensagens de erro em vermelho
3. Copie os logs que começam com 🔐, 🔍, ✅ ou ❌
4. Compartilhe para análise

---

## ✨ Sistema Funcionando Corretamente

Quando tudo estiver funcionando, você verá:

1. **Landing Page bonita** com:
   - Logo ImobHunter
   - Botões "Entrar" e "Começar Grátis"
   - Descrição do produto
   - Background neural animado

2. **Tela de Login/Cadastro** com:
   - Tabs para alternar entre Login e Cadastro
   - Campos de email, senha, nome
   - Validações em tempo real
   - Mensagens de erro claras

3. **Dashboard completo** após autenticação

**Tudo pronto! 🚀**
