import { Lead, Activity, ClusterConfig } from '../types';
import { mongodb } from './mongodb-service';
import { metricsTracker } from './user-metrics-tracker';

// Serviço de armazenamento com suporte a MongoDB e LocalStorage (fallback)
class StorageService {
  private listeners: Set<() => void> = new Set();
  private useMongoDb: boolean = false;

  constructor() {
    // Verifica se MongoDB está configurado
    this.useMongoDb = mongodb.isReady();
  }

  // Permite alternar entre MongoDB e LocalStorage
  setStorageMode(useMongoDB: boolean) {
    this.useMongoDb = useMongoDB && mongodb.isReady();
  }

  getStorageMode(): 'mongodb' | 'localstorage' {
    return this.useMongoDb ? 'mongodb' : 'localstorage';
  }

  // Notifica todos os componentes quando dados mudam
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Permite componentes se inscreverem para mudanças
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ============ LEADS ============
  async getLeads(): Promise<Lead[]> {
    if (this.useMongoDb) {
      return await mongodb.getLeads();
    }
    const data = localStorage.getItem('ai-leads');
    return data ? JSON.parse(data) : [];
  }

  async saveLeads(leads: Lead[]) {
    if (this.useMongoDb) {
      await mongodb.saveLeads(leads);
    } else {
      localStorage.setItem('ai-leads', JSON.stringify(leads));
    }
    this.notifyListeners();
  }

  async addLead(lead: Lead) {
    if (this.useMongoDb) {
      await mongodb.addLead(lead);
    } else {
      const leads = await this.getLeads();
      leads.push(lead);
      localStorage.setItem('ai-leads', JSON.stringify(leads));
    }
    
    // 📊 RASTREAMENTO AUTOMÁTICO: Incrementa contador de leads
    await metricsTracker.trackLeadCreated();
    
    this.notifyListeners();
  }

  async updateLead(id: string, updates: Partial<Lead>) {
    if (this.useMongoDb) {
      await mongodb.updateLead(id, updates);
    } else {
      const leads = await this.getLeads();
      const index = leads.findIndex(l => l.id === id);
      if (index !== -1) {
        leads[index] = { ...leads[index], ...updates };
        localStorage.setItem('ai-leads', JSON.stringify(leads));
      }
    }
    this.notifyListeners();
  }

  async deleteLead(id: string) {
    if (this.useMongoDb) {
      await mongodb.deleteLead(id);
    } else {
      const leads = await this.getLeads();
      const filtered = leads.filter(l => l.id !== id);
      localStorage.setItem('ai-leads', JSON.stringify(filtered));
    }
    this.notifyListeners();
  }

  // ============ ACTIVITIES ============
  async getActivities(): Promise<Activity[]> {
    if (this.useMongoDb) {
      return await mongodb.getActivities();
    }
    const data = localStorage.getItem('ai-activities');
    return data ? JSON.parse(data) : [];
  }

  async saveActivities(activities: Activity[]) {
    if (this.useMongoDb) {
      await mongodb.saveActivities(activities);
    } else {
      localStorage.setItem('ai-activities', JSON.stringify(activities));
    }
    this.notifyListeners();
  }

  async addActivity(activity: Activity) {
    if (this.useMongoDb) {
      await mongodb.addActivity(activity);
    } else {
      const activities = await this.getActivities();
      activities.unshift(activity); // Adiciona no início
      // Manter apenas últimas 100 atividades
      const trimmed = activities.slice(0, 100);
      localStorage.setItem('ai-activities', JSON.stringify(trimmed));
    }
    
    // 📊 RASTREAMENTO AUTOMÁTICO: Incrementa contadores baseado no tipo
    if (activity.type === 'message_sent' || activity.type === 'email_sent' || activity.type === 'whatsapp_sent') {
      await metricsTracker.trackMessageSent();
    } else if (activity.type === 'search' || activity.type === 'linkedin_search' || activity.type === 'apollo_search') {
      await metricsTracker.trackSearchPerformed();
    }
    
    this.notifyListeners();
  }

  // ============ CLUSTERS ============
  async getClusters(): Promise<ClusterConfig[]> {
    if (this.useMongoDb) {
      return await mongodb.getClusters();
    }
    const data = localStorage.getItem('ai-clusters');
    return data ? JSON.parse(data) : [];
  }

  async saveClusters(clusters: ClusterConfig[]) {
    if (this.useMongoDb) {
      await mongodb.saveClusters(clusters);
    } else {
      localStorage.setItem('ai-clusters', JSON.stringify(clusters));
    }
    this.notifyListeners();
  }

  async updateCluster(id: string, updates: Partial<ClusterConfig>) {
    if (this.useMongoDb) {
      await mongodb.updateCluster(id, updates);
    } else {
      const clusters = await this.getClusters();
      const index = clusters.findIndex(c => c.id === id);
      if (index !== -1) {
        clusters[index] = { ...clusters[index], ...updates };
        localStorage.setItem('ai-clusters', JSON.stringify(clusters));
      }
    }
    this.notifyListeners();
  }

  // ============ CONFIGURAÇÕES DA IA ============
  async getAIConfig() {
    if (this.useMongoDb) {
      const config = await mongodb.getAIConfig();
      return config || {
        personality: 'consultivo',
        language: 'pt',
        icebreaker: 'posts',
        cadences: []
      };
    }
    const data = localStorage.getItem('ai-config');
    return data ? JSON.parse(data) : {
      personality: 'consultivo',
      language: 'pt',
      icebreaker: 'posts',
      cadences: []
    };
  }

  async saveAIConfig(config: any) {
    if (this.useMongoDb) {
      await mongodb.saveAIConfig(config);
    } else {
      localStorage.setItem('ai-config', JSON.stringify(config));
    }
    this.notifyListeners();
  }

  // ============ INTEGRAÇÕES ============
  async getIntegrations() {
    if (this.useMongoDb) {
      const integrations = await mongodb.getIntegrations();
      return integrations || {
        linkedin: { connected: false, apiKey: '' },
        apollo: { connected: false, apiKey: '' },
        whatsapp: { connected: false, phoneNumberId: '', accessToken: '' },
        sendgrid: { connected: false, apiKey: '', fromEmail: '' },
        kwcommand: { connected: false, webhookUrl: '', apiKey: '' }
      };
    }
    const data = localStorage.getItem('ai-integrations');
    return data ? JSON.parse(data) : {
      linkedin: { connected: false, apiKey: '' },
      apollo: { connected: false, apiKey: '' },
      whatsapp: { connected: false, phoneNumberId: '', accessToken: '' },
      sendgrid: { connected: false, apiKey: '', fromEmail: '' },
      kwcommand: { connected: false, webhookUrl: '', apiKey: '' }
    };
  }

  async saveIntegrations(integrations: any) {
    if (this.useMongoDb) {
      await mongodb.saveIntegrations(integrations);
    } else {
      localStorage.setItem('ai-integrations', JSON.stringify(integrations));
    }
    this.notifyListeners();
  }

  // ============ BLACKLIST ============
  async getBlacklist(): Promise<string[]> {
    if (this.useMongoDb) {
      return await mongodb.getBlacklist();
    }
    const data = localStorage.getItem('ai-blacklist');
    return data ? JSON.parse(data) : [];
  }

  async saveBlacklist(blacklist: string[]) {
    if (this.useMongoDb) {
      await mongodb.saveBlacklist(blacklist);
    } else {
      localStorage.setItem('ai-blacklist', JSON.stringify(blacklist));
    }
    this.notifyListeners();
  }

  // ============ BACKUP & RESTORE ============
  async exportAllData() {
    if (this.useMongoDb) {
      return await mongodb.exportAllData();
    }
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      source: 'localstorage',
      leads: await this.getLeads(),
      activities: await this.getActivities(),
      clusters: await this.getClusters(),
      aiConfig: await this.getAIConfig(),
      integrations: await this.getIntegrations(),
      blacklist: await this.getBlacklist()
    };
  }

  async importAllData(data: any) {
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

  // ============ INICIALIZAÇÃO ============
  async initializeDefaultData() {
    // Só inicializa se não houver dados
    const leads = await this.getLeads();
    if (leads.length === 0) {
      await this.saveLeads([]);
    }
    const activities = await this.getActivities();
    if (activities.length === 0) {
      await this.saveActivities([]);
    }
    const clusters = await this.getClusters();
    if (clusters.length === 0) {
      await this.saveClusters([]);
    }
  }

  // ============ RESET / CLEAR DATA ============
  async clearAllData() {
    if (this.useMongoDb) {
      // Clear MongoDB data
      await mongodb.clearAll();
    } else {
      // Clear LocalStorage data
      const keysToRemove = [
        'ai-leads',
        'ai-activities',
        'ai-clusters',
        'ai-active',
        'apollo-config',
        'auth-user',
        'auth-sessions',
        'auth-2fa-secret',
        'auth-2fa-enabled',
        'auth-backup-codes'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
    this.notifyListeners();
  }

  async clearUserAuthData() {
    // Remove apenas dados de autenticação
    const authKeys = [
      'auth-user',
      'auth-sessions',
      'auth-2fa-secret',
      'auth-2fa-enabled',
      'auth-backup-codes'
    ];
    
    authKeys.forEach(key => localStorage.removeItem(key));
    this.notifyListeners();
  }
}

// Singleton instance
export const storage = new StorageService();