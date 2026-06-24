/**
 * API Admin usando KV Store (não precisa criar tabelas!)
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { User, PlatformMetrics, Activity } from './supabase-client';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c`;

class SupabaseAdminKV {
  private isInitialized = false;
  private isInitializing = false;

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
   * Auto-inicializa o sistema (só roda 1 vez)
   */
  async autoInit(): Promise<void> {
    if (this.isInitialized || this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      console.log('✅ Sistema Admin pronto para dados REAIS (sem demo)');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Erro ao auto-inicializar:', error);
      this.isInitialized = true;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Obter métricas
   */
  async getMetrics(): Promise<PlatformMetrics> {
    await this.autoInit();

    try {
      return await this.fetch('/admin/metrics');
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
      // Retorna valores padrão em caso de erro
      return {
        total_users: 0,
        active_users: 0,
        online_now: 0,
        total_revenue: 0,
        mrr: 0,
        total_leads: 0,
        messages_sent: 0,
        api_calls: 0,
        storage_used: 0,
        uptime: 100
      };
    }
  }

  /**
   * Obter usuários
   */
  async getUsers(): Promise<User[]> {
    await this.autoInit();

    try {
      return await this.fetch('/admin/users');
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      return [];
    }
  }

  /**
   * Obter atividades
   */
  async getActivities(limit: number = 20): Promise<Activity[]> {
    await this.autoInit();

    try {
      return await this.fetch(`/admin/activities?limit=${limit}`);
    } catch (error) {
      console.error('Erro ao obter atividades:', error);
      return [];
    }
  }

  /**
   * Exportar usuários para CSV
   */
  async exportUsers() {
    try {
      const users = await this.getUsers();

      if (users.length === 0) {
        toast.warning('Nenhum usuário para exportar');
        return;
      }

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

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios-kw-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();

      toast.success('✅ CSV exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar CSV');
    }
  }

  /**
   * 🗑️ ZERAR TODOS OS DADOS DO ADMIN
   */
  async resetAllData() {
    try {
      const result = await this.fetch('/admin/reset-all', {
        method: 'POST'
      });

      if (result?.success) {
        toast.success('✅ Todos os dados foram zerados!');
        return true;
      } else {
        toast.error('Erro ao resetar dados');
        return false;
      }
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
      toast.error('Erro ao resetar dados');
      return false;
    }
  }

  /**
   * 🔍 SALVAR DADOS ENRIQUECIDOS DO USUÁRIO
   */
  async saveEnrichedData(userId: string, enrichedInfo: any) {
    try {
      const result = await this.fetch('/admin/enrich-user', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          enrichedData: enrichedInfo
        })
      });

      console.log('✅ Dados enriquecidos salvos no backend:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao salvar dados enriquecidos:', error);
      throw error;
    }
  }

  /**
   * 🔍 OBTER DADOS ENRIQUECIDOS DO USUÁRIO
   */
  async getEnrichedData(userId: string): Promise<any | null> {
    try {
      return await this.fetch(`/admin/enriched-data/${userId}`);
    } catch (error) {
      console.error('Erro ao obter dados enriquecidos:', error);
      return null;
    }
  }
}

export const supabaseAdminKV = new SupabaseAdminKV();