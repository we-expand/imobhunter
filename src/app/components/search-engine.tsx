import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ClusterConfig } from '../types';
import { Search, Upload, Database, Play, Pause, Filter } from 'lucide-react';
import { ManualSearch } from './manual-search';

interface SearchEngineProps {
  clusters: ClusterConfig[];
  onUpdateCluster: (id: string, config: ClusterConfig) => void;
}

export function SearchEngine({ clusters, onUpdateCluster }: SearchEngineProps) {
  const [blacklist, setBlacklist] = useState('');

  const renderClusterConfig = (cluster: ClusterConfig) => {
    // Job Titles pré-definidos para cada cluster
    const jobTitlesOptions: { [key: string]: string[] } = {
      'investidores': [
        'CEO', 'CFO', 'Managing Director', 'Partner',
        'Investidor', 'Investidor Imobiliário',
        'Asset Manager', 'Portfolio Manager',
        'Family Office Manager', 'Wealth Manager'
      ],
      'high-end': [
        'C-Level Executive', 'Board Member',
        'Senior Partner', 'Managing Partner',
        'Investment Banker', 'Private Equity Partner',
        'Consultor Sénior', 'Director Executivo'
      ],
      'relocation': [
        'Relocation Specialist', 'Relocation Manager',
        'HR Director', 'Talent Acquisition Manager',
        'Expatriate Manager', 'Global Mobility Manager',
        'International HR Manager'
      ],
      'primeira-habitacao': [
        'Jovem Profissional', 'Analista', 'Consultor Júnior',
        'Especialista', 'Coordenador',
        'Team Leader', 'Gerente'
      ],
      'familias': [
        'Director', 'Gerente', 'Coordenador',
        'Profissional Liberal', 'Empresário',
        'Professor', 'Médico', 'Engenheiro'
      ]
    };

    const keywordsOptions: { [key: string]: string[] } = {
      'investidores': ['investment', 'ROI', 'capital gains', 'portfolio', 'golden visa', 'yield'],
      'high-end': ['luxury', 'premium', 'exclusive', 'high-end', 'bespoke', 'concierge'],
      'relocation': ['relocation', 'expatriate', 'international', 'transfer', 'moving'],
      'primeira-habitacao': ['first home', 'starter', 'financing', 'mortgage', 'affordable'],
      'familias': ['family', 'schools', 'playground', 'neighborhood', 'safe', 'community']
    };

    const currentJobTitles = jobTitlesOptions[cluster.id] || [];
    const currentKeywords = keywordsOptions[cluster.id] || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch
              checked={cluster.active}
              onCheckedChange={(checked) =>
                onUpdateCluster(cluster.id, { ...cluster, active: checked })
              }
            />
            <div>
              <h3 className="text-lg">{cluster.name}</h3>
              <p className="text-sm text-gray-600">
                {cluster.active ? 'Busca ativa' : 'Pausado'}
              </p>
            </div>
          </div>
          <Badge variant={cluster.active ? 'default' : 'secondary'}>
            {cluster.active ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
            {cluster.active ? 'Ativo' : 'Pausado'}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Job Titles com Checkboxes */}
          <div className="border rounded-lg p-4">
            <Label className="mb-3 block font-medium">Job Titles Alvo</Label>
            <p className="text-xs text-gray-500 mb-3">
              Selecione os cargos que deseja buscar neste cluster
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {currentJobTitles.map((title) => (
                <label key={title} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked={cluster.filters.jobTitles?.includes(title)}
                    onChange={(e) => {
                      const currentTitles = cluster.filters.jobTitles || [];
                      const newTitles = e.target.checked
                        ? [...currentTitles, title]
                        : currentTitles.filter(t => t !== title);
                      onUpdateCluster(cluster.id, {
                        ...cluster,
                        filters: { ...cluster.filters, jobTitles: newTitles }
                      });
                    }}
                  />
                  <span className="text-sm">{title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Keywords com Checkboxes */}
          <div className="border rounded-lg p-4">
            <Label className="mb-3 block font-medium">Keywords</Label>
            <p className="text-xs text-gray-500 mb-3">
              Palavras-chave relevantes para este perfil
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentKeywords.map((keyword) => (
                <label key={keyword} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked={cluster.filters.keywords?.includes(keyword)}
                    onChange={(e) => {
                      const currentKeys = cluster.filters.keywords || [];
                      const newKeys = e.target.checked
                        ? [...currentKeys, keyword]
                        : currentKeys.filter(k => k !== keyword);
                      onUpdateCluster(cluster.id, {
                        ...cluster,
                        filters: { ...cluster.filters, keywords: newKeys }
                      });
                    }}
                  />
                  <span className="text-sm">{keyword}</span>
                </label>
              ))}
            </div>
          </div>

          {cluster.filters.locations && (
            <div>
              <Label>Localizações</Label>
              <Input
                value={cluster.filters.locations.join(', ')}
                placeholder="Ex: Cascais, Sintra, Lisboa"
                className="mt-2"
              />
            </div>
          )}

          {cluster.filters.companies && (
            <div>
              <Label>Empresas Alvo</Label>
              <Input
                value={cluster.filters.companies.join(', ')}
                placeholder="Ex: McKinsey, BCG, Deloitte"
                className="mt-2"
              />
            </div>
          )}

          {cluster.filters.schools && (
            <div>
              <Label>Escolas (Engajamento)</Label>
              <Input
                value={cluster.filters.schools.join(', ')}
                placeholder="Ex: TASIS, St. Julian's School"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                AI busca perfis que interagem com estas escolas no LinkedIn
              </p>
            </div>
          )}

          {cluster.filters.experience && (
            <div>
              <Label>Anos de Experiência</Label>
              <Input
                value={cluster.filters.experience}
                placeholder="Ex: 3-7 anos"
                className="mt-2"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl">Motor de Busca e Segmentação</h2>
            <p className="text-sm text-gray-600">Configure os 5 clusters de prospecção</p>
          </div>
        </div>

        <Tabs defaultValue="investidores" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="investidores">Investidores</TabsTrigger>
            <TabsTrigger value="high-end">High-End</TabsTrigger>
            <TabsTrigger value="relocation">Relocation</TabsTrigger>
            <TabsTrigger value="primeira-habitacao">1ª Habitação</TabsTrigger>
            <TabsTrigger value="familias">Famílias</TabsTrigger>
          </TabsList>

          {clusters.map((cluster) => (
            <TabsContent key={cluster.id} value={cluster.id}>
              {renderClusterConfig(cluster)}
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-5 h-5 text-red-600" />
          <h3 className="text-lg">Blacklist / Exclusões</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Upload lista de concorrentes e clientes atuais para não contactar
        </p>
        <Textarea
          value={blacklist}
          onChange={(e) => setBlacklist(e.target.value)}
          placeholder="Cole emails ou LinkedIn URLs (um por linha)&#10;exemplo@concorrente.pt&#10;https://linkedin.com/in/cliente-atual"
          className="min-h-[120px] mb-4"
        />
        <Button variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Importar CSV
        </Button>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg">Fontes de Dados Ativas</h3>
        </div>
        <div className="space-y-3">
          {[
            { name: 'LinkedIn Sales Navigator', status: true },
            { name: 'Instagram Geo-tags', status: true },
            { name: 'Apollo.io (Email Enrichment)', status: false },
            { name: 'Portais Públicos', status: true }
          ].map((source, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <span>{source.name}</span>
              <Switch checked={source.status} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg">Busca Manual</h3>
        </div>
        <ManualSearch />
      </Card>
    </div>
  );
}