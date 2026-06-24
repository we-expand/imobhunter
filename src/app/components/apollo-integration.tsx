import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { apollo } from '../lib/apollo-service';
import { storage } from '../lib/storage-service';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Search, 
  Download,
  AlertCircle,
  ExternalLink,
  Copy,
  Users,
  Building2,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

export function ApolloIntegration() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [creditsInfo, setCreditsInfo] = useState<{ remaining: number; limit: number } | null>(null);

  // Estado da busca
  const [searchParams, setSearchParams] = useState({
    jobTitles: '',
    companies: '',
    locations: 'Portugal',
    keywords: ''
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const config = apollo.getConfig();
    if (config.apiKey) {
      setApiKey(config.apiKey);
      setIsConfigured(true);
      loadCreditsInfo();
    }
  }, []);

  const loadCreditsInfo = async () => {
    const info = await apollo.getCreditsInfo();
    if (info.success) {
      setCreditsInfo({
        remaining: info.creditsRemaining,
        limit: info.creditsLimit
      });
    }
  };

  const handleSaveConfig = () => {
    apollo.configure(apiKey);
    setIsConfigured(true);
    toast.success('API Key do Apollo.io salva!');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await apollo.testConnection();
      setTestResult(result);

      if (result.success) {
        toast.success('Conexão com Apollo.io estabelecida!');
        await loadCreditsInfo();
      } else {
        toast.error('Falha ao conectar com Apollo.io');
      }
    } catch (error: any) {
      setTestResult({ success: false, message: error.message });
      toast.error('Erro ao testar conexão');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSearch = async () => {
    if (!isConfigured) {
      toast.error('Configure a API Key primeiro!');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setSelectedLeads(new Set());

    try {
      const result = await apollo.searchPeople({
        jobTitles: searchParams.jobTitles ? searchParams.jobTitles.split(',').map(t => t.trim()) : undefined,
        companyNames: searchParams.companies ? searchParams.companies.split(',').map(c => c.trim()) : undefined,
        locations: searchParams.locations ? searchParams.locations.split(',').map(l => l.trim()) : undefined,
        keywords: searchParams.keywords ? searchParams.keywords.split(',').map(k => k.trim()) : undefined,
        perPage: 25
      });

      if (result.success) {
        setSearchResults(result.people);
        setTotalResults(result.totalResults);
        toast.success(`Encontrados ${result.people.length} leads! (${result.creditsUsed} crédito usado)`);
        await loadCreditsInfo();
      } else {
        toast.error(result.error || 'Erro na busca');
      }
    } catch (error: any) {
      toast.error('Erro ao buscar leads');
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleLead = (apolloId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(apolloId)) {
      newSelected.delete(apolloId);
    } else {
      newSelected.add(apolloId);
    }
    setSelectedLeads(newSelected);
  };

  const handleImportSelected = async () => {
    if (selectedLeads.size === 0) {
      toast.error('Selecione pelo menos um lead!');
      return;
    }

    const leadsToImport = searchResults.filter(p => selectedLeads.has(p.id));
    
    // Detecta cluster baseado nos job titles
    const detectCluster = (person: any) => {
      const title = person.title?.toLowerCase() || '';
      const seniority = person.seniority?.toLowerCase() || '';
      
      if (seniority.includes('c_suite') || title.includes('ceo') || title.includes('director')) {
        return 'High-End/Executivos';
      }
      if (title.includes('hr') || title.includes('people') || title.includes('talent')) {
        return 'Parcerias/Relocation';
      }
      if (title.includes('investor') || title.includes('real estate')) {
        return 'Investidores';
      }
      return '1ª Habitação';
    };

    for (const person of leadsToImport) {
      const cluster = detectCluster(person);
      const lead = apollo.convertToLead(person, cluster);
      await storage.addLead(lead);
      
      // Adiciona atividade
      await storage.addActivity({
        id: `activity-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        action: 'Lead importado do Apollo.io',
        leadName: lead.name,
        cluster: cluster,
        channel: 'linkedin',
        status: 'success'
      });
    }

    toast.success(`${selectedLeads.size} leads importados com sucesso!`);
    setSelectedLeads(new Set());
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  return (
    <Tabs defaultValue="config" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="config">Configuração</TabsTrigger>
        <TabsTrigger value="search">Buscar Leads</TabsTrigger>
        <TabsTrigger value="enrich">Email Enrichment</TabsTrigger>
      </TabsList>

      {/* TAB: Configuração */}
      <TabsContent value="config" className="space-y-6">
        {/* Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Rocket className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg">Apollo.io API</h3>
                <p className="text-sm text-gray-600">Plataforma de prospecção B2B</p>
              </div>
            </div>
            <Badge variant={isConfigured ? 'default' : 'secondary'} className="gap-2">
              {isConfigured ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Conectado
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Desconectado
                </>
              )}
            </Badge>
          </div>

          {creditsInfo && isConfigured && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Créditos Restantes</p>
                <p className="text-2xl text-green-600">{creditsInfo.remaining}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Limite Mensal</p>
                <p className="text-2xl text-blue-600">{creditsInfo.limit}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Guia */}
        <Card className="p-6">
          <h3 className="text-lg mb-4">📋 Como Obter API Key do Apollo.io (Grátis)</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Criar conta no Apollo.io</p>
                <p className="text-sm text-gray-600 mb-2">
                  Plano gratuito inclui 60 créditos/mês (renova automaticamente)
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://app.apollo.io/#/signup', '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  Criar Conta Grátis
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Acessar configurações de API</p>
                <p className="text-sm text-gray-600">
                  Após login: Clique no seu avatar → Settings → API Keys
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Criar API Key</p>
                <p className="text-sm text-gray-600 mb-2">
                  Clique em "Create API Key" → Copie a chave gerada
                </p>
                <Alert className="mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription className="text-xs">
                    A API Key começa com algo como: <code>xxxxxxxxxxxxxxxxxxxxxxxx</code>
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                4
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Cole abaixo e teste!</p>
                <p className="text-sm text-gray-600">
                  Após configurar, você poderá buscar até 60 leads/mês gratuitamente
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Formulário */}
        <Card className="p-6">
          <h3 className="text-lg mb-4">⚙️ Configuração da API</h3>

          <div className="space-y-4">
            <div>
              <Label>API Key do Apollo.io *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="password"
                  placeholder="Sua API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                {apiKey && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(apiKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveConfig}
                disabled={!apiKey}
                className="flex-1"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Salvar Configuração
              </Button>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={!isConfigured || isTesting}
                className="flex-1"
              >
                {isTesting ? 'Testando...' : 'Testar Conexão'}
              </Button>
            </div>

            {testResult && (
              <Alert variant={testResult.success ? 'default' : 'destructive'}>
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </Card>

        {/* Informações */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 O que você pode fazer com Apollo.io</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ 60 créditos grátis por mês (renova automaticamente)</li>
            <li>✅ Buscar pessoas por cargo, empresa, localização</li>
            <li>✅ Dados enriquecidos: email, telefone, LinkedIn</li>
            <li>✅ Informações da empresa: website, funcionários, setor</li>
            <li>✅ Filtros avançados de seniority e departamento</li>
            <li>⚠️ 1 crédito = 1 resultado de busca</li>
            <li>💡 Use filtros específicos para economizar créditos</li>
          </ul>
        </Card>
      </TabsContent>

      {/* TAB: Buscar Leads */}
      <TabsContent value="search" className="space-y-6">
        {!isConfigured && (
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Configure a API Key na aba "Configuração" primeiro!
            </AlertDescription>
          </Alert>
        )}

        {/* Formulário de Busca */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">🔍 Buscar Leads no Apollo.io</h3>
            {creditsInfo && (
              <Badge variant="outline">
                {creditsInfo.remaining} créditos restantes
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Job Titles (separados por vírgula)</Label>
              <Input
                placeholder="CEO, CTO, Director"
                value={searchParams.jobTitles}
                onChange={(e) => setSearchParams({ ...searchParams, jobTitles: e.target.value })}
                className="mt-2"
                disabled={!isConfigured}
              />
            </div>

            <div>
              <Label>Empresas (opcional)</Label>
              <Input
                placeholder="Microsoft, Google, Amazon"
                value={searchParams.companies}
                onChange={(e) => setSearchParams({ ...searchParams, companies: e.target.value })}
                className="mt-2"
                disabled={!isConfigured}
              />
            </div>

            <div>
              <Label>Localizações</Label>
              <Input
                placeholder="Portugal, Lisbon, Porto"
                value={searchParams.locations}
                onChange={(e) => setSearchParams({ ...searchParams, locations: e.target.value })}
                className="mt-2"
                disabled={!isConfigured}
              />
            </div>

            <div>
              <Label>Keywords (opcional)</Label>
              <Input
                placeholder="real estate, investment, relocation"
                value={searchParams.keywords}
                onChange={(e) => setSearchParams({ ...searchParams, keywords: e.target.value })}
                className="mt-2"
                disabled={!isConfigured}
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!isConfigured || isSearching}
            className="w-full"
          >
            <Search className="w-4 h-4 mr-2" />
            {isSearching ? 'Buscando...' : 'Buscar Leads (1 crédito)'}
          </Button>
        </Card>

        {/* Resultados */}
        {searchResults.length > 0 && (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg">Resultados ({searchResults.length})</h3>
                  <p className="text-sm text-gray-600">Total encontrado: {totalResults}</p>
                </div>
                <Button
                  onClick={handleImportSelected}
                  disabled={selectedLeads.size === 0}
                  variant="default"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Importar Selecionados ({selectedLeads.size})
                </Button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {searchResults.map((person) => (
                  <div
                    key={person.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLeads.has(person.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleLead(person.id)}
                  >
                    <div className="flex items-start gap-4">
                      {person.photo_url ? (
                        <img
                          src={person.photo_url}
                          alt={person.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">
                              {person.first_name} {person.last_name}
                            </h4>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Briefcase className="w-3 h-3" />
                              {person.title || 'N/A'}
                            </p>
                          </div>
                          {person.seniority && (
                            <Badge variant="outline">{person.seniority}</Badge>
                          )}
                        </div>

                        <div className="mt-2 space-y-1">
                          {person.organization?.name && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {person.organization.name}
                            </p>
                          )}
                          {person.email && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {person.email}
                            </p>
                          )}
                          {person.city && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {person.city}, {person.country}
                            </p>
                          )}
                          {person.linkedin_url && (
                            <a
                              href={person.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Ver LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </TabsContent>

      {/* TAB: Email Enrichment */}
      <TabsContent value="enrich" className="space-y-6">
        {!isConfigured && (
          <Alert>
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Configure a API Key na aba "Configuração" primeiro!
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg">📧 Email Enrichment</h3>
              <p className="text-sm text-gray-600">
                Enriqueça emails de leads existentes com dados completos do Apollo.io
              </p>
            </div>
          </div>

          <Alert className="bg-purple-50 border-purple-200 mb-6">
            <Mail className="w-4 h-4 text-purple-600" />
            <AlertDescription className="text-purple-900 text-sm">
              <strong>Como funciona:</strong> Cole uma lista de emails (um por linha) e o Apollo.io
              retornará informações completas: nome, cargo, empresa, telefone, LinkedIn, etc.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label>Lista de Emails para Enriquecer</Label>
              <p className="text-xs text-gray-500 mb-2">
                Cole um email por linha. Exemplo:
              </p>
              <textarea
                className="w-full border rounded-lg p-3 text-sm font-mono min-h-[200px]"
                placeholder={`joao.silva@empresa.pt\nmaria.santos@example.com\npedro.costa@company.pt`}
                disabled={!isConfigured}
              />
            </div>

            {creditsInfo && (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Você tem <strong>{creditsInfo.remaining} créditos</strong> restantes.
                  Cada email enriquecido consome 1 crédito.
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              disabled={!isConfigured}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Enriquecer Emails
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">💡 O que você ganha com Email Enrichment</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Nome Completo</p>
                <p className="text-xs text-blue-700">Primeiro e último nome</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Cargo Atual</p>
                <p className="text-xs text-blue-700">Posição e senioridade</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Empresa</p>
                <p className="text-xs text-blue-700">Nome, website, setor</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Telefone</p>
                <p className="text-xs text-blue-700">Quando disponível</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">LinkedIn</p>
                <p className="text-xs text-blue-700">Perfil completo</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Localização</p>
                <p className="text-xs text-blue-700">Cidade e país</p>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}