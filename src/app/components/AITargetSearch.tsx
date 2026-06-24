import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Users,
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Target,
  ChevronDown,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  Linkedin,
  Database,
  Instagram,
  TrendingUp,
  Crosshair
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { realAPIService } from '../lib/real-api-service';
import { toast } from 'sonner@2.0.3';
import { SocialMediaSearch } from './SocialMediaSearch';
import { DemoDataBanner } from './DemoDataBanner';

type SearchMode = 'leads' | 'companies' | 'both';

type TabMode = 'apis' | 'social';

interface AITargetSearchProps {
  onNavigateToIntegrations?: () => void;
}

// Interface de filtros simplificada
interface SearchFilters {
  searchType: 'leads' | 'companies' | 'both';
  firstName?: string;
  lastName?: string;
  name?: string;
  jobTitle?: string;
  jobTitles?: string[];
  seniority?: string[];
  department?: string[];
  companyName?: string;
  currentCompany?: string[];
  pastCompany?: string[];
  industry?: string[];
  companySize?: string[];
  city?: string;
  country?: string[];
  region?: string[];
  keywords?: string;
  excludeKeywords?: string;
  skills?: string[];
  schools?: string[];
  revenue?: string[];
  fundingStage?: string[];
  technologies?: string[];
  hasEmail?: boolean;
  hasPhone?: boolean;
  hasLinkedIn?: boolean;
  emailStatus?: 'any' | 'verified' | 'risky' | 'invalid';
}

// Interface de resultado
interface SearchResult {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  title: string;
  companyName: string;
  companySize?: string;
  companyIndustry?: string;
  email?: string;
  emailStatus?: 'verified' | 'risky' | 'invalid' | 'unknown';
  phone?: string;
  linkedinUrl?: string;
  city?: string;
  country?: string;
  source: 'apollo' | 'proxycurl' | 'conflated';
  confidence: number;
  lastUpdated?: string;
  photoUrl?: string;
}

export function AITargetSearch({ onNavigateToIntegrations }: AITargetSearchProps = {}) {
  // Estados principais
  const [tabMode, setTabMode] = useState<TabMode>('apis');
  const [searchMode, setSearchMode] = useState<SearchMode>('leads');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // 🔥 NOVO: Status das APIs em tempo real
  const [apiStatus, setApiStatus] = useState<{
    apollo: 'checking' | 'online' | 'offline' | 'error';
    proxycurl: 'checking' | 'online' | 'offline' | 'error';
  }>({
    apollo: 'checking',
    proxycurl: 'checking'
  });
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [hasMore, setHasMore] = useState(false);
  
  // Estados de busca rápida
  const [quickSearch, setQuickSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Filtros - Estilo LinkedIn Sales Navigator
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'leads'
  });

  // Estados de UI
  const [expandedSection, setExpandedSection] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleSearch = async () => {
    // Verificar se tem Proxycurl ou Apollo configurado
    const currentApiStatus = realAPIService.getAPIStatus();
    if (!currentApiStatus.apollo.configured && !currentApiStatus.proxycurl.configured) {
      toast.error('❌ Nenhuma API configurada', {
        description: 'Configure Apollo ou Proxycurl para fazer buscas',
        duration: 6000
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      console.log('🔍 Iniciando busca REAL com filtros:', filters);
      console.log('📝 QuickSearch valor:', quickSearch);
      
      // ✅ APLICAR quickSearch aos filtros ANTES de processar
      let activeFilters = { ...filters };
      
      // Se tem quickSearch preenchido mas não está nos filtros, adicionar
      if (quickSearch.trim() && !activeFilters.keywords) {
        if (searchMode === 'leads') {
          activeFilters.keywords = quickSearch;
        } else if (searchMode === 'companies') {
          activeFilters.companyName = quickSearch;
        } else {
          activeFilters.keywords = quickSearch;
        }
        console.log('✅ QuickSearch aplicado aos filtros:', activeFilters);
      }
      
      // Preparar filtros para realAPIService
      const searchFilters: any = {};
      
      // Nome completo ou separado
      if (activeFilters.name) {
        searchFilters.name = activeFilters.name;
      }
      if (activeFilters.firstName || activeFilters.lastName) {
        searchFilters.firstName = activeFilters.firstName;
        searchFilters.lastName = activeFilters.lastName;
      }
      
      // Quick search - separar nome automaticamente
      if (activeFilters.keywords && !activeFilters.firstName && !activeFilters.lastName) {
        const parts = activeFilters.keywords.trim().split(' ');
        if (parts.length === 2) {
          searchFilters.firstName = parts[0];
          searchFilters.lastName = parts[1];
          console.log(`🔀 Nome separado: ${parts[0]} ${parts[1]}`);
        } else {
          searchFilters.name = activeFilters.keywords;
          console.log(`📛 Nome completo: ${activeFilters.keywords}`);
        }
      }
      
      // Cargo
      if (activeFilters.jobTitle) {
        searchFilters.title = activeFilters.jobTitle;
      }
      
      // Empresa
      if (activeFilters.companyName) {
        searchFilters.company = activeFilters.companyName;
      }
      if (activeFilters.currentCompany && activeFilters.currentCompany.length > 0) {
        searchFilters.company = activeFilters.currentCompany[0]; // Pegar primeira empresa
      }
      
      // Localização
      if (activeFilters.city) {
        searchFilters.location = activeFilters.city;
      }
      if (activeFilters.country && activeFilters.country.length > 0) {
        searchFilters.country = activeFilters.country[0]; // Pegar primeiro país
      }
      
      // Limites
      searchFilters.limit = pageSize;
      searchFilters.offset = (currentPage - 1) * pageSize;
      
      console.log('📤 Filtros processados:', searchFilters);
      
      // ✅ VALIDAÇÃO: Garantir que pelo menos um filtro foi preenchido
      const hasAnyFilter = !!(
        searchFilters.name ||
        searchFilters.firstName ||
        searchFilters.lastName ||
        searchFilters.title ||
        searchFilters.company ||
        searchFilters.location ||
        searchFilters.country
      );
      
      if (!hasAnyFilter) {
        // Se não tem filtros, fazer busca genérica de "CEO" como exemplo
        console.warn('⚠️ Nenhum filtro preenchido, usando busca genérica padrão');
        toast.info('🔍 Buscando leads de exemplo...', {
          description: 'Preencha filtros para busca personalizada',
          duration: 4000
        });
        searchFilters.title = 'CEO'; // Busca padrão
      }
      
      // Busca REAL com realAPIService
      const leadResults = await realAPIService.search(searchFilters);

      console.log('✅ Resultados recebidos:', leadResults);

      // Converter LeadData[] para SearchResult[]
      const convertedResults: SearchResult[] = leadResults.map(lead => ({
        id: lead.id,
        fullName: lead.name,
        firstName: lead.firstName,
        lastName: lead.lastName,
        title: lead.title,
        companyName: lead.company,
        companySize: lead.companySize,
        companyIndustry: lead.industry,
        email: lead.email,
        emailStatus: lead.dataQuality.emailVerified ? 'verified' : 'unknown',
        phone: lead.phone,
        linkedinUrl: lead.linkedinUrl,
        city: lead.location,
        country: lead.country,
        source: lead.source as any,
        confidence: lead.confidence,
        lastUpdated: lead.lastUpdated,
        photoUrl: lead.avatar
      }));

      setResults(convertedResults);
      setTotalResults(convertedResults.length);
      setHasMore(convertedResults.length >= pageSize);

      if (convertedResults.length === 0) {
        toast.info('🔍 Nenhum resultado encontrado', {
          description: 'Tente ajustar seus filtros de busca. Use termos mais amplos ou remova alguns filtros.',
          duration: 6000
        });
      } else {
        // Contar fontes
        const sources = [...new Set(convertedResults.map(r => r.source))];
        const sourcesText = sources.length > 0 ? ` via ${sources.join(', ')}` : '';
        
        toast.success(`🎯 ${convertedResults.length} leads encontrados!`, {
          description: `Total de ${convertedResults.length} resultados${sourcesText}`,
          duration: 5000
        });
      }

    } catch (error) {
      console.error('❌ Erro na busca:', error);
      toast.error('Erro ao buscar leads', {
        description: error instanceof Error ? error.message : 'Verifique suas credenciais de API e tente novamente',
        duration: 6000
      });
    } finally {
      setIsSearching(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const addToArrayFilter = (key: keyof SearchFilters, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = (filters[key] as string[]) || [];
    if (!currentArray.includes(value)) {
      updateFilter(key, [...currentArray, value]);
    }
  };

  const removeFromArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    updateFilter(key, currentArray.filter(v => v !== value));
  };

  const clearAllFilters = () => {
    setFilters({ searchType: searchMode });
    setResults([]);
  };

  // Quick Search Handler
  const handleQuickSearch = () => {
    if (!quickSearch.trim()) {
      toast.error('Digite algo para buscar');
      return;
    }

    // Aplica busca rápida nos filtros apropriados
    if (searchMode === 'leads') {
      updateFilter('keywords', quickSearch);
    } else if (searchMode === 'companies') {
      updateFilter('companyName', quickSearch);
    } else {
      updateFilter('keywords', quickSearch);
    }

    // Executa busca
    handleSearch();
  };

  const quickSearchSuggestions = [
    { label: 'CEO de Startups', icon: Briefcase, query: 'CEO startup founder' },
    { label: 'Diretores de Marketing', icon: TrendingUp, query: 'Marketing Director CMO' },
    { label: 'VP de Vendas', icon: Users, query: 'VP Sales' },
    { label: 'Tech Companies', icon: Building2, query: 'Technology Software' }
  ];

  // ==========================================
  // COMPONENTES DE FILTROS
  // ==========================================

  const FilterSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSection === id;

    return (
      <div className="border border-white/10 rounded-lg overflow-hidden bg-zinc-900/40">
        <button
          onClick={() => setExpandedSection(isExpanded ? '' : id)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-white">{title}</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/10"
            >
              <div className="p-4 space-y-3">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ArrayInput = ({ 
    label, 
    filterKey, 
    placeholder 
  }: { 
    label: string; 
    filterKey: keyof SearchFilters; 
    placeholder: string;
  }) => {
    const [inputValue, setInputValue] = useState('');
    const values = (filters[filterKey] as string[]) || [];

    return (
      <div>
        <label className="text-xs text-zinc-400 mb-2 block">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addToArrayFilter(filterKey, inputValue);
                setInputValue('');
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <Button
            onClick={() => {
              addToArrayFilter(filterKey, inputValue);
              setInputValue('');
            }}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.map((value, idx) => (
              <Badge 
                key={idx} 
                className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 pr-1"
              >
                {value}
                <button
                  onClick={() => removeFromArrayFilter(filterKey, value)}
                  className="ml-1 hover:bg-red-500/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TextInput = ({
    label,
    filterKey,
    placeholder
  }: {
    label: string;
    filterKey: keyof SearchFilters;
    placeholder: string;
  }) => (
    <div>
      <label className="text-xs text-zinc-400 mb-2 block">{label}</label>
      <input
        type="text"
        value={(filters[filterKey] as string) || ''}
        onChange={(e) => updateFilter(filterKey, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
      />
    </div>
  );

  // ==========================================
  // RENDER PRINCIPAL
  // ==========================================

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-zinc-900/40 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Crosshair className="w-6 h-6 text-indigo-400" />
                AI Target Search
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Busca avançada
              </p>
            </div>

            {/* Badges de Status das APIs */}
            <div className="flex gap-2">
              {realAPIService.getAPIStatus().apollo.configured && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Database className="w-3 h-3 mr-1" />
                  Apollo
                </Badge>
              )}
              {realAPIService.getAPIStatus().proxycurl.configured && (
                <Badge className="bg-blue-400/20 text-blue-200 border-blue-400/30">
                  <Linkedin className="w-3 h-3 mr-1" />
                  LinkedIn
                </Badge>
              )}
              {!realAPIService.getAPIStatus().apollo.configured && !realAPIService.getAPIStatus().proxycurl.configured && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Modo Demo (Mock Data)
                </Badge>
              )}
            </div>
          </div>

          {/* Search Mode Selector */}
          <div className="flex gap-4 mb-6 items-center">
            {/* Tab Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setTabMode('apis')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  tabMode === 'apis'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <Database className="w-4 h-4" />
                APIs Search
              </button>
              <button
                onClick={() => setTabMode('social')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  tabMode === 'social'
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <Instagram className="w-4 h-4" />
                Social Media
              </button>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/10" />

            {/* Search Mode Selector - Only for APIs */}
            {tabMode === 'apis' && (
              <div className="flex gap-2">
                {(['leads', 'companies', 'both'] as SearchMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setSearchMode(mode);
                      updateFilter('searchType', mode);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      searchMode === mode
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {mode === 'leads' ? 'Pessoas' : mode === 'companies' ? 'Empresas' : 'Ambos'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SEARCH BOX - PROEMINENTE */}
          {/* Esconde o campo de busca quando está na aba Social Media */}
          {tabMode !== 'social' && (
            <div className="relative">
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleQuickSearch();
                      }
                    }}
                    placeholder={
                      searchMode === 'leads'
                        ? 'Buscar por nome, cargo, empresa, habilidades...'
                        : searchMode === 'companies'
                        ? 'Buscar por nome da empresa, setor, localização...'
                        : 'Buscar pessoas ou empresas...'
                    }
                    className="w-full pl-16 pr-32 py-5 bg-gradient-to-r from-zinc-800 to-zinc-900 border-2 border-white/10 rounded-2xl text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-xl"
                  />
                  <Button
                    onClick={handleQuickSearch}
                    disabled={isSearching}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Search Suggestions */}
                <AnimatePresence>
                  {searchFocused && quickSearch.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-3 border-b border-white/5">
                        <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold">
                          Sugestões Rápidas
                        </p>
                      </div>
                      <div className="p-2">
                        {quickSearchSuggestions.map((suggestion, idx) => {
                          const Icon = suggestion.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setQuickSearch(suggestion.query);
                                setSearchFocused(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{suggestion.label}</p>
                                <p className="text-xs text-zinc-500">{suggestion.query}</p>
                              </div>
                              <Sparkles className="w-4 h-4 text-indigo-400 ml-auto" />
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Quick Filters Applied */}
              {(filters.keywords || filters.jobTitle || filters.companyName) && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-zinc-500">Buscando por:</span>
                  {filters.keywords && (
                    <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                      {filters.keywords}
                    </Badge>
                  )}
                  {filters.jobTitle && (
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      Cargo: {filters.jobTitle}
                    </Badge>
                  )}
                  {filters.companyName && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      Empresa: {filters.companyName}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Renderização condicional baseada na aba */}
        {tabMode === 'social' ? (
          // Social Media Search - Componente completo
          <SocialMediaSearch />
        ) : (
          // APIs Search - Conteúdo original
          <>
            {/* Filtros Sidebar */}
            <div className="w-80 border-r border-white/10 bg-zinc-900/20 overflow-y-auto">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Filtros
                  </h3>
                  <Button
                    onClick={clearAllFilters}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Limpar
                  </Button>
                </div>

                {/* FILTROS DE PESSOA */}
                {(searchMode === 'leads' || searchMode === 'both') && (
                  <>
                    <FilterSection id="job" title="Cargo & Função" icon={Briefcase}>
                      <TextInput
                        label="Cargo Atual"
                        filterKey="jobTitle"
                        placeholder="Ex: CEO, Founder, VP Sales..."
                      />
                      
                      <ArrayInput
                        label="Múltiplos Cargos"
                        filterKey="jobTitles"
                        placeholder="Digite e pressione Enter"
                      />

                      <ArrayInput
                        label="Senioridade"
                        filterKey="seniority"
                        placeholder="C-Level, VP, Director, Manager..."
                      />

                      <ArrayInput
                        label="Departamento"
                        filterKey="department"
                        placeholder="Sales, Marketing, Engineering..."
                      />
                    </FilterSection>

                    <FilterSection id="company" title="Empresa" icon={Building2}>
                      <ArrayInput
                        label="Empresa Atual"
                        filterKey="currentCompany"
                        placeholder="Nome da empresa"
                      />

                      <ArrayInput
                        label="Empresa Anterior"
                        filterKey="pastCompany"
                        placeholder="Nome da empresa"
                      />

                      <ArrayInput
                        label="Setor/Indústria"
                        filterKey="industry"
                        placeholder="Technology, Finance, Real Estate..."
                      />
                    </FilterSection>

                    <FilterSection id="education" title="Educação & Skills" icon={GraduationCap}>
                      <ArrayInput
                        label="Habilidades"
                        filterKey="skills"
                        placeholder="Python, Sales, Marketing..."
                      />

                      <ArrayInput
                        label="Instituições"
                        filterKey="schools"
                        placeholder="Harvard, MIT, Stanford..."
                      />
                    </FilterSection>
                  </>
                )}

                {/* FILTROS DE EMPRESA */}
                {(searchMode === 'companies' || searchMode === 'both') && (
                  <>
                    <FilterSection id="company-details" title="Detalhes da Empresa" icon={Building2}>
                      <TextInput
                        label="Nome da Empresa"
                        filterKey="companyName"
                        placeholder="Nome completo ou parcial"
                      />

                      <ArrayInput
                        label="Tamanho da Empresa"
                        filterKey="companySize"
                        placeholder="1-10, 11-50, 51-200, 201-500, 501+..."
                      />

                      <ArrayInput
                        label="Receita Anual"
                        filterKey="revenue"
                        placeholder="<1M, 1M-10M, 10M-50M, 50M+..."
                      />

                      <ArrayInput
                        label="Estágio de Funding"
                        filterKey="fundingStage"
                        placeholder="Seed, Series A, Series B, IPO..."
                      />
                    </FilterSection>

                    <FilterSection id="tech-stack" title="Tecnologias" icon={Sparkles}>
                      <ArrayInput
                        label="Tech Stack"
                        filterKey="technologies"
                        placeholder="React, Salesforce, HubSpot..."
                      />
                    </FilterSection>
                  </>
                )}

                {/* FILTROS DE LOCALIZAÇÃO */}
                <FilterSection id="location" title="Localização" icon={MapPin}>
                  <ArrayInput
                    label="País"
                    filterKey="country"
                    placeholder="Brazil, United States, Portugal..."
                  />

                  <TextInput
                    label="Cidade"
                    filterKey="city"
                    placeholder="São Paulo, New York, Lisboa..."
                  />

                  <ArrayInput
                    label="Região/Estado"
                    filterKey="region"
                    placeholder="California, SP, Rio de Janeiro..."
                  />
                </FilterSection>

                {/* FILTROS DE CONTATO */}
                <FilterSection id="contact" title="Dados de Contato" icon={Mail}>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasEmail || false}
                        onChange={(e) => updateFilter('hasEmail', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-zinc-800"
                      />
                      Tem Email Verificado
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasPhone || false}
                        onChange={(e) => updateFilter('hasPhone', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-zinc-800"
                      />
                      Tem Telefone
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasLinkedIn || false}
                        onChange={(e) => updateFilter('hasLinkedIn', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-zinc-800"
                      />
                      Tem LinkedIn
                    </label>
                  </div>
                </FilterSection>

                {/* KEYWORDS */}
                <FilterSection id="keywords" title="Palavras-Chave" icon={Search}>
                  <TextInput
                    label="Incluir Keywords"
                    filterKey="keywords"
                    placeholder="real estate, investment, property..."
                  />

                  <TextInput
                    label="Excluir Keywords"
                    filterKey="excludeKeywords"
                    placeholder="competitor, spam..."
                  />
                </FilterSection>
              </div>
            </div>

            {/* Results Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search Bar & Actions */}
              <div className="p-4 border-b border-white/10 bg-zinc-900/20">
                <div className="flex gap-3">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Buscar Leads
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="border-white/10 text-zinc-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
                  </Button>

                  {results.length > 0 && (
                    <div className="flex-1 flex items-center justify-end gap-4">
                      <span className="text-sm text-zinc-400">
                        {results.length} de {totalResults} resultados
                      </span>
                      
                      <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg text-sm text-white"
                      >
                        <option value={25}>25 por página</option>
                        <option value={50}>50 por página</option>
                        <option value={100}>100 por página</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Demo Data Banner removido */}

                {results.length === 0 && !isSearching && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Target className="w-16 h-16 text-zinc-700 mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-400 mb-2">
                      Nenhuma busca realizada
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-md">
                      Configure seus filtros e clique em "Buscar Leads" para encontrar prospects usando Apollo.io, People Data Labs e LinkedIn
                    </p>
                  </div>
                )}

                {isSearching && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                      <p className="text-zinc-400">Buscando em múltiplas APIs...</p>
                    </div>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-3">
                    {results.map((result, idx) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="p-4 bg-zinc-900/60 border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer">
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              {result.photoUrl ? (
                                <img
                                  src={result.photoUrl}
                                  alt={result.fullName}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                  {result.fullName?.charAt(0) || '?'}
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="text-white font-semibold text-lg">
                                    {result.fullName}
                                  </h3>
                                  <p className="text-zinc-400 text-sm">
                                    {result.title} {result.companyName && `at ${result.companyName}`}
                                  </p>
                                </div>
                                
                                {/* Confidence Score */}
                                <Badge 
                                  className={`${
                                    result.confidence >= 90 
                                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                                      : result.confidence >= 70
                                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                      : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                                  }`}
                                >
                                  {result.confidence}% Match
                                </Badge>
                              </div>

                              {/* Contact Info */}
                              <div className="flex flex-wrap gap-3 mb-2">
                                {result.email && (
                                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                                    <Mail className="w-3 h-3" />
                                    <span>{result.email}</span>
                                    {result.emailStatus === 'verified' && (
                                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    )}
                                  </div>
                                )}
                                
                                {result.phone && (
                                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                                    <Phone className="w-3 h-3" />
                                    <span>{result.phone}</span>
                                  </div>
                                )}

                                {result.linkedinUrl && (
                                  <a 
                                    href={result.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                                  >
                                    <Linkedin className="w-3 h-3" />
                                    <span>LinkedIn</span>
                                  </a>
                                )}
                              </div>

                              {/* Location & Source */}
                              <div className="flex items-center gap-3 text-xs text-zinc-500">
                                {result.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {result.city}, {result.country}
                                  </span>
                                )}
                                
                                <Badge variant="outline" className="text-xs border-white/10">
                                  {result.source.toUpperCase()}
                                </Badge>

                                {result.lastUpdated && (
                                  <span>
                                    Atualizado: {new Date(result.lastUpdated).toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {results.length > 0 && (
                <div className="p-4 border-t border-white/10 bg-zinc-900/20">
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="border-white/10"
                    >
                      Anterior
                    </Button>

                    <span className="text-sm text-zinc-400">
                      Página {currentPage}
                    </span>

                    <Button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={!hasMore}
                      variant="outline"
                      size="sm"
                      className="border-white/10"
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}