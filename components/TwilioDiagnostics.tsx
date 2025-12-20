import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle2, Loader2, Wrench } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';

export function TwilioDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    toast.loading('Analisando credenciais Twilio...', { id: 'diag' });

    try {
      const res = await fetch(`${SERVER_URL}/twilio-diagnostics`);
      const data = await res.json();
      
      setDiagnostics(data);
      
      if (data.twilioAuthTest?.ok) {
        toast.success('✅ Credenciais Twilio válidas!', { id: 'diag' });
      } else {
        toast.error('❌ Problema nas credenciais Twilio', { id: 'diag' });
      }
    } catch (error: any) {
      toast.error('Erro ao diagnosticar: ' + error.message, { id: 'diag' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Wrench className="w-5 h-5" />
          Diagnóstico Twilio
        </CardTitle>
        <CardDescription>
          Verifique se suas credenciais Twilio estão configuradas corretamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <Button 
          onClick={runDiagnostics}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Wrench className="w-4 h-4 mr-2" />
              Executar Diagnóstico
            </>
          )}
        </Button>

        {diagnostics && (
          <div className="space-y-4">
            
            {/* Recomendação Principal */}
            <div className={`p-4 rounded-lg border-2 ${
              diagnostics.twilioAuthTest?.ok 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                {diagnostics.twilioAuthTest?.ok ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-sm mb-1">
                    {diagnostics.recommendation}
                  </p>
                  {!diagnostics.twilioAuthTest?.ok && diagnostics.twilioAuthTest?.body && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-red-700 hover:text-red-900">
                        Ver resposta do Twilio
                      </summary>
                      <pre className="text-xs mt-2 p-2 bg-red-100 rounded overflow-x-auto">
                        {diagnostics.twilioAuthTest.body}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>

            {/* Detalhes das Credenciais */}
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-slate-900">Detalhes das Credenciais</h4>
              
              {/* Account SID */}
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">TWILIO_ACCOUNT_SID:</span>
                  {diagnostics.diagnostics.accountSid.valid ? (
                    <span className="text-green-600 font-semibold">✅ VÁLIDO</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ INVÁLIDO</span>
                  )}
                </div>
                <div className="pl-4 text-slate-600 space-y-0.5">
                  <div>Existe: {diagnostics.diagnostics.accountSid.exists ? '✅' : '❌'}</div>
                  <div>Comprimento: {diagnostics.diagnostics.accountSid.length} caracteres {diagnostics.diagnostics.accountSid.length === 34 ? '✅' : '❌ (deve ser 34)'}</div>
                  <div>Começa com "AC": {diagnostics.diagnostics.accountSid.startsWithAC ? '✅' : '❌'}</div>
                  <div>Tem espaços: {diagnostics.diagnostics.accountSid.hasSpaces ? '❌ SIM (REMOVA!)' : '✅ Não'}</div>
                  <div>Tem quebras de linha: {diagnostics.diagnostics.accountSid.hasNewlines ? '❌ SIM (REMOVA!)' : '✅ Não'}</div>
                  <div className="font-mono bg-slate-100 p-1 rounded">
                    Preview: {diagnostics.diagnostics.accountSid.preview}
                  </div>
                </div>
              </div>

              {/* Auth Token */}
              <div className="text-xs space-y-1 border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">TWILIO_AUTH_TOKEN:</span>
                  {diagnostics.diagnostics.authToken.valid ? (
                    <span className="text-green-600 font-semibold">✅ VÁLIDO</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ INVÁLIDO</span>
                  )}
                </div>
                <div className="pl-4 text-slate-600 space-y-0.5">
                  <div>Existe: {diagnostics.diagnostics.authToken.exists ? '✅' : '❌'}</div>
                  <div>Comprimento: {diagnostics.diagnostics.authToken.length} caracteres {diagnostics.diagnostics.authToken.length === 32 ? '✅' : '❌ (deve ser 32)'}</div>
                  <div>Tem espaços: {diagnostics.diagnostics.authToken.hasSpaces ? '❌ SIM (REMOVA!)' : '✅ Não'}</div>
                  <div>Tem quebras de linha: {diagnostics.diagnostics.authToken.hasNewlines ? '❌ SIM (REMOVA!)' : '✅ Não'}</div>
                  <div className="font-mono bg-slate-100 p-1 rounded">
                    Preview: {diagnostics.diagnostics.authToken.preview}
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="text-xs space-y-1 border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">TWILIO_PHONE_NUMBER:</span>
                  {diagnostics.diagnostics.phoneNumber.exists ? (
                    <span className="text-green-600 font-semibold">✅ CONFIGURADO</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ AUSENTE</span>
                  )}
                </div>
                <div className="pl-4 text-slate-600 space-y-0.5">
                  <div>Valor: {diagnostics.diagnostics.phoneNumber.value}</div>
                  <div>Começa com "+": {diagnostics.diagnostics.phoneNumber.startsWithPlus ? '✅' : '❌'}</div>
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="text-xs space-y-1 border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">TWILIO_WHATSAPP_NUMBER:</span>
                  {diagnostics.diagnostics.whatsappNumber.exists ? (
                    <span className="text-green-600 font-semibold">✅ CONFIGURADO</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ AUSENTE</span>
                  )}
                </div>
                <div className="pl-4 text-slate-600 space-y-0.5">
                  <div>Valor: {diagnostics.diagnostics.whatsappNumber.value}</div>
                  <div>Tem prefixo "whatsapp:": {diagnostics.diagnostics.whatsappNumber.hasWhatsappPrefix ? '✅' : '❌'}</div>
                </div>
              </div>
            </div>

            {/* Instruções para Corrigir */}
            {!diagnostics.twilioAuthTest?.ok && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">
                  📋 Como Corrigir:
                </h4>
                <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
                  <li>
                    Acesse: <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.twilio.com</a>
                  </li>
                  <li>
                    Copie o <strong>Account SID</strong> (começa com AC, 34 caracteres)
                  </li>
                  <li>
                    Clique em "Show" e copie o <strong>Auth Token</strong> (32 caracteres)
                  </li>
                  <li>
                    <strong>IMPORTANTE:</strong> Copie SEM espaços extras antes ou depois!
                  </li>
                  <li>
                    Configure as variáveis de ambiente no Supabase
                  </li>
                  <li>
                    Execute o diagnóstico novamente
                  </li>
                </ol>
              </div>
            )}

          </div>
        )}

      </CardContent>
    </Card>
  );
}
