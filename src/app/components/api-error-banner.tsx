import React from 'react';
import { useTheme } from '../lib/ThemeContext';
import { AlertCircle, X, Settings, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ApiErrorBannerProps {
  errors: Array<{
    api: string;
    error: string;
    solution: string;
  }>;
  onDismiss: () => void;
  onConfigure: () => void;
}

export function ApiErrorBanner({ errors, onDismiss, onConfigure }: ApiErrorBannerProps) {
  const { theme } = useTheme();
  
  // Verificar se são erros de autenticação (401) - esperados em modo demo
  const hasAuthErrors = errors.some(e => 
    e.error.includes('401') || 
    e.error.includes('invalid api key') ||
    e.error.includes('authentication')
  );
  
  // Se são só erros de autenticação, mostrar banner mais amigável
  if (hasAuthErrors && errors.length > 0) {
    return (
      <div className={`relative rounded-2xl border-2 overflow-hidden ${
        theme === 'dark' 
          ? 'bg-yellow-900/20 border-yellow-700/50' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Info className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className={`font-semibold text-lg mb-2 ${
                theme === 'dark' ? 'text-yellow-200' : 'text-yellow-900'
              }`}>
                🎭 Modo Demonstração Ativo
              </h3>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
              }`}>
                Estamos usando <strong>dados de demonstração</strong> porque as API keys externas não estão configuradas ou são inválidas.
                Isso é completamente normal para testar o sistema!
              </p>
              
              <div className={`p-4 rounded-lg mb-4 ${
                theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
              }`}>
                <p className="text-sm font-medium mb-2">
                  ✅ O que está funcionando:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Sistema de busca totalmente funcional</li>
                  <li>12 leads de demonstração de alta qualidade</li>
                  <li>Filtros e interface completos</li>
                  <li>Todos os recursos do sistema</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={onConfigure}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar APIs Reais
                </Button>
                <Button
                  onClick={onDismiss}
                  size="sm"
                  variant="outline"
                  className={theme === 'dark' ? 'border-yellow-700' : 'border-yellow-300'}
                >
                  Continuar com Demo
                </Button>
              </div>
            </div>
            
            <button
              onClick={onDismiss}
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-yellow-800/30 text-yellow-400' 
                  : 'hover:bg-yellow-200 text-yellow-700'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Banner de erro normal para outros tipos de erro
  return (
    <div className={`relative rounded-2xl border-2 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-red-900/20 border-red-700/50' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-lg mb-2 ${
              theme === 'dark' ? 'text-red-200' : 'text-red-900'
            }`}>
              Problemas com APIs Externas
            </h3>
            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-red-300' : 'text-red-800'
            }`}>
              Algumas APIs retornaram erros. O sistema está usando dados de demonstração.
            </p>
            
            <div className="space-y-2 mb-4">
              {errors.slice(0, 3).map((error, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {error.api}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-80">{error.error}</p>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={onConfigure}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurar APIs
              </Button>
              <Button
                onClick={onDismiss}
                size="sm"
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          </div>
          
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-red-800/30 text-red-400' 
                : 'hover:bg-red-200 text-red-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}