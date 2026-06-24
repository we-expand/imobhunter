import { APISetupWizard } from './api-setup-wizard';
import { ApolloDiagnosticTool } from './apollo-diagnostic-tool';
import { ApolloTroubleshootBanner } from './apollo-troubleshoot-banner';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plug, Scale, Shield, Database, ArrowLeft, Settings, Crown, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ModernIntegrations } from './modern-integrations';
import { GDPRCompliance } from './gdpr-compliance';
import { SecuritySettings } from './security-settings';
import { AccessTokenManager } from './access-token-manager';
import { APIKeysDiagnostics } from './api-keys-diagnostics';
import { ApiDiagnosticsPanel } from './api-diagnostics-panel';
import { DataHub } from './data-hub';
import { AdminPlatformDashboard } from './admin-platform-dashboard';
import { ChatbotAdminSettings } from './chatbot-admin-settings';
import { QuickApiSetup } from './quick-api-setup';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Tentar pegar de 'current-user' ou 'userSession'
    let savedUser = localStorage.getItem('current-user');
    
    if (!savedUser) {
      // Fallback: tentar 'userSession'
      savedUser = localStorage.getItem('userSession');
    }
    
    console.log('🔍 [Settings] Checking user in localStorage:', savedUser);
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('✅ [Settings] User loaded:', user);
        console.log('📧 [Settings] User email:', user.email);
        setCurrentUser(user);
      } catch (e) {
        console.error('❌ [Settings] Error loading user:', e);
        // Criar usuário default para não quebrar
        setCurrentUser({ email: 'demo@imobhunter.com', name: 'Demo User' });
      }
    } else {
      console.warn('⚠️ [Settings] No user found in localStorage');
      // Criar usuário default para não quebrar
      setCurrentUser({ email: 'demo@imobhunter.com', name: 'Demo User' });
    }
  }, []);

  // Lista de emails com acesso Admin
  const adminEmails = [
    'admin@leadgen.pt',
    'joao.nunes@leadgen.pt',
    'cleber.couto@leadgen.pt',
    'dev.kwportugal@gmail.com', // 🔑 Admin KW Portugal
    'joao@kw.pt', // 🔑 João Nunes (dev)
  ];

  // Verifica se o usuário atual tem acesso admin
  const isAdmin = currentUser && (
    adminEmails.includes(currentUser.email?.toLowerCase()) ||
    currentUser.name?.toLowerCase() === 'joão nunes' ||
    currentUser.name?.toLowerCase() === 'joao nunes' ||
    currentUser.name?.toLowerCase() === 'cleber couto'
  );
  
  console.log('🔐 [Settings] Admin Verification:', {
    currentUser: currentUser?.email,
    currentUserName: currentUser?.name,
    adminEmails,
    isAdmin,
    emailLowerCase: currentUser?.email?.toLowerCase(),
    nameLowerCase: currentUser?.name?.toLowerCase()
  });

  // 🔥 LOADING STATE - Evitar tela branca
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg text-zinc-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* DEBUG INFO - Temporário para diagnóstico */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-xs text-yellow-200">
          <div className="font-bold mb-2">🔍 DEBUG - User Info:</div>
          <div>Email: {currentUser?.email || 'N/A'}</div>
          <div>Name: {currentUser?.name || 'N/A'}</div>
          <div>Is Admin? {isAdmin ? '✅ YES' : '❌ NO'}</div>
          <div className="mt-2 text-yellow-200/70">
            Admin Emails: {adminEmails.join(', ')}
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack} className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl flex items-center gap-2 text-white">
              <Settings className="w-6 h-6 text-zinc-400" />
              Settings
              {isAdmin && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center gap-1 border border-purple-500/30">
                  <Crown className="w-3 h-3" />
                  ADMIN
                </span>
              )}
            </h1>
            <p className="text-sm text-zinc-400">
              Manage integrations, security, and system data
              {isAdmin && <span className="text-purple-400 font-medium"> • Full administrator access</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Configurações */}
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'} bg-white/5 border border-white/10`}>
          <TabsTrigger value="integrations" className="gap-2 data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">
            <Plug className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="gdpr" className="gap-2 data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">
            <Scale className="w-4 h-4" />
            GDPR
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2 data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="gap-2 data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">
              <Crown className="w-4 h-4 text-purple-400" />
              Admin
            </TabsTrigger>
          )}
        </TabsList>

        {/* Integrações */}
        <TabsContent value="integrations">
          <ModernIntegrations />
        </TabsContent>

        {/* RGPD */}
        <TabsContent value="gdpr">
          <GDPRCompliance />
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="security" className="space-y-6">
          {/* 🆕 BANNER DE TROUBLESHOOTING - DESTAQUE */}
          <ApolloTroubleshootBanner />
          
          {/* 🆕 Configuração Rápida de APIs */}
          <div>
            <h2 className="text-xl mb-6 flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-indigo-400" />
              🚀 Quick API Setup
            </h2>
            <QuickApiSetup />
          </div>
          
          <SecuritySettings />
          
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl mb-6 flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-indigo-400" />
              Access Token Management
            </h2>
            <AccessTokenManager />
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl mb-6 flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-indigo-400" />
              API Keys Diagnostics
            </h2>
            <APIKeysDiagnostics />
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-xl mb-6 flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-indigo-400" />
              API Diagnostics
            </h2>
            <ApiDiagnosticsPanel />
          </div>
        </TabsContent>

        {/* Dados */}
        <TabsContent value="data">
          <DataHub />
        </TabsContent>

        {/* Admin */}
        <TabsContent value="admin">
          <AdminPlatformDashboard />
          <ChatbotAdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}