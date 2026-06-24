# 🚀 Guia Rápido: Configurar MongoDB Atlas (5 minutos)

## Por que MongoDB Atlas?

✅ **512MB gratuitos** (suficiente para ~10.000 leads)  
✅ **Acesso de qualquer dispositivo** (computador, tablet, telemóvel)  
✅ **Backup automático na nuvem**  
✅ **Sincronização em tempo real**  
✅ **Sem servidor** - usa Data API via HTTPS  
✅ **€0 / mês** para sempre (plano M0 Free)

---

## 📋 Passo a Passo

### **1. Criar Conta MongoDB Atlas**

1. Acesse: https://cloud.mongodb.com/v2/register
2. Registe-se com email ou Google/GitHub
3. Complete o questionário inicial (pode pular)

---

### **2. Criar Cluster Gratuito (M0)**

1. Clique em **"Build a Database"** ou **"Create"**
2. Escolha **M0 (FREE)**
3. Selecione:
   - **Cloud Provider**: AWS
   - **Region**: Europe → Frankfurt (mais próximo de Portugal)
   - **Cluster Name**: `Cluster0` (pode deixar default)
4. Clique em **"Create Cluster"** (demora ~3 minutos)

---

### **3. Configurar Acesso à Rede**

1. No menu lateral, clique em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Escolha **"Allow Access from Anywhere"**
   - Ou adicione manualmente: `0.0.0.0/0`
4. Clique em **"Confirm"**

⚠️ **Nota**: Isso permite acesso de qualquer IP. Para produção, restrinja aos IPs do escritório.

---

### **4. Ativar Data API**

1. No menu lateral, clique em **"Data API"**
2. Clique em **"Enable Data API"**
3. **Copie o URL Endpoint** (algo como):
   ```
   https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1
   ```
   ⚠️ **Guarde este URL!** Você vai precisar dele.

---

### **5. Criar API Key**

1. Ainda na página **Data API**, role até **"API Keys"**
2. Clique em **"Create API Key"**
3. Dê um nome: `AI-Leads-System`
4. **Copie a API Key** (algo como):
   ```
   EuFGtqGjh7N5xxxxxxxxxxxxxxx
   ```
   ⚠️ **IMPORTANTE**: Esta chave só aparece UMA VEZ. Guarde em local seguro!

---

### **6. Configurar no Sistema**

Agora volte para o sistema e:

1. Vá para a aba **"Dados"** → **"MongoDB Atlas"**
2. Cole o **URL Endpoint** no campo **"Data API URL Endpoint"**
3. Cole a **API Key** no campo **"API Key"**
4. Deixe os valores padrão:
   - **Data Source**: `Cluster0`
   - **Database Name**: `ai-leads-db`
5. Clique em **"Salvar Configuração"**
6. Clique em **"Testar Conexão"**

✅ Se aparecer "Conexão com MongoDB estabelecida!" → **Sucesso!**

---

### **7. Ativar Modo MongoDB**

1. Após teste bem-sucedido, o sistema automaticamente ativa MongoDB
2. Ou clique manualmente em **"Ativar MongoDB"**
3. Seus dados agora estão sendo salvos na nuvem! ☁️

---

## 🔄 Migrar Dados LocalStorage → MongoDB

Se você já tem dados no LocalStorage:

1. Vá para **Dados** → **Backup & Gestão**
2. Clique em **"Migrar Dados para MongoDB"**
3. Pronto! Todos os seus leads, atividades e configurações agora estão na nuvem

---

## 📊 Verificar Dados no MongoDB

Quer ver seus dados diretamente no MongoDB?

1. Vá para https://cloud.mongodb.com
2. Clique no seu cluster **"Cluster0"**
3. Clique em **"Browse Collections"**
4. Você verá:
   - `leads` - Todos os seus leads
   - `activities` - Histórico de atividades
   - `clusters` - Configurações dos 5 clusters
   - `config` - Configurações da IA, integrações, etc.

---

## 🛡️ Segurança

### **Suas credenciais estão seguras?**

✅ **API Key salva localmente** no seu navegador (localStorage)  
✅ **Conexões via HTTPS** (criptografadas)  
✅ **MongoDB Atlas tem certificação SOC 2 Type II**  

### **Para produção real:**
- Crie API Keys separadas por ambiente (dev/prod)
- Restrinja Network Access aos IPs do escritório
- Ative alertas de atividade suspeita

---

## 💡 Dicas Avançadas

### **Backup Automático**
MongoDB Atlas faz backup automático a cada 24h no plano M0 Free.

### **Ver Logs de Atividade**
1. MongoDB Atlas → Cluster → Metrics
2. Veja uso de armazenamento, queries/segundo, etc.

### **Limits do Plano Gratuito**
- **512 MB** de armazenamento
- **500 conexões simultâneas**
- **100 databases**
- **500 collections por database**

Para ~10.000 leads com histórico completo ≈ 50-100MB (sobra muito espaço!)

---

## ❓ Resolução de Problemas

### **Erro: "Invalid API Key"**
- Certifique-se que copiou a API Key completa
- Crie uma nova API Key se perdeu a original

### **Erro: "Network timeout"**
- Verifique se adicionou `0.0.0.0/0` no Network Access
- Aguarde 2-3 minutos após criar a regra

### **Erro: "Database not found"**
- O banco é criado automaticamente no primeiro uso
- Certifique-se que o nome é `ai-leads-db`

### **Como resetar tudo?**
1. No MongoDB Atlas: Database → Collections → Delete Database
2. No sistema: Dados → Apagar Todos os Dados
3. Recarregue a página

---

## 📞 Suporte

- **MongoDB Docs**: https://docs.atlas.mongodb.com/
- **Data API Docs**: https://docs.atlas.mongodb.com/api/data-api/
- **Community**: https://community.mongodb.com/

---

**Pronto! Seu sistema agora tem persistência de dados profissional e gratuita! 🎉**

Próximos passos:
1. ✅ Configure o MongoDB (5 min)
2. ✅ Migre seus dados
3. ✅ Faça teste criando um lead
4. ✅ Acesse de outro dispositivo para confirmar sincronização
5. 🚀 Escale quando precisar (upgrade para M10 = US$10/mês com 10GB)
