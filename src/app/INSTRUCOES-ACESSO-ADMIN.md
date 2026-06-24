# 🔐 Instruções de Acesso ao Admin Dashboard

## 📍 Como Verificar se Você Tem Acesso Admin

### Passo 1: Abra o Console do Navegador
1. Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Option+I` (Mac)
2. Vá na aba **Console**

### Passo 2: Vá em Configurações
1. Faça login na plataforma
2. Clique na aba **"Configurações"** (última aba no menu principal)

### Passo 3: Verifique os Logs no Console
Procure por estas mensagens no console:

```
🔍 [Settings] Verificando usuário no localStorage: {...}
✅ [Settings] Usuário carregado: {...}
📧 [Settings] Email do usuário: seu-email@dominio.com
🔐 [Settings] Verificação de Admin: {
  currentUser: "seu-email@dominio.com",
  currentUserName: "Seu Nome",
  isAdmin: true/false,
  ...
}
```

### Passo 4: Verifique o Box Amarelo (DEBUG)
No topo da página de Configurações, você verá um box amarelo com:

```
🔍 DEBUG - Info do Usuário:
Email: seu-email@dominio.com
Nome: Seu Nome
É Admin? ✅ SIM ou ❌ NÃO
Emails Admin: joao.nunes@kwportugal.pt, cleber.couto@kwportugal.pt, ...
```

---

## ✅ Se Você TEM Acesso Admin

Você verá:
1. **Badge roxo "ADMIN"** ao lado de "Configurações" no header
2. **5 abas** em Configurações: Integrações | RGPD | Segurança | Dados | **Admin**
3. **Aba "Admin"** com ícone de coroa 👑
4. **Texto roxo** no subtítulo: "• Acesso total de administrador"

---

## ❌ Se Você NÃO Tem Acesso Admin

### Possíveis Causas:

#### 1. **Email Incorreto**
Verifique se seu email no sistema é um destes:
- `joao.nunes@kwportugal.pt`
- `cleber.couto@kwportugal.pt`
- `joao.nunes@kw.com`
- `admin@kw.com`

**Como verificar:** Olhe no box amarelo de DEBUG ou no console

#### 2. **Nome Incorreto**
Alternativamente, o sistema aceita estes nomes:
- `João Nunes`
- `Joao Nunes`
- `Cleber Couto`

**Como verificar:** Olhe no box amarelo de DEBUG

#### 3. **Usuário não carregado**
Se o box amarelo mostra:
```
Email: N/A
Nome: N/A
```

**Solução:** 
1. Faça logout
2. Limpe o localStorage:
   - Abra Console
   - Digite: `localStorage.clear()`
   - Pressione Enter
3. Faça login novamente

---

## 🔧 Soluções de Problemas

### Problema: "É Admin? ❌ NÃO" mas deveria ser Admin

**Solução 1: Verificar Email/Nome**
1. Abra o Console
2. Digite: `JSON.parse(localStorage.getItem('current-user'))`
3. Verifique o email e nome retornados
4. Compare com a lista de emails admin acima

**Solução 2: Forçar Acesso Admin (Temporário)**
1. Abra o Console
2. Digite:
```javascript
const user = JSON.parse(localStorage.getItem('current-user'));
user.email = 'joao.nunes@kwportugal.pt';
user.name = 'João Nunes';
localStorage.setItem('current-user', JSON.stringify(user));
location.reload();
```
3. A página recarregará com acesso admin

**Solução 3: Criar Novo Usuário Admin**
1. Faça logout
2. Registre-se com:
   - Nome: `João Nunes` ou `Cleber Couto`
   - Email: `joao.nunes@kwportugal.pt` ou `cleber.couto@kwportugal.pt`
3. Faça login
4. Acesso admin será concedido automaticamente

---

## 🎯 Adicionar Mais Administradores

Se precisar adicionar outros emails à lista de admins:

1. Abra o arquivo `/components/settings-page.tsx`
2. Localize a seção:
```typescript
// Lista de emails com acesso Admin
const adminEmails = [
  'joao.nunes@kwportugal.pt',
  'cleber.couto@kwportugal.pt',
  'joao.nunes@kw.com',
  'admin@kw.com'
];
```
3. Adicione novos emails à lista:
```typescript
const adminEmails = [
  'joao.nunes@kwportugal.pt',
  'cleber.couto@kwportugal.pt',
  'joao.nunes@kw.com',
  'admin@kw.com',
  'novo-admin@kwportugal.pt', // NOVO
];
```
4. Salve o arquivo

### OU adicione por Nome:
```typescript
const isAdmin = currentUser && (
  adminEmails.includes(currentUser.email?.toLowerCase()) ||
  currentUser.name?.toLowerCase() === 'joão nunes' ||
  currentUser.name?.toLowerCase() === 'joao nunes' ||
  currentUser.name?.toLowerCase() === 'cleber couto' ||
  currentUser.name?.toLowerCase() === 'novo nome' // NOVO
);
```

---

## 📊 O Que Você Verá no Admin Dashboard

Quando tiver acesso, a aba Admin terá:

### **Aba 1: Visão Geral**
- 📊 Métricas em tempo real
- 👥 Lista de todos os usuários
- 📈 Atividade recente da plataforma
- 💰 Receitas e MRR
- 🔄 Auto-refresh a cada 10 segundos

### **Aba 2: Roadmap MVP**
- ✅ 16 tarefas prioritizadas
- 💡 18 sugestões de IA
- 📊 Dashboard de progresso
- 📥 Download de relatório completo

### **Aba 3: Usuários**
- 🔍 Busca de usuários
- 👤 Perfil detalhado
- 💬 Histórico de atividades
- 📧 Dados de contato

---

## 🆘 Suporte

### Não consegue ver o Admin?

**Checklist:**
- [ ] Email/Nome está correto?
- [ ] Box amarelo de DEBUG aparece?
- [ ] Console mostra `isAdmin: true`?
- [ ] Está na aba "Configurações"?
- [ ] Fez refresh na página?

### Ainda não funciona?

1. **Tire um screenshot do box amarelo de DEBUG**
2. **Copie os logs do Console** (todas as mensagens com `[Settings]`)
3. **Envie para análise**

---

## 🎓 Dicas

### Modo Desenvolvedor (Ver DEBUG)
O box amarelo de debug aparece automaticamente quando você está em modo desenvolvimento.

### Limpar Cache
Se algo parecer estranho:
```javascript
// Console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Verificar Todos os Dados do Usuário
```javascript
// Console
console.log('Usuário atual:', JSON.parse(localStorage.getItem('current-user')));
```

---

**Atualizado em:** 14/12/2025  
**Versão:** 1.0
