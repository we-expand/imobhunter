export type LeadStatus = 'cold' | 'in-conversation' | 'hot' | 'handover';

export interface Lead {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  cluster: string;
  status: LeadStatus;
  score: number;
  lastContact: string;
  channel: 'linkedin' | 'email' | 'whatsapp';
  conversationSummary?: string;
  linkedinUrl?: string;
  phone?: string;
  email?: string;
}

export interface Activity {
  id: string;
  timestamp: string;
  action: string;
  leadName: string;
  cluster: string;
  channel: 'linkedin' | 'email' | 'whatsapp';
  status: 'success' | 'pending' | 'failed';
}

export interface KPI {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ClusterConfig {
  id: string;
  name: string;
  active: boolean;
  filters: {
    jobTitles?: string[];
    keywords?: string[];
    locations?: string[];
    companies?: string[];
    schools?: string[];
    experience?: string;
  };
}

export interface AIPersonality {
  tone: string;
  language: string;
  approachStyle: string;
}

export interface Cadence {
  step: number;
  channel: 'linkedin' | 'email' | 'whatsapp';
  waitDays: number;
  messageTemplate: string;
}