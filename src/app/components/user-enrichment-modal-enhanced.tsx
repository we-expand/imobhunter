import { X, Mail, Phone, MapPin, Briefcase, Calendar, Clock, Linkedin, Twitter, Facebook, Github, Building2, Globe, Award, ExternalLink, DollarSign, Activity, RefreshCw, CheckCircle2, AlertCircle, TrendingUp, Users, Target, Zap, Instagram, Youtube, Search, Download, MessageSquare, Database, ShieldCheck, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { useState } from 'react';

interface UserEnrichmentModalProps {
  user: any;
  enrichedUser: any | null;
  isEnriching: boolean;
  activities: any[];
  onClose: () => void;
}

export function UserEnrichmentModalEnhanced({
  user,
  enrichedUser,
  isEnriching,
  activities,
  onClose
}: UserEnrichmentModalProps) {
  const displayUser = enrichedUser || user;
  const hasEnrichedData = enrichedUser && enrichedUser.enrichment_status === 'completed';
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calcular progresso
  const enrichmentProgress = displayUser.completeness || 0;
  const dataQuality = displayUser.data_quality || 0;

  // Mapear cores das fontes de dados
  const sourceColors: Record<string, string> = {
    'Hunter.io': 'bg-orange-100 text-orange-700 border-orange-300',
    'Apollo.io': 'bg-blue-100 text-blue-700 border-blue-300',
    'Clearbit': 'bg-purple-100 text-purple-700 border-purple-300',
    'PeopleDataLabs': 'bg-green-100 text-green-700 border-green-300',
    'FullContact': 'bg-pink-100 text-pink-700 border-pink-300',
    'RocketReach': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Pipl': 'bg-indigo-100 text-indigo-700 border-indigo-300',
    'Lusha': 'bg-emerald-100 text-emerald-700 border-emerald-300'
  };

  // Ícones por fonte
  const sourceIcons: Record<string, any> = {
    'Hunter.io': Search,
    'Apollo.io': Database,
    'Clearbit': ShieldCheck,
    'PeopleDataLabs': Users,
    'FullContact': Globe,
    'RocketReach': Zap,
    'Pipl': Target,
    'Lusha': Phone
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gradient com Avatar */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-8">
          {/* Pattern de fundo */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              {displayUser.photo_url || displayUser.avatar ? (
                <img
                  src={displayUser.photo_url || displayUser.avatar}
                  alt={displayUser.name}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-2xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-2xl">
                  <span className="text-4xl font-bold">
                    {displayUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Info Principal */}
              <div>
                <h3 className="text-3xl font-bold mb-1">
                  {displayUser.full_name || displayUser.name}
                </h3>
                <p className="text-white/90 text-lg mb-2">{displayUser.email}</p>
                {displayUser.job_title && (
                  <p className="text-white/80 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {displayUser.job_title}
                    {displayUser.company_name && ` @ ${displayUser.company_name}`}
                  </p>
                )}
                {displayUser.city && (
                  <p className="text-white/80 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {displayUser.city}{displayUser.country && `, ${displayUser.country}`}
                  </p>
                )}
                
                {/* Badges */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/40 backdrop-blur-sm">
                    {displayUser.plan.toUpperCase()}
                  </Badge>
                  
                  {hasEnrichedData && (
                    <>
                      <Badge variant="secondary" className="bg-green-500/90 text-white border-green-400">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {displayUser.apis_used || displayUser.sources?.length || 0}/{displayUser.apis_total || 9} APIs
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-500/90 text-white border-blue-400">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        {enrichmentProgress}% Completo
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-500/90 text-white border-purple-400">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Qualidade: {dataQuality}%
                      </Badge>
                    </>
                  )}
                  
                  {isEnriching && (
                    <Badge variant="secondary" className="bg-yellow-500/90 text-white border-yellow-400 animate-pulse">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Coletando dados...
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Botão Fechar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Bars */}
          {hasEnrichedData && (
            <div className="mt-6 space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/80">Completude dos Dados</span>
                  <span className="font-bold">{enrichmentProgress}%</span>
                </div>
                <Progress value={enrichmentProgress} className="h-2 bg-white/20" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-white/80">Qualidade dos Dados</span>
                  <span className="font-bold">{dataQuality}%</span>
                </div>
                <Progress value={dataQuality} className="h-2 bg-white/20" />
              </div>
            </div>
          )}
        </div>

        {/* Loading Progressivo com Detalhes */}
        {isEnriching && (
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-4 border-blue-600 p-6">
            <div className="flex items-center gap-4 mb-4">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <h4 className="font-bold text-blue-900 text-lg">
                  🔍 Buscando dados em 9 fontes...
                </h4>
                <p className="text-sm text-blue-700">
                  Isso pode levar 10-30 segundos. Aguarde...
                </p>
              </div>
            </div>
            
            {/* Lista de APIs sendo consultadas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Hunter.io', 'Apollo.io', 'Clearbit', 'PeopleDataLabs', 'FullContact', 'RocketReach', 'Pipl', 'Lusha', 'Google/LinkedIn'].map((api, idx) => {
                const Icon = sourceIcons[api] || Database;
                return (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 animate-pulse">
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">{api}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabs Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(95vh - 300px)' }}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="p-6">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Profissional
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contato
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Social
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Atividade
              </TabsTrigger>
              <TabsTrigger value="alldata" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Todos os Dados
              </TabsTrigger>
            </TabsList>

            {/* TAB: Visão Geral */}
            <TabsContent value="overview" className="space-y-6">
              {/* Métricas da Plataforma */}
              <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Métricas da Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                      <p className="text-4xl font-bold text-blue-600">{displayUser.total_leads}</p>
                      <p className="text-xs text-gray-600 mt-1">Leads Gerados</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                      <p className="text-4xl font-bold text-purple-600">{displayUser.messages_sent}</p>
                      <p className="text-xs text-gray-600 mt-1">Mensagens</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                      <p className="text-4xl font-bold text-orange-600">{displayUser.searches}</p>
                      <p className="text-xs text-gray-600 mt-1">Buscas</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                      <p className="text-4xl font-bold text-green-600">€{displayUser.mrr}</p>
                      <p className="text-xs text-gray-600 mt-1">MRR</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fontes de Dados */}
              {displayUser.sources && displayUser.sources.length > 0 && (
                <Card className="border-2 border-purple-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-600" />
                      Fontes de Dados ({displayUser.sources.length})
                    </CardTitle>
                    <CardDescription>
                      Dados coletados em {new Date(displayUser.enriched_at).toLocaleString('pt-PT')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {displayUser.sources.map((source: string, idx: number) => {
                        const Icon = sourceIcons[source] || Database;
                        const colorClass = sourceColors[source] || 'bg-gray-100 text-gray-700 border-gray-300';
                        return (
                          <div key={idx} className={`flex items-center gap-2 p-3 rounded-lg border-2 ${colorClass} hover:scale-105 transition-transform`}>
                            <Icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{source}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Detalhes de Enriquecimento */}
                    {displayUser.enrichment_details && displayUser.enrichment_details.length > 0 && (
                      <div className="mt-4 pt-4 border-t space-y-2">
                        {displayUser.enrichment_details.map((detail: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                            {detail.status === 'success' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{detail.source}</p>
                              {detail.status === 'success' && detail.fields && (
                                <p className="text-xs text-gray-600">
                                  {detail.fields.join(', ')}
                                </p>
                              )}
                              {detail.error && (
                                <p className="text-xs text-orange-600">{detail.error}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Bio */}
              {displayUser.bio && (
                <Card className="border-2 border-green-100 shadow-lg">
                  <CardHeader>
                    <CardTitle>📝 Biografia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{displayUser.bio}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* TAB: Profissional */}
            <TabsContent value="professional" className="space-y-6">
              {/* Informações Profissionais Atuais */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Cargo Atual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!displayUser.job_title && !displayUser.seniority && !displayUser.departments?.length && (
                    <div className="text-center py-8 px-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                      <p className="font-medium text-amber-900 mb-2">Nenhum dado profissional encontrado</p>
                      <p className="text-sm text-amber-700 mb-4">
                        Configure as API keys do <strong>Apollo.io</strong> ou <strong>People Data Labs</strong> para buscar dados profissionais reais da internet.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => window.open('/COMO-CONFIGURAR-ENRIQUECIMENTO.md', '_blank')}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Guia de Configuração
                      </Button>
                    </div>
                  )}
                  
                  {displayUser.job_title && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Cargo</p>
                        <p className="font-bold text-lg text-blue-900">{displayUser.job_title}</p>
                        {displayUser.headline && (
                          <p className="text-sm text-gray-600 mt-1">{displayUser.headline}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {displayUser.seniority && (
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Senioridade</p>
                        <p className="font-medium capitalize">{displayUser.seniority}</p>
                      </div>
                    </div>
                  )}
                  
                  {displayUser.departments && displayUser.departments.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Departamentos</p>
                      <div className="flex flex-wrap gap-2">
                        {displayUser.departments.map((dept: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-purple-50">
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dados da Empresa */}
              <Card className="border-2 border-purple-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!displayUser.company_name && !displayUser.company_website && !displayUser.company_employees && (
                    <div className="text-center py-8 px-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <Building2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                      <p className="font-medium text-blue-900 mb-2">Nenhum dado empresarial encontrado</p>
                      <p className="text-sm text-blue-700 mb-4">
                        Configure as API keys do <strong>Apollo.io</strong> ou <strong>Clearbit</strong> para buscar informações sobre a empresa.
                      </p>
                      <Button
                        size="sm"
                        onClick={() => window.open('/COMO-CONFIGURAR-ENRIQUECIMENTO.md', '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Guia de Configuração
                      </Button>
                    </div>
                  )}
                  
                  {displayUser.company_logo && (
                    <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                      <img
                        src={displayUser.company_logo}
                        alt={displayUser.company_name}
                        className="h-16 object-contain"
                      />
                    </div>
                  )}
                  
                  {displayUser.company_name && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Nome</p>
                        <p className="font-bold text-lg">{displayUser.company_name}</p>
                      </div>
                    </div>
                  )}
                  
                  {displayUser.company_website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Website</p>
                        <a
                          href={displayUser.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {displayUser.company_website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    {displayUser.company_employees && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-blue-900">
                          {displayUser.company_employees.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Funcionários</p>
                      </div>
                    )}
                    {displayUser.company_revenue && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-green-900">
                          ${(displayUser.company_revenue / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-gray-600">Receita Anual</p>
                      </div>
                    )}
                  </div>
                  
                  {displayUser.company_description && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-1">Descrição</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {displayUser.company_description}
                      </p>
                    </div>
                  )}
                  
                  {displayUser.company_industry && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Indústria</p>
                      <Badge variant="outline" className="bg-purple-50">
                        {displayUser.company_industry}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Histórico Profissional */}
              {displayUser.work_experience && displayUser.work_experience.length > 0 && (
                <Card className="border-2 border-orange-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Histórico Profissional ({displayUser.work_experience.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {displayUser.work_experience.slice(0, 5).map((exp: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                          <div className="flex-1">
                            <p className="font-bold text-orange-900">{exp.title || exp.job_title}</p>
                            <p className="text-sm text-orange-700">{exp.company || exp.company_name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {exp.start_date && new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Presente'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Educação */}
              {displayUser.education && displayUser.education.length > 0 && (
                <Card className="border-2 border-green-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-600" />
                      Educação ({displayUser.education.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {displayUser.education.map((edu: any, idx: number) => (
                        <div key={idx} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <p className="font-bold text-green-900">{edu.school || edu.school_name}</p>
                          <p className="text-sm text-green-700">{edu.degree || edu.degrees?.[0]}</p>
                          {edu.field_of_study && (
                            <p className="text-xs text-gray-600">{edu.field_of_study}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {displayUser.skills && displayUser.skills.length > 0 && (
                <Card className="border-2 border-pink-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-pink-600" />
                      Habilidades ({displayUser.skills.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {displayUser.skills.slice(0, 20).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-pink-50 hover:bg-pink-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* TAB: Contato */}
            <TabsContent value="contact" className="space-y-6">
              {/* Email */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Email Principal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-mono text-lg text-blue-900">{displayUser.email}</p>
                    {displayUser.email_verified !== undefined && (
                      <div className="flex items-center gap-2 mt-2">
                        {displayUser.email_verified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verificado {displayUser.email_score && `• ${displayUser.email_score}%`}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Não verificado
                          </Badge>
                        )}
                        {displayUser.email_deliverable && (
                          <Badge variant="outline" className="bg-blue-50">Entregável</Badge>
                        )}
                        {displayUser.email_webmail && (
                          <Badge variant="outline" className="bg-purple-50">Webmail</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {displayUser.alternative_emails && displayUser.alternative_emails.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Emails Alternativos</p>
                      {displayUser.alternative_emails.map((email: string, idx: number) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded mb-2">
                          <p className="font-mono text-sm">{email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Telefones */}
              {displayUser.phone_numbers && displayUser.phone_numbers.length > 0 && (
                <Card className="border-2 border-green-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      Telefones ({displayUser.phone_numbers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {displayUser.phone_numbers.map((phone: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <Phone className="w-4 h-4 text-green-600" />
                          <a href={`tel:${phone}`} className="font-mono font-medium text-green-900 hover:underline">
                            {phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Localização */}
              <Card className="border-2 border-purple-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {displayUser.city && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-900">
                        {displayUser.city}
                        {displayUser.state && `, ${displayUser.state}`}
                      </p>
                      {displayUser.country && (
                        <p className="text-sm text-gray-600">{displayUser.country}</p>
                      )}
                    </div>
                  )}
                  
                  {displayUser.time_zone && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Fuso Horário</p>
                        <p className="font-medium">{displayUser.time_zone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Datas Importantes */}
              <Card className="border-2 border-orange-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    Datas Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">Membro desde</p>
                      <p className="font-medium">
                        {new Date(displayUser.created_at).toLocaleDateString('pt-PT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Último login</p>
                      <p className="font-medium">
                        {new Date(displayUser.last_login).toLocaleString('pt-PT')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Social */}
            <TabsContent value="social" className="space-y-6">
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Redes Sociais & Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayUser.linkedin_url && (
                      <a
                        href={displayUser.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all hover:scale-105 border-2 border-blue-200"
                      >
                        <Linkedin className="w-6 h-6 text-blue-600" />
                        <div className="flex-1">
                          <span className="font-medium text-blue-900">LinkedIn</span>
                          <p className="text-xs text-gray-600">Perfil profissional</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}

                    {displayUser.twitter_url && (
                      <a
                        href={displayUser.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-sky-50 rounded-lg hover:bg-sky-100 transition-all hover:scale-105 border-2 border-sky-200"
                      >
                        <Twitter className="w-6 h-6 text-sky-600" />
                        <div className="flex-1">
                          <span className="font-medium text-sky-900">Twitter</span>
                          <p className="text-xs text-gray-600">@{displayUser.twitter_username || 'profile'}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}

                    {displayUser.facebook_url && (
                      <a
                        href={displayUser.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all hover:scale-105 border-2 border-indigo-200"
                      >
                        <Facebook className="w-6 h-6 text-indigo-600" />
                        <div className="flex-1">
                          <span className="font-medium text-indigo-900">Facebook</span>
                          <p className="text-xs text-gray-600">Perfil pessoal</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}

                    {displayUser.github_url && (
                      <a
                        href={displayUser.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 border-2 border-gray-200"
                      >
                        <Github className="w-6 h-6 text-gray-600" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">GitHub</span>
                          <p className="text-xs text-gray-600">@{displayUser.github_username || 'profile'}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}

                    {displayUser.instagram_url && (
                      <a
                        href={displayUser.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-all hover:scale-105 border-2 border-pink-200"
                      >
                        <Instagram className="w-6 h-6 text-pink-600" />
                        <div className="flex-1">
                          <span className="font-medium text-pink-900">Instagram</span>
                          <p className="text-xs text-gray-600">Perfil</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}

                    {displayUser.youtube_url && (
                      <a
                        href={displayUser.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-all hover:scale-105 border-2 border-red-200"
                      >
                        <Youtube className="w-6 h-6 text-red-600" />
                        <div className="flex-1">
                          <span className="font-medium text-red-900">YouTube</span>
                          <p className="text-xs text-gray-600">Canal</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                  </div>

                  {/* Links de Busca */}
                  {!displayUser.linkedin_url && displayUser.linkedin_search_url && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600 mb-3">Buscar perfil em:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <a
                          href={displayUser.linkedin_search_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          <Search className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Buscar no LinkedIn</span>
                          <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                        </a>
                        {displayUser.google_search_url && (
                          <a
                            href={displayUser.google_search_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <Search className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Buscar no Google</span>
                            <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {!displayUser.linkedin_url && !displayUser.twitter_url && !displayUser.facebook_url && !displayUser.github_url && !displayUser.instagram_url && !displayUser.youtube_url && (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Nenhuma rede social encontrada</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Atividade */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="border-2 border-orange-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    Atividades Recentes
                  </CardTitle>
                  <CardDescription>Últimas ações deste usuário na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activities
                      .filter(act => act.user_id === displayUser.id)
                      .slice(0, 20)
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-4 border-l-4 border-orange-500 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                          <Activity className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(activity.created_at).toLocaleString('pt-PT')}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0 bg-white">
                            {activity.type}
                          </Badge>
                        </div>
                      ))}
                    {activities.filter(act => act.user_id === displayUser.id).length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Nenhuma atividade registrada ainda</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: Todos os Dados - Mostra TODOS os campos retornados pelas APIs */}
            <TabsContent value="alldata" className="space-y-6">
              <Card className="border-2 border-gray-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-gray-600" />
                    Dados Completos de TODAS as APIs
                  </CardTitle>
                  <CardDescription>
                    Visualização completa de todos os campos retornados pelas {displayUser.apis_total || 9} APIs de enriquecimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Organizar por fontes */}
                  {displayUser.enrichment_details && displayUser.enrichment_details.length > 0 ? (
                    <div className="space-y-6">
                      {displayUser.enrichment_details.map((detail: any, idx: number) => {
                        const Icon = sourceIcons[detail.source] || Database;
                        const colorClass = sourceColors[detail.source] || 'bg-gray-100 text-gray-700 border-gray-300';
                        
                        return (
                          <div key={idx} className={`p-4 rounded-xl border-2 ${colorClass.replace('bg-', 'border-').replace('-100', '-200')}`}>
                            <div className="flex items-center gap-3 mb-4">
                              <Icon className="w-6 h-6" />
                              <div className="flex-1">
                                <h4 className="font-bold text-lg">{detail.source}</h4>
                                <p className="text-xs opacity-80">
                                  {detail.status === 'success' ? '✅ Dados coletados com sucesso' : '❌ Erro ao coletar'}
                                </p>
                              </div>
                              {detail.status === 'success' && (
                                <Badge variant="outline" className="bg-white">
                                  {detail.fields?.length || 0} campos
                                </Badge>
                              )}
                            </div>
                            
                            {detail.status === 'success' && detail.fields && (
                              <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-sm font-medium mb-2">Campos coletados:</p>
                                <div className="flex flex-wrap gap-2">
                                  {detail.fields.map((field: string, fidx: number) => (
                                    <Badge key={fidx} variant="outline" className="text-xs">
                                      {field}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {detail.error && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                                <p className="text-sm text-red-700">
                                  <strong>Erro:</strong> {detail.error}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Database className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium mb-2">Nenhum enriquecimento realizado</p>
                      <p className="text-sm">Clique em "Enriquecer Dados" para buscar informações nas 9 APIs</p>
                    </div>
                  )}
                  
                  {/* Todos os campos RAW */}
                  {hasEnrichedData && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        Dados Brutos (JSON)
                      </h4>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto font-mono text-xs max-h-96 overflow-y-auto">
                        <pre>{JSON.stringify({
                          // Dados básicos
                          id: displayUser.id,
                          name: displayUser.name,
                          full_name: displayUser.full_name,
                          email: displayUser.email,
                          
                          // Hunter.io
                          email_verified: displayUser.email_verified,
                          email_score: displayUser.email_score,
                          email_deliverable: displayUser.email_deliverable,
                          email_accept_all: displayUser.email_accept_all,
                          email_disposable: displayUser.email_disposable,
                          email_webmail: displayUser.email_webmail,
                          company_emails_found: displayUser.company_emails_found,
                          company_pattern: displayUser.company_pattern,
                          
                          // Apollo.io
                          linkedin_url: displayUser.linkedin_url,
                          twitter_url: displayUser.twitter_url,
                          facebook_url: displayUser.facebook_url,
                          company_linkedin: displayUser.company_linkedin,
                          job_title: displayUser.job_title,
                          seniority: displayUser.seniority,
                          departments: displayUser.departments,
                          phone_numbers: displayUser.phone_numbers,
                          personal_emails: displayUser.personal_emails,
                          headline: displayUser.headline,
                          
                          // Clearbit
                          bio: displayUser.bio,
                          avatar: displayUser.avatar,
                          photo_url: displayUser.photo_url,
                          location: displayUser.location,
                          time_zone: displayUser.time_zone,
                          github_url: displayUser.github_url,
                          employment_role: displayUser.employment_role,
                          employment_seniority: displayUser.employment_seniority,
                          company_domain: displayUser.company_domain,
                          company_description: displayUser.company_description,
                          company_industry: displayUser.company_industry,
                          company_sector: displayUser.company_sector,
                          company_employees: displayUser.company_employees,
                          company_revenue: displayUser.company_revenue,
                          company_logo: displayUser.company_logo,
                          company_founded: displayUser.company_founded,
                          company_location: displayUser.company_location,
                          company_tech_stack: displayUser.company_tech_stack,
                          
                          // People Data Labs
                          twitter_username: displayUser.twitter_username,
                          github_username: displayUser.github_username,
                          job_company_name: displayUser.job_company_name,
                          location_name: displayUser.location_name,
                          mobile_phone: displayUser.mobile_phone,
                          work_experience: displayUser.work_experience,
                          education: displayUser.education,
                          skills: displayUser.skills,
                          interests: displayUser.interests,
                          languages: displayUser.languages,
                          
                          // FullContact
                          age_range: displayUser.age_range,
                          gender: displayUser.gender,
                          location_general: displayUser.location_general,
                          household_income: displayUser.household_income,
                          instagram_url: displayUser.instagram_url,
                          youtube_url: displayUser.youtube_url,
                          
                          // RocketReach
                          rocketreach_id: displayUser.rocketreach_id,
                          alternative_emails: displayUser.alternative_emails,
                          current_employer: displayUser.current_employer,
                          
                          // Pipl
                          addresses: displayUser.addresses,
                          jobs_history: displayUser.jobs_history,
                          educations_history: displayUser.educations_history,
                          photos: displayUser.photos,
                          
                          // Lusha
                          lusha_phone_verified: displayUser.lusha_phone_verified,
                          lusha_emails: displayUser.lusha_emails,
                          
                          // Localização
                          city: displayUser.city,
                          state: displayUser.state,
                          country: displayUser.country,
                          
                          // Empresa
                          company_name: displayUser.company_name,
                          company_website: displayUser.company_website,
                          
                          // Busca Inteligente
                          linkedin_search_url: displayUser.linkedin_search_url,
                          google_search_url: displayUser.google_search_url,
                          
                          // Metadados de Enriquecimento
                          enrichment_status: displayUser.enrichment_status,
                          enriched_at: displayUser.enriched_at,
                          enrichment_score: displayUser.enrichment_score,
                          completeness: displayUser.completeness,
                          data_quality: displayUser.data_quality,
                          apis_used: displayUser.apis_used,
                          apis_total: displayUser.apis_total,
                          sources: displayUser.sources,
                          enrichment_details: displayUser.enrichment_details
                        }, null, 2)}</pre>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Estes são TODOS os dados retornados pelas APIs de enriquecimento. Campos vazios não foram encontrados.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer com Ações */}
        <div className="border-t bg-gray-50 p-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Fechar
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
          <Button variant="outline" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Mensagem
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}