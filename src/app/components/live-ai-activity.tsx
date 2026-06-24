import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AIHeadAnimation } from './ai-head-animation';
import { Brain, Zap, Mail, Phone, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIActivity {
  id: string;
  type: 'search' | 'email' | 'whatsapp' | 'qualify' | 'engage' | 'handover';
  message: string;
  timestamp: string;
  status: 'processing' | 'success' | 'pending';
  leadName?: string;
  cluster?: string;
}

interface LiveAIActivityProps {
  detailed?: boolean;
}

const activityTemplates = [
  { type: 'search', message: 'Buscando perfis no LinkedIn (máx. 5)', icon: Brain, color: 'text-blue-600' },
  { type: 'search', message: 'Encontrados 5 novos prospects', icon: Zap, color: 'text-green-600' },
  { type: 'email', message: 'Enviando email de approach inicial', icon: Mail, color: 'text-purple-600' },
  { type: 'whatsapp', message: 'Iniciando conversa no WhatsApp', icon: MessageSquare, color: 'text-green-600' },
  { type: 'qualify', message: 'Qualificando lead baseado em respostas', icon: TrendingUp, color: 'text-orange-600' },
  { type: 'engage', message: 'Respondendo pergunta do prospect', icon: MessageSquare, color: 'text-blue-600' },
  { type: 'handover', message: 'Lead qualificado! Preparando handover', icon: Zap, color: 'text-green-600' },
];

const clusters = ['Investidores', 'High-End', 'Parcerias', '1ª Habitação', 'Famílias'];
const leadNames = ['Ana Silva', 'Carlos Santos', 'Maria Costa', 'João Pereira', 'Rita Ferreira', 'Paulo Gomes', 'Sofia Alves'];

export function LiveAIActivity({ detailed = false }: LiveAIActivityProps) {
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [actionCount, setActionCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Verifica se IA está ativa
    const checkAIStatus = () => {
      const aiStatus = localStorage.getItem('ai-active');
      setIsActive(aiStatus === 'true');
    };

    checkAIStatus();
    const interval = setInterval(checkAIStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Gera atividade aleatória
    const generateActivity = () => {
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      const leadName = leadNames[Math.floor(Math.random() * leadNames.length)];
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];

      const newActivity: AIActivity = {
        id: `activity-${Date.now()}-${Math.random()}`,
        type: template.type as any,
        message: template.message,
        timestamp: new Date().toISOString(),
        status: 'processing',
        leadName,
        cluster,
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev];
        return detailed ? updated.slice(0, 20) : updated.slice(0, 5);
      });

      setActionCount(prev => prev + 1);

      // Muda status para success após 2 segundos
      setTimeout(() => {
        setActivities(prev => 
          prev.map(a => 
            a.id === newActivity.id 
              ? { ...a, status: 'success' as const }
              : a
          )
        );
      }, 2000);
    };

    // Gera atividade a cada 3-7 segundos
    const intervalTime = detailed ? 3000 : 5000;
    const randomDelay = Math.random() * 2000;
    
    const interval = setInterval(generateActivity, intervalTime + randomDelay);

    // Gera primeira atividade imediatamente
    generateActivity();

    return () => clearInterval(interval);
  }, [isActive, detailed]);

  const getIcon = (type: string) => {
    const template = activityTemplates.find(t => t.type === type);
    return template ? template.icon : Brain;
  };

  const getColor = (type: string) => {
    const template = activityTemplates.find(t => t.type === type);
    return template ? template.color : 'text-gray-600';
  };

  if (!isActive) {
    return (
      <Card className="border border-white/5 bg-zinc-900/40 backdrop-blur-sm shadow-xl relative overflow-hidden h-full">
        {/* Grid tecnológica no fundo */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px'
          }} />
        </div>
        
        {/* Linha de scan pausada - MAIS LENTA */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-30" 
             style={{ animation: 'scan-slow 6s linear infinite' }} />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            {/* Ícone em standby com pulso lento */}
            <div className="relative">
              <div className="w-12 h-12 bg-zinc-800/50 rounded-xl border border-white/10 flex items-center justify-center shadow-lg opacity-60">
                <Brain className="w-6 h-6 text-zinc-400" />
              </div>
              {/* Pulso lento - standby */}
              <div className="absolute inset-0 rounded-xl" style={{ animation: 'ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite' }}>
                <div className="w-full h-full border border-white/5 rounded-xl" />
              </div>
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-zinc-300">System Status</span>
                <Badge variant="outline" className="border-white/10 text-zinc-500 text-xs px-2 font-mono">
                  <Clock className="w-3 h-3 mr-1" />
                  STANDBY
                </Badge>
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-1">
                Awaiting manual activation override
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {/* Conteúdo vazio com animação */}
          <div className="text-center py-12">
            {/* Animação de IA com pulsos de energia */}
            <div className="flex justify-center mb-6 opacity-50">
              <AIHeadAnimation variant="pulse" size="xl" />
            </div>
            <p className="text-zinc-400 font-medium text-lg">Systems Offline</p>
            <p className="text-sm text-zinc-600 mt-2 max-w-xs mx-auto">
              Activate Neural Engine to begin autonomous prospecting
            </p>
            <p className="text-xs text-zinc-700 mt-4 font-mono">
              ⚡ 24/7 OPERATION CAPABILITY
            </p>
          </div>
        </CardContent>
        
        <style>{`
          @keyframes scan-slow {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes ping-slow {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </Card>
    );
  }

  return (
    <Card className="border border-white/5 bg-zinc-900/40 backdrop-blur-sm shadow-xl relative overflow-hidden h-full"> {/* Visual mais tecnológico */}
      {/* Efeito de grade tecnológica no fundo */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Linha de scan animada */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Ícone tecnológico com pulso */}
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
              {/* Anéis de pulso */}
              <div className="absolute inset-0 rounded-xl animate-ping-slow">
                <div className="w-full h-full border border-indigo-500/30 rounded-xl" />
              </div>
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-white">Live Activity</span>
                <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-2 font-mono animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5 font-mono">
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  RUNNING
                </span>
                <span className="text-zinc-700">•</span>
                <span>{actionCount} OPERATIONS EXECUTED</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 relative z-10 overflow-hidden">
        <div className="space-y-3 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {activities.map((activity) => {
              const Icon = getIcon(activity.type);
              
              // Cores adaptadas para Dark Mode
              const bgColors: Record<string, string> = {
                search: 'from-blue-600/20 to-cyan-600/20',
                email: 'from-purple-600/20 to-pink-600/20',
                whatsapp: 'from-emerald-600/20 to-green-600/20',
                qualify: 'from-orange-600/20 to-red-600/20',
                engage: 'from-indigo-600/20 to-violet-600/20',
                handover: 'from-teal-600/20 to-emerald-600/20',
              };
              
              const borderColors: Record<string, string> = {
                search: 'border-blue-500/30',
                email: 'border-purple-500/30',
                whatsapp: 'border-emerald-500/30',
                qualify: 'border-orange-500/30',
                engage: 'border-indigo-500/30',
                handover: 'border-teal-500/30',
              };

              const textColors: Record<string, string> = {
                search: 'text-blue-400',
                email: 'text-purple-400',
                whatsapp: 'text-emerald-400',
                qualify: 'text-orange-400',
                engage: 'text-indigo-400',
                handover: 'text-teal-400',
              };

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg border bg-zinc-900/50 backdrop-blur-md shadow-lg ${
                    borderColors[activity.type] || 'border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon com gradiente */}
                    <motion.div 
                      className={`p-2 rounded-lg bg-gradient-to-br ${bgColors[activity.type] || 'from-zinc-700 to-zinc-800'} border border-white/5`}
                      animate={{
                        rotate: activity.status === 'processing' ? 360 : 0,
                      }}
                      transition={{
                        duration: 2,
                        repeat: activity.status === 'processing' ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      <Icon className={`w-4 h-4 ${textColors[activity.type] || 'text-zinc-400'}`} />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-zinc-200">{activity.message}</p>
                        {activity.status === 'processing' && (
                          <div className="flex gap-1">
                            <motion.div
                              className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        )}
                      </div>
                      
                      {detailed && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {activity.leadName && (
                            <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-zinc-400 gap-1 font-mono">
                              👤 {activity.leadName}
                            </Badge>
                          )}
                          {activity.cluster && (
                            <Badge variant="outline" className="text-[10px] bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-mono">
                              {activity.cluster}
                            </Badge>
                          )}
                          <span className="text-[10px] text-zinc-600 flex items-center gap-1 font-mono ml-auto">
                            {new Date(activity.timestamp).toLocaleTimeString('pt-PT', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {activity.status === 'success' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-emerald-500/20 rounded-full p-1"
                      >
                        <Zap className="w-4 h-4 text-emerald-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {activities.length === 0 && (
            <div className="text-center py-12">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="inline-block"
              >
                <div className="w-12 h-12 bg-zinc-800/50 border border-white/10 rounded-xl flex items-center justify-center shadow-inner">
                  <Zap className="w-6 h-6 text-zinc-600" />
                </div>
              </motion.div>
              <p className="mt-4 font-semibold text-zinc-500 text-sm">Initializing Neural Networks...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}