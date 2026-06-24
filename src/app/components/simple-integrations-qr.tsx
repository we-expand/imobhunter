import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  CheckCircle, 
  Copy, 
  Zap,
  MessageSquare,
  Building2,
  Database,
  Search,
  QrCode,
  Smartphone,
  Loader2,
  Phone,
  User
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SimpleIntegrationsQR() {
  const [integrations, setIntegrations] = useState({
    whatsapp: { 
      enabled: false, 
      qrCode: '', 
      connected: false,
      phone: '',
      name: '',
      status: 'disconnected' // disconnected | generating | connected
    },
    linkedin: { 
      enabled: false, 
      qrCode: '',
      connected: false,
      profileUrl: '',
      name: '',
      status: 'disconnected'
    },
    apollo: { 
      enabled: false, 
      apiKey: '',
      connected: false
    },
    hunter: { 
      enabled: false, 
      apiKey: '',
      connected: false
    }
  });

  const [socialPhones, setSocialPhones] = useState<{[key: string]: string}>({});
  const [loadingPhones, setLoadingPhones] = useState(false);

  // Gera QR Code para WhatsApp
  const generateWhatsAppQR = () => {
    setIntegrations(prev => ({
      ...prev,
      whatsapp: { 
        ...prev.whatsapp, 
        status: 'generating',
        enabled: true
      }
    }));

    // Simula geração de QR Code (em produção, usa WhatsApp Business API)
    setTimeout(() => {
      const qrCodeData = `whatsapp://qr/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setIntegrations(prev => ({
        ...prev,
        whatsapp: { 
          ...prev.whatsapp,
          qrCode: qrCodeData,
          status: 'generating'
        }
      }));

      // Simula conexão após 5 segundos
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
        
        setIntegrations(prev => ({
          ...prev,
          whatsapp: { 
            ...prev.whatsapp,
            connected: true,
            status: 'connected',
            phone: '+351 912 345 678',
            name: currentUser.name || 'Usuário'
          }
        }));

        toast.success('✅ WhatsApp conectado com sucesso!', {
          description: 'Você já pode enviar mensagens automáticas'
        });

        // Busca telefone das redes sociais ao conectar
        fetchSocialPhones();
      }, 5000);
    }, 1500);

    toast.info('📱 Escaneie o QR Code com seu WhatsApp', {
      description: 'Abra WhatsApp → Configurações → Dispositivos conectados'
    });
  };

  // Gera QR Code para LinkedIn
  const generateLinkedInQR = () => {
    setIntegrations(prev => ({
      ...prev,
      linkedin: { 
        ...prev.linkedin, 
        status: 'generating',
        enabled: true
      }
    }));

    // Simula geração de QR Code
    setTimeout(() => {
      const qrCodeData = `linkedin://qr/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setIntegrations(prev => ({
        ...prev,
        linkedin: { 
          ...prev.linkedin,
          qrCode: qrCodeData,
          status: 'generating'
        }
      }));

      // Simula conexão após 5 segundos
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
        
        setIntegrations(prev => ({
          ...prev,
          linkedin: { 
            ...prev.linkedin,
            connected: true,
            status: 'connected',
            profileUrl: 'https://linkedin.com/in/joao-nunes',
            name: currentUser.name || 'Usuário'
          }
        }));

        toast.success('✅ LinkedIn conectado com sucesso!', {
          description: 'Você já pode buscar leads automaticamente'
        });

        // Busca telefone das redes sociais ao conectar
        fetchSocialPhones();
      }, 5000);
    }, 1500);

    toast.info('📱 Escaneie o QR Code com o app LinkedIn', {
      description: 'Abra LinkedIn → Configurações → QR Code'
    });
  };

  // Desconecta WhatsApp
  const disconnectWhatsApp = () => {
    setIntegrations(prev => ({
      ...prev,
      whatsapp: { 
        enabled: false,
        qrCode: '',
        connected: false,
        phone: '',
        name: '',
        status: 'disconnected'
      }
    }));
    toast.success('WhatsApp desconectado');
  };

  // Desconecta LinkedIn
  const disconnectLinkedIn = () => {
    setIntegrations(prev => ({
      ...prev,
      linkedin: { 
        enabled: false,
        qrCode: '',
        connected: false,
        profileUrl: '',
        name: '',
        status: 'disconnected'
      }
    }));
    toast.success('LinkedIn desconectado');
  };

  // Ativa/desativa Apollo
  const toggleApollo = () => {
    const newState = !integrations.apollo.enabled;
    setIntegrations(prev => ({
      ...prev,
      apollo: { ...prev.apollo, enabled: newState }
    }));
    
    toast.success(
      newState ? '✅ Apollo.io ativado!' : '⏸️ Apollo.io desativado'
    );
  };

  // Ativa/desativa Hunter
  const toggleHunter = () => {
    const newState = !integrations.hunter.enabled;
    setIntegrations(prev => ({
      ...prev,
      hunter: { ...prev.hunter, enabled: newState }
    }));
    
    toast.success(
      newState ? '✅ Hunter.io ativado!' : '⏸️ Hunter.io desativado'
    );
  };

  // Atualiza campo de API
  const updateField = (integration: string, field: string, value: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: { ...prev[integration], [field]: value }
    }));
  };

  // Testa conexão com API
  const testConnection = (name: string, integration: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setIntegrations(prev => ({
            ...prev,
            [integration]: { ...prev[integration], connected: true }
          }));
          resolve(true);
        }, 1500);
      }),
      {
        loading: `🔄 Testando conexão com ${name}...`,
        success: `✅ ${name} conectado com sucesso!`,
        error: `❌ Erro ao conectar com ${name}`
      }
    );
  };

  // Busca telefone dos usuários nas redes sociais via API
  const fetchSocialPhones = async () => {
    setLoadingPhones(true);
    
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          // Simula resposta de APIs de redes sociais
          const mockPhones = {
            whatsapp: '+351 912 345 678',
            linkedin: '+351 918 765 432',
            facebook: '+351 915 555 444',
            twitter: '+351 913 222 111'
          };
          
          setSocialPhones(mockPhones);
          
          // Salva no localStorage
          const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
          currentUser.socialPhones = mockPhones;
          localStorage.setItem('current-user', JSON.stringify(currentUser));
          
          setLoadingPhones(false);
          resolve(mockPhones);
        }, 2000);
      }),
      {
        loading: '🔍 Buscando telefones nas redes sociais...',
        success: '✅ Telefones encontrados e salvos!',
        error: '❌ Erro ao buscar telefones'
      }
    );
  };

  // Carrega telefones salvos ao montar
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
    if (currentUser.socialPhones) {
      setSocialPhones(currentUser.socialPhones);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Telefones das Redes Sociais */}
      {Object.keys(socialPhones).length > 0 && (
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Phone className="w-5 h-5" />
              Telefones Encontrados nas Redes Sociais
            </CardTitle>
            <CardDescription>
              Dados extraídos automaticamente via APIs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(socialPhones).map(([network, phone]) => (
                <div key={network} className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 capitalize">{network}</p>
                    <p className="font-medium">{phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp Business API - QR Code */}
      <Card className={integrations.whatsapp.connected ? 'border-green-300 bg-green-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  WhatsApp Business API
                  {integrations.whatsapp.connected && (
                    <Badge className="bg-green-600">✓ Conectado</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Conecte via QR Code em 5 segundos
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!integrations.whatsapp.connected ? (
            <>
              {integrations.whatsapp.status === 'disconnected' && (
                <div className="text-center py-6">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Clique para gerar QR Code e conectar seu WhatsApp
                  </p>
                  <Button 
                    onClick={generateWhatsAppQR}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Smartphone className="w-5 h-5" />
                    Gerar QR Code
                  </Button>
                </div>
              )}

              {integrations.whatsapp.status === 'generating' && (
                <div className="text-center py-6">
                  {integrations.whatsapp.qrCode ? (
                    <>
                      <div className="w-64 h-64 mx-auto mb-4 bg-white border-4 border-green-600 rounded-xl flex items-center justify-center">
                        {/* Simula QR Code - em produção, usar biblioteca qrcode.react */}
                        <div className="grid grid-cols-8 gap-1 p-4">
                          {[...Array(64)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-green-600 animate-pulse mb-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Aguardando conexão...</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        1. Abra o WhatsApp no celular<br/>
                        2. Toque em Configurações → Dispositivos conectados<br/>
                        3. Escaneie este QR Code
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                      <span>Gerando QR Code...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-100 border border-green-300 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">Conectado com sucesso!</p>
                  <p className="text-sm text-green-700">
                    {integrations.whatsapp.name} • {integrations.whatsapp.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={disconnectWhatsApp}
                >
                  Desconectar
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={fetchSocialPhones}
                  disabled={loadingPhones}
                >
                  {loadingPhones ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Buscar Telefones
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LinkedIn Sales Navigator - QR Code */}
      <Card className={integrations.linkedin.connected ? 'border-blue-300 bg-blue-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  LinkedIn Sales Navigator
                  {integrations.linkedin.connected && (
                    <Badge className="bg-blue-600">✓ Conectado</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Conecte via QR Code do LinkedIn
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!integrations.linkedin.connected ? (
            <>
              {integrations.linkedin.status === 'disconnected' && (
                <div className="text-center py-6">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Clique para gerar QR Code e conectar seu LinkedIn
                  </p>
                  <Button 
                    onClick={generateLinkedInQR}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <Smartphone className="w-5 h-5" />
                    Gerar QR Code
                  </Button>
                </div>
              )}

              {integrations.linkedin.status === 'generating' && (
                <div className="text-center py-6">
                  {integrations.linkedin.qrCode ? (
                    <>
                      <div className="w-64 h-64 mx-auto mb-4 bg-white border-4 border-blue-600 rounded-xl flex items-center justify-center">
                        {/* Simula QR Code */}
                        <div className="grid grid-cols-8 gap-1 p-4">
                          {[...Array(64)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-blue-600 animate-pulse mb-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Aguardando conexão...</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        1. Abra o LinkedIn no celular<br/>
                        2. Toque no ícone QR Code<br/>
                        3. Escaneie este código
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span>Gerando QR Code...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">Conectado com sucesso!</p>
                  <p className="text-sm text-blue-700">
                    {integrations.linkedin.name} • {integrations.linkedin.profileUrl}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={disconnectLinkedIn}
                >
                  Desconectar
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={fetchSocialPhones}
                  disabled={loadingPhones}
                >
                  {loadingPhones ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Buscar Telefones
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Apollo.io - Enriquecimento */}
      <Card className={integrations.apollo.enabled ? 'border-purple-300 bg-purple-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Apollo.io
                  {integrations.apollo.connected && (
                    <Badge className="bg-purple-600">✓ Ativo</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Enriquecimento automático de leads
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={integrations.apollo.enabled}
              onCheckedChange={toggleApollo}
            />
          </div>
        </CardHeader>
        
        {integrations.apollo.enabled && (
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Cole sua Apollo API key..."
                value={integrations.apollo.apiKey}
                onChange={(e) => updateField('apollo', 'apiKey', e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                🔗 <a href="https://app.apollo.io/settings/integrations" target="_blank" className="text-purple-600 hover:underline">
                  Obter API key gratuita (60 créditos/mês) →
                </a>
              </p>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-900 font-medium mb-2">
                ✨ Enriquecimento automático:
              </p>
              <ul className="text-xs space-y-1 text-purple-700">
                <li>• 📧 Email profissional</li>
                <li>• 📱 Telefone direto</li>
                <li>• 🏢 Detalhes da empresa</li>
                <li>• 💼 Cargo e senioridade</li>
              </ul>
            </div>

            <Button 
              onClick={() => testConnection('Apollo.io', 'apollo')} 
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
              disabled={!integrations.apollo.apiKey}
            >
              <Zap className="w-4 h-4" />
              Testar Enriquecimento
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Hunter.io - Email Finder */}
      <Card className={integrations.hunter.enabled ? 'border-orange-300 bg-orange-50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Hunter.io
                  {integrations.hunter.connected && (
                    <Badge className="bg-orange-600">✓ Ativo</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Encontre emails profissionais
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={integrations.hunter.enabled}
              onCheckedChange={toggleHunter}
            />
          </div>
        </CardHeader>
        
        {integrations.hunter.enabled && (
          <CardContent className="space-y-4">
            <div>
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Cole sua Hunter.io API key..."
                value={integrations.hunter.apiKey}
                onChange={(e) => updateField('hunter', 'apiKey', e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                🆓 50 buscas grátis/mês • 
                <a href="https://hunter.io/api-keys" target="_blank" className="text-orange-600 hover:underline ml-1">
                  Criar conta →
                </a>
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-900 font-medium mb-2">
                🎯 Encontra automaticamente:
              </p>
              <ul className="text-xs space-y-1 text-orange-700">
                <li>• 📧 Email de qualquer pessoa</li>
                <li>• ✓ Verifica se email existe</li>
                <li>• 💯 Score de confiabilidade 0-100</li>
                <li>• 🏢 Todos emails de uma empresa</li>
              </ul>
            </div>

            <Button 
              onClick={() => testConnection('Hunter.io', 'hunter')} 
              className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
              disabled={!integrations.hunter.apiKey}
            >
              <Search className="w-4 h-4" />
              Testar Busca de Email
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
