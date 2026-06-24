import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Trash2,
  LogIn,
  X,
  Server
} from 'lucide-react';
import { localAuthService } from '../lib/local-auth-service';
import { toast } from 'sonner';

interface DiagnosticsPanelProps {
  onForceLogin: (user: any) => void;
  currentView: string;
  user: any;
}

export function DiagnosticsPanel({ onForceLogin, currentView, user }: DiagnosticsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checks, setChecks] = useState<any[]>([]);
  const [isFixing, setIsFixing] = useState(false);

  const runDiagnostics = async () => {
    const newChecks = [];

    // 1. Verificar LocalStorage
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'ok');
      const val = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (val === 'ok') {
        newChecks.push({ name: 'LocalStorage', status: 'ok', msg: 'Funcionando corretamente' });
      } else {
        newChecks.push({ name: 'LocalStorage', status: 'error', msg: 'Falha na leitura/escrita' });
      }
    } catch (e) {
      newChecks.push({ name: 'LocalStorage', status: 'error', msg: 'Bloqueado ou indisponível' });
    }

    // 2. Verificar Sessão Salva
    const session = await localAuthService.getSession();
    if (session) {
      newChecks.push({ name: 'Sessão Salva', status: 'info', msg: `Encontrada: ${session.email}` });
    } else {
      newChecks.push({ name: 'Sessão Salva', status: 'warning', msg: 'Nenhuma sessão ativa' });
    }

    // 3. Verificar Estado do App
    newChecks.push({ name: 'Estado da View', status: 'info', msg: `Atual: ${currentView}` });
    newChecks.push({ name: 'Usuário no State', status: user ? 'ok' : 'warning', msg: user ? user.email : 'Nenhum' });

    setChecks(newChecks);
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen, currentView, user]);

  const handleFactoryReset = () => {
    if (confirm('Tem certeza? Isso apagará todos os dados locais e deslogará você.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleForceLogin = async () => {
    setIsFixing(true);
    
    // 1. Limpar sessão antiga para evitar conflitos
    await localAuthService.logout();
    
    // 2. Criar usuário admin fresco
    const adminUser = {
      id: 'admin-force-' + Date.now(),
      name: 'Admin Forçado',
      email: 'admin@imobhunter.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    // 3. Injetar login
    try {
      // Salvar sessão "na marra"
      const session = {
        user: adminUser,
        token: 'force-token',
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 // 24h
      };
      localStorage.setItem('imobhunter_session', JSON.stringify(session));
      
      // Chamar handler do App
      onForceLogin(adminUser);
      
      toast.success('🔓 Acesso liberado! Redirecionando...');
      setIsOpen(false);
    } catch (e) {
      toast.error('Erro ao forçar login: ' + e);
    } finally {
      setIsFixing(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-[9999]">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2 group"
          title="Abrir Diagnóstico de Emergência"
        >
          <Activity className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Diagnóstico
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <Activity className="w-5 h-5" />
            <h3>Diagnóstico de Sistema</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Checks */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Verificações</h4>
            {checks.map((check, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm font-medium text-gray-700">{check.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{check.msg}</span>
                  {check.status === 'ok' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {check.status === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {check.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {check.status === 'info' && <Activity className="w-4 h-4 text-blue-500" />}
                </div>
              </div>
            ))}
          </div>

          {/* Ações de Correção */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ações de Recuperação</h4>
            
            <button
              onClick={handleForceLogin}
              disabled={isFixing}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              {isFixing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
              FORÇAR ENTRADA (BYPASS)
            </button>
            <p className="text-xs text-center text-gray-500">
              Isso cria uma sessão administrativa válida e força a renderização do Dashboard.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={runDiagnostics}
                className="flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Re-testar
              </button>
              
              <button
                onClick={handleFactoryReset}
                className="flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors border border-red-100"
              >
                <Trash2 className="w-4 h-4" />
                Resetar Dados
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 text-center text-[10px] text-gray-400 border-t border-gray-100">
          ImobHunter Debug System v1.0
        </div>
      </div>
    </div>
  );
}
