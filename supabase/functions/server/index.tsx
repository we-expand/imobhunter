import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();
app.use("*", cors({ origin: "*", allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization"] }));
app.use("*", logger(console.log));
app.get("/make-server-9e4b8b7c/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));
app.get("/make-server-9e4b8b7c/test", (c) => c.json({ message: "ImobHunter OK!", apis: { apollo: !!Deno.env.get("APOLLO_API_KEY"), pdl: !!Deno.env.get("PDL_API_KEY"), rocketreach: !!Deno.env.get("ROCKETREACH_API_KEY") } }));
app.onError((err, c) => { console.error("❌", err); return c.json({ error: err.message }, 500); });
console.log("🚀 ImobHunter iniciando...");
Deno.serve(app.fetch);
