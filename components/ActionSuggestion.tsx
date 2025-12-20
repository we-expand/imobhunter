import { 
  Phone, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  AlertTriangle, 
  Zap,
  CreditCard,
  FileText,
  Shield,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';
import { Button } from './ui/button';

export interface ActionSuggestionData {
  score: number;
  externalRisk?: 'baixo' | 'médio' | 'alto' | 'crítico';
  combinedScore?: number;
  debtAmount: number;
  daysOverdue: number;
  clientName: string;
  phone?: string;
  email?: string;
}

interface SuggestedAction {
  priority: 'critico' | 'alto' | 'medio' | 'baixo';
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  action: string;
  description: string;
  quickActions: {
    label: string;
    icon: any;
    type: 'whatsapp' | 'email' | 'call' | 'discount' | 'legal';
  }[];
  expectedResult: string;
  urgency: 'imediata' | 'alta' | 'moderada' | 'baixa';
}

export function ActionSuggestion({ 
  score, 
  externalRisk, 
  combinedScore, 
  debtAmount, 
  daysOverdue,
  clientName,
  phone,
  email 
}: ActionSuggestionData) {
  
  const finalScore = combinedScore || score;
  const suggestion = getSuggestion(finalScore, externalRisk, debtAmount, daysOverdue);

  return (
    <div className={`border-2 ${suggestion.borderColor} rounded-lg overflow-hidden`}>
      {/* Header com Prioridade */}
      <div className={`${suggestion.bgColor} px-4 py-3 border-b-2 ${suggestion.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <suggestion.icon className={`w-5 h-5 ${suggestion.color}`} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-bold ${suggestion.color}`}>
                  {suggestion.label}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${suggestion.color} ${suggestion.bgColor} border ${suggestion.borderColor}`}>
                  Score: {finalScore}
                </span>
              </div>
              <p className={`text-sm ${suggestion.color.replace('700', '600')}`}>
                {suggestion.action}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${suggestion.bgColor} border-2 ${suggestion.borderColor}`}>
            <span className={`text-xs font-bold ${suggestion.color} uppercase`}>
              {suggestion.urgency}
            </span>
          </div>
        </div>
      </div>

      {/* Body com Descrição e Ações */}
      <div className="p-4 bg-white space-y-4">
        {/* Descrição */}
        <p className="text-sm text-slate-700">
          {suggestion.description}
        </p>

        {/* Alerta de Risco Externo */}
        {externalRisk && (externalRisk === 'crítico' || externalRisk === 'alto') && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-red-700">
                ⚠️ Alerta: Empresa em {externalRisk === 'crítico' ? 'situação crítica' : 'alto risco'} financeiro
              </p>
              <p className="text-xs text-red-600 mt-1">
                {externalRisk === 'crítico' 
                  ? 'Risco de insolvência. Priorize recuperação imediata ou considere write-off.'
                  : 'Dificuldades financeiras detectadas. Negocie com cautela.'}
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-600 uppercase">Ações Rápidas:</h4>
          <div className="grid grid-cols-2 gap-2">
            {suggestion.quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className={`justify-start ${suggestion.borderColor} hover:${suggestion.bgColor}`}
                  onClick={() => handleQuickAction(action.type, { clientName, phone, email, debtAmount })}
                >
                  <ActionIcon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Resultado Esperado */}
        <div className={`p-3 ${suggestion.bgColor} border ${suggestion.borderColor} rounded-lg`}>
          <div className="flex items-start gap-2">
            <Target className={`w-4 h-4 ${suggestion.color} flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-xs font-semibold ${suggestion.color}`}>Resultado Esperado:</p>
              <p className={`text-xs ${suggestion.color.replace('700', '600')} mt-1`}>
                {suggestion.expectedResult}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente compacto para badge/chip rápido
export function QuickActionBadge({ score, externalRisk, combinedScore }: { 
  score: number; 
  externalRisk?: string;
  combinedScore?: number;
}) {
  const finalScore = combinedScore || score;
  const suggestion = getSuggestion(finalScore, externalRisk as any, 0, 0);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${suggestion.bgColor} border ${suggestion.borderColor}`}>
      <suggestion.icon className={`w-3 h-3 ${suggestion.color}`} />
      <span className={`text-xs font-semibold ${suggestion.color}`}>
        {suggestion.label}
      </span>
    </div>
  );
}

// Lógica de sugestão baseada em score
function getSuggestion(
  score: number, 
  externalRisk?: 'baixo' | 'médio' | 'alto' | 'crítico',
  debtAmount: number = 0,
  daysOverdue: number = 0
): SuggestedAction {
  
  // PRIORIDADE CRÍTICA (Score 80-100) - Alta propensão
  if (score >= 80) {
    return {
      priority: 'critico',
      label: '✅ Contactar AGORA',
      icon: Zap,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      action: 'Contato imediato - Alta probabilidade de pagamento',
      description: 'Cliente com excelente score de propensão. Contacte AGORA via WhatsApp com link de pagamento direto. Muito provável que pague imediatamente.',
      quickActions: [
        { label: 'WhatsApp', icon: MessageSquare, type: 'whatsapp' },
        { label: 'Ligar', icon: Phone, type: 'call' },
        { label: 'Email', icon: Mail, type: 'email' },
        { label: 'Link Pagamento', icon: CreditCard, type: 'discount' }
      ],
      expectedResult: 'Pagamento em até 24h (probabilidade 85-95%)',
      urgency: 'imediata'
    };
  }

  // ALTA PRIORIDADE (Score 60-79) - Propensão boa
  if (score >= 60) {
    return {
      priority: 'alto',
      label: '💰 Oferecer Desconto 5-10%',
      icon: DollarSign,
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-300',
      action: 'Incentivo pequeno para conversão rápida',
      description: 'Cliente propenso a pagar. Envie mensagem com pequeno desconto (5-10%) para pagamento imediato. Use tom amigável e facilite o processo.',
      quickActions: [
        { label: 'WhatsApp 10%', icon: MessageSquare, type: 'whatsapp' },
        { label: 'Email c/ Desconto', icon: Mail, type: 'email' },
        { label: 'Oferecer Desconto', icon: DollarSign, type: 'discount' },
        { label: 'Ligar', icon: Phone, type: 'call' }
      ],
      expectedResult: 'Pagamento em 2-5 dias (probabilidade 70-85%)',
      urgency: 'alta'
    };
  }

  // PRIORIDADE MÉDIA (Score 40-59) - Negociação necessária
  if (score >= 40) {
    return {
      priority: 'medio',
      label: '📞 Ligar e Negociar',
      icon: Phone,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      action: 'Ligação com proposta de parcelamento ou desconto 15-20%',
      description: 'Cliente precisa de abordagem personalizada. LIGUE (não envie mensagem) e negocie condições: parcelamento 3x ou desconto de 15-20%.',
      quickActions: [
        { label: 'Ligar AGORA', icon: Phone, type: 'call' },
        { label: 'WhatsApp', icon: MessageSquare, type: 'whatsapp' },
        { label: 'Parcelamento', icon: CreditCard, type: 'discount' },
        { label: 'Email Formal', icon: Mail, type: 'email' }
      ],
      expectedResult: 'Acordo em 1 semana (probabilidade 50-70%)',
      urgency: 'moderada'
    };
  }

  // BAIXA PRIORIDADE / CRÍTICO (Score 0-39) - Última tentativa
  const isCritical = externalRisk === 'crítico' || daysOverdue > 90;
  
  return {
    priority: 'baixo',
    label: isCritical ? '🚨 Última Tentativa' : '⚠️ Desconto 25-35%',
    icon: isCritical ? AlertTriangle : Shield,
    color: isCritical ? 'text-red-700' : 'text-orange-700',
    bgColor: isCritical ? 'bg-red-50' : 'bg-orange-50',
    borderColor: isCritical ? 'border-red-300' : 'border-orange-300',
    action: isCritical 
      ? 'Oferta final antes de ação legal ou write-off'
      : 'Oferta agressiva para recuperar valor parcial',
    description: isCritical
      ? '⚠️ ATENÇÃO: Cliente em situação crítica. Ofereça desconto máximo (30-40%) como última chance. Se recusar, considere ação legal ou write-off.'
      : 'Cliente difícil. Ofereça desconto significativo (25-35%) ou parcelamento estendido. Documente todas as tentativas para possível ação legal.',
    quickActions: [
      { label: 'Desconto 35%', icon: DollarSign, type: 'discount' },
      { label: 'Carta Formal', icon: FileText, type: 'email' },
      { label: 'WhatsApp Urgente', icon: MessageSquare, type: 'whatsapp' },
      { label: 'Ação Legal', icon: Shield, type: 'legal' }
    ],
    expectedResult: isCritical 
      ? 'Recuperação parcial (probabilidade 20-30%) ou write-off'
      : 'Acordo difícil (probabilidade 30-50%)',
    urgency: isCritical ? 'imediata' : 'alta'
  };
}

// Handler de ações rápidas
function handleQuickAction(
  type: 'whatsapp' | 'email' | 'call' | 'discount' | 'legal',
  data: { clientName: string; phone?: string; email?: string; debtAmount: number }
) {
  switch (type) {
    case 'whatsapp':
      if (data.phone) {
        const message = encodeURIComponent(
          `Olá ${data.clientName}, temos uma proposta especial para regularizar o pagamento de €${data.debtAmount.toFixed(2)}. Pode falar agora?`
        );
        window.open(`https://wa.me/${data.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
      } else {
        alert('Número de telefone não disponível');
      }
      break;
      
    case 'email':
      if (data.email) {
        window.location.href = `mailto:${data.email}?subject=Proposta de Pagamento - €${data.debtAmount.toFixed(2)}`;
      } else {
        alert('Email não disponível');
      }
      break;
      
    case 'call':
      if (data.phone) {
        window.location.href = `tel:${data.phone}`;
      } else {
        alert('Número de telefone não disponível');
      }
      break;
      
    case 'discount':
      // Abre modal de desconto (implementar depois)
      alert('Funcionalidade de desconto será implementada');
      break;
      
    case 'legal':
      // Abre modal de ação legal (implementar depois)
      alert('Documentação legal será implementada');
      break;
  }
}
