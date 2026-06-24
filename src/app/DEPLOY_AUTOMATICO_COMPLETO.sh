#!/bin/bash

# 🚀 SCRIPT AUTOMÁTICO DE DEPLOY - IMOBHUNTER
# Este script cria todos os arquivos necessários e faz o deploy automaticamente

echo "🎯 INICIANDO DEPLOY AUTOMÁTICO DO IMOBHUNTER..."
echo ""

# Navegar para a pasta do projeto
cd ~/Desktop/imobhunter

echo "📁 Criando estrutura de pastas..."
mkdir -p supabase/functions/server

# ========================================
# CRIAR ARQUIVOS DO SERVIDOR
# ========================================

echo "📝 Criando index.tsx..."
cat > supabase/functions/server/index.tsx << 'INDEXEOF'
import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// CORS aberto para desenvolvimento
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Logger
app.use("*", logger(console.log));

// Rota de health check
app.get("/make-server-9e4b8b7c/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Rota de teste simples
app.get("/make-server-9e4b8b7c/test", (c) => {
  return c.json({ 
    message: "ImobHunter Server está funcionando!",
    apis_configuradas: {
      apollo: !!Deno.env.get("APOLLO_API_KEY"),
      pdl: !!Deno.env.get("PDL_API_KEY"),
      rocketreach: !!Deno.env.get("ROCKETREACH_API_KEY"),
      linkedin: !!Deno.env.get("LINKEDIN_API_KEY")
    }
  });
});

// Tratamento de erros global
app.onError((err, c) => {
  console.error("❌ Erro no servidor:", err);
  return c.json({ 
    error: err.message || "Erro interno do servidor",
    timestamp: new Date().toISOString()
  }, 500);
});

// Iniciar servidor
console.log("🚀 ImobHunter Server iniciando...");
Deno.serve(app.fetch);
INDEXEOF

echo "📝 Criando kv_store.tsx (arquivo protegido)..."
cat > supabase/functions/server/kv_store.tsx << 'KVEOF'
// KV Store - Sistema de armazenamento chave-valor
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

export async function get(key: string) {
  const { data, error } = await supabase
    .from("kv_store_9e4b8b7c")
    .select("value")
    .eq("key", key)
    .single();
  
  if (error) return null;
  return data?.value;
}

export async function set(key: string, value: any) {
  await supabase
    .from("kv_store_9e4b8b7c")
    .upsert({ key, value });
}

export async function del(key: string) {
  await supabase
    .from("kv_store_9e4b8b7c")
    .delete()
    .eq("key", key);
}

export async function mget(keys: string[]) {
  const { data } = await supabase
    .from("kv_store_9e4b8b7c")
    .select("value")
    .in("key", keys);
  
  return data?.map(d => d.value) || [];
}

export async function mset(items: Record<string, any>) {
  const entries = Object.entries(items).map(([key, value]) => ({ key, value }));
  await supabase
    .from("kv_store_9e4b8b7c")
    .upsert(entries);
}

export async function mdel(keys: string[]) {
  await supabase
    .from("kv_store_9e4b8b7c")
    .delete()
    .in("key", keys);
}

export async function getByPrefix(prefix: string) {
  const { data } = await supabase
    .from("kv_store_9e4b8b7c")
    .select("value")
    .like("key", `${prefix}%`);
  
  return data?.map(d => d.value) || [];
}
KVEOF

echo "📝 Criando env-helper.ts..."
cat > supabase/functions/server/env-helper.ts << 'ENVEOF'
// Helper para acessar variáveis de ambiente de forma segura

export function getEnv(key: string, defaultValue: string = ""): string {
  return Deno.env.get(key) ?? defaultValue;
}

export function getRequiredEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`❌ Variável de ambiente obrigatória não encontrada: ${key}`);
  }
  return value;
}

export function hasEnv(key: string): boolean {
  return !!Deno.env.get(key);
}

export function getApiKeys() {
  return {
    apollo: getEnv("APOLLO_API_KEY"),
    pdl: getEnv("PDL_API_KEY"),
    rocketreach: getEnv("ROCKETREACH_API_KEY"),
    linkedin: getEnv("LINKEDIN_API_KEY"),
    resend: getEnv("RESEND_API_KEY"),
    hunter: getEnv("HUNTER_API_KEY"),
    lusha: getEnv("LUSHA_API_KEY"),
  };
}
ENVEOF

echo "📝 Criando deno.json..."
cat > supabase/functions/server/deno.json << 'DENOEOF'
{
  "imports": {
    "hono": "jsr:@hono/hono@^4.0.0",
    "@supabase/supabase-js": "jsr:@supabase/supabase-js@^2.0.0"
  },
  "tasks": {
    "dev": "deno run --allow-all --watch index.tsx"
  }
}
DENOEOF

# ========================================
# CRIAR config.toml DO SUPABASE
# ========================================

echo "📝 Criando config.toml do Supabase..."
cat > supabase/config.toml << 'CONFIGEOF'
# Configuração do Supabase para ImobHunter

[project]
name = "ImobHunter"

[functions.make-server-9e4b8b7c]
verify_jwt = false
CONFIGEOF

# ========================================
# CRIAR ARQUIVOS FRONTEND ESSENCIAIS
# ========================================

echo "📝 Criando package.json..."
cat > package.json << 'PKGEOF'
{
  "name": "imobhunter",
  "version": "1.0.0",
  "description": "Sistema SaaS de Lead Generation & Nurturing autónomo para o mercado imobiliário",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
PKGEOF

# ========================================
# GIT COMMIT E PUSH
# ========================================

echo ""
echo "📦 Adicionando arquivos ao Git..."
git add .

echo "💾 Criando commit..."
git commit -m "🚀 Deploy inicial ImobHunter - Backend Supabase Edge Functions"

echo "📤 Fazendo push para GitHub..."
git push -u origin main

echo ""
echo "✅ ============================================="
echo "✅  DEPLOY AUTOMÁTICO CONCLUÍDO COM SUCESSO!"
echo "✅ ============================================="
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  Ir ao Supabase Dashboard:"
echo "    https://supabase.com/dashboard/project/_/settings/integrations"
echo ""
echo "2️⃣  Conectar GitHub:"
echo "    - Clicar em 'Connect to GitHub'"
echo "    - Autorizar o repositório: clebercouto/imobhunter"
echo ""
echo "3️⃣  Ativar GitHub Auto-Deploy:"
echo "    - Branch: main"
echo "    - Production branch: main"
echo ""
echo "4️⃣  Aguardar deploy (2-3 minutos)"
echo ""
echo "5️⃣  Testar a função:"
echo "    https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/health"
echo ""
echo "🎉 Repositório: https://github.com/clebercouto/imobhunter"
echo ""
