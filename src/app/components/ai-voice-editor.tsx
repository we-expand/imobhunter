import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles, 
  Wand2, 
  Eye, 
  Save, 
  RotateCcw,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface MessageTemplate {
  id: string;
  type: 'cold_outreach' | 'follow_up' | 'value_add' | 'closing' | 'whatsapp';
  channel: 'linkedin' | 'email' | 'whatsapp';
  title: string;
  template: string;
  variables: string[];
}

interface VoiceSuggestion {
  original: string;
  suggestion: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

export function AIVoiceEditor() {
  const [selectedPersonality, setSelectedPersonality] = useState('consultivo');
  const [activeTemplate, setActiveTemplate] = useState<string>('cold_outreach_linkedin');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Templates base por personalidade
  const [templates, setTemplates] = useState<Record<string, MessageTemplate>>({
    cold_outreach_linkedin: {
      id: 'cold_outreach_linkedin',
      type: 'cold_outreach',
      channel: 'linkedin',
      title: 'LinkedIn - Primeiro Contato',
      template: 'Olá {{name}},\n\nNotei o seu perfil como {{jobTitle}} na {{company}} e fiquei impressionado com a sua experiência em {{industry}}.\n\nTenho acompanhado o crescimento do mercado imobiliário em {{location}} e acredito que posso trazer valor à sua estratégia de investimento com insights exclusivos sobre oportunidades premium.\n\nGostaria de trocar algumas ideias? Preparei um material que pode ser interessante para si.',
      variables: ['name', 'jobTitle', 'company', 'industry', 'location']
    },
    follow_up_email: {
      id: 'follow_up_email',
      type: 'follow_up',
      channel: 'email',
      title: 'Email - Follow-up',
      template: 'Olá {{name}},\n\nSegue o nosso contacto no LinkedIn. Como prometido, envio-lhe o relatório exclusivo sobre as tendências do mercado imobiliário em {{location}}.\n\nEstudámos especificamente o segmento de {{propertyType}} e identificámos 3 oportunidades alinhadas com o perfil de {{investorType}}:\n\n• Yield médio de {{yield}}%\n• ROI projetado de {{roi}}% em 5 anos\n• Zonas com valorização histórica de {{appreciation}}%\n\nTem 15 minutos esta semana para discutirmos?',
      variables: ['name', 'location', 'propertyType', 'investorType', 'yield', 'roi', 'appreciation']
    },
    value_add_whatsapp: {
      id: 'value_add_whatsapp',
      type: 'value_add',
      channel: 'whatsapp',
      title: 'WhatsApp - Valor Agregado',
      template: 'Olá {{name}}! 👋\n\nAcabei de receber uma oportunidade que tem tudo a ver com o que conversámos:\n\n🏠 {{propertyType}} em {{location}}\n💰 {{price}} (abaixo do mercado!)\n📈 Potencial de valorização: {{potential}}%\n\nO vendedor precisa fechar rápido. Interesse em ver os detalhes?',
      variables: ['name', 'propertyType', 'location', 'price', 'potential']
    },
    closing_email: {
      id: 'closing_email',
      type: 'closing',
      channel: 'email',
      title: 'Email - Fechamento',
      template: 'Olá {{name}},\n\nFantástico ver o seu interesse na propriedade de {{location}}!\n\nPara avançarmos, preparei:\n✅ Due diligence completa do imóvel\n✅ Análise financeira detalhada\n✅ Simulação de crédito com 3 bancos\n✅ Tour virtual 360°\n\nPodemos agendar uma visita para {{preferredDate}}?\n\nEstou à disposição para qualquer dúvida.',
      variables: ['name', 'location', 'preferredDate']
    }
  });

  const personalities = {
    consultivo: {
      name: 'Consultivo e Profissional',
      description: 'Para Investidores e Executivos',
      tone: 'Formal, técnico, orientado a dados',
      emoji: '💼',
      color: 'blue'
    },
    empatico: {
      name: 'Empático e Próximo',
      description: 'Para 1ª Habitação e Famílias',
      tone: 'Acolhedor, compreensivo, pessoal',
      emoji: '🏡',
      color: 'green'
    },
    direto: {
      name: 'Direto e Eficiente',
      description: 'Para Relocation e Parcerias',
      tone: 'Objetivo, claro, orientado a ação',
      emoji: '⚡',
      color: 'orange'
    }
  };

  // Sugestões da IA baseadas no tom selecionado
  const generateAISuggestions = (templateText: string): VoiceSuggestion[] => {
    const suggestions: VoiceSuggestion[] = [];

    if (selectedPersonality === 'consultivo') {
      if (!templateText.includes('análise') && !templateText.includes('dados')) {
        suggestions.push({
          original: templateText,
          suggestion: templateText.replace('oportunidade', 'análise técnica da oportunidade'),
          reason: 'Tom consultivo valoriza dados e análises',
          impact: 'high'
        });
      }
      if (templateText.includes('!')) {
        suggestions.push({
          original: 'exclamações (!)',
          suggestion: 'pontuação mais formal',
          reason: 'Executivos preferem tom profissional',
          impact: 'medium'
        });
      }
    }

    if (selectedPersonality === 'empatico') {
      if (!templateText.includes('sei') && !templateText.includes('entendo')) {
        suggestions.push({
          original: templateText,
          suggestion: 'Adicionar "Sei que..." ou "Entendo que..."',
          reason: 'Tom empático mostra compreensão',
          impact: 'high'
        });
      }
      if (!templateText.includes('família') && !templateText.includes('lar')) {
        suggestions.push({
          original: 'propriedade',
          suggestion: 'lar / casa dos sonhos',
          reason: 'Famílias conectam emocionalmente',
          impact: 'high'
        });
      }
    }

    if (selectedPersonality === 'direto') {
      if (templateText.length > 200) {
        suggestions.push({
          original: 'texto longo',
          suggestion: 'reduza para 3-4 linhas',
          reason: 'Tom direto: mensagens curtas convertem melhor',
          impact: 'high'
        });
      }
      if (!templateText.match(/\?$/m)) {
        suggestions.push({
          original: templateText,
          suggestion: 'Terminar com call-to-action claro',
          reason: 'Tom direto precisa de próximo passo óbvio',
          impact: 'high'
        });
      }
    }

    return suggestions;
  };

  // Aplica sugestões automaticamente
  const applyAIOptimization = (templateId: string) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const template = templates[templateId];
      let optimizedText = template.template;

      // Otimizações baseadas na personalidade
      if (selectedPersonality === 'consultivo') {
        optimizedText = optimizedText
          .replace(/!/g, '.')
          .replace('oportunidade', 'análise detalhada da oportunidade')
          .replace('interessante', 'estrategicamente relevante');
      } else if (selectedPersonality === 'empatico') {
        if (!optimizedText.includes('Sei que')) {
          optimizedText = 'Sei que encontrar o lar perfeito é importante. ' + optimizedText;
        }
        optimizedText = optimizedText
          .replace('propriedade', 'casa dos seus sonhos')
          .replace('imóvel', 'lar');
      } else if (selectedPersonality === 'direto') {
        // Simplifica e torna mais direto
        const lines = optimizedText.split('\n').filter(l => l.trim());
        optimizedText = lines.slice(0, 4).join('\n') + '\n\nQuando podemos conversar?';
      }

      setTemplates({
        ...templates,
        [templateId]: {
          ...template,
          template: optimizedText
        }
      });

      setIsGenerating(false);
      toast.success('✨ Mensagem otimizada pela IA!', {
        description: `Tom: ${personalities[selectedPersonality as keyof typeof personalities].name}`
      });
    }, 1500);
  };

  // Preview com dados de exemplo
  const renderPreview = (templateId: string) => {
    const template = templates[templateId];
    let preview = template.template;

    // Substitui variáveis com dados exemplo
    const exampleData: Record<string, string> = {
      name: 'João Silva',
      jobTitle: 'CEO & Founder',
      company: 'TechVentures Portugal',
      industry: 'tecnologia e investimentos',
      location: 'Lisboa',
      propertyType: 'T3 de luxo',
      investorType: 'investidor de yield',
      yield: '6.5',
      roi: '45',
      appreciation: '12',
      price: '€580.000',
      potential: '18',
      preferredDate: 'sexta-feira às 15h'
    };

    template.variables.forEach(variable => {
      const regex = new RegExp(`{{${variable}}}`, 'g');
      preview = preview.replace(regex, exampleData[variable] || `[${variable}]`);
    });

    return preview;
  };

  const copyTemplate = (templateId: string) => {
    const preview = renderPreview(templateId);
    navigator.clipboard.writeText(preview);
    toast.success('✅ Mensagem copiada!');
  };

  const resetTemplate = (templateId: string) => {
    toast.info('Template resetado para o padrão');
  };

  const suggestions = generateAISuggestions(templates[activeTemplate]?.template || '');

  return (
    <div className="space-y-6">
      {/* Seletor de Personalidade */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Escolha a Personalidade da IA
          </CardTitle>
          <CardDescription>
            A IA adaptará todas as mensagens automaticamente ao tom selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(personalities).map(([key, personality]) => (
              <div
                key={key}
                onClick={() => setSelectedPersonality(key)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPersonality === key
                    ? `border-${personality.color}-500 bg-${personality.color}-50 shadow-lg`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{personality.emoji}</div>
                  {selectedPersonality === key && (
                    <Badge className={`bg-${personality.color}-600`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ativo
                    </Badge>
                  )}
                </div>
                <h4 className="font-semibold mb-1">{personality.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{personality.description}</p>
                <p className="text-xs text-gray-500 italic">{personality.tone}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor de Templates */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Edite as Mensagens com Sugestões da IA
              </CardTitle>
              <CardDescription className="mt-1">
                Veja exemplos práticos e ajuste cada tipo de mensagem
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Esconder' : 'Mostrar'} Preview
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTemplate} onValueChange={setActiveTemplate}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cold_outreach_linkedin" className="text-xs">
                <Mail className="w-3 h-3 mr-1" />
                1º Contato
              </TabsTrigger>
              <TabsTrigger value="follow_up_email" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Follow-up
              </TabsTrigger>
              <TabsTrigger value="value_add_whatsapp" className="text-xs">
                <Lightbulb className="w-3 h-3 mr-1" />
                Valor
              </TabsTrigger>
              <TabsTrigger value="closing_email" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Fechamento
              </TabsTrigger>
            </TabsList>

            {Object.entries(templates).map(([templateId, template]) => (
              <TabsContent key={templateId} value={templateId} className="space-y-4">
                {/* Info do Template */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {template.channel === 'linkedin' && <Mail className="w-4 h-4 text-blue-600" />}
                      {template.channel === 'email' && <Mail className="w-4 h-4 text-purple-600" />}
                      {template.channel === 'whatsapp' && <Phone className="w-4 h-4 text-green-600" />}
                      {template.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Variáveis: {template.variables.map(v => `{{${v}}}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyTemplate(templateId)}
                      className="gap-1"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetTemplate(templateId)}
                      className="gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => applyAIOptimization(templateId)}
                      disabled={isGenerating}
                      className="gap-1 bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Wand2 className="w-3 h-3" />
                      )}
                      Otimizar com IA
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Editor */}
                  <div>
                    <Label className="mb-2 flex items-center gap-2">
                      Editor de Mensagem
                      <Badge variant="outline" className="text-xs">
                        Tom: {personalities[selectedPersonality as keyof typeof personalities].name}
                      </Badge>
                    </Label>
                    <Textarea
                      value={template.template}
                      onChange={(e) => setTemplates({
                        ...templates,
                        [templateId]: { ...template, template: e.target.value }
                      })}
                      rows={12}
                      className="font-mono text-sm"
                      placeholder="Digite sua mensagem aqui..."
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{template.template.length} caracteres</span>
                      <span>{template.template.split('\n').length} linhas</span>
                    </div>
                  </div>

                  {/* Preview com Dados Reais */}
                  {showPreview && (
                    <div>
                      <Label className="mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview com Dados de Exemplo
                      </Label>
                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-[280px]">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              IA
                            </div>
                            <div>
                              <p className="text-xs font-medium">IA Keller Williams</p>
                              <p className="text-xs text-gray-500">para João Silva</p>
                            </div>
                          </div>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {renderPreview(templateId)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sugestões da IA */}
                {suggestions.length > 0 && (
                  <Card className="border-2 border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        Sugestões da IA para Melhorar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-3 bg-white rounded-lg border border-yellow-200"
                          >
                            <div className="flex items-start gap-2">
                              <AlertCircle className={`w-4 h-4 mt-0.5 ${
                                suggestion.impact === 'high' ? 'text-red-600' :
                                suggestion.impact === 'medium' ? 'text-orange-600' :
                                'text-yellow-600'
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium">{suggestion.reason}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.impact === 'high' ? '🔥 Alto impacto' :
                                     suggestion.impact === 'medium' ? '⚡ Médio impacto' :
                                     '💡 Baixo impacto'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600">
                                  <span className="text-red-600 line-through">{suggestion.original.substring(0, 50)}</span>
                                  {' → '}
                                  <span className="text-green-600">{suggestion.suggestion.substring(0, 50)}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Botão Salvar */}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Resetar Todos
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Helper */}
      <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm space-y-2">
              <p className="font-medium text-purple-900">💡 Como funciona:</p>
              <ul className="space-y-1 text-purple-700">
                <li>✅ Escolha a <strong>personalidade</strong> que combina com cada cluster</li>
                <li>✅ Edite cada <strong>tipo de mensagem</strong> (1º contato, follow-up, etc.)</li>
                <li>✅ Use <strong>{{variáveis}}</strong> para personalização automática</li>
                <li>✅ Clique em <strong>"Otimizar com IA"</strong> para ajuste automático ao tom</li>
                <li>✅ Veja o <strong>preview</strong> com dados reais antes de enviar</li>
                <li>✅ A IA aplica estas mensagens <strong>automaticamente</strong> nas cadências</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
