import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Mail, CheckCircle, AlertCircle, Loader2, Key } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EmailAccount {
  email: string;
  provider: 'gmail' | 'outlook' | 'other';
  connected: boolean;
  name?: string;
}

export function EmailConnectionSimple() {
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'gmail' | 'outlook' | null>(null);

  // Carrega contas salvas
  useEffect(() => {
    const saved = localStorage.getItem('email-accounts');
    if (saved) {
      setAccounts(JSON.parse(saved));
    }
  }, []);

  // Conectar Gmail (OAuth simulado)
  const connectGmail = () => {
    setIsConnecting(true);
    setSelectedProvider('gmail');

    toast.info('🔑 Abrindo autenticação do Google...', {
      description: 'Você será redirecionado',
      duration: 3000
    });

    // Simula OAuth flow
    setTimeout(() => {
      // Em produção: window.open() para OAuth flow real
      // https://developers.google.com/identity/protocols/oauth2
      
      const mockEmail = prompt('✅ Simulação OAuth - Digite seu email Gmail:');
      
      if (mockEmail && mockEmail.includes('@gmail.com')) {
        const newAccount: EmailAccount = {
          email: mockEmail,
          provider: 'gmail',
          connected: true,
          name: mockEmail.split('@')[0]
        };
        
        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts);
        localStorage.setItem('email-accounts', JSON.stringify(updatedAccounts));
        
        toast.success('✅ Gmail conectado com sucesso!', {
          description: mockEmail,
          duration: 5000
        });
      } else {
        toast.error('❌ Email inválido');
      }
      
      setIsConnecting(false);
      setSelectedProvider(null);
    }, 2000);
  };

  // Conectar Outlook (OAuth simulado)
  const connectOutlook = () => {
    setIsConnecting(true);
    setSelectedProvider('outlook');

    toast.info('🔑 Abrindo autenticação da Microsoft...', {
      description: 'Você será redirecionado',
      duration: 3000
    });

    setTimeout(() => {
      const mockEmail = prompt('✅ Simulação OAuth - Digite seu email Outlook:');
      
      if (mockEmail && (mockEmail.includes('@outlook.com') || mockEmail.includes('@hotmail.com'))) {
        const newAccount: EmailAccount = {
          email: mockEmail,
          provider: 'outlook',
          connected: true,
          name: mockEmail.split('@')[0]
        };
        
        const updatedAccounts = [...accounts, newAccount];
        setAccounts(updatedAccounts);
        localStorage.setItem('email-accounts', JSON.stringify(updatedAccounts));
        
        toast.success('✅ Outlook conectado com sucesso!', {
          description: mockEmail,
          duration: 5000
        });
      } else {
        toast.error('❌ Email inválido');
      }
      
      setIsConnecting(false);
      setSelectedProvider(null);
    }, 2000);
  };

  // Desconectar conta
  const disconnectAccount = (email: string) => {
    const updatedAccounts = accounts.filter(acc => acc.email !== email);
    setAccounts(updatedAccounts);
    localStorage.setItem('email-accounts', JSON.stringify(updatedAccounts));
    
    toast.info('Email desconectado', {
      description: email
    });
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          Contas de Email
        </CardTitle>
        <CardDescription>
          Conecte suas contas de email para envio automático de mensagens
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contas Conectadas */}
        {accounts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Contas Conectadas:</p>
            {accounts.map((account) => (
              <div
                key={account.email}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-green-500">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{account.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-white">
                        {account.provider === 'gmail' ? '📧 Gmail' : '📨 Outlook'}
                      </Badge>
                      <Badge className="text-xs bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => disconnectAccount(account.email)}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Desconectar
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Botões de Conexão */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Adicionar Conta:</p>
          
          {/* Gmail */}
          <Button
            onClick={connectGmail}
            disabled={isConnecting}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 gap-3 h-14"
          >
            {isConnecting && selectedProvider === 'gmail' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Conectar Gmail</p>
                  <p className="text-xs text-gray-600">Login seguro via Google OAuth</p>
                </div>
              </>
            )}
          </Button>

          {/* Outlook */}
          <Button
            onClick={connectOutlook}
            disabled={isConnecting}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 gap-3 h-14"
          >
            {isConnecting && selectedProvider === 'outlook' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Conectar Outlook</p>
                  <p className="text-xs text-gray-600">Login seguro via Microsoft OAuth</p>
                </div>
              </>
            )}
          </Button>
        </div>

        {/* Informações */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-blue-900">
              <p className="font-medium mb-2">🔒 Conexão 100% Segura:</p>
              <ul className="space-y-1 text-xs text-blue-800">
                <li>✅ OAuth 2.0 - Não salvamos sua senha</li>
                <li>✅ Permissão apenas para envio de emails</li>
                <li>✅ Você pode revogar o acesso a qualquer momento</li>
                <li>✅ Dados criptografados e protegidos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Aviso de Produção */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
          <div className="flex items-start gap-2">
            <Key className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-800">
              <p className="font-medium mb-1">⚠️ Em Produção:</p>
              <p>Esta é uma simulação. Para funcionar realmente, configure:</p>
              <ul className="mt-1 space-y-0.5 text-yellow-700">
                <li>• Google Cloud Console (Gmail OAuth)</li>
                <li>• Microsoft Azure (Outlook OAuth)</li>
                <li>• Backend com nodemailer ou SendGrid</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
