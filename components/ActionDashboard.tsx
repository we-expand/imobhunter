import { useState } from 'react';
import { 
  Zap, 
  DollarSign, 
  Phone, 
  AlertTriangle,
  TrendingUp,
  Users,
  Euro,
  BarChart3,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Cliente {
  id: string;
  nome: string;
  score?: number;
  externalRisk?: 'baixo' | 'médio' | 'alto' | 'crítico';
  combinedScore?: number;
  valor_atraso?: number;
  dias_atraso?: number;
  telefone?: string;
  email?: string;
}

interface ActionDashboardProps {
  clientes: Cliente[];
  onClientClick?: (cliente: Cliente) => void;
}

export function ActionDashboard({ clientes, onClientClick }: ActionDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Categoriza clientes por ação sugerida
  const categorized = {
    immediate: clientes.filter(c => (c.combinedScore || c.score || 0) >= 80),
    discount: clientes.filter(c => {
      const score = c.combinedScore || c.score || 0;
      return score >= 60 && score < 80;
    }),
    negotiate: clientes.filter(c => {
      const score = c.combinedScore || c.score || 0;
      return score >= 40 && score < 60;
    }),
    critical: clientes.filter(c => (c.combinedScore || c.score || 0) < 40)
  };

  // Calcula totais
  const totals = {
    immediate: {
      count: categorized.immediate.length,
      value: categorized.immediate.reduce((sum, c) => sum + (c.valor_atraso || 0), 0)
    },
    discount: {
      count: categorized.discount.length,
      value: categorized.discount.reduce((sum, c) => sum + (c.valor_atraso || 0), 0)
    },
    negotiate: {
      count: categorized.negotiate.length,
      value: categorized.negotiate.reduce((sum, c) => sum + (c.valor_atraso || 0), 0)
    },
    critical: {
      count: categorized.critical.length,
      value: categorized.critical.reduce((sum, c) => sum + (c.valor_atraso || 0), 0)
    }
  };

  const categories = [
    {
      id: 'immediate',
      label: 'Contactar AGORA',
      icon: Zap,
      color: 'emerald',
      description: 'Alta probabilidade de pagamento',
      urgency: 'Imediato',
      action: 'Enviar WhatsApp',
      clientes: categorized.immediate,
      ...totals.immediate
    },
    {
      id: 'discount',
      label: 'Oferecer Desconto',
      icon: DollarSign,
      color: 'cyan',
      description: 'Desconto 5-10% para conversão',
      urgency: 'Hoje',
      action: 'Proposta com desconto',
      clientes: categorized.discount,
      ...totals.discount
    },
    {
      id: 'negotiate',
      label: 'Ligar e Negociar',
      icon: Phone,
      color: 'amber',
      description: 'Parcelamento ou desconto 15-20%',
      urgency: '2-3 dias',
      action: 'Ligação telefónica',
      clientes: categorized.negotiate,
      ...totals.negotiate
    },
    {
      id: 'critical',
      label: 'Última Tentativa',
      icon: AlertTriangle,
      color: 'red',
      description: 'Desconto 25-35% ou ação legal',
      urgency: 'Crítico',
      action: 'Oferta final',
      clientes: categorized.critical,
      ...totals.critical
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas Gerais */}
      <div className="grid grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card 
              key={cat.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === cat.id 
                  ? `border-2 border-${cat.color}-400 shadow-md` 
                  : 'border-2 border-slate-200'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`w-5 h-5 text-${cat.color}-600`} />
                  <span className={`text-xs px-2 py-1 rounded-full bg-${cat.color}-100 text-${cat.color}-700 font-bold`}>
                    {cat.urgency}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className={`text-2xl font-bold text-${cat.color}-700`}>
                    {cat.count}
                  </p>
                  <p className="text-xs text-slate-600">
                    {cat.label}
                  </p>
                </div>
                <div className={`pt-2 border-t border-${cat.color}-200`}>
                  <p className="text-xs text-slate-500">Total:</p>
                  <p className={`text-sm font-bold text-${cat.color}-700`}>
                    €{cat.value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de Clientes por Categoria */}
      {selectedCategory ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const cat = categories.find(c => c.id === selectedCategory);
                    if (!cat) return null;
                    const Icon = cat.icon;
                    return (
                      <>
                        <Icon className={`w-5 h-5 text-${cat.color}-600`} />
                        {cat.label}
                      </>
                    );
                  })()}
                </CardTitle>
                <CardDescription>
                  {categories.find(c => c.id === selectedCategory)?.description}
                </CardDescription>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Fechar ✕
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.find(c => c.id === selectedCategory)?.clientes.map((cliente) => {
                const cat = categories.find(c => c.id === selectedCategory)!;
                return (
                  <div
                    key={cliente.id}
                    className={`p-4 border-2 border-${cat.color}-200 rounded-lg hover:bg-${cat.color}-50 cursor-pointer transition-colors`}
                    onClick={() => onClientClick?.(cliente)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{cliente.nome}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-slate-600">
                            Score: <span className={`font-bold text-${cat.color}-700`}>
                              {cliente.combinedScore || cliente.score || 0}
                            </span>
                          </span>
                          {cliente.valor_atraso && (
                            <span className="text-sm text-slate-600">
                              Dívida: <span className="font-bold">
                                €{cliente.valor_atraso.toFixed(2)}
                              </span>
                            </span>
                          )}
                          {cliente.dias_atraso && (
                            <span className="text-sm text-slate-600">
                              Atraso: <span className="font-bold">
                                {cliente.dias_atraso} dias
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full bg-${cat.color}-100 border border-${cat.color}-300`}>
                        <span className={`text-xs font-bold text-${cat.color}-700`}>
                          {cat.action}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {categories.find(c => c.id === selectedCategory)?.clientes.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p className="text-sm">Nenhum cliente nesta categoria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Vista Geral com Gráfico
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Vista Geral de Ações Sugeridas
            </CardTitle>
            <CardDescription>
              Clique numa categoria acima para ver os clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Gráfico de Barras Simples */}
              {categories.map((cat) => {
                const percentage = clientes.length > 0 
                  ? (cat.count / clientes.length) * 100 
                  : 0;
                
                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <cat.icon className={`w-4 h-4 text-${cat.color}-600`} />
                        <span className="font-semibold text-slate-700">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600">
                          {cat.count} clientes
                        </span>
                        <span className={`font-bold text-${cat.color}-700`}>
                          €{cat.value.toLocaleString('pt-PT')}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${cat.color}-500 to-${cat.color}-600 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      {percentage.toFixed(1)}% do total
                    </p>
                  </div>
                );
              })}

              {/* Resumo Total */}
              <div className="pt-4 mt-4 border-t-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-600" />
                    <span className="font-bold text-slate-800">Total</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Clientes</p>
                      <p className="text-lg font-bold text-slate-800">
                        {clientes.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Valor Total</p>
                      <p className="text-lg font-bold text-emerald-700">
                        €{(totals.immediate.value + totals.discount.value + totals.negotiate.value + totals.critical.value).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
