import React, { useState } from 'react';
import { 
  BarChart3, 
  Wallet, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  FileText,
  Landmark,
  AlertCircle,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';

export function AdminPlatformDashboard() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Console</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestão global da plataforma ImobHunter (BR/PT).</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800 w-fit">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Insights & KPIs
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Financeiro & Fiscal
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-1">
            {/* --- ABA OVERVIEW --- */}
            <TabsContent value="overview" className="space-y-4 m-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard title="Receita Total (MRR)" value="€ 42.500" change="+12% vs mês anterior" icon={DollarSign} />
                    <MetricCard title="Usuários Ativos" value="1,234" change="+5% vs mês anterior" icon={TrendingUp} />
                    <MetricCard title="Imóveis Indexados" value="85,000" change="+1.2k esta semana" icon={Building2} />
                    <MetricCard title="Leads Gerados" value="12,543" change="+8% conversão" icon={BarChart3} />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4 dark:bg-slate-900 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle>Crescimento de Assinaturas</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
                                [Gráfico de Crescimento Placeholder]
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-3 dark:bg-slate-900 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle>Atividade Recente</CardTitle>
                            <CardDescription>Novos assinantes nas últimas 24h</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">Nova Imobiliária SP</p>
                                            <p className="text-sm text-slate-500">Plano Enterprise (BR)</p>
                                        </div>
                                        <div className="ml-auto font-medium">+R$ 2.500</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* --- ABA FINANCEIRA --- */}
            <TabsContent value="financial" className="space-y-6 m-0">
                <div className="grid gap-6 md:grid-cols-2">
                    
                    {/* Seção Brasil */}
                    <Card className="dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-green-500">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">🇧🇷 Fiscal Brasil</CardTitle>
                                    <CardDescription>Compliance e Obrigações (CNPJ Matriz)</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">Emitir DAS</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <LabelValue label="Regime Tributário" value="Lucro Presumido" />
                                <LabelValue label="Próximo DAS" value="R$ 12.450,00 (Vence em 20/DEZ)" alert />
                                <LabelValue label="ISSQN (São Paulo)" value="R$ 3.200,00" />
                            </div>
                            <div className="pt-4 border-t dark:border-slate-800">
                                <h4 className="text-sm font-medium mb-2">Obrigações Acessórias</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <StatusBadge label="DCTFWeb" status="Enviado" />
                                    <StatusBadge label="EFD-Reinf" status="Pendente" color="amber" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seção Portugal */}
                    <Card className="dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-red-500">
                        <CardHeader>
                             <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">🇵🇹 Fiscal Portugal</CardTitle>
                                    <CardDescription>Compliance e Obrigações (NIF PT)</CardDescription>
                                </div>
                                <Button variant="outline" size="sm">Detalhes IVA</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <LabelValue label="Regime" value="Contabilidade Organizada" />
                                <LabelValue label="IVA Trimestral" value="€ 4.200,00 (Vence em 15/JAN)" />
                                <LabelValue label="IRC Estimado" value="€ 12.500,00" />
                            </div>
                            <div className="pt-4 border-t dark:border-slate-800">
                                <h4 className="text-sm font-medium mb-2">Segurança Social & Finanças</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <StatusBadge label="Declaração Periódica" status="Validada" />
                                    <StatusBadge label="TSU" status="Pago" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="dark:bg-slate-900 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle>Automação de Pagamentos</CardTitle>
                        <CardDescription>Regras de split de pagamento e provisionamento de impostos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                                        <Landmark className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Provisionamento Automático (Brasil)</p>
                                        <p className="text-sm text-slate-500">Retém 16.33% de cada venda para conta de impostos</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">ATIVO</span>
                                    <Button variant="ghost" size="sm">Configurar</Button>
                                </div>
                            </div>

                             <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                                        <Landmark className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">Provisionamento IVA (Portugal)</p>
                                        <p className="text-sm text-slate-500">Retém 23% de transações PT para conta IVA</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">ATIVO</span>
                                    <Button variant="ghost" size="sm">Configurar</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// --- Componentes Auxiliares ---

function MetricCard({ title, value, change, icon: Icon }: any) {
    return (
        <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {change}
                </p>
            </CardContent>
        </Card>
    )
}

function LabelValue({ label, value, alert }: any) {
    return (
        <div className="flex justify-between items-center text-sm border-b border-dashed border-slate-200 dark:border-slate-800 pb-2 last:border-0">
            <span className="text-slate-500 dark:text-slate-400">{label}:</span>
            <span className={`font-medium ${alert ? 'text-red-500 flex items-center gap-1' : 'text-slate-900 dark:text-white'}`}>
                {alert && <AlertCircle className="w-3 h-3" />}
                {value}
            </span>
        </div>
    )
}

function StatusBadge({ label, status, color = 'green' }: any) {
    const colors: any = {
        green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    }
    return (
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded text-xs">
            <span className="text-slate-600 dark:text-slate-400">{label}</span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${colors[color] || colors.green}`}>
                {status}
            </span>
        </div>
    )
}