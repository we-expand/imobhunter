import { Bell, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Page } from '../App';
import { toast } from 'sonner';

interface HeaderProps {
  onLogout?: () => void;
  userName?: string;
  onNavigate?: (page: Page) => void;
}

export function Header({ onLogout, userName, onNavigate }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userEmail = userName || 'utilizador@exemplo.com';
  const userDisplayName = userEmail.split('@')[0];
  const userInitials = userDisplayName.substring(0, 2).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Bem-vindo, {userDisplayName}</h1>
          <p className="text-gray-600">Gerencie suas faturas e cobranças</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notificações */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Menu do Usuário */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="text-right">
                <p className="text-gray-800">{userDisplayName}</p>
                <p className="text-gray-600">Admin</p>
              </div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{userInitials}</span>
                {/* Badge Online */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* Informação do Usuário */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-gray-800 font-medium">{userDisplayName}</p>
                  <p className="text-gray-600 text-sm">{userEmail}</p>
                </div>

                {/* Opções do Menu */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate?.('configuracoes');
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      toast.success('A terminar sessão...', {
                        description: 'Até breve! 👋'
                      });
                      setTimeout(() => {
                        onLogout?.();
                      }, 500);
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Plataforma</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}