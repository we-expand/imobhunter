import { useState } from "react";
import { AdvancedSearchFilters, SearchFilters } from "./advanced-search/AdvancedSearchFilters";
import { SearchResults } from "./advanced-search/SearchResults";
import { APIConfiguration } from "./advanced-search/APIConfiguration";
import { searchAPI, SearchResult } from "../lib/api/searchAPI";
import { Search, Settings, Save, FolderOpen, ArrowLeft, TrendingUp, Users, Building2, Zap } from "lucide-react";
import { Search, Settings, Save, FolderOpen, ArrowLeft, Users, Building2, Zap, AlertCircle } from "lucide-react";
import { toast } from '&';

interface LinkedInNavigatorSearchProps {
  onBack?: () => void;
}

export const LinkedInNavigatorSearch = ({ onBack }: LinkedInNavigatorSearchProps) => {
  const [activeTab, setActiveTab] = useState<'search' | 'config'>('search');
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'leads',
    emailStatus: 'verified'
  });
  const [searchResults, setSearchResults] = useState<{ 
    results: SearchResult[];
    total: number;
    page: number;
    hasMore: boolean;
    credits?: { used: number; remaining: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{ name: string; filters: SearchFilters }>>(() => {
    const saved = localStorage.getItem('imobhunter_saved_searches');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSearch = async (page: number = 1) => {
    setIsLoading(true);
    
    try {
      // Log da busca
      console.group('🔍 BUSCA LINKEDIN NAVIGATOR STYLE');
      console.log('Filtros aplicados:', filters);
      console.log('Página:', page);
      
      const results = await searchAPI.searchLeads(filters, page, 25);
      
      console.log('Resultados obtidos:', results);
      console.groupEnd();
      
      setSearchResults({
        results: results.results,
        total: results.total,
        page: results.page,
        hasMore: results.hasMore,
        credits: results.credits
      });

      // Toast baseado nos resultados
      if (results.results.length > 0) {
        toast.success(`🎯 ${results.total} leads encontrados!`, {
          description: `Mostrando ${results.results.length} resultados da página ${page}`,
          duration: 3000
        });
      } else {
        toast.info('🔍 Nenhum resultado encontrado', {
          description: 'Tente ajustar seus filtros ou configure suas API keys',
          duration: 4000
        });
      }
      
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      
      toast.error('❌ Erro ao buscar leads', {
        description: error instanceof Error ? error.message : 'Verifique sua configuração de API',
        duration: 5000
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!searchResults || searchResults.results.length === 0) {
      toast.warning('Nenhum resultado para exportar');
      return;
    }

    try {
      // Cria CSV completo
      const headers = [
        'Full Name', 'First Name', 'Last Name', 'Title', 'Seniority', 'Department',
        'Company', 'Company Size', 'Industry',
        'Email', 'Email Status', 'Phone', 'Phone Status',
        'City', 'Country', 'Region',
        'LinkedIn URL', 'Twitter URL', 'Company Website',
        'Source', 'Confidence Score', 'Last Updated'
      ];
      
      const rows = searchResults.results.map(result => [
        result.fullName || '',
        result.firstName || '',
        result.lastName || '',
        result.title || '',
        result.seniority || '',
        result.department || '',
        result.companyName || '',
        result.companySize || '',
        result.industry || '',
        result.email || '',
        result.emailStatus || '',
        result.phone || '',
        result.phoneStatus || '',
        result.city || '',
        result.country || '',
        result.region || '',
        result.linkedinUrl || '',
        result.twitterUrl || '',
        result.companyWebsite || '',
        result.source || '',
        result.confidence?.toString() || '',
        result.lastUpdated || ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `imobhunter-leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('✅ Exportação concluída!', {
        description: `${searchResults.results.length} leads exportados para CSV`,
        duration: 3000
      });
      
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar resultados');
    }
  };

  const handleSaveSearch = () => {
    const name = prompt('Nome para esta busca:');
    if (!name) return;

    const newSavedSearches = [...savedSearches, { name, filters }];
    setSavedSearches(newSavedSearches);
    localStorage.setItem('imobhunter_saved_searches', JSON.stringify(newSavedSearches));

    toast.success('Busca salva com sucesso!', {
      description: `"${name}" foi adicionada às buscas salvas`,
      duration: 3000
    });
  };

  const handleLoadSearch = (savedFilters: SearchFilters) => {
    setFilters(savedFilters);
    setActiveTab('search');
    
    toast.info('Busca carregada', {
      description: 'Clique em "Search Now" para executar',
      duration: 2000
    });
  };

  const handleDeleteSavedSearch = (index: number) => {
    const newSavedSearches = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(newSavedSearches);
    localStorage.setItem('imobhunter_saved_searches', JSON.stringify(newSavedSearches));
    
    toast.success('Busca removida');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </button>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">LinkedIn Navigator Search</h1>
                  <p className="text-zinc-400">Busca avançada com filtros profissionais e APIs reais</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-black/50 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                Busca
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'config'
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                APIs
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'search' ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="xl:col-span-1 space-y-4">
              <AdvancedSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={() => handleSearch(1)}
                isLoading={isLoading}
              />

              {/* Saved Searches */}
              {savedSearches.length > 0 && (
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-semibold text-white">Buscas Salvas</h3>
                  </div>
                  <div className="space-y-2">
                    {savedSearches.map((saved, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <button
                          onClick={() => handleLoadSearch(saved.filters)}
                          className="flex-1 text-left px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-300 hover:border-indigo-500 transition-all"
                        >
                          {saved.name}
                        </button>
                        <button
                          onClick={() => handleDeleteSavedSearch(i)}
                          className="p-2 bg-black/50 border border-white/10 rounded-lg text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveSearch}
                className="w-full py-3 px-4 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-300 hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Busca Atual
              </button>
            </div>

            {/* Results */}
            <div className="xl:col-span-3">
              {searchResults ? (
                <SearchResults
                  results={searchResults.results}
                  total={searchResults.total}
                  page={searchResults.page}
                  hasMore={searchResults.hasMore}
                  onPageChange={handleSearch}
                  onExport={handleExport}
                  onAddToCampaign={(result) => {
                    toast.success('Lead adicionado à campanha!', {
                      description: `${result.fullName} será contatado em breve`
                    });
                  }}
                  isLoading={isLoading}
                  credits={searchResults.credits}
                />
              ) : (
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-12 text-center">
                  <Search className="w-20 h-20 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Pronto para Buscar</h3>
                  <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                    Configure seus filtros na lateral e clique em "Search Now" para encontrar leads qualificados
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                      <Users className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <div className="text-sm text-zinc-400">Leads</div>
                      <div className="text-lg font-bold text-white">275M+</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <Building2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm text-zinc-400">Empresas</div>
                      <div className="text-lg font-bold text-white">73M+</div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                      <Zap className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <div className="text-sm text-zinc-400">Emails Verificados</div>
                      <div className="text-lg font-bold text-white">95%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <APIConfiguration onSave={() => setActiveTab('search')} />
        )}

        {/* Stats Footer */}
        {activeTab === 'search' && searchResults && searchResults.results.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-950/30 to-black border border-indigo-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-indigo-400">{searchResults.total.toLocaleString()}</div>
              <div className="text-xs text-zinc-500 mt-1">Total Encontrado</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/30 to-black border border-emerald-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">
                {Math.round((searchResults.results.filter(r => r.emailStatus === 'verified').length / searchResults.results.length) * 100) || 0}%
              </div>
              <div className="text-xs text-zinc-500 mt-1">Emails Verificados</div>
            </div>
            <div className="bg-gradient-to-br from-purple-950/30 to-black border border-purple-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">
                {searchResults.results.filter(r => r.phone).length}
              </div>
              <div className="text-xs text-zinc-500 mt-1">Com Telefone</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-950/30 to-black border border-cyan-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {searchResults.credits?.remaining.toLocaleString() || '∞'}
              </div>
              <div className="text-xs text-zinc-500 mt-1">Créditos API</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};