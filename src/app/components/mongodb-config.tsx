import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { mongodb } from '../lib/mongodb-service';
import { storage } from '../lib/storage-service';
import { Database, CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function MongoDBConfig() {
  const [config, setConfig] = useState({
    apiUrl: '',
    apiKey: '',
    dataSource: 'Cluster0',
    database: 'ai-leads-db'
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [storageMode, setStorageMode] = useState<'mongodb' | 'localstorage'>('localstorage');

  useEffect(() => {
    const currentConfig = mongodb.getConfig();
    if (currentConfig.isConfigured) {
      setConfig({
        apiUrl: currentConfig.apiUrl,
        apiKey: currentConfig.apiKey,
        dataSource: currentConfig.dataSource,
        database: currentConfig.database
      });
      setIsConfigured(true);
    }
    setStorageMode(storage.getStorageMode());
  }, []);

  const handleSaveConfig = () => {
    mongodb.configure(config);
    setIsConfigured(true);
    toast.success('Configuração do MongoDB salva!');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await mongodb.testConnection();
      setTestResult(result);
      
      if (result.success) {
        toast.success('Conexão com MongoDB estabelecida!');
        // Ativa modo MongoDB automaticamente após teste bem-sucedido
        storage.setStorageMode(true);
        setStorageMode('mongodb');
      } else {
        toast.error('Falha ao conectar com MongoDB');
      }
    } catch (error: any) {
      setTestResult({ success: false, message: error.message });
      toast.error('Erro ao testar conexão');
    } finally {
      setIsTesting(false);
    }
  };

  const handleToggleStorageMode = () => {
    const newMode = storageMode === 'mongodb' ? false : true;
    storage.setStorageMode(newMode);
    setStorageMode(storage.getStorageMode());
    toast.success(`Modo de armazenamento alterado para ${storage.getStorageMode() === 'mongodb' ? 'MongoDB' : 'LocalStorage'}`);
  };

  const handleMigrateData = async () => {
    if (storageMode === 'mongodb') {
      toast.error('Já está usando MongoDB!');
      return;
    }

    try {
      // Exporta dados do localStorage
      storage.setStorageMode(false);
      const data = await storage.exportAllData();
      
      // Importa para MongoDB
      storage.setStorageMode(true);
      await storage.importAllData(data);
      
      setStorageMode('mongodb');
      toast.success('Dados migrados para MongoDB com sucesso!');
    } catch (error) {
      toast.error('Erro ao migrar dados');
      console.error(error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Status Atual */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg">MongoDB Atlas (Gratuito)</h3>
              <p className="text-sm text-gray-600">Banco de dados em nuvem</p>
            </div>
          </div>
          <Badge variant={isConfigured ? 'default' : 'secondary'} className="gap-2">
            {isConfigured ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Configurado
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Não configurado
              </>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Modo Ativo</p>
            <p className="text-lg font-medium">
              {storageMode === 'mongodb' ? '☁️ MongoDB' : '💾 LocalStorage'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Custo</p>
            <p className="text-lg font-medium text-green-600">€0 / mês</p>
          </div>
        </div>

        {isConfigured && (
          <div className="flex gap-2">
            <Button
              variant={storageMode === 'mongodb' ? 'destructive' : 'default'}
              onClick={handleToggleStorageMode}
              className="flex-1"
            >
              {storageMode === 'mongodb' ? 'Desativar MongoDB' : 'Ativar MongoDB'}
            </Button>
            {storageMode === 'localstorage' && (
              <Button variant="outline" onClick={handleMigrateData} className="flex-1">
                <ArrowRight className="w-4 h-4 mr-2" />
                Migrar Dados para MongoDB
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Guia de Configuração */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">📋 Como Configurar MongoDB Atlas (5 minutos)</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Criar conta no MongoDB Atlas</p>
              <p className="text-sm text-gray-600 mb-2">
                Acesse cloud.mongodb.com e crie uma conta gratuita
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://cloud.mongodb.com/v2/register', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Abrir MongoDB Atlas
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Criar Cluster M0 (Gratuito)</p>
              <p className="text-sm text-gray-600">
                Escolha o plano M0 FREE → Região mais próxima (ex: Frankfurt) → Create Cluster
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Ativar Data API</p>
              <p className="text-sm text-gray-600 mb-2">
                Menu lateral → Data API → Enable Data API
              </p>
              <Alert className="mt-2">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Copie o <strong>URL Endpoint</strong> (ex: https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1)
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              4
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Criar API Key</p>
              <p className="text-sm text-gray-600 mb-2">
                Data API → Create API Key → Copie a chave gerada
              </p>
              <Alert className="mt-2">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  ⚠️ Guarde esta chave em local seguro, ela só aparece uma vez!
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
              5
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Configurar Network Access</p>
              <p className="text-sm text-gray-600">
                Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Formulário de Configuração */}
      <Card className="p-6">
        <h3 className="text-lg mb-4">⚙️ Configuração</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Data API URL Endpoint *</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="text"
                placeholder="https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1"
                value={config.apiUrl}
                onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
              />
              {config.apiUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(config.apiUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cole o URL do Data API Endpoint
            </p>
          </div>

          <div>
            <Label>API Key *</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="password"
                placeholder="Sua API Key do MongoDB Atlas"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
              {config.apiKey && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(config.apiKey)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Source (Nome do Cluster)</Label>
              <Input
                type="text"
                placeholder="Cluster0"
                value={config.dataSource}
                onChange={(e) => setConfig({ ...config, dataSource: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Database Name</Label>
              <Input
                type="text"
                placeholder="ai-leads-db"
                value={config.database}
                onChange={(e) => setConfig({ ...config, database: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={!config.apiUrl || !config.apiKey}
              className="flex-1"
            >
              <Database className="w-4 h-4 mr-2" />
              Salvar Configuração
            </Button>
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={!isConfigured || isTesting}
              className="flex-1"
            >
              {isTesting ? 'Testando...' : 'Testar Conexão'}
            </Button>
          </div>

          {testResult && (
            <Alert variant={testResult.success ? 'default' : 'destructive'}>
              {testResult.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Informações Adicionais */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Vantagens do MongoDB Atlas</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ 512MB de armazenamento gratuito (suficiente para ~10.000 leads)</li>
          <li>✅ Backup automático dos dados na nuvem</li>
          <li>✅ Acesso de qualquer dispositivo</li>
          <li>✅ Sincronização em tempo real</li>
          <li>✅ Escalável quando precisar (upgrade fácil)</li>
          <li>✅ Mais rápido que LocalStorage para grandes volumes</li>
          <li>⚠️ Requer conexão à internet</li>
        </ul>
      </Card>
    </div>
  );
}
