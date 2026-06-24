import React, { useState } from 'react';
import { Activity, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { BackendDeployHelper } from './backend-deploy-helper';

interface APIStatus {
  status: 'ok' | 'error' | 'testing';
  message?: string;
  apis?: {
    proxycurl: boolean;
    apollo: boolean;
  };
  timestamp?: string;
}

export function APITestPanel() {
  const [testResult, setTestResult] = useState<APIStatus | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoint = async () => {
    setIsTesting(true);
    setTestResult({ status: 'testing' });

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-v2/health`;
      console.log('🧪 Testando endpoint:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Resposta:', data);

      setTestResult({
        status: 'ok',
        message: data.message,
        apis: data.apis,
        timestamp: data.timestamp
      });

    } catch (error: any) {
      console.error('❌ Erro:', error);
      
      let message = error.message;
      if (error.message?.includes('Failed to fetch')) {
        message = 'Edge Function não está deployado ou inacessível';
      }

      setTestResult({
        status: 'error',
        message
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold">Status do Backend</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Teste a conexão com LinkedIn + Apollo APIs
            </p>
          </div>
        </div>
        <Button
          onClick={testEndpoint}
          disabled={isTesting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 mr-2" />
              Testar Backend
            </>
          )}
        </Button>
      </div>

      {testResult && (
        <div className="mt-4 space-y-3">
          {testResult.status === 'testing' && (
            <div className="flex items-center gap-3 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-800 dark:text-blue-300">Conectando ao servidor...</span>
            </div>
          )}

          {testResult.status === 'ok' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    ✅ Backend Online!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {testResult.message}
                  </p>
                </div>
              </div>

              {testResult.apis && (
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${
                    testResult.apis.proxycurl
                      ? 'bg-green-50 dark:bg-green-900/10 border border-green-200'
                      : 'bg-red-50 dark:bg-red-900/10 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Proxycurl (LinkedIn)</span>
                      {testResult.apis.proxycurl ? (
                        <Badge className="bg-green-600 text-white">✓ Configurado</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white">✗ Faltando</Badge>
                      )}
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    testResult.apis.apollo
                      ? 'bg-green-50 dark:bg-green-900/10 border border-green-200'
                      : 'bg-red-50 dark:bg-red-900/10 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Apollo.io</span>
                      {testResult.apis.apollo ? (
                        <Badge className="bg-green-600 text-white">✓ Configurado</Badge>
                      ) : (
                        <Badge className="bg-red-600 text-white">✗ Faltando</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {testResult.timestamp && (
                <p className="text-xs text-gray-500">
                  Última verificação: {new Date(testResult.timestamp).toLocaleString('pt-PT')}
                </p>
              )}
            </div>
          )}

          {testResult.status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-300">
                  ❌ Backend Offline
                </p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {testResult.message}
                </p>
                <div className="mt-3 text-xs text-red-600 dark:text-red-400 space-y-1">
                  <p>Possíveis causas:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    <li>Edge Function ainda não foi deployado</li>
                    <li>Aguarde 2-5 minutos após modificações</li>
                    <li>Verifique logs no Supabase Dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
        <p className="font-medium mb-1">📊 Informações do Servidor:</p>
        <p className="text-gray-600 dark:text-gray-400">
          Endpoint: <code className="bg-white dark:bg-gray-900 px-1 py-0.5 rounded">
            /functions/v1/make-server-v2/health
          </code>
        </p>
      </div>
    </Card>
  );
}
