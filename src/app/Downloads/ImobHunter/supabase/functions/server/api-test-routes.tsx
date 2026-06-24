import { Hono } from 'npm:hono';

const app = new Hono();

app.get('/test', (c) => {
  return c.json({ 
    success: true, 
    message: 'API test endpoint working',
    timestamp: new Date().toISOString()
  });
});

export default app;
