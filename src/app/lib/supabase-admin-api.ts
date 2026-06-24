import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { User, PlatformMetrics, Activity } from './supabase-client';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c`;

class SupabaseAdminAPI {
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Verificar se as tabelas existem
   */
  async checkTables(): Promise<{ exists: boolean; error?: string }> {
    try {
      return await this.fetch('/admin/check-tables');
    } catch (error) {
      console.error('Erro ao verificar tabelas:', error);
      return { exists: false, error: error.message };
    }
  }

  /**
   * Verifica se as tabelas existem (alias para compatibilidade)
   */
  async checkTablesExist(): Promise<boolean> {
    const result = await this.checkTables();
    return result.exists;
  }

  /**
   * Inicializar banco de dados (criar tabelas)
   */
  async initDatabase(): Promise<{ success: boolean; needsManualSetup?: boolean; sql?: string; message?: string }> {
    try {
      return await this.fetch('/admin/init-database', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  /**
   * Criar dados de demonstração
   */
  async seedDemoData(): Promise<{ success: boolean; users?: number; error?: string }> {
    try {
      const result = await this.fetch('/admin/seed-demo', {
        method: 'POST',
      });

      if (result.success) {
        toast.success(`✅ ${result.users} usuários criados!`);
      }

      return result;
    } catch (error) {
      console.error('Erro ao criar dados demo:', error);
      
      // Se o erro for de duplicação, considerar sucesso parcial
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        toast.warning('⚠️ Alguns usuários já existiam');
        return { success: true, users: 0 };
      }
      
      toast.error('Erro ao criar dados de demonstração');
      return { success: false, error: error.message };
    }
  }

  /**
   * Obter métricas da plataforma
   */
  async getMetrics(): Promise<PlatformMetrics> {
    try {
      return await this.fetch('/admin/metrics');
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      throw error;
    }
  }

  /**
   * Obter todos os usuários
   */
  async getUsers(): Promise<User[]> {
    try {
      return await this.fetch('/admin/users');
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      throw error;
    }
  }

  /**
   * Obter atividades recentes
   */
  async getActivities(limit: number = 20): Promise<Activity[]> {
    try {
      return await this.fetch(`/admin/activities?limit=${limit}`);
    } catch (error) {
      console.error('Erro ao obter atividades:', error);
      throw error;
    }
  }

  /**
   * Obter atividades recentes (alias)
   */
  async getRecentActivity(limit: number = 20): Promise<Activity[]> {
    return this.getActivities(limit);
  }

  /**
   * Exportar usuários para CSV
   */
  async exportUsers() {
    try {
      const users = await this.getUsers();

      const csvData = users.map(u => ({
        Nome: u.name,
        Email: u.email,
        Plano: u.plan,
        Status: u.status,
        'Total Leads': u.total_leads,
        'Mensagens Enviadas': u.messages_sent,
        'MRR (€)': u.mrr,
        'Criado em': new Date(u.created_at).toLocaleDateString('pt-PT'),
        'Último Login': u.last_login ? new Date(u.last_login).toLocaleDateString('pt-PT') : 'Nunca'
      }));

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `usuarios-kw-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('📊 Relatório exportado!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar dados');
    }
  }
}

export const supabaseAdminAPI = new SupabaseAdminAPI();