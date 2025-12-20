import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Play, RefreshCw, Smartphone } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export function AutomacaoIA() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const startSimulation = () => {
    setMessages([]);
    setIsSimulating(true);
    
    // Simulate initial customer message
    setTimeout(() => {
      addMessage('user', 'Olá, gostaria de saber se tenho alguma fatura em atraso?');
    }, 1000);
  };

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender,
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);

    if (sender === 'user') {
      processUserMessage(text);
    }
  };

  const processUserMessage = async (text: string) => {
    setIsTyping(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsTyping(false);
        return;
      }

      // Call backend to process message with AI
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d96fb0db/ai-invoice-bot`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: text }),
        }
      );

      const data = await response.json();

      if (response.ok && data.reply) {
        // Add slight delay to simulate typing naturally
        setTimeout(() => {
          setIsTyping(false);
          addMessage('bot', data.reply);
        }, 1500);
      } else {
        setIsTyping(false);
        addMessage('bot', 'Desculpe, não consegui processar seu pedido no momento.');
      }

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      setIsTyping(false);
      addMessage('bot', 'Ocorreu um erro de conexão. Tente novamente.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    addMessage('user', inputText);
    setInputText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
      {/* Left Panel: Explanation */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            Automação com IA
          </h1>
          <p className="text-gray-600">
            O Cobra + utiliza inteligência artificial para atender seus clientes automaticamente via WhatsApp, Email e SMS.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-800">Como funciona?</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">1. Recebimento</h4>
                <p className="text-sm text-gray-500">O cliente envia uma mensagem perguntando sobre faturas ou pagamentos.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">2. Processamento IA</h4>
                <p className="text-sm text-gray-500">Nossa IA analisa a intenção, busca os dados financeiros do cliente em tempo real.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Send className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">3. Resposta Automática</h4>
                <p className="text-sm text-gray-500">O sistema envia a fatura, link de pagamento ou status atualizado instantaneamente.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                isSimulating 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg'
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Simulação em andamento...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Iniciar Demonstração
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Simulator */}
      <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-8 border-gray-800 relative mx-auto w-full max-w-md h-full flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10"></div>

        {/* Screen */}
        <div className="bg-[#e5ddd5] flex-1 rounded-[2rem] overflow-hidden flex flex-col relative">
          {/* Header */}
          <div className="bg-[#075e54] p-4 pt-8 flex items-center gap-3 text-white shadow-sm z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Cobra + Assistente</h3>
              <p className="text-xs text-emerald-100">Online agora</p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
            {messages.length === 0 && (
              <div className="flex justify-center mt-8">
                <div className="bg-[#dcf8c6] p-3 rounded-lg shadow-sm max-w-[80%] text-center text-sm text-gray-600">
                  <p>Toque em "Iniciar Demonstração" para ver a IA em ação.</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm text-sm relative ${
                    msg.sender === 'user'
                      ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[10px] text-gray-500 block text-right mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow-sm rounded-tl-none flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="bg-[#f0f0f0] p-3 flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              disabled={!isSimulating}
            />
            <button
              type="submit"
              disabled={!isSimulating || !inputText.trim()}
              className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center text-white hover:bg-[#064e46] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
