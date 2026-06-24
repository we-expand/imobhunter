// Teste MÍNIMO - apenas para verificar se deploy funciona
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

console.log('🚀 TESTE MÍNIMO - Servidor iniciando...');

const app = new Hono();

app.use('/*', cors({
  origin: "*",
}));

app.get("/ping", (c) => {
  console.log('✅ Rota /ping foi chamada!');
  return c.json({ 
    status: "alive",
    message: "Servidor funcionando!",
    timestamp: new Date().toISOString()
  });
});

app.all("*", (c) => {
  console.log(`⚠️ Rota não encontrada: ${c.req.method} ${c.req.path}`);
  return c.json({
    error: "Rota não encontrada",
    path: c.req.path,
    method: c.req.method,
    rotas_disponiveis: ["/ping"]
  }, 404);
});

console.log('✅ Servidor pronto! Rota disponível: /ping');

Deno.serve(app.fetch);
