import { X, MapPin, Building2, Briefcase, Mail, Phone, Globe, LinkedinIcon, Star, Award, Calendar, TrendingUp, Users, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge-export';
import { Card } from './ui/card';
import { AvatarFallback } from './avatar-fallback';
import { formatFullName } from '../lib/string-utils';

interface LeadDetailsFullModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: () => void;
}

export function LeadDetailsFullModal({ lead, isOpen, onClose, onSelect }: LeadDetailsFullModalProps) {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-start gap-6">
            <div className="relative">
              <AvatarFallback 
                src={lead.avatar}
                name={formatFullName(lead.name)}
                size="xl"
                className="ring-4 ring-white/30 shadow-2xl w-24 h-24"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{formatFullName(lead.name)}</h2>
                <Badge className="bg-white/20 text-white border-white/30 text-base px-3 py-1">
                  {lead.matchScore}% Match
                </Badge>
              </div>
              <p className="text-lg text-white/90 mb-2">{lead.title}</p>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {lead.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {lead.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="p-4 border-2 border-blue-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-900">
                <Mail className="w-5 h-5" />
                Informações de Contato
              </h3>
              <div className="space-y-3">
                {lead.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                      {lead.email}
                    </a>
                  </div>
                )}
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                )}
                {lead.linkedinUrl && (
                  <div className="flex items-center gap-2">
                    <LinkedinIcon className="w-4 h-4 text-gray-500" />
                    <a 
                      href={lead.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      Ver perfil LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Professional Details */}
            <Card className="p-4 border-2 border-purple-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-900">
                <Briefcase className="w-5 h-5" />
                Detalhes Profissionais
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Indústria</p>
                  <p className="text-base text-gray-900">{lead.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Tamanho da Empresa</p>
                  <p className="text-base text-gray-900">{lead.companySize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Senioridade</p>
                  <Badge variant="outline" className="mt-1">
                    {lead.seniority}
                  </Badge>
                </div>
                {lead.yearsExperience > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Experiência</p>
                    <p className="text-base text-gray-900">{lead.yearsExperience} anos</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Skills */}
            {lead.skills && lead.skills.length > 0 && (
              <Card className="p-4 border-2 border-green-100 col-span-2">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-900">
                  <Award className="w-5 h-5" />
                  Habilidades ({lead.skills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lead.skills.map((skill: string, idx: number) => (
                    <Badge 
                      key={idx}
                      className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Activity */}
            {lead.recentActivity && (
              <Card className="p-4 border-2 border-orange-100 col-span-2">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-orange-900">
                  <TrendingUp className="w-5 h-5" />
                  Atividade Recente
                </h3>
                <p className="text-base text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  {lead.recentActivity}
                </p>
              </Card>
            )}

            {/* Status Badges */}
            <Card className="p-4 border-2 border-gray-100 col-span-2">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-900">
                <Target className="w-5 h-5" />
                Status e Fonte
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Source Badge */}
                {lead.source === 'demo' && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-base px-3 py-1">
                    🧪 Dados DEMO
                  </Badge>
                )}
                {lead.source === 'apollo' && (
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-base px-3 py-1">
                    🚀 Apollo.io
                  </Badge>
                )}
                {lead.source === 'linkedin' && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base px-3 py-1">
                    🔵 LinkedIn
                  </Badge>
                )}
                {lead.source === 'hunter' && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-base px-3 py-1">
                    🎯 Hunter.io
                  </Badge>
                )}
                {lead.source === 'pdl' && (
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-base px-3 py-1">
                    📊 People Data Labs
                  </Badge>
                )}
                {lead.source === 'rocketreach' && (
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white text-base px-3 py-1">
                    🚀 RocketReach
                  </Badge>
                )}

                {/* Open to Work */}
                {lead.openToWork && (
                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-base px-3 py-1">
                    ✅ Aberto a Oportunidades
                  </Badge>
                )}

                {/* Match Score */}
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-base px-3 py-1">
                  ⭐ {lead.matchScore}% de Compatibilidade
                </Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-2"
          >
            Fechar
          </Button>
          <div className="flex gap-3">
            {lead.email && (
              <Button
                variant="outline"
                onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
            )}
            {onSelect && (
              <Button
                onClick={() => {
                  onSelect();
                  onClose();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Target className="w-4 h-4 mr-2" />
                Selecionar Lead
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}