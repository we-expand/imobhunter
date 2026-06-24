import { useState, useEffect } from 'react';
import { projectId, publicAnonKey, serverUrl } from '../utils/supabase/info';
import { UserEnrichmentModalEnhanced } from './user-enrichment-modal-enhanced';
import { API_BASE_URL } from '../lib/api-config';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { RefreshCw, Activity, ListChecks, Users, DollarSign, TrendingUp, Search } from 'lucide-react';
import { toast } from 'sonner';

// Usar serverUrl direto para rotas de admin que não estão sob /imobhunter-api
const API_URL = serverUrl;

interface RealUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: 'online' | 'offline' | 'active';
  total_leads: number;
  messages_sent: number;
  searches: number;
  mrr: number;
  created_at: string;
  last_login: string;
  
  // Dados Enriquecidos (opcionais)
  enrichment_status?: 'processing' | 'completed' | 'failed';
  enriched_at?: string;
  enrichment_score?: number;
  sources?: string[];
  
  // Hunter.io
  email_verified?: boolean;
  email_score?: number;
  
  // Apollo.io / Clearbit
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  github_url?: string;
  linkedin_search_url?: string;
  company_name?: string;
  company_website?: string;
  company_domain?: string;
  company_description?: string;
  company_industry?: string;
  company_employees?: number;
  company_logo?: string;
  job_title?: string;
  seniority?: string;
  phone_numbers?: string[];
  city?: string;
  state?: string;
  country?: string;
  photo_url?: string;
  avatar?: string;
  bio?: string;
  full_name?: string;
}

interface RealActivity {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  type: string;
  metadata?: any;
  created_at: string;
}

// Placeholder component if not imported
const MVPTracker = () => (
  <Card className="p-6 border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-white">MVP Roadmap</CardTitle>
      <CardDescription className="text-zinc-400">Tracking development progress</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-zinc-500">Roadmap features will appear here.</p>
    </CardContent>
  </Card>
);

export function AdminPlatformDashboard() {
  const [users, setUsers] = useState<RealUser[]>([]);
  const [activities, setActivities] = useState<RealActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<RealUser | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedUser, setEnrichedUser] = useState<RealUser | null>(null);

  // Busca dados reais do backend
  const fetchRealData = async (showToast = false) => {
    setIsLoading(true);
    try {
      console.log('🔄 Buscando dados REAIS do Admin...');
      
      const response = await fetch(`${API_URL}/admin/data`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        console.error(`❌ Erro HTTP ${response.status}`);
        const errorText = await response.text();
        console.error('Resposta:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      console.log('✅ Dados reais recebidos:', data);
      console.log(`   - ${data.users?.length || 0} usuários`);
      console.log(`   - ${data.activities?.length || 0} atividades`);
      
      setUsers(data.users || []);
      setActivities(data.activities || []);
      
      // Só mostra toast se foi clique manual no botão
      if (showToast && data.users && data.users.length > 0) {
        toast.success('✅ Dados atualizados!', {
          description: `${data.users.length} usuário(s) • €${data.totals?.mrr || 0} MRR`
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error);
      if (showToast) {
        toast.error('Erro ao carregar dados', {
          description: 'Verifique sua conexão e tente novamente'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega dados na inicialização
  useEffect(() => {
    fetchRealData();
  }, []);

  // Calcula métricas REAIS
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'online' || u.status === 'active').length;
  const totalMRR = users.reduce((sum, u) => sum + (u.mrr || 0), 0);
  const totalLeads = users.reduce((sum, u) => sum + (u.total_leads || 0), 0);
  const totalMessages = users.reduce((sum, u) => sum + (u.messages_sent || 0), 0);

  // Filtro de usuários
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para enriquecer dados do usuário
  const enrichUserData = async (user: RealUser) => {
    setIsEnriching(true);
    setEnrichedUser(null);
    
    try {
      console.log('🔍 ========================================');
      console.log('🔍 INICIANDO ENRIQUECIMENTO DE DADOS');
      console.log('🔍 Usuário:', user.name, '<' + user.email + '>');
      console.log('🔍 User ID:', user.id);
      console.log('🔍 ========================================');
      
      toast.info('🔍 Buscando dados em 9 fontes...', {
        description: 'Hunter.io, Apollo.io, Clearbit, PDL, FullContact, RocketReach, Pipl, Lusha e Busca Inteligente',
        duration: 10000
      });
      
      const response = await fetch(`${API_URL}/admin/enrich-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name
        }),
      });

      console.log('📡 Resposta recebida do servidor:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro HTTP:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      console.log('📊 ========================================');
      console.log('📊 DADOS ENRIQUECIDOS RECEBIDOS:');
      console.log('📊 Sucesso:', data.success);
      console.log('📊 Fontes usadas:', data.sources_used);
      console.log('📊 Score:', data.enrichment_score + '%');
      console.log('📊 Completude:', data.completeness + '%');
      console.log('📊 Qualidade:', data.data_quality + '%');
      console.log('📊 Dados do usuário:', data.user);
      console.log('📊 ========================================');
      
      if (data.success) {
        console.log('✅ Dados enriquecidos com sucesso!');
        console.log(`   - ${data.sources_used} fonte(s) utilizadas`);
        console.log(`   - Score de enriquecimento: ${data.enrichment_score}%`);
        console.log(`   - Fontes: ${data.user?.sources?.join(', ') || 'N/A'}`);
        
        setEnrichedUser(data.user);
        
        toast.success('✅ Dados coletados com sucesso!', {
          description: `${data.sources_used} fonte(s) • Score: ${data.enrichment_score}% • Completude: ${data.completeness}%`,
          duration: 8000
        });
        
        // Atualizar lista de usuários
        setUsers(prevUsers =>
          prevUsers.map(u => u.id === user.id ? data.user : u)
        );
      } else {
        throw new Error(data.error || 'Erro ao enriquecer dados');
      }
    } catch (error: any) {
      console.error('❌ ========================================');
      console.error('❌ ERRO AO ENRIQUECER DADOS');
      console.error('❌ Erro:', error);
      console.error('❌ ========================================');
      
      toast.error('❌ Erro ao coletar dados', {
        description: 'Verifique se as API keys estão configuradas no Supabase. ' + error.message,
        duration: 10000
      });
      
      setEnrichedUser(user); // Mostrar dados básicos mesmo com erro
    } finally {
      setIsEnriching(false);
    }
  };

  // Handler para clicar no usuário - INICIA ENRIQUECIMENTO AUTOMATICAMENTE
  const handleUserClick = async (user: RealUser) => {
    console.log('🖱️ CLICOU NO USUÁRIO:', user.name, user.email);
    console.log('📊 Dados do usuário:', user);
    setSelectedUser(user);
    console.log('✅ selectedUser foi definido, modal deve aparecer agora');
    await enrichUserData(user);
  };

  return (
    <div className="space-y-6">
      {/* Modal de Enriquecimento de Dados do Usuário */}
      {selectedUser && (
        <UserEnrichmentModalEnhanced
          user={selectedUser}
          enrichedUser={enrichedUser}
          isEnriching={isEnriching}
          activities={activities}
          onClose={() => {
            setSelectedUser(null);
            setEnrichedUser(null);
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
          <p className="text-zinc-400">Visão geral da plataforma em tempo real</p>
        </div>
        <Button onClick={() => fetchRealData(true)} disabled={isLoading} className="bg-white/10 text-white hover:bg-white/20 border border-white/10">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Tabs para navegação */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">
            <Activity className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="mvp" className="gap-2 data-[state=active]:bg-indigo-600 text-zinc-400 data-[state=active]:text-white">
            <ListChecks className="w-4 h-4" />
            Roadmap MVP
          </TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs Reais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/40 border border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">Usuários Totais</CardTitle>
                <Users className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalUsers}</div>
                <p className="text-xs text-zinc-500">
                  {activeUsers} online agora
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">MRR Total</CardTitle>
                <DollarSign className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">€{totalMRR.toLocaleString()}</div>
                <p className="text-xs text-zinc-500">
                  Receita mensal recorrente
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">Leads Totais</CardTitle>
                <TrendingUp className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalLeads}</div>
                <p className="text-xs text-zinc-500">
                  Gerados pela plataforma
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border border-white/10 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-300">Mensagens</CardTitle>
                <Activity className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalMessages}</div>
                <p className="text-xs text-zinc-500">
                  Enviadas pela IA
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Usuários Ativos */}
          <Card className="bg-zinc-900/40 border border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Usuários da Plataforma</CardTitle>
              <CardDescription className="text-zinc-400">
                {totalUsers === 0 ? 'Nenhum usuário registrado' : `${totalUsers} usuário(s) registrado(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-black/40 text-white placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Lista de Usuários */}
              {isLoading ? (
                <div className="text-center py-8 text-zinc-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Carregando dados reais...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário registrado ainda'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserClick(user)}
                      className="flex items-center justify-between p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer bg-black/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.status === 'online' || user.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          <span className="text-lg font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{user.name}</p>
                            {(user.status === 'online' || user.status === 'active') && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            )}
                          </div>
                          <p className="text-sm text-zinc-400">{user.email}</p>
                          <p className="text-xs text-zinc-600">
                            Último login: {new Date(user.last_login).toLocaleString('pt-PT')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Leads</p>
                          <p className="font-bold text-blue-400">{user.total_leads}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Mensagens</p>
                          <p className="font-bold text-purple-400">{user.messages_sent}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Buscas</p>
                          <p className="font-bold text-orange-400">{user.searches}</p>
                        </div>
                        <Badge variant={
                          user.plan === 'enterprise' ? 'default' :
                          user.plan === 'pro' ? 'secondary' : 'outline'
                        } className="bg-white/10 text-white border-white/10">
                          {user.plan.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card className="bg-zinc-900/40 border border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Atividade Recente</CardTitle>
              <CardDescription className="text-zinc-400">
                {activities.length === 0 ? 'Nenhuma atividade registrada' : `${activities.length} atividade(s) recente(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-zinc-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Carregando atividades...
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  Nenhuma atividade registrada ainda
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 border-l-4 border-l-blue-500 bg-white/5 rounded hover:bg-white/10 transition-colors"
                    >
                      <Activity className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-zinc-300">
                          <span className="font-medium text-white">{activity.user_name}</span>{' '}
                          {activity.action}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(activity.created_at).toLocaleString('pt-PT')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs border-white/10 text-zinc-400">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Roadmap MVP */}
        <TabsContent value="mvp" className="space-y-6">
          <MVPTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}