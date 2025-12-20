import React from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  LogOut
} from 'lucide-react';
import { PageType } from '../App';

interface DashboardProps {
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
  user: any;
}

export function Dashboard({ onNavigate, onLogout, user }: DashboardProps) {
  const stats = [
    {
      label: 'Total em Atraso',
      value: '€ 45.230,00',
      trend: '+12%',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Pagamentos Esperados',
      value: '€ 28.450,00',
      trend: '+8%',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Recebido este Mês',
      value: '€ 67.890,00',
      trend: '+23%',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Taxa de Recuperação',
      value: '78%',
      trend: '+5%',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const quickActions = [
    {
      title: 'Clientes',
      description: 'Gerir base de clientes',
      icon: Users,
      color: 'from-emerald-500 to-cyan-500',
      page: 'clients' as PageType,
    },
    {
      title: 'Faturas',
      description: 'Visualizar e gerir faturas',
      icon: FileText,
      color: 'from-cyan-500 to-blue-500',
      page: 'invoices' as PageType,
    },
    {
      title: 'WhatsApp',
      description: 'Conexão e mensagens',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-500',
      page: 'whatsapp' as PageType,
    },
    {
      title: 'Configurações',
      description: 'Régua de cobrança',
      icon: Settings,
      color: 'from-indigo-500 to-purple-500',
      page: 'settings' as PageType,
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h1 className="text-emerald-600">Tá Pago.pt</h1>
                <p className="text-slate-600">
                  Bem-vindo, {user?.email || 'Utilizador'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-emerald-600">{stat.trend}</span>
                </div>
                <p className="text-slate-600 mb-1">{stat.label}</p>
                <p className={stat.color}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => onNavigate(action.page)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-slate-800 mb-2">{action.title}</h3>
                <p className="text-slate-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
