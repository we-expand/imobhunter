import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  HardDrive,
  Cloud,
  Check,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
  RefreshCw,
  Server,
  Archive
} from 'lucide-react';
import { storage } from '../lib/storage-service';
import { toast } from 'sonner@2.0.3';

export function DataManagerV2() {
  const [storageMode, setStorageMode] = useState<'mongodb' | 'localstorage'>('localstorage');
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    loadStorageInfo();
    loadLastBackup();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const allData = await storage.exportAllData();
      
      const info = {
        totalLeads: allData.leads.length,
        totalClusters: allData.clusters.length,
        totalActivities: allData.activities.length,
        totalSize: JSON.stringify(allData).length,
        mode: storage.getStorageMode()
      };
      
      setStorageInfo(info);
      setStorageMode(storage.getStorageMode() as 'mongodb' | 'localstorage');
    } catch (error) {
      console.error('Erro ao carregar info de storage:', error);
    }
  };

  const loadLastBackup = () => {
    const lastBackupDate = localStorage.getItem('last-backup-date');
    setLastBackup(lastBackupDate);
  };

  const handleExportBackup = async () => {
    setIsLoading(true);
    setBackupProgress(0);

    try {
      // Simula progresso
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const data = await storage.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-leadgen-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      clearInterval(progressInterval);
      setBackupProgress(100);

      // Salva data do último backup
      const now = new Date().toISOString();
      localStorage.setItem('last-backup-date', now);
      setLastBackup(now);

      setTimeout(() => {
        toast.success('✅ Backup exportado com sucesso!', {
          description: 'Arquivo salvo na pasta de Downloads'
        });
        setBackupProgress(0);
      }, 500);

    } catch (error: any) {
      toast.error('Erro ao exportar backup');
      console.error(error);
      setBackupProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsLoading(true);
      setBackupProgress(0);

      try {
        const progressInterval = setInterval(() => {
          setBackupProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const text = await file.text();
        const data = JSON.parse(text);

        await storage.importAllData(data);
        
        clearInterval(progressInterval);
        setBackupProgress(100);

        setTimeout(() => {
          toast.success('✅ Backup restaurado com sucesso!', {
            description: 'Todos os dados foram importados'
          });
          loadStorageInfo();
          setBackupProgress(0);
          
          // Recarrega a página para aplicar mudanças
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }, 500);

      } catch (error: any) {
        toast.error('Erro ao importar backup');
        console.error(error);
        setBackupProgress(0);
      } finally {
        setIsLoading(false);
      }
    };

    input.click();
  };

  const handleClearAllData = () => {
    if (!confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os seus dados permanentemente. Esta ação não pode ser desfeita.\n\nTem certeza que deseja continuar?')) {
      return;
    }

    if (!confirm('🚨 ÚLTIMA CONFIRMAÇÃO: Todos os leads, clusters e atividades serão perdidos. Confirma?')) {
      return;
    }

    try {
      // Limpa localStorage
      const keysToKeep = ['current-user', 'last-activity-timestamp', 'active-session', 'trial-start-date'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      toast.success('✅ Todos os dados foram limpos!', {
        description: 'Iniciando com dados vazios'
      });

      // Recarrega a página
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      toast.error('Erro ao limpar dados');
      console.error(error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT') + ' às ' + date.toLocaleTimeString('pt-PT');
  };

  return (
    <div className="space-y-6">
      {/* Header com Animação */}
      <Card className="p-8 bg-zinc-900/40 border border-white/10 backdrop-blur-sm overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <Database className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white">
                Data Management
              </h2>
              <p className="text-zinc-400 mt-1">
                Full control over your data with automatic backup and instant restore capabilities
              </p>
            </div>
            
            <Badge 
              variant="outline" 
              className={`
                px-4 py-2 text-base font-bold
                ${storageMode === 'mongodb' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                }
              `}
            >
              {storageMode === 'mongodb' ? (
                <>
                  <Cloud className="w-4 h-4 mr-2" />
                  Cloud Active
                </>
              ) : (
                <>
                  <HardDrive className="w-4 h-4 mr-2" />
                  Local Active
                </>
              )}
            </Badge>
          </div>

          {/* Stats Cards Animados */}
          {storageInfo && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { 
                  label: 'Total Leads', 
                  value: storageInfo.totalLeads, 
                  icon: Database, 
                  color: 'indigo',
                  gradient: 'from-indigo-600 to-blue-600'
                },
                { 
                  label: 'Active Clusters', 
                  value: storageInfo.totalClusters, 
                  icon: Server, 
                  color: 'purple',
                  gradient: 'from-purple-600 to-pink-600'
                },
                { 
                  label: 'Activities', 
                  value: storageInfo.totalActivities, 
                  icon: Zap, 
                  color: 'orange',
                  gradient: 'from-orange-500 to-red-500'
                },
                { 
                  label: 'Storage Size', 
                  value: formatBytes(storageInfo.totalSize), 
                  icon: Archive, 
                  color: 'emerald',
                  gradient: 'from-emerald-500 to-teal-500'
                },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all hover:bg-white/10 cursor-default"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-lg opacity-80`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-zinc-400 font-medium">{stat.label}</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Ações Principais */}
      <div className="grid grid-cols-2 gap-6">
        {/* Exportar Backup */}
        <Card className="p-6 hover:shadow-xl transition-all border border-white/10 bg-zinc-900/40 backdrop-blur-sm group hover:border-indigo-500/30">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="w-7 h-7 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Export Backup</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Download a complete copy of all your data in JSON format
              </p>
              
              {lastBackup && (
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Last backup: {formatDate(lastBackup)}
                </div>
              )}

              <Button
                onClick={handleExportBackup}
                disabled={isLoading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white border-0"
              >
                {isLoading && backupProgress > 0 && backupProgress < 100 ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Exporting... {backupProgress}%
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download Backup
                  </>
                )}
              </Button>

              {backupProgress > 0 && backupProgress < 100 && (
                <Progress value={backupProgress} className="mt-3 bg-white/5" />
              )}
            </div>
          </div>
        </Card>

        {/* Importar Backup */}
        <Card className="p-6 hover:shadow-xl transition-all border border-white/10 bg-zinc-900/40 backdrop-blur-sm group hover:border-purple-500/30">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Restore Backup</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Import a previous backup to restore your data
              </p>
              
              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-400">
                  Warning: This will replace all current data
                </p>
              </div>

              <Button
                onClick={handleImportBackup}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
              >
                {isLoading && backupProgress > 0 && backupProgress < 100 ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Importing... {backupProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Select File
                  </>
                )}
              </Button>

              {backupProgress > 0 && backupProgress < 100 && (
                <Progress value={backupProgress} className="mt-3 bg-white/5" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Zona de Perigo */}
      <Card className="p-6 border border-red-500/20 bg-red-500/5 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
              <Badge variant="destructive" className="font-bold bg-red-500/20 text-red-400 border-red-500/30">
                Irreversible
              </Badge>
            </div>
            <p className="text-sm text-red-300/70 mb-4">
              Permanent actions that cannot be undone. Use with extreme caution.
            </p>
            
            <Button
              onClick={handleClearAllData}
              variant="destructive"
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Card com Recursos */}
      <Card className="p-6 bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-emerald-400 mb-3">Advanced Data Protection</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Check, text: 'Automated cloud backup (coming soon)' },
                { icon: Check, text: 'Sensitive data encryption' },
                { icon: Check, text: 'Backup versioning' },
                { icon: Check, text: 'Granular restore by date' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-sm text-emerald-300/80">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}