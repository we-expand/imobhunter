import React, { useState, useEffect } from 'react';
import { createClient } from '';
import { toast } from 'sonner';
import { Shield, UserPlus, Users, Key, RefreshCw, Check, X } from 'lucide-react';

// ⚠️ CHAVE MESTRA (Service Role)
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZHlxbHJzc2dza3RjdGpydXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk3OTU3MCwiZXhwIjoyMDgxNTU1NTcwfQ.NRxdwErN6MlaaMINbnnSui4XNm14xBRNfW5WS5SCH10';
const PROJECT_URL = 'https://evdyqlrssgsktctjruuq.supabase.co';

export function SupabaseAdminTools({ forceOpen = false }: { forceOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'debug' | 'email'>('list');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  // Form states
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Admin Client
  const adminClient = createClient(PROJECT_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const [lastError, setLastError] = useState<string | null>(null);

  const clearLocalCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Cache local limpo! Tente logar novamente.');
    window.location.reload();
  };

  const resetUserPassword = async (userId: string) => {
    const pass = prompt('Digite a nova senha para este usuário:');
    if (!pass) return;
    
    try {
      const { error } = await adminClient.auth.admin.updateUserById(userId, {
        password: pass
      });
      if (error) throw error;
      toast.success('Senha atualizada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao mudar senha: ' + err.message);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (error) throw error;
      // Ordenar por criado mais recente
      const sorted = data.users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setUsers(sorted);
    } catch (err: any) {
      toast.error('Erro ao listar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'list') {
      loadUsers();
    }
  }, [isOpen, activeTab]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLastError(null);
    try {
      // 1. Tenta deletar se já existir (para garantir limpeza)
      const { data: existing } = await adminClient.auth.admin.listUsers();
      const userExists = existing.users.find(u => u.email === newEmail);
      if (userExists) {
        await adminClient.auth.admin.deleteUser(userExists.id);
        toast.info('Usuário antigo removido para recriação limpa.');
      }

      // 2. Cria novo
      const { data, error } = await adminClient.auth.admin.createUser({
        email: newEmail,
        password: newPassword,
        email_confirm: true,
        user_metadata: { name: 'Admin User' }
      });

      if (error) throw error;

      // 3. REDUNDÂNCIA CRÍTICA
      if (!data.user.email_confirmed_at) {
         const { error: confirmError } = await adminClient.auth.admin.updateUserById(data.user.id, {
           email_confirmed_at: new Date().toISOString()
         });
         if (confirmError) throw confirmError;
         toast.info('Confirmação forçada aplicada com sucesso.');
      }

      toast.success(`Usuário ${data.user.email} CRIADO e CONFIRMADO! Pode logar.`);
      setNewEmail('');
      setNewPassword('');
      setActiveTab('list');
      await loadUsers(); 
    } catch (err: any) {
      const msg = err.message || JSON.stringify(err);
      setLastError(`Erro ao criar: ${msg}`);
      toast.error('Erro ao criar: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const generateMagicLink = async (email: string) => {
    setLoading(true);
    setLastError(null);
    try {
      console.log('Gerando Magic Link para:', email);
      const { data, error } = await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: window.location.origin // <--- Força voltar para a URL atual, não localhost:3000
        }
      });
      
      if (error) throw error;
      
      const link = data.properties?.action_link || data.properties?.email_otp || 'Link não gerado';
      
      // Copiar para área de transferência
      try {
        await navigator.clipboard.writeText(link);
        toast.success('Link copiado para a área de transferência!');
      } catch (e) {
        console.error('Falha ao copiar', e);
      }

      prompt('Copie este link e cole no navegador para entrar DIRETO (sem senha):', link);
      
    } catch (err: any) {
      console.error('Erro ao gerar link:', err);
      const msg = err.message || JSON.stringify(err);
      setLastError(`Erro ao gerar link: ${msg}`);
      toast.error('Falha: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const confirmUser = async (userId: string) => {
    setLoading(true);
    setLastError(null);
    try {
      console.log('Tentando confirmar usuário:', userId);
      const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
        email_confirmed_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      toast.success('✅ SUCESSO! Usuário confirmado. Pode logar.');
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao confirmar:', err);
      const msg = err.message || err.error_description || JSON.stringify(err);
      setLastError(`Erro ao confirmar: ${msg}`);
      toast.error('Falha: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if(!confirm('Tem certeza que deseja excluir este usuário?')) return;
    setLastError(null);
    try {
      const { error } = await adminClient.auth.admin.deleteUser(userId);
      if (error) throw error;
      toast.success('Usuário removido!');
      loadUsers();
    } catch (err: any) {
      const msg = err.message || JSON.stringify(err);
      setLastError(`Erro ao excluir: ${msg}`);
      toast.error('Erro: ' + msg);
    }
  };

  const nukeAllUsers = async () => {
    if (!confirm('PERIGO: ISSO VAI EXCLUIR TODOS OS USUÁRIOS DO SISTEMA.\n\nTem certeza absoluta?')) return;
    if (!confirm('Confirmação final: Digite SIM para continuar.')) return;
    
    setLoading(true);
    const log = (msg: string) => setDebugLog(prev => [...prev, msg]);
    
    try {
      const { data, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (error) throw error;
      
      log(`Encontrados ${data.users.length} usuários para excluir...`);
      
      for (const u of data.users) {
        log(`Excluindo ${u.email}...`);
        await adminClient.auth.admin.deleteUser(u.id);
      }
      
      log('✅ Todos os usuários foram excluídos.');
      toast.success('Banco de usuários limpo.');
      loadUsers();
    } catch (err: any) {
      log(`❌ Erro: ${err.message}`);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runDiagnostics = async () => {
    setDebugLog([]);
    const log = (msg: string) => setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
    
    log('Iniciando diagnóstico...');
    log(`URL: ${PROJECT_URL}`);
    
    try {
      log('Testando conexão Admin...');
      const { data: users, error: usersError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1 });
      if (usersError) throw usersError;
      log(`✅ Admin OK. Total usuários: ${users.total}`);
      
      log('Testando conexão Pública (Client)...');
      // Import dinâmico para evitar dependência circular se houver
      const { getSupabase } = await import('../utils/supabase/client');
      const publicClient = getSupabase();
      const { data: health, error: healthError } = await publicClient.from('health_check').select('*').limit(1).maybeSingle();
      
      // Nota: health_check pode não existir, mas o erro de conexão seria diferente de "tabela não existe"
      if (healthError && healthError.code !== '42P01') { // 42P01 = undefined_table
         log(`⚠️ Erro Client Público: ${healthError.message} (${healthError.code})`);
      } else {
         log('✅ Client Público conectado (mesmo que tabela não exista).');
      }

      log('Diagnóstico concluído.');
      log('ℹ️ NOTA: A persistência de sessão está DESATIVADA por segurança (persistSession: false).');
    } catch (err: any) {
      log(`❌ ERRO CRÍTICO: ${err.message}`);
    }
  };

  if (!isOpen) {
    return (
      <div className="mt-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2 w-full py-3 bg-indigo-50 rounded-md border border-indigo-100 transition-all hover:shadow-sm"
        >
          <Shield className="w-4 h-4" />
          Problemas de Login? Abra o Painel Admin
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          Use esta ferramenta se seu login estiver travado em "Verifique seu email".
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white border-2 border-indigo-600 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 relative z-50">
      <div className="bg-indigo-600 p-3 flex justify-between items-center text-white">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Shield className="w-4 h-4" /> Solução de Login
        </h3>
        <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-yellow-50 p-3 border-b border-yellow-100">
         {lastError && (
           <div className="mb-2 p-2 bg-red-100 border border-red-200 rounded text-red-800 text-xs font-mono break-all">
             <strong>Último Erro:</strong> {lastError}
           </div>
         )}
         <p className="text-xs text-yellow-800 font-bold mb-1">⚠️ Instrução Importante:</p>
         <p className="text-xs text-yellow-800">
           Se o seu usuário estiver <span className="bg-yellow-200 px-1 rounded">Pendente</span> e não confirmar:
         </p>
         <ol className="list-decimal pl-4 mt-1 text-xs text-yellow-900 font-medium space-y-1">
           <li>Clique em <span className="text-red-600 font-bold">Excluir</span> no usuário travado.</li>
           <li>Vá na aba <span className="text-indigo-600 font-bold">Criar Novo</span> acima.</li>
           <li>Crie a conta novamente (ela nascerá confirmada).</li>
         </ol>
      </div>

      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 text-xs font-medium ${activeTab === 'list' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Users className="w-3 h-3 inline mr-1" /> Usuários ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2 text-xs font-medium ${activeTab === 'create' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <UserPlus className="w-3 h-3 inline mr-1" /> Criar Novo
        </button>
        <button 
          onClick={() => setActiveTab('debug')}
          className={`flex-1 py-2 text-xs font-medium ${activeTab === 'debug' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <RefreshCw className="w-3 h-3 inline mr-1" /> Debug
        </button>
        <button 
          onClick={() => setActiveTab('email')}
          className={`flex-1 py-2 text-xs font-medium ${activeTab === 'email' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center justify-center gap-1"><span className="text-lg leading-none">✉️</span> Email</div>
        </button>
      </div>

      <div className="p-4 max-h-60 overflow-y-auto">
        {activeTab === 'debug' && (
          <div className="space-y-3">
             <button onClick={runDiagnostics} className="w-full bg-gray-800 text-white py-2 rounded text-xs">
               Rodar Diagnóstico
             </button>
             <div className="bg-black text-green-400 p-2 rounded text-[10px] font-mono h-32 overflow-y-auto">
               {debugLog.length === 0 ? 'Aguardando teste...' : debugLog.map((l, i) => <div key={i}>{l}</div>)}
             </div>

             <div className="pt-4 border-t border-gray-200 mt-4">
               <p className="text-[10px] text-red-600 font-bold mb-2">ZONA DE PERIGO</p>
               <button 
                 onClick={nukeAllUsers} 
                 className="w-full bg-red-100 text-red-700 border border-red-300 py-2 rounded text-xs font-bold hover:bg-red-200"
               >
                 ☢️ EXCLUIR TODOS OS USUÁRIOS
               </button>
             </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-3">
             <div className="text-xs text-gray-600 mb-2">
               Para que seus usuários recebam emails bonitos e "de verdade", configure este template no painel do Supabase:
               <ol className="list-decimal pl-4 mt-2 space-y-1 text-[10px]">
                 <li>Vá em <strong>Authentication</strong> &gt; <strong>Email Templates</strong></li>
                 <li>Selecione <strong>Confirm Your Signup</strong></li>
                 <li>Cole o código abaixo no editor HTML:</li>
               </ol>
             </div>
             
             <div className="relative">
               <textarea 
                 readOnly 
                 className="w-full h-32 p-2 text-[10px] font-mono bg-gray-50 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                 value={`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirme seu email - ImobHunter</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; color: white;">
      <h1 style="margin:0;">ImobHunter</h1>
    </div>
    <div style="padding: 30px; color: #333;">
      <h2 style="margin-top:0;">Bem-vindo ao futuro imobiliário!</h2>
      <p>Clique abaixo para confirmar sua conta:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Confirmar Conta</a>
      </div>
      <p style="font-size: 12px; color: #666;">Se não funcionar, copie: {{ .ConfirmationURL }}</p>
    </div>
  </div>
</body>
</html>`}
               />
               <button 
                 onClick={() => {
                   navigator.clipboard.writeText(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirme seu email - ImobHunter</title>
</head>
<body style="font-family: sans-serif; background-color: #f4f4f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px; text-align: center; color: white;">
      <h1 style="margin:0;">ImobHunter</h1>
    </div>
    <div style="padding: 30px; color: #333;">
      <h2 style="margin-top:0;">Bem-vindo ao futuro imobiliário!</h2>
      <p>Clique abaixo para confirmar sua conta:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{ .ConfirmationURL }}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Confirmar Conta</a>
      </div>
      <p style="font-size: 12px; color: #666;">Se não funcionar, copie: {{ .ConfirmationURL }}</p>
    </div>
  </div>
</body>
</html>`);
                   toast.success('Template copiado!');
                 }}
                 className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded shadow hover:bg-indigo-700"
               >
                 Copiar HTML
               </button>
             </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Lista do Supabase:</span>
              <button onClick={loadUsers} className="text-indigo-600 hover:underline text-xs flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Atualizar
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-4 text-gray-400 text-xs">Carregando...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-xs bg-gray-50 rounded">Nenhum usuário encontrado.</div>
            ) : (
              users.map(u => (
                <div key={u.id} className="p-2 bg-gray-50 rounded border border-gray-100 text-xs flex flex-col gap-1">
                  <div className="font-bold text-gray-700 truncate">{u.email}</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex flex-col">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] w-max ${u.email_confirmed_at ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {u.email_confirmed_at ? 'Confirmado' : 'Pendente'}
                      </span>
                      {!u.email_confirmed_at && (
                        <span className="text-[9px] text-red-500 mt-0.5">Travado? Use 'Criar Novo'</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => generateMagicLink(u.email)}
                        className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] hover:bg-indigo-700 shadow-sm"
                        title="Entrar sem senha"
                      >
                        🔑 Entrar Direto
                      </button>

                      {!u.email_confirmed_at && (
                        <button onClick={() => confirmUser(u.id)} className="text-green-600 hover:text-green-800 font-medium">Confirmar</button>
                      )}
                      <button onClick={() => resetUserPassword(u.id)} className="text-blue-600 hover:text-blue-800 font-medium" title="Trocar Senha">Senha</button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700">Excluir</button>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">{u.id}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <form onSubmit={handleCreateUser} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs"
                placeholder="novo@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="text" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded text-xs"
                placeholder="Senha forte"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded text-xs font-bold hover:bg-indigo-700 flex justify-center items-center gap-2"
            >
              {loading ? 'Criando...' : 'Criar Usuário Confirmado'}
            </button>
            <p className="text-[10px] text-gray-500 text-center">
              Esta conta já nascerá confirmada e pronta para logar.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
