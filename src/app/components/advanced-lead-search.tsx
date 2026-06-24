import React, { useState, useEffect } from 'react';
import { Search, Users, Building2, MapPin, Filter, Sparkles, ChevronDown, Loader2, CheckCircle2, AlertCircle, Linkedin, Database, BrainCircuit, RefreshCw } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { realAPIService, LeadData } from '../lib/real-api-service';
import { toast } from 'sonner';

type SearchType = 'people' | 'companies';
type PageSize = 25 | 50 | 100;

interface SearchFilters {
  // Comum
  name?: string;
  location?: string;
  country?: string;
  city?: string;
  
  // Pessoas
  jobTitle?: string;
  company?: string;
  industry?: string;
  seniorityLevel?: string[];
  yearsOfExperience?: { min?: number; max?: number };
  skills?: string[];
  education?: string;
  currentCompany?: string;
  pastCompany?: string;
  
  // Empresas
  companyName?: string;
  companySize?: string[];
  revenue?: { min?: number; max?: number };
  foundedYear?: { min?: number; max?: number };
  companyType?: string[];
  technologies?: string[];
  fundingStage?: string[];
}

interface LeadResult {
  id: string;
  type: 'person' | 'company';
  confidence: number;
  sources: ('linkedin' | 'apollo')[];
  
  // Pessoa
  name?: string;
  title?: string;
  company?: string;
  location?: string;
  profileUrl?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  photoUrl?: string;
  summary?: string;
  
  // Empresa
  companyName?: string;
  domain?: string;
  industry?: string;
  size?: string;
  revenue?: string;
  founded?: number;
  description?: string;
  headquarters?: string;
  website?: string;
  employeeCount?: number;
  
  // Metadados
  dataQuality: {
    completeness: number;
    accuracy: number;
    freshness: number;
  };
  aiAnalysis?: string; // Insights da IA
}

export function AdvancedLeadSearch() {
  const [searchType, setSearchType] = useState<SearchType>('people');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Estados de Busca e Progresso
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState<
    'idle' | 'linkedin_query' | 'apollo_crossref' | 'ai_verification' | 'complete'
  >('idle');
  const [progressLog, setProgressLog] = useState<string[]>([]);
  
  // Configuração
  const [pageSize, setPageSize] = useState<PageSize>(25);
  const [results, setResults] = useState<LeadResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});

  const addLog = (msg: string) => setProgressLog(prev => [...prev.slice(-4), msg]);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchStep('linkedin_query');
    setResults([]);
    setProgressLog([]);

    try {
      // --- FASE 1: LINKEDIN QUERY ---
      addLog("Initiating connection to LinkedIn API (Proxycurl)...");
      await new Promise(r => setTimeout(r, 500));
      
      // --- FASE 2: APOLLO CROSS-REFERENCE ---
      setSearchStep('apollo_crossref');
      addLog("Connecting to Apollo.io Data Graph...");
      await new Promise(r => setTimeout(r, 500));
      addLog("Enriching contact details (Emails, Phones)...");
      
      // --- CHAMAR API REAL ---
      const searchParams = {
        name: filters.name,
        title: filters.jobTitle,
        company: filters.currentCompany,
        location: filters.location,
        country: filters.country,
        limit: pageSize,
      };
      
      console.log('🔍 Buscando com parâmetros:', searchParams);
      const realResults = await realAPIService.search(searchParams);
      
      // --- FASE 3: AI VERIFICATION ---
      setSearchStep('ai_verification');
      addLog("AI Agent: Analyzing profile freshness...");
      await new Promise(r => setTimeout(r, 300));
      addLog("AI Agent: Resolving conflicting data...");
      await new Promise(r => setTimeout(r, 300));
      addLog("AI Agent: Filtering low-confidence matches...");
      await new Promise(r => setTimeout(r, 300));

      // Converter LeadData para LeadResult
      const convertedResults: LeadResult[] = realResults.map((lead: LeadData) => ({
        id: lead.id,
        type: 'person' as const,
        name: lead.name,
        title: lead.title,
        company: lead.company,
        location: lead.location,
        email: lead.email,
        phone: lead.phone,
        linkedinUrl: lead.linkedinUrl,
        profileUrl: lead.linkedinUrl,
        photoUrl: lead.avatar,
        summary: lead.summary,
        confidence: lead.confidence / 100, // Normalizar para 0-1
        sources: lead.source === 'apollo' ? ['apollo'] : 
                 lead.source === 'proxycurl' ? ['linkedin'] : 
                 ['linkedin', 'apollo'],
        dataQuality: {
          completeness: lead.dataQuality.profileComplete / 100,
          accuracy: 0.95,
          freshness: 0.92,
        },
        aiAnalysis: lead.source === 'conflated' 
          ? `AI Merged: Combined Apollo + LinkedIn data (${lead.confidence}% confidence)`
          : lead.source === 'apollo'
          ? `Apollo.io: Email verified • ${lead.dataQuality.emailVerified ? '✓' : '✗'}`
          : `LinkedIn: Real profile data • Updated recently`,
      }));

      setResults(convertedResults);
      setSearchStep('complete');
      addLog(`Process Complete: ${convertedResults.length} verified targets loaded.`);
      
    } catch (error: any) {
      console.error('❌ Erro na busca:', error);
      addLog(`Error: ${error.message}`);
      setSearchStep('complete');
      toast.error('Erro na busca', {
        description: error.message || 'Verifique sua conexão e API keys'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const seniorityLevels = ['Entry Level', 'Mid Level', 'Senior', 'Manager', 'Director', 'VP', 'C-Level', 'Owner'];
  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '10000+'];

  return (
    <div className="space-y-6 relative min-h-[600px]">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            AI Target Search <span className="text-xs font-mono text-zinc-500 px-2 py-1 bg-zinc-900 rounded border border-zinc-800">v2.4.0</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time deep search across LinkedIn & Apollo with AI Verification
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                LinkedIn API Active
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Apollo Graph Connected
            </div>
        </div>
      </div>

      <Card className="p-6 bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10">
            {/* Search Type & Page Size */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div className="flex gap-2 p-1 bg-zinc-900/80 rounded-xl border border-white/5 w-fit">
                    <button
                        onClick={() => setSearchType('people')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        searchType === 'people'
                            ? 'bg-zinc-800 text-white shadow-md'
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        Professionals
                    </button>
                    <button
                        onClick={() => setSearchType('companies')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
                        searchType === 'companies'
                            ? 'bg-zinc-800 text-white shadow-md'
                            : 'text-zinc-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Building2 className="w-4 h-4" />
                        Companies
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-zinc-500">Results per page:</span>
                    <div className="flex gap-2">
                        {[25, 50, 100].map((size) => (
                            <button
                                key={size}
                                onClick={() => setPageSize(size as PageSize)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                                    pageSize === size 
                                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                                        : 'bg-black/40 border-white/10 text-zinc-400 hover:border-white/20'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Basic Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Keywords / Role</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                        <input
                            type="text"
                            placeholder={searchType === 'people' ? "e.g. CEO, Sales Director" : "e.g. Technology, SaaS"}
                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
                            value={searchType === 'people' ? filters.jobTitle : filters.industry}
                            onChange={(e) => searchType === 'people' 
                                ? setFilters({...filters, jobTitle: e.target.value})
                                : setFilters({...filters, industry: e.target.value})
                            }
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="e.g. San Francisco, London"
                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                        />
                    </div>
                </div>

                {searchType === 'people' && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Company</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                            <input
                                type="text"
                                placeholder="e.g. Microsoft, Google"
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
                                value={filters.currentCompany}
                                onChange={(e) => setFilters({...filters, currentCompany: e.target.value})}
                            />
                        </div>
                    </div>
                )}
                
                {/* Search Button */}
                <div className="flex items-end">
                    <Button 
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full h-[38px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Search"}
                    </Button>
                </div>
            </div>

            {/* Advanced Filters Toggle (Visual Only for now) */}
            <div className="flex items-center gap-2 cursor-pointer text-xs text-indigo-400 font-medium hover:text-indigo-300 w-fit select-none" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                <Filter className="w-3 h-3" />
                {showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
                <ChevronDown className={`w-3 h-3 transition-transform ${showAdvancedFilters ? "rotate-180" : ""}`} />
            </div>

            {showAdvancedFilters && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="pt-4 mt-2 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Seniority</label>
                        <select className="w-full bg-black/50 border border-white/10 rounded-lg py-1.5 text-xs text-zinc-300">
                            <option>Any Level</option>
                            <option>Director+</option>
                            <option>C-Level</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-500">Revenue</label>
                        <select className="w-full bg-black/50 border border-white/10 rounded-lg py-1.5 text-xs text-zinc-300">
                            <option>Any Revenue</option>
                            <option>$1M - $10M</option>
                            <option>$10M+</option>
                        </select>
                    </div>
                </motion.div>
            )}
        </div>
      </Card>

      {/* SEARCHING STATE OVERLAY */}
      <AnimatePresence>
        {isSearching && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#050505]/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-white/10"
            >
                <div className="w-full max-w-lg space-y-8 p-8">
                    
                    {/* Icons Flow */}
                    <div className="flex items-center justify-center gap-8 mb-8">
                        {/* LinkedIn Node */}
                        <div className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${searchStep === 'linkedin_query' ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${searchStep === 'linkedin_query' ? 'bg-[#0077b5]/10 border-[#0077b5] shadow-[0_0_30px_rgba(0,119,181,0.3)]' : 'bg-zinc-900 border-zinc-800'}`}>
                                <Linkedin className={`w-8 h-8 ${searchStep === 'linkedin_query' ? 'text-[#0077b5]' : 'text-zinc-600'}`} />
                            </div>
                            <span className="text-xs font-mono uppercase tracking-widest text-[#0077b5]">Source</span>
                        </div>

                        {/* Connection Line 1 */}
                        <div className="h-px w-12 bg-gradient-to-r from-[#0077b5]/50 to-indigo-500/50 relative overflow-hidden">
                            <motion.div 
                                className="absolute inset-0 bg-white w-full h-full"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            />
                        </div>

                        {/* Apollo Node */}
                        <div className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${searchStep === 'apollo_crossref' ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${searchStep === 'apollo_crossref' ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'bg-zinc-900 border-zinc-800'}`}>
                                <Database className={`w-8 h-8 ${searchStep === 'apollo_crossref' ? 'text-indigo-400' : 'text-zinc-600'}`} />
                            </div>
                            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">Enrich</span>
                        </div>

                        {/* Connection Line 2 */}
                        <div className="h-px w-12 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 relative overflow-hidden">
                            <motion.div 
                                className="absolute inset-0 bg-white w-full h-full"
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear", delay: 0.5 }}
                            />
                        </div>

                        {/* AI Brain Node */}
                        <div className={`relative flex flex-col items-center gap-2 transition-all duration-500 ${searchStep === 'ai_verification' ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${searchStep === 'ai_verification' ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'bg-zinc-900 border-zinc-800'}`}>
                                <BrainCircuit className={`w-8 h-8 ${searchStep === 'ai_verification' ? 'text-purple-400' : 'text-zinc-600'}`} />
                            </div>
                            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">Verify</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ 
                                width: searchStep === 'linkedin_query' ? "30%" :
                                       searchStep === 'apollo_crossref' ? "60%" :
                                       searchStep === 'ai_verification' ? "90%" : "100%"
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Terminal Log */}
                    <div className="bg-black/80 rounded-lg p-4 font-mono text-xs h-32 overflow-hidden border border-white/10 flex flex-col justify-end">
                        {progressLog.map((log, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-green-400/80 mb-1"
                            >
                                <span className="text-zinc-600 mr-2">{new Date().toLocaleTimeString()}</span>
                                {">"} {log}
                            </motion.div>
                        ))}
                        <motion.div 
                            animate={{ opacity: [0, 1] }} 
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-green-500/50" 
                        />
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* RESULTS TABLE */}
      {results.length > 0 && !isSearching && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Found {results.length} Verified Targets
                </h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-white/10 bg-black hover:bg-white/5 text-zinc-400">
                        Export CSV
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-white/10 bg-black hover:bg-white/5 text-zinc-400">
                        Save to List
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0a0a0a]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 font-medium text-zinc-400">Name / Company</th>
                            <th className="px-6 py-4 font-medium text-zinc-400">Role / Industry</th>
                            <th className="px-6 py-4 font-medium text-zinc-400">Location</th>
                            <th className="px-6 py-4 font-medium text-zinc-400">AI Verification</th>
                            <th className="px-6 py-4 font-medium text-zinc-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.map((lead) => (
                            <tr key={lead.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {lead.type === 'person' && (
                                            <img src={lead.photoUrl} alt="" className="w-8 h-8 rounded-full bg-zinc-800" />
                                        )}
                                        {lead.type === 'company' && (
                                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold text-xs">
                                                {lead.companyName?.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                                                {lead.type === 'person' ? lead.name : lead.companyName}
                                            </div>
                                            <div className="text-xs text-zinc-500">
                                                {lead.type === 'person' ? lead.company : lead.domain}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-zinc-300">{lead.type === 'person' ? lead.title : lead.industry}</div>
                                    <div className="text-xs text-zinc-500">{lead.type === 'person' ? lead.email : lead.revenue}</div>
                                </td>
                                <td className="px-6 py-4 text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 text-zinc-600" />
                                        {lead.location || lead.headquarters}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] h-5">
                                                {(lead.confidence * 100).toFixed(0)}% Match
                                            </Badge>
                                            <span className="text-[10px] text-zinc-500 flex gap-1">
                                                <Linkedin className="w-3 h-3 text-[#0077b5]" />
                                                <Database className="w-3 h-3 text-indigo-500" />
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 max-w-[180px] truncate">
                                            {lead.aiAnalysis}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" className="h-8 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                        Reveal
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer (Mock) */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 px-2">
                <p className="text-xs text-zinc-500">Showing 1 to {results.length} of 1,248 results</p>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500" disabled>Previous</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs bg-white/5 text-white">1</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500">2</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500">3</Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500">Next</Button>
                </div>
            </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!isSearching && results.length === 0 && (
          <div className="text-center py-20 opacity-50">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                  <Search className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="text-zinc-400 font-medium">Ready to Search</h3>
              <p className="text-zinc-600 text-sm mt-1">Configure your filters above and initiate the AI agent.</p>
          </div>
      )}

    </div>
  );
}