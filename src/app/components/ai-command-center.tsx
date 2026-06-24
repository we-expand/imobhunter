import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Brain, Upload, Linkedin, Mail, MessageCircle, Plus, Trash2, Save, Activity, Search, Sparkles, Waves, Settings as SettingsIcon } from 'lucide-react';
import { Cadence } from '../types';
import { LiveAIActivity } from './live-ai-activity';
import { RealtimeStats } from './realtime-stats';
import { AIVoiceEditor } from './ai-voice-editor';
import { AIVoicePlayer } from './ai-voice-player';
import { HubSpotAITagging } from './hubspot-ai-tagging';
import { autoSearchService } from '../lib/auto-search';
import { toast } from 'sonner';

export function AICommandCenter() {
  const [cadences, setCadences] = useState<Cadence[]>([
    { step: 1, channel: 'linkedin', waitDays: 0, messageTemplate: 'LinkedIn Connect + Nota personalizada' },
    { step: 2, channel: 'email', waitDays: 2, messageTemplate: 'Email de Valor com Guia do Bairro' },
    { step: 3, channel: 'whatsapp', waitDays: 3, messageTemplate: 'WhatsApp com Case Study relevante' }
  ]);

  const [selectedPersonality, setSelectedPersonality] = useState('consultivo');
  const [isSearching, setIsSearching] = useState(false);

  const personalities = {
    consultivo: {
      name: 'Consultivo e Profissional',
      description: 'Para Investidores e Executivos',
      example: '"Olá [Nome], notei o seu interesse em investimentos com yield. Preparei uma análise..."'
    },
    empatico: {
      name: 'Empático e Próximo',
      description: 'Para 1ª Habitação e Famílias',
      example: '"Olá [Nome], sei que procurar a primeira casa pode ser stressante. Estou aqui para..."'
    },
    direto: {
      name: 'Direto e Eficiente',
      description: 'Para Relocation e Parcerias',
      example: '"[Nome], tenho 3 propriedades alinhadas com o perfil da vossa equipa. Quando podemos..."'
    }
  };

  const getChannelIcon = (channel: 'linkedin' | 'email' | 'whatsapp') => {
    switch (channel) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const handleQuickSearch = async (cluster?: string) => {
    setIsSearching(true);
    // Removido: toast.info de busca iniciada (não é crítico)

    try {
      const results = await autoSearchService.aiAutoSearch(cluster);
      toast.success(`✅ ${results.length} novos leads adicionados ao pipeline!`);
    } catch (error) {
      toast.error('❌ Erro ao buscar leads. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl">Centro de Comando da IA</h2>
            <p className="text-sm text-gray-600">Configure personalidade e cadências inteligentes</p>
          </div>
        </div>

        <Tabs defaultValue="personality" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="personality">Personalidade</TabsTrigger>
            <TabsTrigger value="cadences">Cadências</TabsTrigger>
            <TabsTrigger value="content">Biblioteca</TabsTrigger>
          </TabsList>

          <TabsContent value="personality" className="space-y-6">
            <div>
              <Label className="mb-3 block">Tom de Voz da IA</Label>
              <div className="space-y-3">
                {Object.entries(personalities).map(([key, personality]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedPersonality(key)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPersonality === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{personality.name}</h4>
                        <p className="text-sm text-gray-600">{personality.description}</p>
                      </div>
                      {selectedPersonality === key && (
                        <Badge variant="default">Ativo</Badge>
                      )}
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm italic">
                      {personality.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Configurações Avançadas</Label>
              <div className="space-y-4">
                <div>
                  <Label>Idioma Principal</Label>
                  <Select defaultValue="pt">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="auto">Auto-detectar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Icebreaker Personalizado</Label>
                  <Select defaultValue="posts">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="posts">Últimos 3 posts do LinkedIn</SelectItem>
                      <SelectItem value="company">Notícias da empresa</SelectItem>
                      <SelectItem value="mutual">Conexões mútuas</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    AI lerá esta informação antes do primeiro contacto
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cadences" className="space-y-6">
            <div>
              <Label className="mb-3 block">Fluxo Multi-Canal</Label>
              <p className="text-sm text-gray-600 mb-4">
                Configure a sequência de contacto automática
              </p>

              <div className="space-y-3 mb-4">
                {cadences.map((cadence, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                    <Badge variant="outline">Passo {cadence.step}</Badge>
                    <div className="p-2 bg-blue-50 rounded text-blue-600">
                      {getChannelIcon(cadence.channel)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{cadence.messageTemplate}</p>
                      {cadence.waitDays > 0 && (
                        <p className="text-xs text-gray-500">
                          Aguarda {cadence.waitDays} {cadence.waitDays === 1 ? 'dia' : 'dias'} após passo anterior
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Passo
              </Button>
            </div>

            <div>
              <Label className="mb-3 block">Regras de Pausa Automática</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Parar se lead responder</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Parar se score {'>'} 80</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Não contactar fora de horas úteis</span>
                  <Badge variant="secondary">Pausado</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div>
              <Label className="mb-3 block">Biblioteca de Conteúdo</Label>
              <p className="text-sm text-gray-600 mb-4">
                Upload de materiais que a IA pode enviar autonomamente
              </p>

              <div className="space-y-3 mb-4">
                {[
                  { name: 'Guia Cascais 2025.pdf', type: 'PDF', cluster: 'Investidores' },
                  { name: 'Estudo Mercado Sintra.pdf', type: 'PDF', cluster: 'High-End' },
                  { name: 'Relocation Checklist.pdf', type: 'PDF', cluster: 'Relocation' },
                  { name: 'Escolas Rankings Lisboa.pdf', type: 'PDF', cluster: 'Famílias' }
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{file.type}</Badge>
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">Para: {file.cluster}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Novo Arquivo
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6 pt-6 border-t">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Guardar Configurações
          </Button>
        </div>
      </Card>

      {/* Busca Rápida de Leads */}
      <Card className="p-6 border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg flex items-center gap-2">
              Busca Rápida de Leads
              <Badge className="bg-green-100 text-green-700 border-green-300">
                <Sparkles className="w-3 h-3 mr-1" />
                Máx. 5 leads
              </Badge>
            </h3>
            <p className="text-sm text-gray-600">
              Deixe a IA encontrar leads qualificados automaticamente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[
            { name: 'Investidores', emoji: '💼' },
            { name: 'High-End/Executivos', emoji: '👔' },
            { name: 'Parcerias/Relocation', emoji: '🤝' },
            { name: '1ª Habitação', emoji: '🏠' },
            { name: 'Famílias/Upgrade', emoji: '👨‍👩‍👧‍👦' },
            { name: 'Aleatório', emoji: '🎲' }
          ].map((cluster) => (
            <Button
              key={cluster.name}
              variant="outline"
              size="sm"
              disabled={isSearching}
              onClick={() => handleQuickSearch(cluster.name === 'Aleatório' ? undefined : cluster.name)}
              className="justify-start gap-2 hover:bg-white hover:border-blue-400"
            >
              <span>{cluster.emoji}</span>
              <span className="text-xs">{cluster.name}</span>
            </Button>
          ))}
        </div>

        <Button
          onClick={() => handleQuickSearch()}
          disabled={isSearching}
          className="w-full gap-2"
          size="lg"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              A buscar...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Buscar 5 Leads Agora
            </>
          )}
        </Button>

        <p className="text-xs text-gray-600 mt-3 text-center">
          💡 A IA vai buscar automaticamente 5 leads de alta qualidade
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl">Atividade da IA</h2>
            <p className="text-sm text-gray-600">Monitorize a atividade da IA em tempo real</p>
          </div>
        </div>

        <Tabs defaultValue="live-activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="live-activity">Atividade em Tempo Real</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="live-activity" className="space-y-6">
            <LiveAIActivity />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <RealtimeStats />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Exemplo de Voz da IA */}
      <AIVoicePlayer
        title="🎙️ Exemplo de Voz da IA"
        description="Ouça como a IA soa em uma chamada real de prospecção"
        voiceType="Profissional Feminina"
      />

      {/* Identificação de Leads da IA no HubSpot */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl">Identificação de Leads da IA no HubSpot</h2>
            <p className="text-sm text-gray-600">
              Configure propriedades customizadas para rastrear leads gerados pela IA
            </p>
          </div>
        </div>

        <HubSpotAITagging />
      </Card>
    </div>
  );
}