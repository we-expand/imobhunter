# 🔧 GUIA: CONFIGURAR APOLLO.IO MANUALMENTE

## ✅ OPÇÃO 1: VIA INTERFACE (RECOMENDADO)

### **Passo 1: Abrir Configurações**
1. Faça login na plataforma
2. Vá em **Configurações** (ícone ⚙️ no topo direito)
3. Clique na aba **"Segurança"**

### **Passo 2: Configurar API Keys**
1. Role até a seção **"Configuração de Chaves de API"**
2. Cole sua key no campo **"Apollo.io API Key"**:
   ```
   DxFa4BMdoNliED5XiOlOkw
   ```
3. Clique em **"Salvar Configurações"**
4. Aguarde **15 segundos** para as mudanças aplicarem

### **Passo 3: Testar**
1. Vá em **"🔍 Buscar Leads"**
2. Faça uma busca qualquer
3. Se aparecer badge **🟣 Apollo**, está funcionando! ✅

---

## ✅ OPÇÃO 2: VIA CONSOLE DO NAVEGADOR

### **Passo 1: Abrir Console**
1. Pressione **F12** no navegador
2. Vá na aba **"Console"**

### **Passo 2: Executar Script**
Cole este código e pressione **ENTER**:

```javascript
(async () => {
  const projectId = 'pqtctnclnqmwphuwlaqm';
  const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdGN0bmNsbnFtd3BodXdsYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjM4NDEsImV4cCI6MjA1MDI5OTg0MX0.yF4wJeRr2Ja-TaQj7sQ1N8SYnPYOsYwX5svCWf63BLk';
  
  console.log('🚀 Configurando Apollo.io...');
  
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-9e4b8b7c/config/api-keys`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({
        apolloKey: 'DxFa4BMdoNliED5XiOlOkw'
      })
    }
  );
  
  const text = await response.text();
  console.log('📥 Resposta:', text);
  
  try {
    const data = JSON.parse(text);
    if (data.success) {
      console.log('✅ SUCESSO! Apollo.io configurado!');
      console.log('⏳ Aguarde 15 segundos...');
      
      setTimeout(() => {
        console.log('✅ Pronto! Teste fazendo uma busca!');
      }, 15000);
    } else {
      console.error('❌ Erro:', data.error);
    }
  } catch (e) {
    console.error('❌ Resposta não é JSON:', text);
  }
})();
```

### **Passo 3: Aguardar**
- Aguarde **15 segundos** após ver "✅ SUCESSO!"
- Teste fazendo uma busca

---

## ✅ OPÇÃO 3: VIA CURL (TERMINAL)

Execute este comando no terminal:

```bash
curl -X POST \
  https://pqtctnclnqmwphuwlaqm.supabase.co/functions/v1/make-server-9e4b8b7c/config/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdGN0bmNsbnFtd3BodXdsYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjM4NDEsImV4cCI6MjA1MDI5OTg0MX0.yF4wJeRr2Ja-TaQj7sQ1N8SYnPYOsYwX5svCWf63BLk" \
  -d '{"apolloKey":"DxFa4BMdoNliED5XiOlOkw"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API Keys atualizadas com sucesso!"
}
```

---

## 🔍 VERIFICAR SE ESTÁ CONFIGURADO

Execute no console:

```javascript
fetch('https://pqtctnclnqmwphuwlaqm.supabase.co/functions/v1/make-server-9e4b8b7c/config/api-keys', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdGN0bmNsbnFtd3BodXdsYXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjM4NDEsImV4cCI6MjA1MDI5OTg0MX0.yF4wJeRr2Ja-TaQj7sQ1N8SYnPYOsYwX5svCWf63BLk'
  }
})
.then(r => r.json())
.then(data => console.log('🔑 Keys configuradas:', data));
```

**Resposta esperada:**
```json
{
  "success": true,
  "keys": {
    "apollo": "DxFa4BMd...",
    "hunter": null,
    "pdl": null,
    "rocketreach": null,
    "proxycurl": null
  }
}
```

---

## ❌ TROUBLESHOOTING

### **Erro: "Resposta não é JSON válido"**
✅ **Solução:** O servidor pode estar retornando HTML em vez de JSON.
- Verifique se a URL está correta
- Aguarde 1 minuto e tente novamente
- Veja os logs do servidor no Supabase Dashboard

### **Erro: "HTTP 401"**
✅ **Solução:** Token de autenticação inválido
- Use o `publicAnonKey` correto (ver código acima)

### **Erro: "HTTP 500"**
✅ **Solução:** Erro no servidor
- Abra o Supabase Dashboard
- Vá em **Edge Functions → Logs**
- Veja o que está quebrando

### **Key não funciona após salvar**
✅ **Solução:**
1. Aguarde **15 segundos** completos
2. Faça **hard refresh** (CTRL+SHIFT+R)
3. Limpe localStorage: `localStorage.clear()`
4. Recarregue a página

---

## 📝 NOTAS IMPORTANTES

- A key é salva no **KV Store** do Supabase (persistente)
- Não precisa configurar no `.env` ou Secrets
- A configuração via UI é **mais segura** e **recomendada**
- Após salvar, aguarde **15 segundos** antes de fazer buscas

---

**Data:** 15/12/2024  
**Status:** ✅ Guia completo
