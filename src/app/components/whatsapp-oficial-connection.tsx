import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { MessageCircle, CheckCircle, XCircle, Send, Loader2, Settings, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface WhatsAppOficialConnectionProps {
  onMessageSent?: (messageId: string) => void;
}

const BACKEND_URL = 'http://localhost:3002';

export function WhatsAppOficialConnection({ onMessageSent }: WhatsAppOficialConnectionProps = {}) {
  const [status, setStatus] = useState<'checking' | 'configured' | 'not-configured' | 'error'>('checking');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [testMessage, setTestMessage] = useState('Olá! Esta é uma mensagem de teste do AI LeadGen Pro.');

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('configured');
        setPhoneNumberId(data.phone_number_id);
        setBusinessAccountId(data.business_account_id || '');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('not-configured');
    }
  };

  const sendTestMessage = async () => {
    if (!testPhoneNumber) {
      toast.error('Digite um número de telefone');
      return;
    }

    if (!testMessage) {
      toast.error('Digite uma mensagem');
      return;
    }

    setIsSending(true);
    toast.info('📤 Enviando mensagem...');

    try {
      const response = await fetch(`${BACKEND_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testPhoneNumber,
          message: testMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Mensagem enviada!', {
          description: `ID: ${data.message_id}`,
          duration: 5000
        });

        if (onMessageSent) {
          onMessageSent(data.message_id);
        }

        // Limpar campos
        setTestPhoneNumber('');
        setTestMessage('Olá! Esta é uma mensagem de teste do AI LeadGen Pro.');
      } else {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }
    } catch (error: any) {
      console.error('Erro ao enviar:', error);
      toast.error('❌ Erro ao enviar mensagem', {
        description: error.message,
        duration: 8000
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-2 border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div>WhatsApp Business API Oficial</div>
            <div className="text-xs font-normal text-gray-600">Meta Platform</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Status:</span>
          <Badge 
            variant={status === 'configured' ? 'default' : 'secondary'}
            className={`gap-2 ${
              status === 'configured' ? 'bg-green-600 hover:bg-green-700' :
              status === 'checking' ? 'bg-blue-600 hover:bg-blue-700' :
              status === 'error' ? 'bg-red-600 hover:bg-red-700' :
              'bg-yellow-600 hover:bg-yellow-700'
            }`}
          >
            {status === 'configured' && <CheckCircle className="w-3 h-3" />}
            {status === 'checking' && <Loader2 className="w-3 h-3 animate-spin" />}
            {status === 'error' && <XCircle className="w-3 h-3" />}
            {status === 'configured' ? 'Configurado' :
             status === 'checking' ? 'Verificando...' :
             status === 'error' ? 'Erro' :
             'Não Configurado'}
          </Badge>
        </div>

        {/* CONFIGURED STATE */}
        {status === 'configured' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-900 text-lg">✅ API Configurada</p>
                  <p className="text-sm text-green-700 mt-2">
                    <strong>Phone Number ID:</strong> {phoneNumberId}
                  </p>
                  {businessAccountId && (
                    <p className="text-sm text-green-700">
                      <strong>Business Account:</strong> {businessAccountId}
                    </p>
                  )}
                  <p className="text-xs text-green-600 mt-3 leading-relaxed">
                    Sua integração oficial com WhatsApp está ativa. Você pode enviar mensagens através da API do Meta.
                  </p>
                </div>
              </div>
            </div>

            {/* Test Message Form */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Enviar Mensagem de Teste</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Número de Telefone (com código do país)
                  </label>
                  <Input
                    type="tel"
                    placeholder="+351912345678"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: +[código país][número] (ex: +351912345678)
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Mensagem
                  </label>
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {testMessage.length} caracteres
                  </p>
                </div>

                <Button
                  onClick={sendTestMessage}
                  disabled={isSending || !testPhoneNumber || !testMessage}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Settings className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-900">
                <p className="font-semibold mb-2">💡 Importante:</p>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Para primeira mensagem, use apenas templates aprovados</li>
                  <li>Após resposta do usuário, pode enviar mensagens livres por 24h</li>
                  <li>Configure templates na Meta Business Suite</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* NOT CONFIGURED STATE */}
        {status === 'not-configured' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Alert className="border-yellow-200 bg-yellow-50">
              <Settings className="w-4 h-4 text-yellow-600" />
              <AlertDescription>
                <p className="font-bold text-yellow-900 mb-3">⚠️ Backend não está rodando</p>
                
                <div className="bg-white p-4 rounded-lg border border-yellow-200 mb-4">
                  <p className="font-semibold text-sm mb-3 text-gray-900">
                    🔧 Para iniciar o backend oficial:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">1️⃣ Navegue até a pasta</p>
                      <code className="block bg-gray-800 text-green-400 px-3 py-2 rounded text-xs mt-2">
                        cd backend-whatsapp-oficial
                      </code>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">2️⃣ Configure credenciais</p>
                      <code className="block bg-gray-800 text-green-400 px-3 py-2 rounded text-xs mt-2">
                        cp .env.example .env
                      </code>
                      <p className="text-xs text-gray-600 mt-2">
                        Depois edite o arquivo .env com suas credenciais da Meta
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">3️⃣ Instale dependências</p>
                      <code className="block bg-gray-800 text-green-400 px-3 py-2 rounded text-xs mt-2">
                        npm install
                      </code>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded border-2 border-green-300">
                      <p className="text-xs font-semibold text-green-900 mb-1">4️⃣ Inicie o servidor</p>
                      <code className="block bg-gray-800 text-green-400 px-3 py-2 rounded text-xs mt-2">
                        npm start
                      </code>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                  <p className="font-semibold text-blue-900 mb-2">📚 Documentação:</p>
                  <p className="text-blue-800">
                    Veja <code className="bg-blue-100 px-1 rounded">CONFIGURACAO_WHATSAPP_OFICIAL.md</code> para instruções completas
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={checkBackendStatus}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Verificar Novamente
            </Button>

            <Button
              onClick={() => window.open('https://developers.facebook.com/', '_blank')}
              variant="outline"
              className="w-full gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Meta for Developers
            </Button>
          </div>
        )}

        {/* CHECKING STATE */}
        {status === 'checking' && (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-300">
            <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-700">Verificando configuração...</p>
            <p className="text-xs text-gray-500 mt-2">Conectando ao backend</p>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="w-4 h-4 text-red-600" />
              <AlertDescription>
                <p className="font-bold text-red-900 mb-2">❌ Erro na configuração</p>
                <p className="text-sm text-red-800">
                  O backend está rodando mas as credenciais da Meta podem estar incorretas.
                </p>
                <p className="text-xs text-red-700 mt-2">
                  Verifique o arquivo .env e as credenciais do Meta for Developers
                </p>
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={checkBackendStatus}
              className="w-full bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        )}

        <div className="text-center text-xs text-gray-500 pt-2 border-t">
          <p>WhatsApp Business API Oficial - Meta Platform</p>
        </div>
      </CardContent>
    </Card>
  );
}
