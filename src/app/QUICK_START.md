# ⚡ Quick Start - AI LeadGen Pro

## 🚀 Início Rápido (5 minutos)

### 1. Clone e Instale

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/ai-leadgen-pro.git
cd ai-leadgen-pro

# Instale dependências
npm install

# Copie o arquivo de ambiente
cp .env.example .env
```

### 2. Configure Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Deixe assim por enquanto (modo desenvolvimento sem backend)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
VITE_WHATSAPP_SERVER_URL=http://localhost:3001
```

### 3. Inicie o Projeto

```bash
npm run dev
```

Abra: http://localhost:5173

### 4. Faça Login

Use qualquer email/senha para criar uma conta de teste.

**Pronto! O sistema está rodando!** 🎉

---

## 📱 Para Ativar WhatsApp REAL

Siga o guia completo: [WHATSAPP_SETUP_GUIDE.md](./WHATSAPP_SETUP_GUIDE.md)

Resumo:
1. Criar projeto no Supabase (grátis)
2. Deploy servidor Node.js no Render.com (grátis)
3. Configurar `.env` com credenciais reais
4. Escanear QR Code com celular

**Tempo: ~15 minutos**

---

## 🎯 Principais Funcionalidades

- ✅ Dashboard com KPIs em tempo real
- ✅ Busca de leads (LinkedIn Sales Navigator simulado)
- ✅ Busca de empresas
- ✅ Pipeline visual (Frio → Conversa → Qualificado → Handover)
- ✅ 5 clusters de segmentação
- ✅ WhatsApp Business API (requer setup)
- ✅ Email multi-canal
- ✅ Atividade da IA em tempo real
- ✅ Conformidade LGPD/GDPR

---

## 📚 Documentação

- [WHATSAPP_SETUP_GUIDE.md](./WHATSAPP_SETUP_GUIDE.md) - Setup WhatsApp completo
- [backend-whatsapp/README.md](./backend-whatsapp/README.md) - Docs do servidor

---

## 🆘 Problemas Comuns

### Erro: "Cannot read properties of undefined"
**Solução:** Certifique-se que o arquivo `.env` existe na raiz do projeto

### WhatsApp não conecta
**Solução:** Você precisa configurar o backend primeiro (veja WHATSAPP_SETUP_GUIDE.md)

### Página em branco
**Solução:**
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 🔧 Modo Desenvolvimento vs Produção

### Desenvolvimento (Sem Backend)
- ✅ Interface completa funcionando
- ✅ Dados mockados (LocalStorage)
- ✅ Todas as telas navegáveis
- ⚠️ WhatsApp/Email são simulações

### Produção (Com Backend)
- ✅ Tudo do modo desenvolvimento +
- ✅ WhatsApp Business API REAL
- ✅ Email real via OAuth
- ✅ Banco de dados Supabase
- ✅ Mensagens automáticas funcionais

---

## 💡 Próximos Passos

1. **Explore a interface** - Navegue pelo dashboard
2. **Configure o WhatsApp** - Siga o guia de setup
3. **Adicione leads** - Teste a busca e pipeline
4. **Ative a IA** - Veja atividades em tempo real

---

**Boa sorte! 🚀**
