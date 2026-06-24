import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Brain,
  BarChart3,
  Sparkles,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LeadFeedback {
  leadId: string;
  leadName: string;
  outcome: 'venda_fechada' | 'em_negociacao' | 'perdido' | 'sem_interesse';
  valorVenda?: number;
  tempoAteConversao?: number; // dias
  notasInternas?: string;
  timestamp: string;
}

interface AIPerformanceMetrics {
  totalLeadsEntregues: number;
  vendasFechadas: number;
  emNegociacao: number;
  perdidos: number;
  semInteresse: number;
  taxaConversao: number;
  taxaAcerto: number;
  valorTotalVendas: number;
  tempoMedioConversao: number;
  scoreMedioEntregue: number;
  scoreQualidade: number; // 0-100
}

export function LeadFeedbackSystem() {
  const [metrics, setMetrics] = useState<AIPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentFeedbacks, setRecentFeedbacks] = useState<LeadFeedback[]>([]);

  useEffect(() => {
    loadMetrics();
    loadRecentFeedbacks();
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-feedback/metrics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentFeedbacks = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-feedback/recent`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecentFeedbacks(data.feedbacks || []);
      }
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error);
    }
  };

  const submitFeedback = async (leadId: string, feedback: Partial<LeadFeedback>) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-feedback/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            leadId,
            ...feedback,
            timestamp: new Date().toISOString()
          }),
        }
      );

      if (response.ok) {
        toast.success('✅ Feedback registrado!', {
          description: 'A IA vai aprender com este resultado'
        });
        
        // Recarrega métricas
        await loadMetrics();
        await loadRecentFeedbacks();
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      toast.error('Erro ao registrar feedback');
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Precisa Melhorar';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              🧠 Sistema de Aprendizado da IA
            </h2>
            <p className="text-purple-100">
              Acompanhamos cada lead do início ao fim para melhorar continuamente a precisão da IA
            </p>
          </div>
        </div>
      </Card>

      {/* Main Metrics */}
      {metrics && (
        <>
          {/* Quality Score - Destaque */}
          <Card className={`p-6 border-2 ${getQualityColor(metrics.scoreQualidade)}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  metrics.scoreQualidade >= 80 ? 'bg-green-500' :
                  metrics.scoreQualidade >= 60 ? 'bg-blue-500' :
                  metrics.scoreQualidade >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-80">
                    Score de Qualidade da IA
                  </p>
                  <h3 className="text-4xl font-bold">
                    {metrics.scoreQualidade.toFixed(1)}%
                  </h3>
                </div>
              </div>
              <Badge className={`px-4 py-2 text-sm ${
                metrics.scoreQualidade >= 80 ? 'bg-green-500' :
                metrics.scoreQualidade >= 60 ? 'bg-blue-500' :
                metrics.scoreQualidade >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              } text-white`}>
                {getQualityLabel(metrics.scoreQualidade)}
              </Badge>
            </div>
            <p className="text-sm">
              {metrics.scoreQualidade >= 80 ? '🎯 A IA está entregando leads de alta qualidade!' :
               metrics.scoreQualidade >= 60 ? '👍 Bom desempenho, ainda pode melhorar' :
               metrics.scoreQualidade >= 40 ? '⚠️ A IA está aprendendo, aguarde mais feedbacks' :
               '📊 Registre mais feedbacks para melhorar a precisão'}
            </p>
          </Card>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Taxa de Conversão */}
            <Card className="p-6 border-2 border-green-200 bg-green-50">
              <div className="flex items-start justify-between mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <Badge className="bg-green-600 text-white">
                  {metrics.taxaConversao >= 20 ? '🔥' : metrics.taxaConversao >= 10 ? '✅' : '📊'}
                </Badge>
              </div>
              <p className="text-sm text-green-700 mb-1">Taxa de Conversão</p>
              <h3 className="text-3xl font-bold text-green-900">
                {metrics.taxaConversao.toFixed(1)}%
              </h3>
              <p className="text-xs text-green-600 mt-2">
                {metrics.vendasFechadas} vendas de {metrics.totalLeadsEntregues} leads
              </p>
            </Card>

            {/* Taxa de Acerto */}
            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-start justify-between mb-3">
                <Target className="w-8 h-8 text-blue-600" />
                <Badge className="bg-blue-600 text-white">
                  {metrics.taxaAcerto >= 70 ? '🎯' : metrics.taxaAcerto >= 50 ? '✅' : '📊'}
                </Badge>
              </div>
              <p className="text-sm text-blue-700 mb-1">Taxa de Acerto</p>
              <h3 className="text-3xl font-bold text-blue-900">
                {metrics.taxaAcerto.toFixed(1)}%
              </h3>
              <p className="text-xs text-blue-600 mt-2">
                Vendas + Negociações ativas
              </p>
            </Card>

            {/* Valor Total */}
            <Card className="p-6 border-2 border-purple-200 bg-purple-50">
              <div className="flex items-start justify-between mb-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <Badge className="bg-purple-600 text-white">
                  💰
                </Badge>
              </div>
              <p className="text-sm text-purple-700 mb-1">Valor Total</p>
              <h3 className="text-3xl font-bold text-purple-900">
                €{metrics.valorTotalVendas.toLocaleString()}
              </h3>
              <p className="text-xs text-purple-600 mt-2">
                Em vendas fechadas
              </p>
            </Card>

            {/* Tempo Médio */}
            <Card className="p-6 border-2 border-orange-200 bg-orange-50">
              <div className="flex items-start justify-between mb-3">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <Badge className="bg-orange-600 text-white">
                  ⏱️
                </Badge>
              </div>
              <p className="text-sm text-orange-700 mb-1">Tempo Médio</p>
              <h3 className="text-3xl font-bold text-orange-900">
                {metrics.tempoMedioConversao} dias
              </h3>
              <p className="text-xs text-orange-600 mt-2">
                Até o fechamento
              </p>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Distribuição de Resultados
            </h3>
            
            <div className="space-y-4">
              {/* Vendas Fechadas */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Vendas Fechadas</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {metrics.vendasFechadas} ({((metrics.vendasFechadas / metrics.totalLeadsEntregues) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${(metrics.vendasFechadas / metrics.totalLeadsEntregues) * 100}%` }}
                  />
                </div>
              </div>

              {/* Em Negociação */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Em Negociação</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {metrics.emNegociacao} ({((metrics.emNegociacao / metrics.totalLeadsEntregues) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(metrics.emNegociacao / metrics.totalLeadsEntregues) * 100}%` }}
                  />
                </div>
              </div>

              {/* Sem Interesse */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Sem Interesse</span>
                  </div>
                  <span className="font-bold text-yellow-600">
                    {metrics.semInteresse} ({((metrics.semInteresse / metrics.totalLeadsEntregues) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-600 h-3 rounded-full transition-all"
                    style={{ width: `${(metrics.semInteresse / metrics.totalLeadsEntregues) * 100}%` }}
                  />
                </div>
              </div>

              {/* Perdidos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Perdidos</span>
                  </div>
                  <span className="font-bold text-red-600">
                    {metrics.perdidos} ({((metrics.perdidos / metrics.totalLeadsEntregues) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-600 h-3 rounded-full transition-all"
                    style={{ width: `${(metrics.perdidos / metrics.totalLeadsEntregues) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* AI Learning Insights */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">
                  🧠 O que a IA está aprendendo
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    • <strong>Padrões de Sucesso:</strong> Características comuns em leads que fecharam venda
                  </p>
                  <p>
                    • <strong>Sinais de Alerta:</strong> Indicadores de leads que não convertem
                  </p>
                  <p>
                    • <strong>Timing Ideal:</strong> Melhor momento para abordagem baseado em conversões passadas
                  </p>
                  <p>
                    • <strong>Score Dinâmico:</strong> Ajuste automático da pontuação com base no histórico real
                  </p>
                </div>
                
                {metrics.totalLeadsEntregues < 10 && (
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Aprendizado Inicial:</strong> Precisamos de mais feedbacks (mínimo 10) para a IA ter insights precisos
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Recent Feedbacks */}
      {recentFeedbacks.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            📋 Feedbacks Recentes
          </h3>
          
          <div className="space-y-3">
            {recentFeedbacks.slice(0, 5).map((feedback, idx) => (
              <div 
                key={idx}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{feedback.leadName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(feedback.timestamp).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <Badge className={
                    feedback.outcome === 'venda_fechada' ? 'bg-green-600' :
                    feedback.outcome === 'em_negociacao' ? 'bg-blue-600' :
                    feedback.outcome === 'sem_interesse' ? 'bg-yellow-600' : 'bg-red-600'
                  }>
                    {feedback.outcome === 'venda_fechada' ? '✅ Venda Fechada' :
                     feedback.outcome === 'em_negociacao' ? '🔄 Em Negociação' :
                     feedback.outcome === 'sem_interesse' ? '⚠️ Sem Interesse' : '❌ Perdido'}
                  </Badge>
                </div>
                
                {feedback.valorVenda && (
                  <p className="text-sm text-green-600 mt-2">
                    💰 Valor: €{feedback.valorVenda.toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
