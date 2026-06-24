import React, { useState, useEffect } from 'react';
import { useTheme } from '../lib/ThemeContext';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  User,
  Mail,
  Building2,
  Crown,
  Zap,
  Database,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    whatsapp: true,
    leadAlerts: true,
    weeklyReport: true
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('userSession');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      }
    }
  }, []);

  const adminEmails = [
    'admin@leadgen.pt',
    'joao.nunes@leadgen.pt',
    'cleber.couto@leadgen.pt',
    'dev.kwportugal@gmail.com',
    'joao@kw.pt',
  ];

  const isAdmin = currentUser && adminEmails.includes(currentUser.email?.toLowerCase());

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇵🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            Configurações
            {isAdmin && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                ADMIN
              </Badge>
            )}
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Personalize sua experiência e gerencie preferências
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Perfil do Usuário */}
        <Card className={`p-6 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Perfil do Usuário
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`text-sm font-medium block mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Nome Completo
              </label>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <User className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                  {currentUser?.name || 'Não informado'}
                </span>
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium block mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <Mail className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                  {currentUser?.email || 'Não informado'}
                </span>
              </div>
            </div>

            <div>
              <label className={`text-sm font-medium block mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Empresa
              </label>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <Building2 className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
                  {currentUser?.company || 'Não informado'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Aparência */}
        <Card className={`p-6 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-white" />
              )}
            </div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Aparência
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`text-sm font-medium block mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tema
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-purple-500 bg-purple-50'
                      : theme === 'dark'
                        ? 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Sun className={`w-6 h-6 mx-auto mb-2 ${
                    theme === 'light' ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium block ${
                    theme === 'light' 
                      ? 'text-purple-600' 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Claro
                  </span>
                </button>

                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Moon className={`w-6 h-6 mx-auto mb-2 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium block ${
                    theme === 'dark' ? 'text-purple-400' : 'text-gray-600'
                  }`}>
                    Escuro
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Idioma */}
        <Card className={`p-6 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Idioma
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentLanguage === lang.code
                    ? theme === 'dark'
                      ? 'border-purple-500 bg-purple-900/30'
                      : 'border-purple-500 bg-purple-50'
                    : theme === 'dark'
                      ? 'border-slate-600 bg-slate-700 hover:bg-slate-600'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl block mb-2">{lang.flag}</span>
                <span className={`text-sm font-medium block ${
                  currentLanguage === lang.code
                    ? 'text-purple-600'
                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Notificações */}
        <Card className={`p-6 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Notificações
            </h2>
          </div>

          <div className="space-y-3">
            {Object.entries({
              email: 'Notificações por Email',
              sms: 'Notificações por SMS',
              whatsapp: 'Notificações por WhatsApp',
              leadAlerts: 'Alertas de Novos Leads',
              weeklyReport: 'Relatório Semanal'
            }).map(([key, label]) => (
              <div 
                key={key}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
                }`}
              >
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {label}
                </span>
                <button
                  onClick={() => setNotifications({
                    ...notifications,
                    [key]: !notifications[key as keyof typeof notifications]
                  })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    notifications[key as keyof typeof notifications]
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                      : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Segurança */}
        <Card className={`p-6 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Segurança
            </h2>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className={`w-full justify-start ${
                theme === 'dark' 
                  ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
            <Button 
              variant="outline"
              className={`w-full justify-start ${
                theme === 'dark' 
                  ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Autenticação de Dois Fatores
            </Button>
            <Button 
              variant="outline"
              className={`w-full justify-start ${
                theme === 'dark' 
                  ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              Sessões Ativas
            </Button>
          </div>
        </Card>

        {/* Dados e Privacidade */}
        <Card className={`p-6 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Dados e Privacidade
            </h2>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline"
              className={`w-full justify-start ${
                theme === 'dark' 
                  ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Database className="w-4 h-4 mr-2" />
              Exportar Meus Dados
            </Button>
            <Button 
              variant="outline"
              className={`w-full justify-start ${
                theme === 'dark' 
                  ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <EyeOff className="w-4 h-4 mr-2" />
              Política de Privacidade
            </Button>
            <Button 
              variant="outline"
              className="w-full justify-start text-red-600 hover:bg-red-50 border-red-200"
            >
              Excluir Minha Conta
            </Button>
          </div>
        </Card>
      </div>

      {isAdmin && (
        <Card className="p-6 bg-gradient-to-br from-purple-600 to-blue-600 border-0 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6" />
            <h2 className="text-xl font-bold">Área do Administrador</h2>
          </div>
          <p className="text-purple-100 mb-4">
            Você possui privilégios administrativos completos no sistema.
          </p>
          <Button className="bg-white text-purple-600 hover:bg-purple-50">
            Acessar Painel Admin
          </Button>
        </Card>
      )}
    </div>
  );
}
