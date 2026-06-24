import React, { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Building2, Users, Sparkles, Target, Zap, TrendingUp, Globe, Loader2 } from 'lucide-react';
import { VibrantLinkedInSearch } from './vibrant-linkedin-search';
import { AdvancedCompanySearch } from './advanced-company-search';
import { SocialMediaSearch } from './social-media-search';
import { QuickApolloConfig } from './quick-apollo-config'; // 🔥 NOVO: Configuração rápida do Apollo

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-3" />
        <p className="text-gray-600">Carregando busca...</p>
      </div>
    </div>
  );
}

export function SearchWithTabsSafe() {
  return (
    <div className="w-full space-y-8">
      {/* 🔥 NOVO: Banner de configuração do Apollo */}
      <QuickApolloConfig />

      {/* Header Premium com gradiente e badges */}
      <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-gray-200">
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            <span className="text-sm font-semibold text-purple-700">
              Sistema de Busca Inteligente
            </span>
          </div>
          
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Encontre Leads Perfeitos
          </h1>
          
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Busque pessoas, empresas e perfis sociais com filtros avançados e inteligência artificial
          </p>

          {/* Stats rápidas */}
          <div className="grid grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">24+</span>
              </div>
              <p className="text-xs text-gray-700">Filtros Pessoas</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span className="text-xl font-bold text-purple-600">30+</span>
              </div>
              <p className="text-xs text-gray-700">Filtros Empresas</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-3 border border-pink-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-pink-600" />
                <span className="text-xl font-bold text-pink-600">5</span>
              </div>
              <p className="text-xs text-gray-700">Redes Sociais</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-xl font-bold text-orange-600">12</span>
              </div>
              <p className="text-xs text-gray-700">APIs Integradas</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="people" className="w-full">
        {/* Tabs redesenhadas com visual premium - AGORA COM 3 TABS */}
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-3 p-1 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-lg shadow-md max-w-3xl w-full h-auto">
            <TabsTrigger 
              value="people" 
              className="gap-1.5 px-3 py-1.5 rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] font-semibold group"
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
              className="gap-1.5 px-3 py-1.5 rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] font-semibold group"
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

            <TabsTrigger 
              value="social" 
              className="gap-1.5 px-3 py-1.5 rounded-md data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-600 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-pink-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] font-semibold group"
            >
              <div className="w-6 h-6 rounded-md bg-pink-100 group-data-[state=active]:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-sm">
                <Globe className="w-3 h-3 text-pink-600 group-data-[state=active]:text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold flex items-center gap-1">
                  Redes Sociais
                  <Zap className="w-2.5 h-2.5 opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                </div>
                <div className="text-[9px] opacity-70 mt-0.5">
                  5 plataformas globais
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="people" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <VibrantLinkedInSearch />
          </Suspense>
        </TabsContent>

        <TabsContent value="companies" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <AdvancedCompanySearch />
          </Suspense>
        </TabsContent>

        <TabsContent value="social" className="animate-in fade-in-from-bottom-4 duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <SocialMediaSearch />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}