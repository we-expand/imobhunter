// Serviço de Enriquecimento de Telefones com IA Multi-Source
import { toast } from 'sonner';

// ============ CONFIGURAÇÃO DAS APIs ============
// Configure suas API Keys aqui
const API_KEYS = {
  apollo: 'SUA_APOLLO_API_KEY', // https://apollo.io
  hunter: 'SUA_HUNTER_API_KEY', // https://hunter.io
  clearbit: 'SUA_CLEARBIT_API_KEY', // https://clearbit.com
  rocketreach: 'SUA_ROCKETREACH_API_KEY', // https://rocketreach.co
  numverify: 'SUA_NUMVERIFY_API_KEY', // https://numverify.com
};

// ============ TIPOS ============
export interface PhoneSource {
  source: string;
  phone: string;
  confidence: number; // 0-100
  timestamp: string;
  metadata?: {
    type?: 'mobile' | 'landline' | 'voip';
    carrier?: string;
    location?: string;
    verified?: boolean;
    lastSeen?: string;
  };
}

export interface PhoneSuggestion {
  phone: string;
  confidence: number; // Score da IA (0-100)
  sources: PhoneSource[];
  aiReasoning: string;
  status: 'hot' | 'warm' | 'cold';
  recommendation: string;
}

export interface EnrichmentResult {
  leadId: string;
  leadName: string;
  originalPhone?: string;
  suggestions: PhoneSuggestion[];
  totalSources: number;
  aiScore: number;
  processingTime: number;
}

class PhoneEnrichmentService {
  // ============ BUSCAR EM MÚLTIPLAS FONTES ============
  async enrichPhone(leadData: {
    name: string;
    email?: string;
    company?: string;
    linkedin?: string;
    phone?: string;
  }): Promise<EnrichmentResult> {
    const startTime = Date.now();
    
    console.log(`🔍 Iniciando enriquecimento para: ${leadData.name}`);
    
    // Busca paralela em todas as fontes
    const sources = await Promise.all([
      this.searchApollo(leadData),
      this.searchHunter(leadData),
      this.searchLinkedIn(leadData),
      this.searchClearbit(leadData),
      this.searchRocketReach(leadData),
      this.searchWhatsAppBusiness(leadData),
      this.searchFacebook(leadData),
      this.searchInstagram(leadData),
      this.searchPublicDatabases(leadData),
    ]);

    // Agrupa fontes por número de telefone
    const phoneMap = new Map<string, PhoneSource[]>();
    sources.flat().forEach(source => {
      const normalized = this.normalizePhone(source.phone);
      if (!phoneMap.has(normalized)) {
        phoneMap.set(normalized, []);
      }
      phoneMap.get(normalized)!.push(source);
    });

    // IA analisa e pontua cada número
    const suggestions: PhoneSuggestion[] = [];
    for (const [phone, phoneSources] of phoneMap.entries()) {
      const aiAnalysis = this.analyzeWithAI(phone, phoneSources, leadData);
      suggestions.push(aiAnalysis);
    }

    // Ordena por confiança (maior primeiro)
    suggestions.sort((a, b) => b.confidence - a.confidence);

    const processingTime = Date.now() - startTime;

    return {
      leadId: `lead-${Date.now()}`,
      leadName: leadData.name,
      originalPhone: leadData.phone,
      suggestions,
      totalSources: sources.flat().length,
      aiScore: suggestions[0]?.confidence || 0,
      processingTime,
    };
  }

  // ============ APOLLO.IO ============
  private async searchApollo(leadData: any): Promise<PhoneSource[]> {
    try {
      // Simula busca no Apollo.io
      // Em produção, usar API real: https://apollo.io/api
      
      const mockPhones = [
        '+351 912 345 678',
        '+351 963 456 789',
      ];

      return mockPhones.map(phone => ({
        source: 'Apollo.io',
        phone,
        confidence: 85,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
          verified: true,
          lastSeen: '2024-12-10',
        },
      }));
    } catch (error) {
      console.error('Erro no Apollo:', error);
      return [];
    }
  }

  // ============ HUNTER.IO ============
  private async searchHunter(leadData: any): Promise<PhoneSource[]> {
    try {
      // Simula busca no Hunter.io
      // Em produção: https://hunter.io/api
      
      if (!leadData.email) return [];

      return [{
        source: 'Hunter.io',
        phone: '+351 918 765 432',
        confidence: 78,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
          carrier: 'Vodafone PT',
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ LINKEDIN SALES NAVIGATOR ============
  private async searchLinkedIn(leadData: any): Promise<PhoneSource[]> {
    try {
      // Simula scraping do LinkedIn Sales Navigator
      // Em produção, usar API oficial ou scraping ético
      
      if (!leadData.linkedin) return [];

      return [{
        source: 'LinkedIn Sales Nav',
        phone: '+351 912 345 678',
        confidence: 92,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
          verified: true,
          lastSeen: '2024-12-11',
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ CLEARBIT ============
  private async searchClearbit(leadData: any): Promise<PhoneSource[]> {
    try {
      // Simula busca no Clearbit
      // Em produção: https://clearbit.com/docs
      
      if (!leadData.email) return [];

      return [{
        source: 'Clearbit',
        phone: '+351 925 678 901',
        confidence: 82,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
          location: 'Lisboa, Portugal',
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ ROCKETREACH ============
  private async searchRocketReach(leadData: any): Promise<PhoneSource[]> {
    try {
      // Simula busca no RocketReach
      // Em produção: https://rocketreach.co/api
      
      return [{
        source: 'RocketReach',
        phone: '+351 912 345 678',
        confidence: 88,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
          carrier: 'MEO',
          verified: true,
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ WHATSAPP BUSINESS ============
  private async searchWhatsAppBusiness(leadData: any): Promise<PhoneSource[]> {
    try {
      // Verifica se número está no WhatsApp Business
      // Em produção, usar WhatsApp Business API
      
      return [{
        source: 'WhatsApp Business',
        phone: '+351 912 345 678',
        confidence: 95,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
          verified: true,
          lastSeen: 'Hoje às 14:30',
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ FACEBOOK ============
  private async searchFacebook(leadData: any): Promise<PhoneSource[]> {
    try {
      // Busca número público no Facebook
      // Em produção, usar Graph API (com permissões)
      
      return [{
        source: 'Facebook',
        phone: '+351 963 456 789',
        confidence: 65,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
          lastSeen: '2024-12-08',
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ INSTAGRAM ============
  private async searchInstagram(leadData: any): Promise<PhoneSource[]> {
    try {
      // Busca número na bio do Instagram
      // Em produção, scraping ético ou API oficial
      
      return [{
        source: 'Instagram',
        phone: '+351 912 345 678',
        confidence: 70,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'mobile' as const,
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ BASES PÚBLICAS ============
  private async searchPublicDatabases(leadData: any): Promise<PhoneSource[]> {
    try {
      // Busca em bases públicas (compliance GDPR)
      // Apenas dados públicos e autorizados
      
      return [{
        source: 'Bases Públicas PT',
        phone: '+351 925 678 901',
        confidence: 60,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'landline' as const,
          location: 'Porto, Portugal',
        },
      }];
    } catch (error) {
      return [];
    }
  }

  // ============ IA: ANALISA E PONTUA TELEFONES ============
  private analyzeWithAI(
    phone: string,
    sources: PhoneSource[],
    leadData: any
  ): PhoneSuggestion {
    // Fatores que a IA considera:
    // 1. Número de fontes que confirmam o telefone
    // 2. Confiabilidade de cada fonte
    // 3. Quão recente é a informação
    // 4. Se está verificado
    // 5. Tipo de telefone (mobile > landline)

    const sourceCount = sources.length;
    const avgConfidence = sources.reduce((sum, s) => sum + s.confidence, 0) / sourceCount;
    const hasVerified = sources.some(s => s.metadata?.verified);
    const isMobile = sources.some(s => s.metadata?.type === 'mobile');
    const hasWhatsApp = sources.some(s => s.source === 'WhatsApp Business');
    const hasLinkedIn = sources.some(s => s.source === 'LinkedIn Sales Nav');

    // Score da IA (0-100)
    let aiScore = 0;

    // +40 pontos pela confiança média das fontes
    aiScore += avgConfidence * 0.4;

    // +20 pontos por múltiplas fontes
    aiScore += Math.min(sourceCount * 5, 20);

    // +15 pontos se verificado
    if (hasVerified) aiScore += 15;

    // +10 pontos se for mobile
    if (isMobile) aiScore += 10;

    // +10 pontos se tiver WhatsApp
    if (hasWhatsApp) aiScore += 10;

    // +5 pontos se vier do LinkedIn
    if (hasLinkedIn) aiScore += 5;

    aiScore = Math.min(aiScore, 100);

    // Status baseado no score
    let status: 'hot' | 'warm' | 'cold';
    if (aiScore >= 80) status = 'hot';
    else if (aiScore >= 60) status = 'warm';
    else status = 'cold';

    // Raciocínio da IA
    const reasoning = this.generateAIReasoning(sources, aiScore, hasVerified, isMobile, hasWhatsApp);

    // Recomendação
    const recommendation = this.generateRecommendation(status, sources);

    return {
      phone,
      confidence: Math.round(aiScore),
      sources,
      aiReasoning: reasoning,
      status,
      recommendation,
    };
  }

  // ============ GERA RACIOCÍNIO DA IA ============
  private generateAIReasoning(
    sources: PhoneSource[],
    score: number,
    verified: boolean,
    mobile: boolean,
    whatsapp: boolean
  ): string {
    const reasons: string[] = [];

    if (sources.length >= 3) {
      reasons.push(`✅ Confirmado por ${sources.length} fontes independentes`);
    } else if (sources.length === 2) {
      reasons.push(`✓ Encontrado em ${sources.length} fontes`);
    }

    if (verified) {
      reasons.push('✅ Número verificado oficialmente');
    }

    if (mobile) {
      reasons.push('📱 Telefone móvel (melhor para contacto)');
    }

    if (whatsapp) {
      reasons.push('💬 Ativo no WhatsApp (contacto direto possível)');
    }

    const topSources = sources
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2)
      .map(s => s.source);
    
    if (topSources.length > 0) {
      reasons.push(`🎯 Fontes: ${topSources.join(', ')}`);
    }

    return reasons.join(' • ');
  }

  // ============ GERA RECOMENDAÇÃO ============
  private generateRecommendation(status: string, sources: PhoneSource[]): string {
    if (status === 'hot') {
      return '🔥 CONTACTE AGORA! Número altamente confiável com múltiplas confirmações.';
    } else if (status === 'warm') {
      return '⚠️ Contactar com confiança moderada. Validar antes de adicionar ao CRM.';
    } else {
      return '❄️ Baixa confiança. Recomendamos buscar validação adicional antes de contactar.';
    }
  }

  // ============ NORMALIZAR TELEFONE ============
  private normalizePhone(phone: string): string {
    // Remove espaços, parênteses, hífens
    return phone.replace(/[\s\(\)\-]/g, '');
  }

  // ============ VALIDAR NÚMERO (NUMVERIFY API) ============
  async validatePhone(phone: string): Promise<{
    valid: boolean;
    country: string;
    type: 'mobile' | 'landline' | 'voip';
    carrier: string;
  }> {
    try {
      // Em produção, usar NumVerify API: https://numverify.com
      // Simulação:
      return {
        valid: true,
        country: 'Portugal',
        type: 'mobile',
        carrier: 'Vodafone PT',
      };
    } catch (error) {
      return {
        valid: false,
        country: '',
        type: 'mobile',
        carrier: '',
      };
    }
  }

  // ============ PROCESSAR BATCH DE LEADS ============
  async enrichBatch(leads: any[]): Promise<EnrichmentResult[]> {
    const results: EnrichmentResult[] = [];

    for (const lead of leads) {
      try {
        const result = await this.enrichPhone({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          linkedin: lead.linkedin,
          phone: lead.phone,
        });
        results.push(result);

        // Delay para não sobrecarregar APIs
        await this.delay(500);
      } catch (error) {
        console.error(`Erro ao enriquecer ${lead.name}:`, error);
      }
    }

    return results;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const phoneEnrichment = new PhoneEnrichmentService();
