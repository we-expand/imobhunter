import { useState, useEffect } from 'react';
import { Smartphone, Mail, Settings as SettingsIcon, Database, CheckCircle, ExternalLink, Loader2, QrCode, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';

type Tab = 'comunicacao' | 'crm' | 'ai' | 'geral';
type WhatsAppMethod = 'cloudapi' | 'qrcode' | null;

export function ConfiguracoesCompleta() {
  console.log('🚀 ConfiguracoesCompleta carregado - VERSÃO NOVA');
  
  // ALERTA FORÇADO PARA DEBUG
  useEffect(() => {
    console.log('⚠️ VERSÃO NOVA CARREGADA - Se não vir barra roxa, é CACHE!');
  }, []);
  
  const [activeTab, setActiveTab] = useState<Tab>('comunicacao');
  const [whatsappMethod, setWhatsappMethod] = useState<WhatsAppMethod>(null);
  
  // WhatsApp Cloud API
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isConnectingWhatsapp, setIsConnectingWhatsapp] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');

  // WhatsApp QR Code
  const [qrCode, setQrCode] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrStatus, setQrStatus] = useState<'idle' | 'waiting' | 'connected' | 'expired'>('idle');

  useEffect(() => {
    checkWhatsAppConnection();
  }, []);

  // Polling para verificar scan do QR Code
  useEffect(() => {
    let interval: any = null;
    
    if (qrStatus === 'waiting' && whatsappMethod === 'qrcode') {
      console.log('📡 Iniciando polling do QR Code...');
      interval = setInterval(async () => {
        console.log('🔍 Verificando status do QR Code...');
        await checkQRStatus();
      }, 2000); // Verifica a cada 2 segundos
    }

    return () => {
      if (interval) {
        console.log('🛑 Parando polling do QR Code');
        clearInterval(interval);
      }
    };
  }, [qrStatus, whatsappMethod]);

  const checkWhatsAppConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      
      const res = await fetch(`${SERVER_URL}/whatsapp-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('📊 Status WhatsApp:', data);
        if (data.connected) {
          setWhatsappConnected(true);
          setWhatsappNumber(data.number || 'WhatsApp Conectado');
          setWhatsappMethod(data.method === 'qr_code' ? 'qrcode' : 'cloudapi');
          if (data.method === 'qr_code') {
            setQrStatus('connected');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status WhatsApp:', error);
    }
  };

  // ============= CLOUD API =============
  const handleConnectCloudAPI = async () => {
    if (!accessToken || !phoneNumberId || !businessAccountId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsConnectingWhatsapp(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        toast.error('Você precisa fazer login primeiro');
        return;
      }

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
      
      setWhatsappConnected(true);
      setWhatsappNumber(data.phoneNumber);
      setWhatsappMethod('cloudapi');
      toast.success('✅ WhatsApp Business Cloud API conectada!');
      
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(error.message);
    } finally {
      setIsConnectingWhatsapp(false);
    }
  };

  // ============= QR CODE =============
  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        toast.error('Você precisa fazer login primeiro');
        return;
      }

      console.log('🔄 Gerando QR Code...');
      const res = await fetch(`${SERVER_URL}/whatsapp-qr-start`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao gerar QR Code');
      }

      const data = await res.json();
      console.log('✅ QR Code recebido:', data);
      
      setQrCode(data.qrCode);
      setQrStatus('waiting');
      setWhatsappMethod('qrcode');
      toast.success('QR Code gerado! Escaneie em 5 minutos');
      
    } catch (error: any) {
      console.error('❌ Erro ao gerar QR Code:', error);
      toast.error(error.message);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const checkQRStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(`${SERVER_URL}/whatsapp-qr-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('📊 Status QR:', data);
        
        if (data.status === 'connected') {
          console.log('✅ WhatsApp Conectado!');
          setQrStatus('connected');
          setWhatsappConnected(true);
          setWhatsappNumber(data.phoneNumber || 'WhatsApp Conectado');
          toast.success('✅ WhatsApp conectado com sucesso!');
        } else if (data.status === 'expired') {
          console.log('⏱️ QR Code Expirado');
          setQrStatus('expired');
          toast.error('QR Code expirado. Gere um novo.');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const simulateScan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      console.log('🧪 Simulando scan do QR Code...');
      const res = await fetch(`${SERVER_URL}/whatsapp-qr-simulate-scan`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Scan simulado com sucesso:', data);
        setQrStatus('connected');
        setWhatsappConnected(true);
        setWhatsappNumber(data.phoneNumber);
        toast.success('✅ WhatsApp conectado! (simulação)');
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao simular scan');
      }
    } catch (error: any) {
      console.error('❌ Erro ao simular scan:', error);
      toast.error(error.message);
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

      setWhatsappConnected(false);
      setWhatsappNumber('');
      setQrCode('');
      setQrStatus('idle');
      setWhatsappMethod(null);
      setAccessToken('');
      setPhoneNumberId('');
      setBusinessAccountId('');
      toast.success('WhatsApp desconectado');
    } catch (error: any) {
      toast.error(`Erro ao desconectar: ${error.message}`);
    }
  };

  const tabs = [
    { id: 'comunicacao' as Tab, label: 'Canais de Comunicação', icon: Smartphone },
    { id: 'ai' as Tab, label: 'Conexões AI', icon: Database },
    { id: 'crm' as Tab, label: 'Integrações CRM', icon: Database },
    { id: 'geral' as Tab, label: 'Geral', icon: SettingsIcon },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* MARCADOR DE VERSÃO */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 px-4 rounded-lg mb-4">
        ✨ VERSÃO ATUALIZADA - 2024 ✨
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-teal-700 mb-2">⚙️ Configurações do Sistema</h1>
        <p className="text-slate-600">
          Configure seus canais de comunicação, integrações e preferências
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'comunicacao' && (
        <div className="space-y-6">
          {/* WhatsApp - Seleção de Método */}
          {!whatsappConnected && !whatsappMethod && (
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">📱 Conectar WhatsApp</CardTitle>
                <CardDescription>
                  Escolha como deseja conectar seu WhatsApp ao Cobra+
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Cloud API */}
                  <button
                    onClick={() => setWhatsappMethod('cloudapi')}
                    className="p-6 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-lg transition-all text-left bg-gradient-to-br from-emerald-50 to-green-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-900 mb-2">Cloud API Oficial ⭐</h3>
                        <p className="text-sm text-emerald-700 mb-3">
                          API oficial da Meta. 100% estável e confiável.
                        </p>
                        <div className="space-y-1 text-xs text-emerald-600">
                          <p>✅ 1.000 mensagens/mês GRÁTIS</p>
                          <p>✅ Oficial da Meta/Facebook</p>
                          <p>✅ Funciona 100%</p>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* QR Code */}
                  <button
                    onClick={() => setWhatsappMethod('qrcode')}
                    className="p-6 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all text-left bg-gradient-to-br from-purple-50 to-pink-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <QrCode className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-900 mb-2">QR Code (Demo)</h3>
                        <p className="text-sm text-purple-700 mb-3">
                          Conexão rápida via QR Code para testes.
                        </p>
                        <div className="space-y-1 text-xs text-purple-600">
                          <p>⚠️ Demonstração apenas</p>
                          <p>⏱️ Expira em 5 minutos</p>
                          <p>🧪 Use para testar</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cloud API Form */}
          {whatsappMethod === 'cloudapi' && !whatsappConnected && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Smartphone className="w-5 h-5" />
                  WhatsApp Cloud API - Configuração
                </CardTitle>
                <CardDescription>
                  Configure a API oficial da Meta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 mb-2 font-semibold">
                    📚 Como obter as credenciais?
                  </p>
                  <a
                    href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 underline"
                  >
                    Tutorial Oficial da Meta
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="accessToken">WhatsApp Business Access Token *</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      placeholder="EAAxxxxxxxxxxxxxx"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumberId">Phone Number ID *</Label>
                    <Input
                      id="phoneNumberId"
                      placeholder="123456789012345"
                      value={phoneNumberId}
                      onChange={(e) => setPhoneNumberId(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessAccountId">WhatsApp Business Account ID *</Label>
                    <Input
                      id="businessAccountId"
                      placeholder="987654321098765"
                      value={businessAccountId}
                      onChange={(e) => setBusinessAccountId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleConnectCloudAPI}
                    disabled={isConnectingWhatsapp || !accessToken || !phoneNumberId || !businessAccountId}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isConnectingWhatsapp ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        A conectar...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Conectar Cloud API
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setWhatsappMethod(null)}
                  >
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code */}
          {whatsappMethod === 'qrcode' && !whatsappConnected && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <QrCode className="w-5 h-5" />
                  WhatsApp QR Code - Conexão Rápida
                </CardTitle>
                <CardDescription>
                  Escaneie o QR Code com seu WhatsApp (expira em 5 min)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Estado: Idle - Pronto para gerar */}
                {qrStatus === 'idle' && (
                  <div className="text-center py-8">
                    <div className="bg-purple-100 border-4 border-dashed border-purple-300 rounded-2xl p-12 mb-6">
                      <QrCode className="w-24 h-24 mx-auto text-purple-600 mb-4" />
                      <p className="font-semibold text-purple-900 text-lg mb-2">
                        Pronto para conectar?
                      </p>
                      <p className="text-sm text-purple-700">
                        Clique no botão abaixo para gerar seu QR Code
                      </p>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleGenerateQR}
                        disabled={isGeneratingQR}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isGeneratingQR ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            A gerar...
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4 mr-2" />
                            Gerar QR Code
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setWhatsappMethod(null)}
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Estado: Waiting - Aguardando scan */}
                {qrStatus === 'waiting' && qrCode && (
                  <div className="text-center py-6">
                    <div className="mb-6 flex justify-center">
                      <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-purple-500">
                        <img src={qrCode} alt="QR Code WhatsApp" className="w-80 h-80" />
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <p className="text-sm text-purple-900 font-semibold mb-3">
                        📱 Como escanear:
                      </p>
                      <ol className="text-sm text-purple-700 text-left space-y-2 list-decimal list-inside">
                        <li>Abra o WhatsApp no telemóvel</li>
                        <li>Toque em Mais opções → Dispositivos ligados</li>
                        <li>Toque em &quot;Ligar um dispositivo&quot;</li>
                        <li>Aponte a câmara para este ecrã</li>
                      </ol>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className="flex items-center gap-2 text-purple-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">A aguardar scan...</span>
                      </div>
                      
                      <Button
                        onClick={simulateScan}
                        variant="outline"
                        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Simular Scan (Teste)
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setQrStatus('idle');
                          setQrCode('');
                          setWhatsappMethod(null);
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Estado: Expired - QR expirado */}
                {qrStatus === 'expired' && (
                  <div className="text-center py-8">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-6">
                      <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-3" />
                      <p className="text-red-700 font-semibold mb-2">⏱️ QR Code Expirado</p>
                      <p className="text-sm text-red-600">
                        O tempo de 5 minutos expirou. Gere um novo QR Code.
                      </p>
                    </div>
                    <Button
                      onClick={handleGenerateQR}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Gerar Novo QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* WhatsApp Conectado */}
          {whatsappConnected && (
            <Card className="border-emerald-200 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
              <CardContent className="text-center py-12">
                <CheckCircle className="w-20 h-20 mx-auto text-emerald-600 mb-4" />
                <p className="font-semibold text-emerald-700 text-xl mb-2">
                  ✅ WhatsApp Conectado!
                </p>
                <p className="text-lg text-emerald-600 mb-2">{whatsappNumber}</p>
                <div className="inline-block bg-emerald-100 px-6 py-2 rounded-full border border-emerald-300 mb-6">
                  <p className="text-sm text-emerald-800 font-semibold">
                    {whatsappMethod === 'cloudapi' ? '☁️ Cloud API Oficial' : '📱 QR Code'}
                  </p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleDisconnect}
                  >
                    Desconectar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-700">
                <Mail className="w-5 h-5" />
                Configuração de Email
              </CardTitle>
              <CardDescription>
                Configure o servidor de envio de notificações por email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">Em breve...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'crm' && (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Integrações CRM em breve...</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ai' && (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Conexões AI em breve...</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'geral' && (
        <Card>
          <CardContent className="py-12 text-center">
            <SettingsIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">Configurações gerais em breve...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}