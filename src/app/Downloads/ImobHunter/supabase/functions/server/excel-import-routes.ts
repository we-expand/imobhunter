import { Hono } from 'npm:hono';

const app = new Hono();

app.post('/upload', async (c) => {
  return c.json({ 
    success: true, 
    message: 'Excel import endpoint',
    imported: 0
  });
});

export default app;
