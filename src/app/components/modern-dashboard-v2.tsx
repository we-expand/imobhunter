import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { QuickAccessTokenModal } from './quick-access-token-modal';
import { Lead, Activity } from '../types';
import { PhoneEnrichmentWidget } from './phone-enrichment-widget';
import { LiveAIActivity } from './live-ai-activity';
import { AISuggestionsWidget } from './ai-suggestions-widget';
import { DashboardSocialOverview } from './dashboard-social-overview';
import { BentoGrid, BentoCard } from './ui/bento-grid';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  Zap,
  Mail,
  Phone,
  Play,
  Pause,
  Link2,
  Shield,
  Activity as ActivityIcon,
  BarChart3,
  ArrowUp,
  Sparkles
} from 'lucide-react';

interface ModernDashboardV2Props {
  clusters?: any[];
  leads: Lead[];
  activities: Activity[];
  aiActive: boolean;
  onToggleAI: () => void;
  onUpdateCluster?: (id: string, updates: any) => void;
  onLeadUpdate?: () => void;
}

export function ModernDashboardV2({ clusters, leads, activities, aiActive, onToggleAI, onUpdateCluster, onLeadUpdate }: ModernDashboardV2Props) {
  const [showAccessTokenModal, setShowAccessTokenModal] = useState(false);
  
  // 🎭 DADOS MOCKADOS COMPLETOS PARA DASHBOARD
  const useMockData = leads.length === 0;
  
  const mockLeads = useMockData ? [
    { id: '1', name: 'Maria Silva', company: 'Construtora ABC', status: 'hot' as const, score: 95, channel: 'whatsapp' as const },
    { id: '2', name: 'João Santos', company: 'Imóveis Premium', status: 'hot' as const, score: 92, channel: 'linkedin' as const },
    { id: '3', name: 'Carlos Mendes', company: 'Investimentos XYZ', status: 'in-conversation' as const, score: 88, channel: 'email' as const },
    { id: '4', name: 'Ana Costa', company: 'Família Costa', status: 'hot' as const, score: 90, channel: 'whatsapp' as const },
    { id: '5', name: 'Roberto Lima', company: 'Grupo Imobiliário', status: 'in-conversation' as const, score: 85, channel: 'linkedin' as const },
    { id: '6', name: 'Patricia Alves', company: 'Casa dos Sonhos', status: 'handover' as const, score: 78, channel: 'email' as const },
    { id: '7', name: 'Fernando Rocha', company: 'Investidor Individual', status: 'hot' as const, score: 94, channel: 'whatsapp' as const },
    { id: '8', name: 'Juliana Souza', company: 'Corretora Prime', status: 'in-conversation' as const, score: 82, channel: 'sms' as const },
    { id: '9', name: 'Ricardo Gomes', company: 'Família Gomes', status: 'hot' as const, score: 91, channel: 'whatsapp' as const },
    { id: '10', name: 'Beatriz Martins', company: 'Imóveis BH', status: 'in-conversation' as const, score: 80, channel: 'linkedin' as const },
    { id: '11', name: 'Paulo Ferreira', company: 'Investidor SP', status: 'hot' as const, score: 93, channel: 'email' as const },
    { id: '12', name: 'Camila Ribeiro', company: 'Construtora Moderna', status: 'handover' as const, score: 75, channel: 'whatsapp' as const },
    { id: '13', name: 'André Oliveira', company: 'Real Estate Pro', status: 'hot' as const, score: 89, channel: 'linkedin' as const },
    { id: '14', name: 'Gabriela Dias', company: 'Família Dias', status: 'in-conversation' as const, score: 83, channel: 'whatsapp' as const },
    { id: '15', name: 'Lucas Cardoso', company: 'Investimentos RJ', status: 'hot' as const, score: 96, channel: 'email' as const },
    { id: '16', name: 'Renata Barbosa', company: 'Luxo Imóveis', status: 'in-conversation' as const, score: 81, channel: 'sms' as const },
    { id: '17', name: 'Felipe Araújo', company: 'Corretor Premium', status: 'hot' as const, score: 87, channel: 'whatsapp' as const },
    { id: '18', name: 'Amanda Teixeira', company: 'Família Teixeira', status: 'handover' as const, score: 72, channel: 'linkedin' as const },
    { id: '19', name: 'Marcos Pereira', company: 'Grupo Invest', status: 'hot' as const, score: 92, channel: 'email' as const },
    { id: '20', name: 'Larissa Fernandes', company: 'Prime Properties', status: 'in-conversation' as const, score: 84, channel: 'whatsapp' as const },
    { id: '21', name: 'Thiago Moreira', company: 'Investidor Porto Alegre', status: 'hot' as const, score: 88, channel: 'linkedin' as const },
    { id: '22', name: 'Vanessa Campos', company: 'Família Campos', status: 'in-conversation' as const, score: 79, channel: 'whatsapp' as const },
    { id: '23', name: 'Diego Castro', company: 'Construtora Sul', status: 'hot' as const, score: 90, channel: 'email' as const },
    { id: '24', name: 'Tatiana Nunes', company: 'Corretora Elite', status: 'handover' as const, score: 76, channel: 'sms' as const },
    { id: '25', name: 'Gustavo Reis', company: 'Imóveis Brasília', status: 'hot' as const, score: 95, channel: 'whatsapp' as const },
  ] : leads;

  const mockActivities = useMockData ? [
    { id: 'a1', type: 'message_sent' as const, lead: 'Maria Silva', timestamp: new Date().toISOString(), channel: 'whatsapp' as const },
    { id: 'a2', type: 'email_sent' as const, lead: 'João Santos', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), channel: 'linkedin' as const },
    { id: 'a3', type: 'call_completed' as const, lead: 'Carlos Mendes', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(), channel: 'email' as const },
    { id: 'a4', type: 'message_sent' as const, lead: 'Ana Costa', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), channel: 'whatsapp' as const },
    { id: 'a5', type: 'email_sent' as const, lead: 'Roberto Lima', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), channel: 'linkedin' as const },
    { id: 'a6', type: 'message_sent' as const, lead: 'Patricia Alves', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), channel: 'email' as const },
    { id: 'a7', type: 'call_completed' as const, lead: 'Fernando Rocha', timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(), channel: 'whatsapp' as const },
    { id: 'a8', type: 'message_sent' as const, lead: 'Juliana Souza', timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(), channel: 'sms' as const },
    { id: 'a9', type: 'email_sent' as const, lead: 'Ricardo Gomes', timestamp: new Date(Date.now() - 1000 * 60 * 68).toISOString(), channel: 'whatsapp' as const },
    { id: 'a10', type: 'message_sent' as const, lead: 'Beatriz Martins', timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(), channel: 'linkedin' as const },
    { id: 'a11', type: 'call_completed' as const, lead: 'Paulo Ferreira', timestamp: new Date(Date.now() - 1000 * 60 * 88).toISOString(), channel: 'email' as const },
    { id: 'a12', type: 'message_sent' as const, lead: 'Camila Ribeiro', timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(), channel: 'whatsapp' as const },
    { id: 'a13', type: 'email_sent' as const, lead: 'André Oliveira', timestamp: new Date(Date.now() - 1000 * 60 * 105).toISOString(), channel: 'linkedin' as const },
    { id: 'a14', type: 'message_sent' as const, lead: 'Gabriela Dias', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), channel: 'whatsapp' as const },
    { id: 'a15', type: 'call_completed' as const, lead: 'Lucas Cardoso', timestamp: new Date(Date.now() - 1000 * 60 * 135).toISOString(), channel: 'email' as const },
  ] : activities;

  const activeLeads = mockLeads;
  const activeActivities = mockActivities;
  
  // Métricas calculadas
  const totalLeads = activeLeads.length;
  const hotLeads = activeLeads.filter(l => l.status === 'hot').length;
  const inConversation = activeLeads.filter(l => l.status === 'in-conversation').length;
  const handovers = activeLeads.filter(l => l.status === 'handover').length;
  
  const avgScore = totalLeads > 0 
    ? Math.round(activeLeads.reduce((sum, l) => sum + l.score, 0) / totalLeads)
    : 0;

  const todayActivities = activeActivities.filter(a => {
    const activityDate = new Date(a.timestamp).toDateString();
    const today = new Date().toDateString();
    return activityDate === today;
  }).length;

  const conversionRate = totalLeads > 0
    ? Math.round((hotLeads / totalLeads) * 100)
    : 0;

  const channelStats = {
    email: activeLeads.filter(l => l.channel === 'email').length,
    whatsapp: activeLeads.filter(l => l.channel === 'whatsapp').length,
    linkedin: activeLeads.filter(l => l.channel === 'linkedin').length,
    sms: activeLeads.filter(l => l.channel === 'sms').length
  };

  return (
    <div className="space-y-8">
      {/* Header Otimizado - Layout "Ethereal Premium" */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl py-9 px-8 rounded-3xl border border-white/5 shadow-2xl"
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Lado Esquerdo: Identidade Visual com Respiro */}
          <div className="flex items-center gap-6 w-full lg:w-auto justify-center lg:justify-start">
            {/* Logo Box */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.1)] group">
              <Sparkles className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-light tracking-tight text-white flex items-center gap-3">
                Command Center
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-serif italic pr-2">
                  Ethereal
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-indigo-500/50 to-transparent" />
                <p className="text-zinc-400 text-sm font-medium tracking-wide uppercase">
                  Central de Inteligência Autônoma
                </p>
              </div>
            </div>
          </div>
          
          {/* Lado Direito: Controle Neural */}
          <div className="flex items-center gap-5 bg-black/20 p-2 pr-3 rounded-full border border-white/5 backdrop-blur-md">
            
            {/* Status Indicator */}
            <div className="flex flex-col px-4 border-r border-white/10 min-w-[140px]">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-0.5">
                Neural Engine
              </span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${aiActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse' : 'bg-zinc-600'}`} />
                <span className={`text-sm font-medium ${aiActive ? 'text-white' : 'text-zinc-400'}`}>
                  {aiActive ? 'System Active' : 'System Paused'}
                </span>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={onToggleAI}
              className={`
                group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500
                ${aiActive 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40' 
                  : 'bg-zinc-800 hover:bg-zinc-700 border border-white/5'
                }
              `}
            >
              {aiActive ? (
                <Pause className="w-6 h-6 text-white fill-current" />
              ) : (
                <Play className="w-6 h-6 text-zinc-400 group-hover:text-white fill-current ml-1 transition-colors" />
              )}
            </button>
          </div>

        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <BentoGrid className="gap-4">
        {/* KPI: Total Leads */}
        <BentoCard className="md:col-span-1 bg-zinc-900/40 border-white/5 hover:border-white/10 transition-colors" delay={0.1}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
              <Users className="w-6 h-6" />
            </div>
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Total</Badge>
          </div>
          <div className="mt-auto">
            <h3 className="text-4xl font-bold text-white mb-1">{totalLeads}</h3>
            <p className="text-sm text-zinc-500">Leads monitorados</p>
          </div>
        </BentoCard>

        {/* KPI: Hot Leads */}
        <BentoCard className="md:col-span-1 bg-zinc-900/40 border-white/5 hover:border-white/10 transition-colors" delay={0.15}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <Badge variant="secondary" className="bg-rose-500/10 text-rose-400 border border-rose-500/20">Hot</Badge>
          </div>
          <div className="mt-auto">
            <h3 className="text-4xl font-bold text-white mb-1">{hotLeads}</h3>
            <p className="text-sm text-zinc-500">Alta prioridade</p>
          </div>
        </BentoCard>

        {/* KPI: In Conversation */}
        <BentoCard className="md:col-span-1 bg-zinc-900/40 border-white/5 hover:border-white/10 transition-colors" delay={0.2}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border border-purple-500/20">Active</Badge>
          </div>
          <div className="mt-auto">
            <h3 className="text-4xl font-bold text-white mb-1">{inConversation}</h3>
            <p className="text-sm text-zinc-500">Em negociação</p>
          </div>
        </BentoCard>

        {/* KPI: Handovers */}
        <BentoCard className="md:col-span-1 bg-zinc-900/40 border-white/5 hover:border-white/10 transition-colors" delay={0.25}>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
              <Target className="w-6 h-6" />
            </div>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ready</Badge>
          </div>
          <div className="mt-auto">
            <h3 className="text-4xl font-bold text-white mb-1">{handovers}</h3>
            <p className="text-sm text-zinc-500">Prontos p/ venda</p>
          </div>
        </BentoCard>

        {/* AI Suggestions - Tall Item */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2 md:row-span-1 h-full min-h-[200px]"
        >
           <AISuggestionsWidget leads={activeLeads} onLeadUpdate={onLeadUpdate} />
        </motion.div>

        {/* Live Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="col-span-1 md:col-span-2"
        >
            <LiveAIActivity detailed={true} />
        </motion.div>
        
        {/* Phone Enrichment */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 md:col-span-2"
        >
            <PhoneEnrichmentWidget leads={activeLeads} />
        </motion.div>

        {/* Secondary Metrics */}
        <BentoCard className="md:col-span-1 bg-zinc-900/40 border-white/5" delay={0.45}>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><TrendingUp className="w-5 h-5"/></div>
              <span className="font-medium text-zinc-300">Conversão</span>
           </div>
           <div className="text-3xl font-light text-white mb-2">{conversionRate}%</div>
           <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${conversionRate}%` }} />
           </div>
        </BentoCard>

        <BentoCard className="md:col-span-1 bg-zinc-900/40 border-white/5" delay={0.5}>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Target className="w-5 h-5"/></div>
              <span className="font-medium text-zinc-300">Avg Score</span>
           </div>
           <div className="text-3xl font-light text-white mb-2">{avgScore}</div>
           <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
             <div className="bg-purple-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${avgScore}%` }} />
           </div>
        </BentoCard>

        <BentoCard className="md:col-span-1 bg-zinc-900/40 border-white/5" delay={0.55}>
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><ActivityIcon className="w-5 h-5"/></div>
              <span className="font-medium text-zinc-300">Atividade</span>
           </div>
           <div className="text-3xl font-light text-white mb-2">{todayActivities}</div>
           <div className="text-xs text-zinc-500">Ações hoje</div>
        </BentoCard>

        {/* Quick Access */}
        <BentoCard className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-white/10" delay={0.6}>
           <div className="flex flex-col h-full justify-between">
             <div className="p-3 bg-white/10 rounded-2xl w-fit backdrop-blur-sm mb-4">
                <Link2 className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="font-medium text-lg mb-1">Acesso Cliente</h3>
               <p className="text-indigo-100/70 text-xs mb-4">Gerar link seguro</p>
               <Button 
                  onClick={() => setShowAccessTokenModal(true)}
                  size="sm" 
                  className="w-full bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm"
               >
                 Gerar Link
               </Button>
             </div>
           </div>
        </BentoCard>

        {/* Social Overview */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.65 }}
           className="col-span-1 md:col-span-2"
        >
           <DashboardSocialOverview />
        </motion.div>

        {/* Channel Distribution (Custom Bento Card) */}
        <BentoCard className="col-span-1 md:col-span-2 bg-zinc-900/40 border-white/5" delay={0.7}>
           <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-white/5 rounded-xl">
               <BarChart3 className="w-5 h-5 text-zinc-400" />
             </div>
             <h3 className="font-medium text-white">Canais de Aquisição</h3>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors">
                 <Mail className="w-5 h-5 text-indigo-400 mb-2" />
                 <div className="text-2xl font-light text-white">{channelStats.email}</div>
                 <div className="text-xs text-zinc-500">Email</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors">
                 <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
                 <div className="text-2xl font-light text-white">{channelStats.whatsapp}</div>
                 <div className="text-xs text-zinc-500">WhatsApp</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors">
                 <Users className="w-5 h-5 text-blue-400 mb-2" />
                 <div className="text-2xl font-light text-white">{channelStats.linkedin}</div>
                 <div className="text-xs text-zinc-500">LinkedIn</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/20 hover:bg-black/40 border border-white/5 transition-colors">
                 <Phone className="w-5 h-5 text-orange-400 mb-2" />
                 <div className="text-2xl font-light text-white">{channelStats.sms}</div>
                 <div className="text-xs text-zinc-500">SMS</div>
              </div>
           </div>
        </BentoCard>

      </BentoGrid>

      {/* Modal de Quick Access */}
      {showAccessTokenModal && (
        <QuickAccessTokenModal onClose={() => setShowAccessTokenModal(false)} />
      )}
    </div>
  );
}