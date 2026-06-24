import { Hono } from 'npm:hono';

const app = new Hono();

app.get('/status', (c) => {
  return c.json({ 
    success: true, 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default app;
