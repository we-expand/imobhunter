// Tipos do sistema de Lead Generation

export type LeadStatus = 'cold' | 'in-conversation' | 'hot' | 'handover';
export type Channel = 'email' | 'whatsapp' | 'linkedin' | 'sms';

export interface Lead {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  email?: string;
  phone?: string;
  cluster: string;
  status: LeadStatus;
  score: number;
  lastContact: string;
  channel: Channel;
  profileUrl?: string;
  location?: string;
  conversationSummary?: string;
  enrichmentData?: {
    apolloId?: string;
    seniority?: string;
    departments?: string[];
    headline?: string;
    photoUrl?: string;
    companyWebsite?: string;
    companyLinkedin?: string;
    employeeCount?: number;
  };
}

export interface Activity {
  id: string;
  timestamp: string;
  action: string;
  leadName: string;
  cluster: string;
  channel: Channel;
  status: 'success' | 'pending' | 'failed';
}

export interface ClusterConfig {
  id: string;
  name: string;
  active: boolean;
  jobTitles: string[];
  keywords: string[];
  locations: string[];
  sources: string[];
  blacklist: string[];
}

export interface KPI {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
}

export interface Cadence {
  id: string;
  name: string;
  steps: CadenceStep[];
  active: boolean;
}

export interface CadenceStep {
  id: string;
  day: number;
  channel: Channel;
  action: string;
  template?: string;
}