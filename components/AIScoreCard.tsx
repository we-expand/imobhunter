import { Brain, TrendingUp, AlertCircle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface PropensityScore {
  score: number;
  level: 'muito_alta' | 'alta' | 'media' | 'baixa' | 'muito_baixa';
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
  recommendation: string;
  bestContactTime: string;
  bestChannel: 'whatsapp' | 'email' | 'call';
  estimatedPaymentDate?: string;
}

interface AIScoreCardProps {
  score: PropensityScore;
  clientName: string;
}

export function AIScoreCard({ score, clientName }: AIScoreCardProps) {
  // Cores baseadas no nível
  const getLevelColor = (level: PropensityScore['level']) => {
    switch (level) {
      case 'muito_alta':
        return 'bg-emerald-500';
      case 'alta':
        return 'bg-cyan-500';
      case 'media':
        return 'bg-yellow-500';
      case 'baixa':
        return 'bg-orange-500';
      case 'muito_baixa':
        return 'bg-red-500';
    }
  };

  const getLevelLabel = (level: PropensityScore['level']) => {
    switch (level) {
      case 'muito_alta':
        return 'Muito Alta';
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      case 'muito_baixa':
        return 'Muito Baixa';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return '💬';
      case 'email':
        return '📧';
      case 'call':
        return '📞';
      default:
        return '💬';
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'email':
        return 'Email';
      case 'call':
        return 'Chamada';
      default:
        return channel;
    }
  };

  return (
    <Card className="shadow-lg border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 pb-4">
        <CardTitle className="flex items-center gap-3 text-blue-700">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div>Score de Propensão - IA</div>
            <div className="text-sm font-normal text-slate-600">{clientName}</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Score Principal */}
        <div className="text-center">
          <div className="relative inline-block">
            {/* Círculo de progresso */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke={`url(#gradient-${score.level})`}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - score.score / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id={`gradient-${score.level}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Valor do score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {score.score}
              </div>
              <div className="text-sm text-slate-500">pontos</div>
            </div>
          </div>

          {/* Badge de nível */}
          <div className="mt-4">
            <Badge className={`${getLevelColor(score.level)} text-white px-4 py-2 text-sm`}>
              Propensão {getLevelLabel(score.level)}
            </Badge>
          </div>
        </div>

        {/* Recomendação Principal */}
        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-700 mb-1">Recomendação IA:</div>
              <p className="text-sm text-slate-700">{score.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Melhor canal e horário */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Melhor Canal</span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {getChannelIcon(score.bestChannel)} {getChannelLabel(score.bestChannel)}
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700">Melhor Horário</span>
            </div>
            <div className="text-sm font-bold text-purple-900">
              {score.bestContactTime}
            </div>
          </div>
        </div>

        {/* Data estimada de pagamento */}
        {score.estimatedPaymentDate && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-700 mb-1">
                  Previsão de Pagamento
                </div>
                <div className="font-bold text-amber-900">
                  {new Date(score.estimatedPaymentDate).toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fatores que influenciam */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">
              Fatores que Influenciam o Score:
            </span>
          </div>
          
          <div className="space-y-2">
            {score.factors.map((factor, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                  factor.impact > 0 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : factor.impact < 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${
                    factor.impact > 0 
                      ? 'text-emerald-700' 
                      : factor.impact < 0
                      ? 'text-red-700'
                      : 'text-slate-700'
                  }`}>
                    {factor.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {factor.description}
                  </div>
                </div>
                
                <Badge 
                  className={`ml-3 ${
                    factor.impact > 0 
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                      : factor.impact < 0
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  } border-2`}
                  variant="outline"
                >
                  {factor.impact > 0 ? '+' : ''}{factor.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
