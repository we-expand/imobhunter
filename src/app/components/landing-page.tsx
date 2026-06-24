import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Globe, 
  Shield, 
  Zap,
  TrendingUp,
  Brain,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Instagram,
  Building2,
  Sparkles,
  Users
} from 'lucide-react';
import { EtherealLogo } from './ui/EtherealLogo';
import { DemoVideoModal } from './demo-video-modal';
import { Toaster, toast } from 'sonner';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin?: () => void;
  onAPITest?: () => void;
}

export function LandingPage({ onGetStarted, onLogin, onAPITest }: LandingPageProps) {
  const [email, setEmail] = useState('');
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const handleEarlyAccess = () => {
    if (email) {
      localStorage.setItem('early-access-email', email);
    }
    onGetStarted();
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      <Toaster position="top-right" richColors theme="light" />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md bg-white/70 border border-white/40 rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <EtherealLogo className="w-8 h-8" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Plataforma</a>
            <a href="#solutions" className="hover:text-slate-900 transition-colors">Soluções</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Preços</a>
          </div>

          <div className="flex items-center gap-4">
            {onLogin && (
              <Button 
                variant="ghost" 
                onClick={onLogin} 
                className="hidden sm:flex hover:bg-slate-100 rounded-full text-slate-600 font-medium"
              >
                Login
              </Button>
            )}
            <Button 
              onClick={onGetStarted}
              className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 md:px-12 min-h-[90vh] flex flex-col justify-center items-center text-center">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-4xl mx-auto z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-wider uppercase mb-6">
              The Future of Real Estate
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Beyond <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">Search</span>. <br/>
            Pure <span className="font-serif italic font-normal text-indigo-600">Intelligence</span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Autonomous AI that identifies, qualifies, and warms up high-value real estate leads 24/7. 
            Elegantly simple. Powerfully effective.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-full p-1 pl-4 shadow-sm border border-slate-100">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-none shadow-none focus-visible:ring-0 bg-transparent h-10 w-64 text-slate-600 placeholder:text-slate-400"
                />
                <Button 
                  onClick={handleEarlyAccess}
                  className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-6 h-10"
                >
                  Start Now
                </Button>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setIsDemoOpen(true)}
              className="rounded-full border-slate-200 hover:bg-slate-50 px-6 h-12 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section - Minimalist */}
      <section className="py-20 border-y border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: '92%', label: 'Response Rate' },
              { value: '3.5x', label: 'Conversion Lift' },
              { value: '24/7', label: 'Active Intelligence' },
              { value: '0s', label: 'Setup Time' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-light text-slate-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Clean & Spacious */}
      <section id="features" className="py-32 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-6">Orchestrated Intelligence</h2>
            <div className="w-20 h-1 bg-indigo-500 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {[
              {
                icon: TrendingUp,
                title: 'Market Penetration',
                description: 'Deep learning algorithms analyze market trends to position your portfolio exactly where demand exists.'
              },
              {
                icon: Brain,
                title: 'Neural Qualification',
                description: 'Proprietary scoring models evaluate lead intent, separating curious browsers from serious investors.'
              },
              {
                icon: MessageSquare,
                title: 'Natural Dialogue',
                description: 'Conversational AI that mimics human empathy and professional tone across all communication channels.'
              },
              {
                icon: BarChart3,
                title: 'Predictive Analytics',
                description: 'Forecast deal closures and revenue streams with high-precision data modeling.'
              },
              {
                icon: Shield,
                title: 'Fortress Security',
                description: 'Enterprise-grade encryption and full GDPR/LGPD compliance for peace of mind.'
              },
              {
                icon: Zap,
                title: 'Instant Velocity',
                description: 'Zero friction setup. Connect your accounts and start generating qualified meetings in minutes.'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <feature.icon strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-6">Soluções para Cada Necessidade</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-light">
              Da imobiliária boutique à rede nacional, temos a solução perfeita para o seu negócio
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Para Imobiliárias',
                description: 'Automatize a prospecção de proprietários e investidores. Integre com seu CRM existente e escale sem aumentar sua equipe.',
                features: ['Importação de portfólio', 'Scoring automático', 'Dashboard executivo', 'Multi-usuário']
              },
              {
                icon: Users,
                title: 'Para Corretores',
                description: 'Ferramentas individuais para o corretor autônomo. Gere leads qualificados 24/7 e foque apenas em fechar negócios.',
                features: ['Busca inteligente', 'WhatsApp Business', 'Agenda automática', 'Sem contratos longos']
              },
              {
                icon: Globe,
                title: 'Enterprise',
                description: 'Solução completa white-label para redes e franchises. API dedicada, IA customizada e suporte prioritário.',
                features: ['White-label', 'API dedicada', 'SLA garantido', 'Treinamento in-loco']
              }
            ].map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-indigo-200 hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <solution.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{solution.title}</h3>
                <p className="text-slate-600 mb-6 font-light leading-relaxed">{solution.description}</p>
                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-600">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="ghost" 
                  onClick={onGetStarted}
                  className="w-full border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50"
                >
                  Saber Mais
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - The "Costs Screen" MVP */}
      <section id="pricing" className="py-32 px-6 md:px-12 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-light text-slate-900 mb-4">Investment</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-light">
              Transparent pricing for the MVP launch. Scale as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Starter',
                price: 'Free',
                period: '/ month',
                description: 'Perfect for individual agents testing the waters.',
                features: ['60 AI-Qualified Leads', 'Basic Email Nurturing', 'Standard Support', 'Manual Export'],
                cta: 'Start Free',
                highlight: false
              },
              {
                title: 'Professional',
                price: '€49',
                period: '/ month',
                description: 'For growing agencies requiring automation.',
                features: ['500 AI-Qualified Leads', 'Multi-channel Nurturing', 'Priority Support', 'CRM Integration', 'Advanced Analytics'],
                cta: 'Go Pro',
                highlight: true
              },
              {
                title: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'Full-scale solution for large networks.',
                features: ['Unlimited Leads', 'Custom AI Training', 'Dedicated Success Manager', 'API Access', 'White Label'],
                cta: 'Contact Sales',
                highlight: false
              }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative p-8 rounded-3xl border ${plan.highlight ? 'bg-white border-indigo-100 shadow-2xl shadow-indigo-100/50' : 'bg-white/50 border-slate-100'} flex flex-col`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full tracking-wider uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-medium text-slate-900 mb-2">{plan.title}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-light text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 ml-2 font-light">{plan.period}</span>
                </div>
                <p className="text-slate-500 text-sm mb-8 font-light min-h-[40px]">{plan.description}</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={onGetStarted}
                  className={`w-full rounded-xl h-12 ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section - Elegant */}
      <section id="compliance" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
                  <Shield strokeWidth={1.5} className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-light text-slate-900 mb-6">
                  Uncompromising Compliance
                </h2>
                <p className="text-lg text-slate-500 font-light leading-relaxed mb-8">
                  Ethereal is engineered from the ground up to respect global privacy standards. 
                  Fully compliant with GDPR and LGPD regulations, ensuring your data—and your clients' data—is 
                  processed with absolute integrity and transparency.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">European Data Hosting</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">End-to-End Encryption</span>
                  </div>
                </div>
             </motion.div>
          </div>
          <div className="md:w-1/2 relative">
             <div className="absolute inset-0 bg-emerald-100/30 blur-3xl rounded-full"></div>
             <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl">
               <h3 className="font-medium text-slate-900 mb-4">Privacy First Architecture</h3>
               <div className="space-y-3">
                 {[
                   'Consent Management System',
                   'Right to be Forgotten',
                   'Data Portability',
                   'Audit Logs',
                   'Access Controls'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                     <span className="text-slate-600">{item}</span>
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-8">
            Ready to evolve?
          </h2>
          <Button 
            onClick={onGetStarted}
            className="rounded-full bg-slate-900 text-white hover:bg-slate-800 px-8 h-14 text-lg shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get Early Access
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Professional Contact Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <EtherealLogo className="w-10 h-10 text-indigo-400" />
                <span className="text-xl font-semibold">ImobHunter</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                AI-powered lead generation platform for real estate professionals. 
                Transform how you discover and qualify opportunities.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Platform Column */}
            <div>
              <h3 className="font-semibold text-white mb-6">Plataforma</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Funcionalidades</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors text-sm">Preços</a></li>
                <li><a href="#compliance" className="text-slate-400 hover:text-white transition-colors text-sm">Segurança</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onAPITest?.(); }} className="text-slate-400 hover:text-white transition-colors text-sm">API & Integrações</a></li>
              </ul>
            </div>

            {/* Solutions Column */}
            <div>
              <h3 className="font-semibold text-white mb-6">Soluções</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Para Imobiliárias</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Para Corretores</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Enterprise</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Casos de Uso</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="font-semibold text-white mb-6">Contato</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Email</div>
                    <a href="mailto:contact@imobhunter.com" className="text-white hover:text-indigo-300 transition-colors text-sm font-medium">
                      contact@imobhunter.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Telefone</div>
                    <a href="tel:+351210000000" className="text-white hover:text-indigo-300 transition-colors text-sm font-medium">
                      +351 21 000 0000
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Sede</div>
                    <p className="text-white text-sm">
                      Lisboa, Portugal<br />
                      Europa
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 ImobHunter. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#compliance" className="text-slate-400 hover:text-white transition-colors">GDPR</a>
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </footer>

      {/* Modals */}
      <DemoVideoModal 
        isOpen={isDemoOpen} 
        onClose={() => setIsDemoOpen(false)}
        onSignUp={onGetStarted}
      />
    </div>
  );
}