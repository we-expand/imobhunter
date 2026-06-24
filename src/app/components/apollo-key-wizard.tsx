/**
 * 🔑 APOLLO API KEY WIZARD
 * 
 * Guia passo a passo para obter e validar uma chave Apollo.io
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ApolloKeyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência!');
  };

  const testApolloKey = async () => {
    if (!apiKey || apiKey.trim().length < 10) {
      toast.error('Por favor, insira uma chave válida');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/apollo/search`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey.trim(),
          q_keywords: 'CEO',
          page: 1,
          per_page: 5
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const peopleCount = data?.data?.people?.length || 0;
        
        setTestResult({
          success: true,
          status: response.status,
          peopleCount,
          validKey: apiKey.trim()
        });

        toast.success(`✅ Chave válida! ${peopleCount} resultados encontrados`, {
          duration: 5000
        });

        setCurrentStep(4);
      } else {
        setTestResult({
          success: false,
          status: response.status,
          error: data.error || data.message || 'Erro desconhecido'
        });

        if (response.status === 401) {
          toast.error('❌ Chave inválida! Erro 401 - Invalid credentials', {
            duration: 5000
          });
        } else {
          toast.error(`❌ Erro ${response.status}`, {
            duration: 5000
          });
        }
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message
      });
      toast.error('Erro de conexão: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Acesse o painel da Apollo.io',
      description: 'Primeiro passo: fazer login na Apollo',
      completed: currentStep > 1
    },
    {
      number: 2,
      title: 'Gere uma nova API Key',
      description: 'Na página de integrações, crie sua chave',
      completed: currentStep > 2
    },
    {
      number: 3,
      title: 'Teste a chave',
      description: 'Cole e valide a chave gerada',
      completed: currentStep > 3
    },
    {
      number: 4,
      title: 'Atualize o sistema',
      description: 'Use a chave válida no ImobHunter',
      completed: currentStep > 4
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-purple-950/40">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Key className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl text-white mb-2">
                🔑 Assistente de Chave Apollo API
              </CardTitle>
              <CardDescription className="text-base text-zinc-300">
                Siga este guia passo a passo para obter e validar sua chave Apollo.io
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`relative ${
              currentStep === step.number
                ? 'ring-2 ring-indigo-500'
                : step.completed
                ? 'ring-1 ring-emerald-500/30'
                : 'ring-1 ring-zinc-700'
            }`}
            style={{ borderRadius: '0.5rem' }}
          >
            <Card className={`border-0 ${
              currentStep === step.number
                ? 'bg-indigo-500/10'
                : step.completed
                ? 'bg-emerald-500/5'
                : 'bg-zinc-900/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step.completed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : currentStep === step.number
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm mb-1">
                      {step.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {step.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Step 1: Acessar Apollo */}
      {currentStep === 1 && (
        <Card className="border border-white/10 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                1
              </div>
              Acesse o Painel da Apollo.io
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-white font-semibold mb-2">
                    Por que você precisa fazer isso?
                  </p>
                  <p className="text-zinc-300 text-sm">
                    A Apollo.io é um serviço PAGO que exige autenticação. As chaves que você forneceu 
                    (<code className="bg-black/30 px-1 rounded">2MzD573PNMUDo1kBRJUuA</code> e 
                    <code className="bg-black/30 px-1 rounded ml-1">WfxZd4DzoL1Fgp5advhp8Q</code>) 
                    foram <span className="text-red-400 font-bold">REVOGADAS ou nunca foram válidas</span>.
                  </p>
                  <p className="text-zinc-300 text-sm mt-2">
                    Você precisa ter uma conta Apollo.io ativa e gerar sua própria chave API.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-white font-semibold">📋 O que fazer:</p>
              <ol className="space-y-3 text-zinc-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>
                    Se você <strong className="text-white">NÃO tem</strong> uma conta Apollo.io, crie uma em:{' '}
                    <a 
                      href="https://www.apollo.io/sign-up" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1"
                    >
                      apollo.io/sign-up
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>
                    Se você <strong className="text-white">JÁ tem</strong> uma conta, faça login em:{' '}
                    <a 
                      href="https://app.apollo.io/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1"
                    >
                      app.apollo.io
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>
                    Após fazer login, você será redirecionado ao dashboard
                  </span>
                </li>
              </ol>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                onClick={() => {
                  window.open('https://app.apollo.io/', '_blank');
                  setTimeout(() => setCurrentStep(2), 1000);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-12 text-base font-semibold"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Abrir Apollo.io e Continuar
              </Button>
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
                className="border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/10"
              >
                Já fiz login <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Gerar API Key */}
      {currentStep === 2 && (
        <Card className="border border-white/10 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                2
              </div>
              Gere sua API Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-semibold text-sm mb-1">
                    ⚠️ Importante: Você precisa estar logado!
                  </p>
                  <p className="text-zinc-300 text-xs">
                    Se você não estiver logado, o link abaixo vai redirecionar para a página de login.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-white font-semibold">📋 Passo a passo:</p>
              <ol className="space-y-4 text-zinc-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="mb-2">
                      Clique no botão abaixo para abrir a página de <strong className="text-white">Integrações</strong>:
                    </p>
                    <Button
                      onClick={() => window.open('https://app.apollo.io/#/settings/integrations', '_blank')}
                      className="bg-indigo-600 hover:bg-indigo-500"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir Página de Integrações
                    </Button>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>
                    Na página, procure pela seção <strong className="text-white">"API"</strong> ou <strong className="text-white">"API Keys"</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>
                    Clique no botão <strong className="text-white">"Create New Key"</strong>, <strong className="text-white">"Generate API Key"</strong> ou similar
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span>
                    Uma chave será gerada. Ela terá algo como: <code className="bg-black/30 px-1 rounded text-emerald-400">abc123XYZ456...</code> (20-30 caracteres)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    5
                  </span>
                  <span>
                    <strong className="text-white">COPIE</strong> a chave completa (clique no ícone de copiar ou selecione tudo)
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-400 font-semibold text-sm mb-1">
                    ✅ Copiou a chave?
                  </p>
                  <p className="text-zinc-300 text-xs">
                    Clique em "Próximo" para testar sua chave!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/10"
              >
                Voltar
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-12 text-base font-semibold"
              >
                Próximo: Testar Chave
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Testar Chave */}
      {currentStep === 3 && (
        <Card className="border border-white/10 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                3
              </div>
              Teste sua Chave API
            </CardTitle>
            <CardDescription>
              Cole a chave que você copiou da Apollo.io e vamos testar se está funcionando
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-base text-white font-semibold flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-400" />
                Cole sua chave Apollo API:
              </label>
              <Input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ex: zZwssuQgi8KPgJDlbT0Otg"
                className="font-mono text-base bg-black/50 border-indigo-400/30 text-white placeholder:text-zinc-600 h-14"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !testing && apiKey.trim().length > 0) {
                    testApolloKey();
                  }
                }}
              />
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-zinc-400">
                  A chave deve conter apenas letras e números, sem espaços no início ou fim
                </p>
              </div>
            </div>

            <Button
              onClick={testApolloKey}
              disabled={testing || !apiKey || apiKey.trim().length < 10}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-14 text-base font-semibold"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Testando chave...' : '🔍 Testar Chave Apollo'}
            </Button>

            {testResult && (
              <div className={`p-4 rounded-lg border-2 ${
                testResult.success 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  {testResult.success ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 space-y-3">
                    {testResult.success ? (
                      <>
                        <p className="text-emerald-400 font-bold text-lg">
                          ✅ SUCESSO! A chave está válida!
                        </p>
                        <div className="bg-black/30 p-3 rounded space-y-2 text-sm">
                          <div className="flex justify-between text-zinc-300">
                            <span>Status HTTP:</span>
                            <span className="text-emerald-400 font-mono font-bold">{testResult.status}</span>
                          </div>
                          <div className="flex justify-between text-zinc-300">
                            <span>Resultados encontrados:</span>
                            <span className="text-emerald-400 font-mono font-bold">{testResult.peopleCount}</span>
                          </div>
                        </div>
                        <p className="text-zinc-300 text-sm">
                          A integração com Apollo.io está 100% funcional! 🎉
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-red-400 font-bold text-lg">
                          ❌ Chave Inválida
                        </p>
                        <div className="bg-black/30 p-3 rounded space-y-2 text-sm">
                          {testResult.status && (
                            <div className="flex justify-between text-zinc-300">
                              <span>Status HTTP:</span>
                              <span className="text-red-400 font-mono font-bold">{testResult.status}</span>
                            </div>
                          )}
                          {testResult.error && (
                            <div className="p-2 bg-red-500/10 rounded font-mono text-xs text-red-400 border border-red-500/20">
                              {testResult.error}
                            </div>
                          )}
                        </div>
                        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded">
                          <p className="text-amber-400 font-semibold text-sm mb-2">
                            O que fazer:
                          </p>
                          <ul className="text-zinc-300 text-xs space-y-1 list-disc list-inside">
                            <li>Verifique se você copiou a chave COMPLETA</li>
                            <li>Certifique-se de que não há espaços no início ou fim</li>
                            <li>A chave deve ter sido gerada RECENTEMENTE</li>
                            <li>Tente gerar uma NOVA chave no painel da Apollo</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
                className="border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/10"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Atualizar Sistema */}
      {currentStep === 4 && testResult?.success && (
        <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-green-950/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              🎉 Parabéns! Chave Validada!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 space-y-4">
              <p className="text-emerald-400 font-bold text-lg">
                ✅ Sua chave Apollo está 100% funcional!
              </p>
              <div className="bg-black/30 p-4 rounded">
                <p className="text-zinc-300 text-sm mb-2">Chave validada:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black/50 px-3 py-2 rounded font-mono text-emerald-400 text-sm border border-emerald-500/20">
                    {testResult.validKey}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(testResult.validKey)}
                    variant="outline"
                    size="sm"
                    className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-indigo-500/10 border-2 border-indigo-500/30 rounded-lg p-6 space-y-4">
              <p className="text-white font-bold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400" />
                📋 PRÓXIMO PASSO IMPORTANTE:
              </p>
              <div className="bg-black/30 p-4 rounded space-y-3">
                <p className="text-zinc-300 text-sm">
                  Para que o sistema use esta nova chave, você precisa me enviar uma mensagem no chat dizendo:
                </p>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-4">
                  <p className="text-white font-mono text-sm">
                    Atualizar chave Apollo para: <span className="text-emerald-400">{testResult.validKey}</span>
                  </p>
                </div>
                <Button
                  onClick={() => copyToClipboard(`Atualizar chave Apollo para: ${testResult.validKey}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-12 font-semibold"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copiar Mensagem para o Chat
                </Button>
              </div>
            </div>

            <div className="text-center pt-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-base px-4 py-2">
                ✅ Processo Concluído com Sucesso!
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}