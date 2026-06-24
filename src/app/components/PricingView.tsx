import React from 'react';
import { motion } from 'motion/react';
import { Check, Info, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from './ui/button';

export const PricingView = () => {
  const tiers = [
    {
      name: "MVP Starter",
      price: "€0",
      period: "/mo",
      description: "Essential infrastructure for independent agents.",
      features: [
        "60 AI-Qualified Leads",
        "Basic Email Automation",
        "CRM Lite",
        "Standard Analytics",
        "Email Support"
      ],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Growth",
      price: "€49",
      period: "/mo",
      description: "For agencies scaling their digital presence.",
      features: [
        "500 AI-Qualified Leads",
        "Multi-channel Nurturing (WhatsApp + Email)",
        "Advanced CRM Sync",
        "Biometric SmartKey™ Auth",
        "Priority 24/7 Support",
        "Market Intelligence Reports"
      ],
      cta: "Upgrade Now",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Full-scale solution for networks and developers.",
      features: [
        "Unlimited Leads",
        "Custom AI Training",
        "White-label Solution",
        "Dedicated Success Manager",
        "API Access",
        "On-premise Deployment Options"
      ],
      cta: "Contact Sales",
      highlight: false,
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 max-w-3xl mx-auto"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            Transparent Investment
        </span>
        <h2 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 leading-tight">
          Intelligence at a fair price.
        </h2>
        <p className="text-lg text-slate-500 font-light">
          Scale your operation with flexible plans designed for ROI from day one.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch mb-24">
        {tiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            className={`relative p-8 rounded-[2rem] border flex flex-col ${tier.highlight ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-indigo-500/20 z-10 scale-105' : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-100 transition-colors'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
          >
             {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                </div>
             )}

             <div className="mb-8">
                <h3 className={`text-lg font-medium mb-2 ${tier.highlight ? 'text-indigo-200' : 'text-slate-900'}`}>{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-light tracking-tight">{tier.price}</span>
                    <span className={`text-sm ${tier.highlight ? 'text-slate-400' : 'text-slate-500'}`}>{tier.period}</span>
                </div>
                <p className={`mt-6 text-sm leading-relaxed ${tier.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{tier.description}</p>
             </div>

             <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                        <Check className={`w-5 h-5 flex-shrink-0 ${tier.highlight ? 'text-indigo-400' : 'text-indigo-600'}`} strokeWidth={2} />
                        <span className={tier.highlight ? 'text-slate-200' : 'text-slate-600'}>{feat}</span>
                    </li>
                ))}
             </ul>

             <Button className={`w-full h-14 rounded-xl text-sm font-semibold tracking-wide transition-all ${tier.highlight ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                {tier.cta}
             </Button>
          </motion.div>
        ))}
      </div>

      {/* Infrastructure Breakdown */}
      <motion.div 
        className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Info className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-light text-slate-900">Infrastructure & Compliance</h4>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium text-sm">Security</span>
                </div>
                <h5 className="text-slate-900 font-medium">Enterprise Grade</h5>
                <p className="text-sm text-slate-500 leading-relaxed">
                    All plans include 256-bit SSL encryption, SOC2 Type II compliance, and regular penetration testing.
                </p>
            </div>
            
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium text-sm">Performance</span>
                </div>
                <h5 className="text-slate-900 font-medium">Edge Network</h5>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Global CDN distribution ensures <50ms latency for your dashboard and client-facing pages anywhere.
                </p>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium text-sm">Data Privacy</span>
                </div>
                <h5 className="text-slate-900 font-medium">GDPR & LGPD</h5>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Full data sovereignty controls. We process data in the EU and handle all consent management automatically.
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
