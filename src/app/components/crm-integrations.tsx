import { SimpleCRMLogin } from './simple-crm-login';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Building2, Zap, Users } from 'lucide-react';

export function CRMIntegrations() {
  const fieldMapping = [
    { source: 'Nome Completo', target: 'Full Name', mapped: true },
    { source: 'Email', target: 'Email Address', mapped: true },
    { source: 'Telefone', target: 'Phone Number', mapped: true },
    { source: 'LinkedIn URL', target: 'LinkedIn Profile', mapped: true },
    { source: 'Empresa', target: 'Company Name', mapped: true },
    { source: 'Cargo', target: 'Job Title', mapped: true },
    { source: 'Score AI', target: 'Lead Score', mapped: true },
    { source: 'Cluster', target: 'Lead Source', mapped: true },
    { source: 'Resumo Conversa', target: 'Notes', mapped: true }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          Integrações CRM
        </h2>
        <p className="text-gray-600 mt-1">
          Conecte seu CRM para receber leads qualificados automaticamente
        </p>
      </div>

      {/* CRM Logins */}
      <div className="grid gap-6">
        <SimpleCRMLogin
          platform="hubspot"
          icon={<Zap className="w-6 h-6 text-orange-600" />}
          title="HubSpot CRM"
          description="CRM completo para vendas e marketing"
          color="border-orange-200"
        />

        <SimpleCRMLogin
          platform="salesforce"
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          title="Salesforce"
          description="Plataforma líder em CRM empresarial"
          color="border-blue-200"
        />

        <SimpleCRMLogin
          platform="pipedrive"
          icon={<Users className="w-6 h-6 text-green-600" />}
          title="Pipedrive"
          description="CRM focado em pipeline de vendas"
          color="border-green-200"
        />
      </div>

      {/* Mapeamento de Campos */}
      <Card>
        <CardHeader>
          <CardTitle>Mapeamento de Campos</CardTitle>
          <CardDescription>
            Configurar quais dados do lead são enviados para o CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fieldMapping.map((mapping, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium">{mapping.source}</p>
                  <p className="text-xs text-gray-500">Campo AI LeadGen</p>
                </div>
                <div className="text-gray-400 font-bold">→</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{mapping.target}</p>
                  <p className="text-xs text-gray-500">Campo CRM</p>
                </div>
                <Switch checked={mapping.mapped} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regras de Sincronização */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Sincronização</CardTitle>
          <CardDescription>
            Definir quando os leads são enviados automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium">Sync automático quando Score {'>'} 80</p>
                <p className="text-sm text-gray-600">Leads quentes vão direto para o CRM</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium">Incluir LinkedIn URL</p>
                <p className="text-sm text-gray-600">Enviar link do perfil do LinkedIn</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium">Incluir histórico de conversas</p>
                <p className="text-sm text-gray-600">Adicionar resumo das interações da IA</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium">Notificar consultor por email</p>
                <p className="text-sm text-gray-600">Alerta quando lead é transferido</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium">Criar tarefa de follow-up automática</p>
                <p className="text-sm text-gray-600">Agendar tarefa no CRM para o consultor</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
