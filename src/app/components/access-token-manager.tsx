import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { accessProtection, AccessToken } from '../lib/access-protection';
import { toast } from 'sonner';
import {
  Shield,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Activity,
  TrendingUp,
  Link2,
  AlertCircle,
} from 'lucide-react';

export function AccessTokenManager() {
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  
  // Form state
  const [email, setEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [validityHours, setValidityHours] = useState('72');
  const [maxAccesses, setMaxAccesses] = useState('50');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTokens(accessProtection.getAllTokens());
    setLogs(accessProtection.getAllLogs().slice(0, 50));
  };

  const handleGenerateToken = () => {
    if (!email.trim() || !clientName.trim()) {
      toast.error('Preencha email e nome do cliente');
      return;
    }

    const token = accessProtection.generateToken(
      email.trim(),
      clientName.trim(),
      parseInt(validityHours),
      parseInt(maxAccesses)
    );

    const url = accessProtection.generateProtectedURL(token.token);

    // Copia URL automaticamente
    navigator.clipboard.writeText(url);

    toast.success('✅ Token criado e URL copiada!', {
      description: `Link de acesso copiado para área de transferência`,
      duration: 5000,
    });

    // Limpa form
    setEmail('');
    setClientName('');

    // Recarrega lista
    loadData();
  };

  const handleCopyURL = (token: string) => {
    const url = accessProtection.generateProtectedURL(token);
    navigator.clipboard.writeText(url);
    toast.success('URL copiada!');
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Token copiado!');
  };

  const handleRevokeToken = (tokenId: string) => {
    if (confirm('Tem certeza que deseja revogar este token?')) {
      accessProtection.revokeToken(tokenId);
      toast.success('Token revogado');
      loadData();
    }
  };

  const toggleShowToken = (tokenId: string) => {
    setShowTokens(prev => ({ ...prev, [tokenId]: !prev[tokenId] }));
  };

  const getStatusBadge = (token: AccessToken) => {
    if (!token.active) {
      return <Badge variant="secondary" className="gap-1"><XCircle className="w-3 h-3" />Revogado</Badge>;
    }
    
    const now = new Date();
    const expires = new Date(token.expiresAt);
    
    if (expires < now) {
      return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />Expirado</Badge>;
    }
    
    if (token.currentAccesses >= token.maxAccesses) {
      return <Badge variant="secondary" className="gap-1"><Users className="w-3 h-3" />Limite Atingido</Badge>;
    }
    
    return <Badge className="gap-1 bg-green-100 text-green-700 border-green-300"><CheckCircle2 className="w-3 h-3" />Ativo</Badge>;
  };

  const activeTokens = tokens.filter(t => t.active && new Date(t.expiresAt) > new Date() && t.currentAccesses < t.maxAccesses);
  const totalAccesses = tokens.reduce((sum, t) => sum + t.currentAccesses, 0);
  const uniqueClients = new Set(tokens.map(t => t.email)).size;

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tokens Ativos</p>
                <p className="text-2xl font-semibold">{activeTokens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Acessos Totais</p>
                <p className="text-2xl font-semibold">{totalAccesses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Clientes Únicos</p>
                <p className="text-2xl font-semibold">{uniqueClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Criados</p>
                <p className="text-2xl font-semibold">{tokens.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Token
          </TabsTrigger>
          <TabsTrigger value="tokens" className="gap-2">
            <Shield className="w-4 h-4" />
            Tokens ({tokens.length})
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Activity className="w-4 h-4" />
            Logs ({logs.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB: Criar Token */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Gerar Novo Token de Acesso
              </CardTitle>
              <CardDescription>
                Crie um link protegido e temporário para enviar ao cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email do Cliente *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-name">Nome do Cliente *</Label>
                  <Input
                    id="client-name"
                    placeholder="João Silva - Empresa XYZ"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="validity">Validade do Link</Label>
                  <Select value={validityHours} onValueChange={setValidityHours}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 horas (1 dia)</SelectItem>
                      <SelectItem value="48">48 horas (2 dias)</SelectItem>
                      <SelectItem value="72">72 horas (3 dias)</SelectItem>
                      <SelectItem value="168">168 horas (7 dias)</SelectItem>
                      <SelectItem value="336">336 horas (14 dias)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-accesses">Máximo de Acessos</Label>
                  <Select value={maxAccesses} onValueChange={setMaxAccesses}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 acessos</SelectItem>
                      <SelectItem value="25">25 acessos</SelectItem>
                      <SelectItem value="50">50 acessos</SelectItem>
                      <SelectItem value="100">100 acessos</SelectItem>
                      <SelectItem value="999">Ilimitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm text-blue-900">
                    <p className="font-medium">Proteções Incluídas:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>URL mascarada automaticamente após primeiro acesso</li>
                      <li>Token único e impossível de adivinhar</li>
                      <li>Limite de acessos e expiração temporal</li>
                      <li>Watermark invisível com email do cliente</li>
                      <li>Logs de todas atividades (acessos, screenshots)</li>
                      <li>Proteção contra indexação (noindex, nofollow)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerateToken}
                className="w-full h-12 text-base"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Gerar Token e Copiar URL
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Tokens */}
        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Tokens de Acesso</CardTitle>
              <CardDescription>
                Gerencie todos os tokens criados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tokens.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum token criado ainda</p>
                  </div>
                ) : (
                  tokens.map((token) => (
                    <div key={token.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{token.clientName}</h3>
                            {getStatusBadge(token)}
                          </div>
                          <p className="text-sm text-gray-600">{token.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyURL(token.token)}
                            disabled={!token.active}
                          >
                            <Link2 className="w-4 h-4 mr-1" />
                            URL
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleShowToken(token.id)}
                          >
                            {showTokens[token.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeToken(token.id)}
                            disabled={!token.active}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {showTokens[token.id] && (
                        <div className="bg-gray-50 border rounded p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono flex-1 break-all">
                              {token.token}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyToken(token.token)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 text-xs">Acessos</p>
                          <p className="font-medium">
                            {token.currentAccesses} / {token.maxAccesses}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Expira em</p>
                          <p className="font-medium">
                            {accessProtection.formatTimeRemaining(token.expiresAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">IPs Únicos</p>
                          <p className="font-medium">{token.ipAddresses.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Último Acesso</p>
                          <p className="font-medium text-xs">
                            {token.lastAccessAt
                              ? new Date(token.lastAccessAt).toLocaleString('pt-PT', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Nunca'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Acesso</CardTitle>
              <CardDescription>
                Últimas {logs.length} atividades registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhuma atividade registrada</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border ${
                        log.action === 'access'
                          ? 'bg-green-50 border-green-200'
                          : log.action === 'screenshot_attempt'
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {log.action === 'access' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : log.action === 'screenshot_attempt' ? (
                            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {log.details}
                            </p>
                            {log.ip && (
                              <p className="text-xs text-gray-600 mt-1">
                                IP: {log.ip}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString('pt-PT', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
