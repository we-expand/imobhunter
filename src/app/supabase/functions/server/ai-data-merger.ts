/**
 * AI Data Merger - Confronta dados do LinkedIn e Apollo
 * Usa algoritmos de confiabilidade para escolher os dados mais assertivos
 */

interface DataSource {
  source: 'linkedin' | 'apollo';
  [key: string]: any;
}

interface MergedData {
  id: string;
  type: 'person' | 'company';
  confidence: number;
  sources: ('linkedin' | 'apollo')[];
  dataQuality: {
    completeness: number;
    accuracy: number;
    freshness: number;
  };
  conflictResolutions?: {
    field: string;
    linkedinValue: any;
    apolloValue: any;
    chosenValue: any;
    reason: string;
  }[];
  [key: string]: any;
}

/**
 * Calcula score de confiabilidade para um campo específico
 */
function calculateFieldConfidence(value: any, source: 'linkedin' | 'apollo', fieldName: string): number {
  let confidence = 0.5; // Base confidence

  // Boost LinkedIn for profile data
  if (source === 'linkedin') {
    if (['name', 'title', 'company', 'experience', 'education', 'skills'].includes(fieldName)) {
      confidence += 0.2;
    }
  }

  // Boost Apollo for contact data
  if (source === 'apollo') {
    if (['email', 'phone', 'companyDomain'].includes(fieldName)) {
      confidence += 0.25;
    }
  }

  // Check value quality
  if (!value || value === '' || value === null || value === undefined) {
    return 0;
  }

  // String length indicates more detail
  if (typeof value === 'string') {
    if (value.length > 50) confidence += 0.1;
    if (value.length > 100) confidence += 0.1;
  }

  // Array length
  if (Array.isArray(value)) {
    if (value.length > 0) confidence += 0.1;
    if (value.length > 3) confidence += 0.1;
  }

  // Email validation
  if (fieldName === 'email' && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      confidence += 0.15;
    }
  }

  // Phone validation
  if (fieldName === 'phone' && typeof value === 'string') {
    const phoneRegex = /[\d\s\-\+\(\)]{10,}/;
    if (phoneRegex.test(value)) {
      confidence += 0.15;
    }
  }

  return Math.min(confidence, 1.0);
}

/**
 * Resolve conflitos entre dados do LinkedIn e Apollo
 */
function resolveConflict(
  fieldName: string,
  linkedinValue: any,
  apolloValue: any
): { chosenValue: any; reason: string } {
  
  // Se um dos valores está vazio, escolhe o outro
  if (!linkedinValue && apolloValue) {
    return { chosenValue: apolloValue, reason: 'LinkedIn não tinha este dado' };
  }
  if (linkedinValue && !apolloValue) {
    return { chosenValue: linkedinValue, reason: 'Apollo não tinha este dado' };
  }
  if (!linkedinValue && !apolloValue) {
    return { chosenValue: null, reason: 'Nenhuma fonte tinha este dado' };
  }

  // Calcular confiança de cada valor
  const linkedinConfidence = calculateFieldConfidence(linkedinValue, 'linkedin', fieldName);
  const apolloConfidence = calculateFieldConfidence(apolloValue, 'apollo', fieldName);

  console.log(`  🤖 Resolvendo conflito em "${fieldName}":`, {
    linkedin: { value: linkedinValue, confidence: linkedinConfidence },
    apollo: { value: apolloValue, confidence: apolloConfidence }
  });

  // Se valores são iguais (ou muito similares), não há conflito
  if (linkedinValue === apolloValue) {
    return { chosenValue: linkedinValue, reason: 'Valores idênticos em ambas as fontes' };
  }

  // Para strings, verificar similaridade
  if (typeof linkedinValue === 'string' && typeof apolloValue === 'string') {
    const similarity = stringSimilarity(linkedinValue.toLowerCase(), apolloValue.toLowerCase());
    if (similarity > 0.8) {
      // Escolher o mais completo
      const chosen = linkedinValue.length > apolloValue.length ? linkedinValue : apolloValue;
      return { 
        chosenValue: chosen, 
        reason: `Valores similares (${Math.round(similarity * 100)}%), escolhido o mais completo` 
      };
    }
  }

  // Escolher baseado em confiança
  if (linkedinConfidence > apolloConfidence) {
    return { 
      chosenValue: linkedinValue, 
      reason: `LinkedIn mais confiável (${Math.round(linkedinConfidence * 100)}% vs ${Math.round(apolloConfidence * 100)}%)` 
    };
  } else if (apolloConfidence > linkedinConfidence) {
    return { 
      chosenValue: apolloValue, 
      reason: `Apollo mais confiável (${Math.round(apolloConfidence * 100)}% vs ${Math.round(linkedinConfidence * 100)}%)` 
    };
  }

  // Empate - preferir LinkedIn para perfil, Apollo para contato
  if (['email', 'phone'].includes(fieldName)) {
    return { chosenValue: apolloValue, reason: 'Apollo especializado em dados de contato' };
  } else {
    return { chosenValue: linkedinValue, reason: 'LinkedIn especializado em dados de perfil' };
  }
}

/**
 * Calcula similaridade entre duas strings (Levenshtein simplificado)
 */
function stringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calcula completude dos dados (% de campos preenchidos)
 */
function calculateCompleteness(data: any, requiredFields: string[]): number {
  let filledFields = 0;
  
  for (const field of requiredFields) {
    const value = data[field];
    if (value && value !== '' && value !== null && value !== undefined) {
      if (Array.isArray(value) && value.length > 0) {
        filledFields++;
      } else if (!Array.isArray(value)) {
        filledFields++;
      }
    }
  }
  
  return filledFields / requiredFields.length;
}

/**
 * Merge dados de pessoa (LinkedIn + Apollo)
 */
export function mergePeopleData(linkedinData: DataSource[], apolloData: DataSource[]): MergedData[] {
  console.log('🤖 AI Merger - Mesclando dados de pessoas...', {
    linkedin: linkedinData.length,
    apollo: apolloData.length
  });

  const merged: MergedData[] = [];
  const processedApollo = new Set<number>();

  // Campos importantes para pessoas
  const personFields = [
    'name', 'title', 'company', 'location', 'email', 'phone',
    'linkedinUrl', 'summary', 'skills', 'experience', 'education'
  ];

  // Processar dados do LinkedIn
  for (const linkedinPerson of linkedinData) {
    let bestMatch: { data: DataSource; score: number; index: number } | null = null;

    // Buscar match no Apollo
    apolloData.forEach((apolloPerson, idx) => {
      if (processedApollo.has(idx)) return;

      let matchScore = 0;

      // Name match
      if (linkedinPerson.name && apolloPerson.name) {
        const nameSimilarity = stringSimilarity(
          linkedinPerson.name.toLowerCase(),
          apolloPerson.name.toLowerCase()
        );
        matchScore += nameSimilarity * 0.4;
      }

      // Company match
      if (linkedinPerson.company && apolloPerson.company) {
        const companySimilarity = stringSimilarity(
          linkedinPerson.company.toLowerCase(),
          apolloPerson.company.toLowerCase()
        );
        matchScore += companySimilarity * 0.3;
      }

      // Location match
      if (linkedinPerson.location && apolloPerson.location) {
        if (linkedinPerson.location.toLowerCase().includes(apolloPerson.location.toLowerCase()) ||
            apolloPerson.location.toLowerCase().includes(linkedinPerson.location.toLowerCase())) {
          matchScore += 0.2;
        }
      }

      // LinkedIn URL match (strongest signal)
      if (linkedinPerson.linkedinUrl && apolloPerson.linkedinUrl) {
        if (linkedinPerson.linkedinUrl === apolloPerson.linkedinUrl) {
          matchScore += 0.5;
        }
      }

      if (matchScore > 0.6 && (!bestMatch || matchScore > bestMatch.score)) {
        bestMatch = { data: apolloPerson, score: matchScore, index: idx };
      }
    });

    // Mesclar dados
    const mergedPerson: any = {
      id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'person' as const,
      sources: ['linkedin'] as ('linkedin' | 'apollo')[],
      conflictResolutions: []
    };

    if (bestMatch) {
      console.log(`  ✅ Match encontrado: ${linkedinPerson.name} (${Math.round(bestMatch.score * 100)}% confiança)`);
      mergedPerson.sources.push('apollo');
      processedApollo.add(bestMatch.index);

      // Resolver conflitos campo por campo
      for (const field of personFields) {
        const linkedinValue = linkedinPerson[field];
        const apolloValue = bestMatch.data[field];

        if (linkedinValue !== apolloValue) {
          const resolution = resolveConflict(field, linkedinValue, apolloValue);
          mergedPerson[field] = resolution.chosenValue;
          
          if (linkedinValue && apolloValue && linkedinValue !== apolloValue) {
            mergedPerson.conflictResolutions.push({
              field,
              linkedinValue,
              apolloValue,
              chosenValue: resolution.chosenValue,
              reason: resolution.reason
            });
          }
        } else {
          mergedPerson[field] = linkedinValue || apolloValue;
        }
      }

      // Campos únicos do Apollo
      if (bestMatch.data.emailConfidence) {
        mergedPerson.emailConfidence = bestMatch.data.emailConfidence;
      }
      if (bestMatch.data.phoneStatus) {
        mergedPerson.phoneStatus = bestMatch.data.phoneStatus;
      }

    } else {
      // Sem match - usar apenas dados do LinkedIn
      console.log(`  ⚠️ Sem match Apollo para: ${linkedinPerson.name}`);
      for (const field of personFields) {
        mergedPerson[field] = linkedinPerson[field];
      }
    }

    // Calcular métricas de qualidade
    const completeness = calculateCompleteness(mergedPerson, personFields);
    const accuracy = mergedPerson.sources.length > 1 ? 0.95 : 0.75; // Maior acurácia com múltiplas fontes
    const freshness = 0.85; // Assumir dados relativamente recentes

    mergedPerson.confidence = (completeness * 0.4) + (accuracy * 0.4) + (freshness * 0.2);
    mergedPerson.dataQuality = { completeness, accuracy, freshness };

    // Foto
    mergedPerson.photoUrl = linkedinPerson.photoUrl || (bestMatch?.data.photoUrl);

    merged.push(mergedPerson);
  }

  // Adicionar dados do Apollo que não tiveram match
  apolloData.forEach((apolloPerson, idx) => {
    if (!processedApollo.has(idx)) {
      console.log(`  ⚠️ Sem match LinkedIn para: ${apolloPerson.name}`);
      
      const mergedPerson: any = {
        id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'person' as const,
        sources: ['apollo'] as ('linkedin' | 'apollo')[],
        conflictResolutions: []
      };

      for (const field of personFields) {
        mergedPerson[field] = apolloPerson[field];
      }

      const completeness = calculateCompleteness(mergedPerson, personFields);
      mergedPerson.confidence = completeness * 0.75; // Reduzido por ter apenas uma fonte
      mergedPerson.dataQuality = {
        completeness,
        accuracy: 0.70,
        freshness: 0.85
      };

      mergedPerson.photoUrl = apolloPerson.photoUrl;

      merged.push(mergedPerson);
    }
  });

  console.log(`✅ AI Merger - ${merged.length} pessoas mescladas`);
  return merged;
}

/**
 * Merge dados de empresa (LinkedIn + Apollo)
 */
export function mergeCompaniesData(linkedinData: DataSource[], apolloData: DataSource[]): MergedData[] {
  console.log('🤖 AI Merger - Mesclando dados de empresas...', {
    linkedin: linkedinData.length,
    apollo: apolloData.length
  });

  const merged: MergedData[] = [];
  const processedApollo = new Set<number>();

  const companyFields = [
    'companyName', 'domain', 'industry', 'size', 'employeeCount',
    'description', 'headquarters', 'website', 'founded', 'revenue', 'technologies'
  ];

  for (const linkedinCompany of linkedinData) {
    let bestMatch: { data: DataSource; score: number; index: number } | null = null;

    apolloData.forEach((apolloCompany, idx) => {
      if (processedApollo.has(idx)) return;

      let matchScore = 0;

      // Domain match (strongest)
      if (linkedinCompany.domain && apolloCompany.domain) {
        if (linkedinCompany.domain.toLowerCase() === apolloCompany.domain.toLowerCase()) {
          matchScore += 0.6;
        }
      }

      // Name match
      if (linkedinCompany.companyName && apolloCompany.companyName) {
        const nameSimilarity = stringSimilarity(
          linkedinCompany.companyName.toLowerCase(),
          apolloCompany.companyName.toLowerCase()
        );
        matchScore += nameSimilarity * 0.4;
      }

      if (matchScore > 0.7 && (!bestMatch || matchScore > bestMatch.score)) {
        bestMatch = { data: apolloCompany, score: matchScore, index: idx };
      }
    });

    const mergedCompany: any = {
      id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'company' as const,
      sources: ['linkedin'] as ('linkedin' | 'apollo')[],
      conflictResolutions: []
    };

    if (bestMatch) {
      console.log(`  ✅ Match encontrado: ${linkedinCompany.companyName} (${Math.round(bestMatch.score * 100)}%)`);
      mergedCompany.sources.push('apollo');
      processedApollo.add(bestMatch.index);

      for (const field of companyFields) {
        const linkedinValue = linkedinCompany[field];
        const apolloValue = bestMatch.data[field];

        if (linkedinValue !== apolloValue) {
          const resolution = resolveConflict(field, linkedinValue, apolloValue);
          mergedCompany[field] = resolution.chosenValue;
          
          if (linkedinValue && apolloValue && linkedinValue !== apolloValue) {
            mergedCompany.conflictResolutions.push({
              field,
              linkedinValue,
              apolloValue,
              chosenValue: resolution.chosenValue,
              reason: resolution.reason
            });
          }
        } else {
          mergedCompany[field] = linkedinValue || apolloValue;
        }
      }
    } else {
      console.log(`  ⚠️ Sem match Apollo para: ${linkedinCompany.companyName}`);
      for (const field of companyFields) {
        mergedCompany[field] = linkedinCompany[field];
      }
    }

    const completeness = calculateCompleteness(mergedCompany, companyFields);
    const accuracy = mergedCompany.sources.length > 1 ? 0.95 : 0.75;
    const freshness = 0.80;

    mergedCompany.confidence = (completeness * 0.4) + (accuracy * 0.4) + (freshness * 0.2);
    mergedCompany.dataQuality = { completeness, accuracy, freshness };

    merged.push(mergedCompany);
  }

  // Apollo sem match
  apolloData.forEach((apolloCompany, idx) => {
    if (!processedApollo.has(idx)) {
      const mergedCompany: any = {
        id: `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'company' as const,
        sources: ['apollo'] as ('linkedin' | 'apollo')[],
        conflictResolutions: []
      };

      for (const field of companyFields) {
        mergedCompany[field] = apolloCompany[field];
      }

      const completeness = calculateCompleteness(mergedCompany, companyFields);
      mergedCompany.confidence = completeness * 0.70;
      mergedCompany.dataQuality = {
        completeness,
        accuracy: 0.70,
        freshness: 0.80
      };

      merged.push(mergedCompany);
    }
  });

  console.log(`✅ AI Merger - ${merged.length} empresas mescladas`);
  return merged;
}
