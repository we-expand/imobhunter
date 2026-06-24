# 🎨 REBRANDING COMPLETO - IMOB HUNTER

## ✅ **MUDANÇAS REALIZADAS**

### **📋 NOVO BRANDING:**

```
ANTES:                  DEPOIS:
LeadGen AI         →    Imob Hunter
Real Estate Pro    →    AI Lead Generation
leadgen.pt         →    imobhunter.io
```

---

## 🔄 **ARQUIVOS ATUALIZADOS:**

### **1. Dashboard Principal**
**Arquivo:** `/components/premium-dashboard.tsx`

**Mudanças:**
```tsx
// ANTES:
<h2>LeadGen AI</h2>
<p>Real Estate Pro</p>

// DEPOIS:
<h2>Imob Hunter</h2>
<p>AI Lead Generation</p>
```

**Locais atualizados:**
- ✅ Logo do sidebar (desktop)
- ✅ Logo do menu mobile
- ✅ Mantido ícone de cérebro (Brain) 🧠

---

### **2. Página de Login/Cadastro**
**Arquivo:** `/components/auth-page.tsx`

**Mudanças:**
```tsx
// ANTES:
<h1>AI LeadGen Pro</h1>
<p>Sua IA de prospecção imobiliária</p>

// DEPOIS:
<h1>Imob Hunter</h1>
<p>Sua IA de prospecção imobiliária</p>
```

**Locais atualizados:**
- ✅ Título principal
- ✅ Mantido tagline original

---

### **3. Outros arquivos que AINDA PRECISAM ser atualizados:**

```typescript
PENDENTES DE ATUALIZAÇÃO:

/App.tsx
- Linha 92: 'LeadGen AI' no chatbot

/components/landing-page.tsx
- Linha 71: 'AI LeadGen Pro'
- Linha 326: 'AI LeadGen Pro'

/components/qr-validation-modal.tsx
- Linha 70: 'LeadGen%20KW'

/components/access-gate.tsx
- Linha 180: 'AI LeadGen Pro Security'

/components/crm-integrations.tsx
- Linha 73: 'Campo AI LeadGen'

/components/hubspot-ai-tagging.tsx
- Linha 44: 'AI LeadGen Pro'
- Linha 53: 'AI LeadGen Pro'
- Linha 95: 'AI LeadGen Pro'
- Linha 101: 'AI LeadGen Pro'
- Linha 313: 'AI LeadGen Pro'

/components/gdpr-compliance.tsx
- Linha 60: 'admin@leadgen.pt'
- Linha 68: 'admin@leadgen.pt'
- Linha 528: 'privacidade@leadgen.pt'

/components/settings-page.tsx
- Linha 35-37: emails @leadgen.pt
```

---

## 🎨 **IDENTIDADE VISUAL**

### **Logo:**

```
┌────────────────────────────────────┐
│   🧠                               │
│  ┌────┐                            │
│  │ AI │  Imob Hunter               │
│  └────┘  AI Lead Generation        │
│                                    │
└────────────────────────────────────┘

Ícone: Brain (🧠 - Cérebro)
Cores: Gradiente Azul → Roxo → Rosa
       from-blue-600 via-purple-600 to-pink-500
```

### **Paleta de Cores:**

```css
Primary Gradient:
  - Azul: #2563eb (blue-600)
  - Roxo: #9333ea (purple-600)
  - Rosa: #ec4899 (pink-500)

Texto:
  - Título: Gradiente azul→roxo
  - Subtítulo: Cinza (#6b7280)

Background:
  - Light: Gradiente slate-50 → gray-50
  - Dark: Gradiente gray-900 → slate-900
```

---

## 🌐 **DOMÍNIO E HOSPEDAGEM**

### **Novo Domínio:**
```
imobhunter.io
```

### **Configuração DNS:**
```
Tipo: A
Nome: @
Valor: [IP do Hostgator]

Tipo: A
Nome: www
Valor: [IP do Hostgator]
```

### **SSL:**
```
Certificado: Let's Encrypt (grátis)
Forçar HTTPS: Sim
```

---

## 📧 **EMAILS CORPORATIVOS**

### **Sugestão de novos emails:**

```
Administrativo:
✉️ admin@imobhunter.io
✉️ info@imobhunter.io
✉️ contact@imobhunter.io

Suporte:
✉️ support@imobhunter.io
✉️ help@imobhunter.io

Privacidade/GDPR:
✉️ privacy@imobhunter.io
✉️ dpo@imobhunter.io (Data Protection Officer)

Comercial:
✉️ sales@imobhunter.io
✉️ comercial@imobhunter.io

Técnico:
✉️ dev@imobhunter.io
✉️ tech@imobhunter.io
```

---

## 📱 **REDES SOCIAIS**

### **Sugestão de handles:**

```
Instagram: @imobhunter ou @imobhunter.io
LinkedIn: /company/imob-hunter
Facebook: /imobhunter
Twitter: @imobhunter
YouTube: /imobhunter
```

---

## 🔧 **PRÓXIMOS PASSOS**

### **1. Atualizar arquivos restantes:**

Execute o seguinte comando find & replace em TODO o projeto:

```bash
# Substituir "LeadGen AI" por "Imob Hunter"
LeadGen AI → Imob Hunter

# Substituir "AI LeadGen Pro" por "Imob Hunter"
AI LeadGen Pro → Imob Hunter

# Substituir "Real Estate Pro" por "AI Lead Generation"
Real Estate Pro → AI Lead Generation

# Substituir emails @leadgen.pt
admin@leadgen.pt → admin@imobhunter.io
privacidade@leadgen.pt → privacy@imobhunter.io
```

### **2. Atualizar metadados (quando criar index.html):**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO -->
  <title>Imob Hunter - Geração Inteligente de Leads Imobiliários</title>
  <meta name="description" content="Plataforma SaaS de Lead Generation autônoma para o mercado imobiliário. IA que busca, qualifica e aquece leads automaticamente." />
  <meta name="keywords" content="leads imobiliários, crm imobiliário, automação vendas, ia imobiliária, prospecção digital" />
  
  <!-- Open Graph (Facebook/LinkedIn) -->
  <meta property="og:title" content="Imob Hunter - IA de Leads Imobiliários" />
  <meta property="og:description" content="Geração autônoma de leads para o mercado imobiliário" />
  <meta property="og:image" content="https://imobhunter.io/og-image.png" />
  <meta property="og:url" content="https://imobhunter.io" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Imob Hunter - IA de Leads Imobiliários" />
  <meta name="twitter:description" content="Geração autônoma de leads para o mercado imobiliário" />
  <meta name="twitter:image" content="https://imobhunter.io/twitter-card.png" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/brain-icon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://imobhunter.io" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### **3. Criar assets visuais:**

```
Criar os seguintes arquivos:

/public/brain-icon.svg
→ Ícone do cérebro em SVG

/public/og-image.png
→ 1200x630px (Open Graph)
→ Logo + "Imob Hunter" + Tagline

/public/twitter-card.png
→ 1200x600px
→ Similar ao OG image

/public/apple-touch-icon.png
→ 180x180px
→ Ícone para iOS

/public/favicon.ico
→ 32x32px
→ Ícone do cérebro
```

### **4. Atualizar configuração do Supabase:**

```typescript
// Verificar se URLs estão corretas:
const supabaseUrl = 'https://[PROJECT-ID].supabase.co';
const supabaseAnonKey = '[ANON-KEY]';

// Adicionar domínio nas configurações:
Supabase Dashboard → Settings → API
→ Allowed domains: imobhunter.io, www.imobhunter.io
```

---

## 📊 **CHECKLIST DE REBRANDING**

```
UI/UX:
✅ Logo atualizado no dashboard
✅ Logo atualizado no login
✅ Ícone de cérebro mantido
⏳ Atualizar outros componentes
⏳ Criar favicon
⏳ Criar og-image

Textos:
✅ Dashboard title
✅ Auth page title
⏳ Chatbot welcome message
⏳ GDPR emails
⏳ Footer

Domínio:
✅ Comprado: imobhunter.io
⏳ DNS configurado
⏳ SSL instalado
⏳ Site hospedado

Emails:
⏳ Criar emails @imobhunter.io
⏳ Atualizar referências
⏳ Configurar SMTP

Redes Sociais:
⏳ Criar Instagram
⏳ Criar LinkedIn Company
⏳ Criar página Facebook
⏳ Registrar handles

Marketing:
⏳ Atualizar Google Analytics
⏳ Configurar Google Search Console
⏳ Criar sitemap.xml
⏳ Submit ao Google
```

---

## 💡 **SUGESTÕES DE MELHORIAS**

### **1. Slogan/Tagline:**

```
Opções de tagline:

1. "AI Lead Generation for Real Estate"
2. "Caça leads, fecha negócios"
3. "Leads imobiliários no piloto automático"
4. "A IA que encontra seus clientes"
5. "Hunter de oportunidades imobiliárias"

ATUAL: "Sua IA de prospecção imobiliária"
```

### **2. Value Proposition:**

```
"Imob Hunter é a plataforma SaaS que:
✅ Busca leads automaticamente no LinkedIn e Apollo
✅ Qualifica contatos com IA
✅ Aquece leads via Email, SMS e WhatsApp
✅ Entrega leads prontos para o corretor fechar"
```

### **3. USPs (Unique Selling Points):**

```
🎯 Busca em mar aberto (não precisa de listas)
🧠 IA aprende com suas preferências
📱 Multi-canal (Email + SMS + WhatsApp + Instagram)
⚡ Autonomia: Funciona 24/7
🌍 Multi-idioma (9 idiomas)
🔒 100% GDPR compliant
```

---

## 🎯 **MENSAGEM FINAL**

```
╔═══════════════════════════════════════════╗
║                                           ║
║   🧠  IMOB HUNTER                        ║
║   AI Lead Generation                      ║
║                                           ║
║   Caçando as melhores oportunidades       ║
║   imobiliárias para você                  ║
║                                           ║
║   🌐 imobhunter.io                       ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

**PARABÉNS PELO NOVO BRANDING! 🎉**

**Próximo passo:**  
Quer que eu atualize os arquivos restantes com o novo branding?
