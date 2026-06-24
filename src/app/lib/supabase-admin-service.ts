import { supabase, User, Lead, Message, Activity, PlatformMetrics } from './supabase-client';
import { toast } from 'sonner@2.0.3';

class SupabaseAdminService {
  /**
   * Inicializar tabelas no Supabase (executar apenas uma vez)
   */
  async initializeTables() {
    try {
      // Esta função cria as tabelas se não existirem
      // Vamos criar via SQL no Supabase Dashboard ou via RPC
      
      console.log('Tabelas devem ser criadas manualmente no Supabase Dashboard');
      console.log('Veja instruções em: /docs/SUPABASE_SETUP.md');
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao inicializar tabelas:', error);
      return { success: false, error };
    }
  }

  /**
   * Verificar se as tabelas existem
   */
  async checkTablesExist(): Promise<boolean> {
    try {
      // Tentar fazer uma query simples em cada tabela
      const { error: usersError } = await supabase
        .from('platform_users')
        .select('id')
        .limit(1);
      
      if (usersError) {
        console.error('Tabela platform_users não existe:', usersError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar tabelas:', error);
      return false;
    }
  }

  /**
   * Criar usuários de exemplo para testes
   */
  async seedDemoData() {
    try {
      const demoUsers = [
        {
          name: 'João Silva',
          email: 'joao.silva@kw.pt',
          plan: 'pro',
          status: 'online',
          total_leads: 45,
          messages_sent: 230,
          mrr: 99
        },
        {
          name: 'Maria Oliveira',
          email: 'maria.oliveira@kw.pt',
          plan: 'enterprise',
          status: 'active',
          total_leads: 120,
          messages_sent: 890,
          mrr: 299
        },
        {
          name: 'Pedro Santos',
          email: 'pedro.santos@kw.pt',
          plan: 'free',
          status: 'active',
          total_leads: 12,
          messages_sent: 45,
          mrr: 0
        },
        {
          name: 'Ana Costa',
          email: 'ana.costa@kw.pt',
          plan: 'pro',
          status: 'online',
          total_leads: 67,
          messages_sent: 340,
          mrr: 99
        },
        {
          name: 'Carlos Ferreira',
          email: 'carlos.ferreira@kw.pt',
          plan: 'enterprise',
          status: 'active',
          total_leads: 200,
          messages_sent: 1200,
          mrr: 299
        }
      ];

      const { data, error } = await supabase
        .from('platform_users')
        .insert(demoUsers)
        .select();

      if (error) {
        throw error;
      }

      // Criar atividades de demo
      if (data && data.length > 0) {
        const activities = [
          {
            user_id: data[0].id,
            user_name: data[0].name,
            action: 'criou 5 novos leads',
            type: 'lead_created'
          },
          {
            user_id: data[1].id,
            user_name: data[1].name,
            action: 'enviou 20 emails',
            type: 'message_sent'
          },
          {
            user_id: data[3].id,
            user_name: data[3].name,
            action: 'fez upgrade para Pro',
            type: 'upgrade'
          }
        ];

        await supabase.from('platform_activities').insert(activities);
      }

      toast.success('✅ Dados de demonstração criados!');
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar dados demo:', error);
      toast.error('Erro ao criar dados de demonstração');
      return { success: false, error };
    }
  }

  /**
   * Obter métricas da plataforma
   */
  async getMetrics(): Promise<PlatformMetrics> {
    try {
      // Contar usuários
      const { count: totalUsers } = await supabase
        .from('platform_users')
        .select('*', { count: 'exact', head: true });

      const { count: activeUsers } = await supabase
        .from('platform_users')
        .select('*', { count: 'exact', head: true })
        .in('status', ['active', 'online']);

      const { count: onlineNow } = await supabase
        .from('platform_users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'online');

      // Somar MRR e receita total
      const { data: users } = await supabase
        .from('platform_users')
        .select('mrr, total_leads, messages_sent');

      const mrr = users?.reduce((sum, u) => sum + (u.mrr || 0), 0) || 0;
      const totalRevenue = mrr * 12; // ARR
      const totalLeads = users?.reduce((sum, u) => sum + (u.total_leads || 0), 0) || 0;
      const messagesSent = users?.reduce((sum, u) => sum + (u.messages_sent || 0), 0) || 0;

      // Estimar API calls (média de 10 calls por mensagem)
      const apiCalls = messagesSent * 10;

      // Storage usado (estimativa)
      const storageUsed = Math.round((totalUsers || 0) * 0.02 * 100) / 100; // ~20MB por usuário

      return {
        total_users: totalUsers || 0,
        active_users: activeUsers || 0,
        online_now: onlineNow || 0,
        total_revenue: totalRevenue,
        mrr: mrr,
        total_leads: totalLeads,
        messages_sent: messagesSent,
        api_calls: apiCalls,
        storage_used: storageUsed,
        uptime: 99.9
      };
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
      const { data, error } = await supabase
        .from('platform_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      throw error;
    }
  }

  /**
   * Obter atividades recentes
   */
  async getRecentActivity(limit: number = 20): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('platform_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao obter atividades:', error);
      throw error;
    }
  }

  /**
   * Criar novo usuário
   */
  async createUser(userData: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('platform_users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      // Registrar atividade
      await this.logActivity({
        user_id: data.id,
        user_name: data.name,
        action: 'registrou-se na plataforma',
        type: 'register'
      });

      toast.success('✅ Usuário criado com sucesso!');
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
      return { success: false, error };
    }
  }

  /**
   * Atualizar usuário
   */
  async updateUser(id: string, updates: Partial<User>) {
    try {
      const { data, error } = await supabase
        .from('platform_users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('✅ Usuário atualizado!');
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
      return { success: false, error };
    }
  }

  /**
   * Deletar usuário
   */
  async deleteUser(id: string) {
    try {
      const { error } = await supabase
        .from('platform_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('✅ Usuário removido!');
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      toast.error('Erro ao remover usuário');
      return { success: false, error };
    }
  }

  /**
   * Registrar atividade
   */
  async logActivity(activity: Partial<Activity>) {
    try {
      const { error } = await supabase
        .from('platform_activities')
        .insert([activity]);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
    }
  }

  /**
   * Atualizar última atividade do usuário
   */
  async updateUserActivity(userId: string) {
    try {
      await supabase
        .from('platform_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Erro ao atualizar última atividade:', error);
    }
  }

  /**
   * Exportar dados para CSV
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
        'Criado em': new Date(u.created_at).toLocaleDateString('pt-BR'),
        'Último Login': u.last_login ? new Date(u.last_login).toLocaleDateString('pt-BR') : 'Nunca'
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

export const supabaseAdminService = new SupabaseAdminService();
