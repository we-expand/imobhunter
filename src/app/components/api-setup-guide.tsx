/**
 * 🔑 GUIA COMPLETO DE CONFIGURAÇÃO DE APIs
 * Passo a passo para obter dados REAIS na plataforma
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge-export';
import { 
  ExternalLink, CheckCircle2, AlertCircle, Zap, 
  Mail, Phone, Linkedin, Globe, DollarSign, Clock 
} from 'lucide-react';

export function ApiSetupGuide() {
  const apis = [
    {
      name: 'Apollo.io',
      icon: '🚀',
      difficulty: 'Fácil',
      time: '5 minutos',
      free: '10 créditos/mês',
      bestFor: 'Perfis completos + Emails',
      steps: [
        'Acesse https://app.apollo.io/',
        'Vá em Settings → Integrations → API',
        'Clique em "Create API Key"',
        'Copie a key que começa com "uQCcq_..."',
        'As chaves estão configuradas automaticamente no sistema'
      ],
      keyLocation: 'Settings → Integrations → API',
      url: 'https://www.apollo.io/',
      recommended: true
    },
    {
      name: 'Hunter.io',
      icon: '📧',
      difficulty: 'Fácil',
      time: '3 minutos',
      free: '25 buscas/mês',
      bestFor: 'Emails verificados',
      steps: [
        'Acesse https://hunter.io/',
        'Clique em "Sign Up Free"',
        'Confirme seu email',
        'Vá em API → API Keys',
        'Copie a key que aparece',
        'Cole em: Configurações → Segurança → HUNTER_API_KEY'
      ],
      keyLocation: 'API → API Keys',
      url: 'https://hunter.io/',
      recommended: true
    },
    {
      name: 'RapidAPI (LinkedIn)',
      icon: '⚡',
      difficulty: 'Muito Fácil',
      time: '2 minutos',
      free: '100 requests/mês',
      bestFor: 'Dados do LinkedIn',
      steps: [
        'Acesse https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data',
        'Clique em "Sign Up" (ou "Log In" se já tiver conta)',
        'Clique em "Subscribe to Test"',
        'Escolha o plano "Basic" (GRÁTIS)',
        'Clique em "Subscribe"',
        'Vá em "Endpoints" → copie a "X-RapidAPI-Key" do código de exemplo',
        'Cole em: Configurações → Segurança → RAPIDAPI_KEY'
      ],
      keyLocation: 'Headers → X-RapidAPI-Key',
      url: 'https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data',
      recommended: true
    },
    {
      name: 'Lusha',
      icon: '💼',
      difficulty: 'Média',
      time: '10 minutos',
      free: '5 créditos grátis',
      bestFor: 'LinkedIn + Emails + Telefones',
      steps: [
        'Acesse https://www.lusha.com/',
        'Clique em "Start Free Trial"',
        'Preencha o formulário',
        'Confirme seu email',
        'Vá em Profile → API Access',
        'Copie a API Key',
        'Cole em: Configurações → Segurança → LUSHA_API_KEY'
      ],
      keyLocation: 'Profile → API Access',
      url: 'https://www.lusha.com/',
      recommended: false
    }
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">🔑 Guia Completo: Obter Dados REAIS</h1>
        <p className="text-lg text-white/90">
          Configure as APIs em 15 minutos e comece a buscar leads reais agora mesmo!
        </p>
      </div>

      {/* Status Atual */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-orange-900">
                Você está vendo dados DEMO (fictícios)
              </h3>
              <p className="text-orange-800 mb-4">
                Para obter leads REAIS, você precisa configurar pelo menos 1 API Key abaixo.
                <br />
                <strong>Recomendamos começar com Apollo.io ou RapidAPI</strong> (ambos têm planos gratuitos).
              </p>
              <div className="flex gap-2">
                <Badge className="bg-orange-600">
                  <Clock className="w-3 h-3 mr-1" />
                  Tempo total: ~15 minutos
                </Badge>
                <Badge className="bg-green-600">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Planos gratuitos disponíveis
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de APIs */}
      <div className="grid gap-6">
        {apis.map((api) => (
          <Card 
            key={api.name} 
            className={`${
              api.recommended 
                ? 'border-2 border-green-400 bg-gradient-to-br from-green-50 to-blue-50' 
                : 'border-2 border-gray-200'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-lg">
                    {api.icon}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {api.name}
                      {api.recommended && (
                        <Badge className="bg-green-600">
                          ⭐ RECOMENDADO
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {api.bestFor}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(api.url, '_blank')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Site
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Info Rápida */}
              <div className="flex gap-4">
                <Badge variant="outline" className="border-blue-300">
                  <Zap className="w-3 h-3 mr-1" />
                  {api.difficulty}
                </Badge>
                <Badge variant="outline" className="border-green-300">
                  <Clock className="w-3 h-3 mr-1" />
                  {api.time}
                </Badge>
                <Badge variant="outline" className="border-purple-300">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {api.free}
                </Badge>
              </div>

              {/* Passo a Passo */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Passo a passo:
                </h4>
                <ol className="space-y-2">
                  {api.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 flex-1">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Localização da Key */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium">
                  📍 <strong>Onde encontrar a API Key:</strong> {api.keyLocation}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Próximos Passos */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Próximos passos após configurar
          </h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <strong>Cole suas API Keys</strong>
                <p className="text-sm text-gray-600">
                  Vá em <strong>Configurações → Segurança</strong> e cole as keys nos campos correspondentes
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <strong>Teste as conexões</strong>
                <p className="text-sm text-gray-600">
                  Clique em <strong>"🔍 Testar APIs (Diagnóstico)"</strong> para verificar se está tudo OK
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div>
                <strong>Faça sua primeira busca REAL</strong>
                <p className="text-sm text-gray-600">
                  Digite um nome, cargo ou empresa e clique em <strong>"Buscar Leads"</strong>
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <div>
                <strong>Receba resultados por email</strong>
                <p className="text-sm text-gray-600">
                  Clique em <strong>"📧 Enviar por Email"</strong> para receber os leads na sua caixa de entrada
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Dúvidas */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">❓ Dúvidas Frequentes</h3>
          <div className="space-y-4">
            <div>
              <strong className="text-purple-600">Preciso configurar todas as APIs?</strong>
              <p className="text-sm text-gray-600 mt-1">
                Não! Configure apenas 1 ou 2 para começar. Recomendamos <strong>Apollo.io</strong> ou <strong>RapidAPI</strong>.
              </p>
            </div>
            <div>
              <strong className="text-purple-600">São realmente gratuitas?</strong>
              <p className="text-sm text-gray-600 mt-1">
                Sim! Todas têm planos gratuitos com limites mensais (10-100 buscas/mês).
              </p>
            </div>
            <div>
              <strong className="text-purple-600">Quanto tempo dura a configuração?</strong>
              <p className="text-sm text-gray-600 mt-1">
                De 2 a 10 minutos por API. Total: ~15 minutos para configurar 2-3 APIs.
              </p>
            </div>
            <div>
              <strong className="text-purple-600">Onde vejo se as APIs estão funcionando?</strong>
              <p className="text-sm text-gray-600 mt-1">
                Clique no botão <strong>"🔍 Testar APIs (Diagnóstico)"</strong> no painel de busca.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}