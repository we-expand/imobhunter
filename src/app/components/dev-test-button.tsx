import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Terminal } from 'lucide-react';

interface DevTestButtonProps {
  onClick: () => void;
}

export function DevTestButton({ onClick }: DevTestButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Mostrar apenas se Ctrl+Shift+T for pressionado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-xl animate-pulse-scale"
        size="lg"
      >
        <Terminal className="w-5 h-5 mr-2" />
        🧪 Painel de Testes
      </Button>
      <div className="mt-2 text-xs text-gray-500 text-center bg-white/90 rounded px-2 py-1">
        Ctrl+Shift+T para ocultar
      </div>
    </div>
  );
}