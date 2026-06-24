/**
 * Utilitários para manipulação de strings
 */

/**
 * Capitaliza a primeira letra de cada palavra
 * 
 * @example
 * capitalizeWords("joão nunes") => "João Nunes"
 * capitalizeWords("MARIA SILVA") => "Maria Silva"
 * capitalizeWords("pedro de souza") => "Pedro De Souza"
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Capitaliza apenas a primeira letra da string
 * 
 * @example
 * capitalizeFirst("joão") => "João"
 * capitalizeFirst("JOÃO") => "João"
 */
export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formata nome completo com capitalização apropriada
 * Mantém preposições em minúscula (de, da, do, dos, das)
 * 
 * @example
 * formatFullName("joão de souza nunes") => "João de Souza Nunes"
 * formatFullName("MARIA DA SILVA") => "Maria da Silva"
 */
export function formatFullName(name: string): string {
  if (!name) return '';
  
  const prepositions = ['de', 'da', 'do', 'dos', 'das', 'e'];
  
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (word.length === 0) return word;
      
      // Primeira palavra sempre capitalizada
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      // Preposições em minúscula (exceto se for a primeira palavra)
      if (prepositions.includes(word)) {
        return word;
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
