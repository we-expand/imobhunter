import { Lead, Activity, ClusterConfig } from '../types';

// Dados zerados para testes finais
export const mockLeads: Lead[] = [];

export const mockActivities: Activity[] = [];

// Clusters iniciais (não podem ser zerados)
export const mockClusters: ClusterConfig[] = [
  {
    id: 'investidores',
    name: 'Investidores',
    description: 'Golden Visa, investidores imobiliários, buy-to-let',
    color: '#10B981',
    icon: 'TrendingUp',
    active: true,
    filters: {
      jobTitles: ['CEO', 'CFO', 'Investor', 'Founder'],
      industries: ['Finance', 'Investment', 'Venture Capital'],
      minConnections: 500
    },
    aiPersonality: {
      tone: 'profissional e direto',
      approach: 'ROI-focused, números concretos',
      keyPoints: ['Golden Visa', 'Rentabilidade', 'Valorização']
    },
    cadence: {
      email: { day1: true, day3: true, day7: true },
      sms: { day2: true, day5: true },
      whatsapp: { day4: true, day8: true }
    }
  },
  {
    id: 'high-end',
    name: 'High-End/Executivos',
    description: 'C-Level, executivos, alto padrão',
    color: '#8B5CF6',
    icon: 'Star',
    active: true,
    filters: {
      jobTitles: ['CEO', 'CTO', 'Director', 'VP'],
      industries: ['Technology', 'Finance', 'Consulting'],
      minConnections: 1000
    },
    aiPersonality: {
      tone: 'sofisticado e consultivo',
      approach: 'Lifestyle-focused, exclusividade',
      keyPoints: ['Luxo', 'Exclusividade', 'Localização premium']
    },
    cadence: {
      email: { day1: true, day4: true },
      sms: { day2: true },
      whatsapp: { day3: true, day7: true }
    }
  },
  {
    id: 'parcerias',
    name: 'Parcerias/Relocation',
    description: 'RH, relocation managers, partnerships',
    color: '#3B82F6',
    icon: 'Handshake',
    active: true,
    filters: {
      jobTitles: ['HR Manager', 'Relocation', 'Partnership'],
      industries: ['Human Resources', 'Consulting'],
      minConnections: 300
    },
    aiPersonality: {
      tone: 'colaborativo e orientado a soluções',
      approach: 'B2B partnership, volume',
      keyPoints: ['Parcerias', 'Volume', 'Processo simplificado']
    },
    cadence: {
      email: { day1: true, day3: true, day7: true },
      sms: { day5: true },
      whatsapp: { day2: true }
    }
  },
  {
    id: 'primeira-habitacao',
    name: '1ª Habitação',
    description: 'Jovens casais, primeira compra',
    color: '#F59E0B',
    icon: 'Home',
    active: true,
    filters: {
      jobTitles: ['Manager', 'Engineer', 'Analyst'],
      industries: ['Technology', 'Finance'],
      ageRange: '25-35'
    },
    aiPersonality: {
      tone: 'acolhedor e educativo',
      approach: 'Suporte na jornada, simplicidade',
      keyPoints: ['Financiamento', 'Localização', 'Espaços modernos']
    },
    cadence: {
      email: { day1: true, day4: true },
      sms: { day3: true },
      whatsapp: { day2: true, day6: true }
    }
  },
  {
    id: 'familias',
    name: 'Famílias/Upgrade',
    description: 'Famílias crescendo, upgrade de imóvel',
    color: '#EC4899',
    icon: 'Users',
    active: true,
    filters: {
      jobTitles: ['Senior Manager', 'Director'],
      industries: ['All'],
      ageRange: '35-50'
    },
    aiPersonality: {
      tone: 'empático e orientado à família',
      approach: 'Qualidade de vida, escolas, espaços',
      keyPoints: ['Espaço', 'Escolas próximas', 'Segurança']
    },
    cadence: {
      email: { day1: true, day5: true },
      sms: { day3: true },
      whatsapp: { day2: true, day7: true }
    }
  }
];