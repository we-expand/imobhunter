import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Lightbulb, 
  X,
  Brain,
  Info,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Target,
  MapPin,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { aiLearning } from '../lib/ai-learning';
import { storage } from '../lib/storage-service';
import { Lead } from '../types';

interface LeadSuggestion {
  lead: Lead;
  reason: string;
  confidence: number;
}

interface AISuggestionsWidgetProps {
  leads: Lead[];
  onLeadUpdate?: () => void;
}

export function AISuggestionsWidget({ leads, onLeadUpdate }: AISuggestionsWidgetProps) {
  const [suggestions, setSuggestions] = useState<LeadSuggestion[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [learningStats, setLearningStats] = useState(aiLearning.getLearningStats());
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useState<NodeJS.Timeout | null>(null);

  // Gera sugestões
  useEffect(() => {
    const aiSuggestions = aiLearning.generateSuggestions(leads, 3);
    
    // Transforma formato da IA para formato do widget
    const transformedSuggestions: LeadSuggestion[] = aiSuggestions.map(s => ({
      lead: s.lead,
      reason: s.reasons[0] || 'Perfil interessante',
      confidence: s.confidenceScore
    }));
    
    setSuggestions(transformedSuggestions);
    setLearningStats(aiLearning.getLearningStats());
  }, [leads]);

  // Detecta quando usuário está scrollando
  const handleScroll = () => {
    setIsScrolling(true);
    
    // Limpa timeout anterior se existir
    if (scrollTimeoutRef[0]) {
      clearTimeout(scrollTimeoutRef[0]);
    }
    
    // Define novo timeout para voltar ao estado normal após parar de scrollar
    scrollTimeoutRef[0] = setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // Volta ao normal após 1 segundo sem scroll
  };

  // Feedback positivo
  const handleLike = (suggestion: LeadSuggestion) => {
    aiLearning.learnFromPositiveAction(suggestion.lead, 'like');
    toast.success('✅ IA aprendeu que você gosta deste perfil!');
    
    // Atualiza sugestões
    const aiSuggestions = aiLearning.generateSuggestions(leads, 3);
    const transformedSuggestions: LeadSuggestion[] = aiSuggestions.map(s => ({
      lead: s.lead,
      reason: s.reasons[0] || 'Perfil interessante',
      confidence: s.confidenceScore
    }));
    setSuggestions(transformedSuggestions);
    setLearningStats(aiLearning.getLearningStats());
  };

  // Feedback negativo
  const handleDislike = (suggestion: LeadSuggestion) => {
    aiLearning.learnFromNegativeAction(suggestion.lead, 'dislike');
    toast.info('👎 IA aprendeu que você não se interessa por este perfil');
    
    // Remove da lista e busca nova sugestão
    const aiSuggestions = aiLearning.generateSuggestions(leads, 3);
    const transformedSuggestions: LeadSuggestion[] = aiSuggestions.map(s => ({
      lead: s.lead,
      reason: s.reasons[0] || 'Perfil interessante',
      confidence: s.confidenceScore
    }));
    setSuggestions(transformedSuggestions);
    setLearningStats(aiLearning.getLearningStats());
  };

  // Aceitar lead (move para hot)
  const handleAccept = (suggestion: LeadSuggestion) => {
    storage.updateLead(suggestion.lead.id, {
      status: 'hot',
      score: Math.min(suggestion.lead.score + 20, 100)
    });
    
    aiLearning.learnFromPositiveAction(suggestion.lead, 'engage');
    toast.success(`🔥 ${suggestion.lead.name} movido para Leads Quentes!`);
    
    if (onLeadUpdate) onLeadUpdate();
    
    // Atualiza sugestões
    const aiSuggestions = aiLearning.generateSuggestions(leads, 3);
    const transformedSuggestions: LeadSuggestion[] = aiSuggestions.map(s => ({
      lead: s.lead,
      reason: s.reasons[0] || 'Perfil interessante',
      confidence: s.confidenceScore
    }));
    setSuggestions(transformedSuggestions);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 80) return 'Altíssima Confiança';
    if (score >= 60) return 'Alta Confiança';
    if (score >= 40) return 'Confiança Média';
    return 'Explorando Perfil';
  };

  return (
    <Card className="border border-white/5 bg-zinc-900/90 shadow-xl relative overflow-hidden h-full">
      {/* Grid tecnológica no fundo */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      {/* Linha de scan animada - MAIS LENTA */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" 
           style={{ animation: 'scan 4s linear infinite' }} />
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Ícone tech com anéis pulsantes */}
            <div className="relative">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              {/* Pulso externo - MAIS LENTO */}
              <div className="absolute inset-0 rounded-xl" style={{ animation: 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite' }}>
                <div className="w-full h-full border border-indigo-500/30 rounded-xl" />
              </div>
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-white font-bold tracking-tight">
                  AI Suggestions
                </span>
                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-1.5 py-0.5 tracking-wider font-mono">
                  BETA 2.0
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1.5 flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-emerald-400">ONLINE</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-500">Learning Mode</span>
              </CardDescription>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExplanation(!showExplanation)}
            className="gap-2 text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>

        {/* Explicação */}
        {showExplanation && (
          <div className="mt-4 p-4 bg-black/70 rounded-xl border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                <Brain className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-sm space-y-2">
                <p className="font-medium text-white">Neural Learning Protocol:</p>
                <ul className="space-y-1 text-zinc-400 text-xs font-mono">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Positive Reinforcement: Accept/Handover</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Explicit Feedback: Like/Dislike actions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>Context: Cluster, Role, Company, Score</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      {/* Container com fade masks */}
      <div className="relative">
        <CardContent className={`overflow-y-auto max-h-[250px] pr-2 custom-scrollbar ${isScrolling ? 'is-scrolling' : ''}`} onScroll={handleScroll}>
          {/* Sugestões */}
          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              {/* 🎨 ILUSTRAÇÃO INTELIGENTE E GRANDE DA IA */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  {/* Círculos concêntricos animados */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full border border-indigo-500/20 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                    <div className="absolute w-24 h-24 rounded-full border border-blue-500/20 animate-ping opacity-30" style={{ animationDuration: '2.5s' }} />
                  </div>
                  
                  {/* Cérebro principal com gradiente */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 rounded-full border border-white/10 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
                      
                      {/* Partículas flutuantes */}
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                      <div className="absolute bottom-2 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-zinc-400 font-medium text-base">Learning Mode Active</p>
              <p className="text-xs text-zinc-600 mt-1.5 max-w-xs mx-auto">
                Interaja com leads (accept, handover, like) para treinar a IA
              </p>
              <p className="text-[10px] text-zinc-700 mt-3 font-mono">
                {learningStats.totalInteractions} / 3 interações necessárias
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.lead.id}
                  className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{suggestion.lead.name}</h4>
                        <Badge variant="outline" className="text-[10px] border-white/10 text-zinc-500 font-mono">
                          #{index + 1}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-400">{suggestion.lead.jobTitle}</p>
                      <p className="text-xs text-zinc-600">{suggestion.lead.company}</p>
                    </div>
                    
                    <Badge className={`${getConfidenceColor(suggestion.confidence)} bg-opacity-10 border-opacity-20`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {suggestion.confidence}%
                    </Badge>
                  </div>

                  {/* Detalhes */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Target className="w-3 h-3 text-zinc-600" />
                      <span>{suggestion.lead.cluster}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <TrendingUp className="w-3 h-3 text-zinc-600" />
                      <span>Score: {suggestion.lead.score}</span>
                    </div>
                    {suggestion.lead.location && (
                      <div className="flex items-center gap-1 text-zinc-500">
                        <MapPin className="w-3 h-3 text-zinc-600" />
                        <span className="truncate">{suggestion.lead.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-zinc-500 capitalize">
                      <Mail className="w-3 h-3 text-zinc-600" />
                      <span>{suggestion.lead.channel}</span>
                    </div>
                  </div>

                  {/* Por que foi sugerido */}
                  <div className="mb-3 p-2 bg-indigo-500/5 border border-indigo-500/10 rounded text-xs">
                    <p className="font-medium text-indigo-300 mb-1 font-mono text-[10px] uppercase">
                      Analysis:
                    </p>
                    <ul className="space-y-0.5">
                      <li className="text-zinc-400 flex items-start gap-1">
                        <span className="text-indigo-500">•</span>
                        <span>{suggestion.reason}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLike(suggestion)}
                      className="flex-1 gap-1 border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 h-8 text-xs"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDislike(suggestion)}
                      className="flex-1 gap-1 border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 h-8 text-xs"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAccept(suggestion)}
                      className="flex-1 gap-1 bg-indigo-600 hover:bg-indigo-500 text-white border-0 h-8 text-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
      
      <style>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        /* SCROLLBAR INTELIGENTE - COR HEXADECIMAL SÓLIDA DO LOGO */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6366F14D transparent;
        }
        
        .custom-scrollbar.is-scrolling {
          scrollbar-color: #6366F1 transparent;
        }
        
        /* Webkit browsers (Chrome, Safari, Edge) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        /* ESTADO IDLE - Invisível */
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 999px;
          transition: background 0.3s ease;
        }
        
        /* ESTADO HOVER CONTAINER - 30% opacidade */
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #6366F14D;
        }
        
        /* ESTADO HOVER DIRETO NO SCROLLBAR - 90% opacidade */
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366F1E6 !important;
          box-shadow: 0 0 10px #6366F180;
        }
        
        /* ESTADO SCROLLING ATIVO - 100% SÓLIDO */
        .custom-scrollbar.is-scrolling::-webkit-scrollbar-thumb {
          background: #6366F1 !important;
          box-shadow: 0 0 12px #6366F199;
        }
        
        /* ESTADO ACTIVE/DRAGGING - 100% SÓLIDO */
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: #6366F1 !important;
          box-shadow: 0 0 15px #6366F1CC;
        }
      `}</style>
    </Card>
  );
}