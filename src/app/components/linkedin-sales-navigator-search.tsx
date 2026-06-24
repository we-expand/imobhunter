import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';
import { toast } from 'sonner';
import {
  Search,
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  TrendingUp,
  Filter,
  X,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
  Save,
  Star,
  User,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
  Sparkles,
  Award,
  Globe,
  Calendar,
  DollarSign,
  BarChart3,
  UserCheck,
  Hash,
  Languages,
  Shield,
  Zap,
  AlertCircle,
  Info
} from 'lucide-react';
import { APIInfoModal, useAPIInfoModal } from './api-info-modal';

interface AdvancedSearchFilters {
  // 👤 PESSOA
  firstName: string;
  lastName: string;
  name: string;
  currentTitle: string;
  pastTitle: string;
  
  // 💼 CARGO/FUNÇÃO
  seniority: string[];
  function: string[];
  yearsInCurrentPosition: string;
  yearsAtCurrentCompany: string;
  
  // 🏢 EMPRESA ATUAL
  currentCompany: string;
  pastCompany: string;
  industry: string[];
  companySize: string[];
  companyType: string[];
  companyHeadcount: string;
  companyRevenue: string[];
  companyGrowth: string[];
  department: string[];
  
  // 📍 GEOGRAFIA
  country: string[];
  state: string;
  city: string;
  postalCode: string;
  radius: number;
  
  // 🎓 EDUCAÇÃO
  school: string;
  degree: string[];
  fieldOfStudy: string;
  graduationYear: string;
  
  // 💡 EXPERIÊNCIA & SKILLS
  skills: string;
  yearsOfExperience: string;
  certifications: string;
  languages: string[];
  
  // 🔗 ATIVIDADE LINKEDIN
  postedOnLinkedIn: string;
  changedJobs: string;
  mentionsInNews: boolean;
  
  // 🌐 CONEXÕES & REDE
  connectionOf: string;
  connectionDegree: string[];
  followsCompany: string;
  memberOfGroup: string;
  
  // 🔍 PALAVRAS-CHAVE
  keywords: string;
  booleanSearch: string;
  titleKeywords: string;
  companyKeywords: string;
  
  // 📊 FILTROS AVANÇADOS
  profileLanguage: string;
  hasEmail: boolean;
  hasPhone: boolean;
  recentlyActive: boolean;
  openToOpportunities: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  industry: string;
  companySize: string;
  seniority: string;
  yearsExperience: number;
  skills: string[];
  matchScore: number;
  recentActivity?: string;
  openToWork?: boolean;
}

export function LinkedInSalesNavigatorSearch() {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    // Pessoa
    firstName: '',
    lastName: '',
    name: '',
    currentTitle: '',
    pastTitle: '',
    
    // Cargo
    seniority: [],
    function: [],
    yearsInCurrentPosition: '',
    yearsAtCurrentCompany: '',
    
    // Empresa
    currentCompany: '',
    pastCompany: '',
    industry: [],
    companySize: [],
    companyType: [],
    companyHeadcount: '',
    companyRevenue: [],
    companyGrowth: [],
    department: [],
    
    // Geografia
    country: ['Portugal'],
    state: '',
    city: '',
    postalCode: '',
    radius: 50,
    
    // Educação
    school: '',
    degree: [],
    fieldOfStudy: '',
    graduationYear: '',
    
    // Experiência
    skills: '',
    yearsOfExperience: '',
    certifications: '',
    languages: [],
    
    // Atividade
    postedOnLinkedIn: '',
    changedJobs: '',
    mentionsInNews: false,
    
    // Conexões
    connectionOf: '',
    connectionDegree: [],
    followsCompany: '',
    memberOfGroup: '',
    
    // Keywords
    keywords: '',
    booleanSearch: '',
    titleKeywords: '',
    companyKeywords: '',
    
    // Avançado
    profileLanguage: 'pt',
    hasEmail: false,
    hasPhone: false,
    recentlyActive: false,
    openToOpportunities: false,
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [resultsPerPage, setResultsPerPage] = useState(25);
  const [isDemoData, setIsDemoData] = useState(false);
  const [apiWarning, setApiWarning] = useState<string | null>(null);
  
  // 🔔 Modal informativo sobre APIs
  const { isOpen: showAPIInfoAuto, closeModal: closeAPIInfoAuto } = useAPIInfoModal();
  const [showAPIInfoManual, setShowAPIInfoManual] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    person: true,
    job: true,
    company: false,
    geography: false,
    education: false,
    experience: false,
    activity: false,
    connections: false,
    advanced: false,
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Atualiza contador de filtros ativos
  const updateFilterCount = (newFilters: AdvancedSearchFilters) => {
    let count = 0;
    
    if (newFilters.name) count++;
    if (newFilters.currentTitle) count++;
    if (newFilters.currentCompany) count++;
    if (newFilters.seniority.length > 0) count++;
    if (newFilters.function.length > 0) count++;
    if (newFilters.industry.length > 0) count++;
    if (newFilters.companySize.length > 0) count++;
    if (newFilters.country.length > 0) count++;
    if (newFilters.city) count++;
    if (newFilters.skills) count++;
    if (newFilters.keywords) count++;
    if (newFilters.hasEmail) count++;
    if (newFilters.hasPhone) count++;
    
    setActiveFilterCount(count);
  };

  const handleFilterChange = (key: keyof AdvancedSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateFilterCount(newFilters);
  };

  const toggleArrayFilter = (key: keyof AdvancedSearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const handleSearch = async () => {
    console.log('');
    console.log('');
    console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
    console.log('🚨 ATENÇÃO: handleSearch FOI CHAMADA!');
    console.log('🚨 Se você vê esta mensagem, o botão ESTÁ FUNCIONANDO');
    console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
    console.log('🔥 [DEBUG] Estado searching antes:', searching);
    
    setSearching(true);
    console.log('✅ [DEBUG] setSearching(true) foi chamado - deve mostrar loading');
    
    try {
      console.log('═══════════════════════════════════════════════');
      console.log('🔍 BUSCA AVANÇADA LINKEDIN SALES NAVIGATOR');
      console.log('═══════════════════════════════════════════════');
      console.log('📋 Filtros atuais:', JSON.stringify(filters, null, 2));
      console.log('⏳ [DEBUG] Estado searching agora:', true);
      
      // 🔥 CHAMADA DIRETA PARA A API REAL DO SERVIDOR
      // Usando as 9 APIs de enriquecimento: Apollo, Hunter, PDL, RocketReach, etc.
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const searchPayload = {
        // Dados da pessoa
        firstName: filters.firstName || undefined,
        lastName: filters.lastName || undefined,
        currentTitle: filters.currentTitle || undefined,
        
        // Empresa
        currentCompany: filters.currentCompany || undefined,
        industry: filters.industry.length > 0 ? filters.industry : undefined,
        
        // Localização
        city: filters.city || undefined,
        country: filters.country.length > 0 ? filters.country : undefined,
        
        // Senioridade e função
        seniority: filters.seniority.length > 0 ? filters.seniority : undefined,
        
        // Keywords de busca
        keywords: filters.keywords || filters.booleanSearch || undefined,
        
        // Filtros de contato (opcional)
        hasEmail: filters.hasEmail || false,
        hasPhone: filters.hasPhone || false,
        
        // Limite de resultados
        limit: resultsPerPage
      };

      console.log('📡 URL da API:', `${API_BASE_URL}${API_ROUTES.searchLeads}`);
      console.log('📡 Payload enviado:', JSON.stringify(searchPayload, null, 2));

      const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.searchLeads}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(searchPayload),
        }
      );

      console.log('📡 Status da resposta:', response.status);
      console.log('📡 Status OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta da API:', response.status, errorText);
        
        toast.error('❌ Erro na busca de leads', {
          description: `Status ${response.status}: ${errorText.substring(0, 100)}`,
          duration: 8000,
        });
        
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Dados recebidos do servidor:', JSON.stringify(data, null, 2));

      if (data.success && data.results && data.results.length > 0) {
        console.log(`✅ ${data.results.length} resultados encontrados!`);
        
        // Converte resultados da API para o formato esperado pelo componente
        const formattedResults = data.results.map((person: any) => ({
          id: person.id,
          name: person.name || `${person.firstName} ${person.lastName}`,
          title: person.title || 'N/A',
          company: person.company || 'N/A',
          location: person.location || 'N/A',
          avatar: person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=150`,
          linkedinUrl: person.linkedinUrl || '',
          email: person.email || '',
          phone: person.phone || '',
          industry: person.industry || 'N/A',
          companySize: person.companySize || 'N/A',
          seniority: person.seniority || 'N/A',
          yearsExperience: person.yearsExperience || 0,
          skills: person.skills || [],
          matchScore: person.matchScore || 80,
          source: person.source || 'unknown',
          confidence: person.confidence || 80,
        }));

        console.log('🎨 [UI] ========================================');
        console.log('🎨 [UI] FORMATAÇÃO DOS RESULTADOS');
        console.log('🎨 [UI] ========================================');
        console.log('🎨 [UI] Resultados formatados:', formattedResults.length, 'leads');
        console.log('🎨 [UI] Primeiros 3 resultados:', JSON.stringify(formattedResults.slice(0, 3), null, 2));
        console.log('🎨 [UI] Chamando setResults...');
        
        setResults(formattedResults);
        
        console.log('✅ [UI] setResults foi chamado com', formattedResults.length, 'items!');
        console.log('📊 [UI] Estado results deve agora ter:', formattedResults.length, 'items');
        
        setSearching(false);
        
        console.log('✅ [UI] setSearching(false) chamado - loading deve desaparecer');
        console.log('🎨 [UI] ========================================');
        
        const sources = data.sources?.join(', ') || 'APIs';
        
        // 🔥 VERIFICAÇÃO: API Key inválida
        if (data.warning === 'apollo_key_invalid') {
          setIsDemoData(true);
          setApiWarning('Apollo.io API Key INVÁLIDA! Gere uma nova key em https://app.apollo.io/#/settings/integrations/api');
          toast.error('❌ API Key do Apollo.io INVÁLIDA!', {
            description: 'Gere uma nova key em https://app.apollo.io/#/settings/integrations/api e configure em Configurações → Segurança. Exibindo dados DEMO.',
            duration: 15000,
          });
          return;
        }
        
        // Verifica se são dados DEMO
        if (sources.includes('demo')) {
          setIsDemoData(true);
          setApiWarning('Configure API keys em Configurações → Segurança para buscar leads reais');
          toast.warning(`⚠️ ${formattedResults.length} perfis DEMO encontrados`, {
            description: data.message || 'Configure API keys em Configurações → Segurança para buscar leads reais',
            duration: 10000,
          });
        } else {
          setIsDemoData(false);
          setApiWarning(null);
          toast.success(`✅ ${formattedResults.length} perfis REAIS encontrados!`, {
            description: `Fontes: ${sources} | ${activeFilterCount} filtros aplicados`,
            duration: 5000,
          });
        }
        
        return;
      }
      
      // Se não encontrou resultados
      console.warn('⚠️ Nenhum resultado encontrado');
      console.warn('📊 Resposta completa:', data);
      console.log('');
      console.log('💡 DICAS PARA MELHORAR OS RESULTADOS:');
      console.log('   1. Remova alguns filtros (tente buscar SÓ por nome, sem cargo)');
      console.log('   2. Verifique se o perfil existe no LinkedIn Sales Navigator');
      console.log('   3. O Apollo.io pode não ter todos os perfis (cobertura limitada no Brasil)');
      console.log('   4. Considere adicionar o lead manualmente (botão "+ Adicionar Lead")');
      console.log('');
      
      setResults([]);
      
      const personName = filters.firstName && filters.lastName 
        ? `${filters.firstName} ${filters.lastName}`
        : filters.name || 'o perfil buscado';
      
      toast.warning('⚠️ Nenhum resultado encontrado', {
        description: `Não encontramos "${personName}" nas APIs disponíveis. Tente: (1) Remover filtros de cargo/empresa, (2) Verificar se o perfil existe no LinkedIn, ou (3) Adicionar manualmente no dashboard.`,
        duration: 12000,
      });
    } catch (error) {
      console.log('');
      console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
      console.error('🚨 ERRO CAPTURADO NO CATCH!');
      console.error('🚨 Tipo:', error instanceof Error ? 'Error' : typeof error);
      console.error('🚨 Mensagem:', error instanceof Error ? error.message : String(error));
      console.error('🚨 Stack:', error instanceof Error ? error.stack : 'N/A');
      console.error('🚨 Objeto completo:', error);
      console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
      console.log('');
      
      toast.error('❌ Erro ao buscar leads', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        duration: 10000
      });
      setResults([]);
    } finally {
      console.log('🏁 [DEBUG] FINALLY executado - setSearching(false)');
      setSearching(false);
      console.log('');
    }
  };

  // Função para lidar com Enter nos inputs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searching) {
      console.log('⌨️ [DEBUG] Enter pressionado! Iniciando busca...');
      e.preventDefault();
      handleSearch();
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setFilters({
      firstName: '',
      lastName: '',
      name: '',
      currentTitle: '',
      pastTitle: '',
      seniority: [],
      function: [],
      yearsInCurrentPosition: '',
      yearsAtCurrentCompany: '',
      currentCompany: '',
      pastCompany: '',
      industry: [],
      companySize: [],
      companyType: [],
      companyHeadcount: '',
      companyRevenue: [],
      companyGrowth: [],
      department: [],
      country: ['Portugal'],
      state: '',
      city: '',
      postalCode: '',
      radius: 50,
      school: '',
      degree: [],
      fieldOfStudy: '',
      graduationYear: '',
      skills: '',
      yearsOfExperience: '',
      certifications: '',
      languages: [],
      postedOnLinkedIn: '',
      changedJobs: '',
      mentionsInNews: false,
      connectionOf: '',
      connectionDegree: [],
      followsCompany: '',
      memberOfGroup: '',
      keywords: '',
      booleanSearch: '',
      titleKeywords: '',
      companyKeywords: '',
      profileLanguage: 'pt',
      hasEmail: false,
      hasPhone: false,
      recentlyActive: false,
      openToOpportunities: false,
    });
    setResults([]);
    setActiveFilterCount(0);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const exportSelected = () => {
    const selected = results.filter(r => selectedLeads.includes(r.id));
    toast.success(`${selected.length} leads exportados!`);
  };

  const addToPipeline = () => {
    const selected = results.filter(r => selectedLeads.includes(r.id));
    toast.success(`${selected.length} leads adicionados ao pipeline!`);
    setSelectedLeads([]);
  };

  return (
    <>
      {/* Modal informativo sobre APIs */}
      <APIInfoModal 
        isOpen={showAPIInfoAuto || showAPIInfoManual} 
        onClose={() => {
          closeAPIInfoAuto();
          setShowAPIInfoManual(false);
        }} 
      />
      
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* SIDEBAR DE FILTROS */}
        <div className="w-96 flex-shrink-0">
        <ScrollArea className="h-full">
          <Card>
            <CardHeader className="pb-4 sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Sales Navigator
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowAPIInfoManual(true)}
                      title="ℹ️ Sobre dados de busca e APIs"
                    >
                      <Info className="w-4 h-4 text-blue-600" />
                    </Button>
                  </CardTitle>
                  {activeFilterCount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {activeFilterCount} filtros ativos
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {/* 👤 PESSOA */}
              <div>
                <button
                  onClick={() => toggleSection('person')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Pessoa
                  </h3>
                  {expandedSections.person ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.person && (
                  <div className="space-y-3 pl-6">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Primeiro Nome</Label>
                        <Input
                          placeholder="Ex: João"
                          value={filters.firstName}
                          onChange={(e) => handleFilterChange('firstName', e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Sobrenome</Label>
                        <Input
                          placeholder="Ex: Silva"
                          value={filters.lastName}
                          onChange={(e) => handleFilterChange('lastName', e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Nome Completo</Label>
                      <Input
                        placeholder="Ex: João Silva"
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 💼 CARGO/FUNÇÃO */}
              <div>
                <button
                  onClick={() => toggleSection('job')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Cargo & Função
                  </h3>
                  {expandedSections.job ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.job && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs">Cargo Atual</Label>
                      <Input
                        placeholder="Ex: CEO, Director, Manager"
                        value={filters.currentTitle}
                        onChange={(e) => handleFilterChange('currentTitle', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Cargo Anterior</Label>
                      <Input
                        placeholder="Ex: Senior Manager"
                        value={filters.pastTitle}
                        onChange={(e) => handleFilterChange('pastTitle', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Nível de Senioridade</Label>
                      <div className="space-y-2">
                        {[
                          'C-Level (CEO, CFO, CTO)',
                          'VP (Vice President)',
                          'Director',
                          'Manager',
                          'Senior',
                          'Entry Level',
                          'Individual Contributor'
                        ].map((level) => (
                          <div key={level} className="flex items-center gap-2">
                            <Checkbox
                              id={`seniority-${level}`}
                              checked={filters.seniority.includes(level)}
                              onCheckedChange={() => toggleArrayFilter('seniority', level)}
                            />
                            <label htmlFor={`seniority-${level}`} className="text-sm cursor-pointer">
                              {level}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Função/Departamento</Label>
                      <div className="space-y-2">
                        {[
                          'Sales',
                          'Marketing',
                          'Engineering',
                          'Operations',
                          'Finance',
                          'Human Resources',
                          'Product Management',
                          'Business Development',
                          'Customer Success',
                          'IT',
                        ].map((func) => (
                          <div key={func} className="flex items-center gap-2">
                            <Checkbox
                              id={`function-${func}`}
                              checked={filters.function.includes(func)}
                              onCheckedChange={() => toggleArrayFilter('function', func)}
                            />
                            <label htmlFor={`function-${func}`} className="text-sm cursor-pointer">
                              {func}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Anos no Cargo Atual</Label>
                      <Select
                        value={filters.yearsInCurrentPosition}
                        onValueChange={(value) => handleFilterChange('yearsInCurrentPosition', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Menos de 1 ano</SelectItem>
                          <SelectItem value="1-2">1-2 anos</SelectItem>
                          <SelectItem value="2-5">2-5 anos</SelectItem>
                          <SelectItem value="5+">Mais de 5 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Anos na Empresa Atual</Label>
                      <Select
                        value={filters.yearsAtCurrentCompany}
                        onValueChange={(value) => handleFilterChange('yearsAtCurrentCompany', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Menos de 1 ano</SelectItem>
                          <SelectItem value="1-3">1-3 anos</SelectItem>
                          <SelectItem value="3-5">3-5 anos</SelectItem>
                          <SelectItem value="5-10">5-10 anos</SelectItem>
                          <SelectItem value="10+">Mais de 10 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 🏢 EMPRESA */}
              <div>
                <button
                  onClick={() => toggleSection('company')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Empresa
                  </h3>
                  {expandedSections.company ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.company && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs">Empresa Atual</Label>
                      <Input
                        placeholder="Ex: Keller Williams"
                        value={filters.currentCompany}
                        onChange={(e) => handleFilterChange('currentCompany', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Empresa Anterior</Label>
                      <Input
                        placeholder="Ex: RE/MAX"
                        value={filters.pastCompany}
                        onChange={(e) => handleFilterChange('pastCompany', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Setor/Indústria</Label>
                      <div className="space-y-2">
                        {[
                          'Real Estate',
                          'PropTech',
                          'Construction',
                          'Architecture & Planning',
                          'Real Estate Investment',
                          'Property Management',
                          'Commercial Real Estate',
                          'Residential Real Estate',
                          'Financial Services',
                          'Technology',
                        ].map((industry) => (
                          <div key={industry} className="flex items-center gap-2">
                            <Checkbox
                              id={`industry-${industry}`}
                              checked={filters.industry.includes(industry)}
                              onCheckedChange={() => toggleArrayFilter('industry', industry)}
                            />
                            <label htmlFor={`industry-${industry}`} className="text-sm cursor-pointer">
                              {industry}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Tamanho da Empresa (Funcionários)</Label>
                      <div className="space-y-2">
                        {[
                          '1-10 (Startup)',
                          '11-50 (Small)',
                          '51-200 (Medium)',
                          '201-500 (Large)',
                          '501-1000',
                          '1001-5000',
                          '5001-10000',
                          '10000+ (Enterprise)',
                        ].map((size) => (
                          <div key={size} className="flex items-center gap-2">
                            <Checkbox
                              id={`size-${size}`}
                              checked={filters.companySize.includes(size)}
                              onCheckedChange={() => toggleArrayFilter('companySize', size)}
                            />
                            <label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                              {size}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Tipo de Empresa</Label>
                      <div className="space-y-2">
                        {[
                          'Publicly Traded',
                          'Private',
                          'Partnership',
                          'Non-profit',
                          'Self-employed',
                          'Government Agency',
                          'Educational Institution',
                        ].map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={filters.companyType.includes(type)}
                              onCheckedChange={() => toggleArrayFilter('companyType', type)}
                            />
                            <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Receita Anual (USD)</Label>
                      <div className="space-y-2">
                        {[
                          'Less than $1M',
                          '$1M - $10M',
                          '$10M - $50M',
                          '$50M - $100M',
                          '$100M - $500M',
                          '$500M - $1B',
                          '$1B+',
                        ].map((revenue) => (
                          <div key={revenue} className="flex items-center gap-2">
                            <Checkbox
                              id={`revenue-${revenue}`}
                              checked={filters.companyRevenue.includes(revenue)}
                              onCheckedChange={() => toggleArrayFilter('companyRevenue', revenue)}
                            />
                            <label htmlFor={`revenue-${revenue}`} className="text-sm cursor-pointer">
                              {revenue}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Crescimento da Empresa</Label>
                      <div className="space-y-2">
                        {[
                          'Hyper Growth (50%+ anual)',
                          'Fast Growth (20-50% anual)',
                          'Steady Growth (0-20% anual)',
                          'Declining',
                        ].map((growth) => (
                          <div key={growth} className="flex items-center gap-2">
                            <Checkbox
                              id={`growth-${growth}`}
                              checked={filters.companyGrowth.includes(growth)}
                              onCheckedChange={() => toggleArrayFilter('companyGrowth', growth)}
                            />
                            <label htmlFor={`growth-${growth}`} className="text-sm cursor-pointer">
                              {growth}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 📍 GEOGRAFIA */}
              <div>
                <button
                  onClick={() => toggleSection('geography')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Geografia
                  </h3>
                  {expandedSections.geography ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.geography && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs mb-2 block">País/Região</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {[
                          'Portugal',
                          'Brasil',
                          'Espanha',
                          'França',
                          'Reino Unido',
                          'Alemanha',
                          'Itália',
                          'Estados Unidos',
                          'Canadá',
                          'México',
                          'Argentina',
                          'Emirados Árabes',
                        ].map((country) => (
                          <div key={country} className="flex items-center gap-2">
                            <Checkbox
                              id={`country-${country}`}
                              checked={filters.country.includes(country)}
                              onCheckedChange={() => toggleArrayFilter('country', country)}
                            />
                            <label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                              {country}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Estado/Região</Label>
                      <Input
                        placeholder="Ex: Lisboa, São Paulo"
                        value={filters.state}
                        onChange={(e) => handleFilterChange('state', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Cidade</Label>
                      <Input
                        placeholder="Ex: Lisboa, Porto"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Código Postal</Label>
                      <Input
                        placeholder="Ex: 1000-001"
                        value={filters.postalCode}
                        onChange={(e) => handleFilterChange('postalCode', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Raio de Busca: {filters.radius} km</Label>
                      <Slider
                        value={[filters.radius]}
                        onValueChange={([value]) => handleFilterChange('radius', value)}
                        min={10}
                        max={500}
                        step={10}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10 km</span>
                        <span>500 km</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 🎓 EDUCAÇÃO */}
              <div>
                <button
                  onClick={() => toggleSection('education')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Educação
                  </h3>
                  {expandedSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.education && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs">Escola/Universidade</Label>
                      <Input
                        placeholder="Ex: Universidade de Lisboa"
                        value={filters.school}
                        onChange={(e) => handleFilterChange('school', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Grau</Label>
                      <div className="space-y-2">
                        {[
                          'Doutoramento (PhD)',
                          'Mestrado (Master)',
                          'MBA',
                          'Licenciatura (Bachelor)',
                          'Pós-Graduação',
                          'Curso Técnico',
                        ].map((degree) => (
                          <div key={degree} className="flex items-center gap-2">
                            <Checkbox
                              id={`degree-${degree}`}
                              checked={filters.degree.includes(degree)}
                              onCheckedChange={() => toggleArrayFilter('degree', degree)}
                            />
                            <label htmlFor={`degree-${degree}`} className="text-sm cursor-pointer">
                              {degree}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Campo de Estudo</Label>
                      <Input
                        placeholder="Ex: Business, Engineering, Marketing"
                        value={filters.fieldOfStudy}
                        onChange={(e) => handleFilterChange('fieldOfStudy', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Ano de Formatura</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 2015"
                        value={filters.graduationYear}
                        onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 💡 EXPERIÊNCIA & SKILLS */}
              <div>
                <button
                  onClick={() => toggleSection('experience')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Experiência & Skills
                  </h3>
                  {expandedSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.experience && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs">Skills/Competências</Label>
                      <Textarea
                        placeholder="Ex: CRM, Salesforce, Lead Generation, Cold Calling"
                        value={filters.skills}
                        onChange={(e) => handleFilterChange('skills', e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separe por vírgulas</p>
                    </div>

                    <div>
                      <Label className="text-xs">Anos de Experiência Total</Label>
                      <Select
                        value={filters.yearsOfExperience}
                        onValueChange={(value) => handleFilterChange('yearsOfExperience', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 anos (Júnior)</SelectItem>
                          <SelectItem value="3-5">3-5 anos (Pleno)</SelectItem>
                          <SelectItem value="6-10">6-10 anos (Sênior)</SelectItem>
                          <SelectItem value="10-15">10-15 anos (Especialista)</SelectItem>
                          <SelectItem value="15+">15+ anos (Executivo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Certificações</Label>
                      <Input
                        placeholder="Ex: PMP, CISSP, AWS Certified"
                        value={filters.certifications}
                        onChange={(e) => handleFilterChange('certifications', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Idiomas</Label>
                      <div className="space-y-2">
                        {[
                          'Português',
                          'Inglês',
                          'Espanhol',
                          'Francês',
                          'Alemão',
                          'Italiano',
                          'Mandarim',
                          'Árabe',
                        ].map((lang) => (
                          <div key={lang} className="flex items-center gap-2">
                            <Checkbox
                              id={`lang-${lang}`}
                              checked={filters.languages.includes(lang)}
                              onCheckedChange={() => toggleArrayFilter('languages', lang)}
                            />
                            <label htmlFor={`lang-${lang}`} className="text-sm cursor-pointer">
                              {lang}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 🔗 ATIVIDADE LINKEDIN */}
              <div>
                <button
                  onClick={() => toggleSection('activity')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Atividade no LinkedIn
                  </h3>
                  {expandedSections.activity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.activity && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs">Postou no LinkedIn</Label>
                      <Select
                        value={filters.postedOnLinkedIn}
                        onValueChange={(value) => handleFilterChange('postedOnLinkedIn', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Qualquer período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Últimos 7 dias</SelectItem>
                          <SelectItem value="30">Últimos 30 dias</SelectItem>
                          <SelectItem value="90">Últimos 3 meses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Mudou de Emprego</Label>
                      <Select
                        value={filters.changedJobs}
                        onValueChange={(value) => handleFilterChange('changedJobs', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Qualquer período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">Últimos 30 dias</SelectItem>
                          <SelectItem value="90">Últimos 3 meses</SelectItem>
                          <SelectItem value="180">Últimos 6 meses</SelectItem>
                          <SelectItem value="365">Último ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="mentions"
                        checked={filters.mentionsInNews}
                        onCheckedChange={(checked) => handleFilterChange('mentionsInNews', checked)}
                      />
                      <label htmlFor="mentions" className="text-sm cursor-pointer">
                        Mencionado em notícias recentemente
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="recentlyActive"
                        checked={filters.recentlyActive}
                        onCheckedChange={(checked) => handleFilterChange('recentlyActive', checked)}
                      />
                      <label htmlFor="recentlyActive" className="text-sm cursor-pointer">
                        Ativo recentemente no LinkedIn
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="openToWork"
                        checked={filters.openToOpportunities}
                        onCheckedChange={(checked) => handleFilterChange('openToOpportunities', checked)}
                      />
                      <label htmlFor="openToWork" className="text-sm cursor-pointer">
                        Aberto a oportunidades (#OpenToWork)
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 🌐 CONEXÕES & REDE */}
              <div>
                <button
                  onClick={() => toggleSection('connections')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Conexões & Rede
                  </h3>
                  {expandedSections.connections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.connections && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs">Conexão de 1º grau com</Label>
                      <Input
                        placeholder="Ex: linkedin.com/in/joaosilva"
                        value={filters.connectionOf}
                        onChange={(e) => handleFilterChange('connectionOf', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-2 block">Grau de Conexão</Label>
                      <div className="space-y-2">
                        {['1º grau', '2º grau', '3º grau', '3º+ grau'].map((degree) => (
                          <div key={degree} className="flex items-center gap-2">
                            <Checkbox
                              id={`degree-${degree}`}
                              checked={filters.connectionDegree.includes(degree)}
                              onCheckedChange={() => toggleArrayFilter('connectionDegree', degree)}
                            />
                            <label htmlFor={`degree-${degree}`} className="text-sm cursor-pointer">
                              {degree}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Segue a Empresa</Label>
                      <Input
                        placeholder="Ex: Keller Williams"
                        value={filters.followsCompany}
                        onChange={(e) => handleFilterChange('followsCompany', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Membro do Grupo</Label>
                      <Input
                        placeholder="Ex: Real Estate Professionals"
                        value={filters.memberOfGroup}
                        onChange={(e) => handleFilterChange('memberOfGroup', e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 🔍 BUSCA AVANÇADA */}
              <div>
                <button
                  onClick={() => toggleSection('advanced')}
                  className="flex items-center justify-between w-full text-left mb-3 hover:text-blue-600 transition-colors"
                >
                  <h3 className="font-semibold flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Busca Avançada
                  </h3>
                  {expandedSections.advanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedSections.advanced && (
                  <div className="space-y-3 pl-6">
                    <div>
                      <Label className="text-xs">Palavras-chave (Geral)</Label>
                      <Textarea
                        placeholder="Ex: real estate, investment, sales"
                        value={filters.keywords}
                        onChange={(e) => handleFilterChange('keywords', e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-xs flex items-center gap-1">
                        Busca Booleana
                        <Info className="w-3 h-3 text-gray-400" />
                      </Label>
                      <Textarea
                        placeholder='Ex: (CEO OR Director) AND "real estate" NOT recruiter'
                        value={filters.booleanSearch}
                        onChange={(e) => handleFilterChange('booleanSearch', e.target.value)}
                        rows={3}
                        className="text-sm font-mono"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use AND, OR, NOT, parênteses e aspas
                      </p>
                    </div>

                    <div>
                      <Label className="text-xs">Palavras-chave no Título</Label>
                      <Input
                        placeholder="Ex: CEO, Director, VP"
                        value={filters.titleKeywords}
                        onChange={(e) => handleFilterChange('titleKeywords', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Palavras-chave na Empresa</Label>
                      <Input
                        placeholder="Ex: Real Estate, PropTech"
                        value={filters.companyKeywords}
                        onChange={(e) => handleFilterChange('companyKeywords', e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Idioma do Perfil</Label>
                      <Select
                        value={filters.profileLanguage}
                        onValueChange={(value) => handleFilterChange('profileLanguage', value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasEmail"
                          checked={filters.hasEmail}
                          onCheckedChange={(checked) => handleFilterChange('hasEmail', checked)}
                        />
                        <label htmlFor="hasEmail" className="text-sm cursor-pointer flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Apenas com email disponível
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="hasPhone"
                          checked={filters.hasPhone}
                          onCheckedChange={(checked) => handleFilterChange('hasPhone', checked)}
                        />
                        <label htmlFor="hasPhone" className="text-sm cursor-pointer flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Apenas com telefone disponível
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* BOTÕES DE AÇÃO */}
              <div className="space-y-2 pt-4 sticky bottom-0 bg-white pb-4">
                <Button
                  onClick={() => {
                    console.log('🔘 [DEBUG] Botão "Buscar Leads" foi clicado!');
                    console.log('🔘 [DEBUG] Estado searching:', searching);
                    console.log('🔘 [DEBUG] Filtros ativos:', activeFilterCount);
                    handleSearch();
                  }}
                  disabled={searching}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                >
                  {searching ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Buscando no LinkedIn...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Leads ({activeFilterCount} filtros)
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full h-9 text-xs">
                    <Save className="w-3 h-3 mr-1" />
                    Salvar Busca
                  </Button>
                  <Button variant="outline" className="w-full h-9 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      {/* ÁREA DE RESULTADOS */}
      <div className="flex-1 flex flex-col">
        {/* Header de Resultados */}
        <Card className="mb-4">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {results.length > 0 ? `${results.length} leads encontrados` : 'Configure os filtros e busque'}
                  </h2>
                  {selectedLeads.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedLeads.length} selecionados
                    </p>
                  )}
                </div>
                
                {/* Seletor de Resultados por Página */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="results-per-page" className="text-sm text-gray-600">
                    Resultados:
                  </Label>
                  <Select
                    value={resultsPerPage.toString()}
                    onValueChange={(value) => setResultsPerPage(Number(value))}
                  >
                    <SelectTrigger id="results-per-page" className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedLeads.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportSelected}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar ({selectedLeads.length})
                  </Button>
                  <Button onClick={addToPipeline}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar ao Pipeline
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ⚠️ AVISO DE DADOS DEMO / API INVÁLIDA */}
        {isDemoData && apiWarning && (
          <Alert className="mb-4 border-yellow-500 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="ml-2">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-yellow-800">⚠️ Dados DEMO</strong>
                  <p className="text-sm text-yellow-700 mt-1">{apiWarning}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={() => {
                    // Redireciona para Settings (página de configurações)
                    const settingsTab = document.querySelector('[data-tab="settings"]') as HTMLElement;
                    if (settingsTab) settingsTab.click();
                  }}
                >
                  Configurar API Keys
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Resultados */}
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {console.log('🎨 [RENDER] Renderizando resultados. Total:', results.length)}
            {console.log('🎨 [RENDER] Array results:', results)}
            {results.map((lead) => {
              console.log('🎨 [RENDER] Renderizando lead:', lead.name);
              return (
              <Card
                key={lead.id}
                className={`transition-all hover:shadow-lg border-2 ${
                  selectedLeads.includes(lead.id) ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200"
                      />
                    </div>

                    {/* Info Principal */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{lead.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                              {lead.matchScore}% match
                            </Badge>
                            {lead.openToWork && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Open to Work
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{lead.title}</p>
                          {lead.recentActivity && (
                            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {lead.recentActivity}
                            </p>
                          )}
                        </div>

                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => toggleLeadSelection(lead.id)}
                        />
                      </div>

                      {/* Detalhes em Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span>{lead.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{lead.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span>{lead.industry}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{lead.companySize} funcionários</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">{lead.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lead.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {lead.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{lead.skills.length - 5} mais
                          </Badge>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Ligar
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            Ver Perfil
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar ao Pipeline
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}

            {results.length === 0 && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="py-20 text-center">
                    <Sparkles className="w-20 h-20 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Busca Avançada LinkedIn Sales Navigator
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                      Configure os filtros na barra lateral para encontrar os leads perfeitos.
                      Temos {activeFilterCount} filtros ativos prontos para buscar!
                    </p>
                    <Button 
                      onClick={() => {
                        alert('🔥 BOTÃO FOI CLICADO! Se você vê este alerta, o botão FUNCIONA!');
                        console.log('🔘 [DEBUG] Botão "Iniciar Busca" foi clicado!');
                        console.log('🔘 [DEBUG] Estado searching:', searching);
                        handleSearch();
                      }} 
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={searching}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {searching ? 'Buscando...' : 'Iniciar Busca'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Aviso sobre API Keys */}
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="w-4 h-4 text-amber-600" />
                  <AlertDescription className="text-sm">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-amber-900 mb-2">
                          🔑 APIs Necessárias para Busca REAL de Leads
                        </p>
                        <p className="text-amber-800 text-xs mb-2">
                          O sistema integra com 9 APIs profissionais (Apollo.io, Hunter.io, PeopleDataLabs, etc).
                          Sem API keys configuradas, o sistema retorna apenas dados de demonstração.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded border border-amber-200">
                        <p className="font-semibold text-xs text-amber-900 mb-2">
                          ✅ INÍCIO RÁPIDO (GRÁTIS):
                        </p>
                        <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
                          <li><strong>Apollo.io</strong> - 50 créditos grátis/mês</li>
                          <li>Crie conta em: <a href="https://app.apollo.io/sign-up" target="_blank" className="underline">app.apollo.io/sign-up</a></li>
                          <li>Obtenha API key em: Settings → Integrations → API Keys</li>
                          <li>Configure no Supabase: Settings → Edge Functions → Secrets</li>
                          <li>Variável: <code className="bg-amber-100 px-1 rounded">APOLLO_API_KEY</code></li>
                        </ol>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-amber-700">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>
                          Veja o arquivo <code className="bg-amber-100 px-1 rounded">/API_SETUP_GUIDE.md</code> para instruções completas de todas as APIs disponíveis.
                        </span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
    </>
  );
}
