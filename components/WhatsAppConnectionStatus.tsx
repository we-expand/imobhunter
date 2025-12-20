import { AlertCircle, CheckCircle, XCircle, Info, MessageCircle, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

interface ConnectionMethod {
  type: 'whatsapp_business' | 'whatsapp_web' | 'dual_channel' | 'none';
  canSendWhatsApp: boolean;
  canSendSMS: boolean;
  canSendEmail: boolean;
  details: string;
}

export function WhatsAppConnectionStatus() {
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>({
    type: 'none',
    canSendWhatsApp: false,
    canSendSMS: false,
    canSendEmail: false,
    details: 'Verificando...'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnectionMethod();
  }, []);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const checkConnectionMethod = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Verificar status do WhatsApp
      const statusRes = await fetch(`${API_URL}/whatsapp-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Verificar config do WhatsApp Business API
      const configRes = await fetch(`${API_URL}/whatsapp-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Verificar config Twilio (SMS/Dual Channel)
      const twilioRes = await fetch(`${API_URL}/whatsapp-check-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let method: ConnectionMethod = {
        type: 'none',
        canSendWhatsApp: false,
        canSendSMS: false,
        canSendEmail: true, // Email sempre disponível
        details: 'Nenhuma conexão configurada'
      };

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        
        if (statusData.status === 'connected') {
          if (statusData.method === 'whatsapp_web') {
            method = {
              type: 'whatsapp_web',
              canSendWhatsApp: true,
              canSendSMS: false,
              canSendEmail: true,
              details: `WhatsApp Web conectado: ${statusData.phoneNumber}`
            };
          } else if (statusData.method === 'cloud_api') {
            method = {
              type: 'whatsapp_business',
              canSendWhatsApp: true,
              canSendSMS: false,
              canSendEmail: true,
              details: `WhatsApp Business API: ${statusData.phoneNumber}`
            };
          }
        }
      }

      // Se tem config do WhatsApp Business API
      if (configRes.ok) {
        const configData = await configRes.json();
        if (configData.config && configData.config.connected) {
          method = {
            type: 'whatsapp_business',
            canSendWhatsApp: true,
            canSendSMS: false,
            canSendEmail: true,
            details: `WhatsApp Business API: ${configData.config.phoneNumber || 'Conectado'}`
          };
        }
      }

      // Se tem Twilio configurado
      if (twilioRes.ok) {
        const twilioData = await twilioRes.json();
        if (twilioData.whatsappConfigured && twilioData.allConfigured) {
          // Dual Channel: SMS + WhatsApp via Twilio
          method = {
            type: 'dual_channel',
            canSendWhatsApp: true,
            canSendSMS: true,
            canSendEmail: true,
            details: `Dual Channel via Twilio: ${twilioData.twilioWhatsAppNumber}`
          };
        } else if (twilioData.allConfigured) {
          // Só SMS
          method.canSendSMS = true;
          method.details = `SMS via Twilio: ${twilioData.twilioPhoneNumber}`;
        }
      }

      setConnectionMethod(method);
    } catch (error) {
      console.error('Erro ao verificar método de conexão:', error);
      setConnectionMethod({
        type: 'none',
        canSendWhatsApp: false,
        canSendSMS: false,
        canSendEmail: true,
        details: 'Erro ao verificar conexão'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Info className="w-6 h-6 text-gray-500 animate-pulse" />;
    
    if (connectionMethod.canSendWhatsApp) {
      return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    }
    
    if (connectionMethod.canSendSMS) {
      return <AlertCircle className="w-6 h-6 text-amber-500" />;
    }
    
    return <XCircle className="w-6 h-6 text-red-500" />;
  };

  const getStatusColor = () => {
    if (connectionMethod.canSendWhatsApp) return 'border-emerald-200 bg-emerald-50';
    if (connectionMethod.canSendSMS) return 'border-amber-200 bg-amber-50';
    return 'border-red-200 bg-red-50';
  };

  const getStatusText = () => {
    if (isLoading) return 'Verificando...';
    
    if (connectionMethod.type === 'whatsapp_business') {
      return '✅ WhatsApp Business API Ativo';
    }
    
    if (connectionMethod.type === 'whatsapp_web') {
      return '✅ WhatsApp Web Conectado';
    }
    
    if (connectionMethod.type === 'dual_channel') {
      return '⚠️ Dual Channel (SMS + Verificação)';
    }
    
    return '❌ WhatsApp Não Configurado';
  };

  return (
    <Card className={`border-2 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {getStatusIcon()}
          <span>Status da Conexão</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Principal */}
        <div className="text-lg font-medium">
          {getStatusText()}
        </div>

        {/* Detalhes */}
        <div className="text-sm text-gray-600">
          {connectionMethod.details}
        </div>

        {/* Canais Disponíveis */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Canais Disponíveis:</p>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 text-sm ${connectionMethod.canSendWhatsApp ? 'text-emerald-600' : 'text-gray-400'}`}>
              {connectionMethod.canSendWhatsApp ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </div>

            <div className={`flex items-center gap-2 text-sm ${connectionMethod.canSendSMS ? 'text-emerald-600' : 'text-gray-400'}`}>
              {connectionMethod.canSendSMS ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <Phone className="w-4 h-4" />
              <span>SMS</span>
            </div>

            <div className={`flex items-center gap-2 text-sm ${connectionMethod.canSendEmail ? 'text-emerald-600' : 'text-gray-400'}`}>
              {connectionMethod.canSendEmail ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
          </div>
        </div>

        {/* Alerta se não pode enviar WhatsApp */}
        {!connectionMethod.canSendWhatsApp && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">
                  WhatsApp não pode enviar mensagens
                </p>
                <p className="text-amber-700">
                  {connectionMethod.type === 'dual_channel' 
                    ? 'Você verificou seu número, mas não configurou o WhatsApp Business API. Configure abaixo para enviar mensagens.'
                    : 'Configure o WhatsApp Business API para enviar mensagens automáticas.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botão para Recarregar */}
        <button
          onClick={checkConnectionMethod}
          disabled={isLoading}
          className="text-sm text-cyan-600 hover:text-cyan-700 underline"
        >
          Verificar novamente
        </button>
      </CardContent>
    </Card>
  );
}
