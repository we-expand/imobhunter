# 🚀 GUIA DE HOSPEDAGEM - HOSTGATOR.COM.BR

## 📋 **INFORMAÇÕES DO PROJETO**

```
Nome do Projeto: Imob Hunter
Domínio: imobhunter.io
Plataforma: React + Supabase (Backend as a Service)
Tipo: SaaS Web Application
```

---

## ⚠️ **IMPORTANTE: LIMITAÇÕES DO HOSTGATOR**

### **❌ O QUE O HOSTGATOR NÃO SUPORTA:**

```
1. Edge Functions (Deno/Node.js serverless) ❌
2. Banco de dados PostgreSQL gerenciado ❌
3. WebSockets em tempo real ❌
4. Supabase Auth nativo ❌
5. Real-time subscriptions ❌
```

### **✅ O QUE O HOSTGATOR SUPORTA:**

```
1. Hospedagem de sites estáticos (HTML/CSS/JS) ✅
2. PHP + MySQL ✅
3. cPanel para gerenciamento ✅
4. Certificado SSL grátis ✅
5. Domínios personalizados ✅
```

---

## 🎯 **ARQUITETURA RECOMENDADA**

Como seu projeto usa **Supabase** (backend serverless), você precisa de uma arquitetura híbrida:

```
┌─────────────────────────────────────────┐
│         ARQUITETURA IMOB HUNTER         │
├─────────────────────────────────────────┤
│                                         │
│  FRONTEND (Hostgator)                   │
│  └─ imobhunter.io                       │
│     └─ React Build estático             │
│     └─ HTML + CSS + JS                  │
│                                         │
│  ↓↓↓ (API calls via HTTPS) ↓↓↓         │
│                                         │
│  BACKEND (Supabase)                     │
│  └─ Edge Functions                      │
│  └─ PostgreSQL Database                 │
│  └─ Authentication                      │
│  └─ Storage                             │
│                                         │
└─────────────────────────────────────────┘
```

**TRADUÇÃO:**
- **Hostgator** = Serve o site (HTML/CSS/JS)
- **Supabase** = Processa dados, autenticação, banco

---

## 📦 **PASSO 1: PREPARAR O BUILD DO REACT**

### **1.1. Fazer Build de Produção**

```bash
# No seu projeto local:
npm run build

# Isso vai gerar uma pasta /dist com:
/dist
  ├── index.html
  ├── assets/
  │   ├── index-abc123.js
  │   ├── index-def456.css
  │   └── ...
  └── favicon.ico
```

### **1.2. Verificar se o build funciona localmente**

```bash
# Testar o build:
npx serve dist

# Abrir: http://localhost:3000
# Verificar se o site carrega corretamente
```

---

## 🌐 **PASSO 2: CONFIGURAR DOMÍNIO NO HOSTGATOR**

### **2.1. Adicionar Domínio no cPanel**

```
1. Login no cPanel do Hostgator
2. Procurar: "Domínios" ou "Addon Domains"
3. Adicionar novo domínio:
   - Domínio: imobhunter.io
   - Subdomínio: (deixar vazio)
   - Document Root: /public_html/imobhunter.io
```

### **2.2. Configurar DNS no Registro.br (ou onde comprou)**

Se você comprou **imobhunter.io** em outro lugar (não no Hostgator):

```
1. Ir no painel onde comprou o domínio
2. Configurar DNS:
   
   Tipo: A
   Nome: @
   Valor: [IP do Hostgator]
   
   Tipo: A
   Nome: www
   Valor: [IP do Hostgator]
   
   TTL: 3600
```

**Como descobrir o IP do Hostgator:**
- cPanel → Informações da Conta → IP do Servidor
- Ou perguntar ao suporte

### **2.3. Aguardar Propagação DNS**

```
Tempo de propagação: 4-48 horas
Verificar: https://dnschecker.org
Digite: imobhunter.io
```

---

## 📤 **PASSO 3: FAZER UPLOAD DO SITE**

### **OPÇÃO A: Upload via FileZilla (FTP)**

```
1. Baixar FileZilla: https://filezilla-project.org
2. Conectar:
   - Host: ftp.imobhunter.io ou [IP do servidor]
   - Usuário: [seu usuário cPanel]
   - Senha: [sua senha cPanel]
   - Porta: 21

3. Navegar até: /public_html/imobhunter.io

4. Fazer upload de TODOS os arquivos da pasta /dist:
   ├── index.html
   ├── assets/
   └── ...
```

### **OPÇÃO B: Upload via cPanel File Manager**

```
1. Login no cPanel
2. Procurar: "Gerenciador de Arquivos"
3. Navegar até: /public_html/imobhunter.io
4. Clicar em "Upload"
5. Arrastar a pasta /dist (ou selecionar arquivos)
6. Aguardar upload completar
```

---

## ⚙️ **PASSO 4: CONFIGURAR .HTACCESS (SPA ROUTING)**

Como você tem um **SPA (Single Page Application)** com React Router, precisa configurar:

### **4.1. Criar arquivo .htaccess**

No cPanel File Manager, criar arquivo `.htaccess` em `/public_html/imobhunter.io`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Se o arquivo ou diretório existe, serve diretamente
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Caso contrário, redireciona para index.html
  RewriteRule . /index.html [L]
</IfModule>

# Segurança
<IfModule mod_headers.c>
  # CORS (se necessário)
  Header set Access-Control-Allow-Origin "*"
  
  # Segurança Headers
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>

# Cache de assets estáticos
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

---

## 🔒 **PASSO 5: ATIVAR SSL (HTTPS)**

### **5.1. SSL Grátis Let's Encrypt**

```
1. cPanel → SSL/TLS Status
2. Procurar domínio: imobhunter.io
3. Clicar em "Run AutoSSL"
4. Aguardar instalação (5-10 minutos)
```

### **5.2. Forçar HTTPS**

Adicionar no `.htaccess`:

```apache
# Forçar HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## 🔧 **PASSO 6: CONFIGURAR VARIÁVEIS DE AMBIENTE**

Como você usa Supabase, precisa configurar as chaves de API.

### **⚠️ PROBLEMA:**

Hostgator **não suporta** variáveis de ambiente como `.env` em sites estáticos.

### **✅ SOLUÇÕES:**

#### **OPÇÃO 1: Hardcode no Build (Recomendado para produção)**

Editar `vite.config.ts` ou criar arquivo de config:

```typescript
// /src/config/production.ts
export const config = {
  supabaseUrl: 'https://[SEU-PROJECT-ID].supabase.co',
  supabaseAnonKey: '[SUA-ANON-KEY]',
  projectId: '[SEU-PROJECT-ID]'
};
```

Depois fazer build:

```bash
npm run build
```

#### **OPÇÃO 2: Usar Secrets Manager (Mais seguro)**

Se quiser esconder as keys do código-fonte, use um serviço como:
- **Vercel** (hospeda o frontend)
- **Netlify** (hospeda o frontend)
- **Cloudflare Pages**

**MAS** isso significa não usar Hostgator para o frontend.

---

## 🧪 **PASSO 7: TESTAR O SITE**

### **7.1. Checklist de Testes**

```
✅ Site carrega em https://imobhunter.io
✅ Login funciona
✅ Busca de leads funciona
✅ Dashboard carrega
✅ Imagens aparecem
✅ Não há erros no console (F12)
✅ SSL ativo (cadeado verde)
✅ Rotas funcionam (ex: /dashboard, /search)
```

### **7.2. Testar Performance**

```
https://pagespeed.web.dev
Digite: imobhunter.io
Verificar score > 80
```

---

## 🐛 **TROUBLESHOOTING**

### **Erro: "404 Not Found" ao acessar /dashboard**

**CAUSA:** `.htaccess` não está configurado

**SOLUÇÃO:**
1. Criar `.htaccess` conforme Passo 4
2. Verificar se `mod_rewrite` está ativo (padrão no Hostgator)

---

### **Erro: "Mixed Content" (HTTP em vez de HTTPS)**

**CAUSA:** Site carregado via HTTP

**SOLUÇÃO:**
1. Forçar HTTPS no `.htaccess`
2. Verificar se SSL está ativo
3. Limpar cache do navegador (Ctrl+Shift+R)

---

### **Erro: "API calls falham" ou "CORS error"**

**CAUSA:** Supabase bloqueando requisições

**SOLUÇÃO:**
1. Ir no Supabase Dashboard
2. Settings → API
3. Adicionar `imobhunter.io` na whitelist de domínios
4. Verificar se `publicAnonKey` está correto

---

### **Erro: "Site não carrega CSS/JS"**

**CAUSA:** Caminho dos assets incorreto

**SOLUÇÃO:**
1. Verificar se arquivos estão em `/public_html/imobhunter.io/assets/`
2. Verificar no HTML se o caminho é relativo: `/assets/...`
3. Recompilar com `npm run build` e fazer upload novamente

---

## 📊 **PASSO 8: MONITORAMENTO**

### **8.1. Google Analytics**

Adicionar no `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### **8.2. Uptime Monitoring**

Usar serviços gratuitos:
- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://pingdom.com
- Configurar para monitorar `https://imobhunter.io`

---

## 💰 **CUSTOS ESTIMADOS**

```
Hostgator Plano M:
- R$ 13,99/mês (promoção)
- SSL grátis
- Domínios ilimitados
- Tráfego ilimitado

Domínio .io:
- ~$30-40 USD/ano
- Renovação: ~$60 USD/ano

Supabase:
- Plano Free: $0/mês
- Pro: $25/mês (se precisar)

TOTAL MENSAL:
- Hostgator: R$ 13,99
- Domínio: ~R$ 20/mês (amortizado)
- Supabase: $0
TOTAL: ~R$ 34/mês
```

---

## 🚀 **ALTERNATIVAS RECOMENDADAS**

Se você quer evitar configuração manual e ter melhor desempenho:

### **OPÇÃO 1: Vercel (Recomendado)**

```
✅ Deploy automático do GitHub
✅ SSL automático
✅ CDN global
✅ Edge Functions suportadas
✅ Variáveis de ambiente
✅ GRÁTIS para projetos pessoais

Como usar:
1. Conectar GitHub ao Vercel
2. Importar repositório
3. Vercel faz build e deploy automaticamente
4. Domínio customizado: imobhunter.io
```

### **OPÇÃO 2: Netlify**

```
✅ Similar ao Vercel
✅ GRÁTIS
✅ Formulários integrados
✅ CDN global

Como usar:
1. Conectar GitHub
2. Deploy automático
3. Configurar domínio
```

### **OPÇÃO 3: Cloudflare Pages**

```
✅ GRÁTIS ilimitado
✅ CDN global (melhor do mundo)
✅ Workers (edge functions)
✅ Zero configuração

Como usar:
1. Conectar GitHub
2. Deploy automático
```

---

## 🎯 **RECOMENDAÇÃO FINAL**

### **SE VOCÊ JÁ TEM HOSTGATOR:**

```
✅ Use Hostgator APENAS para o site estático (frontend)
✅ Mantenha Supabase para backend/API
✅ Siga os passos acima
✅ Tempo estimado: 2-3 horas
```

### **SE AINDA NÃO COMPROU HOSTGATOR:**

```
⭐ RECOMENDO USAR VERCEL ou NETLIFY:
   - Mais fácil
   - Mais rápido
   - GRÁTIS
   - Melhor performance
   - Deploy automático do GitHub
   - Menos manutenção

   Você pode usar o domínio imobhunter.io
   em qualquer uma dessas plataformas!
```

---

## 📞 **PRECISA DE AJUDA?**

### **Suporte Hostgator:**
- Chat 24/7: https://www.hostgator.com.br
- Telefone: 0800 942 0170
- Email: suporte@hostgator.com

### **Documentação:**
- Hostgator cPanel: https://www.hostgator.com.br/ajuda
- Supabase Docs: https://supabase.com/docs

---

## ✅ **CHECKLIST FINAL**

Antes de ir ao ar:

- [ ] Build do React sem erros
- [ ] Domínio apontando para Hostgator
- [ ] SSL ativo (HTTPS)
- [ ] `.htaccess` configurado (SPA routing)
- [ ] Supabase configurado (URL + Keys)
- [ ] Site testado em diferentes navegadores
- [ ] Performance > 80 no PageSpeed
- [ ] Google Analytics configurado (opcional)
- [ ] Backup do código no GitHub
- [ ] Monitoramento de uptime ativo

---

**BOA SORTE COM O IMOB HUNTER! 🚀**

**Se tiver dúvidas, me avise!**
