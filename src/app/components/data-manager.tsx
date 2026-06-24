import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { storage } from '../lib/storage-service';
import { mockLeads, mockActivities, mockClusters } from '../lib/mock-data';
import { Download, Upload, Trash2, Database, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { aiSimulation } from '../lib/ai-simulation';
import { MongoDBConfig } from './mongodb-config';
import { resetPlatformData } from '../lib/trial-manager';

export function DataManager() {
  const [stats, setStats] = useState({ 
    leads: [] as any[], 
    activities: [] as any[], 
    clusters: [] as any[] 
  });

  useEffect(() => {
    const loadStats = async () => {
      const leads = await storage.getLeads();
      const activities = await storage.getActivities();
      const clusters = await storage.getClusters();
      setStats({ leads, activities, clusters });
    };
    loadStats();
  }, []);

  const handleExportData = async () => {
    const data = await storage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-leads-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup exportado com sucesso!');
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          const result = await storage.importAllData(data);
          if (result.success) {
            toast.success('Dados importados com sucesso!');
            window.location.reload();
          } else {
            toast.error('Erro ao importar dados');
          }
        } catch (error) {
          toast.error('Arquivo inválido');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleLoadDemoData = async () => {
    await storage.saveLeads(mockLeads);
    await storage.saveActivities(mockActivities);
    await storage.saveClusters(mockClusters);
    toast.success('Dados de demonstração carregados!');
    setTimeout(() => window.location.reload(), 500);
  };

  const handleClearData = async () => {
    if (confirm('⚠️ Tem certeza? Isso irá apagar TODOS os dados armazenados.')) {
      await storage.clearAllData();
      toast.success('Todos os dados foram apagados');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleAddSimulatedLead = () => {
    aiSimulation.addSimulatedLead();
    toast.success('Novo lead simulado adicionado!');
  };

  const storageMode = storage.getStorageMode();

  return (
    <Tabs defaultValue="backup" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="backup">Backup & Gestão</TabsTrigger>
        <TabsTrigger value="mongodb">MongoDB Atlas</TabsTrigger>
      </TabsList>

      <TabsContent value="backup" className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg">Gestão de Dados</h3>
              <p className="text-sm text-gray-600">
                Backup e restauração - Modo atual: <strong>{storageMode === 'mongodb' ? 'MongoDB' : 'LocalStorage'}</strong>
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Leads Armazenados</p>
              <p className="text-2xl text-blue-600">{stats.leads.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Atividades</p>
              <p className="text-2xl text-green-600">{stats.activities.length}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Clusters Ativos</p>
              <p className="text-2xl text-purple-600">{stats.clusters.filter((c: any) => c.active).length}</p>
            </div>
          </div>

          {/* Ações de Backup */}
          <div className="space-y-3 mb-6">
            <h4 className="font-medium mb-3">Backup & Restauração</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleExportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar Backup (JSON)
              </Button>
              <Button variant="outline" onClick={handleImportData} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Importar Backup
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              💡 Recomendado: Faça backup semanal dos seus dados
            </p>
          </div>

          {/* Dados de Demonstração */}
          <div className="space-y-3 mb-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Dados de Teste</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleLoadDemoData} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Carregar Dados Demo
              </Button>
              <Button variant="outline" onClick={handleAddSimulatedLead} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Lead Simulado
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              🎯 Use para testar o sistema com dados fictícios
            </p>
          </div>

          {/* Zona de Perigo */}
          <div className="space-y-3 pt-6 border-t">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-medium">Zona de Perigo</h4>
              <Badge variant="destructive">Cuidado</Badge>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="destructive"
                onClick={handleClearData}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Apagar Todos os Dados
              </Button>
              <p className="text-xs text-red-600">
                ⚠️ Esta ação é irreversível. Exporte um backup primeiro!
              </p>
            </div>

            {/* RESET TOTAL DA PLATAFORMA */}
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">🔴 Reset Total da Plataforma</h4>
              <p className="text-xs text-red-800 mb-3">
                Apaga TUDO: usuários, leads, atividades, configurações, trial, MongoDB. 
                Plataforma volta ao estado inicial.
              </p>
              <Button
                variant="destructive"
                onClick={resetPlatformData}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                🔴 RESETAR PLATAFORMA COMPLETA
              </Button>
              <p className="text-xs text-red-600 mt-2">
                ⚠️ EXTREMAMENTE PERIGOSO! Apenas para recomeçar do zero.
              </p>
            </div>
          </div>

          {/* Informação sobre armazenamento */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              {storageMode === 'mongodb' ? '☁️ MongoDB Atlas Ativo' : '📌 LocalStorage Ativo'}
            </h4>
            {storageMode === 'mongodb' ? (
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ Dados salvos na nuvem (MongoDB Atlas)</li>
                <li>✓ Acesso de qualquer dispositivo</li>
                <li>✓ Backup automático</li>
                <li>✓ Sincronização em tempo real</li>
                <li>✓ 512MB gratuitos</li>
              </ul>
            ) : (
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ Dados salvos localmente no seu navegador</li>
                <li>✓ Completamente gratuito, sem custos</li>
                <li>✓ Privado - dados não saem do computador</li>
                <li>✓ Persiste entre sessões</li>
                <li>⚠️ Limitado ao navegador atual</li>
                <li>💡 Configure MongoDB na aba ao lado para acesso de qualquer lugar</li>
              </ul>
            )}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="mongodb">
        <MongoDBConfig />
      </TabsContent>
    </Tabs>
  );
}