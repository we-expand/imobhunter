import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import './styles/globals.css';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { ClientsPage } from './components/ClientsPage';
import { InvoicesPage } from './components/InvoicesPage';
import { WhatsAppPage } from './components/WhatsAppPage';
import { SettingsPage } from './components/SettingsPage';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export type PageType = 'dashboard' | 'clients' | 'invoices' | 'whatsapp' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setIsAuthenticated(true);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session?.access_token) {
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true };
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50">
      {currentPage === 'dashboard' && (
        <Dashboard 
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
          user={user}
        />
      )}
      {currentPage === 'clients' && (
        <ClientsPage 
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'invoices' && (
        <InvoicesPage 
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'whatsapp' && (
        <WhatsAppPage 
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'settings' && (
        <SettingsPage 
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
