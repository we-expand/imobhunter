# 📧 Como Configurar Emails REAIS com Resend

## ✅ O Que Foi Implementado

Seu sistema agora envia **emails REAIS** para:
- ✅ **Boas-vindas** ao criar conta
- ✅ **Login detectado** a cada acesso
- ✅ **2FA ativado** ao configurar autenticação
- ✅ **QR Code validado** (sucesso ou falha)
- ✅ **Logout** ao sair
- ✅ **Re-autenticação** ao voltar
- ✅ **Handover** de leads prontos

---

## 🚀 PASSO A PASSO - Configure em 5 Minutos

### **PASSO 1: Criar Conta no Resend (GRÁTIS)**

1. Acesse: https://resend.com
2. Clique em **"Sign Up"**
3. Crie conta com seu email
4. Confirme o email de verificação

✅ **Plano Grátis:**
- 100 emails/dia
- 3.000 emails/mês
- Sem cartão de crédito

---

### **PASSO 2: Gerar API Key**

1. Faça login em: https://resend.com
2. Vá em **API Keys** (menu lateral)
3. Clique em **"Create API Key"**
4. Dê um nome: `AI LeadGen Pro`
5. Clique em **"Create"**
6. **COPIE A KEY** (aparece apenas 1 vez!)

Exemplo de API Key:
```
re_123abc456def789ghi012jkl345mno678pqr
```

---

### **PASSO 3: Configurar a API Key no Sistema**

1. Abra o arquivo `/lib/email-service.ts`
2. Na linha 6, encontre:
```typescript
const RESEND_API_KEY = 'SUA_API_KEY_AQUI';
```

3. Substitua por sua key REAL:
```typescript
const RESEND_API_KEY = 're_123abc456def789ghi012jkl345mno678pqr';
```

4. **Salve o arquivo** (Ctrl+S)

---

### **PASSO 4: (OPCIONAL) Configurar Domínio Próprio**

#### **Opção A: Usar domínio de teste (MAIS RÁPIDO)**
Por padrão, o sistema usa:
```typescript
const FROM_EMAIL = 'AI LeadGen Pro <onboarding@resend.dev>';
```

✅ **Funciona imediatamente!**
❌ Mas emails podem cair em SPAM

#### **Opção B: Usar seu domínio (RECOMENDADO)**

Se você tem um domínio (ex: `aileadgen.pro`):

1. No Resend, vá em **Domains** → **Add Domain**
2. Digite seu domínio: `aileadgen.pro`
3. Copie os registros DNS fornecidos
4. Adicione os registros no seu provedor DNS (GoDaddy, Cloudflare, etc):

```
Tipo: TXT
Nome: resend._domainkey
Valor: [fornecido pelo Resend]

Tipo: TXT  
Nome: @
Valor: [fornecido pelo Resend]
```

5. Aguarde verificação (pode levar até 72h, geralmente 5-10 min)
6. No arquivo `/lib/email-service.ts`, linha 10, altere para:
```typescript
const FROM_EMAIL = 'AI LeadGen Pro <noreply@aileadgen.pro>';
```

✅ **Emails não caem em SPAM**
✅ **Mais profissional**

---

## 🧪 TESTAR SE FUNCIONA

### **Teste 1: Criar Conta**
1. Abra o sistema
2. Clique em **"Começar Grátis"**
3. Preencha o formulário com **SEU email REAL**
4. Clique em **"Criar Conta"**
5. **Verifique sua caixa de entrada!** 📧

Você deve receber:
```
De: AI LeadGen Pro <onboarding@resend.dev>
Assunto: 🎉 Bem-vindo ao AI LeadGen Pro!
```

### **Teste 2: Ativar 2FA**
1. Entre no sistema
2. Vá em **Segurança** (ícone de escudo)
3. Clique em **"Ativar 2FA"**
4. Configure o QR Code
5. **Verifique seu email!** 📧

Você deve receber:
```
De: AI LeadGen Pro <onboarding@resend.dev>
Assunto: 🔐 Autenticação de 2 Fatores Ativada
```

### **Teste 3: Handover de Lead**
1. Entre no sistema
2. Vá em **Pipeline**
3. Clique em **"Transferir"** em um lead qualificado
4. **Verifique seu email!** 📧

Você deve receber:
```
De: AI LeadGen Pro <onboarding@resend.dev>
Assunto: 🎯 Lead Pronto para Contato!
```

---

## 📊 Monitorar Emails Enviados

1. Acesse: https://resend.com/emails
2. Veja todos os emails enviados
3. Status de cada email:
   - ✅ **Delivered** - Entregue com sucesso
   - ⏳ **Queued** - Na fila
   - ❌ **Failed** - Falhou (veja o motivo)

---

## ❌ Solução de Problemas

### **Problema: Emails não estão sendo enviados**

**Solução:**
1. Verifique se configurou a API Key corretamente
2. Abra o **Console do navegador (F12)**
3. Veja se há erros como:
```
❌ Erro ao enviar email: Invalid API key
```

4. Se sim, copie a API Key novamente do Resend

### **Problema: Emails caem em SPAM**

**Solução:**
1. Configure um domínio próprio (veja PASSO 4 - Opção B)
2. Ou adicione `onboarding@resend.dev` nos seus contatos

### **Problema: Limite de 100 emails/dia atingido**

**Solução:**
1. Aguarde 24 horas para resetar
2. Ou faça upgrade para plano pago ($20/mês):
   - 50.000 emails/mês
   - Sem limite diário

---

## 🔥 EMAILS PRONTOS PARA ENVIAR

O sistema envia automaticamente emails para:

| Evento | Email | Quando |
|--------|-------|--------|
| **Cadastro** | 🎉 Bem-vindo | Ao criar conta |
| **Login** | 🔑 Login detectado | A cada acesso |
| **2FA Ativado** | 🔐 2FA Ativado | Ao configurar 2FA |
| **QR Validado** | ✅ QR Validado | Ao validar código |
| **QR Falhou** | ⚠️ Tentativa Falha | Código incorreto |
| **Logout** | 👋 Logout | Ao sair |
| **Re-auth** | 🔐 Validação Necessária | Ao voltar |
| **Handover** | 🎯 Lead Pronto | Lead qualificado |

---

## 💡 DICAS PROFISSIONAIS

### **1. Personalize os Templates**
Edite `/lib/email-service.ts` e altere o HTML dos emails:
```typescript
const html = `
  <h1>Seu título aqui</h1>
  <p>Seu conteúdo aqui</p>
`;
```

### **2. Adicione Logo da Empresa**
No HTML do email, adicione:
```html
<img src="https://seusite.com/logo.png" width="150" />
```

### **3. Rastreie Abertura de Emails**
No Resend, vá em **Settings** → **Tracking** → Ative **Open Tracking**

### **4. Configure Webhooks**
Receba notificações quando emails são:
- Abertos
- Clicados
- Bounced (rejeitados)

---

## 📈 Estatísticas de Uso

Com o plano GRÁTIS você pode:
- ✅ Enviar **100 emails/dia**
- ✅ Total de **3.000 emails/mês**
- ✅ **10 leads** que recebem **10 emails cada** = 100 emails/dia
- ✅ **300 leads/mês** (perfeito para MVP!)

---

## 🎉 PRONTO!

Seu sistema agora envia emails REAIS para:
1. ✅ Confirmar cadastros
2. ✅ Alertar sobre logins
3. ✅ Notificar ações de segurança
4. ✅ Avisar sobre leads prontos

**Custo**: €0/mês (100 emails/dia grátis)  
**Tempo de setup**: 5 minutos  
**Dificuldade**: Fácil ⭐

---

## 🆘 Precisa de Ajuda?

**Documentação oficial do Resend:**
https://resend.com/docs

**Suporte do Resend:**
https://resend.com/support

**Discord do Resend:**
https://discord.gg/resend

---

**Configuração completa!** 🚀

Agora toda vez que alguém:
- Criar conta → Email automático ✉️
- Fazer login → Email automático ✉️
- Ativar 2FA → Email automático ✉️
- Receber lead → Email automático ✉️

**Tudo sem você mover um dedo!** 🎯
