import { toast } from 'sonner';
import { resendEmailService } from './resend-email-service';
import { Lead } from '../types';
import { projectId, publicAnonKey } from '../utils/supabase/info';

/**
 * 📧 SERVIÇO DE EMAIL UNIFICADO
 * 
 * Usa Resend API via BACKEND para envio de emails reais em TODOS os canais
 * 
 * MULTI-CANAL: Email + WhatsApp + SMS + LinkedIn
 * Cada ação importante envia notificação por email!
 */

// Helper para adicionar notificação ao centro
function addToNotificationCenter(type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) {
  window.dispatchEvent(
    new CustomEvent('new-notification', {
      detail: { type, title, message }
    })
  );
}

class EmailService {
  /**
   * 🔐 Email de Login
   */
  async sendLoginEmail(userEmail: string, userName: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email de login para ${userEmail}...`);
    
    try {
      // Chama o backend para enviar email REAL
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/email/send-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('📧 Email de login enviado!', {
          description: `Confirmação enviada para ${userEmail}`,
          duration: 5000
        });
        addToNotificationCenter('success', 'Email de Login Enviado', `Confirmação enviada para ${userEmail}`);
        return true;
      } else {
        console.error('❌ Erro ao enviar email:', result);
        
        // Verificar se é erro de API key inválida
        if (result.error && result.error.includes('API key')) {
          toast.error('🔑 API Key do Resend Inválida', {
            description: 'Por favor, configure uma API key válida. Acesse https://resend.com/api-keys para gerar uma nova.',
            duration: 10000
          });
        } else if (result.error && result.error.includes('não configurada')) {
          toast.error('⚙️ Resend não configurado', {
            description: 'Configure a RESEND_API_KEY nas variáveis de ambiente.',
            duration: 10000
          });
        } else {
          toast.warning('⚠️ Erro ao enviar email de login', {
            description: result.error || 'Verifique a configuração do Resend',
            duration: 5000
          });
        }
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email de login:', error);
      toast.error('❌ Falha ao enviar email', {
        description: 'Erro na comunicação com servidor de email',
        duration: 5000
      });
      return false;
    }
  }

  /**
   * 🚪 Email de Logout
   */
  async sendLogoutEmail(userEmail: string, userName: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email de logout para ${userEmail}...`);
    
    try {
      // Chama o backend para enviar email REAL
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/email/send-logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('📧 Email de logout enviado!', {
          description: `Confirmação enviada para ${userEmail}`,
          duration: 5000
        });
        addToNotificationCenter('info', 'Email de Logout Enviado', `Confirmação enviada para ${userEmail}`);
        return true;
      } else {
        console.warn('⚠️ Erro ao enviar email de logout:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email de logout:', error);
      return false;
    }
  }

  /**
   * 👋 Email de Boas-Vindas (Welcome)
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email de boas-vindas para ${userEmail}...`);
    
    try {
      // Chama o backend para enviar email REAL
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/email/send-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('📧 Email de boas-vindas enviado!', {
          description: `Bem-vindo ao AI LeadGen Pro, ${userName}!`,
          duration: 5000
        });
        addToNotificationCenter('success', 'Email de Boas-Vindas Enviado', `Bem-vindo ao AI LeadGen Pro, ${userName}!`);
        return true;
      } else {
        console.warn('⚠️ Erro ao enviar email de boas-vindas:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email de boas-vindas:', error);
      return false;
    }
  }

  /**
   * ✉️ Email de Verificação de Conta
   */
  async sendVerificationEmail(userEmail: string, userName: string, verificationCode: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando código de verificação para ${userEmail}...`);
    
    try {
      // Chama o backend para enviar email REAL
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/email/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          code: verificationCode
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('📧 Código de verificação enviado!', {
          description: `Verifique sua caixa de entrada em ${userEmail}`,
          duration: 8000
        });
        addToNotificationCenter('success', 'Código de Verificação Enviado', `Verifique sua caixa de entrada em ${userEmail}`);
        return true;
      } else {
        console.error('❌ Erro ao enviar código de verificação:', result);
        toast.error('❌ Erro ao enviar código de verificação', {
          description: result.error || 'Tente novamente em alguns instantes',
          duration: 5000
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email de verificação:', error);
      toast.error('❌ Falha no envio do email', {
        description: 'Erro na comunicação com servidor de email',
        duration: 5000
      });
      return false;
    }
  }

  /**
   * 🔒 Email de 2FA Configurado
   */
  async send2FAEnabledEmail(userEmail: string, userName: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email de 2FA configurado para ${userEmail}...`);
    
    try {
      const success = await resendEmailService.send2FAEnabledEmail(userEmail, userName);
      
      if (success) {
        toast.success('📧 Email de 2FA enviado!', {
          description: 'Confirmação de segurança enviada',
          duration: 5000
        });
        addToNotificationCenter('success', 'Email de 2FA Enviado', 'Confirmação de segurança enviada');
        return true;
      } else {
        toast.warning('⚠️ Erro ao enviar email de 2FA');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email de 2FA:', error);
      return false;
    }
  }

  /**
   * ✅ Email de QR Validado (mesmo que login, mas com mensagem específica)
   */
  async sendQRValidatedEmail(userEmail: string, userName: string, isFirstTime: boolean): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email de QR validado para ${userEmail}...`);
    
    // Usa o mesmo template de login por enquanto
    return this.sendLoginEmail(userEmail, userName);
  }

  /**
   * 🔥 Email de Handover (Lead Qualificado Pronto)
   * 
   * IMPORTANTE: Este é o email mais crítico!
   * Quando a IA qualifica um lead e está pronto para humano assumir.
   */
  async sendHandoverEmail(userEmail: string, userName: string, leadName: string, lead: Lead): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email de HANDOVER para ${userEmail}...`);
    console.log(`🔥 Lead: ${leadName} | Score: ${lead.score} | Cluster: ${lead.cluster}`);
    
    try {
      const success = await resendEmailService.sendHandoverEmail(userEmail, userName, leadName, lead);
      
      if (success) {
        toast.success('🔥 Email de Handover enviado!', {
          description: `Notificação de ${leadName} enviada para ${userEmail}`,
          duration: 5000
        });
        
        // 📊 Log para analytics
        console.log(`✅ [HANDOVER EMAIL] Enviado com sucesso:`, {
          lead: leadName,
          score: lead.score,
          cluster: lead.cluster,
          channel: lead.channel,
          timestamp: new Date().toISOString()
        });
        
        addToNotificationCenter('success', 'Email de Handover Enviado', `Notificação de ${leadName} enviada para ${userEmail}`);
        return true;
      } else {
        toast.error('❌ Falha ao enviar email de handover', {
          description: 'Lead qualificado mas email não enviado',
          duration: 8000
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email de handover:', error);
      toast.error('❌ Erro crítico no envio de handover', {
        description: 'Entre em contato com suporte',
        duration: 8000
      });
      return false;
    }
  }

  /**
   * 🤖 Email de IA Ativada
   * 
   * Enviado quando usuário ativa o piloto automático
   */
  async sendAIActivatedEmail(userEmail: string, userName: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email de IA ativada para ${userEmail}...`);
    
    try {
      const success = await resendEmailService.sendAIActivatedEmail(userEmail, userName);
      
      if (success) {
        toast.success('🤖 Notificação de IA enviada!', {
          description: 'Confirmação de ativação por email',
          duration: 5000
        });
        addToNotificationCenter('success', 'Email de IA Ativada Enviado', 'Confirmação de ativação por email');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao enviar email de IA ativada:', error);
      return false;
    }
  }

  /**
   * 📊 Email de Relatório Diário
   * 
   * Resumo das atividades da IA nas últimas 24h
   */
  async sendDailyReportEmail(userEmail: string, userName: string, stats: any): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando relatório diário para ${userEmail}...`);
    
    try {
      const success = await resendEmailService.sendDailyReportEmail(userEmail, userName, stats);
      
      if (success) {
        console.log(`✅ Relatório diário enviado para ${userEmail}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao enviar relatório diário:', error);
      return false;
    }
  }

  /**
   * 💬 Email de Alerta: Lead Respondeu
   * 
   * Quando um lead responde a uma mensagem (Email, WhatsApp, SMS)
   */
  async sendLeadResponseAlert(userEmail: string, userName: string, leadName: string, message: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando alerta de resposta de lead para ${userEmail}...`);
    console.log(`💬 Lead: ${leadName} | Mensagem: "${message}"`);
    
    try {
      const success = await resendEmailService.sendLeadResponseAlert(userEmail, userName, leadName, message);
      
      if (success) {
        toast.success('💬 Alerta de resposta enviado!', {
          description: `${leadName} respondeu! Verifique seu email`,
          duration: 8000
        });
        addToNotificationCenter('success', 'Alerta de Resposta Enviado', `${leadName} respondeu! Verifique seu email`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao enviar alerta de resposta:', error);
      return false;
    }
  }

  /**
   * 📧 Email Genérico (para ações customizadas)
   */
  async sendCustomEmail(userEmail: string, userName: string, subject: string, message: string): Promise<boolean> {
    console.log(`📧 [EMAIL SERVICE] Enviando email customizado para ${userEmail}...`);
    
    // Por enquanto, retorna falso pois não temos template genérico
    // Você pode criar um método no resend-email-service.ts se precisar
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    return false;
  }

  /**
   * 🔔 MULTI-CANAL: Notifica em TODOS os canais
   * 
   * Quando algo importante acontece, notifica por:
   * - Email ✅
   * - Notificação no sistema (toast) ✅
   * - WhatsApp (futuro)
   * - SMS (futuro)
   */
  async notifyMultiChannel(userEmail: string, userName: string, notification: {
    type: 'handover' | 'lead_response' | 'ai_activated' | 'daily_report';
    data: any;
  }): Promise<boolean> {
    console.log(`🔔 [MULTI-CANAL] Notificando ${userName} sobre: ${notification.type}`);
    
    let emailSent = false;
    
    switch (notification.type) {
      case 'handover':
        emailSent = await this.sendHandoverEmail(
          userEmail,
          userName,
          notification.data.leadName,
          notification.data.lead
        );
        break;
        
      case 'lead_response':
        emailSent = await this.sendLeadResponseAlert(
          userEmail,
          userName,
          notification.data.leadName,
          notification.data.message
        );
        break;
        
      case 'ai_activated':
        emailSent = await this.sendAIActivatedEmail(userEmail, userName);
        break;
        
      case 'daily_report':
        emailSent = await this.sendDailyReportEmail(userEmail, userName, notification.data.stats);
        break;
    }
    
    // Futuro: Adicionar WhatsApp, SMS, etc
    console.log(`✅ [MULTI-CANAL] Email: ${emailSent ? 'Enviado' : 'Falhou'}`);
    
    return emailSent;
  }

  /**
   * 🧪 Teste: Envia email de teste
   */
  async sendTestEmail(userEmail: string, userName: string): Promise<boolean> {
    console.log(`📧 [TEST] Enviando email de teste para ${userEmail}...`);
    
    toast.info('📧 Enviando email de teste...', {
      description: 'Aguarde...',
      duration: 3000
    });
    
    const success = await this.sendLoginEmail(userEmail, userName);
    
    if (success) {
      toast.success('✅ Email de teste enviado com sucesso!', {
        description: `Verifique ${userEmail}`,
        duration: 8000
      });
    } else {
      toast.error('❌ Falha no envio do email de teste', {
        description: 'Verifique a configuração do Resend',
        duration: 8000
      });
    }
    
    return success;
  }

  /**
   * 📋 Instruções de Configuração
   */
  showConfigInstructions() {
    console.group('📧 CONFIGURAR RESEND - ENVIO DE EMAILS REAIS');
    console.log('');
    console.log('🚀 RESEND - API Moderna de Email');
    console.log('');
    console.log('1️⃣ Criar conta grátis: https://resend.com');
    console.log('   • Free tier: 3.000 emails/mês');
    console.log('   • Excelente deliverability');
    console.log('   • Templates HTML profissionais');
    console.log('');
    console.log('2️⃣ Gerar API Key:');
    console.log('   • Dashboard → API Keys → Create API Key');
    console.log('   • Copie a chave (começa com "re_")');
    console.log('');
    console.log('3️⃣ Adicionar domínio (opcional):');
    console.log('   • Dashboard → Domains → Add Domain');
    console.log('   • Configure DNS records (MX, DKIM, etc)');
    console.log('   • Ou use "onboarding@resend.dev" para testes');
    console.log('');
    console.log('4️⃣ Configurar no código:');
    console.log('   • Abra: /lib/resend-email-service.ts');
    console.log('   • Linha 17: RESEND_API_KEY = "sua_api_key_aqui"');
    console.log('   • Linha 18: FROM_EMAIL = "seu_email@dominio.com"');
    console.log('');
    console.log('✅ PRONTO! Emails serão enviados automaticamente em todas as ações:');
    console.log('   📧 Login');
    console.log('   🔒 2FA configurado');
    console.log('   🔥 Lead qualificado (Handover)');
    console.log('   🤖 IA ativada');
    console.log('   💬 Lead respondeu');
    console.log('   📊 Relatório diário');
    console.log('');
    console.groupEnd();
  }
}

// Singleton
export const emailService = new EmailService();