import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface SearchParams {
  // Pessoa
  firstName?: string;
  lastName?: string;
  name?: string;
  currentTitle?: string;
  pastTitle?: string;
  
  // Empresa
  currentCompany?: string;
  pastCompany?: string;
  industry?: string[];
  companySize?: string[];
  companyRevenue?: string[];
  
  // Geografia
  country?: string[];
  city?: string;
  location?: string;
  
  // Avançado
  keywords?: string;
  seniority?: string[];
  skills?: string;
  hasEmail?: boolean;
  hasPhone?: boolean;
  
  // Limites
  limit?: number;
  offset?: number;
}

interface CompanySearchParams {
  name?: string;
  industry?: string[];
  location?: string;
  country?: string[];
  companySize?: string[];
  revenue?: string[];
  keywords?: string;
  founded?: string;
  technology?: string[];
  limit?: number;
}

export interface SearchResult {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title: string;
  company: string;
  location: string;
  country?: string;
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
  recentActivity?: string;
  openToWork?: boolean;
  source: 'apollo' | 'hunter' | 'linkedin' | 'clearbit' | 'pdl' | 'rocketreach';
  confidence: number;
  enrichmentData?: any;
}

export interface CompanyResult {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string;
  revenue?: string;
  location: string;
  country: string;
  founded?: number;
  description: string;
  website: string;
  linkedinUrl: string;
  logo: string;
  technologies?: string[];
  employeeCount?: number;
  annualRevenue?: string;
  phone?: string;
  address?: string;
  matchScore: number;
  source: 'apollo' | 'clearbit' | 'pdl';
}

class RealSearchService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c`;
  
  /**
   * 🔍 BUSCA REAL DE PESSOAS
   * Integra múltiplas APIs: Apollo.io, Hunter.io, PDL, RocketReach
   */
  async searchPeople(params: SearchParams): Promise<SearchResult[]> {
    try {
      console.group('🔍 BUSCA REAL DE PESSOAS');
      console.log('Parâmetros:', params);
      
      toast.info('🔍 Buscando leads...', {
        description: 'Consultando Apollo, Hunter, PDL e RocketReach',
        duration: 2000,
      });
      
      // Chama o servidor que coordena as chamadas às APIs
      const response = await fetch(`${this.baseUrl}/search/people`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...params,
          limit: params.limit || 25,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta da API:', errorText);
        throw new Error(`API retornou erro: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Resposta completa da API:', data);
      console.groupEnd();

      const results = data.results || [];
      
      // NUNCA USA MOCKADOS - Mostra a realidade
      if (results.length === 0) {
        console.log('⚠️ Nenhum resultado encontrado nas APIs REAIS');
        
        toast.warning('Nenhum lead encontrado', {
          description: 'Tente ajustar os filtros de busca ou verificar as API keys',
          duration: 5000,
        });
        
        return [];
      }
      
      console.log(`✅ ${results.length} leads REAIS encontrados!`);
      
      toast.success(`✅ ${results.length} leads encontrados!`, {
        description: `Fontes: ${this.getUniqueSources(results).join(', ')}`,
        duration: 4000,
      });

      return results;
      
    } catch (error: any) {
      console.error('❌ ERRO CRÍTICO na busca:', error);
      console.groupEnd();
      
      toast.error('❌ Erro ao buscar leads', {
        description: error.message || 'Verifique as API keys e conexão',
        duration: 6000,
      });
      
      // NUNCA retorna mockados - Mostra que falhou
      return [];
    }
  }

  /**
   * 🏢 BUSCA REAL DE EMPRESAS
   * Integra Apollo.io, Clearbit, PDL para dados de empresas
   */
  async searchCompanies(params: CompanySearchParams): Promise<CompanyResult[]> {
    try {
      console.group('🏢 BUSCA REAL DE EMPRESAS');
      console.log('Parâmetros:', params);
      
      toast.info('🏢 Buscando empresas...', {
        description: 'Consultando Apollo.io, Clearbit e PDL',
      });

      const response = await fetch(`${this.baseUrl}/search/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...params,
          limit: params.limit || 25,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na busca de empresas');
      }

      const data = await response.json();
      console.log('✅ Empresas encontradas:', data);
      console.groupEnd();

      const results = data.results || [];
      
      if (results.length > 0) {
        toast.success(`✅ ${results.length} empresas encontradas!`, {
          description: `Fontes: ${this.getUniqueSources(results).join(', ')}`,
        });
      } else {
        toast.info('Nenhuma empresa encontrada', {
          description: 'Tente ajustar os filtros',
        });
      }

      return results;
    } catch (error: any) {
      console.error('❌ Erro na busca de empresas:', error);
      console.groupEnd();
      
      toast.error('Erro ao buscar empresas', {
        description: error.message,
      });
      
      return this.getMockCompanyResults(params);
    }
  }

  /**
   * 📧 ENRIQUECIMENTO DE LEAD (adiciona email, telefone, etc)
   */
  async enrichLead(leadData: Partial<SearchResult>): Promise<SearchResult> {
    try {
      console.log('📧 Enriquecendo lead:', leadData.name);
      
      const response = await fetch(`${this.baseUrl}/enrich/person`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error('Erro ao enriquecer lead');
      }

      const enriched = await response.json();
      
      toast.success('✅ Lead enriquecido!', {
        description: `Email${enriched.email ? ' ✓' : ' ✗'} | Telefone${enriched.phone ? ' ✓' : ' ✗'}`,
      });

      return enriched;
    } catch (error: any) {
      console.error('❌ Erro ao enriquecer:', error);
      toast.error('Erro ao enriquecer lead');
      return leadData as SearchResult;
    }
  }

  /**
   * 🎯 BUSCA POR EMPRESA ESPECÍFICA (estilo Sales Navigator)
   * Retorna todos os funcionários de uma empresa
   */
  async searchPeopleByCompany(companyName: string, filters?: Partial<SearchParams>): Promise<SearchResult[]> {
    return this.searchPeople({
      ...filters,
      currentCompany: companyName,
      limit: 50,
    });
  }

  /**
   * 🔗 BUSCA POR URL DO LINKEDIN
   */
  async searchByLinkedInUrl(linkedinUrl: string): Promise<SearchResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/enrich/linkedin-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      if (!response.ok) {
        throw new Error('Perfil não encontrado');
      }

      const profile = await response.json();
      return profile;
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error);
      return null;
    }
  }

  /**
   * Utilitários
   */
  private getUniqueSources(results: any[]): string[] {
    const sources = results.map(r => r.source).filter(Boolean);
    return [...new Set(sources)];
  }

  /**
   * Dados mockados para fallback
   */
  private getMockPeopleResults(params: SearchParams): SearchResult[] {
    console.log('📊 Usando dados mockados de pessoas');
    
    const mockData: SearchResult[] = [
      {
        id: 'mock-1',
        name: 'Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        title: 'CEO & Founder',
        company: 'Compass Real Estate',
        location: 'New York, United States',
        country: 'United States',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
        email: 'sarah.johnson@compass.com',
        phone: '+1 212 555 0123',
        industry: 'Real Estate Technology',
        companySize: '1000+',
        seniority: 'C-Level',
        yearsExperience: 15,
        skills: ['PropTech', 'Real Estate', 'Startups', 'Investment'],
        matchScore: 98,
        source: 'apollo',
        confidence: 95,
        recentActivity: 'Posted 2 days ago',
      },
      {
        id: 'mock-2',
        name: 'Michael Chen',
        firstName: 'Michael',
        lastName: 'Chen',
        title: 'Director of Sales',
        company: 'Sotheby\'s International Realty',
        location: 'Hong Kong',
        country: 'Hong Kong',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/michaelchen',
        email: 'michael.chen@sothebys.com',
        phone: '+852 9123 4567',
        industry: 'Luxury Real Estate',
        companySize: '501-1000',
        seniority: 'Director',
        yearsExperience: 12,
        skills: ['Sales', 'Luxury Real Estate', 'Client Relations', 'Negotiation'],
        matchScore: 95,
        source: 'hunter',
        confidence: 92,
      },
      {
        id: 'mock-3',
        name: 'Emma Williams',
        firstName: 'Emma',
        lastName: 'Williams',
        title: 'VP of Marketing',
        company: 'Knight Frank London',
        location: 'London, United Kingdom',
        country: 'United Kingdom',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/emmawilliams',
        email: 'emma.williams@knightfrank.com',
        phone: '+44 20 7123 4567',
        industry: 'Real Estate',
        companySize: '501-1000',
        seniority: 'VP',
        yearsExperience: 10,
        skills: ['Marketing', 'Digital Strategy', 'Branding', 'Lead Generation'],
        matchScore: 92,
        source: 'pdl',
        confidence: 88,
        openToWork: true,
      },
      {
        id: 'mock-4',
        name: 'Diego Martinez',
        firstName: 'Diego',
        lastName: 'Martinez',
        title: 'Real Estate Investment Manager',
        company: 'CBRE Global',
        location: 'Barcelona, Spain',
        country: 'Spain',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/diegomartinez',
        email: 'diego.martinez@cbre.com',
        phone: '+34 93 123 4567',
        industry: 'Real Estate',
        companySize: '1000+',
        seniority: 'Manager',
        yearsExperience: 8,
        skills: ['Investment', 'Portfolio Management', 'Client Advisory', 'Market Analysis'],
        matchScore: 90,
        source: 'apollo',
        confidence: 90,
      },
      {
        id: 'mock-5',
        name: 'Priya Singh',
        firstName: 'Priya',
        lastName: 'Singh',
        title: 'Head of Business Development',
        company: 'PropNex Singapore',
        location: 'Singapore',
        country: 'Singapore',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/priyasingh',
        email: 'priya@propnex.sg',
        phone: '+65 9123 4567',
        industry: 'Real Estate',
        companySize: '201-500',
        seniority: 'Director',
        yearsExperience: 11,
        skills: ['Business Development', 'Strategic Planning', 'Partnerships', 'Team Leadership'],
        matchScore: 88,
        source: 'hunter',
        confidence: 85,
        recentActivity: 'Posted 1 week ago',
      },
      {
        id: 'mock-6',
        name: 'James Brown',
        firstName: 'James',
        lastName: 'Brown',
        title: 'Senior Real Estate Agent',
        company: 'Douglas Elliman',
        location: 'Miami, United States',
        country: 'United States',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/jamesbrown',
        email: 'james.brown@elliman.com',
        phone: '+1 305 555 0123',
        industry: 'Real Estate',
        companySize: '501-1000',
        seniority: 'Senior',
        yearsExperience: 9,
        skills: ['Property Sales', 'Customer Service', 'Negotiation', 'Market Knowledge'],
        matchScore: 86,
        source: 'pdl',
        confidence: 82,
      },
      {
        id: 'mock-7',
        name: 'Sophie Dubois',
        firstName: 'Sophie',
        lastName: 'Dubois',
        title: 'Chief Marketing Officer',
        company: 'Engel & Völkers Global',
        location: 'Paris, France',
        country: 'France',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/sophiedubois',
        email: 'sophie.dubois@engelvoelkers.com',
        phone: '+33 1 4123 4567',
        industry: 'Real Estate',
        companySize: '501-1000',
        seniority: 'C-Level',
        yearsExperience: 13,
        skills: ['Marketing Strategy', 'Digital Marketing', 'Brand Management', 'Innovation'],
        matchScore: 94,
        source: 'rocketreach',
        confidence: 93,
        openToWork: false,
      },
      {
        id: 'mock-8',
        name: 'Lucas Silva',
        firstName: 'Lucas',
        lastName: 'Silva',
        title: 'Commercial Director',
        company: 'JLL Worldwide',
        location: 'São Paulo, Brazil',
        country: 'Brazil',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
        linkedinUrl: 'https://linkedin.com/in/lucassilva',
        email: 'lucas.silva@jll.com',
        phone: '+55 11 9123 4567',
        industry: 'Commercial Real Estate',
        companySize: '1000+',
        seniority: 'Director',
        yearsExperience: 14,
        skills: ['Commercial Sales', 'International Markets', 'Corporate Clients', 'Premium Service'],
        matchScore: 96,
        source: 'apollo',
        confidence: 94,
        recentActivity: 'Posted 3 days ago',
      },
    ];

    // Filtragem básica baseada nos parâmetros
    let filtered = mockData;
    
    if (params.currentTitle) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(params.currentTitle!.toLowerCase())
      );
    }
    
    if (params.currentCompany) {
      filtered = filtered.filter(p => 
        p.company.toLowerCase().includes(params.currentCompany!.toLowerCase())
      );
    }
    
    if (params.city) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(params.city!.toLowerCase())
      );
    }
    
    if (params.country && params.country.length > 0) {
      filtered = filtered.filter(p => 
        params.country!.some(c => 
          p.country?.toLowerCase().includes(c.toLowerCase())
        )
      );
    }
    
    if (params.seniority && params.seniority.length > 0) {
      filtered = filtered.filter(p => 
        params.seniority!.some(s => 
          p.seniority.toLowerCase().includes(s.toLowerCase())
        )
      );
    }
    
    // Se filtrou tudo, retorna pelo menos 3 resultados genéricos
    if (filtered.length === 0) {
      filtered = mockData.slice(0, 3);
    }
    
    return filtered;
  }

  private getMockCompanyResults(params: CompanySearchParams): CompanyResult[] {
    console.log('📊 Usando dados mockados de empresas');
    
    return [
      {
        id: 'comp-1',
        name: 'Keller Williams Portugal',
        domain: 'kw.pt',
        industry: 'Real Estate',
        size: '201-500',
        revenue: '€10M-€50M',
        location: 'Lisboa, Portugal',
        country: 'Portugal',
        founded: 2015,
        description: 'Maior rede imobiliária do mundo com presença em Portugal',
        website: 'https://kw.pt',
        linkedinUrl: 'https://linkedin.com/company/keller-williams-portugal',
        logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop',
        technologies: ['CRM', 'WordPress', 'Google Analytics'],
        employeeCount: 350,
        annualRevenue: '€25M',
        phone: '+351 21 123 4567',
        matchScore: 95,
        source: 'apollo',
      },
      {
        id: 'comp-2',
        name: 'RE/MAX Portugal',
        domain: 'remax.pt',
        industry: 'Real Estate',
        size: '501-1000',
        revenue: '€50M-€100M',
        location: 'Lisboa, Portugal',
        country: 'Portugal',
        founded: 2000,
        description: 'Líder global em franchising imobiliário',
        website: 'https://remax.pt',
        linkedinUrl: 'https://linkedin.com/company/remax-portugal',
        logo: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=200&h=200&fit=crop',
        technologies: ['Salesforce', 'HubSpot', 'React'],
        employeeCount: 750,
        annualRevenue: '€70M',
        matchScore: 92,
        source: 'clearbit',
      },
    ];
  }
}

export const realSearchService = new RealSearchService();