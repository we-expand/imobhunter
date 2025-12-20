import { createClient } from '@supabase/supabase-js';
import { publicAnonKey } from './info';

// Configuração conforme solicitado
const supabaseUrl = 'https://fhrttpiyqjyncabajreq.supabase.co';
// Nota: Utilizamos publicAnonKey de info.tsx que contém a chave correta para este ambiente
const supabaseKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Cliente = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  nif: string;
  morada: string;
  created_at: string;
  user_id: string;
};

export type PagamentoParcial = {
  id: string;
  valor: number;
  data: string;
  metodo: 'transferencia' | 'mbway' | 'multibanco' | 'dinheiro' | 'outro';
  descricao?: string;
  comprovativo?: string;
};

export type Fatura = {
  id: string;
  numero: string;
  cliente_id: string;
  cliente_nome?: string;
  data: string;
  vencimento: string;
  valor: number;
  valorPago: number;
  valorRestante: number;
  subtotal: number;
  iva: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  items: FaturaItem[];
  pagamentosParciais: PagamentoParcial[];
  created_at: string;
  user_id: string;
};

export type FaturaItem = {
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  iva: number;
};

export type Cadencia = {
  id: string;
  nome: string;
  cliente_id: string;
  cliente_nome?: string;
  valor: number;
  frequencia: 'semanal' | 'mensal' | 'trimestral' | 'semestral' | 'anual';
  proximaEmissao: string;
  ativo: boolean;
  descricao: string;
  created_at: string;
  user_id: string;
};