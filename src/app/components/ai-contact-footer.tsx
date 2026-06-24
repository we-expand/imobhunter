import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Zap, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  Brain,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: string;
  color: string;
  gradient: string;
  recommended?: boolean;
}

export function AIContactFooter() {
  const [selectedNeed, setSelectedNeed] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const contactNeeds: ContactOption[] = [
    {
      id: 'demo',
      title: 'Quero uma demonstração',
      description: 'Agende uma call personalizada',
      icon: Calendar,
      action: 'agendar',
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      recommended: true,
    },
    {
      id: 'pricing',
      title: 'Dúvidas sobre preços',
      description: 'Fale connosco via WhatsApp',
      icon: MessageSquare,
      action: 'whatsapp',
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 'technical',
      title: 'Questões técnicas',
      description: 'Email para suporte técnico',
      icon: Mail,
      action: 'email',
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      id: 'urgent',
      title: 'Preciso de ajuda urgente',
      description: 'Ligue-nos agora',
      icon: Phone,
      action: 'call',
      color: 'text-red-600',
      gradient: 'from-red-500 to-orange-600',
    },
  ];

  const handleContactAction = (action: string) => {
    const whatsappNumber = '351965456895'; // 351 é código de Portugal
    const email = 'contacto@kwportugal.pt';
    const phone = '+351 965 456 895';

    switch (action) {
      case 'whatsapp':
        window.open(`https://wa.me/${whatsappNumber}?text=Olá! Tenho interesse no AI LeadGen Pro e gostaria de saber mais sobre preços.`, '_blank');
        toast.success('💬 Redirecionando para WhatsApp...');
        break;
      case 'email':
        window.location.href = `mailto:${email}?subject=Questão Técnica - AI LeadGen Pro`;
        toast.success('📧 Abrindo seu email...');
        break;
      case 'call':
        window.location.href = `tel:${phone}`;
        toast.success('📞 Iniciando chamada...');
        break;
      case 'agendar':
        // Aqui você pode integrar com Calendly ou similar
        window.open('https://calendly.com', '_blank');
        toast.success('📅 Abrindo agendamento...');
        break;
      default:
        break;
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-300 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Seção de Contato Inteligente */}
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
          {/* IA Assistant Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                {/* Pulso AI */}
                <div className="absolute inset-0 rounded-xl animate-ping opacity-20">
                  <div className="w-full h-full border-2 border-blue-400 rounded-xl" />
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  Como posso ajudar?
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    IA
                  </Badge>
                </h3>
                <p className="text-sm text-gray-400">Escolha a opção que melhor se adapta à sua necessidade</p>
              </div>
            </div>
          </div>

          {/* Opções de Contato Inteligentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {contactNeeds.map((need) => {
              const Icon = need.icon;
              return (
                <button
                  key={need.id}
                  onClick={() => {
                    setSelectedNeed(need.id);
                    handleContactAction(need.action);
                  }}
                  className={`relative group p-6 bg-gray-800/50 hover:bg-gray-800 rounded-xl border-2 transition-all ${
                    selectedNeed === need.id 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {need.recommended && (
                    <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                      ⭐ Recomendado
                    </Badge>
                  )}
                  
                  <div className="flex flex-col items-start gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${need.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                        {need.title}
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </h4>
                      <p className="text-sm text-gray-400">{need.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Informações de Contato Direto */}
          <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm mb-12">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Informações de Contato</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Endereço */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Endereço</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Praça Infante Dom Pedro nº 12<br />
                      5º Andar ESQUERDO<br />
                      Algés, Oeiras, Lisboa<br />
                      <span className="text-blue-400">1495-149</span>
                    </p>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Telefone/WhatsApp</h4>
                    <a 
                      href="tel:+351965456895"
                      className="text-sm text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2 mb-2"
                    >
                      <Phone className="w-4 h-4" />
                      +351 965 456 895
                    </a>
                    <Button
                      size="sm"
                      onClick={() => handleContactAction('whatsapp')}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Horário de Atendimento</h4>
                    <p className="text-sm text-gray-400">
                      Segunda a Sexta<br />
                      <span className="text-purple-400">09:00 - 18:00</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      🤖 IA disponível 24/7
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Rápido */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Resposta em até 2 horas</strong> durante o horário comercial
                    </p>
                  </div>
                  <Button
                    onClick={() => handleContactAction('whatsapp')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Falar Agora
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Rodapé Tradicional */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">AI LeadGen Pro</span>
            </div>
            <p className="text-sm mb-6">Lead generation autónomo para o mercado imobiliário</p>
            
            {/* Badges de Conformidade */}
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              <Badge className="bg-green-900/50 text-green-300 border-green-700">
                <Shield className="w-3 h-3 mr-1" />
                GDPR Compliant
              </Badge>
              <Badge className="bg-blue-900/50 text-blue-300 border-blue-700">
                <Shield className="w-3 h-3 mr-1" />
                LGPD Portugal
              </Badge>
              <Badge className="bg-purple-900/50 text-purple-300 border-purple-700">
                🇪🇺 Dados na UE
              </Badge>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-sm">© 2025 AI LeadGen Pro. Todos os direitos reservados.</p>
            <p className="text-xs mt-2 text-gray-500">
              Plataforma desenvolvida em conformidade com GDPR e LGPD
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
