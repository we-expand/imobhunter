import { useState } from 'react';
import { useTheme } from '../lib/ThemeContext';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Search, 
  Target, 
  MapPin, 
  Briefcase, 
  TrendingUp,
  Users,
  Home,
  Building2,
  Play,
  Pause,
  Filter,
  Download,
  Upload
} from 'lucide-react';

interface SearchEngineProps {
  clusters: any[];
  onUpdateCluster: (id: string, updates: any) => void;
}

export function SearchEngine({ clusters, onUpdateCluster }: SearchEngineProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [activeCluster, setActiveCluster] = useState(clusters[0]?.id || '');
  const [searchRunning, setSearchRunning] = useState(false);

  const clusterIcons: any = {
    'Investidores': TrendingUp,
    'High-End': Building2,
    'Parcerias': Briefcase,
    '1ª Habitação': Home,
    'Famílias': Users
  };

  const handleSearch = async () => {
    setSearchRunning(true);
    // Simulação de busca
    setTimeout(() => {
      setSearchRunning(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between p-6 rounded-2xl ${
        theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            Buscar Leads
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Configure e execute buscas personalizadas por cluster
          </p>
        </div>

        <Button
          onClick={handleSearch}
          disabled={searchRunning}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
        >
          {searchRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Buscando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Iniciar Busca
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`p-4 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Total de Leads
              </p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                1,247
              </p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Novos Hoje
              </p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                47
              </p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Qualificados
              </p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                892
              </p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 ${
          theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Taxa de Conversão
              </p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                8.4%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Clusters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clusters.map((cluster) => {
          const Icon = clusterIcons[cluster.name] || Target;
          const gradientClass = cluster.id === '1' ? 'from-green-500 to-emerald-500' :
                               cluster.id === '2' ? 'from-purple-500 to-violet-500' :
                               cluster.id === '3' ? 'from-orange-500 to-amber-500' :
                               cluster.id === '4' ? 'from-cyan-500 to-blue-500' :
                               'from-pink-500 to-rose-500';

          return (
            <Card key={cluster.id} className={`p-6 ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 bg-gradient-to-br ${gradientClass} rounded-xl shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {cluster.name}
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {cluster.leads} leads • {cluster.conversion}% conversão
                    </p>
                  </div>
                </div>
                <Badge className={`${
                  cluster.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {cluster.status === 'active' ? 'Ativo' : 'Pausado'}
                </Badge>
              </div>

              {/* Filtros */}
              <div className="space-y-3">
                {cluster.filters.minInvestment && (
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Investimento Mínimo
                      </span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        €{cluster.filters.minInvestment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {cluster.filters.propertyTypes && (
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tipos de Imóvel
                      </span>
                      <div className="flex gap-1">
                        {cluster.filters.propertyTypes.slice(0, 2).map((type: string) => (
                          <Badge key={type} className="text-xs bg-white/10 dark:bg-white/5">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {cluster.filters.locations && (
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Localizações
                      </span>
                      <div className="flex gap-1">
                        {cluster.filters.locations.slice(0, 2).map((loc: string) => (
                          <Badge key={loc} className="text-xs bg-white/10 dark:bg-white/5">
                            <MapPin className="w-3 h-3 mr-1" />
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${
                    theme === 'dark' 
                      ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${
                    theme === 'dark' 
                      ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {cluster.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Ativar
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search History */}
      <Card className={`p-6 ${
        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Histórico de Buscas
          </h2>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="space-y-3">
          {[
            { date: 'Hoje, 14:32', cluster: 'Investidores', results: 47, status: 'completed' },
            { date: 'Hoje, 09:15', cluster: 'High-End', results: 23, status: 'completed' },
            { date: 'Ontem, 16:45', cluster: 'Famílias', results: 89, status: 'completed' },
          ].map((search, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Search className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {search.cluster}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {search.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {search.results} leads encontrados
                </Badge>
                <Button variant="ghost" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
