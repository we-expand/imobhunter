import { 
  Zap, 
  DollarSign, 
  Phone, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';

interface QuickActionCardProps {
  score: number;
  externalRisk?: 'baixo' | 'médio' | 'alto' | 'crítico';
  combinedScore?: number;
  clientName: string;
  debtAmount: number;
  phone?: string;
  compact?: boolean;
  onActionClick?: (actionType: string) => void;
}

export function QuickActionCard({ 
  score, 
  externalRisk, 
  combinedScore, 
  clientName,
  debtAmount,
  phone,
  compact = false,
  onActionClick
}: QuickActionCardProps) {
  
  const finalScore = combinedScore || score;
  const action = getQuickAction(finalScore, externalRisk);

  if (compact) {
    return (
      <div className={`flex items-center justify-between gap-2 p-2 rounded-lg border-2 ${action.borderColor} ${action.bgColor}`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <action.icon className={`w-4 h-4 ${action.color} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${action.color} truncate`}>
              {action.label}
            </p>
            <p className={`text-xs ${action.color.replace('700', '600')} truncate`}>
              {action.shortDesc}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className={`h-7 px-2 text-xs ${action.buttonClass}`}
          onClick={() => onActionClick?.(action.type)}
        >
          <action.actionIcon className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`border-2 ${action.borderColor} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
      {/* Header Colorido */}
      <div className={`${action.bgGradient} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${action.iconBg} flex items-center justify-center`}>
            <action.icon className={`w-4 h-4 ${action.color}`} />
          </div>
          <div>
            <p className={`text-sm font-bold ${action.color}`}>{action.label}</p>
            <p className={`text-xs ${action.color.replace('700', '600')}`}>Score: {finalScore}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full ${action.badgeBg} border ${action.borderColor}`}>
          <p className={`text-xs font-bold ${action.color} uppercase`}>{action.urgency}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-white space-y-3">
        <p className="text-sm text-slate-700">
          {action.description}
        </p>

        {/* Ação Recomendada */}
        <div className={`p-3 ${action.bgColor} border ${action.borderColor} rounded-lg`}>
          <div className="flex items-center gap-2">
            <action.actionIcon className={`w-4 h-4 ${action.color}`} />
            <p className={`text-sm font-semibold ${action.color}`}>
              {action.actionText}
            </p>
          </div>
        </div>

        {/* Botão Principal */}
        <Button
          className={`w-full ${action.buttonClass}`}
          onClick={() => handleAction(action.type, { clientName, phone, debtAmount })}
        >
          {action.buttonText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Estatística */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t">
          <TrendingUp className={`w-4 h-4 ${action.color}`} />
          <p className={`text-xs ${action.color}`}>
            {action.successRate}
          </p>
        </div>
      </div>
    </div>
  );
}

interface QuickActionConfig {
  type: 'immediate' | 'discount' | 'negotiate' | 'critical';
  label: string;
  shortDesc: string;
  description: string;
  icon: any;
  actionIcon: any;
  color: string;
  bgColor: string;
  bgGradient: string;
  iconBg: string;
  badgeBg: string;
  borderColor: string;
  buttonClass: string;
  urgency: string;
  actionText: string;
  buttonText: string;
  successRate: string;
}

function getQuickAction(
  score: number, 
  externalRisk?: 'baixo' | 'médio' | 'alto' | 'crítico'
): QuickActionConfig {
  
  // SCORE 80-100: Contacto Imediato
  if (score >= 80) {
    return {
      type: 'immediate',
      label: '✅ Contactar AGORA',
      shortDesc: 'Alta probabilidade',
      description: 'Cliente com excelente propensão de pagamento. Contacte imediatamente via WhatsApp.',
      icon: Zap,
      actionIcon: MessageSquare,
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      bgGradient: 'bg-gradient-to-r from-emerald-50 to-emerald-100',
      iconBg: 'bg-white',
      badgeBg: 'bg-white',
      borderColor: 'border-emerald-300',
      buttonClass: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white',
      urgency: 'AGORA',
      actionText: 'Enviar mensagem com link de pagamento',
      buttonText: 'Enviar WhatsApp',
      successRate: 'Taxa de sucesso: 85-95%'
    };
  }

  // SCORE 60-79: Desconto Pequeno
  if (score >= 60) {
    return {
      type: 'discount',
      label: '💰 Oferecer Desconto',
      shortDesc: 'Desconto 5-10%',
      description: 'Cliente propenso. Ofereça pequeno desconto (5-10%) para conversão rápida.',
      icon: DollarSign,
      actionIcon: MessageSquare,
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      bgGradient: 'bg-gradient-to-r from-cyan-50 to-cyan-100',
      iconBg: 'bg-white',
      badgeBg: 'bg-white',
      borderColor: 'border-cyan-300',
      buttonClass: 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white',
      urgency: 'HOJE',
      actionText: 'WhatsApp com proposta de 10% desconto',
      buttonText: 'Enviar Proposta',
      successRate: 'Taxa de sucesso: 70-85%'
    };
  }

  // SCORE 40-59: Negociação
  if (score >= 40) {
    return {
      type: 'negotiate',
      label: '📞 Ligar e Negociar',
      shortDesc: 'Parcelamento/Desconto',
      description: 'Cliente precisa de abordagem personalizada. Ligue e negocie parcelamento ou desconto 15-20%.',
      icon: Phone,
      actionIcon: Phone,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      bgGradient: 'bg-gradient-to-r from-amber-50 to-amber-100',
      iconBg: 'bg-white',
      badgeBg: 'bg-white',
      borderColor: 'border-amber-300',
      buttonClass: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white',
      urgency: '2-3 DIAS',
      actionText: 'Ligação telefónica com proposta flexível',
      buttonText: 'Ligar Agora',
      successRate: 'Taxa de sucesso: 50-70%'
    };
  }

  // SCORE 0-39: Crítico
  const isCritical = externalRisk === 'crítico';
  
  return {
    type: 'critical',
    label: isCritical ? '🚨 URGENTE' : '⚠️ Última Tentativa',
    shortDesc: isCritical ? 'Risco crítico' : 'Desconto 25-35%',
    description: isCritical 
      ? 'Empresa em situação crítica. Oferta final antes de write-off ou ação legal.'
      : 'Cliente difícil. Ofereça desconto máximo (25-35%) como última tentativa.',
    icon: AlertTriangle,
    actionIcon: MessageSquare,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    bgGradient: 'bg-gradient-to-r from-red-50 to-red-100',
    iconBg: 'bg-white',
    badgeBg: 'bg-white',
    borderColor: 'border-red-300',
    buttonClass: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white',
    urgency: 'CRÍTICO',
    actionText: isCritical ? 'Oferta final de 35% desconto' : 'Mensagem com desconto máximo',
    buttonText: isCritical ? 'Enviar Última Oferta' : 'Enviar Proposta Final',
    successRate: isCritical ? 'Taxa de sucesso: 20-30%' : 'Taxa de sucesso: 30-50%'
  };
}

function handleAction(
  type: string,
  data: { clientName: string; phone?: string; debtAmount: number }
) {
  switch (type) {
    case 'immediate':
      if (data.phone) {
        const message = encodeURIComponent(
          `Olá ${data.clientName}! Temos o pagamento de €${data.debtAmount.toFixed(2)} pendente. Pode regularizar agora pelo link: [LINK]`
        );
        window.open(`https://wa.me/${data.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
      }
      break;
      
    case 'discount':
      if (data.phone) {
        const discountAmount = (data.debtAmount * 0.10).toFixed(2);
        const finalAmount = (data.debtAmount * 0.90).toFixed(2);
        const message = encodeURIComponent(
          `Olá ${data.clientName}! Proposta especial: 10% de desconto no pagamento de €${data.debtAmount.toFixed(2)}. Pague hoje apenas €${finalAmount}! Desconto de €${discountAmount}. Aceita?`
        );
        window.open(`https://wa.me/${data.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
      }
      break;
      
    case 'negotiate':
      if (data.phone) {
        window.location.href = `tel:${data.phone}`;
      }
      break;
      
    case 'critical':
      if (data.phone) {
        const discountAmount = (data.debtAmount * 0.35).toFixed(2);
        const finalAmount = (data.debtAmount * 0.65).toFixed(2);
        const message = encodeURIComponent(
          `${data.clientName}, ÚLTIMA OPORTUNIDADE: 35% de desconto! De €${data.debtAmount.toFixed(2)} por apenas €${finalAmount}. Economiza €${discountAmount}. Válido SÓ HOJE!`
        );
        window.open(`https://wa.me/${data.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
      }
      break;
  }
}
