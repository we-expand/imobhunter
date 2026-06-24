import { ModernDashboardV2 } from './modern-dashboard-v2';
import { AICommandCenterV2 } from './ai-command-center-v2';
import { DataManagerV2 } from './data-manager-v2';
import { ModernIntegrations } from './modern-integrations';
import { SettingsPage } from './settings-page';
import { AdvancedSearchEngineWrapper } from './advanced-search-engine-wrapper';
import { RealSearchEngine } from './real-search-engine';
import { AdvancedLeadSearch } from './advanced-lead-search';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { DevLab } from './DevLab';
import { AdminPlatformDashboard } from './AdminPlatformDashboard';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { useTheme } from '../lib/ThemeContext';
import { 
  Home, 
  Search, 
  Brain, 
  Database, 
  Plug2, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Globe,
  Bell,
  LogOut,
  Terminal,
  ShieldAlert
} from 'lucide-react';

interface PremiumDashboardProps {
  user: any;
  onLogout: () => void;
  clusters: any[];
  leads: any[];
  activities: any[];
  aiActive: boolean;
  onToggleAI: () => void;
  onUpdateCluster: (id: string, updates: any) => void;
  onLeadUpdate: (leadId: string, updates: any) => void;
}

export function PremiumDashboard({ 
  user, 
  onLogout, 
  clusters, 
  leads, 
  activities, 
  aiActive, 
  onToggleAI, 
  onUpdateCluster, 
  onLeadUpdate 
}: PremiumDashboardProps) {
  const { t, language: currentLanguage, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Verifica permissão de SUPER ADMIN (cleber.couto@we-expand.com)
  const isSuperAdmin = user?.email === 'cleber.couto@we-expand.com' || user?.email === 'admin@imobhunter.com';

  const menuItems = [
    { 
      id: 'dashboard', 
      label: (() => {
        // Formata nome com primeira letra maiúscula
        const formatName = (name: string) => {
          return name.split(' ')
            .map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
            .join(' ');
        };
        
        const fullName = user?.name ? formatName(user.name) : '';
        const email = user?.email || '';
        
        // Retorna: "Nome Sobrenome (email)"
        return fullName 
          ? `Dashboard - ${fullName} (${email})` 
          : `Dashboard - ${email}`;
      })(),
      icon: Home,
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'search', 
      label: t('nav.search') || 'Buscar Leads', 
      icon: Search,
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      id: 'ai-center', 
      label: t('nav.aiCenter') || 'Centro IA', 
      icon: Brain,
      gradient: 'from-violet-500 to-purple-500',
      badge: 'NEW'
    },
    { 
      id: 'data-hub', 
      label: t('nav.dataHub') || 'Data Hub', 
      icon: Database,
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      id: 'integrations', 
      label: t('nav.integrations') || 'Integrações', 
      icon: Plug2,
      gradient: 'from-rose-500 to-pink-500'
    },
    // Item exclusivo para SUPER ADMIN
    ...(isSuperAdmin ? [{
      id: 'admin-console',
      label: 'Admin Console',
      icon: ShieldAlert,
      gradient: 'from-slate-700 to-slate-900',
      badge: 'ROOT'
    }] : []),
    { 
      id: 'settings',  
      label: t('nav.settings') || 'Configurações', 
      icon: Settings,
      gradient: 'from-slate-500 to-gray-500'
    }
  ];

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  const currentMenuItem = menuItems.find(item => item.id === currentView);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'
    }`}>
      <div className="flex h-screen">
        
        {/* Sidebar */}
        <aside className={`
          fixed left-0 top-0 bottom-0 z-40
          ${sidebarOpen ? 'w-72' : 'w-20'}
          ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white border-gray-200'}
          border-r shadow-xl
          transition-all duration-300 ease-in-out
          hidden md:flex flex-col
        `}>
          {/* Logo Section */}
          <div className={`p-8 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ImobHunter
                    </h2>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      AI Lead Generation
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                }`}
              >
                {sidebarOpen ? (
                  <ChevronLeft className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                ) : (
                  <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-4 rounded-xl
                    transition-all duration-200
                    ${isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/20` 
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-slate-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="font-medium text-base">{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-white/20 text-white border-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Section - Removed logout button, now in header */}
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <aside className={`absolute left-0 top-0 bottom-0 w-80 shadow-2xl ${
              theme === 'dark' ? 'bg-slate-900' : 'bg-white'
            }`}>
              <div className={`p-6 border-b flex items-center justify-between ${
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      LeadGen AI
                    </h2>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Real Estate Pro
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-slate-800'
                            : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto bg-white/20 text-white border-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'md:pl-[303px]' : 'md:pl-[95px]'
        }`}>
          
          {/* Top Bar */}
          <header className={`border-b ${
            theme === 'dark' 
              ? 'bg-slate-900/95 border-slate-700/50' 
              : 'bg-white/95 border-gray-200'
          } backdrop-blur-sm px-6 py-4 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={`md:hidden p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <Menu className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>

                <div className="flex items-center gap-3">
                  {currentMenuItem && (
                    <div className={`p-2 bg-gradient-to-br ${currentMenuItem.gradient} rounded-lg`}>
                      <currentMenuItem.icon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {currentMenuItem?.label || 'Dashboard'}
                    </h1>
                    <p className={`text-xs hidden sm:block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t('dashboard.subtitle') || 'Gerencie seus leads e campanhas'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Globe className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                    <span className={`text-sm font-medium uppercase ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {currentLanguage}
                    </span>
                  </button>

                  {showLanguageMenu && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 overflow-hidden ${
                      theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                    }`}>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setShowLanguageMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                            currentLanguage === lang.code
                              ? theme === 'dark' ? 'bg-slate-700' : 'bg-purple-50'
                              : theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {lang.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Status Badge */}
                <div className={`px-3 py-2 rounded-lg hidden sm:flex items-center gap-2 ${
                  aiActive 
                    ? theme === 'dark' ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
                    : theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    aiActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {aiActive ? 'IA Ativa' : 'IA Pausada'}
                  </span>
                </div>

                {/* Notifications */}
                <button className={`relative p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                }`}>
                  <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
                
                {/* Logout Button */}
                <Button
                  onClick={onLogout}
                  size="sm"
                  variant="ghost"
                  className={`flex items-center gap-2 font-light text-xs ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-slate-800 hover:text-gray-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('nav.logout') || 'Sair'}</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-[1600px] mx-auto">
              {currentView === 'dashboard' && (
                <ModernDashboardV2
                  clusters={clusters}
                  leads={leads}
                  activities={activities}
                  aiActive={aiActive}
                  onToggleAI={onToggleAI}
                  onUpdateCluster={onUpdateCluster}
                  onLeadUpdate={onLeadUpdate}
                />
              )}
              {currentView === 'ai-center' && <AICommandCenterV2 />}
              {currentView === 'data-hub' && <DataManagerV2 />}
              {currentView === 'integrations' && <ModernIntegrations />}
              {currentView === 'admin-console' && <AdminPlatformDashboard />}
              {currentView === 'settings' && <SettingsPage onBack={() => setCurrentView('dashboard')} />}
              {currentView === 'search' && (
                <AdvancedLeadSearch />
              )}
              {currentView === 'analytics' && (
                <ModernDashboardV2
                  clusters={clusters}
                  leads={leads}
                  activities={activities}
                  aiActive={aiActive}
                  onToggleAI={onToggleAI}
                  onUpdateCluster={onUpdateCluster}
                  onLeadUpdate={onLeadUpdate}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}