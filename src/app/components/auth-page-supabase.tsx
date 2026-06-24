import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { supabaseAuthService } from '../lib/supabase-auth-service';
import { toast } from 'sonner@2.0.3';
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
  Zap,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: any) => void;
  onBack?: () => void;
}

export function AuthPageSupabase({ onLogin, onBack }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validação básica
      if (!loginEmail || !loginPassword) {
        throw new Error('Preencha todos os campos');
      }

      if (!loginEmail.includes('@')) {
        throw new Error('Email inválido');
      }

      // Fazer login via Supabase
      const result = await supabaseAuthService.login({
        email: loginEmail,
        password: loginPassword
      });

      if (!result.success) {
        throw new Error(result.error || 'Erro ao fazer login');
      }

      // Sucesso!
      toast.success('Login realizado com sucesso!');
      
      // Chamar callback com dados do usuário
      onLogin({
        ...result.user,
        access_token: result.session?.access_token
      });

    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro ao fazer login');
      toast.error(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

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

      if (signupPassword.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      if (signupPassword !== signupConfirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Criar conta via Supabase
      const result = await supabaseAuthService.signup({
        email: signupEmail,
        password: signupPassword,
        name: signupName
      });

      if (!result.success) {
        throw new Error(result.error || 'Erro ao criar conta');
      }

      // Sucesso!
      toast.success('Conta criada com sucesso! Agora você pode fazer login.');
      
      // Limpar campos de signup e mudar para aba de login
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      
      // Preencher email no login
      setLoginEmail(signupEmail);

    } catch (err: any) {
      console.error('Erro no signup:', err);
      setError(err.message || 'Erro ao criar conta');
      toast.error(err.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ImobHunter
          </h1>
          <p className="text-gray-600">
            Lead Generation & Nurturing Autônomo
          </p>
        </div>

        {/* Card de Autenticação */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Bem-vindo</CardTitle>
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}
            </div>
            <CardDescription>
              Entre na sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
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

              {/* Tab de Login */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
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
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Entrar
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Tab de Signup */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome Completo
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Digite a senha novamente"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Criar Conta Grátis
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Ao criar uma conta, você concorda com nossos termos de uso
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Sistema 100% seguro com criptografia Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
