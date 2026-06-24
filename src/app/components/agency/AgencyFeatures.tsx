import { motion } from "framer-motion";
import { Scan, Share2, ShieldCheck, Zap, Globe, MessageCircle } from "lucide-react";

const features = [
  {
    title: "Deep Scan",
    description: "Algoritmos que varrem a web em busca de proprietários reais, ignorando intermediários.",
    icon: <Scan className="h-6 w-6 text-cyan-400" />,
    colSpan: "col-span-12 md:col-span-8",
    bg: "bg-gradient-to-br from-cyan-900/20 to-slate-900/50",
  },
  {
    title: "Velocidade Real",
    description: "Leads em milissegundos.",
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
    colSpan: "col-span-12 md:col-span-4",
    bg: "bg-zinc-900/50",
  },
  {
    title: "WhatsApp API",
    description: "Conexão direta e automatizada com seus leads via WhatsApp oficial ou QR Code.",
    icon: <MessageCircle className="h-6 w-6 text-green-400" />,
    colSpan: "col-span-12 md:col-span-4",
    bg: "bg-zinc-900/50",
  },
  {
    title: "Proteção de Dados",
    description: "Compliance total com LGPD/GDPR. Seus dados blindados.",
    icon: <ShieldCheck className="h-6 w-6 text-indigo-400" />,
    colSpan: "col-span-12 md:col-span-8",
    bg: "bg-gradient-to-bl from-indigo-900/20 to-slate-900/50",
  },
];

export const AgencyFeatures = () => {
  return (
    <section className="bg-[#0a0a0a] py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-light tracking-tight text-white md:text-5xl">
            Tecnologia que <span className="font-bold text-indigo-500">Impulsiona</span>
          </h2>
          <p className="mt-4 text-zinc-500">Ferramentas desenhadas para a elite do mercado imobiliário.</p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className={`${feature.colSpan} group relative overflow-hidden rounded-3xl border border-white/5 ${feature.bg} p-8 backdrop-blur-sm transition-all hover:border-white/10`}
            >
              <div className="mb-6 inline-flex rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
              
              {/* Hover Glow */}
              <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
