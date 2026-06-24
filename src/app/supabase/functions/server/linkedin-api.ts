/**
 * LinkedIn API Integration via People Data Labs (PDL) + RocketReach
 * ⚠️ Proxycurl foi descontinuado - usando PDL como alternativa
 * API Docs: https://docs.peopledatalabs.com/
 */

import { 
  searchLinkedInPeople, 
  searchLinkedInCompanies, 
  getLinkedInProfile 
} from './pdl-linkedin-api.ts';

// Re-exportar funções do novo módulo PDL
export { searchLinkedInPeople, searchLinkedInCompanies, getLinkedInProfile };