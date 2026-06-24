import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  X, 
  Info, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  DollarSign,
  Search,
  Database,
  Shield,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface APIInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APIInfoModal({ isOpen, onClose }: APIInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                🔍 Sistema de Busca de Leads
              </h2>
              <p className="text-blue-100 text-sm">
                Entenda como funcionam os resultados de busca
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Status Atual */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">
                  🎯 Modo DEMO Ativo
                </h3>
                <p className="text-sm text-yellow-800">
                  Atualmente, a busca está gerando <strong>leads fictícios inteligentes</strong> que 
                  respeitam seus filtros (cargo, empresa, cidade, etc). Estes leads são criados 
                  instantaneamente para você testar o sistema sem custos.
                </p>
              </div>
            </div>
          </div>

          {/* APIs Disponíveis */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              APIs de Lead Generation Disponíveis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* LinkedIn Sales Navigator */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-sm">LinkedIn Sales Navigator</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">Premium</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Busca profissional de leads B2B com filtros avançados
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <DollarSign className="w-3 h-3" />
                  <span>€99/mês + créditos</span>
                </div>
              </div>

              {/* Apollo.io */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-sm">Apollo.io</h4>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50">Integrado</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  275M+ contatos B2B com enriquecimento automático
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <DollarSign className="w-3 h-3" />
                  <span>$49/mês (5.000 créditos)</span>
                </div>
              </div>

              {/* Hunter.io */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <h4 className="font-semibold text-sm">Hunter.io</h4>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50">Integrado</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Verifica e encontra emails profissionais
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <DollarSign className="w-3 h-3" />
                  <span>$49/mês (1.000 buscas)</span>
                </div>
              </div>

              {/* Proxycurl (LinkedIn) */}
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-sm">Proxycurl</h4>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50">Integrado</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Extrai dados completos de perfis LinkedIn
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <DollarSign className="w-3 h-3" />
                  <span>$0.01/perfil (pay-as-you-go)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Como Ativar */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Como Ativar APIs Reais
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <strong>Escolha uma API:</strong>
                  <p className="text-xs mt-1">
                    Recomendamos Apollo.io (melhor custo-benefício) ou Proxycurl (dados LinkedIn)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <strong>Crie sua conta:</strong>
                  <p className="text-xs mt-1">
                    Acesse o site da API e crie uma conta (maioria oferece trial gratuito)
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <strong>Configure no sistema:</strong>
                  <p className="text-xs mt-1">
                    Vá em <strong>Configurações → Admin → API Keys</strong> e adicione sua chave
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Links Úteis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <a
                href="https://www.apollo.io/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span>Apollo.io Pricing</span>
              </a>
              <a
                href="https://nubela.co/proxycurl/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span>Proxycurl Pricing</span>
              </a>
              <a
                href="https://hunter.io/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span>Hunter.io Pricing</span>
              </a>
              <a
                href="https://www.linkedin.com/sales/ssi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span>LinkedIn Sales Nav</span>
              </a>
            </div>
          </div>

          {/* Vantagens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Modo DEMO (Atual)
              </h4>
              <ul className="text-xs text-green-800 space-y-1">
                <li>✅ Gratuito e ilimitado</li>
                <li>✅ Testa o sistema completo</li>
                <li>✅ Leads inteligentes e realistas</li>
                <li>⚠️ Dados fictícios</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                APIs Reais (Produção)
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✅ Dados reais e verificados</li>
                <li>✅ Emails e telefones válidos</li>
                <li>✅ Integração LinkedIn</li>
                <li>💰 Custo por busca/crédito</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-600">
            💡 <strong>Dica:</strong> Teste o sistema no modo DEMO antes de contratar APIs
          </p>
          <Button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-purple-600">
            Entendi
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Hook para controlar exibição automática na primeira vez
export function useAPIInfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('api-info-modal-seen');
    if (!hasSeenModal) {
      // Mostra modal após 2 segundos na primeira busca
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    localStorage.setItem('api-info-modal-seen', 'true');
  };

  return { isOpen, closeModal };
}
