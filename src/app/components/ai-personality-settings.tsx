import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { 
  Brain,
  Zap,
  Heart,
  Shield,
  Smile,
  Sparkles,
  Volume2,
  VolumeX,
  Check,
  Edit,
  RotateCcw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface PersonalityTone {
  id: string;
  name: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  example: string;
  creativity: number; // 0-100
  formality: number; // 0-100
  enthusiasm: number; // 0-100
}

const PRESET_TONES: PersonalityTone[] = [
  {
    id: 'direct',
    name: 'DIRETO E OBJETIVO',
    icon: Zap,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-600',
    description: 'Comunicação clara, sem rodeios. Vai direto ao ponto.',
    example: 'Olá João, vi seu perfil no LinkedIn. Temos uma oportunidade que pode interessar. Podemos falar?',
    creativity: 30,
    formality: 70,
    enthusiasm: 50,
  },
  {
    id: 'intimate',
    name: 'ÍNTIMO',
    icon: Heart,
    color: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-600',
    description: 'Cria conexão pessoal. Empático e próximo.',
    example: 'Olá João! Adorei conhecer sua trajetória na KW. Como você está? Gostaria muito de conversar sobre algo que pode te interessar...',
    creativity: 60,
    formality: 30,
    enthusiasm: 80,
  },
  {
    id: 'cautious',
    name: 'CAUTELOSO',
    icon: Shield,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Profissional e respeitoso. Constrói confiança gradualmente.',
    example: 'Bom dia, João. Permita-me apresentar-me: sou da KW Portugal. Analisei seu perfil e acredito que possa ter interesse em nossa proposta. Quando seria conveniente conversarmos?',
    creativity: 40,
    formality: 90,
    enthusiasm: 40,
  },
  {
    id: 'casual',
    name: 'DESPOJADO',
    icon: Smile,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-amber-600',
    description: 'Descontraído e leve. Quebra a formalidade.',
    example: 'E aí João! Vi que você manda bem no mercado imobiliário 👏 Bora trocar uma ideia? Tenho algo legal pra te mostrar!',
    creativity: 70,
    formality: 20,
    enthusiasm: 70,
  },
  {
    id: 'fun',
    name: 'DIVERTIDO',
    icon: Sparkles,
    color: 'text-green-600',
    gradient: 'from-green-500 to-emerald-600',
    description: 'Energético e criativo. Usa humor e emojis.',
    example: '🎯 João! Acabei de descobrir seu perfil e fiquei tipo "UAU!" 🚀 Você precisa conhecer o que temos aqui na KW! Quando podemos bater um papo? ☕✨',
    creativity: 95,
    formality: 10,
    enthusiasm: 100,
  },
];

interface AIPersonalitySettingsProps {
  onSave?: (tone: PersonalityTone) => void;
}

export function AIPersonalitySettings({ onSave }: AIPersonalitySettingsProps) {
  const [selectedTone, setSelectedTone] = useState<PersonalityTone>(PRESET_TONES[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSelectTone = (tone: PersonalityTone) => {
    setSelectedTone(tone);
    setIsCustom(false);
    setCustomPrompt('');
    toast.success(`Tom "${tone.name}" selecionado!`);
  };

  const handleCustomize = () => {
    setIsCustom(true);
    setCustomPrompt(selectedTone.example);
  };

  const handleReset = () => {
    setIsCustom(false);
    setCustomPrompt('');
    setSelectedTone(PRESET_TONES[0]);
  };

  const handleSave = () => {
    const toneToSave = isCustom 
      ? {
          ...selectedTone,
          name: 'PERSONALIZADO',
          example: customPrompt,
        }
      : selectedTone;

    // Salva no localStorage
    localStorage.setItem('ai-personality-tone', JSON.stringify(toneToSave));
    
    if (onSave) onSave(toneToSave);
    
    toast.success('✅ Personalidade da IA salva!', {
      description: `Tom: ${toneToSave.name}`,
    });
  };

  const handlePlayAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    setIsPlaying(true);
    
    // Simula leitura do texto
    const textToRead = isCustom ? customPrompt : selectedTone.example;
    
    // Usa Web Speech API para ler o texto
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('Erro ao reproduzir áudio');
      };
      
      window.speechSynthesis.speak(utterance);
      
      toast.info('🔊 Reproduzindo preview...', {
        description: 'Ouça como a IA irá se comunicar',
      });
    } else {
      toast.error('Seu navegador não suporta síntese de voz');
      setIsPlaying(false);
    }
  };

  const handleSliderChange = (key: 'creativity' | 'formality' | 'enthusiasm', value: number) => {
    setSelectedTone(prev => ({ ...prev, [key]: value }));
    setIsCustom(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Ajustes de Personalidade da IA</CardTitle>
              <CardDescription className="mt-1">
                Escolha como a IA irá se comunicar com seus leads
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tons Pré-definidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {PRESET_TONES.map((tone) => {
          const Icon = tone.icon;
          const isSelected = selectedTone.id === tone.id && !isCustom;
          
          return (
            <button
              key={tone.id}
              onClick={() => handleSelectTone(tone)}
              className={`relative p-5 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${
                isSelected 
                  ? 'border-purple-500 shadow-lg shadow-purple-200 bg-gradient-to-br from-purple-50 to-blue-50' 
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`w-14 h-14 bg-gradient-to-br ${tone.gradient} rounded-xl flex items-center justify-center shadow-lg mb-3 mx-auto`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className={`font-bold text-sm mb-2 ${tone.color}`}>
                {tone.name}
              </h3>
              
              <p className="text-xs text-gray-600 leading-relaxed">
                {tone.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Preview e Customização */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                {isCustom ? 'Personalização Customizada' : `Preview: ${selectedTone.name}`}
              </CardTitle>
              {isCustom && (
                <Badge variant="outline" className="border-purple-300 text-purple-700">
                  <Edit className="w-3 h-3 mr-1" />
                  Custom
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Indicador de Criatividade (pequeno, no canto) */}
              <div className="relative group">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full animate-pulse" />
                <Badge variant="outline" className="border-purple-300 text-purple-700 text-xs px-2 cursor-help">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {selectedTone.creativity}%
                </Badge>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <div className="flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Nível de Criatividade da IA
                    </div>
                    <div className="text-gray-400 mt-1">
                      {selectedTone.creativity < 40 && '🎯 Conservador e previsível'}
                      {selectedTone.creativity >= 40 && selectedTone.creativity < 70 && '⚖️ Balanceado'}
                      {selectedTone.creativity >= 70 && '🚀 Criativo e inovador'}
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handlePlayAudio}
                className={`gap-2 ${isPlaying ? 'border-green-500 bg-green-50' : ''}`}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Parar
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Ouvir Exemplo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {/* Exemplo/Customização */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {isCustom ? 'Mensagem Personalizada:' : 'Exemplo de Mensagem:'}
              </label>
              {!isCustom && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCustomize}
                  className="gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Edit className="w-3 h-3" />
                  Personalizar
                </Button>
              )}
            </div>
            
            {isCustom ? (
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
                className="border-2 border-purple-200 focus:border-purple-400"
                placeholder="Escreva aqui como você quer que a IA se comunique..."
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{selectedTone.example}"
                </p>
              </div>
            )}
          </div>

          {/* Sliders de Ajuste Fino */}
          {isCustom && (
            <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-purple-900">
                <Sparkles className="w-4 h-4" />
                Ajuste Fino dos Parâmetros
              </h4>
              
              <div className="space-y-4">
                {/* Criatividade */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-700">
                      Criatividade
                    </label>
                    <span className="text-xs font-bold text-purple-600">
                      {selectedTone.creativity}%
                    </span>
                  </div>
                  <Slider
                    value={[selectedTone.creativity]}
                    onValueChange={([value]) => handleSliderChange('creativity', value)}
                    min={0}
                    max={100}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>🎯 Conservador</span>
                    <span>🚀 Inovador</span>
                  </div>
                </div>

                {/* Formalidade */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-700">
                      Formalidade
                    </label>
                    <span className="text-xs font-bold text-blue-600">
                      {selectedTone.formality}%
                    </span>
                  </div>
                  <Slider
                    value={[selectedTone.formality]}
                    onValueChange={([value]) => handleSliderChange('formality', value)}
                    min={0}
                    max={100}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>😎 Casual</span>
                    <span>👔 Profissional</span>
                  </div>
                </div>

                {/* Entusiasmo */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-700">
                      Entusiasmo
                    </label>
                    <span className="text-xs font-bold text-green-600">
                      {selectedTone.enthusiasm}%
                    </span>
                  </div>
                  <Slider
                    value={[selectedTone.enthusiasm]}
                    onValueChange={([value]) => handleSliderChange('enthusiasm', value)}
                    min={0}
                    max={100}
                    step={5}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>😌 Neutro</span>
                    <span>🎉 Energético</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </Button>
            
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2"
            >
              <Check className="w-4 h-4" />
              Salvar Personalidade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">💡 Como funciona:</p>
              <ul className="space-y-1 text-xs">
                <li>• A IA adapta seu tom de comunicação baseado nas suas configurações</li>
                <li>• Use os tons pré-definidos para começar rapidamente</li>
                <li>• Personalize completamente para criar seu próprio estilo</li>
                <li>• Ouça o preview para ter certeza antes de salvar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
