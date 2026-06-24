/**
 * 🔑 API KEYS CONFIGURATION
 * Configuração visual das API keys para busca de leads
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';
import { 
  Key, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Shield,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ApiKeyStatus {
  apollo: string | null;
  hunter: string | null;
  pdl: string | null;
  rocketreach: string | null;
  proxycurl: string | null;
}

export function ApiKeysConfig() {
  const [keys, setKeys] = useState<ApiKeyStatus>({
    apollo: null,
    hunter: null,
    pdl: null,
    rocketreach: null,
    proxycurl: null,
  });

  const [inputs, setInputs] = useState({
    apollo: '',
    hunter: '',
    pdl: '',
    rocketreach: '',
    proxycurl: '',
  });

  const [showKeys, setShowKeys] = useState({
    apollo: false,
    hunter: false,
    pdl: false,
    rocketreach: false,
    proxycurl: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar keys existentes
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.diagnostics}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setKeys(data.keys);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveApiKeys = async () => {
    setSaving(true);
    
    try {
      const payload: any = {};
      if (inputs.apollo) payload.apolloKey = inputs.apollo;
      if (inputs.hunter) payload.hunterKey = inputs.hunter;
      if (inputs.pdl) payload.pdlKey = inputs.pdl;
      if (inputs.rocketreach) payload.rocketKey = inputs.rocketreach;
      if (inputs.proxycurl) payload.proxycurlKey = inputs.proxycurl;

      if (Object.keys(payload).length === 0) {
        toast.warning('⚠️ Nenhuma key para salvar', {
          description: 'Preencha pelo menos uma API key',
        });
        return;
      }

      console.log('💾 Salvando API Keys...');

      // NOTA: Rota de salvar keys não disponível na nova API
      // As keys devem ser configuradas via variáveis de ambiente do Supabase
      toast.warning('⚠️ Configuração via interface desabilitada', {
        description: 'Use variáveis de ambiente do Supabase para configurar as API keys',
        duration: 5000,
      });
      return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/config/api-keys`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success('✅ API Keys salvas com sucesso!', {
          description: 'Aguarde 10-15 segundos para as keys serem aplicadas',
          duration: 6000,
        });

        // Limpa os inputs
        setInputs({
          apollo: '',
          hunter: '',
          pdl: '',
          rocketreach: '',
          proxycurl: '',
        });

        // Recarrega as keys após 2 segundos
        setTimeout(() => {
          loadApiKeys();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erro ao salvar API keys:', error);
      toast.error('❌ Erro ao salvar API keys', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setSaving(false);
    }
  };

  const ApiKeyInput = ({
    name,
    label,
    placeholder,
    link,
    freeTier,
    configured,
  }: {
    name: keyof typeof inputs;
    label: string;
    placeholder: string;
    link: string;
    freeTier: string;
    configured: string | null;
  }) => {
    const isConfigured = configured !== null;

    return (
      <Card className={`border-2 ${isConfigured ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Label className="font-bold text-sm">{label}</Label>
                {isConfigured ? (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Configurada
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-600">
                    <XCircle className="w-3 h-3 mr-1" />
                    Não configurada
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600">{freeTier}</p>
              {isConfigured && (
                <p className="text-xs text-green-700 mt-1 font-mono bg-green-100 px-2 py-1 rounded inline-block">
                  {configured}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => window.open(link, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <Input
              type={showKeys[name] ? 'text' : 'password'}
              placeholder={placeholder}
              value={inputs[name]}
              onChange={(e) => setInputs({ ...inputs, [name]: e.target.value })}
              className="pr-10 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowKeys({ ...showKeys, [name]: !showKeys[name] })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKeys[name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Configuração de API Keys
                </span>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2 ml-[60px]">
                Configure suas API keys para buscar leads reais nas plataformas
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ⚠️ AVISO CRÍTICO - API KEY INVÁLIDA */}
      <Card className="border-2 border-red-500 bg-red-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 mb-1">❌ API Key do Apollo.io INVÁLIDA ou EXPIRADA</h4>
              <p className="text-sm text-red-800 mb-3">
                A API key fornecida (<code className="font-mono bg-red-100 px-1 py-0.5 rounded">DxFa4BMdoNliED5XiOlOkw</code>) retornou erro <strong>401 Unauthorized</strong>.
              </p>
              <div className="bg-red-100 p-3 rounded border border-red-200 mb-3">
                <p className="text-sm font-semibold text-red-900 mb-2">🔧 Como corrigir:</p>
                <ol className="text-sm text-red-800 space-y-1 ml-4 list-decimal">
                  <li>Acesse <a href="https://app.apollo.io/#/settings/integrations/api" target="_blank" className="underline font-semibold">https://app.apollo.io/#/settings/integrations/api</a></li>
                  <li>Clique em "<strong>Create New Key</strong>" ou "<strong>Regenerate Key</strong>"</li>
                  <li>Copie a nova key gerada</li>
                  <li>Cole no campo "<strong>Apollo.io</strong>" abaixo</li>
                  <li>Clique em "<strong>Salvar Configurações</strong>"</li>
                </ol>
              </div>
              <p className="text-xs text-red-700">
                ⏰ <strong>Enquanto isso:</strong> O sistema está exibindo <strong>dados DEMO</strong> nas buscas. Configure uma key válida para buscar leads reais.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert de informação */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">🔒 Segurança Garantida</h4>
              <p className="text-sm text-blue-800 mb-2">
                Suas API keys são armazenadas de forma segura e criptografada no servidor Supabase. 
                Apenas os primeiros 8 caracteres são exibidos para confirmação.
              </p>
              <p className="text-xs text-blue-700">
                💡 <strong>Dica:</strong> Comece com Apollo.io (60 créditos grátis/mês) para validar o sistema antes de investir nas outras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 🔥 REMOVIDO: Configuração automática da key inválida
           O botão foi removido porque a key DxFa4BMdoNliED5XiOlOkw está inválida (401) */}
      
      {/* INSTRUÇÕES PARA OBTER NOVA KEY */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex gap-3 flex-1">
              <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-1">🎯 Como obter uma API Key VÁLIDA do Apollo.io</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <p>1. Crie uma conta grátis em <a href="https://app.apollo.io/sign_up" target="_blank" className="underline font-semibold">app.apollo.io/sign_up</a></p>
                  <p>2. Acesse as configurações de API: <a href="https://app.apollo.io/#/settings/integrations/api" target="_blank" className="underline font-semibold">Settings → API</a></p>
                  <p>3. Clique em "<strong>Create New Key</strong>"</p>
                  <p>4. Copie a key e cole no campo abaixo</p>
                  <p className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded mt-2">
                    ✅ <strong>Plano Grátis:</strong> 60 créditos/mês (suficiente para testar!)
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => window.open('https://app.apollo.io/#/settings/integrations/api', '_blank')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Obter API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <div className="space-y-4">
        <ApiKeyInput
          name="apollo"
          label="🟣 Apollo.io"
          placeholder="Cole sua Apollo API Key aqui"
          link="https://app.apollo.io/#/settings/integrations/api"
          freeTier="🆓 60 créditos grátis/mês • Principal fonte de dados"
          configured={keys.apollo}
        />

        <ApiKeyInput
          name="proxycurl"
          label="🔵 Proxycurl (LinkedIn)"
          placeholder="Cole sua Proxycurl API Key aqui"
          link="https://nubela.co/proxycurl/"
          freeTier="💰 Sem trial • $0.10-$0.25 por lead • Melhor qualidade"
          configured={keys.proxycurl}
        />

        <ApiKeyInput
          name="hunter"
          label="🟢 Hunter.io"
          placeholder="Cole sua Hunter API Key aqui"
          link="https://hunter.io/api-keys"
          freeTier="🆓 25 buscas grátis/mês • Emails validados"
          configured={keys.hunter}
        />

        <ApiKeyInput
          name="pdl"
          label="🔴 People Data Labs (PDL)"
          placeholder="Cole sua PDL API Key aqui"
          link="https://www.peopledatalabs.com/"
          freeTier="🆓 1000 requisições grátis • Enriquecimento de dados"
          configured={keys.pdl}
        />

        <ApiKeyInput
          name="rocketreach"
          label="🟠 RocketReach"
          placeholder="Cole sua RocketReach API Key aqui"
          link="https://rocketreach.co/api"
          freeTier="🆓 5 lookups grátis/mês • Contatos diretos"
          configured={keys.rocketreach}
        />
      </div>

      {/* Botão de Salvar */}
      <div className="flex gap-3">
        <Button
          onClick={saveApiKeys}
          disabled={saving}
          className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={loadApiKeys}
          className="border-2"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Recarregar
        </Button>
      </div>

      {/* Guia de Prioridade */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            📋 Ordem de Prioridade Recomendada
          </h4>
          <ol className="space-y-2 text-sm text-green-800">
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 flex-shrink-0">1.</span>
              <span><strong>Apollo.io</strong> → Comece aqui! 60 créditos grátis por mês. Principal fonte de dados.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 flex-shrink-0">2.</span>
              <span><strong>Hunter.io</strong> → 25 buscas grátis/mês para validar emails.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 flex-shrink-0">3.</span>
              <span><strong>Proxycurl</strong> → Adicionar depois de validar o MVP. Melhor qualidade mas sem trial.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 flex-shrink-0">4.</span>
              <span><strong>PDL & RocketReach</strong> → Opcional para enriquecimento adicional.</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}