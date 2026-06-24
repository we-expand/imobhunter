// Serviço de autenticação com 2FA e QR Code
import { toast } from 'sonner';
import { emailService } from './email-service';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  twoFactorSecret?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

interface Session {
  userId: string;
  token: string;
  qrValidated: boolean;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
}

class AuthService {
  private SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos de inatividade
  private activityCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startActivityMonitor();
    this.setupVisibilityListener();
  }

  // ============ GERAR SECRET 2FA ============
  generateTwoFactorSecret(email: string): string {
    // Gera um secret base32 (compatível com Google Authenticator)
    const secret = this.base32Encode(this.randomBytes(20));
    return secret;
  }

  private randomBytes(length: number): Uint8Array {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
  }

  private base32Encode(buffer: Uint8Array): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;

      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31];
    }

    return output;
  }

  // ============ GERAR URL DO QR CODE ============
  getTwoFactorQRCodeUrl(email: string, secret: string): string {
    const issuer = 'AI LeadGen Pro';
    const accountName = email;
    
    // URL padrão otpauth (Google Authenticator, Authy, etc)
    const url = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    
    return url;
  }

  // ============ GERAR CÓDIGO 6 DÍGITOS (TOTP) ============
  generateTOTP(secret: string, timeStep: number = 30): string {
    // Implementação REAL do algoritmo TOTP (RFC 6238)
    // Compatível com Google Authenticator, Authy, etc.
    
    const time = Math.floor(Date.now() / 1000);
    const counter = Math.floor(time / timeStep);
    
    // Decodifica secret de base32 para bytes
    const key = this.base32Decode(secret);
    
    // Converte counter para 8 bytes (64 bits)
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0, BigInt(counter), false); // Big-endian
    const timeBytes = new Uint8Array(buffer);
    
    // HMAC-SHA1
    const hmac = this.hmacSha1(key, timeBytes);
    
    // Dynamic truncation (RFC 4226)
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % 1000000;
    
    // Retorna código de 6 dígitos com zeros à esquerda
    return code.toString().padStart(6, '0');
  }

  // Alias para melhor legibilidade
  generateCurrentTOTP(secret: string): string {
    return this.generateTOTP(secret);
  }

  // Decodifica base32 para bytes
  private base32Decode(base32: string): Uint8Array {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleanInput = base32.toUpperCase().replace(/=+$/, '');
    
    let bits = 0;
    let value = 0;
    let index = 0;
    const output = new Uint8Array(Math.floor((cleanInput.length * 5) / 8));
    
    for (let i = 0; i < cleanInput.length; i++) {
      const idx = alphabet.indexOf(cleanInput[i]);
      if (idx === -1) continue;
      
      value = (value << 5) | idx;
      bits += 5;
      
      if (bits >= 8) {
        output[index++] = (value >>> (bits - 8)) & 0xff;
        bits -= 8;
      }
    }
    
    return output;
  }

  // HMAC-SHA1 implementation
  private hmacSha1(key: Uint8Array, message: Uint8Array): Uint8Array {
    const blockSize = 64;
    
    // Se a chave for maior que o tamanho do bloco, faz hash
    let processedKey = key;
    if (key.length > blockSize) {
      processedKey = this.sha1(key);
    }
    
    // Pad key com zeros até o tamanho do bloco
    const paddedKey = new Uint8Array(blockSize);
    paddedKey.set(processedKey);
    
    // Cria inner e outer padding
    const innerPad = new Uint8Array(blockSize);
    const outerPad = new Uint8Array(blockSize);
    
    for (let i = 0; i < blockSize; i++) {
      innerPad[i] = paddedKey[i] ^ 0x36;
      outerPad[i] = paddedKey[i] ^ 0x5c;
    }
    
    // HMAC = H(outerPad || H(innerPad || message))
    const innerHash = this.sha1(this.concatArrays(innerPad, message));
    return this.sha1(this.concatArrays(outerPad, innerHash));
  }

  // SHA-1 implementation
  private sha1(data: Uint8Array): Uint8Array {
    // Inicializa hash values (RFC 3174)
    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;
    
    // Pre-processing
    const ml = data.length * 8;
    const paddedLength = Math.ceil((data.length + 9) / 64) * 64;
    const padded = new Uint8Array(paddedLength);
    padded.set(data);
    padded[data.length] = 0x80;
    
    // Append length as 64-bit big-endian
    const view = new DataView(padded.buffer);
    view.setUint32(paddedLength - 4, ml & 0xffffffff, false);
    view.setUint32(paddedLength - 8, Math.floor(ml / 0x100000000), false);
    
    // Process each 512-bit chunk
    for (let offset = 0; offset < paddedLength; offset += 64) {
      const w = new Uint32Array(80);
      
      // Break chunk into 16 32-bit words
      for (let i = 0; i < 16; i++) {
        w[i] = view.getUint32(offset + i * 4, false);
      }
      
      // Extend to 80 words
      for (let i = 16; i < 80; i++) {
        w[i] = this.rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
      }
      
      // Initialize working variables
      let a = h0, b = h1, c = h2, d = h3, e = h4;
      
      // Main loop
      for (let i = 0; i < 80; i++) {
        let f: number, k: number;
        
        if (i < 20) {
          f = (b & c) | (~b & d);
          k = 0x5A827999;
        } else if (i < 40) {
          f = b ^ c ^ d;
          k = 0x6ED9EBA1;
        } else if (i < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8F1BBCDC;
        } else {
          f = b ^ c ^ d;
          k = 0xCA62C1D6;
        }
        
        const temp = (this.rotateLeft(a, 5) + f + e + k + w[i]) >>> 0;
        e = d;
        d = c;
        c = this.rotateLeft(b, 30);
        b = a;
        a = temp;
      }
      
      // Add to hash values
      h0 = (h0 + a) >>> 0;
      h1 = (h1 + b) >>> 0;
      h2 = (h2 + c) >>> 0;
      h3 = (h3 + d) >>> 0;
      h4 = (h4 + e) >>> 0;
    }
    
    // Produce final hash
    const result = new Uint8Array(20);
    const resultView = new DataView(result.buffer);
    resultView.setUint32(0, h0, false);
    resultView.setUint32(4, h1, false);
    resultView.setUint32(8, h2, false);
    resultView.setUint32(12, h3, false);
    resultView.setUint32(16, h4, false);
    
    return result;
  }

  private rotateLeft(n: number, bits: number): number {
    return ((n << bits) | (n >>> (32 - bits))) >>> 0;
  }

  private concatArrays(a: Uint8Array, b: Uint8Array): Uint8Array {
    const result = new Uint8Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }

  // ============ VALIDAR CÓDIGO 2FA ============
  validateTOTP(secret: string, code: string): boolean {
    // Validação REAL usando algoritmo TOTP
    // Aceita códigos atuais + 1 período anterior/posterior (90 segundos total)
    
    const currentCode = this.generateTOTP(secret);
    
    // Verifica código atual
    if (code === currentCode) {
      return true;
    }
    
    // Verifica 1 período anterior (para compensar delay de digitação)
    const time = Math.floor(Date.now() / 1000);
    const previousCounter = Math.floor(time / 30) - 1;
    const previousCode = this.generateTOTPForCounter(secret, previousCounter);
    
    if (code === previousCode) {
      return true;
    }
    
    // Verifica 1 período futuro (para compensar dessincronização de relógio)
    const nextCounter = Math.floor(time / 30) + 1;
    const nextCode = this.generateTOTPForCounter(secret, nextCounter);
    
    if (code === nextCode) {
      return true;
    }
    
    return false;
  }

  // Gera TOTP para um counter específico (usado na validação)
  private generateTOTPForCounter(secret: string, counter: number): string {
    const key = this.base32Decode(secret);
    
    // Converte counter para 8 bytes (64 bits)
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0, BigInt(counter), false);
    const timeBytes = new Uint8Array(buffer);
    
    // HMAC-SHA1
    const hmac = this.hmacSha1(key, timeBytes);
    
    // Dynamic truncation
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    ) % 1000000;
    
    return code.toString().padStart(6, '0');
  }

  // ============ ATIVAR 2FA PARA USUÁRIO ============
  enableTwoFactor(userId: string, secret: string) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.twoFactorSecret = secret;
      user.twoFactorEnabled = true;
      this.saveUsers(users);
      
      // Envia email de confirmação
      this.sendTwoFactorEnabledEmail(user.email, user.name);
    }
  }

  // ============ CRIAR SESSÃO COM 2FA ============
  createSession(userId: string, qrValidated: boolean = false): Session {
    const token = this.generateToken();
    const now = new Date().toISOString();
    
    const session: Session = {
      userId,
      token,
      qrValidated,
      createdAt: now,
      lastActivity: now,
      expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT).toISOString()
    };
    
    localStorage.setItem('current-session', JSON.stringify(session));
    return session;
  }

  // ============ VALIDAR SESSÃO ============
  validateSession(): Session | null {
    const sessionData = localStorage.getItem('current-session');
    if (!sessionData) return null;
    
    const session: Session = JSON.parse(sessionData);
    const now = Date.now();
    const expiresAt = new Date(session.expiresAt).getTime();
    
    // Sessão expirada
    if (now > expiresAt) {
      this.logout('Sessão expirada. Faça login novamente.');
      return null;
    }
    
    // Usuário precisa validar QR Code
    const user = this.getCurrentUser();
    if (user?.twoFactorEnabled && !session.qrValidated) {
      return session; // Retorna mas precisa validar
    }
    
    return session;
  }

  // ============ ATUALIZAR ATIVIDADE ============
  updateActivity() {
    const sessionData = localStorage.getItem('current-session');
    if (!sessionData) return;
    
    const session: Session = JSON.parse(sessionData);
    session.lastActivity = new Date().toISOString();
    session.expiresAt = new Date(Date.now() + this.SESSION_TIMEOUT).toISOString();
    
    localStorage.setItem('current-session', JSON.stringify(session));
  }

  // ============ MONITOR DE ATIVIDADE ============
  private startActivityMonitor() {
    // Verifica inatividade a cada minuto
    this.activityCheckInterval = setInterval(() => {
      const session = this.validateSession();
      if (!session) {
        this.logout('Sessão expirada por inatividade');
      }
    }, 60000); // 1 minuto

    // Atualiza atividade em eventos do usuário
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => this.updateActivity(), { passive: true });
    });
  }

  // ============ LISTENER DE VISIBILIDADE ============
  private setupVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Usuário saiu da aba
        console.log('👋 Usuário saiu da aba');
      } else {
        // Usuário voltou - revalidar sessão
        const session = this.validateSession();
        if (!session) {
          window.location.reload();
        } else {
          const user = this.getCurrentUser();
          if (user?.twoFactorEnabled && !session.qrValidated) {
            // Força revalidação via QR
            toast.warning('Por favor, valide novamente via QR Code');
            // Dispara evento customizado
            window.dispatchEvent(new CustomEvent('require-qr-validation'));
          }
        }
      }
    });

    // Logout ao fechar aba/navegador
    window.addEventListener('beforeunload', () => {
      // Marca que precisa revalidar
      const sessionData = localStorage.getItem('current-session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.qrValidated = false;
        localStorage.setItem('current-session', JSON.stringify(sessionData));
      }
    });
  }

  // ============ GERAR TOKEN ============
  private generateToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ============ LOGOUT ============
  logout(reason?: string) {
    const user = this.getCurrentUser();
    
    if (user) {
      this.sendLogoutEmail(user.email, user.name, reason);
    }
    
    localStorage.removeItem('current-session');
    localStorage.removeItem('current-user');
    
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
    }
    
    if (reason) {
      toast.info(reason);
    }
  }

  // ============ HELPERS ============
  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem('app-users') || '[]');
  }

  private saveUsers(users: User[]) {
    localStorage.setItem('app-users', JSON.stringify(users));
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('current-user');
    if (!userData) return null;
    
    const userBasic = JSON.parse(userData);
    const users = this.getUsers();
    return users.find(u => u.id === userBasic.id) || null;
  }

  // ============ EMAILS ============
  private sendTwoFactorEnabledEmail(email: string, name: string) {
    // Envia email REAL
    emailService.send2FAEnabledEmail(email, name);
    
    toast.success('Email de confirmação enviado!');
  }

  sendQRValidationEmail(email: string, name: string, success: boolean) {
    // Envia email REAL
    emailService.sendQRValidatedEmail(email, name, success);
  }

  private sendLogoutEmail(email: string, name: string, reason?: string) {
    // Envia email REAL
    emailService.sendLogoutEmail(email, name, reason);
  }

  sendReauthenticationEmail(email: string, name: string) {
    // Envia email REAL
    emailService.sendReauthenticationEmail(email, name);
  }
}

export const authService = new AuthService();