import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarFallbackProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarFallback({ src, name, size = 'md', className = '' }: AvatarFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tamanhos
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Pega as iniciais do nome
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Gera uma cor baseada no nome (consistente)
  const getColorFromName = (name: string) => {
    const colors = [
      'from-blue-500 to-blue-700',
      'from-purple-500 to-purple-700',
      'from-pink-500 to-pink-700',
      'from-green-500 to-green-700',
      'from-yellow-500 to-yellow-700',
      'from-red-500 to-red-700',
      'from-indigo-500 to-indigo-700',
      'from-cyan-500 to-cyan-700',
      'from-teal-500 to-teal-700',
      'from-orange-500 to-orange-700',
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Se a imagem original falhar ou não existir, usa fallback
  const shouldShowFallback = !src || imageError || src.includes('placeholder') || src === '';

  // URLs de fallback de APIs públicas de avatares
  const generateFallbackUrl = (name: string) => {
    const initials = getInitials(name);
    
    // Opção 1: DiceBear (avatares modernos e bonitos)
    const diceBearStyles = ['avataaars', 'bottts', 'personas', 'lorelei', 'notionists'];
    const randomStyle = diceBearStyles[Math.abs(hashCode(name)) % diceBearStyles.length];
    const diceBear = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(name)}`;
    
    // Opção 2: UI Avatars (iniciais com background colorido)
    const uiAvatars = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=random&bold=true&format=svg`;
    
    // Usa DiceBear por padrão (mais bonito)
    return diceBear;
  };

  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  // Se deve mostrar fallback, renderiza avatar gerado
  if (shouldShowFallback) {
    return (
      <div className={`${sizeClasses[size]} ${className} relative`}>
        {/* Avatar gerado por API externa */}
        <img
          src={generateFallbackUrl(name)}
          alt={name}
          className="w-full h-full rounded-full object-cover shadow-lg"
          onError={(e) => {
            // Se até a API de fallback falhar, mostra avatar com iniciais
            (e.target as HTMLImageElement).style.display = 'none';
            const container = (e.target as HTMLElement).parentElement;
            if (container) {
              container.innerHTML = `
                <div class="w-full h-full rounded-full bg-gradient-to-br ${getColorFromName(name)} flex items-center justify-center text-white font-bold shadow-lg">
                  ${getInitials(name)}
                </div>
              `;
            }
          }}
        />
      </div>
    );
  }

  // Tenta carregar a imagem original
  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {loading && (
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorFromName(name)} flex items-center justify-center text-white font-bold animate-pulse`}>
          {getInitials(name)}
        </div>
      )}
      
      <img
        src={src}
        alt={name}
        className={`w-full h-full rounded-full object-cover shadow-lg ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImageError(true);
          setLoading(false);
        }}
      />
    </div>
  );
}

// Componente compacto para usar inline
export function QuickAvatar({ name, src, size = 'md' }: { name: string; src?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <AvatarFallback src={src} name={name} size={size} />;
}