import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, Tooltip, XAxis, ResponsiveContainer
} from 'recharts';
import { 
  Building2, Bell, ArrowUpRight,
  MapPin, Wallet, ChevronRight, Activity, TrendingUp, Users, Search, Filter, Brain
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EtherealLogo } from '../ui/EtherealLogo';
import { PricingView } from '../PricingView';

const dataTrend = [
  { name: 'Mon', val: 4000 }, { name: 'Tue', val: 3000 }, { name: 'Wed', val: 2000 },
  { name: 'Thu', val: 2780 }, { name: 'Fri', val: 1890 }, { name: 'Sat', val: 2390 },
  { name: 'Sun', val: 3490 },
];

const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div 
    className={`bg-white/60 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md hover:border-white/80 transition-all duration-500 rounded-3xl p-6 relative overflow-hidden group ${className}`}
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, delay: delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const PropertyCard = ({ image, title, location, price, status }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
  >
    <div className="h-48 bg-slate-200 relative overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide text-slate-900">
        {status}
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-medium text-slate-900 mb-1">{title}</h3>
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
        <MapPin className="w-3 h-3" />
        {location}
      </div>
      <div className="flex items-center justify-between border-t border-slate-50 pt-4">
        <span className="text-lg font-light text-indigo-600">{price}</span>
        <Button size="sm" variant="ghost" className="text-xs hover:bg-slate-50">Details</Button>
      </div>
    </div>
  </motion.div>
);

const LeadRow = ({ name, email, score, status, date }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-400">{email}</p>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="text-right hidden sm:block">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${score > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          Score: {score}
        </span>
      </div>
      <div className="text-right hidden sm:block">
        <span className="text-xs text-slate-400">{status}</span>
        <p className="text-[10px] text-slate-300">{date}</p>
      </div>
      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  </motion.div>
);

export function Dashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [view, setView] = useState<'dashboard' | 'pricing'>('dashboard');
  const [subView, setSubView] = useState<'overview' | 'properties' | 'leads' | 'intelligence'>('overview');

  if (view === 'pricing') {
      return (
          <div className="min-h-screen relative bg-slate-50/50">
             <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto">
                    <Button variant="ghost" onClick={() => setView('dashboard')} className="gap-2 text-slate-500 hover:text-slate-900 bg-white/50 backdrop-blur rounded-full px-6">
                        ← Back to Dashboard
                    </Button>
                </div>
             </div>
             <div className="pt-20">
                <PricingView />
             </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen relative p-6 md:p-12 pt-28 max-w-[1600px] mx-auto font-sans">
      
      {/* Floating Header */}
      <motion.header 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-xl border border-white/50 px-8 py-3 rounded-full shadow-lg shadow-indigo-50/10 flex items-center justify-between gap-12 w-[90%] md:w-auto md:min-w-[600px]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSubView('overview')}>
            <EtherealLogo className="w-8 h-8" collapsed />
        </div>
        
        <nav className="hidden md:flex items-center gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'properties', label: 'Properties' },
              { id: 'leads', label: 'Leads' },
              { id: 'intelligence', label: 'Intelligence' }
            ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setSubView(item.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${subView === item.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'}`}
                >
                    {item.label}
                </button>
            ))}
        </nav>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <button onClick={() => setView('pricing')} className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-indigo-600 hover:text-indigo-700 mr-2">
                Upgrade
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:ring-2 ring-indigo-100 transition-all" onClick={onLogout} title="Sign Out">
                <img src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"} className="w-full h-full object-cover" alt="User" />
            </div>
        </div>
      </motion.header>

      {/* Sub Views Content */}
      <div className="mt-8">
        
        {/* OVERVIEW VIEW */}
        {subView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[minmax(180px,auto)]">
            {/* 1. Welcome */}
            <BentoCard className="col-span-1 md:col-span-4 lg:col-span-4 row-span-2 !bg-gradient-to-br from-[#1e293b] to-[#0f172a] !text-white !border-none relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-[10px] font-medium tracking-widest uppercase mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            AI Agent Active
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                            Good morning, <span className="font-normal text-indigo-100">{user?.name?.split(' ')[0] || 'Hunter'}.</span>
                        </h1>
                    </div>
                    <div className="flex items-end justify-between mt-8">
                        <p className="text-slate-400 font-light max-w-md text-lg leading-relaxed">
                            Your portfolio grew by <span className="text-white font-medium">+4.2%</span>.
                            <br/>
                            AI detected <span className="text-white font-medium">3 high-value</span> leads overnight.
                        </p>
                        <Button onClick={() => setSubView('leads')} className="rounded-full h-12 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 transition-all group">
                            Review Leads <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </div>
                </div>
            </BentoCard>

            {/* 2. Stat: Portfolio */}
            <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-between" delay={0.1}>
                <div className="flex justify-between items-start">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
                        <Building2 className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Active Portfolio</p>
                    <span className="text-4xl font-light text-slate-900 tracking-tight">142</span>
                </div>
            </BentoCard>

            {/* 3. Stat: Pipeline Value */}
            <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 flex flex-col justify-between" delay={0.2}>
                <div className="flex justify-between items-start">
                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
                        <Wallet className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full">Proj.</span>
                </div>
                <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Pipeline Value</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-light text-slate-900 tracking-tight">€2.4</span>
                        <span className="text-lg text-slate-500 font-light">M</span>
                    </div>
                </div>
            </BentoCard>

            {/* 4. Graph */}
            <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 flex flex-col" delay={0.3}>
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-500" />
                            Engagement
                        </h3>
                        <p className="text-slate-400 text-[10px] uppercase tracking-wider mt-1">Last 7 Days</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-light text-slate-900">4.8k</span>
                    </div>
                </div>
                <div className="flex-1 w-full min-h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataTrend}>
                            <XAxis dataKey="name" hide />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                            />
                            <Bar 
                                dataKey="val" 
                                fill="#cbd5e1" 
                                radius={[4, 4, 4, 4]}
                                barSize={8}
                                activeBar={{ fill: '#4f46e5' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </BentoCard>

            {/* 5. Map */}
            <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 p-0 relative group" delay={0.4}>
                <div className="absolute inset-0 bg-slate-100 opacity-50 transition-opacity duration-700">
                    <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white/80 to-transparent pt-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-indigo-600">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 text-sm">São Paulo</p>
                            <p className="text-xs text-slate-500">Primary Market</p>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* 6. Notifications */}
            <BentoCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-indigo-50/20" delay={0.5}>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    Activity
                </h3>
                <div className="space-y-4">
                    {[
                        { title: 'New Lead Qualified', time: '2m ago', icon: TrendingUp, color: 'text-emerald-500' },
                        { title: 'Showing Scheduled', time: '1h ago', icon: Building2, color: 'text-blue-500' },
                        { title: 'Contract Updated', time: '4h ago', icon: Activity, color: 'text-indigo-500' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                            <div className={`w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center ${item.color}`}>
                                <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">{item.title}</p>
                                <p className="text-xs text-slate-400">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </BentoCard>
          </div>
        )}

        {/* PROPERTIES VIEW */}
        {subView === 'properties' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-light text-slate-900">Properties</h2>
                <p className="text-slate-500">Manage your exclusive portfolio.</p>
              </div>
              <Button className="rounded-full bg-slate-900 text-white">Add Property +</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                 <PropertyCard 
                   key={i}
                   title={`Luxury Villa #${i}`}
                   location="Jardins, São Paulo"
                   price={`€ ${(1.2 + i * 0.5).toFixed(1)}M`}
                   status="For Sale"
                   image={`https://images.unsplash.com/photo-${1600000000000 + i * 100}?auto=format&fit=crop&w=400&q=80`} // Placeholder logic
                 />
               ))}
            </div>
          </motion.div>
        )}

        {/* LEADS VIEW */}
        {subView === 'leads' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-light text-slate-900">Active Leads</h2>
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                    <Button variant="outline" size="sm" className="rounded-full"><Users className="w-4 h-4 mr-2" /> Export</Button>
                 </div>
              </div>
              
              <div className="space-y-2">
                 {[
                   { name: "Alice Freeman", email: "alice@example.com", score: 92, status: "Negotiation", date: "Today" },
                   { name: "Robert Fox", email: "robert@example.com", score: 85, status: "Interested", date: "Yesterday" },
                   { name: "Darlene Robertson", email: "darlene@example.com", score: 45, status: "Cold", date: "2 days ago" },
                   { name: "Cody Fisher", email: "cody@example.com", score: 78, status: "Qualified", date: "3 days ago" },
                 ].map((lead, i) => (
                    <LeadRow key={i} {...lead} />
                 ))}
              </div>
           </motion.div>
        )}

        {/* INTELLIGENCE VIEW */}
        {subView === 'intelligence' && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6 animate-pulse">
                 <Brain className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-light text-slate-900 mb-4">AI Analysis in Progress</h2>
              <p className="text-slate-500 text-center max-w-md">
                 Our neural engine is analyzing market patterns for your region. 
                 Full report will be available in approximately 2 hours.
              </p>
           </motion.div>
        )}

      </div>
    </div>
  );
}
