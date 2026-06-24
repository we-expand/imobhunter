import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Loader2, Activity } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';

export function SearchTestPanel() {
  const [testing, setTesting] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  
  const testApis = async () => {
    setTesting(true);
    console.log('🧪 [TEST] Iniciando teste de APIs...');
    
    try {
      const url = `${API_BASE_URL}${API_ROUTES.diagnostics}`;
      console.log('🧪 [TEST] URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      console.log('🧪 [TEST] Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('🧪 [TEST] Resultado:', data);
      setApiStatus(data);
      
    } catch (error) {
      console.error('❌ [TEST] Erro:', error);
      setApiStatus({ error: error instanceof Error ? error.message : 'Erro desconhecido' });
    } finally {
      setTesting(false);
    }
  };
  
  return (
    <Card className="p-6 bg-slate-800 border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Teste de Conectividade
        </h3>
        <Button
          onClick={testApis}
          disabled={testing}
          size="sm"
          variant="outline"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testando...
            </>
          ) : (
            'Testar APIs'
          )}
        </Button>
      </div>
      
      {apiStatus && !apiStatus.error && (
        <div className="space-y-2">
          {Object.entries(apiStatus).map(([key, value]: [string, any]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-700">
              <div className="flex items-center gap-2">
                {value.configured ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="font-mono text-sm">{key}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={value.configured ? 'default' : 'secondary'}>
                  {value.configured ? 'Configurada' : 'Não configurada'}
                </Badge>
                {value.valid && (
                  <Badge className="bg-green-500 text-white">Válida</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {apiStatus?.error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-500">
          <p className="font-semibold">Erro:</p>
          <p className="text-sm mt-1">{apiStatus.error}</p>
        </div>
      )}
    </Card>
  );
}
