import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { emailService } from '../lib/email-service';
import { Mail, Send, CheckCircle, AlertCircle, ExternalLink, Code } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function EmailTestPanel() {
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('❌ Email inválido', {
        description: 'Digite um email válido para teste'
      });
      return;
    }

    setIsSending(true);
    setLastTestResult(null);

    try {
      const success = await emailService.sendTestEmail(testEmail, 'Usuário Teste');
      setLastTestResult(success ? 'success' : 'error');
    } catch (error) {
      setLastTestResult('error');
    } finally {
      setIsSending(false);
    }
  };

  const showConfig = () => {
    emailService.showConfigInstructions();
    toast.info('📋 Instruções no console', {
      description: 'Abra o console do navegador (F12)',
      duration: 5000
    });
  };

  return (
    <div className="space-y-6">
      {/* Status da Integração */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Integração de Email - Resend
              </CardTitle>
              <CardDescription>
                API moderna para envio de emails transacionais
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Configuração Necessária
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 mb-2">
                  🎯 Sistema Multi-Canal Integrado
                </p>
                <p className="text-sm text-blue-700 mb-3">
                  Emails automáticos são enviados em TODAS as ações importantes:
                </p>
                <ul className="text-sm text-blue-700 space-y-1.5 ml-4">
                  <li>✅ <strong>Login</strong> - Notificação de segurança</li>
                  <li>✅ <strong>2FA Configurado</strong> - Confirmação de ativação</li>
                  <li>✅ <strong>IA Ativada</strong> - Início da prospecção automática</li>
                  <li>✅ <strong>Lead Qualificado</strong> - Handover para humano (CRÍTICO)</li>
                  <li>✅ <strong>Lead Respondeu</strong> - Alerta de resposta</li>
                  <li>✅ <strong>Relatório Diário</strong> - Resumo de atividades</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Configuração */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-purple-900 mb-2">
                  ⚙️ Configuração Rápida (5 minutos)
                </p>
                <ol className="text-sm text-purple-700 space-y-2 ml-4 list-decimal">
                  <li>
                    <strong>Criar conta grátis:</strong>{' '}
                    <a 
                      href="https://resend.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-purple-900 inline-flex items-center gap-1"
                    >
                      resend.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {' '}(3.000 emails/mês grátis)
                  </li>
                  <li>
                    <strong>Gerar API Key:</strong> Dashboard → API Keys → Create API Key
                  </li>
                  <li>
                    <strong>Configurar no código:</strong>{' '}
                    <code className="bg-purple-100 px-2 py-0.5 rounded text-xs">
                      /lib/resend-email-service.ts
                    </code>
                  </li>
                  <li>
                    <strong>Linha 17:</strong> Adicionar sua API key (começa com "re_")
                  </li>
                  <li>
                    <strong>Linha 18:</strong> Configurar FROM_EMAIL (use onboarding@resend.dev para testes)
                  </li>
                </ol>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={showConfig}
                    className="gap-2"
                  >
                    <Code className="w-4 h-4" />
                    Ver Instruções Detalhadas no Console
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Teste de Email */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Testar Envio de Email
            </h3>
            
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="seu-email@exemplo.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleTestEmail}
                disabled={isSending || !testEmail}
                className="gap-2 min-w-[120px]"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Testar
                  </>
                )}
              </Button>
            </div>

            {/* Resultado do Teste */}
            {lastTestResult && (
              <div className={`mt-4 p-3 rounded-lg flex items-start gap-3 ${
                lastTestResult === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {lastTestResult === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-900">
                        ✅ Email enviado com sucesso!
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Verifique a caixa de entrada de <strong>{testEmail}</strong>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-900">
                        ❌ Falha no envio
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Verifique se a API Key do Resend está configurada corretamente
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Estatísticas (Placeholder) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-xs text-gray-600">Emails Enviados Hoje</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">0%</p>
              <p className="text-xs text-gray-600">Taxa de Entrega</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">0%</p>
              <p className="text-xs text-gray-600">Taxa de Abertura</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">3.000</p>
              <p className="text-xs text-gray-600">Limite Mensal (Free)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates de Email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📧 Templates Configurados</CardTitle>
          <CardDescription>
            Emails profissionais em HTML enviados automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: '🔐', title: 'Login Bem-Sucedido', desc: 'Notificação de segurança' },
              { icon: '🔒', title: '2FA Configurado', desc: 'Confirmação de ativação' },
              { icon: '🤖', title: 'IA Ativada', desc: 'Início da prospecção' },
              { icon: '🔥', title: 'Lead Qualificado', desc: 'Handover pronto' },
              { icon: '💬', title: 'Lead Respondeu', desc: 'Alerta de resposta' },
              { icon: '📊', title: 'Relatório Diário', desc: 'Resumo de atividades' },
            ].map((template, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-2xl">{template.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{template.title}</p>
                  <p className="text-xs text-gray-600 truncate">{template.desc}</p>
                </div>
                <Badge variant="outline" className="text-xs">HTML</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
