import { Card } from './ui/card';
import { TrendingUp, TrendingDown, Minus, Users, MessageCircle, Target, DollarSign } from 'lucide-react';
import { KPI } from '../types';

interface DashboardKPIsProps {
  kpis: KPI[];
}

export function DashboardKPIs({ kpis }: DashboardKPIsProps) {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getIcon = (label: string) => {
    if (label.includes('Leads')) return <Users className="w-5 h-5" />;
    if (label.includes('Conversão')) return <MessageCircle className="w-5 h-5" />;
    if (label.includes('Quentes')) return <Target className="w-5 h-5" />;
    if (label.includes('ROI')) return <DollarSign className="w-5 h-5" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">{kpi.label}</p>
              <p className="text-3xl mb-2">{kpi.value}</p>
              {kpi.change !== undefined && (
                <div className="flex items-center gap-1">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-sm ${
                    kpi.trend === 'up' ? 'text-green-600' : 
                    kpi.trend === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-sm text-gray-500">vs. semana passada</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              {getIcon(kpi.label)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
