import { Home, Users, FileText, Send, Settings, Zap, Activity } from 'lucide-react';
import { Logo } from './Logo';
import type { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Page, icon: Home, label: 'Dashboard' },
    { id: 'clientes' as Page, icon: Users, label: 'Clientes' },
    { id: 'faturas' as Page, icon: FileText, label: 'Faturas' },
    { id: 'regua-tempo' as Page, icon: Send, label: 'Régua Cobrança' },
    { id: 'automacao-ia' as Page, icon: Zap, label: 'Automação IA' },
    { id: 'aidemo' as Page, icon: Activity, label: 'Simulador IA' },
    { id: 'configuracoes' as Page, icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Logo size="md" variant="full" className="cursor-pointer hover:opacity-80 transition-opacity" />
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-50 to-cyan-50 text-emerald-600 border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}