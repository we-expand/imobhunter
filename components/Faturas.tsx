import { useState, useEffect } from 'react';
import { Search, Download, Eye, Send, CheckCircle, Clock, XCircle, Loader, Mail, Sparkles, Trash2, Euro, TrendingUp, History } from 'lucide-react';
import { Page } from '../App';
import { supabase, type Fatura as FaturaType } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { PaymentProgress } from './PaymentProgress';
import { RegistrarPagamentoParcial } from './RegistrarPagamentoParcial';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface FaturasProps {
  onNavigate: (page: Page) => void;
}

export function Faturas({ onNavigate }: FaturasProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [faturas, setFaturas] = useState<FaturaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiEmailEnabled, setAiEmailEnabled] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<FaturaType | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    loadFaturas();
    loadAiConfig();
  }, []);

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
          setAiEmailEnabled(data.config.emailEnabled || false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de IA:', error);
    }
  };

  const loadFaturas = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('Sem sessão ativa');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/faturas`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar faturas');
      }

      const data = await response.json();
      const faturasComDefaults = (data.faturas || []).map((f: any) => ({
        ...f,
        valorPago: f.valorPago || 0,
        valorRestante: f.valorRestante !== undefined ? f.valorRestante : f.valor,
        pagamentosParciais: f.pagamentosParciais || []
      }));
      
      setFaturas(faturasComDefaults);
    } catch (error) {
      console.error('Erro ao carregar faturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'paid' | 'pending' | 'overdue' | 'partial') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      const fatura = faturas.find(f => f.id === id);
      if (!fatura) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/faturas/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...fatura, status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao atualizar fatura');
      }

      toast.success('Estado atualizado com sucesso!');
      await loadFaturas();
    } catch (error) {
      console.error('Erro ao atualizar fatura:', error);
      toast.error('Erro ao atualizar fatura');
    }
  };

  const handleDelete = async (id: string, numero: string) => {
    if (!confirm(`Tem certeza que deseja excluir a fatura ${numero}?`)) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/faturas/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao excluir fatura');
      }

      toast.success('Fatura excluída com sucesso!');
      await loadFaturas();
    } catch (error) {
      console.error('Erro ao excluir fatura:', error);
      toast.error('Erro ao excluir fatura');
    }
  };

  const handlePaymentSuccess = (faturaAtualizada: FaturaType) => {
    setFaturas(prevFaturas => 
      prevFaturas.map(f => f.id === faturaAtualizada.id ? faturaAtualizada : f)
    );
    setShowPaymentModal(false);
    setSelectedFatura(null);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paga';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Vencida';
      case 'partial': return 'Parcial';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'partial': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <XCircle className="w-4 h-4" />;
      case 'partial': return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatCurrency = (value: number) => {
    return `${value.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  };

  const filteredFaturas = faturas.filter(fatura => {
    const matchesSearch = fatura.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fatura.cliente_nome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || fatura.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: faturas.length,
    pagas: faturas.filter(f => f.status === 'paid').length,
    pendentes: faturas.filter(f => f.status === 'pending').length,
    vencidas: faturas.filter(f => f.status === 'overdue').length,
    parciais: faturas.filter(f => f.status === 'partial').length,
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
          <h1 className="text-gray-800 mb-2">Faturas</h1>
          <p className="text-gray-600">Gerencie todas as suas faturas ({faturas.length} total)</p>
        </div>
        
        <button
          onClick={() => onNavigate('criar-fatura')}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
        >
          Criar Nova Fatura
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600 mb-1">Pagas</p>
          <p className="font-bold text-emerald-900">{stats.pagas}</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600 mb-1">Pendentes</p>
          <p className="font-bold text-blue-900">{stats.pendentes}</p>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-600 mb-1">Parciais</p>
          <p className="font-bold text-amber-900">{stats.parciais}</p>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-sm text-red-600 mb-1">Vencidas</p>
          <p className="font-bold text-red-900">{stats.vencidas}</p>
        </div>
      </div>

      {aiEmailEnabled && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-cyan-900 mb-1">IA para Emails Ativada</h3>
              <p className="text-cyan-800">
                Os emails de cobrança serão gerados automaticamente pela IA, personalizados para cada cliente e fatura.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por número ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Todos os Estados</option>
            <option value="paid">Pagas</option>
            <option value="pending">Pendentes</option>
            <option value="partial">Parciais</option>
            <option value="overdue">Vencidas</option>
          </select>
        </div>

        {filteredFaturas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Nenhuma fatura encontrada' 
                : 'Ainda não tem faturas. Crie a primeira!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaturas.map((fatura) => {
              const hasPartialPayment = fatura.valorPago > 0 && fatura.valorPago < fatura.valor;
              
              return (
                <div 
                  key={fatura.id} 
                  className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                    hasPartialPayment ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200'
                  }`}
                >
                  {/* Header da Fatura */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900 font-semibold">
                          Fatura {fatura.numero}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fatura.status)}`}>
                          {getStatusIcon(fatura.status)}
                          {getStatusLabel(fatura.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{fatura.cliente_nome || 'Cliente não especificado'}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Vencimento</p>
                      <p className="font-semibold text-gray-900">{formatDate(fatura.vencimento)}</p>
                    </div>
                  </div>

                  {/* Barra de Progresso de Pagamento */}
                  <div className="mb-4">
                    <PaymentProgress
                      valorTotal={fatura.valor}
                      valorPago={fatura.valorPago}
                      valorRestante={fatura.valorRestante}
                      status={fatura.status}
                      showLabel={true}
                      size="md"
                    />
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {fatura.status !== 'paid' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedFatura(fatura);
                          setShowPaymentModal(true);
                        }}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
                      >
                        <Euro className="w-4 h-4 mr-1" />
                        Registrar Pagamento
                      </Button>
                    )}

                    {(fatura.pagamentosParciais?.length || 0) > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedFatura(fatura);
                          setShowHistoryModal(true);
                        }}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <History className="w-4 h-4 mr-1" />
                        Ver Histórico ({fatura.pagamentosParciais.length})
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(fatura.id, 'paid')}
                      disabled={fatura.status === 'paid'}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marcar como Paga
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(fatura.id, fatura.numero)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Pagamento Parcial */}
      {showPaymentModal && selectedFatura && (
        <RegistrarPagamentoParcial
          fatura={selectedFatura}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedFatura(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Modal de Histórico */}
      {showHistoryModal && selectedFatura && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Histórico de Pagamentos</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowHistoryModal(false);
                  setSelectedFatura(null);
                }}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-3">
              {selectedFatura.pagamentosParciais.map((pagamento) => (
                <div key={pagamento.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-emerald-700">{formatCurrency(pagamento.valor)}</p>
                      <p className="text-sm text-gray-600">{formatDate(pagamento.data)}</p>
                      {pagamento.descricao && (
                        <p className="text-sm text-gray-500 mt-1">{pagamento.descricao}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{pagamento.metodo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
