# ✅ CHECKLIST DE INSTALAÇÃO - WhatsApp Business API

## 🎯 OBJETIVO:

Garantir que o WhatsApp funcione **DE VERDADE** no seu sistema.

---

## 📋 VERIFICAÇÕES PRÉ-REQUISITOS:

### 1️⃣ Node.js Instalado

Abra o Terminal e execute:

```bash
node --version
```

**✅ Esperado:** `v18.0.0` ou superior

**❌ Se der erro:**
- Acesse: https://nodejs.org/
- Baixe versão LTS (recomendada)
- Instale
- Feche e abra o Terminal
- Teste novamente

---

### 2️⃣ npm Funcionando

No Terminal:

```bash
npm --version
```

**✅ Esperado:** `9.0.0` ou superior

**❌ Se der erro:** Reinstale Node.js

---

### 3️⃣ Pasta backend-whatsapp Existe

Verifique se a pasta existe no projeto:

```
seu-projeto/
├── backend-whatsapp/     ← Esta pasta deve existir
│   ├── server-simple.js
│   ├── package.json
│   └── LEIA_ME.txt
├── components/
└── ...
```

**✅ Existe:** Continue
**❌ Não existe:** Algo está errado com o projeto

---

## 🚀 INSTALAÇÃO DO BACKEND:

### Passo 1: Navegar até a pasta

```bash
cd backend-whatsapp
```

**✅ Funcionou:** Nenhum erro  
**❌ Erro "No such file":** Você não está na pasta do projeto

---

### Passo 2: Instalar dependências

```bash
npm install
```

**✅ Esperado:**
- Demora 2-3 minutos
- Baixa ~200MB
- Termina com: `added 156 packages`

**❌ Problemas comuns:**

**"npm ERR! network"**
→ Problema de internet
→ Tente novamente

**"npm ERR! EACCES"**
→ Problema de permissão
→ Execute: `sudo npm install`

**"Cannot find package.json"**
→ Você não está na pasta `backend-whatsapp`
→ Execute: `cd backend-whatsapp`

---

### Passo 3: Iniciar o servidor

```bash
npm run start:simple
```

**✅ SUCESSO!** Você verá:

```
╔═══════════════════════════════════════════════╗
║   🚀 WhatsApp Business API                   ║
║   📱 Modo STANDALONE                         ║
║                                               ║
║   ✅ Status: ONLINE                          ║
║   🌐 Port: 3001                              ║
║   💾 Sessões: 0                              ║
╚═══════════════════════════════════════════════╝

💡 Aguardando conexões...
🚀 Servidor rodando em http://localhost:3001
```

**❌ Problemas comuns:**

**"Port 3001 already in use"**
→ Porta já está sendo usada
→ Solução:
```bash
lsof -ti:3001 | xargs kill -9
npm run start:simple
```

**"Cannot find module"**
→ Dependências não instaladas
→ Execute: `npm install`

**"node: command not found"**
→ Node.js não instalado ou PATH incorreto
→ Reinstale Node.js

---

## 🌐 TESTAR CONEXÃO:

### Com o backend rodando, teste a API:

Abra outro Terminal (deixe o primeiro aberto) e execute:

```bash
curl http://localhost:3001/health
```

**✅ SUCESSO:**
```json
{
  "status": "ok",
  "service": "WhatsApp Business API",
  "timestamp": "2024-..."
}
```

**❌ Erro:**
```
curl: (7) Failed to connect to localhost port 3001
```
→ Backend não está rodando
→ Volte ao primeiro Terminal e inicie: `npm run start:simple`

---

## 📱 TESTAR NO NAVEGADOR:

### 1. Backend rodando ✅

Terminal mostra: "Status: ONLINE"

### 2. Abrir aplicação

No navegador: `http://localhost:5173`

### 3. Ir para Integrações

**Configurações** → **Integrações** → **WhatsApp Business**

### 4. Clicar "Conectar WhatsApp"

**✅ SUCESSO:** 
- QR Code aparece em 2-5 segundos
- Contador de 45s inicia
- QR Code é válido (testável com WhatsApp)

**❌ Erro "Backend não está rodando":**
- Verifique Terminal
- Backend deve estar ativo
- Porta 3001 deve estar livre

---

## 🎯 CHECKLIST FINAL:

Marque cada item:

- [ ] Node.js instalado (`node --version` funciona)
- [ ] npm instalado (`npm --version` funciona)
- [ ] Pasta `backend-whatsapp` existe
- [ ] `cd backend-whatsapp` funciona
- [ ] `npm install` completou sem erros
- [ ] `npm run start:simple` inicia o servidor
- [ ] Terminal mostra "Status: ONLINE"
- [ ] `curl http://localhost:3001/health` retorna JSON
- [ ] Terminal permanece ABERTO
- [ ] Navegador aberto em `localhost:5173`
- [ ] Botão "Conectar WhatsApp" visível
- [ ] Ao clicar, QR Code aparece
- [ ] QR Code é escaneável com WhatsApp
- [ ] Após escanear, status muda para "Conectado"
- [ ] Botão "Enviar Mensagem: João Nunes" funciona
- [ ] Mensagem chega no WhatsApp

**TODOS MARCADOS? ✅ SISTEMA 100% FUNCIONAL!**

---

## 🆘 AINDA COM PROBLEMAS?

### Documentação adicional:

- `/LEIA_ISTO_PRIMEIRO.txt` - Instruções básicas
- `/INICIAR_AGORA.md` - Guia rápido
- `/backend-whatsapp/LEIA_ME.txt` - Manual do backend
- `/SOLUCAO_ERRO_WHATSAPP.md` - Troubleshooting

### Logs úteis:

Terminal do backend mostra todos os eventos:
- `📱 QR Code gerado` - QR foi criado
- `✅ Cliente conectado` - WhatsApp conectou
- `📤 Mensagem enviada` - Enviou com sucesso

---

## 📊 DIAGNÓSTICO RÁPIDO:

### Sintoma: "Backend não está rodando"
**Causa:** Servidor Node.js não iniciado  
**Solução:** `npm run start:simple`

### Sintoma: QR Code não aparece
**Causa 1:** Backend não conectado  
**Causa 2:** Primeira vez (baixando Chromium)  
**Solução:** Aguarde 10-15 segundos

### Sintoma: QR Code expira
**Causa:** Normal (45 segundos)  
**Solução:** Clique "Gerar Novo QR Code"

### Sintoma: WhatsApp não conecta
**Causa:** QR Code expirou ou backend reiniciou  
**Solução:** Gere novo QR Code

### Sintoma: Mensagem não envia
**Causa:** Conexão perdida  
**Solução:** Desconecte e reconecte

---

**🎉 SISTEMA PRONTO PARA PRODUÇÃO!**

**Criado para: AI LeadGen Pro | KW Portugal**
