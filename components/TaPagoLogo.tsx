interface TaPagoLogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TaPagoLogo({ variant = 'full', size = 'md', className = '' }: TaPagoLogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-xl' },
    md: { icon: 'w-10 h-10', text: 'text-2xl' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Ícone Tecnológico */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
        
        {/* Ícone SVG */}
        <div className={`relative ${currentSize.icon} flex-shrink-0`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Fundo com gradiente */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              
              <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>
            </defs>
            
            {/* Hexágono tecnológico de fundo */}
            <path 
              d="M50 5 L85 25 L85 65 L50 85 L15 65 L15 25 Z" 
              fill="url(#logoGradient)"
              className="drop-shadow-lg"
            />
            
            {/* Símbolo de Check (Pago) estilizado */}
            <path 
              d="M30 50 L42 62 L70 34" 
              stroke="url(#checkGradient)" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
              className="drop-shadow-md"
            />
            
            {/* Elementos tecnológicos (circuitos) */}
            <circle cx="25" cy="30" r="2" fill="white" opacity="0.8" />
            <circle cx="75" cy="30" r="2" fill="white" opacity="0.8" />
            <circle cx="25" cy="70" r="2" fill="white" opacity="0.8" />
            <circle cx="75" cy="70" r="2" fill="white" opacity="0.8" />
            
            {/* Linhas de circuito */}
            <line x1="25" y1="30" x2="30" y2="40" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="75" y1="30" x2="70" y2="40" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="25" y1="70" x2="35" y2="65" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="75" y1="70" x2="65" y2="65" stroke="white" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
      </div>

      {/* Texto do Logotipo */}
      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className={`${currentSize.text} font-bold tracking-tight`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600">
              Tá Pago
            </span>
            <span className="text-emerald-600">.pt</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5 tracking-wide uppercase font-medium">
            Cobranças Inteligentes
          </div>
        </div>
      )}
    </div>
  );
}
