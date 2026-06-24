# 🎯 DEPLOY VIA GITHUB - INSTRUÇÕES FINAIS

## ✅ **SITUAÇÃO ATUAL**

- ✅ Repositório criado: `https://github.com/clebercouto/imobhunter`
- ✅ Código atualizado no Figma Make (PDL + RocketReach)
- ✅ API Keys configuradas no Supabase
- ⏳ Pendente: Upload dos arquivos + Configurar auto-deploy

---

## 🚀 **COMANDOS PARA EXECUTAR NO MAC (COPIE E COLE)**

Abra o Terminal e execute **TUDO DE UMA VEZ**:

```bash
# ═══════════════════════════════════════════════════════════════════════
# 1. CLONAR REPOSITÓRIO
# ═══════════════════════════════════════════════════════════════════════

cd ~/Desktop
git clone https://github.com/clebercouto/imobhunter.git
cd imobhunter

echo "✅ Repositório clonado"

# ═══════════════════════════════════════════════════════════════════════
# 2. CRIAR ESTRUTURA
# ═══════════════════════════════════════════════════════════════════════

mkdir -p supabase/functions/server

echo "✅ Estrutura criada"

# ═══════════════════════════════════════════════════════════════════════
# 3. ABRIR PASTA NO FINDER
# ═══════════════════════════════════════════════════════════════════════

open supabase/functions/server

echo "✅ Pasta aberta no Finder"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
echo "📋 PRÓXIMO PASSO MANUAL:"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "Agora você precisa copiar os arquivos do Figma Make para a pasta que acabou de abrir."
echo ""
echo "👉 Lista completa de arquivos em: /LISTA_ARQUIVOS_COPIAR.txt"
echo ""
echo "Quando terminar de copiar TODOS os arquivos, volte aqui e execute:"
echo ""
echo "   cd ~/Desktop/imobhunter"
echo "   git add ."
echo "   git commit -m '🚀 Deploy inicial - PDL + RocketReach'"
echo "   git push origin main"
echo ""
echo "═══════════════════════════════════════════════════════════════════════"
```

---

## 📋 **ARQUIVOS CRÍTICOS (MÍNIMO NECESSÁRIO)**

Se você quiser fazer um **deploy rápido** com apenas os arquivos essenciais:

### **5 ARQUIVOS OBRIGATÓRIOS:**

1. `index.tsx` - Entry point principal
2. `pdl-linkedin-api.ts` - PDL + RocketReach (NOVO)
3. `apollo-api.ts` - Apollo.io API
4. `real-search-routes.ts` - Rotas de busca (ATUALIZADO)
5. `kv_store.tsx` - Key-Value store (protegido)

### **Como copiar:**

**Para cada arquivo:**

1. Abra o Figma Make
2. Navegue até `/supabase/functions/server/{nome_do_arquivo}`
3. Copie todo o conteúdo (Cmd+A, Cmd+C)
4. Cole no arquivo correspondente em `~/Desktop/imobhunter/supabase/functions/server/{nome_do_arquivo}`
5. Salve (Cmd+S)

---

## ⚡ **DEPLOY APÓS COPIAR OS ARQUIVOS**

```bash
cd ~/Desktop/imobhunter

# Ver arquivos que foram copiados
ls -la supabase/functions/server/

# Adicionar ao Git
git add .

# Commit
git commit -m "🚀 Deploy inicial - PDL + RocketReach"

# Push para GitHub
git push origin main
```

---

## 🔗 **CONFIGURAR AUTO-DEPLOY NO SUPABASE**

Depois do push, configure o auto-deploy:

1. **Abra:**
   ```
   https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/integrations
   ```

2. **Procure "GitHub" nas integrações**

3. **Clique em "Connect"**

4. **Autorize o Supabase**

5. **Selecione:**
   - Repository: `clebercouto/imobhunter`
   - Branch: `main`
   - Function: `server`
   - Path: `supabase/functions/server`

6. **Ative "Auto-deploy on push"**

7. **Save**

---

## 🧪 **TESTAR DEPLOY**

Após configurar, aguarde 2-3 minutos e teste:

```bash
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c/ping
```

**Resposta esperada:**
```json
{
  "status": "alive",
  "version": "1.4.0",
  "message": "PDL + RocketReach funcionando!"
}
```

---

## 🆘 **SE DER ERRO**

**Me envie:**
1. Print do erro
2. Output do comando: `git status`
3. Print da página de Functions no Supabase

---

## 💡 **DICA PRO**

Crie um arquivo `.sh` para automatizar futuros deploys:

```bash
cat > ~/Desktop/deploy-imobhunter.sh << 'EOF'
#!/bin/bash
cd ~/Desktop/imobhunter
git pull
git add .
git commit -m "🔄 Update: $(date '+%Y-%m-%d %H:%M')"
git push origin main
echo "✅ Deploy enviado! Aguarde 2-3 minutos."
EOF

chmod +x ~/Desktop/deploy-imobhunter.sh
```

**Uso futuro:**
```bash
~/Desktop/deploy-imobhunter.sh
```

---

**Pronto para começar? Execute os comandos acima!** 🚀
