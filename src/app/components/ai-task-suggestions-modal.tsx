import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Sparkles, Zap, CheckCircle2, Loader2, ExternalLink, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface TaskSuggestion {
  title: string;
  description: string;
  benefits: string[];
  implementation: string;
  estimatedTime: string;
  dependencies: string[];
  codeChanges?: {
    file: string;
    description: string;
  }[];
}

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  onApplySuggestion: (taskId: string, suggestionId: string) => void;
}

export function AISuggestionsModal({ 
  isOpen, 
  onClose, 
  taskId, 
  taskTitle, 
  taskDescription,
  onApplySuggestion 
}: AISuggestionsModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  // Gera sugestões específicas baseadas na tarefa
  const generateTaskSuggestions = (): TaskSuggestion[] => {
    const taskLower = taskTitle.toLowerCase();

    // LinkedIn Sales Navigator
    if (taskLower.includes('linkedin')) {
      return [
        {
          title: '🚀 Implementação Completa LinkedIn Sales Nav API',
          description: 'Sistema completo de busca com filtros avançados, salvamento de pesquisas e exportação de leads.',
          benefits: [
            'Buscar leads com 25+ filtros (seniority, empresa, localização)',
            'Salvar pesquisas e receber alertas de novos leads',
            'Exportar até 2.500 leads por mês',
            'Enriquecimento automático de dados'
          ],
          implementation: 'Integrar LinkedIn Sales Navigator API com autenticação OAuth 2.0, criar interface de busca avançada e sistema de cache de resultados.',
          estimatedTime: '3-4 dias',
          dependencies: ['LinkedIn Premium', 'API Key'],
          codeChanges: [
            { file: '/services/linkedin-api.tsx', description: 'Criar serviço de integração com LinkedIn API' },
            { file: '/components/linkedin-search.tsx', description: 'Interface de busca avançada' },
            { file: '/components/linkedin-results.tsx', description: 'Visualização de resultados' }
          ]
        },
        {
          title: '🤖 Auto-Connect + Message com IA',
          description: 'Automação de envio de conexões e mensagens personalizadas no LinkedIn (estilo Expandi.io).',
          benefits: [
            'Enviar 100+ conexões por semana automaticamente',
            'Mensagens personalizadas com IA (nome, empresa, cargo)',
            'Acompanhamento automático de aceites',
            'Taxa de aceitação 40% maior'
          ],
          implementation: 'Criar fila de automação, gerar mensagens com LLM, implementar delays aleatórios para evitar detecção.',
          estimatedTime: '2-3 dias',
          dependencies: ['LinkedIn Premium', 'OpenAI API'],
          codeChanges: [
            { file: '/services/linkedin-automation.tsx', description: 'Motor de automação' },
            { file: '/services/ai-message-generator.tsx', description: 'Gerador de mensagens com IA' }
          ]
        }
      ];
    }

    // Apollo.io
    if (taskLower.includes('apollo')) {
      return [
        {
          title: '🎯 Integração Apollo.io com Enriquecimento',
          description: 'Busca de leads + enriquecimento de dados em tempo real com 200M+ de contatos.',
          benefits: [
            'Buscar leads com 65+ filtros',
            'Enriquecer emails, telefones, tech stack',
            'Validar emails em tempo real (97% de precisão)',
            'Encontrar contatos diretos de decision makers'
          ],
          implementation: 'Integrar Apollo API v1, criar sistema de créditos, implementar validação de emails e enriquecimento de dados.',
          estimatedTime: '2 dias',
          dependencies: ['Apollo.io API Key'],
          codeChanges: [
            { file: '/services/apollo-api.tsx', description: 'Cliente Apollo.io' },
            { file: '/components/apollo-search.tsx', description: 'Interface de busca' },
            { file: '/services/email-validator.tsx', description: 'Validador de emails' }
          ]
        },
        {
          title: '⚡ Waterfall Enrichment (Clay-style)',
          description: 'Enriquecimento em cascata: tentar Apollo → Hunter → Clearbit → RocketReach até encontrar dados.',
          benefits: [
            'Taxa de sucesso 85%+ na busca de emails',
            'Economizar créditos usando apenas o necessário',
            'Dados mais frescos e precisos',
            'Custo reduzido em 40%'
          ],
          implementation: 'Criar sistema de waterfall que tenta múltiplas fontes em ordem de custo/precisão.',
          estimatedTime: '3 dias',
          dependencies: ['Apollo, Hunter, Clearbit APIs'],
          codeChanges: [
            { file: '/services/waterfall-enrichment.tsx', description: 'Motor de enriquecimento em cascata' }
          ]
        }
      ];
    }

    // WhatsApp
    if (taskLower.includes('whatsapp')) {
      return [
        {
          title: '📱 WhatsApp Business API + Templates Aprovados',
          description: 'Envio em massa com templates pré-aprovados pelo WhatsApp e tracking de entrega.',
          benefits: [
            'Enviar mensagens em massa (compliance total)',
            'Templates aprovados em 24h',
            'Taxa de entrega 98%+ garantida',
            'Tracking de leitura e resposta'
          ],
          implementation: 'Integrar com Twilio/MessageBird, criar sistema de templates, implementar webhook de status.',
          estimatedTime: '3 dias',
          dependencies: ['WhatsApp Business Account', 'Twilio/MessageBird API'],
          codeChanges: [
            { file: '/services/whatsapp-api.tsx', description: 'Cliente WhatsApp Business' },
            { file: '/components/whatsapp-templates.tsx', description: 'Gerenciador de templates' },
            { file: '/services/whatsapp-webhook.tsx', description: 'Webhook de status' }
          ]
        },
        {
          title: '🤖 Chatbot IA para WhatsApp',
          description: 'Responder perguntas automaticamente 24/7 com IA (estilo ManyChat).',
          benefits: [
            'Responder 80% das perguntas automaticamente',
            'Disponível 24/7 sem custo de agente',
            'Qualificar leads antes de handover',
            'Agendar reuniões direto pelo WhatsApp'
          ],
          implementation: 'Integrar OpenAI GPT com WhatsApp, criar base de conhecimento, implementar handover inteligente.',
          estimatedTime: '4 dias',
          dependencies: ['WhatsApp API', 'OpenAI API'],
          codeChanges: [
            { file: '/services/whatsapp-chatbot.tsx', description: 'Chatbot com IA' },
            { file: '/services/knowledge-base.tsx', description: 'Base de conhecimento' }
          ]
        }
      ];
    }

    // SMS / Twilio
    if (taskLower.includes('sms') || taskLower.includes('twilio')) {
      return [
        {
          title: '📲 Twilio SMS + Link Tracking',
          description: 'Envio de SMS com links rastreáveis e análise de cliques.',
          benefits: [
            'Taxa de abertura 98% (vs 20% email)',
            'Resposta média em <5 minutos',
            'Tracking de cliques em links',
            'Custo: €0.05-0.10 por SMS'
          ],
          implementation: 'Integrar Twilio SMS, criar shortlinks rastreáveis, implementar analytics de SMS.',
          estimatedTime: '2 dias',
          dependencies: ['Twilio Account + Phone Number'],
          codeChanges: [
            { file: '/services/twilio-sms.tsx', description: 'Cliente Twilio' },
            { file: '/services/link-shortener.tsx', description: 'Encurtador de links' }
          ]
        },
        {
          title: '⏰ Smart Timing - Envio no Melhor Horário',
          description: 'IA detecta melhor horário para cada lead baseado em histórico.',
          benefits: [
            'Taxa de resposta 3x maior',
            'Aprendizado contínuo por lead',
            'Respeitar fusos horários automaticamente',
            'Evitar horários de trabalho intenso'
          ],
          implementation: 'Criar modelo ML que aprende melhor horário baseado em respostas anteriores.',
          estimatedTime: '3 dias',
          dependencies: ['Histórico de engajamento'],
          codeChanges: [
            { file: '/services/smart-timing-ai.tsx', description: 'IA de timing otimizado' }
          ]
        }
      ];
    }

    // Email / Cadências
    if (taskLower.includes('email') || taskLower.includes('cadência')) {
      return [
        {
          title: '📧 Cadências Multi-Etapa com A/B Testing',
          description: 'Sequências de 5-7 emails com variações automáticas para otimizar conversão.',
          benefits: [
            'Taxa de resposta 3-5x maior que email único',
            'A/B testing automático de subject lines',
            'Parar cadência se lead responder',
            'Personalização por cluster'
          ],
          implementation: 'Criar motor de cadências, sistema de A/B testing, tracking de respostas.',
          estimatedTime: '3 dias',
          dependencies: ['Resend API'],
          codeChanges: [
            { file: '/services/email-cadence-engine.tsx', description: 'Motor de cadências' },
            { file: '/services/ab-testing.tsx', description: 'Sistema de A/B testing' }
          ]
        },
        {
          title: '🔥 Email Warmup - Aumentar Deliverability',
          description: 'Aquecer domínio automaticamente antes de campanhas (estilo Instantly.ai).',
          benefits: [
            'Deliverability de 60% → 95%+',
            'Evitar cair em spam',
            'Construir reputação gradualmente',
            'Warmup automático de novos domínios'
          ],
          implementation: 'Enviar emails gradualmente para contas próprias, aumentar volume 10% por dia.',
          estimatedTime: '2 dias',
          dependencies: ['Múltiplos domínios de email'],
          codeChanges: [
            { file: '/services/email-warmup.tsx', description: 'Sistema de warmup' }
          ]
        }
      ];
    }

    // IA / LLM
    if (taskLower.includes('llm') || taskLower.includes('ia') || taskLower.includes('openai')) {
      return [
        {
          title: '🧠 LLM para Personalização Hiper-Relevante',
          description: 'GPT-4 gerando mensagens personalizadas baseado em LinkedIn, site, notícias do lead.',
          benefits: [
            'Mensagens 100% únicas por lead',
            'Mencionar detalhes específicos (posts, empresa, setor)',
            'Taxa de resposta 5-10x maior',
            'Economizar 20h/semana de copywriting'
          ],
          implementation: 'Integrar OpenAI GPT-4, criar prompts otimizados, implementar sistema de templates dinâmicos.',
          estimatedTime: '4 dias',
          dependencies: ['OpenAI API Key'],
          codeChanges: [
            { file: '/services/openai-client.tsx', description: 'Cliente OpenAI' },
            { file: '/services/message-personalizer.tsx', description: 'Personalizador de mensagens' },
            { file: '/prompts/outreach-prompts.tsx', description: 'Biblioteca de prompts' }
          ]
        },
        {
          title: '🎯 Análise de Sentimento em Respostas',
          description: 'IA detecta interesse real vs respostas automáticas ou negativas.',
          benefits: [
            'Priorizar leads com interesse real',
            'Detectar objeções automaticamente',
            'Sugerir próximos passos por IA',
            'Evitar perder tempo com respostas frias'
          ],
          implementation: 'Usar GPT-4 para classificar respostas em: Interesse Alto/Médio/Baixo/Objeção.',
          estimatedTime: '2 dias',
          dependencies: ['OpenAI API'],
          codeChanges: [
            { file: '/services/sentiment-analyzer.tsx', description: 'Analisador de sentimento' }
          ]
        }
      ];
    }

    // Scoring Automático
    if (taskLower.includes('scoring')) {
      return [
        {
          title: '🎲 Lead Scoring com Machine Learning',
          description: 'Modelo ML que prevê probabilidade de conversão baseado em 30+ sinais.',
          benefits: [
            'Priorizar leads com 80%+ chance de conversão',
            'Economizar tempo com leads frios',
            'Aprendizado contínuo com resultados reais',
            'ROI 3x maior em outreach'
          ],
          implementation: 'Treinar modelo com histórico de conversões, implementar scoring em tempo real.',
          estimatedTime: '3 dias',
          dependencies: ['Histórico de conversões (min. 100 leads)'],
          codeChanges: [
            { file: '/services/lead-scoring-ml.tsx', description: 'Modelo de scoring' },
            { file: '/services/feature-extractor.tsx', description: 'Extração de features' }
          ]
        }
      ];
    }

    // Default - sugestões gerais
    return [
      {
        title: '💡 Implementação Recomendada',
        description: 'Seguir melhores práticas da indústria para esta tarefa.',
        benefits: [
          'Código limpo e testado',
          'Documentação completa',
          'Error handling robusto',
          'Logging e monitoring'
        ],
        implementation: 'Seguir padrão de desenvolvimento com testes, documentação e monitoramento.',
        estimatedTime: 'Conforme estimativa',
        dependencies: [],
        codeChanges: []
      }
    ];
  };

  const suggestions = generateTaskSuggestions();

  const handleApplySuggestion = async (suggestionIndex: number) => {
    setIsApplying(true);
    
    const suggestion = suggestions[suggestionIndex];
    
    // Simula aplicação da sugestão
    toast.info('🚀 Iniciando implementação automática...', {
      description: 'Por favor, aguarde enquanto aplicamos as mudanças'
    });

    // Simula tempo de implementação
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Marca como aplicada
    setAppliedSuggestions(prev => new Set(prev).add(suggestionIndex.toString()));
    
    toast.success(`✅ Sugestão "${suggestion.title}" aplicada!`, {
      description: `${suggestion.codeChanges?.length || 0} arquivos foram criados/modificados`,
      duration: 5000
    });

    // Chama callback para marcar tarefa como em progresso
    onApplySuggestion(taskId, suggestionIndex.toString());
    
    setIsApplying(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Sugestões de IA para: {taskTitle}
          </DialogTitle>
          <DialogDescription>
            {taskDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="border-2 hover:border-purple-300 transition-all">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{suggestion.title}</h3>
                      <p className="text-gray-600">{suggestion.description}</p>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap">
                      ⏱️ {suggestion.estimatedTime}
                    </Badge>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      Benefícios
                    </h4>
                    <ul className="space-y-1">
                      {suggestion.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Implementation */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      Como Implementar
                    </h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {suggestion.implementation}
                    </p>
                  </div>

                  {/* Dependencies */}
                  {suggestion.dependencies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Dependências:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {suggestion.dependencies.map((dep, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Code Changes */}
                  {suggestion.codeChanges && suggestion.codeChanges.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Arquivos a Criar/Modificar:</h4>
                      <div className="space-y-1">
                        {suggestion.codeChanges.map((change, i) => (
                          <div key={i} className="text-xs bg-gray-50 p-2 rounded flex items-start gap-2">
                            <code className="text-purple-600 font-mono">{change.file}</code>
                            <span className="text-gray-600">- {change.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2 border-t">
                    {appliedSuggestions.has(index.toString()) ? (
                      <Button disabled className="w-full bg-green-600">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Sugestão Aplicada com Sucesso
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleApplySuggestion(index)}
                        disabled={isApplying}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Aplicando Sugestão...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Aplicar Esta Sugestão Automaticamente
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Sugestões Gerais da Plataforma */}
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                💡 Sugestões Gerais de Melhoria da Plataforma
              </h3>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">🎨 Design System Unificado</h4>
                  <p className="text-sm text-gray-600">Criar biblioteca de componentes reutilizáveis para manter consistência visual em toda plataforma.</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">📊 Dashboard de Performance em Tempo Real</h4>
                  <p className="text-sm text-gray-600">WebSockets para atualização automática de KPIs sem refresh manual.</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">🔔 Centro de Notificações Inteligente</h4>
                  <p className="text-sm text-gray-600">Notificações push browser + email para eventos críticos (lead quente, resposta importante, handover).</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">🌍 Multi-idioma (i18n)</h4>
                  <p className="text-sm text-gray-600">Suporte para Português, Inglês e Espanhol para expansão internacional.</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">📱 App Mobile (PWA)</h4>
                  <p className="text-sm text-gray-600">Progressive Web App para gestores acompanharem pipeline no celular.</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">🤝 Integrações com Zapier/Make</h4>
                  <p className="text-sm text-gray-600">Conectar com 5000+ apps através de webhooks e APIs públicas.</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">🎯 Playbooks de IA por Setor</h4>
                  <p className="text-sm text-gray-600">Templates pré-configurados para diferentes verticais (tech, real estate, finance).</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">📈 Analytics Avançado com BI</h4>
                  <p className="text-sm text-gray-600">Dashboard estilo Tableau com drill-down, filtros dinâmicos e export de relatórios.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
