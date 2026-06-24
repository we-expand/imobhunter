import brainImage from 'figma:asset/0d194b869c5f10921b24883be46a0982ff67a805.png';

interface AIHeadAnimationProps {
  variant?: 'rotating' | 'standby' | 'brain' | 'pulse';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AIHeadAnimation({ variant = 'rotating', size = 'md' }: AIHeadAnimationProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  if (variant === 'rotating') {
    return (
      <div className={`${sizeClasses[size]} relative`}>
        {/* Cabeça de IA girando */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-spin"
          style={{ animationDuration: '3s' }}
        >
          {/* Círculo externo - orbital */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="1.5"
            strokeDasharray="10 5"
            opacity="0.4"
          />
          
          {/* Círculo médio */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="1"
            strokeDasharray="5 3"
            opacity="0.6"
          />
          
          {/* Cabeça principal */}
          <circle
            cx="50"
            cy="50"
            r="22"
            fill="url(#gradient3)"
            opacity="0.9"
          />
          
          {/* Olho esquerdo */}
          <ellipse
            cx="42"
            cy="45"
            rx="3"
            ry="4"
            fill="white"
            opacity="0.9"
          >
            <animate
              attributeName="ry"
              values="4;1;4"
              dur="3s"
              repeatCount="indefinite"
            />
          </ellipse>
          
          {/* Olho direito */}
          <ellipse
            cx="58"
            cy="45"
            rx="3"
            ry="4"
            fill="white"
            opacity="0.9"
          >
            <animate
              attributeName="ry"
              values="4;1;4"
              dur="3s"
              repeatCount="indefinite"
            />
          </ellipse>
          
          {/* Boca sorrindo - linha */}
          <path
            d="M 42 58 Q 50 62 58 58"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
          
          {/* Partículas de dados - pontos orbitais */}
          <circle cx="80" cy="50" r="2" fill="#60a5fa" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="20" cy="50" r="2" fill="#a78bfa" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="180 50 50"
              to="540 50 50"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle cx="50" cy="15" r="2" fill="#34d399" opacity="0.7">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="90 50 50"
              to="450 50 50"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Gradientes */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="gradient3">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl -z-10 animate-pulse" />
      </div>
    );
  }

  // Variant: standby
  if (variant === 'standby') {
    return (
      <div className={`${sizeClasses[size]} relative`}>
        {/* IA em Standby - pulso suave */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          {/* Hexágono externo - frame tech */}
          <polygon
            points="50,10 85,30 85,70 50,90 15,70 15,30"
            fill="none"
            stroke="url(#standbyGrad1)"
            strokeWidth="1"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.7;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </polygon>
          
          {/* Círculo médio - campo de energia */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="url(#standbyGrad2)"
            strokeWidth="0.5"
            strokeDasharray="3 2"
          >
            <animate
              attributeName="r"
              values="30;32;30"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Cabeça principal */}
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="url(#standbyGrad3)"
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Olhos - modo standby (semicerrados) */}
          <ellipse
            cx="42"
            cy="47"
            rx="2.5"
            ry="1.5"
            fill="white"
            opacity="0.6"
          />
          
          <ellipse
            cx="58"
            cy="47"
            rx="2.5"
            ry="1.5"
            fill="white"
            opacity="0.6"
          />
          
          {/* Linha de boca neutra */}
          <line
            x1="42"
            y1="58"
            x2="58"
            y2="58"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          
          {/* Indicador de standby - ponto pulsante */}
          <circle
            cx="50"
            cy="35"
            r="2"
            fill="#fbbf24"
          >
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Linhas de scan - efeito tech */}
          <line
            x1="30"
            y1="50"
            x2="35"
            y2="50"
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.4"
          >
            <animate
              attributeName="x1"
              values="30;35;30"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="35;40;35"
              dur="2s"
              repeatCount="indefinite"
            />
          </line>
          
          <line
            x1="65"
            y1="50"
            x2="70"
            y2="50"
            stroke="#60a5fa"
            strokeWidth="1"
            opacity="0.4"
          >
            <animate
              attributeName="x1"
              values="65;60;65"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="70;65;70"
              dur="2s"
              repeatCount="indefinite"
            />
          </line>
          
          {/* Gradientes */}
          <defs>
            <linearGradient id="standbyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6b7280" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="standbyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="standbyGrad3">
              <stop offset="0%" stopColor="#6b7280" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.5" />
            </radialGradient>
          </defs>
        </svg>
        
        {/* Glow effect standby */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/10 to-blue-400/10 rounded-full blur-lg -z-10 animate-pulse" 
             style={{ animationDuration: '3s' }} />
      </div>
    );
  }

  // Variant: brain
  if (variant === 'brain') {
    return (
      <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
        {/* Anéis orbitais animados */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-purple-400/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          <div className="absolute inset-4 rounded-full border border-blue-400/20 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        
        {/* Partículas flutuantes */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.4
              }}
            />
          ))}
        </div>
        
        {/* Imagem da cabeça de AI */}
        <div className="relative z-10 w-4/5 h-4/5">
          <img 
            src={brainImage} 
            alt="AI Brain"
            className="w-full h-full object-contain animate-pulse"
            style={{ 
              animationDuration: '3s',
              filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))'
            }}
          />
        </div>
        
        {/* Glow effect pulsante */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '3s' }} />
        
        {/* Scan line */}
        <div 
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{
            background: 'linear-gradient(0deg, transparent 0%, rgba(34, 211, 238, 0.1) 50%, transparent 100%)',
            animation: 'scan-vertical 4s linear infinite'
          }}
        />
      </div>
    );
  }

  // Variant: pulse - Energia em pulsos para Atividade
  if (variant === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} relative`}>
        {/* Ondas de energia expandindo */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-green-400"
              style={{
                animation: `ping 3s cubic-bezier(0, 0, 0.2, 1) infinite`,
                animationDelay: `${i * 1}s`,
                opacity: 0
              }}
            />
          ))}
        </div>
        
        {/* Core central com energia */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full animate-pulse shadow-2xl shadow-green-500/50">
            {/* Linhas de energia rotacionando */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            
            {/* Partículas de energia */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-24px)`,
                    animation: `pulse 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Círculos orbitais com dados */}
        <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#pulseGrad1)"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="url(#pulseGrad2)"
            strokeWidth="0.5"
            strokeDasharray="1 3"
            opacity="0.5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 50 50"
              to="0 50 50"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Data nodes orbitando */}
          {[0, 120, 240].map((angle, i) => (
            <g key={i}>
              <circle
                cx="50"
                cy="10"
                r="1.5"
                fill="#10b981"
                opacity="0.8"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`${angle} 50 50`}
                  to={`${angle + 360} 50 50`}
                  dur={`${3 + i}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="1.5;2.5;1.5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
          
          <defs>
            <linearGradient id="pulseGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="pulseGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glow effect verde */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl animate-pulse" 
             style={{ animationDuration: '2s' }} />
      </div>
    );
  }

  return null;
}