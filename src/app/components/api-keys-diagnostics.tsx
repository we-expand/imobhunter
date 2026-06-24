/**
 * 🔍 DIAGNÓSTICO DE API KEYS
 * Verifica se todas as APIs estão configuradas e funcionando
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';

interface APIStatus {
  name: string;
  key: string;
  configured: boolean;
  valid: boolean;
  preview?: string;
  error?: string;
}

export function APIKeysDiagnostics() {
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<APIStatus[]>([]);

  const checkAPIs = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Verificando status das API keys...');
      
      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.diagnostics}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error('Erro ao verificar APIs');
      }

      const data = await response.json();
      console.log('✅ Status recebido:', data);
      
      setStatuses(data.apis || []);
      
      const configuredCount = data.apis.filter((api: APIStatus) => api.configured && api.valid).length;
      
      if (configuredCount === 0) {
        toast.error('❌ Nenhuma API configurada', {
          description: 'Configure pelo menos uma API de busca para usar o sistema',
          duration: 6000,
        });
      } else if (configuredCount < data.apis.length) {
        toast.warning(`⚠️ ${configuredCount} de ${data.apis.length} APIs configuradas`, {
          description: 'Algumas APIs não estão disponíveis. Configure mais para melhores resultados.',
          duration: 5000,
        });
      } else {
        toast.success('✅ Todas as APIs configuradas!', {
          description: 'Sistema pronto para buscas reais de leads',
          duration: 4000,
        });
      }
      
    } catch (error) {
      console.error('❌ Erro ao verificar APIs:', error);
      toast.error('Erro ao verificar APIs', {
        description: error instanceof Error ? error.message : 'Tente novamente',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: APIStatus) => {
    if (!status.configured) {
      return <XCircle className="size-5 text-red-500" />;
    }
    if (!status.valid) {
      return <AlertCircle className="size-5 text-yellow-500" />;
    }
    return <CheckCircle2 className="size-5 text-green-500" />;
  };

  const getStatusBadge = (status: APIStatus) => {
    if (!status.configured) {
      return <Badge variant="destructive">Não Configurada</Badge>;
    }
    if (!status.valid) {
      return <Badge className="bg-yellow-500">Inválida</Badge>;
    }
    return <Badge className="bg-green-500">Funcionando</Badge>;
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Diagnóstico de API Keys
        </CardTitle>
        <CardDescription>
          Verifique se as APIs de busca estão configuradas e funcionando
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info sobre configuração automática */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-1">
                ✅ Configuração Automática de APIs
              </h4>
              <p className="text-sm text-green-800 mb-2">
                Todas as chaves de API estão configuradas automaticamente através das variáveis de ambiente do sistema.
              </p>
              <div className="text-xs text-green-700 space-y-1">
                <p>• Apollo.io - Dados profissionais</p>
                <p>• Hunter.io - Verificação de emails</p>
                <p>• RapidAPI - LinkedIn Sales Navigator</p>
                <p>• Proxycurl - Dados do LinkedIn</p>
                <p>• People Data Labs - Enriquecimento de dados</p>
                <p>• RocketReach - Contatos diretos</p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={checkAPIs} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="size-4 mr-2" />
              Verificar Status das APIs
            </>
          )}
        </Button>

        {statuses.length > 0 && (
          <div className="space-y-3 mt-6">
            <div className="font-semibold text-sm text-muted-foreground">
              Status das APIs:
            </div>
            
            {statuses.map((status, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <div className="font-medium">{status.name}</div>
                    {status.preview && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {status.preview}
                      </div>
                    )}
                    {status.error && (
                      <div className="text-xs text-red-500 mt-1">
                        {status.error}
                      </div>
                    )}
                  </div>
                </div>
                {getStatusBadge(status)}
              </div>
            ))}
            
            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="text-sm space-y-2">
                <div className="font-semibold text-blue-900 dark:text-blue-100">
                  ℹ️ Como Funciona:
                </div>
                <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-xs">
                  <li>✅ <strong>Verde:</strong> API configurada e válida</li>
                  <li>⚠️ <strong>Amarelo:</strong> API configurada mas formato inválido</li>
                  <li>❌ <strong>Vermelho:</strong> API não configurada</li>
                  <li>🔍 <strong>Busca:</strong> Usa todas as APIs configuradas automaticamente</li>
                  <li>🔒 <strong>Segurança:</strong> Chaves geridas a nível de servidor</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}