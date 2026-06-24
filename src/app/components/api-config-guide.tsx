import { AlertTriangle, Key, ExternalLink, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useTheme } from '../lib/ThemeContext';

interface ApiConfigGuideProps {
  onOpenSettings: () => void;
}

export function ApiConfigGuide({ onOpenSettings }: ApiConfigGuideProps) {
  const { theme } = useTheme();

  return (
    <Card className={`p-8 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-yellow-200 bg-yellow-50'}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-yellow-500 rounded-xl">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              🔑 Configure as API Keys para Buscar Leads Reais
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
              Para buscar leads REAIS nas plataformas Apollo.io, LinkedIn, Hunter e outras, você precisa configurar as chaves de API no Supabase.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Key className="w-4 h-4" />
              Como Configurar (3 passos simples):
            </h4>
            
            <div className="space-y-2 pl-6">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">1. Acesse o Dashboard do Supabase</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vá para{' '}
                    <a 
                      href="https://supabase.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 underline inline-flex items-center gap-1"
                    >
                      supabase.com/dashboard
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">2. Navegue até Edge Functions → Secrets</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No menu lateral, clique em "Edge Functions" e depois em "Secrets"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">3. Configure as seguintes variáveis:</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2 font-mono bg-slate-900 text-green-400 px-3 py-1 rounded">
                      <code>APOLLO_API_KEY</code>
                      <span className="text-gray-400">→</span>
                      <a 
                        href="https://app.apollo.io/#/settings/integrations/api" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Obter key
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-mono bg-slate-900 text-green-400 px-3 py-1 rounded">
                      <code>HUNTER_API_KEY</code>
                      <span className="text-gray-400">→</span>
                      <a 
                        href="https://hunter.io/api-keys" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Obter key
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-mono bg-slate-900 text-green-400 px-3 py-1 rounded">
                      <code>PROXYCURL_API_KEY</code>
                      <span className="text-gray-400">→</span>
                      <a 
                        href="https://nubela.co/proxycurl/pricing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Obter key
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-mono bg-slate-900 text-green-400 px-3 py-1 rounded">
                      <code>PDL_API_KEY</code>
                      <span className="text-gray-400">→</span>
                      <a 
                        href="https://www.peopledatalabs.com/signup" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Obter key
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-mono bg-slate-900 text-green-400 px-3 py-1 rounded">
                      <code>ROCKETREACH_API_KEY</code>
                      <span className="text-gray-400">→</span>
                      <a 
                        href="https://rocketreach.co/api" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Obter key
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} border border-blue-500/20`}>
            <p className="text-sm">
              <strong>💡 Dica:</strong> Você pode começar apenas com a <code className="px-1 py-0.5 bg-slate-900 text-green-400 rounded">APOLLO_API_KEY</code>. 
              As outras APIs são opcionais e servem para enriquecer ainda mais os dados dos leads.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onOpenSettings}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Key className="w-4 h-4 mr-2" />
              Ir para Configurações
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Supabase Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
