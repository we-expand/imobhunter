import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Database, 
  Loader2,
  Rocket,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { supabaseAdminAPI } from '../lib/supabase-admin-api';

interface SupabaseAutoSetupProps {
  onComplete: () => void;
}

export function SupabaseAutoSetup({ onComplete }: SupabaseAutoSetupProps) {
  const [step, setStep] = useState<'initial' | 'creating' | 'seeding' | 'complete' | 'manual'>('initial');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualSQL, setManualSQL] = useState('');

  const handleAutoSetup = async () => {
    setIsProcessing(true);
    setStep('creating');

    try {
      // Passo 1: Tentar criar tabelas automaticamente
      toast.info('🔧 Criando tabelas no Supabase...');
      const initResult = await supabaseAdminAPI.initDatabase();

      if (initResult.needsManualSetup) {
        // Precisa de setup manual
        setManualSQL(initResult.sql || '');
        setStep('manual');
        setIsProcessing(false);
        toast.warning('⚠️ Setup manual necessário');
        return;
      }

      if (!initResult.success) {
        throw new Error(initResult.message || 'Erro ao criar tabelas');
      }

      toast.success('✅ Tabelas criadas!');

      // Passo 2: Criar dados de demonstração
      setStep('seeding');
      toast.info('🌱 Criando dados de demonstração...');
      
      const seedResult = await supabaseAdminAPI.seedDemoData();

      if (!seedResult.success && !seedResult.error?.includes('duplicate')) {
        throw new Error(seedResult.error || 'Erro ao criar dados demo');
      }

      toast.success('✅ Dados criados com sucesso!');

      // Passo 3: Concluído
      setStep('complete');
      
      setTimeout(() => {
        onComplete();
      }, 1500);

    } catch (error) {
      console.error('Erro no setup automático:', error);
      toast.error(`❌ ${error.message}`);
      setStep('initial');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'manual') {
    return (
      <div className="space-y-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-6 h-6" />
              Setup Manual Necessário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-orange-600">
              As tabelas precisam ser criadas manualmente no Supabase Dashboard.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold">1. Abra o Supabase Dashboard:</p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/rwfymkhtucwkxdddmjqb/editor', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Abrir Supabase Dashboard
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">2. Vá em SQL Editor → New Query</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">3. Cole e execute este SQL:</p>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-60">
                  {manualSQL}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 gap-2 bg-white"
                  onClick={() => {
                    navigator.clipboard.writeText(manualSQL);
                    toast.success('✅ SQL copiado!');
                  }}
                >
                  Copiar SQL
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={handleAutoSetup} 
                className="w-full gap-2"
                size="lg"
              >
                <CheckCircle className="w-5 h-5" />
                Executei o SQL - Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
            <h2 className="text-2xl font-bold text-green-700">Setup Completo!</h2>
            <p className="text-green-600">Carregando dashboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'creating' || step === 'seeding') {
    return (
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h2 className="text-xl font-bold text-blue-700">
              {step === 'creating' ? '🔧 Criando Tabelas...' : '🌱 Criando Dados Demo...'}
            </h2>
            <p className="text-blue-600">
              {step === 'creating' 
                ? 'Configurando banco de dados PostgreSQL...' 
                : 'Populando com 5 usuários de exemplo...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tela inicial
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Database className="w-6 h-6" />
            Configuração Automática do Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-600">
            Configure o sistema admin em <strong>1 clique</strong>. Vamos criar as tabelas e popular com dados de demonstração automaticamente!
          </p>
        </CardContent>
      </Card>

      {/* O que será feito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-600" />
            O que vamos fazer (automático):
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>1. Criar Tabelas no Supabase</strong>
              <p className="text-sm text-gray-600 mt-1">
                Tabelas <code className="bg-white px-1 rounded">platform_users</code> e{' '}
                <code className="bg-white px-1 rounded">platform_activities</code> serão criadas automaticamente
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>2. Popular com Dados Demo</strong>
              <p className="text-sm text-gray-600 mt-1">
                5 usuários de exemplo + métricas realistas + atividades recentes
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>3. Dashboard Pronto</strong>
              <p className="text-sm text-gray-600 mt-1">
                Interface admin 100% funcional com dados reais do PostgreSQL
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Técnicas */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">💡 Como Funciona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Backend Supabase:</strong> Edge Functions criam as tabelas via Service Role Key
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Database className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>PostgreSQL Real:</strong> Banco na nuvem (500MB gratuito)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Zero Configuração:</strong> Nada roda em localhost
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Principal */}
      <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-purple-700">
              ⚡ Setup Instantâneo
            </h3>
            <p className="text-sm text-purple-600">
              Tempo estimado: <strong>~10 segundos</strong>
            </p>
            <Button 
              onClick={handleAutoSetup} 
              disabled={isProcessing}
              className="gap-2 text-lg px-8 py-6"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  <Rocket className="w-6 h-6" />
                  Configurar Automaticamente
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500">
              100% reversível - você pode apagar tudo depois
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Avisos */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-4">
          <p className="text-sm text-blue-700">
            <strong>ℹ️ Nota:</strong> Se o setup automático falhar, vamos te mostrar instruções para fazer manualmente (leva 2 minutos).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
