import { useState, useEffect } from 'react';
import { 
  Clock, AlertTriangle, Send, Phone, MessageCircle, CheckCircle, 
  Play, Loader, Calendar, ChevronRight, Mail, Bell, Settings, 
  Smartphone, Mic, FileText, Info, User, Sparkles, Edit2, Save,
  RefreshCw, X, Wand2, Check, ChevronLeft, Plus, Minus, ChevronDown, ChevronUp,
  Eye, Activity
} from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Cliente {
  id: string;
  nome: string;
  perfil?: 'risco' | 'confiavel' | 'novo';
}

interface Fatura {
  id: string;
  numero: string;
  cliente_id: string;
  cliente_nome?: string;
  data: string;
  vencimento: string;
  valor: number;
  status: 'paid' | 'pending' | 'overdue';
}

type Canal = 'email' | 'sms' | 'whatsapp' | 'voz' | 'carta';
type Momento = 'antes' | 'vencimento' | 'depois';

interface EtapaCobranca {
  id: string;
  momento: Momento;
  dias: number;
  canal: Canal;
  ativo: boolean;
  titulo: string;
  descricao: string;
}

interface MensagemPersonalizada {
  subject?: string;
  body: string;
}

interface AISuggestion {
  tone: 'formal' | 'empatico' | 'assertivo';
  label: string;
  content: MensagemPersonalizada;
}

const ETAPAS_PADRAO: EtapaCobranca[] = [
  { id: '1', momento: 'antes', dias: 5, canal: 'email', ativo: true, titulo: 'Lembrete Antecipado', descricao: 'Avisar sobre fatura disponível' },
  { id: '2', momento: 'antes', dias: 2, canal: 'sms', ativo: false, titulo: 'Lembrete Próximo', descricao: 'Lembrete curto via SMS' },
  { id: '3', momento: 'vencimento', dias: 0, canal: 'email', ativo: true, titulo: 'Dia do Vencimento', descricao: 'Aviso de vencimento hoje' },
  { id: '4', momento: 'vencimento', dias: 0, canal: 'whatsapp', ativo: true, titulo: 'Cobrança Digital', descricao: 'Link de pagamento via WhatsApp' },
  { id: '5', momento: 'depois', dias: 2, canal: 'email', ativo: true, titulo: 'Primeiro Aviso', descricao: 'Aviso amigável de atraso' },
  { id: '6', momento: 'depois', dias: 5, canal: 'whatsapp', ativo: true, titulo: 'Cobrança Ativa', descricao: 'Solicitação de previsão' },
  { id: '7', momento: 'depois', dias: 10, canal: 'sms', ativo: true, titulo: 'Aviso de Bloqueio', descricao: 'Alerta sobre suspensão' },
  { id: '8', momento: 'depois', dias: 15, canal: 'voz', ativo: false, titulo: 'Robô de Voz', descricao: 'Chamada automática de cobrança' },
  { id: '9', momento: 'depois', dias: 30, canal: 'carta', ativo: false, titulo: 'Carta Registada', descricao: 'Notificação extrajudicial' },
];

export function ReguaTempo() {
  const [loading, setLoading] = useState(true);
  const [etapas, setEtapas] = useState<EtapaCobranca[]>(ETAPAS_PADRAO);
  const [faturasVencidas, setFaturasVencidas] = useState<Fatura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [reguaAtiva, setReguaAtiva] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'devedores'>('config');
  
  // Estados para Modal de Edição
  const [previewEtapa, setPreviewEtapa] = useState<EtapaCobranca | null>(null);
  const [customMessages, setCustomMessages] = useState<Record<string, MensagemPersonalizada>>({});
  const [editingMessage, setEditingMessage] = useState<MensagemPersonalizada | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [nextExecution, setNextExecution] = useState(() => {
    const d = new Date();
    d.setHours(14, 0, 0, 0);
    return d;
  });
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [previousClienteId, setPreviousClienteId] = useState<string>('');

  useEffect(() => {
    loadDados();
    loadReguaConfig(); // Carregar configuração salva
  }, []);

  const loadDados = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const [faturasResponse, clientesResponse] = await Promise.all([
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/faturas`,
            { headers: { 'Authorization': `Bearer ${session.access_token}` } }
          ),
          fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes`,
            { headers: { 'Authorization': `Bearer ${session.access_token}` } }
          )
        ]);

        if (faturasResponse.ok) {
          const data = await faturasResponse.json();
          const faturas: Fatura[] = data.faturas || [];
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          
          const vencidas = faturas.filter(f => {
              if (f.status === 'paid') return false;
              if (f.status === 'overdue') return true;
              const dataVenc = new Date(f.vencimento);
              return dataVenc < hoje;
          });
          setFaturasVencidas(vencidas);
        }

        if (clientesResponse.ok) {
          const data = await clientesResponse.json();
          setClientes(data.clientes || []);
        }
      } catch (reqError) {
        console.error('Erro nas requisições:', reqError);
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReguaConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/regua-config`,
        { headers: { 'Authorization': `Bearer ${session.access_token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setEtapas(data.config.etapas || ETAPAS_PADRAO);
          setCustomMessages(data.config.customMessages || {});
          setNextExecution(new Date(data.config.nextExecution || Date.now()));
          setReguaAtiva(data.config.ativa || false);
          setSelectedClienteId(data.config.selectedClienteId || '');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração da régua:', error);
    }
  };

  const saveReguaConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      // Buscar dados do cliente selecionado se houver
      let clienteEmail = '';
      let clienteNome = '';
      
      if (selectedClienteId) {
        const clienteSelecionado = clientes.find(c => c.id === selectedClienteId);
        if (clienteSelecionado) {
          clienteNome = clienteSelecionado.nome;
          
          // Buscar email do cliente no KV
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/clientes`,
            {
              headers: { 'Authorization': `Bearer ${session.access_token}` }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const clienteCompleto = data.clientes?.find((c: any) => c.id === selectedClienteId);
            if (clienteCompleto?.email) {
              clienteEmail = clienteCompleto.email;
            }
          }
        }
      }

      const config = {
        etapas,
        customMessages,
        nextExecution: nextExecution.toISOString(),
        ativa: reguaAtiva,
        selectedClienteId,
        clienteEmail,
        clienteNome,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/regua-config`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        }
      );

      if (response.ok) {
        // Mostrar notificação de sucesso se for um NOVO cliente (mudou de cliente)
        if (selectedClienteId && clienteEmail && clienteNome && selectedClienteId !== previousClienteId) {
          toast.success(`📧 Email de confirmação enviado para ${clienteNome}`, {
            description: `O cliente foi notificado sobre a ativação da régua de cobrança.`,
            duration: 5000,
          });
          setPreviousClienteId(selectedClienteId);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar configuração da régua:', error);
    }
  };

  // UseEffect para salvar configuração quando houver mudanças
  useEffect(() => {
    if (!loading) {
      saveReguaConfig();
    }
  }, [reguaAtiva, etapas, customMessages, selectedClienteId, nextExecution]);

  const toggleEtapa = (id: string) => {
    setEtapas(prev => prev.map(etapa => 
      etapa.id === id ? { ...etapa, ativo: !etapa.ativo } : etapa
    ));
  };

  const updateDias = (id: string, dias: number) => {
    setEtapas(prev => prev.map(etapa => 
      etapa.id === id ? { ...etapa, dias: Math.max(0, dias) } : etapa
    ));
  };

  const incrementDias = (id: string) => {
    setEtapas(prev => prev.map(etapa => 
      etapa.id === id ? { ...etapa, dias: etapa.dias + 1 } : etapa
    ));
  };

  const decrementDias = (id: string) => {
    setEtapas(prev => prev.map(etapa => 
      etapa.id === id ? { ...etapa, dias: Math.max(0, etapa.dias - 1) } : etapa
    ));
  };

  // Funções auxiliares para calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTimeInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const selectDate = (day: number) => {
    const newDate = new Date(calendarMonth);
    newDate.setDate(day);
    newDate.setHours(nextExecution.getHours());
    newDate.setMinutes(nextExecution.getMinutes());
    setNextExecution(newDate);
  };

  const previousMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCalendarMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCalendarMonth(newMonth);
  };

  const incrementHour = () => {
    const newDate = new Date(nextExecution);
    newDate.setHours((newDate.getHours() + 1) % 24);
    setNextExecution(newDate);
  };

  const decrementHour = () => {
    const newDate = new Date(nextExecution);
    newDate.setHours((newDate.getHours() - 1 + 24) % 24);
    setNextExecution(newDate);
  };

  const incrementMinute = () => {
    const newDate = new Date(nextExecution);
    const currentMinutes = newDate.getMinutes();
    const newMinutes = currentMinutes + 15;
    newDate.setMinutes(newMinutes >= 60 ? newMinutes - 60 : newMinutes);
    if (newMinutes >= 60) {
      newDate.setHours((newDate.getHours() + 1) % 24);
    }
    setNextExecution(newDate);
  };

  const decrementMinute = () => {
    const newDate = new Date(nextExecution);
    const currentMinutes = newDate.getMinutes();
    const newMinutes = currentMinutes - 15;
    if (newMinutes < 0) {
      newDate.setMinutes(60 + newMinutes);
      newDate.setHours((newDate.getHours() - 1 + 24) % 24);
    } else {
      newDate.setMinutes(newMinutes);
    }
    setNextExecution(newDate);
  };

  const getIconeCanal = (canal: Canal) => {
    switch (canal) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'sms': return <Smartphone className="w-5 h-5" />;
      case 'whatsapp': return <MessageCircle className="w-5 h-5" />;
      case 'voz': return <Mic className="w-5 h-5" />;
      case 'carta': return <FileText className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getCorCanal = (canal: Canal) => {
    switch (canal) {
      case 'email': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'sms': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'whatsapp': return 'text-green-600 bg-green-50 border-green-100';
      case 'voz': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'carta': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  const getBgColor = (canal: Canal) => {
    switch (canal) {
      case 'email': return 'bg-blue-50';
      case 'sms': return 'bg-purple-50';
      case 'whatsapp': return 'bg-green-50';
      case 'voz': return 'bg-orange-50';
      case 'carta': return 'bg-gray-50';
      default: return 'bg-gray-50';
    }
  };

  // Função para obter o template padrão
  const getDefaultTemplate = (etapa: EtapaCobranca): MensagemPersonalizada => {
    const clienteNome = selectedClienteId 
      ? (clientes.find(c => c.id === selectedClienteId)?.nome || '[Nome do Cliente]') 
      : '[Nome do Cliente]';

    switch (etapa.canal) {
      case 'email':
        return {
          subject: etapa.titulo,
          body: `Olá ${clienteNome},\n\nEsta é uma mensagem automática referente à fatura #12345.\n\n${etapa.descricao}\n\nValor: € 150,00\nVencimento: ${etapa.momento === 'antes' ? 'Daqui a ' + etapa.dias + ' dias' : etapa.momento === 'vencimento' ? 'Hoje' : 'Venceu há ' + etapa.dias + ' dias'}\n\nPara efetuar o pagamento, utilize a referência MB anexa ou clique no link abaixo.\n\nAtenciosamente,\nEquipa Financeira`
        };
      case 'sms':
        return {
          body: `Cobra+: Ola ${clienteNome}, a sua fatura #12345 vence ${etapa.momento === 'vencimento' ? 'hoje' : 'em breve'}. Valor: 150eur. Pague aqui: cobra-mais.pt/pagar/xyz`
        };
      case 'whatsapp':
        return {
          body: `👋 Olá ${clienteNome}!\n\nAqui é da Cobra+.\n\nLembramos que a sua fatura #12345 no valor de € 150,00 vence ${etapa.momento === 'vencimento' ? 'hoje' : 'em breve'}.\n\n🔗 Link para pagamento: cobra-mais.pt/pagar/xyz\n\nQualquer dúvida estamos à disposição!`
        };
      default:
        return {
          subject: etapa.titulo,
          body: etapa.descricao
        };
    }
  };

  // Função principal que decide se mostra o customizado ou o padrão
  const getMessageToDisplay = (etapa: EtapaCobranca) => {
    if (customMessages[etapa.id]) {
      return customMessages[etapa.id];
    }
    return getDefaultTemplate(etapa);
  };

  // Handler para abrir o modal
  const handleOpenPreview = (etapa: EtapaCobranca) => {
    setPreviewEtapa(etapa);
    setEditingMessage(getMessageToDisplay(etapa));
    setAiSuggestions([]); // Limpa sugestões anteriores
    setIsGeneratingAI(false);
  };

  // Handler para gerar sugestões IA (Simulado)
  const handleGenerateAI = () => {
    if (!previewEtapa) return;
    
    setIsGeneratingAI(true);
    
    // Simula delay de rede/processamento
    setTimeout(() => {
      const clienteNome = selectedClienteId 
        ? (clientes.find(c => c.id === selectedClienteId)?.nome || '[Nome]') 
        : '[Nome]';
      
      const suggestions: AISuggestion[] = [
        {
          tone: 'formal',
          label: 'Formal e Institucional',
          content: {
            subject: `Notificação de Fatura - ${previewEtapa.titulo}`,
            body: `Prezado(a) Sr(a). ${clienteNome},\n\nInformamos que a fatura nº 12345 encontra-se pendente de regularização. Solicitamos que proceda ao pagamento através dos canais habituais.\n\nCom os melhores cumprimentos,\nDepartamento Financeiro`
          }
        },
        {
          tone: 'empatico',
          label: 'Empático e Próximo',
          content: {
            subject: `Olá ${clienteNome}, podemos ajudar?`,
            body: `Olá ${clienteNome},\n\nNotámos que a sua fatura #12345 ainda não foi liquidada. Sabemos que imprevistos acontecem!\n\nSe precisar de alguma facilidade de pagamento ou se já efetuou a transferência, por favor avise-nos.\n\nEstamos aqui para ajudar,\nEquipa Cobra+`
          }
        },
        {
          tone: 'assertivo',
          label: 'Curto e Assertivo',
          content: {
            subject: `Pagamento Pendente - Fatura #12345`,
            body: `${clienteNome}, detetámos a falta de pagamento da fatura #12345.\n\nPara evitar a suspensão do serviço, regularize a situação hoje através do link: cobra-mais.pt/pagar\n\nObrigado.`
          }
        }
      ];
      
      setAiSuggestions(suggestions);
      setIsGeneratingAI(false);
    }, 1500);
  };

  // Handler para salvar a mensagem editada
  const handleSaveMessage = () => {
    if (previewEtapa && editingMessage) {
      setCustomMessages({
        ...customMessages,
        [previewEtapa.id]: editingMessage
      });
      setPreviewEtapa(null); // Fecha o modal
    }
  };

  const adicionarEtapa = (momento: Momento) => {
    const novaEtapa: EtapaCobranca = {
      id: `nova-${Date.now()}`,
      momento: momento,
      dias: momento === 'vencimento' ? 0 : momento === 'antes' ? 3 : 7,
      canal: 'email',
      ativo: false,
      titulo: momento === 'antes' ? 'Novo Lembrete' : momento === 'vencimento' ? 'Nova Ação' : 'Nova Cobrança',
      descricao: 'Configurar descrição'
    };
    
    setEtapas(prev => [...prev, novaEtapa]);
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
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Régua de Cobrança Inteligente</h1>
            <p className="text-emerald-100 max-w-xl text-lg">
              Automatize a comunicação com seus clientes. Reduza a inadimplência em até 50% com lembretes automáticos por Email, SMS e WhatsApp.
            </p>
            
            <div className="mt-6 mb-2">
              <label className="text-emerald-200 text-xs uppercase tracking-wider font-bold block mb-2">Aplicar régua a:</label>
              <div className="relative inline-block w-full max-w-xs">
                <select
                  value={selectedClienteId}
                  onChange={(e) => setSelectedClienteId(e.target.value)}
                  className="w-full appearance-none bg-emerald-800/50 border border-emerald-500/30 text-white rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                >
                  <option value="" className="text-gray-900">Todos os Clientes</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id} className="text-gray-900">
                      {cliente.nome}
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-300" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  if (!reguaAtiva) {
                    setShowNotification(true);
                  }
                  setReguaAtiva(!reguaAtiva);
                }}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                  reguaAtiva 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/50'
                }`}
              >
                {reguaAtiva 
                  ? `Desativar Régua ${selectedClienteId ? '' : 'Geral'}` 
                  : `Ativar Régua ${selectedClienteId ? '' : 'Geral'}`
                }
              </button>
              
              {reguaAtiva && (
                <button
                  onClick={async () => {
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (!session) {
                        alert('Sessão expirada');
                        return;
                      }

                      const response = await fetch(
                        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/regua-executar`,
                        {
                          method: 'POST',
                          headers: { 
                            'Authorization': `Bearer ${session.access_token}`,
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ tipo: 'teste', forcar: true }),
                        }
                      );

                      if (!response.ok) {
                        const error = await response.text();
                        throw new Error(`Erro: ${error}`);
                      }

                      const resultado = await response.json();
                      
                      if (resultado.acoesEnviadas > 0) {
                        const detalhesTexto = resultado.detalhes?.map((d: any) => {
                          const statusEmoji = d.status === 'email_enviado' ? '✅' : 
                                            d.status === 'email_falhou' ? '❌' : 
                                            d.status === 'whatsapp_pendente' ? '⏳' :
                                            d.status === 'sms_pendente' ? '⏳' : '📝';
                          const statusTexto = d.status === 'email_enviado' ? 'Email enviado' : 
                                            d.status === 'email_falhou' ? 'Falha ao enviar' : 
                                            d.status === 'whatsapp_pendente' ? 'WhatsApp (pendente)' :
                                            d.status === 'sms_pendente' ? 'SMS (pendente)' : 'Registrado';
                          return `${statusEmoji} ${d.canal.toUpperCase()} para ${d.cliente} - ${statusTexto}`;
                        }).join('\n') || '';
                        
                        toast.success(`✅ ${resultado.acoesEnviadas} mensagem(ns) processada(s)!`, {
                          description: detalhesTexto,
                          duration: 8000,
                        });
                        
                        setTimeout(() => window.location.reload(), 2000);
                      } else {
                        toast.warning(`⚠️ Nenhuma ação enviada`, {
                          description: resultado.mensagem || 'Nenhuma fatura elegível no momento',
                          duration: 5000,
                        });
                      }
                    } catch (error) {
                      alert(`❌ Erro: ${error}`);
                    }
                  }}
                  className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  Testar Agora
                </button>
              )}
              
              <div 
                onClick={() => setShowDateTimePicker(true)}
                className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-pointer group"
              >
                <Clock className="w-5 h-5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-200 uppercase font-bold leading-tight">Próxima execução</span>
                  <span className="text-white font-bold text-sm">{formatDateTime(nextExecution)}</span>
                </div>
                <Calendar className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 min-w-[250px]">
            <h3 className="text-emerald-200 text-sm uppercase tracking-wider font-medium mb-1">Recuperado este mês</h3>
            <p className="text-3xl font-bold">1.240,50 €</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">+12% vs mês anterior</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Régua Ativa */}
      {reguaAtiva && (
        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-emerald-900 mb-1 flex items-center gap-2">
                Régua de Cobrança Ativa
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">ATIVO</span>
              </h3>
              <p className="text-emerald-700 text-sm mb-3">
                A régua está a processar {faturasVencidas.length} faturas pendentes. Acompanhe o progresso e histórico de ações no <strong>Dashboard</strong>.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Eye className="w-4 h-4" />
                <span className="font-medium">Visualize as ações enviadas no Dashboard</span>
              </div>
            </div>
            <button
              onClick={() => setReguaAtiva(false)}
              className="flex-shrink-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tabs de Navegação */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'config' 
              ? 'border-emerald-500 text-emerald-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          Configuração da Régua
        </button>
        <button
          onClick={() => setActiveTab('devedores')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'devedores' 
              ? 'border-emerald-500 text-emerald-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Faturas em Monitorização ({faturasVencidas.length})
        </button>
      </div>

      {activeTab === 'config' ? (
        <div className="grid grid-cols-1 gap-8">
          {/* Timeline Vertical de Configuração */}
          <div className="space-y-8 max-w-4xl mx-auto w-full">
            
            {/* Secção: Antes do Vencimento */}
            <div className="relative pl-8 border-l-2 border-emerald-200">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white"></div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  Antes do Vencimento
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Prevenção</span>
                </h3>
                <p className="text-gray-600 text-sm">Lembretes amigáveis para garantir o pagamento pontual.</p>
              </div>
              
              <div className="space-y-4">
                {etapas.filter(e => e.momento === 'antes').map((etapa) => (
                  <div key={etapa.id} className={`flex items-center p-4 border rounded-xl transition-all ${etapa.ativo ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                    <div className="mr-4">
                      <button
                        onClick={() => toggleEtapa(etapa.id)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${etapa.ativo ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${etapa.ativo ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="mr-6 min-w-[140px]">
                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
                          <button
                            onClick={() => decrementDias(etapa.id)}
                            className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input 
                            type="number" 
                            value={etapa.dias} 
                            onChange={(e) => updateDias(etapa.id, parseInt(e.target.value) || 0)}
                            className="w-10 text-center bg-transparent font-semibold text-gray-700 focus:outline-none"
                          />
                          <button
                            onClick={() => incrementDias(etapa.id)}
                            className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-xs text-gray-500 ml-1">dias antes</span>
                        </div>
                    </div>
                    <div className={`p-2 rounded-lg mr-4 ${getCorCanal(etapa.canal)}`}>
                      {getIconeCanal(etapa.canal)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        {etapa.titulo}
                        {customMessages[etapa.id] && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold uppercase tracking-wide">
                            Editado
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">{etapa.descricao}</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleOpenPreview(etapa)}
                        className={`text-sm font-medium px-3 py-1 rounded transition-colors flex items-center gap-1 ${customMessages[etapa.id] ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                      >
                        {customMessages[etapa.id] ? <Edit2 className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                        {customMessages[etapa.id] ? 'Editar' : 'Ver/Editar'}
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => adicionarEtapa('antes')}
                  className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 font-semibold group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Cobre aqui!
                </button>
              </div>
            </div>

            {/* Secção: Dia do Vencimento */}
            <div className="relative pl-8 border-l-2 border-blue-200">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  Dia do Vencimento
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Facilitação</span>
                </h3>
                <p className="text-gray-600 text-sm">Garanta que o cliente tem o meio de pagamento à mão.</p>
              </div>
              
              <div className="space-y-4">
                {etapas.filter(e => e.momento === 'vencimento').map((etapa) => (
                  <div key={etapa.id} className={`flex items-center p-4 border rounded-xl transition-all ${etapa.ativo ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                    <div className="mr-4">
                      <button
                        onClick={() => toggleEtapa(etapa.id)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${etapa.ativo ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${etapa.ativo ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="mr-6 min-w-[140px]">
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
                        <button
                          onClick={() => decrementDias(etapa.id)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input 
                          type="number" 
                          value={etapa.dias} 
                          onChange={(e) => updateDias(etapa.id, parseInt(e.target.value) || 0)}
                          className="w-10 text-center bg-transparent font-semibold text-gray-700 focus:outline-none"
                        />
                        <button
                          onClick={() => incrementDias(etapa.id)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-gray-500 ml-1">
                          {etapa.dias === 0 ? 'no dia' : etapa.dias > 0 ? 'dias depois' : 'dias antes'}
                        </span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg mr-4 ${getCorCanal(etapa.canal)}`}>
                      {getIconeCanal(etapa.canal)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        {etapa.titulo}
                        {customMessages[etapa.id] && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold uppercase tracking-wide">
                            Editado
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">{etapa.descricao}</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleOpenPreview(etapa)}
                        className={`text-sm font-medium px-3 py-1 rounded transition-colors flex items-center gap-1 ${customMessages[etapa.id] ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                      >
                         {customMessages[etapa.id] ? <Edit2 className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                         {customMessages[etapa.id] ? 'Editar' : 'Ver/Editar'}
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => adicionarEtapa('vencimento')}
                  className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-semibold group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Cobre aqui!
                </button>
              </div>
            </div>

            {/* Secção: Após Vencimento */}
            <div className="relative pl-8 border-l-2 border-orange-200 pb-8">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white"></div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  Após Vencimento
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Recuperação</span>
                </h3>
                <p className="text-gray-600 text-sm">Cobrança gradual e assertiva para recuperar valores.</p>
              </div>
              
              <div className="space-y-4">
                {etapas.filter(e => e.momento === 'depois').map((etapa) => (
                  <div key={etapa.id} className={`flex items-center p-4 border rounded-xl transition-all ${etapa.ativo ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-75'}`}>
                    <div className="mr-4">
                      <button
                        onClick={() => toggleEtapa(etapa.id)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${etapa.ativo ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${etapa.ativo ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <div className="mr-6 min-w-[140px]">
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
                        <button
                          onClick={() => decrementDias(etapa.id)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input 
                          type="number" 
                          value={etapa.dias} 
                          onChange={(e) => updateDias(etapa.id, parseInt(e.target.value) || 0)}
                          className="w-10 text-center bg-transparent font-semibold text-gray-700 focus:outline-none"
                        />
                        <button
                          onClick={() => incrementDias(etapa.id)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="text-xs text-gray-500 ml-1">dias após</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-lg mr-4 ${getCorCanal(etapa.canal)}`}>
                      {getIconeCanal(etapa.canal)}
                    </div>
                    <div className="flex-1">
                       <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        {etapa.titulo}
                        {customMessages[etapa.id] && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full font-bold uppercase tracking-wide">
                            Editado
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500">{etapa.descricao}</p>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleOpenPreview(etapa)}
                        className={`text-sm font-medium px-3 py-1 rounded transition-colors flex items-center gap-1 ${customMessages[etapa.id] ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                      >
                         {customMessages[etapa.id] ? <Edit2 className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                         {customMessages[etapa.id] ? 'Editar' : 'Ver/Editar'}
                      </button>
                    </div>
                  </div>
                ))}
                 <button 
                   onClick={() => adicionarEtapa('depois')}
                   className="w-full py-3 border-2 border-dashed border-orange-300 rounded-xl text-orange-600 hover:border-orange-500 hover:text-orange-700 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 font-semibold group"
                 >
                   <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                   Cobre aqui!
                 </button>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Tab Devedores */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {faturasVencidas.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-800">Tudo em dia!</h3>
              <p className="text-gray-600">Não existem faturas vencidas neste momento.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="p-4 bg-gray-50 font-medium text-gray-600 grid grid-cols-12 gap-4">
                <div className="col-span-4">Cliente</div>
                <div className="col-span-2">Vencimento</div>
                <div className="col-span-2">Valor</div>
                <div className="col-span-2">Dias Atraso</div>
                <div className="col-span-2">Próxima Ação</div>
              </div>
              {faturasVencidas.map((fatura) => {
                const diasAtraso = Math.floor((new Date().getTime() - new Date(fatura.vencimento).getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={fatura.id} className="p-4 hover:bg-gray-50 transition-colors grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 font-medium text-gray-800">{fatura.cliente_nome}</div>
                    <div className="col-span-2 text-gray-600">{new Date(fatura.vencimento).toLocaleDateString('pt-PT')}</div>
                    <div className="col-span-2 font-bold text-gray-800">{fatura.valor.toFixed(2)} €</div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        {diasAtraso} dias
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-blue-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email (Amanhã)
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Edição e Aprovação */}
      {previewEtapa && editingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className={`p-4 border-b flex justify-between items-center ${getBgColor(previewEtapa.canal)}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-white rounded-lg shadow-sm ${getCorCanal(previewEtapa.canal)}`}>
                   {getIconeCanal(previewEtapa.canal)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    Editar Mensagem
                  </h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{previewEtapa.titulo}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewEtapa(null)}
                className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="flex flex-col gap-6">
                
                {/* Área de Edição */}
                <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  {previewEtapa.canal === 'email' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                      <input
                        type="text"
                        value={editingMessage.subject || ''}
                        onChange={(e) => setEditingMessage({...editingMessage, subject: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  )}
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                       <label className="block text-sm font-medium text-gray-700">Conteúdo da Mensagem</label>
                       {previewEtapa.canal === 'whatsapp' && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Formato WhatsApp</span>}
                    </div>
                    <textarea
                      value={editingMessage.body}
                      onChange={(e) => setEditingMessage({...editingMessage, body: e.target.value})}
                      rows={8}
                      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono text-sm ${previewEtapa.canal === 'whatsapp' ? 'bg-[#e5ddd5]/20' : 'bg-white'}`}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">Pode usar variáveis como [Nome] e [Valor].</p>
                  </div>
                </div>

                {/* Sugestões IA */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Sugestões de IA
                    </h4>
                    <button
                      onClick={handleGenerateAI}
                      disabled={isGeneratingAI}
                      className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-100 transition-all"
                    >
                      {isGeneratingAI ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {isGeneratingAI ? 'A analisar...' : 'Cobre!'}
                    </button>
                  </div>

                  {isGeneratingAI ? (
                     <div className="grid grid-cols-3 gap-3 animate-pulse">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                        ))}
                     </div>
                  ) : aiSuggestions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {aiSuggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => setEditingMessage(sug.content)}
                          className="text-left p-3 rounded-lg border border-gray-200 bg-white hover:border-purple-400 hover:shadow-md transition-all group relative overflow-hidden"
                        >
                          <div className={`absolute top-0 left-0 w-1 h-full ${sug.tone === 'formal' ? 'bg-slate-400' : sug.tone === 'empatico' ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1 pl-2">{sug.label}</p>
                          <p className="text-xs text-gray-600 line-clamp-3 pl-2 group-hover:text-gray-900">
                            {sug.content.body}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-purple-800 mb-2">Quer melhorar esta mensagem?</p>
                      <button 
                        onClick={handleGenerateAI}
                        className="bg-white text-purple-600 text-xs font-bold px-4 py-2 rounded-full border border-purple-200 hover:bg-purple-50 transition-colors shadow-sm flex items-center gap-2 mx-auto"
                      >
                        <Sparkles className="w-4 h-4" />
                        Cobre!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setPreviewEtapa(null)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMessage}
                className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-sm shadow-emerald-200 flex items-center gap-2 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                Aprovar e Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Data e Hora */}
      {showDateTimePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" onClick={() => setShowDateTimePicker(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="p-5 border-b bg-gradient-to-r from-emerald-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Selecionar Data e Hora</h3>
                    <p className="text-xs text-gray-500">Próxima execução da régua</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDateTimePicker(false)}
                  className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50">
              {/* Calendário */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={previousMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h4 className="font-semibold text-gray-800 capitalize">
                    {calendarMonth.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="text-center text-xs font-bold text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: getDaysInMonth(calendarMonth).startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`}></div>
                  ))}
                  {Array.from({ length: getDaysInMonth(calendarMonth).daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = nextExecution.getDate() === day && 
                                      nextExecution.getMonth() === calendarMonth.getMonth() && 
                                      nextExecution.getFullYear() === calendarMonth.getFullYear();
                    return (
                      <button
                        key={day}
                        onClick={() => selectDate(day)}
                        className={`h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                          isSelected 
                            ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-md' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Seleção de Hora */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">Horário</h4>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={incrementHour}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">
                        {String(nextExecution.getHours()).padStart(2, '0')}
                      </span>
                    </div>
                    <button
                      onClick={decrementHour}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <span className="text-2xl font-bold text-gray-400">:</span>
                  
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={incrementMinute}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">
                        {String(nextExecution.getMinutes()).padStart(2, '0')}
                      </span>
                    </div>
                    <button
                      onClick={decrementMinute}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Incrementos de 15 minutos
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowDateTimePicker(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowDateTimePicker(false)}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-cyan-700 shadow-lg shadow-emerald-200 flex items-center gap-2 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}