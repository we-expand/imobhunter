/**
 * Serviço de sincronização com Admin
 * Registra todas as ações reais dos usuários no painel Admin
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c`;

class AdminSyncService {
  private async fetch(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Erro na sincronização admin:', error);
      return null;
    }
  }

  /**
   * Registra ou atualiza um usuário no Admin
   */
  async syncUser(user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    plan?: string;
  }) {
    console.log('📊 Sincronizando usuário com Admin:', user.email);

    // 🌟 João Nunes = VIP com custo €0
    const isJoaoNunes = user.id === 'dev-joao-nunes' || user.email === 'joao@kw.pt';
    
    return this.fetch('/admin/sync-user', {
      method: 'POST',
      body: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        plan: isJoaoNunes ? 'vip' : (user.plan || 'pro'),
        status: 'online',
        last_login: new Date().toISOString(),
        mrr: 0 // VIP sempre €0
      })
    });
  }

  /**
   * Atualiza status do usuário (online/offline)
   */
  async updateUserStatus(userId: string, status: 'online' | 'offline' | 'active') {
    return this.fetch('/admin/update-status', {
      method: 'POST',
      body: JSON.stringify({ userId, status })
    });
  }

  /**
   * Registra uma atividade no Admin
   */
  async logActivity(activity: {
    userId: string;
    userName: string;
    action: string;
    type: 'login' | 'logout' | 'lead_created' | 'message_sent' | 'search' | 'upgrade' | 'handover' | 'ai_activated';
    metadata?: any;
  }) {
    console.log('📝 Registrando atividade no Admin:', activity.action);

    return this.fetch('/admin/log-activity', {
      method: 'POST',
      body: JSON.stringify({
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: activity.userId,
        user_name: activity.userName,
        action: activity.action,
        type: activity.type,
        metadata: activity.metadata,
        created_at: new Date().toISOString()
      })
    });
  }

  /**
   * Incrementa contadores de um usuário
   */
  async incrementUserStats(userId: string, stats: {
    total_leads?: number;
    messages_sent?: number;
    searches?: number;
  }) {
    return this.fetch('/admin/increment-stats', {
      method: 'POST',
      body: JSON.stringify({ userId, stats })
    });
  }

  /**
   * Registra login do usuário
   */
  async onUserLogin(user: any) {
    await this.syncUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan || 'pro'
    });

    await this.logActivity({
      userId: user.id,
      userName: user.name,
      action: 'realizou login no sistema',
      type: 'login'
    });
  }

  /**
   * Registra logout do usuário
   */
  async onUserLogout(user: any) {
    await this.updateUserStatus(user.id, 'offline');
    
    await this.logActivity({
      userId: user.id,
      userName: user.name,
      action: 'saiu do sistema',
      type: 'logout'
    });
  }

  /**
   * Registra quando IA é ativada
   */
  async onAIActivated(user: any) {
    await this.logActivity({
      userId: user.id,
      userName: user.name,
      action: 'ativou a IA autônoma',
      type: 'ai_activated'
    });
  }

  /**
   * Registra quando um lead é criado
   */
  async onLeadCreated(user: any, leadName: string, cluster: string) {
    await this.incrementUserStats(user.id, { total_leads: 1 });
    
    await this.logActivity({
      userId: user.id,
      userName: user.name,
      action: `adicionou o lead "${leadName}" no cluster ${cluster}`,
      type: 'lead_created',
      metadata: { leadName, cluster }
    });
  }

  /**
   * Registra quando uma mensagem é enviada
   */
  async onMessageSent(user: any, channel: string, recipient: string) {
    await this.incrementUserStats(user.id, { messages_sent: 1 });
    
    await this.logActivity({
      userId: user.id,
      userName: user.name,
      action: `enviou mensagem via ${channel} para ${recipient}`,
      type: 'message_sent',
      metadata: { channel, recipient }
    });
  }

  /**
   * Registra quando uma busca é feita
   */
  async onSearchPerformed(user: any, query: string, resultsCount: number) {
    await this.incrementUserStats(user.id, { searches: 1 });
    
    await this.logActivity({
      userId: user.id,
      userName: user.name,
      action: `pesquisou "${query}" (${resultsCount} resultados)`,
      type: 'search',
      metadata: { query, resultsCount }
    });
  }

  /**
   * Registra quando um lead é transferido (handover)
   */
  async onLeadHandover(user: any, leadName: string) {
    await this.logActivity({
      userId: user.id,
      userName: user.name,
      action: `transferiu o lead "${leadName}" para consultor humano`,
      type: 'handover',
      metadata: { leadName }
    });
  }

  /**
   * Atualiza métricas de sessão do usuário
   */
  async updateSessionMetrics(metrics: {
    session_duration?: number;
    pages_visited?: string[];
    features_used?: string[];
    leads_created_today?: number;
    messages_sent_today?: number;
    last_feature_used?: string;
    last_activity?: string;
  }) {
    const userId = 'dev-joao-nunes'; // Por enquanto só João Nunes
    
    return this.fetch('/admin/update-session', {
      method: 'POST',
      body: JSON.stringify({ userId, ...metrics })
    });
  }
}

export const adminSync = new AdminSyncService();