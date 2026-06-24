import { motion } from "framer-motion";
import { AgencyHero } from "./AgencyHero";
import { AgencyFeatures } from "./AgencyFeatures";
import { MagneticButton } from "./MagneticButton";
import { ArrowRight, CheckCircle2, Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";
import { AgencyLogo } from "./AgencyLogo";
import { useState } from "react";
import { PrivacyPolicy } from "../PrivacyPolicy";

interface AgencyLandingPageProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
  onAPITest?: () => void;
  onFinancialStudy?: () => void;
  onAdvancedSearch?: () => void;
  isAdmin?: boolean;
}

export const AgencyLandingPage = ({ onGetStarted, onLogin, isAdmin = false }: AgencyLandingPageProps) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navigation (Minimalist) */}
      <nav className="fixed top-0 z-[110] w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <AgencyLogo />
          <div className="hidden gap-8 text-sm font-medium text-zinc-400 md:flex items-center">
            <button onClick={() => scrollToSection('plataforma')} className="hover:text-white transition-colors">Plataforma</button>
            <button onClick={() => scrollToSection('solucoes')} className="hover:text-white transition-colors">Soluções</button>
            <button onClick={() => scrollToSection('precos')} className="hover:text-white transition-colors">Preços</button>
          </div>
          <div className="flex gap-4">
             <button onClick={onLogin} className="text-sm text-zinc-300 hover:text-white">Login</button>
             <button onClick={onGetStarted} className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-black hover:bg-zinc-200 transition-colors">
                Começar
             </button>
          </div>
        </div>
      </nav>

      <main>
        <AgencyHero />
        
        <div id="plataforma">
          <AgencyFeatures />
        </div>

        {/* Value Proposition Section */}
        <section className="relative overflow-hidden py-32">
           <div className="absolute inset-0 bg-indigo-950/10 skew-y-3 transform origin-top-left" />
           <div className="relative mx-auto max-w-7xl px-6">
              <div className="grid gap-16 md:grid-cols-2 items-center">
                 <div>
                    <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                       Deixe de caçar.<br />
                       Comece a <span className="text-indigo-500">fechar.</span>
                    </h2>
                    <p className="mt-6 text-lg text-zinc-400">
                       Enquanto seus concorrentes perdem horas em portais manuais, o ImobHunter entrega os contatos validados diretamente no seu CRM ou WhatsApp.
                    </p>
                    <ul className="mt-8 space-y-4">
                       {[
                          "Enriquecimento de dados automático",
                          "Validação de proprietário vs. imobiliária",
                          "Integração nativa com CRMs",
                       ].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-zinc-300">
                             <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                             {item}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <div className="relative">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 p-2 shadow-2xl">
                       {/* Abstract UI Representation */}
                       <div className="h-full w-full rounded-xl bg-[#0f0f0f] overflow-hidden relative">
                          <div className="absolute top-0 left-0 right-0 h-12 border-b border-white/5 bg-white/5 px-4 flex items-center gap-2">
                             <div className="h-3 w-3 rounded-full bg-red-500/50" />
                             <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                             <div className="h-3 w-3 rounded-full bg-green-500/50" />
                          </div>
                          <div className="p-8 space-y-4">
                             {[1, 2, 3, 4].map((i) => (
                                <motion.div 
                                   key={i}
                                   initial={{ x: -20, opacity: 0 }}
                                   whileInView={{ x: 0, opacity: 1 }}
                                   transition={{ delay: i * 0.2 }}
                                   className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4"
                                >
                                   <div className="h-10 w-10 rounded-full bg-indigo-500/20" />
                                   <div className="flex-1 space-y-2">
                                      <div className="h-2 w-24 rounded bg-white/20" />
                                      <div className="h-2 w-16 rounded bg-white/10" />
                                   </div>
                                   <div className="h-8 w-20 rounded bg-green-500/20" />
                                </motion.div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Soluções Section */}
        <section id="solucoes" className="py-32 bg-gradient-to-b from-[#0a0a0a] to-black">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white md:text-5xl mb-4">
                Soluções para Cada <span className="text-indigo-500">Desafio</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Da prospecção ao fechamento, automatize todo o seu processo comercial
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Data Mining Inteligente",
                  description: "Extraia dados de portais imobiliários e enriqueça automaticamente com LinkedIn, Apollo e PDL.",
                  features: ["Scraping automático", "Validação de GDPR", "Scoring por IA", "Exportação CRM"],
                  icon: "🔍"
                },
                {
                  title: "Qualificação por IA",
                  description: "Nossa IA analisa e pontua cada lead, priorizando proprietários reais e excluindo spam.",
                  features: ["NLP avançado", "Detecção de padrões", "Score 0-100", "Logs de verificação"],
                  icon: "🤖"
                },
                {
                  title: "Outreach Multicanal",
                  description: "Conecte-se com prospects via WhatsApp Business, Email e LinkedIn de forma automatizada.",
                  features: ["WhatsApp API oficial", "Sequências de email", "LinkedIn InMail", "Follow-ups automáticos"],
                  icon: "📱"
                }
              ].map((solution, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-all"
                >
                  <div className="text-5xl mb-4">{solution.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{solution.title}</h3>
                  <p className="text-zinc-400 mb-6">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precos" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white md:text-5xl mb-4">
                Preços <span className="text-indigo-500">Transparentes</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Sem taxas escondidas. Sem contratos longos. Cancele quando quiser.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[
                {
                  name: "Freemium",
                  price: "€0",
                  period: "/mês",
                  discount: null,
                  description: "Para experimentar a plataforma",
                  features: [
                    "50 leads/mês",
                    "Busca básica em portais",
                    "Exportação CSV",
                    "Suporte via email",
                    "Sem cartão de crédito"
                  ],
                  cta: "Começar Grátis",
                  popular: false,
                  badge: null
                },
                {
                  name: "Solo",
                  price: "€39",
                  period: "/mês",
                  discount: "ou €390/ano (economize €78)",
                  description: "Para profissionais independentes",
                  features: [
                    "500 leads/mês",
                    "Enriquecimento básico com IA",
                    "1 integração CRM",
                    "WhatsApp Web (não API)",
                    "Email sequences básico",
                    "Suporte email (48h)"
                  ],
                  cta: "Começar Agora",
                  popular: false,
                  badge: "MELHOR CUSTO-BENEFÍCIO"
                },
                {
                  name: "Professional",
                  price: "€79",
                  period: "/mês",
                  discount: "ou €790/ano (economize €158)",
                  description: "Para profissionais sérios",
                  features: [
                    "2.500 leads/mês",
                    "Enriquecimento avançado (Apollo + PDL)",
                    "WhatsApp Business API oficial",
                    "5 integrações CRM simultâneas",
                    "Sequências de email ilimitadas",
                    "Suporte prioritário 24/7",
                    "Analytics avançado + BI",
                    "API access"
                  ],
                  cta: "Começar Agora",
                  popular: true,
                  badge: "MAIS POPULAR"
                },
                {
                  name: "Team",
                  price: "€189",
                  period: "/mês",
                  discount: "ou €1,890/ano (economize €378)",
                  description: "Para equipes e agências",
                  features: [
                    "10.000 leads/mês",
                    "Multi-usuários (até 5 users)",
                    "White-label disponível",
                    "API dedicada sem rate limit",
                    "Webhooks personalizados",
                    "Account manager dedicado",
                    "Treinamento da equipe (2h)",
                    "SLA 99.9% garantido",
                    "Dashboard compartilhado"
                  ],
                  cta: "Falar com Vendas",
                  popular: false,
                  badge: "PARA EQUIPES"
                }
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl p-6 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-2 border-indigo-400 md:scale-105 shadow-2xl shadow-indigo-500/20' 
                      : 'bg-gradient-to-br from-zinc-900 to-black border border-white/10'
                  }`}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      plan.popular ? 'bg-yellow-400 text-black' : 'bg-indigo-500 text-white'
                    }`}>
                      {plan.badge}
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className={`text-sm ${plan.popular ? 'text-indigo-100' : 'text-zinc-500'}`}>{plan.period}</span>
                    </div>
                    {plan.discount && (
                      <p className={`text-xs mt-1 ${plan.popular ? 'text-indigo-100' : 'text-emerald-400'}`}>
                        {plan.discount}
                      </p>
                    )}
                    <p className={`text-xs mt-2 ${plan.popular ? 'text-indigo-200' : 'text-zinc-400'}`}>
                      {plan.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-indigo-500'}`} />
                        <span className={`text-xs ${plan.popular ? 'text-white' : 'text-zinc-300'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={onGetStarted}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                      plan.popular
                        ? 'bg-white text-indigo-600 hover:bg-zinc-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Enterprise Plan - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-7xl mx-auto"
            >
              <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="relative grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-bold text-purple-200 uppercase mb-4">
                      Enterprise
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Solução Customizada para sua Empresa
                    </h3>
                    <p className="text-zinc-300 mb-6">
                      Para redes imobiliárias, franchises e empresas que precisam de volume, segurança e suporte dedicado.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold text-white mb-1">Ilimitado</div>
                        <div className="text-xs text-zinc-400">Leads por mês</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-2xl font-bold text-white mb-1">5-50+</div>
                        <div className="text-xs text-zinc-400">Usuários</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                    <h4 className="font-semibold text-white mb-4">Inclui tudo do Team, mais:</h4>
                    <ul className="space-y-2.5 mb-6">
                      {[
                        "Leads ilimitados sem throttling",
                        "White-label completo (seu domínio + logo)",
                        "SSO/SAML para autenticação corporativa",
                        "Infraestrutura dedicada (compliance)",
                        "Custom data sources (seus portais)",
                        "Integrações personalizadas",
                        "Treinamento presencial (8h)",
                        "CSM (Customer Success Manager)",
                        "SLA 99.95% com compensação"
                      ].map((feature, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-400" />
                          <span className="text-sm text-zinc-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={onGetStarted}
                      className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition-all"
                    >
                      Solicitar Proposta Personalizada
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="mt-12 text-center space-y-3">
              <p className="text-sm text-zinc-500">
                💳 Visa, Mastercard, Amex, MB WAY | 🔒 Pagamento seguro via Stripe | 🔄 Cancele a qualquer momento
              </p>
              <p className="text-xs text-zinc-600">
                * Preços em EUR. IVA não incluído. Desconto anual aplicado automaticamente no checkout.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 text-center">
           <div className="mx-auto max-w-3xl px-6">
              <h2 className="mb-8 text-4xl font-bold text-white md:text-6xl">Pronto para dominar?</h2>
              <div className="flex justify-center">
                 <MagneticButton className="bg-indigo-600 border-indigo-500 hover:bg-indigo-500">
                    Acessar Plataforma Agora <ArrowRight className="ml-2 h-4 w-4" />
                 </MagneticButton>
              </div>
           </div>
        </section>
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-white/5 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <AgencyLogo />
              <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
                A sua AI de trabalho, que transforma leads em chaves entregues.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                {['Funcionalidades', 'Integrações', 'API', 'Segurança', 'Preços'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                {['Sobre Nós', 'Carreiras', 'Blog', 'Parceiros', 'Imprensa'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <a href="mailto:contact@imobhunter.com" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      contact@imobhunter.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <a href="tel:+351210000000" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      +351 21 000 0000
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-zinc-400">
                    Lisboa, Portugal<br />
                    Parque das Nações
                  </div>
                </li>
              </ul>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:border-indigo-500 transition-colors">
                  <Linkedin className="w-4 h-4 text-zinc-400" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:border-indigo-500 transition-colors">
                  <Twitter className="w-4 h-4 text-zinc-400" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:border-indigo-500 transition-colors">
                  <Github className="w-4 h-4 text-zinc-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-600">
              &copy; {new Date().getFullYear()} ImobHunter. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-zinc-600">
              <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-white transition-colors">
                Privacidade
              </button>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
              <a href="#" className="hover:text-white transition-colors">GDPR</a>
              <a href="#logo" className="hover:text-indigo-400 transition-colors">📥 Download Logo</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};