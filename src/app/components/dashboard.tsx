import React, { useState, useEffect } from 'react';
import { AgencyDashboard } from './agency/AgencyDashboard';
import { BiometricsSetup } from './BiometricsSetup';
import { useLanguage } from '../lib/i18n/LanguageContext';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { t } = useLanguage();
  const [clusters, setClusters] = useState([
    {
      id: '1',
      name: t('clusters.investors'),
      color: '#10b981',
      icon: 'TrendingUp',
      leads: 247,
      conversion: 8.4,
      avgScore: 76,
      status: 'active' as const,
      filters: {
        minInvestment: 250000,
        propertyTypes: ['commercial', 'residential'],
        locations: ['Lisboa', 'Porto']
      }
    },
    {
      id: '2',
      name: t('clusters.highEnd'),
      color: '#8b5cf6',
      icon: 'Crown',
      leads: 189,
      conversion: 6.2,
      avgScore: 82,
      status: 'active' as const,
      filters: {
        minBudget: 500000,
        propertyTypes: ['luxury', 'penthouse'],
        locations: ['Cascais', 'Estoril', 'Algarve']
      }
    },
    {
      id: '3',
      name: t('clusters.partnerships'),
      color: '#f59e0b',
      icon: 'Briefcase',
      leads: 156,
      conversion: 12.1,
      avgScore: 71,
      status: 'active' as const,
      filters: {
        companySize: 'enterprise',
        relocationBudget: 100000,
        locations: ['Lisboa', 'Porto', 'Braga']
      }
    },
    {
      id: '4',
      name: t('clusters.firstHome'),
      color: '#06b6d4',
      icon: 'Home',
      leads: 432,
      conversion: 4.8,
      avgScore: 68,
      status: 'active' as const,
      filters: {
        maxBudget: 300000,
        propertyTypes: ['apartment', 'townhouse'],
        firstTimeBuyer: true
      }
    },
    {
      id: '5',
      name: t('clusters.families'),
      color: '#ec4899',
      icon: 'Users',
      leads: 321,
      conversion: 5.6,
      avgScore: 73,
      status: 'active' as const,
      filters: {
        minBedrooms: 3,
        propertyTypes: ['house', 'villa'],
        schoolProximity: true
      }
    }
  ]);

  const [leads, setLeads] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [aiActive, setAiActive] = useState(false);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedClusters = localStorage.getItem('clusters');
    const savedLeads = localStorage.getItem('leads');
    const savedActivities = localStorage.getItem('activities');
    const savedAiActive = localStorage.getItem('aiActive');

    if (savedClusters) {
      try {
        setClusters(JSON.parse(savedClusters));
      } catch (e) {
        console.error('Erro ao carregar clusters:', e);
      }
    }

    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error('Erro ao carregar leads:', e);
      }
    }

    if (savedActivities) {
      try {
        setActivities(JSON.parse(savedActivities));
      } catch (e) {
        console.error('Erro ao carregar atividades:', e);
      }
    }

    if (savedAiActive) {
      setAiActive(savedAiActive === 'true');
    }
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    localStorage.setItem('clusters', JSON.stringify(clusters));
  }, [clusters]);

  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('aiActive', String(aiActive));
  }, [aiActive]);

  const handleToggleAI = () => {
    setAiActive(!aiActive);
  };

  const handleUpdateCluster = (clusterId: string, updates: any) => {
    setClusters(clusters.map(c => 
      c.id === clusterId ? { ...c, ...updates } : c
    ));
  };

  const handleLeadUpdate = (leadId: string, updates: any) => {
    setLeads(leads.map(l => 
      l.id === leadId ? { ...l, ...updates } : l
    ));
  };

  return (
    <>
      <AgencyDashboard
        user={user}
        onLogout={onLogout}
        clusters={clusters}
        leads={leads}
        activities={activities}
        aiActive={aiActive}
        onToggleAI={handleToggleAI}
        onUpdateCluster={handleUpdateCluster}
        onLeadUpdate={handleLeadUpdate}
      />
      
      {/* Sugestão de Biometria (Aparece 1s depois do login) */}
      <BiometricsSetup />
    </>
  );
}