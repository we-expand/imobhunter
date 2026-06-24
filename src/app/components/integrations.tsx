import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plug, Check, AlertCircle, Linkedin, Mail, MessageCircle, Database } from 'lucide-react';

export function Integrations() {
  const [connectedServices, setConnectedServices] = useState({
    linkedin: true,
    apollo: false,
    whatsapp: true,
    sendgrid: false,
    kwcommand: false,
    hubspot: false
  });

  const integrations = [
    {
      id: 'linkedin',
      name: 'LinkedIn Sales Navigator',
      icon: Linkedin,
      description: 'Busca de perfis e envio de conexões',
      fields: [
        { name: 'apiKey', label: 'API Key', type: 'password' },
        { name: 'accountId', label: 'Account ID', type: 'text' }
      ],
      status: connectedServices.linkedin
    },
    {
      id: 'apollo',
      name: 'Apollo.io',
      icon: Database,
      description: 'Enrichment de emails e telefones',
      fields: [
        { name: 'apiKey', label: 'API Key', type: 'password' }
      ],
      status: connectedServices.apollo
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      icon: MessageCircle,
      description: 'Envio de mensagens automáticas',
      fields: [
        { name: 'phoneNumberId', label: 'Phone Number ID', type: 'text' },
        { name: 'accessToken', label: 'Access Token', type: 'password' }
      ],
      status: connectedServices.whatsapp
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      icon: Mail,
      description: 'Envio de emails transacionais',
      fields: [
        { name: 'apiKey', label: 'API Key', type: 'password' },
        { name: 'fromEmail', label: 'From Email', type: 'email' }
      ],
      status: connectedServices.sendgrid
    }
  ];

  const crmIntegration = {
    id: 'kwcommand',
    name: 'KW Command / CRM',
    icon: Database,
    description: 'Sincronização automática de leads qualificados',
    fields: [
      { name: 'webhookUrl', label: 'Webhook URL', type: 'text' },
      { name: 'apiKey', label: 'API Key', type: 'password' }
    ],
    status: connectedServices.kwcommand
  };

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
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Plug className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl">Integrações e API</h2>
            <p className="text-sm text-gray-600">Configure conexões com serviços externos</p>
          </div>
        </div>

        <Tabs defaultValue="connectors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="connectors">Conectores</TabsTrigger>
            <TabsTrigger value="crm">CRM & Mapeamento</TabsTrigger>
          </TabsList>

          <TabsContent value="connectors" className="space-y-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.status ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Conectado
                          </Badge>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                          <Badge variant="secondary">Não configurado</Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {integration.status && (
                    <div className="space-y-3 pt-4 border-t">
                      {integration.fields.map((field) => (
                        <div key={field.name}>
                          <Label>{field.label}</Label>
                          <Input
                            type={field.type}
                            placeholder={`Insira ${field.label.toLowerCase()}`}
                            defaultValue={integration.status ? '••••••••••••' : ''}
                            className="mt-2"
                          />
                        </div>
                      ))}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1">
                          Testar Conexão
                        </Button>
                        <Button variant="destructive" className="flex-1">
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  )}

                  {!integration.status && (
                    <Button className="w-full mt-4">
                      <Plug className="w-4 h-4 mr-2" />
                      Conectar {integration.name}
                    </Button>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="crm" className="space-y-6">
            <Card className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{crmIntegration.name}</h3>
                    <p className="text-sm text-gray-600">{crmIntegration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {crmIntegration.status ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Conectado
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <Badge variant="secondary">Não configurado</Badge>
                    </>
                  )}
                </div>
              </div>

              {!crmIntegration.status && (
                <Button className="w-full">
                  <Plug className="w-4 h-4 mr-2" />
                  Conectar CRM
                </Button>
              )}

              {crmIntegration.status && (
                <div className="space-y-3 pt-4 border-t">
                  {crmIntegration.fields.map((field) => (
                    <div key={field.name}>
                      <Label>{field.label}</Label>
                      <Input
                        type={field.type}
                        placeholder={`Insira ${field.label.toLowerCase()}`}
                        defaultValue="••••••••••••"
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Mapeamento de Campos</h3>
              <p className="text-sm text-gray-600 mb-4">
                Garantir que os dados da AI preenchem os campos certos no CRM
              </p>

              <div className="space-y-3">
                {fieldMapping.map((mapping, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{mapping.source}</p>
                      <p className="text-xs text-gray-500">Campo AI</p>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{mapping.target}</p>
                      <p className="text-xs text-gray-500">Campo CRM</p>
                    </div>
                    <Switch checked={mapping.mapped} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg mb-4">Regras de Sincronização</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Sync automático quando Score {'>'} 80</p>
                    <p className="text-xs text-gray-500">Leads quentes vão direto para o CRM</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Incluir histórico de conversas</p>
                    <p className="text-xs text-gray-500">Adiciona resumo das interações</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Notificar consultor por email</p>
                    <p className="text-xs text-gray-500">Alerta quando lead é transferido</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}