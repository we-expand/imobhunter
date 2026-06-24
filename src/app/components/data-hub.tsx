import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ExcelImport } from './excel-import';
import { LeadFeedbackSystem } from './lead-feedback-system';
import { DataManagerV2 } from './data-manager-v2';
import {
  Database,
  Upload,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  Download,
  Settings,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export function DataHub() {
  const [activeTab, setActiveTab] = useState('overview');

  // Estatísticas rápidas (mock - pode conectar com dados reais)
  const stats = {
    totalLeads: 1247,
    imported: 856,
    feedback: 128,
    exported: 432
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <Database className="w-7 h-7 text-blue-600" />
            Central de Dados
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie, importe e analise seus leads de forma inteligente
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
          <Sparkles className="w-3 h-3 mr-1" />
          {stats.totalLeads.toLocaleString()} Leads
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                  <p className="text-xs text-gray-600">Total de Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-green-100 hover:border-green-300 transition-colors cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.imported}</p>
                  <p className="text-xs text-gray-600">Importados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.feedback}</p>
                  <p className="text-xs text-gray-600">Com Feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-orange-100 hover:border-orange-300 transition-colors cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.exported}</p>
                  <p className="text-xs text-gray-600">Exportados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content with Tabs */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="overview" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="import" className="gap-2">
                <Upload className="w-4 h-4" />
                Importar
              </TabsTrigger>
              <TabsTrigger value="feedback" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Feedback IA
              </TabsTrigger>
              <TabsTrigger value="manage" className="gap-2">
                <Settings className="w-4 h-4" />
                Gestão
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Ações Rápidas
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card 
                    className="p-4 border-2 border-blue-100 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setActiveTab('import')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Importar Dados</h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Excel, CSV ou bases externas
                        </p>
                        <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                          Começar <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card 
                    className="p-4 border-2 border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setActiveTab('feedback')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Treinar IA</h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Marcar vendidos/perdidos
                        </p>
                        <div className="flex items-center gap-1 text-purple-600 text-xs font-medium">
                          Começar <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card 
                    className="p-4 border-2 border-green-100 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setActiveTab('manage')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Settings className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Gerenciar Leads</h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Editar, exportar, limpar
                        </p>
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                          Abrir <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Quick Guide */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-100">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Como Usar a Central de Dados
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Importar Dados</p>
                      <p className="text-xs text-gray-600">Carregue suas bases Excel/CSV ou conecte APIs externas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Treinar a IA</p>
                      <p className="text-xs text-gray-600">Marque leads como vendidos/perdidos para melhorar a precisão</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Gerenciar e Exportar</p>
                      <p className="text-xs text-gray-600">Edite informações e exporte dados quando necessário</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Import Tab */}
            <TabsContent value="import" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Importação de Dados</h3>
                </div>
                <ExcelImport />
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Feedback da IA</h3>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                    Melhora contínua
                  </Badge>
                </div>
                <LeadFeedbackSystem />
              </div>
            </TabsContent>

            {/* Manage Tab */}
            <TabsContent value="manage" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">Gestão de Leads</h3>
                </div>
                <DataManagerV2 />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Tips */}
      <Card className="border-2 border-yellow-100 bg-yellow-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-yellow-700" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-yellow-900 mb-1">💡 Dica Profissional</h4>
              <p className="text-xs text-yellow-800">
                Importe suas bases regularmente e marque o resultado de cada lead. Quanto mais feedback você der, 
                mais inteligente a IA fica em encontrar leads perfeitos para o seu perfil!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
