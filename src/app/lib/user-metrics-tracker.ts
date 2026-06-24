import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c`;

class UserMetricsTracker {
  private userId: string | null = null;

  // Define o usuário atual
  setUser(userId: string) {
    this.userId = userId;
  }

  // Pega o token de autenticação
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Incrementa contador de leads quando um lead é criado
  async trackLeadCreated() {
    if (!this.userId) {
      console.warn('⚠️ UserMetricsTracker: userId não definido');
      return;
    }

    try {
      const token = this.getToken();
      const response = await fetch(`${API_URL}/admin/increment-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || publicAnonKey}`
        },
        body: JSON.stringify({ userId: this.userId })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Métrica atualizada: Lead criado', data.total_leads);
      }
    } catch (error) {
      console.error('❌ Erro ao rastrear lead criado:', error);
    }
  }

  // Incrementa contador de mensagens quando uma mensagem é enviada
  async trackMessageSent() {
    if (!this.userId) {
      console.warn('⚠️ UserMetricsTracker: userId não definido');
      return;
    }

    try {
      const token = this.getToken();
      const response = await fetch(`${API_URL}/admin/increment-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || publicAnonKey}`
        },
        body: JSON.stringify({ userId: this.userId })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Métrica atualizada: Mensagem enviada', data.messages_sent);
      }
    } catch (error) {
      console.error('❌ Erro ao rastrear mensagem enviada:', error);
    }
  }

  // Incrementa contador de buscas quando uma busca é realizada
  async trackSearchPerformed() {
    if (!this.userId) {
      console.warn('⚠️ UserMetricsTracker: userId não definido');
      return;
    }

    try {
      const token = this.getToken();
      const response = await fetch(`${API_URL}/admin/increment-searches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || publicAnonKey}`
        },
        body: JSON.stringify({ userId: this.userId })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Métrica atualizada: Busca realizada', data.searches);
      }
    } catch (error) {
      console.error('❌ Erro ao rastrear busca:', error);
    }
  }

  // Rastreia múltiplos leads criados de uma vez (ex: importação)
  async trackMultipleLeads(count: number) {
    if (!this.userId || count <= 0) return;

    // Chama trackLeadCreated várias vezes
    for (let i = 0; i < count; i++) {
      await this.trackLeadCreated();
    }
  }

  // Rastreia múltiplas mensagens enviadas de uma vez
  async trackMultipleMessages(count: number) {
    if (!this.userId || count <= 0) return;

    for (let i = 0; i < count; i++) {
      await this.trackMessageSent();
    }
  }
}

// Instância singleton
export const metricsTracker = new UserMetricsTracker();
