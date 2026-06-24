import { Hono } from 'npm:hono';

const app = new Hono();

app.post('/analyze', async (c) => {
  const body = await c.req.json();
  return c.json({ 
    success: true, 
    analysis: { score: 85, insights: [] }
  });
});

export default app;
