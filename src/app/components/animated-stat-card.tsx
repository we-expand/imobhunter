import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AnimatedStatCardProps {
  value: string;
  label: string;
  index: number;
}

export function AnimatedStatCard({ value, label, index }: AnimatedStatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState('0');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Extrair número do valor (92%, 3.5x, etc)
  const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
  const suffix = value.replace(/[\d.]/g, '');
  const isPercentage = value.includes('%');
  const isMultiplier = value.includes('x');
  const isCurrency = value.includes('€');
  const is247 = value === '24/7';

  useEffect(() => {
    if (!isInView) return;

    if (is247) {
      // Animação especial para 24/7
      let iteration = 0;
      const interval = setInterval(() => {
        if (iteration < 20) {
          const randomHour = Math.floor(Math.random() * 24);
          const randomMin = Math.floor(Math.random() * 60);
          setDisplayValue(`${randomHour}/${randomMin}`);
          iteration++;
        } else {
          setDisplayValue('24/7');
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }

    // Animação de contador para outros valores
    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        current = numericValue;
        clearInterval(timer);
        
        // Criar partículas ao finalizar
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50
        }));
        setParticles(newParticles);
        
        // Remover partículas após animação
        setTimeout(() => setParticles([]), 1000);
      }

      // Formatar o número
      if (isPercentage) {
        setDisplayValue(`${Math.floor(current)}%`);
      } else if (isMultiplier) {
        setDisplayValue(`${current.toFixed(1)}x`);
      } else if (isCurrency) {
        setDisplayValue(`€${Math.floor(current)}`);
      } else {
        setDisplayValue(current.toFixed(0));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, numericValue, isPercentage, isMultiplier, isCurrency, is247]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1 
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="relative text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer overflow-hidden group"
    >
      {/* Gradient de fundo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Brilho que se move */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Borda animada */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: [
            '0 0 0 0px rgba(59, 130, 246, 0)',
            '0 0 0 4px rgba(59, 130, 246, 0.1)',
            '0 0 0 0px rgba(59, 130, 246, 0)',
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />

      {/* Partículas ao completar animação */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-500 rounded-full"
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ 
            opacity: 0, 
            x: particle.x, 
            y: particle.y,
            scale: [1, 2, 0]
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      {/* Ícone de sparkles que aparece no hover */}
      <motion.div
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-3 h-3 text-blue-400" />
      </motion.div>

      {/* Número principal */}
      <motion.div
        className="relative text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        animate={{
          scale: isInView ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.3,
          ease: "easeInOut"
        }}
      >
        {displayValue}
      </motion.div>

      {/* Label */}
      <motion.div 
        className="relative text-xs font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5 + index * 0.1 }}
      >
        {label}
      </motion.div>

      {/* Indicador de progresso sutil */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ 
          duration: 2, 
          delay: index * 0.1,
          ease: "easeOut"
        }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Efeito de hover - scale */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      />
    </motion.div>
  );
}
