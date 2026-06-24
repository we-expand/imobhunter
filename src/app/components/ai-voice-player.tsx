import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  RotateCcw,
  Sparkles,
  Mic,
  Waves
} from 'lucide-react';
import { toast } from 'sonner';

interface AIVoicePlayerProps {
  title?: string;
  description?: string;
  voiceType?: string;
}

export function AIVoicePlayer({ 
  title = "Exemplo de Voz da IA",
  description = "Ouça como a IA soa em uma chamada real",
  voiceType = "Profissional Feminina"
}: AIVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // 30 segundos de exemplo
  const [isMuted, setIsMuted] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const animationRef = useRef<number>();

  // Gera dados de waveform (ondas sonoras) animados
  useEffect(() => {
    // Gera 60 barras de onda
    const generateWaveform = () => {
      const data = Array.from({ length: 60 }, (_, i) => {
        if (isPlaying) {
          // Animação dinâmica quando está tocando
          const baseHeight = Math.sin(i / 5 + currentTime) * 30 + 50;
          const variation = Math.sin(i / 3 + currentTime * 2) * 20;
          return Math.abs(baseHeight + variation);
        } else {
          // Estático quando pausado
          const baseHeight = Math.sin(i / 5) * 30 + 50;
          return Math.abs(baseHeight);
        }
      });
      setWaveformData(data);
    };

    generateWaveform();
    
    if (isPlaying) {
      const interval = setInterval(generateWaveform, 50);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTime]);

  // Simula reprodução de áudio
  useEffect(() => {
    if (isPlaying && currentTime < duration) {
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isPlaying, currentTime, duration]);

  const handlePlayPause = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast.success('▶️ Reproduzindo exemplo de voz da IA');
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    toast.info('🔄 Áudio reiniciado');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? '🔊 Som ativado' : '🔇 Som desativado');
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Badge className="bg-purple-600 gap-1">
            <Mic className="w-3 h-3" />
            {voiceType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Waveform Visualization */}
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-lg" />
          
          {/* Waveform */}
          <div className="relative p-6 flex items-center justify-center gap-1 h-32">
            {waveformData.map((height, index) => {
              const isPassed = (index / waveformData.length) * 100 < progress;
              return (
                <div
                  key={index}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isPassed 
                      ? 'bg-gradient-to-t from-purple-600 to-blue-600' 
                      : 'bg-gray-300'
                  }`}
                  style={{ 
                    height: `${height}%`,
                    opacity: isPlaying ? 1 : 0.7
                  }}
                />
              );
            })}
          </div>

          {/* Progress indicator */}
          <div 
            className="absolute top-0 left-0 h-full bg-purple-600/10 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRestart}
            disabled={currentTime === 0}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Audio Details */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Tom</p>
              <p className="font-medium text-purple-600">Natural</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Velocidade</p>
              <p className="font-medium text-blue-600">1.0x</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-xs text-gray-500 mb-1">Qualidade</p>
              <p className="font-medium text-green-600">HD</p>
            </div>
          </div>
        </div>

        {/* Example Script */}
        <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-2">
            <Mic className="w-3 h-3" />
            Transcrição do áudio:
          </p>
          <p className="text-sm text-gray-700 italic">
            "Olá! Aqui é a Sofia da Keller Williams Portugal. Vi que demonstrou interesse em imóveis na zona de Cascais. 
            Temos algumas opções fantásticas que podem interessar. Tem alguns minutos para conversarmos?"
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2 text-sm">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span className="text-gray-700">Voz natural e humana</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span className="text-gray-700">Sotaque português</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span className="text-gray-700">Entonação profissional</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span className="text-gray-700">Pausas naturais</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
