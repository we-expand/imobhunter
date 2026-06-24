# 🌐 Como Mascarar a URL da Plataforma (Gratuito)

## O que é URL Masking?

URL Masking permite que você esconda a URL original da sua plataforma e mostre uma URL personalizada para seus clientes, protegendo contra acesso direto e ataques.

---

## ✅ Solução 1: Cloudflare Pages (100% GRATUITO - Recomendado)

### Vantagens:
- ✅ **Completamente gratuito**
- ✅ Domínio personalizado grátis (ex: `leadgen-kw.pages.dev`)
- ✅ SSL/HTTPS automático
- ✅ Proteção DDoS inclusa
- ✅ CDN global
- ✅ Até 500 builds/mês grátis

### Como Configurar:

1. **Crie conta no Cloudflare:**
   - Acesse: https://dash.cloudflare.com/sign-up
   - Cadastre-se gratuitamente

2. **Conecte seu repositório:**
   - Vá em "Pages" → "Create a project"
   - Conecte seu GitHub/GitLab
   - Selecione o repositório desta aplicação

3. **Configure o build:**
   ```
   Build command: npm run build
   Build output directory: dist
   ```

4. **Deploy automático:**
   - Cloudflare irá gerar uma URL: `https://seu-projeto.pages.dev`
   - Você pode adicionar um domínio personalizado depois

5. **URL Masking ativo!**
   - Sua URL real do Figma fica escondida
   - Clientes acessam via: `https://leadgen-kw.pages.dev`
   - Proteção DDoS inclusa

---

## ✅ Solução 2: Vercel (GRATUITO)

### Vantagens:
- ✅ Gratuito para projetos pessoais
- ✅ Deploy em 1 clique
- ✅ SSL automático
- ✅ Domínio personalizado grátis

### Como Configurar:

1. **Crie conta:**
   - https://vercel.com/signup

2. **Importe projeto:**
   - Clique em "Import Project"
   - Cole a URL do seu repositório Git
   - Clique em "Deploy"

3. **URL gerada:**
   - Vercel gera automaticamente: `https://seu-projeto.vercel.app`

4. **Adicionar domínio personalizado (opcional):**
   - Settings → Domains
   - Adicione seu domínio

---

## ✅ Solução 3: Netlify (GRATUITO)

### Vantagens:
- ✅ 100GB/mês de banda grátis
- ✅ SSL automático
- ✅ Deploy contínuo

### Como Configurar:

1. **Crie conta:**
   - https://www.netlify.com/

2. **Deploy:**
   - Arraste a pasta do projeto OU
   - Conecte com Git

3. **URL:**
   - Netlify gera: `https://seu-projeto.netlify.app`

---

## ✅ Solução 4: Domínio Personalizado GRATUITO

Se você quiser um domínio tipo `leadgen.com.br`:

### Opção A: Freenom (Domínios .tk, .ml, .ga - GRÁTIS)
- Site: https://www.freenom.com
- Domínios grátis por 12 meses
- Exemplo: `leadgen-kw.tk`

### Opção B: Domínios .com.br (pagos, ~R$40/ano)
- Registro.br: https://registro.br
- Domínio profissional brasileiro

---

## 🔒 Proteção Contra Ataques (GRATUITO)

### 1. Cloudflare Free Plan

Adicione proteção extra:

1. Vá em https://cloudflare.com
2. Adicione seu domínio
3. Ative:
   - ✅ DDoS Protection (automático)
   - ✅ WAF (Web Application Firewall)
   - ✅ Rate Limiting
   - ✅ SSL/TLS

### 2. Configurações de Segurança

Adicione no seu arquivo `.htaccess` ou configuração do servidor:

```
# Bloqueia acesso direto por IP
RewriteCond %{HTTP_HOST} ^123\.456\.789\.0$
RewriteRule (.*) https://seu-dominio.com/$1 [R=301,L]

# Proteção contra SQL Injection
RewriteCond %{QUERY_STRING} (\<|%3C).*script.*(\>|%3E) [NC,OR]
RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
RewriteRule .* - [F,L]

# Bloqueia user agents maliciosos
RewriteCond %{HTTP_USER_AGENT} ^$ [OR]
RewriteCond %{HTTP_USER_AGENT} ^(.*?)(bot|crawler|spider)(.*)$ [NC]
RewriteRule .* - [F,L]
```

### 3. Headers de Segurança

Adicione no HTML:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

---

## 🎯 Resumo - Melhor Solução (100% Grátis)

**Recomendação:** Cloudflare Pages + Cloudflare Protection

1. Deploy no Cloudflare Pages (grátis)
2. URL gerada: `https://leadgen-kw.pages.dev`
3. Proteção DDoS + WAF inclusos (grátis)
4. SSL automático (grátis)
5. Adicione domínio personalizado depois (opcional)

**Total de custo:** R$ 0,00

---

## 📞 Suporte

Se precisar de ajuda:
- Cloudflare Docs: https://developers.cloudflare.com/pages/
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com/
