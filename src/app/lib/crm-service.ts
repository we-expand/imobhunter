import { toast } from 'sonner';
import { Lead } from '../types';

interface CRMConfig {
  platform: string;
  email: string;
  password: string;
  instanceUrl?: string;
  connected: boolean;
}

class CRMService {
  private getActiveCRM(): { platform: string; config: CRMConfig } | null {
    const platforms = ['hubspot', 'salesforce', 'pipedrive'];
    
    for (const platform of platforms) {
      const configStr = localStorage.getItem(`crm-config-${platform}`);
      if (configStr) {
        const config: CRMConfig = JSON.parse(configStr);
        if (config.connected) {
          return { platform, config };
        }
      }
    }
    
    return null;
  }

  async sendLeadToCRM(lead: Lead): Promise<boolean> {
    const activeCRM = this.getActiveCRM();
    
    if (!activeCRM) {
      console.warn('Nenhum CRM conectado');
      toast.error('CRM não conectado', {
        description: 'Configure um CRM nas integrações',
      });
      return false;
    }

    try {
      // Prepara dados do lead para o CRM
      const crmLead = {
        firstName: lead.name.split(' ')[0],
        lastName: lead.name.split(' ').slice(1).join(' '),
        email: lead.email,
        phone: lead.phone,
        linkedinUrl: lead.linkedinUrl,
        company: lead.company,
        jobTitle: lead.jobTitle,
        leadScore: lead.score,
        leadSource: `AI LeadGen - ${lead.cluster}`,
        status: lead.status,
        notes: lead.conversationSummary || `Lead qualificado automaticamente pela IA.\n\nScore: ${lead.score}/100\nCluster: ${lead.cluster}\nCanal: ${lead.channel}`,
        customFields: {
          ai_score: lead.score,
          ai_cluster: lead.cluster,
          ai_channel: lead.channel,
          linkedin_profile: lead.linkedinUrl,
        }
      };

      console.log(`📤 Enviando lead para ${activeCRM.platform}:`, crmLead);

      // Simula envio ao CRM (em produção, chamaria API real do CRM)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Em produção, aqui seria a chamada real:
      // switch (activeCRM.platform) {
      //   case 'hubspot':
      //     await this.sendToHubSpot(crmLead, activeCRM.config);
      //     break;
      //   case 'salesforce':
      //     await this.sendToSalesforce(crmLead, activeCRM.config);
      //     break;
      //   case 'pipedrive':
      //     await this.sendToPipedrive(crmLead, activeCRM.config);
      //     break;
      // }

      // Salva log de envio
      const sentLeads = JSON.parse(localStorage.getItem('crm-sent-leads') || '[]');
      sentLeads.push({
        leadId: lead.id,
        leadName: lead.name,
        crm: activeCRM.platform,
        sentAt: new Date().toISOString(),
        crmData: crmLead,
      });
      localStorage.setItem('crm-sent-leads', JSON.stringify(sentLeads));

      toast.success(`✅ Lead enviado para ${this.getCRMName(activeCRM.platform)}!`, {
        description: `${lead.name} foi adicionado ao CRM`,
        duration: 5000,
      });

      console.log(`✅ Lead ${lead.name} enviado com sucesso para ${activeCRM.platform}`);
      return true;

    } catch (error) {
      console.error('Erro ao enviar lead ao CRM:', error);
      toast.error('Erro ao enviar lead', {
        description: 'Tente novamente ou verifique a conexão do CRM',
      });
      return false;
    }
  }

  private getCRMName(platform: string): string {
    const names: Record<string, string> = {
      hubspot: 'HubSpot',
      salesforce: 'Salesforce',
      pipedrive: 'Pipedrive',
    };
    return names[platform] || platform;
  }

  async sendToHubSpot(lead: any, config: CRMConfig): Promise<void> {
    // Em produção, implementar chamada real à API do HubSpot
    // Endpoint: POST https://api.hubapi.com/crm/v3/objects/contacts
    console.log('Enviando para HubSpot API...', { lead, config });
  }

  async sendToSalesforce(lead: any, config: CRMConfig): Promise<void> {
    // Em produção, implementar chamada real à API do Salesforce
    // Endpoint: POST https://[instance].salesforce.com/services/data/v58.0/sobjects/Lead
    console.log('Enviando para Salesforce API...', { lead, config });
  }

  async sendToPipedrive(lead: any, config: CRMConfig): Promise<void> {
    // Em produção, implementar chamada real à API do Pipedrive
    // Endpoint: POST https://api.pipedrive.com/v1/persons
    console.log('Enviando para Pipedrive API...', { lead, config });
  }

  getConnectedCRMInfo(): { name: string; platform: string; email: string } | null {
    const activeCRM = this.getActiveCRM();
    if (!activeCRM) return null;

    return {
      name: this.getCRMName(activeCRM.platform),
      platform: activeCRM.platform,
      email: activeCRM.config.email,
    };
  }

  getSentLeadsCount(): number {
    const sentLeads = JSON.parse(localStorage.getItem('crm-sent-leads') || '[]');
    return sentLeads.length;
  }

  getLastSyncTime(): string | null {
    const sentLeads = JSON.parse(localStorage.getItem('crm-sent-leads') || '[]');
    if (sentLeads.length === 0) return null;

    const lastSync = sentLeads[sentLeads.length - 1];
    return lastSync.sentAt;
  }
}

export const crmService = new CRMService();
