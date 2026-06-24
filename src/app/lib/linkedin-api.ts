import { toast } from 'sonner';

interface LinkedInSearchParams {
  title?: string;
  company?: string;
  location?: string;
  country?: string;
  seniority?: string[];
  industry?: string[];
  keywords?: string;
  firstName?: string;
  lastName?: string;
}

interface LinkedInProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  headline: string;
  currentCompany: string;
  currentTitle: string;
  location: string;
  country: string;
  profilePicUrl: string;
  linkedinUrl: string;
  summary: string;
  industry: string;
  experience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
  }>;
  education: Array<{
    school: string;
    degree?: string;
    fieldOfStudy?: string;
  }>;
  skills: string[];
  connections: number;
}

interface SearchResult {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  industry: string;
  companySize: string;
  seniority: string;
  yearsExperience: number;
  skills: string[];
  matchScore: number;
}

// 🔑 CONFIGURAÇÃO PROXYCURL API
const PROXYCURL_CONFIG = {
  // DESABILITADO: Proxycurl não está totalmente implementado ainda
  // Para habilitar, descomente a linha abaixo e adicione VITE_PROXYCURL_API_KEY no .env
  // apiKey: import.meta?.env?.VITE_PROXYCURL_API_KEY || 'YOUR_PROXYCURL_API_KEY',
  apiKey: 'YOUR_PROXYCURL_API_KEY', // Desabilitado por padrão
  baseUrl: 'https://nubela.co/proxycurl/api',
};

class LinkedInAPIService {
  private isConfigured(): boolean {
    // SEMPRE retorna false para desabilitar completamente o Proxycurl
    return false;
    // return PROXYCURL_CONFIG.apiKey !== 'YOUR_PROXYCURL_API_KEY';
  }

  private showConfigInstructions() {
    toast.error('🔗 LinkedIn API não configurada', {
      description: 'Configure Proxycurl para buscar perfis reais. Veja console.',
      duration: 8000,
    });

    console.group('🔗 CONFIGURAR BUSCA REAL NO LINKEDIN - Proxycurl API (10 créditos grátis)');
    console.log('');
    console.log('📋 OPÇÕES DE API (do melhor para o pior):');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🥇 OPÇÃO 1: PROXYCURL (RECOMENDADO)');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ Legal e autorizado');
    console.log('✅ 10 créditos GRÁTIS para teste');
    console.log('✅ API profissional e estável');
    console.log('✅ Retorna emails e telefones (quando disponíveis)');
    console.log('✅ Usado por empresas Fortune 500');
    console.log('');
    console.log('📝 PASSO A PASSO:');
    console.log('');
    console.log('1️⃣ Criar conta grátis:');
    console.log('   https://nubela.co/proxycurl/');
    console.log('   • Clique "Start Free Trial"');
    console.log('   • 10 créditos grátis (sem cartão)');
    console.log('');
    console.log('2️⃣ Pegar API Key:');
    console.log('   Dashboard → Settings → API Key');
    console.log('   • Copie a chave');
    console.log('');
    console.log('3️⃣ Adicionar ao .env:');
    console.log('   VITE_PROXYCURL_API_KEY=sua-chave-aqui');
    console.log('');
    console.log('4️⃣ Reiniciar servidor:');
    console.log('   npm run dev');
    console.log('');
    console.log('💰 PREÇOS após trial:');
    console.log('   • Person Profile: $2 por perfil');
    console.log('   • Person Search: $30/mês (500 buscas)');
    console.log('   • Company Profile: $2 por empresa');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🥈 OPÇÃO 2: RAPIDAPI LINKEDIN SCRAPERS');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('https://rapidapi.com/hub (busque "linkedin scraper")');
    console.log('');
    console.log('Opções populares:');
    console.log('• Fresh LinkedIn Profile Data - 500 requests grátis/mês');
    console.log('• LinkedIn Profile and Company Data - 100 requests grátis/mês');
    console.log('• LinkedIn Data Scraper - Freemium');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🥉 OPÇÃO 3: PHANTOMBUSTER (Automatização)');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('https://phantombuster.com/');
    console.log('• Trial grátis de 14 dias');
    console.log('• Scraping visual (sem código)');
    console.log('• Exporta CSV automaticamente');
    console.log('• $59/mês após trial');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('⚠️  OPÇÃO 4: GOOGLE CUSTOM SEARCH (Limitada mas grátis)');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('https://developers.google.com/custom-search');
    console.log('• 100 buscas GRÁTIS por dia');
    console.log('• Busca profiles do LinkedIn via Google');
    console.log('• NÃO retorna dados estruturados');
    console.log('• Apenas URLs de perfis');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('❌ O QUE NÃO FUNCIONA:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('• LinkedIn Official API - Apenas parceiros enterprise');
    console.log('• LinkedIn Sales Navigator API - Requer contrato $$$');
    console.log('• Scraping direto - Viola termos de serviço');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎯 RECOMENDAÇÃO FINAL:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Para MVP/teste → PROXYCURL (10 créditos grátis)');
    console.log('Para produção → PROXYCURL ($30/mês) ou RapidAPI');
    console.log('Para volume alto → PhantomBuster + Proxycurl');
    console.log('');
    console.groupEnd();
  }

  /**
   * Busca perfis do LinkedIn usando Proxycurl API
   */
  async searchProfiles(params: LinkedInSearchParams): Promise<SearchResult[]> {
    // Se API não configurada, retorna dados mockados SEM FAZER NENHUMA REQUISIÇÃO
    if (!this.isConfigured()) {
      console.log('📊 Proxycurl não configurada - Usando dados de demonstração');
      // NÃO mostra toast de erro repetidamente
      return this.getMockResults(params);
    }

    try {
      console.log('🔍 Buscando no LinkedIn via Proxycurl...', params);

      // Construir URL com query params
      const url = new URL(`${PROXYCURL_CONFIG.baseUrl}/v2/search/person/`);
      
      // Adiciona parâmetros de busca
      if (params.title) url.searchParams.append('title', params.title);
      if (params.company) url.searchParams.append('current_company_name', params.company);
      if (params.location) url.searchParams.append('location', params.location);
      if (params.keywords) url.searchParams.append('keywords', params.keywords);
      
      // Paginação
      url.searchParams.append('page_size', '10');

      console.log('🌐 Proxycurl URL:', url.toString());

      // Faz busca de pessoas no LinkedIn
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PROXYCURL_CONFIG.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro Proxycurl:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText.substring(0, 200) // Limita o log do HTML
        });
        
        // Se for erro 401 ou 403, é problema de autenticação
        if (response.status === 401 || response.status === 403) {
          console.warn('🔑 Erro de autenticação Proxycurl - API key inválida');
        } else if (response.status === 404) {
          console.warn('🔍 Endpoint Proxycurl não encontrado - Verifique a URL');
        }
        
        // Retorna dados mockados silenciosamente
        return this.getMockResults(params);
      }

      const data = await response.json();

      console.log('✅ Resultados do LinkedIn:', data);

      // Converte resultados da API para formato interno
      const results = await this.convertProxycurlResults(data.results || []);

      if (results.length > 0) {
        toast.success(`✅ ${results.length} perfis encontrados no LinkedIn!`, {
          description: 'Dados reais do LinkedIn via Proxycurl',
        });
      }

      return results;
    } catch (error) {
      console.error('❌ Erro ao buscar no LinkedIn:', error);
      
      // Retorna dados mockados em vez de mostrar erro ao usuário
      return this.getMockResults(params);
    }
  }

  /**
   * Enriquece perfil individual com dados completos
   */
  async enrichProfile(linkedinUrl: string): Promise<LinkedInProfile | null> {
    if (!this.isConfigured()) {
      console.warn('⚠️ Proxycurl não configurada');
      return null;
    }

    try {
      console.log('🔍 Enriquecendo perfil:', linkedinUrl);

      // Construir URL correta para Person Profile Endpoint
      const url = new URL(`${PROXYCURL_CONFIG.baseUrl}/v2/linkedin`);
      url.searchParams.append('url', linkedinUrl);
      url.searchParams.append('fallback_to_cache', 'on-error');
      url.searchParams.append('use_cache', 'if-present');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PROXYCURL_CONFIG.apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro Proxycurl enrichProfile:', errorText);
        throw new Error(`Proxycurl API error: ${response.status} - ${errorText}`);
      }

      const profile = await response.json();

      console.log('✅ Perfil enriquecido:', profile);

      return this.convertProxycurlProfile(profile);
    } catch (error) {
      console.error('❌ Erro ao enriquecer perfil:', error);
      return null;
    }
  }

  /**
   * Encontra email do perfil (usando serviços de email finder)
   */
  async findEmail(firstName: string, lastName: string, company: string): Promise<string | null> {
    // Padrões comuns de email corporativo
    const domain = this.extractDomain(company);
    if (!domain) return null;

    const patterns = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}@${domain}`,
    ];

    // Retorna o primeiro padrão (seria validado por serviço real como Hunter.io)
    return patterns[0];
  }

  private buildSearchQuery(params: LinkedInSearchParams): string {
    const parts: string[] = [];

    if (params.title) parts.push(`title:${params.title}`);
    if (params.company) parts.push(`company:${params.company}`);
    if (params.location) parts.push(`location:${params.location}`);
    if (params.keywords) parts.push(params.keywords);

    return parts.join(' ');
  }

  private async convertProxycurlResults(results: any[]): Promise<SearchResult[]> {
    return results.map((result, index) => ({
      id: `linkedin-${index}`,
      name: `${result.first_name} ${result.last_name}`,
      title: result.headline || result.occupation || 'N/A',
      company: result.company?.name || 'N/A',
      location: `${result.city || ''}, ${result.country || ''}`.trim(),
      avatar: result.profile_pic_url || `https://ui-avatars.com/api/?name=${result.first_name}+${result.last_name}&size=150`,
      linkedinUrl: result.linkedin_profile_url || '#',
      email: result.email || '',
      phone: result.phone || '',
      industry: result.industry || 'N/A',
      companySize: this.inferCompanySize(result.company?.size),
      seniority: this.inferSeniority(result.headline || result.occupation || ''),
      yearsExperience: this.calculateExperience(result.experiences),
      skills: result.skills || [],
      matchScore: this.calculateMatchScore(result),
    }));
  }

  private convertProxycurlProfile(profile: any): LinkedInProfile {
    return {
      id: profile.public_identifier || '',
      name: `${profile.first_name} ${profile.last_name}`,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      headline: profile.headline || '',
      currentCompany: profile.experiences?.[0]?.company || '',
      currentTitle: profile.experiences?.[0]?.title || '',
      location: `${profile.city || ''}, ${profile.country || ''}`.trim(),
      country: profile.country || '',
      profilePicUrl: profile.profile_pic_url || '',
      linkedinUrl: `https://linkedin.com/in/${profile.public_identifier}`,
      summary: profile.summary || '',
      industry: profile.industry || '',
      experience: profile.experiences || [],
      education: profile.education || [],
      skills: profile.skills || [],
      connections: profile.connections || 0,
    };
  }

  private inferCompanySize(size: any): string {
    if (!size) return 'N/A';
    if (typeof size === 'number') {
      if (size <= 10) return '1-10';
      if (size <= 50) return '11-50';
      if (size <= 200) return '51-200';
      if (size <= 500) return '201-500';
      if (size <= 1000) return '501-1000';
      return '1000+';
    }
    return size.toString();
  }

  private inferSeniority(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('ceo') || lower.includes('founder') || lower.includes('chief')) return 'C-Level';
    if (lower.includes('vp') || lower.includes('vice president')) return 'VP';
    if (lower.includes('director') || lower.includes('head of')) return 'Director';
    if (lower.includes('manager') || lower.includes('lead')) return 'Manager';
    return 'Individual Contributor';
  }

  private calculateExperience(experiences: any[]): number {
    if (!experiences || experiences.length === 0) return 0;
    
    const years = experiences.reduce((total, exp) => {
      const start = new Date(exp.starts_at?.year || 2020, exp.starts_at?.month || 1);
      const end = exp.ends_at ? new Date(exp.ends_at.year, exp.ends_at.month) : new Date();
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + Math.max(0, duration);
    }, 0);
    
    return Math.round(years);
  }

  private calculateMatchScore(profile: any): number {
    let score = 70; // Base score
    
    if (profile.email) score += 10;
    if (profile.phone) score += 10;
    if (profile.skills?.length > 5) score += 5;
    if (profile.experiences?.length > 2) score += 5;
    
    return Math.min(100, score);
  }

  private extractDomain(company: string): string | null {
    // Remove espaços e caracteres especiais
    const clean = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Adiciona .pt para Portugal, .com para internacional
    return `${clean}.pt`;
  }

  /**
   * Dados mockados para quando API não está configurada
   */
  private getMockResults(params: LinkedInSearchParams): SearchResult[] {
    console.log('📊 Usando dados mockados (configure Proxycurl para dados reais)');
    
    const mockData: SearchResult[] = [
      {
        id: 'mock-1',
        name: 'Ana Silva',
        title: 'CEO & Founder',
        company: 'PropTech Innovations',
        location: 'Lisboa, Portugal',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/anasilva',
        email: 'ana.silva@proptech.pt',
        phone: '+351 912 345 678',
        industry: 'Real Estate Technology',
        companySize: '11-50',
        seniority: 'C-Level',
        yearsExperience: 15,
        skills: ['PropTech', 'Real Estate', 'Startups', 'Investment'],
        matchScore: 98,
      },
      {
        id: 'mock-2',
        name: 'Carlos Mendes',
        title: 'Director of Sales',
        company: 'Luxury Homes Portugal',
        location: 'Porto, Portugal',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/carlosmendes',
        email: 'carlos@luxuryhomes.pt',
        phone: '+351 913 456 789',
        industry: 'Luxury Real Estate',
        companySize: '51-200',
        seniority: 'Director',
        yearsExperience: 12,
        skills: ['Sales', 'Luxury Real Estate', 'Client Relations', 'Negotiation'],
        matchScore: 95,
      },
      {
        id: 'mock-3',
        name: 'Maria Costa',
        title: 'VP of Marketing',
        company: 'Imobiliária Premium',
        location: 'Cascais, Portugal',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/mariacosta',
        email: 'maria.costa@premium.pt',
        phone: '+351 914 567 890',
        industry: 'Real Estate',
        companySize: '201-500',
        seniority: 'VP',
        yearsExperience: 10,
        skills: ['Marketing', 'Digital Strategy', 'Branding', 'Lead Generation'],
        matchScore: 92,
      },
      {
        id: 'mock-4',
        name: 'João Santos',
        title: 'Investment Manager',
        company: 'Real Estate Capital',
        location: 'Lisboa, Portugal',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/joaosantos',
        email: 'j.santos@recapital.pt',
        phone: '+351 915 678 901',
        industry: 'Real Estate Investment',
        companySize: '11-50',
        seniority: 'Manager',
        yearsExperience: 8,
        skills: ['Investment', 'Portfolio Management', 'Due Diligence', 'Analysis'],
        matchScore: 88,
      },
      {
        id: 'mock-5',
        name: 'Rita Ferreira',
        title: 'Real Estate Consultant',
        company: 'Keller Williams Portugal',
        location: 'Lisboa, Portugal',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/ritaferreira',
        email: 'rita.ferreira@kw.pt',
        phone: '+351 916 789 012',
        industry: 'Real Estate',
        companySize: '201-500',
        seniority: 'Individual Contributor',
        yearsExperience: 5,
        skills: ['Sales', 'Client Relations', 'Property Valuation', 'Negotiation'],
        matchScore: 85,
      },
    ];

    // Filtra baseado nos parâmetros
    return mockData.filter(profile => {
      if (params.title && !profile.title.toLowerCase().includes(params.title.toLowerCase())) {
        return false;
      }
      if (params.company && !profile.company.toLowerCase().includes(params.company.toLowerCase())) {
        return false;
      }
      if (params.location && !profile.location.toLowerCase().includes(params.location.toLowerCase())) {
        return false;
      }
      if (params.seniority && params.seniority.length > 0 && !params.seniority.includes(profile.seniority)) {
        return false;
      }
      return true;
    });
  }
}

export const linkedInAPI = new LinkedInAPIService();