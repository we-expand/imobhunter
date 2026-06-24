import { Hono } from 'npm:hono';

const app = new Hono();

app.post('/submit', async (c) => {
  const body = await c.req.json();
  return c.json({ 
    success: true, 
    message: 'Feedback recebido',
    feedback: body
  });
});

export default app;
