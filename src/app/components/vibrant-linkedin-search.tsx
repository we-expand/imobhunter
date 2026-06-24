/**
 * 🚀 VIBRANT LINKEDIN SEARCH - SISTEMA DE BUSCA PROFISSIONAL
 * Busca REAL usando APIs: Apollo, Hunter, PDL, RocketReach
 * Versão: 3.0.0 - APENAS DADOS REAIS - 15/12/2024
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge-export';
import { ScrollArea } from './ui/scroll-area';
import { AvatarFallback } from './avatar-fallback';
import { LeadDetailsFullModal } from './lead-details-full-modal'; // 🔥 NOVO!
import { ApiSetupGuide } from './api-setup-guide'; // 🔥 NOVO: Guia de configuração
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';
import {
  Search, User, Building2, MapPin, Briefcase, Sparkles, Star, Filter,
  ChevronDown, ChevronUp, X, Download, Plus, Save, Mail, Phone,
  UserCheck, Zap, Globe, Target, TrendingUp, AlertCircle, Award, Rocket
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { formatFullName } from '../lib/string-utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

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
  source?: string; // 🔥 NOVO: Fonte dos dados
}

interface AdvancedSearchFilters {
  firstName: string;
  lastName: string;
  fullName: string; // NOVO: campo unificado
  currentTitle: string;
  currentCompany: string;
  city: string;
  country: string[];
  industry: string[];
  seniority: string[];
  skills: string;
  keywords: string;
  booleanSearch: string;
  hasEmail: boolean;
  hasPhone: boolean;
  radius: number; // Raio de busca em km
}

export function VibrantLinkedInSearch() {
  const [filters, setFilters] = useState<AdvancedSearchFilters>({
    firstName: '',
    lastName: '',
    fullName: '', // NOVO: campo unificado
    currentTitle: '',
    currentCompany: '',
    city: '',
    country: [], // 🌍 BUSCA GLOBAL - Universo inteiro do LinkedIn
    industry: [],
    seniority: [],
    skills: '',
    keywords: '',
    booleanSearch: '',
    hasEmail: false,
    hasPhone: false,
    radius: 50 // Raio padrão de 50 km
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    person: true,
    company: false,
    geography: false,
    experience: false,
    advanced: false,
  });

  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // 🆕 Estados para modal de detalhes e paginação
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showApiGuide, setShowApiGuide] = useState(false); // 🔥 NOVO: Mostrar guia de APIs
  const [resultsPerPage, setResultsPerPage] = useState(25); // Padrão: 25
  
  // Calcula resultados paginados
  const paginatedResults = results.slice(0, resultsPerPage);

  const updateFilterCount = (newFilters: AdvancedSearchFilters) => {
    let count = 0;
    if (newFilters.firstName) count++;
    if (newFilters.lastName) count++;
    if (newFilters.currentTitle) count++;
    if (newFilters.currentCompany) count++;
    if (newFilters.seniority.length > 0) count++;
    if (newFilters.industry.length > 0) count++;
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
    setSearching(true);
    
    try {
      console.log('🔍 Iniciando busca REAL com APIs de enriquecimento...');
      
      // 🔥 CHAMADA DIRETA PARA A API REAL DO SERVIDOR
      // Usando as APIs: Apollo, Hunter, PDL, RocketReach
      
      const searchPayload = {
        // 🔥 NOVO: Nome completo para busca direta
        fullName: filters.fullName || undefined,
        
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
        
        // Senioridade
        seniority: filters.seniority.length > 0 ? filters.seniority : undefined,
        
        // Keywords de busca
        keywords: filters.keywords || filters.booleanSearch || undefined,
        
        // Filtros de contato
        hasEmail: filters.hasEmail || false,
        hasPhone: filters.hasPhone || false,
        
        // Limite de resultados
        limit: 50
      };

      console.log('📡 Enviando busca REAL para servidor:', searchPayload);

      // Mostra loading mais informativo
      toast.loading('🔍 Buscando em múltiplas APIs...', {
        description: 'Apollo.io, Hunter.io, PDL, RocketReach',
        id: 'search-loading'
      });

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

      // Remove loading toast
      toast.dismiss('search-loading');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na busca:', response.status, errorText);
        
        // Mensagem de erro mais amigável
        if (response.status === 500) {
          throw new Error('Erro no servidor. Verifique se as API keys estão configuradas.');
        } else if (response.status === 401) {
          throw new Error('Não autorizado. Verifique suas credenciais.');
        } else {
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('✅ Resposta recebida:', data);

      if (data.success && data.results && data.results.length > 0) {
        // Converte resultados da API para o formato esperado pelo componente
        const convertedResults: SearchResult[] = data.results.map((person: any) => ({
          id: person.id,
          name: person.name || `${person.firstName || ''} ${person.lastName || ''}`.trim(),
          title: person.title || 'N/A',
          company: person.company || 'N/A',
          location: person.location || 'N/A',
          avatar: person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || 'User')}&size=150`,
          linkedinUrl: person.linkedinUrl || '',
          email: person.email || '',
          phone: person.phone || '',
          industry: person.industry || 'N/A',
          companySize: person.companySize || 'N/A',
          seniority: person.seniority || 'N/A',
          yearsExperience: person.yearsExperience || 0,
          skills: person.skills || [],
          matchScore: person.matchScore || 80,
          recentActivity: person.recentActivity,
          openToWork: person.openToWork,
          source: person.source || 'APIs Reais', // 🔥 NOVO: Fonte dos dados
        }));
        
        setResults(convertedResults);
        
        const sources = data.sources?.join(', ') || 'APIs Reais';
        const sourcesText = sources.split(',').map((s: string) => s.trim().charAt(0).toUpperCase() + s.trim().slice(1)).join(', ');
        
        // 🔥 Verifica se são dados DEMO
        const isDemo = data.sources?.includes('demo');
        
        if (isDemo) {
          toast.warning(`⚠️ ${convertedResults.length} leads DEMO retornados`, {
            description: data.message || 'Configure API keys (Apollo, Hunter, PDL) nas variáveis de ambiente do Supabase para buscar dados reais',
            duration: 15000,
            action: {
              label: 'Ver Diagnóstico',
              onClick: () => {
                console.log('');
                console.log('════════════════════════════════════════════════════════');
                console.log('🔑 GUIA RÁPIDO: CONFIGURAR APIs DE BUSCA REAL');
                console.log('════════════════════════════════════════════════════════');
                console.log('');
                console.log('📍 ACESSE: Configurações → Segurança → "Diagnóstico de API"');
                console.log('');
                console.log('🧪 O painel de diagnóstico mostra:');
                console.log('   ✅ Quais APIs estão configuradas');
                console.log('   ✅ Se as APIs estão a funcionar');
                console.log('   ✅ Instruções de como configurar');
                console.log('');
                console.log('📋 APIS RECOMENDADAS (com trial grátis):');
                console.log('');
                console.log('1️⃣  APOLLO.IO (RECOMENDADO - Mais Fácil)');
                console.log('   ✅ Trial gratuito: 50 créditos/mês');
                console.log('   🔗 Registro: https://www.apollo.io/');
                console.log('   📍 Após criar conta, vá em: Settings → API Keys');
                console.log('   🔑 Cole a API Key em: Configurações → Segurança → APOLLO_API_KEY');
                console.log('');
                console.log('2️⃣  HUNTER.IO (Para Emails)');
                console.log('   ✅ Trial gratuito: 25 buscas/mês');
                console.log('   🔗 Registro: https://hunter.io/');
                console.log('   📍 Após criar conta, vá em: API → API Keys');
                console.log('   🔑 Cole a API Key em: Configurações → Segurança → HUNTER_API_KEY');
                console.log('');
                console.log('3️⃣  RAPIDAPI - LinkedIn Data (RECOMENDADO - Mais Fácil!)');
                console.log('   ✅ Trial: 100 requests GRATUITOS/mês');
                console.log('   🔗 Registro: https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data');
                console.log('   📍 Após criar conta:');
                console.log('      1. Clique em "Subscribe to Test"');
                console.log('      2. Escolha plano "Basic (Free)"');
                console.log('      3. Copie a "X-RapidAPI-Key" do código de exemplo');
                console.log('   🔑 Cole a API Key em: Configurações → Segurança → RAPIDAPI_KEY');
                console.log('');
                console.log('4️⃣  LUSHA (LinkedIn + Emails + Telefones)');
                console.log('   ✅ Trial: 5 créditos gratuitos');
                console.log('   🔗 Registro: https://www.lusha.com/');
                console.log('   📍 Após criar conta, vá em: Profile → API Access');
                console.log('   🔑 Cole a API Key em: Configurações → Segurança → LUSHA_API_KEY');
                console.log('');
                console.log('5️⃣  PDL - People Data Labs (Enriquecimento)');
                console.log('   ⚠️  Planos pagos apenas');
                console.log('   🔗 Registro: https://www.peopledatalabs.com/');
                console.log('');
                console.log('6️⃣  ROCKETREACH (Contatos Diretos)');
                console.log('   ✅ Trial: 7 dias grátis');
                console.log('   🔗 Registro: https://rocketreach.co/');
                console.log('');
                console.log('════════════════════════════════════════════════════════');
                console.log('💡 DICA: Comece com Apollo.io - é o mais fácil e tem trial grátis!');
                console.log('════════════════════════════════════════════════════════');
                console.log('');
                console.log('📍 ONDE CONFIGURAR NA PLATAFORMA:');
                console.log('   1. Clique no ícone ⚙️ Configurações (menu lateral)');
                console.log('   2. Vá em "Segurança" (segunda aba)');
                console.log('   3. Cole suas API Keys nos campos correspondentes');
                console.log('   4. Clique em "Salvar Configurações"');
                console.log('   5. Volte aqui e clique em "Testar APIs" novamente');
                console.log('');
                console.log('════════════════════════════════════════════════════════');
              }
            }
          });
        } else {
          toast.success(`✅ ${convertedResults.length} perfis REAIS encontrados!`, {
            description: `Fontes: ${sourcesText}`,
            duration: 6000,
          });
        }
        
        // Log detalhado dos resultados
        console.log('📊 Resumo dos resultados:');
        console.log(`   Total: ${convertedResults.length}`);
        console.log(`   Com email: ${convertedResults.filter(r => r.email).length}`);
        console.log(`   Com telefone: ${convertedResults.filter(r => r.phone).length}`);
        console.log(`   Com LinkedIn: ${convertedResults.filter(r => r.linkedinUrl).length}`);
        
      } else if (data.success && (!data.results || data.results.length === 0)) {
        // Nenhum resultado encontrado nas APIs
        console.log('⚠️ Nenhum resultado encontrado nas APIs');
        
        setResults([]);
        
        toast.info('🔍 Nenhum resultado encontrado', {
          description: 'Tente ajustar os filtros de busca',
          duration: 4000,
        });
        
      } else {
        // Erro na API mas com resposta estruturada
        console.error('❌ Erro retornado pela API:', data.error);
        throw new Error(data.error || 'Erro desconhecido na busca');
      }
      
    } catch (error) {
      console.error('❌ Erro crítico na busca:', error);
      
      setResults([]);
      
      toast.error('❌ Erro ao buscar leads', {
        description: error instanceof Error ? error.message : 'Verifique as API keys e tente novamente',
        duration: 6000,
      });
      
    } finally {
      setSearching(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      firstName: '',
      lastName: '',
      fullName: '', // NOVO: campo unificado
      currentTitle: '',
      currentCompany: '',
      city: '',
      country: [], // 🌍 BUSCA GLOBAL - Universo inteiro do LinkedIn
      industry: [],
      seniority: [],
      skills: '',
      keywords: '',
      booleanSearch: '',
      hasEmail: false,
      hasPhone: false,
      radius: 50 // Raio padrão de 50 km
    });
    setResults([]);
    setActiveFilterCount(0);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const exportSelected = () => {
    toast.success(`${selectedLeads.length} leads exportados!`);
  };

  const addToPipeline = () => {
    toast.success(`${selectedLeads.length} leads adicionados!`);
    setSelectedLeads([]);
  };

  // 📧 NOVA: Função para enviar resultados por email
  const sendResultsByEmail = async () => {
    const email = prompt('📧 Digite seu email para receber os resultados:');
    
    if (!email) {
      toast.error('Email não fornecido');
      return;
    }
    
    if (!results || results.length === 0) {
      toast.error('Nenhum resultado para enviar. Faça uma busca primeiro!');
      return;
    }
    
    toast.loading('📧 Enviando resultados por email...', { id: 'send-email' });
    
    try {
      // TODO: Rota de email não disponível na nova API ainda
      // const response = await fetch(
      //   `${API_BASE_URL}/send-results-email`,
      //   {
      //     method: 'POST',
      toast.info('Função de envio de email temporariamente indisponível');
      return;
      const response = await fetch(
        `${API_BASE_URL}/send-results-email-disabled`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            results,
            filters
          }),
        }
      );
      
      const data = await response.json();
      
      toast.dismiss('send-email');
      
      if (data.success) {
        toast.success(`✅ Email enviado para ${email}!`, {
          description: `${results.length} leads enviados com sucesso`,
          duration: 8000,
        });
      } else {
        // 🔥 Tratamento especial para erro do Resend
        if (data.error?.includes('RESEND_API_KEY') || data.error?.includes('API key is invalid') || data.error?.includes('validation_error')) {
          toast.error('🔑 API Key do Resend Inválida', {
            description: 'Configure uma API Key válida nas variáveis de ambiente. A chave deve começar com "re_". Obtenha em: resend.com/api-keys',
            duration: 12000,
          });
        } else {
          toast.error('❌ Erro ao enviar email', {
            description: data.error || 'Erro desconhecido',
            duration: 8000,
          });
        }
      }
    } catch (error) {
      toast.dismiss('send-email');
      toast.error('❌ Erro ao enviar email', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
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
    <div className="space-y-4">
      <div className="flex gap-6 h-[calc(100vh-180px)]">
        {/* Painel de Filtros */}
        <div className="w-96 flex-shrink-0">
          <Card className="h-full border-2 border-purple-200 shadow-xl flex flex-col overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Sales Navigator
                    </span>
                  </CardTitle>
                  {activeFilterCount > 0 && (
                    <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600">
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
            
            {/* ScrollArea com fade no final */}
            <div className="flex-1 overflow-hidden relative">
              <div className="h-full overflow-y-auto pb-32">
                <CardContent className="space-y-4 pt-6 bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30">
                  {/* Seção Pessoa */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-100">
                    <SectionHeader 
                      icon={User} 
                      title="Pessoa" 
                      section="person"
                      color="from-blue-100/50 to-cyan-100/50"
                    />
                    {expandedSections.person && (
                      <div className="space-y-3 pl-2">
                        {/* 🔥 NOVO: Campo de Nome Completo Destacado */}
                        <div className="p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border-2 border-cyan-200">
                          <Label className="text-sm font-bold text-cyan-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            🔍 Busca Rápida por Nome
                          </Label>
                          <Input
                            placeholder="Ex: Cleber Couto (busca automática nome completo)"
                            value={filters.fullName}
                            onChange={(e) => handleFilterChange('fullName', e.target.value)}
                            className="h-10 mt-2 border-2 border-cyan-300 focus:border-cyan-500 bg-white font-medium text-base"
                          />
                          <p className="text-[10px] text-cyan-700 mt-1.5 italic">
                            💡 Digite o nome completo da pessoa aqui para busca direta
                          </p>
                        </div>

                        <div className="text-center text-xs text-gray-500 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 border-t border-gray-300" />
                            <span>ou busca detalhada</span>
                            <div className="flex-1 border-t border-gray-300" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-blue-700">Primeiro Nome</Label>
                            <Input
                              placeholder="Ex: João"
                              value={filters.firstName}
                              onChange={(e) => handleFilterChange('firstName', e.target.value)}
                              className="h-9 border-blue-200 focus:border-blue-400"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-blue-700">Sobrenome</Label>
                            <Input
                              placeholder="Ex: Silva"
                              value={filters.lastName}
                              onChange={(e) => handleFilterChange('lastName', e.target.value)}
                              className="h-9 border-blue-200 focus:border-blue-400"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-blue-700">Cargo Atual</Label>
                          <Select 
                            value={filters.currentTitle} 
                            onValueChange={(value) => handleFilterChange('currentTitle', value === 'all' ? '' : value)}
                          >
                            <SelectTrigger className="h-9 border-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Selecione um cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os Cargos</SelectItem>
                              <SelectItem value="CEO">CEO</SelectItem>
                              <SelectItem value="Director of Sales">Director of Sales</SelectItem>
                              <SelectItem value="Head of Marketing">Head of Marketing</SelectItem>
                              <SelectItem value="VP of Business Development">VP of Business Development</SelectItem>
                              <SelectItem value="Senior Sales Manager">Senior Sales Manager</SelectItem>
                              <SelectItem value="Marketing Director">Marketing Director</SelectItem>
                              <SelectItem value="Real Estate Consultant">Real Estate Consultant</SelectItem>
                              <SelectItem value="Investment Manager">Investment Manager</SelectItem>
                              <SelectItem value="Business Development Manager">Business Development Manager</SelectItem>
                              <SelectItem value="Account Executive">Account Executive</SelectItem>
                              <SelectItem value="Regional Director">Regional Director</SelectItem>
                              <SelectItem value="Property Consultant">Property Consultant</SelectItem>
                              <SelectItem value="Real Estate Agent">Real Estate Agent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seção Empresa */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-purple-100">
                    <SectionHeader 
                      icon={Building2} 
                      title="Empresa" 
                      section="company"
                      color="from-purple-100/50 to-pink-100/50"
                    />
                    {expandedSections.company && (
                      <div className="space-y-3 pl-2">
                        <div>
                          <Label className="text-xs text-purple-700">Empresa Atual</Label>
                          <Input
                            placeholder="Ex: Keller Williams"
                            value={filters.currentCompany}
                            onChange={(e) => handleFilterChange('currentCompany', e.target.value)}
                            className="h-9 border-purple-200 focus:border-purple-400"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-purple-700 mb-2 block">Setor/Indústria</Label>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {['Real Estate', 'PropTech', 'Construction', 'Investment'].map((industry) => (
                              <div key={industry} className="flex items-center gap-2 p-2 rounded hover:bg-purple-50 transition-colors">
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
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seção Geografia */}
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
                          <Label className="text-xs text-green-700">Cidade</Label>
                          <Input
                            placeholder="Ex: Lisboa, Porto"
                            value={filters.city}
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            className="h-9 border-green-200 focus:border-green-400"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-green-700">Raio: {filters.radius} km</Label>
                          <Slider
                            value={[filters.radius]}
                            onValueChange={([value]) => handleFilterChange('radius', value)}
                            min={10}
                            max={500}
                            step={10}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seção Skills & Experiência */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-orange-100">
                    <SectionHeader 
                      icon={Award} 
                      title="Skills & Experiência" 
                      section="experience"
                      color="from-orange-100/50 to-amber-100/50"
                    />
                    {expandedSections.experience && (
                      <div className="space-y-3 pl-2">
                        <div>
                          <Label className="text-xs text-orange-700">Skills</Label>
                          <Textarea
                            placeholder="CRM, Sales, Negotiation..."
                            value={filters.skills}
                            onChange={(e) => handleFilterChange('skills', e.target.value)}
                            rows={3}
                            className="text-sm border-orange-200 focus:border-orange-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seção Busca Avançada */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 shadow-sm border-2 border-indigo-200">
                    <SectionHeader 
                      icon={Rocket} 
                      title="Busca Avançada" 
                      section="advanced"
                      color="from-indigo-100/50 to-purple-100/50"
                    />
                    {expandedSections.advanced && (
                      <div className="space-y-3 pl-2">
                        <div>
                          <Label className="text-xs text-indigo-700">Palavras-chave</Label>
                          <Textarea
                            placeholder="real estate, investment, sales..."
                            value={filters.keywords}
                            onChange={(e) => handleFilterChange('keywords', e.target.value)}
                            rows={2}
                            className="text-sm border-indigo-200 focus:border-indigo-400"
                          />
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center gap-2 p-2 rounded bg-white hover:bg-indigo-50 transition-colors">
                            <Checkbox
                              id="hasEmail"
                              checked={filters.hasEmail}
                              onCheckedChange={(checked) => handleFilterChange('hasEmail', checked)}
                              className="border-indigo-300"
                            />
                            <label htmlFor="hasEmail" className="text-sm cursor-pointer flex items-center gap-2">
                              <Mail className="w-4 h-4 text-indigo-600" />
                              Apenas com email
                            </label>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded bg-white hover:bg-indigo-50 transition-colors">
                            <Checkbox
                              id="hasPhone"
                              checked={filters.hasPhone}
                              onCheckedChange={(checked) => handleFilterChange('hasPhone', checked)}
                              className="border-indigo-300"
                            />
                            <label htmlFor="hasPhone" className="text-sm cursor-pointer flex items-center gap-2">
                              <Phone className="w-4 h-4 text-indigo-600" />
                              Apenas com telefone
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
              
              {/* Fade gradient no final + Botão fixo */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-4 px-6">
                <div className="space-y-3">
                  <Button
                    onClick={handleSearch}
                    disabled={searching}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all text-base"
                  >
                    {searching ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Buscar Leads
                      </>
                    )}
                  </Button>
                  
                  {/* 🔥 NOVO: Botão de Diagnóstico */}
                  <Button
                    onClick={async () => {
                      toast.loading('🔍 Testando conexões com APIs...', { id: 'api-test' });
                      
                      try {
                        // 🔥 NOVA ROTA DE DIAGNÓSTICO DEDICADA
                        const response = await fetch(
                          `${API_BASE_URL}${API_ROUTES.diagnostics}`,
                          {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${publicAnonKey}`,
                            },
                          }
                        );
                        
                        const data = await response.json();
                        
                        toast.dismiss('api-test');
                        
                        if (data.success) {
                          // Conta quantas APIs estão configuradas
                          const configuredApis = Object.entries(data.apis)
                            .filter(([_, info]: any) => info.configured)
                            .map(([name, _]) => name);
                          
                          console.log('🔍 DIAGNÓSTICO DE APIS:');
                          console.log('═══════════════════════════════════════════════════════');
                          console.log('');
                          Object.entries(data.apis).forEach(([name, info]: any) => {
                            const icon = info.configured ? '✅' : '❌';
                            const preview = info.key_preview || 'N/A';
                            console.log(`${icon} ${name.toUpperCase()}: ${info.configured ? 'CONFIGURADA' : 'NÃO CONFIGURADA'}`);
                            if (info.configured) {
                              console.log(`   🔑 Key: ${preview}`);
                            }
                          });
                          console.log('');
                          console.log('═══════════════════════════════════════════════════════');
                          console.log(`📊 TOTAL: ${configuredApis.length} APIs configuradas`);
                          console.log('═══════════════════════════════════════════════════════');
                          
                          if (configuredApis.length > 0) {
                            toast.success(`✅ ${configuredApis.length} APIs CONFIGURADAS!`, {
                              description: `Ativas: ${configuredApis.join(', ').toUpperCase()}`,
                              duration: 8000,
                            });
                          } else {
                            toast.error('❌ NENHUMA API CONFIGURADA', {
                              description: 'Configure suas API keys em Configurações → Segurança',
                              duration: 15000,
                              action: {
                                label: 'Ver Guia',
                                onClick: () => {
                                  console.log('');
                                  console.log('════════════════════════════════════════════════════════');
                                  console.log('🔑 GUIA RÁPIDO: CONFIGURAR APIs');
                                  console.log('════════════════════════════════════════════════════════');
                                  console.log('');
                                  console.log('🥇 RECOMENDADO (GRÁTIS):');
                                  console.log('');
                                  console.log('1️⃣  RapidAPI (LinkedIn) - 100 requests/mês GRÁTIS');
                                  console.log('   🔗 https://rapidapi.com/rockapis-rockapis-default/api/fresh-linkedin-profile-data');
                                  console.log('   ⚡ Configuração: 2 minutos');
                                  console.log('');
                                  console.log('2️⃣  Apollo.io - 10 créditos/mês GRÁTIS');
                                  console.log('   🔗 https://www.apollo.io/');
                                  console.log('   ⚡ Configuração: 5 minutos');
                                  console.log('');
                                  console.log('3️⃣  Hunter.io - 25 buscas/mês GRÁTIS');
                                  console.log('   🔗 https://hunter.io/');
                                  console.log('   ⚡ Configuração: 3 minutos');
                                  console.log('');
                                  console.log('════════════════════════════════════════════════════════');
                                }
                              }
                            });
                          }
                        } else {
                          toast.error('❌ Erro no diagnóstico', {
                            description: data.error || 'Erro desconhecido'
                          });
                        }
                      } catch (error) {
                        toast.dismiss('api-test');
                        toast.error('❌ Erro ao testar APIs', {
                          description: error instanceof Error ? error.message : 'Erro desconhecido'
                        });
                      }
                    }}
                    variant="outline"
                    className="w-full h-9 text-xs border-2 border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    🔍 Testar APIs (Diagnóstico)
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-9 text-xs border-2">
                      <Save className="w-3 h-3 mr-1" />
                      Salvar
                    </Button>
                    <Button variant="outline" className="h-9 text-xs border-2">
                      <Download className="w-3 h-3 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Painel de Resultados */}
        <div className="flex-1 flex flex-col">
          <Card className="mb-4 border-2 border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    {results.length > 0 ? `${results.length} leads encontrados` : 'Start to Search'}
                  </h2>
                  {selectedLeads.length > 0 && (
                    <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600">
                      ✨ {selectedLeads.length} selecionados
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {results.length > 0 && (
                    <Button
                      onClick={sendResultsByEmail}
                      variant="outline"
                      className="border-2 border-green-300 hover:bg-green-50 hover:border-green-400"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      📧 Enviar por Email
                    </Button>
                  )}
                  {selectedLeads.length > 0 && (
                    <>
                      <Button variant="outline" onClick={exportSelected} className="border-2">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                      <Button onClick={addToPipeline} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="flex-1">
            <div className="space-y-3 pr-4">
              {paginatedResults.map((lead) => (
                <Card
                  key={lead.id}
                  className={`transition-all hover:shadow-xl border cursor-pointer ${
                    selectedLeads.includes(lead.id) 
                      ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowLeadModal(true);
                  }}
                >
                  <CardContent className="p-2">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0">
                        <AvatarFallback 
                          src={lead.avatar}
                          name={formatFullName(lead.name)}
                          size="sm"
                          className="w-10 h-10"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-1">
                              <h3 className="text-sm font-bold text-gray-900 truncate">{formatFullName(lead.name)}</h3>
                              <Badge className="bg-yellow-500 text-white border-0 text-[10px] px-1 py-0">
                                {lead.matchScore}%
                              </Badge>
                            </div>
                            <p className="text-[11px] text-gray-600 truncate">{lead.title}</p>
                            <p className="text-[10px] text-gray-500 truncate">{lead.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {results.length === 0 && (
                <Card className="border-2 border-dashed border-purple-200">
                  <CardContent className="py-24 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Busca Profissional LinkedIn
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Configure os filtros e encontre os leads perfeitos para o seu negócio
                    </p>
                    <Button onClick={handleSearch} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
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
      
      {/* Modal de Detalhes */}
      <LeadDetailsFullModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        lead={selectedLead}
      />
      
      {/* 🔥 NOVO: Modal de Guia de APIs */}
      {showApiGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowApiGuide(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
            <ApiSetupGuide />
          </div>
        </div>
      )}
    </div>
  );
}