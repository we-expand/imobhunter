import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  Sparkles, 
  Zap,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

interface CreativeCTASectionProps {
  email: string;
  onEmailChange: (email: string) => void;
  onGetStarted: () => void;
}

export function CreativeCTASection({ email, onEmailChange, onGetStarted }: CreativeCTASectionProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const benefits = [
    {
      icon: Sparkles,
      title: 'Sem Compromisso',
      description: 'Teste grátis sem cartão',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Clock,
      title: 'Rápido',
      description: 'Setup em 5 minutos',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Suporte',
      description: 'Ajuda em português',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Resultados',
      description: '60 leads grátis/mês',
      color: 'from-green-400 to-emerald-500'
    }
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Orbes de fundo animados */}
      <motion.div
        className="absolute top-20 left-20 w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[120px] opacity-20"
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Partículas flutuantes interativas */}
      {Array.from({ length: 20 }).map((_, i) => {
        const distance = Math.sqrt(
          Math.pow((mouseX - window.innerWidth / 2), 2) + 
          Math.pow((mouseY - window.innerHeight / 2), 2)
        );
        const maxDistance = 500;
        const influence = Math.max(0, 1 - distance / maxDistance);
        
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${(i * 5) % 100}%`,
              top: `${(i * 7) % 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5 + influence, 1],
              x: (mouseX - window.innerWidth / 2) * influence * 0.05,
              y: (mouseY - window.innerHeight / 2) * influence * 0.05,
            }}
            transition={{
              opacity: {
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut"
              },
              scale: {
                duration: 2 + (i % 2),
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: {
                duration: 0.3,
                ease: "easeOut"
              },
              y: {
                duration: 0.3,
                ease: "easeOut"
              }
            }}
          />
        );
      })}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Título com animação de entrada */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm px-5 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Transforme sua prospecção hoje
            </Badge>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
            Pronto para{' '}
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              3x seus resultados
            </motion.span>
            ?
          </h2>
          
          <motion.p
            className="text-lg text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Junte-se aos profissionais que já automatizaram 
            <span className="text-white font-semibold"> 100% da prospecção</span>
          </motion.p>
        </motion.div>

        {/* Form com design único */}
        <motion.div
          className="max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.div
            className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 shadow-2xl"
            whileHover={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative group">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-0 group-hover:opacity-30"
                  transition={{ duration: 0.3 }}
                />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className="relative bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm h-12 text-base focus:border-white/40 focus:bg-white/15 transition-all"
                />
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/50 relative overflow-hidden group animate-pulse-scale"
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%', opacity: 0.2 }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center gap-2 text-sm font-semibold">
                    Começar Grátis
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </div>

            {/* LGPD Badge dentro do form */}
            <motion.div
              className="mt-4 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30 backdrop-blur-sm px-3 py-1.5 gap-2 text-xs">
                <Shield className="w-3 h-3" />
                100% Conforme LGPD & GDPR
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cards de benefícios em grid assimétrico */}
        <motion.div
          className="grid md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="relative"
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <motion.div
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full relative overflow-hidden"
                animate={{
                  borderColor: hoveredCard === i ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: hoveredCard === i ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradiente animado no hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0`}
                  animate={{
                    opacity: hoveredCard === i ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Ícone com animação */}
                <motion.div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 relative z-10`}
                  animate={{
                    scale: hoveredCard === i ? [1, 1.1, 1] : 1,
                    rotate: hoveredCard === i ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <benefit.icon className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="font-bold text-white mb-2 relative z-10">
                  {benefit.title}
                </h3>
                <p className="text-blue-200 text-sm relative z-10">
                  {benefit.description}
                </p>

                {/* Partículas no hover */}
                {hoveredCard === i && (
                  <>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <motion.div
                        key={j}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: [0, Math.cos((j * 120) * Math.PI / 180) * 40],
                          y: [0, Math.sin((j * 120) * Math.PI / 180) * 40],
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: j * 0.2,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Linha decorativa animada */}
        <motion.div
          className="mt-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
        />

        {/* Estatística final impactante */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                +500
              </motion.div>
              <div className="text-xs text-blue-200 mt-1">Leads/mês</div>
            </div>
            
            <div className="w-px h-10 bg-white/20" />
            
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                92%
              </motion.div>
              <div className="text-xs text-blue-200 mt-1">Taxa de resposta</div>
            </div>
            
            <div className="w-px h-10 bg-white/20" />
            
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  delay: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                24/7
              </motion.div>
              <div className="text-xs text-blue-200 mt-1">Automação</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}