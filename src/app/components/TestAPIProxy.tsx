/**
 * 🧪 TESTE RÁPIDO DE API PROXY
 * 
 * Componente para testar se o proxy do Supabase está funcionando
 * e retornando dados REAIS das APIs
 */

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const SUPABASE_SERVER_URL = `https://${projectId}.supabase.co/functions/v1/server`;

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'testing';
  message: string;
  details?: any;
}

export const TestAPIProxy: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'CORS Preflight', status: 'pending', message: 'Não testado' },
    { name: 'Apollo Proxy', status: 'pending', message: 'Não testado' },
    { name: 'Proxycurl Proxy', status: 'pending', message: 'Não testado' },
  ]);
  const [isTesting, setIsTesting] = useState(false);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((t, i) => i === index ? { ...t, ...updates } : t));
  };

  const runAllTests = async () => {
    setIsTesting(true);

    // TEST 1: CORS Preflight
    updateTest(0, { status: 'testing', message: 'Testando OPTIONS...' });
    try {
      const response = await fetch(`${SUPABASE_SERVER_URL}/api-proxy/proxycurl/search`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,authorization',
        },
      });

      if (response.status === 204 || response.status === 200) {
        updateTest(0, {
          status: 'success',
          message: `✅ CORS OK (${response.status})`,
          details: Object.fromEntries(response.headers.entries())
        });
      } else {
        updateTest(0, {
          status: 'error',
          message: `❌ Status ${response.status}`,
          details: await response.text()
        });
      }
    } catch (error: any) {
      updateTest(0, {
        status: 'error',
        message: `❌ ${error.message}`,
        details: error
      });
    }

    // TEST 2: Apollo Proxy
    updateTest(1, { status: 'testing', message: 'Testando Apollo...' });
    try {
      const response = await fetch(`${SUPABASE_SERVER_URL}/api-proxy/apollo/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          person_names: ['John Doe'],
          per_page: 5,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const count = data.data?.people?.length || 0;
        updateTest(1, {
          status: 'success',
          message: `✅ Apollo funcionando! (${count} resultados)`,
          details: data
        });
      } else {
        updateTest(1, {
          status: 'error',
          message: `❌ ${data.message || response.statusText}`,
          details: data
        });
      }
    } catch (error: any) {
      updateTest(1, {
        status: 'error',
        message: `❌ ${error.message}`,
        details: error
      });
    }

    // TEST 3: Proxycurl Proxy
    updateTest(2, { status: 'testing', message: 'Testando Proxycurl...' });
    try {
      const response = await fetch(`${SUPABASE_SERVER_URL}/api-proxy/proxycurl/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          first_name: 'John',
          last_name: 'Doe',
          country: 'US',
          page_size: 5,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const count = data.data?.results?.length || 0;
        updateTest(2, {
          status: 'success',
          message: `✅ Proxycurl funcionando! (${count} resultados)`,
          details: data
        });
      } else {
        updateTest(2, {
          status: 'error',
          message: `❌ ${data.message || response.statusText}`,
          details: data
        });
      }
    } catch (error: any) {
      updateTest(2, {
        status: 'error',
        message: `❌ ${error.message}`,
        details: error
      });
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-500">Sucesso</Badge>;
      case 'error': return <Badge className="bg-red-500">Erro</Badge>;
      case 'testing': return <Badge className="bg-blue-500">Testando...</Badge>;
      default: return <Badge className="bg-gray-400">Pendente</Badge>;
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">🧪 Teste de API Proxy</h2>
          <p className="text-sm text-gray-600 mt-1">
            Verificar se o servidor Supabase está retornando dados REAIS
          </p>
        </div>
        
        <Button 
          onClick={runAllTests} 
          disabled={isTesting}
          size="lg"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            '▶️ Executar Testes'
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {tests.map((test, index) => (
          <div 
            key={index}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{test.name}</h3>
                    {getStatusBadge(test.status)}
                  </div>
                  <p className="text-sm text-gray-600">{test.message}</p>
                </div>
              </div>
            </div>

            {test.details && test.status === 'success' && (
              <details className="mt-3">
                <summary className="text-sm text-blue-600 cursor-pointer hover:underline">
                  Ver detalhes da resposta
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(test.details, null, 2)}
                </pre>
              </details>
            )}

            {test.details && test.status === 'error' && (
              <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                <p className="text-sm font-semibold text-red-700 mb-1">Detalhes do erro:</p>
                <pre className="text-xs text-red-600 overflow-auto max-h-40">
                  {typeof test.details === 'string' 
                    ? test.details 
                    : JSON.stringify(test.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Instruções:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Clique em "Executar Testes" acima</li>
          <li>Aguarde os 3 testes completarem</li>
          <li>Se todos passarem (✅), as APIs estão funcionando corretamente</li>
          <li>Se algum falhar (❌), o servidor Supabase precisa ser deployado com as correções</li>
        </ol>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Se os testes falharem:</h4>
        <p className="text-sm text-yellow-800 mb-2">
          O servidor precisa ser deployado com as correções de CORS. Execute:
        </p>
        <code className="block p-2 bg-yellow-100 rounded text-xs font-mono">
          supabase functions deploy server --project-ref evdyqlrssgsktctjruuq
        </code>
      </div>
    </Card>
  );
};