import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, UserCheck, FileText, Mail, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';

interface PrivacyPolicyProps {
  onClose?: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  const sections = [
    {
      id: 'introduction',
      title: '1. Introdução',
      icon: FileText,
      content: `A ImobHunter ("nós", "nosso" ou "Empresa") está comprometida em proteger a privacidade e segurança dos dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade com o Regulamento Geral de Proteção de Dados (GDPR) da União Europeia e a Lei Geral de Proteção de Dados (LGPD) do Brasil.

Ao utilizar nossa plataforma, você concorda com as práticas descritas nesta política. Se você não concordar com algum termo, pedimos que não utilize nossos serviços.

Data da última atualização: ${new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}`
    },
    {
      id: 'data-controller',
      title: '2. Responsável pelo Tratamento de Dados',
      icon: UserCheck,
      content: `**ImobHunter - Soluções Tecnológicas para Imobiliário**

**Sede Portugal:**
Parque das Nações, Lisboa, Portugal
NIF: [A ser preenchido]
Email: dpo@imobhunter.com

**Sede Brasil:**
São Paulo, SP, Brasil
CNPJ: [A ser preenchido]
Email: lgpd@imobhunter.com

**Encarregado de Proteção de Dados (DPO):**
Email: dpo@imobhunter.com
Telefone: +351 21 000 0000 (PT) | +55 11 0000-0000 (BR)`
    },
    {
      id: 'data-collected',
      title: '3. Dados Coletados',
      icon: Database,
      content: `Coletamos os seguintes tipos de dados pessoais:

**3.1 Dados de Cadastro:**
• Nome completo
• Email profissional
• Telefone/WhatsApp
• Empresa/Imobiliária
• Cargo/Função
• País e cidade

**3.2 Dados de Autenticação:**
• Senha criptografada (hash irreversível)
• Tokens de sessão
• Logs de acesso (IP, data/hora, dispositivo)
• Dados biométricos (se ativado autenticação biométrica - armazenados localmente no dispositivo)

**3.3 Dados de Uso da Plataforma:**
• Buscas realizadas
• Leads exportados
• Integrações configuradas
• Preferências de sistema
• Métricas de uso anônimas

**3.4 Dados de Pagamento:**
• Informações de faturamento (nome, endereço, NIF/CNPJ/CPF)
• Dados de cartão de crédito (processados exclusivamente por Stripe - PCI DSS Compliant)
• Histórico de transações

**3.5 Dados de Terceiros (Leads):**
Quando você utiliza nossa plataforma para buscar leads em fontes públicas (portais imobiliários, LinkedIn, etc.), coletamos:
• Nome e contatos profissionais
• Cargo e empresa
• Perfis públicos em redes sociais
• Dados de imóveis publicados

⚠️ **IMPORTANTE:** Estes dados são de domínio público e devem ser utilizados exclusivamente para fins comerciais legítimos (B2B). É proibido coletar ou usar dados pessoais sensíveis sem consentimento explícito.`
    },
    {
      id: 'data-usage',
      title: '4. Finalidade do Tratamento',
      icon: Eye,
      content: `Utilizamos seus dados pessoais para:

**4.1 Fornecimento do Serviço:**
• Criar e gerenciar sua conta
• Processar buscas e gerar leads
• Fornecer suporte técnico
• Enviar notificações transacionais (ex: limite de créditos atingido)

**4.2 Cobrança e Faturamento:**
• Processar pagamentos
• Emitir faturas e recibos
• Cumprir obrigações fiscais (DAS, IVA, IRC, etc.)

**4.3 Melhoria da Plataforma:**
• Analisar padrões de uso (dados anonimizados)
• Desenvolver novos recursos
• Corrigir bugs e melhorar performance

**4.4 Comunicação:**
• Enviar atualizações de produto (opt-in)
• Enviar newsletters (com consentimento)
• Responder solicitações de suporte

**4.5 Conformidade Legal:**
• Cumprir obrigações legais e regulatórias
• Responder a solicitações de autoridades competentes
• Prevenir fraudes e abusos

**Base Legal (GDPR/LGPD):**
• Execução de contrato (Art. 6(1)(b) GDPR | Art. 7, V LGPD)
• Cumprimento de obrigação legal (Art. 6(1)(c) GDPR | Art. 7, II LGPD)
• Interesse legítimo (Art. 6(1)(f) GDPR | Art. 7, IX LGPD)
• Consentimento (quando aplicável)`
    },
    {
      id: 'data-sharing',
      title: '5. Compartilhamento de Dados',
      icon: Database,
      content: `Não vendemos seus dados pessoais. Compartilhamos dados apenas nas seguintes situações:

**5.1 Prestadores de Serviço (Subprocessadores):**
• **Stripe** (pagamentos) - PCI DSS Level 1
• **AWS/CloudFlare** (hospedagem e CDN) - ISO 27001
• **Resend** (envio de emails transacionais) - GDPR compliant
• **Apollo.io, People Data Labs** (enriquecimento de dados B2B) - conforme suas políticas
• **Meta (WhatsApp Business API)** - conforme termos da Meta

Todos os subprocessadores assinaram DPAs (Data Processing Agreements) e estão em conformidade com GDPR/LGPD.

**5.2 Obrigações Legais:**
Podemos compartilhar dados se exigido por lei, ordem judicial ou solicitação de autoridade competente.

**5.3 Transferências Internacionais:**
Alguns de nossos prestadores estão localizados fora da UE/Brasil. Nestes casos, garantimos proteção adequada através de:
• Cláusulas Contratuais Padrão da Comissão Europeia (SCC)
• Certificação Privacy Shield (quando aplicável)
• Garantias contratuais equivalentes (LGPD Art. 33)

**5.4 Nunca Compartilhamos:**
• Dados para fins de marketing de terceiros
• Dados para análise de perfil sem consentimento
• Dados sensíveis sem base legal específica`
    },
    {
      id: 'data-security',
      title: '6. Segurança dos Dados',
      icon: Lock,
      content: `Implementamos medidas técnicas e organizacionais rigorosas:

**6.1 Segurança Técnica:**
✅ Criptografia em trânsito (TLS 1.3)
✅ Criptografia em repouso (AES-256)
✅ Senhas com hash bcrypt (salt rounds: 12)
✅ Autenticação de dois fatores (2FA/MFA)
✅ Firewall de aplicação web (WAF)
✅ Monitoramento 24/7 de segurança
✅ Backups automáticos diários (criptografados)
✅ Testes de penetração trimestrais

**6.2 Segurança Organizacional:**
✅ Acesso por privilégio mínimo (least privilege)
✅ Logs de auditoria completos
✅ Treinamento anual de segurança da equipe
✅ Política de resposta a incidentes
✅ NDA (Non-Disclosure Agreements) com todos os colaboradores

**6.3 Certificações e Conformidade:**
• ISO 27001 (em processo de certificação)
• SOC 2 Type II (planejado para 2026)
• GDPR/LGPD compliant
• PCI DSS (via Stripe)

**6.4 Notificação de Violação:**
Em caso de violação de dados, notificaremos:
• Autoridade supervisora em até 72h (GDPR Art. 33)
• Usuários afetados sem demora injustificada (GDPR Art. 34)
• ANPD (Brasil) conforme Art. 48 da LGPD`
    },
    {
      id: 'data-retention',
      title: '7. Retenção de Dados',
      icon: Database,
      content: `Mantemos seus dados pelo período necessário para cumprir as finalidades descritas:

**7.1 Conta Ativa:**
• Dados de cadastro: durante a vigência da conta
• Dados de uso: até 2 anos após a coleta
• Logs de segurança: até 6 meses

**7.2 Após Cancelamento:**
• Dados pessoais: excluídos em até 30 dias (salvo obrigação legal)
• Dados de faturamento: 5 anos (obrigação fiscal - PT/BR)
• Dados anonimizados: podem ser mantidos indefinidamente

**7.3 Dados de Leads (Terceiros):**
• Você é responsável pela gestão dos dados de leads em sua conta
• Recomendamos revisar e atualizar dados regularmente
• Dados obsoletos devem ser excluídos conforme sua política interna

**7.4 Backups:**
• Backups são mantidos por até 90 dias
• Após este período, dados são permanentemente excluídos (sobrescritos)`
    },
    {
      id: 'user-rights',
      title: '8. Seus Direitos (GDPR/LGPD)',
      icon: Shield,
      content: `Você tem os seguintes direitos sobre seus dados pessoais:

**8.1 Direito de Acesso (Art. 15 GDPR | Art. 18, II LGPD):**
Solicite cópia de todos os dados que mantemos sobre você.

**8.2 Direito de Retificação (Art. 16 GDPR | Art. 18, III LGPD):**
Corrija dados incorretos ou incompletos.

**8.3 Direito de Exclusão/"Direito ao Esquecimento" (Art. 17 GDPR | Art. 18, VI LGPD):**
Solicite exclusão de seus dados (salvo obrigações legais).

**8.4 Direito de Portabilidade (Art. 20 GDPR | Art. 18, V LGPD):**
Receba seus dados em formato estruturado (JSON/CSV).

**8.5 Direito de Oposição (Art. 21 GDPR | Art. 18, § 2º LGPD):**
Oponha-se ao tratamento baseado em interesse legítimo.

**8.6 Direito de Restrição (Art. 18 GDPR | Art. 18, IV LGPD):**
Limite o processamento de seus dados em certas situações.

**8.7 Direito de Não Ser Submetido a Decisões Automatizadas (Art. 22 GDPR | Art. 20 LGPD):**
Solicite revisão humana de decisões automatizadas.

**8.8 Direito de Revogar Consentimento:**
Revogue consentimentos a qualquer momento (sem afetar legalidade do processamento anterior).

**Como Exercer Seus Direitos:**
• Email: dpo@imobhunter.com
• Portal: Configurações > Privacidade & Dados
• Prazo de resposta: até 30 dias (prorrogável por mais 30 dias se complexo)

**Reclamações:**
• CNPD (Portugal): www.cnpd.pt
• ANPD (Brasil): www.gov.br/anpd`
    },
    {
      id: 'cookies',
      title: '9. Cookies e Tecnologias Similares',
      icon: Eye,
      content: `Utilizamos cookies e tecnologias similares:

**9.1 Cookies Essenciais (Não requerem consentimento):**
• Sessão de login
• Preferências de idioma
• Tokens CSRF (segurança)

**9.2 Cookies Analíticos (Requerem consentimento):**
• Google Analytics (anonimizado)
• Métricas de performance
• Mapas de calor (anônimos)

**9.3 Cookies de Marketing (Requerem consentimento):**
• Facebook Pixel (se houver campanhas)
• Google Ads Conversion (se houver campanhas)

**Gerenciamento:**
Você pode gerenciar cookies em: Configurações > Cookies & Privacidade
Ou através das configurações do seu navegador.

**Duração:**
• Cookies de sessão: expiram ao fechar o navegador
• Cookies persistentes: até 2 anos (renovados a cada login)`
    },
    {
      id: 'children',
      title: '10. Menores de Idade',
      icon: AlertCircle,
      content: `Nossa plataforma é destinada exclusivamente para uso profissional B2B (Business-to-Business).

**Não coletamos intencionalmente dados de menores de 18 anos.**

Se tomarmos conhecimento de que coletamos dados de menores sem consentimento parental apropriado, tomaremos medidas imediatas para excluir tais informações.

Pais/responsáveis que acreditam que seus filhos forneceram dados devem nos contatar imediatamente: dpo@imobhunter.com`
    },
    {
      id: 'changes',
      title: '11. Alterações nesta Política',
      icon: FileText,
      content: `Podemos atualizar esta Política de Privacidade periodicamente.

**Notificações:**
• Alterações significativas: notificaremos por email e banner na plataforma com 30 dias de antecedência
• Alterações menores: atualizaremos a data no topo desta política

**Histórico de Versões:**
Mantemos histórico de versões anteriores disponível mediante solicitação.

**Seu Direito:**
Se você não concordar com as alterações, poderá cancelar sua conta antes da data de vigência das novas condições.`
    },
    {
      id: 'contact',
      title: '12. Contato',
      icon: Mail,
      content: `Para questões sobre esta Política de Privacidade ou exercício de direitos:

**Encarregado de Proteção de Dados (DPO):**

📧 **Email:** dpo@imobhunter.com
📧 **LGPD (Brasil):** lgpd@imobhunter.com

📞 **Telefone:**
• Portugal: +351 21 000 0000
• Brasil: +55 11 0000-0000

📍 **Endereço Postal:**
**Portugal:** ImobHunter, Parque das Nações, Lisboa, Portugal
**Brasil:** ImobHunter, São Paulo - SP, Brasil

🕐 **Horário de Atendimento:**
Segunda a Sexta: 9h - 18h (GMT/BRT)

**Prazo de Resposta:** Até 30 dias (conforme GDPR Art. 12.3 e LGPD Art. 18, § 3º)

---

**Autoridades Supervisoras:**

🇵🇹 **Portugal - CNPD:**
www.cnpd.pt | geral@cnpd.pt

🇧🇷 **Brasil - ANPD:**
www.gov.br/anpd | atendimento@anpd.gov.br

---

✅ **Estamos comprometidos em proteger sua privacidade e cumprir todas as regulamentações aplicáveis.**`
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-bold">Política de Privacidade</h1>
          </div>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Intro Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Compromisso com sua Privacidade</h2>
              <p className="text-zinc-300 leading-relaxed">
                Na ImobHunter, levamos a proteção de dados a sério. Esta política explica de forma transparente como coletamos, 
                usamos e protegemos suas informações pessoais em total conformidade com GDPR (Europa) e LGPD (Brasil).
              </p>
              <div className="flex gap-3 mt-4">
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-bold text-green-300">
                  ✓ GDPR Compliant
                </span>
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-bold text-blue-300">
                  ✓ LGPD Compliant
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 mb-12"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Índice
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors flex items-center gap-2 py-1"
              >
                <span className="text-indigo-500">→</span>
                {section.title}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="mb-12 scroll-mt-24"
            >
              <div className="bg-zinc-900/40 border border-white/10 rounded-xl p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold flex-1">{section.title}</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.section>
          );
        })}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center"
        >
          <Mail className="w-12 h-12 text-white mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Dúvidas sobre Privacidade?</h3>
          <p className="text-indigo-100 mb-6">
            Nossa equipe de proteção de dados está aqui para ajudar.
          </p>
          <a
            href="mailto:dpo@imobhunter.com"
            className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-zinc-100 transition-colors"
          >
            Contatar DPO
          </a>
        </motion.div>
      </div>
    </div>
  );
}
