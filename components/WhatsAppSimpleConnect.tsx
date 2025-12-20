import { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, Loader2, AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

interface WhatsAppSimpleConnectProps {
  onConnectionChange?: (connected: boolean, number?: string) => void;
}

export function WhatsAppSimpleConnect({ onConnectionChange }: WhatsAppSimpleConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showSetup, setShowSetup] = useState(false);
  const [setupMode, setSetupMode] = useState<'simple' | 'api'>('simple'); // NOVO: modo de setup
  
  // Credenciais WhatsApp Business API
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  
  // Conexão simples - apenas número
  const [simplePhone, setSimplePhone] = useState('');

  // LOG DE MONTAGEM DO COMPONENTE
  useEffect(() => {
    console.log('🎯 [WhatsApp] Componente WhatsAppSimpleConnect MONTADO!');
    return () => {
      console.log('🎯 [WhatsApp] Componente WhatsAppSimpleConnect DESMONTADO!');
    };
  }, []);

  // Verificar status da conexão ao carregar
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      
      console.log('🔍 [WhatsApp] Verificando status da conexão...');
      
      const res = await fetch(`${SERVER_URL}/whatsapp-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('🔍 [WhatsApp] Status response:', res.ok, res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('🔍 [WhatsApp] Data recebida:', data);
        
        if (data.status === 'connected' || data.connected) {
          setIsConnected(true);
          setPhoneNumber(data.phoneNumber || data.number || 'WhatsApp Conectado');
          onConnectionChange?.(true, data.phoneNumber || data.number);
          console.log('✅ [WhatsApp] Status: CONECTADO -', data.phoneNumber || data.number);
        } else {
          console.log('❌ [WhatsApp] Status: DESCONECTADO');
        }
      }
    } catch (error) {
      console.error('❌ [WhatsApp] Erro ao verificar status:', error);
    }
  };

  const handleConnectAPI = async () => {
    if (!accessToken || !phoneNumberId || !businessAccountId) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        toast.error('Você precisa fazer login primeiro');
        return;
      }

      console.log('📱 Conectando WhatsApp Business API...');

      const res = await fetch(`${SERVER_URL}/whatsapp-connect`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          accessToken,
          phoneNumberId,
          businessAccountId
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao conectar');
      }

      const data = await res.json();
      
      setIsConnected(true);
      setPhoneNumber(data.phoneNumber);
      setShowSetup(false);
      onConnectionChange?.(true, data.phoneNumber);
      
      toast.success('✅ WhatsApp Business conectado com sucesso!');
      
    } catch (error: any) {
      console.error('❌ Erro:', error);
      toast.error(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectSimple = async () => {
    if (!simplePhone || simplePhone.length < 9) {
      toast.error('Digite um número válido');
      return;
    }

    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        toast.error('Você precisa fazer login primeiro');
        return;
      }

      console.log('📱 [Conexão Simples] Conectando número:', simplePhone);

      const res = await fetch(`${SERVER_URL}/whatsapp-connect-simple`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          phoneNumber: simplePhone
        })
      });

      console.log('📱 [Conexão Simples] Response:', res.status, res.ok);

      if (!res.ok) {
        const error = await res.json();
        console.error('📱 [Conexão Simples] Erro:', error);
        throw new Error(error.error || 'Erro ao conectar');
      }

      const data = await res.json();
      console.log('📱 [Conexão Simples] Data recebida:', data);
      
      setIsConnected(true);
      setPhoneNumber(simplePhone);
      setShowSetup(false);
      onConnectionChange?.(true, simplePhone);
      
      toast.success('✅ WhatsApp conectado! Modo de desenvolvimento ativo.');
      
    } catch (error: any) {
      console.error('❌ [Conexão Simples] Erro:', error);
      toast.error(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`${SERVER_URL}/whatsapp-disconnect`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      if (!res.ok) {
        throw new Error('Falha ao desconectar');
      }

      setIsConnected(false);
      setPhoneNumber('');
      setAccessToken('');
      setPhoneNumberId('');
      setBusinessAccountId('');
      onConnectionChange?.(false);
      toast.success('WhatsApp desconectado');
    } catch (error: any) {
      toast.error(`Erro ao desconectar: ${error.message}`);
    }
  };

  const handleTestMessage = async () => {
    console.log('📱 [WhatsApp Test] Iniciando teste de mensagem...');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      console.log('📱 [WhatsApp Test] Token obtido?', !!token);
      
      if (!token) {
        toast.error('Você precisa fazer login primeiro');
        return;
      }
      
      // Pedir número para teste
      const testNumber = window.prompt(
        '📱 Digite o número para teste (incluindo código do país):\n\nExemplo: 351912345678',
        '351'
      );
      
      console.log('📱 [WhatsApp Test] Número digitado:', testNumber);
      
      if (!testNumber) {
        console.log('📱 [WhatsApp Test] Cancelado pelo usuário');
        return;
      }
      
      toast.loading('Enviando mensagem de teste...', { id: 'whatsapp-test' });
      
      const requestBody = {
        to: testNumber,
        message: '✅ Teste do Tá Pago.pt!\n\nSua conexão WhatsApp Business está funcionando perfeitamente! 🎉\n\nAgora você pode enviar faturas e lembretes automáticos.'
      };
      
      console.log('📱 [WhatsApp Test] Enviando request para:', `${SERVER_URL}/whatsapp-send`);
      console.log('📱 [WhatsApp Test] Body:', requestBody);
      
      const res = await fetch(`${SERVER_URL}/whatsapp-send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('📱 [WhatsApp Test] Response status:', res.status, res.ok);
      
      const responseData = await res.json();
      console.log('📱 [WhatsApp Test] Response data:', responseData);
      
      if (!res.ok) {
        throw new Error(responseData.error || 'Erro ao enviar mensagem');
      }
      
      toast.success(`✅ Mensagem enviada para ${responseData.to}!`, { id: 'whatsapp-test' });
      console.log('✅ [WhatsApp Test] Sucesso!', responseData);
      
    } catch (error: any) {
      console.error('❌ [WhatsApp Test] Erro ao enviar teste:', error);
      toast.error(`Erro: ${error.message}`, { id: 'whatsapp-test' });
    }
  };

  return (
    <Card className="border-green-100 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <Smartphone className="w-5 h-5" />
          WhatsApp Business API
        </CardTitle>
        <CardDescription>
          {isConnected 
            ? '✅ Conectado - Envia mensagens reais (1.000 grátis/mês)'
            : '🆓 Configure grátis - até 1.000 mensagens/mês'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* CONECTADO */}
        {isConnected && (
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-green-600" />
              <p className="font-semibold text-lg text-green-700">
                WhatsApp Business Conectado!
              </p>
              <p className="text-sm text-green-600 mt-1">{phoneNumber}</p>
              <div className="mt-3 inline-block bg-green-100 px-3 py-1 rounded-full border border-green-300">
                <p className="text-xs text-green-800 font-semibold">
                  ✅ API Oficial - Mensagens REAIS
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={handleDisconnect}
            >
              Desconectar WhatsApp
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
              onClick={handleTestMessage}
            >
              Enviar Mensagem de Teste
            </Button>
          </div>
        )}

        {/* SETUP - CONFIGURAÇÃO */}
        {!isConnected && showSetup && (
          <div className="space-y-4">
            {/* SELETOR DE MODO */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSetupMode('simple')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  setupMode === 'simple'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                ⚡ Conexão Rápida
              </button>
              <button
                onClick={() => setSetupMode('api')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  setupMode === 'api'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                🔧 API Oficial
              </button>
            </div>

            {/* MODO SIMPLES */}
            {setupMode === 'simple' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-2">
                    <strong>🚀 Modo de Desenvolvimento</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    Conecte rapidamente com apenas o número de telefone. Perfeito para testar e desenvolver. 
                    As mensagens serão registadas mas não enviadas de verdade.
                  </p>
                </div>

                <div>
                  <Label htmlFor="simplePhone" className="text-sm font-semibold">
                    Número de Telefone *
                  </Label>
                  <Input 
                    id="simplePhone"
                    type="text"
                    placeholder="+351912345678"
                    value={simplePhone}
                    onChange={(e) => setSimplePhone(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Formato: +351912345678 (com código do país)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleConnectSimple}
                    disabled={isConnecting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        A conectar...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Conectar Agora
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowSetup(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* MODO API */}
            {setupMode === 'api' && (
              <>
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">📋 Passo a Passo:</p>
                      <ol className="text-xs space-y-1.5 list-decimal list-inside">
                        <li>Acesse o <a href="https://business.facebook.com/wa/manage/home" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Meta Business Manager</a></li>
                        <li>Crie uma conta WhatsApp Business (grátis)</li>
                        <li>Copie: <strong>Access Token</strong>, <strong>Phone Number ID</strong> e <strong>Business Account ID</strong></li>
                        <li>Cole abaixo e clique em "Conectar"</li>
                      </ol>
                      <a 
                        href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        📖 Guia completo <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="accessToken" className="text-xs font-semibold">Access Token *</Label>
                    <Input 
                      id="accessToken"
                      type="password"
                      placeholder="EAAxxxxxxxxxx..."
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumberId" className="text-xs font-semibold">Phone Number ID *</Label>
                    <Input 
                      id="phoneNumberId"
                      type="text"
                      placeholder="123456789012345"
                      value={phoneNumberId}
                      onChange={(e) => setPhoneNumberId(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessAccountId" className="text-xs font-semibold">Business Account ID *</Label>
                    <Input 
                      id="businessAccountId"
                      type="text"
                      placeholder="987654321098765"
                      value={businessAccountId}
                      onChange={(e) => setBusinessAccountId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleConnectAPI}
                    disabled={isConnecting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        A conectar...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Conectar API
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowSetup(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* DESCONECTADO - TELA INICIAL */}
        {!isConnected && !showSetup && (
          <div className="space-y-4">
            {/* Benefícios */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-800 mb-2">✅ WhatsApp Business API Oficial</p>
              <ul className="text-xs text-green-700 space-y-1.5">
                <li>✓ <strong>1.000 mensagens GRÁTIS</strong> por mês</li>
                <li>✓ Envia faturas e lembretes REAIS</li>
                <li>✓ API oficial da Meta/Facebook</li>
                <li>✓ Aprovado para uso comercial</li>
                <li>✓ Badge verde verificado</li>
              </ul>
            </div>

            {/* Botão Principal */}
            <Button 
              onClick={() => setShowSetup(true)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14"
            >
              <Settings className="w-5 h-5 mr-2" />
              Configurar WhatsApp Business (Grátis)
            </Button>

            {/* Info Adicional */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <p className="text-xs text-slate-600">
                💡 <strong>100% Grátis até 1.000 mensagens/mês.</strong> Ideal para cobrança automatizada. Após 1.000 msgs: ~€0.05 por mensagem.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}