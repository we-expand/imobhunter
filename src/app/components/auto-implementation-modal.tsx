import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import {
  Rocket,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  FileCode,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { executeImplementation, implementations, getImplementationInfo } from '../lib/ai-implementation-service';

interface AutoImplementationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  implementationKey: keyof typeof implementations;
}

interface StepStatus {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  files?: string[];
  error?: string;
}

export function AutoImplementationModal({ 
  open, 
  onOpenChange,
  implementationKey 
}: AutoImplementationModalProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [steps, setSteps] = useState<StepStatus[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    filesCreated: string[];
    filesModified: string[];
  } | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const implementation = getImplementationInfo(implementationKey);

  const handleExecute = async () => {
    setIsExecuting(true);
    setSteps([]);
    setProgress(0);
    setResult(null);

    // Inicializar steps
    const initialSteps = implementation.steps.map(s => ({
      ...s,
      status: 'pending' as const
    }));
    setSteps(initialSteps);

    // Executar implementação
    const executionResult = await executeImplementation(
      implementationKey,
      (step) => {
        // Atualizar step específico
        setSteps(prev => prev.map(s => 
          s.id === step.id ? { ...s, status: step.status, error: step.error } : s
        ));

        // Atualizar progresso
        const completedSteps = steps.filter(s => s.status === 'completed').length;
        const newProgress = ((completedSteps + 1) / implementation.steps.length) * 100;
        setProgress(Math.min(newProgress, 100));
      }
    );

    setResult({
      success: executionResult.success,
      message: executionResult.message,
      filesCreated: executionResult.filesCreated,
      filesModified: executionResult.filesModified
    });

    setProgress(100);
    setIsExecuting(false);

    if (executionResult.success) {
      toast.success('🎉 Implementação concluída!', {
        description: executionResult.message
      });
    } else {
      toast.error('❌ Erro na implementação', {
        description: executionResult.message
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(text);
    setTimeout(() => setCopiedFile(null), 2000);
    toast.success('📋 Copiado!');
  };

  const getStepIcon = (status: StepStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepBgColor = (status: StepStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'running':
        return 'bg-blue-50 border-blue-200 shadow-lg';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">
                🤖 Implementação Automática
              </DialogTitle>
              <DialogDescription className="mt-1">
                {implementation.title}
              </DialogDescription>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-purple-900 mb-1">
                  ✨ A IA vai implementar automaticamente:
                </p>
                <p className="text-purple-700 mb-2">
                  {implementation.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-purple-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Tempo estimado: {implementation.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileCode className="w-3 h-3" />
                    <span>{implementation.steps.length} passos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Bar */}
        {isExecuting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progresso</span>
              <span className="text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Steps List */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all ${getStepBgColor(step.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStepIcon(step.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        Passo {index + 1}
                      </Badge>
                      <h4 className="font-semibold text-sm">{step.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {step.description}
                    </p>

                    {/* Files */}
                    {step.files && step.files.length > 0 && (
                      <div className="space-y-1">
                        {step.files.map(file => (
                          <div
                            key={file}
                            className="flex items-center gap-2 text-xs bg-white/50 p-2 rounded"
                          >
                            <FileCode className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <code className="flex-1 font-mono truncate">{file}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(file)}
                            >
                              {copiedFile === file ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Error */}
                    {step.error && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {step.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Result Summary */}
        {result && (
          <div className={`p-4 rounded-lg border-2 ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold text-sm mb-1 ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  {result.message}
                </p>
                {result.success && (
                  <div className="text-xs text-green-700 space-y-1">
                    <p>✅ {result.filesCreated.length} arquivos criados</p>
                    <p>✅ {result.filesModified.length} arquivos modificados</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        {!isExecuting && steps.length === 0 && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="flex-1 text-sm text-yellow-800">
                <p className="font-medium mb-1">⚠️ Antes de começar:</p>
                <ul className="space-y-1 text-xs">
                  <li>• A IA vai criar e modificar arquivos automaticamente</li>
                  <li>• Certifique-se de ter salvado seu trabalho atual</li>
                  <li>• Você precisará configurar API keys depois</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!isExecuting && !result && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleExecute}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Rocket className="w-4 h-4 mr-2" />
                🚀 Implementar Agora
              </Button>
            </>
          )}

          {isExecuting && (
            <Button disabled className="w-full">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Implementando...
            </Button>
          )}

          {result && (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Fechar
              </Button>
              {result.success && (
                <Button
                  onClick={() => {
                    // Abrir documentação
                    toast.info('📖 Documentação em construção');
                  }}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Documentação
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
