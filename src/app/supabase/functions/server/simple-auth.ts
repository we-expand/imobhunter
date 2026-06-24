// ═══════════════════════════════════════════════════════════════════════
// 🔐 IMOBHUNTER - SIMPLE AUTH SYSTEM (KV-BASED)
// Sistema de autenticação simples usando KV Store e JWT
// ═══════════════════════════════════════════════════════════════════════

import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const simpleAuthRouter = new Hono();

// ═══════════════════════════════════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

// Hash simples para senha (em produção use bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Gerar token JWT simples
function generateToken(userId: string, email: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 dias
  };
  
  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));
  const signature = btoa(`${base64Header}.${base64Payload}.SECRET_KEY`);
  
  return `${base64Header}.${base64Payload}.${signature}`;
}

// Validar token JWT
function validateToken(token: string): { valid: boolean; userId?: string; email?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar expiração
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }
    
    return {
      valid: true,
      userId: payload.userId,
      email: payload.email
    };
  } catch {
    return { valid: false };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 📝 SIGNUP - Criar novo usuário
// ═══════════════════════════════════════════════════════════════════════
simpleAuthRouter.post("/signup", async (c) => {
  console.log('🔐 [SIMPLE-AUTH] SIGNUP - Nova requisição');
  
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    // Validações
    if (!email || !password || !name) {
      return c.json({ 
        success: false, 
        error: 'Email, senha e nome são obrigatórios' 
      }, 400);
    }

    if (password.length < 6) {
      return c.json({ 
        success: false, 
        error: 'A senha deve ter pelo menos 6 caracteres' 
      }, 400);
    }

    if (!email.includes('@')) {
      return c.json({ 
        success: false, 
        error: 'Email inválido' 
      }, 400);
    }

    // Verificar se email já existe
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ 
        success: false, 
        error: 'Este email já está cadastrado. Faça login.' 
      }, 400);
    }

    // Criar usuário
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    
    const userData = {
      id: userId,
      email,
      name,
      passwordHash,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    // Salvar no KV Store
    await kv.set(`user:${email}`, userData);
    await kv.set(`userid:${userId}`, email); // Index reverso

    console.log('✅ [SIMPLE-AUTH] Usuário criado:', userId);

    return c.json({
      success: true,
      message: 'Usuário criado com sucesso! Você já pode fazer login.',
      user: {
        id: userId,
        email,
        name,
        role: 'user'
      }
    }, 201);

  } catch (error) {
    console.error('💥 [SIMPLE-AUTH] SIGNUP erro:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🔓 LOGIN - Autenticar usuário
// ═══════════════════════════════════════════════════════════════════════
simpleAuthRouter.post("/login", async (c) => {
  console.log('🔐 [SIMPLE-AUTH] LOGIN - Nova requisição');
  
  try {
    const body = await c.req.json();
    const { email, password } = body;

    // Validações
    if (!email || !password) {
      return c.json({ 
        success: false, 
        error: 'Email e senha são obrigatórios' 
      }, 400);
    }

    // Buscar usuário
    const userData = await kv.get(`user:${email}`);
    
    if (!userData) {
      return c.json({ 
        success: false, 
        error: 'Email ou senha incorretos' 
      }, 401);
    }

    // Verificar senha
    const passwordHash = await hashPassword(password);
    if (passwordHash !== userData.passwordHash) {
      return c.json({ 
        success: false, 
        error: 'Email ou senha incorretos' 
      }, 401);
    }

    // Gerar token
    const token = generateToken(userData.id, userData.email);

    console.log('✅ [SIMPLE-AUTH] Login bem-sucedido:', userData.id);

    return c.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
      },
      session: {
        access_token: token,
        expires_at: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
      }
    }, 200);

  } catch (error) {
    console.error('💥 [SIMPLE-AUTH] LOGIN erro:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 👤 ME - Obter dados do usuário autenticado
// ═══════════════════════════════════════════════════════════════════════
simpleAuthRouter.get("/me", async (c) => {
  console.log('👤 [SIMPLE-AUTH] ME - Nova requisição');
  
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return c.json({ 
        success: false, 
        error: 'Token de acesso não fornecido' 
      }, 401);
    }

    // Validar token
    const validation = validateToken(token);
    if (!validation.valid || !validation.email) {
      return c.json({ 
        success: false, 
        error: 'Token inválido ou expirado' 
      }, 401);
    }

    // Buscar dados do usuário
    const userData = await kv.get(`user:${validation.email}`);
    
    if (!userData) {
      return c.json({ 
        success: false, 
        error: 'Usuário não encontrado' 
      }, 404);
    }

    console.log('✅ [SIMPLE-AUTH] Usuário autenticado:', userData.id);

    return c.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        created_at: userData.createdAt
      }
    }, 200);

  } catch (error) {
    console.error('💥 [SIMPLE-AUTH] ME erro:', error);
    return c.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════
// 🚪 LOGOUT - Encerrar sessão (apenas limpa do lado do cliente)
// ═══════════════════════════════════════════════════════════════════════
simpleAuthRouter.post("/logout", async (c) => {
  console.log('🚪 [SIMPLE-AUTH] LOGOUT - Nova requisição');
  
  return c.json({
    success: true,
    message: 'Logout realizado com sucesso'
  }, 200);
});

// ═══════════════════════════════════════════════════════════════════════
// 🔧 MIDDLEWARE - Autenticar requisições
// ═══════════════════════════════════════════════════════════════════════
export async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ 
      success: false, 
      error: 'Token de acesso não fornecido' 
    }, 401);
  }

  const validation = validateToken(token);
  if (!validation.valid) {
    return c.json({ 
      success: false, 
      error: 'Token inválido ou expirado' 
    }, 401);
  }

  // Adicionar userId ao contexto
  c.set('userId', validation.userId);
  c.set('userEmail', validation.email);

  await next();
}

export default simpleAuthRouter;
