import React, { useState } from 'react';
import { useTheme } from '../lib/ThemeContext';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ApiConfigGuide } from './api-config-guide';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';
import {
  Search,
  Building2,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Filter,
  Download,
  Play,
  Loader2,
  CheckCircle2,
  X,
  Plus,
  Globe,
  Award,
  Calendar,
  Mail,
  Phone,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Interface completa com TODOS os filtros do LinkedIn Sales Navigator
interface SearchFilters {
  // 🔍 PESQUISA BÁSICA
  keywords?: string;
  firstName?: string;
  lastName?: string;
  personName?: string;
  
  // 💼 INFORMAÇÕES PROFISSIONAIS
  jobTitles?: string[];
  currentJobTitle?: string;
  pastJobTitle?: string;
  seniority?: string[];
  function?: string[];
  yearsAtCurrentCompany?: string;
  yearsInCurrentPosition?: string;
  yearsOfExperience?: string;
  
  // 🏢 EMPRESA ATUAL
  companyName?: string;
  currentCompany?: string[];
  pastCompany?: string[];
  companyType?: string[];
  companyHeadcount?: string[];
  companyRevenue?: string[];
  companyGrowthRate?: string;
  departmentHeadcount?: string;
  
  // 📍 LOCALIZAÇÃO
  locations?: string[];
  city?: string[];
  state?: string[];
  country?: string[];
  postalCode?: string;
  
  // 🎓 EDUCAÇÃO
  schools?: string[];
  degreeType?: string[];
  fieldOfStudy?: string[];
  graduationYear?: string;
  
  // 🏭 INDÚSTRIA & SETOR
  industries?: string[];
  companyIndustry?: string[];
  
  // 💡 HABILIDADES & COMPETÊNCIAS
  skills?: string[];
  
  // 🌐 IDIOMAS
  languages?: string[];
  languageProficiency?: string;
  
  // 📧 INFORMAÇÕES DE CONTATO
  hasEmail?: boolean;
  hasPhone?: boolean;
  hasLinkedIn?: boolean;
  
  // 👥 REDE & CONEXÕES
  followersCount?: string;
  connectionsCount?: string;
  groupMemberships?: string[];
  
  // 🎯 ATIVIDADE & ENGAJAMENTO
  profileViews?: string;
  postFrequency?: string;
  lastActiveDate?: string;
  recentlyChanged?: boolean;
  
  // 💰 INVESTIMENTO & FINANCIAMENTO (para empresas)
  fundingType?: string[];
  fundingAmount?: string;
  recentFunding?: boolean;
  
  // 🏆 PRÊMIOS & CERTIFICAÇÕES
  certifications?: string[];
  awards?: string[];
  
  // 📊 TECNOLOGIAS & FERRAMENTAS
  technologies?: string[];
  
  // �� MUDANÇAS RECENTES
  recentJobChange?: boolean;
  recentCompanyChange?: boolean;
  recentPromotion?: boolean;
  
  // 🎂 ANIVERSÁRIOS & EVENTOS
  birthdayMonth?: string;
  workAnniversary?: boolean;
}

// Listas completas de opções (expandidas)
const SENIORITY_LEVELS = [
  'Unpaid',
  'Training',
  'Entry level',
  'Associate',
  'Mid-Senior level',
  'Director',
  'Executive',
  'C-Level (VP, SVP, EVP, CXO)',
  'Owner / Partner'
];

const FUNCTION_AREAS = [
  'Accounting',
  'Administrative',
  'Arts and Design',
  'Business Development',
  'Community & Social Services',
  'Consulting',
  'Education',
  'Engineering',
  'Entrepreneurship',
  'Finance',
  'Healthcare Services',
  'Human Resources',
  'Information Technology',
  'Legal',
  'Marketing',
  'Media & Communication',
  'Military & Protective Services',
  'Operations',
  'Product Management',
  'Program & Project Management',
  'Purchasing',
  'Quality Assurance',
  'Real Estate',
  'Research',
  'Sales',
  'Support'
];

const COMPANY_SIZES = [
  '1 (Just me)',
  '2-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10001+'
];

const COMPANY_TYPES = [
  'Public Company',
  'Self-Employed',
  'Government Agency',
  'Nonprofit',
  'Sole Proprietorship',
  'Privately Held',
  'Partnership',
  'Educational'
];

const INDUSTRIES = [
  'Real Estate',
  'Financial Services',
  'Banking',
  'Investment Management',
  'Insurance',
  'Technology',
  'Information Technology & Services',
  'Computer Software',
  'Internet',
  'Consulting',
  'Management Consulting',
  'Healthcare',
  'Hospital & Health Care',
  'Pharmaceuticals',
  'Medical Devices',
  'Education',
  'E-Learning',
  'Higher Education',
  'Manufacturing',
  'Automotive',
  'Aviation & Aerospace',
  'Retail',
  'E-commerce',
  'Consumer Goods',
  'Construction',
  'Architecture & Planning',
  'Civil Engineering',
  'Hospitality',
  'Restaurants',
  'Hotels & Resorts',
  'Legal',
  'Law Practice',
  'Marketing & Advertising',
  'Public Relations',
  'Telecommunications',
  'Media & Entertainment',
  'Publishing'
];

const DEGREE_TYPES = [
  'High School',
  'Associate',
  'Bachelor',
  'Master',
  'MBA',
  'PhD',
  'MD',
  'JD'
];

const YEARS_OPTIONS = [
  '0-1',
  '1-2',
  '2-3',
  '3-5',
  '5-7',
  '7-10',
  '10-15',
  '15-20',
  '20+'
];

const REVENUE_RANGES = [
  'Less than $1M',
  '$1M - $10M',
  '$10M - $50M',
  '$50M - $100M',
  '$100M - $500M',
  '$500M - $1B',
  '$1B - $10B',
  'More than $10B'
];

export function AdvancedSearchEngine() {
  console.log('✅ [AdvancedSearchEngine] Componente carregado com sucesso');
  
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  // Verificar se as traduções estão carregadas
  console.log('🌍 [AdvancedSearchEngine] Traduções:', t);
  console.log('🌍 [AdvancedSearchEngine] t.search:', t?.search);
  
  // Fallback de segurança se as traduções não estiverem prontas
  const searchTitle = t?.search?.title || 'Buscar Leads';
  
  const [searchType, setSearchType] = useState<'people' | 'companies'>('people');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showApiGuide, setShowApiGuide] = useState(false); // 🆕 Exibir guia de configuração de API
  const [filters, setFilters] = useState<SearchFilters>({
    jobTitles: [],
    seniority: [],
    function: [],
    industries: [],
    companyHeadcount: [],
    locations: [],
    currentCompany: [],
    pastCompany: [],
    schools: [],
    skills: [],
    languages: [],
    technologies: []
  });

  // 🔥 QUICK FILTERS PARA MERCADO IMOBILIÁRIO
  const applyRealEstateQuickFilter = (type: string) => {
    console.log(`🎯 Aplicando filtro rápido: ${type}`);
    
    const quickFilters: Record<string, SearchFilters> = {
      'real-estate-executives': {
        jobTitles: ['CEO', 'Managing Director', 'President', 'Founder'],
        industries: ['Real Estate'],
        seniority: ['Executive', 'C-Level (VP, SVP, EVP, CXO)', 'Owner / Partner'],
        function: ['Real Estate'],
        companyHeadcount: ['11-50', '51-200', '201-500'],
        hasEmail: true
      },
      'sales-directors': {
        jobTitles: ['Sales Director', 'VP of Sales', 'Head of Sales', 'Sales Manager'],
        industries: ['Real Estate'],
        seniority: ['Director', 'Executive', 'Mid-Senior level'],
        function: ['Sales', 'Real Estate'],
        hasEmail: true,
        hasPhone: true
      },
      'marketing-real-estate': {
        jobTitles: ['Marketing Director', 'Marketing Manager', 'CMO', 'Head of Marketing'],
        industries: ['Real Estate', 'Marketing & Advertising'],
        function: ['Marketing'],
        seniority: ['Director', 'Executive', 'Mid-Senior level'],
        hasEmail: true
      },
      'property-developers': {
        jobTitles: ['Developer', 'Property Developer', 'Development Manager'],
        industries: ['Real Estate', 'Construction', 'Architecture & Planning'],
        function: ['Real Estate'],
        companyHeadcount: ['51-200', '201-500', '501-1000']
      },
      'investors': {
        jobTitles: ['Investment Manager', 'Investor', 'Portfolio Manager', 'Fund Manager'],
        industries: ['Real Estate', 'Financial Services', 'Investment Management'],
        seniority: ['Director', 'Executive', 'C-Level (VP, SVP, EVP, CXO)']
      }
    };
    
    const selectedFilter = quickFilters[type];
    if (selectedFilter) {
      setFilters({
        ...filters,
        ...selectedFilter,
        jobTitles: selectedFilter.jobTitles || [],
        industries: selectedFilter.industries || [],
        seniority: selectedFilter.seniority || [],
        function: selectedFilter.function || [],
        companyHeadcount: selectedFilter.companyHeadcount || []
      });
      
      toast.success(`✅ Filtro "${type.replace(/-/g, ' ')}" aplicado!`, {
        description: 'Clique em "Iniciar Busca" para encontrar leads'
      });
    }
  };

  // Inputs temporários para adicionar itens
  const [tempJobTitle, setTempJobTitle] = useState('');
  const [tempKeyword, setTempKeyword] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempCompany, setTempCompany] = useState('');
  const [tempSchool, setTempSchool] = useState('');
  const [tempTechnology, setTempTechnology] = useState('');

  const handleSearch = async () => {
    alert('🔥 BOTÃO FOI CLICADO! O handleSearch está funcionando!');
    console.log('');
    console.log('');
    console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
    console.log('🚨 ATENÇÃO: handleSearch FOI CHAMADA!');
    console.log('🚨 Componente: AdvancedSearchEngine');
    console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
    console.log('');
    console.log('🔍 ═══════════════════════════════════════════════════════');
    console.log('🔍 [SEARCH] Iniciando busca...');
    console.log('🔍 [SEARCH] searchType:', searchType);
    console.log('🔍 [SEARCH] filters:', JSON.stringify(filters, null, 2));
    
    setIsSearching(true);
    setSearchResults([]); // Limpar resultados anteriores
    
    toast.info('🔍 Iniciando busca de leads...', {
      description: 'Conectando com Apollo.io, LinkedIn, Hunter, Proxycurl e outras APIs...'
    });

    try {
      // Nota: API atual só suporta busca de pessoas
      const endpoint = API_ROUTES.searchLeads;

      const url = `${API_BASE_URL}${endpoint}`;
      
      console.log('🔍 [SEARCH] URL:', url);
      console.log('🔍 [SEARCH] projectId:', projectId);
      console.log('🔍 [SEARCH] Enviando request...');

      // 🌍 Obter geolocalização do usuário (se disponível)
      let userLocation = '';
      let userCountry = '';
      try {
        const geoResponse = await fetch('https://ipapi.co/json/');
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          userLocation = geoData.city || '';
          userCountry = geoData.country_name || '';
          console.log('🌍 [SEARCH] Localização detectada:', userLocation, userCountry);
        }
      } catch (geoError) {
        console.log('⚠️ [SEARCH] Não foi possível detectar localização');
      }

      // Extrair dados dos filtros para enviar no formato correto
      const searchParams = {
        firstName: filters.firstName || '',
        lastName: filters.lastName || '',
        fullName: filters.personName || '',
        currentTitle: filters.jobTitles && filters.jobTitles.length > 0 ? filters.jobTitles[0] : '',
        currentCompany: filters.currentCompany && filters.currentCompany.length > 0 ? filters.currentCompany.join(',') : '',
        city: filters.locations && filters.locations.length > 0 ? filters.locations[0] : userLocation,
        country: filters.country || [userCountry],
        industry: filters.industries && filters.industries.length > 0 ? filters.industries : undefined,
        seniority: filters.seniority && filters.seniority.length > 0 ? filters.seniority : undefined,
        keywords: filters.keywords || '',
        hasEmail: filters.hasEmail || true, // Sempre preferir leads com email
        hasPhone: filters.hasPhone || false,
        limit: 50
      };

      console.log('🔍 [SEARCH] searchParams:', JSON.stringify(searchParams, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(searchParams)
      });

      console.log('🔍 [SEARCH] Response status:', response.status);
      console.log('🔍 [SEARCH] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [SEARCH] Response error:', errorText);
        throw new Error(`Erro na busca: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🔍 [SEARCH] Data recebida:', data);
      console.log('🔍 [SEARCH] Resultados:', data.results?.length || 0);
      console.log('🔍 [SEARCH] Fontes:', data.sources);
      console.log('🔍 [SEARCH] Warning:', data.warning);
      console.log('🔍 [SEARCH] Message:', data.message);
      
      if (data.results && data.results.length > 0) {
        console.log('🎨 [UI] ========================================');
        console.log('🎨 [UI] ATUALIZANDO ESTADO COM RESULTADOS');
        console.log('🎨 [UI] ========================================');
        console.log('🎨 [UI] Total de resultados:', data.results.length);
        console.log('🎨 [UI] Primeiros 3 resultados:', data.results.slice(0, 3));
        console.log('🎨 [UI] Chamando setSearchResults...');
        
        setSearchResults(data.results);
        
        console.log('✅ [UI] setSearchResults foi chamado!');
        console.log('📊 [UI] Estado searchResults deve agora ter:', data.results.length, 'items');
        console.log('🎨 [UI] ========================================');
        
        // Verificar se são dados reais ou demo
        const isDemo = data.sources && data.sources.includes('demo');
        const isDemoWarning = data.warning === 'no_results_found' || data.warning === 'apollo_key_invalid';
        
        if (isDemo || isDemoWarning) {
          toast.warning(`⚠️ ${data.results.length} leads DEMO retornados`, {
            description: data.message || 'Configure as API keys em Configurações → Segurança para buscar leads reais',
            duration: 8000
          });
        } else {
          toast.success(`✅ ${data.results.length} leads REAIS encontrados!`, {
            description: `Fontes: ${data.sources?.join(', ') || 'Apollo, LinkedIn'}`,
            duration: 4000
          });
        }
      } else {
        // Nenhum resultado encontrado
        toast.warning('⚠️ Nenhum lead encontrado', {
          description: data.message || 'Tente ajustar os filtros de busca (cargo, localização, empresa, etc.)',
          duration: 6000
        });
      }
      
      console.log('🔍 [SEARCH] Busca concluída com sucesso!');
      console.log('🔍 ═══════════════════════════════════════════════════════');

    } catch (error: any) {
      console.error('❌ [SEARCH] Erro durante busca:', error);
      console.error('❌ [SEARCH] Error stack:', error.stack);
      
      toast.error('❌ Erro na busca', {
        description: error.message || 'Erro desconhecido ao buscar leads. Verifique o console (F12).',
        duration: 6000
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addArrayItem = (field: keyof SearchFilters, value: string, setTemp: (val: string) => void) => {
    if (value.trim()) {
      const currentArray = filters[field] as string[] || [];
      setFilters({
        ...filters,
        [field]: [...currentArray, value.trim()]
      });
      setTemp('');
    }
  };

  const removeArrayItem = (field: keyof SearchFilters, index: number) => {
    const currentArray = filters[field] as string[] || [];
    setFilters({
      ...filters,
      [field]: currentArray.filter((_, i) => i !== index)
    });
  };

  const toggleArrayItem = (field: keyof SearchFilters, value: string) => {
    const currentArray = filters[field] as string[] || [];
    const exists = currentArray.includes(value);
    
    setFilters({
      ...filters,
      [field]: exists 
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
    });
  };

  const renderBadges = (field: keyof SearchFilters) => {
    const items = filters[field] as string[] || [];
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            {item}
            <X
              className="w-3 h-3 cursor-pointer hover:text-red-500"
              onClick={() => removeArrayItem(field, index)}
            />
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com Botão de Busca */}
      <div className={`p-6 rounded-2xl ${
        theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold flex items-center gap-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                <Search className="w-6 h-6 text-white" />
              </div>
              {searchTitle}
            </h1>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Configure os filtros e encontre leads qualificados automaticamente
            </p>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
            size="lg"
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
        </div>
      </div>

      {/* Tipo de Busca */}
      <Tabs value={searchType} onValueChange={(val) => setSearchType(val as 'people' | 'companies')}>
        <TabsList className={`grid w-full grid-cols-2 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-white'
        }`}>
          <TabsTrigger value="people" className="gap-2">
            <Users className="w-4 h-4" />
            Buscar Pessoas
          </TabsTrigger>
          <TabsTrigger value="companies" className="gap-2">
            <Building2 className="w-4 h-4" />
            Buscar Empresas
          </TabsTrigger>
        </TabsList>

        {/* ============================================ */}
        {/* BUSCA DE PESSOAS - COMPLETA */}
        {/* ============================================ */}
        <TabsContent value="people" className="space-y-6 mt-6">
          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
            
            {/* Seção 1: Informações Básicas */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Users className="w-5 h-5 text-blue-500" />
                Informações Básicas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo ou Palavra-chave</Label>
                  <Input
                    placeholder="Ex: João Silva, CEO, Marketing..."
                    value={filters.personName || ''}
                    onChange={(e) => setFilters({ ...filters, personName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Primeiro Nome</Label>
                  <Input
                    placeholder="Ex: João"
                    value={filters.firstName || ''}
                    onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            {/* Seção 2: Cargo & Função */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Briefcase className="w-5 h-5 text-purple-500" />
                Cargo & Função
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Títulos de Cargo (Atual)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: CEO, VP Sales, Marketing Manager..."
                      value={tempJobTitle}
                      onChange={(e) => setTempJobTitle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('jobTitles', tempJobTitle, setTempJobTitle);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem('jobTitles', tempJobTitle, setTempJobTitle)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {renderBadges('jobTitles')}
                </div>

                <div>
                  <Label>Área de Atuação</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value=""
                    onChange={(e) => toggleArrayItem('function', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {FUNCTION_AREAS.map((func) => (
                      <option key={func} value={func}>{func}</option>
                    ))}
                  </select>
                  {renderBadges('function')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nível Hierárquico (Seniority)</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value=""
                    onChange={(e) => toggleArrayItem('seniority', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {SENIORITY_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {renderBadges('seniority')}
                </div>

                <div>
                  <Label>Anos de Experiência</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value={filters.yearsOfExperience || ''}
                    onChange={(e) => setFilters({ ...filters, yearsOfExperience: e.target.value })}
                  >
                    <option value="">Qualquer</option>
                    {YEARS_OPTIONS.map((years) => (
                      <option key={years} value={years}>{years} anos</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            {/* Seção 3: Empresa */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Building2 className="w-5 h-5 text-green-500" />
                Empresa
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Empresa Atual</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Google, Microsoft, Apple..."
                      value={tempCompany}
                      onChange={(e) => setTempCompany(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('currentCompany', tempCompany, setTempCompany);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem('currentCompany', tempCompany, setTempCompany)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {renderBadges('currentCompany')}
                </div>

                <div>
                  <Label>Tamanho da Empresa</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value=""
                    onChange={(e) => toggleArrayItem('companyHeadcount', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>{size} funcionários</option>
                    ))}
                  </select>
                  {renderBadges('companyHeadcount')}
                </div>
              </div>

              <div>
                <Label>Indústria</Label>
                <select
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                  value=""
                  onChange={(e) => toggleArrayItem('industries', e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {renderBadges('industries')}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            {/* Seção 4: Localização */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <MapPin className="w-5 h-5 text-red-500" />
                Localização
              </h3>
              
              <div>
                <Label>Localização (Cidade, Estado, País)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Lisboa, Portugal / São Paulo, Brasil / New York, USA"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('locations', tempLocation, setTempLocation);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem('locations', tempLocation, setTempLocation)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {renderBadges('locations')}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            {/* Seção 5: Educação */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                Educação
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Instituição de Ensino</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Harvard, MIT, Stanford..."
                      value={tempSchool}
                      onChange={(e) => setTempSchool(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('schools', tempSchool, setTempSchool);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem('schools', tempSchool, setTempSchool)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {renderBadges('schools')}
                </div>

                <div>
                  <Label>Grau de Formação</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value=""
                    onChange={(e) => toggleArrayItem('degreeType', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {DEGREE_TYPES.map((degree) => (
                      <option key={degree} value={degree}>{degree}</option>
                    ))}
                  </select>
                  {renderBadges('degreeType')}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            {/* Seção 6: Habilidades & Idiomas */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                Habilidades & Idiomas
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Habilidades (Skills)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Python, React, Sales, Marketing..."
                      value={tempSkill}
                      onChange={(e) => setTempSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('skills', tempSkill, setTempSkill);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem('skills', tempSkill, setTempSkill)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {renderBadges('skills')}
                </div>

                <div>
                  <Label>Tecnologias</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: AWS, Salesforce, HubSpot..."
                      value={tempTechnology}
                      onChange={(e) => setTempTechnology(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('technologies', tempTechnology, setTempTechnology);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => addArrayItem('technologies', tempTechnology, setTempTechnology)}
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {renderBadges('technologies')}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            {/* Seção 7: Informações de Contato */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Mail className="w-5 h-5 text-orange-500" />
                Informações de Contato
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasEmail || false}
                    onChange={(e) => setFilters({ ...filters, hasEmail: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Mail className="w-4 h-4" />
                  <span>Com Email</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasPhone || false}
                    onChange={(e) => setFilters({ ...filters, hasPhone: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Phone className="w-4 h-4" />
                  <span>Com Telefone</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasLinkedIn || false}
                    onChange={(e) => setFilters({ ...filters, hasLinkedIn: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Globe className="w-4 h-4" />
                  <span>Com LinkedIn</span>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

            {/* Seção 8: Mudanças Recentes */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
                Mudanças Recentes & Eventos
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.recentJobChange || false}
                    onChange={(e) => setFilters({ ...filters, recentJobChange: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Mudança de Emprego Recente</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.recentPromotion || false}
                    onChange={(e) => setFilters({ ...filters, recentPromotion: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Promoção Recente</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.workAnniversary || false}
                    onChange={(e) => setFilters({ ...filters, workAnniversary: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Aniversário de Trabalho</span>
                </label>
              </div>
            </div>

          </Card>
        </TabsContent>

        {/* ============================================ */}
        {/* BUSCA DE EMPRESAS - COMPLETA */}
        {/* ============================================ */}
        <TabsContent value="companies" className="space-y-6 mt-6">
          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
            
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                <Building2 className="w-5 h-5 text-blue-500" />
                Informações da Empresa
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Empresa</Label>
                  <Input
                    placeholder="Ex: Google, Microsoft, Tesla..."
                    value={filters.companyName || ''}
                    onChange={(e) => setFilters({ ...filters, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Tipo de Empresa</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value=""
                    onChange={(e) => toggleArrayItem('companyType', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {COMPANY_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {renderBadges('companyType')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Número de Funcionários</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value=""
                    onChange={(e) => toggleArrayItem('companyHeadcount', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>{size} funcionários</option>
                    ))}
                  </select>
                  {renderBadges('companyHeadcount')}
                </div>

                <div>
                  <Label>Receita Anual</Label>
                  <select
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                    value=""
                    onChange={(e) => toggleArrayItem('companyRevenue', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {REVENUE_RANGES.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {renderBadges('companyRevenue')}
                </div>
              </div>

              <div>
                <Label>Indústria</Label>
                <select
                  className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                  value=""
                  onChange={(e) => toggleArrayItem('companyIndustry', e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                {renderBadges('companyIndustry')}
              </div>

              <div>
                <Label>Localização</Label>
                <Input
                  placeholder="Ex: San Francisco, CA / Londres, UK"
                  value={filters.companyLocation || ''}
                  onChange={(e) => setFilters({ ...filters, companyLocation: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.recentFunding || false}
                    onChange={(e) => setFilters({ ...filters, recentFunding: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Financiamento Recente</span>
                </label>

                <div>
                  <Label>Taxa de Crescimento</Label>
                  <Input
                    placeholder="Ex: 20%, 50%, 100%+"
                    value={filters.companyGrowthRate || ''}
                    onChange={(e) => setFilters({ ...filters, companyGrowthRate: e.target.value })}
                  />
                </div>
              </div>
            </div>

          </Card>
        </TabsContent>
      </Tabs>

      {/* Resultados da Busca */}
      {console.log('🎨 [RENDER] ========================================')}
      {console.log('🎨 [RENDER] Verificando se deve mostrar resultados')}
      {console.log('🎨 [RENDER] searchResults.length:', searchResults.length)}
      {console.log('🎨 [RENDER] Condição (>0):', searchResults.length > 0)}
      {console.log('🎨 [RENDER] ========================================')}
      {searchResults.length > 0 && (
        <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
          {console.log('🎨 [RENDER] ✅ Card de resultados sendo renderizado!')}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Resultados ({searchResults.length})
            </h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                } transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{result.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {result.source}
                      </Badge>
                    </div>
                    
                    {result.title && (
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {result.title}
                        {result.company && ` @ ${result.company}`}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      {result.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {result.location}
                        </span>
                      )}
                      {result.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {result.email}
                        </span>
                      )}
                      {result.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {result.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}