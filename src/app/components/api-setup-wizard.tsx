import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Key, CheckCircle, XCircle, AlertCircle, ExternalLink,
  Sparkles, TrendingUp, DollarSign, Zap, Info, Copy,
  Check, Loader2, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';

interface APIConfig {
  name: string;
  key: string;
  displayName: string;
  icon: string;
  color: string;
  website: string;
  signupUrl: string;
  docsUrl: string;
  freePlan: string;
  paidPlan: string;
  recommended: boolean;
  description: string;
  priority: number;
}

const API_CONFIGS: APIConfig[] = [
  {
    name: 'apollo',
    key: 'APOLLO_API_KEY',
    displayName: 'Apollo.io',
    icon: '🔵',
    color: 'blue',
    website: 'https://www.apollo.io',
    signupUrl: 'https://www.apollo.io/sign-up',
    docsUrl: 'https://apolloio.github.io/apollo-api-docs/',
    freePlan: '50 créditos/mês',
    paidPlan: '$49/mês (10.000 créditos)',
    recommended: true,
    description: 'Melhor custo-benefício para B2B e Real Estate',
    priority: 1
  },
  {
    name: 'hunter',
    key: 'HUNTER_API_KEY',
    displayName: 'Hunter.io',
    icon: '🟢',
    color: 'green',
    website: 'https://hunter.io',
    signupUrl: 'https://hunter.io/users/sign_up',
    docsUrl: 'https://hunter.io/api-documentation/v2',
    freePlan: '25 buscas/mês',
    paidPlan: '$49/mês (500 buscas)',
    recommended: true,
    description: 'Encontra e verifica emails profissionais',
    priority: 2
  },
  {
    name: 'proxycurl',
    key: 'PROXYCURL_API_KEY',
    displayName: 'Proxycurl',
    icon: '🔴',
    color: 'red',
    website: 'https://nubela.co/proxycurl',
    signupUrl: 'https://nubela.co/proxycurl/auth/signup',
    docsUrl: 'https://nubela.co/proxycurl/docs',
    freePlan: '10 créditos teste',
    paidPlan: 'Pay-as-you-go ($0.01-$3/perfil)',
    recommended: false,
    description: 'Extrai dados direto do LinkedIn',
    priority: 3
  },
  {
    name: 'pdl',
    key: 'PDL_API_KEY',
    displayName: 'PeopleDataLabs',
    icon: '🟣',
    color: 'purple',
    website: 'https://www.peopledatalabs.com',
    signupUrl: 'https://dashboard.peopledatalabs.com/signup',
    docsUrl: 'https://docs.peopledatalabs.com/',
    freePlan: '1.000 créditos teste',
    paidPlan: '$500/mês (10.000 créditos)',
    recommended: false,
    description: 'Enriquecimento detalhado de perfis',
    priority: 4
  },
  {
    name: 'rocketreach',
    key: 'ROCKETREACH_API_KEY',
    displayName: 'RocketReach',
    icon: '🟠',
    color: 'orange',
    website: 'https://rocketreach.co',
    signupUrl: 'https://rocketreach.co/signup',
    docsUrl: 'https://rocketreach.co/api',
    freePlan: '5 lookups/mês',
    paidPlan: '$49/mês (170 lookups)',
    recommended: false,
    description: 'Contatos + Redes Sociais',
    priority: 5
  }
];

export function APISetupWizard() {
  const [apiStatus, setApiStatus] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    setIsLoading(true);
    try {
      const url = `${API_BASE_URL}${API_ROUTES.diagnostics}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiStatus(data.apis || {});
      }
    } catch (error) {
      console.error('Erro ao verificar status das APIs:', error);
      toast.error('Erro ao verificar APIs');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copiado!');
  };

  const getStatusIcon = (apiName: string) => {
    const status = apiStatus[apiName];
    if (!status) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    
    if (status.valid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status.configured && !status.valid) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusText = (apiName: string) => {
    const status = apiStatus[apiName];
    if (!status) return 'Verificando...';
    
    if (status.valid) {
      return '✅ Configurada e válida';
    } else if (status.configured && !status.valid) {
      return '❌ Configurada mas inválida';
    } else {
      return '⚠️ Não configurada';
    }
  };

  const summary = apiStatus ? {
    total: API_CONFIGS.length,
    configured: Object.values(apiStatus).filter((s: any) => s?.configured).length,
    valid: Object.values(apiStatus).filter((s: any) => s?.valid).length
  } : { total: API_CONFIGS.length, configured: 0, valid: 0 };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Key className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Configuração de APIs</h1>
        <p className="text-gray-500">
          Configure suas API keys para obter leads REAIS (sem dados demo)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{summary.total}</div>
            <div className="text-sm text-gray-500 mt-1">APIs Disponíveis</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{summary.configured}</div>
            <div className="text-sm text-gray-500 mt-1">Configuradas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{summary.valid}</div>
            <div className="text-sm text-gray-500 mt-1">Funcionando</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert se nenhuma API configurada */}
      {summary.valid === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 mb-2">
                ⚠️ Você está em MODO DEMO
              </h3>
              <p className="text-sm text-orange-700 mb-4">
                Nenhuma API configurada. O sistema está retornando <strong>dados fictícios (FAKE)</strong>.
                Configure pelo menos 1 API abaixo para obter leads REAIS.
              </p>
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <p className="text-sm font-semibold text-orange-900 mb-2">
                  🎯 Recomendação: Comece GRÁTIS!
                </p>
                <p className="text-xs text-orange-700">
                  Configure <strong>Apollo.io</strong> (50 leads/mês grátis) - Leva apenas 5 minutos!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de APIs */}
      <div className="space-y-4">
        {API_CONFIGS.sort((a, b) => a.priority - b.priority).map((api, index) => (
          <motion.div
            key={api.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${api.recommended ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-4xl">{api.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{api.displayName}</h3>
                      {api.recommended && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                          ⭐ Recomendada
                        </Badge>
                      )}
                      {getStatusIcon(api.name)}
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{api.description}</p>

                    {/* Status */}
                    <div className="mb-4">
                      <span className="text-sm font-semibold">
                        Status: {getStatusText(api.name)}
                      </span>
                      {apiStatus[api.name]?.error && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                          {apiStatus[api.name].error}
                        </div>
                      )}
                    </div>

                    {/* Plans */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-xs text-green-600 font-semibold mb-1">
                          💚 Plano Grátis
                        </div>
                        <div className="text-sm font-bold">{api.freePlan}</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-xs text-blue-600 font-semibold mb-1">
                          💎 Plano Pago
                        </div>
                        <div className="text-sm font-bold">{api.paidPlan}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(api.signupUrl, '_blank')}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Criar Conta Grátis
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(api.docsUrl, '_blank')}
                      >
                        <Info className="w-3 h-3 mr-2" />
                        Documentação
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(api.signupUrl)}
                      >
                        <Copy className="w-3 h-3 mr-2" />
                        Copiar Link
                      </Button>
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 text-xs space-y-2">
                      <div className="font-semibold mb-2">📋 Como configurar:</div>
                      <div className="space-y-1 text-gray-600">
                        <div>1. Clique em "Criar Conta Grátis" acima</div>
                        <div>2. Complete o cadastro no site {api.displayName}</div>
                        <div>3. Vá em Settings → API / Integrations</div>
                        <div>4. Copie sua API key</div>
                        <div>5. No Supabase: Settings → Edge Functions → Secrets</div>
                        <div>6. Adicione: <code className="bg-white px-2 py-1 rounded">{api.key}</code></div>
                        <div>7. Reinicie as Edge Functions</div>
                        <div>8. Volte aqui e clique "Verificar Novamente"</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={checkAPIStatus}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Verificar Novamente
            </>
          )}
        </Button>
      </div>

      {/* Tutorial Link */}
      <div className="text-center pt-6 border-t">
        <p className="text-sm text-gray-500 mb-2">
          📖 Precisa de ajuda detalhada?
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info('Verifique o arquivo GUIA_CONFIGURACAO_APIS.md na raiz do projeto')}
        >
          <Info className="w-4 h-4 mr-2" />
          Ver Guia Completo de Configuração
        </Button>
      </div>
    </div>
  );
}
