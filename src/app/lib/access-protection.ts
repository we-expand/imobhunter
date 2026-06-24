/**
 * Sistema de Proteção de Acesso
 * - Tokens únicos e temporários
 * - Limite de acessos
 * - Expiração de links
 * - Logs de acesso
 * - Watermark de segurança
 */

export interface AccessToken {
  id: string;
  token: string;
  email: string;
  clientName: string;
  createdAt: string;
  expiresAt: string;
  maxAccesses: number;
  currentAccesses: number;
  active: boolean;
  lastAccessAt?: string;
  ipAddresses: string[];
  userAgents: string[];
}

export interface AccessLog {
  id: string;
  tokenId: string;
  timestamp: string;
  action: 'access' | 'denied' | 'expired' | 'limit_reached' | 'screenshot_attempt';
  ip?: string;
  userAgent?: string;
  details?: string;
}

class AccessProtectionService {
  private readonly STORAGE_KEY = 'access-tokens';
  private readonly LOGS_KEY = 'access-logs';
  private readonly CURRENT_TOKEN_KEY = 'current-access-token';

  /**
   * Gera um novo token de acesso
   */
  generateToken(
    email: string,
    clientName: string,
    validityHours: number = 72,
    maxAccesses: number = 50
  ): AccessToken {
    const token = this.createSecureToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + validityHours * 60 * 60 * 1000);

    const accessToken: AccessToken = {
      id: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      token,
      email,
      clientName,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      maxAccesses,
      currentAccesses: 0,
      active: true,
      ipAddresses: [],
      userAgents: [],
    };

    // Salva token
    const tokens = this.getAllTokens();
    tokens.push(accessToken);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));

    this.addLog({
      tokenId: accessToken.id,
      action: 'access',
      details: `Token criado para ${clientName} (${email})`,
    });

    return accessToken;
  }

  /**
   * Cria token seguro e único
   */
  private createSecureToken(): string {
    const timestamp = Date.now().toString(36);
    const randomPart1 = Math.random().toString(36).substr(2, 12);
    const randomPart2 = Math.random().toString(36).substr(2, 12);
    const randomPart3 = Math.random().toString(36).substr(2, 12);
    
    return `${timestamp}${randomPart1}${randomPart2}${randomPart3}`.toUpperCase();
  }

  /**
   * Valida token de acesso
   */
  validateToken(token: string): {
    valid: boolean;
    reason?: string;
    accessToken?: AccessToken;
  } {
    if (!token) {
      return { valid: false, reason: 'Token não fornecido' };
    }

    const tokens = this.getAllTokens();
    const accessToken = tokens.find(t => t.token === token);

    if (!accessToken) {
      this.addLog({
        tokenId: 'unknown',
        action: 'denied',
        details: `Token inválido tentado: ${token.substr(0, 10)}...`,
      });
      return { valid: false, reason: 'Token inválido' };
    }

    if (!accessToken.active) {
      this.addLog({
        tokenId: accessToken.id,
        action: 'denied',
        details: 'Token desativado',
      });
      return { valid: false, reason: 'Token desativado' };
    }

    // Verifica expiração
    if (new Date(accessToken.expiresAt) < new Date()) {
      this.addLog({
        tokenId: accessToken.id,
        action: 'expired',
        details: 'Token expirado',
      });
      return { valid: false, reason: 'Token expirado' };
    }

    // Verifica limite de acessos
    if (accessToken.currentAccesses >= accessToken.maxAccesses) {
      this.addLog({
        tokenId: accessToken.id,
        action: 'limit_reached',
        details: 'Limite de acessos atingido',
      });
      return { valid: false, reason: 'Limite de acessos atingido' };
    }

    return { valid: true, accessToken };
  }

  /**
   * Registra um acesso
   */
  registerAccess(token: string): boolean {
    const tokens = this.getAllTokens();
    const tokenIndex = tokens.findIndex(t => t.token === token);

    if (tokenIndex === -1) return false;

    const accessToken = tokens[tokenIndex];
    
    // Atualiza contadores e dados
    accessToken.currentAccesses++;
    accessToken.lastAccessAt = new Date().toISOString();
    
    // Registra IP e User Agent (simulado - em produção viria do backend)
    const mockIp = this.getMockIP();
    const userAgent = navigator.userAgent;
    
    if (!accessToken.ipAddresses.includes(mockIp)) {
      accessToken.ipAddresses.push(mockIp);
    }
    if (!accessToken.userAgents.includes(userAgent)) {
      accessToken.userAgents.push(userAgent);
    }

    // Salva
    tokens[tokenIndex] = accessToken;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));

    // Salva token atual para watermark
    localStorage.setItem(this.CURRENT_TOKEN_KEY, JSON.stringify(accessToken));

    this.addLog({
      tokenId: accessToken.id,
      action: 'access',
      ip: mockIp,
      userAgent,
      details: `Acesso ${accessToken.currentAccesses}/${accessToken.maxAccesses}`,
    });

    return true;
  }

  /**
   * Obtém token atual (para watermark)
   */
  getCurrentToken(): AccessToken | null {
    const saved = localStorage.getItem(this.CURRENT_TOKEN_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  /**
   * Revoga token
   */
  revokeToken(tokenId: string): boolean {
    const tokens = this.getAllTokens();
    const tokenIndex = tokens.findIndex(t => t.id === tokenId);

    if (tokenIndex === -1) return false;

    tokens[tokenIndex].active = false;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tokens));

    this.addLog({
      tokenId,
      action: 'denied',
      details: 'Token revogado manualmente',
    });

    return true;
  }

  /**
   * Lista todos os tokens
   */
  getAllTokens(): AccessToken[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Obtém estatísticas de um token
   */
  getTokenStats(tokenId: string) {
    const tokens = this.getAllTokens();
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return null;

    const logs = this.getTokenLogs(tokenId);
    const now = new Date();
    const expiresAt = new Date(token.expiresAt);
    const hoursRemaining = Math.max(0, (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));

    return {
      token,
      totalAccesses: token.currentAccesses,
      remainingAccesses: token.maxAccesses - token.currentAccesses,
      hoursRemaining: Math.round(hoursRemaining),
      isExpired: expiresAt < now,
      uniqueIPs: token.ipAddresses.length,
      lastAccess: token.lastAccessAt,
      logs: logs.length,
    };
  }

  /**
   * Adiciona log
   */
  private addLog(log: Omit<AccessLog, 'id' | 'timestamp'>): void {
    const logs = this.getAllLogs();
    const newLog: AccessLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ip: log.ip || this.getMockIP(),
      userAgent: log.userAgent || navigator.userAgent,
    };

    logs.unshift(newLog); // Adiciona no início
    localStorage.setItem(this.LOGS_KEY, JSON.stringify(logs.slice(0, 500))); // Mantém últimos 500
  }

  /**
   * Obtém todos os logs
   */
  getAllLogs(): AccessLog[] {
    const saved = localStorage.getItem(this.LOGS_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Obtém logs de um token específico
   */
  getTokenLogs(tokenId: string): AccessLog[] {
    return this.getAllLogs().filter(log => log.tokenId === tokenId);
  }

  /**
   * Registra tentativa de screenshot
   */
  logScreenshotAttempt(): void {
    const currentToken = this.getCurrentToken();
    if (currentToken) {
      this.addLog({
        tokenId: currentToken.id,
        action: 'screenshot_attempt',
        details: 'Tentativa de captura de tela detectada',
      });
    }
  }

  /**
   * Gera URL protegida
   */
  generateProtectedURL(token: string, baseURL?: string): string {
    const base = baseURL || window.location.origin;
    return `${base}?access=${token}`;
  }

  /**
   * Extrai token da URL
   */
  getTokenFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('access');
  }

  /**
   * Limpa token da URL (mantém acesso mas esconde token)
   */
  cleanURL(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('access');
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * Mock de IP (em produção viria do backend)
   */
  private getMockIP(): string {
    const saved = sessionStorage.getItem('mock-ip');
    if (saved) return saved;

    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    sessionStorage.setItem('mock-ip', ip);
    return ip;
  }

  /**
   * Limpa token atual (logout)
   */
  clearCurrentToken(): void {
    localStorage.removeItem(this.CURRENT_TOKEN_KEY);
  }

  /**
   * Formata tempo restante
   */
  formatTimeRemaining(expiresAt: string): string {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return 'Expirado';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dia${days > 1 ? 's' : ''}`;
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
}

export const accessProtection = new AccessProtectionService();
