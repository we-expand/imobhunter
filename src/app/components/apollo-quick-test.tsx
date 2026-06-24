import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Key } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';

export function ApolloQuickTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [debugEnv, setDebugEnv] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const testApolloConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.diagnostics}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // 🔥 DEBUG: Log completo da resposta
      console.log('🔥 ═════════════════════════════════════════');
      console.log('🔥 RESPOSTA COMPLETA DO BACKEND:');
      console.log('🔥 ═════════════════════════════════════════');
      console.log('Full response:', JSON.stringify(data, null, 2));
      console.log('Apollo data:', data?.apis?.apollo);
      console.log('Apollo fullKey:', data?.apis?.apollo?.fullKey);
      console.log('Apollo fullKey length:', data?.apis?.apollo?.fullKey?.length);
      console.log('🔥 ═════════════════════════════════════════');
      
      setResult(data);
    } catch (error: any) {
      console.error('❌ Erro ao testar Apollo:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const debugEnvVars = async () => {
    try {
      console.log('🔥 Endpoint de debug ENV VARS não disponível na nova API');
      toast.info('Debug ENV VARS não disponível');
      return;
      const response = await fetch(
        `${API_BASE_URL}/debug/env-vars-disabled`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      console.log('🔥 ═════════════════════════════════════════');
      console.log('🔥 ENV VARS DEBUG:');
      console.log('🔥 ═════════════════════════════════════════');
      console.log(JSON.stringify(data, null, 2));
      console.log('🔥 ═════════════════════════════════════════');
      
      setDebugEnv(data);
      setShowDebug(true);
    } catch (error: any) {
      console.error('❌ Erro ao debugar ENV:', error);
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col gap-2">
        {/* Botão principal */}
        <button
          onClick={testApolloConnection}
          disabled={testing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
        >
          {testing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Testando APIs...
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              Testar Apollo API
            </>
          )}
        </button>

        {/* Botão de DEBUG */}
        <button
          onClick={debugEnvVars}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105"
        >
          🔥 DEBUG ENV VARS
        </button>
      </div>

      {result && (
        <div className="mt-4 bg-white rounded-lg shadow-2xl p-6 max-w-md max-h-96 overflow-auto">
          <div className="mb-4 pb-4 border-b">
            <h3 className="font-bold text-lg flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              Status das APIs
            </h3>
          </div>

          {result.error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-700 text-sm">Erro: {result.error}</p>
            </div>
          )}

          {result.apis && (
            <div className="space-y-3">
              {/* Apollo.io */}
              <div className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Apollo.io</span>
                  {result.apis.apollo.valid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : result.apis.apollo.configured ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-600">Configurada:</span>{' '}
                    {result.apis.apollo.configured ? '✅ Sim' : '❌ Não'}
                  </p>
                  {result.apis.apollo.configured && (
                    <>
                      <p>
                        <span className="text-gray-600">Válida:</span>{' '}
                        {result.apis.apollo.valid ? '✅ Sim' : '❌ Não'}
                      </p>
                      <p>
                        <span className="text-gray-600">Preview:</span>{' '}
                        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {result.apis.apollo.preview}
                        </code>
                      </p>
                      <p>
                        <span className="text-gray-600">Tamanho:</span>{' '}
                        {result.apis.apollo.keyLength} caracteres
                      </p>
                    </>
                  )}
                  {result.apis.apollo.error && (
                    <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                      <p className="text-red-700 text-xs">
                        {result.apis.apollo.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumo */}
              {result.summary && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                  <p className="text-sm">
                    <strong>Total:</strong> {result.summary.total} APIs
                  </p>
                  <p className="text-sm">
                    <strong>Configuradas:</strong> {result.summary.configured}
                  </p>
                  <p className="text-sm text-green-600">
                    <strong>Válidas:</strong> {result.summary.valid}
                  </p>
                  <p className="text-sm text-red-600">
                    <strong>Inválidas:</strong> {result.summary.invalid}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Faltando:</strong> {result.summary.missing}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setResult(null)}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded transition-colors"
          >
            Fechar
          </button>

          {/* 🔧 Botão para configurar API Keys */}
          {result.apis && result.summary && result.summary.invalid > 0 && (
            <button
              onClick={() => {
                // Abre em nova aba de forma que não seja bloqueado
                const win = window.open('https://app.supabase.com', '_blank');
                if (!win) {
                  alert('⚠️ Pop-up bloqueado! Permita pop-ups ou acesse manualmente:\n\nhttps://app.supabase.com\n\nDepois vá em:\nSettings → Edge Functions → Secrets → APOLLO_API_KEY');
                }
              }}
              className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Configurar API Keys no Supabase
            </button>
          )}

          {/* 🔍 DEBUG: Mostrar chave completa (TEMPORÁRIO) */}
          {result.apis?.apollo?.fullKey && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-xs font-semibold text-yellow-800 mb-2">
                🔥 DEBUG - Chave Apollo (TEMPORÁRIO):
              </p>
              <code className="block bg-yellow-100 px-2 py-1 rounded text-xs break-all font-mono">
                {result.apis.apollo.fullKey}
              </code>
              <p className="text-xs text-yellow-700 mt-2">
                ⚠️ Esta chave deveria ter 22 caracteres.<br/>
                Atualmente tem: <strong>{result.apis.apollo.keyLength}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* 🔍 DEBUG: Mostrar variáveis de ambiente */}
      {showDebug && debugEnv && (
        <div className="mt-4 bg-white rounded-lg shadow-2xl p-6 max-w-2xl max-h-[500px] overflow-auto">
          <div className="mb-4 pb-4 border-b">
            <h3 className="font-bold text-lg flex items-center gap-2">
              🔥 Variáveis de Ambiente (RAW)
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Timestamp: {debugEnv.timestamp}
            </p>
          </div>

          <div className="space-y-4">
            {/* Apollo */}
            <div className="border-2 border-red-500 rounded p-4 bg-red-50">
              <h4 className="font-bold mb-2 text-red-700">🎯 APOLLO_API_KEY</h4>
              <div className="text-sm space-y-2 font-mono">
                <p>
                  <span className="text-gray-600">Configurada:</span>{' '}
                  {debugEnv.apollo?.configured ? '✅ SIM' : '❌ NÃO'}
                </p>
                <p>
                  <span className="text-gray-600">Tamanho:</span>{' '}
                  <strong className="text-lg text-red-700">{debugEnv.apollo?.length} caracteres</strong>
                  {debugEnv.apollo?.length === 22 && ' ✅ CORRETO!'}
                  {debugEnv.apollo?.length === 6 && ' ❌ ERRADO! Deveria ser 22!'}
                </p>
                <p>
                  <span className="text-gray-600">Valor COMPLETO:</span>{' '}
                  <code className="block bg-red-100 px-3 py-2 rounded text-sm mt-1 break-all text-red-900 font-bold">
                    {debugEnv.apollo?.value || 'N/A'}
                  </code>
                </p>
                {debugEnv.apollo?.charCodes && (
                  <p className="text-xs text-gray-500">
                    <span className="text-gray-600">Char codes:</span>{' '}
                    {debugEnv.apollo.charCodes.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* PDL */}
            <div className="border rounded p-3 bg-gray-50">
              <h4 className="font-bold mb-2">PDL_API_KEY</h4>
              <div className="text-sm space-y-1 font-mono">
                <p>
                  <span className="text-gray-600">Configurada:</span>{' '}
                  {debugEnv.pdl?.configured ? '✅ SIM' : '❌ NÃO'}
                </p>
                <p>
                  <span className="text-gray-600">Tamanho:</span> {debugEnv.pdl?.length} chars
                </p>
                <p>
                  <span className="text-gray-600">Valor:</span>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {debugEnv.pdl?.value || 'N/A'}
                  </code>
                </p>
              </div>
            </div>

            {/* Hunter */}
            <div className="border rounded p-3 bg-gray-50">
              <h4 className="font-bold mb-2">HUNTER_API_KEY</h4>
              <div className="text-sm space-y-1 font-mono">
                <p>
                  <span className="text-gray-600">Configurada:</span>{' '}
                  {debugEnv.hunter?.configured ? '✅ SIM' : '❌ NÃO'}
                </p>
                <p>
                  <span className="text-gray-600">Tamanho:</span> {debugEnv.hunter?.length} chars
                </p>
                <p>
                  <span className="text-gray-600">Valor:</span>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {debugEnv.hunter?.value || 'N/A'}
                  </code>
                </p>
              </div>
            </div>

            {/* Mensagem */}
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ {debugEnv.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowDebug(false);
              setDebugEnv(null);
            }}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
}