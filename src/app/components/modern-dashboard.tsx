import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { QuickAccessTokenModal } from './quick-access-token-modal';
import { Lead, Activity } from '../types';
import { PhoneEnrichmentWidget } from './phone-enrichment-widget';
import { LiveAIActivity } from './live-ai-activity';
import { RealtimeStats } from './realtime-stats';
import { AISuggestionsWidget } from './ai-suggestions-widget';
import { ExportLeadsButton } from './export-leads-button';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  Clock,
  Zap,
  Mail,
  Phone,
  Play,
  Pause,
  Settings,
  Download,
  Link2,
  Shield
} from 'lucide-react';

interface ModernDashboardProps {
  clusters?: any[];
  leads: Lead[];
  activities: Activity[];
  aiActive: boolean;
  onToggleAI: () => void;
  onUpdateCluster?: (id: string, updates: any) => void;
  onLeadUpdate?: () => void;
}

export function ModernDashboard({ clusters, leads, activities, aiActive, onToggleAI, onUpdateCluster, onLeadUpdate }: ModernDashboardProps) {
  const [showAccessTokenModal, setShowAccessTokenModal] = useState(false);
  
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'hot').length;
  const inConversation = leads.filter(l => l.status === 'in-conversation').length;
  const handovers = leads.filter(l => l.status === 'handover').length;
  const coldLeads = leads.filter(l => l.status === 'cold').length;
  
  const avgScore = totalLeads > 0 
    ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / totalLeads)
    : 0;

  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.timestamp).toDateString();
    const today = new Date().toDateString();
    return activityDate === today;
  }).length;

  const conversionRate = totalLeads > 0
    ? Math.round((hotLeads / totalLeads) * 100)
    : 0;

  const channelStats = {
    email: leads.filter(l => l.channel === 'email').length,
    whatsapp: leads.filter(l => l.channel === 'whatsapp').length,
    linkedin: leads.filter(l => l.channel === 'linkedin').length,
    sms: leads.filter(l => l.channel === 'sms').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl mb-2">Visão Geral</h1>
          <p className="text-gray-600">Acompanhe seus leads em tempo real</p>
        </div>
        
        {/* Botão IA redesenhado - mais delicado e menor */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all">
          <div className={`w-2 h-2 rounded-full ${aiActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-xs font-medium text-gray-700">
            {aiActive ? 'IA Ativa' : 'IA Pausada'}
          </span>
          <button
            onClick={onToggleAI}
            className={`ml-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              aiActive 
                ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {aiActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <Badge className="bg-white/20 text-white border-0">
              Total
            </Badge>
          </div>
          <div className="text-4xl font-bold mb-1">{totalLeads}</div>
          <div className="text-blue-100 text-sm">Total de Leads</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 opacity-80" />
            <Badge className="bg-white/20 text-white border-0">
              🔥 Atenção
            </Badge>
          </div>
          <div className="text-4xl font-bold mb-1">{hotLeads}</div>
          <div className="text-orange-100 text-sm">Leads Quentes</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8 opacity-80" />
            <Badge className="bg-white/20 text-white border-0">
              Em andamento
            </Badge>
          </div>
          <div className="text-4xl font-bold mb-1">{inConversation}</div>
          <div className="text-purple-100 text-sm">Em Conversa</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 opacity-80" />
            <Badge className="bg-white/20 text-white border-0">
              Prontos!
            </Badge>
          </div>
          <div className="text-4xl font-bold mb-1">{handovers}</div>
          <div className="text-green-100 text-sm">Prontos p/ Você</div>
        </Card>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium">Taxa de Conversão</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-1">{conversionRate}%</div>
          <div className="text-sm text-gray-600">Cold → Hot</div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${conversionRate}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-medium">Score Médio</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-1">{avgScore}</div>
          <div className="text-sm text-gray-600">de 100 pontos</div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
              style={{ width: `${avgScore}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-medium">Atividades Hoje</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">{todayActivities}</div>
          <div className="text-sm text-gray-600">Ações da IA</div>
        </Card>
      </div>

      {/* Widget de Sugestões Inteligentes da IA */}
      <AISuggestionsWidget leads={leads} onLeadUpdate={onLeadUpdate} />

      {/* INVERTIDO: Phone Enrichment Widget & Atividade da IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* BLOCO 1: Atividade da IA em Tempo Real (ANTES ERA O SEGUNDO) */}
        <LiveAIActivity detailed={true} />
        
        {/* BLOCO 2: Validação de Telefones (ANTES ERA O PRIMEIRO) */}
        <PhoneEnrichmentWidget leads={leads} />
      </div>

      {/* Estatísticas em Tempo Real - Card Expandido */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Estatísticas em Tempo Real
          </CardTitle>
          <CardDescription>
            Acompanhe o desempenho da IA a cada segundo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RealtimeStats compact={false} />
        </CardContent>
      </Card>

      {/* Quick Action: Gerar Link de Acesso */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 transition-colors">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                  Compartilhar Plataforma com Cliente
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Protegido
                  </Badge>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Gere um link exclusivo e temporário com proteções avançadas
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAccessTokenModal(true)}
              size="lg"
              className="gap-2 w-full sm:w-auto"
            >
              <Link2 className="w-4 h-4" />
              Gerar Link Protegido
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <QuickAccessTokenModal 
        open={showAccessTokenModal}
        onOpenChange={setShowAccessTokenModal}
      />

      {/* Botão de Exportar Leads */}
      <Card className="border-2 border-dashed border-green-300 bg-green-50/50 hover:bg-green-50 transition-colors">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                  Exportar Leads
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Baixe seus leads em CSV, JSON ou Excel com todos os dados
                </p>
              </div>
            </div>
            <ExportLeadsButton 
              leads={leads}
              size="lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}