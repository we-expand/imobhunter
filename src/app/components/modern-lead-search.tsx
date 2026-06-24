import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Users, Building2, MapPin, Briefcase, 
  Star, Mail, Phone, Linkedin, Instagram, Facebook, Twitter,
  Globe, Download, Plus, X, ChevronDown, ChevronUp,
  Sparkles, Zap, Target, TrendingUp, Award, MessageCircle,
  ExternalLink, Check, Copy, UserPlus, Send, Heart,
  BarChart3, Clock, AlertCircle, CheckCircle2, Loader2,
  Eye, EyeOff, RefreshCw, Sliders, Info, Brain
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';
import { useTheme } from '../lib/ThemeContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';
import { AISuggestionsPanel } from './ai-suggestions-panel';

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  website?: string;
  matchScore: number;
  confidence: number;
  industry?: string;
  companySize?: string;
  source: string;
  skills?: string[];
  bio?: string;
}

interface SearchFilters {
  query: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  industry: string;
  socialNetworks: string[];
  hasEmail: boolean;
  hasPhone: boolean;
  minMatchScore: number;
}

export function ModernLeadSearch() {
  const { theme } = useTheme();
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // ID do usuário (em produção, pegar do sistema de auth)
  const userId = localStorage.getItem('userSession') 
    ? JSON.parse(localStorage.getItem('userSession')!).email || 'demo-user'
    : 'demo-user';
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    company: '',
    location: '',
    industry: '',
    socialNetworks: [],
    hasEmail: true,
    hasPhone: false,
    minMatchScore: 70
  });

  const socialNetworks = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' }
  ];

  const industries = [
    'Real Estate', 'Technology', 'Finance', 'Healthcare', 
    'Marketing', 'Sales', 'Consulting', 'E-commerce'
  ];

  const handleSearch = async () => {
    console.log('🔍 ═══════════════════════════════════════════════════════');
    console.log('🔍 [FRONTEND] Iniciando busca de leads...');
    setIsSearching(true);
    setResults([]);

    try {
      const searchParams = {
        filters: {
          personName: filters.firstName && filters.lastName 
            ? `${filters.firstName} ${filters.lastName}`.trim() 
            : filters.firstName || filters.lastName || undefined,
          jobTitles: filters.jobTitle ? [filters.jobTitle] : undefined,
          locations: filters.location ? [filters.location] : undefined,
          companyName: filters.company || undefined,
          industries: filters.industry ? [filters.industry] : undefined
        }
      };

      console.log('📤 [FRONTEND] Payload sendo enviado:', JSON.stringify(searchParams, null, 2));

      const url = `${API_BASE_URL}${API_ROUTES.searchLeads}`;
      console.log('📤 [FRONTEND] URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(searchParams)
      });

      console.log('📥 [FRONTEND] Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [FRONTEND] Erro na resposta:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ [FRONTEND] Dados recebidos:', JSON.stringify(data, null, 2));
      console.log('📊 [FRONTEND] Total de resultados:', data.results?.length || 0);
      console.log('📊 [FRONTEND] Fontes (sources):', data.sources);
      console.log('📊 [FRONTEND] API Status:', data.apiStatus);

      if (data.results && data.results.length > 0) {
        const formattedResults = data.results.map((person: any) => ({
          id: person.id || Math.random().toString(),
          name: person.name || `${person.firstName || ''} ${person.lastName || ''}`.trim(),
          title: person.title || 'N/A',
          company: person.company || 'N/A',
          location: person.location || 'N/A',
          avatar: person.avatar || person.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || 'User')}&size=200&background=random`,
          email: person.email || '',
          phone: person.phone || '',
          linkedinUrl: person.linkedinUrl || '',
          instagramUrl: person.instagramUrl || '',
          website: person.website || '',
          matchScore: person.matchScore || Math.floor(Math.random() * 30) + 70,
          confidence: person.confidence || Math.floor(Math.random() * 20) + 80,
          industry: person.industry || 'N/A',
          companySize: person.companySize || 'N/A',
          source: person.source || 'unknown',
          skills: person.skills || [],
          bio: person.bio || ''
        }));

        setResults(formattedResults);

        // 🧠 Salvar histórico de busca para o AI Brain
        saveSearchHistory(formattedResults.length);

        // 🔥 VERIFICAR SE É DEMO MODE
        const isDemoData = data.sources?.demo > 0 || formattedResults.some((r: any) => r.source === 'demo');
        const apolloCount = data.sources?.apollo || 0;
        
        console.log('🔍 [FRONTEND] Verificação de modo:');
        console.log('   - Tem dados DEMO?', isDemoData);
        console.log('   - Leads Apollo:', apolloCount);
        console.log('   - Leads DEMO:', data.sources?.demo || 0);
        
        if (isDemoData && apolloCount === 0) {
          toast.warning(`⚠️ ${formattedResults.length} leads DEMO`, {
            description: 'Configure API keys em Configurações para buscar leads reais'
          });
          setIsDemoMode(true);
        } else {
          const sourcesText = Object.entries(data.sources || {})
            .filter(([key, val]) => val && val > 0)
            .map(([key, val]) => `${key}: ${val}`)
            .join(', ');
          
          toast.success(`✅ ${formattedResults.length} leads encontrados!`, {
            description: `Fontes: ${sourcesText || 'APIs externas'}`
          });
          setIsDemoMode(false);
        }
        
        // 🔥 Armazenar status das APIs
        if (data.apiStatus) {
          setApiStatus(data.apiStatus);
        }
      } else {
        // Salvar busca mesmo sem resultados
        saveSearchHistory(0);
        
        toast.warning('Nenhum resultado encontrado', {
          description: 'Tente ajustar os filtros de busca'
        });
      }
    } catch (error: any) {
      console.error('❌ [FRONTEND] Erro na busca:', error);
      toast.error('Erro na busca', {
        description: error.message
      });
    } finally {
      setIsSearching(false);
      console.log('🔍 ═══════════════════════════════════════════════════════');
    }
  };

  // 🧠 Salvar histórico de busca para análise do AI
  const saveSearchHistory = async (resultsCount: number) => {
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-v2/ai-brain/save-search`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          userId,
          filters: {
            firstName: filters.firstName,
            lastName: filters.lastName,
            jobTitle: filters.jobTitle,
            company: filters.company,
            location: filters.location,
            industry: filters.industry,
            socialNetworks: filters.socialNetworks,
            hasEmail: filters.hasEmail
          },
          resultsCount,
          selectedLeadsCount: 0,
          addedToPipelineCount: 0
        })
      });
      console.log('🧠 Histórico de busca salvo para AI Brain');
    } catch (error) {
      console.error('⚠️ Erro ao salvar histórico:', error);
      // Não mostrar erro ao usuário - função silenciosa
    }
  };

  // 🤖 Aplicar sugestão do AI
  const handleApplySuggestion = (suggestion: any) => {
    if (suggestion.suggestedFilters) {
      const { suggestedFilters } = suggestion;
      
      setFilters(prev => ({
        ...prev,
        jobTitle: suggestedFilters.jobTitle?.[0] || prev.jobTitle,
        industry: suggestedFilters.industry || prev.industry,
        location: suggestedFilters.locations?.[0] || prev.location,
        socialNetworks: suggestedFilters.socialNetworks || prev.socialNetworks,
        minMatchScore: suggestedFilters.minMatchScore || prev.minMatchScore,
        hasEmail: suggestedFilters.hasEmail ?? prev.hasEmail
      }));

      toast.success('✨ Sugestão aplicada!', {
        description: 'Filtros atualizados. Clique em "Iniciar Busca" para ver os resultados.'
      });
    }
  };

  const toggleSocialNetwork = (network: string) => {
    setFilters(prev => ({
      ...prev,
      socialNetworks: prev.socialNetworks.includes(network)
        ? prev.socialNetworks.filter(n => n !== network)
        : [...prev.socialNetworks, network]
    }));
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    toast.success(`${type} copiado!`);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const exportSelected = () => {
    const selectedData = results.filter(r => selectedLeads.includes(r.id));
    const csv = [
      ['Nome', 'Cargo', 'Empresa', 'Email', 'Telefone', 'LinkedIn', 'Localização'],
      ...selectedData.map(lead => [
        lead.name,
        lead.title,
        lead.company,
        lead.email,
        lead.phone,
        lead.linkedinUrl,
        lead.location
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    toast.success(`✅ ${selectedData.length} leads exportados!`);
  };

  const addToPipeline = () => {
    toast.success(`✅ ${selectedLeads.length} leads adicionados ao pipeline!`, {
      description: 'Os leads começarão a ser nutridos automaticamente'
    });
    setSelectedLeads([]);
  };

  const activeFilterCount = [
    filters.firstName,
    filters.lastName,
    filters.jobTitle,
    filters.company,
    filters.location,
    filters.industry,
    ...filters.socialNetworks
  ].filter(Boolean).length;

  return (
    <div className={`h-screen flex -ml-[10px] ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      
      {/* ========== PAINEL LATERAL ESQUERDO - FILTROS ========== */}
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${showFilters ? 'w-96' : 'w-16'} transition-all duration-300 border-r ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'
        } flex flex-col relative`}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="absolute -right-3 top-6 z-10 rounded-full w-6 h-6 p-0 bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
        >
          {showFilters ? <ChevronUp className="w-3 h-3 rotate-90" /> : <ChevronDown className="w-3 h-3 rotate-90" />}
        </Button>

        {showFilters && (
          <ScrollArea className="flex-1 p-6">
            {/* Header */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold">Busca Avançada</h2>
                  <p className="text-xs text-gray-500">Multi-API + Social Media</p>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <Badge className="bg-blue-500">
                  {activeFilterCount} filtros ativos
                </Badge>
              )}
            </motion.div>

            {/* Quick Search */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Busca Rápida
              </label>
              <Input
                placeholder="Nome, empresa, cargo..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-white/50 backdrop-blur"
              />
            </motion.div>

            {/* Dados da Pessoa */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 space-y-3"
            >
              <label className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Dados da Pessoa
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Nome"
                  value={filters.firstName}
                  onChange={(e) => setFilters(prev => ({ ...prev, firstName: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-sm"
                />
                <Input
                  placeholder="Sobrenome"
                  value={filters.lastName}
                  onChange={(e) => setFilters(prev => ({ ...prev, lastName: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-sm"
                />
              </div>

              <Input
                placeholder="Cargo atual"
                value={filters.jobTitle}
                onChange={(e) => setFilters(prev => ({ ...prev, jobTitle: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-sm"
              />
            </motion.div>

            {/* Empresa */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 space-y-3"
            >
              <label className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-500" />
                Empresa
              </label>
              
              <Input
                placeholder="Nome da empresa"
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-sm"
              />

              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full p-2 rounded-lg border text-sm bg-white"
              >
                <option value="">Todas as indústrias</option>
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </motion.div>

            {/* Localização */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                Localização
              </label>
              <Input
                placeholder="Cidade, país..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="text-sm"
              />
            </motion.div>

            {/* Redes Sociais - NOVO! */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-500" />
                Buscar por Redes Sociais
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                {socialNetworks.map((network) => (
                  <motion.button
                    key={network.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSocialNetwork(network.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 text-sm font-medium ${
                      filters.socialNetworks.includes(network.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <network.icon 
                      className="w-4 h-4" 
                      style={{ color: filters.socialNetworks.includes(network.id) ? network.color : undefined }}
                    />
                    {network.name}
                    {filters.socialNetworks.includes(network.id) && (
                      <Check className="w-3 h-3 ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Busca leads que tenham perfis nessas redes sociais
              </p>
            </motion.div>

            {/* Filtros Avançados */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6 space-y-3"
            >
              <label className="text-sm font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-500" />
                Filtros Avançados
              </label>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasEmail}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasEmail: e.target.checked }))}
                    className="rounded"
                  />
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Apenas com e-mail</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasPhone}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasPhone: e.target.checked }))}
                    className="rounded"
                  />
                  <Phone className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Apenas com telefone</span>
                </label>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Match Score Mínimo: {filters.minMatchScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minMatchScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minMatchScore: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </motion.div>

            {/* Botão de Busca */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 h-12"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Iniciar Busca
                  </>
                )}
              </Button>

              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({
                    query: '',
                    firstName: '',
                    lastName: '',
                    jobTitle: '',
                    company: '',
                    location: '',
                    industry: '',
                    socialNetworks: [],
                    hasEmail: true,
                    hasPhone: false,
                    minMatchScore: 70
                  })}
                  className="w-full mt-2 text-gray-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </motion.div>
          </ScrollArea>
        )}

        {!showFilters && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-2">
            <Filter className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-500 -rotate-90 whitespace-nowrap">Filtros</span>
          </div>
        )}
      </motion.div>

      {/* ========== PAINEL DIREITO - RESULTADOS ========== */}
      <div className="flex-1 flex flex-col">
        
        {/* Header com Stats */}
        <div className={`border-b ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} px-6 py-4`}>
          
          {/* ⚠️ BANNER DE AVISO - MODO DEMO */}
          {isDemoMode && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-900 mb-1 flex items-center gap-2">
                    ⚠️ MODO DEMONSTRAÇÃO ATIVO
                    <Badge className="bg-amber-500 text-white">DADOS FAKE</Badge>
                  </h3>
                  <p className="text-sm text-amber-800 mb-2">
                    Os resultados abaixo são <strong>dados mockados/DEMO</strong> porque as API keys não estão configuradas corretamente.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-amber-700">
                    <div className="flex items-center gap-1">
                      <X className="w-4 h-4" />
                      <span>Apollo API: Não configurado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <X className="w-4 h-4" />
                      <span>PeopleDataLabs: Não configurado</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <X className="w-4 h-4" />
                      <span>Hunter.io: Não configurado</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => {
                      // Navegar para configurações
                      const settingsButton = document.querySelector('[data-view="settings"]') as HTMLElement;
                      if (settingsButton) settingsButton.click();
                      toast.info('🔧 Vá para a seção "Integrações" para configurar as API keys');
                    }}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Configurar API Keys Agora
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Target className="w-7 h-7 text-blue-500" />
                Busca de Leads
                {results.length > 0 && (
                  <Badge className={isDemoMode ? "bg-amber-500 text-white" : "bg-green-500 text-white"}>
                    {results.length} {isDemoMode ? 'DEMO' : 'encontrados'}
                  </Badge>
                )}
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Busca inteligente com Apollo, LinkedIn, Hunter, PDL e Redes Sociais + AI Brain
              </p>
            </div>

            {/* Botão AI Brain */}
            <Button
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Brain className="w-4 h-4 mr-2" />
              {showAISuggestions ? 'Ocultar' : 'Mostrar'} AI Sugestões
            </Button>

            {selectedLeads.length > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex gap-2"
              >
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {selectedLeads.length} selecionados
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportSelected}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={addToPipeline}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar ao Pipeline
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Área de Resultados */}
        <ScrollArea className="flex-1 p-4">
          {isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-96"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <p className="mt-6 font-semibold text-lg">Buscando leads...</p>
              <p className="text-sm text-gray-500">Apollo • LinkedIn • Hunter • PDL • Clearbit</p>
            </motion.div>
          )}

          {!isSearching && results.length === 0 && (
            <>
              {/* 🔑 BOTÃO DE TESTE DA API KEY - AZUL */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <Card className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-4 border-blue-300 shadow-xl">
                  <div className="text-center space-y-4">
                    <div className="text-5xl mb-2">🔑</div>
                    <h2 className="text-3xl font-black">VALIDAR API KEY DO APOLLO</h2>
                    <p className="text-lg font-medium opacity-95">
                      Primeiro, vamos testar se a API Key está configurada corretamente
                    </p>
                    <Button
                      onClick={async () => {
                        console.log('🔑 ═══════════════════════════════════════════════');
                        console.log('🔑 DIAGNÓSTICO COMPLETO DE API KEYS');
                        console.log('🔑 ═══════════════════════════════════════════════');
                        
                        try {
                          const response = await fetch(`${API_BASE_URL}/diagnostics`, {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${publicAnonKey}`,
                            },
                          });
                          
                          const data = await response.json();
                          
                          console.log('📥 Resposta do diagnóstico:');
                          console.log(JSON.stringify(data, null, 2));
                          console.log('');
                          
                          if (data.success && data.apis) {
                            const apolloApi = data.apis.find((api: any) => api.name === 'Apollo.io');
                            
                            console.log('🔍 Status do Apollo:');
                            console.log(JSON.stringify(apolloApi, null, 2));
                            
                            if (apolloApi && apolloApi.valid) {
                              toast.success('✅ Apollo API Key está VÁLIDA!', {
                                description: `Preview: ${apolloApi.preview}`,
                                duration: 8000,
                              });
                            } else if (apolloApi && apolloApi.configured) {
                              toast.warning('⚠️ Apollo configurado, mas com problemas', {
                                description: apolloApi.error || 'Formato inválido',
                                duration: 10000,
                              });
                            } else {
                              toast.error('❌ Apollo não configurado!', {
                                description: 'Configure APOLLO_API_KEY no Supabase',
                                duration: 10000,
                              });
                            }
                            
                            // Mostrar resumo de todas as APIs
                            console.log('');
                            console.log('📊 RESUMO DE TODAS AS APIs:');
                            data.apis.forEach((api: any) => {
                              const status = api.valid ? '✅' : api.configured ? '⚠️' : '❌';
                              console.log(`   ${status} ${api.name}: ${api.error || 'OK'}`);
                            });
                          } else {
                            toast.error('❌ Erro ao buscar diagnóstico', {
                              description: data.error || 'Erro desconhecido',
                              duration: 10000,
                            });
                          }
                          console.log('🔑 ═══════════════════════════════════════════════');
                          
                        } catch (error) {
                          console.error('❌ Erro:', error);
                          toast.error('Erro ao testar API Keys', {
                            description: error instanceof Error ? error.message : 'Erro desconhecido'
                          });
                        }
                      }}
                      className="text-xl py-8 px-12 bg-white text-blue-600 hover:bg-gray-100 font-black shadow-xl transform hover:scale-105 transition-all"
                    >
                      🔍 TESTAR API KEY AGORA
                    </Button>
                  </div>
                </Card>
              </motion.div>

              {/* 🚨 BOTÃO DE TESTE GIGANTE - IMPOSSÍVEL DE NÃO VER */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <Card className="p-8 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white border-4 border-yellow-300 shadow-2xl">
                  <div className="text-center space-y-6">
                    <div className="text-6xl mb-4">🧪</div>
                    <h2 className="text-4xl font-black tracking-tight">TESTE RÁPIDO DA API</h2>
                    <p className="text-2xl font-medium opacity-95">
                      Clique aqui para testar se a busca de leads está funcionando!
                    </p>
                    <Button
                      onClick={async () => {
                        setIsSearching(true);
                        console.log('🧪 ═══════════════════════════════════════════════');
                        console.log('🧪 TESTE RÁPIDO DA API DE LEADS');
                        console.log('🧪 ═══════════════════════════════════════════════');
                        
                        const payload = {
                          city: 'Lisboa',
                          currentTitle: 'CEO',
                          hasEmail: true,
                          limit: 10
                        };
                        
                        console.log('📤 PAYLOAD:', JSON.stringify(payload, null, 2));
                        
                        try {
                          const response = await fetch(`${API_BASE_URL}${API_ROUTES.searchLeads}`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${publicAnonKey}`,
                            },
                            body: JSON.stringify(payload),
                          });
                          
                          console.log('📊 Status HTTP:', response.status);
                          
                          const data = await response.json();
                          
                          console.log('✅ RESPOSTA COMPLETA:');
                          console.log(JSON.stringify(data, null, 2));
                          console.log('');
                          console.log('📊 RESUMO:');
                          console.log('   - Leads retornados:', data.results?.length || 0);
                          console.log('   - Fontes:', data.sources?.join(', ') || 'N/A');
                          console.log('   - É DEMO?', data.sources?.includes('demo') ? '⚠️ SIM' : '✅ NÃO');
                          console.log('🧪 ═══════════════════════════════════════════════');
                          
                          if (data.sources?.includes('demo')) {
                            toast.warning('⚠️ Retornou dados DEMO', {
                              description: 'Configure mais API keys para obter dados reais',
                              duration: 8000,
                            });
                          } else {
                            toast.success(`✅ ${data.results?.length} leads REAIS encontrados!`, {
                              description: `Fontes: ${data.sources?.join(', ')}`,
                              duration: 5000,
                            });
                          }
                          
                          // Mostrar primeiro lead como exemplo
                          if (data.results && data.results.length > 0) {
                            console.log('📋 PRIMEIRO LEAD:');
                            console.log(JSON.stringify(data.results[0], null, 2));
                            
                            // 🔥 CARREGAR OS RESULTADOS NA TELA
                            const formattedResults = data.results.map((person: any) => ({
                              id: person.id || Math.random().toString(),
                              name: person.name || `${person.firstName || ''} ${person.lastName || ''}`.trim(),
                              title: person.title || 'N/A',
                              company: person.company || 'N/A',
                              location: person.location || 'N/A',
                              avatar: person.avatar || person.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || 'User')}&size=200&background=random`,
                              email: person.email || '',
                              phone: person.phone || '',
                              linkedinUrl: person.linkedinUrl || '',
                              instagramUrl: person.instagramUrl || '',
                              website: person.website || '',
                              matchScore: person.matchScore || 95,
                              confidence: person.confidence || 90,
                              industry: person.industry || 'N/A',
                              companySize: person.companySize || 'N/A',
                              source: 'apollo',
                              skills: person.skills || [],
                              bio: person.bio || ''
                            }));
                            
                            setResults(formattedResults);
                            setIsDemoMode(false);
                          }
                          
                        } catch (error) {
                          console.error('❌ ERRO:', error);
                          toast.error('Erro ao testar API', {
                            description: error instanceof Error ? error.message : 'Erro desconhecido'
                          });
                        } finally {
                          setIsSearching(false);
                        }
                      }}
                      disabled={isSearching}
                      className="text-2xl py-10 px-16 bg-white text-red-600 hover:bg-gray-100 font-black shadow-xl transform hover:scale-105 transition-all"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-10 h-10 mr-4 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        '🚀 CLIQUE AQUI PARA TESTAR A API'
                      )}
                    </Button>
                    <div className="flex items-center justify-center gap-3 text-lg opacity-95">
                      <AlertCircle className="w-6 h-6" />
                      <p className="font-medium">
                        Abra o Console (pressione F12) para ver logs detalhados!
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* 🔥 BOTÃO DE DEBUG VISUAL - ROXO */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-4 border-purple-300 shadow-xl">
                  <div className="text-center space-y-4">
                    <div className="text-5xl mb-2">🔬</div>
                    <h2 className="text-3xl font-black">DEBUG VISUAL - VER VERSÃO DO SERVIDOR</h2>
                    <p className="text-lg font-medium opacity-95">
                      Verifica se o servidor foi atualizado com as correções
                    </p>
                    <Button
                      onClick={async () => {
                        try {
                          console.log('🔬 ═══════════════════════════════════════════════');
                          console.log('🔬 VERIFICANDO VERSÃO DO SERVIDOR');
                          console.log('🔬 ═══════════════════════════════════════════════');
                          
                          const response = await fetch(`${API_BASE_URL}/ping`, {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${publicAnonKey}`,
                            },
                          });

                          const data = await response.json();
                          console.log('📥 Resposta do servidor:', data);
                          
                          // Salvar no estado para mostrar visualmente
                          setDebugInfo({
                            version: data.version,
                            timestamp: data.timestamp,
                            isUpdated: data.version === '1.1.0 - Apollo API Key corrigida ✅'
                          });
                          
                          if (data.version === '1.1.0 - Apollo API Key corrigida ✅') {
                            toast.success('✅ SERVIDOR ATUALIZADO!', {
                              description: `Versão: ${data.version}`,
                              duration: 5000
                            });
                          } else {
                            toast.warning('⚠️ Servidor ainda com versão antiga', {
                              description: `Versão atual: ${data.version || '1.0.0'}. Aguarde alguns segundos e tente novamente.`,
                              duration: 5000
                            });
                          }
                          
                          console.log('🔬 ═══════════════════════════════════════════════');
                        } catch (error) {
                          console.error('❌ ERRO:', error);
                          setDebugInfo({
                            error: error instanceof Error ? error.message : 'Erro desconhecido'
                          });
                          toast.error('Erro ao verificar versão', {
                            description: error instanceof Error ? error.message : 'Erro desconhecido'
                          });
                        }
                      }}
                      className="text-2xl py-10 px-16 bg-white text-purple-600 hover:bg-gray-100 font-black shadow-xl transform hover:scale-105 transition-all"
                    >
                      🔍 VERIFICAR VERSÃO DO SERVIDOR
                    </Button>
                    <div className="flex items-center justify-center gap-3 text-lg opacity-95">
                      <Info className="w-6 h-6" />
                      <p className="font-medium">
                        Deve mostrar: "Versão: 1.1.0 - Apollo API Key corrigida ✅"
                      </p>
                    </div>
                    
                    {/* Resultado do Debug */}
                    {debugInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-6 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-white/30"
                      >
                        {debugInfo.error ? (
                          <div className="text-center">
                            <div className="text-4xl mb-2">❌</div>
                            <p className="font-black text-xl mb-2">ERRO!</p>
                            <p className="text-lg opacity-90">{debugInfo.error}</p>
                          </div>
                        ) : debugInfo.isUpdated ? (
                          <div className="text-center">
                            <div className="text-6xl mb-3">✅</div>
                            <p className="font-black text-2xl mb-2">SERVIDOR ATUALIZADO!</p>
                            <p className="text-lg opacity-90 mb-1">Versão: {debugInfo.version}</p>
                            <p className="text-sm opacity-75">Timestamp: {new Date(debugInfo.timestamp).toLocaleString('pt-PT')}</p>
                            <div className="mt-4 p-4 bg-green-500/30 rounded-xl border-2 border-green-300">
                              <p className="font-bold text-lg">
                                🎉 Agora você pode testar o botão verde para buscar leads REAIS!
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-4xl mb-2">⚠️</div>
                            <p className="font-black text-xl mb-2">SERVIDOR COM VERSÃO ANTIGA</p>
                            <p className="text-lg opacity-90 mb-1">Versão atual: {debugInfo.version || 'Desconhecida'}</p>
                            <p className="text-sm opacity-75 mb-3">Timestamp: {debugInfo.timestamp ? new Date(debugInfo.timestamp).toLocaleString('pt-PT') : 'N/A'}</p>
                            <div className="mt-4 p-4 bg-yellow-500/30 rounded-xl border-2 border-yellow-300">
                              <p className="font-bold">
                                ⏳ Aguarde 30 segundos e clique novamente para verificar se o servidor foi atualizado.
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Mensagem original "Pronto para Encontrar Leads" */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-96"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-16 h-16 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pronto para Encontrar Leads?</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Configure os filtros na barra lateral e clique em "Iniciar Busca" para encontrar leads qualificados
                </p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Multi-API
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Redes Sociais
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Tempo Real
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {!isSearching && results.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              <AnimatePresence>
                {results.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <Card className={`relative overflow-hidden ${
                      selectedLeads.includes(lead.id) 
                        ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' 
                        : 'hover:shadow-xl'
                    } transition-all cursor-pointer group`}>
                      
                      {/* Match Score Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.2 }}
                        >
                          <Badge className={`${
                            lead.matchScore >= 90 ? 'bg-green-500' :
                            lead.matchScore >= 75 ? 'bg-blue-500' :
                            'bg-orange-500'
                          } text-white`}>
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {lead.matchScore}%
                          </Badge>
                        </motion.div>
                      </div>

                      {/* Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectLead(lead.id);
                          }}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            selectedLeads.includes(lead.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {selectedLeads.includes(lead.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </motion.button>
                      </div>

                      <CardContent className="p-6 pt-12">
                        {/* Avatar + Nome */}
                        <div className="flex items-start gap-4 mb-4">
                          <motion.img
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            src={lead.avatar}
                            alt={lead.name}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold truncate">{lead.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{lead.title}</p>
                            <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                              <Building2 className="w-3 h-3" />
                              {lead.company}
                            </p>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="truncate">{lead.location}</span>
                          </div>
                          
                          {lead.industry && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Briefcase className="w-4 h-4 text-purple-500" />
                              <span className="truncate">{lead.industry}</span>
                            </div>
                          )}
                        </div>

                        {/* Redes Sociais */}
                        <div className="flex gap-2 mb-4">
                          {lead.linkedinUrl && (
                            <motion.a
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              href={lead.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-[#0077B5] rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Linkedin className="w-4 h-4" />
                            </motion.a>
                          )}
                          {lead.instagramUrl && (
                            <motion.a
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              href={lead.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Instagram className="w-4 h-4" />
                            </motion.a>
                          )}
                          {lead.website && (
                            <motion.a
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-shadow"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Globe className="w-4 h-4" />
                            </motion.a>
                          )}
                        </div>

                        {/* Contato */}
                        {(lead.email || lead.phone) && (
                          <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                            {lead.email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <span className="truncate flex-1 text-gray-700">{lead.email}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(lead.email!, 'Email');
                                  }}
                                  className="p-1 hover:bg-white rounded"
                                >
                                  {copiedEmail === lead.email ? (
                                    <Check className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  )}
                                </motion.button>
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="truncate flex-1 text-gray-700">{lead.phone}</span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(lead.phone!, 'Telefone');
                                  }}
                                  className="p-1 hover:bg-white rounded"
                                >
                                  {copiedEmail === lead.phone ? (
                                    <Check className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  )}
                                </motion.button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success('Email aberto!');
                            }}
                          >
                            <Send className="w-3 h-3 mr-2" />
                            Enviar Email
                          </Button>
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToPipeline();
                            }}
                          >
                            <UserPlus className="w-3 h-3 mr-2" />
                            Pipeline
                          </Button>
                        </div>

                        {/* Source Badge */}
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                          <span>Fonte: {lead.source}</span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {lead.confidence}% confiança
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* ========== PAINEL AI SUGESTÕES ========== */}
      {showAISuggestions && (
        <AISuggestionsPanel
          userId={userId}
          onApplySuggestion={handleApplySuggestion}
        />
      )}
    </div>
  );
}