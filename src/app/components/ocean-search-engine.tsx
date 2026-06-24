import React, { useState, useEffect } from 'react';
import { useTheme } from '../lib/ThemeContext';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
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
  Zap,
  Sparkles,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Waves,
  Compass,
  Brain,
  CircleDot,
  Linkedin,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SearchTestPanel } from './search-test-panel';
import { ApiSetupWizard } from './api-setup-wizard';
import { ApiErrorBanner } from './api-error-banner';

// 🌊 CONCEITO: BUSCA EM MAR ABERTO (OCEANO AZUL)
// Busca livre no LinkedIn, Apollo, PDL, Hunter, etc
// IA sugere os MELHORES leads possíveis baseado nos filtros

interface SearchFilters {
  // 🎯 BUSCA BÁSICA
  keywords?: string;
  firstName?: string;
  lastName?: string;
  
  // 💼 CARREIRA & POSIÇÃO
  currentJobTitle?: string[];
  pastJobTitle?: string[];
  seniority?: string[];
  jobFunction?: string[];
  yearsAtCompany?: string;
  yearsInPosition?: string;
  yearsOfExperience?: string;
  
  // 🏢 EMPRESA
  currentCompany?: string[];
  pastCompany?: string[];
  companySize?: string[];
  companyType?: string[];
  companyRevenue?: string[];
  companyGrowth?: string;
  industry?: string[];
  
  // 📍 GEOGRAFIA
  location?: string[];
  city?: string[];
  country?: string[];
  region?: string[];
  
  // 🎓 EDUCAÇÃO
  school?: string[];
  degree?: string[];
  fieldOfStudy?: string[];
  
  // 💡 SKILLS & TECH
  skills?: string[];
  technologies?: string[];
  certifications?: string[];
  languages?: string[];
  
  // 📧 CONTATO
  hasEmail?: boolean;
  hasPhone?: boolean;
  hasLinkedIn?: boolean;
  emailVerified?: boolean;
  
  // 🔥 SINAIS DE INTENÇÃO (Intent Signals)
  recentJobChange?: boolean;
  recentPromotion?: boolean;
  hiring?: boolean;
  fundingEvent?: boolean;
  newsworthy?: boolean;
  
  // 👥 SOCIAL & ENGAGEMENT
  linkedInConnections?: string;
  profileViews?: string;
  postActivity?: string;
  
  // 🎯 QUALIDADE DO LEAD
  minLeadScore?: number;
  audienceSize?: string;
}

// Opções expandidas
const SENIORITY_OPTIONS = [
  'Owner / Partner',
  'C-Level (CXO, CEO, CFO, CMO, etc)',
  'VP / SVP / EVP',
  'Director',
  'Manager',
  'Senior',
  'Entry Level',
  'Intern'
];

const JOB_FUNCTIONS = [
  'Sales',
  'Marketing',
  'Business Development',
  'Finance',
  'Operations',
  'Human Resources',
  'Engineering',
  'Product Management',
  'Information Technology',
  'Real Estate',
  'Legal',
  'Customer Success',
  'Consulting',
  'Executive',
  'Administrative'
];

const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10000',
  '10000+'
];

const INDUSTRIES = [
  'Real Estate',
  'Financial Services',
  'Technology',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Professional Services',
  'Construction',
  'Hospitality',
  'Education',
  'Government',
  'Nonprofit',
  'Energy',
  'Transportation'
];

const COUNTRIES = [
  '🇵🇹 Portugal',
  '🇧🇷 Brasil',
  '🇺🇸 United States',
  '🇬🇧 United Kingdom',
  '🇪🇸 España',
  '🇫🇷 France',
  '🇩🇪 Germany',
  '🇮🇹 Italy',
  '🇨🇦 Canada',
  '🇦🇺 Australia',
  '🇲🇽 Mexico',
  '🇦🇪 UAE'
];

const REVENUE_RANGES = [
  '$0-$1M',
  '$1M-$10M',
  '$10M-$50M',
  '$50M-$100M',
  '$100M-$500M',
  '$500M-$1B',
  '$1B+'
];

export function OceanSearchEngine() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [searchMode, setSearchMode] = useState<'people' | 'companies'>('people');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    career: false,
    company: false,
    location: false,
    education: false,
    skills: false,
    contact: false,
    signals: false
  });
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiErrors, setApiErrors] = useState<any[]>([]);
  
  // Auto-sugestões de IA baseadas nos filtros
  useEffect(() => {
    generateAiSuggestions();
  }, [filters]);
  
  const generateAiSuggestions = () => {
    const suggestions: string[] = [];
    
    if (filters.seniority?.includes('C-Level (CXO, CEO, CFO, CMO, etc)')) {
      suggestions.push('💡 Adicione "hasEmail: true" para garantir contato direto');
      suggestions.push('🎯 Filtre por "companySize: 51-200" para decisores acessíveis');
    }
    
    if (filters.industry?.includes('Real Estate')) {
      suggestions.push('🏆 Adicione "recentFundingEvent" para empresas em crescimento');
      suggestions.push('📈 Filtre por "hiring: true" para empresas expandindo');
    }
    
    if (filters.hasEmail === true) {
      suggestions.push('✅ Ótimo! Leads com email têm 3x mais taxa de conversão');
    }
    
    setAiSuggestions(suggestions);
  };
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const addArrayFilter = (key: keyof SearchFilters, value: string) => {
    const current = (filters[key] as string[]) || [];
    if (!current.includes(value)) {
      setFilters({
        ...filters,
        [key]: [...current, value]
      });
    }
  };
  
  const removeArrayFilter = (key: keyof SearchFilters, value: string) => {
    const current = (filters[key] as string[]) || [];
    setFilters({
      ...filters,
      [key]: current.filter(v => v !== value)
    });
  };
  
  const handleSearch = async () => {
    console.log('🌊 ═══════════════════════════════════════════════════════');
    console.log('🌊 [OCEAN SEARCH] Iniciando busca em mar aberto...');
    console.log('🌊 [OCEAN SEARCH] Mode:', searchMode);
    console.log('🌊 [OCEAN SEARCH] Filters:', JSON.stringify(filters, null, 2));
    
    setIsSearching(true);
    toast.info('🌊 Explorando o oceano de dados...', {
      description: 'Buscando nos melhores leads do LinkedIn, Apollo, PDL e mais'
    });
    
    try {
      // Nota: API atual só suporta busca de pessoas
      const endpoint = API_ROUTES.searchLeads;
      
      const url = `${API_BASE_URL}${endpoint}`;
      
      console.log('🌊 [OCEAN SEARCH] URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          filters: {
            ...filters,
            searchType: searchMode
          }
        })
      });
      
      console.log('🌊 [OCEAN SEARCH] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [OCEAN SEARCH] Error:', errorText);
        throw new Error(`Erro na busca: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('🌊 [OCEAN SEARCH] Resultados:', data);
      
      setResults(data.results || []);
      console.log('🌊 [OCEAN SEARCH] ✅ Estado "results" atualizado com', (data.results || []).length, 'itens');
      console.log('🌊 [OCEAN SEARCH] Primeiros 3 resultados:', JSON.stringify((data.results || []).slice(0, 3), null, 2));
      
      // Notificações sobre status das APIs
      if (data.apiStatus) {
        const { workingApis, failedApis, errors } = data.apiStatus;
        
        // Salvar erros para exibir
        setApiErrors(errors || []);
        
        if (workingApis === 0 && failedApis > 0) {
          // NENHUMA API REAL FUNCIONANDO - Mas tem dados de demo
          toast.warning('⚠️ Usando dados de demonstração', {
            description: 'Configure API keys para buscar dados reais. Clique para configurar.',
            duration: 8000,
            action: {
              label: 'Configurar APIs',
              onClick: () => setShowApiSetup(true)
            }
          });
        } else if (workingApis > 0 && data.results && data.results.length > 0) {
          toast.success(`✅ ${data.results.length} leads encontrados!`, {
            description: `Dados de ${workingApis} API(s): ${data.apiStatus.apiSuccess?.join(', ')}`,
            duration: 5000
          });
        } else if (data.results && data.results.length > 0) {
          // Tem resultados mas são dados demo
          toast.info(`📊 ${data.results.length} leads de demonstração`, {
            description: 'Configure APIs para buscar dados reais',
            duration: 5000
          });
        } else {
          toast.info('ℹ️ Nenhum resultado', {
            description: 'Tente ajustar os filtros ou expandir a busca'
          });
        }
        
        // Avisos sobre APIs com problemas (mas sem bloquear)
        if (failedApis > 0 && workingApis > 0) {
          toast.warning(`⚠️ ${failedApis} API(s) com problemas`, {
            description: `${workingApis} API(s) funcionando. Clique para ver detalhes.`,
            duration: 8000,
            action: {
              label: 'Ver Detalhes',
              onClick: () => setShowApiSetup(true)
            }
          });
          
          // Log detalhado
          errors.forEach((err: any) => {
            console.warn(`⚠️ ${err.api}:`, err.error);
          });
        }
      }
      
    } catch (error) {
      console.error('❌ [OCEAN SEARCH] Erro:', error);
      toast.error('❌ Erro na busca', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      console.log('🌊 [OCEAN SEARCH] Finalizado');
      console.log('🌊 ═══════════════════════════════════════════════════════');
      setIsSearching(false);
    }
  };
  
  const renderFilterSection = (
    id: string,
    icon: React.ReactNode,
    title: string,
    children: React.ReactNode
  ) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
        <button
          onClick={() => toggleSection(id)}
          className={`w-full flex items-center justify-between p-4 hover:bg-opacity-50 transition-colors ${
            theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-semibold">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
  const renderArrayInput = (
    label: string,
    filterKey: keyof SearchFilters,
    placeholder: string,
    suggestions?: string[]
  ) => {
    const [inputValue, setInputValue] = useState('');
    const values = (filters[filterKey] as string[]) || [];
    
    return (
      <div>
        <Label className="text-sm mb-2 block">{label}</Label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                addArrayFilter(filterKey, inputValue.trim());
                setInputValue('');
              }
            }}
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={() => {
              if (inputValue.trim()) {
                addArrayFilter(filterKey, inputValue.trim());
                setInputValue('');
              }
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Sugestões rápidas */}
        {suggestions && suggestions.length > 0 && values.length === 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map(sug => (
              <Badge
                key={sug}
                variant="outline"
                className="cursor-pointer hover:bg-orange-500 hover:text-white transition-colors"
                onClick={() => addArrayFilter(filterKey, sug)}
              >
                + {sug}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Valores selecionados */}
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {values.map(value => (
              <Badge
                key={value}
                className="flex items-center gap-1 bg-orange-500 text-white"
              >
                {value}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-200"
                  onClick={() => removeArrayFilter(filterKey, value)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderSelectMultiple = (
    label: string,
    filterKey: keyof SearchFilters,
    options: string[]
  ) => {
    const values = (filters[filterKey] as string[]) || [];
    
    return (
      <div>
        <Label className="text-sm mb-2 block">{label}</Label>
        <select
          className={`w-full p-2 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-gray-300'
          }`}
          value=""
          onChange={(e) => {
            if (e.target.value) {
              addArrayFilter(filterKey, e.target.value);
            }
          }}
        >
          <option value="">Selecione...</option>
          {options.map(opt => (
            <option key={opt} value={opt} disabled={values.includes(opt)}>
              {opt}
            </option>
          ))}
        </select>
        
        {values.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {values.map(value => (
              <Badge
                key={value}
                className="flex items-center gap-1 bg-orange-500 text-white"
              >
                {value}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-200"
                  onClick={() => removeArrayFilter(filterKey, value)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderResultCard = (result: any, index: number) => {
    const isDemo = result.source === 'demo';
    
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20'
            : 'bg-white border-gray-200 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{result.name}</h3>
              {isDemo ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  🎭 Demo Data
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {result.source}
                </Badge>
              )}
              {result.leadScore && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  Score: {result.leadScore}
                </Badge>
              )}
            </div>
            
            {result.title && (
              <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {result.title}
                {result.company && ` @ ${result.company}`}
              </p>
            )}
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {result.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{result.location}</span>
                </div>
              )}
              {result.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-xs">{result.email}</span>
                </div>
              )}
              {result.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span>{result.phone}</span>
                </div>
              )}
              {result.linkedinUrl && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <a 
                    href={result.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Perfil LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <Button
            size="sm"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </motion.div>
    );
  };
  
  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      
      {/* ============================================ */}
      {/* SIDEBAR DE FILTROS */}
      {/* ============================================ */}
      <div className={`w-96 rounded-2xl border overflow-hidden flex flex-col ${
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Buscar Leads</h2>
              <p className="text-xs text-gray-500">Mar aberto de leads</p>
            </div>
          </div>
          
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={searchMode === 'people' ? 'default' : 'outline'}
              className={searchMode === 'people' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0' 
                : ''
              }
              onClick={() => setSearchMode('people')}
            >
              <Users className="w-4 h-4 mr-2" />
              Pessoas
            </Button>
            <Button
              variant={searchMode === 'companies' ? 'default' : 'outline'}
              className={searchMode === 'companies' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0' 
                : ''
              }
              onClick={() => setSearchMode('companies')}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Empresas
            </Button>
          </div>
        </div>
        
        {/* Filtros - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {searchMode === 'people' ? (
            <>
              {/* BÁSICO */}
              {renderFilterSection(
                'basic',
                <Search className="w-5 h-5 text-orange-500" />,
                'Busca Básica',
                <>
                  {renderArrayInput(
                    'Palavras-chave',
                    'keywords' as any,
                    'CEO, Marketing, Vendas...',
                    ['CEO', 'Founder', 'VP Sales', 'Director']
                  )}
                </>
              )}
              
              {/* CARREIRA */}
              {renderFilterSection(
                'career',
                <Briefcase className="w-5 h-5 text-purple-500" />,
                'Carreira & Posição',
                <>
                  {renderArrayInput(
                    'Cargo Atual',
                    'currentJobTitle',
                    'Ex: CEO, VP Sales, Director...'
                  )}
                  {renderSelectMultiple('Nível Hierárquico', 'seniority', SENIORITY_OPTIONS)}
                  {renderSelectMultiple('Área de Atuação', 'jobFunction', JOB_FUNCTIONS)}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm mb-2 block">Anos na Empresa</Label>
                      <Input
                        type="text"
                        placeholder="Ex: 2-5"
                        value={filters.yearsAtCompany || ''}
                        onChange={(e) => setFilters({ ...filters, yearsAtCompany: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Anos de Experiência</Label>
                      <Input
                        type="text"
                        placeholder="Ex: 10+"
                        value={filters.yearsOfExperience || ''}
                        onChange={(e) => setFilters({ ...filters, yearsOfExperience: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* EMPRESA */}
              {renderFilterSection(
                'company',
                <Building2 className="w-5 h-5 text-green-500" />,
                'Empresa',
                <>
                  {renderArrayInput(
                    'Empresa Atual',
                    'currentCompany',
                    'Google, Microsoft, Apple...'
                  )}
                  {renderSelectMultiple('Tamanho da Empresa', 'companySize', COMPANY_SIZES)}
                  {renderSelectMultiple('Indústria', 'industry', INDUSTRIES)}
                  {renderSelectMultiple('Receita Anual', 'companyRevenue', REVENUE_RANGES)}
                </>
              )}
              
              {/* LOCALIZAÇÃO */}
              {renderFilterSection(
                'location',
                <MapPin className="w-5 h-5 text-red-500" />,
                'Localização',
                <>
                  {renderArrayInput(
                    'Cidade',
                    'city',
                    'Lisboa, São Paulo, New York...'
                  )}
                  {renderSelectMultiple('País', 'country', COUNTRIES)}
                </>
              )}
              
              {/* EDUCAÇÃO */}
              {renderFilterSection(
                'education',
                <GraduationCap className="w-5 h-5 text-indigo-500" />,
                'Educação',
                <>
                  {renderArrayInput(
                    'Universidade',
                    'school',
                    'Harvard, MIT, Stanford...',
                    ['Harvard', 'MIT', 'Stanford', 'Oxford']
                  )}
                  {renderArrayInput(
                    'Grau',
                    'degree',
                    'MBA, PhD, Bachelor...',
                    ['MBA', 'PhD', 'Master', 'Bachelor']
                  )}
                  {renderArrayInput(
                    'Área de Estudo',
                    'fieldOfStudy',
                    'Business, Engineering, Marketing...'
                  )}
                </>
              )}
              
              {/* SKILLS */}
              {renderFilterSection(
                'skills',
                <Star className="w-5 h-5 text-yellow-500" />,
                'Skills & Tecnologias',
                <>
                  {renderArrayInput(
                    'Habilidades',
                    'skills',
                    'Sales, Marketing, Leadership...'
                  )}
                  {renderArrayInput(
                    'Tecnologias',
                    'technologies',
                    'Salesforce, HubSpot, AWS...'
                  )}
                  {renderArrayInput(
                    'Certificações',
                    'certifications',
                    'PMP, AWS, Google Ads...'
                  )}
                </>
              )}
              
              {/* CONTATO */}
              {renderFilterSection(
                'contact',
                <Mail className="w-5 h-5 text-orange-500" />,
                'Informações de Contato',
                <>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasEmail || false}
                        onChange={(e) => setFilters({ ...filters, hasEmail: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <Mail className="w-4 h-4" />
                      <span>Apenas com Email</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hasPhone || false}
                        onChange={(e) => setFilters({ ...filters, hasPhone: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <Phone className="w-4 h-4" />
                      <span>Apenas com Telefone</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.emailVerified || false}
                        onChange={(e) => setFilters({ ...filters, emailVerified: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Email Verificado</span>
                    </label>
                  </div>
                </>
              )}
              
              {/* SINAIS DE INTENÇÃO */}
              {renderFilterSection(
                'signals',
                <Zap className="w-5 h-5 text-cyan-500" />,
                'Sinais de Intenção',
                <>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.recentJobChange || false}
                        onChange={(e) => setFilters({ ...filters, recentJobChange: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <TrendingUp className="w-4 h-4" />
                      <span>Mudança de Emprego Recente</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.hiring || false}
                        onChange={(e) => setFilters({ ...filters, hiring: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <Users className="w-4 h-4" />
                      <span>Empresa Contratando</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.fundingEvent || false}
                        onChange={(e) => setFilters({ ...filters, fundingEvent: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <TrendingUp className="w-4 h-4" />
                      <span>Evento de Financiamento</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.newsworthy || false}
                        onChange={(e) => setFilters({ ...filters, newsworthy: e.target.checked })}
                        className="w-4 h-4 accent-orange-500"
                      />
                      <Sparkles className="w-4 h-4" />
                      <span>Mencionado em Notícias</span>
                    </label>
                  </div>
                </>
              )}
            </>
          ) : (
            // BUSCA DE EMPRESAS
            <>
              {renderFilterSection(
                'basic',
                <Building2 className="w-5 h-5 text-orange-500" />,
                'Informações Básicas',
                <>
                  {renderArrayInput(
                    'Nome da Empresa',
                    'currentCompany',
                    'Google, Microsoft, Tesla...'
                  )}
                  {renderSelectMultiple('Tamanho', 'companySize', COMPANY_SIZES)}
                  {renderSelectMultiple('Indústria', 'industry', INDUSTRIES)}
                  {renderSelectMultiple('Receita', 'companyRevenue', REVENUE_RANGES)}
                </>
              )}
              
              {renderFilterSection(
                'location',
                <MapPin className="w-5 h-5 text-red-500" />,
                'Localização',
                <>
                  {renderSelectMultiple('País', 'country', COUNTRIES)}
                  {renderArrayInput('Cidade', 'city', 'São Paulo, Lisboa...')}
                </>
              )}
              
              {renderFilterSection(
                'signals',
                <Zap className="w-5 h-5 text-cyan-500" />,
                'Sinais de Crescimento',
                <>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hiring || false}
                      onChange={(e) => setFilters({ ...filters, hiring: e.target.checked })}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <Users className="w-4 h-4" />
                    <span>Contratando Ativamente</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.fundingEvent || false}
                      onChange={(e) => setFilters({ ...filters, fundingEvent: e.target.checked })}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <TrendingUp className="w-4 h-4" />
                    <span>Financiamento Recente</span>
                  </label>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Footer com Botão de Busca */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 h-12"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Explorando oceano...
              </>
            ) : (
              <>
                <Compass className="w-5 h-5 mr-2" />
                Iniciar Busca
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* ============================================ */}
      {/* ÁREA PRINCIPAL - RESULTADOS */}
      {/* ============================================ */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header com Stats e IA */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <Search className="w-6 h-6 text-white" />
                </div>
                Buscar Leads
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Busca livre em LinkedIn, Apollo, PDL, Hunter e mais APIs
              </p>
            </div>
            
            {/* Sugestões de IA */}
            {aiSuggestions.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowAiPanel(!showAiPanel)}
                className="gap-2"
              >
                <Brain className="w-4 h-4" />
                {aiSuggestions.length} Sugestões de IA
                <Badge className="bg-orange-500 text-white">{aiSuggestions.length}</Badge>
              </Button>
            )}
          </div>
          
          {/* Painel de Sugestões */}
          <AnimatePresence>
            {showAiPanel && aiSuggestions.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-4 rounded-xl border-2 ${
                  theme === 'dark' 
                    ? 'bg-slate-700 border-orange-500/30' 
                    : 'bg-orange-50 border-orange-200'
                }`}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    Sugestões Inteligentes da IA
                  </h3>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-sm ${
                          theme === 'dark' ? 'bg-slate-600' : 'bg-white'
                        }`}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Banner de Erros de API */}
        {apiErrors.length > 0 && !showApiSetup && (
          <ApiErrorBanner
            errors={apiErrors}
            onDismiss={() => setApiErrors([])}
            onConfigure={() => setShowApiSetup(true)}
          />
        )}
        
        {/* Resultados ou Empty State */}
        <div className="flex-1 overflow-y-auto">
          {showApiSetup ? (
            // API Setup Wizard
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Configuração de APIs</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiSetup(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Fechar
                </Button>
              </div>
              <ApiSetupWizard />
            </div>
          ) : results.length === 0 ? (
            <div className={`h-full flex items-center justify-center rounded-2xl border-2 border-dashed ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-300'
            }`}>
              <div className="text-center p-12">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <Waves className="w-12 h-12 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pronto para Explorar?</h3>
                <p className="text-gray-500 mb-6">
                  Configure os filtros à esquerda e inicie sua busca oceânica.<br/>
                  Vamos encontrar os melhores leads do mercado para você!
                </p>
                
                <Button
                  onClick={() => setShowApiSetup(true)}
                  className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar APIs
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>LinkedIn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Apollo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>PDL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>Hunter</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header dos Resultados */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {results.length} {searchMode === 'people' ? 'Pessoas' : 'Empresas'} Encontradas
                </h2>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
              
              {/* Cards de Resultados */}
              {results.map((result, index) => renderResultCard(result, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}