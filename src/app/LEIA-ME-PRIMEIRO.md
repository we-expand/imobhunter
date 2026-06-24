# 🎯 LEIA-ME PRIMEIRO - Guia Rápido para Testes

## ✅ O que foi implementado agora:

### 1. ✅ **Alt+Tab corrigido** - Não desloga mais ao trocar de aba
   - Tempo de inatividade aumentado para **5 minutos**
   - Detecta apenas inatividade REAL (sem mouse/teclado)
   - Trocar de aba/janela NÃO desloga mais

### 2. ✅ **Código 2FA melhorado** - Layout moderno com espaçamento
   - Formato visual: `123 456` (com espaço)
   - Input maior e mais legível (texto 3xl)
   - Indicador de progresso com bolinhas
   - Pressione **ENTER** para validar
   - Foco automático no campo

### 3. ✅ **Sistema de Trial de 10 dias**
   - Trial inicia automaticamente no primeiro acesso
   - Badge no header mostra dias restantes (clique para ver detalhes)
   - Após 10 dias, plataforma sai do ar automaticamente
   - Alertas automáticos de expiração

### 4. ✅ **Reset Total da Plataforma**
   - Acesse: **Dados → Zona de Perigo → Reset Total da Plataforma**
   - Apaga TUDO: usuários, leads, atividades, trial, configurações
   - Plataforma volta ao estado inicial
   - Tripla confirmação de segurança

### 5. ✅ **Emails de login funcionando** (precisa configurar)
   - Edite `/lib/email-service.ts`
   - Adicione sua API key do Resend
   - Emails automáticos ao fazer login

### 6. 📄 **Documentação completa criada:**
   - `CONFIGURAR-URL-MASKING.md` - Como mascarar URL (Cloudflare grátis)
   - `CONFIGURAR-SMS-WHATSAPP.md` - Como enviar SMS/WhatsApp ao logar
   - `CONFIGURAR-EMAILS.md` - Como configurar emails (Resend)

---

## 🚀 Como iniciar os testes:

### Passo 1: Resetar plataforma (começar do zero)

1. Faça login com qualquer conta existente
2. Vá em: **Dados** (última aba)
3. Role até **Zona de Perigo**
4. Clique em: **🔴 RESETAR PLATAFORMA COMPLETA**
5. Confirme 3 vezes
6. Plataforma será resetada e recarregada

### Passo 2: Criar sua conta

1. Clique em "Começar Agora" na landing page
2. Registre-se com **SEU EMAIL** e **SEUS DADOS**
3. Configure 2FA:
   - Escaneie QR Code com Google Authenticator
   - Digite o código de 6 dígitos
   - Pressione ENTER para validar

### Passo 3: Testar funcionalidades

1. ✅ Dashboard em tempo real
2. ✅ Busca inteligente de leads
3. ✅ Centro de comando da IA
4. ✅ Pipeline de aquecimento
5. ✅ Integrações (Apollo.io, MongoDB)
6. ✅ Validação de telefones
7. ✅ Conformidade RGPD Portugal
8. ✅ Segurança e 2FA

---

## ⏰ Trial de 10 dias:

- **Início:** Automático no primeiro acesso
- **Duração:** 10 dias corridos
- **Avisos:** Badge no header mostra dias restantes
- **Expiração:** Plataforma desativa automaticamente
- **Verificar:** Clique no badge "🕐 Trial: X dias" no header

---

## 📧 Como receber emails de login:

### Opção 1: Resend (Gratuito - Recomendado)

1. Crie conta: https://resend.com
2. Pegue sua API key
3. Edite `/lib/email-service.ts`:
   ```typescript
   const RESEND_API_KEY = 'SUA_API_KEY_AQUI'; // ← Cole aqui
   ```
4. Emails serão enviados automaticamente!

### Emails que serão enviados:
- ✅ Confirmação de cadastro
- ✅ 2FA ativado
- ✅ Login detectado
- ✅ Lead pronto para handover
- ✅ Logout realizado

**Veja mais em:** `CONFIGURAR-EMAILS.md`

---

## 📱 Como receber SMS/WhatsApp ao logar:

**NÃO IMPLEMENTADO AINDA** - Precisa de API externa

**Opções gratuitas:**
1. **Twilio** - $15 grátis para testes
2. **Meta WhatsApp API** - 1.000 mensagens grátis/mês
3. **Z-API** - WhatsApp brasileiro, 7 dias grátis

**Veja tutorial completo em:** `CONFIGURAR-SMS-WHATSAPP.md`

---

## 🌐 Como mascarar a URL (esconder do cliente):

**Opções 100% GRATUITAS:**

### Cloudflare Pages (Recomendado):
1. Crie conta: https://cloudflare.com
2. Deploy seu projeto
3. Recebe URL: `https://leadgen-kw.pages.dev`
4. Proteção DDoS + SSL grátis
5. Cliente nunca vê URL do Figma

### Outras opções:
- Vercel: `https://seu-projeto.vercel.app`
- Netlify: `https://seu-projeto.netlify.app`

**Veja tutorial completo em:** `CONFIGURAR-URL-MASKING.md`

---

## 🎯 Checklist de Testes:

### ✅ Autenticação e Segurança
- [ ] Criar conta nova
- [ ] Configurar 2FA com QR Code
- [ ] Validar código de 6 dígitos
- [ ] Pressionar ENTER para validar
- [ ] Fazer logout
- [ ] Fazer login novamente
- [ ] Verificar email de login (se configurado)
- [ ] Testar Alt+Tab (NÃO deve deslogar)
- [ ] Esperar 5 minutos sem mexer (deve deslogar)

### ✅ Dashboard e KPIs
- [ ] Ver métricas em tempo real
- [ ] Ativar/pausar IA
- [ ] Verificar badge de trial no header
- [ ] Clicar no badge de trial (ver detalhes)

### ✅ Busca e Leads
- [ ] Buscar leads por cluster
- [ ] Aplicar filtros
- [ ] Validar telefones portugueses
- [ ] Ver detalhes de lead
- [ ] Fazer handover de lead

### ✅ IA e Pipeline
- [ ] Ativar IA automática
- [ ] Ver cadências multi-canal
- [ ] Configurar personalidades
- [ ] Ver pipeline: Frio → Conversa → Qualificado → Handover

### ✅ Integrações
- [ ] Configurar Apollo.io (opcional)
- [ ] Configurar MongoDB Atlas (opcional)
- [ ] Testar validação de telefones
- [ ] Verificar conformidade RGPD

### ✅ Dados e Backup
- [ ] Exportar backup
- [ ] Importar backup
- [ ] Carregar dados demo
- [ ] Adicionar lead simulado
- [ ] **ÚLTIMO:** Resetar plataforma completa

---

## 🔴 IMPORTANTE - Trial de 10 dias:

### Como funciona:
1. Trial inicia automaticamente no primeiro acesso
2. Badge no header mostra: `🕐 Trial: 10 dias`
3. Diminui automaticamente a cada dia
4. Quando chegar a **0 dias**:
   - Plataforma desativa automaticamente
   - Usuário é deslogado
   - Não é possível fazer login
   - Mensagem: "Período de testes expirado"

### Para resetar o trial (apenas desenvolvimento):
1. Console do navegador (F12)
2. Digite:
   ```javascript
   localStorage.removeItem('trial-start-date');
   localStorage.removeItem('trial-active');
   location.reload();
   ```

---

## 📂 Arquivos Importantes:

| Arquivo | O que faz |
|---------|-----------|
| `/lib/email-service.ts` | Configurar emails (Resend) |
| `/lib/trial-manager.ts` | Sistema de trial de 10 dias |
| `/lib/session-manager.ts` | Gestão de inatividade (5 min) |
| `/components/qr-validation-modal.tsx` | Modal de 2FA melhorado |
| `/components/data-manager.tsx` | Reset de plataforma |
| `CONFIGURAR-EMAILS.md` | Tutorial de emails |
| `CONFIGURAR-SMS-WHATSAPP.md` | Tutorial de SMS/WhatsApp |
| `CONFIGURAR-URL-MASKING.md` | Tutorial de URL masking |

---

## 💡 Dicas Importantes:

### Para o cliente testar por 10 dias:
1. ✅ Resete a plataforma (Dados → Reset)
2. ✅ Crie conta com email do cliente
3. ✅ Configure 2FA
4. ✅ Cliente tem 10 dias de acesso
5. ✅ Após 10 dias, plataforma sai do ar automaticamente

### Para recomeçar do zero:
- Use o botão **🔴 RESETAR PLATAFORMA COMPLETA**
- Apaga tudo e recomeça trial
- Útil para testes múltiplos

### Para produção final:
1. Configure email no Resend
2. (Opcional) Configure SMS/WhatsApp
3. Deploy no Cloudflare Pages (URL masking)
4. Remova botão de reset (segurança)

---

## 🆘 Problemas Comuns:

### "Tela do Figma ficou em branco"
- **Normal:** Espere ~40 segundos, volta sozinho
- **Causa:** Figma às vezes recarrega automaticamente
- **Solução:** Aguardar ou recarregar página (F5)

### "Não recebi email de login"
- **Causa:** API key do Resend não configurada
- **Solução:** Configure em `/lib/email-service.ts`
- **Ver:** `CONFIGURAR-EMAILS.md`

### "Deslogou ao dar Alt+Tab"
- **Corrigido!** Isso não deve mais acontecer
- **Se acontecer:** Reporte como bug

### "Trial expirou antes de 10 dias"
- Verificar data no console:
  ```javascript
  console.log(new Date(parseInt(localStorage.getItem('trial-start-date'))));
  ```
- Resetar trial se necessário (ver acima)

---

## 📞 Próximos Passos:

### Agora (Testes):
1. ✅ Resetar plataforma
2. ✅ Criar conta com seu email
3. ✅ Testar por 10 dias
4. ✅ Verificar todos os recursos

### Depois (Produção):
1. Configurar emails (Resend)
2. (Opcional) Configurar SMS/WhatsApp
3. Deploy no Cloudflare Pages
4. Adicionar domínio personalizado
5. Remover botão de reset

---

## 🎉 TUDO PRONTO!

A plataforma está 100% funcional para testes reais de 10 dias.

**Boa sorte com os testes! 🚀**
