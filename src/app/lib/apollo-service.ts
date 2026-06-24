// Serviço de integração com Apollo.io API
class ApolloService {
  private apiKey: string = '';
  // 🔥 FIX: Usar o NOVO base URL do Apollo.io
  private baseUrl = 'https://api.apollo.io/api/v1';

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const config = localStorage.getItem('apollo-config');
    if (config) {
      const parsed = JSON.parse(config);
      this.apiKey = parsed.apiKey || '';
    }
  }

  configure(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('apollo-config', JSON.stringify({ apiKey }));
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getConfig() {
    return { apiKey: this.apiKey };
  }

  // Headers para todas as requisições
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    };
  }

  // ============ BUSCAR PESSOAS ============
  async searchPeople(params: {
    jobTitles?: string[];
    companyNames?: string[];
    locations?: string[];
    keywords?: string[];
    page?: number;
    perPage?: number;
  }) {
    // 🔥 FIX: Usar o NOVO endpoint do Apollo.io (api_search, não search!)
    // Documentação: https://docs.apollo.io/reference/people-api-search
    const url = `${this.baseUrl}/mixed_people/api_search`;

    const body: any = {
      api_key: this.apiKey,
      page: params.page || 1,
      per_page: params.perPage || 25
    };

    // Adiciona filtros se fornecidos
    if (params.jobTitles && params.jobTitles.length > 0) {
      body.person_titles = params.jobTitles;
    }

    if (params.companyNames && params.companyNames.length > 0) {
      body.organization_names = params.companyNames;
    }

    if (params.locations && params.locations.length > 0) {
      body.person_locations = params.locations;
    }

    if (params.keywords && params.keywords.length > 0) {
      body.q_keywords = params.keywords.join(' ');
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na busca Apollo');
      }

      const data = await response.json();
      return {
        success: true,
        people: data.people || [],
        totalResults: data.pagination?.total_entries || 0,
        creditsUsed: 1,
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.total_pages || 1
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        people: []
      };
    }
  }

  // ============ ENRIQUECER PESSOA ============
  async enrichPerson(params: {
    firstName?: string;
    lastName?: string;
    email?: string;
    linkedinUrl?: string;
    organization?: string;
  }) {
    const url = `${this.baseUrl}/people/match`;

    const body: any = {
      api_key: this.apiKey
    };

    if (params.firstName) body.first_name = params.firstName;
    if (params.lastName) body.last_name = params.lastName;
    if (params.email) body.email = params.email;
    if (params.linkedinUrl) body.linkedin_url = params.linkedinUrl;
    if (params.organization) body.organization_name = params.organization;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao enriquecer dados');
      }

      const data = await response.json();
      return {
        success: true,
        person: data.person,
        creditsUsed: 1
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============ BUSCAR EMPRESAS ============
  async searchOrganizations(params: {
    names?: string[];
    locations?: string[];
    industries?: string[];
    page?: number;
    perPage?: number;
  }) {
    const url = `${this.baseUrl}/mixed_companies/search`;

    const body: any = {
      api_key: this.apiKey,
      page: params.page || 1,
      per_page: params.perPage || 25
    };

    if (params.names && params.names.length > 0) {
      body.organization_names = params.names;
    }

    if (params.locations && params.locations.length > 0) {
      body.organization_locations = params.locations;
    }

    if (params.industries && params.industries.length > 0) {
      body.organization_industry_tag_ids = params.industries;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na busca de empresas');
      }

      const data = await response.json();
      return {
        success: true,
        organizations: data.organizations || [],
        totalResults: data.pagination?.total_entries || 0,
        creditsUsed: 1
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        organizations: []
      };
    }
  }

  // ============ TESTAR CONEXÃO ============
  async testConnection() {
    try {
      // Busca simples para testar API key
      const result = await this.searchPeople({
        locations: ['Portugal'],
        perPage: 1
      });

      if (result.success) {
        return {
          success: true,
          message: 'Conexão com Apollo.io estabelecida!'
        };
      } else {
        return {
          success: false,
          message: result.error || 'Falha ao conectar'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // ============ OBTER CRÉDITOS RESTANTES ============
  async getCreditsInfo() {
    const url = `${this.baseUrl}/auth/health`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.getHeaders(),
          'X-Api-Key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao obter informação de créditos');
      }

      const data = await response.json();
      return {
        success: true,
        creditsRemaining: data.credits_remaining || 0,
        creditsLimit: data.credits_limit || 60
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============ CONVERTER PARA FORMATO DO SISTEMA ============
  convertToLead(apolloPerson: any, cluster: string) {
    return {
      id: `apollo-${apolloPerson.id || Date.now()}`,
      name: `${apolloPerson.first_name || ''} ${apolloPerson.last_name || ''}`.trim(),
      company: apolloPerson.organization?.name || apolloPerson.employment_history?.[0]?.organization_name || 'N/A',
      jobTitle: apolloPerson.title || apolloPerson.employment_history?.[0]?.title || 'N/A',
      email: apolloPerson.email || apolloPerson.personal_emails?.[0] || '',
      phone: apolloPerson.phone_numbers?.[0]?.sanitized_number || '',
      cluster: cluster,
      status: 'cold' as const,
      score: this.calculateInitialScore(apolloPerson),
      lastContact: new Date().toISOString(),
      channel: 'linkedin' as const,
      profileUrl: apolloPerson.linkedin_url || '',
      location: apolloPerson.city || apolloPerson.state || apolloPerson.country || '',
      enrichmentData: {
        apolloId: apolloPerson.id,
        seniority: apolloPerson.seniority,
        departments: apolloPerson.departments || [],
        headline: apolloPerson.headline,
        photoUrl: apolloPerson.photo_url,
        companyWebsite: apolloPerson.organization?.website_url,
        companyLinkedin: apolloPerson.organization?.linkedin_url,
        employeeCount: apolloPerson.organization?.estimated_num_employees
      }
    };
  }

  private calculateInitialScore(person: any): number {
    let score = 30; // Base score

    // Adiciona pontos se tiver email
    if (person.email) score += 20;

    // Adiciona pontos por seniority
    const seniority = person.seniority?.toLowerCase() || '';
    if (seniority.includes('director') || seniority.includes('vp')) score += 15;
    if (seniority.includes('c_suite') || seniority.includes('owner')) score += 20;

    // Adiciona pontos se tiver telefone
    if (person.phone_numbers && person.phone_numbers.length > 0) score += 15;

    return Math.min(score, 75); // Máximo 75 para cold lead
  }
}

export const apollo = new ApolloService();
