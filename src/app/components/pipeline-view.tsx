import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Lead, LeadStatus } from '../types';
import { 
  Snowflake, 
  MessageSquare, 
  Flame, 
  ArrowRight, 
  Search, 
  ExternalLink, 
  Phone, 
  Mail, 
  Sparkles,
  Clock,
  Target,
  Zap,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { LeadFeedbackModal } from './lead-feedback-modal';

interface PipelineViewProps {
  leads: Lead[];
  onHandover: (leadId: string) => void;
}

export function PipelineView({ leads, onHandover }: PipelineViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [feedbackLead, setFeedbackLead] = useState<Lead | null>(null);

  const statusConfig: Record<LeadStatus, { 
    label: string; 
    icon: any; 
    color: string; 
    bgColor: string;
    borderColor: string;
    description: string;
  }> = {
    cold: {
      label: 'Frio',
      icon: Snowflake,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Primeiro contacto'
    },
    'in-conversation': {
      label: 'Em Conversa',
      icon: MessageSquare,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Diálogo ativo'
    },
    hot: {
      label: 'Qualificado',
      icon: Flame,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Pronto p/ humano'
    },
    handover: {
      label: 'Handover',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Entregue ao CRM'
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cluster.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const leadsByStatus = (status: LeadStatus) =>
    filteredLeads.filter((lead) => lead.status === status);

  const renderLeadCard = (lead: Lead, index: number) => {
    const StatusIcon = statusConfig[lead.status].icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
        key={lead.id}
      >
        <Card className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{lead.name}</h4>
              <p className="text-sm text-gray-600 truncate">{lead.jobTitle}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{lead.company}</p>
            </div>
            <Badge
              variant="outline"
              className={`ml-2 ${
                lead.score >= 80
                  ? 'bg-green-50 text-green-700 border-green-300'
                  : lead.score >= 60
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-gray-50 text-gray-700 border-gray-300'
              }`}
            >
              {lead.score}
            </Badge>
          </div>

          <Badge variant="secondary" className="mb-3 text-xs bg-gray-100 text-gray-700">
            {lead.cluster}
          </Badge>

          {lead.conversationSummary && (
            <div className="p-3 bg-gray-50 rounded-lg text-xs mb-3 border border-gray-200">
              <p className="text-gray-700 line-clamp-2">{lead.conversationSummary}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(lead.lastContact).toLocaleDateString('pt-PT')}</span>
          </div>

          <div className="flex items-center gap-2">
            {lead.profileUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs h-8"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                LinkedIn
              </Button>
            )}
            {lead.status === 'hot' && (
              <Button
                size="sm"
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs h-8"
                onClick={() => onHandover(lead.id)}
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                Handover
              </Button>
            )}
            {lead.status === 'handover' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8 border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => setFeedbackLead(lead)}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Dar Feedback
              </Button>
            )}
          </div>

          {(lead.phone || lead.email) && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
              {lead.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span>{lead.email}</span>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Minimalista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Pipeline de Aquecimento
            </h2>
            <p className="text-sm text-gray-600">
              {filteredLeads.length} leads em processo
            </p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80 h-10 border-gray-300 focus:border-gray-900"
          />
        </div>
      </div>

      {/* Pipeline Kanban Minimalista */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(Object.keys(statusConfig) as LeadStatus[]).map((status, columnIndex) => {
          const config = statusConfig[status];
          const StatusIcon = config.icon;
          const statusLeads = leadsByStatus(status);

          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1, duration: 0.2 }}
              className="space-y-3"
            >
              {/* Header da Coluna Minimalista */}
              <Card className={`p-4 border ${config.borderColor} ${config.bgColor}`}>
                <div className="flex items-center gap-3 mb-2">
                  <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{config.label}</h3>
                    <p className="text-xs text-gray-600">{config.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-gray-900">
                    {statusLeads.length}
                  </span>
                  <span className="text-xs text-gray-500">
                    {statusLeads.length === 1 ? 'lead' : 'leads'}
                  </span>
                </div>
              </Card>

              {/* Cards dos Leads */}
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-3 pr-3">
                  {statusLeads.length === 0 ? (
                    <Card className="p-8 border border-dashed border-gray-300 bg-gray-50/50">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                          <StatusIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Nenhum lead</p>
                      </div>
                    </Card>
                  ) : (
                    statusLeads.map((lead, index) => renderLeadCard(lead, index))
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          );
        })}
      </div>
      
      {/* Modal de Feedback */}
      {feedbackLead && (
        <LeadFeedbackModal
          isOpen={!!feedbackLead}
          onClose={() => setFeedbackLead(null)}
          lead={{
            id: feedbackLead.id,
            name: feedbackLead.name,
            score: feedbackLead.score
          }}
        />
      )}
    </div>
  );
}
