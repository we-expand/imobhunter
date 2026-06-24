// 🧪 ARQUIVO DE TESTE - Verificação de startup do servidor
// Este arquivo testa se todos os imports e inicializações funcionam

console.log('🧪 TESTE DE STARTUP - Iniciando...');

try {
  console.log('1️⃣ Testando import do Hono...');
  const { Hono } = await import('npm:hono');
  console.log('✅ Hono importado com sucesso');
  
  console.log('2️⃣ Testando import do kv_store...');
  const kv = await import('./kv_store.tsx');
  console.log('✅ kv_store importado com sucesso');
  
  console.log('3️⃣ Testando import do demo-leads-generator...');
  const { generateDemoLeads } = await import('./demo-leads-generator.ts');
  console.log('✅ demo-leads-generator importado com sucesso');
  
  console.log('4️⃣ Testando import do web-search-service...');
  const webSearch = await import('./web-search-service.ts');
  console.log('✅ web-search-service importado com sucesso');
  
  console.log('5️⃣ Testando import do search-routes...');
  const searchRoutes = await import('./search-routes.ts');
  console.log('✅ search-routes importado com sucesso');
  
  console.log('');
  console.log('✅✅✅ TODOS OS IMPORTS FUNCIONANDO! ✅✅✅');
  console.log('');
  console.log('🔍 Detalhes do searchRoutes:');
  console.log('   - Tipo:', typeof searchRoutes.default);
  console.log('   - É Hono app?', searchRoutes.default?.constructor?.name);
  
} catch (error) {
  console.error('');
  console.error('❌❌❌ ERRO NO STARTUP! ❌❌❌');
  console.error('');
  console.error('Erro:', error);
  console.error('Stack:', error.stack);
  console.error('');
}
