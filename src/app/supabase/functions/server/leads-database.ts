/**
 * 🗄️ BANCO DE DADOS CENTRALIZADO DE LEADS
 * 
 * Sistema completo de armazenamento, otimização e gestão de leads
 * encontrados por todos os usuários da plataforma
 */

import * as kv from "./kv_store.tsx";

// ==========================================
// SCHEMA COMPLETO DE LEAD
// ==========================================

export interface LeadRecord {
  // === IDENTIFICAÇÃO ÚNICA ===
  id: string; // UUID único do lead
  created_at: string;
  updated_at: string;
  last_enriched_at?: string;
  
  // === DADOS PESSOAIS ===
  // Nome
  full_name: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  preferred_name?: string;
  
  // Identidade
  gender?: string;
  birth_date?: string;
  age?: number;
  languages?: string[];
  
  // === CONTATO ===
  // Email
  emails: EmailRecord[];
  primary_email?: string;
  
  // Telefone
  phones: PhoneRecord[];
  primary_phone?: string;
  
  // Endereço
  addresses: AddressRecord[];
  
  // Social Media
  linkedin_url?: string;
  linkedin_public_id?: string;
  twitter_url?: string;
  twitter_handle?: string;
  facebook_url?: string;
  instagram_url?: string;
  github_url?: string;
  personal_website?: string;
  
  // === PROFISSIONAL ===
  // Cargo Atual
  current_title?: string;
  current_company?: string;
  current_company_id?: string;
  employment_status?: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
  start_date_current_job?: string;
  
  // Carreira
  seniority?: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'Senior' | 'Mid-Level' | 'Entry-Level' | 'Intern';
  departments?: string[];
  experience_years?: number;
  experience_history: ExperienceRecord[];
  
  // Skills & Expertise
  skills: string[];
  certifications?: string[];
  
  // === EMPRESA ATUAL ===
  company_data?: CompanyData;
  
  // === EDUCAÇÃO ===
  education: EducationRecord[];
  highest_degree?: string;
  
  // === LOCALIZAÇÃO ===
  // Localização Atual
  city?: string;
  state?: string;
  country?: string;
  country_code?: string;
  timezone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // === PERFIL ===
  photo_url?: string;
  headline?: string;
  summary?: string;
  bio?: string;
  
  // === DADOS DE ENRIQUECIMENTO ===
  // Fontes
  sources: SourceRecord[];
  total_sources: number;
  
  // Scores
  data_quality_score: number; // 0-100
  confidence_score: number; // 0-100
  engagement_score?: number; // 0-100
  lead_score?: number; // 0-100
  
  // Verificação
  email_verified?: boolean;
  phone_verified?: boolean;
  linkedin_verified?: boolean;
  
  // === METADADOS ===
  // Rastreamento
  found_by_user_id: string;
  found_by_user_email: string;
  found_at: string;
  found_via?: string; // 'search' | 'import' | 'api' | 'manual'
  
  // Atualizações
  update_history: UpdateRecord[];
  total_updates: number;
  
  // Interações
  interactions: InteractionRecord[];
  total_interactions: number;
  
  // Tags & Segmentos
  tags: string[];
  segments: string[];
  custom_fields: Record<string, any>;
  
  // === STATUS & PIPELINE ===
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  pipeline_stage?: string;
  assigned_to?: string;
  
  // === ENRIQUECIMENTO AVANÇADO ===
  // Interesses
  interests?: string[];
  
  // Comportamento Digital
  web_presence_score?: number;
  social_media_activity?: string;
  
  // Dados Financeiros (quando disponível)
  estimated_income_range?: string;
  
  // Propriedades Imobiliárias (para Real Estate)
  properties_owned?: number;
  property_value_estimate?: string;
  
  // GDPR & Compliance
  gdpr_consent?: boolean;
  marketing_consent?: boolean;
  data_processing_consent?: boolean;
  consent_date?: string;
  opt_out?: boolean;
  do_not_contact?: boolean;
}

// === TIPOS AUXILIARES ===

export interface EmailRecord {
  address: string;
  type: 'work' | 'personal' | 'other';
  verified: boolean;
  score?: number;
  source: string;
  last_verified?: string;
}

export interface PhoneRecord {
  number: string;
  type: 'mobile' | 'work' | 'home' | 'other';
  verified: boolean;
  country_code?: string;
  source: string;
  last_verified?: string;
}

export interface AddressRecord {
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  type: 'work' | 'home' | 'other';
  source: string;
}

export interface ExperienceRecord {
  title: string;
  company: string;
  company_id?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  duration_months?: number;
  description?: string;
  location?: string;
  source: string;
}

export interface EducationRecord {
  school: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  activities?: string;
  source: string;
}

export interface CompanyData {
  name: string;
  domain?: string;
  website?: string;
  industry?: string;
  size?: string;
  size_range?: string;
  employees_count?: number;
  founded_year?: number;
  description?: string;
  logo_url?: string;
  linkedin_url?: string;
  headquarters?: {
    city?: string;
    state?: string;
    country?: string;
  };
  revenue?: string;
  tech_stack?: string[];
  funding?: string;
  last_updated?: string;
}

export interface SourceRecord {
  name: string;
  api: string;
  timestamp: string;
  fields_provided: string[];
  reliability_score: number;
}

export interface UpdateRecord {
  timestamp: string;
  updated_by: string;
  source: string;
  fields_updated: string[];
  changes: Record<string, { old: any; new: any }>;
}

export interface InteractionRecord {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'message' | 'note';
  timestamp: string;
  user_id: string;
  user_email: string;
  subject?: string;
  notes?: string;
  outcome?: string;
}

// ==========================================
// SERVIÇO DE GERENCIAMENTO DE LEADS
// ==========================================

export class LeadsDatabase {
  
  /**
   * Salvar ou atualizar lead no banco de dados
   */
  async saveLead(leadData: Partial<LeadRecord>, userId: string, userEmail: string): Promise<LeadRecord> {
    console.log(`\n💾 Salvando lead: ${leadData.full_name || leadData.primary_email}`);
    
    // Gerar ID único baseado em email ou LinkedIn
    const leadId = this.generateLeadId(leadData);
    
    // Verificar se lead já existe
    const existingLead = await this.getLeadById(leadId);
    
    if (existingLead) {
      // Lead existe - fazer MERGE inteligente
      return await this.mergeLead(existingLead, leadData, userId, userEmail);
    } else {
      // Novo lead - criar registro
      return await this.createLead(leadData, leadId, userId, userEmail);
    }
  }
  
  /**
   * Criar novo lead
   */
  private async createLead(
    leadData: Partial<LeadRecord>, 
    leadId: string, 
    userId: string, 
    userEmail: string
  ): Promise<LeadRecord> {
    const now = new Date().toISOString();
    
    const newLead: LeadRecord = {
      id: leadId,
      created_at: now,
      updated_at: now,
      last_enriched_at: now,
      
      // Dados básicos
      full_name: leadData.full_name || '',
      first_name: leadData.first_name,
      last_name: leadData.last_name,
      
      // Contato
      emails: leadData.emails || [],
      primary_email: leadData.primary_email || leadData.emails?.[0]?.address,
      phones: leadData.phones || [],
      primary_phone: leadData.primary_phone || leadData.phones?.[0]?.number,
      addresses: leadData.addresses || [],
      
      // Social
      linkedin_url: leadData.linkedin_url,
      twitter_url: leadData.twitter_url,
      facebook_url: leadData.facebook_url,
      instagram_url: leadData.instagram_url,
      github_url: leadData.github_url,
      
      // Profissional
      current_title: leadData.current_title,
      current_company: leadData.current_company,
      seniority: leadData.seniority,
      departments: leadData.departments || [],
      experience_years: leadData.experience_years,
      experience_history: leadData.experience_history || [],
      skills: leadData.skills || [],
      
      // Empresa
      company_data: leadData.company_data,
      
      // Educação
      education: leadData.education || [],
      
      // Localização
      city: leadData.city,
      state: leadData.state,
      country: leadData.country,
      
      // Perfil
      photo_url: leadData.photo_url,
      headline: leadData.headline,
      summary: leadData.summary,
      
      // Enriquecimento
      sources: leadData.sources || [],
      total_sources: leadData.sources?.length || 0,
      data_quality_score: this.calculateDataQuality(leadData),
      confidence_score: this.calculateConfidence(leadData),
      
      // Rastreamento
      found_by_user_id: userId,
      found_by_user_email: userEmail,
      found_at: now,
      found_via: leadData.found_via || 'search',
      
      // Atualizações
      update_history: [],
      total_updates: 0,
      
      // Interações
      interactions: [],
      total_interactions: 0,
      
      // Tags
      tags: leadData.tags || [],
      segments: leadData.segments || [],
      custom_fields: leadData.custom_fields || {},
      
      // Status
      status: 'new',
    };
    
    // Salvar no KV Store
    await kv.set(`lead:${leadId}`, newLead);
    
    // Indexar por email para busca rápida
    if (newLead.primary_email) {
      await kv.set(`lead:email:${newLead.primary_email}`, leadId);
    }
    
    // Indexar por LinkedIn
    if (newLead.linkedin_url) {
      await kv.set(`lead:linkedin:${this.cleanLinkedInUrl(newLead.linkedin_url)}`, leadId);
    }
    
    // Adicionar ao índice global
    await this.addToGlobalIndex(leadId);
    
    console.log(`✅ Lead criado: ${leadId}`);
    
    return newLead;
  }
  
  /**
   * Fazer merge inteligente de dados de lead existente com novos dados
   */
  private async mergeLead(
    existingLead: LeadRecord,
    newData: Partial<LeadRecord>,
    userId: string,
    userEmail: string
  ): Promise<LeadRecord> {
    console.log(`🔄 Fazendo merge de lead: ${existingLead.id}`);
    
    const now = new Date().toISOString();
    const changes: Record<string, { old: any; new: any }> = {};
    const fieldsUpdated: string[] = [];
    
    // Merge de campos simples (prioriza dados mais recentes ou completos)
    const mergedLead: LeadRecord = { ...existingLead };
    
    // Nome - prioriza mais completo
    if (newData.full_name && newData.full_name.length > (existingLead.full_name?.length || 0)) {
      changes.full_name = { old: existingLead.full_name, new: newData.full_name };
      fieldsUpdated.push('full_name');
      mergedLead.full_name = newData.full_name;
    }
    
    // Emails - merge sem duplicatas
    if (newData.emails && newData.emails.length > 0) {
      const existingEmails = new Set(existingLead.emails.map(e => e.address.toLowerCase()));
      const newEmails = newData.emails.filter(e => !existingEmails.has(e.address.toLowerCase()));
      if (newEmails.length > 0) {
        mergedLead.emails = [...existingLead.emails, ...newEmails];
        fieldsUpdated.push('emails');
      }
    }
    
    // Telefones - merge sem duplicatas
    if (newData.phones && newData.phones.length > 0) {
      const existingPhones = new Set(existingLead.phones.map(p => p.number));
      const newPhones = newData.phones.filter(p => !existingPhones.has(p.number));
      if (newPhones.length > 0) {
        mergedLead.phones = [...existingLead.phones, ...newPhones];
        fieldsUpdated.push('phones');
      }
    }
    
    // Social Media - atualiza se novo dado disponível
    if (newData.linkedin_url && !existingLead.linkedin_url) {
      mergedLead.linkedin_url = newData.linkedin_url;
      fieldsUpdated.push('linkedin_url');
    }
    
    // Empresa atual - SEMPRE atualiza (pode ter mudado de emprego)
    if (newData.current_company && newData.current_company !== existingLead.current_company) {
      changes.current_company = { old: existingLead.current_company, new: newData.current_company };
      changes.current_title = { old: existingLead.current_title, new: newData.current_title };
      
      mergedLead.current_company = newData.current_company;
      mergedLead.current_title = newData.current_title;
      
      fieldsUpdated.push('current_company', 'current_title');
      
      // Adicionar experiência anterior ao histórico se mudou de empresa
      if (existingLead.current_company) {
        const previousJob: ExperienceRecord = {
          title: existingLead.current_title || '',
          company: existingLead.current_company,
          start_date: existingLead.start_date_current_job,
          end_date: now,
          is_current: false,
          source: 'auto-detected',
        };
        mergedLead.experience_history = [previousJob, ...existingLead.experience_history];
      }
    }
    
    // Dados da empresa - atualiza se mais recente
    if (newData.company_data) {
      mergedLead.company_data = {
        ...existingLead.company_data,
        ...newData.company_data,
        last_updated: now,
      } as CompanyData;
      fieldsUpdated.push('company_data');
    }
    
    // Skills - merge sem duplicatas
    if (newData.skills && newData.skills.length > 0) {
      const existingSkills = new Set(existingLead.skills.map(s => s.toLowerCase()));
      const newSkills = newData.skills.filter(s => !existingSkills.has(s.toLowerCase()));
      if (newSkills.length > 0) {
        mergedLead.skills = [...existingLead.skills, ...newSkills];
        fieldsUpdated.push('skills');
      }
    }
    
    // Sources - adiciona novas fontes
    if (newData.sources && newData.sources.length > 0) {
      const existingSources = new Set(existingLead.sources.map(s => s.api));
      const newSources = newData.sources.filter(s => !existingSources.has(s.api));
      mergedLead.sources = [...existingLead.sources, ...newSources];
      mergedLead.total_sources = mergedLead.sources.length;
      if (newSources.length > 0) {
        fieldsUpdated.push('sources');
      }
    }
    
    // Recalcular scores
    mergedLead.data_quality_score = this.calculateDataQuality(mergedLead);
    mergedLead.confidence_score = this.calculateConfidence(mergedLead);
    
    // Adicionar registro de atualização
    const updateRecord: UpdateRecord = {
      timestamp: now,
      updated_by: userEmail,
      source: newData.found_via || 'api',
      fields_updated: fieldsUpdated,
      changes,
    };
    
    mergedLead.update_history = [updateRecord, ...existingLead.update_history];
    mergedLead.total_updates = existingLead.total_updates + 1;
    mergedLead.updated_at = now;
    mergedLead.last_enriched_at = now;
    
    // Salvar
    await kv.set(`lead:${existingLead.id}`, mergedLead);
    
    console.log(`✅ Lead atualizado: ${fieldsUpdated.length} campos modificados`);
    
    return mergedLead;
  }
  
  /**
   * Buscar lead por ID
   */
  async getLeadById(leadId: string): Promise<LeadRecord | null> {
    const lead = await kv.get(`lead:${leadId}`);
    return lead as LeadRecord | null;
  }
  
  /**
   * Buscar lead por email
   */
  async getLeadByEmail(email: string): Promise<LeadRecord | null> {
    const leadId = await kv.get(`lead:email:${email}`);
    if (!leadId) return null;
    return this.getLeadById(leadId as string);
  }
  
  /**
   * Buscar lead por LinkedIn
   */
  async getLeadByLinkedIn(linkedinUrl: string): Promise<LeadRecord | null> {
    const cleanUrl = this.cleanLinkedInUrl(linkedinUrl);
    const leadId = await kv.get(`lead:linkedin:${cleanUrl}`);
    if (!leadId) return null;
    return this.getLeadById(leadId as string);
  }
  
  /**
   * Listar todos os leads
   */
  async getAllLeads(limit = 1000): Promise<LeadRecord[]> {
    const leadIds = await this.getGlobalIndex();
    const leads: LeadRecord[] = [];
    
    for (let i = 0; i < Math.min(leadIds.length, limit); i++) {
      const lead = await this.getLeadById(leadIds[i]);
      if (lead) leads.push(lead);
    }
    
    return leads;
  }
  
  /**
   * Buscar leads com filtros
   */
  async searchLeads(filters: {
    company?: string;
    title?: string;
    location?: string;
    status?: string;
    tags?: string[];
    minScore?: number;
  }): Promise<LeadRecord[]> {
    const allLeads = await this.getAllLeads();
    
    return allLeads.filter(lead => {
      if (filters.company && !lead.current_company?.toLowerCase().includes(filters.company.toLowerCase())) {
        return false;
      }
      if (filters.title && !lead.current_title?.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }
      if (filters.location && !`${lead.city} ${lead.country}`.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.status && lead.status !== filters.status) {
        return false;
      }
      if (filters.tags && filters.tags.length > 0 && !filters.tags.some(tag => lead.tags.includes(tag))) {
        return false;
      }
      if (filters.minScore && lead.confidence_score < filters.minScore) {
        return false;
      }
      return true;
    });
  }
  
  /**
   * Obter estatísticas do banco de dados
   */
  async getStats(): Promise<{
    total_leads: number;
    total_companies: number;
    avg_quality_score: number;
    avg_confidence_score: number;
    leads_by_status: Record<string, number>;
    leads_by_country: Record<string, number>;
    top_companies: Array<{ name: string; count: number }>;
    top_sources: Array<{ name: string; count: number }>;
    recent_updates: number;
  }> {
    const leads = await this.getAllLeads();
    
    const stats = {
      total_leads: leads.length,
      total_companies: new Set(leads.map(l => l.current_company).filter(Boolean)).size,
      avg_quality_score: Math.round(leads.reduce((sum, l) => sum + l.data_quality_score, 0) / leads.length),
      avg_confidence_score: Math.round(leads.reduce((sum, l) => sum + l.confidence_score, 0) / leads.length),
      leads_by_status: {} as Record<string, number>,
      leads_by_country: {} as Record<string, number>,
      top_companies: [] as Array<{ name: string; count: number }>,
      top_sources: [] as Array<{ name: string; count: number }>,
      recent_updates: 0,
    };
    
    // Por status
    leads.forEach(lead => {
      stats.leads_by_status[lead.status] = (stats.leads_by_status[lead.status] || 0) + 1;
    });
    
    // Por país
    leads.forEach(lead => {
      if (lead.country) {
        stats.leads_by_country[lead.country] = (stats.leads_by_country[lead.country] || 0) + 1;
      }
    });
    
    // Top empresas
    const companyCounts: Record<string, number> = {};
    leads.forEach(lead => {
      if (lead.current_company) {
        companyCounts[lead.current_company] = (companyCounts[lead.current_company] || 0) + 1;
      }
    });
    stats.top_companies = Object.entries(companyCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Atualizações recentes (últimas 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    stats.recent_updates = leads.filter(l => l.updated_at > oneDayAgo).length;
    
    return stats;
  }
  
  /**
   * Helpers
   */
  
  private generateLeadId(leadData: Partial<LeadRecord>): string {
    // Prioridade: email > linkedin > nome
    if (leadData.primary_email) {
      return `email_${leadData.primary_email.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    }
    if (leadData.linkedin_url) {
      return `linkedin_${this.cleanLinkedInUrl(leadData.linkedin_url)}`;
    }
    if (leadData.full_name) {
      return `name_${leadData.full_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    }
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private cleanLinkedInUrl(url: string): string {
    // Extrair ID público do LinkedIn
    const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
    return match ? match[1] : url;
  }
  
  private calculateDataQuality(leadData: Partial<LeadRecord>): number {
    const fields = [
      leadData.full_name,
      leadData.primary_email,
      leadData.primary_phone,
      leadData.linkedin_url,
      leadData.current_title,
      leadData.current_company,
      leadData.city,
      leadData.country,
      leadData.photo_url,
      leadData.headline,
    ];
    
    const filledFields = fields.filter(f => f && f !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }
  
  private calculateConfidence(leadData: Partial<LeadRecord>): number {
    let score = 50; // Base
    
    // Múltiplas fontes aumentam confiança
    const sources = leadData.sources?.length || 0;
    score += Math.min(30, sources * 10);
    
    // Email verificado
    if (leadData.email_verified) score += 10;
    
    // LinkedIn presente
    if (leadData.linkedin_url) score += 10;
    
    return Math.min(100, score);
  }
  
  private async addToGlobalIndex(leadId: string): Promise<void> {
    const index = await this.getGlobalIndex();
    if (!index.includes(leadId)) {
      index.push(leadId);
      await kv.set('leads:global_index', index);
    }
  }
  
  private async getGlobalIndex(): Promise<string[]> {
    const index = await kv.get('leads:global_index');
    return (index as string[]) || [];
  }
}

export const leadsDB = new LeadsDatabase();
