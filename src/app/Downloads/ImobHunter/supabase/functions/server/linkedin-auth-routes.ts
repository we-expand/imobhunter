import { Hono } from 'npm:hono';

const app = new Hono();

app.get('/auth', (c) => {
  return c.json({ success: true, message: 'LinkedIn auth endpoint' });
});

export default app;
