import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Key, Zap, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ApiOption {
  id: string;
  name: string;
  secretName: string;
  description: string;
  signupUrl: string;
  instructions: string[];
  trial: string;
  recommended: boolean;
}

const APIS: ApiOption[] = [
  {
    id: 'apollo',
    name: 'Apollo.io',
    secretName: 'APOLLO_API_KEY',
    description: 'A melhor opção para começar - dados B2B de qualidade',
    signupUrl: 'https://www.apollo.io/',
    instructions: [
      'Criar conta em apollo.io',
      'Ir em Settings → API',
      'Clicar em "Create API Key"',
      'Copiar a key gerada'
    ],
    trial: '50 créditos/mês GRÁTIS',
    recommended: true
  },
  {
    id: 'rapidapi',
    name: 'RapidAPI (LinkedIn)',
    secretName: 'RAPIDAPI_KEY',
    description: 'Dados do LinkedIn com melhor custo-benefício',
    signupUrl: 'https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data',
    instructions: [
      'Criar conta no RapidAPI',
      'Clicar em "Subscribe to Test"',
      'Escolher plano "Basic (Free)"',
      'Copiar a X-RapidAPI-Key'
    ],
    trial: '100 requests/mês GRÁTIS',
    recommended: true
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    secretName: 'HUNTER_API_KEY',
    description: 'Especialista em encontrar emails profissionais',
    signupUrl: 'https://hunter.io/',
    instructions: [
      'Criar conta em hunter.io',
      'Ir em API → API Keys',
      'Copiar a key existente',
      'ou criar uma nova'
    ],
    trial: '25 buscas/mês GRÁTIS',
    recommended: true
  },
  {
    id: 'lusha',
    name: 'Lusha',
    secretName: 'LUSHA_API_KEY',
    description: 'Enriquecimento completo (email + telefone)',
    signupUrl: 'https://www.lusha.com/',
    instructions: [
      'Criar conta em lusha.com',
      'Ir em Profile → API Access',
      'Copiar a API key'
    ],
    trial: '5 créditos GRÁTIS',
    recommended: false
  }
];

export function QuickApiSetup() {
  const [selectedApi, setSelectedApi] = useState<string | null>(null);

  const handleConfigureClick = (api: ApiOption) => {
    setSelectedApi(api.id);
    
    // Mostra instruções
    console.log('\n🔑 ═══════════════════════════════════════════════════════');
    console.log(`🔑 INSTRUÇÕES: ${api.name.toUpperCase()}`);
    console.log('🔑 ═══════════════════════════════════════════════════════\n');
    api.instructions.forEach((instruction, index) => {
      console.log(`   ${index + 1}. ${instruction}`);
    });
    console.log('\n🔑 ═══════════════════════════════════════════════════════\n');

    toast.info(`📋 Instruções para ${api.name}`, {
      description: 'Verifique o console para o passo-a-passo completo',
      duration: 8000,
      action: {
        label: 'Abrir Site',
        onClick: () => window.open(api.signupUrl, '_blank')
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner de Boas-Vindas */}
      <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">
              🚀 Configure suas APIs em 5 minutos
            </h2>
            <p className="text-purple-100 mb-4">
              Escolha pelo menos UMA das APIs abaixo para começar a buscar leads reais. 
              Todas têm trial grátis!
            </p>
            <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-2 w-fit">
              <CheckCircle className="w-4 h-4" />
              <span>Sem necessidade de cartão de crédito para começar</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Cards das APIs */}
      <div className="grid md:grid-cols-2 gap-4">
        {APIS.map((api) => (
          <Card 
            key={api.id}
            className={`p-5 transition-all hover:shadow-xl cursor-pointer ${
              api.recommended ? 'border-2 border-yellow-400 bg-yellow-50/50' : ''
            } ${
              selectedApi === api.id ? 'ring-2 ring-blue-600' : ''
            }`}
            onClick={() => setSelectedApi(api.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{api.name}</h3>
                  {api.recommended && (
                    <Badge className="bg-yellow-500 text-white">
                      ⭐ Top
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{api.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    💚 {api.trial}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Instruções */}
            {selectedApi === api.id && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  📋 Passo-a-passo:
                </h4>
                <ol className="text-xs text-blue-800 space-y-1">
                  {api.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-bold">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfigureClick(api);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Key className="w-4 h-4 mr-2" />
                Ver Instruções
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(api.signupUrl, '_blank');
                }}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Banner de Ajuda */}
      <Card className="p-5 bg-orange-50 border-2 border-orange-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-orange-900 mb-2">
              🎯 Onde Adicionar as API Keys?
            </h4>
            <p className="text-orange-800 mb-3">
              Depois de obter sua API key, você precisa adicioná-la nas <strong>variáveis de ambiente do Supabase</strong>:
            </p>
            <ol className="text-orange-800 space-y-2 ml-4">
              <li>
                <strong>1.</strong> Acesse: <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://supabase.com/dashboard</a>
              </li>
              <li>
                <strong>2.</strong> Selecione seu projeto
              </li>
              <li>
                <strong>3.</strong> Vá em <strong>Edge Functions → Secrets</strong>
              </li>
              <li>
                <strong>4.</strong> Adicione uma nova secret com o nome: <code className="bg-orange-100 px-2 py-0.5 rounded">APOLLO_API_KEY</code> (ou outra)
              </li>
              <li>
                <strong>5.</strong> Cole o valor da API key
              </li>
              <li>
                <strong>6.</strong> Clique em <strong>Save</strong>
              </li>
              <li>
                <strong>7.</strong> Aguarde 1-2 minutos para as functions reiniciarem
              </li>
              <li>
                <strong>8.</strong> Volte aqui e teste a configuração em <strong>Configurações → Segurança → Diagnóstico de API</strong>
              </li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Vídeo Tutorial (opcional) */}
      <Card className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-green-900 mb-2">
              ✅ Depois de Configurar
            </h4>
            <p className="text-green-800 mb-2">
              Após adicionar pelo menos UMA API key no Supabase:
            </p>
            <ul className="text-green-800 space-y-1 ml-4">
              <li>• Vá em <strong>Busca Avançada</strong></li>
              <li>• Clique em <strong>"Buscar Leads"</strong></li>
              <li>• Os resultados serão REAIS (não demo)</li>
              <li>• Você verá dados completos com emails e telefones</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
