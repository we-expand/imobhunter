/**
 * Utilitários para normalização de dados de usuários
 */

interface UserData {
  id?: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

/**
 * Mapeamento de usernames conhecidos para nomes completos
 */
const KNOWN_USERNAMES: Record<string, { name: string; email: string }> = {
  'clbrcouto': {
    name: 'Cleber Couto',
    email: 'cleber.couto@leadgen.pt'
  },
  'joaonunes': {
    name: 'João Nunes',
    email: 'joao.nunes@leadgen.pt'
  },
  'jnunes': {
    name: 'João Nunes',
    email: 'joao@kw.pt'
  },
  'devkw': {
    name: 'Dev KW Portugal',
    email: 'dev.kwportugal@gmail.com'
  }
};

/**
 * Normaliza o nome do usuário
 * Converte "Clbrcouto" → "Cleber Couto"
 */
export function normalizeUserName(name: string): string {
  if (!name) return '';
  
  // Remove caracteres especiais e converte para lowercase
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  
  // Verifica se é um username conhecido
  if (KNOWN_USERNAMES[cleanName]) {
    return KNOWN_USERNAMES[cleanName].name;
  }
  
  // Capitaliza cada palavra
  return name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

/**
 * Normaliza o email do usuário
 * Garante formato correto
 */
export function normalizeUserEmail(email: string, username?: string): string {
  if (!email) {
    // Se não tem email mas tem username, tenta buscar do mapeamento
    if (username) {
      const cleanUsername = username.toLowerCase().replace(/[^a-z]/g, '');
      if (KNOWN_USERNAMES[cleanUsername]) {
        return KNOWN_USERNAMES[cleanUsername].email;
      }
    }
    return '';
  }
  
  return email.toLowerCase().trim();
}

/**
 * Normaliza dados completos do usuário
 * Garante que nome e email estejam no formato correto
 */
export function normalizeUserData(userData: Partial<UserData>): UserData {
  const name = normalizeUserName(userData.name || userData.email?.split('@')[0] || '');
  const email = normalizeUserEmail(userData.email || '', userData.name);
  
  return {
    ...userData,
    name,
    email,
    role: userData.role || 'user'
  } as UserData;
}

/**
 * Verifica se o usuário tem acesso admin
 */
export function isUserAdmin(user: Partial<UserData>): boolean {
  const adminEmails = [
    'admin@leadgen.pt',
    'joao.nunes@leadgen.pt',
    'cleber.couto@leadgen.pt',
    'cleber.couto@we-expand.com',
    'dev.kwportugal@gmail.com',
    'joao@kw.pt'
  ];
  
  const adminNames = [
    'joão nunes',
    'joao nunes',
    'cleber couto'
  ];
  
  const email = user.email?.toLowerCase().trim();
  const name = user.name?.toLowerCase().trim();
  
  return (
    (email && adminEmails.includes(email)) ||
    (name && adminNames.includes(name))
  );
}

/**
 * Salva dados do usuário no localStorage de forma normalizada
 */
export function saveUserSession(userData: Partial<UserData>): void {
  const normalized = normalizeUserData(userData);
  
  // Salva em ambos os formatos para compatibilidade
  localStorage.setItem('current-user', JSON.stringify(normalized));
  localStorage.setItem('userSession', JSON.stringify(normalized));
  
  console.log('✅ [UserUtils] Sessão salva:', {
    name: normalized.name,
    email: normalized.email,
    isAdmin: isUserAdmin(normalized)
  });
}

/**
 * Carrega dados do usuário do localStorage
 */
export function loadUserSession(): UserData | null {
  try {
    // Tenta carregar de ambas as fontes
    const currentUser = localStorage.getItem('current-user');
    const userSession = localStorage.getItem('userSession');
    
    const userData = JSON.parse(currentUser || userSession || 'null');
    
    if (!userData) return null;
    
    // Normaliza os dados antes de retornar
    const normalized = normalizeUserData(userData);
    
    // Se os dados foram normalizados, salva novamente
    if (normalized.name !== userData.name || normalized.email !== userData.email) {
      saveUserSession(normalized);
    }
    
    return normalized;
  } catch (error) {
    console.error('❌ [UserUtils] Erro ao carregar sessão:', error);
    return null;
  }
}

/**
 * Formata nome para exibição
 * "Cleber Couto" → "Cleber"
 * "João Nunes" → "João"
 */
export function getFirstName(fullName: string): string {
  if (!fullName) return '';
  return fullName.split(' ')[0];
}

/**
 * Formata nome com sobrenome abreviado
 * "Cleber Couto" → "Cleber C."
 */
export function getShortName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.split(' ');
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}
