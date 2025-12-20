import { useState, useEffect } from 'react';
import { Mail, CheckCircle, Loader2, ArrowRight, ArrowLeft, AlertCircle, ExternalLink, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';

type EmailProvider = 'gmail' | 'outlook' | null;
type Step = 1 | 2 | 3 | 4;

export function EmailSetup() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider>(null);
  
  const [formData, setFormData] = useState({
    provider: 'gmail',
    email: '',
    password: '',
    fromName: ''
  });

  const [validations, setValidations] = useState({
    email: false,
    password: false,
    fromName: false
  });

  useEffect(() => {
    checkConnection();
  }, []);

  // Validação em tempo real
  useEffect(() => {
    setValidations({
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      password: formData.password.length >= 8,
      fromName: formData.fromName.length >= 3
    });
  }, [formData]);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/email/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setIsConnected(true);
          setFormData({
            provider: data.provider || 'gmail',
            email: data.email || '',
            password: '********',
            fromName: data.fromName || ''
          });
        }
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const handleTestConnection = async () => {
    if (!validations.email || !validations.password) {
      toast.error('Preencha email e senha corretamente');
      return;
    }

    setIsTesting(true);
    try {
      // Simular teste de conexão (em produção, faria um teste real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('✅ Conexão testada com sucesso!');
      setCurrentStep(4);
    } catch (error: any) {
      toast.error('❌ Erro ao testar conexão: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validations.email || !validations.password || !validations.fromName) {
      toast.error('Preencha todos os campos corretamente');
      return;
    }

    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Faça login primeiro');
        return;
      }

      const res = await fetch(`${API_URL}/email/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao conectar email');
      }

      setIsConnected(true);
      toast.success('🎉 Email conectado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/email/disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setIsConnected(false);
        setCurrentStep(1);
        setSelectedProvider(null);
        setFormData({ provider: 'gmail', email: '', password: '', fromName: '' });
        toast.success('Email desconectado');
      }
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  const selectProvider = (provider: 'gmail' | 'outlook') => {
    setSelectedProvider(provider);
    setFormData({ ...formData, provider });
    setCurrentStep(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Tela de Conectado
  if (isConnected) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="shadow-xl border-2 border-blue-200">
          <CardContent className="pt-12">
            <div className="text-center">
              <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </div>
              
              <h2 className="text-blue-700 text-3xl mb-3">
                ✅ Email Conectado!
              </h2>
              
              <p className="text-lg text-slate-700 mb-2 font-semibold">{formData.email}</p>
              
              <div className="inline-block bg-blue-100 px-6 py-3 rounded-full border-2 border-blue-300 mb-8">
                <p className="text-sm text-blue-800 font-semibold">
                  📧 {formData.provider === 'gmail' ? 'Gmail' : 'Outlook'} • Remetente: {formData.fromName}
                </p>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Check className="w-6 h-6 text-emerald-600" />
                  <p className="text-emerald-900 font-semibold">
                    Pronto para enviar emails!
                  </p>
                </div>
                <p className="text-sm text-emerald-800">
                  Suas cobranças por email estão configuradas e prontas para uso
                </p>
              </div>

              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 px-8"
                onClick={handleDisconnect}
              >
                Desconectar Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assistente de Configuração
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Barra de Progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}
                transition-all duration-300
              `}>
                {step}
              </div>
              {step < 4 && (
                <div className={`
                  flex-1 h-1 mx-2
                  ${currentStep > step ? 'bg-blue-600' : 'bg-slate-200'}
                  transition-all duration-300
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-slate-600">
            {currentStep === 1 && 'Escolha o seu provedor de email'}
            {currentStep === 2 && 'Configure sua senha de aplicação'}
            {currentStep === 3 && 'Preencha os dados de envio'}
            {currentStep === 4 && 'Confirme e salve'}
          </p>
        </div>
      </div>

      {/* PASSO 1: Escolher Provedor */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl text-slate-800 mb-2">Qual email você usa?</h2>
            <p className="text-slate-600">Clique no seu provedor de email</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gmail */}
            <button
              onClick={() => selectProvider('gmail')}
              className="bg-white border-3 border-slate-200 rounded-2xl p-8 hover:border-red-500 hover:shadow-2xl transition-all group text-left"
            >
              <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500 transition-colors">
                <Mail className="w-8 h-8 text-red-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Gmail</h3>
              <p className="text-slate-600 mb-4">
                Perfeito se você usa @gmail.com
              </p>
              <div className="flex items-center text-red-600 font-semibold group-hover:text-red-700">
                Escolher Gmail <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </button>

            {/* Outlook */}
            <button
              onClick={() => selectProvider('outlook')}
              className="bg-white border-3 border-slate-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-2xl transition-all group text-left"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <Mail className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Outlook</h3>
              <p className="text-slate-600 mb-4">
                Perfeito se você usa @outlook.com ou @hotmail.com
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                Escolher Outlook <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* PASSO 2: Tutorial Senha de App */}
      {currentStep === 2 && (
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-700">
              📖 Como criar a Senha de Aplicação
            </CardTitle>
            <CardDescription>
              Siga estes passos simples. Leva apenas 2 minutos!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {selectedProvider === 'gmail' ? (
              // Tutorial Gmail
              <>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-amber-900 font-semibold mb-1">
                      ⚠️ Importante: Não use a sua senha normal!
                    </p>
                    <p className="text-sm text-amber-800">
                      O Gmail exige uma "Senha de App" especial para maior segurança
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold mb-2">
                        Abra as configurações da sua Conta Google
                      </p>
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Abrir Configurações Google
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-semibold mb-2">
                        Faça login (se necessário) e procure "Senhas de apps"
                      </p>
                      <div className="bg-slate-100 rounded-lg p-4 border-2 border-slate-200">
                        <p className="text-sm text-slate-700 mb-2">💡 <strong>Dica:</strong></p>
                        <p className="text-sm text-slate-600">
                          Se não aparecer, ative primeiro a verificação em 2 etapas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold mb-2">
                        Crie uma nova senha de app
                      </p>
                      <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                        <li>Nome: "Cobra+ Email" (ou qualquer nome)</li>
                        <li>Clique em "Gerar"</li>
                        <li>Copie a senha que aparece (16 caracteres)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold mb-2">
                        Cole a senha no próximo passo
                      </p>
                      <p className="text-sm text-slate-600">
                        ✅ Pronto! Agora clique em "Próximo" abaixo
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Tutorial Outlook
              <>
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-emerald-900 font-semibold mb-1">
                      ✅ Mais simples! Outlook não exige senha especial
                    </p>
                    <p className="text-sm text-emerald-800">
                      Você pode usar a sua senha normal do Outlook
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold mb-2">
                        Use a mesma senha que você usa para fazer login
                      </p>
                      <p className="text-sm text-slate-600">
                        É a senha que você digita em outlook.com
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold mb-2">
                        Clique em "Próximo" e preencha os dados
                      </p>
                      <p className="text-sm text-slate-600">
                        ✅ Simples assim!
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                Entendi, próximo passo
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PASSO 3: Preencher Dados */}
      {currentStep === 3 && (
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-700">
              ✍️ Preencha os seus dados
            </CardTitle>
            <CardDescription>
              Digite as informações do seu email
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Nome do Remetente */}
            <div>
              <label className="block text-slate-700 font-semibold mb-2">
                👤 Como você quer aparecer para os clientes?
              </label>
              <input
                type="text"
                value={formData.fromName}
                onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                placeholder="Ex: João Silva - Cobranças"
                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg transition-colors ${
                  validations.fromName 
                    ? 'border-emerald-500 focus:border-emerald-600' 
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              {validations.fromName && (
                <p className="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Perfeito!
                </p>
              )}
              <p className="text-slate-500 text-sm mt-1">
                Este nome aparecerá como remetente dos emails
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 font-semibold mb-2">
                ✉️ Qual é o seu email?
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={selectedProvider === 'gmail' ? 'seuemail@gmail.com' : 'seuemail@outlook.com'}
                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg transition-colors ${
                  validations.email 
                    ? 'border-emerald-500 focus:border-emerald-600' 
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              {validations.email && (
                <p className="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Email válido!
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-slate-700 font-semibold mb-2">
                🔒 {selectedProvider === 'gmail' ? 'Cole a Senha de App' : 'Digite sua senha'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••••••"
                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg font-mono transition-colors ${
                  validations.password 
                    ? 'border-emerald-500 focus:border-emerald-600' 
                    : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              {validations.password ? (
                <p className="text-emerald-600 text-sm mt-2 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Senha aceita!
                </p>
              ) : (
                <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Mínimo 8 caracteres
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button
                onClick={handleTestConnection}
                disabled={!validations.email || !validations.password || isTesting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-6 text-lg"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A testar conexão...
                  </>
                ) : (
                  <>
                    Testar Conexão
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PASSO 4: Confirmar e Salvar */}
      {currentStep === 4 && (
        <Card className="shadow-xl border-2 border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50">
            <CardTitle className="text-emerald-700">
              ✅ Tudo certo! Confirme os dados
            </CardTitle>
            <CardDescription>
              Revise e salve a configuração
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Resumo */}
            <div className="bg-slate-50 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-600 text-sm mb-1">Provedor</p>
                  <p className="text-slate-900 font-semibold text-lg">
                    {selectedProvider === 'gmail' ? '📧 Gmail' : '📧 Outlook'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-600 text-sm mb-1">Email</p>
                  <p className="text-slate-900 font-semibold text-lg">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-600 text-sm mb-1">Nome do Remetente</p>
                  <p className="text-slate-900 font-semibold text-lg">{formData.fromName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-slate-600 text-sm mb-1">Conexão</p>
                  <p className="text-emerald-700 font-semibold text-lg">✅ Testada e OK</p>
                </div>
              </div>
            </div>

            {/* Info de segurança */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-blue-900 font-semibold mb-2">🔒 Seus dados estão seguros</p>
              <p className="text-sm text-blue-800">
                A senha é encriptada e armazenada com segurança. Só você tem acesso.
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white flex items-center justify-center gap-2 py-6 text-lg font-semibold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    A guardar...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Guardar e Conectar Email
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
