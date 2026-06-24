import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { VibrantLinkedInSearch } from './vibrant-linkedin-search';
import { AdvancedCompanySearch } from './advanced-company-search';
import { ErrorBoundary } from './error-boundary';
import { SearchErrorBoundary } from './search-error-boundary';
import { User, Building2, Users, Briefcase, Sparkles, Target, Zap, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';

export function SearchWithTabs() {
  return (
    <SearchErrorBoundary>
      <ErrorBoundary>
        <div className="w-full space-y-8">
          {/* Header Premium com gradiente e badges */}
          <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-gray-200"> {/* Mudado para fundo branco e borda */}
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                <span className="text-sm font-semibold text-purple-700">
                  Sistema de Busca Inteligente
                </span>
              </div>
              
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> {/* Texto com gradiente */}
                Encontre Leads Perfeitos
              </h1>
              
              <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                Busque pessoas e empresas com filtros avançados, enriquecimento automático e inteligência artificial
              </p>

              {/* Stats rápidas */}
              <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-xl font-bold text-blue-600">24+</span> {/* Número azul */}
                  </div>
                  <p className="text-xs text-gray-700">Filtros Pessoas</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-xl font-bold text-purple-600">30+</span> {/* Número roxo */}
                  </div>
                  <p className="text-xs text-gray-700">Filtros Empresas</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3 border border-pink-200">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-pink-600" />
                    <span className="text-xl font-bold text-pink-600">12</span> {/* Número rosa */}
                  </div>
                  <p className="text-xs text-gray-700">APIs Integradas</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="people" className="w-full">
            {/* Tabs redesenhadas com visual premium - TAMANHO REDUZIDO */}
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-2 p-1 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-lg shadow-md max-w-md w-full h-auto">
                <TabsTrigger 
                  value="people" 
                  className="gap-1.5 px-3 py-1.5 rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] font-semibold group"
                >
                  <div className="w-6 h-6 rounded-md bg-purple-100 group-data-[state=active]:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Users className="w-3 h-3 text-purple-600 group-data-[state=active]:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold flex items-center gap-1">
                      Buscar Pessoas
                      <TrendingUp className="w-2.5 h-2.5 opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[9px] opacity-70 mt-0.5">
                      Encontre profissionais ideais
                    </div>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="companies" 
                  className="gap-1.5 px-3 py-1.5 rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] font-semibold group"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-100 group-data-[state=active]:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-sm">
                    <Building2 className="w-3 h-3 text-blue-600 group-data-[state=active]:text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold flex items-center gap-1">
                      Buscar Empresas
                      <Sparkles className="w-2.5 h-2.5 opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-[9px] opacity-70 mt-0.5">
                      Descubra organizações alvo
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="people" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <VibrantLinkedInSearch />
            </TabsContent>

            <TabsContent value="companies" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <AdvancedCompanySearch />
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
    </SearchErrorBoundary>
  );
}