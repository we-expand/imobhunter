import React, { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function DebugInfo() {
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    try {
      console.log('🔍 Testando backend...');
      console.log('📡 Project ID:', projectId);
      console.log('🔑 Anon Key:', publicAnonKey.substring(0, 20) + '...');

      const results: any = {
        projectId,
        anonKey: publicAnonKey.substring(0, 20) + '...',
        tests: []
      };

      // Lista de URLs para testar
      const urlsToTest = [
        {
          name: 'imobhunter-api (ping)',
          url: `https://${projectId}.supabase.co/functions/v1/make-server-v2/imobhunter-api/ping`
        },
        {
          name: 'imobhunter-api (diagnostics)',
          url: `https://${projectId}.supabase.co/functions/v1/make-server-v2/imobhunter-api/diagnostics`
        },
        {
          name: 'imobhunter-api (health)',
          url: `https://${projectId}.supabase.co/functions/v1/make-server-v2/imobhunter-api/health`
        },
        {
          name: 'imobhunter-api (raiz)',
          url: `https://${projectId}.supabase.co/functions/v1/make-server-v2/imobhunter-api`
        },
        {
          name: 'make-server-v2 (ping)',
          url: `https://${projectId}.supabase.co/functions/v1/make-server-v2/ping`
        },
        {
          name: 'server (ping)',
          url: `https://${projectId}.supabase.co/functions/v1/server/ping`
        },
        {
          name: 'server (health)',
          url: `https://${projectId}.supabase.co/functions/v1/server/health`
        }
      ];

      // Testar todas as URLs
      for (const test of urlsToTest) {
        try {
          console.log(`🧪 Testando ${test.name}...`);
          
          const res = await fetch(test.url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`📊 ${test.name}:`, res.status, res.statusText);
          
          let data;
          try {
            data = await res.json();
          } catch (e) {
            const text = await res.text();
            data = { error: 'Resposta não é JSON', text: text.substring(0, 200) };
          }
          
          results.tests.push({
            name: test.name,
            status: res.status,
            statusText: res.statusText,
            ok: res.ok,
            data: data,
            url: test.url
          });
        } catch (err: any) {
          console.error(`❌ Erro no teste ${test.name}:`, err);
          results.tests.push({
            name: test.name,
            status: 'NETWORK_ERROR',
            ok: false,
            error: err.message,
            errorType: err.name,
            url: test.url
          });
        }
      }

      console.log('✅ Testes completos:', results);
      setBackendStatus(results);
      setLoading(false);
    } catch (error: any) {
      console.error('❌ Erro ao testar backend:', error);
      setBackendStatus({ error: error.message, errorType: error.name });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 max-w-md z-50 border-2 border-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="font-semibold">Testando Conexão Backend...</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 max-w-2xl z-50 border-2 border-blue-500 max-h-[80vh] overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          🔍 Debug Info
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {backendStatus && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm"><strong>Project ID:</strong> {backendStatus.projectId}</p>
            <p className="text-sm"><strong>Anon Key:</strong> {backendStatus.anonKey}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Testes de Conexão:</h4>
            {backendStatus.tests?.map((test: any, idx: number) => (
              <div
                key={idx}
                className={`rounded-lg p-4 ${
                  test.ok 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{test.ok ? '✅' : '❌'}</span>
                  <p className="font-semibold text-sm">{test.name}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    test.ok ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'
                  }`}>
                    {test.status}
                  </span>
                </div>
                {test.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    <strong>Erro:</strong> {test.error}
                  </p>
                )}
                {test.data && (
                  <pre className="text-xs bg-white dark:bg-slate-900 rounded p-2 mt-2 overflow-auto max-h-32">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={testBackend}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            🔄 Testar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
