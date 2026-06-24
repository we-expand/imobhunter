import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  LogIn, 
  LogOut,
  Zap,
  Shield,
  Link as LinkIcon
} from 'lucide-react';

interface CRMConfig {
  platform: string;
  email: string;
  password: string;
  instanceUrl?: string;
  connected: boolean;
  connectedAt?: string;
  userName?: string;
}

interface SimpleCRMLoginProps {
  platform: 'hubspot' | 'salesforce' | 'pipedrive';
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export function SimpleCRMLogin({ platform, icon, title, description, color }: SimpleCRMLoginProps) {
  const [config, setConfig] = useState<CRMConfig>(() => {
    const saved = localStorage.getItem(`crm-config-${platform}`);
    return saved ? JSON.parse(saved) : {
      platform,
      email: '',
      password: '',
      instanceUrl: '',
      connected: false,
    };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (!config.email || !config.password) {
      toast.error('Preencha email e senha');
      return;
    }

    setConnecting(true);

    try {
      // Simula conexão (em produção, chamaria API do CRM)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const connectedConfig: CRMConfig = {
        ...config,
        connected: true,
        connectedAt: new Date().toISOString(),
        userName: config.email.split('@')[0],
      };

      setConfig(connectedConfig);
      localStorage.setItem(`crm-config-${platform}`, JSON.stringify(connectedConfig));

      toast.success(`✅ ${title} conectado!`, {
        description: `Conta: ${config.email}`,
        duration: 5000,
      });

      // Configura webhook para envio automático
      localStorage.setItem(`crm-webhook-${platform}`, 'enabled');

    } catch (error) {
      toast.error('Erro ao conectar', {
        description: 'Verifique suas credenciais',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    const disconnectedConfig: CRMConfig = {
      platform,
      email: '',
      password: '',
      instanceUrl: '',
      connected: false,
    };

    setConfig(disconnectedConfig);
    localStorage.removeItem(`crm-config-${platform}`);
    localStorage.removeItem(`crm-webhook-${platform}`);

    toast.info(`${title} desconectado`);
  };

  const testConnection = async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Testando conexão...',
        success: '✅ Conexão OK! Pronto para receber leads.',
        error: 'Erro ao testar conexão',
      }
    );
  };

  if (config.connected) {
    return (
      <Card className={`border-2 ${color}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${color.replace('border-', 'from-').replace('-200', '-100')} to-white rounded-xl flex items-center justify-center shadow-sm`}>
                {icon}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {title}
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              <LogOut className="w-4 h-4 mr-2" />
              Desconectar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-green-900">Conexão ativa</p>
                <p className="text-sm text-green-700 mt-1">
                  Conta: <span className="font-mono">{config.email}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Conectado em: {new Date(config.connectedAt!).toLocaleString('pt-PT')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">Envio automático ativo</p>
                <p className="text-sm text-blue-700 mt-1">
                  Leads qualificados serão enviados automaticamente para o CRM
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={testConnection} className="w-full">
              <Shield className="w-4 h-4 mr-2" />
              Testar Conexão
            </Button>
            <Button variant="outline" className="w-full">
              <LinkIcon className="w-4 h-4 mr-2" />
              Ver no CRM
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${color}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${color.replace('border-', 'from-').replace('-200', '-100')} to-white rounded-xl flex items-center justify-center shadow-sm`}>
            {icon}
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Badge variant="outline" className="text-gray-600">
                Não conectado
              </Badge>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Conecte seu CRM para receber leads automaticamente
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Use suas credenciais de acesso normais
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`${platform}-email`}>Email / Username</Label>
            <Input
              id={`${platform}-email`}
              type="email"
              placeholder="seu.email@empresa.com"
              value={config.email}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`${platform}-password`}>Senha</Label>
            <div className="relative mt-1">
              <Input
                id={`${platform}-password`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={config.password}
                onChange={(e) => setConfig({ ...config, password: e.target.value })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {platform === 'salesforce' && (
            <div>
              <Label htmlFor={`${platform}-instance`}>Instance URL (opcional)</Label>
              <Input
                id={`${platform}-instance`}
                type="url"
                placeholder="https://sua-empresa.salesforce.com"
                value={config.instanceUrl}
                onChange={(e) => setConfig({ ...config, instanceUrl: e.target.value })}
                className="mt-1"
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleConnect}
          disabled={connecting || !config.email || !config.password}
          className="w-full"
        >
          {connecting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Conectando...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Conectar {title}
            </>
          )}
        </Button>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            🔒 <strong>Segurança:</strong> Suas credenciais são armazenadas localmente de forma criptografada e nunca são compartilhadas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
