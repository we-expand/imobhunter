# 🔥 AUTO-CONFIGURAÇÃO DA API KEY DO APOLLO.IO

## ✅ EXECUTAR ESTE COMANDO NO CONSOLE DO NAVEGADOR

Abra o DevTools (F12) e cole este código:

```javascript
// 🔥 AUTO-CONFIGURAÇÃO DO APOLLO.IO
(async () => {
  const projectId = 'pqtctnclnqmwphuwlaqm';
  const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdGN0bmNsbnFtd3BodXdsYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjM4NDEsImV4cCI6MjA1MDI5OTg0MX0.yF4wJeRr2Ja-TaQj7sQ1N8SYnPYOsYwX5svCWf63BLk';
  const apolloKey = 'DxFa4BMdoNliED5XiOlOkw';

  console.log('🚀 Configurando Apollo.io API Key...');
  console.log('📡 Enviando para servidor...');

  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/config/api-keys`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          apolloKey: apolloKey
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log('✅ API Key do Apollo.io CONFIGURADA COM SUCESSO!');
      console.log('⏳ Aguarde 10-15 segundos para aplicar...');
      
      setTimeout(() => {
        console.log('✅ API Key aplicada! Teste agora fazendo uma busca real!');
      }, 15000);
    } else {
      console.error('❌ Erro ao configurar API key:', data.error);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
})();
```

## 📝 PASSOS:

1. **Abra o console** (F12)
2. **Cole o código acima**
3. **Pressione ENTER**
4. **Aguarde 15 segundos**
5. **Teste fazendo uma busca!**

## ✅ VERIFICAR SE FUNCIONOU:

Após 15 segundos, faça uma busca qualquer na plataforma.
Se retornar resultados com badge **🟣 Apollo**, está FUNCIONANDO! 🎉

---

**Data:** 15/12/2024
**Status:** ✅ Key configurada automaticamente
