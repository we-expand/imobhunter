import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, Terminal, ExternalLink } from 'lucide-react';
import { ApolloDiagnosticTool } from './apollo-diagnostic-tool';

export function ApolloTroubleshootBanner() {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  if (showDiagnostic) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-6xl w-full my-8">
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold">🔍 Diagnóstico Apollo</h2>
            <Button variant="outline" onClick={() => setShowDiagnostic(false)}>
              Fechar
            </Button>
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <ApolloDiagnosticTool />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-orange-300 bg-gradient-to-r from-orange-50 to-red-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-orange-900 mb-2">
              ⚠️ Vendo Dados DEMO? Vamos Resolver Isso!
            </h3>
            <p className="text-sm text-orange-800 mb-4">
              Se você está vendo resultados <strong>DEMO/MOCKADOS</strong>, significa que o Apollo não está configurado corretamente.
              Use nossa ferramenta de diagnóstico para identificar e corrigir o problema!
            </p>
            
            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-orange-900 mb-2">
                🔍 O Diagnóstico vai verificar:
              </p>
              <ul className="text-sm text-orange-800 space-y-1 list-disc list-inside">
                <li>Se APOLLO_API_KEY está no Supabase</li>
                <li>Se a API key é válida (Apollo aceita)</li>
                <li>Se a busca retorna dados REAIS ou DEMO</li>
                <li>Qual a causa raiz do problema</li>
                <li>Como resolver passo a passo</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setShowDiagnostic(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Terminal className="w-4 h-4 mr-2" />
                Executar Diagnóstico Completo
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('/TESTE_APOLLO_AGORA.md', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Guia Passo a Passo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
