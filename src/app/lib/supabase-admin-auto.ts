/**
 * Sistema de auto-inicialização do Admin Supabase
 * Cria tabelas e popula dados automaticamente em background
 */

import { supabaseAdminAPI } from './supabase-admin-api';
import { User, PlatformMetrics, Activity } from './supabase-client';

class SupabaseAdminAuto {
  private isInitialized = false;
  private isInitializing = false;
  private initPromise: Promise<boolean> | null = null;

  /**
   * Inicializa o sistema automaticamente (só roda 1 vez)
   */
  async autoInit(): Promise<boolean> {
    // Se já está inicializado, retorna sucesso
    if (this.isInitialized) {
      return true;
    }

    // Se já está inicializando, espera a promise existente
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    // Marca como inicializando e cria a promise
    this.isInitializing = true;
    this.initPromise = this._doInit();

    return this.initPromise;
  }

  private async _doInit(): Promise<boolean> {
    try {
      console.log('🔧 Auto-inicializando Supabase Admin...');

      // 1. Verificar se tabelas existem
      const tablesExist = await supabaseAdminAPI.checkTablesExist();

      if (!tablesExist) {
        console.log('📦 Tabelas não existem, criando...');

        // 2. Criar tabelas
        const initResult = await supabaseAdminAPI.initDatabase();

        if (initResult.needsManualSetup) {
          console.warn('⚠️ Setup manual necessário');
          // Mesmo assim, marcar como inicializado para não ficar tentando
          this.isInitialized = true;
          this.isInitializing = false;
          return false;
        }

        if (!initResult.success) {
          console.error('❌ Erro ao criar tabelas:', initResult.message);
          this.isInitialized = true;
          this.isInitializing = false;
          return false;
        }

        console.log('✅ Tabelas criadas com sucesso');

        // 3. Popular com dados demo
        console.log('🌱 Populando dados demo...');
        await supabaseAdminAPI.seedDemoData().catch(err => {
          // Ignora erro de duplicação
          if (!err.message?.includes('duplicate')) {
            console.warn('⚠️ Erro ao popular dados:', err);
          }
        });

        console.log('✅ Dados demo populados');
      } else {
        console.log('✅ Tabelas já existem');
      }

      this.isInitialized = true;
      this.isInitializing = false;
      return true;

    } catch (error) {
      console.error('❌ Erro na auto-inicialização:', error);
      this.isInitialized = true; // Marca como inicializado para não ficar tentando
      this.isInitializing = false;
      return false;
    }
  }

  /**
   * Obtém métricas (com fallback para dados vazios)
   */
  async getMetrics(): Promise<PlatformMetrics> {
    await this.autoInit();

    try {
      return await supabaseAdminAPI.getMetrics();
    } catch (error) {
      console.error('Erro ao obter métricas:', error);
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
   * Obtém usuários (com fallback para array vazio)
   */
  async getUsers(): Promise<User[]> {
    await this.autoInit();

    try {
      return await supabaseAdminAPI.getUsers();
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      return [];
    }
  }

  /**
   * Obtém atividades (com fallback para array vazio)
   */
  async getActivities(limit: number = 20): Promise<Activity[]> {
    await this.autoInit();

    try {
      return await supabaseAdminAPI.getRecentActivity(limit);
    } catch (error) {
      console.error('Erro ao obter atividades:', error);
      return [];
    }
  }

  /**
   * Exporta usuários
   */
  async exportUsers(): Promise<void> {
    await this.autoInit();
    return supabaseAdminAPI.exportUsers();
  }

  /**
   * Força reinicialização (útil para refresh)
   */
  async forceReinit(): Promise<boolean> {
    this.isInitialized = false;
    this.isInitializing = false;
    this.initPromise = null;
    return this.autoInit();
  }
}

export const supabaseAdminAuto = new SupabaseAdminAuto();
