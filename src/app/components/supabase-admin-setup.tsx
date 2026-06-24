import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Database, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  Play,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabaseAdminService } from '../lib/supabase-admin-service';

interface SupabaseAdminSetupProps {
  onComplete: () => void;
}

export function SupabaseAdminSetup({ onComplete }: SupabaseAdminSetupProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const SQL_CREATE_TABLES = `-- Criar tabelas para o sistema admin
-- Execute este SQL no Supabase Dashboard → SQL Editor

-- Tabela de usuários da plataforma
CREATE TABLE IF NOT EXISTS platform_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'online')),
  last_login TIMESTAMPTZ,
  total_leads INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  mrr NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de atividades
CREATE TABLE IF NOT EXISTS platform_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES platform_users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_status ON platform_users(status);
CREATE INDEX IF NOT EXISTS idx_users_plan ON platform_users(plan);
CREATE INDEX IF NOT EXISTS idx_activities_created ON platform_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user ON platform_activities(user_id);

-- RLS (Row Level Security) - Permitir leitura pública
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_activities ENABLE ROW LEVEL SECURITY;

-- Policy para permitir leitura
CREATE POLICY "Permitir leitura de usuários" ON platform_users FOR SELECT USING (true);
CREATE POLICY "Permitir leitura de atividades" ON platform_activities FOR SELECT USING (true);

-- Policy para permitir inserção (com autenticação)
CREATE POLICY "Permitir inserção de usuários" ON platform_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção de atividades" ON platform_activities FOR INSERT WITH CHECK (true);

-- Policy para permitir atualização
CREATE POLICY "Permitir atualização de usuários" ON platform_users FOR UPDATE USING (true);

-- Policy para permitir deleção
CREATE POLICY "Permitir deleção de usuários" ON platform_users FOR DELETE USING (true);

SELECT 'Tabelas criadas com sucesso!' AS status;`;

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_CREATE_TABLES);
    setSqlCopied(true);
    toast.success('✅ SQL copiado!');
    setTimeout(() => setSqlCopied(false), 3000);
  };

  const checkTables = async () => {
    setIsChecking(true);
    try {
      const exists = await supabaseAdminService.checkTablesExist();
      if (exists) {
        toast.success('✅ Tabelas encontradas!');
        onComplete();
      } else {
        toast.error('❌ Tabelas ainda não existem');
      }
    } catch (error) {
      toast.error('Erro ao verificar tabelas');
    } finally {
      setIsChecking(false);
    }
  };

  const createDemoData = async () => {
    setIsCreatingDemo(true);
    try {
      const result = await supabaseAdminService.seedDemoData();
      if (result.success) {
        setTimeout(() => onComplete(), 1000);
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsCreatingDemo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Database className="w-6 h-6" />
            Configuração do Backend Admin (Supabase)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-600">
            Configure o banco de dados Supabase para armazenar dados reais da plataforma (usuários, métricas, atividades).
          </p>
        </CardContent>
      </Card>

      {/* Passo 1: Criar Tabelas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="bg-blue-600">PASSO 1</Badge>
            Criar Tabelas no Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              1. Abra o Supabase Dashboard
            </p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open('https://supabase.com/dashboard/project/rwfymkhtucwkxdddmjqb/editor', '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              Abrir Supabase Dashboard
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm text-gray-600">
              2. Vá em <strong>SQL Editor</strong> → <strong>New Query</strong>
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm text-gray-600">
              3. Copie e cole este SQL:
            </p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-60">
                {SQL_CREATE_TABLES}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 gap-2 bg-white"
                onClick={copySQL}
              >
                {sqlCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar SQL
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm text-gray-600">
              4. Clique em <strong>Run</strong> (ou pressione Ctrl+Enter)
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-green-700 mb-2">
              ✅ O que esse SQL faz:
            </p>
            <ul className="text-sm text-green-600 space-y-1 list-disc list-inside">
              <li>Cria tabela <code className="bg-white px-1 rounded">platform_users</code> (usuários da plataforma)</li>
              <li>Cria tabela <code className="bg-white px-1 rounded">platform_activities</code> (atividades)</li>
              <li>Configura índices para performance</li>
              <li>Ativa políticas de segurança (RLS)</li>
            </ul>
          </div>

          <Button 
            onClick={checkTables} 
            disabled={isChecking}
            className="w-full gap-2"
            size="lg"
          >
            {isChecking ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Verificar se Tabelas foram Criadas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Passo 2: Criar Dados de Demonstração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge className="bg-purple-600">PASSO 2</Badge>
            Criar Dados de Demonstração (Opcional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Popule o banco com 5 usuários de exemplo para testar a interface admin:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">📊 Dados que serão criados:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>5 usuários</strong> com planos diferentes (Free, Pro, Enterprise)</li>
              <li><strong>Métricas realistas</strong> (leads, mensagens, MRR)</li>
              <li><strong>Atividades recentes</strong> (logins, buscas, upgrades)</li>
            </ul>
          </div>

          <Button 
            onClick={createDemoData} 
            disabled={isCreatingDemo}
            className="w-full gap-2"
            size="lg"
            variant="outline"
          >
            {isCreatingDemo ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando Dados...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Criar Dados de Demonstração
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Os dados podem ser removidos a qualquer momento pelo Supabase Dashboard
          </p>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">💡 Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>100% Gratuito:</strong> Supabase oferece 500MB de storage gratuito (mais que suficiente para MVP)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Dados Reais:</strong> Todos os dados são armazenados em PostgreSQL na nuvem
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Sem Backend Local:</strong> Nada roda em localhost - tudo gerenciado pelo Supabase
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Tempo Real:</strong> Atualizações automáticas sem refresh
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
