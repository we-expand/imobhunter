import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Calendar,
  TrendingUp,
  Award,
  DollarSign,
  Activity,
  Clock,
  Target,
  Users,
  Star,
  ExternalLink,
  Sparkles,
  Database
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);

  // Simula enriquecimento de dados via APIs
  const enrichUserData = async () => {
    setIsEnriching(true);
    
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: '🔍 Enriquecendo dados via Apollo + Clearbit + Hunter...',
        success: '✨ Dados enriquecidos com sucesso!',
        error: 'Erro ao enriquecer dados'
      }
    );

    // Simula resposta de APIs de enriquecimento
    setTimeout(() => {
      setEnrichedData({
        // Apollo.io data
        apollo: {
          title: 'Senior Real Estate Consultant',
          seniority: 'Senior',
          department: 'Sales',
          employeeCount: '50-200',
          revenue: '€5M - €10M',
          industry: 'Real Estate',
          technologies: ['Salesforce', 'HubSpot', 'LinkedIn Sales Navigator']
        },
        
        // Clearbit data
        clearbit: {
          linkedin: `https://linkedin.com/in/${user.name.toLowerCase().replace(' ', '-')}`,
          twitter: `@${user.name.split(' ')[0].toLowerCase()}`,
          facebook: user.name,
          location: {
            city: 'Lisboa',
            country: 'Portugal',
            coordinates: '38.7223° N, 9.1393° W'
          },
          timezone: 'Europe/Lisbon',
          company: {
            name: 'Keller Williams Portugal',
            domain: 'kwportugal.pt',
            founded: 2015,
            employees: 150,
            tags: ['Real Estate', 'B2C', 'SaaS']
          }
        },
        
        // Hunter.io data
        hunter: {
          emailScore: 95,
          phoneVerified: true,
          emailType: 'professional',
          sources: ['LinkedIn', 'Company Website', 'Professional Networks']
        },

        // Enriquecimento adicional
        engagement: {
          emailOpenRate: 68,
          emailClickRate: 24,
          responseRate: 12,
          lastEngagement: new Date(Date.now() - 172800000), // 2 dias atrás
          averageResponseTime: '4h 23m',
          bestTimeToContact: '10:00 - 12:00 (Terça/Quinta)'
        },

        behavioral: {
          interests: ['Luxury Real Estate', 'Investment Properties', 'Relocation Services'],
          contentPreferences: ['Market Reports', 'Property Listings', 'Investment Guides'],
          activeChannels: ['Email', 'LinkedIn', 'WhatsApp'],
          deviceUsage: { mobile: 65, desktop: 35 }
        },

        social: {
          linkedinConnections: 2400,
          linkedinEngagement: 'High',
          twitterFollowers: 890,
          instagramFollowers: 1200
        }
      });
      
      setIsEnriching(false);
    }, 2000);
  };

  useEffect(() => {
    // Auto-enrich ao abrir modal
    enrichUserData();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {user.plan === 'enterprise' && (
                    <Badge className="bg-purple-600 border-purple-400">👑 Enterprise</Badge>
                  )}
                  {user.plan === 'pro' && (
                    <Badge className="bg-blue-600 border-blue-400">✨ Pro</Badge>
                  )}
                  {user.plan === 'free' && (
                    <Badge variant="outline" className="bg-white/20 border-white/40 text-white">Free</Badge>
                  )}
                  
                  {user.status === 'online' && (
                    <Badge className="bg-green-500 border-green-400">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                      Online Agora
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isEnriching ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Enriquecendo dados de múltiplas fontes...</p>
              <p className="text-sm text-gray-500 mt-2">Apollo.io • Clearbit • Hunter.io • LinkedIn</p>
            </div>
          ) : enrichedData ? (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Leads</p>
                        <p className="text-2xl font-bold text-blue-600">{user.totalLeads}</p>
                      </div>
                      <Target className="w-8 h-8 text-blue-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Mensagens</p>
                        <p className="text-2xl font-bold text-green-600">{user.messagesSent}</p>
                      </div>
                      <Mail className="w-8 h-8 text-green-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">MRR</p>
                        <p className="text-2xl font-bold text-purple-600">€{user.mrr}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Membro há</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))}d
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-orange-600 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Professional Info (Apollo) */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-600" />
                      Dados Profissionais
                      <Badge variant="outline" className="text-xs">Apollo.io</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Cargo</p>
                        <p className="font-medium">{enrichedData.apollo.title}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Senioridade</p>
                        <Badge className="bg-blue-600">{enrichedData.apollo.seniority}</Badge>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Departamento</p>
                        <p className="font-medium">{enrichedData.apollo.department}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Tamanho da Empresa</p>
                        <p className="font-medium">{enrichedData.apollo.employeeCount} funcionários</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Receita Estimada</p>
                        <p className="font-medium">{enrichedData.apollo.revenue}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600 mb-2">Tecnologias Usadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {enrichedData.apollo.technologies.map((tech: string) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company & Location (Clearbit) */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-600" />
                      Empresa & Localização
                      <Badge variant="outline" className="text-xs">Clearbit</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Empresa</p>
                        <p className="font-medium">{enrichedData.clearbit.company.name}</p>
                        <p className="text-xs text-gray-500">{enrichedData.clearbit.company.domain}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Fundada em</p>
                        <p className="font-medium">{enrichedData.clearbit.company.founded}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Funcionários</p>
                        <p className="font-medium">{enrichedData.clearbit.company.employees} pessoas</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Localização</p>
                        <p className="font-medium">
                          {enrichedData.clearbit.location.city}, {enrichedData.clearbit.location.country}
                        </p>
                        <p className="text-xs text-gray-500">{enrichedData.clearbit.location.coordinates}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600 mb-2">Tags da Empresa:</p>
                      <div className="flex flex-wrap gap-2">
                        {enrichedData.clearbit.company.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email & Phone Validation (Hunter) */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-orange-600" />
                      Validação de Contatos
                      <Badge variant="outline" className="text-xs">Hunter.io</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Email Score</p>
                        <p className="text-xs text-gray-600">Confiabilidade do email</p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {enrichedData.hunter.emailScore}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Telefone Verificado</p>
                        <p className="text-xs text-gray-600">Validado via SMS</p>
                      </div>
                      {enrichedData.hunter.phoneVerified ? (
                        <Badge className="bg-green-600">✓ Verificado</Badge>
                      ) : (
                        <Badge variant="outline">Não verificado</Badge>
                      )}
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600 mb-2">Fontes de Validação:</p>
                      <div className="space-y-1">
                        {enrichedData.hunter.sources.map((source: string) => (
                          <div key={source} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                            {source}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement Metrics */}
                <Card>
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Métricas de Engajamento
                      <Badge variant="outline" className="text-xs">Plataforma</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Taxa de Abertura</span>
                        <span className="font-bold text-green-600">{enrichedData.engagement.emailOpenRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${enrichedData.engagement.emailOpenRate}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Taxa de Cliques</span>
                        <span className="font-bold text-blue-600">{enrichedData.engagement.emailClickRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${enrichedData.engagement.emailClickRate}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Taxa de Resposta</span>
                        <span className="font-bold text-purple-600">{enrichedData.engagement.responseRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${enrichedData.engagement.responseRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Tempo Médio de Resposta:</span>
                        <span className="font-medium">{enrichedData.engagement.averageResponseTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-600">Melhor Horário:</span>
                        <span className="font-medium">{enrichedData.engagement.bestTimeToContact}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Profiles */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    Perfis Sociais & Interesses
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-3">Redes Sociais:</p>
                      <div className="space-y-2">
                        <a 
                          href={enrichedData.clearbit.linkedin}
                          target="_blank"
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Linkedin className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium">LinkedIn</p>
                              <p className="text-xs text-gray-500">{enrichedData.social.linkedinConnections} conexões</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Twitter className="w-5 h-5 text-sky-500" />
                            <div>
                              <p className="font-medium">{enrichedData.clearbit.twitter}</p>
                              <p className="text-xs text-gray-500">{enrichedData.social.twitterFollowers} seguidores</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Instagram className="w-5 h-5 text-pink-600" />
                            <div>
                              <p className="font-medium">@{enrichedData.clearbit.facebook.toLowerCase().replace(' ', '')}</p>
                              <p className="text-xs text-gray-500">{enrichedData.social.instagramFollowers} seguidores</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-3">Interesses & Preferências:</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Tópicos de Interesse:</p>
                          <div className="flex flex-wrap gap-2">
                            {enrichedData.behavioral.interests.map((interest: string) => (
                              <Badge key={interest} variant="outline" className="bg-blue-50 border-blue-200">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-2">Conteúdo Preferido:</p>
                          <div className="flex flex-wrap gap-2">
                            {enrichedData.behavioral.contentPreferences.map((pref: string) => (
                              <Badge key={pref} variant="outline" className="bg-purple-50 border-purple-200">
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-2">Canais Ativos:</p>
                          <div className="flex flex-wrap gap-2">
                            {enrichedData.behavioral.activeChannels.map((channel: string) => (
                              <Badge key={channel} className="bg-green-600">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={enrichUserData}
                  className="gap-2"
                  disabled={isEnriching}
                >
                  <Sparkles className="w-4 h-4" />
                  Re-Enriquecer Dados
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Enviar Email
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Ver no CRM
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
