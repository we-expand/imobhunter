import { useState, useEffect } from 'react';
import { TrendingUp, Euro, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { supabase, type Fatura } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';
import { PaymentProgress } from './PaymentProgress';
import { Page } from '../App';

interface PagamentosParciaisCardProps {
  onNavigate: (page: Page) => void;
}

export function PagamentosParciaisCard({ onNavigate }: PagamentosParciaisCardProps) {
  const [faturasParcias, setFaturasParciais] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaturasParciais();
  }, []);

  const loadFaturasParciais = async () => {
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
      const parciais = (data.faturas || [])
        .filter((f: Fatura) => f.status === 'partial' || (f.valorPago > 0 && f.valorPago < f.valor))
        .map((f: any) => ({
          ...f,
          valorPago: f.valorPago || 0,
          valorRestante: f.valorRestante !== undefined ? f.valorRestante : f.valor,
          pagamentosParciais: f.pagamentosParciais || []
        }));
      
      setFaturasParciais(parciais);
    } catch (error) {
      console.error('Erro ao carregar faturas parciais:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `${value.toFixed(2)}€`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  };

  const totalPorReceber = faturasParcias.reduce((acc, f) => acc + (f.valorRestante || 0), 0);

  if (loading) {
    return (
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-amber-700 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pagamentos Parciais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (faturasParcias.length === 0) {
    return (
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-700 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pagamentos Parciais
          </CardTitle>
          <CardDescription>
            Nenhuma fatura com pagamento parcial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">
            ✅ Todas as faturas estão totalmente pagas ou pendentes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Pagamentos Parciais
            </CardTitle>
            <CardDescription className="text-amber-600">
              {faturasParcias.length} {faturasParcias.length === 1 ? 'fatura' : 'faturas'} com pagamento parcial
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-amber-600">A receber</p>
            <p className="font-bold text-amber-900">{formatCurrency(totalPorReceber)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Lista de Faturas Parciais */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {faturasParcias.slice(0, 5).map((fatura) => (
            <div
              key={fatura.id}
              className="bg-white border border-amber-200 rounded-lg p-3 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {fatura.numero}
                  </p>
                  <p className="text-xs text-gray-600">{fatura.cliente_nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Venc.</p>
                  <p className="text-xs font-semibold text-gray-700">
                    {formatDate(fatura.vencimento)}
                  </p>
                </div>
              </div>

              {/* Progresso */}
              <PaymentProgress
                valorTotal={fatura.valor}
                valorPago={fatura.valorPago}
                valorRestante={fatura.valorRestante}
                status={fatura.status}
                showLabel={false}
                size="sm"
              />

              {/* Valores */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">
                  Pago: {formatCurrency(fatura.valorPago)}
                </span>
                <span className="text-amber-700 font-semibold">
                  Falta: {formatCurrency(fatura.valorRestante)}
                </span>
              </div>

              {/* Número de Pagamentos */}
              {(fatura.pagamentosParciais?.length || 0) > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                  <Calendar className="w-3 h-3" />
                  {fatura.pagamentosParciais.length} {fatura.pagamentosParciais.length === 1 ? 'pagamento' : 'pagamentos'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Alerta */}
        {faturasParcias.length > 0 && (
          <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              <strong>Atenção:</strong> {faturasParcias.length} {faturasParcias.length === 1 ? 'fatura precisa' : 'faturas precisam'} de acompanhamento.
            </p>
          </div>
        )}

        {/* Botão Ver Todas */}
        <Button
          onClick={() => onNavigate('faturas')}
          variant="outline"
          className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
        >
          Ver Todas as Faturas
        </Button>
      </CardContent>
    </Card>
  );
}
