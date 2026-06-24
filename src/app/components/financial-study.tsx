import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  Shield,
  ArrowLeft,
  BarChart3,
  PieChart,
  LineChart,
  Calculator,
  FileText,
  Download,
  Lightbulb,
  Globe,
  Building2,
  Cpu,
  Cloud
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface FinancialStudyProps {
  onBack?: () => void;
}

export function FinancialStudy({ onBack }: FinancialStudyProps) {
  const [selectedYear, setSelectedYear] = useState('2026');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          )}
          <h1 className="text-2xl font-bold text-slate-900">Estudo Financeiro ImobHunter</h1>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Executive Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Sumário Executivo</h2>
                <p className="text-indigo-100">Análise Financeira e Estratégica 2026-2028</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-indigo-100 mb-1">ROI Projetado (36 meses)</div>
                <div className="text-3xl font-bold">427%</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-indigo-100 mb-1">Break-even</div>
                <div className="text-3xl font-bold">8 meses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-indigo-100 mb-1">ARR Ano 3</div>
                <div className="text-3xl font-bold">€2.4M</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-sm text-indigo-100 mb-1">Margem EBITDA</div>
                <div className="text-3xl font-bold">64%</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-slate-100">
            <TabsTrigger value="revenue" className="gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Faturamento</span>
            </TabsTrigger>
            <TabsTrigger value="costs" className="gap-2 py-3">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Custos</span>
            </TabsTrigger>
            <TabsTrigger value="competition" className="gap-2 py-3">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Concorrência</span>
            </TabsTrigger>
            <TabsTrigger value="swot" className="gap-2 py-3">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">SWOT</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2 py-3">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">KPIs</span>
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-2 py-3">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Estratégia</span>
            </TabsTrigger>
          </TabsList>

          {/* Revenue Projections */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Projeções de Faturamento (ARR)
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { year: '2026', arr: '€420K', users: 850, avg: '€49' },
                  { year: '2027', arr: '€1.2M', users: 2400, avg: '€52' },
                  { year: '2028', arr: '€2.4M', users: 4600, avg: '€54' }
                ].map((proj) => (
                  <motion.div
                    key={proj.year}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-2xl border border-slate-200"
                  >
                    <div className="text-sm font-medium text-slate-500 mb-2">{proj.year}</div>
                    <div className="text-3xl font-bold text-slate-900 mb-4">{proj.arr}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Usuários Pagantes</span>
                        <span className="font-semibold">{proj.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ticket Médio</span>
                        <span className="font-semibold">{proj.avg}/mês</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-4">Breakdown de Receita por Plano (2026)</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm text-slate-700">Starter (Free → Premium)</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">€180K</div>
                      <div className="text-xs text-slate-500">43% da receita</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="text-sm text-slate-700">Professional (€49/mês)</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">€200K</div>
                      <div className="text-xs text-slate-500">48% da receita</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-slate-700">Enterprise (Custom)</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">€40K</div>
                      <div className="text-xs text-slate-500">9% da receita</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold text-slate-900 mb-4">Projeção de Crescimento Mensal</h4>
              <div className="grid grid-cols-6 gap-4">
                {['Jan', 'Mar', 'Mai', 'Jul', 'Set', 'Nov'].map((month, i) => {
                  const values = [12, 18, 26, 35, 48, 65];
                  return (
                    <div key={month} className="text-center">
                      <div className="mb-2 text-xs text-slate-500">{month}</div>
                      <div className="h-32 bg-slate-100 rounded-lg flex items-end p-2">
                        <div 
                          className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded"
                          style={{ height: `${values[i]}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm font-semibold">€{values[i]}K</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Costs Analysis */}
          <TabsContent value="costs" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fixed Costs */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-red-600" />
                  Custos Fixos Mensais
                </h3>
                
                <div className="space-y-4">
                  {[
                    { item: 'Infraestrutura Cloud (AWS/Supabase)', value: '€890', percent: 28 },
                    { item: 'APIs Externas (Apollo, LinkedIn, PDL)', value: '€650', percent: 20 },
                    { item: 'Salários Equipe (2 devs + 1 PM)', value: '€1,200', percent: 38 },
                    { item: 'Marketing & Growth', value: '€300', percent: 9 },
                    { item: 'Software & Ferramentas', value: '€160', percent: 5 }
                  ].map((cost) => (
                    <div key={cost.item} className="border-b border-slate-100 pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-slate-700">{cost.item}</span>
                        <span className="font-semibold text-slate-900">{cost.value}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${cost.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t-2 border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total Mensal</span>
                      <span className="text-2xl font-bold text-red-600">€3,200</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Variable Costs */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-orange-600" />
                  Custos Variáveis (por usuário/mês)
                </h3>
                
                <div className="space-y-4">
                  {[
                    { item: 'API Calls & Data Enrichment', value: '€2.80', desc: 'Apollo, PDL, LinkedIn API' },
                    { item: 'Cloud Computing & Storage', value: '€1.20', desc: 'Supabase, Edge Functions' },
                    { item: 'Email & Messaging', value: '€0.50', desc: 'Resend, SMS, WhatsApp' },
                    { item: 'AI Processing (OpenAI/Gemini)', value: '€0.80', desc: 'Lead qualification, NLP' },
                    { item: 'Suporte & Success', value: '€0.40', desc: 'Chatbot, tickets' }
                  ].map((cost) => (
                    <div key={cost.item} className="bg-orange-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-slate-900 text-sm">{cost.item}</span>
                        <span className="font-bold text-orange-600">{cost.value}</span>
                      </div>
                      <p className="text-xs text-slate-600">{cost.desc}</p>
                    </div>
                  ))}
                  <div className="pt-4 border-t-2 border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Custo Total/Usuário</span>
                      <span className="text-2xl font-bold text-orange-600">€5.70</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Margem Bruta (Professional €49): <span className="font-semibold text-emerald-600">88.4%</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Cost Optimization */}
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                Otimizações Planejadas
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Q2 2026</div>
                  <div className="font-semibold text-slate-900 mb-2">Caching Inteligente</div>
                  <div className="text-2xl font-bold text-emerald-600">-25%</div>
                  <div className="text-xs text-slate-500 mt-1">API calls</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Q3 2026</div>
                  <div className="font-semibold text-slate-900 mb-2">Batch Processing</div>
                  <div className="text-2xl font-bold text-emerald-600">-30%</div>
                  <div className="text-xs text-slate-500 mt-1">Cloud costs</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Q4 2026</div>
                  <div className="font-semibold text-slate-900 mb-2">CDN Global</div>
                  <div className="text-2xl font-bold text-emerald-600">-40%</div>
                  <div className="text-xs text-slate-500 mt-1">Bandwidth</div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Competition Analysis - NEW TAB */}
          <TabsContent value="competition" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-0">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Análise Competitiva do Mercado
              </h3>
              <p className="text-slate-300 mb-6">
                Mapeamento completo dos principais concorrentes no segmento de automação de vendas e lead generation para imobiliário
              </p>
            </Card>

            {/* Matriz Competitiva */}
            <Card className="p-6">
              <h4 className="font-semibold text-slate-900 mb-6">Matriz de Posicionamento Competitivo</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">Concorrente</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Preço</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Nicho Imobiliário</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">IA Avançada</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">GDPR</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Setup</th>
                      <th className="text-center py-3 px-4 font-semibold text-slate-900">Ameaça</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 bg-indigo-50">
                      <td className="py-4 px-4 font-bold text-indigo-900">🎯 ImobHunter (Nós)</td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">€49/mês</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 font-semibold text-emerald-600">5 min</td>
                      <td className="text-center py-4 px-4 text-slate-400">-</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 font-semibold">HubSpot Sales Hub</td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold text-xs">€450/mês</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full mx-auto" title="Parcial"></div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 font-semibold text-slate-600 text-xs">2-3 dias</td>
                      <td className="text-center py-4 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">ALTA</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 font-semibold">Apollo.io</td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold text-xs">€99/mês</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full mx-auto" title="Parcial"></div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 font-semibold text-slate-600 text-xs">30 min</td>
                      <td className="text-center py-4 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">ALTA</span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4 font-semibold">Salesforce Sales Cloud</td>
                      <td className="text-center py-4 px-4">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold text-xs">€1,200/mês</span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full mx-auto" title="Parcial"></div>
                      </td>
                      <td className="text-center py-4 px-4 font-semibold text-slate-600 text-xs">1-2 sem</td>
                      <td className="text-center py-4 px-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">MÉDIA</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Nosso Diferencial Competitivo */}
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <h4 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                Nosso Diferencial Competitivo (Moat)
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-2">Nicho Vertical</h5>
                  <p className="text-sm text-slate-600">
                    Único player 100% focado em imobiliário. Conhecemos jargões, workflows e dores específicas do setor.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-2">GDPR Native</h5>
                  <p className="text-sm text-slate-600">
                    Construído desde o dia 1 para compliance total. Concorrentes adaptaram depois (compliance frágil).
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-slate-900 mb-2">IA Proprietária</h5>
                  <p className="text-sm text-slate-600">
                    Modelos de scoring treinados em dados imobiliários. Concorrentes usam IA genérica.
                  </p>
                </div>
              </div>
            </Card>

            {/* Estratégia de Pricing Competitivo */}
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <h4 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Estratégia de Pricing Competitivo
              </h4>
              
              <div className="mb-6 p-4 bg-white rounded-lg border-l-4 border-indigo-500">
                <div className="font-semibold text-slate-900 mb-2">💎 Posicionamento: Value-Based Pricing</div>
                <p className="text-sm text-slate-600">
                  Nosso <strong>€49/mês</strong> está estrategicamente entre Pipedrive (€65) e Apollo (€99), 
                  mas com funcionalidades que competem com HubSpot (€450+). <strong className="text-indigo-600">Valor percebido 9x maior que o preço.</strong>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-slate-900 mb-3">❌ Por que NÃO aumentar preço agora:</h5>
                  <ul className="space-y-2">
                    {[
                      'Penetração de mercado (land grab strategy)',
                      'Conversão freemium alta: 12% vs média 2-4%',
                      'Barreira psicológica: €49 = "impulse buy"',
                      'Competir com Apollo em valor, não em preço'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-slate-900 mb-3">📈 Plano de Preços Dinâmico:</h5>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border-l-4 border-indigo-500">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">2026 (Atual)</span>
                        <span className="font-bold text-indigo-900">€49/mês</span>
                      </div>
                      <div className="text-xs text-slate-500">Land grab, validação PMF</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Q4 2026</span>
                        <span className="font-bold text-slate-900">€52/mês</span>
                      </div>
                      <div className="text-xs text-slate-500">+6% após 500 clientes</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">2027</span>
                        <span className="font-bold text-slate-900">€59/mês</span>
                      </div>
                      <div className="text-xs text-slate-500">+20%, ainda 40% mais barato que Apollo</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Custos Ajustados */}
            <Card className="p-6">
              <h4 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-orange-600" />
                Ajuste de Custos Baseado na Concorrência
              </h4>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="font-semibold text-slate-900 mb-2">📊 Custos Atuais</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Custo Variável/User:</span>
                      <span className="font-bold text-red-600">€5.70</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem Bruta:</span>
                      <span className="font-bold">88.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CAC:</span>
                      <span className="font-bold text-red-600">€68</span>
                    </div>
                  </div>
                  <p className="text-xs text-red-700 mt-3">
                    ⚠️ Bom, mas podemos melhorar para competir no longo prazo
                  </p>
                </div>
                
                <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-500">
                  <div className="font-semibold text-slate-900 mb-2">✅ Custos Otimizados (Q4 2026)</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Custo Variável/User:</span>
                      <span className="font-bold text-emerald-600">€3.80</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem Bruta:</span>
                      <span className="font-bold text-emerald-600">92.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CAC:</span>
                      <span className="font-bold text-emerald-600">€45</span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-700 mt-3">
                    🎯 Margens competitivas com Salesforce (90%+) mas preço 20x menor
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h5 className="font-semibold text-slate-900 mb-3">🚀 Otimizações Implementadas:</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { item: 'Cache de API calls (Apollo/PDL)', saving: '-33%', from: '€2.80', to: '€1.90' },
                    { item: 'Serverless otimizado (Supabase)', saving: '-25%', from: '€1.20', to: '€0.90' },
                    { item: 'Batch processing emails', saving: '-40%', from: '€0.50', to: '€0.30' },
                    { item: 'AI model pruning', saving: '-20%', from: '€0.80', to: '€0.64' },
                  ].map((opt, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-slate-200">
                      <div className="text-sm font-medium text-slate-900 mb-1">{opt.item}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          <span className="line-through">{opt.from}</span> → <span className="font-bold text-emerald-600">{opt.to}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">{opt.saving}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* SWOT Analysis */}
          <TabsContent value="swot" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="p-6 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Forças (Strengths)
                </h3>
                <ul className="space-y-3">
                  {[
                    'AI avançada para qualificação automática de leads',
                    'Integração nativa com LinkedIn, Apollo e CRMs',
                    'Time-to-value de apenas 5 minutos (setup)',
                    'Conformidade total GDPR/LGPD desde o início',
                    'Modelo freemium escalável com conversão de 12%',
                    'Stack tecnológica moderna (Supabase, Edge Computing)',
                    'ROI demonstrável em 30 dias para clientes',
                    'Expertise em mercado imobiliário português'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Weaknesses */}
              <Card className="p-6 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
                <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
                  <XCircle className="w-6 h-6" />
                  Fraquezas (Weaknesses)
                </h3>
                <ul className="space-y-3">
                  {[
                    'Marca ainda desconhecida no mercado',
                    'Dependência de APIs de terceiros (Apollo, PDL)',
                    'Equipe pequena (3 pessoas inicialmente)',
                    'Budget limitado para marketing agressivo',
                    'Competição com players estabelecidos (HubSpot)',
                    'Necessidade de validação contínua do mercado',
                    'Custos de aquisição de clientes ainda altos',
                    'Integrações CRM limitadas no lançamento'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Opportunities */}
              <Card className="p-6 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
                <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Oportunidades (Opportunities)
                </h3>
                <ul className="space-y-3">
                  {[
                    'Mercado imobiliário em alta em Portugal e Brasil',
                    'Digitalização acelerada pós-COVID no setor',
                    'Demanda crescente por automação de vendas B2B',
                    'Expansão para mercados LATAM (Brasil, México)',
                    'Parcerias com redes imobiliárias (franchises)',
                    'Upsell para módulos de IA avançada',
                    'White-label para grandes redes imobiliárias',
                    'Integração com PropTech emergentes'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Zap className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Threats */}
              <Card className="p-6 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  Ameaças (Threats)
                </h3>
                <ul className="space-y-3">
                  {[
                    'Giants do mercado (Salesforce, HubSpot) entrando no nicho',
                    'Mudanças nas políticas de API do LinkedIn',
                    'Regulamentações GDPR cada vez mais restritivas',
                    'Saturação do mercado de automação de vendas',
                    'Crise econômica afetando investimentos em PropTech',
                    'Competição por talento tech em Lisboa',
                    'Dependência de poucos fornecedores de dados',
                    'Fatiga de IA nos clientes (buzzword burnout)'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </TabsContent>

          {/* Key Metrics */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">CAC</h4>
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">€68</div>
                <p className="text-sm text-slate-600">Custo de Aquisição por Cliente</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Meta 2027:</span>
                    <span className="font-semibold text-emerald-600">€45</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">LTV</h4>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">€1,470</div>
                <p className="text-sm text-slate-600">Lifetime Value médio</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">LTV/CAC Ratio:</span>
                    <span className="font-semibold text-emerald-600">21.6x</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Churn Rate</h4>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">4.2%</div>
                <p className="text-sm text-slate-600">Taxa de cancelamento mensal</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Meta 2027:</span>
                    <span className="font-semibold text-emerald-600">2.8%</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h4 className="font-semibold text-slate-900 mb-6">Unit Economics</h4>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-600 mb-2">MRR/Cliente</div>
                  <div className="text-2xl font-bold text-slate-900">€49</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="text-sm text-slate-600 mb-2">Custo Variável</div>
                  <div className="text-2xl font-bold text-orange-600">€5.70</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <div className="text-sm text-slate-600 mb-2">Margem Bruta</div>
                  <div className="text-2xl font-bold text-emerald-600">88.4%</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-xl">
                  <div className="text-sm text-slate-600 mb-2">Payback Period</div>
                  <div className="text-2xl font-bold text-indigo-600">1.6 meses</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold text-slate-900 mb-6">Funnel de Conversão</h4>
              <div className="space-y-4">
                {[
                  { stage: 'Visitantes Site', value: 10000, percent: 100, color: 'slate' },
                  { stage: 'Sign-ups Free', value: 850, percent: 8.5, color: 'blue' },
                  { stage: 'Ativação (7 dias)', value: 680, percent: 6.8, color: 'indigo' },
                  { stage: 'Conversão Premium', value: 102, percent: 1.02, color: 'purple' },
                  { stage: 'Retenção (90 dias)', value: 98, percent: 0.98, color: 'emerald' }
                ].map((stage) => (
                  <div key={stage.stage}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{stage.value.toLocaleString()}</span>
                        <span className="text-sm text-slate-500 ml-2">({stage.percent}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div 
                        className={`bg-${stage.color}-500 h-3 rounded-full transition-all`}
                        style={{ width: `${stage.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Strategy & Roadmap */}
          <TabsContent value="strategy" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Roadmap Estratégico 2026-2028
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    quarter: 'Q1 2026',
                    phase: 'MVP Launch',
                    goals: [
                      'Lançamento beta com 50 early adopters',
                      'Validação product-market fit',
                      'Setup infraestrutura cloud escalável',
                      'Primeiras integrações CRM (HubSpot)'
                    ],
                    metrics: 'MRR: €15K | Usuários: 300'
                  },
                  {
                    quarter: 'Q2 2026',
                    phase: 'Growth',
                    goals: [
                      'Campanha de marketing digital agressiva',
                      'Parcerias com 3 redes imobiliárias',
                      'Lançamento API pública',
                      'Expansão equipe (2 comerciais + 1 dev)'
                    ],
                    metrics: 'MRR: €35K | Usuários: 700'
                  },
                  {
                    quarter: 'Q3-Q4 2026',
                    phase: 'Scaling',
                    goals: [
                      'Expansão Brasil (São Paulo, Rio)',
                      'White-label para grandes redes',
                      'IA avançada: previsão de fechamento',
                      'Series A fundraising (€1.5M)'
                    ],
                    metrics: 'MRR: €65K | Usuários: 1,300'
                  },
                  {
                    quarter: '2027',
                    phase: 'Market Leadership',
                    goals: [
                      'Consolidação como líder na Península Ibérica',
                      'Expansão LATAM (México, Colômbia)',
                      'Enterprise tier + custom solutions',
                      'M&A de startups complementares'
                    ],
                    metrics: 'ARR: €1.2M | Usuários: 2,400'
                  },
                  {
                    quarter: '2028',
                    phase: 'Global Expansion',
                    goals: [
                      'Entrada mercados europeus (UK, Alemanha)',
                      'Plataforma multi-idioma completa',
                      'IPO ou aquisição estratégica',
                      'AI proprietária (menos dependência de terceiros)'
                    ],
                    metrics: 'ARR: €2.4M | Usuários: 4,600'
                  }
                ].map((phase, i) => (
                  <motion.div
                    key={phase.quarter}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-8 border-l-2 border-indigo-200"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-indigo-600"></div>
                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm font-medium text-indigo-600">{phase.quarter}</div>
                          <h4 className="text-lg font-bold text-slate-900">{phase.phase}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Target</div>
                          <div className="font-semibold text-slate-900 text-sm">{phase.metrics}</div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {phase.goals.map((goal, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                Recomendações Estratégicas
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Prioridade 1: Product-Market Fit',
                    desc: 'Focar nos primeiros 100 clientes pagantes para validar hipóteses. Iterar rápido com feedback direto.',
                    icon: Target
                  },
                  {
                    title: 'Prioridade 2: Parcerias B2B',
                    desc: 'Firmar acordos com 3-5 redes imobiliárias médias (50-200 corretores) para escalar mais rápido.',
                    icon: Building2
                  },
                  {
                    title: 'Prioridade 3: Otimização de CAC',
                    desc: 'Reduzir CAC de €68 para €45 via content marketing, SEO e programa de referral.',
                    icon: TrendingDown
                  },
                  {
                    title: 'Prioridade 4: AI Proprietária',
                    desc: 'Desenvolver modelos de ML próprios até 2027 para reduzir dependência de APIs de terceiros.',
                    icon: Cpu
                  }
                ].map((rec) => (
                  <div key={rec.title} className="bg-white rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <rec.icon className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm mb-1">{rec.title}</div>
                        <p className="text-xs text-slate-600">{rec.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white border-0">
            <h3 className="text-2xl font-bold mb-6">Conclusão e Próximos Passos</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-indigo-300 mb-3">Viabilidade Financeira</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  O modelo de negócio demonstra forte viabilidade com margem bruta de 88%, 
                  LTV/CAC ratio saudável de 21.6x e break-even em 8 meses. Projeções conservadoras 
                  apontam ARR de €2.4M em 36 meses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-300 mb-3">Posicionamento Estratégico</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Análise SWOT revela oportunidades significativas no mercado ibérico e LATAM. 
                  Foco em nicho imobiliário + conformidade GDPR nos diferencia de competitors genéricos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-indigo-300 mb-3">Roadmap de Execução</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Roadmap em 5 fases com milestones claros. Prioridades: validação PMF (Q1), 
                  parcerias B2B (Q2), expansão Brasil (H2), fundraising Series A (Q4 2026).
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-sm text-slate-400">
                Documento atualizado em Janeiro 2026 | Confidencial - Uso Interno ImobHunter
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}