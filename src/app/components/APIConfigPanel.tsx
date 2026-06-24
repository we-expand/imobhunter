import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { realAPIService } from '../lib/real-api-service';
import { Key, CheckCircle2, XCircle, ExternalLink, Shield, Zap, AlertTriangle } from 'lucide-react';
import { APIDiagnosticPanel } from './APIDiagnosticPanel';

export function APIConfigPanel() {
  const [apolloKey, setApolloKey] = useState('');
  const [proxycurlKey, setProxycurlKey] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // Carregar configuração atual
    const config = realAPIService.getConfig();
    if (config.apolloApiKey) {
      setApolloKey(config.apolloApiKey);
    }
    if (config.proxycurlApiKey) {
      setProxycurlKey(config.proxycurlApiKey);
      
      // Se a key foi pré-configurada, mostrar notificação
      if (config.proxycurlApiKey === 'c43dba6d0d794c0e8944d5fb05ae87c8') {
        toast.success('✅ Proxycurl API Key pré-configurada!', {
          description: 'Sua chave do LinkedIn está ativa e pronta para uso',
          duration: 6000,
        });
      }
    }
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Validar pelo menos uma key
      if (!apolloKey && !proxycurlKey) {
        toast.error('❌ Configure pelo menos uma API', {
          description: 'Apollo ou Proxycurl são necessários para buscar leads'
        });
        setSaving(false);
        return;
      }
      
      // Salvar configuração
      realAPIService.setConfig({
        apolloApiKey: apolloKey || undefined,
        proxycurlApiKey: proxycurlKey || undefined,
      });
      
      toast.success('✅ API Keys salvas com sucesso!', {
        description: 'As buscas agora usarão suas credenciais',
        duration: 5000,
      });
      
    } catch (error) {
      toast.error('❌ Erro ao salvar', {
        description: 'Tente novamente'
      });
    } finally {
      setSaving(false);
    }
  };
  
  const status = realAPIService.getAPIStatus();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-400" />
          Configuração de APIs
        </h2>
        <p className="text-zinc-400 mt-1">
          Configure suas API keys para buscar leads reais do Apollo.io e LinkedIn (Proxycurl)
        </p>
      </div>
      
      {/* Alerta de Segurança */}
      <Card className="bg-amber-500/10 border-amber-500/30 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-amber-200 mb-1">🔒 Suas chaves são armazenadas localmente</p>
            <p className="text-amber-300/80">
              As API keys são salvas apenas no seu navegador (localStorage). Nunca as compartilhamos.
              Para máxima segurança, use keys com permissões limitadas.
            </p>
          </div>
        </div>
      </Card>
      
      {/* Notificação: Proxycurl Pré-Configurado */}
      {status.proxycurl.configured && (
        <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-emerald-200 mb-1 text-base">✅ Proxycurl (LinkedIn) está ativo!</p>
              <p className="text-emerald-300/90 text-sm mb-2">
                Sua chave de API do LinkedIn foi pré-configurada e está pronta para uso.
                Você pode fazer buscas de perfis do LinkedIn imediatamente!
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 px-3 py-2 rounded-md">
                <Shield className="w-3 h-3" />
                <span className="font-mono">c43d...87c8</span>
                <span className="text-emerald-300/60">• Pronta para usar</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Apollo.io */}
      <Card className="bg-zinc-900/50 border-white/10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Apollo.io API</h3>
              <p className="text-sm text-zinc-400">
                Busca de leads B2B com email + telefone verificados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status.apollo.configured ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Configurada
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
                <XCircle className="w-3 h-3" />
                Não configurada
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-2 block">
              API Key
            </label>
            <Input
              type={showKeys ? 'text' : 'password'}
              value={apolloKey}
              onChange={(e) => setApolloKey(e.target.value)}
              placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxx"
              className="bg-zinc-800 border-white/10 text-white font-mono text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Key className="w-3 h-3" />
            <span>Obtenha sua key em:</span>
            <a
              href="https://app.apollo.io/#/settings/integrations/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
            >
              Apollo Settings
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-white/5 rounded-lg p-3 space-y-1 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-300">✨ O que Apollo fornece:</p>
            <p>• Emails verificados (corporativos + pessoais)</p>
            <p>• Telefones diretos e celulares</p>
            <p>• Dados de empresa (indústria, tamanho, receita)</p>
            <p>• 25 leads/busca • Busca por nome, cargo, empresa, localização</p>
          </div>
        </div>
        
        <div className="mt-4">
          <APITestButton
            api="apollo"
            apiKey={apolloKey}
            onTestSuccess={() => toast.success('✅ Teste de API Apollo bem-sucedido!')}
            onTestFailure={() => toast.error('❌ Teste de API Apollo falhou')}
          />
        </div>
      </Card>
      
      {/* Proxycurl (LinkedIn) */}
      <Card className="bg-zinc-900/50 border-white/10 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Proxycurl (LinkedIn API)</h3>
              <p className="text-sm text-zinc-400">
                Dados reais do LinkedIn - perfis completos + experiência
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status.proxycurl.configured ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                Configurada
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
                <XCircle className="w-3 h-3" />
                Não configurada
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-2 block">
              API Key
            </label>
            <Input
              type={showKeys ? 'text' : 'password'}
              value={proxycurlKey}
              onChange={(e) => setProxycurlKey(e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="bg-zinc-800 border-white/10 text-white font-mono text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Key className="w-3 h-3" />
            <span>Obtenha sua key em:</span>
            <a
              href="https://nubela.co/proxycurl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline"
            >
              Proxycurl Dashboard
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-white/5 rounded-lg p-3 space-y-1 text-xs text-zinc-400">
            <p className="font-semibold text-zinc-300">🔗 O que Proxycurl fornece:</p>
            <p>• Dados 100% reais do LinkedIn (oficial)</p>
            <p>• Perfil completo: experiência, skills, educação</p>
            <p>• Busca por nome, empresa, cargo</p>
            <p>• Headline, summary, avatar • 10 leads/busca</p>
            <p className="text-amber-400 mt-2">💰 Usa créditos (1 crédito = $0.03/perfil)</p>
          </div>
        </div>
      </Card>
      
      {/* Botões de Ação */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6"
        >
          {saving ? 'Salvando...' : 'Salvar Configuração'}
        </Button>
        
        <Button
          onClick={() => setShowKeys(!showKeys)}
          variant="outline"
          className="border-white/10 text-zinc-300 hover:bg-white/5"
        >
          {showKeys ? '🙈 Ocultar Keys' : '👁️ Mostrar Keys'}
        </Button>
      </div>
      
      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20 p-4">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            Recomendação: Apollo.io
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Para buscar leads imobiliários no Brasil/Portugal, comece apenas com Apollo.
            Tem email + telefone verificados e é mais acessível.
          </p>
          <p className="text-xs text-zinc-400 mt-2">
            💰 Plano Free: 60 créditos/mês • Plano Basic: $49/mês (1.000 créditos)
          </p>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 p-4">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            Opcional: Proxycurl
          </h4>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Adicione Proxycurl para enriquecer perfis com dados do LinkedIn.
            Ideal para validar cargos e experiência profissional.
          </p>
          <p className="text-xs text-zinc-400 mt-2">
            💰 Pay-as-you-go: $0.03/perfil • Plano Starter: $300/mês (10.000 créditos)
          </p>
        </Card>
      </div>
      
      {/* Sistema de Conflation */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-lg mb-2">
              🤖 Sistema de Conflation com IA
            </h4>
            <p className="text-zinc-300 text-sm leading-relaxed mb-3">
              Quando você configurar ambas as APIs (Apollo + Proxycurl), nossa IA automaticamente:
            </p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Busca em paralelo nas duas fontes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Identifica leads duplicados (mesmo nome + empresa)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Mescla dados priorizando: Email/Phone (Apollo) + Perfil (LinkedIn)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Aumenta score de confiança para leads com múltiplas fontes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>Remove dados conflitantes mantendo apenas os mais recentes</span>
              </li>
            </ul>
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-emerald-300">
                💎 Resultado: Leads 100% enriquecidos com máxima assertividade!
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Diagnóstico de API */}
      <APIDiagnosticPanel />
    </div>
  );
}