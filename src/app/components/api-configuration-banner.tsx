import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, AlertTriangle, ExternalLink, CheckCircle, Settings } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function APIConfigurationBanner() {
  const [visible, setVisible] = useState(false);
  const [apolloConfigured, setApolloConfigured] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkApolloStatus();
  }, []);

  const checkApolloStatus = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/diagnostics/check-apollo`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const isConfigured = data.configured && data.valid;
        setApolloConfigured(isConfigured);
        
        // Só mostra banner se NÃO estiver configurado
        if (!isConfigured) {
          setVisible(true);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar Apollo:', error);
      setVisible(true); // Mostra por precaução
    } finally {
      setChecking(false);
    }
  };

  const dismissBanner = () => {
    setVisible(false);
    localStorage.setItem('api-banner-dismissed', 'true');
  };

  // Não mostra se já foi dispensado hoje
  useEffect(() => {
    const dismissed = localStorage.getItem('api-banner-dismissed');
    const today = new Date().toDateString();
    const dismissedDate = localStorage.getItem('api-banner-dismissed-date');
    
    if (dismissed && dismissedDate === today) {
      setVisible(false);
    } else {
      localStorage.removeItem('api-banner-dismissed');
      localStorage.setItem('api-banner-dismissed-date', today);
    }
  }, []);

  if (!visible || checking || apolloConfigured) {
    return null;
  }

  return (
    <Card className="fixed bottom-6 right-6 max-w-md z-50 shadow-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 animate-slide-up">
      <div className="p-6 relative">
        {/* Close Button */}
        <button
          onClick={dismissBanner}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              ⚠️ APIs não configuradas
            </h3>
            <p className="text-sm text-gray-700">
              Configure agora para habilitar buscas reais de leads
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-red-100 text-red-700 border-red-300">
              Apollo.io
            </Badge>
            <span className="text-gray-600">Não configurado</span>
          </div>
          <p className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
            💡 <strong>Dica:</strong> Apollo tem plano GRÁTIS com 50 leads/mês!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={() => {
              window.location.hash = '#/settings';
              dismissBanner();
            }}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurar Agora (5 min)
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              window.open('/CONFIGURAR-AGORA.md', '_blank');
            }}
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Guia Rápido
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Clique no X para dispensar por hoje
        </p>
      </div>
    </Card>
  );
}

// Adicionar CSS para animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-up {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
`;
document.head.appendChild(style);
