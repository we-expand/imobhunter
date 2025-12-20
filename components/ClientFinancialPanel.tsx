import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { FinancialPanorama } from './FinancialPanorama';

interface ClientFinancialPanelProps {
  nif: string;
  clientName: string;
  onScoreUpdate?: (score: number, risk: string) => void;
}

export function ClientFinancialPanel({ nif, clientName, onScoreUpdate }: ClientFinancialPanelProps) {
  const [showPanorama, setShowPanorama] = useState(false);

  if (!nif || nif.length < 9) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
        <div className="flex items-center gap-2 text-slate-500">
          <Sparkles className="w-4 h-4" />
          <p className="text-sm">
            Adicione um NIF válido para consultar dados financeiros externos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showPanorama && (
        <Button
          onClick={() => setShowPanorama(true)}
          variant="outline"
          className="w-full border-cyan-200 text-cyan-700 hover:bg-cyan-50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Ver Panorama Financeiro (IA)
        </Button>
      )}

      {showPanorama && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700">Análise Externa com IA</h3>
            <Button
              onClick={() => setShowPanorama(false)}
              variant="ghost"
              size="sm"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
          <FinancialPanorama
            nif={nif}
            clientName={clientName}
            onScoreUpdate={onScoreUpdate}
          />
        </div>
      )}
    </div>
  );
}
