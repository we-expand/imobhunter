// ═══════════════════════════════════════════════════════════════════════
// 🚀 IMOBHUNTER SERVER v1.3.0 - COMPLETE
// ═══════════════════════════════════════════════════════════════════════

console.log('🚀 IMOBHUNTER SERVER STARTING...');

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";
import searchRouter from "./search-routes.ts";
import authRouter from "./auth-routes.ts";
import linkedinRoutes from "./linkedin-routes.ts";
import linkedinAuthRoutes from "./linkedin-auth-routes.ts";
import diagnosticsRoutes from "./diagnostics-routes.ts";
import excelImportRoutes from "./excel-import-routes.ts";
import aiFeedbackRoutes from "./ai-feedback-routes.ts";
import instagramRouter from "./instagram-routes.ts";
import aiBrainRoutes from "./ai-brain-routes.ts";
import apiTestRouter from "./api-test-routes.tsx";
import apiProxyRouter from "./api-proxy-routes.ts";
import { generateDemoLeads } from "./demo-leads-generator.ts";
import { leadsDB } from "./leads-database.ts";
import { intelligentSearch } from "./intelligent-search.ts";

console.log('✅ Todos os imports concluídos!');

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ═══════════════════════════════════════════════════════════════════════
// HEALTH CHECK & PING
// ═══════════════════════════════════════════════════════════════════════

app.get("/make-server-9e4b8b7c/health", (c) => {
  return c.json({ status: "ok", version: "1.3.0" });
});

app.get("/make-server-9e4b8b7c/ping", (c) => {
  return c.json({ 
    status: "alive",
    version: "1.3.0",
    timestamp: new Date().toISOString(),
    message: "ImobHunter servidor funcionando! 🎉"
  });
});

// ═══════════════════════════════════════════════════════════════════════
// MOUNT ALL ROUTE MODULES
// ═══════════════════════════════════════════════════════════════════════

console.log('📡 Montando rotas...');

app.route("/make-server-9e4b8b7c/search", searchRouter);
app.route("/make-server-9e4b8b7c/auth", authRouter);
app.route("/make-server-9e4b8b7c/linkedin", linkedinRoutes);
app.route("/make-server-9e4b8b7c/linkedin-auth", linkedinAuthRoutes);
app.route("/make-server-9e4b8b7c/diagnostics", diagnosticsRoutes);
app.route("/make-server-9e4b8b7c/excel", excelImportRoutes);
app.route("/make-server-9e4b8b7c/ai-feedback", aiFeedbackRoutes);
app.route("/make-server-9e4b8b7c/instagram", instagramRouter);
app.route("/make-server-9e4b8b7c/ai-brain", aiBrainRoutes);
app.route("/make-server-9e4b8b7c/api-test", apiTestRouter);
app.route("/make-server-9e4b8b7c/api-proxy", apiProxyRouter);

console.log('✅ Rotas montadas!');

// ═══════════════════════════════════════════════════════════════════════
// DEMO LEADS ENDPOINT
// ═══════════════════════════════════════════════════════════════════════

app.post("/make-server-9e4b8b7c/leads/demo", async (c) => {
  try {
    const body = await c.req.json();
    console.log('🔍 Gerando leads demo:', body);
    
    const leads = generateDemoLeads({
      currentTitle: body.title,
      currentCompany: body.company,
      city: body.city,
      country: body.country,
      industry: body.industry,
      seniority: body.seniority,
      limit: body.limit || 25
    });
    
    return c.json({
      success: true,
      leads,
      total: leads.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao gerar leads demo:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET ALL LEADS
// ═══════════════════════════════════════════════════════════════════════

app.get("/make-server-9e4b8b7c/leads", async (c) => {
  try {
    const leads = await leadsDB.getAllLeads();
    return c.json({
      success: true,
      leads,
      total: leads.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar leads:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// SAVE LEAD
// ═══════════════════════════════════════════════════════════════════════

app.post("/make-server-9e4b8b7c/leads/save", async (c) => {
  try {
    const body = await c.req.json();
    await leadsDB.saveLead(body);
    return c.json({ success: true, message: 'Lead salvo com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao salvar lead:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// INTELLIGENT SEARCH
// ═══════════════════════════════════════════════════════════════════════

app.post("/make-server-9e4b8b7c/search/intelligent", async (c) => {
  try {
    const body = await c.req.json();
    const results = await intelligentSearch(body);
    return c.json({ success: true, results });
  } catch (error) {
    console.error('❌ Erro na busca inteligente:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// KV STORE TEST
// ═══════════════════════════════════════════════════════════════════════

app.get("/make-server-9e4b8b7c/kv/test", async (c) => {
  try {
    await kv.set('test_key', { message: 'Hello from KV!', timestamp: new Date().toISOString() });
    const value = await kv.get('test_key');
    return c.json({ success: true, value });
  } catch (error) {
    console.error('❌ Erro no KV test:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ENV VARS DEBUG
// ═══════════════════════════════════════════════════════════════════════

app.get("/make-server-9e4b8b7c/debug/env-vars", (c) => {
  const apolloKey = Deno.env.get('APOLLO_API_KEY');
  const hunterKey = Deno.env.get('HUNTER_API_KEY');
  const pdlKey = Deno.env.get('PDL_API_KEY');
  
  return c.json({
    timestamp: new Date().toISOString(),
    apollo: { configured: !!apolloKey, preview: apolloKey ? apolloKey.substring(0, 10) + '...' : 'N/A' },
    hunter: { configured: !!hunterKey, preview: hunterKey ? hunterKey.substring(0, 10) + '...' : 'N/A' },
    pdl: { configured: !!pdlKey, preview: pdlKey ? pdlKey.substring(0, 10) + '...' : 'N/A' }
  });
});

console.log('✅ Todas as rotas configuradas!');
console.log('🚀 Servidor pronto para receber requisições');
console.log('📍 Endpoint principal: /make-server-9e4b8b7c/*');

Deno.serve(app.fetch);
