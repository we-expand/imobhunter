import { useState, useEffect } from 'react';
import { Bot, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

export function IASetup() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini'
  });

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/ia/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setIsConnected(true);
          setFormData({
            provider: data.provider || 'openai',
            apiKey: '********',
            model: data.model || 'gpt-4o-mini'
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar IA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.apiKey || !formData.model) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      const res = await fetch(`${API_URL}/ia/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao conectar IA');
      }

      setIsConnected(true);
      toast.success('✅ IA conectada com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/ia/disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setIsConnected(false);
        setFormData({ provider: 'openai', apiKey: '', model: 'gpt-4o-mini' });
        toast.success('IA desconectada');
      }
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Bot className="w-5 h-5" />
            Configurar Assistente IA
          </CardTitle>
          <CardDescription>
            Configure sua chave API para gerar mensagens inteligentes
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {!isConnected ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Provider */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🤖 Provedor de IA
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    provider: e.target.value,
                    model: e.target.value === 'openai' ? 'gpt-4o-mini' : 'claude-3-5-sonnet-20241022'
                  })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="openai">OpenAI (GPT-4, GPT-3.5)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                </select>
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ✨ Modelo
                </label>
                {formData.provider === 'openai' ? (
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="gpt-4o-mini">GPT-4o Mini (Rápido e económico)</option>
                    <option value="gpt-4o">GPT-4o (Mais inteligente)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Mais barato)</option>
                  </select>
                ) : (
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recomendado)</option>
                    <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Mais rápido)</option>
                  </select>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Escolha o modelo que melhor se adequa às suas necessidades
                </p>
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  🔑 Chave API
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  placeholder={formData.provider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.provider === 'openai' 
                    ? 'Sua chave começa com "sk-"' 
                    : 'Sua chave começa com "sk-ant-"'}
                </p>
              </div>

              {/* Info */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900 font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Como obter sua chave API:
                </p>
                {formData.provider === 'openai' ? (
                  <ol className="text-sm text-purple-800 space-y-2 list-decimal list-inside">
                    <li>Acesse <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold">platform.openai.com/api-keys</a></li>
                    <li>Clique em "Create new secret key"</li>
                    <li>Copie a chave e cole acima</li>
                    <li>Adicione créditos em Billing (mínimo $5)</li>
                  </ol>
                ) : (
                  <ol className="text-sm text-purple-800 space-y-2 list-decimal list-inside">
                    <li>Acesse <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.anthropic.com/settings/keys</a></li>
                    <li>Clique em "Create Key"</li>
                    <li>Copie a chave e cole acima</li>
                    <li>Adicione créditos em Settings {'>'} Billing</li>
                  </ol>
                )}
              </div>

              {/* Exemplo de uso */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900 font-semibold mb-2">
                  💡 A IA será usada para:
                </p>
                <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
                  <li>Gerar mensagens de cobrança personalizadas</li>
                  <li>Adaptar tom conforme perfil do cliente</li>
                  <li>Sugerir melhores horários de envio</li>
                  <li>Otimizar taxas de resposta</li>
                </ul>
              </div>

              {/* Botão */}
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    A conectar...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Conectar IA
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 mx-auto text-purple-600 mb-6" />
              <p className="font-semibold text-purple-700 text-2xl mb-3">
                ✅ IA Conectada!
              </p>
              <div className="inline-block bg-purple-100 px-6 py-3 rounded-full border-2 border-purple-300 mb-2">
                <p className="text-sm text-purple-800 font-semibold">
                  🤖 {formData.provider === 'openai' ? 'OpenAI' : 'Anthropic'}
                </p>
              </div>
              <p className="text-sm text-purple-600 mb-6">
                Modelo: {formData.model}
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-emerald-900 mb-2 font-semibold">
                  ✅ Assistente IA Ativo!
                </p>
                <p className="text-xs text-emerald-800">
                  A IA está pronta para gerar mensagens inteligentes de cobrança
                </p>
              </div>

              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDisconnect}
              >
                Desconectar IA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
