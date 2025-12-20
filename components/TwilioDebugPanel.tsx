import { useState, useEffect } from 'react';
import { Settings, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

export function TwilioDebugPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const res = await fetch(`${API_URL}/whatsapp-check-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const StatusIcon = ({ hasValue }: { hasValue: boolean }) => {
    if (hasValue) {
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    }
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <Card className="shadow-lg border-2 border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Settings className="w-5 h-5" />
              Diagnóstico Twilio
            </CardTitle>
            <CardDescription>
              Verifique o status das credenciais
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadConfig}
            disabled={isLoading}
            className="border-blue-200"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!config ? (
          <div className="text-center py-8 text-slate-500">
            Carregando configuração...
          </div>
        ) : (
          <div className="space-y-4">
            {/* SMS Credentials */}
            <div className="border-2 border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                📱 Credenciais SMS
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">TWILIO_ACCOUNT_SID</span>
                  <StatusIcon hasValue={config.hasTwilioAccountSid} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">TWILIO_AUTH_TOKEN</span>
                  <StatusIcon hasValue={config.hasTwilioAuthToken} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">TWILIO_PHONE_NUMBER</span>
                  <StatusIcon hasValue={config.hasTwilioPhoneNumber} />
                </div>
                {config.twilioPhoneNumber && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Número configurado:</p>
                    <p className="font-mono text-emerald-700 font-semibold">
                      {config.twilioPhoneNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Credentials */}
            <div className="border-2 border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                💬 Credenciais WhatsApp
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">TWILIO_WHATSAPP_NUMBER</span>
                  <StatusIcon hasValue={config.hasTwilioWhatsAppNumber} />
                </div>
                {config.twilioWhatsAppNumber && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Número WhatsApp configurado:</p>
                    <p className="font-mono text-emerald-700 font-semibold">
                      {config.twilioWhatsAppNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Geral */}
            <div className={`rounded-lg p-4 ${
              config.hasTwilioAccountSid && config.hasTwilioAuthToken && config.hasTwilioPhoneNumber
                ? 'bg-emerald-50 border-2 border-emerald-200'
                : 'bg-amber-50 border-2 border-amber-200'
            }`}>
              <div className="flex items-start gap-3">
                {config.hasTwilioAccountSid && config.hasTwilioAuthToken && config.hasTwilioPhoneNumber ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900 mb-1">
                        ✅ SMS Configurado
                      </p>
                      <p className="text-sm text-emerald-800">
                        As credenciais SMS estão todas configuradas. O sistema pode enviar SMS.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 mb-1">
                        ⚠️ SMS Não Configurado
                      </p>
                      <p className="text-sm text-amber-800 mb-2">
                        Faltam credenciais. Configure em <strong>Configurações → Comunicação → SMS</strong>
                      </p>
                      <p className="text-xs text-amber-700">
                        Necessário: Account SID, Auth Token e Phone Number
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {config.hasTwilioWhatsAppNumber ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900 mb-1">
                      ✅ WhatsApp Configurado
                    </p>
                    <p className="text-sm text-emerald-800">
                      O número WhatsApp está configurado. O sistema pode enviar via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      ℹ️ WhatsApp Opcional
                    </p>
                    <p className="text-sm text-blue-800">
                      WhatsApp não está configurado, mas o SMS funcionará normalmente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modo Desenvolvimento */}
            {!config.hasTwilioAccountSid && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-900 mb-1">
                      🧪 Modo Desenvolvimento Ativo
                    </p>
                    <p className="text-sm text-purple-800">
                      Sem credenciais configuradas, o código será mostrado no toast (não será enviado SMS real).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
