// ═══════════════════════════════════════════════════════════════════════
// 🧹 LIMPAR SESSÕES ANTIGAS
// ═══════════════════════════════════════════════════════════════════════
// Execute esta função no console do navegador para limpar todas as sessões antigas

export function clearOldSessions() {
  console.log('🧹 Limpando sessões antigas...');
  
  const keysToRemove = [
    'userSession',
    'app-users',
    'supabase_auth_session',
    'supabase_auth_user',
    'early-access-email',
    // Adicione aqui outras chaves que precisem ser limpas
  ];
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`  ❌ Removendo: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  console.log('✅ Limpeza concluída! Recarregue a página.');
  console.log('💡 Execute: window.location.reload()');
}

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  (window as any).clearOldSessions = clearOldSessions;
}

// Para uso via console:
// clearOldSessions()
// window.location.reload()
