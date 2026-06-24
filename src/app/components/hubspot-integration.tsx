import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Settings, 
  Zap, 
  Users, 
  TrendingUp,
  AlertCircle,
  Link2,
  Database,
  ArrowRight,
  Activity
} from 'lucide-react';

interface HubSpotConfig {
  connected: boolean;
  apiKey?: string;
  portalId?: string;
  autoSync: boolean;
  syncInterval: number; // minutos
  syncOnStatusChange: boolean;
  syncOnQualified: boolean;
  syncOnHandover: boolean;
  defaultPipeline?: string;
  defaultStage?: string;
  fieldMapping: Record<string, string>;
  lastSync?: string;
  totalSynced: number;
}

interface SyncLog {
  id: string;
  timestamp: string;
  action: 'sync_lead' | 'update_lead' | 'sync_activity' | 'error';
  leadName?: string;
  status: 'success' | 'failed';
  message: string;
}

const HUBSPOT_FIELDS = [
  { id: 'firstname', label: 'Nome' },
  { id: 'lastname', label: 'Sobrenome' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Telefone' },
  { id: 'company', label: 'Empresa' },
  { id: 'jobtitle', label: 'Cargo' },
  { id: 'city', label: 'Cidade' },
  { id: 'country', label: 'País' },
  { id: 'hs_lead_status', label: 'Status do Lead' },
  { id: 'lifecyclestage', label: 'Estágio do Ciclo' },
];

const SYSTEM_FIELDS = [
  { id: 'name', label: 'Nome Completo' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Telefone' },
  { id: 'company', label: 'Empresa' },
  { id: 'position', label: 'Cargo' },
  { id: 'location', label: 'Localização' },
  { id: 'cluster', label: 'Cluster' },
  { id: 'status', label: 'Status' },
  { id: 'score', label: 'Pontuação' },
];

const DEFAULT_FIELD_MAPPING: Record<string, string> = {
  name: 'firstname',
  email: 'email',
  phone: 'phone',
  company: 'company',
  position: 'jobtitle',
  location: 'city',
  status: 'hs_lead_status',
};

export function HubSpotIntegration() {
  const [config, setConfig] = useState<HubSpotConfig>(() => {
    const saved = localStorage.getItem('hubspot-config');
    return saved ? JSON.parse(saved) : {
      connected: false,
      autoSync: false,
      syncInterval: 30,
      syncOnStatusChange: true,
      syncOnQualified: true,
      syncOnHandover: true,
      fieldMapping: DEFAULT_FIELD_MAPPING,
      totalSynced: 0,
    };
  });

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem('hubspot-sync-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [apiKey, setApiKey] = useState('');
  const [portalId, setPortalId] = useState('');
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  // Salva configuração quando muda
  useEffect(() => {
    localStorage.setItem('hubspot-config', JSON.stringify(config));
  }, [config]);

  // Salva logs quando mudam
  useEffect(() => {
    localStorage.setItem('hubspot-sync-logs', JSON.stringify(syncLogs.slice(0, 100)));
  }, [syncLogs]);

  // Auto-sync quando ativado
  useEffect(() => {
    if (!config.connected || !config.autoSync) return;

    const interval = setInterval(() => {
      handleSyncLeads();
    }, config.syncInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [config.connected, config.autoSync, config.syncInterval]);

  const addLog = (log: Omit<SyncLog, 'id' | 'timestamp'>) => {
    const newLog: SyncLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    setSyncLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const handleTestConnection = async () => {
    if (!apiKey || !portalId) {
      toast.error('Preencha API Key e Portal ID');
      return;
    }

    setTesting(true);
    
    try {
      // Simula chamada à API do HubSpot
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock: Verifica se API key tem formato válido (simulado)
      if (apiKey.length < 20) {
        throw new Error('API Key inválida');
      }

      setConfig(prev => ({
        ...prev,
        connected: true,
        apiKey,
        portalId,
        lastSync: new Date().toISOString(),
      }));

      addLog({
        action: 'sync_lead',
        status: 'success',
        message: `Conectado ao HubSpot - Portal ID: ${portalId}`,
      });

      toast.success('✅ Conectado ao HubSpot com sucesso!', {
        description: 'Sua integração está ativa e pronta para sincronizar'
      });
    } catch (error: any) {
      addLog({
        action: 'error',
        status: 'failed',
        message: `Erro ao conectar: ${error.message}`,
      });

      toast.error('❌ Falha na conexão', {
        description: error.message || 'Verifique suas credenciais'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = () => {
    setConfig(prev => ({
      ...prev,
      connected: false,
      apiKey: undefined,
      portalId: undefined,
    }));
    setApiKey('');
    setPortalId('');
    
    addLog({
      action: 'sync_lead',
      status: 'success',
      message: 'Desconectado do HubSpot',
    });

    toast.info('HubSpot desconectado');
  };

  const handleSyncLeads = async () => {
    if (!config.connected) {
      toast.error('Conecte ao HubSpot primeiro');
      return;
    }

    setSyncing(true);

    try {
      // Busca leads do localStorage
      const leads = JSON.parse(localStorage.getItem('leads') || '[]');
      const qualifiedLeads = leads.filter((lead: any) => 
        lead.status === 'qualified' || lead.status === 'handover'
      );

      // Simula sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock: Sincroniza cada lead
      let successCount = 0;
      for (const lead of qualifiedLeads) {
        const hubspotContact = mapLeadToHubSpot(lead, config.fieldMapping);
        
        // Simula criação/atualização no HubSpot
        const success = Math.random() > 0.1; // 90% de sucesso
        
        if (success) {
          successCount++;
          addLog({
            action: 'sync_lead',
            leadName: lead.name,
            status: 'success',
            message: `Lead "${lead.name}" sincronizado - ${lead.cluster}`,
          });
        } else {
          addLog({
            action: 'error',
            leadName: lead.name,
            status: 'failed',
            message: `Erro ao sincronizar "${lead.name}"`,
          });
        }
      }

      setConfig(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        totalSynced: prev.totalSynced + successCount,
      }));

      toast.success(`✅ ${successCount} leads sincronizados!`, {
        description: `De ${qualifiedLeads.length} leads qualificados`
      });
    } catch (error: any) {
      addLog({
        action: 'error',
        status: 'failed',
        message: `Erro na sincronização: ${error.message}`,
      });

      toast.error('Erro na sincronização', {
        description: error.message
      });
    } finally {
      setSyncing(false);
    }
  };

  const mapLeadToHubSpot = (lead: any, mapping: Record<string, string>) => {
    const hubspotContact: any = {};
    
    Object.entries(mapping).forEach(([systemField, hubspotField]) => {
      const value = lead[systemField];
      if (value !== undefined && value !== null) {
        hubspotContact[hubspotField] = value;
      }
    });

    // Adiciona metadados
    hubspotContact.hs_lead_status = mapStatusToHubSpot(lead.status);
    hubspotContact.lifecyclestage = lead.status === 'handover' ? 'salesqualifiedlead' : 'lead';
    
    return hubspotContact;
  };

  const mapStatusToHubSpot = (status: string): string => {
    const statusMap: Record<string, string> = {
      'cold': 'NEW',
      'contacted': 'OPEN',
      'qualified': 'IN_PROGRESS',
      'handover': 'SQL',
    };
    return statusMap[status] || 'NEW';
  };

  const handleUpdateFieldMapping = (systemField: string, hubspotField: string) => {
    setConfig(prev => ({
      ...prev,
      fieldMapping: {
        ...prev.fieldMapping,
        [systemField]: hubspotField,
      }
    }));
    toast.success('Mapeamento atualizado');
  };

  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-3">
                  HubSpot CRM Integration
                  {config.connected ? (
                    <Badge className="gap-1.5 bg-green-100 text-green-700 border-green-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Conectado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1.5">
                      <XCircle className="w-3 h-3" />
                      Desconectado
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Sincronize leads qualificados automaticamente com seu CRM HubSpot
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        {config.connected && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Portal ID</span>
                </div>
                <p className="text-lg font-semibold text-blue-900">{config.portalId}</p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Sincronizado</span>
                </div>
                <p className="text-lg font-semibold text-green-900">{config.totalSynced} leads</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 text-purple-700 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Última Sinc.</span>
                </div>
                <p className="text-sm font-semibold text-purple-900">
                  {config.lastSync 
                    ? new Date(config.lastSync).toLocaleString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Nunca'
                  }
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Auto-Sync</span>
                </div>
                <p className="text-sm font-semibold text-orange-900">
                  {config.autoSync ? `A cada ${config.syncInterval} min` : 'Desativado'}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="connection" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connection">
            <Link2 className="w-4 h-4 mr-2" />
            Conexão
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="w-4 h-4 mr-2" />
            Automação
          </TabsTrigger>
          <TabsTrigger value="mapping">
            <Settings className="w-4 h-4 mr-2" />
            Mapeamento
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Activity className="w-4 h-4 mr-2" />
            Logs ({syncLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB: Conexão */}
        <TabsContent value="connection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Credenciais HubSpot</CardTitle>
              <CardDescription>
                Configure sua API Key e Portal ID para conectar ao HubSpot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!config.connected ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">HubSpot API Key (Private App Token)</Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-gray-600">
                      Crie uma Private App em: Settings → Integrations → Private Apps
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portal-id">Portal ID (Hub ID)</Label>
                    <Input
                      id="portal-id"
                      placeholder="12345678"
                      value={portalId}
                      onChange={(e) => setPortalId(e.target.value)}
                    />
                    <p className="text-xs text-gray-600">
                      Encontre em: Settings → Account Setup → Account Defaults
                    </p>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm text-blue-900">
                        <p className="font-medium">Permissões necessárias:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>crm.objects.contacts.read</li>
                          <li>crm.objects.contacts.write</li>
                          <li>crm.objects.deals.read</li>
                          <li>crm.objects.deals.write</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleTestConnection} 
                    disabled={testing || !apiKey || !portalId}
                    className="w-full"
                    size="lg"
                  >
                    {testing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testando conexão...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Conectar ao HubSpot
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Conectado com sucesso!</p>
                        <p className="text-sm text-green-700 mt-1">
                          Portal ID: {config.portalId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSyncLeads}
                      disabled={syncing}
                      className="flex-1"
                      variant="default"
                    >
                      {syncing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sincronizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sincronizar Agora
                        </>
                      )}
                    </Button>

                    <Button 
                      onClick={handleDisconnect}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Desconectar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Automação */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Automação</CardTitle>
              <CardDescription>
                Configure quando e como os leads são sincronizados automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-Sync Geral */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <Label className="font-medium">Sincronização Automática</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Sincroniza leads periodicamente em segundo plano
                  </p>
                </div>
                <Switch
                  checked={config.autoSync}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoSync: checked }))}
                  disabled={!config.connected}
                />
              </div>

              {/* Intervalo de Sync */}
              {config.autoSync && (
                <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label>Intervalo de Sincronização</Label>
                  <Select
                    value={config.syncInterval.toString()}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, syncInterval: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">A cada 5 minutos</SelectItem>
                      <SelectItem value="15">A cada 15 minutos</SelectItem>
                      <SelectItem value="30">A cada 30 minutos</SelectItem>
                      <SelectItem value="60">A cada 1 hora</SelectItem>
                      <SelectItem value="120">A cada 2 horas</SelectItem>
                      <SelectItem value="360">A cada 6 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              {/* Triggers de Sincronização */}
              <div className="space-y-4">
                <h3 className="font-medium">Sincronizar Automaticamente Quando:</h3>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="font-medium">Lead Muda de Status</Label>
                    <p className="text-sm text-gray-600">
                      Sincroniza imediatamente ao mudar status (Frio → Contactado → Qualificado)
                    </p>
                  </div>
                  <Switch
                    checked={config.syncOnStatusChange}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, syncOnStatusChange: checked }))}
                    disabled={!config.connected}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <Label className="font-medium">Lead é Qualificado</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Sincroniza quando lead atinge status "Qualificado"
                    </p>
                  </div>
                  <Switch
                    checked={config.syncOnQualified}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, syncOnQualified: checked }))}
                    disabled={!config.connected}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50 border-purple-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-purple-600" />
                      <Label className="font-medium">Lead é Transferido (Handover)</Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      Sincroniza quando lead é transferido para consultor humano
                    </p>
                  </div>
                  <Switch
                    checked={config.syncOnHandover}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, syncOnHandover: checked }))}
                    disabled={!config.connected}
                  />
                </div>
              </div>

              <Separator />

              {/* Pipeline & Stage */}
              <div className="space-y-4">
                <h3 className="font-medium">Configuração de Pipeline</h3>
                
                <div className="space-y-2">
                  <Label>Pipeline Padrão</Label>
                  <Select
                    value={selectedPipeline}
                    onValueChange={setSelectedPipeline}
                    disabled={!config.connected}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Pipeline Padrão</SelectItem>
                      <SelectItem value="sales">Pipeline de Vendas</SelectItem>
                      <SelectItem value="leads">Pipeline de Leads</SelectItem>
                      <SelectItem value="outbound">Outbound Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Estágio Inicial</Label>
                  <Select
                    value={selectedStage}
                    onValueChange={setSelectedStage}
                    disabled={!config.connected}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Novo Lead</SelectItem>
                      <SelectItem value="contacted">Contactado</SelectItem>
                      <SelectItem value="qualified">Qualificado</SelectItem>
                      <SelectItem value="sql">Sales Qualified Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Mapeamento de Campos */}
        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mapeamento de Campos</CardTitle>
              <CardDescription>
                Configure como os campos do sistema são mapeados para o HubSpot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SYSTEM_FIELDS.map((field) => (
                  <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label className="font-medium">{field.label}</Label>
                      <p className="text-xs text-gray-600 mt-1">Campo do Sistema</p>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    
                    <div className="flex-1">
                      <Select
                        value={config.fieldMapping[field.id] || ''}
                        onValueChange={(value) => handleUpdateFieldMapping(field.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione campo HubSpot" />
                        </SelectTrigger>
                        <SelectContent>
                          {HUBSPOT_FIELDS.map((hsField) => (
                            <SelectItem key={hsField.id} value={hsField.id}>
                              {hsField.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfig(prev => ({ ...prev, fieldMapping: DEFAULT_FIELD_MAPPING }));
                    toast.success('Mapeamento restaurado para padrão');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restaurar Padrão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Logs */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Histórico de Sincronização</CardTitle>
                  <CardDescription>
                    Últimas {syncLogs.length} atividades de sincronização
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSyncLogs([]);
                    toast.success('Logs limpos');
                  }}
                >
                  Limpar Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {syncLogs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhuma atividade de sincronização ainda</p>
                  </div>
                ) : (
                  syncLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border ${
                        log.status === 'success'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {log.status === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {log.message}
                            </p>
                            {log.leadName && (
                              <p className="text-xs text-gray-600 mt-1">
                                Lead: {log.leadName}
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
