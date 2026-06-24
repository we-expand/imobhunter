import { useState } from 'react';
import { Search, MapPin, Briefcase, Building2, Users, Target, Loader2, Plus, X, Download, HelpCircle, ExternalLink, Sparkles, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { API_BASE_URL, API_ROUTES } from '../lib/api-config';

interface SearchFilters {
  keywords: string;
  location: string;
  jobTitles: string[];
  companies: string[];
  industries: string[];
  seniorityLevels: string[];
  companySize: string;
  revenueRange: string;
  employeeCount: string;
  technologies: string[];
  fundingStage: string;
}

export function ManualSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: '',
    location: '',
    jobTitles: [],
    companies: [],
    industries: [],
    seniorityLevels: [],
    companySize: '',
    revenueRange: '',
    employeeCount: '',
    technologies: [],
    fundingStage: ''
  });

  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentIndustry, setCurrentIndustry] = useState('');
  const [currentTech, setCurrentTech] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Adicionar filtros
  const addJobTitle = () => {
    if (currentJobTitle.trim()) {
      setFilters({
        ...filters,
        jobTitles: [...filters.jobTitles, currentJobTitle.trim()]
      });
      setCurrentJobTitle('');
    }
  };

  const addCompany = () => {
    if (currentCompany.trim()) {
      setFilters({
        ...filters,
        companies: [...filters.companies, currentCompany.trim()]
      });
      setCurrentCompany('');
    }
  };

  const addIndustry = () => {
    if (currentIndustry.trim()) {
      setFilters({
        ...filters,
        industries: [...filters.industries, currentIndustry.trim()]
      });
      setCurrentIndustry('');
    }
  };

  const addTechnology = () => {
    if (currentTech.trim()) {
      setFilters({
        ...filters,
        technologies: [...filters.technologies, currentTech.trim()]
      });
      setCurrentTech('');
    }
  };

  // Remover filtros
  const removeJobTitle = (index: number) => {
    setFilters({
      ...filters,
      jobTitles: filters.jobTitles.filter((_, i) => i !== index)
    });
  };

  const removeCompany = (index: number) => {
    setFilters({
      ...filters,
      companies: filters.companies.filter((_, i) => i !== index)
    });
  };

  const removeIndustry = (index: number) => {
    setFilters({
      ...filters,
      industries: filters.industries.filter((_, i) => i !== index)
    });
  };

  const removeTechnology = (index: number) => {
    setFilters({
      ...filters,
      technologies: filters.technologies.filter((_, i) => i !== index)
    });
  };

  // Executar busca
  const handleSearch = async () => {
    setSearching(true);
    
    try {
      console.log('🔍 ═══════════════════════════════════════════════');
      console.log('🔍 INICIANDO BUSCA DE LEADS - MODO REAL (NÃO DEMO)');
      console.log('🔍 ═══════════════════════════════════════════════');
      console.log('📦 Filtros do formulário (RAW):');
      console.log('   keywords:', filters.keywords);
      console.log('   location:', filters.location);
      console.log('   jobTitles:', filters.jobTitles);
      console.log('   companies:', filters.companies);
      console.log('   industries:', filters.industries);
      console.log('   seniorityLevels:', filters.seniorityLevels);
      console.log('   companySize:', filters.companySize);
      console.log('   revenueRange:', filters.revenueRange);
      console.log('   employeeCount:', filters.employeeCount);
      console.log('   technologies:', filters.technologies);
      console.log('   fundingStage:', filters.fundingStage);
      console.log('');
      
      // 🔥 CONSTRUIR PAYLOAD COM MAPEAMENTO CORRETO
      const payload = {
        fullName: filters.keywords || undefined, // Nome completo
        currentTitle: filters.jobTitles.length > 0 ? filters.jobTitles[0] : undefined,
        currentCompany: filters.companies.length > 0 ? filters.companies[0] : undefined,
        city: filters.location || undefined,
        industry: filters.industries.length > 0 ? filters.industries : undefined,
        seniority: filters.seniorityLevels.length > 0 ? filters.seniorityLevels : undefined,
        keywords: filters.keywords || undefined,
        hasEmail: true,
        hasPhone: false,
        limit: 50
      };
      
      console.log('📤 Payload que será enviado para o servidor:');
      console.log(JSON.stringify(payload, null, 2));
      console.log('');
      
      // 🔥 CHAMAR API REAL DO SERVIDOR
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.searchLeads}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta da API:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      console.log('✅ Resposta recebida da API:');
      console.log('   Total de resultados:', data.results?.length || 0);
      console.log('   Fontes:', data.sources?.join(', ') || 'N/A');
      console.log('   Primeiros 2 leads:', data.results?.slice(0, 2));
      
      // 🔥 ALERTA SE ESTIVER USANDO DADOS DEMO
      if (data.sources?.includes('demo')) {
        console.error('');
        console.error('⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️');
        console.error('💡 Motivo:', data.message);
        console.error('');
        
        toast.success(`✅ ${data.results?.length || 0} leads encontrados!`, {
          description: 'Leads de demonstração prontos para uso',
          duration: 6000,
        });
      } else {
        console.log('✅ DADOS REAIS! Fontes:', data.sources?.join(', '));
        toast.success(`✅ ${data.results?.length || 0} leads reais encontrados!`, {
          description: `Fontes: ${data.sources?.join(', ')}`,
        });
      }
      
      // Mapeia os resultados da API para o formato esperado pelo componente
      const mappedResults = data.results?.map((lead: any) => ({
        name: lead.name,
        company: lead.company,
        jobTitle: lead.title,
        email: lead.email || 'N/A',
        phone: lead.phone || 'N/A',
        location: lead.location,
        linkedIn: lead.linkedinUrl,
        score: lead.matchScore,
        enrichmentData: lead.enrichmentData // 🔥 Preserva dados de enriquecimento
      })) || [];
      
      setResults(mappedResults);
      console.log('📊 Total de leads mapeados:', mappedResults.length);
      console.log('🔍 ═══════════════════════════════════════════════');
      
    } catch (error) {
      console.error('❌ Erro na busca:', error);
      toast.error('Erro ao buscar leads', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-manual-search-${Date.now()}.json`;
    link.click();
    toast.success('Leads exportados com sucesso!');
  };

  const clearFilters = () => {
    setFilters({
      keywords: '',
      location: '',
      jobTitles: [],
      companies: [],
      industries: [],
      seniorityLevels: [],
      companySize: '',
      revenueRange: '',
      employeeCount: '',
      technologies: [],
      fundingStage: ''
    });
    setResults([]);
    toast.info('Filtros limpos');
  };

  // Seniority levels para Portugal
  const seniorityLevels = [
    'C-Level (CEO, CFO, CTO)',
    'Diretor',
    'Gerente',
    'Coordenador',
    'Especialista',
    'Analista'
  ];

  // Job Titles pré-definidos para imobiliário
  const jobTitlesOptions = [
    'CEO', 'CFO', 'CTO', 'COO',
    'Diretor Geral', 'Diretor Comercial', 'Diretor de Marketing',
    'Gerente Regional', 'Gerente de Vendas', 'Gerente de Operações',
    'Partner', 'Sócio',
    'Consultor Imobiliário Senior', 'Consultor Imobiliário',
    'Coordenador de Equipa', 'Team Leader',
    'Investidor', 'Investidor Imobiliário',
    'Property Manager', 'Asset Manager',
    'Relocation Specialist', 'Relocation Manager'
  ];

  // Empresas pré-definidas (principais do mercado português)
  const companiesOptions = [
    'Century 21', 'Remax', 'Era', 'Keller Williams',
    'Engel & Völkers', 'Sotheby\'s International Realty',
    'JLL', 'CBRE', 'Savills', 'Knight Frank',
    'Cushman & Wakefield', 'Colliers',
    'Imovirtual', 'Idealista', 'Casa Sapo',
    'Propriedades Priv', 'Prime Yield',
    'Quinta do Lago', 'Vilamoura', 'Martinhal'
  ];

  // Indústrias pré-definidas
  const industriesOptions = [
    'Real Estate', 'Imobiliário Residencial', 'Imobiliário Comercial',
    'Luxury Real Estate', 'Property Management',
    'Real Estate Investment', 'Proptech',
    'Construction', 'Arquitetura', 'Design de Interiores',
    'Relocation Services', 'Real Estate Development',
    'Asset Management', 'Hospitality', 'Turismo'
  ];

  // Tamanhos de empresa (número de funcionários)
  const companySizes = [
    '1-10 funcionários',
    '11-50 funcionários',
    '51-200 funcionários',
    '201-500 funcionários',
    '501-1000 funcionários',
    '1000+ funcionários'
  ];

  // Faixas de faturamento
  const revenueRanges = [
    'Menos de €100K',
    '€100K - €500K',
    '€500K - €1M',
    '€1M - €5M',
    '€5M - €10M',
    '€10M - €50M',
    'Mais de €50M'
  ];

  return (
    <div className="space-y-6">
      {/* 🚨 BOTÃO DE TESTE GIGANTE */}
      <Card className="p-8 bg-gradient-to-r from-red-500 to-orange-500 text-white border-4 border-yellow-400">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">🧪 TESTE RÁPIDO DA API</h2>
          <p className="text-xl">Clique aqui para testar se a busca de leads está funcionando!</p>
          <Button
            onClick={async () => {
              setSearching(true);
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
                }
                
              } catch (error) {
                console.error('❌ ERRO:', error);
                toast.error('Erro ao testar API', {
                  description: error instanceof Error ? error.message : 'Erro desconhecido'
                });
              } finally {
                setSearching(false);
              }
            }}
            disabled={searching}
            className="text-2xl py-8 px-12 bg-white text-red-600 hover:bg-gray-100 font-bold"
          >
            {searching ? (
              <>
                <Loader2 className="w-8 h-8 mr-3 animate-spin" />
                Testando...
              </>
            ) : (
              '🚀 CLIQUE AQUI PARA TESTAR A API'
            )}
          </Button>
          <p className="text-sm opacity-90">
            ⚠️ Abra o Console (F12) para ver logs detalhados!
          </p>
        </div>
      </Card>

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl">Busca Manual de Leads</h2>
            <p className="text-sm text-gray-600">
              Configure filtros avançados e encontre leads qualificados
            </p>
          </div>
          
          {/* 🔥 BOTÃO DE AJUDA */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://github.com/your-repo/blob/main/docs/API_SETUP_GUIDE.md', '_blank')}
            className="gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Guia de Configuração
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>

        {/* 🔥 STATUS DAS APIS CONFIGURADAS */}
        <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">Fontes de Dados Ativas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/80 border-purple-300 text-purple-700">
              <span className="w-2 h-2 bg-purple-600 rounded-full mr-2 inline-block"></span>
              Apollo.io
            </Badge>
            <Badge variant="outline" className="bg-white/80 border-blue-300 text-blue-700">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 inline-block"></span>
              LinkedIn Sales Nav
            </Badge>
            <Badge variant="outline" className="bg-white/80 border-green-300 text-green-700">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2 inline-block"></span>
              Hunter.io
            </Badge>
            <Badge variant="outline" className="bg-white/80 border-orange-300 text-orange-700">
              <span className="w-2 h-2 bg-orange-600 rounded-full mr-2 inline-block"></span>
              People Data Labs
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-200">
            <p className="text-xs text-gray-600">
              💡 Leads são enriquecidos automaticamente com dados de múltiplas fontes
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('/docs/API_SETUP_GUIDE.md', '_blank')}
              className="text-xs h-auto py-1 px-2 text-purple-700 hover:text-purple-900 hover:bg-purple-100"
            >
              Como configurar?
            </Button>
          </div>
        </Card>

        <Alert className="bg-blue-50 border-blue-200">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-900 text-sm">
            <strong>💡 Dica:</strong> Combine múltiplos filtros para resultados mais precisos.
            Quanto mais específico, melhor a qualidade dos leads!
          </AlertDescription>
        </Alert>
      </Card>

      {/* Filtros */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Coluna Esquerda */}
        <div className="space-y-6">
          {/* Palavras-chave */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium">Palavras-chave</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Buscar por</Label>
                <Input
                  placeholder="Ex: imobiliário, investimento, proptech..."
                  value={filters.keywords}
                  onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Localização */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-red-600" />
              <h3 className="font-medium">Localização</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Cidade/Região</Label>
                <Input
                  placeholder="Ex: Lisboa, Porto, Algarve..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Cargos */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">Cargos Alvo</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Selecione os cargos</Label>
                <select
                  className="w-full border rounded-lg p-2 text-sm mt-2"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
                >
                  <option value="">-- Selecione um cargo --</option>
                  {jobTitlesOptions.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
                <Button onClick={addJobTitle} size="sm" className="w-full mt-2" disabled={!currentJobTitle}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cargo
                </Button>
              </div>
              {filters.jobTitles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.jobTitles.map((title, index) => (
                    <Badge key={index} className="gap-1">
                      {title}
                      <button onClick={() => removeJobTitle(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Empresas */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-green-600" />
              <h3 className="font-medium">Empresas Específicas</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Selecione as empresas</Label>
                <select
                  className="w-full border rounded-lg p-2 text-sm mt-2"
                  value={currentCompany}
                  onChange={(e) => setCurrentCompany(e.target.value)}
                >
                  <option value="">-- Selecione uma empresa --</option>
                  {companiesOptions.map((company) => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
                <Button onClick={addCompany} size="sm" className="w-full mt-2" disabled={!currentCompany}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Empresa
                </Button>
              </div>
              {filters.companies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.companies.map((company, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {company}
                      <button onClick={() => removeCompany(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          {/* Nível de Senioridade */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium">Nível de Senioridade</h3>
            </div>
            <div className="space-y-2">
              {seniorityLevels.map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={filters.seniorityLevels.includes(level)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({
                          ...filters,
                          seniorityLevels: [...filters.seniorityLevels, level]
                        });
                      } else {
                        setFilters({
                          ...filters,
                          seniorityLevels: filters.seniorityLevels.filter((l) => l !== level)
                        });
                      }
                    }}
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Tamanho da Empresa */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium">Tamanho da Empresa</h3>
            </div>
            <select
              className="w-full border rounded-lg p-2 text-sm"
              value={filters.companySize}
              onChange={(e) => setFilters({ ...filters, companySize: e.target.value })}
            >
              <option value="">Qualquer tamanho</option>
              {companySizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </Card>

          {/* Faturamento */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-medium">Faturamento Anual</h3>
            </div>
            <select
              className="w-full border rounded-lg p-2 text-sm"
              value={filters.revenueRange}
              onChange={(e) => setFilters({ ...filters, revenueRange: e.target.value })}
            >
              <option value="">Qualquer faturamento</option>
              {revenueRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </Card>

          {/* Indústrias */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium">Indústrias</h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Selecione as indústrias</Label>
                <select
                  className="w-full border rounded-lg p-2 text-sm mt-2"
                  value={currentIndustry}
                  onChange={(e) => setCurrentIndustry(e.target.value)}
                >
                  <option value="">-- Selecione uma indústria --</option>
                  {industriesOptions.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                <Button onClick={addIndustry} size="sm" className="w-full mt-2" disabled={!currentIndustry}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Indústria
                </Button>
              </div>
              {filters.industries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.industries.map((industry, index) => (
                    <Badge key={index} variant="outline" className="gap-1 bg-purple-50">
                      {industry}
                      <button onClick={() => removeIndustry(index)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Ações */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-3">
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="gap-2"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Buscar Leads
                </>
              )}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
          
          {results.length > 0 && (
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              Exportar ({results.length})
            </Button>
          )}
        </div>
      </Card>

      {/* Resultados */}
      {results.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Resultados da Busca</h3>
            <Badge className="text-sm">
              {results.length} leads encontrados
            </Badge>
          </div>
          
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.name} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{result.name}</h4>
                    <p className="text-sm text-gray-600">{result.jobTitle}</p>
                    <p className="text-sm text-gray-500">{result.company}</p>
                    
                    {/* 🔥 BADGE DE ENRIQUECIMENTO MULTI-FONTE */}
                    {result.enrichmentData?.sources && result.enrichmentData.sources.length > 1 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          Enriquecido ({result.enrichmentData.sources.join(' + ')})
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Score: {result.score}%
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {result.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    📧 {result.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    📱 {result.phone}
                  </div>
                  <a
                    href={result.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    🔗 LinkedIn
                  </a>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    Adicionar ao Pipeline
                  </Button>
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}