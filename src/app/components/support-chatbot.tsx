import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../lib/ThemeContext';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Mail,
  Phone,
  HelpCircle,
  Settings as SettingsIcon,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SupportChatbotProps {
  adminSettings?: {
    enabled: boolean;
    welcomeMessage?: string;
    supportEmail?: string;
    supportPhone?: string;
  };
}

export function SupportChatbot({ adminSettings }: SupportChatbotProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Mensagem de boas-vindas
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = adminSettings?.welcomeMessage || 
        'Olá! 👋 Sou o assistente virtual da LeadGen AI. Como posso ajudá-lo hoje?';
      
      setTimeout(() => {
        addBotMessage(welcomeMsg);
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // Saudações
    if (msg.match(/^(oi|olá|ola|hey|hi|hello|bom dia|boa tarde|boa noite)/)) {
      return '👋 Olá! Estou aqui para ajudar. Pode me fazer qualquer pergunta sobre a plataforma LeadGen AI!';
    }

    // Busca de leads
    if (msg.includes('busca') || msg.includes('buscar') || msg.includes('procurar') || msg.includes('search') || msg.includes('iniciar busca')) {
      return '🔍 **Sobre a Busca de Leads:**\n\nPara iniciar uma busca:\n1. Vá na seção "Buscar Leads"\n2. Configure os filtros (cargo, localização, empresa, etc.)\n3. Clique em "Iniciar Busca"\n\nSe a busca não estiver funcionando:\n• Verifique se há filtros configurados\n• Tente recarregar a página (F5)\n• Verifique sua conexão com a internet\n\nPrecisa de mais ajuda com isso?';
    }

    // Instagram
    if (msg.includes('instagram') || msg.includes('dm') || msg.includes('direct')) {
      return '📸 **Integração com Instagram:**\n\nPara conectar o Instagram:\n1. Vá em "Integrações" → Instagram\n2. Clique em "Conectar Instagram"\n3. Autorize as permissões\n4. Ative a automação com IA\n\n⚠️ Importante: Você precisa configurar as variáveis de ambiente no Supabase (INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET).\n\nVeja o guia completo em `/INSTAGRAM_SETUP.md`';
    }

    // WhatsApp
    if (msg.includes('whatsapp') || msg.includes('whats')) {
      return '💬 **Integração com WhatsApp:**\n\nPara conectar o WhatsApp Business:\n1. Vá em "Integrações" → WhatsApp\n2. Escaneie o QR Code com seu celular\n3. Aguarde a confirmação de conexão\n\nA IA poderá enviar e responder mensagens automaticamente!';
    }

    // LinkedIn
    if (msg.includes('linkedin') || msg.includes('sales navigator')) {
      return '💼 **Integração com LinkedIn:**\n\nPara conectar o LinkedIn:\n1. Vá em "Integrações" → LinkedIn\n2. Escaneie o QR Code ou faça login manual\n3. Aguarde a autenticação\n\nCom o LinkedIn conectado, você pode:\n• Buscar leads no Sales Navigator\n• Enviar mensagens automatizadas\n• Enriquecer dados de contatos';
    }

    // Email
    if (msg.includes('email') || msg.includes('e-mail') || msg.includes('resend')) {
      return '📧 **Envio de Emails:**\n\nO sistema usa Resend API para emails.\n\nPara testar:\n1. Vá em "Integrações" → Email\n2. Clique em "Enviar Email de Teste"\n3. Verifique sua caixa de entrada\n\n⚠️ A RESEND_API_KEY deve estar configurada nas variáveis de ambiente do Supabase.';
    }

    // IA / Automação
    if (msg.includes('ia') || msg.includes('ai') || msg.includes('automação') || msg.includes('automation') || msg.includes('bot')) {
      return '🤖 **Automação com IA:**\n\nNossa IA pode:\n• Responder mensagens automaticamente (Instagram, WhatsApp, Email)\n• Qualificar leads com perguntas inteligentes\n• Agendar visitas e reuniões\n• Enviar follow-ups personalizados\n\nPara ativar:\n1. Conecte os canais (WhatsApp, Instagram, Email)\n2. Vá em cada integração\n3. Ative o toggle "Automação com IA"\n\n✅ A IA aprende com cada conversa!';
    }

    // Admin / Configurações
    if (msg.includes('admin') || msg.includes('configurações') || msg.includes('settings') || msg.includes('acesso')) {
      return '⚙️ **Painel Admin:**\n\nO acesso admin é liberado para emails autorizados:\n• admin@leadgen.pt\n• joao.nunes@leadgen.pt\n• cleber.couto@leadgen.pt\n• dev.kwportugal@gmail.com\n\nPara acessar:\n1. Faça login com um email autorizado\n2. Vá em "Configurações"\n3. Verá a aba "Admin" disponível\n\nNo admin você pode:\n• Configurar APIs\n• Gerenciar usuários\n• Ver logs do sistema\n• Configurar o chatbot';
    }

    // APIs
    if (msg.includes('api') || msg.includes('chave') || msg.includes('key') || msg.includes('token')) {
      return '🔑 **Configuração de APIs:**\n\nTodas as chaves de API devem ser configuradas nas **variáveis de ambiente do Supabase**:\n\n1. Acesse seu projeto Supabase\n2. Settings → Edge Functions → Environment Variables\n3. Adicione as keys necessárias:\n   • RESEND_API_KEY (Email)\n   • INSTAGRAM_APP_ID\n   • INSTAGRAM_APP_SECRET\n   • APOLLO_API_KEY (Apollo.io)\n   • PDL_API_KEY (PeopleDataLabs)\n   • etc.\n\n⚠️ Nunca exponha chaves no frontend!';
    }

    // Leads / Qualificação
    if (msg.includes('lead') || msg.includes('qualificação') || msg.includes('qualification') || msg.includes('nurturing')) {
      return '🎯 **Gestão de Leads:**\n\nNosso sistema:\n1. **Busca** leads qualificados (LinkedIn, Apollo, PDL)\n2. **Qualifica** através de IA conversacional\n3. **Nutre** com follow-ups automatizados\n4. **Entrega** leads quentes para humanos\n\nVeja seus leads em:\n• Dashboard → Leads\n• Data Hub → Base de Leads\n\nCada lead tem:\n• Score de qualificação\n• Histórico de interações\n• Próximas ações sugeridas';
    }

    // Integração / Conexão
    if (msg.includes('conectar') || msg.includes('integrar') || msg.includes('connect') || msg.includes('integration')) {
      return '🔌 **Integrações Disponíveis:**\n\nPara conectar serviços:\n1. Vá na seção "Integrações"\n2. Escolha o serviço desejado:\n   • Email (Resend)\n   • WhatsApp Business\n   • LinkedIn Sales Navigator\n   • Instagram DM\n   • SMS Gateway\n3. Siga as instruções na tela\n\nCada integração tem seu próprio guia de configuração!';
    }

    // Dashboard / Métricas
    if (msg.includes('dashboard') || msg.includes('métricas') || msg.includes('metrics') || msg.includes('estatísticas')) {
      return '📊 **Dashboard & Métricas:**\n\nNo dashboard você vê:\n• Total de leads capturados\n• Taxa de conversão\n• Leads aquecidos hoje\n• Campanhas ativas\n• Desempenho da IA\n\nPara acessar:\n1. Clique em "Dashboard" no menu\n2. Veja gráficos em tempo real\n3. Filtre por período\n\nTodas as métricas são atualizadas automaticamente!';
    }

    // Problemas / Erro
    if (msg.includes('erro') || msg.includes('error') || msg.includes('problema') || msg.includes('bug') || msg.includes('não funciona') || msg.includes('não está funcionando')) {
      return '⚠️ **Solução de Problemas:**\n\nPrimeiro, tente:\n1. Recarregar a página (F5)\n2. Limpar cache do navegador (Ctrl+Shift+Delete)\n3. Verificar console do navegador (F12)\n4. Verificar conexão com internet\n\nSe o problema persistir:\n• Veja os logs no console (tecla F12)\n• Tire um print do erro\n• Entre em contato com o suporte técnico\n\n📧 Email: cleber.couto@we-expand.com\n\nVou te ajudar a resolver!';
    }

    // Preço / Plano / Pagamento
    if (msg.includes('preço') || msg.includes('plano') || msg.includes('pagamento') || msg.includes('price') || msg.includes('pricing')) {
      return '💰 **Planos & Preços:**\n\nPara informações sobre planos e valores, entre em contato com nossa equipe comercial:\n\n📧 Email: cleber.couto@we-expand.com\n📞 Telefone: ' + (adminSettings?.supportPhone || '+351 XXX XXX XXX') + '\n\nTemos planos personalizados para:\n• Agentes individuais\n• Imobiliárias pequenas\n• Grandes redes\n\nAgende uma demo gratuita!';
    }

    // Suporte / Ajuda / Help
    if (msg.includes('suporte') || msg.includes('ajuda') || msg.includes('help') || msg.includes('support') || msg.includes('contato')) {
      return '🆘 **Suporte Técnico:**\n\nEstou aqui para ajudar! Mas se precisar de suporte humano:\n\n📧 **Email de Suporte:**\ncleber.couto@we-expand.com\n\n📞 **Telefone:**\n' + (adminSettings?.supportPhone || '+351 XXX XXX XXX') + '\n\n⏰ **Horário de Atendimento:**\nSeg-Sex: 9h às 18h (Horário de Lisboa)\n\n💬 Normalmente respondemos em até 2 horas!';
    }

    // Agradecimentos
    if (msg.match(/(obrigad|thanks|thank you|valeu|graças)/)) {
      return '😊 Por nada! Fico feliz em ajudar. Se tiver mais alguma dúvida, estou por aqui! ✨';
    }

    // Resposta padrão
    return `🤔 Entendo que você precisa de ajuda com: "${userMessage}"\n\nAqui estão algumas coisas que posso ajudar:\n\n• 🔍 Busca de leads\n• 📸 Integração Instagram\n• 💬 WhatsApp Business\n• 💼 LinkedIn\n• 📧 Envio de emails\n• 🤖 Automação com IA\n• ⚙️ Configurações\n• 🔑 APIs e integrações\n\nPode me perguntar qualquer coisa! Ou se preferir, entre em contato com nosso suporte:\n\n📧 cleber.couto@we-expand.com`;
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    // Adicionar mensagem do usuário
    addUserMessage(trimmedMessage);
    setInputMessage('');
    setShowQuickActions(false);

    // Simular digitação
    setIsTyping(true);
    
    // Delay realista (500-1500ms)
    const delay = 500 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Gerar resposta
    const response = generateBotResponse(trimmedMessage);
    addBotMessage(response);
    
    setIsTyping(false);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickActions = [
    { label: '🔍 Como buscar leads?', action: 'Como faço para buscar leads?' },
    { label: '📸 Conectar Instagram', action: 'Como conectar Instagram?' },
    { label: '💬 Configurar WhatsApp', action: 'Como configurar WhatsApp?' },
    { label: '🤖 Ativar IA', action: 'Como ativar automação com IA?' },
    { label: '⚙️ APIs', action: 'Como configurar APIs?' },
    { label: '🆘 Falar com suporte', action: 'Preciso de suporte humano' }
  ];

  // Não exibir se desabilitado pelo admin
  if (adminSettings?.enabled === false) {
    return null;
  }

  return (
    <>
      {/* Botão Flutuante */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 hover:shadow-purple-500/50'
                : 'bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 hover:shadow-purple-500/50'
            }`}
          >
            <MessageCircle className="w-7 h-7 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Janela do Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className={`fixed bottom-6 right-6 z-50 w-[400px] rounded-2xl shadow-2xl overflow-hidden ${
              theme === 'dark'
                ? 'bg-slate-900 border border-slate-700'
                : 'bg-white border border-gray-200'
            }`}
            style={{ maxHeight: isMinimized ? '64px' : '600px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Assistente LeadGen AI</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/80">Online agora</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  className={`h-[400px] overflow-y-auto p-4 space-y-4 ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                  }`}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : theme === 'dark'
                            ? 'bg-slate-700 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString('pt-PT', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        theme === 'dark' ? 'bg-slate-700' : 'bg-white border border-gray-200'
                      }`}>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  {showQuickActions && messages.length <= 1 && (
                    <div className="space-y-2 pt-2">
                      <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Sugestões rápidas:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((qa, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(qa.action)}
                            className={`text-left text-xs p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-white hover:bg-gray-100 border border-gray-200 text-gray-700'
                            }`}
                          >
                            {qa.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua mensagem..."
                      className={`flex-1 ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50'
                      }`}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className={`text-xs mt-2 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Powered by LeadGen AI • Suporte 24/7
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
