# 🚨 DEPLOY URGENTE - LEIA ISTO PRIMEIRO! 🚨

## ⚠️ SITUAÇÃO ATUAL:

- **Versão do Servidor**: 1.0.0 ❌ (ANTIGA)
- **Versão Necessária**: 1.2.0 ✅ (NOVA)
- **Problema**: Supabase NÃO fez auto-deploy
- **Solução**: Deploy manual via terminal (5 minutos)
- **Projeto Novo**: evdyqlrssgsktctjruuq ✅

---

## 🎯 SOLUÇÃO MAIS RÁPIDA (5 comandos):

```bash
# 1. Instalar CLI
npm install -g supabase

# 2. Fazer login
supabase login

# 3. Linkar projeto NOVO
supabase link --project-ref evdyqlrssgsktctjruuq

# 4. Navegar até a pasta do projeto
cd /caminho/para/este/projeto

# 5. Deploy!
supabase functions deploy server
```

**Pronto! Aguarde 60s e teste no ImobHunter.**

---

## 📋 PROJECT ID DO NOVO PROJETO:

```
evdyqlrssgsktctjruuq
```

URL do Dashboard:
```
https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq
```

---

## 🚀 SCRIPTS AUTOMÁTICOS CRIADOS:

### Linux/macOS:
```bash
chmod +x deploy-server.sh
./deploy-server.sh
```

### Windows:
```powershell
.\deploy-server.ps1
```

---

## 📚 DOCUMENTAÇÃO COMPLETA:

- 📄 **DEPLOY_VIA_TERMINAL.txt** → Guia detalhado passo a passo
- 📄 **SERVER_CODE_FOR_MANUAL_DEPLOY.md** → Alternativas de deploy
- 📄 **AUTO_DEPLOY_GUIDE.md** → Como verificar se funcionou
- 📄 **DEPLOY_INSTRUCTIONS.md** → Troubleshooting completo

---

## ✅ COMO SABER SE FUNCIONOU:

### Método 1: Terminal
```bash
curl https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

Deve mostrar: `"version": "1.2.0 - Apollo Direct Route + Header Fix ✅"`

### Método 2: Interface ImobHunter
1. Faça login
2. Clique no botão roxo "VERIFICAR VERSÃO DO SERVIDOR"
3. Deve ficar VERDE com "1.2.0" ✅
4. Clique em "TESTAR API"
5. Deve retornar sucesso ✅

---

## 🆘 PRECISA DE AJUDA?

Leia primeiro: `/DEPLOY_VIA_TERMINAL.txt`

Tem troubleshooting para todos os erros comuns!

---

## ⏱️ TEMPO ESTIMADO:

- **Primeira vez**: ~5 minutos (instalar CLI + deploy)
- **Próximas vezes**: ~30 segundos (apenas deploy)

---

## 🎯 POR QUE FAZER ISSO:

Sem o deploy v1.2.0, o Apollo vai continuar retornando erro 422.

Com o deploy v1.2.0:
- ✅ Apollo funcionando
- ✅ API key no header correto
- ✅ Busca de leads funcionando
- ✅ Sistema 100% operacional

---

**🚀 COMECE AGORA! Abra o terminal e execute os 5 comandos acima!**