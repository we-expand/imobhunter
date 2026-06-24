import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VoicePreviewPlayerProps {
  voiceTone: string;
  text: string;
}

export function VoicePreviewPlayer({ voiceTone, text }: VoicePreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);

  // Gera barras de onda aleatórias
  useEffect(() => {
    const generateWaveform = () => {
      const bars = Array.from({ length: 40 }, () => Math.random());
      setWaveformBars(bars);
    };

    generateWaveform();

    // Atualiza as ondas enquanto estiver tocando
    let interval: any;
    if (isPlaying) {
      interval = setInterval(generateWaveform, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      toast.info(`🎙️ Reproduzindo tom: ${voiceTone}`, {
        description: 'Pré-visualização de voz da IA'
      });
      
      // Para automaticamente após 3 segundos (simulação)
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Visualizador de Ondas Sonoras */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 overflow-hidden">
        {/* Efeito de brilho de fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 animate-pulse" />
        
        {/* Ondas Sonoras Animadas */}
        <div className="relative z-10 flex items-center justify-center gap-1 h-32">
          {waveformBars.map((height, index) => (
            <div
              key={index}
              className={`
                w-1.5 rounded-full transition-all duration-150
                ${isPlaying 
                  ? 'bg-gradient-to-t from-cyan-400 via-blue-400 to-purple-400' 
                  : 'bg-gradient-to-t from-gray-500 via-gray-400 to-gray-500'
                }
              `}
              style={{
                height: isPlaying 
                  ? `${Math.max(20, height * 100)}%` 
                  : '20%',
                opacity: isPlaying ? 0.8 + (height * 0.2) : 0.3,
                transform: isPlaying ? `scaleY(${0.5 + height})` : 'scaleY(0.5)',
                animation: isPlaying ? `wave ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate` : 'none',
                animationDelay: `${index * 0.02}s`
              }}
            />
          ))}
        </div>

        {/* Texto de Preview */}
        <div className="relative z-10 mt-4 text-center">
          <p className="text-white/90 text-sm italic line-clamp-2">
            "{text.substring(0, 100)}..."
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          onClick={handlePlayPause}
          className={`flex-1 ${
            isPlaying
              ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pausar Preview
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Ouvir Preview
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => setIsMuted(!isMuted)}
          className="w-14"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-600" />
          ) : (
            <Volume2 className="w-5 h-5 text-blue-600" />
          )}
        </Button>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </div>
  );
}
