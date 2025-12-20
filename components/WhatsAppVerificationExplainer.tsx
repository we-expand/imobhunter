import { AlertCircle, CheckCircle, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface WhatsAppVerificationExplainerProps {
  phoneNumber: string;
  onGoToSettings: () => void;
}

export function WhatsAppVerificationExplainer({ phoneNumber, onGoToSettings }: WhatsAppVerificationExplainerProps) {
  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-amber-900">
          <AlertCircle className="w-6 h-6" />
          Número Verificado, mas WhatsApp não configurado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* O que aconteceu */}
        <div className="bg-white rounded-lg p-4 border border-amber-200">
          <p className="font-medium text-gray-900 mb-3">O que acabou de acontecer:</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Seu número <strong>{phoneNumber}</strong> foi verificado com sucesso</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <span>Você pode receber SMS neste número</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span><strong>MAS:</strong> Ainda não configurou o WhatsApp Business API</span>
            </div>
          </div>
        </div>

        {/* O que você NÃO pode fazer */}
        <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
          <p className="font-medium text-red-900 mb-2">❌ O que NÃO funciona ainda:</p>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Enviar mensagens automáticas no WhatsApp</li>
            <li>• Usar WhatsApp na Régua de Cobrança</li>
            <li>• Conversar com clientes via WhatsApp</li>
          </ul>
        </div>

        {/* O que você PODE fazer */}
        <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-lg p-4">
          <p className="font-medium text-emerald-900 mb-2">✅ O que funciona agora:</p>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• Enviar emails automáticos</li>
            <li>• Receber SMS (se Twilio estiver configurado)</li>
            <li>• Usar todas as outras funcionalidades</li>
          </ul>
        </div>

        {/* Próximos Passos */}
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
          <p className="font-medium text-blue-900 mb-3">🚀 Para enviar WhatsApp, você precisa:</p>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2 mb-4">
            <li>Ir em <strong>Configurações</strong></li>
            <li>Encontrar a seção <strong>"WhatsApp Business Cloud API"</strong></li>
            <li>Seguir o guia de 15 minutos para configurar</li>
            <li>Obter <strong>Phone Number ID</strong> e <strong>Access Token</strong> da Meta</li>
            <li>Colar as credenciais e salvar</li>
          </ol>
          
          <Button 
            onClick={onGoToSettings}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ir para Configurações
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Info adicional */}
        <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="font-medium mb-1">💡 Por que preciso configurar isso?</p>
          <p>
            A verificação do número é apenas para confirmar que você é o dono. 
            Para ENVIAR mensagens no WhatsApp, você precisa de uma conta oficial 
            do WhatsApp Business API (oferecido pela Meta/Facebook, com 1.000 mensagens/mês grátis).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
