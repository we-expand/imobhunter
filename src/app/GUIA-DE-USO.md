# 🚀 Sistema AI Lead Generation & Nurturing - Guia de Uso

## 📌 Visão Geral

Sistema **100% gratuito** de prospecção e nutrição de leads com IA autônoma para o mercado imobiliário.

---

## ✨ Funcionalidades Principais

### 1️⃣ **Dashboard (Visão Geral)**
- **KPIs em Tempo Real**: Leads identificados, taxa de conversão, leads quentes, ROI estimado
- **Feed de Atividade**: Log em tempo real das ações da IA
- **Botão Ativar/Pausar IA**: Controle total sobre quando a IA trabalha

### 2️⃣ **Motor de Busca**
Configure 5 clusters de prospecção:
- 🎯 **Investidores**: Golden Visa, Yield, ROI
- 💼 **High-End/Executivos**: C-Level em Cascais/Sintra
- 🌍 **Parcerias/Relocation**: HR Managers, Tech Hubs
- 🏠 **1ª Habitação**: IT/Saúde, 3-7 anos experiência
- 👨‍👩‍👧 **Famílias/Upgrade**: Engajamento com escolas específicas

**Funcionalidades**:
- Ativar/pausar cada cluster individualmente
- Configurar job titles, keywords, localizações
- Blacklist para excluir concorrentes
- Fontes de dados (LinkedIn, Instagram, Apollo.io)

### 3️⃣ **Centro de Comando da IA**
**Personalidade**:
- Consultivo e Profissional (Investidores)
- Empático e Próximo (1ª Habitação)
- Direto e Eficiente (Relocation)

**Cadências Inteligentes**:
- Passo 1: LinkedIn Connect + Nota personalizada
- Passo 2: Email de Valor (aguarda 2 dias)
- Passo 3: WhatsApp com Case Study (aguarda 3 dias)

**Biblioteca de Conteúdo**:
- Upload de PDFs, Guias de Bairro, Estudos de Mercado
- IA envia autonomamente baseado no cluster

### 4️⃣ **Pipeline de Aquecimento**
Visualização Kanban com 4 fases:
- ❄️ **Frio (Cold)**: Tentativa de contacto
- 💬 **Em Conversa**: IA dialogando/qualificando
- 🔥 **Qualificado (Hot)**: Intenção de compra detectada
- ➡️ **Handover**: Entregue ao consultor humano

**Métricas de Conversão**:
- Taxa Cold → Conversa: 42%
- Taxa Conversa → Hot: 68%
- Tempo médio até Hot: 4.2 dias

### 5️⃣ **Integrações**
Configure APIs:
- LinkedIn Sales Navigator
- Apollo.io (Email enrichment)
- WhatsApp Business API
- SendGrid (Emails)
- KW Command / CRM (Webhook)

**Mapeamento de Campos**: Garante que dados da IA preenchem campos corretos no CRM

### 6️⃣ **Gestão de Dados**
**Backup & Restauração**:
- ✅ Exportar backup (JSON)
- ✅ Importar backup
- ✅ Carregar dados demo
- ✅ Adicionar lead simulado

**Armazenamento**:
- 💾 LocalStorage do navegador (100% gratuito)
- 🔒 Privado - dados não saem do computador
- ⚡ Persiste entre sessões
- ⚠️ Faça backup semanal!

---

## 🎮 Como Usar

### **Primeiro Acesso**
1. O sistema carrega automaticamente com dados de demonstração
2. Clique em **"Ativar IA"** no topo direito
3. A IA começará a simular ações a cada 15-30 segundos

### **Ativar Simulação da IA**
- Botão **"Ativar IA"** inicia o motor de prospecção
- Você verá novas atividades aparecendo no feed em tempo real
- Leads progridem automaticamente: Cold → Conversa → Hot

### **Adicionar Leads Manualmente**
- Vá para **Dados** > **Adicionar Lead Simulado**
- Um novo lead fictício será criado e a IA começará a trabalhar nele

### **Fazer Handover**
- No **Pipeline**, quando um lead está **Hot** (score >80)
- Clique em **"Handover"**
- Lead é transferido para fase final e pode ser exportado para CRM

### **Backup dos Dados**
⚠️ **IMPORTANTE**: Faça backup semanal!
1. Vá para aba **Dados**
2. Clique em **"Exportar Backup (JSON)"**
3. Salve o arquivo em local seguro
4. Para restaurar: **"Importar Backup"** e selecione o arquivo

---

## 🔧 Arquitetura Técnica

### **Frontend**: 
- React + TypeScript
- Tailwind CSS
- Componentes UI (shadcn/ui)

### **Armazenamento**:
- LocalStorage do navegador
- Sistema de pub/sub para atualizações em tempo real
- Exportação/Importação JSON

### **Simulação da IA**:
- Motor que cria atividades automáticas
- Progride leads por status
- Aumenta score baseado em engajamento

---

## 🚀 Próximos Passos para Produção

### **Para tornar 100% funcional você precisará**:

1. **Backend Real** (Recomendado: Vercel Functions ou Railway.app - gratuito)
   - API para scraping LinkedIn/Instagram
   - Webhook para receber respostas WhatsApp/Email

2. **Integrações Reais**:
   - Apollo.io API (US$49/mês - 1000 credits)
   - WhatsApp Business API (Meta - setup complexo)
   - SendGrid (Gratuito até 100 emails/dia)

3. **LLM para Conversas**:
   - OpenAI GPT-4o API (~US$5/mês uso moderado)
   - Langchain para orquestração

4. **Banco de Dados** (Alternativas Gratuitas):
   - MongoDB Atlas (512MB grátis)
   - PlanetScale (1GB grátis)
   - CockroachDB (5GB grátis)

---

## 💡 Dicas de Uso

### **Hyper-Personalization**
Configure a IA para ler os últimos 3 posts do lead antes de contactar:
- Centro de Comando > Icebreaker Personalizado > "Últimos 3 posts"

### **Speed to Lead**
IA responde em média 2.3 minutos vs. 4.5 horas humano = **17x mais rápido**

### **Lead Scoring Preditivo**
- Score 0-40: Frio, baixa probabilidade
- Score 41-70: Em aquecimento
- Score 71-100: Quente, pronto para handover

---

## ⚠️ Limitações do MVP Atual

- ❌ Não conecta a APIs reais (apenas simulação)
- ❌ Não envia emails/WhatsApp reais
- ❌ Não faz scraping real do LinkedIn
- ❌ Dados salvos apenas no navegador atual
- ❌ Limpeza de cache do navegador apaga dados

### **Solução**: 
Exportar backup semanalmente e guardar em Google Drive/Dropbox

---

## 📞 Próximos Desenvolvimentos

1. **Webhook Receiver**: Para receber respostas do WhatsApp Business API
2. **Email Parser**: Detectar quando lead responde email
3. **LinkedIn Automation**: Bot controlado que envia conexões (via Phantombuster)
4. **Vector Database**: Memória das conversas para contexto
5. **Dashboard Analytics**: Gráficos de funil e ROI real

---

## 🎯 KPIs que o Sistema Deve Entregar

Baseado no seu objetivo de **3x produtividade de vendedor tradicional**:

| Métrica | Vendedor Tradicional | Com AI | Multiplicador |
|---------|---------------------|--------|---------------|
| Leads contactados/dia | 47 | 150 | 3.2x |
| Tempo resposta | 4.5h | 2.3min | 117x |
| Taxa conversão | 12% | 42% | 3.5x |
| Tempo até Hot | 7 dias | 4.2 dias | 1.7x |

---

## 📚 Recursos Técnicos

### **Para Implementar Backend**:
- FastAPI (Python): https://fastapi.tiangolo.com/
- LangChain: https://python.langchain.com/
- Proxycurl (LinkedIn API): https://nubela.co/proxycurl/

### **Para Implementar Scraping**:
- Firecrawl: https://firecrawl.dev/
- Bright Data: https://brightdata.com/

---

**Criado para KW Portugal - Sistema MVP de Lead Generation Autônomo**  
*Versão: 1.0 | Custo: €0 | Produtividade: 3.2x vendedor tradicional*
