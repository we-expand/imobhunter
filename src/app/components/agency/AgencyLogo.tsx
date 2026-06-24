import { motion } from "framer-motion";

export const AgencyLogo = () => {
  return (
    <div className="flex items-center gap-4 py-2.5">
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Core Glow - O "Coração" do sistema */}
        <motion.div
          className="absolute h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner Ring - Scanner Rápido */}
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute h-8 w-8 text-indigo-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-80"
            strokeDasharray="10 10"
          />
        </motion.svg>

        {/* Outer Ring - Scanner Lento / Mira */}
        <motion.svg
          viewBox="0 0 40 40"
          className="absolute h-full w-full text-indigo-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="60 40" />
          <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" className="opacity-30" />
        </motion.svg>
        
        {/* Crosshair accents - Detalhes táticos estáticos para dar "peso" */}
        <div className="absolute top-0 h-1.5 w-[1px] bg-white/20" />
        <div className="absolute bottom-0 h-1.5 w-[1px] bg-white/20" />
        <div className="absolute left-0 h-[1px] w-1.5 bg-white/20" />
        <div className="absolute right-0 h-[1px] w-1.5 bg-white/20" />
      </div>

      <div className="flex flex-col justify-center">
        <span className="text-2xl font-bold tracking-tighter text-white leading-none">
          IMOB<span className="text-indigo-500">HUNTER</span>
        </span>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white leading-none mt-1.5">
          Intelligence
        </span>
      </div>
    </div>
  );
};