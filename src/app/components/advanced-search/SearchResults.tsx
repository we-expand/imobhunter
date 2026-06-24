import { useState } from "react";
import { SearchResult } from "../../lib/api/searchAPI";
import { Mail, Phone, Linkedin, Twitter, Building2, MapPin, Award, ExternalLink, Download, Plus, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
  total: number;
  page: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onAddToCampaign: (result: SearchResult) => void;
  isLoading?: boolean;
  credits?: {
    used: number;
    remaining: number;
  };
}

export const SearchResults = ({
  results,
  total,
  page,
  hasMore,
  onPageChange,
  onExport,
  onAddToCampaign,
  isLoading,
  credits
}: SearchResultsProps) => {
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedResults);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedResults(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedResults.size === results.length) {
      setSelectedResults(new Set());
    } else {
      setSelectedResults(new Set(results.map(r => r.id)));
    }
  };

  const resultsPerPage = 25;
  const totalPages = Math.ceil(total / resultsPerPage);

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-bold text-white">{total.toLocaleString()}</div>
              <div className="text-sm text-zinc-400">Total Results</div>
            </div>
            {credits && (
              <div className="border-l border-white/10 pl-4">
                <div className="text-lg font-semibold text-indigo-400">{credits.remaining.toLocaleString()}</div>
                <div className="text-xs text-zinc-500">Credits Remaining</div>
              </div>
            )}
            <div className="border-l border-white/10 pl-4">
              <div className="text-lg font-semibold text-emerald-400">{selectedResults.size}</div>
              <div className="text-xs text-zinc-500">Selected</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-300 hover:border-indigo-500 transition-all"
            >
              {selectedResults.size === results.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={onExport}
              disabled={results.length === 0}
              className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-300 hover:border-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              disabled={selectedResults.size === 0}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-700 rounded-lg text-sm text-white font-semibold transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-12 text-center">
          <div className="text-zinc-500 mb-2">No results found</div>
          <div className="text-sm text-zinc-600">Try adjusting your filters or search criteria</div>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className={`bg-gradient-to-br from-zinc-900 to-black border rounded-xl p-6 transition-all hover:border-indigo-500/50 ${
                selectedResults.has(result.id)
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelection(result.id)}
                  className="mt-1"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedResults.has(result.id)
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-zinc-600 hover:border-indigo-500'
                  }`}>
                    {selectedResults.has(result.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </button>

                {/* Avatar */}
                <div className="relative">
                  <img
                    src={result.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.fullName || 'User')}&background=4f46e5&color=fff`}
                    alt={result.fullName}
                    className="w-16 h-16 rounded-full border-2 border-white/10"
                  />
                  {result.emailStatus === 'verified' && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        {result.fullName}
                        {result.confidence && result.confidence > 0.9 && (
                          <Sparkles className="w-4 h-4 text-yellow-400" title="High Confidence Match" />
                        )}
                      </h3>
                      <p className="text-sm text-indigo-400 mb-1">{result.title}</p>
                      {result.companyName && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{result.companyName}</span>
                          {result.companySize && (
                            <span className="text-zinc-600">• {result.companySize}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Source Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      result.source === 'apollo' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      result.source === 'pdl' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      result.source === 'linkedin' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                      'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30'
                    }`}>
                      {result.source.toUpperCase()}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    {result.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <a href={`mailto:${result.email}`} className="text-zinc-300 hover:text-indigo-400 transition-colors">
                          {result.email}
                        </a>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          result.emailStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                          result.emailStatus === 'catchall' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-zinc-700/50 text-zinc-500'
                        }`}>
                          {result.emailStatus}
                        </span>
                      </div>
                    )}
                    
                    {result.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3.5 h-3.5 text-zinc-500" />
                        <a href={`tel:${result.phone}`} className="text-zinc-300 hover:text-indigo-400 transition-colors">
                          {result.phone}
                        </a>
                      </div>
                    )}

                    {result.city && (
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{result.city}, {result.country}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {result.seniority && (
                      <span className="px-2 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded text-xs text-indigo-300">
                        <Award className="w-3 h-3 inline mr-1" />
                        {result.seniority}
                      </span>
                    )}
                    {result.department && (
                      <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300">
                        {result.department}
                      </span>
                    )}
                    {result.industry && (
                      <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                        {result.industry}
                      </span>
                    )}
                    {result.technologies && result.technologies.length > 0 && (
                      <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-xs text-emerald-300">
                        Tech: {result.technologies.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    {result.linkedinUrl && (
                      <a
                        href={result.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-400 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {result.twitterUrl && (
                      <a
                        href={result.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-sky-400 transition-colors"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                        Twitter
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {result.companyWebsite && (
                      <a
                        href={result.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-indigo-400 transition-colors"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onAddToCampaign(result)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-sm text-white font-semibold transition-all whitespace-nowrap"
                  >
                    Add to Campaign
                  </button>
                  <button
                    className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-zinc-300 hover:border-indigo-500 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && results.length > 0 && (
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              Showing {((page - 1) * resultsPerPage) + 1} - {Math.min(page * resultsPerPage, total)} of {total.toLocaleString()} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="p-2 bg-black/50 border border-white/10 rounded-lg text-zinc-300 hover:border-indigo-500 disabled:opacity-50 disabled:hover:border-white/10 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-black/50 text-zinc-400 hover:bg-black border border-white/10 hover:border-indigo-500'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-zinc-600 px-2">...</span>
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === totalPages
                          ? 'bg-indigo-600 text-white'
                          : 'bg-black/50 text-zinc-400 hover:bg-black border border-white/10 hover:border-indigo-500'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={!hasMore}
                className="p-2 bg-black/50 border border-white/10 rounded-lg text-zinc-300 hover:border-indigo-500 disabled:opacity-50 disabled:hover:border-white/10 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
