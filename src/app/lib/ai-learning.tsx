import { Lead } from '../types';

interface LearningStats {
  totalActions: number;
  positiveActions: number;
  negativeActions: number;
  learnedPatterns: Record<string, number>;
}

interface LeadSuggestion {
  lead: Lead;
  reason: string;
  confidence: number;
}

class AILearning {
  private stats: LearningStats = {
    totalActions: 0,
    positiveActions: 0,
    negativeActions: 0,
    learnedPatterns: {}
  };

  constructor() {
    this.loadStats();
  }

  private loadStats() {
    const saved = localStorage.getItem('ai-learning-stats');
    if (saved) {
      try {
        this.stats = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load AI learning stats', e);
      }
    }
  }

  private saveStats() {
    localStorage.setItem('ai-learning-stats', JSON.stringify(this.stats));
  }

  public learnFromPositiveAction(lead: Lead, action: string) {
    this.stats.totalActions++;
    this.stats.positiveActions++;
    
    // Aprende padrões do lead (cluster, score, etc)
    const pattern = `${lead.cluster}_${Math.floor(lead.score / 20) * 20}`;
    this.stats.learnedPatterns[pattern] = (this.stats.learnedPatterns[pattern] || 0) + 1;
    
    this.saveStats();
  }

  public learnFromNegativeAction(lead: Lead, action: string) {
    this.stats.totalActions++;
    this.stats.negativeActions++;
    
    // Aprende padrões negativos
    const pattern = `${lead.cluster}_${Math.floor(lead.score / 20) * 20}`;
    this.stats.learnedPatterns[pattern] = (this.stats.learnedPatterns[pattern] || 0) - 1;
    
    this.saveStats();
  }

  public generateSuggestions(leads: Lead[], count: number = 3): LeadSuggestion[] {
    if (leads.length === 0) return [];

    // Filtra leads quentes ou em conversa
    const hotLeads = leads.filter(l => l.status === 'hot' || l.status === 'in-conversation');
    
    // Se não houver leads quentes, retorna vazio
    if (hotLeads.length === 0) return [];

    // Ordena por score e padrões aprendidos
    const scoredLeads = hotLeads.map(lead => {
      const pattern = `${lead.cluster}_${Math.floor(lead.score / 20) * 20}`;
      const patternScore = this.stats.learnedPatterns[pattern] || 0;
      
      return {
        lead,
        confidence: lead.score + (patternScore * 5),
        reason: this.generateReason(lead, patternScore)
      };
    });

    // Ordena por confiança
    scoredLeads.sort((a, b) => b.confidence - a.confidence);

    return scoredLeads.slice(0, count);
  }

  private generateReason(lead: Lead, patternScore: number): string {
    const reasons = [];

    if (lead.score >= 80) {
      reasons.push(`Score altíssimo (${lead.score}%)`);
    } else if (lead.score >= 60) {
      reasons.push(`Score alto (${lead.score}%)`);
    }

    if (patternScore > 0) {
      reasons.push('Perfil semelhante aos seus favoritos');
    }

    if (lead.status === 'hot') {
      reasons.push('Lead quente');
    } else if (lead.status === 'in-conversation') {
      reasons.push('Já em conversa');
    }

    if (lead.channel === 'whatsapp') {
      reasons.push('Engajamento pelo WhatsApp');
    }

    return reasons.length > 0 ? reasons.join(' • ') : 'Lead promissor';
  }

  public getLearningStats(): LearningStats {
    return { ...this.stats };
  }

  public reset() {
    this.stats = {
      totalActions: 0,
      positiveActions: 0,
      negativeActions: 0,
      learnedPatterns: {}
    };
    this.saveStats();
  }
}

export const aiLearning = new AILearning();
