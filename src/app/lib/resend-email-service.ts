import { Lead } from '../types';

/**
 * 📧 SERVIÇO DE EMAIL COM RESEND
 * 
 * Integração com Resend API para envio de emails reais
 * Free tier: 3.000 emails/mês
 * 
 * CONFIGURAÇÃO:
 * 1. Crie conta em https://resend.com
 * 2. Gere API Key em https://resend.com/api-keys
 * 3. Adicione domínio verificado (ou use onboarding@resend.dev para testes)
 */

const RESEND_API_KEY = 're_123456789'; // ← SUBSTITUA pela sua API key real
const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'AI LeadGen Pro <noreply@resend.dev>'; // ← Use seu domínio verificado

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class ResendEmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  /**
   * Envia email via Resend API
   */
  private async sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
    try {
      console.log(`📧 Enviando email para ${to}: ${subject}`);

      const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [to],
          subject: subject,
          html: html,
          text: text
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ Email enviado com sucesso! ID: ${data.id}`);
        return true;
      } else {
        console.error(`❌ Erro ao enviar email:`, data);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  /**
   * 🔐 Email de Login Bem-Sucedido
   */
  async sendLoginEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = `✅ Login realizado - AI LeadGen Pro`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .alert { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Login Realizado!</h1>
              <p>Bem-vindo de volta ao AI LeadGen Pro</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <p>Você acabou de fazer login no <strong>AI LeadGen Pro</strong>.</p>
              
              <div class="alert">
                <strong>📅 Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}<br>
                <strong>📧 Email:</strong> ${userEmail}<br>
                <strong>🔒 Autenticação:</strong> 2FA validado ✅
              </div>
              
              <p>Se não foi você, altere sua senha imediatamente e entre em contato conosco.</p>
              
              <a href="${window.location.origin}" class="button">Acessar Plataforma</a>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                <strong>🛡️ Segurança:</strong> Este email é uma notificação automática de segurança. Sempre que você fizer login, você receberá este email.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 AI LeadGen Pro | Sistema autónomo de Lead Generation</p>
              <p>Este é um email automático. Não responda a esta mensagem.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Login realizado com sucesso!

Olá ${userName},

Você acabou de fazer login no AI LeadGen Pro.

Data/Hora: ${new Date().toLocaleString('pt-PT')}
Email: ${userEmail}
Autenticação: 2FA validado ✅

Se não foi você, altere sua senha imediatamente.

© 2024 AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }

  /**
   * 🔐 Email de 2FA Configurado
   */
  async send2FAEnabledEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = `🔒 Autenticação em 2 etapas ativada - AI LeadGen Pro`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: #d4edda; border: 2px solid #28a745; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 2FA Ativado!</h1>
              <p>Sua conta está mais segura agora</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <div class="success-box">
                <h2 style="color: #28a745; margin: 0;">✅ Autenticação em 2 Etapas Configurada!</h2>
                <p style="margin: 10px 0 0 0;">Sua conta agora está protegida por 2FA</p>
              </div>
              
              <p>Você configurou com sucesso a autenticação em duas etapas (2FA) usando o <strong>Google Authenticator</strong>.</p>
              
              <p><strong>O que isso significa?</strong></p>
              <ul>
                <li>🛡️ Camada extra de segurança na sua conta</li>
                <li>🔐 Proteção contra acesso não autorizado</li>
                <li>📱 Código temporal do seu celular</li>
                <li>✅ Conformidade com melhores práticas de segurança</li>
              </ul>
              
              <p><strong>⚠️ IMPORTANTE:</strong> Guarde seu código de recuperação em local seguro. Você precisará dele caso perca acesso ao seu dispositivo.</p>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Se você não ativou o 2FA, entre em contato conosco imediatamente.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 AI LeadGen Pro | Sistema autónomo de Lead Generation</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Autenticação em 2 Etapas Ativada!

Olá ${userName},

Você configurou com sucesso a autenticação em duas etapas (2FA).

Benefícios:
- Camada extra de segurança
- Proteção contra acesso não autorizado
- Código temporal do seu celular

IMPORTANTE: Guarde seu código de recuperação em local seguro.

© 2024 AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }

  /**
   * 🔥 Email de Handover (Lead Qualificado Pronto)
   */
  async sendHandoverEmail(userEmail: string, userName: string, leadName: string, lead: Lead): Promise<boolean> {
    const subject = `🔥 LEAD QUALIFICADO PRONTO: ${leadName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .lead-card { background: white; border: 2px solid #f5576c; border-radius: 10px; padding: 20px; margin: 20px 0; }
            .score-badge { display: inline-block; background: #f5576c; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
            .button { display: inline-block; background: #f5576c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .info-row { margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔥 LEAD QUALIFICADO!</h1>
              <p>Um lead está pronto para você fechar</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <p>🎉 <strong>EXCELENTE NOTÍCIA!</strong> A IA qualificou um novo lead e ele está PRONTO para você assumir:</p>
              
              <div class="lead-card">
                <h2 style="margin-top: 0; color: #f5576c;">👤 ${leadName}</h2>
                
                <div class="info-row">
                  <strong>📧 Email:</strong> ${lead.email || 'Não informado'}
                </div>
                
                <div class="info-row">
                  <strong>📱 Telefone:</strong> ${lead.phone || 'Não informado'}
                </div>
                
                <div class="info-row">
                  <strong>🏢 Empresa:</strong> ${lead.company || 'Não informada'}
                </div>
                
                <div class="info-row">
                  <strong>💼 Cargo:</strong> ${lead.jobTitle || 'Não informado'}
                </div>
                
                <div class="info-row">
                  <strong>🎯 Cluster:</strong> ${lead.cluster || 'Não definido'}
                </div>
                
                <div class="info-row">
                  <strong>📊 Score de Qualidade:</strong> <span class="score-badge">${lead.score}/100</span>
                </div>
                
                <div class="info-row">
                  <strong>📝 Canal de Contato:</strong> ${this.getChannelName(lead.channel)}
                </div>
              </div>
              
              <p><strong>🤖 Histórico da IA:</strong></p>
              <ul>
                <li>✅ Lead prospectado automaticamente</li>
                <li>✅ Qualificado por múltiplos critérios</li>
                <li>✅ Aquecido através de ${this.getChannelName(lead.channel)}</li>
                <li>✅ Demonstrou interesse real</li>
                <li>✅ Pronto para contato humano</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${window.location.origin}" class="button">🚀 ASSUMIR LEAD AGORA</a>
              </div>
              
              <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                <strong>💡 Dica:</strong> Este lead foi aquecido pela IA. Ele já conhece sua empresa e demonstrou interesse. Contate-o nas próximas 24 horas para máxima taxa de conversão!
              </p>
            </div>
            <div class="footer">
              <p>© 2024 AI LeadGen Pro | Sistema autónomo de Lead Generation</p>
              <p>Email automático de notificação de handover</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
🔥 LEAD QUALIFICADO PRONTO!

Olá ${userName},

A IA qualificou um novo lead:

👤 ${leadName}
📧 ${lead.email || 'Não informado'}
📱 ${lead.phone || 'Não informado'}
🏢 ${lead.company || 'Não informada'}
💼 ${lead.jobTitle || 'Não informado'}
🎯 ${lead.cluster || 'Não definido'}
📊 Score: ${lead.score}/100
📝 Canal: ${this.getChannelName(lead.channel)}

Histórico da IA:
✅ Prospectado automaticamente
✅ Qualificado por múltiplos critérios
✅ Aquecido e demonstrou interesse
✅ Pronto para contato humano

💡 Contate nas próximas 24h para máxima conversão!

Acesse: ${window.location.origin}

© 2024 AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }

  /**
   * 🤖 Email de IA Ativada
   */
  async sendAIActivatedEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = `🤖 IA Ativada - Prospecção Automática Iniciada`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤖 IA ATIVADA!</h1>
              <p>Prospecção automática em andamento</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <div class="status-box">
                <h3 style="margin: 0; color: #28a745;">✅ Sistema de IA Ativo</h3>
                <p style="margin: 5px 0 0 0;">A prospecção automática foi iniciada</p>
              </div>
              
              <p><strong>O que está acontecendo agora:</strong></p>
              <ul>
                <li>🔍 Buscando novos leads automaticamente</li>
                <li>🎯 Qualificando leads por cluster</li>
                <li>📧 Enviando mensagens personalizadas</li>
                <li>💬 Aquecendo leads via Email, WhatsApp e SMS</li>
                <li>📊 Monitorando engajamento em tempo real</li>
              </ul>
              
              <p>Você receberá notificações por email sempre que:</p>
              <ul>
                <li>🔥 Um lead for qualificado e estiver pronto</li>
                <li>💬 Um lead responder às mensagens</li>
                <li>📈 Métricas importantes mudarem</li>
                <li>⚠️ Ações importantes precisarem de sua atenção</li>
              </ul>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                A IA trabalha 24/7 para você. Relaxe e aguarde os leads qualificados chegarem! 🚀
              </p>
            </div>
            <div class="footer">
              <p>© 2024 AI LeadGen Pro</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
🤖 IA ATIVADA!

Olá ${userName},

O sistema de IA foi ativado e está trabalhando 24/7:

✅ Buscando novos leads
✅ Qualificando automaticamente
✅ Enviando mensagens personalizadas
✅ Aquecendo via Email, WhatsApp e SMS
✅ Monitorando engajamento

Você receberá notificações quando leads estiverem prontos!

© 2024 AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }

  /**
   * 📊 Email de Relatório Diário
   */
  async sendDailyReportEmail(userEmail: string, userName: string, stats: any): Promise<boolean> {
    const subject = `📊 Relatório Diário - ${new Date().toLocaleDateString('pt-PT')}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e0e0e0; }
            .stat-value { font-size: 32px; font-weight: bold; color: #667eea; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Relatório Diário</h1>
              <p>${new Date().toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <p>Aqui está o resumo das atividades da IA nas últimas 24 horas:</p>
              
              <div class="stat-grid">
                <div class="stat-card">
                  <p style="margin: 0; color: #666;">Novos Leads</p>
                  <div class="stat-value">${stats.newLeads || 0}</div>
                </div>
                <div class="stat-card">
                  <p style="margin: 0; color: #666;">Leads Qualificados</p>
                  <div class="stat-value">${stats.qualifiedLeads || 0}</div>
                </div>
                <div class="stat-card">
                  <p style="margin: 0; color: #666;">Mensagens Enviadas</p>
                  <div class="stat-value">${stats.messagesSent || 0}</div>
                </div>
                <div class="stat-card">
                  <p style="margin: 0; color: #666;">Taxa de Resposta</p>
                  <div class="stat-value">${stats.responseRate || 0}%</div>
                </div>
              </div>
              
              <p><strong>📈 Destaques do Dia:</strong></p>
              <ul>
                <li>✅ ${stats.emailsSent || 0} emails enviados</li>
                <li>📱 ${stats.whatsappSent || 0} mensagens WhatsApp</li>
                <li>💬 ${stats.smsSent || 0} SMS enviados</li>
                <li>🎯 ${stats.handovers || 0} leads prontos para você</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2024 AI LeadGen Pro</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
📊 Relatório Diário

Olá ${userName},

Resumo das últimas 24 horas:

Novos Leads: ${stats.newLeads || 0}
Qualificados: ${stats.qualifiedLeads || 0}
Mensagens: ${stats.messagesSent || 0}
Taxa Resposta: ${stats.responseRate || 0}%

Destaques:
✅ ${stats.emailsSent || 0} emails
📱 ${stats.whatsappSent || 0} WhatsApp
💬 ${stats.smsSent || 0} SMS
🎯 ${stats.handovers || 0} handovers

© 2024 AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }

  /**
   * ⚠️ Email de Alerta (Lead Respondeu)
   */
  async sendLeadResponseAlert(userEmail: string, userName: string, leadName: string, message: string): Promise<boolean> {
    const subject = `💬 RESPOSTA DE LEAD: ${leadName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ffa726 0%, #fb8c00 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; border-left: 4px solid #ffa726; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; background: #ffa726; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 LEAD RESPONDEU!</h1>
              <p>Ação imediata recomendada</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <p>🎉 <strong>${leadName}</strong> acabou de responder a uma das suas mensagens!</p>
              
              <div class="message-box">
                <p style="margin: 0; color: #666; font-size: 12px;">Mensagem recebida:</p>
                <p style="margin: 10px 0 0 0; font-size: 16px;">"${message}"</p>
              </div>
              
              <p><strong>⚡ Ação Recomendada:</strong></p>
              <ul>
                <li>📞 Entre em contato nas próximas 2 horas</li>
                <li>💬 Responda enquanto o interesse está alto</li>
                <li>🎯 Personalize sua abordagem baseado na resposta</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${window.location.origin}" class="button">VER CONVERSA COMPLETA</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 AI LeadGen Pro</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
💬 LEAD RESPONDEU!

Olá ${userName},

${leadName} acabou de responder!

Mensagem: "${message}"

⚡ AÇÃO RECOMENDADA:
- Entre em contato nas próximas 2 horas
- Responda enquanto o interesse está alto

Acesse: ${window.location.origin}

© 2024 AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }

  /**
   * Helper: Nome do canal
   */
  private getChannelName(channel?: string): string {
    const channels: Record<string, string> = {
      'email': '📧 Email',
      'whatsapp': '💚 WhatsApp',
      'sms': '💬 SMS',
      'linkedin': '💼 LinkedIn'
    };
    return channels[channel || ''] || '📝 Não especificado';
  }

  /**
   * ✉️ Email de Verificação de Conta
   */
  async sendVerificationEmail(userEmail: string, userName: string, verificationCode: string): Promise<boolean> {
    const subject = `✉️ Confirme seu email - AI LeadGen Pro`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 3px dashed #667eea; border-radius: 10px; padding: 30px; margin: 25px 0; text-align: center; }
            .code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; }
            .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Confirme seu Email</h1>
              <p>Bem-vindo ao AI LeadGen Pro</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <p>Obrigado por se cadastrar no <strong>AI LeadGen Pro</strong>! 🎉</p>
              
              <p>Para ativar sua conta e começar a gerar leads automaticamente, por favor confirme seu email usando o código abaixo:</p>
              
              <div class="code-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Seu código de verificação:</p>
                <div class="code">${verificationCode}</div>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">Código válido por 15 minutos</p>
              </div>
              
              <div class="alert">
                <p style="margin: 0;"><strong>⏰ Importante:</strong> Este código expira em <strong>15 minutos</strong>. Se você não solicitou este cadastro, ignore este email.</p>
              </div>
              
              <p><strong>O que vem depois?</strong></p>
              <ul>
                <li>✅ Conta verificada e ativada</li>
                <li>🤖 Acesso completo à IA de prospecção</li>
                <li>🎯 60 leads grátis por mês</li>
                <li>📊 Dashboard com analytics em tempo real</li>
                <li>💬 Suporte em português</li>
              </ul>
              
              <p>Estamos animados para ter você conosco! 🚀</p>
              
              <p>Atenciosamente,<br>
              <strong>Equipe AI LeadGen Pro</strong></p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} AI LeadGen Pro. Todos os direitos reservados.</p>
                <p>Este email foi enviado para ${userEmail}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Confirme seu Email - AI LeadGen Pro

Olá ${userName},

Obrigado por se cadastrar no AI LeadGen Pro!

Para ativar sua conta, use o código de verificação abaixo:

CÓDIGO: ${verificationCode}

(Válido por 15 minutos)

Após confirmar, você terá acesso a:
- ✅ IA de prospecção automática
- 🎯 60 leads grátis/mês
- 📊 Analytics em tempo real
- 💬 Suporte em português

Se você não solicitou este cadastro, ignore este email.

© ${new Date().getFullYear()} AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }

  /**
   * 👋 Email de Boas-Vindas (após verificação)
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const subject = `🎉 Bem-vindo ao AI LeadGen Pro!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .welcome-box { background: white; border: 2px solid #38ef7d; border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center; }
            .feature-card { background: white; border-left: 4px solid #38ef7d; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .button { display: inline-block; background: #38ef7d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bem-vindo!</h1>
              <p>Sua conta está ativa e pronta</p>
            </div>
            <div class="content">
              <p>Olá <strong>${userName}</strong>,</p>
              
              <div class="welcome-box">
                <h2 style="color: #38ef7d; margin: 0 0 10px 0;">✅ Conta Verificada com Sucesso!</h2>
                <p style="margin: 0; font-size: 16px;">Você agora tem acesso completo ao AI LeadGen Pro</p>
              </div>
              
              <p>Estamos muito felizes em ter você conosco! 🚀</p>
              
              <p><strong>🎯 Próximos Passos:</strong></p>
              
              <div class="feature-card">
                <strong>1️⃣ Configure seus Clusters de Leads</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Defina os perfis de leads que você quer prospectar (Investidores, High-End, Famílias, etc)</p>
              </div>
              
              <div class="feature-card">
                <strong>2️⃣ Ative a IA de Prospecção</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Deixe a IA buscar e qualificar leads 24/7 no piloto automático</p>
              </div>
              
              <div class="feature-card">
                <strong>3️⃣ Configure Integrações</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Conecte LinkedIn, Apollo.io, WhatsApp Business e mais</p>
              </div>
              
              <div class="feature-card">
                <strong>4️⃣ Monitore o Dashboard</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Acompanhe leads qualificados e métricas em tempo real</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${typeof window !== 'undefined' ? window.location.origin : 'https://aileadgenpro.com'}" class="button">🚀 ACESSAR PLATAFORMA</a>
              </div>
              
              <p><strong>📦 Seu Plano Grátis Inclui:</strong></p>
              <ul>
                <li>✅ 60 leads grátis por mês</li>
                <li>✅ Prospecção automática 24/7</li>
                <li>✅ Multi-canal (Email, WhatsApp, SMS)</li>
                <li>✅ Analytics e relatórios</li>
                <li>✅ Suporte em português</li>
              </ul>
              
              <p style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 5px;">
                <strong>💡 Dica:</strong> Quanto mais específico você configurar seus clusters, melhor a IA vai qualificar leads para você!
              </p>
              
              <p>Se precisar de ajuda, nossa equipe está sempre disponível! 💬</p>
              
              <p>Atenciosamente,<br>
              <strong>Equipe AI LeadGen Pro</strong></p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} AI LeadGen Pro. Todos os direitos reservados.</p>
                <p>Este email foi enviado para ${userEmail}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Bem-vindo ao AI LeadGen Pro!

Olá ${userName},

Sua conta está verificada e ativa! 🎉

Próximos Passos:
1. Configure seus Clusters de Leads
2. Ative a IA de Prospecção
3. Configure Integrações (LinkedIn, Apollo, WhatsApp)
4. Monitore o Dashboard

Seu Plano Grátis Inclui:
✅ 60 leads grátis/mês
✅ Prospecção automática 24/7
✅ Multi-canal (Email, WhatsApp, SMS)
✅ Analytics e relatórios
✅ Suporte em português

Acesse agora: ${typeof window !== 'undefined' ? window.location.origin : 'https://aileadgenpro.com'}

© ${new Date().getFullYear()} AI LeadGen Pro
    `;

    return this.sendEmail(userEmail, subject, html, text);
  }
}

// Singleton
export const resendEmailService = new ResendEmailService(RESEND_API_KEY, FROM_EMAIL);