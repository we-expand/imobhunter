import React from 'react';
import { motion } from 'motion/react';

export const EtherealLogo = ({ className = "w-10 h-10", collapsed = false }: { className?: string; collapsed?: boolean }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-slate-300"
          style={{ width: '100%', height: '100%' }}
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        {/* Middle Prism */}
        <motion.div
          className="absolute inset-2 border border-blue-200/50 rotate-45"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 15, repeat: Infinity, ease: "linear"
          }}
        />

        {/* Inner Core */}
        <motion.div
          className="w-1/2 h-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm shadow-lg"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            borderRadius: ["20%", "50%", "20%"]
          }}
          transition={{
            duration: 8, repeat: Infinity, ease: "easeInOut"
          }}
        />
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <motion.span 
            className="font-light tracking-[0.2em] text-lg text-slate-900 leading-none"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ETHEREAL
          </motion.span>
          <motion.span 
            className="text-[10px] text-slate-400 uppercase tracking-widest leading-none mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Intelligence
          </motion.span>
        </div>
      )}
    </div>
  );
};
