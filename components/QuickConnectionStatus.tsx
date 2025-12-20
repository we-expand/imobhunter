import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Settings } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

interface QuickConnectionStatusProps {
  onGoToSettings?: () => void;
}

export function QuickConnectionStatus({ onGoToSettings }: QuickConnectionStatusProps) {
  const [canSendWhatsApp, setCanSendWhatsApp] = useState(false);
  const [canSendSMS, setCanSendSMS] = useState(false);
  const [canSendEmail, setCanSendEmail] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('none');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      // Verificar WhatsApp Business API
      const configRes = await fetch(`${API_URL}/whatsapp-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (configRes.ok) {
        const configData = await configRes.json();
        if (configData.config && configData.config.connected) {
          setCanSendWhatsApp(true);
          setConnectionType('whatsapp_business');
        }
      }

      // Verificar Twilio
      const twilioRes = await fetch(`${API_URL}/whatsapp-check-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (twilioRes.ok) {
        const twilioData = await twilioRes.json();
        if (twilioData.allConfigured) {
          setCanSendSMS(true);
        }
        if (twilioData.whatsappConfigured) {
          setConnectionType('dual_channel');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardContent className="py-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin" />
            <span className="text-gray-600">Verificando conexões...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMainMessage = () => {
    if (canSendWhatsApp && connectionType === 'whatsapp_business') {
      return {
        icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
        title: '✅ WhatsApp Business Ativo',
        description: 'Você pode enviar mensagens automáticas no WhatsApp',
        color: 'border-emerald-200 bg-emerald-50'
      };
    }

    if (connectionType === 'dual_channel') {
      return {
        icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
        title: '⚠️ Verificação Concluída, WhatsApp Inativo',
        description: 'Número verificado, mas WhatsApp Business API não configurado',
        color: 'border-amber-200 bg-amber-50'
      };
    }

    return {
      icon: <XCircle className="w-6 h-6 text-gray-500" />,
      title: 'WhatsApp Não Configurado',
      description: 'Configure para enviar mensagens automáticas',
      color: 'border-gray-200 bg-gray-50'
    };
  };

  const message = getMainMessage();

  return (
    <Card className={`border-2 ${message.color}`}>
      <CardContent className="py-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            {message.icon}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{message.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{message.description}</p>
            </div>
          </div>

          {/* Status dos Canais */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t">
            <div className={`text-center p-2 rounded-lg ${canSendWhatsApp ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              <div className={`text-xs font-medium ${canSendWhatsApp ? 'text-emerald-700' : 'text-gray-500'}`}>
                {canSendWhatsApp ? '✅' : '❌'} WhatsApp
              </div>
            </div>
            <div className={`text-center p-2 rounded-lg ${canSendSMS ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              <div className={`text-xs font-medium ${canSendSMS ? 'text-emerald-700' : 'text-gray-500'}`}>
                {canSendSMS ? '✅' : '❌'} SMS
              </div>
            </div>
            <div className={`text-center p-2 rounded-lg ${canSendEmail ? 'bg-emerald-100' : 'bg-gray-100'}`}>
              <div className={`text-xs font-medium ${canSendEmail ? 'text-emerald-700' : 'text-gray-500'}`}>
                {canSendEmail ? '✅' : '❌'} Email
              </div>
            </div>
          </div>

          {/* Alerta se não pode enviar WhatsApp */}
          {!canSendWhatsApp && connectionType === 'dual_channel' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 mb-2">
                <strong>🔔 Atenção:</strong> Você verificou seu número, mas ainda não configurou 
                o WhatsApp Business API para <strong>enviar mensagens</strong>.
              </p>
              <Button 
                onClick={onGoToSettings}
                size="sm"
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
              >
                <Settings className="w-3 h-3 mr-2" />
                Configurar WhatsApp Business
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </div>
          )}

          {/* Botão se nada está configurado */}
          {!canSendWhatsApp && connectionType === 'none' && (
            <Button 
              onClick={onGoToSettings}
              size="sm"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="w-3 h-3 mr-2" />
              Configurar Agora
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
