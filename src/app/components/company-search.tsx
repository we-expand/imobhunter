import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Building2, MapPin, Users, TrendingUp, Search, Globe, DollarSign, BarChart3, ExternalLink, Plus, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CompanyResult {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  revenue: string;
  website: string;
  logo: string;
  description: string;
  employees: number;
  growth: string;
  foundedYear: number;
}

export function CompanySearch() {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [size, setSize] = useState<string[]>([]);
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [searching, setSearching] = useState(false);

  const industries = ['Real Estate', 'PropTech', 'Construction', 'Investment', 'Architecture'];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  const handleSearch = () => {
    setSearching(true);

    setTimeout(() => {
      const mockResults: CompanyResult[] = [
        {
          id: '1',
          name: 'Keller Williams Portugal',
          industry: 'Real Estate',
          location: 'Lisboa, Portugal',
          size: '201-500',
          revenue: '€50M-€100M',
          website: 'https://kw.pt',
          logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&h=150&fit=crop',
          description: 'Líder mundial em franchising imobiliário',
          employees: 350,
          growth: '+25%',
          foundedYear: 2015
        },
        {
          id: '2',
          name: 'RE/MAX Portugal',
          industry: 'Real Estate',
          location: 'Lisboa, Portugal',
          size: '500+',
          revenue: '€100M+',
          website: 'https://remax.pt',
          logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop',
          description: 'Rede de mediação imobiliária global',
          employees: 450,
          growth: '+18%',
          foundedYear: 2000
        },
        {
          id: '3',
          name: 'PropTech Innovations',
          industry: 'PropTech',
          location: 'Porto, Portugal',
          size: '11-50',
          revenue: '€5M-€10M',
          website: 'https://proptech.pt',
          logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop',
          description: 'Soluções tecnológicas para o mercado imobiliário',
          employees: 35,
          growth: '+40%',
          foundedYear: 2020
        }
      ];

      setResults(mockResults);
      setSearching(false);
      
      toast.success(`✨ ${mockResults.length} empresas encontradas!`, {
        description: 'Resultados do Sales Navigator',
        duration: 5000
      });
    }, 2000);
  };

  const toggleIndustry = (ind: string) => {
    setIndustry(prev =>
      prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
    );
  };

  const toggleSize = (s: string) => {
    setSize(prev =>
      prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]
    );
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* SIDEBAR */}
      <div className="w-96 flex-shrink-0">
        <ScrollArea className="h-full">
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Buscar Empresas
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {/* Nome da Empresa */}
              <div>
                <Label className="text-sm font-medium">Nome da Empresa</Label>
                <Input
                  placeholder="Ex: Keller Williams"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Localização */}
              <div>
                <Label className="text-sm font-medium">Localização</Label>
                <Input
                  placeholder="Ex: Lisboa, Porto"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Setor */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Setor/Indústria</Label>
                <div className="space-y-2">
                  {industries.map((ind) => (
                    <div key={ind} className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
                      <Checkbox
                        id={`ind-${ind}`}
                        checked={industry.includes(ind)}
                        onCheckedChange={() => toggleIndustry(ind)}
                      />
                      <label htmlFor={`ind-${ind}`} className="text-sm cursor-pointer flex-1">
                        {ind}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tamanho */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Tamanho (Funcionários)</Label>
                <div className="space-y-2">
                  {sizes.map((s) => (
                    <div key={s} className="flex items-center gap-2 p-2 rounded hover:bg-blue-50">
                      <Checkbox
                        id={`size-${s}`}
                        checked={size.includes(s)}
                        onCheckedChange={() => toggleSize(s)}
                      />
                      <label htmlFor={`size-${s}`} className="text-sm cursor-pointer flex-1">
                        {s} funcionários
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Busca */}
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {searching ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Empresas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      {/* RESULTADOS */}
      <div className="flex-1 flex flex-col">
        <Card className="mb-4 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="py-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              {results.length > 0 ? `${results.length} empresas encontradas` : 'Buscar Empresas'}
            </h2>
          </CardContent>
        </Card>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {results.map((company) => (
              <Card key={company.id} className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-20 h-20 rounded-xl object-cover ring-4 ring-blue-100"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{company.description}</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {company.growth}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-lg">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>{company.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-purple-50 p-2 rounded-lg">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>{company.employees} funcionários</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span>{company.revenue}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Badge variant="outline">{company.industry}</Badge>
                        <Badge variant="outline">{company.size} funcionários</Badge>
                        <Badge variant="outline">Fundada em {company.foundedYear}</Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {results.length === 0 && (
              <Card className="border-2 border-dashed border-blue-200">
                <CardContent className="py-24 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                  <h3 className="text-xl font-bold mb-2">Buscar Empresas</h3>
                  <p className="text-gray-600 mb-6">
                    Configure os filtros e encontre as empresas ideais
                  </p>
                  <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Search className="w-4 h-4 mr-2" />
                    Começar Busca
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
