# 🚀 CÓDIGO DO SERVIDOR PARA DEPLOY MANUAL

## ⚠️ IMPORTANTE:
Este é o código COMPLETO do servidor v1.2.0 que você deve fazer deploy.

## 📋 INSTRUÇÕES:

### Opção A: Deploy direto do Figma Make (RECOMENDADO)

Se você consegue acessar os arquivos do projeto localmente:

```bash
# 1. Navegue até a pasta do projeto
cd /caminho/para/seu/projeto

# 2. Faça deploy da função server
supabase functions deploy server --project-ref SEU_PROJECT_ID
```

---

### Opção B: Criar pasta local e copiar código

Se não consegue acessar os arquivos do Figma Make:

```bash
# 1. Crie uma estrutura de pastas
mkdir -p meu-projeto/supabase/functions/server
cd meu-projeto

# 2. Inicialize o Supabase
supabase init

# 3. Copie TODO o conteúdo do arquivo /supabase/functions/server/index.tsx
#    do Figma Make para o arquivo local:
#    meu-projeto/supabase/functions/server/index.tsx

# 4. Faça deploy
supabase functions deploy server --project-ref SEU_PROJECT_ID
```

---

## 🔧 VERIFICAR SE DEU CERTO:

Após o deploy, execute:

```bash
curl https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/ping
```

Deve retornar:
```json
{
  "status": "alive",
  "version": "1.2.0 - Apollo Direct Route + Header Fix ✅",
  "timestamp": "...",
  "message": "Servidor está funcionando! ✅"
}
```

---

## 🆘 SE DER ERRO:

### Erro: "Function not found"
Certifique-se que o nome da pasta é exatamente `server`:
```
supabase/functions/server/index.tsx
```

### Erro: "Invalid credentials"
Refaça o login:
```bash
supabase logout
supabase login
```

### Erro: "Project not linked"
Refaça o link:
```bash
supabase link --project-ref SEU_PROJECT_ID
```

---

## 📦 LOCALIZAÇÃO DO CÓDIGO:

O código completo do servidor está em:
```
/supabase/functions/server/index.tsx
```

Este arquivo tem **~2200 linhas** e contém:
- ✅ Rota Apollo corrigida
- ✅ Header X-Api-Key configurado
- ✅ Todas as integrações (LinkedIn, Instagram, etc.)
- ✅ Versão 1.2.0

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY:

1. Volte ao ImobHunter
2. Clique no botão roxo "VERIFICAR VERSÃO DO SERVIDOR"
3. Deve mostrar: "Versão atual: 1.2.0" em VERDE ✅
4. Clique em "CLIQUE AQUI PARA TESTAR A API"
5. Deve retornar sucesso! ✅
