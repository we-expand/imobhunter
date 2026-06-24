import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  Database,
  Users,
  Building2,
  TrendingUp,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Briefcase,
  Calendar,
  Activity,
  BarChart3,
  Globe,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Target,
  Award,
  AlertCircle
} from 'lucide-react';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-v2`;

interface LeadRecord {
  id: string;
  full_name: string;
  primary_email?: string;
  primary_phone?: string;
  current_title?: string;
  current_company?: string;
  linkedin_url?: string;
  city?: string;
  country?: string;
  photo_url?: string;
  headline?: string;
  
  data_quality_score: number;
  confidence_score: number;
  total_sources: number;
  sources: Array<{ name: string; api: string }>;
  
  status: string;
  created_at: string;
  updated_at: string;
  last_enriched_at?: string;
  
  found_by_user_email: string;
  total_updates: number;
  
  skills?: string[];
  seniority?: string;
}

interface DatabaseStats {
  total_leads: number;
  total_companies: number;
  avg_quality_score: number;
  avg_confidence_score: number;
  leads_by_status: Record<string, number>;
  leads_by_country: Record<string, number>;
  top_companies: Array<{ name: string; count: number }>;
  top_sources: Array<{ name: string; count: number }>;
  recent_updates: number;
}

export function LeadsDatabaseAdmin() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMinScore, setFilterMinScore] = useState<number>(0);

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Buscar leads
      const leadsResponse = await fetch(`${API_URL}/leads-database/all`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.leads || []);
      }

      // Buscar estatísticas
      const statsResponse = await fetch(`${API_URL}/leads-database/stats`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      toast.success('Dados carregados com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do banco de leads');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    // Filtro de busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        lead.full_name?.toLowerCase().includes(search) ||
        lead.primary_email?.toLowerCase().includes(search) ||
        lead.current_company?.toLowerCase().includes(search) ||
        lead.current_title?.toLowerCase().includes(search);
      
      if (!matchesSearch) return false;
    }

    // Filtro de status
    if (filterStatus !== 'all' && lead.status !== filterStatus) {
      return false;
    }

    // Filtro de score
    if (lead.confidence_score < filterMinScore) {
      return false;
    }

    return true;
  });

  // Cores de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-purple-500';
      case 'lost': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Score visual
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Leads</p>
                <p className="text-3xl font-bold">{stats?.total_leads || 0}</p>
              </div>
              <Database className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {stats?.recent_updates || 0} atualizações (24h)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Empresas</p>
                <p className="text-3xl font-bold">{stats?.total_companies || 0}</p>
              </div>
              <Building2 className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Únicas no banco de dados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualidade Média</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats?.avg_quality_score || 0)}`}>
                  {stats?.avg_quality_score || 0}%
                </p>
              </div>
              <Award className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Completude dos dados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confiança Média</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats?.avg_confidence_score || 0)}`}>
                  {stats?.avg_confidence_score || 0}%
                </p>
              </div>
              <Target className="w-12 h-12 text-green-500 opacity-20" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Score de confiabilidade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Visualização */}
      <Tabs defaultValue="leads" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads">
            <Users className="w-4 h-4 mr-2" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sources">
            <Globe className="w-4 h-4 mr-2" />
            Fontes de Dados
          </TabsTrigger>
        </TabsList>

        {/* TAB: LEADS */}
        <TabsContent value="leads" className="space-y-4">
          {/* Barra de Busca e Filtros */}
          <Card>
            <CardContent className="py-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, email, empresa ou cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="all">Todos os Status</option>
                  <option value="new">Novo</option>
                  <option value="contacted">Contactado</option>
                  <option value="qualified">Qualificado</option>
                  <option value="converted">Convertido</option>
                  <option value="lost">Perdido</option>
                </select>

                <select
                  value={filterMinScore}
                  onChange={(e) => setFilterMinScore(Number(e.target.value))}
                  className="px-4 py-2 border rounded-md"
                >
                  <option value="0">Qualquer Score</option>
                  <option value="80">Score ≥ 80%</option>
                  <option value="60">Score ≥ 60%</option>
                  <option value="40">Score ≥ 40%</option>
                </select>

                <Button onClick={loadData} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="flex gap-2 mt-3">
                <Badge variant="secondary">
                  {filteredLeads.length} de {leads.length} leads
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Leads */}
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {isLoading ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <div className="w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">Carregando leads...</p>
                  </CardContent>
                </Card>
              ) : filteredLeads.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhum lead encontrado
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tente ajustar os filtros ou realizar uma nova busca
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {lead.photo_url ? (
                            <img
                              src={lead.photo_url}
                              alt={lead.full_name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                              {lead.full_name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {lead.full_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {lead.current_title || 'Cargo não especificado'}
                              </p>
                            </div>

                            <div className="flex gap-2">
                              <Badge className={getStatusColor(lead.status)}>
                                {lead.status}
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                {lead.confidence_score}%
                              </Badge>
                            </div>
                          </div>

                          {/* Detalhes */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            {lead.current_company && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Building2 className="w-4 h-4" />
                                <span className="truncate">{lead.current_company}</span>
                              </div>
                            )}
                            {lead.primary_email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{lead.primary_email}</span>
                              </div>
                            )}
                            {lead.primary_phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{lead.primary_phone}</span>
                              </div>
                            )}
                            {lead.city && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{lead.city}, {lead.country}</span>
                              </div>
                            )}
                          </div>

                          {/* Rodapé */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {lead.total_sources} fontes
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Qualidade: {lead.data_quality_score}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(lead.updated_at).toLocaleDateString('pt-PT')}
                              </span>
                            </div>

                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* TAB: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Leads por Status */}
            <Card>
              <CardHeader>
                <CardTitle>Leads por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats?.leads_by_status || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                        <span className="capitalize">{status}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leads por País */}
            <Card>
              <CardHeader>
                <CardTitle>Leads por País</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats?.leads_by_country || {})
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span>{country}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Empresas */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Empresas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.top_companies.map((company, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-6">#{index + 1}</span>
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{company.name}</span>
                      </div>
                      <Badge variant="secondary">{company.count} leads</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Qualidade */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Excelente (80-100%)</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {leads.filter(l => l.data_quality_score >= 80).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Boa (60-79%)</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {leads.filter(l => l.data_quality_score >= 60 && l.data_quality_score < 80).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Regular (40-59%)</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {leads.filter(l => l.data_quality_score >= 40 && l.data_quality_score < 60).length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Baixa (0-39%)</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {leads.filter(l => l.data_quality_score < 40).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB: FONTES DE DADOS */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>APIs Integradas</CardTitle>
              <CardDescription>
                15+ fontes de dados para enriquecimento de leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Proxycurl (LinkedIn)', status: 'active', leads: 0 },
                  { name: 'Apollo.io', status: 'active', leads: 0 },
                  { name: 'Hunter.io', status: 'active', leads: 0 },
                  { name: 'Clearbit', status: 'inactive', leads: 0 },
                  { name: 'People Data Labs', status: 'active', leads: 0 },
                  { name: 'FullContact', status: 'inactive', leads: 0 },
                  { name: 'RocketReach', status: 'active', leads: 0 },
                  { name: 'Lusha', status: 'active', leads: 0 },
                  { name: 'Pipl', status: 'active', leads: 0 },
                  { name: 'ZoomInfo', status: 'inactive', leads: 0 },
                  { name: 'Snov.io', status: 'inactive', leads: 0 },
                  { name: 'ContactOut', status: 'inactive', leads: 0 },
                  { name: 'Kaspr', status: 'inactive', leads: 0 },
                  { name: 'Seamless.ai', status: 'inactive', leads: 0 },
                  { name: 'Leads Database', status: 'active', leads: leads.length },
                ].map((source) => (
                  <Card key={source.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{source.name}</h4>
                        {source.status === 'active' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {source.leads} leads
                      </p>
                      <Badge
                        variant={source.status === 'active' ? 'default' : 'secondary'}
                        className="mt-2"
                      >
                        {source.status === 'active' ? 'Ativa' : 'Configurar'}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Lead */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedLead.full_name}
              </DialogTitle>
              <DialogDescription>
                Detalhes completos do lead
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Cabeçalho com Avatar */}
              <div className="flex gap-4 items-start">
                {selectedLead.photo_url ? (
                  <img
                    src={selectedLead.photo_url}
                    alt={selectedLead.full_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    {selectedLead.full_name?.charAt(0) || '?'}
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{selectedLead.full_name}</h2>
                  <p className="text-gray-600 mb-2">{selectedLead.current_title}</p>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedLead.status)}>
                      {selectedLead.status}
                    </Badge>
                    <Badge variant="outline">
                      <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                      Confiança: {selectedLead.confidence_score}%
                    </Badge>
                    <Badge variant="outline">
                      <Award className="w-3 h-3 mr-1" />
                      Qualidade: {selectedLead.data_quality_score}%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Informações de Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {selectedLead.primary_email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedLead.primary_email}
                      </p>
                    </div>
                  )}
                  {selectedLead.primary_phone && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Telefone</p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedLead.primary_phone}
                      </p>
                    </div>
                  )}
                  {selectedLead.linkedin_url && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                      <a
                        href={selectedLead.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <Linkedin className="w-4 h-4" />
                        Ver Perfil
                      </a>
                    </div>
                  )}
                  {selectedLead.city && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Localização</p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedLead.city}, {selectedLead.country}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informações Profissionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Profissionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedLead.current_company && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Empresa</p>
                      <p className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {selectedLead.current_company}
                      </p>
                    </div>
                  )}
                  {selectedLead.current_title && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Cargo</p>
                      <p className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {selectedLead.current_title}
                      </p>
                    </div>
                  )}
                  {selectedLead.seniority && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Senioridade</p>
                      <Badge>{selectedLead.seniority}</Badge>
                    </div>
                  )}
                  {selectedLead.skills && selectedLead.skills.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.skills.slice(0, 10).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fontes de Dados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fontes de Dados</CardTitle>
                  <CardDescription>
                    {selectedLead.total_sources} fonte(s) utilizadas para enriquecer este lead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.sources?.map((source, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {source.name || source.api}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Metadados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Metadados</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Encontrado por</p>
                    <p>{selectedLead.found_by_user_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Data de Criação</p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(selectedLead.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Última Atualização</p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedLead.updated_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Total de Atualizações</p>
                    <p className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {selectedLead.total_updates}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
