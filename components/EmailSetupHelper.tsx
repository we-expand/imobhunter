import { Mail, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export function EmailSetupHelper() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Configurar Email no Cobra+</h1>
        <p className="text-muted-foreground">
          Guia completo para conectar Gmail ou Outlook
        </p>
      </div>

      {/* Gmail */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            📧
          </div>
          <div>
            <h2 className="text-xl font-semibold">Gmail / Google Workspace</h2>
            <p className="text-sm text-muted-foreground">Configuração via SMTP</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                Ative a Verificação em 2 Passos
              </p>
              <a 
                href="https://myaccount.google.com/security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                myaccount.google.com/security
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                Gere uma Senha de Aplicativo
              </p>
              <p className="text-blue-700">
                Procure "Senhas de aplicativo" → Crie nova senha → Digite "Cobra+"
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                Copie a senha de 16 caracteres
              </p>
              <p className="text-blue-700">
                Cole em Configurações → Email → Senha de Aplicativo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outlook */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            📨
          </div>
          <div>
            <h2 className="text-xl font-semibold">Outlook / Office 365</h2>
            <p className="text-sm text-muted-foreground">Configuração via SMTP</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                Aceda às Opções de Segurança
              </p>
              <a 
                href="https://account.microsoft.com/security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                account.microsoft.com/security
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                Crie uma Senha de Aplicativo
              </p>
              <p className="text-blue-700">
                Opções avançadas → Senhas de aplicativo → Nova senha
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                Use a senha no Cobra+
              </p>
              <p className="text-blue-700">
                Cole em Configurações → Email → Senha de Aplicativo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900 mb-1">⚠️ Não use senha normal</p>
              <p className="text-amber-800">
                NUNCA cole a sua senha de email normal. Use apenas a senha de aplicativo gerada.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-green-900 mb-1">✅ Seguro e Revogável</p>
              <p className="text-green-800">
                As senhas de aplicativo são seguras e podem ser removidas a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">💡 Dica</p>
            <p className="text-blue-800">
              Após configurar o email, faça um teste de envio para garantir que tudo está a funcionar corretamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
