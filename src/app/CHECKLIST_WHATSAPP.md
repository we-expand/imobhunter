# ✅ CHECKLIST - WhatsApp Oficial

**Imprima esta página e vá riscando conforme avança!**

---

## 📋 ANTES DE COMEÇAR

- [ ] Tenho conta Facebook
- [ ] Tenho 30 minutos livres
- [ ] Tenho número novo (chip)
- [ ] Número NÃO está no WhatsApp pessoal
- [ ] Computador com internet
- [ ] Acesso ao celular (para receber SMS)

---

## 🏢 ETAPA 1: META BUSINESS (10 MIN)

- [ ] Acessei: https://business.facebook.com/
- [ ] Fiz login com Facebook
- [ ] Cliquei "Criar conta"
- [ ] Preenchi nome empresa: "KW Portugal AI LeadGen"
- [ ] Preenchi meu nome
- [ ] Preenchi email
- [ ] Cliquei "Enviar"
- [ ] ✅ Conta Business criada

---

## 📱 ETAPA 2: WHATSAPP BUSINESS (10 MIN)

- [ ] Acessei: https://business.facebook.com/wa/manage/home/
- [ ] Cliquei "Começar" ou "Get started"
- [ ] Escolhi "Criar conta WhatsApp Business"
- [ ] Preenchi:
  - [ ] Nome: "AI LeadGen Pro"
  - [ ] Fuso: Lisboa
  - [ ] Categoria: Imóveis
  - [ ] Descrição: "Plataforma leads"
- [ ] Cliquei "Avançar"
- [ ] Selecionei país: Portugal
- [ ] Digitei número: _________________
- [ ] Escolhi método: SMS
- [ ] Cliquei "Enviar código"
- [ ] Recebi SMS no celular
- [ ] Digitei código: [ ][ ][ ][ ][ ][ ]
- [ ] Cliquei "Verificar"
- [ ] ✅ Número verificado

---

## 🔧 ETAPA 3: CRIAR APP (5 MIN)

- [ ] Acessei: https://developers.facebook.com/
- [ ] Fiz login
- [ ] Cliquei "Meus apps" (canto direito)
- [ ] Cliquei "Criar app"
- [ ] Escolhi tipo: "Empresa"
- [ ] Cliquei "Avançar"
- [ ] Preenchi:
  - [ ] Nome app: "AI LeadGen WhatsApp"
  - [ ] Email: _________________
  - [ ] Conta Business: (selecionei a minha)
- [ ] Cliquei "Criar app"
- [ ] Digitei senha do Facebook
- [ ] ✅ App criado

---

## 📲 ETAPA 4: CONECTAR WHATSAPP (3 MIN)

- [ ] No painel do app
- [ ] Encontrei card "WhatsApp"
- [ ] Cliquei "Configurar"
- [ ] Selecionei conta: "AI LeadGen Pro"
- [ ] Cliquei "Continuar"
- [ ] ✅ WhatsApp conectado

---

## 🎫 ETAPA 5: COPIAR CREDENCIAIS (5 MIN)

### CREDENCIAL 1: Token

- [ ] Estou em: WhatsApp → API Setup
- [ ] Encontrei: "Token de acesso temporário"
- [ ] Cliquei "Copiar"
- [ ] Colei num arquivo de texto
- [ ] Token começa com: EAAA...
- [ ] ✅ Token copiado

### CREDENCIAL 2: Phone Number ID

- [ ] Mesma página
- [ ] Encontrei seção "De" ou "From"
- [ ] Vi meu número
- [ ] Embaixo: "Phone number ID"
- [ ] Copiei o número: _________________
- [ ] Colei no arquivo de texto
- [ ] ✅ Phone ID copiado

### CREDENCIAL 3: Business Account ID

- [ ] Acessei: https://business.facebook.com/wa/manage/home/
- [ ] Cliquei "Configurações" ou "Settings"
- [ ] Vi "WhatsApp Business Account ID"
- [ ] Copiei o número: _________________
- [ ] Colei no arquivo de texto
- [ ] ✅ Business ID copiado

**Meu arquivo de texto tem 3 credenciais? SIM [ ]**

---

## 💻 ETAPA 6: CONFIGURAR PROJETO (10 MIN)

### Terminal

- [ ] Abri Terminal (Mac) ou CMD (Windows)
- [ ] Naveguei para pasta do projeto
- [ ] Entrei na pasta backend:
  ```
  cd backend-whatsapp-oficial
  ```
- [ ] Copiei template:
  ```
  cp .env.example .env
  ```
- [ ] Abri arquivo .env:
  ```
  open .env
  ```

### Preencher .env

- [ ] Arquivo .env abriu
- [ ] Colei TOKEN na linha WHATSAPP_TOKEN=
- [ ] Colei PHONE ID na linha WHATSAPP_PHONE_NUMBER_ID=
- [ ] Colei BUSINESS ID na linha WHATSAPP_BUSINESS_ACCOUNT_ID=
- [ ] Salvei arquivo (Cmd+S ou Ctrl+S)
- [ ] Fechei editor
- [ ] ✅ .env configurado

### Instalar

- [ ] No Terminal, digitei:
  ```
  npm install
  ```
- [ ] Aguardei instalar (1-3 min)
- [ ] Vejo: "added XXX packages"
- [ ] ✅ Instalado

### Testar

- [ ] Digitei:
  ```
  npm test
  ```
- [ ] Vi mensagem: "✅ WHATSAPP_TOKEN: EAAA..."
- [ ] Vi mensagem: "✅ Phone Number ID válido!"
- [ ] Vi mensagem: "✅ Business Account ID válido!"
- [ ] Vi mensagem: "🎉 CONFIGURAÇÃO VÁLIDA!"
- [ ] ✅ Teste passou

### Iniciar

- [ ] Digitei:
  ```
  npm start
  ```
- [ ] Vi mensagem: "✅ Status: ONLINE"
- [ ] Vi mensagem: "🌐 Port: 3002"
- [ ] Servidor está rodando
- [ ] **DEIXEI TERMINAL ABERTO**
- [ ] ✅ Servidor iniciado

---

## 🌐 ETAPA 7: TESTAR NO NAVEGADOR (5 MIN)

- [ ] Abri Chrome
- [ ] Acessei: http://localhost:5173
- [ ] Cliquei "Configurações" ou "Integrações"
- [ ] Encontrei "WhatsApp Business API Oficial"
- [ ] Status mostra: "✅ Configurado"
- [ ] Vi Phone Number ID correto
- [ ] ✅ Interface funcionando

### Enviar Teste

- [ ] Digitei número de teste: +351_________________
- [ ] Digitei mensagem: "Olá, teste!"
- [ ] Cliquei "Enviar Mensagem"
- [ ] Aguardei 3-5 segundos
- [ ] Vi mensagem: "✅ Mensagem enviada!"
- [ ] Vi ID da mensagem: wamid...
- [ ] Peguei celular do número de teste
- [ ] **RECEBI A MENSAGEM NO WHATSAPP**
- [ ] ✅ FUNCIONA!

---

## 🎉 RESULTADO FINAL

### Tenho tudo funcionando?

- [ ] ✅ Meta Business Account criada
- [ ] ✅ WhatsApp Business configurado
- [ ] ✅ Número verificado
- [ ] ✅ App criado no Meta Developers
- [ ] ✅ WhatsApp conectado ao app
- [ ] ✅ 3 credenciais coletadas
- [ ] ✅ Arquivo .env configurado
- [ ] ✅ `npm test` passou
- [ ] ✅ `npm start` rodando
- [ ] ✅ Mensagem de teste enviada
- [ ] ✅ Mensagem recebida no WhatsApp

### TOTAL DE CHECKMARKS: _____ / 100+

**SE TODOS MARCADOS: PARABÉNS! SISTEMA 100% FUNCIONAL! 🚀**

---

## 🆘 SE ALGO NÃO FUNCIONOU

**Onde travou?**

Etapa: [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5  [ ] 6  [ ] 7

**Qual erro apareceu?**

_________________________________________________

**Tire print da tela e consulte:**
- GUIA_VISUAL_SIMPLES_WHATSAPP.md
- GUIA_COMPLETO_WHATSAPP_OFICIAL.md

---

## 📞 PRÓXIMOS PASSOS

Agora que funciona, você pode:

- [ ] Criar templates de mensagens
- [ ] Configurar webhooks
- [ ] Integrar com CRM
- [ ] Automatizar campanhas
- [ ] Fazer deploy em servidor cloud

---

**Data de conclusão: ___/___/___**

**Tempo total gasto: _____ minutos**

**Dificuldade (1-10): _____**

---

**Sistema 100% Oficial Meta Platform ✅**

**Criado para: KW Portugal | AI LeadGen Pro**
