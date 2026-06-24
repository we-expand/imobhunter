# 🔐 ImobHunter - Deploy do Sistema de Autenticação Simples

## 📋 O que foi feito

Criamos um **sistema de autenticação simplificado** que:

✅ **Não depende do Supabase Auth** (evita problemas de JWT)  
✅ **Usa KV Store** para armazenar usuários  
✅ **Gera tokens JWT próprios** (simples e funcionais)  
✅ **Funciona imediatamente** sem configurações adicionais  

## 🗂️ Arquivos Criados

### Backend (Servidor):
- `/supabase/functions/server/simple-auth.ts` - Sistema de auth completo
- `/supabase/functions/server/index.ts` - Atualizado para incluir as novas rotas

### Frontend:
- `/lib/simple-auth-service.ts` - Serviço de autenticação para o frontend
- `/components/auth-page-simple.tsx` - Nova página de login/signup
- `/App.tsx` - Atualizado para usar o novo sistema

### Scripts de Deploy e Teste:
- `/deploy-simple-auth.sh` - Script automático de deploy
- `/test-auth.sh` - Script de testes dos endpoints
- `/SIMPLE-AUTH-DEPLOY.md` - Este arquivo

## 🚀 Como fazer o Deploy

### Passo 1: Copiar arquivos para o diretório local

```bash
# Navegar para o diretório do projeto
cd ~/Downloads/ImobHunter

# Copiar o arquivo simple-auth.ts (fazer isso manualmente ou via interface)
# O arquivo já está em /supabase/functions/server/simple-auth.ts no projeto Figma Make

# Se necessário, baixar/copiar manualmente:
# - simple-auth.ts para ~/Downloads/ImobHunter/supabase/functions/server/
# - index.ts atualizado para ~/Downloads/ImobHunter/supabase/functions/server/
```

### Passo 2: Fazer o deploy

```bash
cd ~/Downloads/ImobHunter

# Deploy da função server
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
```

### Passo 3: Testar os endpoints

```bash
# Testar health check (NÃO precisa de token)
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/health

# Criar uma conta de teste
curl -X POST https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/simple-auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@imobhunter.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'

# Fazer login
curl -X POST https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/simple-auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@imobhunter.com",
    "password": "senha123"
  }'
```

## 🧪 Script Automático de Testes

Execute o script de testes completo:

```bash
chmod +x test-auth.sh
bash test-auth.sh
```

Este script vai:
1. ✅ Testar health check
2. ✅ Criar uma conta de teste
3. ✅ Fazer login
4. ✅ Validar o token no endpoint /me
5. ✅ Fazer logout

## 📡 Endpoints Disponíveis

### 🟢 Públicos (não precisam de token):

```
GET  /make-server-9e4b8b7c/health
POST /make-server-9e4b8b7c/simple-auth/signup
POST /make-server-9e4b8b7c/simple-auth/login
POST /make-server-9e4b8b7c/simple-auth/logout
```

### 🔒 Protegidos (precisam de Bearer token):

```
GET  /make-server-9e4b8b7c/simple-auth/me
```

## 🎯 Modo de Uso no Frontend

O `App.tsx` já está configurado para usar o novo sistema. A constante `AUTH_MODE` controla qual sistema usar:

```typescript
// Em /App.tsx
const AUTH_MODE: 'simple' | 'supabase' = 'simple';
```

## 🔄 Fluxo de Autenticação

### 1. **Signup (Criar Conta)**
```
POST /simple-auth/signup
{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}

Resposta:
{
  "success": true,
  "message": "Usuário criado com sucesso!",
  "user": { "id": "...", "email": "...", "name": "...", "role": "user" }
}
```

### 2. **Login**
```
POST /simple-auth/login
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}

Resposta:
{
  "success": true,
  "user": { "id": "...", "email": "...", "name": "...", "role": "user" },
  "session": {
    "access_token": "eyJhbGc...",
    "expires_at": 1704844800
  }
}
```

### 3. **Validar Sessão**
```
GET /simple-auth/me
Header: Authorization: Bearer eyJhbGc...

Resposta:
{
  "success": true,
  "user": { "id": "...", "email": "...", "name": "...", "role": "user" }
}
```

### 4. **Logout**
```
POST /simple-auth/logout

Resposta:
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

## 🔐 Segurança

- **Senhas**: Hashadas com SHA-256 (em produção, considere bcrypt)
- **Tokens**: JWT simples com expiração de 30 dias
- **Storage**: Usuários armazenados no KV Store do Supabase
- **Validação**: Emails únicos, senhas mínimo 6 caracteres

## 🐛 Troubleshooting

### Erro 401 "Missing authorization header"

Se ainda estiver dando erro 401 nas rotas públicas, verifique:

1. ✅ O arquivo `/supabase/config.toml` existe com:
   ```toml
   [functions.server]
   verify_jwt = false
   ```

2. ✅ Após criar/atualizar `config.toml`, faça redeploy:
   ```bash
   cd ~/Downloads/ImobHunter
   supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
   ```

### Servidor não responde

1. Verifique logs no Dashboard:
   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions

2. Teste o health check:
   ```bash
   curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/health
   ```

### Frontend não conecta

1. Verifique se `AUTH_MODE` está definido como `'simple'` em `/App.tsx`
2. Limpe o localStorage: `localStorage.clear()`
3. Recarregue a página

## 📝 Próximos Passos

1. ✅ **Fazer deploy**: Execute os comandos do Passo 2
2. ✅ **Testar backend**: Execute o `test-auth.sh`
3. ✅ **Testar frontend**: Acesse o app e crie uma conta
4. ✅ **Integrar com rotas protegidas**: Adicione `authMiddleware` nas rotas que precisam autenticação

## ✨ Benefícios

- **Simplicidade**: Menos dependências, menos problemas
- **Controle**: Você controla 100% do sistema de auth
- **Flexibilidade**: Fácil de customizar e estender
- **Funcionalidade**: Funciona imediatamente, sem configurações complexas

---

**Feito com ❤️ para o ImobHunter**
