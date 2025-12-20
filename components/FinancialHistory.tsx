import { useState, useEffect } from 'react';
import { 
  Calendar,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  FileText,
  Building2,
  DollarSign,
  Activity,
  ChevronDown,
  ChevronUp,
  Loader2,
  Clock,
  Target,
  Briefcase,
  XCircle,
  CheckCircle,
  MinusCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

interface FinancialHistoryProps {
  nif: string;
  clientName: string;
}

interface FinancialEvent {
  date: string;
  type: 'insolvency' | 'execution' | 'capital_change' | 'revenue_change' | 'activity_change' | 'warning';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'positive';
  title: string;
  description: string;
  amount?: number;
  icon: any;
}

export function FinancialHistory({ nif, clientName }: FinancialHistoryProps) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [historyData, setHistoryData] = useState<any>(null);
  const [timeline, setTimeline] = useState<FinancialEvent[]>([]);

  useEffect(() => {
    if (nif && nif.length === 9) {
      fetchFinancialHistory();
    }
  }, [nif]);

  const fetchFinancialHistory = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch(`${API_URL}/external-data/panorama`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nif })
      });

      if (!res.ok) throw new Error('Erro ao buscar histórico');

      const data = await res.json();
      
      if (data.success && data.panorama) {
        setHistoryData(data.panorama);
        buildTimeline(data.panorama);
      }

    } catch (error) {
      console.error('Erro ao carregar histórico financeiro:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildTimeline = (panorama: any) => {
    const events: FinancialEvent[] = [];
    const currentYear = new Date().getFullYear();

    // Insolvências
    if (panorama.insolvencyHistory && panorama.insolvencyHistory.length > 0) {
      panorama.insolvencyHistory.forEach((ins: any) => {
        events.push({
          date: ins.date || `${currentYear - 1}-01-01`,
          type: 'insolvency',
          severity: 'critical',
          title: '🚨 Processo de Insolvência',
          description: `${ins.type || 'Insolvência'}: ${ins.description || 'Processo declarado'}`,
          icon: XCircle
        });
      });
    }

    // Execuções Fiscais
    if (panorama.taxExecutions && panorama.taxExecutions.length > 0) {
      panorama.taxExecutions.forEach((exec: any) => {
        events.push({
          date: exec.date || `${currentYear - 1}-06-01`,
          type: 'execution',
          severity: 'high',
          title: '⚠️ Execução Fiscal',
          description: `${exec.description || 'Execução fiscal ativa'}`,
          amount: exec.amount,
          icon: AlertTriangle
        });
      });
    }

    // Mudanças de Capital
    if (panorama.shareCapital) {
      const capital = panorama.shareCapital;
      if (capital.history && capital.history.length > 0) {
        capital.history.forEach((change: any, idx: number) => {
          const isIncrease = idx > 0 && change.amount > capital.history[idx - 1].amount;
          events.push({
            date: change.date || `${currentYear - idx - 1}-01-01`,
            type: 'capital_change',
            severity: isIncrease ? 'positive' : 'medium',
            title: isIncrease ? '📈 Aumento de Capital' : '📉 Alteração de Capital',
            description: `Capital ${isIncrease ? 'aumentado' : 'alterado'} para €${change.amount.toLocaleString('pt-PT')}`,
            amount: change.amount,
            icon: isIncrease ? TrendingUp : TrendingDown
          });
        });
      }
    }

    // Volume de Negócios
    if (panorama.revenue?.trend === 'decreasing') {
      events.push({
        date: `${currentYear - 1}-12-31`,
        type: 'revenue_change',
        severity: 'high',
        title: '📉 Queda no Faturamento',
        description: `Volume de negócios em tendência de queda (${panorama.revenue.amount ? `€${panorama.revenue.amount.toLocaleString('pt-PT')}` : 'dados recentes'})`,
        amount: panorama.revenue.amount,
        icon: TrendingDown
      });
    } else if (panorama.revenue?.trend === 'increasing') {
      events.push({
        date: `${currentYear - 1}-12-31`,
        type: 'revenue_change',
        severity: 'positive',
        title: '📈 Crescimento do Faturamento',
        description: `Volume de negócios em crescimento (${panorama.revenue.amount ? `€${panorama.revenue.amount.toLocaleString('pt-PT')}` : 'tendência positiva'})`,
        amount: panorama.revenue.amount,
        icon: TrendingUp
      });
    }

    // Mudanças de Atividade
    if (panorama.activityCode?.history && panorama.activityCode.history.length > 1) {
      panorama.activityCode.history.slice(0, 3).forEach((activity: any, idx: number) => {
        events.push({
          date: activity.date || `${currentYear - idx - 1}-01-01`,
          type: 'activity_change',
          severity: 'low',
          title: '🏢 Mudança de Atividade',
          description: `CAE alterado: ${activity.code} - ${activity.description}`,
          icon: Briefcase
        });
      });
    }

    // Warnings gerais
    if (panorama.warnings && panorama.warnings.length > 0) {
      panorama.warnings.forEach((warning: string) => {
        events.push({
          date: `${currentYear}-01-01`,
          type: 'warning',
          severity: 'medium',
          title: '⚠️ Alerta',
          description: warning,
          icon: AlertTriangle
        });
      });
    }

    // Ordena por data (mais recente primeiro)
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setTimeline(events);
  };

  if (loading) {
    return (
      <Card className="border-2 border-purple-200">
        <CardContent className="py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-600 mx-auto mb-3 animate-spin" />
            <p className="text-sm text-slate-600">A carregar histórico financeiro...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!historyData) {
    return null;
  }

  const hasEvents = timeline.length > 0;
  const criticalEvents = timeline.filter(e => e.severity === 'critical').length;
  const highEvents = timeline.filter(e => e.severity === 'high').length;
  const positiveEvents = timeline.filter(e => e.severity === 'positive').length;

  return (
    <Card className="border-2 border-purple-200 overflow-hidden">
      <CardHeader 
        className="bg-gradient-to-r from-purple-50 to-blue-50 cursor-pointer hover:bg-purple-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-purple-700">
              Histórico Financeiro
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            {/* Badges de Resumo */}
            {criticalEvents > 0 && (
              <span className="px-2 py-1 bg-red-100 border border-red-300 rounded-full text-xs font-bold text-red-700">
                {criticalEvents} Crítico{criticalEvents > 1 ? 's' : ''}
              </span>
            )}
            {highEvents > 0 && (
              <span className="px-2 py-1 bg-orange-100 border border-orange-300 rounded-full text-xs font-bold text-orange-700">
                {highEvents} Alerta{highEvents > 1 ? 's' : ''}
              </span>
            )}
            {positiveEvents > 0 && (
              <span className="px-2 py-1 bg-green-100 border border-green-300 rounded-full text-xs font-bold text-green-700">
                {positiveEvents} Positivo{positiveEvents > 1 ? 's' : ''}
              </span>
            )}
            <Button variant="ghost" size="sm">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        <CardDescription>
          {hasEvents 
            ? `${timeline.length} evento${timeline.length > 1 ? 's' : ''} registado${timeline.length > 1 ? 's' : ''} • NIF: ${nif}`
            : 'Nenhum evento relevante encontrado'}
        </CardDescription>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-6">
          {hasEvents ? (
            <div className="space-y-6">
              {/* Resumo de Risco */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${
                  criticalEvents > 0 ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className={`w-4 h-4 ${criticalEvents > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600">Críticos</span>
                  </div>
                  <p className={`text-2xl font-bold ${criticalEvents > 0 ? 'text-red-700' : 'text-slate-400'}`}>
                    {criticalEvents}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  highEvents > 0 ? 'bg-orange-50 border-orange-300' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`w-4 h-4 ${highEvents > 0 ? 'text-orange-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600">Alertas</span>
                  </div>
                  <p className={`text-2xl font-bold ${highEvents > 0 ? 'text-orange-700' : 'text-slate-400'}`}>
                    {highEvents}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  positiveEvents > 0 ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className={`w-4 h-4 ${positiveEvents > 0 ? 'text-green-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold text-slate-600">Positivos</span>
                  </div>
                  <p className={`text-2xl font-bold ${positiveEvents > 0 ? 'text-green-700' : 'text-slate-400'}`}>
                    {positiveEvents}
                  </p>
                </div>
              </div>

              {/* Timeline de Eventos */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Linha do Tempo
                </h3>
                
                <div className="relative">
                  {/* Linha vertical */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                  
                  {/* Eventos */}
                  <div className="space-y-4">
                    {timeline.map((event, idx) => {
                      const EventIcon = event.icon;
                      const colorClasses = getEventColors(event.severity);
                      
                      return (
                        <div key={idx} className="relative pl-14">
                          {/* Ícone na linha */}
                          <div className={`absolute left-3 w-6 h-6 rounded-full ${colorClasses.iconBg} border-2 ${colorClasses.border} flex items-center justify-center`}>
                            <EventIcon className={`w-3 h-3 ${colorClasses.icon}`} />
                          </div>
                          
                          {/* Card do Evento */}
                          <div className={`border-2 ${colorClasses.border} rounded-lg p-3 ${colorClasses.bg} hover:shadow-md transition-shadow`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-bold ${colorClasses.text}`}>
                                    {formatDate(event.date)}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full ${colorClasses.badgeBg} border ${colorClasses.border} text-xs font-semibold ${colorClasses.text}`}>
                                    {getSeverityLabel(event.severity)}
                                  </span>
                                </div>
                                <h4 className={`font-semibold ${colorClasses.title} mb-1`}>
                                  {event.title}
                                </h4>
                                <p className="text-sm text-slate-700">
                                  {event.description}
                                </p>
                                {event.amount && (
                                  <p className={`text-sm font-bold ${colorClasses.text} mt-1`}>
                                    Valor: €{event.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Análise de Tendência */}
              <div className="border-t-2 pt-4">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Análise de Tendência
                </h3>
                <TrendAnalysis events={timeline} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-700 font-semibold">Sem Eventos Negativos Registados</p>
              <p className="text-sm text-slate-500 mt-1">
                Nenhum histórico de insolvências, execuções ou alertas encontrados
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// Componente de Análise de Tendência
function TrendAnalysis({ events }: { events: FinancialEvent[] }) {
  const last12Months = events.filter(e => {
    const eventDate = new Date(e.date);
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 12);
    return eventDate >= monthsAgo;
  });

  const criticalRecent = last12Months.filter(e => e.severity === 'critical').length;
  const positiveRecent = last12Months.filter(e => e.severity === 'positive').length;

  let trend: 'deteriorating' | 'improving' | 'stable' = 'stable';
  let trendIcon = MinusCircle;
  let trendColor = 'text-slate-600';
  let trendBg = 'bg-slate-50';
  let trendBorder = 'border-slate-300';
  let trendMessage = 'Situação estável nos últimos 12 meses';

  if (criticalRecent > 0 || last12Months.filter(e => e.severity === 'high').length >= 2) {
    trend = 'deteriorating';
    trendIcon = TrendingDown;
    trendColor = 'text-red-700';
    trendBg = 'bg-red-50';
    trendBorder = 'border-red-300';
    trendMessage = `Situação a deteriorar-se (${criticalRecent + last12Months.filter(e => e.severity === 'high').length} eventos negativos recentes)`;
  } else if (positiveRecent >= 2) {
    trend = 'improving';
    trendIcon = TrendingUp;
    trendColor = 'text-green-700';
    trendBg = 'bg-green-50';
    trendBorder = 'border-green-300';
    trendMessage = `Situação a melhorar (${positiveRecent} eventos positivos recentes)`;
  }

  const TrendIcon = trendIcon;

  return (
    <div className={`p-4 rounded-lg border-2 ${trendBorder} ${trendBg}`}>
      <div className="flex items-center gap-3">
        <TrendIcon className={`w-6 h-6 ${trendColor}`} />
        <div>
          <p className={`font-bold ${trendColor}`}>
            {trend === 'deteriorating' ? '📉 Deterioração' : trend === 'improving' ? '📈 Melhoria' : '➡️ Estável'}
          </p>
          <p className="text-sm text-slate-700 mt-1">
            {trendMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helpers
function getEventColors(severity: string) {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-50',
        border: 'border-red-300',
        icon: 'text-red-600',
        iconBg: 'bg-red-100',
        text: 'text-red-700',
        title: 'text-red-800',
        badgeBg: 'bg-red-100'
      };
    case 'high':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        icon: 'text-orange-600',
        iconBg: 'bg-orange-100',
        text: 'text-orange-700',
        title: 'text-orange-800',
        badgeBg: 'bg-orange-100'
      };
    case 'medium':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        icon: 'text-amber-600',
        iconBg: 'bg-amber-100',
        text: 'text-amber-700',
        title: 'text-amber-800',
        badgeBg: 'bg-amber-100'
      };
    case 'positive':
      return {
        bg: 'bg-green-50',
        border: 'border-green-300',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
        text: 'text-green-700',
        title: 'text-green-800',
        badgeBg: 'bg-green-100'
      };
    default:
      return {
        bg: 'bg-slate-50',
        border: 'border-slate-300',
        icon: 'text-slate-600',
        iconBg: 'bg-slate-100',
        text: 'text-slate-700',
        title: 'text-slate-800',
        badgeBg: 'bg-slate-100'
      };
  }
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'critical': return 'CRÍTICO';
    case 'high': return 'ALERTA';
    case 'medium': return 'ATENÇÃO';
    case 'positive': return 'POSITIVO';
    default: return 'INFO';
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}
