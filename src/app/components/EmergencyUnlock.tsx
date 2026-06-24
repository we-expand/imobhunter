import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';

// ⚠️ ATENÇÃO: Esta chave dá acesso total. Remova este arquivo antes de ir para produção.
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3OTU3MCwiZXhwIjoyMDgxNTU1NTcwfQ.NRxdwErN6MlaaMINbnnSui4XNm14xBRNfW5WS5SCH10';
const PROJECT_URL = 'https://evdyqlrssgsktctjruuq.supabase.co';

export function EmergencyUnlock() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Cria cliente Admin temporário
      const adminSupabase = createClient(PROJECT_URL, SERVICE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      // 1. Buscar usuário
      const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers();
      
      if (listError) throw listError;

      const user = users.find(u => u.email === email);

      if (!user) {
        toast.error('Usuário não encontrado com este email');
        setIsLoading(false);
        return;
      }

      // 2. Forçar confirmação
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
        user.id,
        { email_confirmed_at: new Date().toISOString() }
      );

      if (updateError) throw updateError;

      toast.success('✅ Conta desbloqueada! Tente logar agora.');
      setIsOpen(false);
      setEmail('');

    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao desbloquear: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-4 text-xs text-gray-400 hover:text-red-500 underline flex items-center justify-center gap-1 w-full transition-colors"
      >
        <AlertTriangle className="w-3 h-3" />
        Problemas com email não confirmado?
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-2">
      <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        Desbloqueio Administrativo
      </h3>
      <p className="text-xs text-red-600 mb-3">
        Use isso se não conseguir acessar seu email para confirmar a conta.
      </p>
      
      <form onSubmit={handleUnlock} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o email bloqueado"
          className="w-full px-3 py-2 text-sm border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          required
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirmar Conta'}
          </button>
        </div>
      </form>
    </div>
  );
}
