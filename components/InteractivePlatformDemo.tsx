import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Phone, MessageCircle, Mail, Bot, Zap, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface InteractivePlatformDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoSlide {
  id: number;
  title: string;
  description: string;
  visual: React.ReactNode;
  duration: number;
}

export function InteractivePlatformDemo({ isOpen, onClose }: InteractivePlatformDemoProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const slides: DemoSlide[] = [
    {
      id: 1,
      title: "Bem-vindo ao Tá Pago.pt",
      description: "A plataforma inteligente de cobranças automatizadas com IA para o mercado português",
      visual: (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600">
          <div className="text-center space-y-6 p-8">
            <div className="text-8xl animate-bounce">💰</div>
            <h1 className="text-5xl font-bold text-white">Tá Pago.pt</h1>
            <p className="text-2xl text-white/90">Cobranças Inteligentes com IA</p>
          </div>
        </div>
      ),
      duration: 5000
    },
    {
      id: 2,
      title: "Gestão Completa de Clientes",
      description: "Centralize todos os seus clientes e faturas num único lugar",
      visual: (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl">
                JS
              </div>
              <div>
                <h3 className="font-bold text-xl">João Silva</h3>
                <p className="text-gray-500">NIF: 123456789</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="text-red-600 text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">Faturas Pendentes</div>
              </div>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="text-amber-600 text-2xl font-bold">2.500€</div>
                <div className="text-sm text-gray-600">Total em Dívida</div>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                <div className="text-emerald-600 text-2xl font-bold">45 dias</div>
                <div className="text-sm text-gray-600">Média de Atraso</div>
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 5000
    },
    {
      id: 3,
      title: "IA com Voz Humana",
      description: "A IA faz chamadas telefónicas automáticas com voz natural portuguesa",
      visual: (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-600 to-pink-600 p-8">
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
              <Phone className="w-32 h-32 text-white relative animate-bounce" />
            </div>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-2xl">
              <div className="flex items-start gap-4">
                <Bot className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="text-lg text-gray-800 italic">
                    "Bom dia, Sr. João Silva. Aqui é a assistente do Tá Pago.pt. 
                    Estamos a ligar para informar que tem uma fatura no valor de 
                    850€ com vencimento há 15 dias. Podemos ajudar a regularizar?"
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Chamada em curso...
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-white">
                <span className="text-sm">Tom natural</span>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-white">
                <span className="text-sm">Sotaque português</span>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg px-4 py-2 text-white">
                <span className="text-sm">Contextualizada</span>
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 7000
    },
    {
      id: 4,
      title: "Multi-Canal Inteligente",
      description: "Envie cobranças por WhatsApp, SMS, Email e até chamadas com IA",
      visual: (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-50 to-cyan-50 p-8">
          <div className="grid grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-emerald-200 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
              <p className="text-gray-600">Mensagens instantâneas com alta taxa de abertura</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle className="w-4 h-4" />
                Taxa de leitura: 98%
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Chamadas IA</h3>
              <p className="text-gray-600">Voz humana natural e contextualizada</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-purple-600">
                <CheckCircle className="w-4 h-4" />
                Taxa de resposta: 85%
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">SMS</h3>
              <p className="text-gray-600">Alcance universal e imediato</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
                <CheckCircle className="w-4 h-4" />
                Taxa de entrega: 99%
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-cyan-200 transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-600">Comunicação formal e detalhada</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-cyan-600">
                <CheckCircle className="w-4 h-4" />
                Custo: €0
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 6000
    },
    {
      id: 5,
      title: "Régua de Cobrança Automática",
      description: "Configure uma sequência de ações que executam automaticamente",
      visual: (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-purple-50 p-8">
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ATIVA
                </div>
                <h3 className="text-2xl font-bold">Régua Padrão</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Vencimento</h4>
                    <p className="text-sm text-gray-600">Email de lembrete amigável</p>
                  </div>
                  <Mail className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="flex items-center gap-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">3 dias após</h4>
                    <p className="text-sm text-gray-600">WhatsApp personalizado</p>
                  </div>
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex items-center gap-4 bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">7 dias após</h4>
                    <p className="text-sm text-gray-600">Chamada com IA (voz humana)</p>
                  </div>
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>

                <div className="flex items-center gap-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">15 dias após</h4>
                    <p className="text-sm text-gray-600">Email formal + WhatsApp</p>
                  </div>
                  <div className="flex gap-2">
                    <Mail className="w-6 h-6 text-red-600" />
                    <MessageCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      duration: 7000
    },
    {
      id: 6,
      title: "Resultados Comprovados",
      description: "Reduza inadimplência e aumente recuperação de pagamentos",
      visual: (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 p-8">
          <div className="grid grid-cols-3 gap-8 max-w-5xl">
            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 text-center">
              <TrendingUp className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <div className="text-5xl font-bold text-emerald-600 mb-2">85%</div>
              <p className="text-gray-700 font-medium">Taxa de Recuperação</p>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 text-center">
              <Zap className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
              <div className="text-5xl font-bold text-cyan-600 mb-2">70%</div>
              <p className="text-gray-700 font-medium">Redução de Tempo</p>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 text-center">
              <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <div className="text-5xl font-bold text-blue-600 mb-2">50%</div>
              <p className="text-gray-700 font-medium">Menos Inadimplência</p>
            </div>
          </div>
        </div>
      ),
      duration: 5000
    },
    {
      id: 7,
      title: "Comece Agora!",
      description: "Experimente grátis e transforme a gestão de cobranças do seu negócio",
      visual: (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-600 p-8">
          <div className="text-center space-y-8">
            <div className="text-7xl animate-bounce mb-4">🚀</div>
            <h1 className="text-5xl font-bold text-white">Pronto para começar?</h1>
            <p className="text-2xl text-white/90 max-w-2xl mx-auto">
              Junte-se a centenas de empresas que já automatizaram suas cobranças
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-2xl">
                Começar Gratuitamente
              </button>
              <button className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-white/30 transition-all border-2 border-white">
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      ),
      duration: 5000
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentSlide(0);
      setProgress(0);
      setIsPlaying(true);
      return;
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const currentSlideDuration = slides[currentSlide].duration;
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (currentSlideDuration / 100));
        if (newProgress >= 100) {
          // Move to next slide
          if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
          } else {
            setCurrentSlide(0); // Loop back
          }
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, isOpen]);

  const handlePrevious = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : slides.length - 1));
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : 0));
    setProgress(0);
  };

  const handleRestart = () => {
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-2xl font-bold">{slides[currentSlide].title}</h2>
              <p className="text-white/70 mt-1">{slides[currentSlide].description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-400 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">Fechar (ESC)</span>
                <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-full max-w-7xl mx-auto">
            {slides[currentSlide].visual}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Progress Bar */}
            <div className="bg-white/20 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrevious}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  onClick={handleNext}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleRestart}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setProgress(0);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'bg-emerald-500 w-8' 
                        : 'bg-white/40 w-2 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              {/* Slide Counter */}
              <div className="text-white text-sm">
                {currentSlide + 1} / {slides.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
