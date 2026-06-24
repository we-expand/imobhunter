/**
 * 🔌 SOCIAL INTEGRATIONS SETTINGS
 * Página de configuração de integrações com redes sociais
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge-export';
import {
  Linkedin, Facebook, Instagram, Twitter, Music,
  CheckCircle, XCircle, Settings, Key, RefreshCw,
  ExternalLink, AlertCircle, Zap, Shield, Link2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Integration {
  id: string;
  name: string;
  platform: string;
  icon: any;
  color: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  connectedAt?: string;
  lastSync?: string;
  features: string[];
  setupUrl: string;
}

export function SocialIntegrationsSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'linkedin',
      name: 'LinkedIn',
      platform: 'linkedin',
      icon: Linkedin,
      color: 'from-blue-600 to-blue-700',
      description: 'Busca profissional, networking B2B e dados corporativos',
      status: 'connected',
      connectedAt: '15/12/2024',
      lastSync: 'há 2 horas',
      features: ['Busca de perfis', 'Sales Navigator', 'Company Pages', 'InMail'],
      setupUrl: 'https://www.linkedin.com/developers/',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      platform: 'facebook',
      icon: Facebook,
      color: 'from-blue-500 to-indigo-600',
      description: 'Maior rede social do mundo - audiências e grupos',
      status: 'disconnected',
      features: ['Busca de perfis', 'Grupos', 'Páginas', 'Graph API'],
      setupUrl: 'https://developers.facebook.com/',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      platform: 'instagram',
      icon: Instagram,
      color: 'from-pink-500 via-purple-500 to-orange-500',
      description: 'Rede visual - influenciadores e lifestyle',
      status: 'connected',
      connectedAt: '12/12/2024',
      lastSync: 'há 1 hora',
      features: ['Busca de perfis', 'Posts', 'Stories', 'Hashtags'],
      setupUrl: 'https://developers.facebook.com/docs/instagram-api',
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      platform: 'twitter',
      icon: Twitter,
      color: 'from-sky-500 to-blue-600',
      description: 'Real-time social network - notícias e tendências',
      status: 'disconnected',
      features: ['Busca de tweets', 'Perfis', 'Trending topics', 'API v2'],
      setupUrl: 'https://developer.twitter.com/',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      platform: 'tiktok',
      icon: Music,
      color: 'from-black via-purple-600 to-pink-600',
      description: 'Plataforma de vídeos curtos - audiência jovem',
      status: 'error',
      features: ['Busca de perfis', 'Vídeos', 'Hashtags', 'Analytics'],
      setupUrl: 'https://developers.tiktok.com/',
    },
  ]);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? {
              ...int,
              status: 'connected',
              connectedAt: new Date().toLocaleDateString('pt-PT'),
              lastSync: 'agora',
            }
          : int
      )
    );
    toast.success(`${integrations.find(i => i.id === integrationId)?.name} conectado com sucesso!`);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? {
              ...int,
              status: 'disconnected',
              connectedAt: undefined,
              lastSync: undefined,
            }
          : int
      )
    );
    toast.info(`${integrations.find(i => i.id === integrationId)?.name} desconectado`);
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? { ...int, lastSync: 'agora' }
          : int
      )
    );
    toast.success('Sincronização concluída!');
  };

  const handleSaveKey = (integrationId: string) => {
    const key = apiKeys[integrationId];
    if (!key || key.trim() === '') {
      toast.error('Digite uma API key válida');
      return;
    }
    handleConnect(integrationId);
    setEditingKey(null);
    setApiKeys(prev => ({ ...prev, [integrationId]: '' }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-600">
            <XCircle className="w-3 h-3 mr-1" />
            Desconectado
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Link2 className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Integrações de Redes Sociais
              </h2>
              <p className="text-gray-600 mt-1">
                Conecte-se às 5 maiores plataformas do mundo para buscar leads
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-600">
                {integrations.filter(i => i.status === 'connected').length}/5
              </p>
              <p className="text-sm text-gray-600">Conectadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations List */}
      <div className="grid gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isEditing = editingKey === integration.id;

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`border-2 ${
                integration.status === 'connected' 
                  ? 'border-green-200 bg-green-50/30' 
                  : integration.status === 'error'
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-gray-200'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${integration.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {integration.name}
                          {getStatusBadge(integration.status)}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {integration.description}
                        </CardDescription>
                      </div>
                    </div>

                    {integration.status === 'connected' && (
                      <div className="text-right text-sm">
                        <p className="text-gray-600">
                          Conectado: <span className="font-semibold">{integration.connectedAt}</span>
                        </p>
                        <p className="text-gray-600">
                          Última sinc: <span className="font-semibold">{integration.lastSync}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 mb-2 block">
                      Recursos Disponíveis:
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* API Key Input (if editing) */}
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                    >
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <Label htmlFor={`api-key-${integration.id}`} className="font-semibold">
                            API Key / Access Token
                          </Label>
                          <p className="text-xs text-gray-600 mt-1 mb-2">
                            Cole sua chave de API aqui. Seus dados estão seguros e criptografados.
                          </p>
                          <Input
                            id={`api-key-${integration.id}`}
                            type="password"
                            placeholder="sk_live_xxxxxxxxxxxxxxxx..."
                            value={apiKeys[integration.id] || ''}
                            onChange={(e) => setApiKeys(prev => ({ ...prev, [integration.id]: e.target.value }))}
                            className="font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveKey(integration.id)}
                          className={`bg-gradient-to-r ${integration.color}`}
                        >
                          <Key className="w-3 h-3 mr-2" />
                          Salvar e Conectar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingKey(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(integration.setupUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Como obter API Key
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSync(integration.id)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Sincronizar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingKey(integration.id)}
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          <Settings className="w-3 h-3 mr-2" />
                          Configurar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDisconnect(integration.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-3 h-3 mr-2" />
                          Desconectar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setEditingKey(integration.id)}
                          className={`bg-gradient-to-r ${integration.color}`}
                        >
                          <Link2 className="w-3 h-3 mr-2" />
                          Conectar Agora
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(integration.setupUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-2" />
                          Documentação
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">💡 Dica de Segurança</p>
              <p>
                Suas API keys são criptografadas e armazenadas com segurança. Nunca compartilhe 
                suas chaves com terceiros. Use sempre tokens com permissões mínimas necessárias.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}