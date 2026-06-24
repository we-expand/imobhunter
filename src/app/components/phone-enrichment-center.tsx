import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { PhoneValidator } from './phone-validator';
import { PhoneEnrichmentWidget } from './phone-enrichment-widget';
import { Lead } from '../types';
import { 
  Search, 
  Phone, 
  Sparkles,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Zap,
  Users
} from 'lucide-react';

interface PhoneEnrichmentCenterProps {
  leads: Lead[];
}

export function PhoneEnrichmentCenter({ leads }: PhoneEnrichmentCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categoriza leads por status de telefone
  const leadsWithPhone = leads.filter(l => l.phone);
  const leadsWithoutPhone = leads.filter(l => !l.phone);
  
  // Simula validação de telefones existentes
  const hotPhones = Math.floor(leadsWithPhone.length * 0.6);
  const warmPhones = Math.floor(leadsWithPhone.length * 0.3);
  const coldPhones = leadsWithPhone.length - hotPhones - warmPhones;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">🤖 Centro de Validação IA</h1>
          <p className="text-gray-600">
            Busca e valida telefones em 9 fontes automaticamente
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white gap-2 px-4 py-2">
          <Sparkles className="w-4 h-4" />
          Multi-Source AI
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <Badge variant="outline" className="bg-white">Total</Badge>
          </div>
          <p className="text-3xl font-bold text-blue-900">{leads.length}</p>
          <p className="text-sm text-blue-700">Total de Leads</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <Badge variant="outline" className="bg-white">🔥 Hot</Badge>
          </div>
          <p className="text-3xl font-bold text-green-900">{hotPhones}</p>
          <p className="text-sm text-green-700">Números Validados (Alta)</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <Badge variant="outline" className="bg-white">⚠️ Warm</Badge>
          </div>
          <p className="text-3xl font-bold text-yellow-900">{warmPhones}</p>
          <p className="text-sm text-yellow-700">Números Validados (Média)</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-600" />
            <Badge variant="outline" className="bg-white">❄️ Cold</Badge>
          </div>
          <p className="text-3xl font-bold text-red-900">{leadsWithoutPhone.length}</p>
          <p className="text-sm text-red-700">Sem Telefone</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Widget Overview */}
        <div>
          <PhoneEnrichmentWidget leads={leads} />
        </div>

        {/* Right: Lead Selection */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Selecionar Lead para Validar</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedLead?.id === lead.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.jobTitle}</p>
                    <p className="text-sm text-gray-500">{lead.company}</p>
                    {lead.email && (
                      <p className="text-xs text-gray-500 mt-1">{lead.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={lead.phone ? 'default' : 'secondary'}
                      className={lead.phone ? 'bg-green-500' : ''}
                    >
                      {lead.phone ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {lead.phone ? 'Com Tel' : 'Sem Tel'}
                    </Badge>
                    {lead.phone && (
                      <p className="text-xs text-gray-500 mt-1">{lead.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum lead encontrado</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Phone Validator */}
      {selectedLead ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <PhoneValidator
            leadName={selectedLead.name}
            leadEmail={selectedLead.email}
            leadCompany={selectedLead.company}
            leadLinkedIn={selectedLead.profileUrl}
            existingPhone={selectedLead.phone}
            onPhoneSelected={(phone) => {
              console.log(`✅ Telefone ${phone} selecionado para ${selectedLead.name}`);
              // Em produção, atualizar no storage
            }}
          />
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Selecione um Lead para Começar
          </h3>
          <p className="text-gray-600 mb-6">
            Escolha um lead na lista acima para validar o telefone com IA
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="w-3 h-3" />
              9 Fontes de Dados
            </Badge>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="w-3 h-3" />
              Score de Confiança IA
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Zap className="w-3 h-3" />
              Validação Instantânea
            </Badge>
          </div>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Como Funciona
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>1. Selecione um lead</li>
            <li>2. IA busca em 9 fontes</li>
            <li>3. Analisa confiabilidade</li>
            <li>4. Entrega números validados</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Fontes de Dados
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Apollo.io</li>
            <li>• LinkedIn Sales Nav</li>
            <li>• Hunter.io</li>
            <li>• WhatsApp Business</li>
            <li>• +5 fontes</li>
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Score de Confiança
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>🔥 80-100%: HOT (Contacte!)</li>
            <li>⚠️ 60-79%: WARM (Validar)</li>
            <li>❄️ 0-59%: COLD (Mais dados)</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
