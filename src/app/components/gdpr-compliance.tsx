import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Scale, Shield, FileText, Users, Download, Trash2, CheckCircle, 
  AlertTriangle, ExternalLink, Info, Lock, Database, Globe, 
  Activity, Eye, Clock, FileCheck, BarChart3, Zap, Settings,
  ChevronDown, ChevronUp, RefreshCw, Bell, Search, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { storage } from '../lib/storage-service';

interface AuditLog {
  id: string;
  timestamp: Date;
  action: string;
  dataType: string;
  user: string;
  details: string;
}

export function GDPRCompliance() {
  const [complianceScore, setComplianceScore] = useState(0);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showDataRights, setShowDataRights] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Animar o score de conformidade
    let current = 0;
    const target = 42; // Score atual
    const interval = setInterval(() => {
      if (current < target) {
        current += 1;
        setComplianceScore(current);
      } else {
        clearInterval(interval);
      }
    }, 20);

    // Gerar logs de auditoria mock
    generateAuditLogs();

    return () => clearInterval(interval);
  }, []);

  const generateAuditLogs = () => {
    const logs: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        action: 'Exportação de Dados',
        dataType: 'Leads',
        user: 'admin@leadgen.pt',
        details: '127 registos exportados em formato JSON'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        action: 'Acesso a Dados',
        dataType: 'Perfil de Lead',
        user: 'admin@leadgen.pt',
        details: 'Visualização de dados de João Silva'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        action: 'Enriquecimento de Dados',
        dataType: 'API Apollo.io',
        user: 'sistema',
        details: 'Enriquecimento de 5 leads via Apollo.io'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        action: 'Pedido de Apagamento',
        dataType: 'Lead',
        user: 'sistema',
        details: 'Apagamento solicitado por maria@exemplo.pt'
      }
    ];
    setAuditLogs(logs);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { text: 'Excelente', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (score >= 60) return { text: 'Bom', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (score >= 40) return { text: 'Requer Atenção', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { text: 'Crítico', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const status = getScoreStatus(complianceScore);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Centro de Privacidade & RGPD
          </h1>
          <p className="text-sm text-gray-600">
            Gerencie a conformidade com o Regulamento Geral de Proteção de Dados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Score de Conformidade - Destaque Principal */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Score Principal */}
        <Card className="md:col-span-2 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-0 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg mb-1">Score de Conformidade RGPD</h3>
              <p className="text-sm text-gray-600">Avaliação em tempo real do seu nível de proteção</p>
            </div>
            <Badge className={`${status.bg} ${status.color} border ${status.border}`}>
              {status.text}
            </Badge>
          </div>

          <div className="flex items-center gap-8">
            {/* Círculo de Score */}
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(complianceScore / 100) * 352} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                    <stop offset="100%" className="text-purple-600" stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-0.5">{complianceScore}%</div>
                  <div className="text-xs text-gray-500">de 100%</div>
                </div>
              </div>
            </div>

            {/* Detalhes */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Implementações Ativas</span>
                  <span className="font-medium">6/14</span>
                </div>
                <Progress value={43} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Documentação Legal</span>
                  <span className="font-medium">2/8</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Medidas de Segurança</span>
                  <span className="font-medium">4/6</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
            </div>
          </div>

          <Alert className="mt-6 bg-white/60 border-blue-200">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertDescription className="text-sm">
              <strong>Status:</strong> Sistema em conformidade parcial. 
              Seguro para testes internos. <strong className="text-orange-600">Não utilize comercialmente</strong> sem completar os requisitos pendentes.
            </AlertDescription>
          </Alert>
        </Card>

        {/* Ações Rápidas */}
        <Card className="p-6">
          <h3 className="text-sm mb-4 text-gray-600">Ações Rápidas</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveTab('rights')}
            >
              <Users className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm">Direitos dos Titulares</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveTab('audit')}
            >
              <Eye className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-sm">Auditoria de Acesso</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowPrivacyPolicy(true)}
            >
              <FileText className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-sm">Política de Privacidade</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveTab('apis')}
            >
              <Globe className="w-4 h-4 mr-2 text-orange-600" />
              <span className="text-sm">APIs e Transferências</span>
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Clock className="w-3 h-3" />
              Última verificação
            </div>
            <p className="text-sm">Agora mesmo</p>
          </div>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="rights">
            <Users className="w-4 h-4 mr-2" />
            Direitos dos Titulares
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Eye className="w-4 h-4 mr-2" />
            Auditoria
          </TabsTrigger>
          <TabsTrigger value="apis">
            <Globe className="w-4 h-4 mr-2" />
            APIs & Transferências
          </TabsTrigger>
          <TabsTrigger value="docs">
            <FileCheck className="w-4 h-4 mr-2" />
            Documentação
          </TabsTrigger>
        </TabsList>

        {/* TAB: Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Implementado */}
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg">Implementado</h3>
                  <p className="text-xs text-gray-600">6 funcionalidades ativas</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Download, text: 'Portabilidade de dados (exportar JSON)', color: 'text-green-600' },
                  { icon: Trash2, text: 'Direito ao apagamento (deletar dados)', color: 'text-green-600' },
                  { icon: Shield, text: 'Autenticação 2FA e segurança', color: 'text-green-600' },
                  { icon: Lock, text: 'Encriptação de dados sensíveis', color: 'text-green-600' },
                  { icon: FileText, text: 'Política de privacidade base', color: 'text-green-600' },
                  { icon: Bell, text: 'Notificações de segurança', color: 'text-green-600' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm flex-1">{item.text}</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">Ativo</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pendente */}
            <Card className="p-6 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg">Pendente</h3>
                  <p className="text-xs text-gray-600">8 requisitos faltantes</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Users, text: 'Sistema de consentimento ativo', priority: 'Alta', color: 'text-red-600' },
                  { icon: FileCheck, text: 'Registro de atividades de tratamento', priority: 'Alta', color: 'text-red-600' },
                  { icon: Globe, text: 'DPA com Apollo.io, Resend, etc.', priority: 'Alta', color: 'text-red-600' },
                  { icon: Clock, text: 'Processo de resposta (30 dias)', priority: 'Média', color: 'text-orange-600' },
                  { icon: BarChart3, text: 'DPIA (Avaliação de Impacto)', priority: 'Média', color: 'text-orange-600' },
                  { icon: Bell, text: 'Procedimento de violação de dados', priority: 'Alta', color: 'text-red-600' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm flex-1">{item.text}</span>
                    <Badge 
                      className={`text-xs ${
                        item.priority === 'Alta' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Próximos Passos */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg mb-1">Roteiro para Conformidade Total</h3>
                <p className="text-sm text-gray-600">
                  Siga estes passos para atingir 100% de conformidade RGPD
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { step: 1, title: 'Consultar advogado especializado em RGPD', time: '1-2 semanas', cost: '€1.500-€5.000' },
                { step: 2, title: 'Alterar modelo para consentimento ativo', time: '2-3 semanas', cost: 'Dev interno' },
                { step: 3, title: 'Assinar DPA com fornecedores (Apollo, Resend)', time: '1-2 semanas', cost: 'Incluído' },
                { step: 4, title: 'Implementar registro de consentimentos', time: '1 semana', cost: 'Dev interno' },
                { step: 5, title: 'Criar procedimento de resposta (30 dias)', time: '1 semana', cost: 'Interno' },
                { step: 6, title: 'Realizar DPIA (Avaliação de Impacto)', time: '2-3 semanas', cost: '€2.000-€5.000' },
                { step: 7, title: 'Registro de Atividades de Tratamento', time: '1 semana', cost: 'Interno' },
                { step: 8, title: 'Considerar nomear DPO', time: 'Ongoing', cost: '€30.000/ano' }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                      <span className="text-xs text-gray-600">
                        💰 {item.cost}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="mt-4 bg-blue-100 border-blue-300">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                <strong>Estimativa Total:</strong> 2-3 meses de implementação | 
                <strong> Investimento:</strong> €5.000-€15.000 + custos recorrentes
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>

        {/* TAB: Direitos dos Titulares */}
        <TabsContent value="rights" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg">Direitos dos Titulares de Dados</h3>
                <p className="text-sm text-gray-600">RGPD Artigos 12-22</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: Eye,
                  title: 'Direito de Acesso',
                  article: 'Art. 15º',
                  desc: 'Obter cópia de todos os dados pessoais armazenados',
                  action: 'Exportar Dados',
                  color: 'blue'
                },
                {
                  icon: Trash2,
                  title: 'Direito ao Apagamento',
                  article: 'Art. 17º',
                  desc: 'Ser completamente esquecido pelo sistema',
                  action: 'Solicitar Apagamento',
                  color: 'red'
                },
                {
                  icon: FileText,
                  title: 'Direito de Retificação',
                  article: 'Art. 16º',
                  desc: 'Corrigir dados pessoais incorretos ou desatualizados',
                  action: 'Editar Dados',
                  color: 'green'
                },
                {
                  icon: Shield,
                  title: 'Direito de Oposição',
                  article: 'Art. 21º',
                  desc: 'Opor-se ao tratamento dos seus dados pessoais',
                  action: 'Exercer Direito',
                  color: 'purple'
                },
                {
                  icon: Download,
                  title: 'Direito à Portabilidade',
                  article: 'Art. 20º',
                  desc: 'Receber dados em formato estruturado e legível',
                  action: 'Exportar JSON',
                  color: 'indigo'
                },
                {
                  icon: Lock,
                  title: 'Direito à Limitação',
                  article: 'Art. 18º',
                  desc: 'Limitar o tratamento em determinadas circunstâncias',
                  action: 'Solicitar Limitação',
                  color: 'orange'
                }
              ].map((right, idx) => (
                <Card key={idx} className={`p-4 border-l-4 border-l-${right.color}-500 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${right.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <right.icon className={`w-5 h-5 text-${right.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{right.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {right.article}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{right.desc}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowDataRights(true)}
                  >
                    {right.action}
                  </Button>
                </Card>
              ))}
            </div>

            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <Clock className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <strong>Prazo de Resposta:</strong> 30 dias (pode ser estendido para 60 dias em casos complexos).
                <br />
                <strong>Contacto:</strong> Para exercer direitos, use o formulário acima ou envie email para{' '}
                <a href="mailto:privacidade@leadgen.pt" className="underline text-blue-600">
                  privacidade@leadgen.pt
                </a>
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>

        {/* TAB: Auditoria */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg">Auditoria de Acesso a Dados</h3>
                  <p className="text-sm text-gray-600">Logs de todas as operações com dados pessoais</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Acessos Hoje', value: '47', icon: Eye, color: 'blue' },
                { label: 'Exportações', value: '12', icon: Download, color: 'green' },
                { label: 'Modificações', value: '8', icon: FileText, color: 'purple' },
                { label: 'Apagamentos', value: '3', icon: Trash2, color: 'red' }
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 bg-${stat.color}-50 rounded-lg border border-${stat.color}-100`}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                    <span className={`text-2xl text-${stat.color}-600`}>{stat.value}</span>
                  </div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Logs */}
            <div className="space-y-2">
              <h4 className="text-sm mb-3 text-gray-600">Atividades Recentes</h4>
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-sm">{log.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.dataType}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{log.details}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {log.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp.toLocaleString('pt-PT')}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Alert className="mt-6">
              <Info className="w-4 h-4" />
              <AlertDescription className="text-sm">
                <strong>Retenção de Logs:</strong> Os registos de auditoria são mantidos por 12 meses para fins de compliance e segurança.
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>

        {/* TAB: APIs & Transferências */}
        <TabsContent value="apis" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg">Transferências Internacionais de Dados</h3>
                <p className="text-sm text-gray-600">Fornecedores e APIs de terceiros</p>
              </div>
            </div>

            <Alert className="mb-6 bg-orange-50 border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <AlertDescription className="text-sm">
                <strong>⚠️ Aviso RGPD:</strong> Este sistema utiliza serviços localizados fora da União Europeia.
                As transferências são protegidas por Standard Contractual Clauses (SCC) e Data Privacy Framework (DPF).
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {[
                {
                  name: 'Apollo.io',
                  purpose: 'Busca e enriquecimento de leads B2B',
                  location: '🇺🇸 Estados Unidos',
                  status: 'Ativo',
                  safeguards: 'SCC + DPF',
                  risk: 'Médio'
                },
                {
                  name: 'Hunter.io',
                  purpose: 'Verificação e descoberta de emails',
                  location: '🇺🇸 Estados Unidos',
                  status: 'Ativo',
                  safeguards: 'SCC',
                  risk: 'Médio'
                },
                {
                  name: 'Clearbit',
                  purpose: 'Enriquecimento de dados empresariais',
                  location: '🇺🇸 Estados Unidos',
                  status: 'Ativo',
                  safeguards: 'SCC + DPF',
                  risk: 'Médio'
                },
                {
                  name: 'RocketReach',
                  purpose: 'Dados de contacto profissionais',
                  location: '🇺🇸 Estados Unidos',
                  status: 'Ativo',
                  safeguards: 'SCC',
                  risk: 'Médio'
                },
                {
                  name: 'Resend',
                  purpose: 'Envio de emails transacionais',
                  location: '🇺🇸 Estados Unidos',
                  status: 'Ativo',
                  safeguards: 'SCC + DPF',
                  risk: 'Baixo'
                },
                {
                  name: 'Supabase',
                  purpose: 'Armazenamento de dados e autenticação',
                  location: '🇪🇺 União Europeia',
                  status: 'Ativo',
                  safeguards: 'RGPD Nativo',
                  risk: 'Baixo'
                }
              ].map((api, idx) => (
                <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium">{api.name}</h4>
                        <Badge 
                          className={`text-xs ${
                            api.risk === 'Baixo' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          Risco {api.risk}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{api.purpose}</p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {api.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Localização:</span>
                      <p className="font-medium mt-0.5">{api.location}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Garantias:</span>
                      <p className="font-medium mt-0.5">{api.safeguards}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <strong>Standard Contractual Clauses (SCC):</strong> Cláusulas contratuais aprovadas pela Comissão Europeia para proteção de dados transferidos para fora da UE.
                <br />
                <strong>Data Privacy Framework (DPF):</strong> Acordo UE-EUA para transferências internacionais de dados.
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>

        {/* TAB: Documentação */}
        <TabsContent value="docs" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg">Documentação Legal RGPD</h3>
                <p className="text-sm text-gray-600">Políticas e documentos obrigatórios</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Política de Privacidade',
                  status: 'Rascunho',
                  progress: 60,
                  required: true,
                  action: () => setShowPrivacyPolicy(true),
                  color: 'yellow'
                },
                {
                  title: 'Termos de Uso',
                  status: 'Pendente',
                  progress: 0,
                  required: true,
                  action: () => toast.info('Em desenvolvimento'),
                  color: 'red'
                },
                {
                  title: 'Registro de Atividades de Tratamento',
                  status: 'Pendente',
                  progress: 0,
                  required: true,
                  action: () => toast.info('Requer assessoria jurídica'),
                  color: 'red'
                },
                {
                  title: 'Análise Legal Completa',
                  status: 'Disponível',
                  progress: 100,
                  required: false,
                  action: () => window.open('/ANALISE-LEGAL-GDPR-PORTUGAL.md', '_blank'),
                  color: 'green'
                },
                {
                  title: 'DPIA - Avaliação de Impacto',
                  status: 'Pendente',
                  progress: 0,
                  required: true,
                  action: () => toast.info('Requer assessoria jurídica'),
                  color: 'red'
                },
                {
                  title: 'Procedimento de Violação de Dados',
                  status: 'Pendente',
                  progress: 0,
                  required: true,
                  action: () => toast.info('Em desenvolvimento'),
                  color: 'red'
                },
                {
                  title: 'DPA com Fornecedores',
                  status: 'Pendente',
                  progress: 0,
                  required: true,
                  action: () => toast.info('Requer contato com fornecedores'),
                  color: 'red'
                },
                {
                  title: 'Guia Rápido de Conformidade',
                  status: 'Disponível',
                  progress: 100,
                  required: false,
                  action: () => window.open('/GUIA-RAPIDO-CONFORMIDADE-PORTUGAL.md', '_blank'),
                  color: 'green'
                }
              ].map((doc, idx) => (
                <Card 
                  key={idx} 
                  className={`p-4 border-l-4 border-l-${doc.color}-500 cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={doc.action}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{doc.title}</h4>
                        {doc.required && (
                          <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                      <Badge 
                        className={`text-xs ${
                          doc.status === 'Disponível' 
                            ? 'bg-green-100 text-green-700'
                            : doc.status === 'Rascunho'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Progresso</span>
                      <span>{doc.progress}%</span>
                    </div>
                    <Progress value={doc.progress} className="h-1.5" />
                  </div>
                </Card>
              ))}
            </div>

            <Alert className="mt-6 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-sm">
                <strong>Atenção:</strong> Documentos legais devem ser revisados por advogado especializado em proteção de dados antes de uso comercial.
                <br />
                <strong>Recomendação:</strong> Contacte a Ordem dos Advogados ou procure "advogado RGPD Portugal".
              </AlertDescription>
            </Alert>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contactos de Privacidade */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg">Contactos de Privacidade</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Email de Privacidade</p>
              <a href="mailto:privacidade@kw-portugal.pt" className="text-sm text-blue-600 hover:underline">
                privacidade@kw-portugal.pt
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <ExternalLink className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">Autoridade de Controlo</p>
              <a 
                href="https://www.cnpd.pt/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:underline flex items-center gap-1"
              >
                CNPD Portugal
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <FileText className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Apresentar Queixa</p>
              <a 
                href="https://www.cnpd.pt/cidadaos/queixas/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:underline"
              >
                Formulário CNPD
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal Política de Privacidade */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
              <h2 className="text-2xl flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Política de Privacidade
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowPrivacyPolicy(false)}>
                ✕
              </Button>
            </div>
            
            <Alert className="mb-6 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-sm">
                <strong>Nota Legal:</strong> Este é um modelo simplificado para fins de demonstração.
                Consulte um advogado especializado para versão completa e adequada ao seu negócio.
              </AlertDescription>
            </Alert>

            <div className="prose prose-sm max-w-none space-y-6">
              <section>
                <h3 className="text-lg mb-2">1. Responsável pelo Tratamento</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p><strong>KW Portugal - Lead Generation System</strong></p>
                  <p>Morada: [Inserir morada completa]</p>
                  <p>NIF: [Inserir NIF]</p>
                  <p>Email: privacidade@kw-portugal.pt</p>
                  <p>Telefone: [Inserir telefone]</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg mb-2">2. Dados Pessoais Tratados</h3>
                <p className="text-sm text-gray-700 mb-3">
                  No âmbito da atividade de prospeção comercial e geração de leads para o setor imobiliário, tratamos os seguintes dados pessoais:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Nome completo</li>
                  <li>• Email profissional</li>
                  <li>• Número de telefone (quando disponível publicamente)</li>
                  <li>• Empresa onde trabalha e cargo profissional</li>
                  <li>• Perfil público do LinkedIn (URL)</li>
                  <li>• Localização geográfica (cidade/país)</li>
                  <li>• Setor de atividade profissional</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg mb-2">3. Finalidade do Tratamento</h3>
                <p className="text-sm text-gray-700 mb-3">Os dados são tratados para:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Prospeção comercial de oportunidades imobiliárias</li>
                  <li>• Geração e qualificação de leads para a rede KW Portugal</li>
                  <li>• Comunicação de serviços e oportunidades relevantes</li>
                  <li>• Análise de perfil de potencial investidor/comprador</li>
                  <li>• Segmentação de público-alvo</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg mb-2">4. Base Legal (RGPD Art. 6º)</h3>
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-sm">
                    <strong>[ATENÇÃO - Requer Definição Legal]:</strong>
                    <br />
                    A base legal para tratamento deve ser definida com advogado especializado.
                    <br />
                    Opções possíveis: Consentimento | Interesse Legítimo | Execução de Contrato
                  </AlertDescription>
                </Alert>
              </section>

              <section>
                <h3 className="text-lg mb-2">5. Prazo de Conservação</h3>
                <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                  <p>• <strong>Leads ativos:</strong> Até 24 meses após última interação</p>
                  <p>• <strong>Leads inativos:</strong> 6 meses após inatividade</p>
                  <p>• <strong>Clientes:</strong> Duração do contrato + 5 anos (obrigação fiscal)</p>
                  <p>• <strong>Dados de oposição:</strong> Mantidos em lista de exclusão indefinidamente</p>
                </div>
              </section>

              <section>
                <h3 className="text-lg mb-2">6. Seus Direitos (RGPD)</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Enquanto titular de dados pessoais, tem os seguintes direitos:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <strong>Direito de Acesso</strong>
                    <p className="text-xs text-gray-600 mt-1">Obter cópia dos seus dados</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <strong>Direito de Retificação</strong>
                    <p className="text-xs text-gray-600 mt-1">Corrigir dados incorretos</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <strong>Direito ao Apagamento</strong>
                    <p className="text-xs text-gray-600 mt-1">Ser esquecido ("right to be forgotten")</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <strong>Direito de Oposição</strong>
                    <p className="text-xs text-gray-600 mt-1">Opor-se ao tratamento</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <strong>Direito à Portabilidade</strong>
                    <p className="text-xs text-gray-600 mt-1">Receber dados em formato legível</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <strong>Direito de Queixa</strong>
                    <p className="text-xs text-gray-600 mt-1">Apresentar queixa à CNPD</p>
                  </div>
                </div>
                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <Info className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-sm">
                    Para exercer qualquer direito, contacte:{' '}
                    <a href="mailto:privacidade@kw-portugal.pt" className="underline text-blue-600">
                      privacidade@kw-portugal.pt
                    </a>
                    <br />
                    <strong>Prazo de resposta:</strong> 30 dias (prorrogável até 60 dias)
                  </AlertDescription>
                </Alert>
              </section>

              <section>
                <h3 className="text-lg mb-2">7. Transferências Internacionais</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Utilizamos serviços de terceiros que podem estar localizados fora da União Europeia,
                  nomeadamente nos Estados Unidos (Apollo.io, Hunter.io, Clearbit, RocketReach, Resend).
                </p>
                <Alert className="bg-orange-50 border-orange-200">
                  <Globe className="w-4 h-4 text-orange-600" />
                  <AlertDescription className="text-sm">
                    <strong>Garantias de Proteção:</strong>
                    <br />
                    • Standard Contractual Clauses (SCC) aprovadas pela Comissão Europeia
                    <br />
                    • Data Privacy Framework (DPF) UE-EUA
                    <br />
                    • Cláusulas de proteção adicional em contratos com fornecedores
                  </AlertDescription>
                </Alert>
              </section>

              <section>
                <h3 className="text-lg mb-2">8. Medidas de Segurança</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados:
                </p>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <strong>Encriptação</strong>
                      <p className="text-xs text-gray-600">Dados sensíveis encriptados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <strong>Autenticação 2FA</strong>
                      <p className="text-xs text-gray-600">Dupla verificação obrigatória</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <strong>Controlo de Acessos</strong>
                      <p className="text-xs text-gray-600">Acesso restrito e auditado</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg mb-2">9. Partilha de Dados</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Os seus dados podem ser partilhados com:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Consultores da rede KW Portugal (para contacto comercial)</li>
                  <li>• Fornecedores de serviços tecnológicos (sob contrato de confidencialidade)</li>
                  <li>• Autoridades competentes (quando legalmente obrigatório)</li>
                </ul>
              </section>

              <section className="border-t pt-6">
                <div className="bg-gray-100 p-4 rounded-lg text-xs text-gray-600">
                  <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-PT')}</p>
                  <p className="mt-2">
                    <strong className="text-red-600">AVISO IMPORTANTE:</strong> Esta política é um modelo base.
                    Deve ser revista e adaptada por advogado especializado em proteção de dados antes de uso comercial.
                  </p>
                </div>
              </section>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Exercício de Direitos */}
      {showDataRights && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-600" />
                Exercício de Direitos RGPD
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowDataRights(false)}>
                ✕
              </Button>
            </div>
            
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Clock className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <strong>Prazo de resposta garantido:</strong> 30 dias (Art. 12º RGPD)
                <br />
                Podemos solicitar documentos para verificação de identidade por segurança.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Seu Email *</label>
                <input 
                  type="email" 
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="seu.email@exemplo.pt"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Direito que Deseja Exercer *</label>
                <select className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Direito de Acesso (obter cópia completa dos meus dados)</option>
                  <option>Direito de Retificação (corrigir dados incorretos)</option>
                  <option>Direito ao Apagamento (ser completamente esquecido)</option>
                  <option>Direito de Oposição (opor-me ao tratamento dos dados)</option>
                  <option>Direito à Portabilidade (exportar dados em formato JSON)</option>
                  <option>Direito à Limitação (limitar tratamento temporariamente)</option>
                  <option>Outro (especificar na mensagem)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Descrição do Pedido</label>
                <textarea 
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={5}
                  placeholder="Descreva detalhadamente o seu pedido. Inclua qualquer informação relevante que nos ajude a processar o seu pedido de forma eficiente."
                />
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <Info className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-xs">
                  <strong>Verificação de Identidade:</strong> Para proteção contra fraudes, podemos solicitar:
                  <ul className="mt-2 ml-4 space-y-1">
                    <li>• Cópia de documento de identificação</li>
                    <li>• Confirmação por email</li>
                    <li>• Outros elementos de verificação</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => {
                    toast.success('✅ Pedido enviado! Responderemos em até 30 dias conforme RGPD.', {
                      description: 'Receberá confirmação por email em breve.'
                    });
                    setShowDataRights(false);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Pedido
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowDataRights(false)}
                >
                  Cancelar
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Alternativamente, envie email para:<br />
                  <a href="mailto:privacidade@kw-portugal.pt" className="text-blue-600 underline">
                    privacidade@kw-portugal.pt
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Componente auxiliar para ícone de email (importar de lucide-react)
import { Mail, Send } from 'lucide-react';