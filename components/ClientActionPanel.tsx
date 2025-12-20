import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';
import { ClientFinancialPanel } from './ClientFinancialPanel';
import { FinancialHistory } from './FinancialHistory';
import { Button } from './ui/button';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

interface Cliente {
  id: string;
  nome: string;
  nif?: string;
  telefone?: string;
  email?: string;
  valor_atraso?: number;
  dias_atraso?: number;
  perfil_cliente?: string;
}

interface ClientActionPanelProps {
  cliente: Cliente;
}

export function ClientActionPanel({ cliente }: ClientActionPanelProps) {
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState<any>(null);
  const [showFinancialPanel, setShowFinancialPanel] = useState(false);

  useEffect(() => {
    if (cliente.nif && cliente.nif.length === 9) {
      calculateEnrichedScore();
    }
  }, [cliente.id]);

  const calculateEnrichedScore = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      // Prepara perfil do cliente para análise
      const clientProfile = {
        id: cliente.id,
        name: cliente.nome,
        email: cliente.email,
        phone: cliente.telefone,
        debtAmount: cliente.valor_atraso || 0,
        daysOverdue: cliente.dias_atraso || 0,
        paymentHistory: [], // TODO: buscar histórico real
        behaviorProfile: mapPerfilToProfile(cliente.perfil_cliente)
      };

      // Calcula score comportamental base
      const baseRes = await fetch(`${API_URL}/ai/calculate-score`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client: clientProfile })
      });

      if (!baseRes.ok) throw new Error('Erro ao calcular score base');
      
      const baseData = await baseRes.json();

      // Se tiver NIF, enriquece com dados externos
      if (cliente.nif && cliente.nif.length === 9) {
        const enrichedRes = await fetch(`${API_URL}/ai/enriched-score`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            client: clientProfile,
            nif: cliente.nif
          })
        });

        if (enrichedRes.ok) {
          const enrichedData = await enrichedRes.json();
          setScoreData({
            baseScore: baseData.score || 50,
            combinedScore: enrichedData.combinedScore,
            externalRisk: enrichedData.externalRisk,
            externalInsights: enrichedData.externalInsights,
            hasExternalData: true
          });
        } else {
          setScoreData({
            baseScore: baseData.score || 50,
            combinedScore: baseData.score || 50,
            hasExternalData: false
          });
        }
      } else {
        setScoreData({
          baseScore: baseData.score || 50,
          combinedScore: baseData.score || 50,
          hasExternalData: false
        });
      }

    } catch (error) {
      console.error('Erro ao calcular score:', error);
      // Fallback: score baseado apenas em dias de atraso
      const fallbackScore = calculateFallbackScore(cliente.dias_atraso || 0);
      setScoreData({
        baseScore: fallbackScore,
        combinedScore: fallbackScore,
        hasExternalData: false,
        isFallback: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-cyan-600 mx-auto mb-3 animate-spin" />
            <p className="text-sm text-slate-600">A analisar cliente com IA...</p>
            {cliente.nif && (
              <p className="text-xs text-slate-500 mt-1">A consultar dados externos...</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card de Ação Rápida */}
      {scoreData && (
        <QuickActionCard
          score={scoreData.baseScore}
          externalRisk={scoreData.externalRisk}
          combinedScore={scoreData.combinedScore}
          clientName={cliente.nome}
          debtAmount={cliente.valor_atraso || 0}
          phone={cliente.telefone}
          compact={false}
        />
      )}

      {/* Insights de Dados Externos */}
      {scoreData?.hasExternalData && scoreData.externalInsights && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
              <Sparkles className="w-4 h-4" />
              Insights de Dados Externos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scoreData.externalInsights.map((insight: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-blue-600">•</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Painel Financeiro (se tiver NIF) */}
      {cliente.nif && cliente.nif.length === 9 && (
        <ClientFinancialPanel
          nif={cliente.nif}
          clientName={cliente.nome}
          onScoreUpdate={(score, risk) => {
            console.log(`Score externo atualizado: ${score}, Risco: ${risk}`);
          }}
        />
      )}

      {/* Histórico Financeiro */}
      {cliente.nif && cliente.nif.length === 9 && (
        <FinancialHistory
          nif={cliente.nif}
          clientName={cliente.nome}
        />
      )}

      {/* Botão para recalcular */}
      {scoreData && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={calculateEnrichedScore}
        >
          <Sparkles className="w-3 h-3 mr-2" />
          Recalcular Score com IA
        </Button>
      )}
    </div>
  );
}

// Helper: Mapeia perfil do cliente para formato da IA
function mapPerfilToProfile(perfil?: string): 'prompt' | 'delayed' | 'negotiator' | 'avoider' | undefined {
  if (!perfil) return undefined;
  
  const perfilLower = perfil.toLowerCase();
  
  if (perfilLower.includes('pontual') || perfilLower.includes('bom pagador')) {
    return 'prompt';
  }
  if (perfilLower.includes('negociador') || perfilLower.includes('pede desconto')) {
    return 'negotiator';
  }
  if (perfilLower.includes('atrasado') || perfilLower.includes('esquecido')) {
    return 'delayed';
  }
  if (perfilLower.includes('sumiu') || perfilLower.includes('evita') || perfilLower.includes('mau pagador')) {
    return 'avoider';
  }
  
  return undefined;
}

// Helper: Calcula score básico apenas com dias de atraso (fallback)
function calculateFallbackScore(diasAtraso: number): number {
  if (diasAtraso <= 7) return 85;
  if (diasAtraso <= 15) return 70;
  if (diasAtraso <= 30) return 55;
  if (diasAtraso <= 60) return 40;
  if (diasAtraso <= 90) return 25;
  return 15;
}