import React, { useState } from 'react';
import { ArrowLeft, Save, Settings as SettingsIcon, Bell, Clock } from 'lucide-react';
import { PageType } from '../App';

interface SettingsPageProps {
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

export function SettingsPage({ onNavigate, onLogout }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    reminder1Days: 3,
    reminder1Message: 'Olá! Este é um lembrete amigável de que a fatura {numero_fatura} no valor de {valor} vence em {dias} dias. Para qualquer questão, estamos à disposição.',
    reminder2Days: 1,
    reminder2Message: 'Atenção: A fatura {numero_fatura} vence amanhã. Por favor, proceda ao pagamento de {valor} para evitar juros.',
    overdueMessage: 'A fatura {numero_fatura} está em atraso há {dias_atraso} dias. Por favor, regularize o pagamento de {valor} o quanto antes.',
    escalationDays: 15,
    escalationMessage: 'Prezado cliente, a fatura {numero_fatura} está em atraso há {dias_atraso} dias. Caso não haja regularização, poderemos tomar medidas legais.',
  });

  const handleSave = () => {
    console.log('Configurações salvas:', settings);
    alert('Configurações guardadas com sucesso!');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
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
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-slate-800">Configurações</h2>
              <p className="text-slate-600">Régua de Cobrança Inteligente</p>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Reminder 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-slate-800">1º Lembrete (Antes do Vencimento)</h3>
            </div>
            
            <div className="mb-4">
              <label className="block text-slate-700 mb-2">
                Dias antes do vencimento
              </label>
              <input
                type="number"
                value={settings.reminder1Days}
                onChange={(e) => setSettings({ ...settings, reminder1Days: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={settings.reminder1Message}
                onChange={(e) => setSettings({ ...settings, reminder1Message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-slate-500 mt-2">
                Variáveis: {'{'}numero_fatura{'}'}, {'{'}valor{'}'}, {'{'}dias{'}'}
              </p>
            </div>
          </div>

          {/* Reminder 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-slate-800">2º Lembrete (Perto do Vencimento)</h3>
            </div>
            
            <div className="mb-4">
              <label className="block text-slate-700 mb-2">
                Dias antes do vencimento
              </label>
              <input
                type="number"
                value={settings.reminder2Days}
                onChange={(e) => setSettings({ ...settings, reminder2Days: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={settings.reminder2Message}
                onChange={(e) => setSettings({ ...settings, reminder2Message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <Bell className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-slate-800">Aviso de Atraso</h3>
            </div>

            <div>
              <label className="block text-slate-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={settings.overdueMessage}
                onChange={(e) => setSettings({ ...settings, overdueMessage: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-slate-500 mt-2">
                Variáveis: {'{'}numero_fatura{'}'}, {'{'}valor{'}'}, {'{'}dias_atraso{'}'}
              </p>
            </div>
          </div>

          {/* Escalation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-slate-800">Escalação (Cobrança Firme)</h3>
            </div>
            
            <div className="mb-4">
              <label className="block text-slate-700 mb-2">
                Dias após vencimento
              </label>
              <input
                type="number"
                value={settings.escalationDays}
                onChange={(e) => setSettings({ ...settings, escalationDays: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={settings.escalationMessage}
                onChange={(e) => setSettings({ ...settings, escalationMessage: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}
