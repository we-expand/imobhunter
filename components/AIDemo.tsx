import { useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { AIScoreCard } from './AIScoreCard';
import { DiscountRecommendationCard } from './DiscountRecommendation';
import { SentimentAnalysisCard } from './SentimentAnalysis';
import { API_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

// Validador de NIF português
function validateNIF(nif: string): boolean {
  // Remove espaços e caracteres não numéricos
  const nifCleaned = nif.replace(/\D/g, '');
  
  // Deve ter exatamente 9 dígitos
  if (nifCleaned.length !== 9) {
    return false;
  }
  
  // Primeiro dígito deve ser 1, 2, 3, 5, 6, 8 ou 9
  const firstDigit = parseInt(nifCleaned[0]);
  if (![1, 2, 3, 5, 6, 8, 9].includes(firstDigit)) {
    return false;
  }
  
  // Algoritmo de validação (checksum)
  const digits = nifCleaned.split('').map(d => parseInt(d));
  const checksum = 
    digits[0] * 9 +
    digits[1] * 8 +
    digits[2] * 7 +
    digits[3] * 6 +
    digits[4] * 5 +
    digits[5] * 4 +
    digits[6] * 3 +
    digits[7] * 2;
  
  const remainder = checksum % 11;
  const checkDigit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
  
  return checkDigit === digits[8];
}

export function AIDemo() {
  const [clientName, setClientName] = useState('João Silva');
  const [clientNIF, setClientNIF] = useState('');
  const [debtAmount, setDebtAmount] = useState(500);
  const [daysOverdue, setDaysOverdue] = useState(15);
  const [testMessage, setTestMessage] = useState('');
  
  const [propensityScore, setPropensityScore] = useState<any>(null);
  const [discountRec, setDiscountRec] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Dados de exemplo para teste
  const exampleClient = {
    id: 'demo-1',
    name: clientName,
    email: 'joao.silva@example.com',
    phone: '+351 912345678',
    debtAmount: debtAmount,
    daysOverdue: daysOverdue,
    paymentHistory: [
      {
        date: '2024-10-15',
        amount: 250,
        daysLate: 3,
        paymentMethod: 'pix',
        dayOfMonth: 5
      },
      {
        date: '2024-09-05',
        amount: 300,
        daysLate: 5,
        paymentMethod: 'pix',
        dayOfMonth: 5
      },
      {
        date: '2024-08-07',
        amount: 200,
        daysLate: 2,
        paymentMethod: 'pix',
        dayOfMonth: 5
      }
    ],
    lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    preferredPaymentMethod: 'pix' as const,
    preferredPaymentDay: 5,
    behaviorProfile: 'prompt' as const
  };

  const calculateScore = async () => {
    // Validação de NIF obrigatório
    if (!clientNIF || clientNIF.trim().length === 0) {
      toast.error('Insira o NIF do devedor');
      return;
    }

    // Validação básica do NIF (9 dígitos)
    const nifCleaned = clientNIF.replace(/\D/g, '');
    if (nifCleaned.length !== 9) {
      toast.error('NIF inválido - deve ter 9 dígitos');
      return;
    }

    // Validação do NIF português
    if (!validateNIF(clientNIF)) {
      toast.error('NIF inválido - formato incorreto');
      return;
    }

    setIsCalculating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      // Calcular score de propensão
      const scoreRes = await fetch(`${API_URL}/ai/propensity-score`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exampleClient)
      });

      if (scoreRes.ok) {
        const scoreData = await scoreRes.json();
        setPropensityScore(scoreData.score);

        // Recomendar desconto
        const discountRes = await fetch(`${API_URL}/ai/recommend-discount`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            clientProfile: exampleClient,
            propensityScore: scoreData.score.score
          })
        });

        if (discountRes.ok) {
          const discountData = await discountRes.json();
          setDiscountRec(discountData.recommendation);
        }

        toast.success('✅ Análise IA concluída!');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const exampleMessages = [
    'Sim, posso pagar hoje mesmo! Vocês aceitam Pix?',
    'NÃO POSSO PAGAR! Estou desempregado, isto é um absurdo!',
    'Olá, gostaria de negociar um desconto para pagar à vista.',
    'Não vou pagar, vou procurar um advogado!',
    'Tenho dificuldades financeiras mas quero resolver isto.'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-full mb-4">
            <Brain className="w-6 h-6" />
            <span className="font-bold text-lg">Motor de IA do Tá Pago.pt</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Demonstração de Inteligência Artificial
          </h1>
          <p className="text-slate-600 text-lg">
            Tecnologia preditiva que define quem pagar, quando contactar e qual oferta fazer
          </p>
        </div>

        {/* Configuração do Teste */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            Configure o Cliente para Análise
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nome do Cliente
              </label>
              <Input 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                NIF do Cliente
              </label>
              <Input 
                value={clientNIF}
                onChange={(e) => setClientNIF(e.target.value)}
                placeholder="123456789"
                maxLength={9}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Valor da Dívida (€)
              </label>
              <Input 
                type="number"
                value={debtAmount}
                onChange={(e) => setDebtAmount(Number(e.target.value))}
                placeholder="Valor"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Dias em Atraso
              </label>
              <Input 
                type="number"
                value={daysOverdue}
                onChange={(e) => setDaysOverdue(Number(e.target.value))}
                placeholder="Dias"
              />
            </div>
          </div>

          <Button 
            onClick={calculateScore}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white py-6 text-lg"
            size="lg"
          >
            {isCalculating ? (
              <>🔄 A calcular...</>
            ) : (
              <>
                <Brain className="w-6 h-6 mr-2" />
                Analisar com IA
              </>
            )}
          </Button>
        </div>

        {/* Resultados */}
        {propensityScore && discountRec && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIScoreCard 
              score={propensityScore}
              clientName={clientName}
            />
            
            <DiscountRecommendationCard 
              recommendation={discountRec}
              originalAmount={debtAmount}
              onApply={(discount) => {
                toast.success(`Desconto de ${discount}% aplicado!`);
              }}
            />
          </div>
        )}

        {/* Análise de Sentimento */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-500" />
            Análise de Sentimento em Tempo Real
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mensagem do Cliente
            </label>
            <Textarea 
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Digite ou escolha uma mensagem de exemplo abaixo..."
              rows={3}
              className="mb-3"
            />

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold text-slate-600">Exemplos:</span>
              {exampleMessages.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setTestMessage(msg)}
                  className="text-xs"
                >
                  Exemplo {index + 1}
                </Button>
              ))}
            </div>
          </div>

          {testMessage && testMessage.length > 3 && (
            <SentimentAnalysisCard 
              message={testMessage}
              autoAnalyze={true}
            />
          )}
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold mb-4">🧠 Como funciona a IA do Tá Pago.pt</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold mb-2">Score de Propensão</h4>
              <p className="text-sm opacity-90">
                Prevê quem vai pagar baseado no histórico, comportamento e perfil do cliente
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-bold mb-2">Recomendação de Oferta</h4>
              <p className="text-sm opacity-90">
                Calcula o desconto ideal que maximiza conversão sem perder receita
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl mb-2">💬</div>
              <h4 className="font-bold mb-2">Análise de Sentimento</h4>
              <p className="text-sm opacity-90">
                Detecta emoção do cliente e sugere a melhor abordagem de resposta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}