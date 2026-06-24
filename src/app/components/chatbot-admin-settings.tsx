import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { useTheme } from '../lib/ThemeContext';
import { Bot, Save, RefreshCw, MessageCircle, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ChatbotAdminSettings() {
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState({
    enabled: true,
    welcomeMessage: 'Olá! 👋 Sou o assistente virtual da LeadGen AI. Como posso ajudá-lo hoje?',
    supportEmail: 'cleber.couto@we-expand.com',
    supportPhone: '+351 XXX XXX XXX',
    autoResponse: true,
    businessHours: {
      enabled: false,
      start: '09:00',
      end: '18:00'
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('chatbot-admin-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...settings, ...parsed });
      } catch (e) {
        console.error('Erro ao carregar configurações do chatbot:', e);
      }
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      localStorage.setItem('chatbot-admin-settings', JSON.stringify(settings));
      
      toast.success('✅ Configurações salvas!', {
        description: 'As configurações do chatbot foram atualizadas'
      });
    } catch (error) {
      toast.error('❌ Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      enabled: true,
      welcomeMessage: 'Olá! 👋 Sou o assistente virtual da LeadGen AI. Como posso ajudá-lo hoje?',
      supportEmail: 'cleber.couto@we-expand.com',
      supportPhone: '+351 XXX XXX XXX',
      autoResponse: true,
      businessHours: {
        enabled: false,
        start: '09:00',
        end: '18:00'
      }
    };
    
    setSettings(defaultSettings);
    toast.info('Configurações restauradas para padrão');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Configurações do Chatbot
              </CardTitle>
              <CardDescription>
                Configure o assistente virtual que aparece para todos os usuários
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Status do Chatbot */}
      <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Status Global
          </CardTitle>
          <CardDescription>
            Ativar ou desativar o chatbot para todos os usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className={`text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Chatbot Ativo
              </Label>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {settings.enabled 
                  ? '✅ Chatbot visível para todos os usuários' 
                  : '⚠️ Chatbot desativado - não aparecerá para ninguém'
                }
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mensagem de Boas-Vindas */}
      <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            <MessageCircle className="w-5 h-5 inline mr-2" />
            Mensagem de Boas-Vindas
          </CardTitle>
          <CardDescription>
            Primeira mensagem que o usuário vê ao abrir o chat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Mensagem</Label>
            <Textarea
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
              placeholder="Digite a mensagem de boas-vindas..."
              rows={3}
              className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
            />
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Dica: Use emojis para tornar a mensagem mais amigável 👋 😊
            </p>
          </div>

          {/* Preview */}
          <div className={`p-4 rounded-lg border-2 border-dashed ${
            theme === 'dark' ? 'border-slate-600 bg-slate-700/50' : 'border-gray-300 bg-gray-50'
          }`}>
            <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Preview:
            </p>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className={`px-4 py-2 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-white text-gray-900 border border-gray-200'
              }`}>
                <p className="text-sm">{settings.welcomeMessage || 'Digite uma mensagem...'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Informações de Suporte
          </CardTitle>
          <CardDescription>
            Contatos que serão exibidos quando o usuário solicitar ajuda humana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email de Suporte
            </Label>
            <Input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              placeholder="suporte@leadgen.ai"
              className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone de Suporte
            </Label>
            <Input
              type="tel"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              placeholder="+351 XXX XXX XXX"
              className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
            />
          </div>
        </CardContent>
      </Card>

      {/* Horário Comercial */}
      <Card className={theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Horário Comercial
          </CardTitle>
          <CardDescription>
            Configure mensagens diferentes fora do horário comercial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Ativar Horário Comercial</Label>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Exibe mensagem especial fora do horário
              </p>
            </div>
            <Switch
              checked={settings.businessHours.enabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                businessHours: { ...settings.businessHours, enabled: checked }
              })}
            />
          </div>

          {settings.businessHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Início</Label>
                <Input
                  type="time"
                  value={settings.businessHours.start}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: { ...settings.businessHours, start: e.target.value }
                  })}
                  className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
                />
              </div>
              <div>
                <Label>Fim</Label>
                <Input
                  type="time"
                  value={settings.businessHours.end}
                  onChange={(e) => setSettings({
                    ...settings,
                    businessHours: { ...settings.businessHours, end: e.target.value }
                  })}
                  className={theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : ''}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex-1"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          className={theme === 'dark' ? 'border-slate-600 text-gray-300' : ''}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Restaurar Padrão
        </Button>
      </div>

      {/* Info Card */}
      <Card className={`border-2 ${
        theme === 'dark' 
          ? 'bg-blue-900/20 border-blue-700' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Bot className={`w-5 h-5 flex-shrink-0 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div className="space-y-1">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
              }`}>
                💡 Dica: Teste o chatbot
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
              }`}>
                Após salvar, abra o chatbot no canto inferior direito para ver como os usuários visualizarão as alterações.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
