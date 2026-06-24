import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileText, 
  Shield, 
  Check, 
  AlertTriangle, 
  Info,
  Lock,
  Eye,
  Users,
  Database,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TermsOfUseModalProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  userName?: string;
}

export function TermsOfUseModal({ open, onClose, onAccept, userName }: TermsOfUseModalProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [acceptedSections, setAcceptedSections] = useState<boolean[]>([false, false, false, false]);
  const [finalAccept, setFinalAccept] = useState(false);

  // Não renderiza nada se não estiver aberto
  if (!open) return null;

  const sections = [
    {
      icon: FileText,
      color: 'from-blue-600 to-cyan-600',
      title: 'Termos de Uso',
      description: 'Condições gerais de utilização da plataforma',
      content: [
        'Você está acessando um sistema de geração e qualificação de leads para o mercado imobiliário.',
        'Esta plataforma utiliza Inteligência Artificial para automatizar processos de prospeção.',
        'O uso adequado desta ferramenta é de sua total responsabilidade.',
        'Você concorda em não utilizar o sistema para fins ilícitos ou spam.'
      ]
    },
    {
      icon: Shield,
      color: 'from-purple-600 to-pink-600',
      title: 'Privacidade & RGPD',
      description: 'Proteção de dados pessoais',
      content: [
        'Seus dados pessoais são protegidos conforme RGPD (Regulamento Geral de Proteção de Dados).',
        'Utilizamos APIs de terceiros (LinkedIn, Apollo.io, etc.) que podem estar fora da UE.',
        'Os dados de leads são armazenados com criptografia e controle de acesso.',
        'Você tem direito a acessar, corrigir ou apagar seus dados a qualquer momento.'
      ]
    },
    {
      icon: Lock,
      color: 'from-orange-600 to-red-600',
      title: 'Segurança & Autenticação',
      description: 'Proteção da sua conta',
      content: [
        'Recomendamos fortemente ativar a autenticação de 2 fatores (2FA).',
        'Mantenha suas credenciais de acesso em segurança.',
        'Não compartilhe sua conta com terceiros.',
        'Notifique-nos imediatamente em caso de acesso suspeito.'
      ]
    },
    {
      icon: Database,
      color: 'from-green-600 to-emerald-600',
      title: 'Uso Responsável de Dados',
      description: 'Conformidade com legislação vigente',
      content: [
        'Esta plataforma está em conformidade PARCIAL com RGPD (42% atual).',
        'NÃO utilize comercialmente sem completar 100% de conformidade.',
        'Recomendamos consultar um advogado especializado antes do uso comercial.',
        'Você é responsável por obter consentimento dos leads antes de contactá-los.'
      ]
    }
  ];

  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === sections.length - 1;
  const canProceed = acceptedSections[currentSection];
  const allSectionsAccepted = acceptedSections.every(a => a);

  const handleAcceptSection = () => {
    const newAccepted = [...acceptedSections];
    newAccepted[currentSection] = true;
    setAcceptedSections(newAccepted);
  };

  const handleNext = () => {
    if (isLastSection) {
      // Última secção - mostrar confirmação final
      return;
    }
    setCurrentSection(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleFinalAccept = () => {
    if (finalAccept && allSectionsAccepted) {
      onAccept && onAccept();
    }
  };

  const SectionIcon = currentSectionData.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, type: 'spring' }}
        className="w-full max-w-3xl"
      >
        <Card className="relative overflow-hidden border-2 border-gray-200 shadow-2xl">
          {/* Efeito de grade tecnológica */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Linha de scan */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scan" />

          {/* Header */}
          <div className={`relative bg-gradient-to-r ${currentSectionData.color} p-6 text-white`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <SectionIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl mb-1">{currentSectionData.title}</h2>
                  <p className="text-sm text-white/80">{currentSectionData.description}</p>
                </div>
              </div>
              {userName && (
                <Badge className="bg-white/20 text-white border-white/30">
                  <Users className="w-3 h-3 mr-1" />
                  {userName}
                </Badge>
              )}
            </div>

            {/* Progress bar */}
            <div className="flex gap-2">
              {sections.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx < currentSection
                      ? 'bg-white'
                      : idx === currentSection
                      ? 'bg-white/60'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4 mb-6">
                  {currentSectionData.content.map((text, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentSectionData.color} flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Seção especial de avisos */}
                {currentSection === 3 && (
                  <Alert className="bg-orange-50 border-orange-200 mb-6">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <AlertDescription className="text-sm text-orange-900">
                      <strong>⚠️ IMPORTANTE:</strong> Esta plataforma está em modo de testes.
                      Para uso comercial, é necessário completar os requisitos de conformidade RGPD
                      e consultar assessoria jurídica.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Checkbox de aceite da secção */}
                {!acceptedSections[currentSection] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="flex items-start gap-3 p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50 cursor-pointer hover:bg-purple-50 transition-colors">
                      <Checkbox
                        checked={acceptedSections[currentSection]}
                        onCheckedChange={handleAcceptSection}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Li e concordo com os termos acima
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Ao aceitar, você confirma que entendeu e concorda com estas condições
                        </p>
                      </div>
                    </label>
                  </motion.div>
                )}

                {acceptedSections[currentSection] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 border-2 border-green-200 rounded-lg bg-green-50 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-green-900">
                      Secção aceite com sucesso
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Confirmação final */}
            {isLastSection && allSectionsAccepted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-6 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50"
              >
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Confirmação Final
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Você leu e aceitou todas as 4 secções dos Termos de Uso.
                      Confirme abaixo para prosseguir para o sistema.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 border-2 border-blue-300 rounded-lg bg-white cursor-pointer hover:bg-blue-50 transition-colors">
                  <Checkbox
                    checked={finalAccept}
                    onCheckedChange={(checked) => setFinalAccept(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Confirmo que li, entendi e aceito todos os Termos de Uso
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Esta confirmação é necessária para começar a usar a plataforma
                    </p>
                  </div>
                </label>
              </motion.div>
            )}
          </div>

          {/* Footer com botões */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Recusar
                </Button>
                {currentSection > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                  >
                    Anterior
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {currentSection + 1} de {sections.length}
                </span>
                
                {!isLastSection && (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`gap-2 ${canProceed ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}`}
                  >
                    Próximo
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}

                {isLastSection && allSectionsAccepted && (
                  <Button
                    onClick={handleFinalAccept}
                    disabled={!finalAccept}
                    className={`gap-2 ${finalAccept ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''}`}
                    size="lg"
                  >
                    <Check className="w-4 h-4" />
                    Aceitar e Continuar
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Indicator de progresso */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <motion.div
              className={`h-full bg-gradient-to-r ${currentSectionData.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}