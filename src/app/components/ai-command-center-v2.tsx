import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot, Sparkles, Settings, Play, Pause, Volume2, Mic, Upload,
  Zap, MessageSquare, Mail, Phone, Linkedin, ChevronRight,
  GripVertical, Plus, X, Check, Eye, Clock, Target, TrendingUp,
  BarChart3, Activity, Users, ArrowRight, Edit, Copy, Save,
  Palette, Sliders, Wand2, Radio, Calendar, Brain, Heart,
  MousePointer, Move, ChevronDown, AlertCircle, CheckCircle2,
  Info, PlayCircle, StopCircle, RefreshCw, MapPin
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { useTheme } from '../lib/ThemeContext';
import { CRMIntegrationTab, MonitoringTab } from './ai-command-center-crm-monitor';

interface CadenceStep {
  id: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'linkedin';
  action: string;
  delay: number;
  delayUnit: 'horas' | 'dias';
  template: string;
  enabled: boolean;
}

interface PersonalityPreset {
  id: string;
  name: string;
  description: string;
  tone: string;
  style: string;
  example: string;
  audioUrl?: string;
  color: string;
}

const PERSONALITY_PRESETS: PersonalityPreset[] = [
  {
    id: 'profissional',
    name: 'Profissional & Consultivo',
    description: 'Tom formal, consultivo e focado em valor',
    tone: 'Formal, respeitoso, orientado a resultados',
    style: 'Usa dados, pergunta questões estratégicas, foca em ROI',
    example: 'Olá {{nome}}, notei que a {{empresa}} está a expandir para {{região}}. Com base na minha experiência com empresas similares no sector {{sector}}, identifico 3 oportunidades imediatas...',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'amigavel',
    name: 'Amigável & Próximo',
    description: 'Tom caloroso, empático e humano',
    tone: 'Casual-profissional, caloroso, genuíno',
    style: 'Conta histórias, usa emojis subtis, cria conexão pessoal',
    example: 'Olá {{nome}} 👋 Vi que partilhou recentemente sobre {{topic}} no LinkedIn - adorei a sua perspectiva! Trabalho com clientes em {{sector}} e tenho uma ideia que pode interessar...',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'direto',
    name: 'Direto & Objetivo',
    description: 'Vai direto ao ponto, sem rodeios',
    tone: 'Direto, conciso, orientado à ação',
    style: 'Mensagens curtas, CTA claro, sem floreados',
    example: '{{nome}}, 2 minutos: Ajudo empresas em {{sector}} a {{beneficio}}. Quer ver como? [Link para calendário]',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'premium',
    name: 'Premium & Exclusivo',
    description: 'Para segmento high-end e executivos',
    tone: 'Sofisticado, exclusivo, de alto valor',
    style: 'Linguagem premium, foco em exclusividade e resultados de elite',
    example: 'Caro(a) {{nome}}, a {{empresa}} está entre as 15 organizações que identificámos para o nosso programa exclusivo de {{serviço}}. Acesso limitado, resultados comprovados em Fortune 500...',
    color: 'from-purple-600 to-fuchsia-600',
  },
  {
    id: 'educativo',
    name: 'Educativo & Informativo',
    description: 'Foco em educar e trazer valor upfront',
    tone: 'Educativo, generoso, thought-leader',
    style: 'Partilha insights, oferece recursos, posiciona como especialista',
    example: '{{nome}}, preparei uma análise rápida sobre as 3 tendências que vejo a impactar {{sector}} em 2025. Relevante para {{empresa}}? [Anexo: Mini-relatório]',
    color: 'from-indigo-500 to-blue-600',
  },
];

const CADENCE_TEMPLATES = [
  {
    id: 'investidores',
    name: 'Cadência para Investidores Imobiliários',
    description: 'Foco em ROI, rendimento e oportunidades de investimento',
    steps: [
      {
        id: '1',
        channel: 'linkedin' as const,
        action: 'Ligação + Nota Personalizada',
        delay: 0,
        delayUnit: 'horas' as const,
        template: 'Olá {{nome}}, vi o seu portfólio em {{localização}} e identifiquei oportunidades de alto ROI similares às que ajudei investidores a alcançar +18% de rendimento. Vale a pena conversar?',
        enabled: true,
      },
      {
        id: '2',
        channel: 'email' as const,
        action: 'Email de Valor',
        delay: 2,
        delayUnit: 'dias' as const,
        template: 'Assunto: 3 oportunidades off-market em {{cidade}}\n\nOlá {{nome}},\n\nIdentifiquei 3 propriedades off-market em {{localização}} que encaixam no perfil de investimento que vi no seu LinkedIn.\n\nCaracterísticas:\n• ROI estimado: 15-22%\n• Zonas em valorização\n• Disponíveis para visita esta semana\n\nInteressa agendar 15min para apresentar?',
        enabled: true,
      },
      {
        id: '3',
        channel: 'whatsapp' as const,
        action: 'Seguimento Rápido',
        delay: 3,
        delayUnit: 'dias' as const,
        template: 'Olá {{nome}} 👋 Enviei-lhe um email sobre oportunidades de investimento em {{cidade}}. Tem 5min esta semana para uma chamada rápida?',
        enabled: true,
      },
    ],
  },
  {
    id: 'primeira-habitacao',
    name: 'Cadência para 1ª Habitação',
    description: 'Tom empático, educativo e suportivo',
    steps: [
      {
        id: '1',
        channel: 'linkedin' as const,
        action: 'Ligação + Nota',
        delay: 0,
        delayUnit: 'horas' as const,
        template: 'Olá {{nome}}! Vi que está na fase de procura da primeira casa - é um momento especial! Ajudo jovens famílias a encontrar a casa perfeita em {{região}}. Vamos conversar?',
        enabled: true,
      },
      {
        id: '2',
        channel: 'email' as const,
        action: 'Guia Completo',
        delay: 1,
        delayUnit: 'dias' as const,
        template: 'Assunto: 🏡 Guia Completo: Como comprar a sua 1ª casa em {{cidade}}\n\nOlá {{nome}},\n\nPreparei um guia completo para quem está a comprar a primeira casa:\n\n✓ Checklist de documentos\n✓ Simulador de crédito habitação\n✓ Top 10 zonas em {{cidade}} para famílias\n✓ Processo passo-a-passo\n\n[Download Gratuito]\n\nTem questões? Estou aqui para ajudar!',
        enabled: true,
      },
      {
        id: '3',
        channel: 'sms' as const,
        action: 'Lembrete Amigável',
        delay: 4,
        delayUnit: 'dias' as const,
        template: 'Olá {{nome}}! Fez o download do guia da 1ª casa? Estou disponível esta semana para tirar dúvidas. Responda SIM para agendar!',
        enabled: true,
      },
    ],
  },
  {
    id: 'executivos',
    name: 'Cadência para Executivos High-End',
    description: 'Premium, exclusivo e de alto valor',
    steps: [
      {
        id: '1',
        channel: 'linkedin' as const,
        action: 'Ligação Premium',
        delay: 0,
        delayUnit: 'horas' as const,
        template: 'Caro(a) {{nome}}, a sua posição como {{cargo}} na {{empresa}} e o seu perfil encaixam perfeitamente no nosso programa exclusivo de propriedades premium em {{localização}}. Acesso off-market a oportunidades únicas.',
        enabled: true,
      },
      {
        id: '2',
        channel: 'email' as const,
        action: 'Proposta Exclusiva',
        delay: 3,
        delayUnit: 'dias' as const,
        template: 'Assunto: Acesso Exclusivo: Propriedade Premium em {{localização}}\n\nCaro(a) {{nome}},\n\nTenho acesso exclusivo a uma propriedade que raramente chega ao mercado:\n\n🏛️ {{tipo_propriedade}} em {{bairro_premium}}\n📐 {{metragem}}m² | {{quartos}} suítes\n🌟 Características únicas: {{features}}\n💰 Investimento: {{faixa_preco}}\n\nDisponibilidade limitada para apresentação privada.\n\nInteressa agendar?',
        enabled: true,
      },
      {
        id: '3',
        channel: 'whatsapp' as const,
        action: 'Tour Virtual',
        delay: 5,
        delayUnit: 'dias' as const,
        template: 'Olá {{nome}}, preparei um tour virtual 360° da propriedade em {{localização}}. Posso enviar? Leva 3min para ver.',
        enabled: true,
      },
    ],
  },
];

const CRM_INTEGRATIONS = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    logo: '🔶',
    description: 'CRM completo com automação de marketing',
    status: 'available',
    features: ['Sincronização bidirecional', 'Automação de tarefas', 'Campos personalizados'],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '☁️',
    description: 'Líder mundial em CRM empresarial',
    status: 'available',
    features: ['API Enterprise', 'Workflows automáticos', 'Relatórios avançados'],
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    logo: '🎯',
    description: 'CRM focado em pipeline de vendas',
    status: 'available',
    features: ['Gestão de pipeline', 'Automações', 'Integrações nativas'],
  },
  {
    id: 'zoho',
    name: 'Zoho CRM',
    logo: '🔷',
    description: 'Solução completa e acessível',
    status: 'available',
    features: ['Multicanal', 'IA integrada', 'Personalização total'],
  },
];

export function AICommandCenterV2() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('setup');
  const [selectedPersonality, setSelectedPersonality] = useState<string>('profissional');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('investidores');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [kickoffText, setKickoffText] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<'paused' | 'active' | 'learning'>('paused');
  const [selectedCrm, setSelectedCrm] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordingInterval = useRef<number | null>(null);

  // Configurações do setup
  const [setupConfig, setSetupConfig] = useState({
    nomeEmpresa: '',
    tipoNegocio: '',
    regiaoAtuacao: '',
    publicoAlvo: '',
    objetivoPrincipal: '',
    volumeContatosDia: 50,
    horariosOperacao: { inicio: '09:00', fim: '18:00' },
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingInterval.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    toast.success('🎤 Gravação iniciada', {
      description: 'Fale sobre os objetivos e contexto do seu negócio'
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    toast.success('✅ Gravação concluída', {
      description: `${recordingTime}s gravados com sucesso`
    });
  };

  const handlePlayAudio = (personalityId: string) => {
    if (playingAudio === personalityId) {
      setPlayingAudio(null);
      toast.info('⏸️ Áudio pausado');
    } else {
      setPlayingAudio(personalityId);
      toast.success('▶️ Reproduzindo exemplo de personalidade');
      // Simula duração do áudio
      setTimeout(() => setPlayingAudio(null), 5000);
    }
  };

  const handleSaveCadence = () => {
    toast.success('✅ Cadência salva com sucesso!', {
      description: 'A IA já pode começar a trabalhar'
    });
  };

  const handleToggleAi = () => {
    if (aiStatus === 'paused') {
      setAiStatus('active');
      toast.success('🚀 IA ativada e a trabalhar!', {
        description: 'A cadência está a ser executada automaticamente'
      });
    } else {
      setAiStatus('paused');
      toast.info('⏸️ IA pausada', {
        description: 'As ações automáticas foram interrompidas'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTemplate = CADENCE_TEMPLATES.find(t => t.id === selectedTemplate);
  const currentPersonality = PERSONALITY_PRESETS.find(p => p.id === selectedPersonality);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header Minimalista - Fixo */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-light text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            AI Core <span className="font-bold text-indigo-500">Center</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1 ml-14 hidden md:block">
            Configure and monitor your neural autonomous assistant.
          </p>
        </div>

        {/* Status da IA */}
        <Card className="px-4 py-2 border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                aiStatus === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                aiStatus === 'learning' ? 'bg-yellow-500' :
                'bg-zinc-600'
              }`} />
              <span className="text-sm font-medium text-white hidden sm:inline">
                {aiStatus === 'active' ? 'Active' :
                 aiStatus === 'learning' ? 'Training' :
                 'Paused'}
              </span>
            </div>
            <Button
              onClick={handleToggleAi}
              size="sm"
              className={`h-8 px-3 text-xs ${aiStatus === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20'}`}
            >
              {aiStatus === 'active' ? (
                <><Pause className="w-3 h-3 mr-2" /> Pause</>
              ) : (
                <><Play className="w-3 h-3 mr-2" /> Activate</>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Tabs Principais - Ocupando o resto da altura */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 mb-4">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-white/5 border border-white/5 backdrop-blur rounded-xl">
            <TabsTrigger value="setup" className="gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 transition-all">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Setup</span>
            </TabsTrigger>
            <TabsTrigger value="personality" className="gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 transition-all">
              <Palette className="w-4 h-4" />
              <span className="hidden md:inline">Personality</span>
            </TabsTrigger>
            <TabsTrigger value="cadences" className="gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 transition-all">
              <Zap className="w-4 h-4" />
              <span className="hidden md:inline">Cadences</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 transition-all">
              <Radio className="w-4 h-4" />
              <span className="hidden md:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="monitor" className="gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-zinc-400 transition-all">
              <Activity className="w-4 h-4" />
              <span className="hidden md:inline">Monitoring</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Área de Conteúdo com Scroll Próprio */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {/* TAB 1: CONFIGURAÇÃO INICIAL */}
          <TabsContent value="setup" className="mt-0 h-full">
            <Card className="p-6 border border-white/10 bg-zinc-900/40 backdrop-blur-sm min-h-full">
              <div className="h-full flex flex-col">
                {/* Header do Setup */}
                <div className="flex items-start gap-4 pb-4 border-b border-white/5 shrink-0">
                  <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-light text-white">Initialize System 🚀</h2>
                    <p className="text-sm text-zinc-400">
                      Provide business context for the neural engine to calibrate its approach.
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      toast.success('✅ Configuration saved successfully!');
                      setActiveTab('personality');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save & Next
                  </Button>
                </div>

                {/* Conteúdo Principal - Grid Layout Otimizado */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
                    
                    {/* Coluna Esquerda: Dados Estruturados (7 cols) */}
                    <div className="xl:col-span-7 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                            <Target className="w-3 h-3" /> Company Name
                          </Label>
                          <Input
                            value={setupConfig.nomeEmpresa}
                            onChange={(e) => setSetupConfig({ ...setupConfig, nomeEmpresa: e.target.value })}
                            placeholder="Ex: Lisbon Premium Estates"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                            <Users className="w-3 h-3" /> Business Type
                          </Label>
                          <Input
                            value={setupConfig.tipoNegocio}
                            onChange={(e) => setSetupConfig({ ...setupConfig, tipoNegocio: e.target.value })}
                            placeholder="Ex: Real Estate, Consultancy"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" /> Target Region
                          </Label>
                          <Input
                            value={setupConfig.regiaoAtuacao}
                            onChange={(e) => setSetupConfig({ ...setupConfig, regiaoAtuacao: e.target.value })}
                            placeholder="Ex: Lisbon, Porto, Algarve"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> Target Audience
                          </Label>
                          <Input
                            value={setupConfig.publicoAlvo}
                            onChange={(e) => setSetupConfig({ ...setupConfig, publicoAlvo: e.target.value })}
                            placeholder="Ex: Investors, Families"
                            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                         <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                            <BarChart3 className="w-3 h-3" /> Daily Volume
                          </Label>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              value={setupConfig.volumeContatosDia}
                              onChange={(e) => setSetupConfig({ ...setupConfig, volumeContatosDia: parseInt(e.target.value) })}
                              className="bg-white/5 border-white/10 text-white focus:border-indigo-500/50"
                              min={10}
                              max={200}
                            />
                            <Badge variant="outline" className="whitespace-nowrap border-white/10 text-zinc-400 h-10 px-3 flex items-center">
                              leads/day
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Operating Hours
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={setupConfig.horariosOperacao.inicio}
                              onChange={(e) => setSetupConfig({ 
                                ...setupConfig, 
                                horariosOperacao: { ...setupConfig.horariosOperacao, inicio: e.target.value }
                              })}
                              className="bg-white/5 border-white/10 text-white focus:border-indigo-500/50 text-center"
                            />
                            <span className="text-zinc-500 text-xs">to</span>
                            <Input
                              type="time"
                              value={setupConfig.horariosOperacao.fim}
                              onChange={(e) => setSetupConfig({ 
                                ...setupConfig, 
                                horariosOperacao: { ...setupConfig.horariosOperacao, fim: e.target.value }
                              })}
                              className="bg-white/5 border-white/10 text-white focus:border-indigo-500/50 text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                          <Heart className="w-3 h-3" /> Primary Objective
                        </Label>
                        <Textarea
                          value={setupConfig.objetivoPrincipal}
                          onChange={(e) => setSetupConfig({ ...setupConfig, objetivoPrincipal: e.target.value })}
                          placeholder="Ex: Generate qualified leads from investors interested in high-yield properties in Lisbon..."
                          className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 resize-none"
                        />
                      </div>
                    </div>

                    {/* Coluna Direita: Contexto & Voice (5 cols) */}
                    <div className="xl:col-span-5 flex flex-col gap-5 border-t xl:border-t-0 xl:border-l border-white/5 pt-6 xl:pt-0 xl:pl-6">
                      
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                               <Mic className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-white">Voice Kickoff</span>
                         </div>
                         
                         <Card className="p-4 bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">
                                  {isRecording ? 'Recording audio context...' : 'Record context via audio'}
                                </span>
                                {isRecording && (
                                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/20 animate-pulse">
                                    {formatTime(recordingTime)}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                                  className={`flex-1 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                  {isRecording ? (
                                    <><StopCircle className="w-4 h-4 mr-2" /> Stop Recording</>
                                  ) : (
                                    <><Mic className="w-4 h-4 mr-2" /> Start Recording</>
                                  )}
                                </Button>
                              </div>
                              
                              {!isRecording && recordingTime > 0 && (
                                <div className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5">
                                  <PlayCircle className="w-4 h-4 text-indigo-400" />
                                  <div className="flex-1">
                                    <p className="text-xs font-medium text-white">Kickoff_Audio_01.mp3</p>
                                    <p className="text-[10px] text-zinc-500">{formatTime(recordingTime)} • Ready for processing</p>
                                  </div>
                                </div>
                              )}
                            </div>
                         </Card>
                      </div>

                      <div className="space-y-1.5 flex-1 flex flex-col">
                        <Label className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 flex items-center gap-1.5">
                           Extra Context (Optional)
                        </Label>
                        <Textarea
                          value={kickoffText}
                          onChange={(e) => setKickoffText(e.target.value)}
                          placeholder="Paste any additional context, instructions, or paste a link to your website..."
                          className="flex-1 min-h-[180px] bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 resize-none font-mono text-xs"
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: PERSONALIDADE DA IA */}
          <TabsContent value="personality" className="mt-0 h-full">
            <Card className="p-6 md:p-8 border border-white/10 bg-zinc-900/40 backdrop-blur-sm min-h-full">
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-start gap-4 pb-6 border-b border-white/5">
                  <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Palette className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-light text-white mb-1">Select AI Persona 🎭</h2>
                    <p className="text-sm text-zinc-400">
                      Choose how the AI communicates with your leads.
                    </p>
                  </div>
                </div>

                {/* Grid de Personalidades - Responsivo para telas grandes */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {PERSONALITY_PRESETS.map((personality) => (
                    <Card
                      key={personality.id}
                      className={`p-5 cursor-pointer transition-all border group relative overflow-hidden ${
                        selectedPersonality === personality.id
                          ? 'border-indigo-500 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedPersonality(personality.id)}
                    >
                      <div className="space-y-4 relative z-10">
                        {/* Header da Personalidade */}
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${personality.color} rounded-lg flex items-center justify-center flex-shrink-0 opacity-90 shadow-lg`}>
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base text-white mb-0.5">{personality.name}</h3>
                            <p className="text-xs text-zinc-400 line-clamp-2">{personality.description}</p>
                          </div>
                          {selectedPersonality === personality.id && (
                            <div className="absolute top-0 right-0">
                               <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                            </div>
                          )}
                        </div>

                        {/* Características */}
                        <div className="space-y-2 text-xs border-t border-white/5 pt-3">
                          <div>
                            <span className="font-medium text-zinc-300 block mb-0.5">Tone:</span>
                            <p className="text-zinc-500">{personality.tone}</p>
                          </div>
                          <div>
                            <span className="font-medium text-zinc-300 block mb-0.5">Style:</span>
                            <p className="text-zinc-500">{personality.style}</p>
                          </div>
                        </div>

                        {/* Exemplo de Texto */}
                        <div className="p-3 bg-black/40 rounded border border-white/5">
                          <div className="flex items-start gap-2 mb-1.5">
                            <Eye className="w-3 h-3 text-zinc-500 flex-shrink-0 mt-0.5" />
                            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">Message Preview</span>
                          </div>
                          <p className="text-xs text-zinc-300 italic leading-relaxed line-clamp-4">
                            "{personality.example}"
                          </p>
                        </div>

                        {/* Botão de Áudio */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayAudio(personality.id);
                          }}
                          variant={playingAudio === personality.id ? "default" : "outline"}
                          className={`w-full gap-2 h-9 text-xs ${playingAudio === personality.id ? 'bg-indigo-600 hover:bg-indigo-500' : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'}`}
                          size="sm"
                        >
                          {playingAudio === personality.id ? (
                            <>
                              <Volume2 className="w-3 h-3 animate-pulse" />
                              Playing...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3 h-3" />
                              Play Sample
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Personalização Avançada */}
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Wand2 className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-medium text-white">Fine Tuning (Optional)</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
                    <div className="space-y-3">
                      <Label className="text-xs text-zinc-400 uppercase tracking-wide">Formality Level</Label>
                      <Input type="range" min="0" max="100" defaultValue="70" className="w-full accent-indigo-500 cursor-pointer" />
                      <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                        <span>CASUAL</span>
                        <span>FORMAL</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-xs text-zinc-400 uppercase tracking-wide">Emoji Usage</Label>
                      <Input type="range" min="0" max="100" defaultValue="30" className="w-full accent-indigo-500 cursor-pointer" />
                      <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                        <span>NEVER</span>
                        <span>ALWAYS</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-xs text-zinc-400 uppercase tracking-wide">Message Length</Label>
                      <Input type="range" min="0" max="100" defaultValue="50" className="w-full accent-indigo-500 cursor-pointer" />
                      <div className="flex justify-between text-[10px] text-zinc-600 font-mono">
                        <span>SHORT</span>
                        <span>LONG</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de Continuar */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <Button 
                    onClick={() => {
                      toast.success(`✅ Persona "${currentPersonality?.name}" selected!`);
                      setActiveTab('cadences');
                    }}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save & Create Cadences
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 3: CADÊNCIAS */}
          <TabsContent value="cadences" className="mt-0 h-full">
            <Card className="p-6 md:p-8 border border-white/10 bg-zinc-900/40 backdrop-blur-sm min-h-full">
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-start gap-4 pb-6 border-b border-white/5">
                  <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-7 h-7 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-light text-white mb-1">Automated Cadences ⚡</h2>
                    <p className="text-sm text-zinc-400">
                      Select a template or build custom outreach flows.
                    </p>
                  </div>
                </div>

                {/* Seleção de Template */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-orange-400" />
                    Cadence Templates
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {CADENCE_TEMPLATES.map((template) => (
                      <Card
                        key={template.id}
                        className={`p-5 cursor-pointer transition-all border ${
                          selectedTemplate === template.id
                            ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-white">{template.name}</h4>
                            {selectedTemplate === template.id && (
                              <CheckCircle2 className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 line-clamp-2">{template.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[10px] border-white/10 text-zinc-500">
                              {template.steps.length} steps
                            </Badge>
                            {template.steps.map((step) => (
                              <div key={step.id}>
                                {step.channel === 'linkedin' && <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] p-1"><Linkedin className="w-3 h-3" /></Badge>}
                                {step.channel === 'email' && <Badge className="bg-green-600/20 text-green-400 border border-green-500/30 text-[10px] p-1"><Mail className="w-3 h-3" /></Badge>}
                                {step.channel === 'sms' && <Badge className="bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[10px] p-1"><Phone className="w-3 h-3" /></Badge>}
                                {step.channel === 'whatsapp' && <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[10px] p-1"><MessageSquare className="w-3 h-3" /></Badge>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Editor de Cadência com Drag & Drop Visual */}
                {currentTemplate && (
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium flex items-center gap-2 text-white">
                        <Move className="w-5 h-5 text-orange-400" />
                        Cadence Editor: <span className="text-orange-400 ml-1">{currentTemplate.name}</span>
                      </h3>
                      <Button variant="outline" size="sm" className="gap-2 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
                        <Plus className="w-4 h-4" />
                        Add Step
                      </Button>
                    </div>

                    <div className="space-y-3 max-w-4xl">
                        {currentTemplate.steps.map((step, index) => (
                          <Card
                            key={step.id}
                            className="p-4 bg-zinc-900/50 border border-white/10 hover:border-white/20 transition-all cursor-move shadow-md group relative overflow-hidden"
                            draggable
                            onDragStart={() => setDraggedStep(step.id)}
                            onDragEnd={() => setDraggedStep(null)}
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/5 to-white/20 group-hover:from-orange-500 group-hover:to-red-500 transition-all" />
                            
                            <div className="pl-3 space-y-3">
                              {/* Header do Passo */}
                              <div className="flex items-center gap-3">
                                <GripVertical className="w-5 h-5 text-zinc-600 cursor-move" />
                                <span className="font-mono text-xs text-zinc-500">STEP {index + 1}</span>
                                
                                {step.channel === 'linkedin' && (
                                  <Badge className="bg-blue-500/10 text-blue-400 gap-1 border border-blue-500/20 text-xs">
                                    <Linkedin className="w-3 h-3" /> LinkedIn
                                  </Badge>
                                )}
                                {step.channel === 'email' && (
                                  <Badge className="bg-green-500/10 text-green-400 gap-1 border border-green-500/20 text-xs">
                                    <Mail className="w-3 h-3" /> Email
                                  </Badge>
                                )}
                                {step.channel === 'sms' && (
                                  <Badge className="bg-purple-500/10 text-purple-400 gap-1 border border-purple-500/20 text-xs">
                                    <Phone className="w-3 h-3" /> SMS
                                  </Badge>
                                )}
                                {step.channel === 'whatsapp' && (
                                  <Badge className="bg-emerald-500/10 text-emerald-400 gap-1 border border-emerald-500/20 text-xs">
                                    <MessageSquare className="w-3 h-3" /> WhatsApp
                                  </Badge>
                                )}

                                <Badge variant="outline" className="border-white/10 text-zinc-400 text-xs font-mono">
                                  {step.delay === 0 ? '⚡ IMMEDIATE' : `🕒 +${step.delay} ${step.delayUnit.toUpperCase()}`}
                                </Badge>

                                <div className="flex-1" />

                                <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white">
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Conteúdo */}
                              <div className="grid md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                  <Label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">Action</Label>
                                  <p className="font-medium text-white text-sm">{step.action}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <Label className="text-[10px] text-zinc-500 uppercase tracking-wide block mb-1">Template Preview</Label>
                                  <div className="p-2 bg-black/40 rounded border border-white/5 text-xs text-zinc-300 line-clamp-2 font-mono">
                                    {step.template}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {/* Indicador de Arrastar */}
                        {draggedStep && (
                          <div className="p-4 border border-dashed border-orange-500/50 rounded-lg bg-orange-500/10 text-center text-sm text-orange-400 animate-pulse">
                            ↕️ Drop here to reorder
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Botão de Salvar */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <Button 
                    onClick={() => {
                      handleSaveCadence();
                      setActiveTab('crm');
                    }}
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save & Integrate CRM
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: INTEGRAÇÃO CRM */}
          <CRMIntegrationTab
            selectedCrm={selectedCrm}
            setSelectedCrm={setSelectedCrm}
            setActiveTab={setActiveTab}
            crmIntegrations={CRM_INTEGRATIONS}
          />

          {/* TAB 5: MONITORIZAÇÃO */}
          <MonitoringTab
            aiStatus={aiStatus}
            handleToggleAi={handleToggleAi}
            currentTemplate={currentTemplate}
          />
        </div>
      </Tabs>
    </div>
  );
}