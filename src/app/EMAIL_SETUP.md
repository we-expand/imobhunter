# 📧 CONFIGURAÇÃO DE EMAILS - RESEND API

## 🎯 Sistema Multi-Canal Implementado

O sistema agora envia **emails automáticos** em TODAS as ações importantes:

✅ **Login** - Notificação de segurança  
✅ **2FA Configurado** - Confirmação de ativação  
✅ **IA Ativada** - Início da prospecção automática  
✅ **Lead Qualificado (Handover)** - Lead pronto para humano (CRÍTICO)  
✅ **Lead Respondeu** - Alerta de resposta  
✅ **Relatório Diário** - Resumo de atividades das últimas 24h  

---

## 🚀 CONFIGURAÇÃO RÁPIDA (5 minutos)

### **1️⃣ Criar Conta no Resend (GRÁTIS)**

- Acesse: **https://resend.com**
- Clique em **"Sign Up"**
- **Free Tier:** 3.000 emails/mês (suficiente para testes e MVP)
- ✅ Excelente deliverability
- ✅ Templates HTML profissionais
- ✅ API simples e moderna

---

### **2️⃣ Gerar API Key**

1. Faça login no dashboard: **https://resend.com/dashboard**
2. Menu lateral → **"API Keys"**
3. Clique em **"Create API Key"**
4. Dê um nome: `AI LeadGen Pro - Production`
5. **Copie a chave** (começa com `re_...`)
   - ⚠️ **IMPORTANTE:** A chave só aparece UMA VEZ! Copie agora.

---

### **3️⃣ Configurar Domínio (Opcional para Produção)**

**Para Testes:**
- Use o domínio padrão do Resend: `onboarding@resend.dev`
- Funciona imediatamente, sem configuração

**Para Produção:**
1. Menu lateral → **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio: `seudominio.com`
4. Configure os registros DNS:
   - **MX Record** (para receber bounces)
   - **DKIM Record** (autenticação)
   - **SPF Record** (anti-spam)
5. Aguarde verificação (pode levar alguns minutos)

---

### **4️⃣ Configurar no Código**

#### **Abra o arquivo:**
```
/lib/resend-email-service.ts
```

#### **Linha 17 - API Key:**
```typescript
const RESEND_API_KEY = 're_sua_api_key_aqui'; // ← Cole sua API key aqui
```

#### **Linha 18 - FROM Email:**

**Para Testes:**
```typescript
const FROM_EMAIL = 'AI LeadGen Pro <onboarding@resend.dev>';
```

**Para Produção:**
```typescript
const FROM_EMAIL = 'AI LeadGen Pro <noreply@seudominio.com>';
```

#### **Salve o arquivo!** 💾

---

## ✅ TESTAR A INTEGRAÇÃO

### **1. Via Dashboard (Recomendado)**

1. Faça login no sistema
2. Vá em **Configurações** (ícone de engrenagem)
3. Tab **"Integrações"**
4. Seção **"Sistema Multi-Canal de Notificações"**
5. Digite seu email no campo de teste
6. Clique em **"Testar"**
7. ✅ Verifique sua caixa de entrada!

### **2. Via Console do Navegador**

```javascript
// Abra o console (F12)
emailService.showConfigInstructions();
// Mostra instruções detalhadas

// Testar envio
await emailService.sendTestEmail('seu-email@exemplo.com', 'Seu Nome');
```

---

## 📧 TEMPLATES DISPONÍVEIS

Todos os templates são em **HTML profissional** com design responsivo:

| Template | Trigger | Conteúdo |
|----------|---------|----------|
| 🔐 **Login** | Usuário faz login | Notificação de segurança com data/hora |
| 🔒 **2FA Configurado** | Primeira ativação de 2FA | Confirmação com benefícios de segurança |
| 🤖 **IA Ativada** | Toggle IA ON | Resumo do que a IA vai fazer |
| 🔥 **Handover** | Lead qualificado | Dados completos do lead pronto |
| 💬 **Lead Respondeu** | Lead responde mensagem | Alerta com mensagem recebida |
| 📊 **Relatório Diário** | Automático (23:59) | Resumo de atividades do dia |

---

## 🔔 SISTEMA MULTI-CANAL

### **Canais de Comunicação:**

```
USUÁRIO ←→ SISTEMA
   ↓
   ├─ 📧 EMAIL (Resend)
   ├─ 🔔 TOAST (In-app)
   ├─ 📱 WhatsApp (futuro)
   └─ 💬 SMS (futuro)
```

### **Exemplo de Handover:**

Quando a IA qualifica um lead:

1. ✅ **Toast in-app:** "Lead qualificado!"
2. ✅ **Email:** Template completo com dados do lead
3. ✅ **Console:** Log detalhado para debug
4. 🔜 **WhatsApp:** Mensagem no celular
5. 🔜 **SMS:** Alerta via SMS

---

## 📊 MONITORAMENTO

### **Console Logs:**

Todos os emails geram logs no console:

```
📧 [EMAIL SERVICE] Enviando email de handover para joao@kw.pt...
🔥 Lead: Maria Silva | Score: 85 | Cluster: High-End
✅ Email enviado com sucesso! ID: abc123...
```

### **Toast Notifications:**

```typescript
✅ Email de handover enviado!
   Notificação de Maria Silva enviada para joao@kw.pt
```

### **Dashboard Resend:**

- Acesse: **https://resend.com/emails**
- Veja todos os emails enviados
- Status: Delivered, Bounced, Opened, etc
- Taxa de entrega em tempo real

---

## 🐛 TROUBLESHOOTING

### **❌ "Erro ao enviar email"**

**Possíveis causas:**

1. **API Key inválida:**
   - Verifique se copiou corretamente
   - Começa com `re_`?
   - Sem espaços extras?

2. **FROM Email inválido:**
   - Use `onboarding@resend.dev` para testes
   - Ou configure seu domínio verificado

3. **Rate Limit (Free Tier):**
   - Máximo 3.000 emails/mês
   - Verifique no dashboard do Resend

### **❌ "Email não chega"**

**Checklist:**

1. ✅ Verifique SPAM/Lixo Eletrônico
2. ✅ Confirme email correto no teste
3. ✅ Aguarde 1-2 minutos (pode ter delay)
4. ✅ Veja logs no console (F12)
5. ✅ Confira dashboard do Resend

### **❌ Console: "Network Error"**

**Soluções:**

1. **Sem internet?** Verifique conexão
2. **Bloqueado por firewall?** Libere api.resend.com
3. **CORS?** Resend permite frontend, não deve dar erro

---

## 💰 PLANOS RESEND

| Plano | Preço | Emails/mês | Melhor Para |
|-------|-------|------------|-------------|
| **Free** | $0 | 3.000 | MVP, Testes |
| **Pro** | $20 | 50.000 | Startups |
| **Business** | $80 | 300.000 | Scale-ups |
| **Enterprise** | Custom | Ilimitado | Empresas |

**Para este MVP:** Free Tier é suficiente! 🎉

---

## 🔐 SEGURANÇA

### **Boas Práticas:**

✅ **NUNCA** comite API Key no Git  
✅ Use variáveis de ambiente em produção  
✅ Rotacione keys periodicamente  
✅ Use domínio verificado (não onboarding@resend.dev)  
✅ Monitore uso no dashboard  

### **Variáveis de Ambiente (Produção):**

```bash
# .env
RESEND_API_KEY=re_sua_api_key_aqui
FROM_EMAIL=noreply@seudominio.com
```

```typescript
// resend-email-service.ts
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_123456789';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
```

---

## 📚 RECURSOS

- **Documentação Resend:** https://resend.com/docs
- **API Reference:** https://resend.com/docs/api-reference
- **Dashboard:** https://resend.com/dashboard
- **Status Page:** https://status.resend.com
- **Suporte:** support@resend.com

---

## ✅ CHECKLIST FINAL

Antes de marcar como "CONFIGURADO":

- [ ] Conta criada no Resend
- [ ] API Key gerada e copiada
- [ ] API Key colada em `/lib/resend-email-service.ts` linha 17
- [ ] FROM_EMAIL configurado na linha 18
- [ ] Arquivo salvo
- [ ] Teste enviado via dashboard (Settings → Integrações)
- [ ] Email recebido na caixa de entrada
- [ ] Console sem erros
- [ ] Dashboard Resend mostra email enviado

---

## 🎉 PRONTO!

Agora seu sistema está 100% multi-canal:

✅ **Email** configurado (Resend)  
✅ **Toast** in-app funcionando  
✅ **Console logs** detalhados  
🔜 **WhatsApp** (próxima integração)  
🔜 **SMS** (próxima integração)  

**Todas as ações importantes geram notificações automáticas!** 🚀

---

**📧 Dúvidas?** Abra o console (F12) e digite:
```javascript
emailService.showConfigInstructions();
```
