import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { TabsContent } from './ui/tabs';
import {
  Radio, Settings, Zap, CheckCircle2, Save, ChevronRight,
  Brain, Activity, Pause, Play, Linkedin, Mail, MessageSquare,
  Phone, Clock, Calendar, Eye, TrendingUp, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface CRMTabProps {
  selectedCrm: string | null;
  setSelectedCrm: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
  crmIntegrations: any[];
}

interface MonitorTabProps {
  aiStatus: 'paused' | 'active' | 'learning';
  handleToggleAi: () => void;
  currentTemplate: any;
}

export function CRMIntegrationTab({ selectedCrm, setSelectedCrm, setActiveTab, crmIntegrations }: CRMTabProps) {
  return (
    <TabsContent value="crm" className="space-y-6">
      <Card className="p-8 border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-white/5">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Radio className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-light text-white mb-2">CRM Integration 🔄</h2>
              <p className="text-zinc-400">
                Connect your CRM to sync leads automatically. The AI feeds your platform in real-time.
              </p>
            </div>
          </div>

          {/* Grid de CRMs Disponíveis */}
          <div className="grid md:grid-cols-2 gap-6">
            {crmIntegrations.map((crm) => (
              <Card
                key={crm.id}
                className={`p-6 cursor-pointer transition-all border ${
                  selectedCrm === crm.id
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
                onClick={() => setSelectedCrm(crm.id)}
              >
                <div className="space-y-4">
                  {/* Header do CRM */}
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{crm.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-white">{crm.name}</h3>
                        {selectedCrm === crm.id && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">{crm.description}</p>
                    </div>
                  </div>

                  {/* Funcionalidades */}
                  <div className="space-y-2">
                    {crm.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botão de Conexão */}
                  {selectedCrm === crm.id && (
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <Input
                        placeholder="Paste API Key here"
                        type="password"
                        className="h-12 bg-black/40 border-white/10 text-white placeholder:text-zinc-600"
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`✅ ${crm.name} connected successfully!`, {
                            description: 'Automatic synchronization is active'
                          });
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Connect {crm.name}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Configurações de Sincronização */}
          {selectedCrm && (
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-indigo-400" />
                Sync Settings
              </h3>
              
              <Card className="p-6 bg-white/5 border border-white/10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-zinc-300">Auto Sync</Label>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                    </div>
                    <p className="text-xs text-zinc-500">
                      Automatically sync new leads when qualified
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-zinc-300">Bi-directional Update</Label>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                    </div>
                    <p className="text-xs text-zinc-500">
                      CRM updates reflect on platform and vice-versa
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-zinc-300">Target Pipeline</Label>
                    <Input
                      placeholder="Ex: New Leads"
                      defaultValue="Qualified Leads"
                      className="h-10 bg-black/40 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-zinc-300">Default Owner</Label>
                    <Input
                      placeholder="Owner Email"
                      className="h-10 bg-black/40 border-white/10 text-white"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Botão de Continuar */}
          <div className="flex justify-end pt-6 border-t border-white/5">
            <Button 
              onClick={() => {
                toast.success('✅ CRM integrated successfully!');
                setActiveTab('monitor');
              }}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Integration & View Monitoring
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </TabsContent>
  );
}

export function MonitoringTab({ aiStatus, handleToggleAi, currentTemplate }: MonitorTabProps) {
  return (
    <TabsContent value="monitor" className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card de Status da IA */}
        <Card className="p-6 border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <Brain className="w-5 h-5 text-indigo-400" />
                AI Status
              </h3>
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                aiStatus === 'active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-600'
              }`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">State</span>
                <Badge className={aiStatus === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-700/50 text-zinc-400 border border-zinc-600'}>
                  {aiStatus === 'active' ? 'Active' : 'Paused'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Actions Today</span>
                <span className="font-semibold text-white">127</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Response Rate</span>
                <span className="font-semibold text-emerald-400">34%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Qualified Leads</span>
                <span className="font-semibold text-blue-400">18</span>
              </div>
            </div>

            <Button
              onClick={handleToggleAi}
              className={`w-full ${aiStatus === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20'}`}
            >
              {aiStatus === 'active' ? (
                <><Pause className="w-4 h-4 mr-2" /> Pause AI</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Activate AI</>
              )}
            </Button>
          </div>
        </Card>

        {/* Card de Atividades Recentes */}
        <Card className="p-6 border border-white/10 bg-zinc-900/40 backdrop-blur-sm md:col-span-2">
          <h3 className="font-semibold flex items-center gap-2 mb-4 text-white">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent AI Activity
          </h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {[
              { time: '2 min ago', action: 'LinkedIn connection sent', contact: 'Pedro Silva', channel: 'linkedin', status: 'success' },
              { time: '5 min ago', action: 'Follow-up email sent', contact: 'Maria Santos', channel: 'email', status: 'success' },
              { time: '12 min ago', action: 'WhatsApp message sent', contact: 'João Costa', channel: 'whatsapp', status: 'pending' },
              { time: '18 min ago', action: 'Lead qualified → CRM', contact: 'Ana Ferreira', channel: 'crm', status: 'success' },
              { time: '24 min ago', action: 'LinkedIn response received', contact: 'Carlos Oliveira', channel: 'linkedin', status: 'success' },
              { time: '31 min ago', action: 'SMS sent', contact: 'Rita Alves', channel: 'sms', status: 'success' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {activity.channel === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-400" />}
                  {activity.channel === 'email' && <Mail className="w-4 h-4 text-green-400" />}
                  {activity.channel === 'whatsapp' && <MessageSquare className="w-4 h-4 text-emerald-400" />}
                  {activity.channel === 'sms' && <Phone className="w-4 h-4 text-purple-400" />}
                  {activity.channel === 'crm' && <Radio className="w-4 h-4 text-indigo-400" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-zinc-500">To: {activity.contact}</p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-zinc-600">{activity.time}</span>
                  {activity.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {activity.status === 'pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Timeline Visual da Cadência */}
      <Card className="p-8 border border-white/10 bg-zinc-900/40 backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
          <Calendar className="w-6 h-6 text-orange-400" />
          Live Cadence Timeline
        </h3>
        
        <div className="relative">
          {/* Linha do Tempo */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 opacity-50" />
          
          {/* Passos da Cadência */}
          <div className="space-y-8">
            {currentTemplate?.steps.map((step: any, index: number) => (
              <div key={step.id} className="relative flex items-start gap-6 pl-4">
                {/* Ponto na Timeline */}
                <div className={`absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center z-10 border border-white/10 shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-blue-600 to-cyan-600' :
                  index === 1 ? 'bg-gradient-to-br from-green-600 to-emerald-600' :
                  'bg-gradient-to-br from-purple-600 to-pink-600'
                }`}>
                  {step.channel === 'linkedin' && <Linkedin className="w-7 h-7 text-white" />}
                  {step.channel === 'email' && <Mail className="w-7 h-7 text-white" />}
                  {step.channel === 'whatsapp' && <MessageSquare className="w-7 h-7 text-white" />}
                  {step.channel === 'sms' && <Phone className="w-7 h-7 text-white" />}
                </div>
                
                {/* Conteúdo do Passo */}
                <div className="flex-1 ml-20">
                  <Card className="p-5 bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className="font-bold bg-white/10 text-white border-0">Step {index + 1}</Badge>
                          <Badge variant="outline" className="border-white/10 text-zinc-400">
                            {step.delay === 0 ? '⚡ Immediate' : `⏱️ +${step.delay} ${step.delayUnit}`}
                          </Badge>
                        </div>
                        
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {Math.floor(Math.random() * 30 + 50)} sent
                        </Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-1 text-white">{step.action}</h4>
                        <p className="text-sm text-zinc-400 line-clamp-2">{step.template}</p>
                      </div>
                      
                      {/* Métricas do Passo */}
                      <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-blue-400" />
                          <span>{Math.floor(Math.random() * 20 + 40)}% open rate</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-green-400" />
                          <span>{Math.floor(Math.random() * 10 + 15)}% response rate</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-purple-400" />
                          <span>{Math.floor(Math.random() * 5 + 8)}% qualified</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Métricas de Performance */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-5 border border-white/10 bg-blue-500/5">
          <div className="flex items-center justify-between mb-3">
            <Mail className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">127</p>
          <p className="text-sm text-zinc-400">Messages Sent</p>
        </Card>

        <Card className="p-5 border border-white/10 bg-emerald-500/5">
          <div className="flex items-center justify-between mb-3">
            <MessageSquare className="w-8 h-8 text-emerald-400" />
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">43</p>
          <p className="text-sm text-zinc-400">Responses</p>
        </Card>

        <Card className="p-5 border border-white/10 bg-purple-500/5">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="w-8 h-8 text-purple-400" />
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">18</p>
          <p className="text-sm text-zinc-400">Qualified Leads</p>
        </Card>

        <Card className="p-5 border border-white/10 bg-orange-500/5">
          <div className="flex items-center justify-between mb-3">
            <Radio className="w-8 h-8 text-orange-400" />
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-sm text-zinc-400">Synced to CRM</p>
        </Card>
      </div>
    </TabsContent>
  );
}