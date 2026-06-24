import React, { useState } from 'react';
import { AlertCircle, Terminal, Copy, CheckCircle, ExternalLink, Code, Server } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function BackendDeployHelper() {
  const [copied, setCopied] = useState(false);

  const deployCommands = `# 1. Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# 2. Fazer login no Supabase
supabase login

# 3. Link com seu projeto
supabase link --project-ref evdyqlrssgsktctjruuq

# 4. Deploy do Edge Function
supabase functions deploy make-server-v2 --no-verify-jwt

# 5. Configurar variáveis de ambiente
supabase secrets set PROXYCURL_API_KEY=sua_chave_aqui
supabase secrets set APOLLO_API_KEY=sua_chave_aqui`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deployCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-300 dark:border-orange-700">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <Server className="w-6 h-6 text-orange-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-orange-900 dark:text-orange-300">
              Edge Function Precisa Ser Deployado
            </h3>
          </div>
          
          <p className="text-sm text-orange-800 dark:text-orange-300 mb-4">
            O backend com integração LinkedIn + Apollo está pronto, mas precisa ser deployado no Supabase manualmente.
            <br/><br/>
            <strong>Nota:</strong> Se vir o erro "Error while deploying... 403" no editor, ignore-o. É uma limitação da ferramenta automática. O deploy via CLI abaixo funciona perfeitamente.
          </p>

          <div className="space-y-3">
            {/* Opção 1: Deploy Manual */}
            <details className="bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800">
              <summary className="p-3 cursor-pointer font-medium text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg">
                <Terminal className="w-4 h-4 inline mr-2" />
                Opção 1: Deploy via CLI (Recomendado)
              </summary>
              <div className="p-4 pt-0">
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                    <code>{deployCommands}</code>
                  </pre>
                  <Button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs"
                    size="sm"
                  >
                    {copied ? (
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
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  💡 Substitua SEU_PROJECT_ID pelo ID do seu projeto Supabase
                </p>
              </div>
            </details>

            {/* Opção 2: Deploy via Dashboard */}
            <details className="bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800">
              <summary className="p-3 cursor-pointer font-medium text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg">
                <Code className="w-4 h-4 inline mr-2" />
                Opção 2: Deploy via Supabase Dashboard
              </summary>
              <div className="p-4 pt-0 space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="font-medium">Passo a passo:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Acesse <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard <ExternalLink className="w-3 h-3 inline" /></a></li>
                    <li>Vá em <strong>Edge Functions</strong> no menu lateral</li>
                    <li>Clique em <strong>"Create a new function"</strong></li>
                    <li>Nome: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">make-server-v2</code></li>
                    <li>Cole o conteúdo do arquivo <code>/supabase/functions/server/index.tsx</code></li>
                    <li>Configure as secrets (PROXYCURL_API_KEY, APOLLO_API_KEY)</li>
                    <li>Clique em <strong>Deploy</strong></li>
                  </ol>
                </div>

                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-3"
                  asChild
                >
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Supabase Dashboard
                  </a>
                </Button>
              </div>
            </details>

            {/* Opção 3: Modo Demo */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 text-sm">💡</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Enquanto isso, use o Modo Demo
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    Os dados mockados simulam exatamente como funcionará com as APIs reais,
                    incluindo scores de confiança, resolução de conflitos e qualidade de dados.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status das APIs Necessárias */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-xs font-medium mb-2">APIs Configuradas:</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-600 text-white text-xs">
                ✓ PROXYCURL_API_KEY
              </Badge>
              <Badge className="bg-green-600 text-white text-xs">
                ✓ APOLLO_API_KEY
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
