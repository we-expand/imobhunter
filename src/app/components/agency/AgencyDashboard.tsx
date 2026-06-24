import { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  TrendingUp,
  Activity,
  Globe,
  Brain,
  Database,
  Plug2,
  ShieldAlert,
  Shield,
  Beaker,
  BarChart3,
  DollarSign,
  Key,
  Zap
} from "lucide-react";
import { AgencyLogo } from "./AgencyLogo";

// Importações dos componentes funcionais originais
import { ModernDashboardV2 } from '../modern-dashboard-v2';
import { AICommandCenterV2 } from '../ai-command-center-v2';
import { DataManagerV2 } from '../data-manager-v2';
import { APIConfigPanel } from '../APIConfigPanel';
import { AITargetSearch } from '../AITargetSearch';
import { ModernIntegrations } from '../modern-integrations';
import { SettingsPage } from '../settings-page-v2';
import { AdminPlatformDashboard } from '../AdminPlatformDashboard';
import { DevLab } from '../DevLab';
import { FinancialStudy } from '../financial-study';
import { ApiDiagnosticsPanel } from '../api-diagnostics-panel';
import { ApolloAPITester } from '../apollo-api-tester';
import { useLanguage } from '../../lib/i18n/LanguageContext';

interface AgencyDashboardProps {
  user: any;
  onLogout: () => void;
  // Props de dados herdadas do Dashboard Wrapper
  clusters?: any[];
  leads?: any[];
  activities?: any[];
  aiActive?: boolean;
  onToggleAI?: () => void;
  onUpdateCluster?: (id: string, updates: any) => void;
  onLeadUpdate?: (leadId: string, updates: any) => void;
}

export const AgencyDashboard = ({ 
  user, 
  onLogout,
  clusters = [],
  leads = [],
  activities = [],
  aiActive = false,
  onToggleAI = () => {},
  onUpdateCluster = () => {},
  onLeadUpdate = () => {}
}: AgencyDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { t } = useLanguage();

  // Verifica permissão de SUPER ADMIN
  const isSuperAdmin = user?.email === 'cleber.couto@we-expand.com' || user?.email === 'admin@imobhunter.com';

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Command', 
      icon: LayoutDashboard,
      component: (
        <ModernDashboardV2
          clusters={clusters}
          leads={leads}
          activities={activities}
          aiActive={aiActive}
          onToggleAI={onToggleAI}
          onUpdateCluster={onUpdateCluster}
          onLeadUpdate={onLeadUpdate}
        />
      )
    },
    { 
      id: 'search', 
      label: 'Targets (Search)', 
      icon: Search,
      component: <AITargetSearch onNavigateToIntegrations={() => setActiveTab('integrations')} />
    },
    { 
      id: 'ai-center', 
      label: 'AI Core', 
      icon: Brain,
      component: <AICommandCenterV2 />
    },
    { 
      id: 'data-hub', 
      label: 'Data Hub', 
      icon: Database,
      component: <DataManagerV2 />
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: Plug2,
      component: <ModernIntegrations />
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      component: <SettingsPage />
    },
  ];

  // Itens do Sistema (abaixo do divisor)
  const systemMenuItems = [
    {
      id: 'admin-sistema',
      label: 'Admin',
      icon: Shield,
      component: <AdminPlatformDashboard />
    },
    {
      id: 'laboratorio-neural',
      label: 'Laboratório Neural',
      icon: Beaker,
      component: <DevLab />
    },
    {
      id: 'analise-competitiva',
      label: 'Análise Competitiva',
      icon: BarChart3,
      component: (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Análise Competitiva</h2>
          <p className="text-zinc-400">Análise de mercado e concorrência.</p>
        </div>
      )
    },
    {
      id: 'estudo-financeiro',
      label: 'Estudo Financeiro',
      icon: DollarSign,
      component: <FinancialStudy />
    },
    {
      id: 'configuracoes-api',
      label: 'Configurações de API',
      icon: Key,
      component: <APIConfigPanel />
    },
    {
      id: 'diagnostico-api',
      label: 'Diagnóstico de API',
      icon: ShieldAlert,
      component: <ApiDiagnosticsPanel />
    },
    {
      id: 'testador-api-apollo',
      label: 'Apollo API Test',
      icon: Zap,
      component: <ApolloAPITester />
    }
  ];

  const currentItem = menuItems.find(item => item.id === activeTab) || systemMenuItems.find(item => item.id === activeTab) || menuItems[0];

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col justify-between transition-all duration-300 z-50">
        <div>
          <div className="h-28 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
             <div className="scale-50 lg:scale-75 origin-left pt-2 pb-2 pl-2">
                <AgencyLogo />
             </div>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? "text-white bg-white/5" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-indigo-400" : "group-hover:text-indigo-400"}`} />
                <span className="hidden lg:block">{item.label}</span>
                
                {/* Active Indicator */}
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-indigo-500"
                  />
                )}
              </button>
            ))}
            
            {/* Divider after Settings */}
            <div className="pt-2 flex justify-center">
              <div className="w-[30px] h-px bg-zinc-700" />
            </div>
            
            {/* Sistema Label */}
            <div className="pt-3 text-center">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">SISTEMA</span>
            </div>
            
            {/* System Menu Items */}
            {systemMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? "text-white bg-white/5" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`h-5 w-5 ${activeTab === item.id ? "text-indigo-400" : "group-hover:text-indigo-400"}`} />
                <span className="hidden lg:block">{item.label}</span>
                
                {/* Active Indicator */}
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-indigo-500"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="hidden lg:block">Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        {/* Top Bar */}
        <header className="h-20 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-40">
           <div className="flex items-center gap-4 text-zinc-400 text-sm">
              <span className="flex items-center gap-2">
                 <Globe size={14} className="text-indigo-500" /> Global Network
              </span>
              <span className="h-4 w-[1px] bg-white/10" />
              <span className="text-green-400 flex items-center gap-2">
                 <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Online
              </span>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">{user?.email || "Agent"}</p>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 flex items-center justify-center text-white font-bold">
                    {user?.email?.[0].toUpperCase() || 'A'}
                 </div>
              </div>
           </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
           {/* Background Grid */}
           <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
           </div>

           <div className="relative z-10 p-6 md:p-8 min-h-full">
              {/* Dynamic Component Render */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {currentItem.component}
              </motion.div>
           </div>
        </div>
      </main>
    </div>
  );
};