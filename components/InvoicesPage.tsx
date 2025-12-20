import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, FileText, Calendar, DollarSign } from 'lucide-react';
import { PageType } from '../App';

interface InvoicesPageProps {
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

export function InvoicesPage({ onNavigate, onLogout }: InvoicesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const mockInvoices = [
    {
      id: 'FT2024/001',
      client: 'Empresa ABC Lda',
      amount: 15430,
      issueDate: '2024-10-15',
      dueDate: '2024-11-15',
      status: 'overdue',
      daysOverdue: 22,
    },
    {
      id: 'FT2024/002',
      client: 'João Silva Unipessoal',
      amount: 8200,
      issueDate: '2024-11-20',
      dueDate: '2024-12-20',
      status: 'pending',
      daysOverdue: 0,
    },
    {
      id: 'FT2024/003',
      client: 'Maria Costa & Filhos',
      amount: 12500,
      issueDate: '2024-11-01',
      dueDate: '2024-12-01',
      status: 'paid',
      daysOverdue: 0,
    },
  ];

  const getStatusBadge = (invoice: any) => {
    switch (invoice.status) {
      case 'overdue':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
            {invoice.daysOverdue} dias de atraso
          </span>
        );
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full">Pendente</span>;
      case 'paid':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full">Paga</span>;
      default:
        return null;
    }
  };

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <h2 className="text-slate-800 mb-4">Gestão de Faturas</h2>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar faturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todos os Estados</option>
              <option value="overdue">Em Atraso</option>
              <option value="pending">Pendente</option>
              <option value="paid">Paga</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-slate-600">Em Atraso</span>
            </div>
            <p className="text-red-600">€ 15.430,00</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-slate-600">Pendente</span>
            </div>
            <p className="text-amber-600">€ 8.200,00</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-slate-600">Pago</span>
            </div>
            <p className="text-emerald-600">€ 12.500,00</p>
          </div>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-slate-800 mb-1">{invoice.id}</h3>
                  <p className="text-slate-600">{invoice.client}</p>
                </div>
                {getStatusBadge(invoice)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-500 mb-1">Data de Emissão</p>
                  <p className="text-slate-700">
                    {new Date(invoice.issueDate).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Data de Vencimento</p>
                  <p className="text-slate-700">
                    {new Date(invoice.dueDate).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Valor</p>
                  <p className={invoice.status === 'paid' ? 'text-emerald-600' : 'text-red-600'}>
                    € {invoice.amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
