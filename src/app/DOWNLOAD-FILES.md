# 📦 Lista de Arquivos para Download Manual

## 🎯 Arquivos Essenciais do Servidor

Se você optar por fazer upload manual, estes são os arquivos que você precisa:

### **Caminho no Figma Make: `/supabase/functions/server/`**

```
✅ ARQUIVOS PRINCIPAIS (OBRIGATÓRIOS):
├── index.tsx (2423 linhas) - Entry point do servidor
├── kv_store.tsx - Sistema de banco de dados
├── env-helper.ts - Gerenciador de variáveis de ambiente
│
✅ APIs E INTEGRAÇÕES:
├── pdl-linkedin-api.ts - 🆕 People Data Labs (NOVA!)
├── apollo-api.ts - Apollo.io
├── linkedin-api.ts - LinkedIn (legado)
├── web-search-service.ts - Busca web
│
✅ ROTAS E ENDPOINTS:
├── diagnostics-routes.ts - Rota de diagnóstico
├── search-routes.tsx - Busca avançada
├── real-search-routes.ts - Busca real
├── api-test-routes.tsx - Testes de API
├── linkedin-routes.ts - Rotas LinkedIn
├── linkedin-auth-routes.ts - Auth LinkedIn
├── excel-import-routes.ts - Import Excel
├── instagram-routes.ts - Instagram
├── ai-feedback-routes.ts - Feedback IA
├── ai-brain-routes.ts - Brain IA
├── auth-routes.ts - Autenticação
│
✅ LÓGICA DE NEGÓCIO:
├── intelligent-search.ts - Busca inteligente
├── ai-data-merger.ts - Merge de dados IA
├── leads-database.ts - Database de leads
├── lead-helpers.ts - Helpers de leads
├── demo-leads-generator.ts - Gerador de demos
├── simple-auth.ts - Auth simples
├── mock-data.ts - Dados mock
│
✅ ARQUIVOS DE CONFIGURAÇÃO:
├── VERSION.txt - Versão atual
├── DEPLOY_INFO.md - Info de deploy
├── test-startup.ts - Testes de startup
└── index-backup.tsx - Backup
```

---

## 📥 **Como Fazer Download**

### **No Figma Make:**

1. Clique com botão direito em cada arquivo
2. Selecione **"Download"** ou **"Save As"**
3. Salve numa pasta local: `~/Desktop/imobhunter-server/`

### **Estrutura de Pastas para Criar:**

```
~/Desktop/imobhunter/
└── supabase/
    └── functions/
        └── server/
            └── [TODOS OS ARQUIVOS ACIMA]
```

---

## 🚀 **Depois do Download**

### **Opção 1: Deploy via CLI**

```bash
cd ~/Desktop/imobhunter
supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
```

### **Opção 2: Criar Repositório GitHub**

```bash
cd ~/Desktop/imobhunter
git init
git add .
git commit -m "Initial commit: ImobHunter with PDL + RocketReach"
git remote add origin https://github.com/SEU_USUARIO/imobhunter.git
git push -u origin main
```

Depois conecte o Supabase ao GitHub para auto-deploy.

---

## 💡 **Atalho: Copiar Todos de Uma Vez**

Se você tiver acesso ao terminal do Figma Make:

```bash
# Criar arquivo ZIP
cd /supabase/functions
zip -r server.zip server/

# Baixar o ZIP
# Use a interface do Figma Make para baixar o arquivo server.zip
```

---

## ⚡ **Solução MAIS RÁPIDA (Sem Download)**

**Vou preparar um comando que você pode executar diretamente:**

```bash
# Este comando fará deploy DESTE ambiente direto para o Supabase
# Sem precisar baixar nada!
```

**Mas para isso funcionar, preciso saber:**
- Este ambiente Figma Make está conectado ao Supabase CLI?
- Você consegue executar comandos de terminal AQUI no Figma Make?

Se sim, posso criar um script que faz deploy direto! 🚀
