// ═══════════════════════════════════════════════════════════════════════
// 🔐 IMOBHUNTER - AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════════

import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";
import { getEnv } from "./env-helper.ts";

const authRouter = new Hono();

// Criar cliente Supabase
const getSupabaseAdmin = () => {
  return createClient(
    getEnv('SUPABASE_URL') || '',
    getEnv('SUPABASE_SERVICE_ROLE_KEY') || '',
  );
};

const getSupabaseClient = () => {
  return createClient(
    getEnv('SUPABASE_URL') || '',
    getEnv('SUPABASE_ANON_KEY') || '',
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 📝 SIGNUP - Criar novo usuário
// ═══════════════════════════════════════════════════════════════════════
authRouter.post("/signup", async (c) => {
  console.log('🔐 [SIGNUP] Nova requisição recebida');
  
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    console.log('📧 [SIGNUP] Email:', email);
    console.log('👤 [SIGNUP] Nome:', name);

    // Validações
    if (!email || !password || !name) {
      console.error('❌ [SIGNUP] Campos obrigatórios faltando');
      return c.json({ 
        success: false, 
        error: 'Email, senha e nome são obrigatórios' 
      }, 400);
    }

    if (password.length < 6) {
      console.error('❌ [SIGNUP] Senha muito curta');
      return c.json({ 
        success: false, 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      }, 400);
    }

    if (!email.includes('@')) {
      console.error('❌ [SIGNUP] Email inválido');
      return c.json({ 
        success: false, 
        error: 'Email inválido' 
      }, 400);
    }

    // Criar usuário no Supabase Auth
    const supabase = getSupabaseAdmin();
    
    console.log('🔨 [SIGNUP] Criando usuário no Supabase Auth...');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { 
        name: name,
        created_at: new Date().toISOString(),
        role: 'user'
      },
      // Confirmar email automaticamente já que não temos servidor de email configurado
      email_confirm: true
    });

    if (error) {
      console.error('❌ [SIGNUP] Erro ao criar usuário:', error);
      
      // Verificar se já existe
      if (error.message.includes('already registered')) {
        return c.json({ 
          success: false, 
          error: 'Este email já está cadastrado. Faça login.' 
        }, 400);
      }
      
      return c.json({ 
        success: false, 
        error: error.message || 'Erro ao criar usuário' 
      }, 500);
    }

    console.log('✅ [SIGNUP] Usuário criado com sucesso!');
    console.log('📊 [SIGNUP] User ID:', data.user?.id);

    return c.json({
      success: true,
      message: 'Usuário criado com sucesso! Você já pode fazer login.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: name,
        role: 'user'
      }
    }, 201);

  } catch (error) {
    console.error('💥 [SIGNUP] Erro inesperado:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🔓 LOGIN - Autenticar usuário
// ═══════════════════════════════════════════════════════════════════════
authRouter.post("/login", async (c) => {
  console.log('🔐 [LOGIN] Nova requisição recebida');
  
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log('📧 [LOGIN] Email:', email);

    // Validações
    if (!email || !password) {
      console.error('❌ [LOGIN] Campos obrigatórios faltando');
      return c.json({ 
        success: false, 
        error: 'Email e senha são obrigatórios' 
      }, 400);
    }

    // Fazer login no Supabase Auth
    const supabase = getSupabaseClient();
    
    console.log('🔍 [LOGIN] Tentando autenticar...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('❌ [LOGIN] Erro ao autenticar:', error.message);
      
      // Mensagem genérica por segurança
      return c.json({ 
        success: false, 
        error: 'Email ou senha incorretos' 
      }, 401);
    }

    if (!data.session) {
      console.error('❌ [LOGIN] Nenhuma sessão criada');
      return c.json({ 
        success: false, 
        error: 'Erro ao criar sessão' 
      }, 500);
    }

    console.log('✅ [LOGIN] Login bem-sucedido!');
    console.log('📊 [LOGIN] User ID:', data.user?.id);
    console.log('🔑 [LOGIN] Access Token criado');

    return c.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name || email.split('@')[0],
        role: data.user?.user_metadata?.role || 'user'
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      }
    }, 200);

  } catch (error) {
    console.error('💥 [LOGIN] Erro inesperado:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🔄 REFRESH - Renovar token de acesso
// ═══════════════════════════════════════════════════════════════════════
authRouter.post("/refresh", async (c) => {
  console.log('🔄 [REFRESH] Nova requisição recebida');
  
  try {
    const body = await c.req.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return c.json({ 
        success: false, 
        error: 'Refresh token é obrigatório' 
      }, 400);
    }

    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refresh_token
    });

    if (error) {
      console.error('❌ [REFRESH] Erro:', error.message);
      return c.json({ 
        success: false, 
        error: 'Token inválido ou expirado' 
      }, 401);
    }

    console.log('✅ [REFRESH] Token renovado com sucesso');

    return c.json({
      success: true,
      session: {
        access_token: data.session?.access_token,
        refresh_token: data.session?.refresh_token,
        expires_at: data.session?.expires_at
      }
    }, 200);

  } catch (error) {
    console.error('💥 [REFRESH] Erro inesperado:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🚪 LOGOUT - Encerrar sessão
// ═══════════════════════════════════════════════════════════════════════
authRouter.post("/logout", async (c) => {
  console.log('🚪 [LOGOUT] Nova requisição recebida');
  
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Token de acesso não fornecido' 
      }, 401);
    }

    const supabase = getSupabaseClient();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ [LOGOUT] Erro:', error.message);
      return c.json({ 
        success: false, 
        error: 'Erro ao fazer logout' 
      }, 500);
    }

    console.log('✅ [LOGOUT] Logout realizado com sucesso');

    return c.json({
      success: true,
      message: 'Logout realizado com sucesso'
    }, 200);

  } catch (error) {
    console.error('💥 [LOGOUT] Erro inesperado:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 👤 ME - Obter dados do usuário autenticado
// ═══════════════════════════════════════════════════════════════════════
authRouter.get("/me", async (c) => {
  console.log('👤 [ME] Nova requisição recebida');
  
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return c.json({ 
        success: false, 
        error: 'Token de acesso não fornecido' 
      }, 401);
    }

    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      console.error('❌ [ME] Token inválido');
      return c.json({ 
        success: false, 
        error: 'Token inválido ou expirado' 
      }, 401);
    }

    console.log('✅ [ME] Usuário autenticado:', data.user.id);

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        role: data.user.user_metadata?.role || 'user',
        created_at: data.user.created_at
      }
    }, 200);

  } catch (error) {
    console.error('💥 [ME] Erro inesperado:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

export default authRouter;
