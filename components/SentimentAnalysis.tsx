import { useState, useEffect } from 'react';
import { MessageSquare, SmilePlus, Meh, Frown, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { API_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

interface SentimentAnalysis {
  sentiment: 'positivo' | 'neutro' | 'negativo' | 'irritado' | 'propenso';
  confidence: number;
  keywords: string[];
  suggestedResponse: string;
  emotionFactors: {
    anger: number;
    frustration: number;
    willingness: number;
    urgency: number;
  };
}

interface SentimentAnalysisProps {
  message: string;
  autoAnalyze?: boolean;
}

export function SentimentAnalysisCard({ message, autoAnalyze = true }: SentimentAnalysisProps) {
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (autoAnalyze && message && message.length > 3) {
      analyzeSentiment();
    }
  }, [message, autoAnalyze]);

  const analyzeSentiment = async () => {
    if (!message) return;

    setIsAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const res = await fetch(`${API_URL}/ai/analyze-sentiment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Erro ao analisar sentimento:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analysis) {
    if (isAnalyzing) {
      return (
        <Card className="shadow-lg border-2 border-slate-200">
          <CardContent className="pt-6 text-center">
            <div className="text-sm text-slate-500">🧠 A analisar sentimento...</div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return <SmilePlus className="w-6 h-6 text-green-600" />;
      case 'propenso':
        return <TrendingUp className="w-6 h-6 text-emerald-600" />;
      case 'neutro':
        return <Meh className="w-6 h-6 text-slate-600" />;
      case 'negativo':
        return <Frown className="w-6 h-6 text-orange-600" />;
      case 'irritado':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <MessageSquare className="w-6 h-6 text-slate-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return 'from-green-50 to-emerald-50';
      case 'propenso':
        return 'from-emerald-50 to-cyan-50';
      case 'neutro':
        return 'from-slate-50 to-gray-50';
      case 'negativo':
        return 'from-orange-50 to-yellow-50';
      case 'irritado':
        return 'from-red-50 to-pink-50';
      default:
        return 'from-slate-50 to-gray-50';
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'propenso':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'neutro':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'negativo':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'irritado':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positivo':
        return 'Positivo';
      case 'propenso':
        return 'Propenso a Pagar';
      case 'neutro':
        return 'Neutro';
      case 'negativo':
        return 'Negativo';
      case 'irritado':
        return 'Irritado';
      default:
        return sentiment;
    }
  };

  return (
    <Card className="shadow-lg border-2 border-cyan-100">
      <CardHeader className={`bg-gradient-to-r ${getSentimentColor(analysis.sentiment)} pb-4`}>
        <CardTitle className="flex items-center gap-3 text-cyan-700">
          <div className="bg-cyan-100 p-2 rounded-lg">
            <MessageSquare className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <div>Análise de Sentimento - IA</div>
            <div className="text-sm font-normal text-slate-600">
              Detecta emoção e sugere abordagem
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Sentimento Principal */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`p-4 rounded-full ${
              analysis.sentiment === 'positivo' || analysis.sentiment === 'propenso'
                ? 'bg-green-100'
                : analysis.sentiment === 'irritado'
                ? 'bg-red-100'
                : 'bg-slate-100'
            }`}>
              {getSentimentIcon(analysis.sentiment)}
            </div>
            
            <div className="text-left">
              <Badge className={`${getSentimentBadgeColor(analysis.sentiment)} border-2 px-4 py-2 text-base`}>
                {getSentimentLabel(analysis.sentiment)}
              </Badge>
              <div className="text-sm text-slate-500 mt-1">
                {analysis.confidence}% de confiança
              </div>
            </div>
          </div>

          {/* Barra de confiança */}
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                analysis.confidence >= 75 ? 'bg-emerald-500' :
                analysis.confidence >= 50 ? 'bg-cyan-500' :
                'bg-slate-400'
              }`}
              style={{ width: `${analysis.confidence}%` }}
            />
          </div>
        </div>

        {/* Mensagem analisada */}
        <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-600 mb-2">Mensagem do Cliente:</div>
          <p className="text-sm italic text-slate-700">"{message}"</p>
        </div>

        {/* Fatores Emocionais */}
        <div>
          <div className="text-sm font-semibold text-slate-700 mb-3">
            📊 Fatores Emocionais Detectados:
          </div>
          
          <div className="space-y-3">
            {/* Raiva */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-red-700">😠 Raiva</span>
                <span className="text-xs font-bold text-red-700">{analysis.emotionFactors.anger}%</span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.emotionFactors.anger}%` }}
                />
              </div>
            </div>

            {/* Frustração */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-orange-700">😟 Frustração</span>
                <span className="text-xs font-bold text-orange-700">{analysis.emotionFactors.frustration}%</span>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.emotionFactors.frustration}%` }}
                />
              </div>
            </div>

            {/* Disposição */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-emerald-700">😊 Disposição</span>
                <span className="text-xs font-bold text-emerald-700">{analysis.emotionFactors.willingness}%</span>
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.emotionFactors.willingness}%` }}
                />
              </div>
            </div>

            {/* Urgência */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-blue-700">⚡ Urgência</span>
                <span className="text-xs font-bold text-blue-700">{analysis.emotionFactors.urgency}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.emotionFactors.urgency}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Palavras-chave detectadas */}
        {analysis.keywords.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-2">
              🔍 Palavras-chave detectadas:
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Sugestão de Resposta */}
        <div className={`border-2 rounded-xl p-4 ${
          analysis.sentiment === 'propenso' || analysis.sentiment === 'positivo'
            ? 'bg-emerald-50 border-emerald-200'
            : analysis.sentiment === 'irritado'
            ? 'bg-red-50 border-red-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              analysis.sentiment === 'propenso' || analysis.sentiment === 'positivo'
                ? 'bg-emerald-100'
                : analysis.sentiment === 'irritado'
                ? 'bg-red-100'
                : 'bg-blue-100'
            }`}>
              <TrendingUp className={`w-5 h-5 ${
                analysis.sentiment === 'propenso' || analysis.sentiment === 'positivo'
                  ? 'text-emerald-600'
                  : analysis.sentiment === 'irritado'
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`} />
            </div>
            <div>
              <div className={`font-semibold mb-2 ${
                analysis.sentiment === 'propenso' || analysis.sentiment === 'positivo'
                  ? 'text-emerald-700'
                  : analysis.sentiment === 'irritado'
                  ? 'text-red-700'
                  : 'text-blue-700'
              }`}>
                💡 Como Responder:
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {analysis.suggestedResponse}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
