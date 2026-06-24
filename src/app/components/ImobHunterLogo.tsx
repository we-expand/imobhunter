import React from 'react';

/**
 * 🎯 Logo ImobHunter - Versão SVG Exportável
 * Design: Mira/alvo com "H" estilizado representando Hunter
 * Cores: Gradiente azul/índigo (tech premium)
 */

interface ImobHunterLogoProps {
  size?: number;
  withText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

export const ImobHunterLogo: React.FC<ImobHunterLogoProps> = ({ 
  size = 200, 
  withText = true,
  variant = 'default'
}) => {
  const textColor = variant === 'white' ? '#FFFFFF' : variant === 'dark' ? '#1E293B' : '#0F172A';
  const gradientStart = variant === 'white' ? '#FFFFFF' : '#3B82F6';
  const gradientEnd = variant === 'white' ? '#E2E8F0' : '#6366F1';
  
  return (
    <svg
      width={withText ? size * 2 : size}
      height={size}
      viewBox={withText ? "0 0 400 200" : "0 0 200 200"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradiente para o ícone */}
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>
        
        {/* Sombra suave */}
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Círculo externo - Mira */}
      <circle 
        cx="100" 
        cy="100" 
        r="85" 
        stroke="url(#logoGradient)" 
        strokeWidth="4"
        fill="none"
        opacity="0.8"
      />
      
      {/* Círculo médio - Mira */}
      <circle 
        cx="100" 
        cy="100" 
        r="60" 
        stroke="url(#logoGradient)" 
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Cruz de mira - Linhas */}
      <line x1="15" y1="100" x2="185" y2="100" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.4"/>
      <line x1="100" y1="15" x2="100" y2="185" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.4"/>
      
      {/* H estilizado no centro - "Hunter" */}
      <g filter="url(#softGlow)">
        {/* Barra esquerda do H */}
        <rect x="70" y="60" width="12" height="80" fill="url(#logoGradient)" rx="2"/>
        
        {/* Barra direita do H */}
        <rect x="118" y="60" width="12" height="80" fill="url(#logoGradient)" rx="2"/>
        
        {/* Barra horizontal do H com seta */}
        <path 
          d="M 82 95 L 118 95 L 118 105 L 82 105 L 82 95 M 118 100 L 128 100 L 123 95 L 123 105 Z" 
          fill="url(#logoGradient)"
        />
      </g>
      
      {/* Ponto central - Alvo */}
      <circle 
        cx="100" 
        cy="100" 
        r="8" 
        fill="url(#logoGradient)"
        filter="url(#softGlow)"
      />

      {/* Texto "ImobHunter" */}
      {withText && (
        <g>
          <text 
            x="220" 
            y="90" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontSize="42" 
            fontWeight="700"
            fill={textColor}
            letterSpacing="-0.5"
          >
            Imob
          </text>
          <text 
            x="220" 
            y="130" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontSize="42" 
            fontWeight="300"
            fill="url(#logoGradient)"
            letterSpacing="-0.5"
          >
            Hunter
          </text>
        </g>
      )}
    </svg>
  );
};

/**
 * 🎨 Logo quadrado para redes sociais (LinkedIn, etc)
 */
export const ImobHunterLogoSquare: React.FC<{ size?: number }> = ({ size = 512 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        
        <filter id="logoShadow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Fundo gradiente sutil (opcional - remover para transparente) */}
      {/* <rect width="512" height="512" fill="url(#squareGradient)" opacity="0.05" rx="64"/> */}

      {/* Círculo externo */}
      <circle 
        cx="256" 
        cy="256" 
        r="200" 
        stroke="url(#squareGradient)" 
        strokeWidth="12"
        fill="none"
        opacity="0.8"
      />
      
      {/* Círculo médio */}
      <circle 
        cx="256" 
        cy="256" 
        r="140" 
        stroke="url(#squareGradient)" 
        strokeWidth="8"
        fill="none"
        opacity="0.6"
      />
      
      {/* Cruz de mira */}
      <line x1="56" y1="256" x2="456" y2="256" stroke="url(#squareGradient)" strokeWidth="6" opacity="0.4"/>
      <line x1="256" y1="56" x2="256" y2="456" stroke="url(#squareGradient)" strokeWidth="6" opacity="0.4"/>
      
      {/* H estilizado - Maior e mais visível */}
      <g filter="url(#logoShadow)">
        {/* Barra esquerda */}
        <rect x="180" y="150" width="30" height="212" fill="url(#squareGradient)" rx="6"/>
        
        {/* Barra direita */}
        <rect x="302" y="150" width="30" height="212" fill="url(#squareGradient)" rx="6"/>
        
        {/* Barra horizontal com seta */}
        <path 
          d="M 210 240 L 302 240 L 302 272 L 210 272 L 210 240 M 302 256 L 332 256 L 317 240 L 317 272 Z" 
          fill="url(#squareGradient)"
        />
      </g>
      
      {/* Ponto central */}
      <circle 
        cx="256" 
        cy="256" 
        r="20" 
        fill="url(#squareGradient)"
        filter="url(#logoShadow)"
      />
      
      {/* Texto minimalista embaixo (opcional) */}
      <text 
        x="256" 
        y="440" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="36" 
        fontWeight="600"
        fill="url(#squareGradient)"
        textAnchor="middle"
        letterSpacing="2"
      >
        IMOBHUNTER
      </text>
    </svg>
  );
};

export default ImobHunterLogo;
