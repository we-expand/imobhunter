import { AlertCircle, ExternalLink, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function WhatsAppConnectionGuide() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Aviso Importante */}
      <Card className="border-2 border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            Como Conectar o WhatsApp Realmente
          </CardTitle>
          <CardDescription className="text-amber-800">
            Explicação honesta sobre a integração do WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white border-2 border-amber-200 rounded-lg p-4">
            <p className="text-amber-900 mb-3">
              <strong>⚠️ IMPORTANTE:</strong> O QR Code gerado neste sistema é para demonstração. 
              Para conectar o WhatsApp <strong>realmente</strong>, você tem 3 opções:
            </p>

            {/* Opção 1 - API Oficial */}
            <div className="space-y-4 mt-4">
              <div className="border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50 rounded">
                <h4 className="font-bold text-emerald-900 mb-2">
                  ✅ Opção 1: API Oficial do WhatsApp Business (RECOMENDADO)
                </h4>
                <p className="text-sm text-emerald-800 mb-3">
                  A forma mais profissional e confiável. Ideal para empresas sérias.
                </p>
                
                <div className="space-y-2 text-sm text-emerald-900">
                  <p><strong>Passos:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Aceda a <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">Meta for Developers</a></li>
                    <li>Crie um "App" e ative o WhatsApp Business API</li>
                    <li>Configure o número de telefone empresarial</li>
                    <li>Obtenha o <code className="bg-emerald-200 px-2 py-0.5 rounded">Access Token</code> e <code className="bg-emerald-200 px-2 py-0.5 rounded">Phone Number ID</code></li>
                    <li>Cole estes valores nas variáveis de ambiente do Supabase:
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li><code className="bg-emerald-200 px-2 py-0.5 rounded">WHATSAPP_ACCESS_TOKEN</code></li>
                        <li><code className="bg-emerald-200 px-2 py-0.5 rounded">WHATSAPP_PHONE_NUMBER_ID</code></li>
                      </ul>
                    </li>
                  </ol>
                  
                  <div className="mt-3 p-3 bg-emerald-100 rounded border border-emerald-300">
                    <p className="font-semibold mb-1">💰 Custos:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>1000 conversas grátis/mês</li>
                      <li>Depois: ~€0,005 a €0,09 por conversa (dependendo do país)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Opção 2 - Baileys */}
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded">
                <h4 className="font-bold text-blue-900 mb-2">
                  🔧 Opção 2: Biblioteca Baileys (Código Aberto)
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Gratuito mas requer conhecimentos técnicos avançados. Risco de bloqueio.
                </p>
                
                <div className="space-y-2 text-sm text-blue-900">
                  <p><strong>Passos:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Instalar biblioteca: <code className="bg-blue-200 px-2 py-0.5 rounded">npm install @whiskeysockets/baileys</code></li>
                    <li>Configurar servidor WebSocket persistente</li>
                    <li>Implementar gestão de sessões e QR Codes reais</li>
                    <li>Lidar com autenticação multi-dispositivo</li>
                  </ol>
                  
                  <div className="mt-3 p-3 bg-amber-100 rounded border border-amber-300">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      ⚠️ Avisos:
                    </p>
                    <ul className="list-disc list-inside ml-2 text-xs">
                      <li>Não é oficial - WhatsApp pode bloquear</li>
                      <li>Requer servidor sempre ativo (não funciona em Serverless)</li>
                      <li>Pode violar Termos de Serviço do WhatsApp</li>
                      <li>Não recomendado para uso comercial</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Opção 3 - Serviços Terceiros */}
              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded">
                <h4 className="font-bold text-purple-900 mb-2">
                  🔌 Opção 3: Serviços de Terceiros
                </h4>
                <p className="text-sm text-purple-800 mb-3">
                  Soluções prontas a usar com suporte técnico. Custo mensal.
                </p>
                
                <div className="space-y-2 text-sm text-purple-900">
                  <p><strong>Exemplos de serviços:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Twilio WhatsApp API</strong> - Muito confiável, integração fácil</li>
                    <li><strong>MessageBird</strong> - Boa API, preços competitivos</li>
                    <li><strong>Vonage (ex-Nexmo)</strong> - Plataforma robusta</li>
                    <li><strong>WATI</strong> - Focado em WhatsApp Business</li>
                  </ul>
                  
                  <div className="mt-3 p-3 bg-purple-100 rounded border border-purple-300">
                    <p className="font-semibold mb-1">💰 Custos típicos:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>€50-200/mês + custos por mensagem</li>
                      <li>Setup e suporte incluídos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modo Atual */}
          <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-2">
                  🧪 Modo Atual: Simulação para Demonstração
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  O QR Code gerado é apenas visual. Para testar o sistema, use o botão 
                  <strong> "Simular Scan do QR Code"</strong> que aparece abaixo do QR.
                </p>
                <p className="text-sm text-blue-800">
                  Isso permite testar todas as funcionalidades de envio de mensagens sem 
                  necessitar de configuração real do WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Recursos Úteis */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">📚 Recursos Úteis:</h4>
            <div className="space-y-2">
              <a 
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                WhatsApp Business Cloud API - Documentação Oficial
              </a>
              <a 
                href="https://github.com/WhiskeySockets/Baileys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Baileys - Biblioteca Open Source
              </a>
              <a 
                href="https://www.twilio.com/whatsapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Twilio WhatsApp API
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
