# ⚡ Configuração Rápida - 5 Minutos

## 🎯 Objetivo
Fazer o sistema buscar dados REAIS da internet quando você clicar em um usuário no Admin Dashboard.

---

## 📋 PASSO 1: Criar Conta Apollo.io (GRÁTIS - 60 créditos/mês)

### Por que Apollo.io?
✅ **Melhor opção gratuita**
✅ 60 créditos/mês renovam automaticamente
✅ Dados mais completos: cargo, empresa, telefones, LinkedIn
✅ Não precisa cartão de crédito

### Como fazer:

1. **Acesse:** https://app.apollo.io/signup

2. **Crie conta GRÁTIS:**
   - Email: Seu email
   - Password: Escolha uma senha
   - Clique em "Sign Up"

3. **Pegue a API Key:**
   - Depois de criar conta, vá em: **Settings** (canto superior direito)
   - Clique em: **API Keys** (menu lateral esquerdo)
   - Clique em: **Create API Key**
   - Nome: "KW Portugal MVP"
   - Clique em: **Create**
   - **COPIE A KEY** (começa com algo como "xAp...")

4. **Cole a key aqui no Figma Make:**
   - Você já forneceu a variável `APOLLO_API_KEY` através do modal
   - Se não forneceu ainda, clique no botão azul que vai aparecer

---

## 📋 PASSO 2 (OPCIONAL): Criar Conta People Data Labs (GRÁTIS - 1,000 créditos)

### Por que PDL?
✅ **1,000 créditos GRÁTIS** (não renovam, mas é bastante para testar)
✅ Dados profissionais completos: histórico, educação, skills
✅ Não precisa cartão de crédito

### Como fazer:

1. **Acesse:** https://dashboard.peopledatalabs.com/signup

2. **Crie conta GRÁTIS:**
   - Email: Seu email
   - Password: Escolha uma senha
   - Clique em "Sign Up"

3. **Pegue a API Key:**
   - Vá em: **API Keys** (menu lateral)
   - Clique em: **Create New Key**
   - Nome: "KW Portugal"
   - Clique em: **Create**
   - **COPIE A KEY**

4. **Cole a key aqui no Figma Make:**
   - Você já forneceu a variável `PDL_API_KEY` através do modal
   - Se não forneceu ainda, clique no botão azul que vai aparecer

---

## ✅ PRONTO! Agora teste:

1. **Faça login como admin:**
   - Email: `admin@kwportugal.com`
   - Senha: `admin123`

2. **Vá para o Admin Dashboard** (menu lateral esquerdo)

3. **Clique em qualquer usuário da lista**

4. **Aguarde 10-30 segundos** enquanto o sistema busca dados em 8 fontes

5. **Veja os dados sendo exibidos:**
   - ✅ Cargo Atual
   - ✅ Empresa (nome, logo, website, funcionários)
   - ✅ LinkedIn, Twitter, Facebook
   - ✅ Telefones
   - ✅ Histórico profissional
   - ✅ Educação
   - ✅ Habilidades

---

## 🐛 Troubleshooting

### "Nenhum dado profissional encontrado"
**Causa:** API keys não configuradas ou email do usuário não existe na base de dados
**Solução:**
1. Confirme que você configurou pelo menos `APOLLO_API_KEY`
2. Teste com um email corporativo real (não Gmail/Hotmail)
3. Abra o Console (F12) e veja os logs detalhados

### "API key inválida"
**Causa:** Você copiou a key errada
**Solução:**
1. Volte para Apollo.io → Settings → API Keys
2. Copie a key COMPLETA (geralmente ~40 caracteres)
3. Cole novamente

### "Rate limit exceeded"
**Causa:** Você esgotou os créditos grátis
**Solução:**
1. Aguarde o próximo mês (Apollo renova automaticamente)
2. Ou faça upgrade para plano pago

---

## 💡 Dicas

1. **Comece apenas com Apollo.io** - É suficiente para 90% dos casos
2. **Teste com emails corporativos** - Gmail/Hotmail geralmente não têm dados profissionais
3. **Economize créditos** - Só clique em usuários que você realmente quer enriquecer
4. **Veja os logs** - Abra o Console (F12) para ver exatamente o que está acontecendo

---

## 📊 O Que Você Vai Ver com Apollo.io Configurado

```
📊 DADOS ENRIQUECIDOS RECEBIDOS:
📊 Sucesso: true
📊 Fontes usadas: 1
📊 Score: 65%
📊 Completude: 58%
📊 Qualidade: 72%

✅ Apollo.io: CEO @ Tech Company
   📞 2 telefones encontrados
   📧 Email verificado (score: 95)
   🏢 Empresa: 150 funcionários
   💼 LinkedIn: https://linkedin.com/in/...
```

---

**Configurou? Agora teste e veja a mágica acontecer! 🚀**

Se tiver problemas, abra o Console (F12) e me mostre os logs.
