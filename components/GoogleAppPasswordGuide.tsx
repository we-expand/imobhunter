import { ExternalLink, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface GoogleAppPasswordGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: 'gmail' | 'outlook';
}

export function GoogleAppPasswordGuide({ open, onOpenChange, provider }: GoogleAppPasswordGuideProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gmailSteps = [
    {
      number: 1,
      title: 'Aceda à Segurança da Conta Google',
      description: 'Abra as configurações de segurança da sua conta',
      link: 'https://myaccount.google.com/security',
      linkText: 'myaccount.google.com/security',
      action: 'Clique no link acima para abrir'
    },
    {
      number: 2,
      title: 'Ative a Verificação em 2 Passos',
      description: 'Obrigatório para criar senhas de aplicativo',
      details: [
        'Procure a secção "Como iniciar sessão no Google"',
        'Clique em "Verificação em 2 passos"',
        'Siga as instruções para ativar (se ainda não estiver ativo)'
      ]
    },
    {
      number: 3,
      title: 'Aceda a "Senhas de aplicativo"',
      description: 'Após ativar a verificação em 2 passos',
      details: [
        'Volte para myaccount.google.com/security',
        'Na secção "Como iniciar sessão no Google"',
        'Procure e clique em "Senhas de aplicativo"'
      ]
    },
    {
      number: 4,
      title: 'Selecione o Aplicativo e Dispositivo',
      description: 'Configure a nova senha de aplicativo',
      details: [
        'No dropdown "Selecionar app": escolha "Email" ou "Outro"',
        'Se escolher "Outro", digite: "Cobra+"',
        'No dropdown "Selecionar dispositivo": escolha o dispositivo atual',
        'Clique em "Gerar"'
      ]
    },
    {
      number: 5,
      title: 'Copie a Senha de 16 Caracteres',
      description: 'A senha será exibida apenas uma vez',
      details: [
        'Verá uma senha com 16 caracteres (ex: abcd efgh ijkl mnop)',
        'Copie TODA a senha (incluindo os espaços ou sem)',
        'Cole no campo "Senha de Aplicativo" no Cobra+',
        'IMPORTANTE: Guarde esta senha - não será exibida novamente!'
      ]
    }
  ];

  const outlookSteps = [
    {
      number: 1,
      title: 'Aceda à Segurança da Conta Microsoft',
      description: 'Abra as configurações de segurança',
      link: 'https://account.microsoft.com/security',
      linkText: 'account.microsoft.com/security',
      action: 'Clique no link acima para abrir'
    },
    {
      number: 2,
      title: 'Opções de Segurança Avançadas',
      description: 'Aceda às configurações avançadas',
      details: [
        'Clique em "Opções de segurança avançadas"',
        'Pode ser necessário verificar a sua identidade'
      ]
    },
    {
      number: 3,
      title: 'Ative a Verificação em Duas Etapas',
      description: 'Se ainda não estiver ativa',
      details: [
        'Procure "Verificação em duas etapas"',
        'Clique em "Ativar" se necessário',
        'Siga as instruções na tela'
      ]
    },
    {
      number: 4,
      title: 'Crie uma Senha de Aplicativo',
      description: 'Gere a senha para o Cobra+',
      details: [
        'Role até "Senhas de aplicativo"',
        'Clique em "Criar uma nova senha de aplicativo"',
        'Dê um nome: "Cobra+"'
      ]
    },
    {
      number: 5,
      title: 'Copie a Senha Gerada',
      description: 'A senha será exibida apenas uma vez',
      details: [
        'Copie a senha de 16 caracteres',
        'Cole no campo "Senha de Aplicativo" no Cobra+',
        'Clique em "Concluído"'
      ]
    }
  ];

  const steps = provider === 'gmail' ? gmailSteps : outlookSteps;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-2">
              {provider === 'gmail' ? '📧' : '📨'}
            </div>
            Como Gerar Senha de Aplicativo - {provider === 'gmail' ? 'Gmail' : 'Outlook'}
          </DialogTitle>
          <DialogDescription>
            Siga os passos abaixo para configurar o envio de emails no Cobra+
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {steps.map((step) => (
            <div 
              key={step.number}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  
                  {step.link && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                      <div className="flex items-center justify-between">
                        <a 
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {step.linkText}
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(step.link!, step.number)}
                          className="h-7"
                        >
                          {copiedStep === step.number ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      {step.action && (
                        <p className="text-xs text-gray-600 mt-1">{step.action}</p>
                      )}
                    </div>
                  )}
                  
                  {step.details && (
                    <ul className="space-y-1 mt-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900 mb-1">⚠️ Importante:</p>
              <ul className="space-y-1 text-amber-800">
                <li>• <strong>NUNCA</strong> use a sua senha normal de email</li>
                <li>• A senha de aplicativo tem 16 caracteres</li>
                <li>• Cada aplicativo deve ter a sua própria senha</li>
                <li>• Se perder a senha, gere uma nova</li>
                <li>• Pode remover senhas antigas que não usa mais</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-green-900 mb-1">✅ Após gerar a senha:</p>
              <ul className="space-y-1 text-green-800">
                <li>1. Copie a senha de 16 caracteres</li>
                <li>2. Cole no campo "Senha de Aplicativo"</li>
                <li>3. Clique em "Salvar Configuração de Email"</li>
                <li>4. Teste o envio de email</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
          {provider === 'gmail' && (
            <Button
              onClick={() => window.open('https://myaccount.google.com/apppasswords', '_blank')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Senhas de Aplicativo
            </Button>
          )}
          {provider === 'outlook' && (
            <Button
              onClick={() => window.open('https://account.microsoft.com/security', '_blank')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Segurança Microsoft
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
