import { useState } from 'react';
import { Smartphone, CheckCircle, AlertCircle, ExternalLink, Info, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { API_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

export function WhatsAppBusinessAPI() {
  const [step, setStep] = useState(1);
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  const handleCopyWebhook = () => {
    const webhookUrl = `${window.location.origin}/api/whatsapp-webhook`;
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL do Webhook copiado!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Explicação Honesta */}
      <Card className="border-2 border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Porque o QR Code NÃO funciona?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-red-900">
            <p className="font-semibold">
              🚫 O QR Code mostrado anteriormente era apenas uma imagem de demonstração.
            </p>
            <p className="text-sm">
              <strong>O WhatsApp só aceita QR Codes gerados por:</strong>
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Conexão WebSocket real com servidores do WhatsApp (requer servidor 24/7)</li>
              <li>Biblioteca Baileys em servidor Node.js persistente (não funciona em serverless)</li>
            </ul>
            <div className="bg-white border-2 border-red-300 rounded p-3 mt-3">
              <p className="font-semibold text-red-900 mb-2">✅ SOLUÇÃO OFICIAL:</p>
              <p className="text-sm">
                Use a <strong>API do WhatsApp Business</strong> da Meta - o método profissional e oficial. 
                Não usa QR Code, mas sim número de telefone verificado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guia Passo a Passo */}
      <Card className="border-2 border-emerald-300">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50">
          <CardTitle className="text-emerald-700">
            📱 Configurar WhatsApp Business API (Método Real)
          </CardTitle>
          <CardDescription>
            Siga estes passos para conectar o WhatsApp de verdade
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          
          {/* Passo 1 */}
          <div className={`border-l-4 ${step >= 1 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50'} p-4 rounded`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'}`}>
                1
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Criar App no Meta for Developers</h3>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Aceda a <a href="https://developers.facebook.com/apps/create/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">developers.facebook.com/apps/create</a></li>
                  <li>Clique em <strong>"Criar App"</strong></li>
                  <li>Selecione tipo: <strong>"Business"</strong></li>
                  <li>Preencha o nome do app (ex: "Cobra Plus API")</li>
                  <li>Clique em <strong>"Criar App"</strong></li>
                </ol>
                <Button
                  onClick={() => {
                    window.open('https://developers.facebook.com/apps/create/', '_blank');
                    setStep(2);
                  }}
                  className="mt-3 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Meta for Developers
                </Button>
              </div>
            </div>
          </div>

          {/* Passo 2 */}
          <div className={`border-l-4 ${step >= 2 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50'} p-4 rounded`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'}`}>
                2
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Adicionar WhatsApp ao App</h3>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>No painel do seu app, procure por <strong>"WhatsApp"</strong></li>
                  <li>Clique em <strong>"Configurar"</strong> no produto WhatsApp</li>
                  <li>Selecione ou crie uma <strong>Conta de Negócio</strong></li>
                  <li>Aceite os termos e condições</li>
                </ol>
                {step >= 2 && (
                  <Button
                    onClick={() => setStep(3)}
                    variant="outline"
                    className="mt-3 border-emerald-600 text-emerald-700"
                    size="sm"
                  >
                    Concluí este passo →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Passo 3 */}
          <div className={`border-l-4 ${step >= 3 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50'} p-4 rounded`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'}`}>
                3
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Obter Credenciais</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>Vai encontrar duas informações importantes:</p>
                  
                  <div className="bg-white border border-emerald-300 rounded p-3">
                    <p className="font-semibold mb-2">📞 Phone Number ID:</p>
                    <p className="text-xs mb-2">Encontra em: WhatsApp &gt; API Setup &gt; Phone number ID</p>
                    <input
                      type="text"
                      placeholder="Cole aqui o Phone Number ID (ex: 123456789012345)"
                      value={phoneNumberId}
                      onChange={(e) => setPhoneNumberId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="bg-white border border-emerald-300 rounded p-3">
                    <p className="font-semibold mb-2">🔑 Access Token:</p>
                    <p className="text-xs mb-2">Encontra em: WhatsApp &gt; API Setup &gt; Temporary access token (depois crie um permanente)</p>
                    <input
                      type="password"
                      placeholder="Cole aqui o Access Token"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-300 rounded p-3">
                    <p className="font-semibold text-amber-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Importante:
                    </p>
                    <p className="text-xs text-amber-800 mt-1">
                      O "Temporary access token" expira em 24h. Para produção, você deve gerar um 
                      <strong> System User Token</strong> permanente em: Business Settings &gt; System Users.
                    </p>
                  </div>
                </div>
                {step >= 3 && accessToken && phoneNumberId && (
                  <Button
                    onClick={() => setStep(4)}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700"
                    size="sm"
                  >
                    Continuar →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Passo 4 */}
          <div className={`border-l-4 ${step >= 4 ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50'} p-4 rounded`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'}`}>
                4
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Configurar no Supabase</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">Adicione as credenciais como variáveis de ambiente no Supabase:</p>
                  
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs space-y-1">
                    <div>WHATSAPP_ACCESS_TOKEN={accessToken || 'seu_token_aqui'}</div>
                    <div>WHATSAPP_PHONE_NUMBER_ID={phoneNumberId || 'seu_phone_id_aqui'}</div>
                  </div>

                  <ol className="list-decimal list-inside text-gray-700 space-y-1">
                    <li>Vá ao projeto Supabase</li>
                    <li>Aceda a <strong>Project Settings</strong> &gt; <strong>Edge Functions</strong></li>
                    <li>Adicione as variáveis acima</li>
                    <li>Faça redeploy das Edge Functions</li>
                  </ol>

                  {step >= 4 && (
                    <Button
                      onClick={() => {
                        setIsConfigured(true);
                        toast.success('✅ Configuração completa! Agora pode enviar mensagens.');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Concluí a Configuração
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Passo 5 - Teste */}
          {isConfigured && (
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600 text-white">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Testar Envio</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Envie uma mensagem de teste para o seu número de WhatsApp:
                  </p>
                  
                  <div className="space-y-3">
                    <input
                      type="tel"
                      placeholder="Número com código do país (ex: +351912345678)"
                      value={testPhoneNumber}
                      onChange={(e) => setTestPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <Button
                      onClick={async () => {
                        if (!testPhoneNumber) {
                          toast.error('Digite um número de telefone');
                          return;
                        }
                        
                        try {
                          toast.info('🚀 Enviando mensagem de teste...');
                          
                          const { data: { session } } = await supabase.auth.getSession();
                          const token = session?.access_token;

                          if (!token) {
                            toast.error('Faça login primeiro');
                            return;
                          }

                          const response = await fetch(`${API_URL}/whatsapp-test`, {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                              phoneNumber: testPhoneNumber
                            })
                          });

                          const data = await response.json();

                          if (response.ok) {
                            toast.success('✅ Mensagem enviada! Verifique o WhatsApp.');
                            console.log('Mensagem enviada:', data);
                          } else {
                            toast.error(`Erro: ${data.error || 'Falha ao enviar'}`);
                            console.error('Erro:', data);
                          }
                        } catch (error: any) {
                          toast.error(`Erro: ${error.message}`);
                          console.error('Erro ao enviar:', error);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Enviar Mensagem de Teste
                    </Button>
                  </div>

                  <div className="mt-4 bg-emerald-100 border border-emerald-300 rounded p-3">
                    <p className="text-sm text-emerald-900">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      <strong>Pronto!</strong> Agora o sistema pode enviar mensagens reais pelo WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Adicional */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">💰 Custos da API do WhatsApp Business:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>1.000 conversas grátis</strong> por mês</li>
                <li>Após isso: €0,005 a €0,09 por conversa (varia por país)</li>
                <li>Mensagens dentro de 24h da resposta do cliente: <strong>grátis</strong></li>
                <li>Ideal para cobranças: custo muito baixo</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}