import { Percent, TrendingUp, DollarSign, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface DiscountRecommendation {
  discountPercentage: number;
  finalAmount: number;
  reasoning: string;
  successProbability: number;
  expectedROI: number;
  alternatives: {
    option: string;
    discount: number;
    probability: number;
  }[];
}

interface DiscountRecommendationProps {
  recommendation: DiscountRecommendation;
  originalAmount: number;
  onApply?: (discount: number) => void;
}

export function DiscountRecommendationCard({ 
  recommendation, 
  originalAmount,
  onApply 
}: DiscountRecommendationProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <Card className="shadow-lg border-2 border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
        <CardTitle className="flex items-center gap-3 text-purple-700">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Percent className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div>Recomendação de Oferta - IA</div>
            <div className="text-sm font-normal text-slate-600">
              Desconto ideal para maximizar conversão
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Oferta Recomendada */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl">
          <div className="text-center space-y-4">
            <div className="inline-block bg-white/20 px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">🎯 Oferta Recomendada pela IA</span>
            </div>

            <div className="space-y-2">
              <div className="text-6xl font-bold">
                {recommendation.discountPercentage}%
              </div>
              <div className="text-lg opacity-90">de desconto</div>
            </div>

            <div className="bg-white/20 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="opacity-80">Valor Original:</span>
                <span className="font-semibold line-through">{formatCurrency(originalAmount)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t-2 border-white/30 pt-2">
                <span>Valor Final:</span>
                <span>{formatCurrency(recommendation.finalAmount)}</span>
              </div>
            </div>

            {onApply && (
              <Button 
                onClick={() => onApply(recommendation.discountPercentage)}
                className="w-full bg-white text-purple-600 hover:bg-purple-50 font-bold py-3"
                size="lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Aplicar Esta Oferta
              </Button>
            )}
          </div>
        </div>

        {/* Métricas de Conversão */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">
                Probabilidade de Sucesso
              </span>
            </div>
            <div className="text-3xl font-bold text-emerald-600">
              {recommendation.successProbability}%
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${recommendation.successProbability}%` }}
              />
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">
                ROI Esperado
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {(recommendation.expectedROI * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-blue-700 mt-1">
              {formatCurrency(recommendation.finalAmount * recommendation.expectedROI)}
            </div>
          </div>
        </div>

        {/* Raciocínio da IA */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-2">
                Por que este desconto?
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Alternativas */}
        <div>
          <div className="text-sm font-semibold text-slate-700 mb-3">
            💡 Outras Opções:
          </div>
          
          <div className="space-y-3">
            {recommendation.alternatives.map((alt, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => onApply?.(alt.discount)}
              >
                <div>
                  <div className="font-semibold text-slate-800">{alt.option}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {alt.discount > 0 && `Valor: ${formatCurrency(originalAmount * (1 - alt.discount / 100))}`}
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className="bg-slate-200 text-slate-700 border-slate-300">
                    {alt.probability}% chance
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Economia vs Perda */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-amber-700 mb-1">Cliente Economiza</div>
              <div className="text-2xl font-bold text-amber-600">
                {formatCurrency(originalAmount - recommendation.finalAmount)}
              </div>
            </div>
            <div>
              <div className="text-xs text-amber-700 mb-1">Empresa Recebe</div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(recommendation.finalAmount)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
