import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LeadFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: {
    id: string;
    name: string;
    score?: number;
  };
}

export function LeadFeedbackModal({ isOpen, onClose, lead }: LeadFeedbackModalProps) {
  const [outcome, setOutcome] = useState<string>('');
  const [valorVenda, setValorVenda] = useState('');
  const [tempoConversao, setTempoConversao] = useState('');
  const [notas, setNotas] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!outcome) {
      toast.error('Selecione o resultado do lead');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-feedback/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            leadId: lead.id,
            leadName: lead.name,
            outcome,
            valorVenda: valorVenda ? parseFloat(valorVenda) : undefined,
            tempoAteConversao: tempoConversao ? parseInt(tempoConversao) : undefined,
            notasInternas: notas,
            scoreLead: lead.score || 0,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        toast.success('✅ Feedback registrado!', {
          description: 'A IA vai aprender com este resultado'
        });
        onClose();
      } else {
        toast.error('Erro ao enviar feedback');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao enviar feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Feedback do Lead: {lead.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Outcome Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Qual foi o resultado final deste lead?
            </Label>
            <RadioGroup value={outcome} onValueChange={setOutcome}>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                  <RadioGroupItem value="venda_fechada" id="venda" />
                  <div className="flex items-center gap-2 flex-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Venda Fechada 🎉</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                  <RadioGroupItem value="em_negociacao" id="negociacao" />
                  <div className="flex items-center gap-2 flex-1">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Em Negociação 🔄</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors">
                  <RadioGroupItem value="sem_interesse" id="sem-interesse" />
                  <div className="flex items-center gap-2 flex-1">
                    <XCircle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Sem Interesse ⚠️</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
                  <RadioGroupItem value="perdido" id="perdido" />
                  <div className="flex items-center gap-2 flex-1">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium">Perdido ❌</span>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Valor da Venda (se fechada) */}
          {outcome === 'venda_fechada' && (
            <div>
              <Label htmlFor="valor">Valor da Venda (€)</Label>
              <Input
                id="valor"
                type="number"
                placeholder="Ex: 250000"
                value={valorVenda}
                onChange={(e) => setValorVenda(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          {/* Tempo até conversão (se fechada ou em negociação) */}
          {(outcome === 'venda_fechada' || outcome === 'em_negociacao') && (
            <div>
              <Label htmlFor="tempo">Tempo até {outcome === 'venda_fechada' ? 'Fechamento' : 'Negociação'} (dias)</Label>
              <Input
                id="tempo"
                type="number"
                placeholder="Ex: 15"
                value={tempoConversao}
                onChange={(e) => setTempoConversao(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          {/* Notas Internas */}
          <div>
            <Label htmlFor="notas">Notas Internas (opcional)</Label>
            <Textarea
              id="notas"
              placeholder="Ex: Lead muito qualificado, fechou rápido. Interessado em imóveis de luxo..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="mt-2 min-h-24"
            />
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              🧠 <strong>A IA vai aprender:</strong> Este feedback ajuda a IA a entender quais leads 
              realmente convertem e melhorar a precisão das próximas entregas.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!outcome || submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
