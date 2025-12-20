import { X, Play, Pause, Volume2, VolumeX, Maximize, Sparkles, MessageCircle, Send, CheckCircle2, Zap, Brain, Mail, Phone, Mic, Headphones, TrendingUp, Users, Target, Cpu, Layers, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface VideoDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoDemo({ isOpen, onClose }: VideoDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(40); // 40 segundos
  const [showVideo, setShowVideo] = useState(false);
  const progressIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (isMuted) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowVideo(true), 50);
      setTimeout(() => {
        handlePlayPause();
      }, 400);
    } else {
      setShowVideo(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.2;
          
          // Sons sincronizados
          if (Math.abs(newTime - 0) < 0.1) playSound(523, 0.15);
          if (Math.abs(newTime - 6) < 0.1) playSound(659, 0.15);
          if (Math.abs(newTime - 11) < 0.1) playSound(784, 0.15);
          if (Math.abs(newTime - 16) < 0.1) playSound(880, 0.15);
          if (Math.abs(newTime - 21) < 0.1) playSound(698, 0.25, 'sawtooth'); // VOZ
          if (Math.abs(newTime - 28) < 0.1) playSound(1047, 0.2);
          if (Math.abs(newTime - 34) < 0.1) playSound(1319, 0.3);
          
          if (newTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, duration, isMuted]);

  useEffect(() => {
    setProgress((currentTime / duration) * 100);
  }, [currentTime, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      playSound(440, 0.1);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      playSound(330, 0.1);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const newTime = (percentage / 100) * duration;
    setCurrentTime(newTime);
    setProgress(percentage);
    playSound(550, 0.05);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)'
      }}
    >
      {/* Video Container */}
      <div 
        className={`relative w-full max-w-7xl transition-all duration-500 ease-out ${
          showVideo 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-3xl opacity-30 blur-xl" />
        
        {/* Main Video Card */}
        <div className="relative bg-white/95 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl border border-gray-200">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-sm tracking-tight">Como Funciona a IA do Tá Pago.pt</h3>
                  <p className="text-gray-500 text-xs font-light">WhatsApp · Email · SMS · Voz com IA 🎙️</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Player Area */}
          <div className="relative aspect-video bg-gradient-to-br from-white via-emerald-50/20 to-cyan-50/20">
            
            {/* Tech Grid Background */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Main Content */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 py-8">
                <div className="w-full max-w-6xl">
                  
                  {/* INTRO: O que é a IA (0-6s) */}
                  <div 
                    className="transform transition-all duration-500"
                    style={{
                      opacity: currentTime >= 0 && currentTime < 6 ? 1 : 0,
                      transform: currentTime >= 0 && currentTime < 6 ? 'scale(1)' : 'scale(0.95)'
                    }}
                  >
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl shadow-emerald-500/50 mb-2">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-gray-900 text-3xl font-bold tracking-tight">
                        O que é a nossa IA?
                      </h2>
                      <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                        Um <strong>assistente inteligente</strong> que analisa cada cliente, escolhe o melhor canal 
                        de comunicação e personaliza mensagens para <strong>maximizar pagamentos</strong>.
                      </p>
                      <div className="flex items-center justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-gray-700 text-sm">Sempre ativa</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                          <span className="text-gray-700 text-sm">Aprende continuamente</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-gray-700 text-sm">100% automática</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 1: Análise Comportamental (6-11s) */}
                  <div 
                    className="transform transition-all duration-500"
                    style={{
                      opacity: currentTime >= 6 && currentTime < 11 ? 1 : 0,
                      transform: currentTime >= 6 && currentTime < 11 ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 px-4 py-2 rounded-full mb-3">
                          <span className="text-blue-700 font-semibold text-sm">PASSO 1</span>
                        </div>
                        <h3 className="text-gray-900 text-2xl font-bold mb-2">Análise Comportamental Inteligente</h3>
                        <p className="text-gray-600">A IA estuda cada cliente antes de contactar</p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-gray-900 font-semibold text-sm mb-1">Histórico</p>
                          <p className="text-gray-600 text-xs">Analisa padrão de pagamentos anteriores</p>
                        </div>

                        <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-gray-900 font-semibold text-sm mb-1">Preferências</p>
                          <p className="text-gray-600 text-xs">Identifica canal e horário preferidos</p>
                        </div>

                        <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-gray-900 font-semibold text-sm mb-1">Tom Ideal</p>
                          <p className="text-gray-600 text-xs">Define se é formal ou amigável</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: 4 Canais Explicados (11-16s) */}
                  <div 
                    className="transform transition-all duration-500"
                    style={{
                      opacity: currentTime >= 11 && currentTime < 16 ? 1 : 0,
                      transform: currentTime >= 11 && currentTime < 16 ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-full mb-3">
                          <span className="text-emerald-700 font-semibold text-sm">PASSO 2</span>
                        </div>
                        <h3 className="text-gray-900 text-2xl font-bold mb-2">4 Canais de Comunicação</h3>
                        <p className="text-gray-600">A IA escolhe o canal ideal para cada cliente</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white border border-green-300 rounded-xl p-3.5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-semibold text-sm">WhatsApp</p>
                              <p className="text-green-600 text-xs">89% taxa de resposta</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs">Conversa natural, responde dúvidas em tempo real</p>
                        </div>

                        <div className="bg-white border border-blue-300 rounded-xl p-3.5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-semibold text-sm">Email</p>
                              <p className="text-blue-600 text-xs">76% taxa de abertura</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs">Mensagens profissionais com fatura em anexo</p>
                        </div>

                        <div className="bg-white border border-purple-300 rounded-xl p-3.5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <Send className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-semibold text-sm">SMS</p>
                              <p className="text-purple-600 text-xs">98% taxa de leitura</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs">Lembretes curtos e diretos para urgências</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl p-3.5 relative">
                          <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            DESTAQUE
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                              <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-semibold text-sm">Voz com IA</p>
                              <p className="text-orange-600 text-xs font-bold">67% taxa de conversão!</p>
                            </div>
                          </div>
                          <p className="text-gray-700 text-xs font-medium">Chamadas telefónicas com voz natural portuguesa</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: Como funciona a VOZ (16-21s) */}
                  <div 
                    className="transform transition-all duration-500"
                    style={{
                      opacity: currentTime >= 16 && currentTime < 21 ? 1 : 0,
                      transform: currentTime >= 16 && currentTime < 21 ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-400 px-4 py-2 rounded-full mb-3">
                          <Mic className="w-4 h-4 text-orange-700" />
                          <span className="text-orange-700 font-semibold text-sm">PASSO 3 - NOSSA INOVAÇÃO</span>
                        </div>
                        <h3 className="text-gray-900 text-2xl font-bold mb-2">Como Funciona a Voz com IA?</h3>
                        <p className="text-gray-600">A tecnologia mais avançada de cobrança em Portugal</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white font-bold text-sm">1</span>
                              </div>
                              <div>
                                <p className="text-gray-900 font-semibold text-sm mb-1">Voz Natural</p>
                                <p className="text-gray-700 text-xs">Tecnologia de síntese de voz em português de Portugal, indistinguível de humano</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white font-bold text-sm">2</span>
                              </div>
                              <div>
                                <p className="text-gray-900 font-semibold text-sm mb-1">Compreensão Real</p>
                                <p className="text-gray-700 text-xs">Entende respostas do cliente e adapta a conversa em tempo real</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white font-bold text-sm">3</span>
                              </div>
                              <div>
                                <p className="text-gray-900 font-semibold text-sm mb-1">Negociação</p>
                                <p className="text-gray-700 text-xs">Negocia prazos, oferece planos de pagamento e resolve dúvidas</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-orange-200">
                            <p className="text-gray-900 font-semibold text-sm mb-3">Exemplo de Conversa:</p>
                            <div className="space-y-2 text-xs">
                              <div className="flex items-start gap-2">
                                <Mic className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700"><strong>IA:</strong> "Olá João, boa tarde! Sou a assistente do Tá Pago. Ligo para falar sobre a fatura de 250€."</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Phone className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700"><strong>Cliente:</strong> "Olá, posso pagar na próxima semana?"</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Mic className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700"><strong>IA:</strong> "Claro! Posso agendar para dia 20? Vou enviar confirmação por WhatsApp."</p>
                              </div>
                              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-orange-200">
                                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                                <span className="text-orange-700 font-semibold text-xs">100% automático e natural!</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 4: Diferencial Tecnológico (21-28s) */}
                  <div 
                    className="transform transition-all duration-500"
                    style={{
                      opacity: currentTime >= 21 && currentTime < 28 ? 1 : 0,
                      transform: currentTime >= 21 && currentTime < 28 ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-300 px-4 py-2 rounded-full mb-3">
                          <span className="text-purple-700 font-semibold text-sm">PASSO 4</span>
                        </div>
                        <h3 className="text-gray-900 text-2xl font-bold mb-2">Porque Somos Diferentes?</h3>
                        <p className="text-gray-600">Tecnologia que outras plataformas não têm</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-emerald-300 rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                              <Cpu className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-gray-900 font-bold">Machine Learning</h4>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            A IA <strong>aprende</strong> com cada interação e melhora continuamente a estratégia de cobrança
                          </p>
                        </div>

                        <div className="bg-white border-2 border-blue-300 rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                              <Layers className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-gray-900 font-bold">Multi-Canal</h4>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Combina <strong>4 canais</strong> de forma inteligente, escalando de WhatsApp até VOZ automaticamente
                          </p>
                        </div>

                        <div className="bg-white border-2 border-purple-300 rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                              <Brain className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-gray-900 font-bold">Personalização</h4>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            Cada mensagem é <strong>única</strong>, adaptada ao perfil, histórico e momento do cliente
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                              <Mic className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-gray-900 font-bold">Voz Conversacional</h4>
                          </div>
                          <p className="text-gray-900 text-sm leading-relaxed font-medium">
                            Único sistema em Portugal com <strong>chamadas de voz IA</strong> que realmente conversa e negocia!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 5: Resultados Comparativos (28-34s) */}
                  <div 
                    className="transform transition-all duration-500"
                    style={{
                      opacity: currentTime >= 28 && currentTime < 34 ? 1 : 0,
                      transform: currentTime >= 28 && currentTime < 34 ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-full mb-3">
                          <span className="text-emerald-700 font-semibold text-sm">PASSO 5</span>
                        </div>
                        <h3 className="text-gray-900 text-2xl font-bold mb-2">Resultados Comprovados</h3>
                        <p className="text-gray-600">Antes vs Depois de usar nossa IA</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Antes */}
                        <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-5">
                          <p className="text-gray-900 font-bold text-center mb-4">❌ Sem IA (Manual)</p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Taxa de cobrança</span>
                              <span className="text-red-600 font-bold">42%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Tempo médio</span>
                              <span className="text-red-600 font-bold">15 dias</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Trabalho manual</span>
                              <span className="text-red-600 font-bold">8h/dia</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Custo por fatura</span>
                              <span className="text-red-600 font-bold">12€</span>
                            </div>
                          </div>
                        </div>

                        {/* Depois */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-400 rounded-xl p-5 shadow-lg">
                          <p className="text-gray-900 font-bold text-center mb-4">✅ Com IA Tá Pago</p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Taxa de cobrança</span>
                              <span className="text-emerald-600 font-bold text-lg">89%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Tempo médio</span>
                              <span className="text-emerald-600 font-bold text-lg">3 dias</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Trabalho manual</span>
                              <span className="text-emerald-600 font-bold text-lg">0h/dia</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-sm">Custo por fatura</span>
                              <span className="text-emerald-600 font-bold text-lg">0,50€</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl p-4 text-center">
                        <p className="font-bold text-lg">+112% de melhoria na taxa de recuperação!</p>
                      </div>
                    </div>
                  </div>

                  {/* FINAL: Call to Action (34-40s) */}
                  <div 
                    className="transform transition-all duration-500"
                    style={{
                      opacity: currentTime >= 34 ? 1 : 0,
                      transform: currentTime >= 34 ? 'scale(1)' : 'scale(0.95)'
                    }}
                  >
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl shadow-2xl shadow-emerald-500/50 mb-2 animate-pulse">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-gray-900 text-3xl font-bold tracking-tight">
                        Pronto para automatizar?
                      </h2>
                      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Comece <strong>gratuitamente</strong> hoje e veja a IA trabalhar para você em minutos
                      </p>
                      
                      <div className="flex items-center justify-center gap-8 pt-4">
                        <div className="text-center">
                          <p className="text-emerald-600 text-3xl font-bold">0€</p>
                          <p className="text-gray-600 text-sm">Para começar</p>
                        </div>
                        <div className="text-center">
                          <p className="text-cyan-600 text-3xl font-bold">5min</p>
                          <p className="text-gray-600 text-sm">Configuração</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-600 text-3xl font-bold">24/7</p>
                          <p className="text-gray-600 text-sm">IA trabalhando</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Play Overlay */}
            {!isPlaying && (
              <div 
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-30 animate-ping" />
                  <div className="relative bg-gradient-to-br from-emerald-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transform group-hover:scale-110 transition-all duration-300 border-4 border-white">
                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="relative bg-gradient-to-r from-gray-50 via-emerald-50/20 to-cyan-50/20 border-t border-gray-200 px-6 py-4">
            <div 
              onClick={handleProgressClick}
              className="w-full h-1.5 bg-gray-200 rounded-full mb-4 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full transition-all relative shadow-md"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handlePlayPause}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={handleMuteToggle}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${
                    isMuted 
                      ? 'bg-gray-200 border-gray-300 text-gray-500' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <div className="text-gray-600 text-sm font-light ml-1">
                  {formatTime(currentTime)} <span className="text-gray-400">/</span> {formatTime(duration)}
                </div>
              </div>

              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 transition-all">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}