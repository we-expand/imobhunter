/**
 * 🔬 Botão de Teste do Apollo.io
 * Testa a API do Apollo diretamente e mostra os resultados
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, CheckCircle2, XCircle, Beaker } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { searchApolloContacts } from '../utils/apollo-client';

export function ApolloTestButton() {
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);

  const testApollo = async () => {
    setTesting(true);
    console.log('🧪 Iniciando teste do Apollo...');
    
    try {
      const result = await searchApolloContacts({
        person_titles: ['CEO', 'Founder'],
        q_organization_keyword_tags: ['Real Estate', 'Property'],
        page: 1,
        per_page: 5,
      });

      if (result.success) {
        const message = `✅ Apollo OK! ${result.totalResults} contatos encontrados`;
        setLastResult({
          success: true,
          message,
          timestamp: new Date().toISOString(),
        });
        toast.success('Apollo funcionando!', {
          description: message,
          duration: 5000,
        });
        console.log('✅ Teste do Apollo concluído:', result);
      } else {
        const message = `❌ Erro: ${result.error}`;
        setLastResult({
          success: false,
          message,
          timestamp: new Date().toISOString(),
        });
        toast.error('Erro no Apollo', {
          description: message,
          duration: 6000,
        });
        console.error('❌ Teste do Apollo falhou:', result);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setLastResult({
        success: false,
        message: `❌ Exceção: ${message}`,
        timestamp: new Date().toISOString(),
      });
      toast.error('Erro no teste', {
        description: message,
        duration: 6000,
      });
      console.error('❌ Exceção no teste do Apollo:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2">
      <Button
        onClick={testApollo}
        disabled={testing}
        className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white shadow-2xl h-16 px-8 gap-3 text-base font-bold animate-pulse hover:animate-none transition-all border-2 border-purple-400"
      >
        {testing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Testando Apollo...</span>
          </>
        ) : (
          <>
            <Beaker className="w-6 h-6" />
            <span>🔬 Testar Apollo v1.2.0</span>
          </>
        )}
      </Button>

      {lastResult && (
        <div 
          className={`p-3 rounded-lg shadow-lg text-sm max-w-xs ${
            lastResult.success 
              ? 'bg-green-50 border border-green-300 text-green-800'
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}
        >
          <div className="flex items-start gap-2">
            {lastResult.success ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="break-words">{lastResult.message}</div>
              <div className="text-xs opacity-60 mt-1">
                {new Date(lastResult.timestamp).toLocaleTimeString('pt-PT')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
