// ═══════════════════════════════════════════════════════════════════════
// 🔐 IMOBHUNTER - SIMPLE AUTH SERVICE (Frontend)
// Sistema de autenticação simples usando nosso próprio backend
// ═══════════════════════════════════════════════════════════════════════

const API_BASE = 'https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/make-server-9e4b8b7c';
const SESSION_KEY = 'imobhunter_session';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Session {
  access_token: string;
  expires_at: number;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
  session?: Session;
}

// ═══════════════════════════════════════════════════════════════════════
// 🔧 STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════

function saveSession(user: User, session: Session) {
  const data = {
    user,
    session,
    savedAt: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  console.log('✅ Sessão salva localmente');
}

function getSession(): { user: User; session: Session } | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Verificar se token expirou
    if (parsed.session.expires_at < Math.floor(Date.now() / 1000)) {
      console.log('⏰ Token expirado');
      clearSession();
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('❌ Erro ao recuperar sessão:', error);
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  console.log('🗑️ Sessão removida');
}

// ═══════════════════════════════════════════════════════════════════════
// 📝 SIGNUP - Criar novo usuário
// ═══════════════════════════════════════════════════════════════════════

export async function signup(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    console.log('🔐 [SIMPLE-AUTH] Criando conta...');
    
    const response = await fetch(`${API_BASE}/simple-auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erro no signup:', data.error);
      return data;
    }

    console.log('✅ Conta criada com sucesso!');
    return data;
    
  } catch (error) {
    console.error('💥 Erro na requisição de signup:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 🔓 LOGIN - Autenticar usuário
// ═══════════════════════════════════════════════════════════════════════

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('🔐 [SIMPLE-AUTH] Fazendo login...');
    
    const response = await fetch(`${API_BASE}/simple-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erro no login:', data.error);
      return data;
    }

    // Salvar sessão
    if (data.success && data.user && data.session) {
      saveSession(data.user, data.session);
    }

    console.log('✅ Login bem-sucedido!');
    return data;
    
  } catch (error) {
    console.error('💥 Erro na requisição de login:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 👤 GET CURRENT USER - Obter dados do usuário autenticado
// ═══════════════════════════════════════════════════════════════════════

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const sessionData = getSession();
    
    if (!sessionData) {
      return {
        success: false,
        error: 'Nenhuma sessão ativa'
      };
    }

    console.log('👤 [SIMPLE-AUTH] Verificando usuário...');
    
    const response = await fetch(`${API_BASE}/simple-auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionData.session.access_token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Sessão inválida');
      clearSession();
      return data;
    }

    console.log('✅ Usuário válido:', data.user?.email);
    return data;
    
  } catch (error) {
    console.error('💥 Erro ao verificar usuário:', error);
    return {
      success: false,
      error: 'Erro ao conectar com o servidor'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// 🚪 LOGOUT - Encerrar sessão
// ═══════════════════════════════════════════════════════════════════════

export async function logout(): Promise<void> {
  console.log('🚪 [SIMPLE-AUTH] Fazendo logout...');
  clearSession();
  console.log('✅ Logout concluído');
}

// ═══════════════════════════════════════════════════════════════════════
// 🔍 IS AUTHENTICATED - Verificar se está autenticado
// ═══════════════════════════════════════════════════════════════════════

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

// ═══════════════════════════════════════════════════════════════════════
// 🔑 GET TOKEN - Obter token de acesso
// ═══════════════════════════════════════════════════════════════════════

export function getAccessToken(): string | null {
  const sessionData = getSession();
  return sessionData?.session.access_token || null;
}

// Exportar tudo como um objeto
export const simpleAuthService = {
  signup,
  login,
  getCurrentUser,
  logout,
  isAuthenticated,
  getAccessToken
};
