import React, { useState } from 'react';
import { Terminal, ExternalLink, Rocket, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export function DeployHelper() {
  const [step, setStep] = useState(1);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    alert('✅ Comando copiado! Cole no terminal.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Deploy ImobHunter 🚀
          </h1>
          <p className="text-2xl text-gray-300">
            Servidor com 20+ arquivos interligados
          </p>
        </div>

        {/* AVISO IMPORTANTE */}
        <div className="mb-8 bg-yellow-900/30 border-2 border-yellow-500 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-yellow-300 mb-3">
                ⚠️ ATENÇÃO: Não é um arquivo único!
              </h3>
              <p className="text-yellow-100 text-lg mb-3">
                O servidor ImobHunter tem <strong>mais de 20 arquivos</strong> que se importam entre si:
              </p>
              <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-yellow-100 space-y-1">
                <div>📄 index.tsx (principal)</div>
                <div>📄 search-routes.tsx</div>
                <div>📄 linkedin-routes.ts</div>
                <div>📄 apollo-api.ts</div>
                <div>📄 api-proxy-routes.ts</div>
                <div>📄 ai-data-merger.ts</div>
                <div>📄 ... e mais 15 arquivos</div>
              </div>
              <p className="text-yellow-100 mt-4 font-bold">
                ❌ Copiar só o index.tsx NÃO VAI FUNCIONAR!
              </p>
              <p className="text-yellow-100 mt-2">
                ✅ Você precisa fazer o deploy de TODA a pasta usando o método abaixo
              </p>
            </div>
          </div>
        </div>

        {/* MÉTODO ÚNICO: CLI */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Terminal className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold mb-2">
                ÚNICO MÉTODO OFICIAL
              </div>
              <h2 className="text-3xl font-bold">
                Deploy via Supabase CLI
              </h2>
              <p className="text-green-100">
                Faz upload automático de TODOS os 20+ arquivos
              </p>
            </div>
          </div>

          {/* Passos */}
          <div className="space-y-4 mb-6">
            {/* Passo 1 */}
            <div className="bg-white/10 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3">Instalar o Supabase CLI</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-green-100 mb-2">🍎 <strong>Mac/Linux:</strong></p>
                      <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-100 mb-2">
                        brew install supabase/tap/supabase
                      </div>
                      <button
                        onClick={() => copyCommand('brew install supabase/tap/supabase')}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded font-semibold"
                      >
                        📋 Copiar
                      </button>
                    </div>

                    <div>
                      <p className="text-sm text-green-100 mb-2">🪟 <strong>Windows (PowerShell como Admin):</strong></p>
                      <div className="bg-black/40 rounded p-3 font-mono text-xs text-green-100 mb-2 overflow-x-auto">
                        scoop bucket add supabase https://github.com/supabase/scoop-bucket.git<br/>
                        scoop install supabase
                      </div>
                      <button
                        onClick={() => copyCommand('scoop bucket add supabase https://github.com/supabase/scoop-bucket.git\nscoop install supabase')}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded font-semibold"
                      >
                        📋 Copiar
                      </button>
                    </div>

                    <div>
                      <p className="text-sm text-green-100 mb-2">🌍 <strong>Qualquer SO (com NPM):</strong></p>
                      <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-100 mb-2">
                        npm install -g supabase
                      </div>
                      <button
                        onClick={() => copyCommand('npm install -g supabase')}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded font-semibold"
                      >
                        📋 Copiar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="bg-white/10 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3">Baixar o Projeto do Figma Make</h3>
                  <p className="text-green-100 mb-3">
                    No Figma Make, procure por <strong>"Export"</strong>, <strong>"Download"</strong> ou <strong>"Download Project"</strong>
                  </p>
                  <p className="text-sm text-green-200">
                    💾 Salve em uma pasta fácil de encontrar (ex: Downloads)
                  </p>
                </div>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="bg-white/10 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3">Abrir Terminal na Pasta do Projeto</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-green-100 mb-2">🍎 <strong>Mac/Linux:</strong></p>
                      <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-100 mb-2">
                        cd ~/Downloads/imobhunter/
                      </div>
                      <p className="text-xs text-green-200">
                        (Ajuste o caminho para onde você baixou)
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-green-100 mb-2">🪟 <strong>Windows:</strong></p>
                      <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-100 mb-2">
                        cd C:\Users\SeuNome\Downloads\imobhunter\
                      </div>
                      <p className="text-xs text-green-200">
                        Ou clique com botão direito na pasta → "Abrir no Terminal"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="bg-white/10 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3">Fazer Login no Supabase</h3>
                  <div className="bg-black/40 rounded p-3 font-mono text-sm text-green-100 mb-2">
                    supabase login
                  </div>
                  <button
                    onClick={() => copyCommand('supabase login')}
                    className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded font-semibold mb-3"
                  >
                    📋 Copiar
                  </button>
                  <p className="text-sm text-green-200">
                    ✅ Isso vai abrir o navegador para você fazer login
                  </p>
                </div>
              </div>
            </div>

            {/* Passo 5 - DEPLOY */}
            <div className="bg-green-800/50 rounded-xl p-5 border-2 border-green-400">
              <div className="flex items-start gap-4">
                <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                    🚀 FAZER O DEPLOY
                  </h3>
                  <div className="bg-black/60 rounded-lg p-4 font-mono text-sm text-green-100 mb-3 overflow-x-auto">
                    supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt
                  </div>
                  <button
                    onClick={() => copyCommand('supabase functions deploy server --project-ref evdyqlrssgsktctjruuq --no-verify-jwt')}
                    className="bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-bold text-sm"
                  >
                    📋 COPIAR COMANDO DE DEPLOY
                  </button>
                  <div className="mt-4 bg-white/10 rounded p-3">
                    <p className="text-xs text-green-100">
                      ⏱️ <strong>Aguarde 30-60 segundos...</strong><br/>
                      Quando ver "Deployed successfully" = PRONTO! ✅
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Depois do Deploy */}
        <div className="bg-gray-800 rounded-2xl p-8 border-2 border-green-500 mb-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-10 h-10 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4">
                ✅ Depois do Deploy Bem-Sucedido
              </h3>
              <div className="space-y-3 text-gray-300 text-lg">
                <p>1. ⏱️ Aguarde <strong className="text-white">30-60 segundos</strong> para o servidor inicializar</p>
                <p>2. 🔄 Recarregue esta aplicação (<code className="bg-gray-700 px-2 py-1 rounded text-purple-300">Ctrl+Shift+R</code>)</p>
                <p>3. 🔍 Faça uma busca no sistema ImobHunter</p>
                <p>4. 🎉 <strong className="text-green-400 text-xl">DADOS REAIS das APIs Apollo.io e Proxycurl!</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Teste */}
        <div className="bg-blue-900/30 border border-blue-500 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="text-lg font-bold text-blue-300 mb-3">
                🧪 Testar se o Deploy Funcionou
              </h4>
              <p className="text-blue-200 text-sm mb-3">
                Após o deploy, teste se o servidor está respondendo:
              </p>
              <div className="bg-black/30 rounded p-3 font-mono text-xs text-blue-100 mb-2 overflow-x-auto">
                curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/ping
              </div>
              <button
                onClick={() => copyCommand('curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/server/ping')}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
              >
                📋 Copiar Teste
              </button>
              <p className="text-sm text-blue-300 mt-3">
                ✅ Resposta esperada: <code className="bg-black/30 px-2 py-1 rounded">{'{"status":"ok"}'}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Problemas Comuns */}
        <div className="bg-red-900/30 border border-red-500 rounded-2xl p-6 mb-6">
          <h4 className="text-xl font-bold text-red-300 mb-4">
            🆘 Problemas Comuns & Soluções
          </h4>
          <div className="space-y-4 text-red-200">
            <div>
              <p className="font-bold text-red-100">❌ "Command not found: supabase"</p>
              <p className="text-sm">→ Reinstale o CLI ou feche e abra o terminal novamente</p>
            </div>
            <div>
              <p className="font-bold text-red-100">❌ "Project not found"</p>
              <p className="text-sm">→ Certifique-se de ter feito login: <code className="bg-black/30 px-2 py-1 rounded">supabase login</code></p>
            </div>
            <div>
              <p className="font-bold text-red-100">❌ "Permission denied" (Windows)</p>
              <p className="text-sm">→ Execute o PowerShell como Administrador (botão direito → "Executar como administrador")</p>
            </div>
            <div>
              <p className="font-bold text-red-100">❌ "brew not found" (Mac)</p>
              <p className="text-sm">→ Use a opção NPM: <code className="bg-black/30 px-2 py-1 rounded">npm install -g supabase</code></p>
            </div>
          </div>
        </div>

        {/* Info Técnica */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h4 className="text-lg font-bold text-white mb-3">
            📋 Informações Técnicas
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Projeto ID:</p>
              <code className="text-purple-300 font-mono">evdyqlrssgsktctjruuq</code>
            </div>
            <div>
              <p className="text-gray-400">Função:</p>
              <code className="text-purple-300 font-mono">server</code>
            </div>
            <div>
              <p className="text-gray-400">Pasta:</p>
              <code className="text-purple-300 font-mono text-xs">/supabase/functions/server/</code>
            </div>
            <div>
              <p className="text-gray-400">Total de Arquivos:</p>
              <code className="text-purple-300 font-mono">20+ arquivos TypeScript</code>
            </div>
          </div>
        </div>

        {/* Voltar */}
        <div className="text-center">
          <button
            onClick={() => {
              window.location.hash = '';
              window.location.reload();
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg"
          >
            ← Voltar para o App
          </button>
        </div>
      </div>
    </div>
  );
}