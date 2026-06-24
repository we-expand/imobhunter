import { X, Mail, Phone, MapPin, Briefcase, Calendar, Clock, Linkedin, Twitter, Facebook, Github, Building2, Globe, Award, ExternalLink, DollarSign, Activity, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface UserEnrichmentModalProps {
  user: any;
  enrichedUser: any | null;
  isEnriching: boolean;
  activities: any[];
  onClose: () => void;
}

export function UserEnrichmentModal({
  user,
  enrichedUser,
  isEnriching,
  activities,
  onClose
}: UserEnrichmentModalProps) {
  const displayUser = enrichedUser || user;
  const hasEnrichedData = enrichedUser && enrichedUser.enrichment_status === 'completed';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header do Modal */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-4">
            {displayUser.photo_url || displayUser.avatar ? (
              <img
                src={displayUser.photo_url || displayUser.avatar}
                alt={displayUser.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-bold">
                  {displayUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold">
                {displayUser.full_name || displayUser.name}
              </h3>
              <p className="text-white/90 text-sm">{displayUser.email}</p>
              {displayUser.job_title && (
                <p className="text-white/80 text-sm mt-1">
                  {displayUser.job_title}
                  {displayUser.company_name && ` @ ${displayUser.company_name}`}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/40"
                >
                  {displayUser.plan.toUpperCase()}
                </Badge>
                {hasEnrichedData && (
                  <Badge
                    variant="secondary"
                    className="bg-green-500/90 text-white border-green-400"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Dados Enriquecidos • {displayUser.enrichment_score}%
                  </Badge>
                )}
                {isEnriching && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500/90 text-white border-yellow-400"
                  >
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Coletando dados...
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Loading State */}
        {isEnriching && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-6 m-6 rounded-lg">
            <div className="flex items-center gap-4">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <h4 className="font-bold text-blue-900">
                  🔍 Coletando dados pela internet...
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  Buscando em Hunter.io, Apollo.io, Clearbit e outras fontes.
                  Isso pode levar alguns segundos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo do Modal */}
        <div className="p-6 space-y-6">
          {/* Row 1: Métricas + Localização */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Métricas da Plataforma */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Métricas da Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-600">{displayUser.total_leads}</p>
                    <p className="text-xs text-gray-600 mt-1">Leads</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-600">{displayUser.messages_sent}</p>
                    <p className="text-xs text-gray-600 mt-1">Mensagens</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">{displayUser.searches}</p>
                    <p className="text-xs text-gray-600 mt-1">Buscas</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">MRR</span>
                    <span className="font-bold text-green-600">
                      €{displayUser.mrr.toLocaleString()}/mês
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localização e Contato */}
            <Card>
              <CardHeader>
                <CardTitle>📍 Localização & Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {displayUser.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Localização</p>
                      <p className="font-medium">
                        {displayUser.city}
                        {displayUser.state && `, ${displayUser.state}`}
                        {displayUser.country && ` - ${displayUser.country}`}
                      </p>
                    </div>
                  </div>
                )}
                {displayUser.phone_numbers && displayUser.phone_numbers.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Telefones</p>
                      {displayUser.phone_numbers.map((phone: string, idx: number) => (
                        <p key={idx} className="font-medium">{phone}</p>
                      ))}
                    </div>
                  </div>
                )}
                {displayUser.email_verified !== undefined && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Status do Email</p>
                      <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                  </div>
                )}
                {!displayUser.city && !displayUser.phone_numbers && displayUser.email_verified === undefined && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum dado de localização disponível
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Informações Profissionais + Empresa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Profissionais */}
            <Card>
              <CardHeader>
                <CardTitle>💼 Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayUser.job_title && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Cargo</p>
                      <p className="font-medium">{displayUser.job_title}</p>
                    </div>
                  </div>
                )}
                {displayUser.seniority && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Senioridade</p>
                      <p className="font-medium capitalize">{displayUser.seniority}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
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
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500">Último login</p>
                    <p className="font-medium">
                      {new Date(displayUser.last_login).toLocaleString('pt-PT')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle>🏢 Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayUser.company_name ? (
                  <>
                    {displayUser.company_logo && (
                      <div className="flex justify-center">
                        <img
                          src={displayUser.company_logo}
                          alt={displayUser.company_name}
                          className="h-12 object-contain"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Nome da Empresa</p>
                        <p className="font-medium">{displayUser.company_name}</p>
                      </div>
                    </div>
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
                    {displayUser.company_industry && (
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Indústria</p>
                          <p className="font-medium">{displayUser.company_industry}</p>
                        </div>
                      </div>
                    )}
                    {displayUser.company_employees && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-500">Funcionários</p>
                          <p className="font-medium">
                            {displayUser.company_employees.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {displayUser.company_description && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-1">Descrição</p>
                        <p className="text-sm text-gray-700">{displayUser.company_description}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum dado da empresa disponível
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Row 3: Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle>🌐 Redes Sociais & Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayUser.linkedin_url ? (
                  <a
                    href={displayUser.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">LinkedIn</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                  </a>
                ) : displayUser.linkedin_search_url ? (
                  <a
                    href={displayUser.linkedin_search_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">Buscar no LinkedIn</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                  </a>
                ) : null}

                {displayUser.twitter_url && (
                  <a
                    href={displayUser.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-sky-600" />
                    <span className="text-sm font-medium">Twitter</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                  </a>
                )}

                {displayUser.facebook_url && (
                  <a
                    href={displayUser.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium">Facebook</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                  </a>
                )}

                {displayUser.github_url && (
                  <a
                    href={displayUser.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Github className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">GitHub</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                  </a>
                )}
              </div>
              {!displayUser.linkedin_url && !displayUser.twitter_url && !displayUser.facebook_url && !displayUser.github_url && !displayUser.linkedin_search_url && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma rede social encontrada
                </p>
              )}
            </CardContent>
          </Card>

          {/* Row 4: Bio */}
          {displayUser.bio && (
            <Card>
              <CardHeader>
                <CardTitle>📝 Biografia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{displayUser.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Row 5: Atividades */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Atividades Recentes</CardTitle>
              <CardDescription>Últimas ações deste usuário na plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activities
                  .filter(act => act.user_id === displayUser.id)
                  .slice(0, 10)
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded"
                    >
                      <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString('pt-PT')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                {activities.filter(act => act.user_id === displayUser.id).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma atividade registrada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fontes de Dados */}
          {hasEnrichedData && displayUser.sources && displayUser.sources.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Dados coletados de {displayUser.sources.length} fonte(s)
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {displayUser.sources.join(', ')} • 
                    Enriquecido em {new Date(displayUser.enriched_at).toLocaleString('pt-PT')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Fechar
            </Button>
            <Button className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Enviar Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}