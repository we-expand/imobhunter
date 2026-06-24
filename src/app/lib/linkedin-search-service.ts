import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const LINKEDIN_API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/linkedin`;

export interface LinkedInPersonFilters {
  keywords?: string;
  jobTitle?: string;
  company?: string;
  location?: {
    city?: string;
    country?: string;
  };
  industry?: string[];
  seniority?: string;
  yearsOfExperience?: {
    min?: number;
    max?: number;
  };
  school?: string;
  degree?: string;
  skills?: string[];
  currentCompanyOnly?: boolean;
  limit?: number;
}

export interface LinkedInCompanyFilters {
  companyName?: string;
  industry?: string[];
  location?: {
    city?: string;
    country?: string;
  };
  companySize?: {
    min?: number;
    max?: number;
  };
  founded?: {
    min?: number;
    max?: number;
  };
  keywords?: string;
  limit?: number;
}

export interface LinkedInPerson {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title: string;
  company: string;
  location: string;
  country: string;
  avatar: string;
  linkedinUrl: string;
  email?: string;
  phone?: string;
  industry: string;
  companySize?: string;
  seniority: string;
  yearsExperience: number;
  skills: string[];
  matchScore: number;
  source: string;
  confidence: number;
  enrichmentData?: any;
}

export interface LinkedInCompany {
  id: string;
  name: string;
  website?: string;
  domain?: string;
  industry: string;
  description?: string;
  founded?: number;
  headquarters: string;
  employeeCount: number;
  linkedinUrl: string;
  logo?: string;
  specialties?: string[];
  companyType?: string;
  followerCount?: number;
  matchScore: number;
  source: string;
  enrichmentData?: any;
}

/**
 * 🔗 BUSCAR PESSOAS NO LINKEDIN
 */
export async function searchLinkedInPeople(filters: LinkedInPersonFilters): Promise<LinkedInPerson[]> {
  try {
    console.log('🔗 Buscando pessoas no LinkedIn:', filters);

    const response = await fetch(`${LINKEDIN_API_URL}/people-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(filters)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na API LinkedIn:', errorText);
      
      // Tentar parsear como JSON primeiro
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        // Se não for JSON, é HTML ou texto puro
        errorData = { message: `Erro HTTP ${response.status}: ${errorText.substring(0, 200)}` };
      }
      
      if (response.status === 400) {
        toast.error('⚠️ Configure PROXYCURL_API_KEY', {
          description: 'Acesse o Admin Dashboard → Configurações → API Keys'
        });
        return [];
      }
      
      throw new Error(errorData.message || 'Erro ao buscar no LinkedIn');
    }

    const data = await response.json();
    
    if (data.success && data.results) {
      toast.success(`🔗 ${data.results.length} perfis encontrados no LinkedIn`, {
        description: data.message
      });
      return data.results;
    }

    return [];
  } catch (error: any) {
    console.error('❌ Erro ao buscar no LinkedIn:', error);
    toast.error('Erro na busca do LinkedIn', {
      description: error.message
    });
    return [];
  }
}

/**
 * 🏢 BUSCAR EMPRESAS NO LINKEDIN
 */
export async function searchLinkedInCompanies(filters: LinkedInCompanyFilters): Promise<LinkedInCompany[]> {
  try {
    console.log('🔗 Buscando empresas no LinkedIn:', filters);

    const response = await fetch(`${LINKEDIN_API_URL}/company-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(filters)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API LinkedIn:', errorData);
      
      if (response.status === 400) {
        toast.error('⚠️ Configure PROXYCURL_API_KEY', {
          description: 'Acesse o Admin Dashboard → Configurações → API Keys'
        });
        return [];
      }
      
      throw new Error(errorData.message || 'Erro ao buscar empresas');
    }

    const data = await response.json();
    
    if (data.success && data.results) {
      toast.success(`🏢 ${data.results.length} empresas encontradas`, {
        description: data.message
      });
      return data.results;
    }

    return [];
  } catch (error: any) {
    console.error('❌ Erro ao buscar empresas:', error);
    toast.error('Erro na busca de empresas', {
      description: error.message
    });
    return [];
  }
}

/**
 * 📊 ENRIQUECER PERFIL DO LINKEDIN (por URL)
 */
export async function enrichLinkedInProfile(linkedinUrl: string): Promise<any> {
  try {
    console.log('📊 Enriquecendo perfil:', linkedinUrl);

    const response = await fetch(`${LINKEDIN_API_URL}/enrich-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ linkedinUrl })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao enriquecer perfil');
    }

    const data = await response.json();
    
    if (data.success && data.profile) {
      toast.success('✅ Perfil enriquecido com sucesso!');
      return data.profile;
    }

    return null;
  } catch (error: any) {
    console.error('❌ Erro ao enriquecer perfil:', error);
    toast.error('Erro ao enriquecer perfil', {
      description: error.message
    });
    return null;
  }
}

export default {
  searchLinkedInPeople,
  searchLinkedInCompanies,
  enrichLinkedInProfile
};