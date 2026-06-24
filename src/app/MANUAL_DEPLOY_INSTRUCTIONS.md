# Guia de Deploy Manual - Ethereal (ImobHunter)

Como a conexão automática com o Supabase falhou, você precisará realizar o deploy manualmente através do seu terminal. Isso garantirá que a função `make-server` seja atualizada corretamente com as novas correções de rota.

## Pré-requisitos

Certifique-se de ter o **Supabase CLI** instalado. Se já rodou os scripts anteriores, você já deve ter.

## Passo a Passo

### 1. Abrir o Terminal
Abra o terminal na raiz do projeto (onde estão os arquivos `package.json`, `deploy-server.sh`, etc).

### 2. Login no Supabase
Execute o comando abaixo para autenticar seu terminal com sua conta Supabase. Isso abrirá o navegador para você confirmar.
```bash
npx supabase login
```
*(Se já estiver logado, ele avisará. Se não tiver `npx`, tente apenas `supabase login`)*

### 3. Linkar o Projeto
Conecte sua pasta local ao projeto Supabase correto (`evdyqlrssgsktctjruuq`).
```bash
npx supabase link --project-ref evdyqlrssgsktctjruuq
```
*Ele pode pedir a senha do banco de dados. Se não souber, você pode pular ou resetar no painel, mas para deploy de functions geralmente o login basta.*

### 4. Padronizar o Nome da Função (Importante!)
Você mencionou que o padrão agora é `make-server`, mas a pasta do código ainda se chama `server`. Vamos renomear para evitar confusão e garantir que a URL fique correta (`/functions/v1/make-server`).

Execute este comando para renomear a pasta:
```bash
mv supabase/functions/server supabase/functions/make-server
```

### 5. Executar o Deploy
Agora envie o código atualizado para a nuvem:
```bash
npx supabase functions deploy make-server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
```
*A flag `--no-verify-jwt` é recomendada se você quiser que a função seja pública ou gerencie sua própria auth, mas pode removê-la se quiser impor a auth padrão do Supabase.*

### 6. Configurar Variáveis de Ambiente (Secrets)
Para garantir que a função tenha acesso às chaves (Apollo, OpenAI, etc), envie o arquivo de variáveis locais:
```bash
npx supabase secrets set --env-file ./supabase/.env.local --project-ref evdyqlrssgsktctjruuq
```
*(Certifique-se de ter um arquivo `.env.local` ou configure as chaves manualmente no Dashboard do Supabase em Settings > Edge Functions)*

## Resumo dos Comandos (Copie e Cole)

Se quiser fazer tudo de uma vez:

```bash
# 1. Login
npx supabase login

# 2. Renomear pasta para o padrão correto
mv supabase/functions/server supabase/functions/make-server

# 3. Deploy
npx supabase functions deploy make-server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt

echo "✅ Deploy concluído! A função deve estar acessível em /functions/v1/make-server"
```

---

## Alternativa: Deploy via Dashboard Web (Não Recomendado)
Se não conseguir usar o terminal, você teria que copiar manualmente o conteúdo de **TODOS** os arquivos da pasta `/supabase/functions/server/` para o editor online do Supabase, o que é muito propenso a erros devido aos múltiplos arquivos (`kv_store.ts`, `search-routes.ts`, etc). **Recomendamos fortemente o método via terminal acima.**
