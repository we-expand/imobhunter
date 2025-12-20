import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Pause, Play, Loader, MessageCircle, Sparkles, Mail } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface Cadencia {
  id: string;
  nome: string;
  cliente_id: string;
  cliente_nome?: string;
  valor: number;
  frequencia: 'semanal' | 'mensal' | 'trimestral' | 'semestral' | 'anual';
  proximaEmissao: string;
  ativo: boolean;
  descricao: string;
  created_at?: string;
  user_id?: string;
}

interface Cliente {
  id: string;
  nome: string;
}

export function CadenciaAutomatica() {
  const [showModal, setShowModal] = useState(false);
  const [cadencias, setCadencias] = useState<Cadencia[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCadencia, setEditingCadencia] = useState<Cadencia | null>(null);
  const [aiConfig, setAiConfig] = useState({ emailEnabled: false, whatsappEnabled: false });
  const [formData, setFormData] = useState({
    nome: '',
    cliente_id: '',
    valor: '',
    frequencia: 'mensal' as 'semanal' | 'mensal' | 'trimestral' | 'semestral' | 'anual',
    proximaEmissao: '',
    descricao: '',
    ativo: true,
  });

  useEffect(() => {
    loadData();
    loadAiConfig();
  }, []);

  const loadData = async () => {
    await Promise.all([loadCadencias(), loadClientes()]);
  };

  const loadAiConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/ai-config`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setAiConfig({
            emailEnabled: data.config.emailEnabled || false,
            whatsappEnabled: data.config.whatsappEnabled || false,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de IA:', error);
    }
  };

  const loadCadencias = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('Sem sessão ativa');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/cadencias`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar cadências');
      }

      const data = await response.json();
      setCadencias(data.cadencias || []);
    } catch (error) {
      console.error('Erro ao carregar cadências:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setClientes(data.clientes || []);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const cliente = clientes.find(c => c.id === formData.cliente_id);
      const cadenciaData = {
        ...formData,
        cliente_nome: cliente?.nome,
        valor: parseFloat(formData.valor),
      };

      const url = editingCadencia
        ? `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/cadencias/${editingCadencia.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/cadencias`;

      const response = await fetch(url, {
        method: editingCadencia ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cadenciaData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao ${editingCadencia ? 'atualizar' : 'criar'} cadência`);
      }

      await loadCadencias();
      setShowModal(false);
      setEditingCadencia(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar cadência:', error);
      alert('Erro ao salvar cadência');
    }
  };

  const handleToggleAtivo = async (cadencia: Cadencia) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/cadencias/${cadencia.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...cadencia, ativo: !cadencia.ativo }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar cadência');
      }

      await loadCadencias();
    } catch (error) {
      console.error('Erro ao atualizar cadência:', error);
      alert('Erro ao atualizar cadência');
    }
  };

  const handleEdit = (cadencia: Cadencia) => {
    setEditingCadencia(cadencia);
    setFormData({
      nome: cadencia.nome,
      cliente_id: cadencia.cliente_id,
      valor: cadencia.valor.toString(),
      frequencia: cadencia.frequencia,
      proximaEmissao: cadencia.proximaEmissao,
      descricao: cadencia.descricao,
      ativo: cadencia.ativo,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta cadência?')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/cadencias/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao eliminar cadência');
      }

      await loadCadencias();
    } catch (error) {
      console.error('Erro ao eliminar cadência:', error);
      alert('Erro ao eliminar cadência');
    }
  };

  const handleSendWhatsapp = async (cadenciaId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/whatsapp-send-cadencia`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cadenciaId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Lembrete enviado por WhatsApp com sucesso!');
      } else {
        alert(data.error || 'Erro ao enviar mensagem. Verifique a configuração do WhatsApp.');
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      alert('Erro ao enviar mensagem por WhatsApp');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cliente_id: '',
      valor: '',
      frequencia: 'mensal',
      proximaEmissao: '',
      descricao: '',
      ativo: true,
    });
  };

  const formatCurrency = (value: number) => {
    return `${value.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  };

  const getFrequenciaLabel = (freq: string) => {
    const labels: Record<string, string> = {
      semanal: 'Semanal',
      mensal: 'Mensal',
      trimestral: 'Trimestral',
      semestral: 'Semestral',
      anual: 'Anual',
    };
    return labels[freq] || freq;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 mb-2">Cadência Automática</h1>
          <p className="text-gray-600">Configure faturas recorrentes automáticas ({cadencias.length} total)</p>
        </div>
        
        <button
          onClick={() => {
            setEditingCadencia(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Cadência
        </button>
      </div>

      {/* Banner de IA */}
      {(aiConfig.emailEnabled || aiConfig.whatsappEnabled) && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-cyan-900 mb-1">Inteligência Artificial Ativa</h3>
              <p className="text-cyan-800">
                As mensagens de cobrança serão geradas automaticamente por IA, personalizadas para cada cliente.
                {aiConfig.emailEnabled && <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-cyan-100 rounded-full"><Mail className="w-3 h-3" /> Email</span>}
                {aiConfig.whatsappEnabled && <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-green-100 rounded-full"><MessageCircle className="w-3 h-3" /> WhatsApp</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {cadencias.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Ainda não tem cadências automáticas. Crie a primeira!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cadencias.map((cadencia) => (
              <div key={cadencia.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-800">{cadencia.nome}</h3>
                      <span className={`px-3 py-1 rounded-full ${
                        cadencia.ativo 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {cadencia.ativo ? 'Ativo' : 'Pausado'}
                      </span>
                    </div>
                    <p className="text-gray-600">{cadencia.cliente_nome || 'Cliente não encontrado'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendWhatsapp(cadencia.id)}
                      className="relative p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title={aiConfig.whatsappEnabled ? "Enviar lembrete por WhatsApp (com IA)" : "Enviar lembrete por WhatsApp"}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {aiConfig.whatsappEnabled && (
                        <Sparkles className="w-3 h-3 text-cyan-500 absolute -top-1 -right-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleAtivo(cadencia)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title={cadencia.ativo ? 'Pausar' : 'Ativar'}
                    >
                      {cadencia.ativo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(cadencia)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cadencia.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">Valor</p>
                    <p className="text-gray-800">{formatCurrency(cadencia.valor)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Frequência</p>
                    <p className="text-gray-800">{getFrequenciaLabel(cadencia.frequencia)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Próxima Emissão</p>
                    <p className="text-gray-800">{formatDate(cadencia.proximaEmissao)}</p>
                  </div>
                </div>

                {cadencia.descricao && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-gray-600">{cadencia.descricao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-gray-800 mb-6">
              {editingCadencia ? 'Editar Cadência Automática' : 'Nova Cadência Automática'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nome da Cadência</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex: Manutenção Mensal - Cliente X"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Cliente</label>
                <select
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Valor (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0,00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Frequência</label>
                  <select
                    value={formData.frequencia}
                    onChange={(e) => setFormData({ ...formData, frequencia: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Próxima Emissão</label>
                <input
                  type="date"
                  value={formData.proximaEmissao}
                  onChange={(e) => setFormData({ ...formData, proximaEmissao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Descrição</label>
                <textarea
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Descreva os serviços/produtos desta cadência..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="ativo" className="text-gray-700">
                  Ativar cadência imediatamente
                </label>
              </div>
              
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCadencia(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  {editingCadencia ? 'Atualizar Cadência' : 'Criar Cadência'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
