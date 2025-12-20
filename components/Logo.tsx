import { CheckCircle2, Sparkles } from 'lucide-react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ variant = 'full', size = 'md', showTagline = false, className = '' }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      tagline: 'text-xs',
      sparkle: 'w-3 h-3'
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-2xl',
      tagline: 'text-sm',
      sparkle: 'w-4 h-4'
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-4xl',
      tagline: 'text-base',
      sparkle: 'w-5 h-5'
    },
    xl: {
      icon: 'w-16 h-16',
      text: 'text-5xl',
      tagline: 'text-lg',
      sparkle: 'w-6 h-6'
    }
  };

  const currentSize = sizes[size];

  // Apenas ícone
  if (variant === 'icon') {
    return (
      <div className={`relative ${className}`}>
        <div className="relative">
          {/* Círculo de fundo com gradiente */}
          <div className={`${currentSize.icon} rounded-full bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg`}>
            <CheckCircle2 className={`${currentSize.icon === 'w-6 h-6' ? 'w-4 h-4' : currentSize.icon === 'w-8 h-8' ? 'w-5 h-5' : currentSize.icon === 'w-12 h-12' ? 'w-8 h-8' : 'w-10 h-10'} text-white`} strokeWidth={3} />
          </div>
          {/* Sparkle no canto */}
          <Sparkles className={`${currentSize.sparkle} text-yellow-400 absolute -top-1 -right-1`} fill="currentColor" />
        </div>
      </div>
    );
  }

  // Versão minimal (ícone + sigla)
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <div className={`${currentSize.icon} rounded-full bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg`}>
            <CheckCircle2 className={`${currentSize.icon === 'w-6 h-6' ? 'w-4 h-4' : currentSize.icon === 'w-8 h-8' ? 'w-5 h-5' : currentSize.icon === 'w-12 h-12' ? 'w-8 h-8' : 'w-10 h-10'} text-white`} strokeWidth={3} />
          </div>
          <Sparkles className={`${currentSize.sparkle} text-yellow-400 absolute -top-1 -right-1`} fill="currentColor" />
        </div>
        <span className={`${currentSize.text} font-black bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent`}>
          TP
        </span>
      </div>
    );
  }

  // Versão completa
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-3">
        {/* Ícone */}
        <div className="relative">
          <div className={`${currentSize.icon} rounded-full bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}>
            <CheckCircle2 className={`${currentSize.icon === 'w-6 h-6' ? 'w-4 h-4' : currentSize.icon === 'w-8 h-8' ? 'w-5 h-5' : currentSize.icon === 'w-12 h-12' ? 'w-8 h-8' : 'w-10 h-10'} text-white`} strokeWidth={3} />
          </div>
          <Sparkles className={`${currentSize.sparkle} text-yellow-400 absolute -top-1 -right-1 animate-pulse`} fill="currentColor" />
        </div>

        {/* Texto */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className={`${currentSize.text} font-black bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent leading-none`}>
              Tá Pago
            </span>
            <span className={`${currentSize.text === 'text-lg' ? 'text-sm' : currentSize.text === 'text-2xl' ? 'text-base' : currentSize.text === 'text-4xl' ? 'text-xl' : 'text-2xl'} font-bold text-emerald-600 leading-none`}>
              .pt
            </span>
          </div>
          
          {showTagline && (
            <p className={`${currentSize.tagline} text-slate-600 font-medium mt-0.5`}>
              Cobrança inteligente com IA
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de logotipo para tela de login/splash
export function LogoHero() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ícone grande com animação */}
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-pulse">
          <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
        </div>
        <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" fill="currentColor" />
        {/* Círculos decorativos */}
        <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200 via-cyan-200 to-blue-200 rounded-3xl opacity-20 blur-xl -z-10"></div>
      </div>

      {/* Texto do logo */}
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-2 mb-2">
          <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Tá Pago
          </h1>
          <span className="text-3xl font-bold text-emerald-600">
            .pt
          </span>
        </div>
        <p className="text-xl text-slate-600 font-medium">
          Cobrança inteligente com IA
        </p>
      </div>
    </div>
  );
}

// Favicon/Logo pequeno para navegador
export function LogoFavicon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Círculo gradiente */}
      <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
      
      {/* Check */}
      <path 
        d="M9 16L14 21L23 12" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Sparkle */}
      <path 
        d="M25 7L26 9L28 10L26 11L25 13L24 11L22 10L24 9L25 7Z" 
        fill="#FCD34D"
      />
      
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
