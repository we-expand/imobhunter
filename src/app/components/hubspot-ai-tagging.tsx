import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Bot, 
  Tag, 
  CheckCircle, 
  Sparkles,
  Eye,
  Copy,
  ExternalLink,
  Settings,
  Zap,
  Clock,
  User,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function HubSpotAITagging() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('📋 Copiado!');
  };

  return (
    <div className="space-y-6">
      {/* Explicação */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Como Identificar Leads da IA no HubSpot
          </CardTitle>
          <CardDescription>
            Todos os leads gerados pela IA são automaticamente marcados com tags e propriedades customizadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
            <p className="text-sm text-gray-700 mb-3">
              <strong>🎯 Identificação Automática:</strong> Cada lead criado pela AI LeadGen Pro recebe automaticamente:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Tag className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Tag:</strong> "AI-Generated" (visível na lista de contatos)</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span><strong>Propriedade customizada:</strong> "Lead Source" = "AI LeadGen Pro"</span>
              </li>
              <li className="flex items-start gap-2">
                <Bot className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Campo customizado:</strong> "AI Agent Name" (nome da personalidade da IA)</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <span><strong>Timestamp:</strong> "AI First Contact Date" (data do primeiro contato)</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Propriedades Customizadas do HubSpot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Propriedades Customizadas no HubSpot
          </CardTitle>
          <CardDescription>
            Configure estas propriedades no HubSpot para rastreamento completo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Propriedade 1 */}
          <div className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Lead Source</p>
                  <p className="text-xs text-gray-500">Propriedade padrão do HubSpot</p>
                </div>
              </div>
              <Badge className="bg-blue-600">Automático</Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              lead_source = "AI LeadGen Pro"
            </div>
            <div className="mt-2 flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard('AI LeadGen Pro')}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copiar Valor
              </Button>
            </div>
          </div>

          {/* Propriedade 2 */}
          <div className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">AI Agent Name</p>
                  <p className="text-xs text-gray-500">Propriedade customizada (criar no HubSpot)</p>
                </div>
              </div>
              <Badge className="bg-purple-600">Customizado</Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              ai_agent_name = "Sofia - Investidores"
            </div>
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-600">
                <strong>Como criar:</strong> HubSpot → Settings → Properties → Create Property
              </p>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <p><strong>Internal Name:</strong> ai_agent_name</p>
                <p><strong>Label:</strong> AI Agent Name</p>
                <p><strong>Type:</strong> Single-line text</p>
                <p><strong>Group:</strong> Contact Information</p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard('ai_agent_name')}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copiar Nome Interno
              </Button>
            </div>
          </div>

          {/* Propriedade 3 */}
          <div className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">AI Campaign Cluster</p>
                  <p className="text-xs text-gray-500">Cluster de segmentação (Investidores, High-End...)</p>
                </div>
              </div>
              <Badge className="bg-green-600">Customizado</Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              ai_campaign_cluster = "Investidores"
            </div>
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-600">
                <strong>Valores possíveis:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Investidores</Badge>
                <Badge variant="outline">High-End/Executivos</Badge>
                <Badge variant="outline">Parcerias/Relocation</Badge>
                <Badge variant="outline">1ª Habitação</Badge>
                <Badge variant="outline">Famílias/Upgrade</Badge>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs mt-2">
                <p><strong>Internal Name:</strong> ai_campaign_cluster</p>
                <p><strong>Label:</strong> AI Campaign Cluster</p>
                <p><strong>Type:</strong> Dropdown select</p>
                <p><strong>Options:</strong> Investidores, High-End/Executivos, Parcerias/Relocation, 1ª Habitação, Famílias/Upgrade</p>
              </div>
            </div>
          </div>

          {/* Propriedade 4 */}
          <div className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">AI First Contact Date</p>
                  <p className="text-xs text-gray-500">Data do primeiro contato da IA</p>
                </div>
              </div>
              <Badge className="bg-orange-600">Customizado</Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              ai_first_contact_date = "2025-12-12T10:30:00Z"
            </div>
            <div className="mt-2 space-y-2">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <p><strong>Internal Name:</strong> ai_first_contact_date</p>
                <p><strong>Label:</strong> AI First Contact Date</p>
                <p><strong>Type:</strong> Date picker</p>
              </div>
            </div>
          </div>

          {/* Propriedade 5 */}
          <div className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium">AI Engagement Score</p>
                  <p className="text-xs text-gray-500">Score de engajamento com a IA (0-100)</p>
                </div>
              </div>
              <Badge className="bg-pink-600">Customizado</Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              ai_engagement_score = 85
            </div>
            <div className="mt-2 space-y-2">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <p><strong>Internal Name:</strong> ai_engagement_score</p>
                <p><strong>Label:</strong> AI Engagement Score</p>
                <p><strong>Type:</strong> Number</p>
                <p><strong>Format:</strong> Unformatted number (0-100)</p>
              </div>
            </div>
          </div>

          {/* Propriedade 6 */}
          <div className="p-4 border rounded-lg hover:border-purple-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">AI Last Channel</p>
                  <p className="text-xs text-gray-500">Último canal usado pela IA</p>
                </div>
              </div>
              <Badge className="bg-indigo-600">Customizado</Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded font-mono text-sm">
              ai_last_channel = "WhatsApp"
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Email</Badge>
                <Badge variant="outline">SMS</Badge>
                <Badge variant="outline">WhatsApp</Badge>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs mt-2">
                <p><strong>Internal Name:</strong> ai_last_channel</p>
                <p><strong>Label:</strong> AI Last Channel</p>
                <p><strong>Type:</strong> Dropdown select</p>
                <p><strong>Options:</strong> Email, SMS, WhatsApp</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exemplo Visual no HubSpot */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            Como Aparece no HubSpot
          </CardTitle>
          <CardDescription>
            Exemplo visual de um lead gerado pela IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Simulação de card do HubSpot */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
            {/* Header do contato */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  JS
                </div>
                <div>
                  <h3 className="text-xl font-bold">João Silva</h3>
                  <p className="text-gray-600">joao.silva@investimentos.pt</p>
                  <p className="text-gray-600">+351 912 345 678</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                <Badge className="bg-purple-600 gap-1">
                  <Bot className="w-3 h-3" />
                  AI-Generated
                </Badge>
                <Badge className="bg-blue-600">Investidores</Badge>
                <Badge className="bg-green-600">Qualificado</Badge>
              </div>
            </div>

            {/* Propriedades */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">Lead Source</p>
                <p className="font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  AI LeadGen Pro
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">AI Agent Name</p>
                <p className="font-medium flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  Sofia - Investidores
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">AI Campaign Cluster</p>
                <p className="font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  Investidores
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">AI First Contact</p>
                <p className="font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  12/12/2025 10:30
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">AI Engagement Score</p>
                <p className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-pink-600" />
                  85/100
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">AI Last Channel</p>
                <p className="font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  WhatsApp
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeline da IA
              </h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Handover para Humano</p>
                    <p className="text-xs text-gray-500">12/12/2025 15:45 • Lead qualificado e pronto</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mensagem WhatsApp (Follow-up)</p>
                    <p className="text-xs text-gray-500">12/12/2025 14:30 • Respondeu positivamente</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email Aberto (Primeiro Contato)</p>
                    <p className="text-xs text-gray-500">12/12/2025 10:30 • Taxa de abertura: 2 minutos</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lead Criado pela IA</p>
                    <p className="text-xs text-gray-500">12/12/2025 10:15 • Encontrado via Apollo.io</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros no HubSpot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Filtros Recomendados no HubSpot
          </CardTitle>
          <CardDescription>
            Crie estas views salvas para acessar rapidamente os leads da IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">📊 Todos os Leads da IA</p>
              <Button size="sm" variant="outline">
                <Copy className="w-3 h-3 mr-1" />
                Copiar Filtro
              </Button>
            </div>
            <div className="p-2 bg-gray-50 rounded font-mono text-xs">
              Lead Source = "AI LeadGen Pro"
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">🔥 Leads Quentes da IA (Score &gt; 70)</p>
              <Button size="sm" variant="outline">
                <Copy className="w-3 h-3 mr-1" />
                Copiar Filtro
              </Button>
            </div>
            <div className="p-2 bg-gray-50 rounded font-mono text-xs">
              Lead Source = "AI LeadGen Pro" AND AI Engagement Score &gt; 70
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">💎 Investidores da IA</p>
              <Button size="sm" variant="outline">
                <Copy className="w-3 h-3 mr-1" />
                Copiar Filtro
              </Button>
            </div>
            <div className="p-2 bg-gray-50 rounded font-mono text-xs">
              Lead Source = "AI LeadGen Pro" AND AI Campaign Cluster = "Investidores"
            </div>
          </div>

          <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">📅 Leads da IA (Últimos 7 dias)</p>
              <Button size="sm" variant="outline">
                <Copy className="w-3 h-3 mr-1" />
                Copiar Filtro
              </Button>
            </div>
            <div className="p-2 bg-gray-50 rounded font-mono text-xs">
              Lead Source = "AI LeadGen Pro" AND AI First Contact Date is in last 7 days
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Link para HubSpot */}
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="gap-2"
          onClick={() => window.open('https://app.hubspot.com/contacts', '_blank')}
        >
          <ExternalLink className="w-5 h-5" />
          Abrir HubSpot
        </Button>
      </div>
    </div>
  );
}
