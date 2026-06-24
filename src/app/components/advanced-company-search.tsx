import React, { useState, useEffect } from 'react';
import { Separator } from './ui/separator';
import { realSearchService, CompanyResult } from '../lib/real-search-service';
import { toast } from 'sonner@2.0.3';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge-export';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import {
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Search,
  Globe,
  DollarSign,
  BarChart3,
  ExternalLink,
  Plus,
  Star,
  Target,
  Briefcase,
  Calendar,
  Cpu,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Sparkles,
  Rocket,
  Award,
  Building,
  Zap,
  TrendingDown,
  Activity,
  Phone,
  Mail,
  Linkedin,
  Download,
  Save
} from 'lucide-react';

interface CompanySearchFilters {
  // 🏢 IDENTIFICAÇÃO
  name: string;
  keywords: string;
  domain: string;
  
  // 🌍 GEOGRAFIA
  country: string[];
  state: string;
  city: string;
  region: string;
  
  // 🏭 INDÚSTRIA & TIPO
  industry: string[];
  subIndustry: string[];
  companyType: string[]; // Public, Private, Non-profit, etc
  
  // 👥 TAMANHO & CRESCIMENTO
  companySize: string[];
  employeeCount: string;
  headcountGrowth: string[];
  hiringStatus: string[];
  
  // 💰 FINANCEIRO
  revenue: string[];
  revenueGrowth: string[];
  funding: string[];
  fundingRound: string[];
  
  // 📅 TEMPORAL
  foundedYear: string;
  foundedYearMin: number;
  foundedYearMax: number;
  
  // 💻 TECNOLOGIA
  technologies: string[];
  techStack: string;
  
  // 🎯 SPOTLIGHT
  recentFunding: boolean;
  recentNews: boolean;
  hiring: boolean;
  fastGrowing: boolean;
  publiclyTraded: boolean;
  
  // 🔗 RELACIONAMENTO
  competitorsOf: string;
  similarTo: string;
  partnersOf: string;
  
  // 📊 ENGAGEMENT
  linkedinFollowers: string;
  websiteTraffic: string;
  
  // Limite
  limit: number;
}

export function AdvancedCompanySearch() {
  const [filters, setFilters] = useState<CompanySearchFilters>({
    name: '',
    keywords: '',
    domain: '',
    country: ['Portugal'],
    state: '',
    city: '',
    region: '',
    industry: [],
    subIndustry: [],
    companyType: [],
    companySize: [],
    employeeCount: '',
    headcountGrowth: [],
    hiringStatus: [],
    revenue: [],
    revenueGrowth: [],
    funding: [],
    fundingRound: [],
    foundedYear: '',
    foundedYearMin: 1900,
    foundedYearMax: new Date().getFullYear(),
    technologies: [],
    techStack: '',
    recentFunding: false,
    recentNews: false,
    hiring: false,
    fastGrowing: false,
    publiclyTraded: false,
    competitorsOf: '',
    similarTo: '',
    partnersOf: '',
    linkedinFollowers: '',
    websiteTraffic: '',
    limit: 25,
  });

  const [results, setResults] = useState<CompanyResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    identification: true,
    geography: true,
    industry: false,
    size: false,
    financial: false,
    technology: false,
    spotlight: false,
    relationship: false,
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // 🏭 DADOS REAIS DE INDÚSTRIAS (LinkedIn)
  const industries = [
    'Real Estate',
    'PropTech',
    'Construction',
    'Architecture & Planning',
    'Investment Management',
    'Commercial Real Estate',
    'Property Management',
    'Real Estate Development',
    'Facilities Services',
    'Building Materials',
    'Interior Design',
    'Urban Planning',
    'Financial Services',
    'Technology',
    'Software',
    'Hospitality',
  ];

  const companyTypes = [
    'Public Company',
    'Private Company',
    'Partnership',
    'Sole Proprietorship',
    'Non-profit',
    'Government Agency',
    'Self-Employed',
    'Educational Institution',
  ];

  const companySizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1001-5000',
    '5001-10000',
    '10000+',
  ];

  const revenueRanges = [
    '< €1M',
    '€1M - €5M',
    '€5M - €10M',
    '€10M - €50M',
    '€50M - €100M',
    '€100M - €500M',
    '€500M - €1B',
    '€1B+',
  ];

  const growthRates = [
    'Negative Growth',
    '0-10%',
    '10-25%',
    '25-50%',
    '50-100%',
    '100%+',
  ];

  const fundingStages = [
    'Bootstrapped',
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C+',
    'IPO',
    'Acquired',
  ];

  const technologies = [
    'CRM',
    'Salesforce',
    'HubSpot',
    'WordPress',
    'React',
    'Angular',
    'Vue.js',
    'Node.js',
    'Python',
    'AWS',
    'Azure',
    'Google Cloud',
    'Docker',
    'Kubernetes',
    'Analytics',
    'Marketing Automation',
  ];

  const countries = [
    'Portugal',
    'Spain',
    'United States',
    'United Kingdom',
    'Germany',
    'France',
    'Brazil',
    'Netherlands',
    'Belgium',
    'Switzerland',
  ];

  const updateFilterCount = (newFilters: CompanySearchFilters) => {
    let count = 0;
    if (newFilters.name) count++;
    if (newFilters.keywords) count++;
    if (newFilters.domain) count++;
    if (newFilters.industry.length > 0) count++;
    if (newFilters.companySize.length > 0) count++;
    if (newFilters.country.length > 0) count++;
    if (newFilters.city) count++;
    if (newFilters.revenue.length > 0) count++;
    if (newFilters.technologies.length > 0) count++;
    if (newFilters.companyType.length > 0) count++;
    if (newFilters.hiring) count++;
    if (newFilters.recentFunding) count++;
    setActiveFilterCount(count);
  };

  const handleFilterChange = (key: keyof CompanySearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateFilterCount(newFilters);
  };

  const toggleArrayFilter = (key: keyof CompanySearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const handleSearch = async () => {
    setSearching(true);

    try {
      console.log('🔍 Buscando empresas com filtros:', filters);

      // Busca REAL usando Apollo.io, Clearbit, PDL
      const realResults = await realSearchService.searchCompanies({
        name: filters.name,
        industry: filters.industry,
        location: filters.city,
        country: filters.country,
        companySize: filters.companySize,
        revenue: filters.revenue,
        keywords: filters.keywords,
        technology: filters.technologies,
        founded: filters.foundedYear,
        limit: filters.limit,
      });

      if (realResults && realResults.length > 0) {
        setResults(realResults);
      } else {
        // Fallback para dados mockados
        toast.info('Nenhum resultado encontrado', {
          description: 'Tente ajustar os filtros',
        });
        setResults([]);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar empresas');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      keywords: '',
      domain: '',
      country: ['Portugal'],
      state: '',
      city: '',
      region: '',
      industry: [],
      subIndustry: [],
      companyType: [],
      companySize: [],
      employeeCount: '',
      headcountGrowth: [],
      hiringStatus: [],
      revenue: [],
      revenueGrowth: [],
      funding: [],
      fundingRound: [],
      foundedYear: '',
      foundedYearMin: 1900,
      foundedYearMax: new Date().getFullYear(),
      technologies: [],
      techStack: '',
      recentFunding: false,
      recentNews: false,
      hiring: false,
      fastGrowing: false,
      publiclyTraded: false,
      competitorsOf: '',
      similarTo: '',
      partnersOf: '',
      linkedinFollowers: '',
      websiteTraffic: '',
      limit: 25,
    });
    setResults([]);
    setActiveFilterCount(0);
  };

  const toggleCompanySelection = (companyId: string) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId) ? prev.filter(id => id !== companyId) : [...prev, companyId]
    );
  };

  const SectionHeader = ({ icon: Icon, title, section, color }: any) => (
    <button
      onClick={() => toggleSection(section)}
      className={`flex items-center justify-between w-full text-left mb-3 p-3 rounded-lg hover:bg-gradient-to-r transition-all group ${color}`}
    >
      <h3 className="font-semibold flex items-center gap-2">
        <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>
        {title}
      </h3>
      {expandedSections[section] ? 
        <ChevronUp className="w-5 h-5 opacity-70" /> : 
        <ChevronDown className="w-5 h-5 opacity-70" />
      }
    </button>
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* SIDEBAR AVANÇADA */}
      <div className="w-96 flex-shrink-0">
        <ScrollArea className="h-full">
          <Card className="border-2 border-blue-200 shadow-xl">
            <CardHeader className="pb-4 sticky top-0 bg-gradient-to-r from-blue-50 to-cyan-50 z-10 border-b-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Company Navigator
                    </span>
                  </CardTitle>
                  {activeFilterCount > 0 && (
                    <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-600">
                      ✨ {activeFilterCount} filtros ativos
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6 bg-gradient-to-b from-white via-blue-50/30 to-cyan-50/30">
              {/* 🏢 IDENTIFICAÇÃO */}
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-100">
                <SectionHeader 
                  icon={Building2} 
                  title="Identificação" 
                  section="identification"
                  color="from-blue-100/50 to-cyan-100/50"
                />
                {expandedSections.identification && (
                  <div className="space-y-3 pl-2">
                    <div>
                      <Label className="text-xs text-blue-700">Nome da Empresa</Label>
                      <Input
                        placeholder="Ex: Keller Williams"
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        className="h-9 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-blue-700">Palavras-chave</Label>
                      <Textarea
                        placeholder="imobiliário, real estate, mediação..."
                        value={filters.keywords}
                        onChange={(e) => handleFilterChange('keywords', e.target.value)}
                        rows={2}
                        className="text-sm border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-blue-700">Website/Domínio</Label>
                      <Input
                        placeholder="example.com"
                        value={filters.domain}
                        onChange={(e) => handleFilterChange('domain', e.target.value)}
                        className="h-9 border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 🌍 GEOGRAFIA */}
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-green-100">
                <SectionHeader 
                  icon={MapPin} 
                  title="Geografia" 
                  section="geography"
                  color="from-green-100/50 to-emerald-100/50"
                />
                {expandedSections.geography && (
                  <div className="space-y-3 pl-2">
                    <div>
                      <Label className="text-xs text-green-700 mb-2 block">País</Label>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {countries.map((country) => (
                            <div key={country} className="flex items-center gap-2 p-2 rounded hover:bg-green-50">
                              <Checkbox
                                id={`country-${country}`}
                                checked={filters.country.includes(country)}
                                onCheckedChange={() => toggleArrayFilter('country', country)}
                                className="border-green-300"
                              />
                              <label htmlFor={`country-${country}`} className="text-sm cursor-pointer flex-1">
                                {country}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div>
                      <Label className="text-xs text-green-700">Cidade</Label>
                      <Input
                        placeholder="Lisboa, Porto, etc"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="h-9 border-green-200 focus:border-green-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 🏭 INDÚSTRIA */}
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-100">
                <SectionHeader 
                  icon={Briefcase} 
                  title="Indústria & Tipo" 
                  section="industry"
                  color="from-purple-100/50 to-pink-100/50"
                />
                {expandedSections.industry && (
                  <div className="space-y-3 pl-2">
                    <div>
                      <Label className="text-xs text-purple-700 mb-2 block">Setor</Label>
                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {industries.map((industry) => (
                            <div key={industry} className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">
                              <Checkbox
                                id={`industry-${industry}`}
                                checked={filters.industry.includes(industry)}
                                onCheckedChange={() => toggleArrayFilter('industry', industry)}
                                className="border-purple-300"
                              />
                              <label htmlFor={`industry-${industry}`} className="text-sm cursor-pointer flex-1">
                                {industry}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div>
                      <Label className="text-xs text-purple-700 mb-2 block">Tipo de Empresa</Label>
                      <ScrollArea className="h-32">
                        <div className="space-y-2">
                          {companyTypes.map((type) => (
                            <div key={type} className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">
                              <Checkbox
                                id={`type-${type}`}
                                checked={filters.companyType.includes(type)}
                                onCheckedChange={() => toggleArrayFilter('companyType', type)}
                                className="border-purple-300"
                              />
                              <label htmlFor={`type-${type}`} className="text-sm cursor-pointer flex-1">
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </div>

              {/* 👥 TAMANHO */}
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-100">
                <SectionHeader 
                  icon={Users} 
                  title="Tamanho & Crescimento" 
                  section="size"
                  color="from-orange-100/50 to-amber-100/50"
                />
                {expandedSections.size && (
                  <div className="space-y-3 pl-2">
                    <div>
                      <Label className="text-xs text-orange-700 mb-2 block">Número de Funcionários</Label>
                      <div className="space-y-2">
                        {companySizes.map((size) => (
                          <div key={size} className="flex items-center gap-2 p-2 rounded hover:bg-orange-50">
                            <Checkbox
                              id={`size-${size}`}
                              checked={filters.companySize.includes(size)}
                              onCheckedChange={() => toggleArrayFilter('companySize', size)}
                              className="border-orange-300"
                            />
                            <label htmlFor={`size-${size}`} className="text-sm cursor-pointer flex-1">
                              {size} funcionários
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-orange-700 mb-2 block">Taxa de Crescimento</Label>
                      <div className="space-y-2">
                        {growthRates.map((rate) => (
                          <div key={rate} className="flex items-center gap-2 p-2 rounded hover:bg-orange-50">
                            <Checkbox
                              id={`growth-${rate}`}
                              checked={filters.headcountGrowth.includes(rate)}
                              onCheckedChange={() => toggleArrayFilter('headcountGrowth', rate)}
                              className="border-orange-300"
                            />
                            <label htmlFor={`growth-${rate}`} className="text-sm cursor-pointer flex-1">
                              {rate}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 💰 FINANCEIRO */}
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-emerald-100">
                <SectionHeader 
                  icon={DollarSign} 
                  title="Financeiro" 
                  section="financial"
                  color="from-emerald-100/50 to-green-100/50"
                />
                {expandedSections.financial && (
                  <div className="space-y-3 pl-2">
                    <div>
                      <Label className="text-xs text-emerald-700 mb-2 block">Faturamento Anual</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {revenueRanges.map((revenue) => (
                          <div key={revenue} className="flex items-center gap-2 p-2 rounded hover:bg-emerald-50">
                            <Checkbox
                              id={`revenue-${revenue}`}
                              checked={filters.revenue.includes(revenue)}
                              onCheckedChange={() => toggleArrayFilter('revenue', revenue)}
                              className="border-emerald-300"
                            />
                            <label htmlFor={`revenue-${revenue}`} className="text-sm cursor-pointer flex-1">
                              {revenue}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-emerald-700 mb-2 block">Estágio de Funding</Label>
                      <div className="space-y-2">
                        {fundingStages.map((stage) => (
                          <div key={stage} className="flex items-center gap-2 p-2 rounded hover:bg-emerald-50">
                            <Checkbox
                              id={`funding-${stage}`}
                              checked={filters.funding.includes(stage)}
                              onCheckedChange={() => toggleArrayFilter('funding', stage)}
                              className="border-emerald-300"
                            />
                            <label htmlFor={`funding-${stage}`} className="text-sm cursor-pointer flex-1">
                              {stage}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-emerald-700">Ano de Fundação</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.foundedYearMin}
                          onChange={(e) => handleFilterChange('foundedYearMin', parseInt(e.target.value))}
                          className="h-9 border-emerald-200"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.foundedYearMax}
                          onChange={(e) => handleFilterChange('foundedYearMax', parseInt(e.target.value))}
                          className="h-9 border-emerald-200"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 💻 TECNOLOGIA */}
              <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-indigo-100">
                <SectionHeader 
                  icon={Cpu} 
                  title="Tecnologia" 
                  section="technology"
                  color="from-indigo-100/50 to-purple-100/50"
                />
                {expandedSections.technology && (
                  <div className="space-y-3 pl-2">
                    <div>
                      <Label className="text-xs text-indigo-700 mb-2 block">Tecnologias Usadas</Label>
                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {technologies.map((tech) => (
                            <div key={tech} className="flex items-center gap-2 p-2 rounded hover:bg-indigo-50">
                              <Checkbox
                                id={`tech-${tech}`}
                                checked={filters.technologies.includes(tech)}
                                onCheckedChange={() => toggleArrayFilter('technologies', tech)}
                                className="border-indigo-300"
                              />
                              <label htmlFor={`tech-${tech}`} className="text-sm cursor-pointer flex-1">
                                {tech}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}
              </div>

              {/* 🎯 SPOTLIGHT */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 shadow-sm border-2 border-yellow-200">
                <SectionHeader 
                  icon={Sparkles} 
                  title="Spotlight (Notícias Recentes)" 
                  section="spotlight"
                  color="from-yellow-100/50 to-orange-100/50"
                />
                {expandedSections.spotlight && (
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-2 p-2 rounded bg-white hover:bg-yellow-50">
                      <Checkbox
                        id="hiring"
                        checked={filters.hiring}
                        onCheckedChange={(checked) => handleFilterChange('hiring', checked)}
                        className="border-yellow-400"
                      />
                      <label htmlFor="hiring" className="text-sm cursor-pointer flex items-center gap-2">
                        <Users className="w-4 h-4 text-yellow-600" />
                        Contratando ativamente
                      </label>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-white hover:bg-yellow-50">
                      <Checkbox
                        id="recentFunding"
                        checked={filters.recentFunding}
                        onCheckedChange={(checked) => handleFilterChange('recentFunding', checked)}
                        className="border-yellow-400"
                      />
                      <label htmlFor="recentFunding" className="text-sm cursor-pointer flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-yellow-600" />
                        Recebeu funding recentemente
                      </label>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-white hover:bg-yellow-50">
                      <Checkbox
                        id="recentNews"
                        checked={filters.recentNews}
                        onCheckedChange={(checked) => handleFilterChange('recentNews', checked)}
                        className="border-yellow-400"
                      />
                      <label htmlFor="recentNews" className="text-sm cursor-pointer flex items-center gap-2">
                        <Activity className="w-4 h-4 text-yellow-600" />
                        Mencionada nas notícias
                      </label>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-white hover:bg-yellow-50">
                      <Checkbox
                        id="fastGrowing"
                        checked={filters.fastGrowing}
                        onCheckedChange={(checked) => handleFilterChange('fastGrowing', checked)}
                        className="border-yellow-400"
                      />
                      <label htmlFor="fastGrowing" className="text-sm cursor-pointer flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        Crescimento rápido (+50%)
                      </label>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-white hover:bg-yellow-50">
                      <Checkbox
                        id="publiclyTraded"
                        checked={filters.publiclyTraded}
                        onCheckedChange={(checked) => handleFilterChange('publiclyTraded', checked)}
                        className="border-yellow-400"
                      />
                      <label htmlFor="publiclyTraded" className="text-sm cursor-pointer flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-yellow-600" />
                        Negociada publicamente
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTÕES */}
              <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 space-y-3">
                <Button
                  onClick={handleSearch}
                  disabled={searching}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all text-base"
                >
                  {searching ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Buscar Empresas {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </>
                  )}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-9 text-xs border-2">
                    <Save className="w-3 h-3 mr-1" />
                    Salvar Busca
                  </Button>
                  <Button variant="outline" className="h-9 text-xs border-2">
                    <Download className="w-3 h-3 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      {/* RESULTADOS */}
      <div className="flex-1 flex flex-col">
        <Card className="mb-4 border-2 border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  {results.length > 0 ? `${results.length} empresas encontradas` : 'Company Navigator'}
                </h2>
                {selectedCompanies.length > 0 && (
                  <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-600">
                    ✨ {selectedCompanies.length} selecionadas
                  </Badge>
                )}
              </div>
              {selectedCompanies.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" className="border-2">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {results.map((company) => (
              <Card
                key={company.id}
                className={`transition-all hover:shadow-2xl border-2 ${
                  selectedCompanies.includes(company.id)
                    ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-xl'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-200 shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                            <Badge className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0">
                              {company.matchScore}% match
                            </Badge>
                            <Badge variant="outline" className="border-blue-300">
                              {company.source}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{company.description}</p>
                        </div>
                        <Checkbox
                          checked={selectedCompanies.includes(company.id)}
                          onCheckedChange={() => toggleCompanySelection(company.id)}
                          className="w-5 h-5"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-lg">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{company.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-purple-50 p-2 rounded-lg">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>{company.employeeCount || company.size} funcionários</span>
                        </div>
                        {company.revenue && (
                          <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span>{company.revenue}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="border-2 border-blue-200 bg-blue-50">
                          {company.industry}
                        </Badge>
                        {company.founded && (
                          <Badge variant="outline" className="border-2 border-purple-200 bg-purple-50">
                            <Calendar className="w-3 h-3 mr-1" />
                            Fundada em {company.founded}
                          </Badge>
                        )}
                        {company.technologies?.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="border-2 border-indigo-200 bg-indigo-50">
                            <Cpu className="w-3 h-3 mr-1" />
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" className="border-2" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="border-2" asChild>
                          <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                        {company.phone && (
                          <Button size="sm" variant="outline" className="border-2">
                            <Phone className="w-4 h-4 mr-2" />
                            Contato
                          </Button>
                        )}
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {results.length === 0 && (
              <Card className="border-2 border-dashed border-blue-200">
                <CardContent className="py-24 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Company Navigator Avançado
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Use os filtros avançados para encontrar as empresas ideais para o seu negócio
                  </p>
                  <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
                    <Rocket className="w-4 h-4 mr-2" />
                    Começar Busca
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}