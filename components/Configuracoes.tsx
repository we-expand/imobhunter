import { useState } from 'react';
import { Settings, MessageCircle, Mail, Bot, Phone, Volume2 } from 'lucide-react';
import { EmailSetup } from './EmailSetup';
import { SMSSetup } from './SMSSetup';
import { WhatsAppBusinessConnect } from './WhatsAppBusinessConnect';

type ConfigSection = 'overview' | 'whatsapp' | 'email' | 'ia' | 'sms' | 'voz';

export function Configuracoes() {
  const [activeSection, setActiveSection] = useState<ConfigSection>('overview');

  return (
    <div className="w-full">
      {/* Header Configurações */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-emerald-600" />
          <h1 className="text-emerald-700">⚙️ Configurações</h1>
        </div>
        <p className="text-slate-600">
          Configure as integrações e definições do seu sistema Cobra+
        </p>
      </div>

      {/* Overview - Grid de Cards */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card WhatsApp */}
          <button
            onClick={() => setActiveSection('whatsapp')}
            className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-emerald-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-500 transition-colors">
                <MessageCircle className="w-6 h-6 text-emerald-600 group-hover:text-white" />
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                Ativa
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">WhatsApp Business</h3>
            <p className="text-sm text-slate-600 mb-4">
              Configure sua conexão via QR Code para enviar mensagens automáticas
            </p>
            <div className="text-emerald-600 text-sm font-semibold group-hover:text-emerald-700">
              Configurar →
            </div>
          </button>

          {/* Card Email */}
          <button
            onClick={() => setActiveSection('email')}
            className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-500 transition-colors">
                <Mail className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                Pronto
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Email Marketing</h3>
            <p className="text-sm text-slate-600 mb-4">
              Envie cobranças e lembretes por email de forma automática
            </p>
            <div className="text-blue-600 text-sm font-semibold group-hover:text-blue-700">
              Configurar →
            </div>
          </button>

          {/* Card IA */}
          <button
            onClick={() => setActiveSection('ia')}
            className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-500 transition-colors">
                <Bot className="w-6 h-6 text-purple-600 group-hover:text-white" />
              </div>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                Pronto
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Assistente IA</h3>
            <p className="text-sm text-slate-600 mb-4">
              Configure as chaves API para automação inteligente de cobranças
            </p>
            <div className="text-purple-600 text-sm font-semibold group-hover:text-purple-700">
              Configurar →
            </div>
          </button>

          {/* Card SMS */}
          <button
            onClick={() => setActiveSection('sms')}
            className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-cyan-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-cyan-100 p-3 rounded-lg group-hover:bg-cyan-500 transition-colors">
                <Phone className="w-6 h-6 text-cyan-600 group-hover:text-white" />
              </div>
              <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">
                Pronto
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">SMS</h3>
            <p className="text-sm text-slate-600 mb-4">
              Envie mensagens SMS para clientes sem WhatsApp ou email
            </p>
            <div className="text-cyan-600 text-sm font-semibold group-hover:text-cyan-700">
              Configurar →
            </div>
          </button>

          {/* Card Voz */}
          <button
            onClick={() => setActiveSection('voz')}
            className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-amber-500 hover:shadow-xl transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-500 transition-colors">
                <Volume2 className="w-6 h-6 text-amber-600 group-hover:text-white" />
              </div>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                Em breve
              </span>
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Chamada de Voz</h3>
            <p className="text-sm text-slate-600 mb-4">
              Configure mensagens de voz automáticas para cobrança ativa
            </p>
            <div className="text-amber-600 text-sm font-semibold group-hover:text-amber-700">
              Configurar →
            </div>
          </button>

          {/* Card Geral */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-6">
            <div className="bg-slate-200 p-3 rounded-lg mb-4 inline-block">
              <Settings className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">Configurações Gerais</h3>
            <p className="text-sm text-slate-600 mb-4">
              Preferências do sistema, idioma, fuso horário e notificações
            </p>
            <div className="text-slate-500 text-sm font-semibold">
              Em breve →
            </div>
          </div>
        </div>
      )}

      {/* Seção WhatsApp */}
      {activeSection === 'whatsapp' && (
        <div>
          <button
            onClick={() => setActiveSection('overview')}
            className="mb-6 text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-semibold"
          >
            ← Voltar para Configurações
          </button>
          <div className="space-y-6">
            <WhatsAppBusinessConnect />
          </div>
        </div>
      )}

      {/* Seção Email */}
      {activeSection === 'email' && (
        <div>
          <button
            onClick={() => setActiveSection('overview')}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold"
          >
            ← Voltar para Configurações
          </button>
          <EmailSetup />
        </div>
      )}

      {/* Seção SMS */}
      {activeSection === 'sms' && (
        <div>
          <button
            onClick={() => setActiveSection('overview')}
            className="mb-6 text-cyan-600 hover:text-cyan-700 flex items-center gap-2 font-semibold"
          >
            ← Voltar para Configurações
          </button>
          <SMSSetup />
        </div>
      )}

      {/* Seção IA */}
      {activeSection === 'ia' && (
        <div>
          <button
            onClick={() => setActiveSection('overview')}
            className="mb-6 text-purple-600 hover:text-purple-700 flex items-center gap-2 font-semibold"
          >
            ← Voltar para Configurações
          </button>
          <div className="bg-white border-2 border-purple-200 rounded-xl p-12 text-center">
            <Bot className="w-20 h-20 mx-auto text-purple-400 mb-6" />
            <h2 className="text-purple-700 text-2xl mb-4">🤖 Assistente IA</h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              O assistente de IA já está configurado e ativo no sistema. 
              Ele analisa o perfil comportamental dos clientes e sugere as melhores estratégias de cobrança.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-purple-800">
                <strong>✅ Status:</strong> Ativo e funcionando
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Seção Voz */}
      {activeSection === 'voz' && (
        <div>
          <button
            onClick={() => setActiveSection('overview')}
            className="mb-6 text-amber-600 hover:text-amber-700 flex items-center gap-2 font-semibold"
          >
            ← Voltar para Configurações
          </button>
          <div className="bg-white border-2 border-amber-200 rounded-xl p-12 text-center">
            <Volume2 className="w-20 h-20 mx-auto text-amber-400 mb-6" />
            <h2 className="text-amber-700 text-2xl mb-4">📞 Chamadas de Voz</h2>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              A funcionalidade de chamadas de voz automáticas estará disponível em breve.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-amber-800">
                <strong>🚧 Status:</strong> Em desenvolvimento
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}