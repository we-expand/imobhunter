import { useState, useEffect } from 'react';
import { Smartphone, Mail, Settings as SettingsIcon, Database, CheckCircle, AlertCircle, ExternalLink, Copy, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';
import { TwilioSetupGuide } from './TwilioSetupGuide';
import { TwilioDebugPanel } from './TwilioDebugPanel';
import { WhatsAppDebugTest } from './WhatsAppDebugTest';
import { WhatsAppConnectionStatus } from './WhatsAppConnectionStatus';

type Tab = 'comunicacao' | 'crm' | 'ai' | 'geral';

export function ConfiguracoesWhatsApp() {
  const [activeTab, setActiveTab] = useState<Tab>('comunicacao');
  
  // WhatsApp Cloud API
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [businessAccountId, setBusinessAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadWhatsAppConfig();
  }, []);

  const loadWhatsAppConfig = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(`${SERVER_URL}/whatsapp-cloud-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.phoneNumberId) {
          setPhoneNumberId(data.phoneNumberId);
          setBusinessAccountId(data.businessAccountId || '');
          setAccessToken(data.accessToken || '');
          setWhatsappConnected(true);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configuração WhatsApp:', error);
    }
  };

  const handleSaveCloudAPI = async () => {
    if (!phoneNumberId || !accessToken) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error('Você precisa fazer login primeiro');
        return;
      }

      const res = await fetch(`${SERVER_URL}/whatsapp-cloud-config`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumberId,
          businessAccountId,
          accessToken
        })
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar configuração');
      }

      setWhatsappConnected(true);
      toast.success('✅ Configuração salva com sucesso!');
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  const handleTestConnection = async () => {
    if (!phoneNumberId || !accessToken) {
      toast.error('Configure primeiro as credenciais');
      return;
    }

    setIsTesting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${SERVER_URL}/whatsapp-cloud-test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('✅ Conexão testada com sucesso!');
      } else {
        toast.error(`❌ Erro no teste: ${data.error || 'Verifique as credenciais'}`);
      }
    } catch (error: any) {
      toast.error(`Erro ao testar: ${error.message}`);
    } finally {
      setIsTesting(false);
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
      setPhoneNumberId('');
      setBusinessAccountId('');
      setAccessToken('');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-teal-700 mb-2">⚡ Configurações do Sistema</h1>
          <p className="text-slate-600 text-sm">
            Configure seus canais de comunicação e integrações
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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
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
            {/* INFO: Escolha do Método */}
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-purple-900">
                  📱 Escolha o Método de Conexão WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Cloud API - FUNCIONA */}
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-green-900 mb-1">
                          Cloud API ✅ FUNCIONA
                        </p>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• 1.000 msg/mês grátis</li>
                          <li>• Oficial da Meta</li>
                          <li>• 100% funcional</li>
                          <li>• Configuração: 15 min</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* QR Code - NÃO FUNCIONA */}
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 opacity-75">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-bold text-red-900 mb-1">
                          QR Code ❌ NÃO FUNCIONA
                        </p>
                        <ul className="text-sm text-red-800 space-y-1 mb-3">
                          <li>• App não lê o código</li>
                          <li>• Dados simulados/falsos</li>
                          <li>• Limitação técnica</li>
                          <li>• Apenas demonstração</li>
                        </ul>
                        <a 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = 'qr-demo';
                          }}
                          className="text-xs text-red-700 underline hover:text-red-900"
                        >
                          Ver QR Code (demonstração)
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Cloud API */}
            <Card className="border-green-100 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Smartphone className="w-6 h-6" />
                  WhatsApp Business Cloud API
                </CardTitle>
                <CardDescription>
                  API Oficial da Meta • 1.000 conversas/mês GRÁTIS • 100% Funcional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {!whatsappConnected ? (
                  <>
                    {/* Instruções */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-blue-900 mb-3">
                            🚀 Como Obter as Credenciais (15 minutos)
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                            <li>
                              Acesse{' '}
                              <a
                                href="https://developers.facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold underline hover:text-blue-600"
                              >
                                Facebook Developers
                              </a>
                            </li>
                            <li>Crie um App → Selecione tipo "Negócios"</li>
                            <li>Adicione o produto "WhatsApp"</li>
                            <li>
                              Configure número de telefone → Copie o{' '}
                              <strong>Phone Number ID</strong>
                            </li>
                            <li>
                              Gere um <strong>Access Token</strong> (permanente ou temporário)
                            </li>
                            <li>Cole as credenciais abaixo</li>
                          </ol>
                          <div className="mt-4 pt-4 border-t border-blue-200">
                            <a
                              href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Ver Documentação Completa
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Formulário */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phoneNumberId" className="text-slate-700">
                          Phone Number ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phoneNumberId"
                          type="text"
                          placeholder="123456789012345"
                          value={phoneNumberId}
                          onChange={(e) => setPhoneNumberId(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Encontrado em: WhatsApp → API Setup → Phone Number ID
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="businessAccountId" className="text-slate-700">
                          Business Account ID <span className="text-slate-400">(opcional)</span>
                        </Label>
                        <Input
                          id="businessAccountId"
                          type="text"
                          placeholder="987654321098765"
                          value={businessAccountId}
                          onChange={(e) => setBusinessAccountId(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="accessToken" className="text-slate-700">
                          Access Token <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="accessToken"
                          type="password"
                          placeholder="EAAxxxxxxxxxxxxxxxx"
                          value={accessToken}
                          onChange={(e) => setAccessToken(e.target.value)}
                          className="mt-1"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Token de acesso permanente ou temporário (24h)
                        </p>
                      </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveCloudAPI}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Salvar Configuração
                      </Button>
                      <Button
                        onClick={handleTestConnection}
                        variant="outline"
                        disabled={isTesting || !phoneNumberId || !accessToken}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        {isTesting ? 'A testar...' : 'Testar Conexão'}
                      </Button>
                    </div>

                    {/* Vantagens */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="font-semibold text-emerald-900 mb-2">
                        ✅ Vantagens da Cloud API:
                      </p>
                      <ul className="text-sm text-emerald-800 space-y-1">
                        <li>• 1.000 conversas/mês GRÁTIS (após isso, €0.035/conversa)</li>
                        <li>• API oficial da Meta (sem risco de banimento)</li>
                        <li>• 100% estável e confiável</li>
                        <li>• Suporta texto, imagens, PDFs, áudio e vídeo</li>
                        <li>• Configuração rápida (15 minutos)</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-20 h-20 mx-auto text-green-600 mb-4" />
                    <p className="font-semibold text-green-700 text-xl mb-2">
                      WhatsApp Conectado!
                    </p>
                    <p className="text-sm text-green-600 mb-1">
                      Phone ID: {phoneNumberId}
                    </p>
                    {businessAccountId && (
                      <p className="text-sm text-green-600 mb-4">
                        Business ID: {businessAccountId}
                      </p>
                    )}
                    <div className="inline-block bg-green-100 px-6 py-3 rounded-full border border-green-300 mt-2 mb-6">
                      <p className="text-sm text-green-800 font-semibold">
                        ✅ Pronto para enviar mensagens via WhatsApp
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleTestConnection}
                        variant="outline"
                        disabled={isTesting}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        {isTesting ? 'A testar...' : 'Testar Novamente'}
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={handleDisconnect}
                      >
                        Desconectar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="border-blue-100 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Mail className="w-5 h-5" />
                  Configuração de Email
                </CardTitle>
                <CardDescription>
                  Email via Resend já está configurado e funcional ✅
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    O envio de emails está ativo e funcionando através da API Resend.
                    Você pode enviar emails de cobrança através da Régua de Cobrança.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Twilio SMS Setup */}
            <TwilioSetupGuide />
            <TwilioDebugPanel />
            <WhatsAppDebugTest />
            <WhatsAppConnectionStatus />
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
    </div>
  );
}