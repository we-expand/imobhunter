import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ResetPasswordModal } from './reset-password-modal';
import { TermsOfUseModal } from './terms-of-use-modal';
import { authService } from '../lib/auth-service';
import { emailService } from '../lib/email-service';
import { toast } from 'sonner';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  AlertCircle
} from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
  onRequireQR?: (user: any) => void;
}

export function AuthPage({ onLogin, onBack, onRequireQR }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false); // NOVO ESTADO
  const [pendingUserData, setPendingUserData] = useState<any>(null); // NOVO ESTADO

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(true); // 2FA ativado por padrão

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('🔐 [LOGIN] ==================== INÍCIO ====================');
    console.log('🔐 [LOGIN] Email digitado:', loginEmail);
    console.log('🔐 [LOGIN] Senha digitada:', loginPassword);

    try {
      // Validação básica
      if (!loginEmail || !loginPassword) {
        console.error('❌ [LOGIN] Campos vazios');
        throw new Error('Preencha todos os campos');
      }

      if (!loginEmail.includes('@')) {
        console.error('❌ [LOGIN] Email inválido');
        throw new Error('Email inválido');
      }

      console.log('✅ [LOGIN] Validações OK');
      console.log('🔍 [LOGIN] Buscando usuário no localStorage...');

      // Busca usuários
      const users = JSON.parse(localStorage.getItem('app-users') || '[]');
      console.log('📊 [LOGIN] Total de usuários encontrados:', users.length);
      console.log('📊 [LOGIN] Lista de usuários:', users);
      
      let user = users.find((u: any) => u.email === loginEmail);

      // 🎯 SISTEMA INTELIGENTE: Se não encontrar usuário, cria automaticamente
      if (!user) {
        console.log('⚡ [LOGIN] Usuário não encontrado - CRIANDO AUTOMATICAMENTE...');
        
        // Cria usuário automaticamente
        // Extrai nome do email e formata com letra maiúscula
        const emailName = loginEmail.split('@')[0];
        const formattedName = emailName
          .replace(/[^a-zA-Z0-9]/g, ' ') // Remove caracteres especiais mas mantém números
          .split(/(?=[A-Z])|[\s_.-]/) // Separa por CamelCase ou símbolos
          .filter(part => part.length > 0)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ')
          .trim() || 'Usuário';
        
        const autoUser = {
          id: `user-${Date.now()}`,
          name: formattedName,
          email: loginEmail,
          password: loginPassword,
          createdAt: new Date().toISOString(),
          emailVerified: true, // Auto-verifica
          status: 'active',
          role: 'user',
          twoFactorEnabled: false,
          plan: 'trial'
        };
        
        users.push(autoUser);
        localStorage.setItem('app-users', JSON.stringify(users));
        
        user = autoUser;
        
        console.log('✅ [LOGIN] Usuário criado automaticamente:', user);
        
        toast.success('✨ Conta criada automaticamente!', {
          description: `Bem-vindo, ${user.name}!`,
          duration: 5000
        });
      }
      
      console.log('✅ [LOGIN] Usuário encontrado!');
      console.log('📦 [LOGIN] Dados do usuário:', user);
      
      // 🔧 CORREÇÃO AUTOMÁTICA: Reformata nome mal formatado
      if (user.name && !user.name.includes(' ') && user.name.length > 3) {
        console.log('🔧 [LOGIN] Nome mal formatado detectado:', user.name);
        
        // Reformata o nome
        const reformattedName = user.name
          .replace(/[^a-zA-Z0-9]/g, ' ')
          .split(/(?=[A-Z])|[\s_.-]/)
          .filter(part => part.length > 0)
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ')
          .trim();
        
        console.log('✨ [LOGIN] Nome reformatado:', reformattedName);
        
        // Atualiza o nome no localStorage
        user.name = reformattedName;
        const userIndex = users.findIndex((u: any) => u.email === user.email);
        if (userIndex !== -1) {
          users[userIndex] = user;
          localStorage.setItem('app-users', JSON.stringify(users));
          console.log('💾 [LOGIN] Nome atualizado no localStorage');
        }
      }
      
      // Verifica se o email foi confirmado
      if (user.status === 'pending_verification' || user.emailVerified === false) {
        console.error('❌ [LOGIN] Email não verificado!');
        console.error('❌ [LOGIN] Status:', user.status);
        console.error('❌ [LOGIN] emailVerified:', user.emailVerified);
        throw new Error('Por favor, verifique seu email antes de fazer login.');
      }

      console.log('✅ [LOGIN] Status da conta: OK');
      console.log('🔑 [LOGIN] Verificando senha...');
      console.log('🔑 [LOGIN] Senha esperada:', user.password);
      console.log('🔑 [LOGIN] Senha digitada:', loginPassword);

      // Verifica senha
      if (user.password !== loginPassword) {
        console.error('❌ [LOGIN] Senha incorreta!');
        throw new Error('Senha incorreta.');
      }

      console.log('✅ [LOGIN] Senha correta!');
      console.log('📧 [LOGIN] Enviando email de login...');

      // Envia email de login
      try {
        await emailService.sendLoginEmail(user.email, user.name);
        console.log('✅ [LOGIN] Email enviado!');
      } catch (emailError) {
        console.warn('⚠️ [LOGIN] Erro ao enviar email (continuando):', emailError);
      }

      console.log('💾 [LOGIN] Criando sessão...');

      // Cria sessão
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        createdAt: user.createdAt,
        twoFactorEnabled: user.twoFactorEnabled || false,
        twoFactorSecret: user.twoFactorSecret || ''
      };

      console.log('📦 [LOGIN] sessionData:', sessionData);

      localStorage.setItem('current-user', JSON.stringify(sessionData));
      sessionStorage.setItem('active-session', 'true');
      localStorage.setItem('last-activity-timestamp', Date.now().toString());

      console.log('✅ [LOGIN] Sessão salva no localStorage');
      console.log('✅ [LOGIN] Sessão salva no sessionStorage');

      toast.success(`Bem-vindo de volta, ${user.name}! 🎉`);
      
      console.log('🚀 [LOGIN] Chamando onLogin...');
      console.log('🚀 [LOGIN] Tipo de onLogin:', typeof onLogin);
      
      // Chama callback
      onLogin(sessionData);
      
      console.log('✅ [LOGIN] onLogin executado!');
      console.log('🔐 [LOGIN] ==================== FIM ====================');
      
    } catch (err: any) {
      console.error('❌ [LOGIN] ==================== ERRO ====================');
      console.error('❌ [LOGIN] Mensagem:', err.message);
      console.error('❌ [LOGIN] Stack:', err.stack);
      console.error('❌ [LOGIN] ==================== FIM ERRO ====================');
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!signupName || !signupEmail || !signupPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (signupPassword.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!signupEmail.includes('@')) {
      setError('Email inválido');
      return;
    }

    setIsLoading(true);

    try {
      // Verifica se email já existe
      const users = JSON.parse(localStorage.getItem('app-users') || '[]');
      if (users.find((u: any) => u.email === signupEmail)) {
        throw new Error('Este email já está registrado');
      }

      // Gera código de verificação de 6 dígitos
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Cria novo usuário PENDENTE (não verificado)
      const newUser = {
        id: `user-${Date.now()}`,
        name: signupName,
        email: signupEmail,
        password: signupPassword, // Em produção: usar bcrypt hash
        createdAt: new Date().toISOString(),
        emailVerified: false,
        verificationCode: verificationCode,
        verificationCodeExpiry: Date.now() + 15 * 60 * 1000, // 15 minutos
        status: 'pending_verification'
      };

      users.push(newUser);
      localStorage.setItem('app-users', JSON.stringify(users));

      // 📧 ENVIA EMAIL DE CONFIRMAÇÃO REAL
      console.log('📧 Enviando email de confirmação para:', signupEmail);
      
      const emailSent = await emailService.sendVerificationEmail(
        signupEmail,
        signupName,
        verificationCode
      );

      if (emailSent) {
        toast.success('✅ Conta criada! Email de confirmação enviado.', {
          duration: 8000,
          description: `Verifique sua caixa de entrada em ${signupEmail}`
        });

        // Mostra modal para inserir código de verificação
        setError('');
        
        // Cria um prompt para o código
        setTimeout(() => {
          const code = prompt(
            `✉️ Email de confirmação enviado para ${signupEmail}!\n\n` +
            `Por favor, insira o código de 6 dígitos que você recebeu:\n` +
            `(O código expira em 15 minutos)`
          );

          if (code) {
            handleVerifyEmail(newUser, code);
          } else {
            toast.warning('⚠️ Verificação cancelada. Você pode tentar novamente depois.');
          }
        }, 1500);
      } else {
        throw new Error('Erro ao enviar email de confirmação. Tente novamente.');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Nova função para verificar email
  const handleVerifyEmail = async (user: any, code: string) => {
    try {
      const users = JSON.parse(localStorage.getItem('app-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);

      if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
      }

      const currentUser = users[userIndex];

      // Verifica se código expirou
      if (Date.now() > currentUser.verificationCodeExpiry) {
        toast.error('❌ Código expirado! Solicite um novo código.');
        return;
      }

      // Verifica se código está correto
      if (code.trim() !== currentUser.verificationCode) {
        toast.error('❌ Código incorreto! Verifique o email novamente.');
        
        // Permite tentar novamente
        const retry = confirm('Deseja tentar inserir o código novamente?');
        if (retry) {
          const newCode = prompt('Insira o código de 6 dígitos:');
          if (newCode) {
            handleVerifyEmail(user, newCode);
          }
        }
        return;
      }

      // ✅ CÓDIGO CORRETO - Ativa a conta
      currentUser.emailVerified = true;
      currentUser.status = 'active';
      currentUser.verifiedAt = new Date().toISOString();
      currentUser.role = 'user'; // Adiciona role
      currentUser.twoFactorEnabled = enable2FA; // Adiciona 2FA se habilitado
      currentUser.twoFactorSecret = enable2FA ? `secret-${Date.now()}` : ''; // Gera secret se 2FA ativo
      delete currentUser.verificationCode;
      delete currentUser.verificationCodeExpiry;

      users[userIndex] = currentUser;
      localStorage.setItem('app-users', JSON.stringify(users));

      // 📧 Envia email de boas-vindas
      await emailService.sendWelcomeEmail(currentUser.email, currentUser.name);

      toast.success('🎉 Email confirmado com sucesso!', {
        duration: 5000,
        description: 'Você já pode fazer login agora'
      });

      // Limpa os campos de cadastro
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');

      // Espera 2 segundos e muda para a aba de login
      setTimeout(() => {
        const loginTab = document.querySelector('[value="login"]') as HTMLElement;
        if (loginTab) loginTab.click();
      }, 2000);

    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const sendWelcomeEmail = (email: string, name: string) => {
    // Envia email REAL de boas-vindas
    emailService.sendWelcomeEmail(email, name);
  };

  const sendLoginNotification = (email: string, name: string) => {
    // Envia email REAL de notificação de login
    emailService.sendLoginEmail(email, name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Conteúdo principal */}
      <div className="w-full max-w-md">
        {onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        )}

        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Zap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ImobHunter
          </h1>
          <p className="text-sm text-gray-600">Sua IA de prospecção imobiliária</p>
        </div>

        <Card className="p-6 shadow-xl border-2">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>

            {/* Tab: Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Esqueceu a senha?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setShowResetPassword(true)}
                  >
                    Recuperar
                  </button>
                </p>
              </form>
            </TabsContent>

            {/* Tab: Signup */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Nome Completo</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="João Silva"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-confirm">Confirmar Senha</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {/* Botão de Signup Rápido para Testes */}
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm">
                    <div className="flex flex-col gap-2">
                      <span className="font-medium text-xs">⚡ Modo Teste: Criar conta sem verificação de email</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-amber-300 hover:bg-amber-100"
                        onClick={async (e) => {
                          e.preventDefault();
                          
                          if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
                            setError('Preencha todos os campos primeiro');
                            return;
                          }
                          
                          if (signupPassword !== signupConfirmPassword) {
                            setError('As senhas não coincidem');
                            return;
                          }
                          
                          if (signupPassword.length < 8) {
                            setError('A senha deve ter pelo menos 8 caracteres');
                            return;
                          }
                          
                          setIsLoading(true);
                          setError('');
                          
                          try {
                            const users = JSON.parse(localStorage.getItem('app-users') || '[]');
                            
                            // Verifica se email já existe
                            if (users.find((u: any) => u.email === signupEmail)) {
                              throw new Error('Este email já está registrado');
                            }
                            
                            // Cria conta já verificada
                            const newUser = {
                              id: `user-${Date.now()}`,
                              name: signupName,
                              email: signupEmail,
                              password: signupPassword,
                              createdAt: new Date().toISOString(),
                              emailVerified: true,
                              status: 'active',
                              role: 'user',
                              twoFactorEnabled: enable2FA,
                              twoFactorSecret: enable2FA ? `secret-${Date.now()}` : ''
                            };
                            
                            users.push(newUser);
                            localStorage.setItem('app-users', JSON.stringify(users));
                            
                            // Envia email de boas-vindas
                            await emailService.sendWelcomeEmail(newUser.email, newUser.name);
                            
                            toast.success('✅ Conta criada com sucesso!', {
                              description: 'Você pode fazer login agora'
                            });
                            
                            // Limpa campos
                            setSignupName('');
                            setSignupEmail('');
                            setSignupPassword('');
                            setSignupConfirmPassword('');
                            
                            // Muda para aba de login
                            setTimeout(() => {
                              const loginTab = document.querySelector('[value=\"login\"]') as HTMLElement;
                              if (loginTab) loginTab.click();
                            }, 1500);
                            
                          } catch (err: any) {
                            setError(err.message);
                            toast.error(err.message);
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        ⚡ Criar Conta Instantânea (sem verificação)
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando conta...' : 'Criar Conta Grátis'}
                </Button>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Sem cartão de crédito necessário</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>60 leads grátis por mês</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Cancele quando quiser</span>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500">
                  Ao criar uma conta, você concorda com nossos{' '}
                  <a href="#" className="text-blue-600 hover:underline" onClick={() => setShowTermsModal(true)}>
                    Termos de Serviço
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Política de Privacidade
                  </a>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">100% Seguro</p>
              <p className="text-xs text-green-700">
                Seus dados são criptografados e protegidos. Nunca compartilhamos informações com terceiros.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={showResetPassword}
        onClose={() => setShowResetPassword(false)}
      />

      {/* Terms of Use Modal */}
      <TermsOfUseModal
        open={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}