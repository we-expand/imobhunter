import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { AgencyLandingPage } from './components/agency/AgencyLandingPage';
import { AgencyLogin } from './components/agency/AgencyLogin';
import { AgencyDashboard } from './components/agency/AgencyDashboard';
import { Dashboard } from './components/dashboard';
import { APITestDashboard } from './components/api-test-dashboard';
import { ApiDiagnosticsPanel } from './components/api-diagnostics-panel';
import { ApolloErrorBanner } from './components/apollo-error-banner';
import { LanguageProvider } from './lib/i18n/LanguageContext';
import { ThemeProvider } from './lib/ThemeContext';
import { useAuthStore } from './hooks/useAuthStore';
import { SmartAuth } from './components/SmartAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { InteractiveBackground } from './components/ui/InteractiveBackground';
import { DeployHelper } from './components/DeployHelper';
import { DemoGate } from './components/DemoGate';
import { Rocket } from 'lucide-react';

type AppView = 'landing' | 'auth' | 'app' | 'api-test' | 'deploy-helper';

// 🔐 ATIVAR PROTEÇÃO DE DEMO (configurar para true em produção)
const ENABLE_DEMO_PROTECTION = false; // ⚠️ TEMPORARIAMENTE DESATIVADO PARA ACESSO DIRETO

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [viewOverride, setViewOverride] = useState<AppView | null>(null);

  // Check URL for deploy-helper route
  React.useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      
      console.log('Checking route - hash:', hash, 'pathname:', pathname);
      
      if (hash === '#deploy-helper' || pathname.includes('deploy-helper')) {
        console.log('Deploy helper route detected!');
        setViewOverride('deploy-helper');
      }
    };
    
    // Check on mount
    checkRoute();
    
    // Check on hash change
    window.addEventListener('hashchange', checkRoute);
    
    return () => {
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleStartLogin = () => setViewOverride('auth');
  const handleBackToLanding = () => setViewOverride('landing');
  const handleAPITest = () => setViewOverride('api-test');
  
  const handleLogout = () => {
    logout();
    setViewOverride(null);
  };

  let ComponentToRender;

  if (viewOverride === 'deploy-helper') {
    ComponentToRender = <DeployHelper />;
  } else if (viewOverride === 'api-test') {
    ComponentToRender = <APITestDashboard />;
  } else if (viewOverride === 'auth') {
    if (isAuthenticated) {
        ComponentToRender = <AgencyDashboard user={user} onLogout={handleLogout} />;
    } else {
        ComponentToRender = <AgencyLogin onBack={handleBackToLanding} />;
    }
  } else if (viewOverride === 'landing') {
    ComponentToRender = (
      <AgencyLandingPage 
        onGetStarted={handleStartLogin} 
        onLogin={handleStartLogin}      
        onAPITest={handleAPITest}
      />
    );
  } else {
    if (isAuthenticated && user) {
      ComponentToRender = <AgencyDashboard user={user} onLogout={handleLogout} />;
    } else {
      ComponentToRender = (
        <AgencyLandingPage 
          onGetStarted={handleStartLogin} 
          onLogin={handleStartLogin}      
          onAPITest={handleAPITest}
        />
      );
    }
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        {/* 🔐 PROTEÇÃO DE DEMO - Wrap condicional */}
        {ENABLE_DEMO_PROTECTION ? (
          <DemoGate
            password="@c35612m"
            title="ImobHunter - Portfolio Demo"
            message="Demonstração privada do projeto ImobHunter para apresentação profissional"
            presenterName="Tester"
            contactEmail="teste@imobhunter.io"
          >
            <div className="min-h-screen relative font-sans text-slate-900 overflow-x-hidden">
              
              {/* 🚨 BANNER DE ERRO APOLLO - SEMPRE VISÍVEL NO TOPO */}
              <ApolloErrorBanner />
              
              {/* Background Interativo Global (Ethereal Flow) */}
              <InteractiveBackground />

              {/* Botão Deploy Helper removido */}

              <Toaster 
                position="top-right" 
                richColors 
                theme="light"
                toastOptions={{
                    style: {
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        color: '#1e293b',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                    }
                }}
              />
              
              <ErrorBoundary>
                <div className="relative z-10">
                    {ComponentToRender}
                </div>
              </ErrorBoundary>
            </div>
          </DemoGate>
        ) : (
          <div className="min-h-screen relative font-sans text-slate-900 overflow-x-hidden">
            
            {/* 🚨 BANNER DE ERRO APOLLO - SEMPRE VISÍVEL NO TOPO */}
            <ApolloErrorBanner />
            
            {/* Background Interativo Global (Ethereal Flow) */}
            <InteractiveBackground />

            {/* Botão Deploy Helper removido */}

            <Toaster 
              position="top-right" 
              richColors 
              theme="light"
              toastOptions={{
                  style: {
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      color: '#1e293b',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }
              }}
            />
            
            <ErrorBoundary>
              <div className="relative z-10">
                  {ComponentToRender}
              </div>
            </ErrorBoundary>
          </div>
        )}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;