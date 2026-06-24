import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Linkedin, 
  Settings, 
  Database, 
  Users, 
  CheckCircle,
  XCircle,
  Shield,
  Zap,
  TrendingUp,
  Search,
  Building2
} from 'lucide-react';
import { LinkedInQRAuth } from './linkedin-qr-auth';
import { projectId } from '../utils/supabase/info';

export function LinkedInIntegrationPage() {
  const [connectedUser, setConnectedUser] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-xl">
              <Linkedin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Integração LinkedIn
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conecte sua conta LinkedIn para desbloquear funcionalidades avançadas de busca e networking
          </p>
        </div>

        <Tabs defaultValue="auth" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="auth">
              <Shield className="w-4 h-4 mr-2" />
              Autenticação
            </TabsTrigger>
            <TabsTrigger value="features">
              <Zap className="w-4 h-4 mr-2" />
              Funcionalidades
            </TabsTrigger>
            <TabsTrigger value="setup">
              <Settings className="w-4 h-4 mr-2" />
              Configuração
            </TabsTrigger>
          </TabsList>

          {/* Tab: Autenticação */}
          <TabsContent value="auth" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code Auth */}
              <div>
                <LinkedInQRAuth 
                  onConnected={(user) => {
                    setConnectedUser(user);
                  }}
                  onDisconnected={() => {
                    setConnectedUser(null);
                  }}
                />
              </div>

              {/* Benefícios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Por que conectar?
                  </CardTitle>
                  <CardDescription>
                    Desbloqueie todo o potencial da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      icon: Search,
                      title: 'Busca Avançada',
                      description: 'Acesse 900M+ perfis do LinkedIn'
                    },
                    {
                      icon: Users,
                      title: 'Network Inteligente',
                      description: 'Encontre conexões de 2º e 3º grau'
                    },
                    {
                      icon: Database,
                      title: 'Dados Enriquecidos',
                      description: 'Informações completas de perfis'
                    },
                    {
                      icon: Building2,
                      title: 'Empresas',
                      description: 'Pesquise e analise empresas'
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{benefit.title}</p>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Status da Conexão */}
            {connectedUser && (
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-green-500 overflow-hidden">
                      <img 
                        src={connectedUser.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(connectedUser.name)}`}
                        alt={connectedUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900">{connectedUser.name}</h3>
                      <p className="text-green-700">{connectedUser.email}</p>
                      <Badge className="mt-2 bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conta Conectada
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-700">Status</p>
                      <div className="flex items-center gap-2 text-green-900 font-semibold">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Online
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Funcionalidades */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Busca de Pessoas',
                  description: 'Encontre profissionais por cargo, empresa, localização e mais',
                  features: ['900M+ perfis', '24+ filtros avançados', 'Score de match IA'],
                  icon: Users,
                  color: 'blue'
                },
                {
                  title: 'Busca de Empresas',
                  description: 'Pesquise empresas por setor, tamanho, localização',
                  features: ['55M+ empresas', '30+ filtros', 'Dados em tempo real'],
                  icon: Building2,
                  color: 'purple'
                },
                {
                  title: 'Enriquecimento de Perfis',
                  description: 'Obtenha dados completos de qualquer perfil LinkedIn',
                  features: ['Experiência profissional', 'Formação acadêmica', 'Skills & certificações'],
                  icon: Database,
                  color: 'green'
                },
                {
                  title: 'Network Mapping',
                  description: 'Visualize conexões e encontre caminhos de introdução',
                  features: ['1º, 2º, 3º grau', 'Conexões mútuas', 'Warm introductions'],
                  icon: TrendingUp,
                  color: 'orange'
                }
              ].map((feature, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-700 rounded-xl flex items-center justify-center mb-3`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Configuração */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Como Configurar a Integração</CardTitle>
                <CardDescription>
                  Siga estes passos para configurar o LinkedIn OAuth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Criar App no LinkedIn Developers</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Acesse <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn Developers</a> e crie um novo app
                      </p>
                      <Button size="sm" variant="outline" onClick={() => window.open('https://www.linkedin.com/developers/apps', '_blank')}>
                        Ir para LinkedIn Developers →
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Configurar OAuth 2.0</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Adicione a URL de redirect:
                      </p>
                      <code className="block p-2 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
                        https://{projectId}.supabase.co/functions/v1/make-server-v2/linkedin-auth/callback
                      </code>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Copiar Credenciais</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        Copie o <strong>Client ID</strong> e <strong>Client Secret</strong> do seu app
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Configurar no Supabase</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        No Admin Dashboard, vá em <strong>Configurações → API Keys</strong> e adicione:
                      </p>
                      <ul className="text-sm space-y-1 text-gray-700">
                        <li>• <code className="bg-gray-200 px-1 rounded">LINKEDIN_CLIENT_ID</code></li>
                        <li>• <code className="bg-gray-200 px-1 rounded">LINKEDIN_CLIENT_SECRET</code></li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      5
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Testar Conexão</h4>
                      <p className="text-sm text-gray-700">
                        Volte à aba "Autenticação" e gere um QR Code para testar!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissões necessárias */}
            <Card>
              <CardHeader>
                <CardTitle>Permissões OAuth Necessárias</CardTitle>
                <CardDescription>
                  Selecione estas permissões no seu app LinkedIn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { scope: 'openid', description: 'Identificação básica' },
                    { scope: 'profile', description: 'Perfil público' },
                    { scope: 'email', description: 'Endereço de email' },
                    { scope: 'w_member_social', description: 'Postar em nome do usuário' }
                  ].map((perm, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <code className="text-sm font-mono text-gray-900">{perm.scope}</code>
                        <p className="text-xs text-gray-600">{perm.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}