import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Copy, ExternalLink, Key } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

export function TwilioSetupGuide() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const credentials = [
    {
      name: 'TWILIO_ACCOUNT_SID',
      value: 'AC9a1c341cecfe93e2c49db020aff14c4b',
      description: 'Account SID do Twilio',
      ready: true
    },
    {
      name: 'TWILIO_AUTH_TOKEN',
      value: '⚠️ VOCÊ PRECISA PEGAR NO CONSOLE TWILIO',
      description: 'Auth Token (32 caracteres) - Clique em "Show" no console',
      ready: false,
      howToGet: 'No console Twilio, clique em "Show" ao lado de "Auth Token" e copie os 32 caracteres'
    },
    {
      name: 'TWILIO_PHONE_NUMBER',
      value: '+19523957427',
      description: 'Número de telefone Twilio (com +)',
      ready: true
    },
    {
      name: 'TWILIO_WHATSAPP_NUMBER',
      value: 'whatsapp:+19523957427',
      description: 'Número WhatsApp com prefixo "whatsapp:"',
      ready: true
    }
  ];

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Key className="w-5 h-5" />
          Guia de Configuração Twilio
        </CardTitle>
        <CardDescription>
          Siga estes passos para configurar suas credenciais Twilio no Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Passo 1: Pegar Auth Token */}
        <div className="bg-white border-2 border-amber-300 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold text-amber-900">
              Pegue seu Auth Token no Twilio
            </h3>
          </div>
          
          <div className="space-y-3">
            <a
              href="https://console.twilio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 px-4 py-3 rounded-lg transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-amber-700 group-hover:text-amber-900" />
              <span className="font-semibold text-amber-900">
                Abrir Console Twilio
              </span>
            </a>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900 mb-2 font-semibold">
                📋 No console Twilio:
              </p>
              <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
                <li>Procure por <strong>"Auth Token"</strong></li>
                <li>Clique no botão <strong>"Show"</strong></li>
                <li>Copie os <strong>32 caracteres</strong> que aparecem</li>
                <li>Guarde esse valor - você vai precisar no próximo passo!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Passo 2: Configurar no Supabase */}
        <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold text-blue-900">
              Configure as 4 variáveis no Supabase
            </h3>
          </div>
          
          <div className="space-y-3 mb-4">
            <a
              href="https://supabase.com/dashboard/project/_/settings/functions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 px-4 py-3 rounded-lg transition-colors group"
            >
              <ExternalLink className="w-5 h-5 text-blue-700 group-hover:text-blue-900" />
              <span className="font-semibold text-blue-900">
                Abrir Supabase Edge Functions
              </span>
            </a>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-2 font-semibold">
                🔧 No Supabase:
              </p>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Selecione seu projeto</li>
                <li>Vá em: <strong>Project Settings ⚙️ → Edge Functions → Secrets</strong></li>
                <li>Atualize ou crie as 4 variáveis abaixo</li>
                <li>Salve cada uma (clique no ícone de salvar)</li>
              </ol>
            </div>
          </div>

          {/* Lista de Credenciais */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-blue-900 mb-3">
              📋 Copie e cole estas 4 variáveis:
            </p>
            
            {credentials.map((cred, idx) => (
              <div 
                key={idx}
                className={`border-2 rounded-lg p-4 ${
                  cred.ready 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {cred.ready && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      <span className="font-mono text-sm font-semibold text-slate-900">
                        {cred.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {cred.description}
                    </p>
                    {cred.howToGet && (
                      <p className="text-xs text-amber-700 bg-amber-100 border border-amber-300 rounded px-2 py-1">
                        💡 {cred.howToGet}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 font-mono text-xs overflow-x-auto">
                    {cred.value}
                  </div>
                  {cred.ready && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(cred.value, cred.name)}
                      className="flex-shrink-0"
                    >
                      {copiedItem === cred.name ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passo 3: Testar */}
        <div className="bg-white border-2 border-green-300 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold text-green-900">
              Teste a conexão
            </h3>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900 mb-2">
              ✅ Depois de configurar as 4 variáveis:
            </p>
            <ol className="text-xs text-green-800 space-y-1 list-decimal list-inside">
              <li>Volte nesta página</li>
              <li>Clique em <strong>"Executar Diagnóstico"</strong> no card roxo acima</li>
              <li>Verifique se todas as credenciais estão válidas</li>
              <li>Teste o envio de SMS e WhatsApp!</li>
            </ol>
          </div>
        </div>

        {/* Avisos Importantes */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <p className="text-sm font-semibold text-red-900 mb-2">
            ⚠️ IMPORTANTE:
          </p>
          <ul className="text-xs text-red-800 space-y-1">
            <li>✓ Copie SEM espaços extras antes ou depois</li>
            <li>✓ Não pressione ENTER ao colar</li>
            <li>✓ O Auth Token tem exatamente 32 caracteres</li>
            <li>✓ O Account SID começa com "AC" e tem 34 caracteres</li>
            <li>✓ O WhatsApp number DEVE ter o prefixo "whatsapp:"</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  );
}
