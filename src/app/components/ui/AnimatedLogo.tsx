import React from 'react';
import { motion } from 'motion/react';

export const AnimatedLogo = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full text-indigo-900 overflow-visible"
        initial="hidden"
        animate="visible"
      >
        {/* Círculo Externo (O Mundo/Mercado) */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* O Alvo / Casa Abstrata */}
        <motion.path
          d="M 50 20 L 80 50 L 50 80 L 20 50 Z"
          fill="none"
          stroke="#D4AF37" // Ouro
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0, rotate: -45 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1, type: "spring" }}
        />

        {/* O Ponto Central (O Lead/Imóvel) */}
        <motion.circle
          cx="50"
          cy="50"
          r="6"
          fill="currentColor"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 1.2, duration: 0.5 }}
        />
      </motion.svg>
      
      <div className="flex flex-col justify-center">
        <motion.span 
          className="text-xl font-bold tracking-widest text-slate-900 uppercase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Imob<span className="font-light text-slate-500">Hunter</span>
        </motion.span>
      </div>
    </div>
  );
};
