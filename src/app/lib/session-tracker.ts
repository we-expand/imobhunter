// 📊 Session Tracker - Monitora engajamento do usuário em tempo real

import { adminSync } from './admin-sync-service';

interface SessionData {
  userId: string;
  userName: string;
  startTime: number;
  lastActivity: number;
  pagesVisited: string[];
  featuresUsed: string[];
  leadsCreatedToday: number;
  messagesSentToday: number;
}

class SessionTracker {
  private session: SessionData | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  /**
   * Inicia tracking da sessão
   */
  startSession(userId: string, userName: string) {
    const now = Date.now();
    
    this.session = {
      userId,
      userName,
      startTime: now,
      lastActivity: now,
      pagesVisited: ['Dashboard'],
      featuresUsed: [],
      leadsCreatedToday: 0,
      messagesSentToday: 0,
    };

    console.log('📊 [SessionTracker] Sessão iniciada:', {
      usuario: userName,
      horario: new Date(now).toLocaleTimeString('pt-PT')
    });

    // Atualiza a cada 30 segundos
    this.updateInterval = setInterval(() => {
      this.updateSessionDuration();
    }, 30000);

    // Atualiza ao sair/fechar aba
    window.addEventListener('beforeunload', () => this.endSession());
  }

  /**
   * Atualiza duração da sessão no backend
   */
  private updateSessionDuration() {
    if (!this.session) return;

    const duration = Math.floor((Date.now() - this.session.startTime) / 1000);
    
    console.log('📊 [SessionTracker] Atualizando duração:', {
      usuario: this.session.userName,
      duracao: this.formatDuration(duration),
      paginas: this.session.pagesVisited.length,
      features: this.session.featuresUsed.length
    });

    // Envia para o backend
    adminSync.updateSessionMetrics({
      session_duration: duration,
      pages_visited: this.session.pagesVisited,
      features_used: this.session.featuresUsed,
      leads_created_today: this.session.leadsCreatedToday,
      messages_sent_today: this.session.messagesSentToday,
      last_activity: new Date().toISOString(),
    });
  }

  /**
   * Registra visita a uma página
   */
  visitPage(pageName: string) {
    if (!this.session) return;

    this.session.lastActivity = Date.now();
    
    if (!this.session.pagesVisited.includes(pageName)) {
      this.session.pagesVisited.push(pageName);
      console.log(`📄 [SessionTracker] Página visitada: ${pageName}`);
    }
  }

  /**
   * Registra uso de uma feature
   */
  useFeature(featureName: string) {
    if (!this.session) return;

    this.session.lastActivity = Date.now();
    
    if (!this.session.featuresUsed.includes(featureName)) {
      this.session.featuresUsed.push(featureName);
      console.log(`⚡ [SessionTracker] Feature usada: ${featureName}`);
    }

    // Atualiza última feature usada
    adminSync.updateSessionMetrics({
      last_feature_used: featureName,
      last_activity: new Date().toISOString(),
    });
  }

  /**
   * Registra criação de lead
   */
  trackLeadCreated() {
    if (!this.session) return;
    this.session.leadsCreatedToday++;
    this.useFeature('Lead Search');
  }

  /**
   * Registra envio de mensagem
   */
  trackMessageSent() {
    if (!this.session) return;
    this.session.messagesSentToday++;
    this.useFeature('AI Command Center');
  }

  /**
   * Formata duração em formato legível
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  /**
   * Finaliza sessão
   */
  endSession() {
    if (!this.session) return;

    this.updateSessionDuration();

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    console.log('📊 [SessionTracker] Sessão encerrada:', {
      duracao_total: this.formatDuration(
        Math.floor((Date.now() - this.session.startTime) / 1000)
      ),
      paginas_visitadas: this.session.pagesVisited.length,
      features_usadas: this.session.featuresUsed.length
    });

    this.session = null;
  }

  /**
   * Obtém duração atual da sessão
   */
  getCurrentDuration(): number {
    if (!this.session) return 0;
    return Math.floor((Date.now() - this.session.startTime) / 1000);
  }

  /**
   * Obtém dados da sessão atual
   */
  getSessionData(): SessionData | null {
    return this.session;
  }
}

// Singleton
export const sessionTracker = new SessionTracker();