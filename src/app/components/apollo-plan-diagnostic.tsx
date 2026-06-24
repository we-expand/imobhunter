import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ApolloPlanDiagnostic() {
  const [testing, setTesting] = useState(false);
  const [diagnostic, setDiagnostic] = useState<any>(null);

  const runDiagnostic = async () => {
    setTesting(true);
    setDiagnostic(null);

    try {
      // 🔥 Teste 1: Verificar se a API Key funciona
      console.log('🧪 Iniciando diagnóstico do plano Apollo...');
      
      const testPayload = {
        page: 1,
        per_page: 1, // Só 1 resultado para economizar créditos
        person_names: ['Elon Musk'], // Nome famoso que sempre existe
        organization_names: ['Tesla'],
      };

      // 🔥 Busca a API Key do servidor (não do env local)
      console.log('📡 Buscando API Key do servidor...');
      const keysResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/search/config/api-keys`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (!keysResponse.ok) {
        throw new Error('Não foi possível carregar as API keys do servidor');
      }
      
      const keysData = await keysResponse.json();
      const apolloKey = keysData?.keys?.apollo;
      
      if (!apolloKey) {
        setDiagnostic({
          success: false,
          error: 'API Key não configurada',
          message: 'Configure APOLLO_API_KEY em Configurações → Segurança → Diagnóstico de Chaves'
        });
        setTesting(false);
        return;
      }
      
      console.log(`   ✅ API Key encontrada: ${apolloKey}`);

      console.log('📡 Testando Apollo.io com busca simples...');
      console.log('   Payload:', JSON.stringify(testPayload, null, 2));

      // 🔥 FIX: Usar o NOVO endpoint do Apollo.io (api_search, não search!)
      const response = await fetch('https://api.apollo.io/api/v1/mixed_people/api_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apolloKey,
        },
        body: JSON.stringify(testPayload),
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Resposta OK:', data);

        setDiagnostic({
          success: true,
          status: response.status,
          plan: detectPlan(data),
          credits: data.pagination?.total_entries || 0,
          results: data.people?.length || 0,
          hasEmail: data.people?.[0]?.email ? true : false,
          hasPhone: data.people?.[0]?.phone_numbers?.length > 0,
          rawResponse: data,
          limitations: analyzeLimitations(data),
        });
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        console.error('❌ Erro Apollo:', errorData);

        setDiagnostic({
          success: false,
          status: response.status,
          error: errorData,
          message: getErrorMessage(response.status, errorData),
        });
      }
    } catch (error: any) {
      console.error('❌ Erro ao testar Apollo:', error);
      setDiagnostic({
        success: false,
        error: error.message,
        message: 'Erro de conexão com a API do Apollo'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg mb-1">🔬 Diagnóstico do Plano Apollo.io</h3>
          <p className="text-sm text-gray-600">
            Teste sua API Key e descubra quais funcionalidades estão disponíveis no seu plano
          </p>
        </div>
        <button
          onClick={runDiagnostic}
          disabled={testing}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {testing ? '🔄 Testando...' : '🧪 Executar Teste'}
        </button>
      </div>

      {diagnostic && (
        <div className="space-y-4">
          {/* Status Geral */}
          <div className={`p-4 rounded-lg border-2 ${
            diagnostic.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {diagnostic.success ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <div className="flex-1">
                <p className={diagnostic.success ? 'text-green-900' : 'text-red-900'}>
                  {diagnostic.success 
                    ? '✅ API Key válida e funcionando!' 
                    : `❌ ${diagnostic.message}`
                  }
                </p>
                {diagnostic.status && (
                  <p className="text-sm text-gray-600 mt-1">
                    HTTP Status: {diagnostic.status}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Detalhes do Plano */}
          {diagnostic.success && (
            <>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Informações do Plano
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Plano Detectado:</p>
                    <p className="font-semibold text-blue-900">{diagnostic.plan}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Resultados Encontrados:</p>
                    <p className="font-semibold text-blue-900">{diagnostic.results}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Emails Disponíveis:</p>
                    <p className={`font-semibold ${diagnostic.hasEmail ? 'text-green-600' : 'text-orange-600'}`}>
                      {diagnostic.hasEmail ? '✅ Sim' : '⚠️ Não (requer upgrade)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Telefones Disponíveis:</p>
                    <p className={`font-semibold ${diagnostic.hasPhone ? 'text-green-600' : 'text-orange-600'}`}>
                      {diagnostic.hasPhone ? '✅ Sim' : '⚠️ Não (requer upgrade)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Limitações */}
              {diagnostic.limitations && diagnostic.limitations.length > 0 && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Limitações Detectadas
                  </h4>
                  <ul className="space-y-2">
                    {diagnostic.limitations.map((limitation: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-orange-900">
                        <span className="mt-0.5">⚠️</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recomendações */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3">💡 Recomendações</h4>
                <div className="space-y-2 text-sm text-purple-900">
                  {!diagnostic.hasEmail && (
                    <p>• Para acessar emails, considere fazer upgrade para o plano Basic ($49/mês) ou superior</p>
                  )}
                  {!diagnostic.hasPhone && (
                    <p>• Telefones estão disponíveis nos planos Professional ($99/mês) ou superior</p>
                  )}
                  <p>• Alternativamente, use APIs complementares:</p>
                  <div className="ml-4 space-y-1 mt-2">
                    <p>→ <strong>Hunter.io</strong> - Especializado em emails (50 buscas grátis/mês)</p>
                    <p>→ <strong>RapidAPI LinkedIn</strong> - Perfis do LinkedIn (freemium)</p>
                    <p>→ <strong>Lusha</strong> - Emails + Telefones (5 créditos grátis/mês)</p>
                  </div>
                  <a
                    href="https://www.apollo.io/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-purple-700 hover:text-purple-900 underline"
                  >
                    Ver planos do Apollo.io
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Resposta Técnica (Collapsible) */}
              <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                  🔍 Ver Resposta Técnica Completa
                </summary>
                <pre className="mt-3 text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-96">
                  {JSON.stringify(diagnostic.rawResponse, null, 2)}
                </pre>
              </details>
            </>
          )}

          {/* Erro Detalhado */}
          {!diagnostic.success && diagnostic.error && (
            <details className="bg-red-50 border border-red-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-red-700 hover:text-red-900">
                🔍 Ver Detalhes do Erro
              </summary>
              <pre className="mt-3 text-xs bg-white p-3 rounded border border-red-200 overflow-auto max-h-64">
                {JSON.stringify(diagnostic.error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// 🔥 Detecta o plano baseado nas features disponíveis
function detectPlan(data: any): string {
  const hasEmail = data.people?.[0]?.email;
  const hasPhone = data.people?.[0]?.phone_numbers?.length > 0;
  const hasExportCredits = data.pagination?.total_entries > 100;

  if (hasEmail && hasPhone && hasExportCredits) {
    return 'Professional ou Organization ($99-499/mês)';
  } else if (hasEmail && hasPhone) {
    return 'Professional ($99/mês)';
  } else if (hasEmail) {
    return 'Basic ($49/mês)';
  } else {
    return 'Free (limitado)';
  }
}

// 🔥 Analisa limitações
function analyzeLimitations(data: any): string[] {
  const limitations = [];

  if (!data.people?.[0]?.email) {
    limitations.push('Emails não disponíveis - Requer plano Basic ou superior');
  }

  if (!data.people?.[0]?.phone_numbers || data.people[0].phone_numbers.length === 0) {
    limitations.push('Telefones não disponíveis - Requer plano Professional ou superior');
  }

  const totalEntries = data.pagination?.total_entries || 0;
  if (totalEntries <= 50) {
    limitations.push('Limite de 50 créditos mensais - Considere fazer upgrade');
  }

  return limitations;
}

// 🔥 Mensagens de erro amigáveis
function getErrorMessage(status: number, errorData: any): string {
  switch (status) {
    case 401:
      return 'API Key inválida ou expirada - Gere uma nova em apollo.io/settings/api';
    case 402:
      return 'Créditos esgotados - Aguarde renovação mensal ou faça upgrade';
    case 403:
      return 'Acesso negado - Verifique permissões da API Key';
    case 429:
      return 'Limite de requisições excedido - Aguarde alguns minutos';
    case 500:
      return 'Erro interno do Apollo - Tente novamente em alguns minutos';
    default:
      return errorData.message || `Erro ${status} - ${errorData.error || 'Desconhecido'}`;
  }
}