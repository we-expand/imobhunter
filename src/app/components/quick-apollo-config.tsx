import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, Key, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function QuickApolloConfig() {
  const [apolloKey, setApolloKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    setErrorMessage('');
    
    if (!apolloKey || apolloKey.length < 10) {
      setErrorMessage('⚠️ A chave deve ter pelo menos 10 caracteres');
      return;
    }

    setIsSaving(true);

    try {
      console.log('💾 Salvando Apollo API Key no servidor...');
      console.log('📡 URL:', `https://${projectId}.supabase.co/functions/v1/make-server-v2/search/config/api-keys`);
      console.log('🔑 API Key:', apolloKey.substring(0, 8) + '...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/search/config/api-keys`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apolloKey: apolloKey
          }),
        }
      );

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro HTTP:', errorText);
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Resposta do servidor:', data);

      if (data.success) {
        setIsSaved(true);
        // Limpa o campo após 2 segundos
        setTimeout(() => {
          setApolloKey('');
        }, 2000);
      } else {
        throw new Error(data.message || 'Erro ao salvar');
      }

    } catch (error) {
      console.error('❌ Erro ao salvar API Key:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Key className="w-5 h-5" />
          Configuração Rápida do Apollo.io
        </CardTitle>
        <CardDescription>
          {isSaved ? (
            <span className="flex items-center gap-2 text-green-700 font-medium">
              <Check className="w-4 h-4" />
              API Key configurada com sucesso!
            </span>
          ) : (
            'Configure sua API Key do Apollo.io para obter dados reais'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSaved && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">⚠️ Dados DEMO detectados</p>
              <p>Configure a API Key abaixo para buscar leads reais do Apollo.io</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Apollo.io API Key:
          </label>
          <Input
            type="text"
            placeholder="Cole sua API Key aqui (ex: Uz7e64iwMGpRmW49pcVXTg)"
            value={apolloKey}
            onChange={(e) => setApolloKey(e.target.value)}
            disabled={isSaving || isSaved}
            className="font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            Obtenha sua API Key em:{' '}
            <a
              href="https://app.apollo.io/#/settings/integrations/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              apollo.io → Settings → API
            </a>
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving || !apolloKey || isSaved}
          className="w-full"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Salvando...
            </>
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Configurado!
            </>
          ) : (
            <>
              <Key className="w-4 h-4 mr-2" />
              Salvar API Key
            </>
          )}
        </Button>

        {isSaved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            <p className="font-medium mb-1">✅ Próximos passos:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Vá na aba <strong>"Buscar Leads"</strong></li>
              <li>Faça uma nova busca</li>
              <li>Os leads devem vir <strong>SEM o distintivo "PRO" 🟡</strong></li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}