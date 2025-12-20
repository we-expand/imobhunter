import React, { useState } from 'react';
import { ArrowLeft, Search, Plus, Mail, Phone, Building, MapPin } from 'lucide-react';
import { PageType } from '../App';

interface ClientsPageProps {
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

export function ClientsPage({ onNavigate, onLogout }: ClientsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const mockClients = [
    {
      id: 1,
      name: 'Empresa ABC Lda',
      email: 'contato@empresaabc.pt',
      phone: '+351 912 345 678',
      nif: '501234567',
      address: 'Rua Principal, 123, Lisboa',
      totalDebt: 15430,
      status: 'overdue',
    },
    {
      id: 2,
      name: 'João Silva Unipessoal',
      email: 'joao@silva.pt',
      phone: '+351 913 456 789',
      nif: '502345678',
      address: 'Av. da Liberdade, 45, Porto',
      totalDebt: 8200,
      status: 'pending',
    },
    {
      id: 3,
      name: 'Maria Costa & Filhos',
      email: 'maria@costa.pt',
      phone: '+351 914 567 890',
      nif: '503456789',
      address: 'Praça do Comércio, 78, Coimbra',
      totalDebt: 0,
      status: 'paid',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">Em Atraso</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full">Pendente</span>;
      case 'paid':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full">Em Dia</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={onLogout}
              className="text-slate-600 hover:text-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
          <h2 className="text-slate-800 mb-4">Gestão de Clientes</h2>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Novo Cliente
            </button>
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-4">
          {mockClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-slate-800 mb-2">{client.name}</h3>
                  {getStatusBadge(client.status)}
                </div>
                <div className="text-right">
                  <p className="text-slate-600 mb-1">Total em Dívida</p>
                  <p className={client.totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}>
                    € {client.totalDebt.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-5 h-5 text-emerald-500" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-cyan-500" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Building className="w-5 h-5 text-blue-500" />
                  <span>NIF: {client.nif}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-purple-500" />
                  <span>{client.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
