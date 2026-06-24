# 📧 Como Configurar Emails Reais

Este guia ensina como configurar o envio de **emails REAIS** na plataforma AI LeadGen Pro usando **EmailJS** (100% grátis, 200 emails/mês).

---

## 🎯 Por que EmailJS?

✅ **200 emails/mês grátis** - Perfeito para MVP  
✅ **Funciona direto do frontend** - Sem necessidade de backend  
✅ **5 minutos de setup** - Super rápido  
✅ **Gmail, Outlook, SMTP** - Conecta com qualquer provedor  
✅ **Sem cartão de crédito** - Totalmente gratuito  

---

## 🚀 Passo a Passo (5 minutos)

### **1️⃣ Criar Conta Grátis**

1. Acesse: **https://www.emailjs.com/**
2. Clique em **Sign Up**
3. Crie conta com seu email
4. Confirme o email

---

### **2️⃣ Conectar Seu Email (Gmail exemplo)**

1. No dashboard, clique em **Email Services**
2. Clique em **Add New Service**
3. Escolha **Gmail**
4. Clique em **Connect Account**
5. Faça login com sua conta Gmail
6. Autorize o EmailJS
7. **Copie o `SERVICE_ID`** (ex: `service_abc123`)

> 💡 **Dica**: Você pode usar Gmail, Outlook, Yahoo, ou qualquer SMTP personalizado

---

### **3️⃣ Criar Template de Email**

1. No dashboard, clique em **Email Templates**
2. Clique em **Create New Template**
3. Nomeie: **LeadGen Notifications**
4. Cole este template no editor:

```
Subject: {{subject}}

Olá {{to_name}},

{{message}}

---
Att,
{{from_name}}
AI LeadGen Pro
---
```

5. Clique em **Save**
6. **Copie o `TEMPLATE_ID`** (ex: `template_xyz789`)

---

### **4️⃣ Pegar Public Key**

1. No dashboard, clique no seu **nome de usuário** (canto superior direito)
2. Clique em **Account**
3. Na aba **General**, encontre **Public Key**
4. **Copie a `PUBLIC_KEY`** (ex: `aBc123XyZ456...`)

---

### **5️⃣ Configurar Variáveis de Ambiente**

1. **Crie arquivo `.env` na raiz do projeto:**

```bash
cp .env.example .env
```

2. **Abra o arquivo `.env` e preencha:**

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=aBc123XyZ456...
```

3. **Substitua pelos seus valores copiados nos passos anteriores**

---

### **6️⃣ Reiniciar Servidor**

```bash
# Pare o servidor (Ctrl+C)

# Inicie novamente
npm run dev
```

---

## ✅ Testar Se Funciona

1. **Criar nova conta** no sistema
2. Você deve receber um email de **boas-vindas**
3. Verifique sua caixa de entrada!

Se não receber:
- Verifique a pasta **SPAM**
- Verifique se as variáveis no `.env` estão corretas
- Abra o **Console do navegador** (F12) e procure logs de erro

---

## 📬 Emails Automáticos Configurados

Após configurar, estes emails serão enviados **automaticamente**:

| Evento | Email Enviado |
|--------|---------------|
| 🎉 **Criar conta** | Boas-vindas com instruções |
| 🔐 **Login** | Notificação de novo acesso |
| 🔑 **2FA** | Código de autenticação |
| 🔗 **Gerar link cliente** | URL protegida com instruções |
| 🎯 **Lead qualificado** | Alerta de lead pronto para handover |
| ⏰ **Trial expirando** | Lembrete para upgrade |

---

## 🔧 Troubleshooting

### **Emails não estão sendo enviados**

1. **Verifique o console do navegador (F12)**
   - Procure por erros vermelhos
   - Deve aparecer: `✅ Email enviado com sucesso`

2. **Verifique as variáveis de ambiente**
   ```bash
   # Certifique-se que o arquivo .env existe
   cat .env
   
   # Deve mostrar suas credenciais EmailJS
   ```

3. **Reinicie o servidor**
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

4. **Teste diretamente no EmailJS**
   - Dashboard → Email Templates → Test
   - Envie um email de teste
   - Verifique se funciona lá

### **Limite de 200 emails excedido**

Opções:

1. **Upgrade para plano pago** (€10/mês = 1000 emails)
2. **Usar outro serviço** (Resend, SendGrid, etc)
3. **Aguardar reset mensal** (1º de cada mês)

### **Emails caindo no SPAM**

1. **Configure SPF/DKIM** no seu provedor de email
2. **Use domínio próprio** (ex: contato@suaempresa.com)
3. **Evite palavras spam** nos templates ("GRÁTIS", "GANHE", etc)

---

## 🎨 Personalizar Templates

Você pode personalizar os emails editando `/lib/email-service.ts`:

```typescript
// Exemplo: Email de boas-vindas
async sendWelcomeEmail(userEmail: string, userName: string) {
  return this.sendEmail({
    to_email: userEmail,
    to_name: userName,
    subject: '🎉 Bem-vindo à AI LeadGen Pro!',
    message: `Olá ${userName}!\n\nSua mensagem aqui...`,
  });
}
```

---

## 🔐 Segurança

✅ **Public Key é segura** - Projetada para uso no frontend  
✅ **Limite de taxa** - EmailJS limita requisições por IP  
✅ **Sem exposição de senha** - OAuth2 com Gmail/Outlook  
✅ **`.env` no .gitignore** - Nunca versionado no git  

---

## 📞 Suporte

- **EmailJS Docs**: https://www.emailjs.com/docs/
- **EmailJS Support**: https://www.emailjs.com/support/
- **GitHub Issues**: (adicione link do seu repo)

---

## 🎯 Alternativas ao EmailJS

Se quiser explorar outras opções:

| Serviço | Emails Grátis | Backend? |
|---------|---------------|----------|
| **Resend** | 3000/mês | ✅ Requer |
| **SendGrid** | 100/dia | ✅ Requer |
| **Brevo** | 300/dia | ✅ Requer |
| **Amazon SES** | 62000/mês* | ✅ Requer |

> *Apenas se usar EC2

Para usar estas alternativas, você precisará de um backend (Supabase Edge Functions, Vercel Serverless, etc).

---

**Feito! 🎉 Agora você tem emails REAIS funcionando na plataforma!**
