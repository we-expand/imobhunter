// ═══════════════════════════════════════════════════════════════════════
// 🔐 IMOBHUNTER - AUTH SERVICE (SUPABASE REAL)
// Sistema de autenticação oficial usando Supabase
// ═══════════════════════════════════════════════════════════════════════

import { getSupabase } from '../utils/supabase/client';

// ═══════════════════════════════════════════════════════════════════════
// 📝 SIGNUP
// ═══════════════════════════════════════════════════════════════════════

export async function signup(email: string, password: string, name: string) {
  try {
    const supabase = getSupabase();
    
    // 1. Criar usuário no Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          full_name: name,
        }
      }
    });

    if (error) {
      console.error('💥 Erro no signup Supabase:', error);
      return {
        success: false,
        error: error.message === 'User already registered' 
          ? 'Este email já está cadastrado. Faça login.'
          : 'Erro ao criar conta: ' + error.message
      };
    }

    if (data.user) {
      console.log('✅ Usuário criado no Supabase:', data.user.id);
      
      return {
        success: true,
        message: 'Conta criada com sucesso! Verifique seu email se necessário.',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || name,
          role: 'user'
        }
      };
    }

    return {
      success: false,
      error: 'Erro desconhecido ao criar conta'
    };

  } catch (error) {
    console.error('💥 Erro inesperado no signup:', error);
    return {
      success: false,
      error: 'Erro de conexão ao criar conta'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 🔓 LOGIN
// ═══════════════════════════════════════════════════════════════════════

export async function login(email: string, password: string) {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('💥 Erro no login Supabase:', error);
      let errorMessage = 'Erro ao fazer login: ' + error.message;
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = '⚠️ Verifique seu email para confirmar o cadastro (ou desative a confirmação no painel do Supabase).';
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    if (data.user) {
      console.log('✅ Login Supabase bem-sucedido:', data.user.id);
      
      return {
        success: true,
        message: 'Login realizado com sucesso!',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          role: 'user', // Pode vir do metadata se tiver roles implementadas
          createdAt: data.user.created_at
        }
      };
    }

    return {
      success: false,
      error: 'Erro desconhecido ao fazer login'
    };

  } catch (error) {
    console.error('💥 Erro inesperado no login:', error);
    return {
      success: false,
      error: 'Erro de conexão ao fazer login'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 👤 GET CURRENT USER
// ═══════════════════════════════════════════════════════════════════════

export async function getCurrentUser() {
  const supabase = getSupabase();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return {
      success: false,
      error: 'Nenhuma sessão ativa'
    };
  }

  return {
    success: true,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
      role: 'user',
      createdAt: session.user.created_at
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════
// 🚪 LOGOUT
// ═══════════════════════════════════════════════════════════════════════

export async function logout() {
  const supabase = getSupabase();
  await supabase.auth.signOut();
  console.log('✅ Logout Supabase concluído');
}

// ═══════════════════════════════════════════════════════════════════════
// 🔍 IS AUTHENTICATED
// ═══════════════════════════════════════════════════════════════════════

export function isAuthenticated(): boolean {
  // Verificação síncrona básica via token no storage
  // Atualizado para suportar sessionStorage (Modo Segurança Bancária)
  
  if (typeof window === 'undefined') return false;

  const hasInLocal = !!localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('sb-')) || '');
  const hasInSession = !!sessionStorage.getItem(Object.keys(sessionStorage).find(k => k.startsWith('sb-')) || '');

  return hasInLocal || hasInSession;
}

// ═══════════════════════════════════════════════════════════════════════
// 🔍 GET SESSION
// ═══════════════════════════════════════════════════════════════════════

export async function getSessionData() {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
    role: 'user',
    createdAt: session.user.created_at
  };
}

// Exportar como objeto
export const localAuthService = {
  signup,
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
  getSession: getSessionData
};
