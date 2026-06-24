import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { SupabaseAutoSetup } from './supabase-auto-setup';
import { supabaseAdminAPI } from '../lib/supabase-admin-api';
import { User, PlatformMetrics, Activity } from '../lib/supabase-client';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Activity as ActivityIcon,
  UserCheck,
  Shield,
  Database,
  Zap,
  CheckCircle,
  Search,
  Download,
  RefreshCw,
  Mail,
  MessageSquare,
  BarChart3,
  PieChart,
  Crown,
  Sparkles,
  Wifi,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AdminPlatformDashboardSupabase() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    
    try {
      // Verificar se as tabelas existem
      const tablesExist = await supabaseAdminAPI.checkTablesExist();
      
      if (!tablesExist) {
        setNeedsSetup(true);
        setIsLoading(false);
        return;
      }

      // Carregar dados em paralelo
      const [metricsData, usersData, activityData] = await Promise.all([
        supabaseAdminAPI.getMetrics(),
        supabaseAdminAPI.getUsers(),
        supabaseAdminAPI.getRecentActivity(20)
      ]);

      setMetrics(metricsData);
      setUsers(usersData);
      setRecentActivity(activityData);
      setNeedsSetup(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do Supabase');
      setNeedsSetup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAllData();
    setIsRefreshing(false);
    toast.success('✅ Dados atualizados!');
  };

  const handleExport = async () => {
    await supabaseAdminAPI.exportUsers();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700 border-green-300';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Badge className="bg-purple-600"><Crown className="w-3 h-3 mr-1" />Enterprise</Badge>;
      case 'pro':
        return <Badge className="bg-blue-600"><Sparkles className="w-3 h-3 mr-1" />Pro</Badge>;
      case 'free':
        return <Badge variant="outline">Free</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="w-4 h-4 text-blue-600" />;
      case 'message_sent': return <Mail className="w-4 h-4 text-green-600" />;
      case 'upgrade': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'login': return <UserCheck className="w-4 h-4 text-gray-600" />;
      case 'register': return <Users className="w-4 h-4 text-blue-600" />;
      case 'lead_created': return <BarChart3 className="w-4 h-4 text-orange-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <ActivityIcon className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = Date.now();
    const timestamp = new Date(date).getTime();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="text-gray-600">Carregando dados do Supabase...</p>
        </div>
      </div>
    );
  }

  if (needsSetup) {
    return <SupabaseAutoSetup onComplete={loadAllData} />;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            Dashboard Administrativo
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 gap-2">
              <Database className="w-4 h-4" />
              Supabase
            </Badge>
          </h1>
          <p className="text-gray-600 mt-1">
            Dados em tempo real - PostgreSQL na nuvem
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              MRR (Receita Mensal)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              €{metrics.mrr.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">
                Dados reais
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Usuários Totais */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Usuários Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {metrics.total_users}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium">
                {metrics.active_users} ativos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Online Agora */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-purple-600" />
              Online Agora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 flex items-center gap-2">
              {metrics.online_now}
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <Wifi className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 font-medium">
                Em tempo real
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-600" />
              Storage (Supabase)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">
              {metrics.storage_used} GB
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">
                de 500 MB free
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Principais */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">👥 Usuários ({users.length})</TabsTrigger>
          <TabsTrigger value="metrics">📊 Métricas</TabsTrigger>
          <TabsTrigger value="activity">🔥 Atividade</TabsTrigger>
        </TabsList>

        {/* Tab: Usuários */}
        <TabsContent value="users" className="space-y-4">
          {/* Busca */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar usuários por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Todos os Usuários Registrados</span>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {filteredUsers.length} usuários
                </Badge>
              </CardTitle>
              <CardDescription>
                Dados sincronizados em tempo real do Supabase PostgreSQL
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum usuário encontrado</p>
                  {searchTerm && (
                    <Button 
                      variant="link" 
                      onClick={() => setSearchTerm('')}
                      className="mt-2"
                    >
                      Limpar busca
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers
                    .sort((a, b) => (b.total_leads + b.messages_sent) - (a.total_leads + a.messages_sent))
                    .slice(0, showAllUsers ? filteredUsers.length : 10)
                    .map((user, index) => (
                      <div 
                        key={user.id} 
                        className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="text-xl font-bold w-8 text-gray-400">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{user.name}</p>
                            {getPlanBadge(user.plan)}
                            <Badge className={getStatusColor(user.status)}>
                              {user.status === 'online' && <Wifi className="w-3 h-3 mr-1" />}
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Último acesso: {user.last_login ? formatTimeAgo(user.last_login) : 'Nunca'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Leads</p>
                              <p className="text-lg font-bold text-blue-600">{user.total_leads}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Mensagens</p>
                              <p className="text-lg font-bold text-green-600">{user.messages_sent}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">MRR</p>
                              <p className="text-lg font-bold text-purple-600">€{user.mrr}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {filteredUsers.length > 10 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4 gap-2"
                  onClick={() => setShowAllUsers(!showAllUsers)}
                >
                  {showAllUsers ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Mostrar Menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Mostrar Mais {filteredUsers.length - 10} Usuários
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Métricas */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Plano */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  Distribuição por Plano
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      plan: 'Free', 
                      count: users.filter(u => u.plan === 'free').length,
                      color: 'bg-gray-400',
                      revenue: 0
                    },
                    { 
                      plan: 'Pro', 
                      count: users.filter(u => u.plan === 'pro').length,
                      color: 'bg-blue-600',
                      revenue: users.filter(u => u.plan === 'pro').length * 99
                    },
                    { 
                      plan: 'Enterprise', 
                      count: users.filter(u => u.plan === 'enterprise').length,
                      color: 'bg-purple-600',
                      revenue: users.filter(u => u.plan === 'enterprise').length * 299
                    }
                  ].map((item) => {
                    const percentage = metrics.total_users > 0 
                      ? ((item.count / metrics.total_users) * 100).toFixed(1)
                      : '0.0';
                    return (
                      <div key={item.plan}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="font-medium">{item.plan}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{item.count} usuários</div>
                            <div className="text-xs text-gray-500">
                              {item.revenue > 0 ? `€${item.revenue.toLocaleString()}/mês` : 'Gratuito'}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{percentage}% do total</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Métricas de Uso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Métricas de Uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total de Leads</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {metrics.total_leads.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-600">Real-time</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mensagens Enviadas</p>
                        <p className="text-2xl font-bold text-green-700">
                          {metrics.messages_sent.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Real-time</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">API Calls</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {metrics.api_calls.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-purple-600">Estimado</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Storage Supabase</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {metrics.storage_used} GB
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Free Tier</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Atividade */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-orange-600" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimas ações dos usuários na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma atividade registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user_name}</span>
                          {' '}
                          <span className="text-gray-600">{activity.action}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}