import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Users, 
  MessageSquare, 
  FileSpreadsheet, 
  Settings,
  Zap,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { API_URL } from '../utils/api';
import { Page } from '../App';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  action: string;
  route: Page;
  priority: number;
  autoCheck: () => Promise<boolean>;
}

interface SmartOnboardingProps {
  onNavigate: (route: Page) => void;
}

export function SmartOnboarding({ onNavigate }: SmartOnboardingProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // Verifica se tem clientes cadastrados
  const checkHasClientes = async (): Promise<boolean> => {
    try {
      const token = await getToken();
      if (!token) return false;

      const res = await fetch(`${API_URL}/clientes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        return data.clientes && data.clientes.length > 0;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Verifica se WhatsApp está conectado
  const checkHasWhatsApp = async (): Promise<boolean> => {
    try {
      const token = await getToken();
      if (!token) return false;

      const res = await fetch(`${API_URL}/whatsapp-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        return data.status === 'connected';
      }
      return false;
    } catch {
      return false;
    }
  };

  // Verifica se tem faturas
  const checkHasFaturas = async (): Promise<boolean> => {
    try {
      const token = await getToken();
      if (!token) return false;

      const res = await fetch(`${API_URL}/faturas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        return data.faturas && data.faturas.length > 0;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Verifica se régua está configurada
  const checkHasRegua = async (): Promise<boolean> => {
    try {
      const token = await getToken();
      if (!token) return false;

      const res = await fetch(`${API_URL}/regua-config`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        return data.ativa === true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const checkOnboardingStatus = async () => {
    setIsLoading(true);
    
    try {
      const allSteps: OnboardingStep[] = [
        {
          id: 'clientes',
          title: 'Adicionar Clientes',
          description: 'Crie seu primeiro cliente ou importe uma lista completa',
          icon: Users,
          completed: false,
          action: 'Adicionar Clientes',
          route: 'clientes',
          priority: 1,
          autoCheck: checkHasClientes
        },
        {
          id: 'whatsapp',
          title: 'Conectar WhatsApp',
          description: 'Configure WhatsApp Business para envio automático de mensagens',
          icon: MessageSquare,
          completed: false,
          action: 'Conectar WhatsApp',
          route: 'whatsapp',
          priority: 2,
          autoCheck: checkHasWhatsApp
        },
        {
          id: 'faturas',
          title: 'Criar Faturas',
          description: 'Registre as faturas pendentes dos seus clientes',
          icon: FileSpreadsheet,
          completed: false,
          action: 'Criar Fatura',
          route: 'faturas',
          priority: 3,
          autoCheck: checkHasFaturas
        },
        {
          id: 'regua',
          title: 'Configurar Régua de Cobrança',
          description: 'Ative a automação inteligente de cobranças',
          icon: Zap,
          completed: false,
          action: 'Configurar Régua',
          route: 'regua-tempo',
          priority: 4,
          autoCheck: checkHasRegua
        }
      ];

      // Verifica status de cada passo
      for (const step of allSteps) {
        step.completed = await step.autoCheck();
      }

      setSteps(allSteps);

      // Define o índice do próximo passo não concluído
      const nextIncompleteIndex = allSteps.findIndex(s => !s.completed);
      setCurrentStepIndex(nextIncompleteIndex !== -1 ? nextIncompleteIndex : allSteps.length - 1);

      // Verifica se deve mostrar o onboarding
      const allCompleted = allSteps.every(s => s.completed);
      const hasAtLeastOneClient = allSteps.find(s => s.id === 'clientes')?.completed;
      
      // Mostra se não tem nenhum cliente ainda OU se tem tarefas pendentes
      setIsVisible(!allCompleted || !hasAtLeastOneClient);
      
    } catch (error) {
      console.error('Erro ao verificar status de onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepAction = (step: OnboardingStep) => {
    onNavigate(step.route);
    
    // Re-verifica após um tempo
    setTimeout(() => {
      checkOnboardingStatus();
    }, 1000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    toast.success('Pode reabrir a qualquer momento nas configurações');
  };

  if (!isVisible || isLoading) {
    return null;
  }

  const completedCount = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progressPercent = (completedCount / totalSteps) * 100;
  const nextStep = steps.find(s => !s.completed);

  // Modo minimizado - só mostra card pequeno
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card 
          className="w-80 shadow-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-cyan-50 cursor-pointer hover:shadow-emerald-200 transition-all"
          onClick={() => setIsMinimized(false)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Guia Inteligente</p>
                  <p className="text-xs text-slate-600">{completedCount}/{totalSteps} concluídos</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-600" />
            </div>
            
            {/* Barra de progresso */}
            <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md">
      <Card className="shadow-2xl border-2 border-emerald-300 bg-white">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-b-2 border-emerald-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-emerald-700 flex items-center gap-2">
                  Guia Inteligente
                  {completedCount === totalSteps && (
                    <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full">
                      Completo!
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  {completedCount === totalSteps 
                    ? 'Parabéns! Configuração inicial concluída 🎉'
                    : 'Vamos configurar o sistema passo a passo'
                  }
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Progresso</span>
              <span className="font-semibold">{completedCount}/{totalSteps}</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 transition-all duration-500 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 max-h-96 overflow-y-auto">
          {completedCount === totalSteps ? (
            // Tudo concluído
            <div className="text-center py-6 space-y-4">
              <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Sistema Configurado! 🎉
                </h3>
                <p className="text-sm text-slate-600">
                  Está tudo pronto para automatizar suas cobranças
                </p>
              </div>
              <Button
                onClick={() => onNavigate('dashboard')}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Dashboard
              </Button>
            </div>
          ) : (
            // Próximo passo destacado + lista
            <div className="space-y-4">
              {/* Próximo Passo em Destaque */}
              {nextStep && (
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-2 border-emerald-300 rounded-xl p-4 shadow-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-lg">
                      <nextStep.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-emerald-700 mb-1">
                        📍 PRÓXIMO PASSO
                      </p>
                      <h4 className="font-semibold text-slate-800 mb-1">
                        {nextStep.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {nextStep.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStepAction(nextStep)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700"
                    size="sm"
                  >
                    {nextStep.action}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Lista de Todos os Passos */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Todos os Passos
                </p>
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isNext = step.id === nextStep?.id;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        step.completed
                          ? 'bg-emerald-50 border-emerald-200'
                          : isNext
                          ? 'bg-cyan-50 border-cyan-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {/* Ícone de status */}
                      <div>
                        {step.completed ? (
                          <div className="bg-emerald-500 p-1.5 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="bg-slate-300 p-1.5 rounded-full">
                            <Circle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${
                          step.completed ? 'text-emerald-700' : 'text-slate-700'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {step.completed ? '✓ Concluído' : step.description}
                        </p>
                      </div>

                      {/* Botão de ação */}
                      {!step.completed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStepAction(step)}
                          className="text-slate-600 hover:text-slate-800"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer com dica */}
        {completedCount < totalSteps && (
          <div className="px-6 pb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Dica:</strong> Complete os passos na ordem sugerida para melhor experiência
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}