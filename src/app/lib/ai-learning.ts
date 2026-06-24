import { Lead } from '../types';

/**
 * Sistema de Aprendizado da IA
 * Observa padrões do usuário e aprende qual o perfil ideal de lead
 */

export interface UserPreference {
  clusters: Record<string, number>; // Score por cluster
  jobTitles: Record<string, number>; // Score por cargo
  companies: Record<string, number>; // Score por empresa
  scoreRange: { min: number; max: number }; // Range de score preferido
  channels: Record<string, number>; // Preferência de canal
  locations: Record<string, number>; // Preferência de localização
}

export interface LeadSuggestion {
  lead: Lead;
  confidenceScore: number; // 0-100
  reasons: string[]; // Por que foi sugerido
  matchFactors: {
    cluster: number;
    jobTitle: number;
    company: number;
    score: number;
    channel: number;
    location: number;
  };
}

class AILearningService {
  private readonly STORAGE_KEY = 'ai-learning-preferences';
  
  /**
   * Obtém as preferências aprendidas
   */
  getPreferences(): UserPreference {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Preferências iniciais vazias
    return {
      clusters: {},
      jobTitles: {},
      companies: {},
      scoreRange: { min: 0, max: 100 },
      channels: {},
      locations: {}
    };
  }

  /**
   * Salva preferências
   */
  private savePreferences(prefs: UserPreference) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prefs));
  }

  /**
   * Aprende com ação positiva do usuário
   */
  learnFromPositiveAction(lead: Lead, actionType: 'handover' | 'like' | 'engage') {
    const prefs = this.getPreferences();
    
    // Peso da ação (handover vale mais)
    const weight = actionType === 'handover' ? 3 : actionType === 'like' ? 2 : 1;

    // Aprende cluster
    prefs.clusters[lead.cluster] = (prefs.clusters[lead.cluster] || 0) + weight;

    // Aprende cargo
    if (lead.jobTitle) {
      prefs.jobTitles[lead.jobTitle] = (prefs.jobTitles[lead.jobTitle] || 0) + weight;
    }

    // Aprende empresa
    if (lead.company) {
      prefs.companies[lead.company] = (prefs.companies[lead.company] || 0) + weight;
    }

    // Aprende canal
    prefs.channels[lead.channel] = (prefs.channels[lead.channel] || 0) + weight;

    // Aprende localização
    if (lead.location) {
      prefs.locations[lead.location] = (prefs.locations[lead.location] || 0) + weight;
    }

    // Ajusta range de score
    if (lead.score < prefs.scoreRange.min || prefs.scoreRange.min === 0) {
      prefs.scoreRange.min = Math.max(0, lead.score - 10);
    }
    if (lead.score > prefs.scoreRange.max || prefs.scoreRange.max === 100) {
      prefs.scoreRange.max = Math.min(100, lead.score + 10);
    }

    this.savePreferences(prefs);
    
    // Registra no histórico
    this.logLearningEvent('positive', lead, actionType);
  }

  /**
   * Aprende com ação negativa do usuário
   */
  learnFromNegativeAction(lead: Lead, actionType: 'dislike' | 'ignore' | 'delete') {
    const prefs = this.getPreferences();
    
    // Peso negativo
    const weight = actionType === 'delete' ? -3 : actionType === 'dislike' ? -2 : -1;

    // Penaliza cluster
    prefs.clusters[lead.cluster] = (prefs.clusters[lead.cluster] || 0) + weight;

    // Penaliza cargo
    if (lead.jobTitle) {
      prefs.jobTitles[lead.jobTitle] = (prefs.jobTitles[lead.jobTitle] || 0) + weight;
    }

    // Penaliza empresa
    if (lead.company) {
      prefs.companies[lead.company] = (prefs.companies[lead.company] || 0) + weight;
    }

    this.savePreferences(prefs);
    
    this.logLearningEvent('negative', lead, actionType);
  }

  /**
   * Calcula score de match para um lead
   */
  calculateMatchScore(lead: Lead): number {
    const prefs = this.getPreferences();
    
    // Se não há dados suficientes, retorna score neutro
    const totalInteractions = Object.values(prefs.clusters).reduce((sum, val) => sum + Math.abs(val), 0);
    if (totalInteractions < 3) {
      return 50; // Score neutro quando ainda está aprendendo
    }

    let score = 0;
    let maxScore = 0;

    // Cluster (peso 30%)
    const clusterScore = prefs.clusters[lead.cluster] || 0;
    const maxClusterScore = Math.max(...Object.values(prefs.clusters), 1);
    score += (clusterScore / maxClusterScore) * 30;
    maxScore += 30;

    // Cargo (peso 25%)
    if (lead.jobTitle) {
      const jobScore = prefs.jobTitles[lead.jobTitle] || 0;
      const maxJobScore = Math.max(...Object.values(prefs.jobTitles), 1);
      score += (jobScore / maxJobScore) * 25;
    }
    maxScore += 25;

    // Score do lead (peso 20%)
    const scoreInRange = lead.score >= prefs.scoreRange.min && lead.score <= prefs.scoreRange.max;
    if (scoreInRange) {
      score += 20;
    } else {
      const distance = Math.min(
        Math.abs(lead.score - prefs.scoreRange.min),
        Math.abs(lead.score - prefs.scoreRange.max)
      );
      score += Math.max(0, 20 - distance / 5);
    }
    maxScore += 20;

    // Canal (peso 15%)
    const channelScore = prefs.channels[lead.channel] || 0;
    const maxChannelScore = Math.max(...Object.values(prefs.channels), 1);
    score += (channelScore / maxChannelScore) * 15;
    maxScore += 15;

    // Localização (peso 10%)
    if (lead.location) {
      const locationScore = prefs.locations[lead.location] || 0;
      const maxLocationScore = Math.max(...Object.values(prefs.locations), 1);
      score += (locationScore / maxLocationScore) * 10;
    }
    maxScore += 10;

    // Normaliza para 0-100
    return Math.round((score / maxScore) * 100);
  }

  /**
   * Gera sugestões inteligentes de leads
   */
  generateSuggestions(allLeads: Lead[], count: number = 5): LeadSuggestion[] {
    const prefs = this.getPreferences();
    
    // Verifica se há interações suficientes para gerar sugestões
    const totalInteractions = Object.values(prefs.clusters).reduce((sum, val) => sum + Math.abs(val), 0);
    if (totalInteractions < 3) {
      // Sem dados suficientes, não retorna sugestões
      return [];
    }
    
    // Filtra apenas leads cold ou in-conversation
    const candidateLeads = allLeads.filter(
      lead => lead.status === 'cold' || lead.status === 'in-conversation'
    );

    // Calcula score para cada lead
    const scoredLeads = candidateLeads.map(lead => {
      const matchScore = this.calculateMatchScore(lead);
      
      // Gera razões para a sugestão
      const reasons: string[] = [];
      const matchFactors = {
        cluster: 0,
        jobTitle: 0,
        company: 0,
        score: 0,
        channel: 0,
        location: 0
      };

      // Analisa cluster
      const clusterPref = prefs.clusters[lead.cluster] || 0;
      if (clusterPref > 2) {
        reasons.push(`Você costuma aprovar ${lead.cluster}`);
        matchFactors.cluster = Math.min(100, clusterPref * 20);
      }

      // Analisa cargo
      if (lead.jobTitle && prefs.jobTitles[lead.jobTitle]) {
        const jobPref = prefs.jobTitles[lead.jobTitle];
        if (jobPref > 1) {
          reasons.push(`Cargo "${lead.jobTitle}" alinha com seu perfil`);
          matchFactors.jobTitle = Math.min(100, jobPref * 25);
        }
      }

      // Analisa score
      if (lead.score >= prefs.scoreRange.min && lead.score <= prefs.scoreRange.max) {
        reasons.push(`Score ${lead.score} no seu range ideal`);
        matchFactors.score = 80;
      }

      // Analisa canal
      const channelPref = prefs.channels[lead.channel] || 0;
      if (channelPref > 1) {
        reasons.push(`Via ${lead.channel} - seu canal preferido`);
        matchFactors.channel = Math.min(100, channelPref * 30);
      }

      // Analisa localização
      if (lead.location && prefs.locations[lead.location]) {
        const locPref = prefs.locations[lead.location];
        if (locPref > 1) {
          reasons.push(`Localização ${lead.location} é relevante pra você`);
          matchFactors.location = Math.min(100, locPref * 25);
        }
      }

      // Se não há razões específicas, adiciona genérica
      if (reasons.length === 0) {
        reasons.push('Perfil interessante para explorar');
      }

      return {
        lead,
        confidenceScore: matchScore,
        reasons,
        matchFactors
      };
    });

    // Ordena por score e retorna top N
    return scoredLeads
      .sort((a, b) => b.confidenceScore - a.confidenceScore)
      .slice(0, count);
  }

  /**
   * Obtém estatísticas de aprendizado
   */
  getLearningStats() {
    const prefs = this.getPreferences();
    
    // Cluster favorito
    const topCluster = Object.entries(prefs.clusters)
      .sort((a, b) => b[1] - a[1])[0];

    // Cargo favorito
    const topJob = Object.entries(prefs.jobTitles)
      .sort((a, b) => b[1] - a[1])[0];

    // Canal favorito
    const topChannel = Object.entries(prefs.channels)
      .sort((a, b) => b[1] - a[1])[0];

    // Total de interações
    const totalInteractions = Object.values(prefs.clusters)
      .reduce((sum, val) => sum + Math.abs(val), 0);

    return {
      totalInteractions,
      topCluster: topCluster ? topCluster[0] : null,
      topJob: topJob ? topJob[0] : null,
      topChannel: topChannel ? topChannel[0] : null,
      scoreRange: prefs.scoreRange,
      isLearning: totalInteractions >= 3
    };
  }

  /**
   * Registra evento de aprendizado (para debug/analytics)
   */
  private logLearningEvent(type: 'positive' | 'negative', lead: Lead, action: string) {
    const events = JSON.parse(localStorage.getItem('ai-learning-events') || '[]');
    events.push({
      timestamp: new Date().toISOString(),
      type,
      action,
      leadCluster: lead.cluster,
      leadScore: lead.score,
      leadJobTitle: lead.jobTitle
    });
    
    // Mantém apenas últimos 100 eventos
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('ai-learning-events', JSON.stringify(events));
  }

  /**
   * Reseta aprendizado (útil para testes)
   */
  resetLearning() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('ai-learning-events');
  }
}

export const aiLearning = new AILearningService();