import { Lead, Activity, LeadStatus } from '../types';
import { storage } from './storage-service';

// Simulador da IA que cria atividades automáticas realistas
class AISimulation {
  private intervalId: number | null = null;
  private isRunning = false;

  // Inicia simulação da IA trabalhando em background
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Simula ações da IA a cada 15-30 segundos
    this.intervalId = window.setInterval(() => {
      this.simulateAIAction();
    }, Math.random() * 15000 + 15000); // Entre 15-30 segundos
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private simulateAIAction() {
    const leads = storage.getLeads();
    if (leads.length === 0) return;

    // Escolhe um lead aleatório que não esteja em handover
    const activeLeads = leads.filter(l => l.status !== 'handover');
    if (activeLeads.length === 0) return;

    const randomLead = activeLeads[Math.floor(Math.random() * activeLeads.length)];
    
    // Diferentes ações baseadas no status do lead
    const actions = this.getActionsForStatus(randomLead.status);
    const action = actions[Math.floor(Math.random() * actions.length)];

    // Cria atividade
    const activity: Activity = {
      id: `activity-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      action: action.description,
      leadName: randomLead.name,
      cluster: randomLead.cluster,
      channel: action.channel,
      status: 'success'
    };

    storage.addActivity(activity);

    // Atualiza lead se necessário
    if (action.statusChange) {
      const updates: Partial<Lead> = {
        status: action.statusChange,
        lastContact: new Date().toISOString()
      };

      // Aumenta score se lead progrediu
      if (action.statusChange === 'in-conversation') {
        updates.score = Math.min(randomLead.score + 10, 75);
      } else if (action.statusChange === 'hot') {
        updates.score = Math.min(randomLead.score + 15, 95);
      }

      storage.updateLead(randomLead.id, updates);
    }
  }

  private getActionsForStatus(status: LeadStatus) {
    const actions = {
      cold: [
        {
          description: 'AI enviou LinkedIn Connection com nota personalizada',
          channel: 'linkedin' as const,
          statusChange: null
        },
        {
          description: 'AI enviou Email de apresentação',
          channel: 'email' as const,
          statusChange: null
        },
        {
          description: 'Lead aceitou conexão LinkedIn',
          channel: 'linkedin' as const,
          statusChange: 'in-conversation' as const
        }
      ],
      'in-conversation': [
        {
          description: 'AI enviou Email de Valor com Guia do Bairro',
          channel: 'email' as const,
          statusChange: null
        },
        {
          description: 'Lead respondeu com interesse',
          channel: 'email' as const,
          statusChange: null
        },
        {
          description: 'AI enviou WhatsApp com Case Study',
          channel: 'whatsapp' as const,
          statusChange: null
        },
        {
          description: 'AI detectou intenção de compra/venda',
          channel: 'whatsapp' as const,
          statusChange: 'hot' as const
        }
      ],
      hot: [
        {
          description: 'Lead solicitou mais informações',
          channel: 'whatsapp' as const,
          statusChange: null
        },
        {
          description: 'AI enviou detalhes de propriedades disponíveis',
          channel: 'email' as const,
          statusChange: null
        },
        {
          description: 'Lead confirmou interesse em visita',
          channel: 'whatsapp' as const,
          statusChange: null
        }
      ],
      handover: []
    };

    return actions[status] || [];
  }

  // Adiciona novo lead simulado (para demonstração)
  addSimulatedLead() {
    const names = [
      'Ricardo Alves', 'Sofia Martins', 'Miguel Costa', 'Beatriz Santos', 'André Silva',
      'Catarina Pereira', 'Bruno Ferreira', 'Inês Rodrigues', 'Diogo Oliveira', 'Mariana Lopes'
    ];
    const companies = [
      'Accenture', 'EY', 'Siemens', 'Farfetch', 'Outsystems',
      'Deloitte', 'PwC', 'Vodafone', 'NOS', 'Galp'
    ];
    const titles = [
      'Senior Manager', 'Director', 'VP Sales', 'CFO', 'Tech Lead',
      'Managing Director', 'COO', 'Head of Operations', 'General Manager', 'Partner'
    ];
    const clusters = ['Investidores', 'High-End/Executivos', '1ª Habitação', 'Parcerias/Relocation', 'Famílias/Upgrade'];

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: names[Math.floor(Math.random() * names.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      jobTitle: titles[Math.floor(Math.random() * titles.length)],
      cluster: clusters[Math.floor(Math.random() * clusters.length)],
      status: 'cold',
      score: Math.floor(Math.random() * 30) + 20,
      lastContact: new Date().toISOString(),
      channel: 'linkedin',
      profileUrl: 'https://linkedin.com/in/example'
    };

    storage.addLead(newLead);

    // Cria atividade de novo lead encontrado
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'AI identificou novo lead no LinkedIn',
      leadName: newLead.name,
      cluster: newLead.cluster,
      channel: 'linkedin',
      status: 'success'
    };

    storage.addActivity(activity);
  }

  // Adiciona múltiplos leads simulados de uma vez (máx. 5 para proteger API)
  addSimulatedLeadBatch(count: number = 5) {
    const maxLeads = Math.min(count, 5); // GARANTE MÁXIMO DE 5 LEADS
    
    for (let i = 0; i < maxLeads; i++) {
      // Pequeno delay entre cada lead para parecer mais natural
      setTimeout(() => {
        this.addSimulatedLead();
      }, i * 500); // 500ms entre cada lead
    }

    return maxLeads;
  }
}

export const aiSimulation = new AISimulation();