import React, { useState } from 'react';
import { Terminal, Copy, CheckCircle, AlertCircle, Rocket, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function DeployTerminalGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyCommand = (command: string, step: number) => {
    navigator.clipboard.writeText(command);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: '1. Instalar Supabase CLI',
      command: 'npm install -g supabase',
      description: 'Instala a ferramenta de linha de comando do Supabase globalmente',
      note: '⚠️ Se der erro de permissão, use: sudo npm install -g supabase'
    },
    {
      title: '2. Fazer Login no Supabase',
      command: 'supabase login',
      description: 'Abre o navegador para você autenticar com sua conta Supabase',
      note: '💡 Isso abrirá uma aba no navegador. Faça login e volte ao terminal.'
    },
    {
      title: '3. Descobrir o Project ID',
      command: 'echo "Acesse: https://supabase.com/dashboard/project/_/settings/general"\necho "Copie o \'Reference ID\' (formato: abc123xyz456)"',
      description: 'Você precisa do Reference ID do seu projeto',
      note: '📋 O Reference ID fica em Settings → General → Reference ID'
    },
    {
      title: '4. Inicializar Projeto Supabase',
      command: 'supabase init',
      description: 'Cria os arquivos de configuração localmente',
      note: '✅ Pode dar "Enter" em todas as perguntas para usar valores padrão'
    },
    {
      title: '5. Linkar com Projeto',
      command: 'supabase link --project-ref SEU_PROJECT_ID_AQUI',
      description: 'Conecta sua pasta local com o projeto no Supabase',
      note: '⚠️ SUBSTITUA "SEU_PROJECT_ID_AQUI" pelo Reference ID que você copiou'
    },
    {
      title: '6. Deploy do Edge Function',
      command: 'supabase functions deploy make-server-v2 --no-verify-jwt',
      description: 'Faz upload do Edge Function para o Supabase',
      note: '🚀 Isso envia o arquivo /supabase/functions/server/index.tsx para a nuvem'
    },
    {
      title: '7. Verificar Secrets (APIs já configuradas)',
      command: 'supabase secrets list',
      description: 'Lista todas as variáveis de ambiente configuradas',
      note: '✅ PROXYCURL_API_KEY e APOLLO_API_KEY já devem estar listados'
    },
    {
      title: '8. Testar Edge Function',
      command: 'curl -i "https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-v2/health"',
      description: 'Testa se o Edge Function está respondendo',
      note: '✅ Se retornar HTTP 200 e {"status":"ok"}, está funcionando!'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-400 dark:border-green-700">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <Rocket className="w-6 h-6 text-green-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">
            🚀 Deploy do Backend - APIs Reais em 8 Passos
          </h3>
          <p className="text-sm text-green-800 dark:text-green-300">
            Execute cada comando abaixo no seu terminal (Terminal no Mac/Linux, PowerShell no Windows)
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 flex items-center justify-between">
              <span className="font-bold text-sm">{step.title}</span>
              <Badge className="bg-white/20 text-white text-xs">
                Passo {index + 1}/8
              </Badge>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {step.description}
              </p>
              
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                  <code>{step.command}</code>
                </pre>
                <Button
                  onClick={() => copyCommand(step.command.split('\n')[0], index)}
                  className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs h-7"
                  size="sm"
                >
                  {copiedStep === index ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-300">
                {step.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Step */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-300 dark:border-purple-700">
        <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Último Passo: Ativar Modo Real no Código
        </h4>
        <p className="text-sm text-purple-800 dark:text-purple-300 mb-3">
          Após o deploy bem-sucedido, edite o arquivo:
        </p>
        <code className="block bg-purple-900 text-purple-200 p-3 rounded text-xs mb-2">
          /components/advanced-lead-search.tsx
        </code>
        <p className="text-sm text-purple-800 dark:text-purple-300 mb-2">
          Encontre a linha ~108 e mude:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-1">❌ ANTES (Modo Demo):</p>
            <code className="block bg-gray-900 text-red-400 p-2 rounded text-xs">
              const FORCE_MOCK_MODE = true;
            </code>
          </div>
          <div>
            <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1">✅ DEPOIS (APIs Reais):</p>
            <code className="block bg-gray-900 text-green-400 p-2 rounded text-xs">
              const FORCE_MOCK_MODE = false;
            </code>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button 
          className="bg-gray-700 hover:bg-gray-600 text-white"
          asChild
        >
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Dashboard
          </a>
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          asChild
        >
          <a href="https://supabase.com/docs/guides/functions/deploy" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Documentação
          </a>
        </Button>
      </div>

      {/* Troubleshooting */}
      <details className="mt-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <summary className="p-3 cursor-pointer font-medium text-sm text-orange-900 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg">
          <AlertCircle className="w-4 h-4 inline mr-2" />
          Problemas Comuns e Soluções
        </summary>
        <div className="p-4 pt-0 space-y-3 text-sm">
          <div>
            <p className="font-bold text-orange-900 dark:text-orange-300">❌ "command not found: supabase"</p>
            <p className="text-orange-800 dark:text-orange-400 text-xs mt-1">
              → Tente: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">npx supabase</code> antes de cada comando
            </p>
          </div>
          
          <div>
            <p className="font-bold text-orange-900 dark:text-orange-300">❌ "Permission denied"</p>
            <p className="text-orange-800 dark:text-orange-400 text-xs mt-1">
              → Use <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">sudo</code> antes do comando (Mac/Linux)
            </p>
          </div>
          
          <div>
            <p className="font-bold text-orange-900 dark:text-orange-300">❌ "Failed to fetch"</p>
            <p className="text-orange-800 dark:text-orange-400 text-xs mt-1">
              → Aguarde 2-3 minutos após deploy. O Edge Function precisa "acordar" na primeira execução
            </p>
          </div>
          
          <div>
            <p className="font-bold text-orange-900 dark:text-orange-300">❌ "Invalid API Key"</p>
            <p className="text-orange-800 dark:text-orange-400 text-xs mt-1">
              → Verifique no Dashboard → Settings → API que PROXYCURL_API_KEY e APOLLO_API_KEY estão configurados
            </p>
          </div>
        </div>
      </details>
    </Card>
  );
}
