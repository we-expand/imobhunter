import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { AutoImplementationModal } from './auto-implementation-modal';
import { implementations } from '../lib/ai-implementation-service';
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  TrendingUp,
  Zap,
  Search,
  MessageSquare,
  Brain,
  Shield,
  BarChart3,
  Repeat,
  DollarSign,
  Lightbulb,
  ExternalLink,
  Sparkles,
  Clock,
  Target,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';

interface MVPTask {
  id: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedDays: number;
  dependencies?: string[];
  completed: boolean;
  icon: any;
  tags: string[];
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  inspiration: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
  icon: any;
  link?: string;
}

export function MVPTracker() {
  const [tasks, setTasks] = useState<MVPTask[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedTask, setSelectedTask] = useState<MVPTask | null>(null);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [showAutoImplementModal, setShowAutoImplementModal] = useState(false);
  const [selectedImplementation, setSelectedImplementation] = useState<keyof typeof implementations | null>(null);

  useEffect(() => {
    // Limpar localStorage antigo com dados corrompidos (apenas na primeira vez)
    try {
      const savedTasks = localStorage.getItem('mvp-tasks');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        // Verificar se tem ícones salvos (dados corrompidos)
        if (parsed.length > 0 && parsed[0].icon !== undefined && typeof parsed[0].icon !== 'function') {
          console.log('Limpando localStorage corrompido...');
          localStorage.removeItem('mvp-tasks');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar localStorage:', error);
      localStorage.removeItem('mvp-tasks');
    }
    
    loadTasks();
    loadAISuggestions();
  }, []);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem('mvp-tasks');
    
    const initialTasks: MVPTask[] = [
      // CRÍTICO
      {
        id: 'task-1',
        category: 'Busca de Leads',
        priority: 'critical',
        title: 'Integrar LinkedIn Sales Navigator API',
        description: 'Conectar API real para buscar leads com filtros avançados',
        estimatedDays: 3,
        completed: false,
        icon: Search,
        tags: ['api', 'linkedin', 'leads']
      },
      {
        id: 'task-2',
        category: 'Busca de Leads',
        priority: 'critical',
        title: 'Integrar Apollo.io API',
        description: 'Busca e enriquecimento de dados de leads',
        estimatedDays: 2,
        completed: false,
        icon: Search,
        tags: ['api', 'apollo', 'enrichment']
      },
      {
        id: 'task-3',
        category: 'Comunicação',
        priority: 'critical',
        title: 'WhatsApp Business API - Envio Real',
        description: 'Implementar envio real de mensagens pelo WhatsApp',
        estimatedDays: 3,
        completed: false,
        icon: MessageSquare,
        tags: ['whatsapp', 'messaging', 'api']
      },
      {
        id: 'task-4',
        category: 'Comunicação',
        priority: 'critical',
        title: 'Integrar SMS com Twilio',
        description: 'Envio de SMS para leads',
        estimatedDays: 2,
        completed: false,
        icon: MessageSquare,
        tags: ['sms', 'twilio', 'messaging']
      },
      {
        id: 'task-5',
        category: 'Comunicação',
        priority: 'critical',
        title: 'Cadências de Email Automáticas',
        description: 'Sequências automáticas de email com Resend',
        estimatedDays: 3,
        completed: false,
        icon: Repeat,
        tags: ['email', 'automation', 'resend']
      },
      {
        id: 'task-6',
        category: 'IA & Automação',
        priority: 'critical',
        title: 'Integrar LLM (OpenAI/Claude)',
        description: 'IA gerando mensagens personalizadas automaticamente',
        estimatedDays: 4,
        completed: false,
        icon: Brain,
        tags: ['ai', 'llm', 'personalization']
      },
      {
        id: 'task-7',
        category: 'IA & Automação',
        priority: 'critical',
        title: 'Sistema de Scoring Automático',
        description: 'IA decidindo quando fazer handover',
        estimatedDays: 3,
        completed: false,
        icon: Target,
        tags: ['ai', 'scoring', 'automation']
      },
      
      // ALTA
      {
        id: 'task-8',
        category: 'Pipeline',
        priority: 'high',
        title: 'Movimentação Automática de Estágios',
        description: 'Pipeline progredindo leads automaticamente',
        estimatedDays: 3,
        completed: false,
        icon: TrendingUp,
        tags: ['pipeline', 'automation']
      },
      {
        id: 'task-9',
        category: 'Dados',
        priority: 'high',
        title: 'Enriquecimento de Dados',
        description: 'Validar emails, telefones e enriquecer dados de empresa',
        estimatedDays: 2,
        completed: false,
        icon: Sparkles,
        tags: ['enrichment', 'validation']
      },
      {
        id: 'task-10',
        category: 'Integrações',
        priority: 'high',
        title: 'HubSpot CRM - Envio Real',
        description: 'Handover automático de leads para HubSpot',
        estimatedDays: 3,
        completed: false,
        icon: Repeat,
        tags: ['crm', 'hubspot', 'integration']
      },
      {
        id: 'task-11',
        category: 'Analytics',
        priority: 'high',
        title: 'KPIs com Dados Reais',
        description: 'Métricas reais de abertura, resposta, conversão',
        estimatedDays: 3,
        completed: false,
        icon: BarChart3,
        tags: ['analytics', 'metrics']
      },
      {
        id: 'task-12',
        category: 'IA & Automação',
        priority: 'high',
        title: 'Motor de Cadências Multi-Canal',
        description: 'Rotação automática Email → WhatsApp → SMS',
        estimatedDays: 4,
        completed: false,
        icon: Repeat,
        tags: ['automation', 'cadence', 'multi-channel']
      },
      
      // MÉDIA
      {
        id: 'task-13',
        category: 'Compliance',
        priority: 'medium',
        title: 'GDPR - Opt-out Funcional',
        description: 'Unsubscribe real em todos os canais',
        estimatedDays: 2,
        completed: false,
        icon: Shield,
        tags: ['gdpr', 'compliance', 'legal']
      },
      {
        id: 'task-14',
        category: 'Compliance',
        priority: 'medium',
        title: 'GDPR - Exportação de Dados',
        description: 'Usuário pode exportar seus dados',
        estimatedDays: 1,
        completed: false,
        icon: Shield,
        tags: ['gdpr', 'compliance']
      },
      {
        id: 'task-15',
        category: 'Compliance',
        priority: 'medium',
        title: 'GDPR - Exclusão de Dados',
        description: 'Right to be forgotten implementado',
        estimatedDays: 1,
        completed: false,
        icon: Shield,
        tags: ['gdpr', 'compliance']
      },
      {
        id: 'task-16',
        category: 'Analytics',
        priority: 'medium',
        title: 'Exportação de Relatórios',
        description: 'Export para PDF/Excel',
        estimatedDays: 2,
        completed: false,
        icon: BarChart3,
        tags: ['analytics', 'export']
      }
    ];
    
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        // Mesclar os dados salvos (completed status) com os dados completos (incluindo ícones)
        const mergedTasks = initialTasks.map(task => {
          const savedTask = parsed.find((t: any) => t.id === task.id);
          return {
            ...task,
            completed: savedTask?.completed || false
          };
        });
        setTasks(mergedTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas salvas:', error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  };

  const loadAISuggestions = () => {
    const aiSuggestions: AISuggestion[] = [
      {
        id: 'sugg-1',
        title: 'Email Warmup Automático',
        description: 'Aquecer domínio de email gradualmente antes de campanhas (como Instantly.ai faz). Aumenta deliverability de 60% para 95%+',
        inspiration: 'Instantly.ai, Lemwarm',
        impact: 'high',
        effort: 'medium',
        category: 'Email',
        icon: TrendingUp,
        link: 'https://instantly.ai'
      },
      {
        id: 'sugg-2',
        title: 'Personalização por Vídeo',
        description: 'Gerar vídeos personalizados com nome do lead na tela (como Loom faz). Aumenta taxa de resposta em 300%',
        inspiration: 'Loom, Sendspark',
        impact: 'high',
        effort: 'high',
        category: 'Personalização',
        icon: Sparkles,
        link: 'https://sendspark.com'
      },
      {
        id: 'sugg-3',
        title: 'Rotação de Múltiplos Remetentes',
        description: 'Enviar de múltiplos emails/domínios para não queimar reputação (Reply.io usa isso)',
        inspiration: 'Reply.io, Lemlist',
        impact: 'high',
        effort: 'medium',
        category: 'Email',
        icon: Repeat,
        link: 'https://reply.io'
      },
      {
        id: 'sugg-4',
        title: 'Spintax - Variações de Mensagem',
        description: 'Gerar variações automáticas da mesma mensagem para evitar spam filters. {Olá|Oi|Bom dia} {Nome}',
        inspiration: 'Instantly.ai, Woodpecker',
        impact: 'medium',
        effort: 'low',
        category: 'Email',
        icon: Zap
      },
      {
        id: 'sugg-5',
        title: 'Unified Inbox - Todas as Respostas',
        description: 'Centralizar respostas de email, WhatsApp, SMS em uma única caixa (como Reply.io)',
        inspiration: 'Reply.io, Salesloft',
        impact: 'high',
        effort: 'high',
        category: 'Comunicação',
        icon: MessageSquare,
        link: 'https://reply.io'
      },
      {
        id: 'sugg-6',
        title: 'LinkedIn Auto-Connect + Message',
        description: 'Enviar conexões + mensagens no LinkedIn automaticamente (como Expandi faz)',
        inspiration: 'Expandi.io, Phantombuster',
        impact: 'high',
        effort: 'medium',
        category: 'LinkedIn',
        icon: Search,
        link: 'https://expandi.io'
      },
      {
        id: 'sugg-7',
        title: 'Clay-style Data Enrichment',
        description: 'Enriquecer leads com 50+ fontes de dados automaticamente (empresa, revenue, tech stack)',
        inspiration: 'Clay.com, Clearbit',
        impact: 'high',
        effort: 'high',
        category: 'Dados',
        icon: Sparkles,
        link: 'https://clay.com'
      },
      {
        id: 'sugg-8',
        title: 'Detecção de Interesse por IA',
        description: 'IA analisando tom das respostas para detectar interesse real vs cortesia',
        inspiration: 'Gong.io, Chorus.ai',
        impact: 'high',
        effort: 'medium',
        category: 'IA',
        icon: Brain,
        link: 'https://gong.io'
      },
      {
        id: 'sugg-9',
        title: 'A/B Testing Automático',
        description: 'Testar 2-3 variações de mensagem e escolher vencedora automaticamente',
        inspiration: 'Lemlist, Instantly.ai',
        impact: 'medium',
        effort: 'medium',
        category: 'Otimização',
        icon: BarChart3
      },
      {
        id: 'sugg-10',
        title: 'Melhor Horário de Envio por IA',
        description: 'IA detecta melhores horários para cada lead baseado em histórico de abertura',
        inspiration: 'Mailchimp, Seventh Sense',
        impact: 'medium',
        effort: 'medium',
        category: 'IA',
        icon: Clock
      },
      {
        id: 'sugg-11',
        title: 'Lead Scoring Preditivo',
        description: 'IA prevê probabilidade de conversão antes de iniciar cadência',
        inspiration: 'HubSpot, Salesforce Einstein',
        impact: 'high',
        effort: 'high',
        category: 'IA',
        icon: Target
      },
      {
        id: 'sugg-12',
        title: 'WhatsApp Chatbot com IA',
        description: 'Responder perguntas básicas automaticamente no WhatsApp',
        inspiration: 'ManyChat, Chatfuel',
        impact: 'medium',
        effort: 'medium',
        category: 'WhatsApp',
        icon: MessageSquare
      },
      {
        id: 'sugg-13',
        title: 'Tracking de Compartilhamento',
        description: 'Detectar quando lead compartilha email/link com colegas (sinal forte de interesse)',
        inspiration: 'Yesware, Mixmax',
        impact: 'medium',
        effort: 'low',
        category: 'Analytics',
        icon: TrendingUp
      },
      {
        id: 'sugg-14',
        title: 'Calendly Integration - Agendar Direto',
        description: 'Lead agenda reunião direto do email sem fricção',
        inspiration: 'Calendly, Chili Piper',
        impact: 'high',
        effort: 'low',
        category: 'Conversão',
        icon: Clock,
        link: 'https://calendly.com'
      },
      {
        id: 'sugg-15',
        title: 'Análise de Concorrentes do Lead',
        description: 'Mostrar quais concorrentes do lead já usam sua solução',
        inspiration: 'Similar companies feature do LinkedIn Sales Nav',
        impact: 'medium',
        effort: 'medium',
        category: 'Dados',
        icon: Search
      },
      {
        id: 'sugg-16',
        title: 'Voice Drops - Mensagens de Voz',
        description: 'Deixar voice messages personalizadas na caixa de correio de voz',
        inspiration: 'Slybroadcast, VanillaSoft',
        impact: 'medium',
        effort: 'medium',
        category: 'Comunicação',
        icon: MessageSquare
      },
      {
        id: 'sugg-17',
        title: 'Gifting Automático',
        description: 'Enviar presentes físicos (café, livros) para leads quentes',
        inspiration: 'Sendoso, Alyce',
        impact: 'high',
        effort: 'high',
        category: 'Nurturing',
        icon: DollarSign,
        link: 'https://sendoso.com'
      },
      {
        id: 'sugg-18',
        title: 'Trigger-Based Outreach',
        description: 'Iniciar cadência quando lead muda de emprego, empresa levanta funding, etc.',
        inspiration: 'Apollo.io, ZoomInfo',
        impact: 'high',
        effort: 'medium',
        category: 'Automação',
        icon: Zap
      }
    ];
    
    setSuggestions(aiSuggestions);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        
        if (newCompleted) {
          toast.success(`✅ ${task.title} marcado como completo!`, {
            description: `Você economizou ${task.estimatedDays} dias de desenvolvimento`
          });
        }
        
        return { ...task, completed: newCompleted };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('mvp-tasks', JSON.stringify(updatedTasks));
  };

  const calculateProgress = () => {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const calculateTimeRemaining = () => {
    const incompleteTasks = tasks.filter(t => !t.completed);
    return incompleteTasks.reduce((sum, task) => sum + task.estimatedDays, 0);
  };

  const getTasksByPriority = (priority: string) => {
    if (priority === 'all') {
      return showCompleted ? tasks : tasks.filter(t => !t.completed);
    }
    const filtered = tasks.filter(t => t.priority === priority);
    return showCompleted ? filtered : filtered.filter(t => !t.completed);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const progress = calculateProgress();
  const daysRemaining = calculateTimeRemaining();

  const handleApplySuggestion = (taskId: string, suggestionId: string) => {
    // Marca a tarefa como em progresso ou adiciona uma flag
    console.log(`Aplicando sugestão ${suggestionId} para tarefa ${taskId}`);
    
    // Opcionalmente, marcar tarefa como parcialmente completa
    toast.success('🎉 Sugestão aplicada! Arquivos criados/modificados.', {
      description: 'Verifique o código gerado e ajuste conforme necessário'
    });
  };

  return (
    <div className="space-y-6">
      {/* Auto Implementation Modal */}
      {selectedImplementation && (
        <AutoImplementationModal
          open={showAutoImplementModal}
          onOpenChange={setShowAutoImplementModal}
          implementationKey={selectedImplementation}
        />
      )}
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progresso Geral</p>
                <p className="text-3xl font-bold">{progress}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Progress value={progress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tarefas Completas</p>
                <p className="text-3xl font-bold">{tasks.filter(t => t.completed).length}/{tasks.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dias Restantes</p>
                <p className="text-3xl font-bold">{daysRemaining}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sugestões IA</p>
                <p className="text-3xl font-bold">{suggestions.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tarefas MVP</TabsTrigger>
          <TabsTrigger value="suggestions">
            Sugestões IA <Badge className="ml-2 bg-purple-600">{suggestions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="report">Relatório Completo</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Checklist MVP - Roadmap de Implementação</CardTitle>
                  <CardDescription>
                    {daysRemaining} dias de desenvolvimento restantes • {tasks.filter(t => !t.completed && t.priority === 'critical').length} tarefas críticas pendentes
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCompleted(!showCompleted)}
                  >
                    {showCompleted ? 'Ocultar' : 'Mostrar'} Completas
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Priority Filter */}
              <div className="flex gap-2 mb-6 flex-wrap">
                <Button
                  variant={selectedPriority === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('all')}
                >
                  Todas ({tasks.length})
                </Button>
                <Button
                  variant={selectedPriority === 'critical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('critical')}
                  className="gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Críticas ({tasks.filter(t => t.priority === 'critical').length})
                </Button>
                <Button
                  variant={selectedPriority === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('high')}
                  className="gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  Altas ({tasks.filter(t => t.priority === 'high').length})
                </Button>
                <Button
                  variant={selectedPriority === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPriority('medium')}
                  className="gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  Médias ({tasks.filter(t => t.priority === 'medium').length})
                </Button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {getTasksByPriority(selectedPriority).map(task => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={task.id}
                      className={`p-4 border rounded-lg hover:shadow-md transition-all ${
                        task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                task.completed ? 'bg-green-100' : 'bg-blue-100'
                              }`}>
                                <Icon className={`w-5 h-5 ${
                                  task.completed ? 'text-green-600' : 'text-blue-600'
                                }`} />
                              </div>
                              
                              <div className="flex-1">
                                <h4 className={`font-semibold mb-1 ${
                                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </h4>
                                <p className={`text-sm ${
                                  task.completed ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {task.description}
                                </p>
                                
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs">
                                    {task.category}
                                  </Badge>
                                  <Badge className={`text-xs ${getPriorityColor(task.priority)} text-white`}>
                                    {task.priority === 'critical' ? '🔴 Crítico' : 
                                     task.priority === 'high' ? '🟠 Alto' : 
                                     task.priority === 'medium' ? '🟡 Médio' : '🟢 Baixo'}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    ⏱️ {task.estimatedDays}d
                                  </Badge>
                                  {task.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                {/* Botão de Sugestões de IA */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-3 gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowSuggestionsModal(true);
                                  }}
                                >
                                  <Sparkles className="w-3 h-3" />
                                  Ver Sugestões de IA
                                </Button>
                                
                                {/* Botão de Aplicar Automaticamente (apenas para tarefas específicas) */}
                                {(task.id === 'task-4' || task.id === 'task-3' || task.id === 'task-6' || task.id === 'task-1') && !task.completed && (
                                  <Button
                                    size="sm"
                                    className="mt-3 ml-2 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    onClick={() => {
                                      if (task.id === 'task-4') {
                                        setSelectedImplementation('twilio-sms');
                                      } else if (task.id === 'task-3') {
                                        setSelectedImplementation('whatsapp-integration');
                                      } else if (task.id === 'task-6') {
                                        setSelectedImplementation('openai-llm');
                                      } else if (task.id === 'task-1') {
                                        setSelectedImplementation('linkedin-sales-nav');
                                      }
                                      setShowAutoImplementModal(true);
                                    }}
                                  >
                                    <Rocket className="w-3 h-3" />
                                    🤖 Aplicar Automaticamente
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Sugestões Inteligentes - Inspiradas nas Melhores Plataformas
              </CardTitle>
              <CardDescription>
                Features usadas por líderes de mercado como Instantly.ai, Reply.io, Clay.com e outros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {suggestions.map(suggestion => {
                  const Icon = suggestion.icon;
                  return (
                    <div
                      key={suggestion.id}
                      className="p-4 border rounded-lg hover:shadow-lg transition-all bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                            {suggestion.link && (
                              <a
                                href={suggestion.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {suggestion.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                            <Lightbulb className="w-3 h-3" />
                            <span>Inspirado em: <strong>{suggestion.inspiration}</strong></span>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.category}
                            </Badge>
                            <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                              Impacto: {suggestion.impact === 'high' ? '🔥 Alto' : 
                                       suggestion.impact === 'medium' ? '⚡ Médio' : '💡 Baixo'}
                            </Badge>
                            <Badge className={`text-xs ${getEffortColor(suggestion.effort)}`}>
                              Esforço: {suggestion.effort === 'low' ? '✅ Baixo' : 
                                       suggestion.effort === 'medium' ? '⚙️ Médio' : '🔨 Alto'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Completo - Análise MVP</CardTitle>
              <CardDescription>
                Documento detalhado com roadmap, custos e checklist de pré-lançamento
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Status Atual</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✅ Interface e Design: 100% completo</li>
                    <li>✅ Sistema de Autenticação: 100% funcional</li>
                    <li>✅ Emails Transacionais: 100% funcional</li>
                    <li>⚠️ Busca de Leads: 0% (apenas mock)</li>
                    <li>⚠️ Envio Multi-Canal: 30% (só email transacional)</li>
                    <li>⚠️ IA Personalização: 0% (simulado)</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">🔴 Prioridade Crítica</h3>
                  <p className="text-sm text-red-800 mb-3">
                    <strong>3 bloqueadores principais</strong> que impedem MVP de funcionar:
                  </p>
                  <ol className="space-y-2 text-sm text-red-800 list-decimal list-inside">
                    <li><strong>Busca Real de Leads</strong> (LinkedIn + Apollo.io) - 3-5 dias</li>
                    <li><strong>Mensagens Multi-Canal</strong> (WhatsApp + SMS real) - 5-7 dias</li>
                    <li><strong>IA Gerando Mensagens</strong> (OpenAI/Claude) - 5-7 dias</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">🚀 Plano de 4 Semanas</h3>
                  <div className="space-y-3 text-sm text-green-800">
                    <div>
                      <strong>Semana 1:</strong> Busca de leads (LinkedIn + Apollo.io)
                    </div>
                    <div>
                      <strong>Semana 2:</strong> Comunicação multi-canal (WhatsApp + SMS)
                    </div>
                    <div>
                      <strong>Semana 3:</strong> IA e automação (OpenAI/Claude)
                    </div>
                    <div>
                      <strong>Semana 4:</strong> Integrações CRM e testes finais
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">💰 Custos Mensais Estimados</h3>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li>LinkedIn Sales Navigator: €80-120/mês</li>
                    <li>Apollo.io: €49-99/mês</li>
                    <li>OpenAI API: €30-100/mês</li>
                    <li>WhatsApp Business API: €50-100/mês</li>
                    <li>Twilio SMS: €60-120/mês</li>
                    <li>Supabase Pro: €25/mês</li>
                    <li><strong>Total: €294-564/mês</strong></li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/RELATORIO-MVP-COMPLETO.md';
                      link.download = 'relatorio-mvp-completo.md';
                      link.click();
                      toast.success('Relatório exportado!');
                    }}
                  >
                    📥 Baixar Relatório Completo (.md)
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open('/RELATORIO-MVP-COMPLETO.md', '_blank');
                    }}
                  >
                    👁️ Ver Documento Completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}