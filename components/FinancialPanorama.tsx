import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  RefreshCw,
  Calendar,
  DollarSign,
  Users,
  Shield,
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

interface FinancialPanoramaProps {
  nif: string;
  clientName?: string;
  onScoreUpdate?: (score: number, risk: string) => void;
}

interface Panorama {
  nif: string;
  companyName: string;
  overallRisk: 'baixo' | 'médio' | 'alto' | 'crítico';
  riskScore: number;
  financialHealth?: {
    status: 'saudável' | 'atenção' | 'preocupante' | 'crítica';
    indicators: {
      name: string;
      value: string;
      status: 'good' | 'warning' | 'critical';
    }[];
  };
  sources: any[];
  summary: string;
  recommendations: string[];
  lastChecked: string;
}

export function FinancialPanorama({ nif, clientName, onScoreUpdate }: FinancialPanoramaProps) {
  const [loading, setLoading] = useState(false);
  const [panorama, setPanorama] = useState<Panorama | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchPanorama = async (forceRefresh = false) => {
    if (!nif || nif.length < 9) {
      toast.error('NIF inválido para consulta');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Faça login primeiro');
        return;
      }

      // Se forçar refresh, limpa cache primeiro
      if (forceRefresh) {
        await fetch(`${API_URL}/external-data/cache/${nif}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
      }

      const res = await fetch(`${API_URL}/external-data/panorama`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nif })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao buscar dados');
      }

      const data = await res.json();
      setPanorama(data.panorama);
      setExpanded(true);

      // Callback com score atualizado
      if (onScoreUpdate) {
        onScoreUpdate(data.panorama.riskScore, data.panorama.overallRisk);
      }

      toast.success('Panorama financeiro atualizado!', {
        description: `Score de risco: ${data.panorama.riskScore}/100`
      });

    } catch (error: any) {
      console.error('Erro ao buscar panorama:', error);
      toast.error(error.message || 'Erro ao buscar dados externos');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'baixo': return 'emerald';
      case 'médio': return 'amber';
      case 'alto': return 'orange';
      case 'crítico': return 'red';
      default: return 'gray';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'baixo': return CheckCircle2;
      case 'médio': return AlertTriangle;
      case 'alto': return TrendingDown;
      case 'crítico': return XCircle;
      default: return Shield;
    }
  };

  const getIndicatorIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return { icon: CheckCircle2, color: 'emerald' };
      case 'warning': return { icon: AlertTriangle, color: 'amber' };
      case 'critical': return { icon: XCircle, color: 'red' };
    }
  };

  if (!panorama && !loading) {
    return (
      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-700">
            <Sparkles className="w-5 h-5" />
            Panorama Financeiro com IA
          </CardTitle>
          <CardDescription>
            Consulte dados oficiais e análise de crédito externa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Building2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <p className="text-sm text-slate-600 mb-4">
              Obtenha informações detalhadas sobre a saúde financeira do cliente
            </p>
            <Button
              onClick={() => fetchPanorama()}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  A consultar...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Consultar Dados Externos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading && !panorama) {
    return (
      <Card className="border-2 border-cyan-200">
        <CardContent className="py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-cyan-600 mx-auto mb-4 animate-spin" />
            <p className="text-sm text-slate-600">A consultar fontes oficiais...</p>
            <p className="text-xs text-slate-500 mt-1">Isto pode levar alguns segundos</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!panorama) return null;

  const RiskIcon = getRiskIcon(panorama.overallRisk);
  const riskColor = getRiskColor(panorama.overallRisk);

  return (
    <Card className={`border-2 border-${riskColor}-200 bg-gradient-to-br from-${riskColor}-50 to-white`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <RiskIcon className={`w-5 h-5 text-${riskColor}-600`} />
              <span className={`text-${riskColor}-700`}>
                Panorama Financeiro
              </span>
              <span className={`text-xs px-2 py-1 bg-${riskColor}-100 text-${riskColor}-700 rounded-full font-semibold`}>
                {panorama.overallRisk.toUpperCase()}
              </span>
            </CardTitle>
            <CardDescription className="mt-1">
              {panorama.companyName || clientName}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchPanorama(true)}
            disabled={loading}
            className="ml-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score de Risco */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex-shrink-0">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${riskColor}-500 to-${riskColor}-600 flex items-center justify-center`}>
              <span className="text-white text-xl font-bold">{panorama.riskScore}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Score de Risco</p>
            <p className="text-sm text-slate-600">
              {panorama.riskScore >= 75 ? 'Excelente' : 
               panorama.riskScore >= 50 ? 'Moderado' : 
               panorama.riskScore >= 25 ? 'Preocupante' : 'Crítico'}
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700 leading-relaxed">
            {panorama.summary}
          </p>
        </div>

        {/* Indicadores Financeiros */}
        {panorama.financialHealth && (
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Indicadores Financeiros
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {panorama.financialHealth.indicators.map((indicator, idx) => {
                const { icon: Icon, color } = getIndicatorIcon(indicator.status);
                return (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-start gap-2">
                      <Icon className={`w-4 h-4 text-${color}-600 flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-600">{indicator.name}</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{indicator.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recomendações */}
        {expanded && panorama.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Recomendações
            </h4>
            <div className="space-y-2">
              {panorama.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 text-xs flex-shrink-0 mt-0.5">•</span>
                  <p className="text-sm text-slate-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Atualizado: {new Date(panorama.lastChecked).toLocaleDateString('pt-PT')}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-cyan-600 hover:text-cyan-700 font-semibold"
          >
            {expanded ? 'Ver menos' : 'Ver mais'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
