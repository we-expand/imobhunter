import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function ResendKeyChecker() {
  const [status, setStatus] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const checkApiKey = async () => {
    setChecking(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-v2/email/check-api-key`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          }
        }
      );
      const data = await response.json();
      setStatus(data);
      
      if (data.valid) {
        toast.success('✅ API Key configurada corretamente!');
      } else {
        toast.error('❌ API Key inválida ou não configurada');
      }
    } catch (error) {
      console.error('Erro ao verificar API key:', error);
      toast.error('Erro ao verificar configuração');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkApiKey();
  }, []);

  if (!status) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-blue-900">Verificando configuração do Resend...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-6 ${
      status.valid 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {status.valid ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h3 className={`font-semibold ${status.valid ? 'text-green-900' : 'text-red-900'}`}>
              {status.message}
            </h3>
            <p className={`text-sm ${status.valid ? 'text-green-700' : 'text-red-700'}`}>
              {status.configured ? 'API Key configurada' : 'API Key NÃO configurada'}
            </p>
          </div>
        </div>
        <Button
          onClick={checkApiKey}
          disabled={checking}
          size="sm"
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
          Verificar
        </Button>
      </div>

      {/* Detalhes */}
      {status.configured && (
        <div className="space-y-2 mb-4">
          <div className="bg-white/50 rounded p-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">Preview:</span>
              <code className="bg-white px-2 py-1 rounded border">{status.preview}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Tamanho:</span>
              <span className={status.length >= 30 ? 'text-green-700' : 'text-red-700'}>
                {status.length} caracteres {status.length >= 30 ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Começa com "re_":</span>
              <span className={status.startsWithRe ? 'text-green-700' : 'text-red-700'}>
                {status.startsWithRe ? 'Sim ✅' : 'NÃO ❌'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Instruções se inválida */}
      {!status.valid && (
        <div className="bg-white/50 rounded-lg p-4 space-y-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-3 text-sm">
              <p className="text-red-900 font-medium">
                {status.instructions || 'Configure uma API key válida do Resend'}
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">📋 Como resolver:</p>
                
                <ol className="space-y-2 text-gray-700 ml-4 list-decimal">
                  <li>
                    Acesse{' '}
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      https://resend.com/api-keys
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Clique em <strong>"Create API Key"</strong></li>
                  <li>Nome: <code className="bg-gray-100 px-1 rounded">AI LeadGen Pro</code></li>
                  <li>Permissions: <strong>"Sending access"</strong></li>
                  <li>Copie a chave <strong>COMPLETA</strong> (começa com <code className="bg-gray-100 px-1 rounded">re_</code>)</li>
                  <li>
                    Configure no Supabase:
                    <div className="ml-4 mt-1 space-y-1 text-xs">
                      <div>• Dashboard → Edge Functions</div>
                      <div>• Environment Variables</div>
                      <div>• Edite <code className="bg-gray-100 px-1 rounded">RESEND_API_KEY</code></div>
                      <div>• Cole a nova chave</div>
                      <div>• Salve</div>
                    </div>
                  </li>
                </ol>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                  <p className="text-xs text-yellow-800">
                    <strong>⚠️ Formato correto:</strong>
                    <br />
                    <code className="bg-yellow-100 px-2 py-1 rounded mt-1 inline-block">
                      re_123abc456def789ghi012jkl345mno678pqr
                    </code>
                    <br />
                    <span className="text-yellow-700 mt-1 inline-block">
                      ☝️ DEVE começar com "re_" e ter ~40 caracteres
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {status.valid && (
        <div className="bg-white/50 rounded-lg p-4">
          <p className="text-green-800 text-sm">
            ✅ Os emails serão enviados automaticamente em todos os eventos (login, cadastro, etc.)
          </p>
        </div>
      )}
    </div>
  );
}
