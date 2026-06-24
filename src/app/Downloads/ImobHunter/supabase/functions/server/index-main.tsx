// ═══════════════════════════════════════════════════════════════════════
// 🚀 IMOBHUNTER SERVER v1.3.0 - LOCAL DEVELOPMENT
// ═══════════════════════════════════════════════════════════════════════

console.log('🚀 IMOBHUNTER SERVER STARTING...');

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:";
import searchRouter from "./search-routes.ts";
import { generateDemoLeads } from "./demo-leads-generator.ts";
import { leadsDB } from "./leads-database.ts";

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

// Health check
app.get("/make-server-9e4b8b7c/health", (c) => {
  return c.json({ status: "ok" });
});

// Ping endpoint
app.get("/make-server-9e4b8b7c/ping", (c) => {
  return c.json({ 
    status: "alive",
    version: "1.3.0",
    timestamp: new Date().toISOString(),
    message: "Servidor funcionando! 🎉"
  });
});

// Mount search routes
app.route("/make-server-9e4b8b7c/search", searchRouter);

// Demo leads endpoint
app.post("/make-server-9e4b8b7c/leads/demo", async (c) => {
  try {
    const body = await c.req.json();
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
      total: leads.length
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// Get all leads
app.get("/make-server-9e4b8b7c/leads", async (c) => {
  try {
    const leads = await leadsDB.getAllLeads();
    return c.json({
      success: true,
      leads,
      total: leads.length
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

// KV Store test endpoints
app.get("/make-server-9e4b8b7c/kv/test", async (c) => {
  try {
    await kv.set('test_key', { message: 'Hello from KV!' });
    const value = await kv.get('test_key');
    return c.json({
      success: true,
      value
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, 500);
  }
});

console.log('✅ Todas as rotas configuradas!');
console.log('🚀 Servidor pronto para receber requisições');

Deno.serve(app.fetch);
