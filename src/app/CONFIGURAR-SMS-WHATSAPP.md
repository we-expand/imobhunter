# 📱 Como Enviar SMS e WhatsApp ao Fazer Login

## 📧 Avisos de Login por SMS/WhatsApp

Atualmente, a plataforma envia **emails** quando o usuário faz login. Para adicionar notificações por SMS ou WhatsApp, você precisa integrar com APIs externas.

---

## ✅ Opção 1: Twilio (Mais Popular - Grátis para Testes)

### Vantagens:
- ✅ **$15 USD de crédito grátis** para testes
- ✅ Envia SMS para +170 países
- ✅ WhatsApp Business API incluso
- ✅ Documentação excelente
- ✅ Biblioteca para JavaScript/Node.js

### Preços após trial:
- SMS: ~$0.0079 USD por SMS (Brasil)
- WhatsApp: ~$0.005 USD por mensagem

### Como Configurar:

1. **Crie conta gratuita:**
   - Acesse: https://www.twilio.com/try-twilio
   - Cadastre-se (recebe $15 USD grátis)

2. **Pegue suas credenciais:**
   - Account SID
   - Auth Token
   - Número de telefone Twilio

3. **Instale a biblioteca:**
   ```bash
   npm install twilio
   ```

4. **Adicione no código:**

   Crie um arquivo `/lib/sms-service.ts`:

   ```typescript
   import { toast } from 'sonner@2.0.3';

   // ⚠️ CONFIGURE SUAS CREDENCIAIS TWILIO AQUI
   const TWILIO_ACCOUNT_SID = 'SUA_ACCOUNT_SID_AQUI';
   const TWILIO_AUTH_TOKEN = 'SEU_AUTH_TOKEN_AQUI';
   const TWILIO_PHONE_NUMBER = '+15551234567'; // Número Twilio

   class SMSService {
     // Envia SMS usando Twilio
     async sendLoginSMS(phoneNumber: string, userName: string) {
       try {
         const message = `🔐 Olá ${userName}! Você acabou de fazer login no AI LeadGen Pro às ${new Date().toLocaleTimeString('pt-PT')}. Se não foi você, entre em contato imediatamente.`;

         // API do Twilio
         const response = await fetch(
           `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
           {
             method: 'POST',
             headers: {
               'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
               'Content-Type': 'application/x-www-form-urlencoded',
             },
             body: new URLSearchParams({
               From: TWILIO_PHONE_NUMBER,
               To: phoneNumber,
               Body: message,
             }),
           }
         );

         const data = await response.json();

         if (response.ok) {
           console.log('✅ SMS enviado:', data.sid);
           toast.success('SMS de confirmação enviado! 📱');
           return true;
         } else {
           console.error('❌ Erro ao enviar SMS:', data);
           return false;
         }
       } catch (error) {
         console.error('❌ Erro ao enviar SMS:', error);
         return false;
       }
     }

     // Envia WhatsApp usando Twilio
     async sendLoginWhatsApp(phoneNumber: string, userName: string) {
       try {
         const message = `🔐 *Login Detectado*\n\nOlá ${userName}!\n\nVocê acabou de fazer login no AI LeadGen Pro.\n\n🕐 Horário: ${new Date().toLocaleString('pt-PT')}\n\n✅ Foi você? Tudo certo!\n❌ Não foi você? Altere sua senha imediatamente.`;

         // WhatsApp via Twilio
         const response = await fetch(
           `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
           {
             method: 'POST',
             headers: {
               'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
               'Content-Type': 'application/x-www-form-urlencoded',
             },
             body: new URLSearchParams({
               From: `whatsapp:${TWILIO_PHONE_NUMBER}`,
               To: `whatsapp:${phoneNumber}`,
               Body: message,
             }),
           }
         );

         const data = await response.json();

         if (response.ok) {
           console.log('✅ WhatsApp enviado:', data.sid);
           toast.success('Mensagem WhatsApp enviada! 💬');
           return true;
         } else {
           console.error('❌ Erro ao enviar WhatsApp:', data);
           return false;
         }
       } catch (error) {
         console.error('❌ Erro ao enviar WhatsApp:', error);
         return false;
       }
     }
   }

   export const smsService = new SMSService();
   ```

5. **Use no login:**

   No arquivo `/App.tsx`, no método `handleQRValidated`:

   ```typescript
   import { smsService } from './lib/sms-service';

   const handleQRValidated = (user: any) => {
     // ... código existente ...

     // Envia SMS de login
     if (user.phone) {
       smsService.sendLoginSMS(user.phone, user.name);
     }

     // OU envia WhatsApp
     // smsService.sendLoginWhatsApp(user.phone, user.name);
   };
   ```

---

## ✅ Opção 2: WhatsApp Business API Cloud (Meta)

### Vantagens:
- ✅ **1.000 conversas grátis/mês**
- ✅ API oficial da Meta
- ✅ Integração nativa com WhatsApp

### Como Configurar:

1. **Crie conta:**
   - https://developers.facebook.com/
   - Crie um app de WhatsApp Business

2. **Configure:**
   - Pegue o Token de Acesso
   - ID do Número de Telefone

3. **Código:**

   ```typescript
   const WHATSAPP_TOKEN = 'SEU_TOKEN_AQUI';
   const PHONE_NUMBER_ID = 'SEU_PHONE_ID_AQUI';

   async function sendWhatsAppMessage(to: string, message: string) {
     const response = await fetch(
       `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
       {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           messaging_product: 'whatsapp',
           to: to,
           type: 'text',
           text: { body: message },
         }),
       }
     );

     return response.json();
   }
   ```

---

## ✅ Opção 3: Vonage (ex-Nexmo) - SMS

### Vantagens:
- ✅ €2 de crédito grátis
- ✅ SMS para 200+ países
- ✅ Preços competitivos

### Como usar:

1. Crie conta: https://www.vonage.com/
2. Pegue API Key + API Secret
3. Código:

   ```typescript
   const VONAGE_API_KEY = 'SUA_KEY';
   const VONAGE_API_SECRET = 'SEU_SECRET';

   async function sendSMS(to: string, text: string) {
     const response = await fetch('https://rest.nexmo.com/sms/json', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         api_key: VONAGE_API_KEY,
         api_secret: VONAGE_API_SECRET,
         to: to,
         from: 'LeadGenKW',
         text: text,
       }),
     });

     return response.json();
   }
   ```

---

## ✅ Opção 4: Z-API (WhatsApp - Brasileiro)

### Vantagens:
- ✅ **7 dias grátis**
- ✅ WhatsApp não-oficial (mais barato)
- ✅ Suporte em português
- ✅ Fácil de integrar

### Como usar:

1. Crie conta: https://www.z-api.io/
2. Conecte seu WhatsApp
3. Código:

   ```typescript
   const ZAPI_INSTANCE = 'SUA_INSTANCE';
   const ZAPI_TOKEN = 'SEU_TOKEN';

   async function sendZAPIWhatsApp(phone: string, message: string) {
     const response = await fetch(
       `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           phone: phone,
           message: message,
         }),
       }
     );

     return response.json();
   }
   ```

---

## 🎯 Resumo - Melhor Solução

| Opção | Custo Inicial | Melhor Para | Link |
|-------|--------------|-------------|------|
| **Twilio** | $15 grátis | SMS + WhatsApp internacional | [twilio.com](https://twilio.com) |
| **Meta WhatsApp** | 1.000 grátis/mês | Apenas WhatsApp oficial | [developers.facebook.com](https://developers.facebook.com) |
| **Z-API** | 7 dias grátis | WhatsApp Brasil (barato) | [z-api.io](https://z-api.io) |
| **Vonage** | €2 grátis | Apenas SMS | [vonage.com](https://vonage.com) |

### Recomendação:

**Para testes:** Use **Twilio** ($15 grátis)  
**Para produção:** Use **Meta WhatsApp API** (1.000 mensagens grátis/mês)

---

## 💡 Exemplo Completo de Integração

Adicione telefone no cadastro de usuário e envie notificações:

```typescript
// No /components/auth-page.tsx
const handleRegister = async () => {
  const newUser = {
    id: `user-${Date.now()}`,
    name: registerName,
    email: registerEmail,
    phone: '+351912345678', // ← ADICIONAR CAMPO DE TELEFONE
    password: registerPassword,
    twoFactorEnabled: false,
  };

  // ... salva usuário ...
};

// No /App.tsx
const handleQRValidated = (user: any) => {
  // Email (já funciona)
  emailService.sendLoginEmail(user.email, user.name);

  // SMS/WhatsApp (NOVO)
  if (user.phone) {
    smsService.sendLoginSMS(user.phone, user.name);
    // OU
    smsService.sendLoginWhatsApp(user.phone, user.name);
  }
};
```

---

## 📞 Suporte

- Twilio Docs: https://www.twilio.com/docs
- Meta WhatsApp: https://developers.facebook.com/docs/whatsapp
- Z-API Docs: https://developer.z-api.io/
