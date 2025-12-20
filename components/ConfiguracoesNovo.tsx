import { useState } from 'react';
import { Smartphone, Mail, Settings as SettingsIcon, Database, QrCode, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type Tab = 'comunicacao' | 'crm' | 'ai' | 'geral';

export function ConfiguracoesNovo() {
  const [activeTab, setActiveTab] = useState<Tab>('comunicacao');
  const [showQRDemo, setShowQRDemo] = useState(false);

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
          <h1 className="text-teal-700 mb-2">✅ VERSÃO NOVA - Configurações do Sistema</h1>
          <p className="text-slate-600 text-sm">
            Gerencie as suas chaves de API, integrações e preferências gerais.
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
            {/* Cards lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <Card className="border-green-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Smartphone className="w-5 h-5" />
                    WhatsApp Business Cloud API
                  </CardTitle>
                  <CardDescription>
                    📱 API oficial Meta - Grátis até 1.000 mensagens/mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-900 text-sm mb-2">📋 3 Passos Rápidos:</p>
                    <ol className="text-xs text-blue-800 space-y-1.5 list-decimal list-inside">
                      <li>Acesse Meta Business</li>
                      <li>Crie conta WhatsApp Business (grátis)</li>
                      <li>Copie as 3 credenciais</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-blue-100 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Mail className="w-5 h-5" />
                    Configuração de Email
                  </CardTitle>
                  <CardDescription>
                    Configure o servidor de envio de notificações.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Email em construção...</p>
                </CardContent>
              </Card>
            </div>

            {/* Card DEMO: QR Code Visual */}
            <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <QrCode className="w-5 h-5" />
                  🎉 Pré-visualização: Interface QR Code
                </CardTitle>
                <CardDescription>
                  🎨 Demonstração visual de como ficaria com QR Code (apenas UI demo)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showQRDemo ? (
                  <div className="text-center py-8">
                    <QrCode className="w-20 h-20 mx-auto mb-4 text-purple-600" />
                    <p className="text-purple-900 font-semibold mb-2">
                      Quer ver como ficaria a interface com QR Code?
                    </p>
                    <p className="text-sm text-purple-700 mb-4">
                      Clique abaixo para ver uma pré-visualização da interface (apenas demonstração visual)
                    </p>
                    <Button
                      onClick={() => setShowQRDemo(true)}
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Ver Pré-visualização
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    {/* QR Code Demo */}
                    <div className="bg-white p-6 rounded-xl border-4 border-purple-200 inline-block shadow-xl mb-4">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DEMO-WHATSAPP-COBRA-PLUS" 
                        alt="QR Code Demo" 
                        className="w-64 h-64"
                      />
                    </div>

                    <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 mb-4">
                      <p className="text-sm text-purple-800">
                        ⚠️ <strong>Apenas Demonstração Visual!</strong>
                      </p>
                      <p className="text-xs text-purple-700 mt-1">
                        Este QR Code é apenas para mostrar como ficaria a interface. Para conexão REAL, use a Cloud API oficial acima. ☝️
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="font-semibold text-purple-700">
                        📱 Interface seria assim:
                      </p>
                      <ol className="text-sm text-purple-800 space-y-1 text-left max-w-md mx-auto">
                        <li>• Você clicaria em &quot;Gerar QR Code&quot;</li>
                        <li>• QR Code apareceria (como este acima)</li>
                        <li>• Escanearia com WhatsApp no telemóvel</li>
                        <li>• Conectaria instantaneamente</li>
                      </ol>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowQRDemo(false)}
                        className="border-purple-300"
                      >
                        Fechar Pré-visualização
                      </Button>
                      <Button
                        onClick={() => setShowQRDemo(false)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Usar Cloud API REAL
                      </Button>
                    </div>
                  </div>
                )}
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
    </div>
  );
}
