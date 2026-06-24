import { useState, useEffect } from 'react';
import { useTheme } from '../lib/ThemeContext';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Instagram, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Send, 
  MessageCircle,
  Users,
  TrendingUp,
  Zap,
  Bot,
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface InstagramAccount {
  id: string;
  username: string;
  name: string;
  profilePicUrl: string;
  followersCount: number;
  followingCount: number;
  isConnected: boolean;
  accessToken?: string;
}

export function InstagramIntegration() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [aiAutomationEnabled, setAiAutomationEnabled] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState('');
  
  // Stats de mensagens
  const [stats, setStats] = useState({
    messagesSent: 0,
    messagesReceived: 0,
    activeConversations: 0,
    responseRate: 0
  });

  // Verificar status da conexão ao carregar
  useEffect(() => {
    checkInstagramConnection();
  }, []);

  const checkInstagramConnection = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/instagram/status`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
        setAccount(data.account);
        setStats(data.stats || stats);
        setAiAutomationEnabled(data.aiAutomationEnabled || false);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão Instagram:', error);
    }
  };

  const connectInstagram = async () => {
    setIsLoading(true);
    
    try {
      // Iniciar fluxo OAuth do Instagram
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/instagram/auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Abrir popup para autenticação
        const authWindow = window.open(
          data.authUrl,
          'Instagram Login',
          'width=600,height=700'
        );

        // Aguardar callback de autenticação
        const checkAuth = setInterval(async () => {
          if (authWindow?.closed) {
            clearInterval(checkAuth);
            await checkInstagramConnection();
            
            if (isConnected) {
              toast.success('✅ Instagram conectado!', {
                description: 'Sua conta foi conectada com sucesso'
              });
            }
          }
        }, 1000);
      }
    } catch (error: any) {
      toast.error('❌ Erro ao conectar Instagram', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectInstagram = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/instagram/disconnect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      setIsConnected(false);
      setAccount(null);
      setAiAutomationEnabled(false);
      
      toast.success('Instagram desconectado');
    } catch (error: any) {
      toast.error('Erro ao desconectar', {
        description: error.message
      });
    }
  };

  const toggleAiAutomation = async () => {
    const newState = !aiAutomationEnabled;
    
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/instagram/ai-automation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ enabled: newState })
        }
      );

      setAiAutomationEnabled(newState);
      
      toast.success(newState ? '🤖 IA ativada!' : 'IA pausada', {
        description: newState 
          ? 'A IA agora pode enviar e responder mensagens automaticamente'
          : 'Automação de mensagens desativada'
      });
    } catch (error: any) {
      toast.error('Erro ao alterar automação', {
        description: error.message
      });
    }
  };

  const testMessage = async () => {
    if (!messageTemplate.trim()) {
      toast.error('Digite uma mensagem para testar');
      return;
    }

    setIsLoading(true);
    
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/instagram/send-test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ message: messageTemplate })
        }
      );

      toast.success('✅ Mensagem de teste enviada!');
    } catch (error: any) {
      toast.error('Erro ao enviar mensagem', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Instagram Direct Messages
              </h2>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Conecte sua conta e deixe a IA conversar automaticamente com leads via DM
              </p>
            </div>
          </div>

          {isConnected ? (
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <CheckCircle className="w-4 h-4 mr-1" />
              Conectado
            </Badge>
          ) : (
            <Badge variant="outline" className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              <AlertCircle className="w-4 h-4 mr-1" />
              Não conectado
            </Badge>
          )}
        </div>
      </Card>

      {/* Connection Status */}
      {!isConnected ? (
        <Card className={`p-8 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Instagram className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Conecte sua conta do Instagram
              </h3>
              <p className={`text-sm max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Permita que a IA envie mensagens diretas, responda automaticamente e mantenha conversas 
                com leads interessados em imóveis
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <Button
                onClick={connectInstagram}
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white border-0"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Instagram className="w-5 h-5 mr-2" />
                    Conectar Instagram
                  </>
                )}
              </Button>

              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                🔒 Conexão segura via Instagram Basic Display API & Graph API
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-left">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <Bot className="w-6 h-6 text-purple-500 mb-2" />
                <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  IA Conversacional
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Responde automaticamente com contexto do negócio imobiliário
                </p>
              </div>

              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <Send className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Prospecção Ativa
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Inicia conversas com leads qualificados automaticamente
                </p>
              </div>

              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Taxa de Conversão +300%
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Respostas instantâneas aumentam engajamento drasticamente
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Account Info */}
          {account && (
            <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={account.profilePicUrl || 'https://via.placeholder.com/64'} 
                    alt={account.username}
                    className="w-16 h-16 rounded-full border-2 border-purple-500"
                  />
                  <div>
                    <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      @{account.username}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.name}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        <strong>{account.followersCount.toLocaleString()}</strong> seguidores
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        <strong>{account.followingCount.toLocaleString()}</strong> seguindo
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectInstagram}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Desconectar
                </Button>
              </div>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <Send className="w-8 h-8 text-blue-500" />
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Enviadas
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stats.messagesSent}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Recebidas
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stats.messagesReceived}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Conversas Ativas
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stats.activeConversations}
                  </p>
                </div>
              </div>
            </Card>

            <Card className={`p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Taxa de Resposta
                  </p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stats.responseRate}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Automation Control */}
          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${aiAutomationEnabled ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                  <Bot className={`w-6 h-6 ${aiAutomationEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                <div>
                  <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Automação com IA
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {aiAutomationEnabled 
                      ? '🤖 IA respondendo mensagens automaticamente'
                      : 'IA pausada - sem envio automático'
                    }
                  </p>
                </div>
              </div>

              <Button
                onClick={toggleAiAutomation}
                className={aiAutomationEnabled 
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                }
              >
                {aiAutomationEnabled ? 'Pausar IA' : 'Ativar IA'}
              </Button>
            </div>

            {aiAutomationEnabled && (
              <div className={`p-4 rounded-lg border ${
                theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                      ✅ IA Ativa - Modo Automático
                    </p>
                    <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                      <li>• Responde mensagens recebidas em até 30 segundos</li>
                      <li>• Inicia conversas com leads qualificados do LinkedIn</li>
                      <li>• Agenda visitas e envia informações de imóveis</li>
                      <li>• Aprende com cada conversa para melhorar respostas</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Message Template Test */}
          <Card className={`p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white'}`}>
            <h3 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Testar Mensagem
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label>Mensagem de Teste</Label>
                <textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Ex: Olá! Vi seu perfil e achei interessante. Tenho alguns imóveis que podem ser perfeitos para você..."
                  className={`w-full p-3 rounded-lg border min-h-[100px] ${
                    theme === 'dark' 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <Button
                onClick={testMessage}
                disabled={isLoading || !messageTemplate.trim()}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem de Teste
                  </>
                )}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
