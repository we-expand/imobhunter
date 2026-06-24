/**
 * 🎭 BANNER DE DADOS DE DEMONSTRAÇÃO
 * 
 * Aviso claro quando o sistema está usando dados mockados
 * ao invés de dados reais das APIs
 */

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface DemoDataBannerProps {
  onDismiss?: () => void;
}

export const DemoDataBanner: React.FC<DemoDataBannerProps> = ({ onDismiss }) => {
  return (
    <Card className="relative overflow-hidden border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,.1) 10px,
            rgba(0,0,0,.1) 20px
          )`
        }} />
      </div>

      {/* Content */}
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
              🎭 Modo Demonstração Ativo
            </h3>
            
            <div className="space-y-3 text-yellow-800 dark:text-yellow-200">
              <p className="font-semibold">
                Você está visualizando <span className="underline decoration-2 decoration-yellow-500">dados simulados de demonstração</span>.
              </p>
              
              <p className="text-sm">
                <strong>Por quê?</strong> O servidor Supabase ainda não foi deployado com as correções de CORS necessárias para acessar as APIs reais.
              </p>

              <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-yellow-500/30">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  ✅ Para obter dados REAIS das APIs:
                </p>
                <ol className="text-sm space-y-2 list-decimal list-inside ml-2">
                  <li>
                    <strong>Deploy o servidor atualizado:</strong>
                    <code className="ml-2 px-2 py-1 bg-black/10 dark:bg-white/10 rounded text-xs font-mono">
                      supabase functions deploy server
                    </code>
                  </li>
                  <li>Aguarde 30 segundos</li>
                  <li>Recarregue esta página (Ctrl+Shift+R)</li>
                  <li>Faça uma nova busca - agora com dados reais!</li>
                </ol>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span>
                  Enquanto isso, você pode explorar todas as funcionalidades com dados simulados realistas
                </span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 flex items-center justify-center transition-colors"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
            </button>
          )}
        </div>

        {/* Documentation Link */}
        <div className="mt-4 pt-4 border-t border-yellow-500/30">
          <a
            href="#deploy-instructions"
            className="text-sm text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 underline font-medium"
            onClick={(e) => {
              e.preventDefault();
              // Scroll to instructions or open modal
              alert('📋 Instruções de deploy disponíveis em /DEPLOY_INSTRUCTIONS.md');
            }}
          >
            📖 Ver instruções completas de deploy →
          </a>
        </div>
      </div>
    </Card>
  );
};

/**
 * 🎭 BADGE COMPACTO - Para mostrar em resultados individuais
 */
export const DemoDataBadge: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-500/30 rounded-full text-xs font-medium text-yellow-700 dark:text-yellow-300">
      <AlertTriangle className="w-3 h-3" />
      <span>Demo Data</span>
    </div>
  );
};
