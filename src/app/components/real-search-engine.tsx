// ═══════════════════════════════════════════════════════════════════════
// 🔍 IMOBHUNTER - REAL SEARCH ENGINE
// Motor de busca real usando Apollo + LinkedIn APIs
// ═══════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { 
  Search, Target, Loader2, CheckCircle2, XCircle, 
  TrendingUp, Users, Mail, Phone, Linkedin, MapPin,
  Building2, Briefcase, Star, Filter, Download, Zap
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  company: string | null;
  location: string | null;
  linkedinUrl: string | null;
  photoUrl: string | null;
  source: 'apollo' | 'linkedin';
  score: number;
}

interface SearchResult {
  leads: Lead[];
  total: number;
  sources: {
    apollo: { success: boolean; count: number };
    linkedin: { success: boolean; count: number };
  };
  metadata: any;
}

export function RealSearchEngine() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    locations: [] as string[],
    titles: [] as string[],
    limit: 25
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 🚀 EXECUTAR BUSCA UNIFICADA
  // ═══════════════════════════════════════════════════════════════════════

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Digite um termo de busca');
      return;
    }

    setIsSearching(true);
    setResults(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/real-search/unified`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            query,
            filters: selectedFilters
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        setResults(data);
        toast.success(`✅ ${data.total} leads encontrados!`);
      } else {
        toast.error(data.error || 'Erro na busca');
      }

    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setIsSearching(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // 📊 SCORE BADGE
  // ═══════════════════════════════════════════════════════════════════════

  const ScoreBadge = ({ score }: { score: number }) => {
    const color = score >= 80 ? 'bg-green-500' :
                  score >= 60 ? 'bg-blue-500' :
                  score >= 40 ? 'bg-yellow-500' : 'bg-gray-500';
    
    return (
      <div className={`${color} text-white px-3 py-1 rounded-full text-xs flex items-center gap-1`}>
        <Star className="w-3 h-3" />
        {score}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Search className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl">Busca Inteligente de Leads</h1>
            <p className="text-gray-600 text-sm mt-1">
              Apollo.io + LinkedIn • Busca em tempo real
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ex: CEO real estate Portugal, investidor imobiliário Lisboa..."
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Buscar
              </>
            )}
          </button>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
            <MapPin className="w-4 h-4 inline mr-1" />
            Localização
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Cargo
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
            <Building2 className="w-4 h-4 inline mr-1" />
            Empresa
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">
            <Filter className="w-4 h-4 inline mr-1" />
            Mais Filtros
          </button>
        </div>
      </div>

      {/* Search Status */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Results */}
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Leads</p>
                <p className="text-2xl">{results.total}</p>
              </div>
            </div>
          </div>

          {/* Apollo Status */}
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${results.sources.apollo.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {results.sources.apollo.success ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Apollo.io</p>
                <p className="text-2xl">{results.sources.apollo.count}</p>
              </div>
            </div>
          </div>

          {/* LinkedIn Status */}
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${results.sources.linkedin.success ? 'bg-green-100' : 'bg-red-100'}`}>
                {results.sources.linkedin.success ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">LinkedIn</p>
                <p className="text-2xl">{results.sources.linkedin.count}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 flex items-center justify-center">
            <button className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {results && results.leads.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">
              Melhores Leads ({results.leads.length})
            </h2>
            <p className="text-sm text-gray-600">
              Ordenados por relevância e completude
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.leads.map((lead, index) => (
              <div key={lead.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    {lead.photoUrl ? (
                      <img 
                        src={lead.photoUrl} 
                        alt={lead.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl">
                        {lead.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg">{lead.name}</h3>
                          <ScoreBadge score={lead.score} />
                        </div>
                        {lead.title && (
                          <p className="text-gray-700 mt-1">{lead.title}</p>
                        )}
                        {lead.company && (
                          <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                            <Building2 className="w-4 h-4" />
                            {lead.company}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 mt-3">
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-blue-600" />
                          {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Phone className="w-4 h-4 text-green-600" />
                          {lead.phone}
                        </div>
                      )}
                      {lead.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          {lead.location}
                        </div>
                      )}
                      {lead.linkedinUrl && (
                        <a 
                          href={lead.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Linkedin className="w-4 h-4" />
                          Perfil LinkedIn
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm">
                      Adicionar ao CRM
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all text-sm">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && !results && (
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
          <div className="inline-flex p-6 bg-gray-100 rounded-full mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl mb-2">Pronto para buscar leads?</h3>
          <p className="text-gray-600 mb-6">
            Digite um termo de busca acima e descubra os melhores leads do mercado
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Busca em tempo real</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Múltiplas fontes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Ranking inteligente</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}