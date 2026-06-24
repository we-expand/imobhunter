import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Layout, 
  Search, 
  GitPullRequest, 
  Bug, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  TrendingUp,
  Lightbulb,
  Globe,
  Wallet,
  FileText,
  Bot
} from 'lucide-react';
import { useDevLabStore } from '../hooks/useDevLabStore';
import { DevLabCategory, DevLabSuggestion } from '../types/devlab';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

export function DevLab() {
  const { suggestions, removeSuggestion, completeSuggestion, reset } = useDevLabStore();
  const [selectedCategory, setSelectedCategory] = useState<DevLabCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // AUTO-REPARO: Verifica integridade ao carregar
  React.useEffect(() => {
    const totalCount = suggestions.length;
    // Se tiver menos de 300 itens, força regeneração
    if (totalCount < 300) {
      console.log("Database incompleto detectado pela UI. Forçando reset...");
      reset();
    }
  }, [suggestions.length, reset]);

  // Estado para o Modal de Detalhes
  const [selectedItem, setSelectedItem] = useState<DevLabSuggestion | null>(null);

  const categories: { id: DevLabCategory | 'ALL'; label: string; icon: any }[] = [
    { id: 'ALL', label: 'Todas as Categorias', icon: Globe },
    { id: 'TRADING', label: 'Trading System', icon: Wallet },
    { id: 'TECH', label: 'Tecnologia', icon: Cpu },
    { id: 'UX', label: 'UX / Design', icon: Layout },
    { id: 'FEATURE', label: 'Funcionalidades', icon: Zap },
    { id: 'COMPETITION', label: 'Concorrência', icon: TrendingUp },
    { id: 'INNOVATION', label: 'Inovação', icon: Lightbulb },
  ];

  const filteredSuggestions = suggestions.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedSuggestions = filteredSuggestions;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      case 'MEDIUM': return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30';
      case 'LOW': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/50">
      {/* Header do Terminal */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-md shadow-lg shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
              AI Dev Advisor
              <Badge variant="outline" className="text-xs font-normal border-indigo-200 text-indigo-700 bg-indigo-50">PRO</Badge>
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              Análise competitiva e sugestões estratégicas
              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                DB: {suggestions.length} items
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar insights..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-md w-64 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={reset} title="Atualizar Base de Dados">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navegação de Categorias */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4">
        <Tabs 
          value={selectedCategory} 
          onValueChange={(v) => setSelectedCategory(v as any)} 
          className="w-full"
        >
          <TabsList className="bg-transparent h-auto p-0 flex gap-4 overflow-x-auto no-scrollbar justify-start w-full">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:shadow-none rounded-none px-2 py-3 bg-transparent text-slate-500 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-none"
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
                <span className="ml-1 text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-500">
                  {cat.id === 'ALL' ? filteredSuggestions.length : filteredSuggestions.filter(i => i.category === cat.id).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Lista de Sugestões (Rolagem Nativa) */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-950">
        <div className="mb-4 flex items-center justify-between">
           <p className="text-sm font-medium text-slate-500">
             Exibindo {displayedSuggestions.length} resultados
           </p>
        </div>

        <div className="grid grid-cols-1 gap-3 pb-20">
          {displayedSuggestions.map((item) => (
            <Card key={item.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedItem(item)}
            >
              {/* Barra lateral colorida baseada no impacto */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                item.impact === 'HIGH' ? 'bg-red-500' : 
                item.impact === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'
              }`} />

              <div className="flex-1 min-w-0 pr-4 pl-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="secondary" className="font-semibold text-[10px] uppercase tracking-wider bg-slate-100 text-slate-600">
                    {item.category}
                  </Badge>
                  {item.category === 'COMPETITION' && (
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0 text-[10px]">
                      MARKET ALERT
                    </Badge>
                  )}
                  {item.category === 'INNOVATION' && (
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0 text-[10px]">
                      OPORTUNIDADE
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botão de Ver Detalhes (Hover) */}
              <div className="flex flex-col items-end gap-2 mt-4 md:mt-0 pl-4 border-l border-dashed border-slate-200 dark:border-slate-800">
                 <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Prioridade</div>
                 <div className={`text-xs font-bold px-2 py-1 rounded ${getImpactColor(item.impact)}`}>
                    {item.impact}
                 </div>
                 <Button variant="ghost" size="sm" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 mt-1">
                    Ver Análise
                 </Button>
              </div>
            </Card>
          ))}
          
          {displayedSuggestions.length === 0 && (
             <div className="text-center py-20 text-slate-400">
               <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
               <p className="font-medium">Nenhum insight encontrado para esta query.</p>
               <Button variant="link" onClick={reset}>Gerar Novos Insights</Button>
             </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALHES (AI CONSULTANT) */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{selectedItem?.category}</Badge>
              <span className="text-sm text-slate-500">ID: {selectedItem?.id}</span>
            </div>
            <DialogTitle className="text-2xl">{selectedItem?.title}</DialogTitle>
            <DialogDescription className="text-base text-slate-600 dark:text-slate-300 mt-2">
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-100 dark:border-slate-700 mt-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
              <Bot className="w-5 h-5 text-indigo-600" />
              Análise da Inteligência Artificial
            </h4>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedItem?.fullAnalysis}
            </div>
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                if(selectedItem) removeSuggestion(selectedItem.id);
                setSelectedItem(null);
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Descartar e Gerar Nova
            </Button>
            <Button 
              onClick={() => {
                if(selectedItem) completeSuggestion(selectedItem.id);
                setSelectedItem(null);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aceitar e Enviar para Backlog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
