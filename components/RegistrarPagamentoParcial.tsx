import { useState } from 'react';
import { Euro, Calendar, CreditCard, X, CheckCircle, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import type { Fatura, PagamentoParcial } from '../utils/supabase/client';

interface RegistrarPagamentoParcialProps {
  fatura: Fatura;
  onClose: () => void;
  onSuccess: (novaFatura: Fatura) => void;
}

export function RegistrarPagamentoParcial({ 
  fatura, 
  onClose,
  onSuccess 
}: RegistrarPagamentoParcialProps) {
  const [valor, setValor] = useState('');
  const [metodo, setMetodo] = useState<'transferencia' | 'mbway' | 'multibanco' | 'dinheiro' | 'outro'>('transferencia');
  const [descricao, setDescricao] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const valorRestante = fatura.valorRestante || fatura.valor;
  const valorNumerico = parseFloat(valor) || 0;
  const novoRestante = valorRestante - valorNumerico;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (valorNumerico <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    if (valorNumerico > valorRestante) {
      toast.error('Valor não pode ser maior que o restante');
      return;
    }

    setIsLoading(true);

    try {
      // Cria novo pagamento parcial
      const novoPagamento: PagamentoParcial = {
        id: `pag_${Date.now()}`,
        valor: valorNumerico,
        data: new Date().toISOString(),
        metodo,
        descricao: descricao || undefined
      };

      // Atualiza fatura
      const novoValorPago = (fatura.valorPago || 0) + valorNumerico;
      const novoValorRestante = fatura.valor - novoValorPago;
      
      let novoStatus: 'paid' | 'pending' | 'overdue' | 'partial';
      if (novoValorRestante <= 0) {
        novoStatus = 'paid';
      } else if (novoValorPago > 0) {
        novoStatus = 'partial';
      } else {
        novoStatus = fatura.status;
      }

      const faturaAtualizada: Fatura = {
        ...fatura,
        valorPago: novoValorPago,
        valorRestante: Math.max(0, novoValorRestante),
        status: novoStatus,
        pagamentosParciais: [...(fatura.pagamentosParciais || []), novoPagamento]
      };

      // Aqui você chamaria a API para salvar no backend
      // await API.registrarPagamentoParcial(fatura.id, novoPagamento);

      toast.success(
        novoStatus === 'paid' 
          ? '✅ Fatura totalmente paga!' 
          : `✅ Pagamento de ${valorNumerico.toFixed(2)}€ registrado`
      );

      onSuccess(faturaAtualizada);
      onClose();

    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error(error.message || 'Erro ao registrar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-emerald-700 flex items-center gap-2">
                <Euro className="w-6 h-6" />
                Registrar Pagamento Parcial
              </CardTitle>
              <CardDescription>
                Fatura {fatura.numero} - {fatura.cliente_nome}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Resumo da Fatura */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-blue-600 mb-1">Valor Total</p>
                <p className="font-bold text-blue-900">{fatura.valor.toFixed(2)}€</p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 mb-1">Já Pago</p>
                <p className="font-bold text-emerald-900">{(fatura.valorPago || 0).toFixed(2)}€</p>
              </div>
              <div>
                <p className="text-xs text-amber-600 mb-1">Restante</p>
                <p className="font-bold text-amber-900">{valorRestante.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Valor do Pagamento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valor do Pagamento *
              </label>
              <div className="relative">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={valorRestante}
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={`Máximo: ${valorRestante.toFixed(2)}€`}
                  required
                />
              </div>
              
              {/* Preview do que vai sobrar */}
              {valorNumerico > 0 && (
                <div className="mt-2 text-sm">
                  {novoRestante > 0 ? (
                    <p className="text-amber-600">
                      Restará: <span className="font-bold">{novoRestante.toFixed(2)}€</span> por pagar
                    </p>
                  ) : (
                    <p className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-bold">Fatura será totalmente paga!</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Método de Pagamento */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Método de Pagamento *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { value: 'transferencia', label: 'Transferência', icon: '🏦' },
                  { value: 'mbway', label: 'MB WAY', icon: '📱' },
                  { value: 'multibanco', label: 'Multibanco', icon: '💳' },
                  { value: 'dinheiro', label: 'Dinheiro', icon: '💶' },
                  { value: 'outro', label: 'Outro', icon: '🔄' }
                ].map((opcao) => (
                  <button
                    key={opcao.value}
                    type="button"
                    onClick={() => setMetodo(opcao.value as any)}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      metodo === opcao.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-emerald-200 text-gray-700'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{opcao.icon}</span>
                    {opcao.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Descrição Opcional */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observações (Opcional)
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows={3}
                placeholder="Ex: Pagamento referente à primeira prestação..."
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || valorNumerico <= 0 || valorNumerico > valorRestante}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    A processar...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Registrar Pagamento
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
