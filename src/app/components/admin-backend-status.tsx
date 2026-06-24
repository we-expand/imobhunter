import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Server, 
  Loader2,
  ExternalLink,
  Database,
  Play
} from 'lucide-react';

const API_URL = 'http://localhost:3003';

interface AdminBackendStatusProps {
  onBackendReady: () => void;
  onUseMockData: () => void;
}

export function AdminBackendStatus({ onBackendReady, onUseMockData }: AdminBackendStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isChecking, setIsChecking] = useState(false);

  const checkBackend = async () => {
    setIsChecking(true);
    setStatus('checking');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${API_URL}/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('online');
        setTimeout(() => onBackendReady(), 500);
      } else {
        setStatus('offline');
      }
    } catch (error) {
      setStatus('offline');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  if (status === 'checking') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-blue-700 font-medium">Verificando backend administrativo...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'online') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <p className="text-green-700 font-medium">Backend conectado! Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Offline - Mostrar instruções
  return (
    <div className="space-y-6">
      {/* Status Offline */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="w-6 h-6" />
            Backend Administrativo Offline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-orange-600">
            O backend não está rodando em <code className="bg-white px-2 py-1 rounded">http://localhost:3003</code>
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={checkBackend} 
              disabled={isChecking}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              Verificar Novamente
            </Button>
            
            <Button 
              variant="outline"
              onClick={onUseMockData}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              Usar Dados de Demonstração
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instruções de Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Como Configurar o Backend (5 minutos)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PASSO 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600">PASSO 1</Badge>
              <h3 className="font-semibold">MongoDB Atlas (Gratuito)</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
              <li>
                Acesse{' '}
                <a 
                  href="https://www.mongodb.com/cloud/atlas/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  MongoDB Atlas
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Crie um cluster gratuito (512MB)</li>
              <li>Crie usuário: <code className="bg-gray-100 px-2 py-1 rounded">admin</code> / [senha forte]</li>
              <li>Network Access → Permitir: <code className="bg-gray-100 px-2 py-1 rounded">0.0.0.0/0</code></li>
              <li>Copie a connection string</li>
            </ol>
          </div>

          {/* PASSO 2 */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">PASSO 2</Badge>
              <h3 className="font-semibold">Configurar .env</h3>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-gray-400"># No terminal:</div>
              <div className="text-green-400">cd backend-admin</div>
              <div className="text-green-400">cp .env.example .env</div>
              <div className="text-green-400">open .env</div>
              <div className="mt-3 text-gray-400"># Cole no .env:</div>
              <div>MONGODB_URI=mongodb+srv://admin:SUA_SENHA@...</div>
              <div>JWT_SECRET=chave-secreta-forte-123456</div>
              <div>ADMIN_PORT=3003</div>
            </div>
          </div>

          {/* PASSO 3 */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600">PASSO 3</Badge>
              <h3 className="font-semibold">Inicializar e Rodar</h3>
            </div>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto space-y-1">
              <div className="text-green-400">npm install</div>
              <div className="text-green-400">npm run init-db</div>
              <div className="text-green-400">npm start</div>
              <div className="mt-3 text-gray-400"># Você verá:</div>
              <div className="text-blue-400">✅ Status: ONLINE</div>
              <div className="text-blue-400">🌐 Port: 3003</div>
            </div>
          </div>

          {/* Credenciais Admin */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">🔑 Credenciais Admin (após init-db):</p>
            <div className="text-sm space-y-1">
              <p>Email: <code className="bg-white px-2 py-1 rounded">joao@kw.pt</code></p>
              <p>Senha: <code className="bg-white px-2 py-1 rounded">admin123</code></p>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold mb-2">📚 Documentação Completa:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                GUIA_RAPIDO_ADMIN.md
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                SISTEMA_ADMIN_REAL.md
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                backend-admin/README.md
              </Badge>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="pt-4 border-t">
            <Button 
              onClick={checkBackend} 
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
                  <Play className="w-5 h-5" />
                  Backend Configurado! Conectar Agora
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Opção de Demo */}
      <Card className="border-gray-200">
        <CardContent className="py-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Quer apenas ver a interface sem configurar?
            </p>
            <Button 
              variant="outline"
              onClick={onUseMockData}
              className="gap-2"
            >
              <Database className="w-4 h-4" />
              Usar Dados de Demonstração
            </Button>
            <p className="text-xs text-gray-500">
              (Os dados não serão salvos)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
