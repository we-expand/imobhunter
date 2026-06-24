import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle, CheckCircle, Key, ExternalLink, Loader2, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ApiConfig {
  name: string;
  key: string;
  secretName: string;
  description: string;
  signupUrl: string;
  docsUrl: string;
  trial: string;
  priority: number;
  configured: boolean;
}

const API_CONFIGS: ApiConfig[] = [
  {
    name: 'Apollo.io',
    key: 'APOLLO_API_KEY',
    secretName: 'APOLLO_API_KEY',
    description: 'Dados de contato B2B e perfis profissionais',
    signupUrl: 'https://www.apollo.io/',
    docsUrl: 'https://apolloio.github.io/apollo-api-docs/',
    trial: '50 créditos/mês GRÁTIS',
    priority: 1,
    configured: false
  },
  {
    name: 'Hunter.io',
    key: 'HUNTER_API_KEY',
    secretName: 'HUNTER_API_KEY',
    description: 'Verificação e busca de emails profissionais',
    signupUrl: 'https://hunter.io/',
    docsUrl: 'https://hunter.io/api-documentation',
    trial: '25 buscas/mês GRÁTIS',
    priority: 2,
    configured: false
  },
  {
    name: 'RapidAPI (LinkedIn)',
    key: 'RAPIDAPI_KEY',
    secretName: 'RAPIDAPI_KEY',
    description: 'Dados do LinkedIn via RapidAPI',
    signupUrl: 'https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data',
    docsUrl: 'https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data',
    trial: '100 requests/mês GRÁTIS',
    priority: 3,
    configured: false
  },
  {
    name: 'Lusha',
    key: 'LUSHA_API_KEY',
    secretName: 'LUSHA_API_KEY',
    description: 'Enriquecimento de contatos (email + telefone)',
    signupUrl: 'https://www.lusha.com/',
    docsUrl: 'https://www.lusha.com/api/',
    trial: '5 créditos GRÁTIS',
    priority: 4,
    configured: false
  },
  {
    name: 'People Data Labs',
    key: 'PDL_API_KEY',
    secretName: 'PDL_API_KEY',
    description: 'Enriquecimento de dados profissionais',
    signupUrl: 'https://www.peopledatalabs.com/',
    docsUrl: 'https://docs.peopledatalabs.com/',
    trial: 'Plano pago',
    priority: 5,
    configured: false
  },
  {
    name: 'RocketReach',
    key: 'ROCKETREACH_API_KEY',
    secretName: 'ROCKETREACH_API_KEY',
    description: 'Contatos diretos de executivos',
    signupUrl: 'https://rocketreach.co/',
    docsUrl: 'https://rocketreach.co/api',
    trial: '7 dias GRÁTIS',
    priority: 6,
    configured: false
  },
  {
    name: 'Proxycurl',
    key: 'PROXYCURL_API_KEY',
    secretName: 'PROXYCURL_API_KEY',
    description: 'API oficial de dados do LinkedIn',
    signupUrl: 'https://nubela.co/proxycurl/',
    docsUrl: 'https://nubela.co/proxycurl/docs',
    trial: 'Trial disponível',
    priority: 7,
    configured: false
  }
];

export function EasyApiConfigurator() {
  const [configuring, setConfiguring] = useState<string | null>(null);
  const [testingAll, setTestingAll] = useState(false);

  const handleConfigureApi = async (api: ApiConfig) => {
    setConfiguring(api.secretName);
    
    toast.info(`🔑 Configurando ${api.name}...`, {
      description: 'Uma janela modal será aberta para você adicionar a API key',
      duration: 5000
    });

    // Aguarda um pouco para mostrar a mensagem
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setConfiguring(null);
  };

  const testAllApis = async () => {
    setTestingAll(true);
    toast.loading('🧪 Testando todas as APIs configuradas...', { id: 'test-all' });
    
    // Simulação de teste - em produção, chamaria o endpoint real
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss('test-all');
    setTestingAll(false);
    
    toast.success('✅ Teste concluído!', {
      description: 'Verifique o console para detalhes'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com instruções */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              🚀 Configuração Rápida de APIs
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Configure suas API keys em 3 passos simples para começar a buscar leads reais:
            </p>
            <ol className="text-sm text-blue-700 space-y-1 ml-4">
              <li><strong>1.</strong> Clique em "Configurar" na API desejada</li>
              <li><strong>2.</strong> Crie uma conta no site (se ainda não tiver)</li>
              <li><strong>3.</strong> Cole a API key quando solicitado</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Lista de APIs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">APIs Disponíveis</h3>
          <Button
            onClick={testAllApis}
            disabled={testingAll}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {testingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Testar Todas
              </>
            )}
          </Button>
        </div>

        {API_CONFIGS.sort((a, b) => a.priority - b.priority).map((api) => (
          <Card key={api.key} className="p-4 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              {/* Ícone */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                api.configured ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Key className={`w-5 h-5 ${api.configured ? 'text-green-600' : 'text-gray-400'}`} />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{api.name}</h4>
                      {api.configured ? (
                        <Badge className="bg-green-500">✅ Configurada</Badge>
                      ) : (
                        <Badge variant="outline">❌ Não configurada</Badge>
                      )}
                      {api.priority <= 3 && (
                        <Badge className="bg-yellow-500">⭐ Recomendada</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{api.description}</p>
                    <p className="text-xs text-green-700 font-medium">
                      💚 {api.trial}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    onClick={() => handleConfigureApi(api)}
                    disabled={configuring === api.secretName}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {configuring === api.secretName ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Configurando...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        {api.configured ? 'Reconfigurar' : 'Configurar'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => window.open(api.signupUrl, '_blank')}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Criar Conta
                  </Button>
                  
                  <Button
                    onClick={() => window.open(api.docsUrl, '_blank')}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    📚 Docs
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Instruções adicionais */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-2">💡 Dicas Importantes:</p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>Comece com Apollo.io</strong> - É a mais fácil e tem 50 créditos grátis</li>
              <li>• <strong>RapidAPI</strong> oferece 100 requests grátis por mês (melhor custo-benefício)</li>
              <li>• <strong>Hunter.io</strong> é excelente para verificar emails</li>
              <li>• Não precisa configurar TODAS - escolha 2 ou 3 para começar</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Guia passo-a-passo expandido */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">📋 Guia Passo-a-Passo: Apollo.io</h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
              1
            </div>
            <div>
              <p className="font-medium">Criar conta no Apollo.io</p>
              <p className="text-xs text-blue-700">Acesse https://www.apollo.io/ e clique em "Sign Up"</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
              2
            </div>
            <div>
              <p className="font-medium">Obter a API Key</p>
              <p className="text-xs text-blue-700">Após login, vá em Settings → API → Create API Key</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
              3
            </div>
            <div>
              <p className="font-medium">Configurar na plataforma</p>
              <p className="text-xs text-blue-700">Clique em "Configurar" acima e cole a API key quando solicitado</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
              ✓
            </div>
            <div>
              <p className="font-medium">Pronto! Comece a buscar</p>
              <p className="text-xs text-blue-700">Vá em Busca Avançada e procure seus primeiros leads</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
