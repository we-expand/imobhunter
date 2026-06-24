// Gerenciador de período de testes (Trial de 10 dias)
import { toast } from 'sonner@2.0.3';

const TRIAL_DURATION = 10 * 24 * 60 * 60 * 1000; // 10 dias em milissegundos
const TRIAL_START_KEY = 'trial-start-date';
const TRIAL_ACTIVE_KEY = 'trial-active';

export class TrialManager {
  private startDate: number;
  private isActive: boolean;

  constructor() {
    this.startDate = this.getTrialStartDate();
    this.isActive = this.getTrialStatus();
  }

  // Inicia o período de trial
  public startTrial(): void {
    const now = Date.now();
    localStorage.setItem(TRIAL_START_KEY, now.toString());
    localStorage.setItem(TRIAL_ACTIVE_KEY, 'true');
    this.startDate = now;
    this.isActive = true;
    
    console.log('✅ Trial iniciado:', new Date(now).toLocaleString('pt-PT'));
    toast.success('Período de testes iniciado! Você tem 10 dias de acesso.', {
      duration: 5000,
    });
  }

  // Verifica se o trial ainda está ativo
  public isTrialActive(): boolean {
    if (!this.isActive) return false;
    
    const elapsed = Date.now() - this.startDate;
    return elapsed < TRIAL_DURATION;
  }

  // Retorna quantos dias restam
  public getDaysRemaining(): number {
    if (!this.isActive) return 0;
    
    const elapsed = Date.now() - this.startDate;
    const remaining = TRIAL_DURATION - elapsed;
    
    if (remaining <= 0) return 0;
    
    return Math.ceil(remaining / (24 * 60 * 60 * 1000));
  }

  // Retorna data de expiração
  public getExpirationDate(): Date {
    return new Date(this.startDate + TRIAL_DURATION);
  }

  // Encerra o trial
  public endTrial(): void {
    localStorage.setItem(TRIAL_ACTIVE_KEY, 'false');
    this.isActive = false;
    
    console.log('⏱️ Trial encerrado');
    toast.error('Período de testes expirado. Plataforma desativada.', {
      duration: 10000,
    });
  }

  // Reseta completamente o trial (para desenvolvimento)
  public resetTrial(): void {
    localStorage.removeItem(TRIAL_START_KEY);
    localStorage.removeItem(TRIAL_ACTIVE_KEY);
    this.startDate = 0;
    this.isActive = false;
    
    console.log('🔄 Trial resetado');
  }

  // Helpers privados
  private getTrialStartDate(): number {
    const stored = localStorage.getItem(TRIAL_START_KEY);
    return stored ? parseInt(stored) : 0;
  }

  private getTrialStatus(): boolean {
    const stored = localStorage.getItem(TRIAL_ACTIVE_KEY);
    return stored === 'true';
  }

  // Mostra informação de trial
  public showTrialInfo(): void {
    if (!this.isActive) {
      toast.error('Trial não iniciado ou expirado');
      return;
    }

    const daysRemaining = this.getDaysRemaining();
    const expirationDate = this.getExpirationDate();

    toast.info(`Trial ativo: ${daysRemaining} dias restantes`, {
      description: `Expira em: ${expirationDate.toLocaleDateString('pt-PT')} às ${expirationDate.toLocaleTimeString('pt-PT')}`,
      duration: 8000,
    });
  }
}

// Função para resetar TODOS os dados da plataforma
export function resetPlatformData(): void {
  const confirmReset = confirm(
    '⚠️ ATENÇÃO: Isso irá APAGAR TODOS OS DADOS da plataforma.\n\n' +
    'Isso inclui:\n' +
    '- Todos os usuários\n' +
    '- Todos os leads\n' +
    '- Todas as atividades\n' +
    '- Configurações de clusters\n' +
    '- Dados do MongoDB\n' +
    '- Período de trial\n\n' +
    'Você tem CERTEZA que deseja continuar?'
  );

  if (!confirmReset) {
    toast.info('Reset cancelado');
    return;
  }

  // Segunda confirmação (segurança extra)
  const finalConfirm = confirm(
    '🔴 ÚLTIMA CONFIRMAÇÃO\n\n' +
    'Digite "RESETAR" no próximo prompt para confirmar.'
  );

  if (!finalConfirm) {
    toast.info('Reset cancelado');
    return;
  }

  const confirmText = prompt('Digite "RESETAR" para confirmar (tudo em maiúsculas):');
  
  if (confirmText !== 'RESETAR') {
    toast.error('Reset cancelado - texto de confirmação incorreto');
    return;
  }

  // APAGA TUDO
  console.log('🔴 INICIANDO RESET TOTAL DA PLATAFORMA...');

  // Lista de todas as chaves conhecidas
  const keysToRemove = [
    // Usuários e autenticação
    'app-users',
    'current-user',
    'user-session-token',
    'last-activity-timestamp',
    
    // Dados da aplicação
    'app-leads',
    'app-clusters',
    'app-activities',
    
    // MongoDB
    'mongodb-config',
    'mongodb-connected',
    
    // Trial
    'trial-start-date',
    'trial-active',
    
    // Outros
    'apollo-api-key',
    'phone-enrichment-cache',
  ];

  // Remove todas as chaves específicas
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Remove também quaisquer outras chaves que possam existir
  // (backup extra - limpa TUDO do localStorage)
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('app-') || key.startsWith('mongodb-') || key.startsWith('trial-')) {
      localStorage.removeItem(key);
    }
  });

  console.log('✅ Plataforma resetada com sucesso!');
  
  toast.success('✅ Plataforma resetada! Recarregando...', {
    duration: 3000,
  });

  // Recarrega a página após 2 segundos
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Instância singleton
export const trialManager = new TrialManager();
