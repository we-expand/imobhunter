#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════
# 🚀 IMOBHUNTER - DEPLOY AUTOMÁTICO COMPLETO
# ═══════════════════════════════════════════════════════════════════════
# INSTRUÇÕES: Cole este comando INTEIRO no Terminal e aperte ENTER
# ═══════════════════════════════════════════════════════════════════════

cd ~/Desktop/imobhunter && \

# ═══════════════════════════════════════════════════════════════════════
# 📝 CRIAR INDEX.TSX (ARQUIVO PRINCIPAL)
# ═══════════════════════════════════════════════════════════════════════

cat > supabase/functions/server/index.tsx << 'INDEXEOF'
import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

app.use("*", cors({ origin: "*", allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization"] }));
app.use("*", logger(console.log));

app.get("/make-server-9e4b8b7c/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString(), version: "1.0.0" }));

app.get("/make-server-9e4b8b7c/test", (c) => {
  return c.json({ 
    message: "ImobHunter Server OK!",
    apis: {
      apollo: !!Deno.env.get("APOLLO_API_KEY"),
      pdl: !!Deno.env.get("PDL_API_KEY"),
      rocketreach: !!Deno.env.get("ROCKETREACH_API_KEY")
    }
  });
});

app.onError((err, c) => {
  console.error("❌ Erro:", err);
  return c.json({ error: err.message }, 500);
});

console.log("🚀 ImobHunter Server iniciando...");
Deno.serve(app.fetch);
INDEXEOF

# ═══════════════════════════════════════════════════════════════════════
# 📝 CRIAR KV_STORE.TSX (PROTEGIDO)
# ═══════════════════════════════════════════════════════════════════════

cat > supabase/functions/server/kv_store.tsx << 'KVEOF'
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

export async function get(key: string) {
  const { data, error } = await supabase.from("kv_store_9e4b8b7c").select("value").eq("key", key).single();
  if (error) return null;
  return data?.value;
}

export async function set(key: string, value: any) {
  await supabase.from("kv_store_9e4b8b7c").upsert({ key, value });
}

export async function del(key: string) {
  await supabase.from("kv_store_9e4b8b7c").delete().eq("key", key);
}

export async function mget(keys: string[]) {
  const { data } = await supabase.from("kv_store_9e4b8b7c").select("value").in("key", keys);
  return data?.map(d => d.value) || [];
}

export async function mset(items: Record<string, any>) {
  const entries = Object.entries(items).map(([key, value]) => ({ key, value }));
  await supabase.from("kv_store_9e4b8b7c").upsert(entries);
}

export async function mdel(keys: string[]) {
  await supabase.from("kv_store_9e4b8b7c").delete().in("key", keys);
}

export async function getByPrefix(prefix: string) {
  const { data } = await supabase.from("kv_store_9e4b8b7c").select("value").like("key", \`\${prefix}%\`);
  return data?.map(d => d.value) || [];
}
KVEOF

# ═══════════════════════════════════════════════════════════════════════
# 📝 CRIAR DENO.JSON
# ═══════════════════════════════════════════════════════════════════════

cat > supabase/functions/server/deno.json << 'DENOEOF'
{
  "imports": {
    "hono": "jsr:@hono/hono@^4.0.0",
    "@supabase/supabase-js": "jsr:@supabase/supabase-js@^2.0.0"
  }
}
DENOEOF

# ═══════════════════════════════════════════════════════════════════════
# 📝 CRIAR CONFIG.TOML
# ═══════════════════════════════════════════════════════════════════════

cat > supabase/config.toml << 'CONFIGEOF'
[project]
name = "ImobHunter"

[functions.make-server-9e4b8b7c]
verify_jwt = false
CONFIGEOF

# ═══════════════════════════════════════════════════════════════════════
# 🎯 GIT COMMIT E PUSH
# ═══════════════════════════════════════════════════════════════════════

git add . && \
git commit -m "🚀 Deploy ImobHunter - Backend Supabase" && \
git push -u origin main && \

echo "" && \
echo "✅ ═══════════════════════════════════════════════════════════" && \
echo "✅  DEPLOY CONCLUÍDO COM SUCESSO!" && \
echo "✅ ═══════════════════════════════════════════════════════════" && \
echo "" && \
echo "📋 PRÓXIMOS PASSOS:" && \
echo "" && \
echo "1️⃣  Ir para: https://supabase.com/dashboard/project/_/settings/integrations" && \
echo "" && \
echo "2️⃣  Clicar em 'Connect to GitHub'" && \
echo "" && \
echo "3️⃣  Autorizar: clebercouto/imobhunter" && \
echo "" && \
echo "4️⃣  Ativar Auto-Deploy (branch: main)" && \
echo "" && \
echo "5️⃣  Aguardar 2-3 minutos para deploy" && \
echo "" && \
echo "🎉 Repositório: https://github.com/clebercouto/imobhunter" && \
echo ""
