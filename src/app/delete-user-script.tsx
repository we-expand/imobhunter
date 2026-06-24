/**
 * 🗑️ SCRIPT PARA DELETAR USUÁRIO CLEBER COUTO
 * 
 * COMO USAR:
 * 1. Abra o Console do navegador (F12)
 * 2. Cole este código e pressione Enter:
 */

// Deletar do backend (servidor)
async function deleteCleber() {
  try {
    const response = await fetch('https://SUBSTITUA_PELO_SEU_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/admin/delete-user', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer SUA_SUPABASE_ANON_KEY'
      },
      body: JSON.stringify({
        email: 'cleber@exemplo.com' // ← Substitua pelo email correto
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Usuário deletado do backend:', data.deletedUser);
    } else {
      console.error('❌ Erro ao deletar:', data.error);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Deletar do localStorage (frontend)
function deleteFromLocalStorage() {
  const users = JSON.parse(localStorage.getItem('app-users') || '[]');
  const filtered = users.filter(u => u.email !== 'cleber@exemplo.com'); // ← Substitua pelo email correto
  localStorage.setItem('app-users', JSON.stringify(filtered));
  console.log('✅ Usuário deletado do localStorage');
  console.log('Restam', filtered.length, 'usuários');
}

// EXECUTAR AMBOS
deleteCleber().then(() => {
  deleteFromLocalStorage();
  console.log('🎉 Cleber Couto deletado com sucesso!');
});
