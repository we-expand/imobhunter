import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para o banco de dados
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise' | 'vip';
  status: 'active' | 'inactive' | 'online';
  last_login: string | null;
  total_leads: number;
  messages_sent: number;
  created_at: string;
  mrr: number;
  
  // 📊 Métricas de Engajamento
  session_duration?: number; // Tempo de permanência em segundos
  total_sessions?: number; // Número total de sessões
  avg_session_duration?: number; // Média de tempo por sessão
  last_feature_used?: string; // Última feature usada
  features_used?: string[]; // Lista de features utilizadas
  pages_visited?: string[]; // Páginas visitadas nesta sessão
  leads_created_today?: number; // Leads criados hoje
  messages_sent_today?: number; // Mensagens enviadas hoje
  last_activity?: string; // Timestamp da última atividade
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  cluster: string;
  status: string;
  temperature: string;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  lead_id: string;
  channel: 'email' | 'sms' | 'whatsapp';
  content: string;
  status: string;
  sent_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  type: string;
  created_at: string;
}

export interface PlatformMetrics {
  total_users: number;
  active_users: number;
  online_now: number;
  total_revenue: number;
  mrr: number;
  total_leads: number;
  messages_sent: number;
  api_calls: number;
  storage_used: number;
  uptime: number;
}