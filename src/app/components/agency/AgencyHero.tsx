import { motion, useScroll, useTransform } from "framer-motion";
import { Search, MapPin, Database, Zap } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

export const AgencyHero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          ImobHunter v2.0
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl text-6xl font-extrabold tracking-tighter md:text-8xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40"
        >
          AI de Leads
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Omnichannel
          </span>
        </motion.h1>

        {/* Subheadline - Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-zinc-300"
        >
          Ela garimpa e você vende.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-zinc-400 md:text-xl"
        >
          Transforme dados brutos em oportunidades de ouro. A plataforma de inteligência imobiliária que vê o invisível.
        </motion.p>

        {/* CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <MagneticButton className="bg-white text-black hover:bg-zinc-200 border-transparent">
            Iniciar Teste Grátis
          </MagneticButton>
          <MagneticButton>
            Ver Demonstração
          </MagneticButton>
        </motion.div>
      </div>

      {/* Parallax Elements (Floating UI Mockups) */}
      <motion.div style={{ y: y1 }} className="absolute -left-20 bottom-20 z-0 hidden lg:block opacity-40">
        <div className="h-64 w-80 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-4 shadow-2xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="space-y-3">
            <div className="h-2 w-3/4 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/10" />
            <div className="mt-4 flex gap-2">
               <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center"><Search size={14} className="text-indigo-400"/></div>
               <div className="h-2 w-full rounded bg-white/5 my-auto" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Removido: estatística flutuante 98.4% DATA MATCH */}
    </section>
  );
};