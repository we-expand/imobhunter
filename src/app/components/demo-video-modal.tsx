import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Brain, 
  MessageCircle, 
  Mail, 
  Smartphone,
  TrendingUp,
  Users,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Rocket
} from 'lucide-react';
import { Button } from './ui/button';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: () => void;
}

export function DemoVideoModal({ isOpen, onClose, onSignUp }: DemoVideoModalProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const scenes = [
    {
      id: 0,
      title: 'Lead Generation Autónomo',
      subtitle: 'IA que trabalha 24/7 para si',
      icon: Rocket,
      color: 'from-blue-600 to-cyan-600',
      description: 'Busca inteligente em múltiplas fontes',
      duration: 5000,
    },
    {
      id: 1,
      title: 'Busca Inteligente Multi-API',
      subtitle: '9 APIs integradas em tempo real',
      icon: Search,
      color: 'from-purple-600 to-pink-600',
      description: 'Apollo • Hunter • LinkedIn • PDL',
      duration: 5000,
    },
    {
      id: 2,
      title: 'Qualificação por IA',
      subtitle: '5 clusters de segmentação',
      icon: Brain,
      color: 'from-orange-600 to-red-600',
      description: 'Investidores • High-End • Relocation',
      duration: 5000,
    },
    {
      id: 3,
      title: 'Cadências Multi-Canal',
      subtitle: 'Email + SMS + WhatsApp',
      icon: MessageCircle,
      color: 'from-green-600 to-emerald-600',
      description: 'Aquecimento automático personalizado',
      duration: 5000,
    },
    {
      id: 4,
      title: 'Pipeline Inteligente',
      subtitle: 'Frio → Em Conversa → Qualificado',
      icon: TrendingUp,
      color: 'from-indigo-600 to-blue-600',
      description: 'Handover no momento perfeito',
      duration: 5000,
    },
    {
      id: 5,
      title: 'Métricas em Tempo Real',
      subtitle: 'Dashboard com KPIs ao vivo',
      icon: BarChart3,
      color: 'from-violet-600 to-purple-600',
      description: 'Controle total da autonomia da IA',
      duration: 5000,
    },
    {
      id: 6,
      title: 'Conforme RGPD',
      subtitle: 'Privacidade e segurança garantidas',
      icon: CheckCircle,
      color: 'from-teal-600 to-cyan-600',
      description: 'Pronto para o mercado português',
      duration: 5000,
    },
    {
      id: 7,
      title: 'Comece Agora',
      subtitle: 'Cadastre-se gratuitamente',
      icon: Sparkles,
      color: 'from-pink-600 to-rose-600',
      description: 'Teste sem compromisso',
      duration: 5000,
    },
  ];

  useEffect(() => {
    if (isPlaying && currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene((prev) => prev + 1);
      }, scenes[currentScene].duration);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentScene === scenes.length - 1) {
      // Fim da apresentação
      setTimeout(() => {
        setIsPlaying(false);
        setCurrentScene(0);
      }, scenes[currentScene].duration);
    }
  }, [isPlaying, currentScene]);

  useEffect(() => {
    if (isOpen) {
      // Criar elemento de áudio com música de fundo suave e tecnológica
      // URL de música livre de direitos autorais - Tech/Corporate
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3');
      audio.volume = 0.25; // Volume mais baixo para não distrair
      audio.loop = false;
      setAudioElement(audio);
    } else {
      // Parar áudio ao fechar
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }
    
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [isOpen]);

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentScene(0);
    if (audioElement) {
      audioElement.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioElement) {
      audioElement.pause();
    }
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setIsPlaying(true);
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play().catch(err => console.log('Audio play failed:', err));
    }
  };

  if (!isOpen) return null;

  const currentSceneData = scenes[currentScene];
  const SceneIcon = currentSceneData.icon;
  const progress = ((currentScene + 1) / scenes.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Video container */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          {/* 16:9 aspect ratio container */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              
              {/* Animated grid background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  animation: 'gridMove 20s linear infinite'
                }} />
              </div>

              {/* Scanning line effect */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                animate={{ y: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Scene content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="relative z-10 flex flex-col items-center justify-center text-center px-8"
                >
                  {/* Icon with gradient background */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className={`w-32 h-32 mb-8 rounded-3xl bg-gradient-to-br ${currentSceneData.color} flex items-center justify-center shadow-2xl`}
                  >
                    <SceneIcon className="w-16 h-16 text-white" strokeWidth={1.5} />
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl font-bold text-white mb-4"
                  >
                    {currentSceneData.title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl text-gray-300 mb-3"
                  >
                    {currentSceneData.subtitle}
                  </motion.p>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${currentSceneData.color} text-white font-medium`}
                  >
                    {currentSceneData.description}
                  </motion.div>

                  {/* CTA especial na última cena */}
                  {currentScene === scenes.length - 1 && onSignUp && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-8"
                    >
                      <Button
                        onClick={() => {
                          onSignUp();
                          onClose();
                        }}
                        size="lg"
                        className="bg-white text-pink-600 hover:bg-gray-100 px-10 py-6 text-lg gap-3 shadow-2xl"
                      >
                        <Sparkles className="w-6 h-6" />
                        Começar Agora Grátis
                        <ArrowRight className="w-6 h-6" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Floating particles */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${currentSceneData.color}`}
                      initial={{ 
                        x: Math.random() * 400 - 200, 
                        y: Math.random() * 300 - 150,
                        opacity: 0 
                      }}
                      animate={{ 
                        y: [null, Math.random() * -100 - 50],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 2 + Math.random() * 2, 
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Scene indicator */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4">
                {scenes.map((scene, idx) => (
                  <motion.div
                    key={scene.id}
                    className={`h-1 rounded-full transition-all ${
                      idx < currentScene 
                        ? `bg-gradient-to-r ${currentSceneData.color}`
                        : idx === currentScene
                        ? 'bg-white'
                        : 'bg-gray-600'
                    }`}
                    style={{ width: idx === currentScene ? '48px' : '24px' }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <motion.div
              className={`h-full bg-gradient-to-r ${currentSceneData.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {!isPlaying ? (
            <Button
              onClick={handlePlay}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 gap-2"
            >
              <Zap className="w-5 h-5" />
              {currentScene === 0 ? 'Iniciar Demo' : 'Continuar'}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8"
            >
              Pausar
            </Button>
          )}
          
          <Button
            onClick={handleRestart}
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Reiniciar
          </Button>

          <div className="text-white text-sm ml-4">
            {currentScene + 1} / {scenes.length}
          </div>
        </div>
      </motion.div>

      {/* CSS para animação */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gridMove {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(40px, 40px);
            }
          }
        `
      }} />
    </div>
  );
}