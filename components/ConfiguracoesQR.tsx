import { useState, useEffect } from 'react';
import { Smartphone, Mail, Settings as SettingsIcon, Database, CheckCircle, QrCode, Zap, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { API_URL as SERVER_URL } from '../utils/api';
import { supabase } from '../utils/supabase/client';
import { WhatsAppQRConnectReal } from './WhatsAppQRConnectReal';

type Tab = 'comunicacao' | 'crm' | 'ai' | 'geral';

export function ConfiguracoesQR() {
  const [activeTab, setActiveTab] = useState<Tab>('comunicacao');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-emerald-900 mb-2">Configurações</h1>
        <p className="text-emerald-700">Conecte o WhatsApp para enviar cobranças automáticas</p>
      </div>

      {/* WhatsApp em Destaque - Sempre Visível */}
      <div className="mb-8">
        <Card className="border-2 border-emerald-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-emerald-900">WhatsApp Business</CardTitle>
                <CardDescription className="text-emerald-700">
                  Conecte o WhatsApp para enviar mensagens de cobrança automaticamente
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <WhatsAppQRConnectReal 
              onConnected={(phoneNumber) => {
                toast.success(`WhatsApp conectado: ${phoneNumber}`);
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Outras Configurações - Abaixo */}
      <div className="space-y-4">
        <h3 className="text-emerald-900">Outras Integrações</h3>
        
        {/* Tabs Simplificadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-emerald-200 hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => setActiveTab('crm')}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-emerald-900">CRM</CardTitle>
              </div>
              <CardDescription className="text-emerald-700">
                Integrações com sistemas externos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => setActiveTab('ai')}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-600" />
                <CardTitle className="text-emerald-900">IA</CardTitle>
              </div>
              <CardDescription className="text-emerald-700">
                Inteligência artificial de cobrança
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => setActiveTab('geral')}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-emerald-900">Geral</CardTitle>
              </div>
              <CardDescription className="text-emerald-700">
                Definições gerais do sistema
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Modal/Detalhes das outras tabs (apenas se não for comunicacao) */}
      {activeTab === 'crm' && (
        <Card className="border-emerald-200 mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-900">Integrações CRM</CardTitle>
            <CardDescription className="text-emerald-700">
              Conecte o Tá Pago ao seu sistema de gestão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-cyan-800">
                Integrações com CRM externo em breve...
              </p>
            </div>
            <Button 
              onClick={() => setActiveTab('comunicacao')} 
              variant="outline" 
              className="mt-4"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'ai' && (
        <Card className="border-emerald-200 mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-900">IA de Cobrança</CardTitle>
            <CardDescription className="text-emerald-700">
              Configure a inteligência artificial para otimizar as cobranças
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-cyan-800 mb-2">
                ✨ A IA está ativa e analisa automaticamente:
              </p>
              <ul className="list-disc list-inside text-cyan-700 space-y-1">
                <li>Melhor horário para contactar</li>
                <li>Tom de mensagem ideal</li>
                <li>Probabilidade de pagamento</li>
                <li>Sugestões de desconto</li>
              </ul>
            </div>
            <Button 
              onClick={() => setActiveTab('comunicacao')} 
              variant="outline" 
              className="mt-4"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'geral' && (
        <Card className="border-emerald-200 mt-6">
          <CardHeader>
            <CardTitle className="text-emerald-900">Definições Gerais</CardTitle>
            <CardDescription className="text-emerald-700">
              Preferências e configurações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800">
                Configurações gerais em breve...
              </p>
            </div>
            <Button 
              onClick={() => setActiveTab('comunicacao')} 
              variant="outline" 
              className="mt-4"
            >
              Voltar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}