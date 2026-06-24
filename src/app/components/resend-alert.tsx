import { AlertCircle, ExternalLink, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

export function ResendAlert() {
  return (
    <Alert variant="destructive" className="border-red-300 bg-red-50">
      <AlertCircle className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-900 flex items-center gap-2">
        <Mail className="w-4 h-4" />
        API Key do Resend Inválida ou Não Configurada
      </AlertTitle>
      <AlertDescription className="text-red-800 space-y-3">
        <p className="text-sm">
          Para enviar emails de resultados, você precisa configurar uma API Key válida do Resend.
        </p>
        
        <div className="bg-white/50 rounded-lg p-3 space-y-2 text-sm">
          <p className="font-medium">📋 Passos para configurar:</p>
          <ol className="list-decimal list-inside space-y-1.5 ml-2">
            <li>
              Acesse{' '}
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                resend.com/api-keys
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Crie uma nova API Key (ou copie uma existente)</li>
            <li>A chave deve começar com <code className="bg-gray-200 px-1 rounded text-xs">re_</code></li>
            <li>Configure a chave usando a modal que apareceu ao carregar a página</li>
            <li>Se a modal não aparecer, recarregue a página (F5)</li>
          </ol>
        </div>

        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-xs">
          <p className="font-medium text-yellow-900">💡 Dica:</p>
          <p className="text-yellow-800">
            O Resend tem um plano <strong>GRÁTIS</strong> com 100 emails/dia e 3.000 emails/mês.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
          onClick={() => window.open('https://resend.com/api-keys', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Obter API Key do Resend
        </Button>
      </AlertDescription>
    </Alert>
  );
}
