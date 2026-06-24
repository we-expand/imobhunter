// 🛠️ FUNÇÕES AUXILIARES PARA PROCESSAMENTO DE LEADS
// Extraídas do search-routes.ts para reduzir tamanho do arquivo

/**
 * Detecta o nível de senioridade baseado no título/headline
 */
export function detectSeniority(headline: string): string {
  const seniorityKeywords = ['Senior', 'Lead', 'Manager', 'Director', 'VP', 'CEO', 'CTO', 'CFO'];
  
  for (const keyword of seniorityKeywords) {
    if (headline.includes(keyword)) {
      return keyword;
    }
  }
  
  return 'N/A';
}

/**
 * Calcula anos de experiência baseado em lista de experiências
 */
export function calculateExperience(experiences: any[]): number {
  let totalYears = 0;
  
  for (const exp of experiences) {
    if (exp.starts_at && exp.ends_at) {
      try {
        const startDate = new Date(exp.starts_at);
        const endDate = new Date(exp.ends_at);
        const years = (endDate.getFullYear() - startDate.getFullYear()) + (endDate.getMonth() - startDate.getMonth() > 0 ? 1 : 0);
        totalYears += years;
      } catch (error) {
        console.warn('Erro ao calcular experiência:', error);
      }
    }
  }
  
  return totalYears;
}

/**
 * Calcula match score baseado em múltiplos critérios
 */
export function calculateMatchScore(
  lead: any,
  searchCriteria: {
    fullName?: string;
    currentTitle?: string;
    currentCompany?: string;
    city?: string;
    country?: string[];
    industry?: string[];
    seniority?: string[];
  }
): number {
  let score = 0;
  
  // Nome exato = +50 pontos
  if (searchCriteria.fullName && lead.name?.toLowerCase().includes(searchCriteria.fullName.toLowerCase())) {
    score += 50;
  }
  
  // Cargo exato = +25 pontos
  if (searchCriteria.currentTitle && lead.title?.toLowerCase().includes(searchCriteria.currentTitle.toLowerCase())) {
    score += 25;
  }
  
  // Empresa exata = +15 pontos
  if (searchCriteria.currentCompany && lead.company?.toLowerCase().includes(searchCriteria.currentCompany.toLowerCase())) {
    score += 15;
  }
  
  // Localização = +5 pontos
  if (searchCriteria.city && lead.location?.toLowerCase().includes(searchCriteria.city.toLowerCase())) {
    score += 5;
  }
  
  // Email válido = +3 pontos
  if (lead.email && lead.email.includes('@') && !lead.email.includes('N/A')) {
    score += 3;
  }
  
  // Telefone válido = +2 pontos
  if (lead.phone && lead.phone.length > 5 && !lead.phone.includes('N/A')) {
    score += 2;
  }
  
  return Math.min(100, score);
}

console.log('✅ lead-helpers.ts carregado com sucesso!');
