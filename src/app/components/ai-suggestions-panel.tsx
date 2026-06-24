import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Brain, Lightbulb, TrendingUp, Target, X,
  Check, ChevronRight, AlertCircle, Zap, Star, Info,
  ThumbsUp, ThumbsDown, Loader2, Eye, EyeOff, BarChart3
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AISuggestion {
  id: string;
  userId: string;
  type: 'lead' | 'search_filter' | 'campaign' | 'insight';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  suggestedFilters?: any;
  suggestedLeads?: any[];
  confidence: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface UserPattern {
  userId: string;
  patterns: {
    mostSearchedJobTitles: { title: string; count: number }[];
    mostSearchedIndustries: { industry: string; count: number }[];
    mostSearchedLocations: { location: string; count: number }[];
    mostSearchedCompanies: { company: string; count: number }[];
    preferredSocialNetworks: string[];
    averageMatchScore: number;
    searchFrequency: number;
    conversionRate: number;
    lastAnalyzed: string;
  };
}

interface AISuggestionsPanelProps {
  userId: string;
  onApplySuggestion: (suggestion: AISuggestion) => void;
}

export function AISuggestionsPanel({ userId, onApplySuggestion }: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [patterns, setPatterns] = useState<UserPattern | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPatterns, setShowPatterns] = useState(false);

  // Buscar sugestões ao montar
  useEffect(() => {
    fetchSuggestions();
    fetchPatterns();
  }, [userId]);

  const fetchSuggestions = async () => {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-brain/suggestions/${userId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    }
  };

  const fetchPatterns = async () => {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-brain/analyze-patterns/${userId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatterns(data.patterns);
      }
    } catch (error) {
      console.error('Erro ao buscar padrões:', error);
    }
  };

  const generateNewSuggestions = async () => {
    setIsLoading(true);
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-brain/generate-suggestions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setPatterns(data.patterns);
        toast.success(`✨ ${data.suggestions?.length || 0} novas sugestões geradas!`);
      } else {
        toast.error('Erro ao gerar sugestões');
      }
    } catch (error: any) {
      console.error('Erro ao gerar sugestões:', error);
      toast.error('Erro ao gerar sugestões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = async (suggestion: AISuggestion) => {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-brain/suggestion/${suggestion.id}/respond`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId, action: 'accepted' })
      });

      if (response.ok) {
        // Remover da lista
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        
        // Aplicar sugestão
        onApplySuggestion(suggestion);
        
        toast.success('✅ Sugestão aplicada!', {
          description: suggestion.title
        });
      }
    } catch (error) {
      console.error('Erro ao aceitar sugestão:', error);
      toast.error('Erro ao aceitar sugestão');
    }
  };

  const handleRejectSuggestion = async (suggestion: AISuggestion) => {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-brain/suggestion/${suggestion.id}/respond`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ userId, action: 'rejected' })
      });

      if (response.ok) {
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        toast.info('Sugestão descartada');
      }
    } catch (error) {
      console.error('Erro ao rejeitar sugestão:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'search_filter': return Zap;
      case 'insight': return Lightbulb;
      case 'campaign': return Target;
      default: return Sparkles;
    }
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50"
      >
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-l-xl rounded-r-none shadow-lg"
        >
          <Brain className="w-5 h-5 mr-2" />
          AI Sugestões
          {suggestions.length > 0 && (
            <Badge className="ml-2 bg-white text-purple-600">
              {suggestions.length}
            </Badge>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">AI Cérebro</h2>
              <p className="text-xs text-gray-500">Sugestões Inteligentes</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={generateNewSuggestions}
            disabled={isLoading}
            size="sm"
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Novas
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPatterns(!showPatterns)}
          >
            {showPatterns ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Padrões do Usuário */}
      <AnimatePresence>
        {showPatterns && patterns && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800"
          >
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Seus Padrões de Busca
            </h3>
            
            <div className="space-y-2 text-xs">
              {patterns.patterns.mostSearchedJobTitles.length > 0 && (
                <div>
                  <span className="font-medium">Cargos mais buscados:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patterns.patterns.mostSearchedJobTitles.slice(0, 3).map((item, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {item.title} ({item.count}x)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patterns.patterns.preferredSocialNetworks.length > 0 && (
                <div>
                  <span className="font-medium">Redes preferidas:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patterns.patterns.preferredSocialNetworks.map((network, i) => (
                      <Badge key={i} className="text-xs bg-purple-500">
                        {network}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200">
                <div>
                  <span className="font-medium block">Buscas:</span>
                  <span className="text-blue-600">{patterns.patterns.searchFrequency}</span>
                </div>
                <div>
                  <span className="font-medium block">Conversão:</span>
                  <span className="text-green-600">{patterns.patterns.conversionRate}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Sugestões */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {suggestions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Nenhuma sugestão ainda
            </p>
            <Button
              onClick={generateNewSuggestions}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Gerar Sugestões
            </Button>
          </div>
        )}

        <AnimatePresence>
          {suggestions.map((suggestion, index) => {
            const TypeIcon = getTypeIcon(suggestion.type);
            
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow border-2 border-purple-100 dark:border-purple-800">
                  <CardContent className="p-4">
                    {/* Priority Badge */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-8 h-8 ${getPriorityColor(suggestion.priority)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {suggestion.description}
                        </p>
                      </div>

                      <Badge className={`${getPriorityColor(suggestion.priority)} text-white text-xs`}>
                        {suggestion.confidence}%
                      </Badge>
                    </div>

                    {/* Reasoning */}
                    <div className="mb-3 p-2 bg-gray-50 dark:bg-slate-900 rounded text-xs text-gray-600 dark:text-gray-400">
                      <Info className="w-3 h-3 inline mr-1" />
                      {suggestion.reasoning}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptSuggestion(suggestion)}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Aplicar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectSuggestion(suggestion)}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {suggestions.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <p className="text-xs text-center text-gray-500">
            <Sparkles className="w-3 h-3 inline mr-1" />
            {suggestions.length} sugestão{suggestions.length > 1 ? 'ões' : ''} pendente{suggestions.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </motion.div>
  );
}
