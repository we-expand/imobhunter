import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Loader2, Zap } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ServerConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setStatus('testing');
    setError('');
    setResponseData(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/ping`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResponseData(data);
      setStatus('success');
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      setStatus('error');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Teste de Conexão do Servidor
        </CardTitle>
        <CardDescription>
          Verificar conectividade com a Edge Function do Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Projeto ID:</span>{' '}
            <code className="bg-slate-100 px-2 py-1 rounded text-xs">{projectId}</code>
          </div>
          <div className="text-sm">
            <span className="font-medium">Endpoint:</span>{' '}
            <code className="bg-slate-100 px-2 py-1 rounded text-xs break-all">
              /functions/v1/make-server-v2/ping
            </code>
          </div>
        </div>

        <Button 
          onClick={testConnection}
          disabled={status === 'testing'}
          className="w-full"
        >
          {status === 'testing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testando conexão...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Testar Conexão
            </>
          )}
        </Button>

        {status === 'success' && responseData && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Conexão bem-sucedida!</span>
            </div>
            <div className="text-sm text-green-600 space-y-1">
              <div><strong>Status:</strong> {responseData.status}</div>
              <div><strong>Versão:</strong> {responseData.version}</div>
              <div><strong>Projeto:</strong> {responseData.project}</div>
              <div><strong>Mensagem:</strong> {responseData.message}</div>
              <div><strong>Timestamp:</strong> {new Date(responseData.timestamp).toLocaleString('pt-PT')}</div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Erro na conexão</span>
            </div>
            <div className="text-sm text-red-600">
              <strong>Erro:</strong> {error}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
