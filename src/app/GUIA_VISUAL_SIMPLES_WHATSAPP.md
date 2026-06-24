# 📱 GUIA SUPER SIMPLES - WhatsApp Oficial

## 🎯 PARA QUEM NÃO É TÉCNICO

Siga EXATAMENTE estes passos. Não precisa entender, só clicar onde indicado.

---

## 📋 VOCÊ VAI PRECISAR DE:

- [ ] Computador com internet
- [ ] Conta Facebook (a sua pessoal mesmo)
- [ ] Um número de telefone NOVO (chip que não usa WhatsApp)
- [ ] 30 minutos de tempo

⚠️ **IMPORTANTE:** O número NÃO pode estar no WhatsApp pessoal!

---

## 🚀 PASSO 1: CRIAR META BUSINESS

### 1.1 - Abrir Site

```
Cole no navegador (Chrome):
https://business.facebook.com/
```

### 1.2 - Fazer Login

- Use sua conta Facebook normal
- Digite email e senha
- Faça login

### 1.3 - Criar Conta Business

**Se aparecer botão "Criar conta":**

1. Clique: **"Criar conta"**
2. Preencha:
   ```
   Nome da empresa: KW Portugal AI LeadGen
   Seu nome: [Seu nome]
   Email de trabalho: [Seu email]
   ```
3. Clique: **"Enviar"**

**Se já tiver conta Business:**

- Pule para Passo 2

✅ **PRONTO! Conta Business criada.**

---

## 📱 PASSO 2: ADICIONAR WHATSAPP

### 2.1 - Abrir WhatsApp Manager

```
Cole este link DIRETO no navegador:
https://business.facebook.com/wa/manage/home/
```

### 2.2 - Primeira Vez?

**Se pedir "Começar":**

1. Clique: **"Começar"** ou **"Get started"**
2. Escolha: **"Criar uma conta do WhatsApp Business"**
3. Clique: **"Avançar"**

**Se já tem acesso:**

- Vá direto para 2.3

### 2.3 - Preencher Informações

**Tela: "Informações da empresa"**

Preencha:

```
Nome de exibição: AI LeadGen Pro
Fuso horário: (GMT+00:00) Lisboa
Categoria: Imóveis
Descrição: Plataforma de leads imobiliários
```

Clique: **"Avançar"**

### 2.4 - Adicionar Número

**Tela: "Adicionar número de telefone"**

1. Selecione país: **Portugal**
2. Digite número: **912345678** (seu número novo)
3. Método: Escolha **"Mensagem de texto (SMS)"**
4. Clique: **"Enviar código"**

⏱️ **Aguarde SMS chegar (1-2 minutos)**

### 2.5 - Verificar Código

**Você receberá SMS tipo:**

```
Código WhatsApp Business: 123-456
```

1. Digite os 6 números: **1 2 3 4 5 6**
2. Clique: **"Verificar"**

✅ **PRONTO! WhatsApp Business criado!**

---

## 🔑 PASSO 3: CRIAR APP (PARA PEGAR CREDENCIAIS)

### 3.1 - Abrir Meta for Developers

```
Cole no navegador:
https://developers.facebook.com/
```

### 3.2 - Fazer Login

- Mesmo login do Facebook
- Use a mesma conta

### 3.3 - Criar Primeiro App

**Canto superior direito:**

1. Clique: **"Meus apps"** (ou ícone de 9 quadradinhos)
2. Clique: **"Criar app"**

### 3.4 - Escolher Tipo

**Tela: "O que você deseja fazer?"**

1. Escolha: **"Empresa"** ou **"Business"**
2. Clique: **"Avançar"**

### 3.5 - Preencher Detalhes

**Tela: "Detalhes do app"**

```
Nome do app: AI LeadGen WhatsApp
Email de contato: [seu@email.com]
Conta do Business: KW Portugal AI LeadGen
```

Clique: **"Criar app"**

🔐 **Pode pedir senha do Facebook - digite sua senha**

✅ **App criado!**

---

## 📲 PASSO 4: CONECTAR WHATSAPP AO APP

### 4.1 - Adicionar Produto WhatsApp

**Você está no painel do app.**

Role a página até ver produtos disponíveis.

1. Encontre card: **"WhatsApp"**
2. Clique no botão: **"Configurar"**

### 4.2 - Selecionar Conta

**Tela: "Selecione uma conta do WhatsApp Business"**

1. Escolha: Sua conta (AI LeadGen Pro)
2. Clique: **"Continuar"**

✅ **WhatsApp conectado ao app!**

---

## 🎫 PASSO 5: COPIAR AS 3 CREDENCIAIS

**AGORA VOCÊ ESTÁ NESTA TELA:**

```
╔══════════════════════════════════════════╗
║  WhatsApp → API Setup                    ║
╚══════════════════════════════════════════╝
```

### 5.1 - CREDENCIAL 1: Token

**Procure seção: "Configuração temporária" ou "Temporary access token"**

Você verá:

```
Token de acesso temporário:
EAAABsbCS1iHgBO3kZBfxBxxxxxxxxxxxxxx...
[Copiar]
```

1. Clique: **"Copiar"**
2. Cole num arquivo de texto (Bloco de Notas)
3. Salve como: `credenciais.txt`

### 5.2 - CREDENCIAL 2: Phone Number ID

**Mesmo na página, role um pouco.**

Procure seção: **"De" ou "From"**

Você verá seu número e embaixo:

```
+351 912 345 678
Phone number ID: 123456789012345
```

1. Selecione o número: `123456789012345`
2. Copie (Ctrl+C)
3. Cole no arquivo `credenciais.txt`

### 5.3 - CREDENCIAL 3: Business Account ID

**DUAS FORMAS:**

**FORMA A - Pelo WhatsApp Manager:**

1. Abra nova aba: https://business.facebook.com/wa/manage/home/
2. Menu lateral → **"Configurações"** ou **"Settings"**
3. Primeira linha mostra: **"WhatsApp Business Account ID"**
4. Copie o número

**FORMA B - Pela URL:**

1. Ainda no WhatsApp Manager
2. Olhe a URL no navegador
3. Procure: `waba_id=XXXXXXXXX`
4. Copie os números do `XXXXXXXXX`

Cole no arquivo `credenciais.txt`

### 5.4 - Verificar Arquivo

**Seu arquivo `credenciais.txt` deve estar assim:**

```
TOKEN:
EAAABsbCS1iHgBO3kZBfxBxxxxxxxxxxxxxx...

PHONE_NUMBER_ID:
123456789012345

BUSINESS_ACCOUNT_ID:
987654321098765
```

✅ **Credenciais coletadas!**

---

## 💻 PASSO 6: CONFIGURAR NO PROJETO

### 6.1 - Abrir Terminal

**No Mac:**
- Pressione: `Cmd + Espaço`
- Digite: `Terminal`
- Enter

**No Windows:**
- Pressione: `Win + R`
- Digite: `cmd`
- Enter

### 6.2 - Navegar para Pasta

**Digite EXATAMENTE (linha por linha):**

```bash
cd [arraste a pasta do projeto aqui]
```

**Como arrastar:**
1. Abra o Finder/Explorer
2. Encontre pasta do projeto
3. Arraste para a janela do Terminal
4. Pressione Enter

**Depois:**

```bash
cd backend-whatsapp-oficial
```

### 6.3 - Copiar Template

**Digite:**

```bash
cp .env.example .env
```

Pressione: **Enter**

### 6.4 - Abrir Arquivo .env

**Digite:**

```bash
open .env
```

Pressione: **Enter**

**Abrirá num editor de texto.**

### 6.5 - Preencher Credenciais

**Você verá:**

```env
WHATSAPP_TOKEN=seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id_aqui
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_business_account_id_aqui
```

**Substitua (copie do arquivo credenciais.txt):**

```env
WHATSAPP_TOKEN=EAAABsbCS1iHgBO3kZBfxBxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
```

**Salve o arquivo:**
- Mac: `Cmd + S`
- Windows: `Ctrl + S`

**Feche o editor.**

### 6.6 - Instalar Dependências

**No Terminal, digite:**

```bash
npm install
```

Pressione: **Enter**

⏱️ **Aguarde 1-3 minutos** (vai baixar arquivos)

### 6.7 - Testar Credenciais

**Digite:**

```bash
npm test
```

Pressione: **Enter**

**DEVE APARECER:**

```
✅ WHATSAPP_TOKEN: EAAABsb...
✅ WHATSAPP_PHONE_NUMBER_ID: 123456789012345
✅ WHATSAPP_BUSINESS_ACCOUNT_ID: 987654321098765

📞 Testando Phone Number ID...
✅ Phone Number ID válido!

🏢 Testando Business Account ID...
✅ Business Account ID válido!

🎉 CONFIGURAÇÃO VÁLIDA!
```

✅ **SE VIU ISSO, DEU CERTO!**

❌ **SE DEU ERRO:**
- Verifique se copiou credenciais corretas
- Sem espaços extras
- Token completo

### 6.8 - Iniciar Servidor

**Digite:**

```bash
npm start
```

Pressione: **Enter**

**DEVE APARECER:**

```
╔═══════════════════════════════════════════════╗
║   🚀 WhatsApp Business API Oficial           ║
╚═══════════════════════════════════════════════╝

✅ Status: ONLINE
🌐 Port: 3002
```

✅ **SERVIDOR RODANDO!**

⚠️ **DEIXE O TERMINAL ABERTO! NÃO FECHE!**

---

## 🌐 PASSO 7: TESTAR NO NAVEGADOR

### 7.1 - Abrir Aplicação

**Abra Chrome e cole:**

```
http://localhost:5173
```

### 7.2 - Acessar WhatsApp

1. No menu lateral → **"Configurações"**
2. Ou procure → **"Integrações"**
3. Encontre card: **"WhatsApp Business API Oficial"**

### 7.3 - Verificar Status

**Deve mostrar:**

```
Status: ✅ Configurado
Phone Number ID: 123456789012345
```

### 7.4 - Enviar Teste

1. Digite número (com +351): **+351912345678**
2. Digite mensagem: **"Olá, teste!"**
3. Clique: **"Enviar Mensagem"**

⏱️ **Aguarde 3-5 segundos**

**Deve aparecer:**

```
✅ Mensagem enviada!
ID: wamid.HBgNMzUxOTE...
```

### 7.5 - Verificar WhatsApp

**Pegue o celular do número de teste**

Veja se recebeu a mensagem!

✅ **FUNCIONOU? PARABÉNS! TUDO PRONTO!** 🎉

---

## ❓ O QUE FAZER SE DER ERRO

### Erro: "Backend não está rodando"

**Solução:**
1. Volte no Terminal
2. Verifique se ainda está rodando
3. Se fechou, digite: `npm start`

### Erro: "Token inválido"

**Solução:**
1. Volte em: https://developers.facebook.com/
2. Seu app → WhatsApp → API Setup
3. Copie token novamente
4. Edite arquivo `.env`
5. Cole novo token
6. Salve
7. No Terminal: `Ctrl+C` (para servidor)
8. Digite: `npm start` (reinicia)

### Erro: "Template required"

**Solução:**
- Primeira mensagem só pode ser template
- Peça para pessoa responder "Oi"
- Depois pode enviar mensagens livres por 24h

### Erro: "Number not verified"

**Solução:**
1. https://business.facebook.com/wa/manage/phone-numbers/
2. Veja se número está: "✅ Verificado"
3. Se não, clique nele e verifique

---

## 🎉 PRONTO!

**VOCÊ CONSEGUIU! AGORA TEM:**

✅ Meta Business Account configurada
✅ WhatsApp Business API ativa
✅ App criado no Meta for Developers
✅ Credenciais coletadas
✅ Backend rodando
✅ Mensagens sendo enviadas

**NENHUM DESENVOLVEDOR NECESSÁRIO!** 🚀

---

## 📞 PRECISA DE AJUDA?

Se ficou travado em algum passo:

1. Veja qual PASSO você está
2. Tire print da tela
3. Anote a mensagem de erro (se tiver)
4. Me avise qual PASSO travou

**Eu te ajudo exatamente no ponto que travou!**

---

## 🔒 LEMBRE-SE:

❌ **NUNCA compartilhe:**
- Token de acesso
- Credenciais
- Senhas
- Com NINGUÉM (nem comigo!)

✅ **Você mesmo consegue fazer tudo!**

---

**Criado para: KW Portugal | AI LeadGen Pro**

**Você consegue! É só seguir os cliques!** 💪
