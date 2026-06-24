/**
 * 🔍 BUSCA INTELIGENTE SIMPLIFICADA
 */

import { leadsDB } from "./leads-database.ts";

export async function intelligentSearch(params: {
  query?: string;
  filters?: Record<string, any>;
  limit?: number;
}): Promise<any[]> {
  const { query, filters, limit = 25 } = params;

  let results = await leadsDB.getAllLeads();

  if (query) {
    results = await leadsDB.searchLeads({ company: query });
  }

  if (filters) {
    if (filters.status) {
      results = results.filter(lead => lead.status === filters.status);
    }
    if (filters.minScore) {
      results = results.filter(lead => (lead.confidence_score || 0) >= filters.minScore);
    }
    if (filters.source) {
      results = results.filter(lead => lead.sources.some(s => s.api === filters.source));
    }
  }

  return results.slice(0, limit);
}
