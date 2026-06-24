/**
 * 🧹 CLEAR APP CACHE
 * 
 * Limpa completamente o cache da aplicação incluindo:
 * - localStorage
 * - sessionStorage
 * - Cache do Service Worker
 * - IndexedDB
 * - Cookies
 */

export function clearAllAppData() {
  console.log('🧹 Iniciando limpeza completa...');
  
  try {
    // 1. Limpar localStorage
    localStorage.clear();
    console.log('✅ localStorage limpo');
    
    // 2. Limpar sessionStorage
    sessionStorage.clear();
    console.log('✅ sessionStorage limpo');
    
    // 3. Remover todos os cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    console.log('✅ Cookies removidos');
    
    // 4. Limpar IndexedDB (se existir)
    if ('indexedDB' in window) {
      indexedDB.databases().then(dbs => {
        dbs.forEach(db => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      });
      console.log('✅ IndexedDB limpo');
    }
    
    // 5. Limpar Service Worker Cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
      console.log('✅ Service Worker cache limpo');
    }
    
    console.log('🎉 Limpeza completa finalizada!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao limpar cache:', error);
    return false;
  }
}

// Função auxiliar para recarregar a página
export function clearAndReload() {
  clearAllAppData();
  setTimeout(() => {
    window.location.reload();
  }, 500);
}
