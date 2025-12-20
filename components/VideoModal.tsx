import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  useEffect(() => {
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

  if (!isOpen) return null;

  // Se não houver URL de vídeo, usa um vídeo de demonstração do YouTube
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";
  const embedUrl = videoUrl || defaultVideoUrl;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">Fechar (ESC)</span>
            <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          </div>
        </button>

        {/* Container do Vídeo */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30">
          <div className="relative aspect-video">
            <iframe
              src={embedUrl}
              title="Vídeo Explicativo - Tá Pago.pt"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Informações abaixo do vídeo */}
        <div className="mt-6 text-center">
          <h3 className="text-white text-xl mb-2">Tá Pago.pt - Cobranças Inteligentes com IA</h3>
          <p className="text-white/70 text-sm">
            Veja como automatizar todo o processo de cobrança com inteligência artificial
          </p>
        </div>
      </div>
    </div>
  );
}
