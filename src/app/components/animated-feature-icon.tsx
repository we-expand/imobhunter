import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface AnimatedFeatureIconProps {
  icon: LucideIcon;
  color: string;
  index: number;
}

export function AnimatedFeatureIcon({ icon: Icon, color, index }: AnimatedFeatureIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mapeamento de cores para gradientes e sombras
  const colorMap: Record<string, { bg: string; gradient: string; shadow: string; text: string }> = {
    blue: {
      bg: 'bg-blue-50',
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      shadow: 'rgba(59, 130, 246, 0.4)',
      text: 'text-blue-600'
    },
    purple: {
      bg: 'bg-purple-50',
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      shadow: 'rgba(147, 51, 234, 0.4)',
      text: 'text-purple-600'
    },
    pink: {
      bg: 'bg-pink-50',
      gradient: 'from-pink-400 via-pink-500 to-pink-600',
      shadow: 'rgba(236, 72, 153, 0.4)',
      text: 'text-pink-600'
    },
    green: {
      bg: 'bg-green-50',
      gradient: 'from-green-400 via-green-500 to-green-600',
      shadow: 'rgba(34, 197, 94, 0.4)',
      text: 'text-green-600'
    },
    orange: {
      bg: 'bg-orange-50',
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      shadow: 'rgba(249, 115, 22, 0.4)',
      text: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-50',
      gradient: 'from-red-400 via-red-500 to-red-600',
      shadow: 'rgba(239, 68, 68, 0.4)',
      text: 'text-red-600'
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
    >
      {/* Container do ícone */}
      <motion.div
        className={`relative w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center overflow-hidden`}
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut"
        }}
      >
        {/* Gradiente de fundo animado no hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0`}
          animate={{
            opacity: isHovered ? 0.15 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Ícone principal com animação */}
        <motion.div
          animate={{
            y: isHovered ? [0, -3, 0] : 0,
            rotate: isHovered ? [0, 360] : 0,
          }}
          transition={{
            y: {
              duration: 0.6,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 0.2,
              ease: "easeInOut"
            },
            rotate: {
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
        >
          <Icon className={`w-7 h-7 ${colors.text} relative z-10`} />
        </motion.div>

        {/* Partículas que aparecem no hover */}
        {isHovered && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 ${colors.bg} rounded-full`}
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos((i * 60) * Math.PI / 180) * 30],
                  y: [0, Math.sin((i * 60) * Math.PI / 180) * 30],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}

        {/* Brilho pulsante contínuo */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              `0 0 0 0px ${colors.shadow}`,
              `0 0 0 4px ${colors.shadow.replace('0.4', '0.2')}`,
              `0 0 0 0px ${colors.shadow}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.3,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Círculo de fundo que expande no hover */}
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.gradient} opacity-0 -z-10`}
        animate={{
          scale: isHovered ? 1.3 : 1,
          opacity: isHovered ? 0.1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Borda animada no hover */}
      <motion.div
        className={`absolute inset-0 rounded-xl border-2 border-transparent`}
        animate={{
          borderColor: isHovered ? colors.shadow : 'transparent',
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
