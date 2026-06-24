// ═══════════════════════════════════════════════════════════════════════
// 🔐 IMOBHUNTER - SUPABASE AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════════

import { projectId, publicAnonKey } from '../utils/supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c`;

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

class SupabaseAuthService {
  // ═══════════════════════════════════════════════════════════════════════
  // 📝 SIGNUP - Criar novo usuário
  // ═══════════════════════════════════════════════════════════════════════
  async signup(data: SignupData): Promise<AuthResponse> {
    console.log('🔐 [AUTH SERVICE] Iniciando signup...');
    console.log('📍 [AUTH SERVICE] URL:', `${SERVER_URL}/signup`);
    console.log('📧 [AUTH SERVICE] Email:', data.email);
    console.log('👤 [AUTH SERVICE] Nome:', data.name);
    
    try {
      const response = await fetch(`${SERVER_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });

      console.log('📡 [AUTH SERVICE] Response status:', response.status);
      console.log('📡 [AUTH SERVICE] Response ok:', response.ok);

      const result = await response.json();
      console.log('📊 [AUTH SERVICE] Response data:', result);

      if (!response.ok) {
        console.error('❌ [AUTH SERVICE] Erro no signup:', result.error);
        return {
          success: false,
          error: result.error || 'Erro ao criar conta'
        };
      }

      console.log('✅ [AUTH SERVICE] Signup bem-sucedido!');
      return result;

    } catch (error) {
      console.error('💥 [AUTH SERVICE] Erro inesperado no signup:', error);
      return {
        success: false,
        error: 'Erro ao conectar com o servidor. Verifique se o servidor está rodando.'
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 🔓 LOGIN - Autenticar usuário
  // ═══════════════════════════════════════════════════════════════════════
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔐 [AUTH SERVICE] Iniciando login...');
    console.log('📍 [AUTH SERVICE] URL:', `${SERVER_URL}/login`);
    console.log('📧 [AUTH SERVICE] Email:', data.email);
    
    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });

      console.log('📡 [AUTH SERVICE] Response status:', response.status);
      console.log('📡 [AUTH SERVICE] Response ok:', response.ok);

      const result = await response.json();
      console.log('📊 [AUTH SERVICE] Response data:', result);

      if (!response.ok) {
        console.error('❌ [AUTH SERVICE] Erro no login:', result.error);
        return {
          success: false,
          error: result.error || 'Erro ao fazer login'
        };
      }

      console.log('✅ [AUTH SERVICE] Login bem-sucedido!');
      
      // Salvar sessão no localStorage
      if (result.session) {
        this.saveSession(result.session, result.user);
      }

      return result;

    } catch (error) {
      console.error('💥 [AUTH SERVICE] Erro inesperado no login:', error);
      return {
        success: false,
        error: 'Erro ao conectar com o servidor. Verifique se o servidor está rodando.'
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 🚪 LOGOUT - Encerrar sessão
  // ═══════════════════════════════════════════════════════════════════════
  async logout(): Promise<void> {
    console.log('🚪 [AUTH SERVICE] Fazendo logout...');
    
    try {
      const session = this.getSession();
      
      if (session?.access_token) {
        await fetch(`${SERVER_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });
      }

      // Limpar localStorage
      this.clearSession();
      console.log('✅ [AUTH SERVICE] Logout concluído');

    } catch (error) {
      console.error('💥 [AUTH SERVICE] Erro no logout:', error);
      // Mesmo com erro, limpar sessão local
      this.clearSession();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 👤 ME - Obter dados do usuário autenticado
  // ═══════════════════════════════════════════════════════════════════════
  async getCurrentUser(): Promise<AuthResponse> {
    console.log('👤 [AUTH SERVICE] Obtendo usuário atual...');
    
    try {
      const session = this.getSession();
      
      if (!session?.access_token) {
        return {
          success: false,
          error: 'Não autenticado'
        };
      }

      const response = await fetch(`${SERVER_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ [AUTH SERVICE] Erro ao obter usuário:', result.error);
        // Se token inválido, limpar sessão
        if (response.status === 401) {
          this.clearSession();
        }
        return {
          success: false,
          error: result.error || 'Erro ao obter usuário'
        };
      }

      console.log('✅ [AUTH SERVICE] Usuário obtido com sucesso');
      return result;

    } catch (error) {
      console.error('💥 [AUTH SERVICE] Erro inesperado ao obter usuário:', error);
      return {
        success: false,
        error: 'Erro ao conectar com o servidor'
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // 💾 GERENCIAMENTO DE SESSÃO LOCAL
  // ═══════════════════════════════════════════════════════════════════════
  
  private saveSession(session: any, user: any): void {
    localStorage.setItem('supabase_auth_session', JSON.stringify(session));
    localStorage.setItem('supabase_auth_user', JSON.stringify(user));
    
    // Manter compatibilidade com sistema antigo
    localStorage.setItem('userSession', JSON.stringify({
      ...user,
      access_token: session.access_token
    }));
  }

  getSession(): any {
    try {
      const sessionStr = localStorage.getItem('supabase_auth_session');
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch (error) {
      console.error('Erro ao ler sessão:', error);
      return null;
    }
  }

  getUser(): any {
    try {
      const userStr = localStorage.getItem('supabase_auth_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erro ao ler usuário:', error);
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem('supabase_auth_session');
    localStorage.removeItem('supabase_auth_user');
    localStorage.removeItem('userSession'); // Compatibilidade
    localStorage.removeItem('app-users'); // Limpar sistema antigo
    
    console.log('🧹 Sessão limpa completamente');
  }

  isAuthenticated(): boolean {
    // Limpar sessões antigas do sistema anterior ao verificar
    const oldSession = localStorage.getItem('userSession');
    if (oldSession) {
      try {
        const parsed = JSON.parse(oldSession);
        // Se não tem access_token do Supabase, é sessão antiga
        if (!parsed.access_token || !parsed.access_token.startsWith('eyJ')) {
          console.log('🧹 Limpando sessão antiga do sistema anterior...');
          localStorage.removeItem('userSession');
          localStorage.removeItem('app-users');
        }
      } catch (e) {
        localStorage.removeItem('userSession');
      }
    }
    
    const session = this.getSession();
    
    if (!session || !session.access_token) {
      return false;
    }

    // Verificar se token expirou
    if (session.expires_at) {
      const now = Math.floor(Date.now() / 1000);
      if (now >= session.expires_at) {
        console.log('⚠️ [AUTH SERVICE] Token expirado');
        this.clearSession();
        return false;
      }
    }

    return true;
  }
}

export const supabaseAuthService = new SupabaseAuthService();