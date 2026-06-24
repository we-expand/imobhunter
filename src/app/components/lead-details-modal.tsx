import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building2, 
  Linkedin, 
  Globe, 
  Calendar,
  DollarSign,
  Target,
  TrendingUp,
  MessageSquare,
  X,
  ExternalLink,
  Star,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: any;
}

export function LeadDetailsModal({ isOpen, onClose, lead }: LeadDetailsModalProps) {
  if (!lead) return null;

  // Extrai dados de múltiplas fontes (enriquecido pelas APIs)
  const enrichmentData = lead.enrichmentData || {};
  const apolloData = enrichmentData.apollo || {};
  const hunterData = enrichmentData.hunter || {};
  const linkedinData = enrichmentData.linkedin || {};
  const lushaData = enrichmentData.lusha || {};

  // Dados consolidados
  const email = lead.email || hunterData.email || apolloData.email;
  const phone = lead.phone || lushaData.phone || apolloData.phone;
  const company = lead.company || apolloData.company?.name || linkedinData.company;
  const title = lead.title || apolloData.title || linkedinData.headline;
  const location = lead.location || apolloData.city || linkedinData.location;
  const linkedinUrl = lead.linkedinUrl || linkedinData.url || apolloData.linkedin_url;
  const website = apolloData.company?.website_url;
  
  // Score de confiança
  const confidenceScore = lead.confidenceScore || enrichmentData.confidenceScore || 0;
  
  // Fontes que confirmaram
  const sources = enrichmentData.sources || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {lead.name?.charAt(0).toUpperCase() || 'L'}
              </div>
              
              <div>
                <DialogTitle className="text-2xl mb-2">{lead.name}</DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  {title && (
                    <Badge variant="outline" className="gap-1">
                      <Briefcase className="w-3 h-3" />
                      {title}
                    </Badge>
                  )}
                  {company && (
                    <Badge variant="outline" className="gap-1">
                      <Building2 className="w-3 h-3" />
                      {company}
                    </Badge>
                  )}
                  {lead.cluster && (
                    <Badge className="bg-purple-600">
                      {lead.cluster}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Score de Confiança */}
        {confidenceScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Score de Confiança</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-700">{Math.round(confidenceScore * 100)}%</div>
                <div className="text-sm text-green-600">
                  {sources.length > 0 && `(${sources.length} fonte${sources.length > 1 ? 's' : ''})`}
                </div>
              </div>
            </div>
            
            {/* Fontes */}
            {sources.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Confirmado por:</span>
                {sources.map((source: string) => (
                  <Badge key={source} variant="outline" className="text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                    {source}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <Tabs defaultValue="contact" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="professional">Profissional</TabsTrigger>
            <TabsTrigger value="enrichment">Enriquecimento</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          {/* ABA: Contato */}
          <TabsContent value="contact" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              {email && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a 
                      href={`mailto:${email}`}
                      className="font-medium text-blue-700 hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              )}

              {/* Telefone */}
              {phone && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Telefone</p>
                    <a 
                      href={`tel:${phone}`}
                      className="font-medium text-green-700 hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {linkedinUrl && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Linkedin className="w-5 h-5 text-blue-700 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">LinkedIn</p>
                    <a 
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-700 hover:underline flex items-center gap-1"
                    >
                      Ver Perfil
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Localização */}
              {location && (
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Localização</p>
                    <p className="font-medium text-purple-700">{location}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ABA: Profissional */}
          <TabsContent value="professional" className="space-y-4">
            <div className="space-y-4">
              {/* Cargo */}
              {title && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Cargo</span>
                  </div>
                  <p className="font-medium">{title}</p>
                </div>
              )}

              {/* Empresa */}
              {company && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Empresa</span>
                  </div>
                  <p className="font-medium">{company}</p>
                  {website && (
                    <a 
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                    >
                      <Globe className="w-3 h-3" />
                      {website}
                    </a>
                  )}
                </div>
              )}

              {/* Senioridade */}
              {apolloData.seniority && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Senioridade</span>
                  </div>
                  <p className="font-medium">{apolloData.seniority}</p>
                </div>
              )}

              {/* Indústria */}
              {apolloData.company?.industry && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Indústria</span>
                  </div>
                  <p className="font-medium">{apolloData.company.industry}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ABA: Enriquecimento */}
          <TabsContent value="enrichment" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Apollo.io */}
              {apolloData && Object.keys(apolloData).length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-semibold">Apollo.io</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {apolloData.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{apolloData.email}</span>
                      </div>
                    )}
                    {apolloData.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefone:</span>
                        <span className="font-medium">{apolloData.phone}</span>
                      </div>
                    )}
                    {apolloData.title && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cargo:</span>
                        <span className="font-medium">{apolloData.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Hunter.io */}
              {hunterData && Object.keys(hunterData).length > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <span className="font-semibold">Hunter.io</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {hunterData.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{hunterData.email}</span>
                      </div>
                    )}
                    {hunterData.score && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score:</span>
                        <span className="font-medium">{hunterData.score}/100</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lusha */}
              {lushaData && Object.keys(lushaData).length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <span className="font-semibold">Lusha</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {lushaData.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefone:</span>
                        <span className="font-medium">{lushaData.phone}</span>
                      </div>
                    )}
                    {lushaData.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{lushaData.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {linkedinData && Object.keys(linkedinData).length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Linkedin className="w-8 h-8 text-blue-700" />
                    <span className="font-semibold">LinkedIn</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {linkedinData.headline && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Headline:</span>
                        <span className="font-medium">{linkedinData.headline}</span>
                      </div>
                    )}
                    {linkedinData.connections && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conexões:</span>
                        <span className="font-medium">{linkedinData.connections}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamp de enriquecimento */}
            {enrichmentData.timestamp && (
              <div className="p-3 bg-gray-100 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Enriquecido em: {new Date(enrichmentData.timestamp).toLocaleString('pt-PT')}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ABA: Atividade */}
          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-3">
              {/* Score do Lead */}
              {lead.score && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold">Score do Lead</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">{lead.score}</div>
                  </div>
                </div>
              )}

              {/* Status */}
              {lead.status && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <Badge className="capitalize">{lead.status}</Badge>
                </div>
              )}

              {/* Canal */}
              {lead.channel && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Canal de Comunicação</span>
                  </div>
                  <Badge variant="outline" className="capitalize">{lead.channel}</Badge>
                </div>
              )}

              {/* Data de criação */}
              {lead.createdAt && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Adicionado em</span>
                  </div>
                  <p className="font-medium">
                    {new Date(lead.createdAt).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Phone className="w-4 h-4 mr-2" />
            Ligar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
