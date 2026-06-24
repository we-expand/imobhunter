import { Hono } from 'npm:hono';

const app = new Hono();

app.get('/profile/:username', (c) => {
  const username = c.req.param('username');
  return c.json({ 
    success: true, 
    profile: { username, followers: 0 }
  });
});

export default app;
