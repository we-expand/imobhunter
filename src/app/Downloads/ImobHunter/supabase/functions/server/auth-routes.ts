import { Hono } from 'npm:hono';
import { createClient } from 'npm:';

const app = new Hono();

// Signup endpoint
app.post('/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });
    
    if (error) throw error;
    
    return c.json({ success: true, user: data });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 400);
  }
});

export default app;
