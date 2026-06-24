import { Lead } from '../types';
import { storage } from './storage-service';

/**
 * Serviço de busca automática de leads
 * Simula integração com APIs externas (LinkedIn, Apollo, etc.)
 * LIMITADO A 5 LEADS POR BUSCA para proteger consumo de API
 */

export interface SearchParams {
  keywords?: string;
  location?: string;
  jobTitles?: string[];
  companies?: string[];
  clusters?: string[];
  limit?: number; // Máximo permitido: 5
}

class AutoSearchService {
  private readonly MAX_RESULTS = 5;

  /**
   * Executa busca automática de leads
   * Retorna no máximo 5 resultados
   */
  async searchLeads(params: SearchParams): Promise<Lead[]> {
    // Garante que nunca excede 5 leads
    const limit = Math.min(params.limit || this.MAX_RESULTS, this.MAX_RESULTS);

    // Simula delay de API (1-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Pool de dados para gerar leads realistas
    const names = [
      'Ricardo Alves', 'Sofia Martins', 'Miguel Costa', 'Beatriz Santos', 'André Silva',
      'Catarina Pereira', 'Bruno Ferreira', 'Inês Rodrigues', 'Diogo Oliveira', 'Mariana Lopes',
      'Fernando Santos', 'Joana Correia', 'Tiago Ribeiro', 'Ana Paula Costa', 'Rui Sousa'
    ];

    const companies = [
      'Century 21 Portugal', 'RE/MAX Portugal', 'ERA Imobiliária', 'Keller Williams',
      'Engel & Völkers', 'Sotheby\'s Realty', 'JLL Portugal', 'CBRE', 'Savills',
      'Prime Yield', 'Imovirtual', 'Idealista', 'Casa Sapo', 'Quinta do Lago'
    ];

    const titles = [
      'CEO', 'CFO', 'COO', 'Managing Director', 'Director Comercial',
      'VP Sales', 'Senior Manager', 'Diretor Geral', 'Partner',
      'Head of Operations', 'Investment Director', 'Asset Manager'
    ];

    const locations = [
      'Lisboa, Portugal', 'Porto, Portugal', 'Cascais, Portugal', 
      'Algarve, Portugal', 'Braga, Portugal', 'Coimbra, Portugal'
    ];

    const clusters = params.clusters || [
      'Investidores', 'High-End/Executivos', '1ª Habitação', 
      'Parcerias/Relocation', 'Famílias/Upgrade'
    ];

    // Gera leads simulados
    const leads: Lead[] = [];

    for (let i = 0; i < limit; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const jobTitle = titles[Math.floor(Math.random() * titles.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];

      const lead: Lead = {
        id: `lead-auto-${Date.now()}-${i}`,
        name,
        company,
        jobTitle,
        email: `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(/\s+/g, '')}.pt`,
        phone: `+351 ${900 + Math.floor(Math.random() * 100)} ${100 + Math.floor(Math.random() * 900)} ${100 + Math.floor(Math.random() * 900)}`,
        cluster,
        status: 'cold',
        score: Math.floor(Math.random() * 40) + 30, // Score inicial entre 30-70
        lastContact: new Date().toISOString(),
        channel: 'linkedin',
        profileUrl: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '-')}`,
        location
      };

      leads.push(lead);
    }

    return leads;
  }

  /**
   * Busca automática da IA - sempre retorna exatamente 5 leads
   */
  async aiAutoSearch(cluster?: string): Promise<Lead[]> {
    const params: SearchParams = {
      limit: 5, // FIXO em 5
      clusters: cluster ? [cluster] : undefined
    };

    const results = await this.searchLeads(params);

    // Salva os leads no storage
    results.forEach(lead => {
      storage.addLead(lead);
    });

    return results;
  }

  /**
   * Busca por cluster específico (máx. 5 resultados)
   */
  async searchByCluster(cluster: string): Promise<Lead[]> {
    return this.searchLeads({
      clusters: [cluster],
      limit: 5
    });
  }

  /**
   * Busca por múltiplos critérios (máx. 5 resultados)
   */
  async advancedSearch(params: SearchParams): Promise<Lead[]> {
    // Force o limite máximo de 5
    const limitedParams = {
      ...params,
      limit: Math.min(params.limit || 5, 5)
    };

    return this.searchLeads(limitedParams);
  }

  /**
   * Retorna o limite máximo de resultados
   */
  getMaxResults(): number {
    return this.MAX_RESULTS;
  }
}

// Singleton
export const autoSearchService = new AutoSearchService();
