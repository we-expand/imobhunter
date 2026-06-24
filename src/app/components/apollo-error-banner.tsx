/**
 * 🚨 BANNER DE EMERGÊNCIA APOLLO API
 * Aparece NO TOPO da tela quando detectar erro 401
 */

import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, X, ExternalLink, Key } from 'lucide-react';

export function ApolloErrorBanner() {
  const [visible, setVisible] = useState(false); // Começa oculto
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Verificar se já foi dispensado
    const wasDismissed = localStorage.getItem('apollo_error_dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
      return;
    }

    // ✅ ESCUTAR EVENTO DE MODO MOCKADO
    const handleMockModeDetected = (event: any) => {
      console.log('🚨 Banner: Modo mockado detectado!', event.detail);
      setVisible(true);
      setDismissed(false);
    };

    window.addEventListener('apollo-mock-mode-detected', handleMockModeDetected);

    return () => {
      window.removeEventListener('apollo-mock-mode-detected', handleMockModeDetected);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('apollo_error_dismissed', 'true');
    setVisible(false);
    setDismissed(true);
  };

  const handleShowAgain = () => {
    localStorage.removeItem('apollo_error_dismissed');
    setVisible(true);
    setDismissed(false);
  };

  if (!visible && !dismissed) return null;

  // Botão pequeno para reabrir
  if (dismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleShowAgain}
          className="bg-red-600 hover:bg-red-500 text-white shadow-2xl"
          size="sm"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Mostrar aviso Apollo
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] p-4 bg-black/95 backdrop-blur-md border-b-4 border-red-500 shadow-2xl">
      <Card className="border-2 border-red-500 bg-gradient-to-r from-red-950/90 to-orange-950/90 shadow-2xl">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Ícone de alerta animado */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
                <div className="relative bg-red-500/20 p-3 rounded-full border-2 border-red-500">
                  <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 space-y-4">
              {/* Título */}
              <div>
                <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                  🚨 SISTEMA EM MODO DEMONSTRAÇÃO
                </h2>
                <p className="text-red-300 text-lg font-semibold">
                  A chave da Apollo.io está INVÁLIDA (Erro 401)
                </p>
              </div>

              {/* Explicação */}
              <div className="bg-black/40 border border-red-500/30 rounded-lg p-4 space-y-3">
                <p className="text-white text-base">
                  <strong className="text-red-400">O que está acontecendo:</strong>
                </p>
                <ul className="text-zinc-300 text-sm space-y-2 list-disc list-inside ml-2">
                  <li>O sistema está usando <strong className="text-yellow-400">DADOS FALSOS de demonstração</strong></li>
                  <li>A chave Apollo API atual (<code className="bg-black/50 px-1 rounded text-red-400">zZwssuQgi8KPgJDlbT0Otg</code>) está <strong className="text-red-400">INVÁLIDA (Erro 401)</strong></li>
                  <li>Você precisa obter uma <strong className="text-emerald-400">chave VÁLIDA e ATIVA</strong> no painel da Apollo.io</li>
                  <li>Sem uma chave válida, os leads exibidos são <strong className="text-yellow-400">FICTÍCIOS (apenas demonstração)</strong></li>
                </ul>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    // Navegar para diagnóstico
                    const event = new CustomEvent('navigate-to-diagnostics');
                    window.dispatchEvent(event);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 px-6"
                >
                  <Key className="w-5 h-5 mr-2" />
                  Abrir Assistente de Chave API
                </Button>
                
                <Button
                  onClick={() => window.open('https://app.apollo.io/#/settings/integrations', '_blank')}
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 h-12 px-6"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Ir para Apollo.io
                </Button>

                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  className="text-zinc-400 hover:text-white hover:bg-white/10 h-12 px-6"
                >
                  <X className="w-5 h-5 mr-2" />
                  Dispensar (Continuar com dados falsos)
                </Button>
              </div>

              {/* Nota final */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3">
                <p className="text-amber-300 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>IMPORTANTE:</strong> Apollo.io é um serviço pago. Você precisa ter uma conta ativa e gerar sua própria API Key.
                    As chaves fornecidas anteriormente não funcionam porque foram revogadas ou nunca foram válidas.
                  </span>
                </p>
              </div>
            </div>

            {/* Botão fechar (canto superior direito) */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-400 hover:text-white" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}