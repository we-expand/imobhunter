import { Lead, Activity, ClusterConfig } from '../types';

// Serviço MongoDB Atlas Data API
class MongoDBService {
  private apiUrl: string = '';
  private apiKey: string = '';
  private dataSource: string = '';
  private database: string = '';
  private isConfigured: boolean = false;

  constructor() {
    // Carrega configuração do localStorage
    this.loadConfig();
  }

  // Carrega configuração salva
  private loadConfig() {
    const config = localStorage.getItem('mongodb-config');
    if (config) {
      const parsed = JSON.parse(config);
      this.apiUrl = parsed.apiUrl || '';
      this.apiKey = parsed.apiKey || '';
      this.dataSource = parsed.dataSource || 'Cluster0';
      this.database = parsed.database || 'ai-leads-db';
      this.isConfigured = !!(this.apiUrl && this.apiKey);
    }
  }

  // Salva configuração
  configure(config: {
    apiUrl: string;
    apiKey: string;
    dataSource?: string;
    database?: string;
  }) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.dataSource = config.dataSource || 'Cluster0';
    this.database = config.database || 'ai-leads-db';
    this.isConfigured = true;

    localStorage.setItem('mongodb-config', JSON.stringify({
      apiUrl: this.apiUrl,
      apiKey: this.apiKey,
      dataSource: this.dataSource,
      database: this.database
    }));
  }

  // Verifica se está configurado
  isReady(): boolean {
    return this.isConfigured;
  }

  // Obtém configuração atual
  getConfig() {
    return {
      apiUrl: this.apiUrl,
      apiKey: this.apiKey,
      dataSource: this.dataSource,
      database: this.database,
      isConfigured: this.isConfigured
    };
  }

  // Método genérico para fazer chamadas à API
  private async callAPI(action: string, collection: string, data: any) {
    if (!this.isConfigured) {
      throw new Error('MongoDB não configurado');
    }

    const url = `${this.apiUrl}/action/${action}`;
    
    const body = {
      dataSource: this.dataSource,
      database: this.database,
      collection: collection,
      ...data
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MongoDB API error: ${error}`);
    }

    return await response.json();
  }

  // ============ LEADS ============
  async getLeads(): Promise<Lead[]> {
    try {
      const result = await this.callAPI('find', 'leads', {
        filter: {},
        sort: { lastContact: -1 },
        limit: 1000
      });
      return result.documents || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }

  async addLead(lead: Lead): Promise<void> {
    await this.callAPI('insertOne', 'leads', {
      document: lead
    });
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<void> {
    await this.callAPI('updateOne', 'leads', {
      filter: { id: id },
      update: { $set: updates }
    });
  }

  async deleteLead(id: string): Promise<void> {
    await this.callAPI('deleteOne', 'leads', {
      filter: { id: id }
    });
  }

  async saveLeads(leads: Lead[]): Promise<void> {
    // Apaga todos os leads existentes
    await this.callAPI('deleteMany', 'leads', {
      filter: {}
    });
    
    // Insere novos leads
    if (leads.length > 0) {
      await this.callAPI('insertMany', 'leads', {
        documents: leads
      });
    }
  }

  // ============ ACTIVITIES ============
  async getActivities(): Promise<Activity[]> {
    try {
      const result = await this.callAPI('find', 'activities', {
        filter: {},
        sort: { timestamp: -1 },
        limit: 100
      });
      return result.documents || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  async addActivity(activity: Activity): Promise<void> {
    await this.callAPI('insertOne', 'activities', {
      document: activity
    });
  }

  async saveActivities(activities: Activity[]): Promise<void> {
    // Apaga todas as atividades existentes
    await this.callAPI('deleteMany', 'activities', {
      filter: {}
    });
    
    // Insere novas atividades
    if (activities.length > 0) {
      await this.callAPI('insertMany', 'activities', {
        documents: activities
      });
    }
  }

  // ============ CLUSTERS ============
  async getClusters(): Promise<ClusterConfig[]> {
    try {
      const result = await this.callAPI('find', 'clusters', {
        filter: {},
        limit: 100
      });
      return result.documents || [];
    } catch (error) {
      console.error('Error fetching clusters:', error);
      return [];
    }
  }

  async updateCluster(id: string, updates: Partial<ClusterConfig>): Promise<void> {
    await this.callAPI('updateOne', 'clusters', {
      filter: { id: id },
      update: { $set: updates }
    });
  }

  async saveClusters(clusters: ClusterConfig[]): Promise<void> {
    // Apaga todos os clusters existentes
    await this.callAPI('deleteMany', 'clusters', {
      filter: {}
    });
    
    // Insere novos clusters
    if (clusters.length > 0) {
      await this.callAPI('insertMany', 'clusters', {
        documents: clusters
      });
    }
  }

  // ============ CONFIGURAÇÕES DA IA ============
  async getAIConfig(): Promise<any> {
    try {
      const result = await this.callAPI('findOne', 'config', {
        filter: { type: 'ai-config' }
      });
      return result.document?.data || null;
    } catch (error) {
      console.error('Error fetching AI config:', error);
      return null;
    }
  }

  async saveAIConfig(config: any): Promise<void> {
    await this.callAPI('updateOne', 'config', {
      filter: { type: 'ai-config' },
      update: { 
        $set: { 
          type: 'ai-config',
          data: config,
          updatedAt: new Date().toISOString()
        } 
      },
      upsert: true
    });
  }

  // ============ INTEGRAÇÕES ============
  async getIntegrations(): Promise<any> {
    try {
      const result = await this.callAPI('findOne', 'config', {
        filter: { type: 'integrations' }
      });
      return result.document?.data || null;
    } catch (error) {
      console.error('Error fetching integrations:', error);
      return null;
    }
  }

  async saveIntegrations(integrations: any): Promise<void> {
    await this.callAPI('updateOne', 'config', {
      filter: { type: 'integrations' },
      update: { 
        $set: { 
          type: 'integrations',
          data: integrations,
          updatedAt: new Date().toISOString()
        } 
      },
      upsert: true
    });
  }

  // ============ BLACKLIST ============
  async getBlacklist(): Promise<string[]> {
    try {
      const result = await this.callAPI('findOne', 'config', {
        filter: { type: 'blacklist' }
      });
      return result.document?.data || [];
    } catch (error) {
      console.error('Error fetching blacklist:', error);
      return [];
    }
  }

  async saveBlacklist(blacklist: string[]): Promise<void> {
    await this.callAPI('updateOne', 'config', {
      filter: { type: 'blacklist' },
      update: { 
        $set: { 
          type: 'blacklist',
          data: blacklist,
          updatedAt: new Date().toISOString()
        } 
      },
      upsert: true
    });
  }

  // ============ TESTE DE CONEXÃO ============
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.callAPI('find', 'leads', {
        filter: {},
        limit: 1
      });
      return { success: true, message: 'Conexão com MongoDB estabelecida!' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // ============ BACKUP & RESTORE ============
  async exportAllData() {
    const [leads, activities, clusters, aiConfig, integrations, blacklist] = await Promise.all([
      this.getLeads(),
      this.getActivities(),
      this.getClusters(),
      this.getAIConfig(),
      this.getIntegrations(),
      this.getBlacklist()
    ]);

    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      source: 'mongodb',
      leads,
      activities,
      clusters,
      aiConfig,
      integrations,
      blacklist
    };
  }

  async importAllData(data: any): Promise<{ success: boolean; error?: any }> {
    try {
      const promises = [];
      
      if (data.leads) promises.push(this.saveLeads(data.leads));
      if (data.activities) promises.push(this.saveActivities(data.activities));
      if (data.clusters) promises.push(this.saveClusters(data.clusters));
      if (data.aiConfig) promises.push(this.saveAIConfig(data.aiConfig));
      if (data.integrations) promises.push(this.saveIntegrations(data.integrations));
      if (data.blacklist) promises.push(this.saveBlacklist(data.blacklist));

      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  // ============ LIMPEZA ============
  async clearAllData(): Promise<void> {
    await Promise.all([
      this.callAPI('deleteMany', 'leads', { filter: {} }),
      this.callAPI('deleteMany', 'activities', { filter: {} }),
      this.callAPI('deleteMany', 'clusters', { filter: {} }),
      this.callAPI('deleteMany', 'config', { filter: {} })
    ]);
  }

  async clearAll(): Promise<void> {
    return this.clearAllData();
  }
}

export const mongodb = new MongoDBService();