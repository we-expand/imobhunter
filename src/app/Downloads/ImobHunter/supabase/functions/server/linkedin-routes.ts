import { Hono } from 'npm:hono';

const app = new Hono();

app.get('/profile/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ 
    success: true, 
    profile: { id, name: 'LinkedIn User', company: 'Company' } 
  });
});

export default app;
