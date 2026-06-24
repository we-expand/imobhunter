import { useState } from "react";
import { AdvancedSearchFilters, SearchFilters } from "./AdvancedSearchFilters";
import { SearchResults } from "./SearchResults";
import { APIConfiguration } from "./APIConfiguration";
import { searchAPI, SearchResult, SearchResponse } from "../../lib/api/searchAPI";
import { Search, Settings, Save, FolderOpen, ArrowLeft } from "lucide-react";

interface AdvancedSearchPageProps {
  onBack?: () => void;
}

export const AdvancedSearchPage = ({ onBack }: AdvancedSearchPageProps) => {
  const [activeTab, setActiveTab] = useState<'search' | 'config'>('search');
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'leads',
    emailStatus: 'verified'
  });
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{ name: string; filters: SearchFilters }>>([]);

  const handleSearch = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const results = await searchAPI.searchLeads(filters, page, 25);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      alert(error instanceof Error ? error.message : 'Search failed. Please check your API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!searchResults || searchResults.results.length === 0) return;

    // Convert results to CSV
    const headers = ['Name', 'Title', 'Company', 'Email', 'Phone', 'City', 'Country', 'LinkedIn', 'Source'];
    const rows = searchResults.results.map(result => [
      result.fullName || '',
      result.title || '',
      result.companyName || '',
      result.email || '',
      result.phone || '',
      result.city || '',
      result.country || '',
      result.linkedinUrl || '',
      result.source
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imobhunter-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveSearch = () => {
    const name = prompt('Enter a name for this search:');
    if (name) {
      setSavedSearches(prev => [...prev, { name, filters }]);
      // Save to localStorage
      const updated = [...savedSearches, { name, filters }];
      localStorage.setItem('imobhunter_saved_searches', JSON.stringify(updated));
    }
  };

  const handleLoadSearch = (savedFilters: SearchFilters) => {
    setFilters(savedFilters);
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Advanced Search</h1>
              <p className="text-zinc-400">
                LinkedIn Sales Navigator-style filters with real API integrations
              </p>
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
                Search
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
                API Config
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'search' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-4">
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
                    <h3 className="font-semibold text-white">Saved Searches</h3>
                  </div>
                  <div className="space-y-2">
                    {savedSearches.map((saved, i) => (
                      <button
                        key={i}
                        onClick={() => handleLoadSearch(saved.filters)}
                        className="w-full text-left px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-300 hover:border-indigo-500 transition-all"
                      >
                        {saved.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Current Search */}
              <button
                onClick={handleSaveSearch}
                className="w-full py-3 px-4 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-300 hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Current Search
              </button>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              {searchResults ? (
                <SearchResults
                  results={searchResults.results}
                  total={searchResults.total}
                  page={searchResults.page}
                  hasMore={searchResults.hasMore}
                  onPageChange={handleSearch}
                  onExport={handleExport}
                  onAddToCampaign={(result) => console.log('Add to campaign:', result)}
                  isLoading={isLoading}
                  credits={searchResults.credits}
                />
              ) : (
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-12 text-center">
                  <Search className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Search</h3>
                  <p className="text-zinc-400 mb-6">
                    Configure your filters and click "Search Now" to find leads
                  </p>
                  <div className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-sm text-indigo-300">
                    💡 Tip: Configure your API keys in the API Config tab for real results
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <APIConfiguration onSave={() => setActiveTab('search')} />
        )}

        {/* Stats Footer */}
        {activeTab === 'search' && searchResults && (
          <div className="mt-8 grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-indigo-950/20 to-black border border-indigo-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-indigo-400">{searchResults.total.toLocaleString()}</div>
              <div className="text-xs text-zinc-500 mt-1">Total Leads Found</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/20 to-black border border-emerald-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {Math.round((searchResults.results.filter(r => r.emailStatus === 'verified').length / searchResults.results.length) * 100) || 0}%
              </div>
              <div className="text-xs text-zinc-500 mt-1">Verified Emails</div>
            </div>
            <div className="bg-gradient-to-br from-purple-950/20 to-black border border-purple-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {searchResults.results.filter(r => r.phone).length}
              </div>
              <div className="text-xs text-zinc-500 mt-1">With Phone Numbers</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-950/20 to-black border border-cyan-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {searchResults.credits?.remaining.toLocaleString() || '∞'}
              </div>
              <div className="text-xs text-zinc-500 mt-1">API Credits Left</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
