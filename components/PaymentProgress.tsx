import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface PaymentProgressProps {
  valorTotal: number;
  valorPago: number;
  valorRestante: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PaymentProgress({ 
  valorTotal, 
  valorPago, 
  valorRestante,
  status,
  showLabel = true,
  size = 'md'
}: PaymentProgressProps) {
  const percentagePaid = valorTotal > 0 ? (valorPago / valorTotal) * 100 : 0;
  const isPartial = valorPago > 0 && valorPago < valorTotal;
  
  // Cores baseadas no status
  const getStatusColor = () => {
    if (status === 'paid') return 'emerald';
    if (status === 'partial') return 'amber';
    if (status === 'overdue') return 'red';
    return 'blue';
  };
  
  const statusColor = getStatusColor();
  
  // Tamanhos
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="w-full">
      {/* Barra de Progresso */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} bg-gradient-to-r transition-all duration-500 ease-out ${
            status === 'paid' 
              ? 'from-emerald-500 to-emerald-600' 
              : status === 'partial'
              ? 'from-amber-500 to-amber-600'
              : status === 'overdue'
              ? 'from-red-500 to-red-600'
              : 'from-blue-500 to-blue-600'
          }`}
          style={{ width: `${Math.min(percentagePaid, 100)}%` }}
        >
          {percentagePaid > 0 && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          )}
        </div>
      </div>

      {/* Labels e Valores */}
      {showLabel && (
        <div className={`mt-2 flex items-center justify-between ${textSizes[size]}`}>
          {/* Lado Esquerdo - Valor Pago */}
          <div className="flex items-center gap-2">
            {status === 'paid' ? (
              <CheckCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-emerald-600`} />
            ) : isPartial ? (
              <TrendingUp className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-amber-600`} />
            ) : status === 'overdue' ? (
              <AlertCircle className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-red-600`} />
            ) : (
              <Clock className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-blue-600`} />
            )}
            
            <span className={`font-semibold ${
              status === 'paid' 
                ? 'text-emerald-700' 
                : isPartial 
                ? 'text-amber-700'
                : status === 'overdue'
                ? 'text-red-700'
                : 'text-blue-700'
            }`}>
              {valorPago.toFixed(2)}€
            </span>
            
            {isPartial && (
              <span className="text-gray-500">
                ({percentagePaid.toFixed(0)}%)
              </span>
            )}
          </div>

          {/* Lado Direito - Total ou Restante */}
          <div className="flex items-center gap-2">
            {isPartial ? (
              <>
                <span className="text-gray-500">Falta:</span>
                <span className="font-semibold text-gray-700">
                  {valorRestante.toFixed(2)}€
                </span>
              </>
            ) : (
              <span className="text-gray-500">
                Total: {valorTotal.toFixed(2)}€
              </span>
            )}
          </div>
        </div>
      )}

      {/* Badge de Status para Parcial */}
      {isPartial && showLabel && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Pagamento Parcial
          </span>
        </div>
      )}
    </div>
  );
}
