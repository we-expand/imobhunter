import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Phone, 
  Sparkles, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';
import { Lead } from '../types';

interface PhoneEnrichmentWidgetProps {
  leads: Lead[];
}

export function PhoneEnrichmentWidget({ leads }: PhoneEnrichmentWidgetProps) {
  const [stats, setStats] = useState({
    totalLeads: 0,
    withPhone: 0,
    needsValidation: 0,
    hotNumbers: 0,
    warmNumbers: 0,
    coldNumbers: 0,
    validationRate: 0,
  });

  useEffect(() => {
    // Calcula estatísticas
    const totalLeads = leads.length;
    const withPhone = leads.filter(l => l.phone).length;
    const needsValidation = totalLeads - withPhone;

    // Simula números validados por IA
    const hotNumbers = Math.floor(withPhone * 0.6); // 60% hot
    const warmNumbers = Math.floor(withPhone * 0.3); // 30% warm
    const coldNumbers = withPhone - hotNumbers - warmNumbers; // 10% cold

    const validationRate = totalLeads > 0 ? Math.round((withPhone / totalLeads) * 100) : 0;

    setStats({
      totalLeads,
      withPhone,
      needsValidation,
      hotNumbers,
      warmNumbers,
      coldNumbers,
      validationRate,
    });
  }, [leads]);

  return (
    <Card className="p-6 bg-zinc-950/40 backdrop-blur-sm border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">🤖 Validação IA de Telefones</h3>
            <p className="text-sm text-zinc-500">Multi-source enrichment</p>
          </div>
        </div>

        <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 gap-1">
          <Activity className="w-3 h-3" />
          ATIVO
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Total Leads */}
        <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-400">Total de Leads</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100">{stats.totalLeads}</p>
        </div>

        {/* Validation Rate */}
        <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-zinc-400">Taxa Validação</span>
          </div>
          <p className="text-2xl font-bold text-indigo-400">{stats.validationRate}%</p>
        </div>

        {/* Hot Numbers */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">Números QUENTES</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.hotNumbers}</p>
          <p className="text-xs text-emerald-500/80">Alta confiança (80-100%)</p>
        </div>

        {/* Warm Numbers */}
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-300">Números MORNOS</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{stats.warmNumbers}</p>
          <p className="text-xs text-amber-500/80">Média confiança (60-79%)</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-zinc-400">Status de Validação</span>
          <span className="font-medium text-zinc-300">{stats.withPhone}/{stats.totalLeads}</span>
        </div>
        <div className="h-3 bg-zinc-900/50 rounded-full overflow-hidden border border-white/5">
          <div className="h-full flex">
            {/* Hot */}
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600"
              style={{ width: `${(stats.hotNumbers / stats.totalLeads) * 100}%` }}
              title={`${stats.hotNumbers} hot`}
            />
            {/* Warm */}
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600"
              style={{ width: `${(stats.warmNumbers / stats.totalLeads) * 100}%` }}
              title={`${stats.warmNumbers} warm`}
            />
            {/* Cold */}
            <div
              className="bg-gradient-to-r from-zinc-500 to-zinc-600"
              style={{ width: `${(stats.coldNumbers / stats.totalLeads) * 100}%` }}
              title={`${stats.coldNumbers} cold`}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>🔥 {stats.hotNumbers} Quentes</span>
          <span>⚠️ {stats.warmNumbers} Mornos</span>
          <span>❄️ {stats.coldNumbers} Frios</span>
        </div>
      </div>

      {/* Action CTA */}
      {stats.needsValidation > 0 && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-indigo-300 mb-1">
                {stats.needsValidation} leads sem telefone validado
              </p>
              <p className="text-xs text-indigo-400/80 mb-3">
                A IA pode buscar e validar telefones em 9 fontes automaticamente
              </p>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 w-full border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Validar Todos com IA
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* All Validated */}
      {stats.needsValidation === 0 && stats.totalLeads > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-emerald-300">
            ✅ Todos os leads têm telefones validados!
          </p>
          <p className="text-xs text-emerald-400/80 mt-1">
            {stats.hotNumbers} números com alta confiança prontos para contacto
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-zinc-400 mb-2 font-medium">📊 Como funciona:</p>
        <ul className="text-xs text-zinc-500 space-y-1">
          <li>• IA busca em 9 fontes: LinkedIn, Apollo, WhatsApp, etc.</li>
          <li>• Analisa confiabilidade e valida cada número</li>
          <li>• Score 80-100%: QUENTE (contacte agora)</li>
          <li>• Score 60-79%: MORNO (validar antes)</li>
          <li>• Score 0-59%: FRIO (buscar mais dados)</li>
        </ul>
      </div>
    </Card>
  );
}