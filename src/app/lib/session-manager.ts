// Gerenciador de sessão com detecção de inatividade
import { toast } from 'sonner';

const INACTIVITY_TIMEOUT = 3600000; // 60 minutos (1 hora) - tempo MUITO maior!
const SESSION_KEY = 'user-session-token';
const LAST_ACTIVITY_KEY = 'last-activity-timestamp';

export class SessionManager {
  private inactivityTimer: NodeJS.Timeout | null = null;
  private onLogout: () => void;

  constructor(onLogout: () => void) {
    this.onLogout = onLogout;
    this.init();
  }

  private init() {
    // Eventos que resetam o timer de inatividade
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    events.forEach((event) => {
      document.addEventListener(event, () => this.resetInactivityTimer(), true);
    });

    // REMOVIDO: Detecta quando a aba volta ao foco
    // Não fazer logout ao voltar da aba - apenas verificar se sessão ainda é válida
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Apenas reseta o timer quando volta ao foco, sem fazer logout
        this.resetInactivityTimer();
      }
    });

    // Inicia o timer
    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    // Limpa timer anterior
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Atualiza timestamp de última atividade
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    // Cria novo timer
    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity();
    }, INACTIVITY_TIMEOUT);
  }

  private handleInactivity() {
    console.log('⏱️ Sessão expirada por inatividade');
    toast.error('Sessão expirada por inatividade. Faça login novamente.');
    this.logout();
  }

  private checkSession() {
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!lastActivity) return;

    const elapsed = Date.now() - parseInt(lastActivity);
    
    if (elapsed > INACTIVITY_TIMEOUT) {
      // Sessão expirou durante inatividade
      this.handleInactivity();
    } else {
      // Sessão ainda válida, reseta timer
      this.resetInactivityTimer();
    }
  }

  public saveSession(user: any) {
    // Salva usuário no localStorage
    localStorage.setItem('current-user', JSON.stringify(user));
    
    // Gera token de sessão
    const sessionToken = this.generateSessionToken();
    localStorage.setItem(SESSION_KEY, sessionToken);
    
    // Marca timestamp inicial
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    
    console.log('✅ Sessão salva e monitoramento iniciado');
  }

  public clearSession() {
    localStorage.removeItem('current-user');
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }

  public isSessionValid(): boolean {
    const token = localStorage.getItem(SESSION_KEY);
    const user = localStorage.getItem('current-user');
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

    if (!token || !user || !lastActivity) {
      return false;
    }

    const elapsed = Date.now() - parseInt(lastActivity);
    return elapsed < INACTIVITY_TIMEOUT;
  }

  private generateSessionToken(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public logout() {
    this.clearSession();
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.onLogout();
  }

  public destroy() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }
}

// Instância singleton
let sessionManagerInstance: SessionManager | null = null;

export const initSessionManager = (onLogout: () => void): SessionManager => {
  if (sessionManagerInstance) {
    sessionManagerInstance.destroy();
  }
  sessionManagerInstance = new SessionManager(onLogout);
  return sessionManagerInstance;
};

export const getSessionManager = (): SessionManager | null => {
  return sessionManagerInstance;
};