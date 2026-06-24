import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AuthPageV2Props {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

export function AuthPageV2({ onLogin, onBack }: AuthPageV2Props) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // ========== LOGIN PERFEITO ==========
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validações
      if (!loginEmail || !loginPassword) {
        throw new Error('Preencha todos os campos');
      }

      if (!loginEmail.includes('@')) {
        throw new Error('Email inválido');
      }

      // Busca usuário
      const users = JSON.parse(localStorage.getItem('app-users') || '[]');
      const user = users.find((u: any) => u.email.toLowerCase() === loginEmail.toLowerCase());

      if (!user) {
        throw new Error('Email não cadastrado. Por favor, crie uma conta.');
      }

      // Verifica senha
      if (user.password !== loginPassword) {
        throw new Error('Senha incorreta');
      }

      // Verifica se email foi verificado (se houver processo de verificação)
      if (user.emailVerified === false && user.status === 'pending_verification') {
        throw new Error('Por favor, confirme seu email antes de fazer login.');
      }

      // Envia email de notificação de login
      try {
        await emailService.sendLoginEmail(user.email, user.name);
      } catch (emailError) {
        console.warn('Email de notificação não enviado:', emailError);
      }

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

      // Salva sessão
      localStorage.setItem('current-user', JSON.stringify(sessionData));
      sessionStorage.setItem('active-session', 'true');
      localStorage.setItem('last-activity-timestamp', Date.now().toString());

      // Feedback
      toast.success(`Bem-vindo de volta, ${user.name}! 🎉`, {
        description: 'Login realizado com sucesso'
      });

      // Chama callback
      onLogin(sessionData);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ========== SIGNUP PERFEITO ==========
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validações
      if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
        throw new Error('Preencha todos os campos');
      }

      if (!signupEmail.includes('@')) {
        throw new Error('Email inválido');
      }

      if (signupPassword.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }

      if (signupPassword !== signupConfirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Verifica se email já existe
      const users = JSON.parse(localStorage.getItem('app-users') || '[]');
      if (users.find((u: any) => u.email.toLowerCase() === signupEmail.toLowerCase())) {
        throw new Error('Este email já está cadastrado');
      }

      // Cria novo usuário ATIVO (sem verificação de email para simplificar MVP)
      const newUser = {
        id: `user-${Date.now()}`,
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        createdAt: new Date().toISOString(),
        emailVerified: true, // Simplificado para MVP
        status: 'active',
        role: 'user',
        twoFactorEnabled: false,
        twoFactorSecret: ''
      };

      users.push(newUser);
      localStorage.setItem('app-users', JSON.stringify(users));

      // Envia email de boas-vindas
      try {
        await emailService.sendWelcomeEmail(signupEmail, signupName);
      } catch (emailError) {
        console.warn('Email de boas-vindas não enviado:', emailError);
      }

      // Cria sessão automaticamente
      const sessionData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        twoFactorEnabled: newUser.twoFactorEnabled,
        twoFactorSecret: newUser.twoFactorSecret
      };

      localStorage.setItem('current-user', JSON.stringify(sessionData));
      sessionStorage.setItem('active-session', 'true');
      localStorage.setItem('last-activity-timestamp', Date.now().toString());

      toast.success(`Conta criada com sucesso! Bem-vindo, ${signupName}! 🎉`, {
        description: 'Você já está logado e pronto para usar'
      });

      // Chama callback
      onLogin(sessionData);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Botão Voltar */}
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

        {/* Card Principal */}
        <Card className="shadow-2xl border-2">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle className="text-2xl">Keller Williams Portugal</CardTitle>
              <CardDescription className="text-base mt-2">
                Sistema de Lead Generation & Nurturing
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="signup" className="gap-2">
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* TAB LOGIN */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="border-red-300">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-600" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* TAB SIGNUP */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="border-red-300">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      Nome Completo
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="João Silva"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={isLoading}
                      autoComplete="name"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-600" />
                      Senha (mínimo 8 caracteres)
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={isLoading}
                        autoComplete="new-password"
                        className="h-12 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Confirmar Senha
                    </Label>
                    <Input
                      id="signup-confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Criar Conta e Entrar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
        </p>
      </div>
    </div>
  );
}
