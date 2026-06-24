# 🛠️ Guia de Deploy Manual via Terminal (Mac/Linux)

Como você não tem o projeto salvo localmente, **o primeiro passo obrigatório é baixar o código**. Sem os arquivos no seu computador, o terminal não tem o que enviar para o Supabase.

Siga este passo a passo exato:

## 1. Baixar o Projeto
1. Na interface do **Figma Make** (onde estamos conversando), procure o botão de **"Download Code"** ou **"Export"** (geralmente no canto superior direito).
2. Baixe o arquivo `.zip`.
3. Dê dois cliques no `.zip` para extrair a pasta.
4. **Importante:** Memorize onde a pasta foi extraída (geralmente em `Downloads/project-...`).

## 2. Abrir o Terminal na Pasta
1. Abra o aplicativo **Terminal** no seu Mac (Cmd + Espaço, digite "Terminal").
2. Digite `cd ` (com um espaço no final) e **não aperte Enter ainda**.
3. **Arraste a pasta descompactada** do Finder para dentro da janela do Terminal. O caminho será preenchido automaticamente.
4. Agora aperte **Enter**.

## 3. Comandos de Deploy
Agora que o terminal está "dentro" da pasta do projeto, copie e cole os comandos abaixo um por um (ou o bloco todo):

### A. Login no Supabase
Isso abrirá seu navegador para confirmar a conexão.
```bash
npx supabase login
```

### B. Linkar ao Projeto
Conecta sua pasta ao projeto na nuvem (`evdyqlrssgsktctjruuq`).
```bash
npx supabase link --project-ref evdyqlrssgsktctjruuq
```
*(Se pedir senha do banco de dados e você não souber, tente apertar Enter. Se falhar, você pode precisar resetar a senha no painel do Supabase, mas geralmente para Functions não bloqueia).*

### C. Corrigir Nome da Pasta
O código está na pasta `server`, mas o frontend busca por `make-server`. Vamos renomear.
```bash
# Se der erro dizendo que a pasta não existe, pule para o próximo comando
mv supabase/functions/server supabase/functions/make-server
```

### D. Fazer o Deploy (O passo principal)
Envia o código para a nuvem.
```bash
npx supabase functions deploy make-server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
```

## 4. Testar
Após aparecer a mensagem verde **"Deploy complete"**:
1. Volte para a aplicação web.
2. Recarregue a página.
3. Tente fazer login novamente. O erro 403 deve ter desaparecido.

---

### 🆘 Problemas Comuns

- **"Command not found: npx"**: Você precisa ter o Node.js instalado. Baixe em [nodejs.org](https://nodejs.org/).
- **"Docker not found"**: Se pedir Docker, adicione a flag `--no-verify-jwt` (já incluída acima) que costuma evitar dependências locais pesadas, ou instale o Docker Desktop.
- **Senha do Banco de Dados**: Se o comando `link` travar pedindo senha, você pode pular o link e tentar o deploy direto usando `--project-ref`.
