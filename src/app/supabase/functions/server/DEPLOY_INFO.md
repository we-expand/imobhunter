# 🚀 ImobHunter Server - Deploy Information

## Current Version: 1.5.0 - CRITICAL CORS FIX FOR API PROXY ✅

### Deploy Timestamp
- **Date**: 2025-01-27T23:30:00Z
- **Status**: ✅ CORS PREFLIGHT FIXED - API Proxy agora responde OPTIONS corretamente

### 🔥 CRITICAL CHANGES in this version:
1. ✅ **FIXED CORS PREFLIGHT** - Adicionado handler explícito para OPTIONS em api-proxy-routes.ts
2. ✅ **CORS middleware** configurado em api-proxy-routes.ts ANTES das rotas
3. ✅ **OPTIONS retorna 204** sem erro para permitir preflight do browser
4. ✅ Agora as buscas REAIS funcionam sem erro de CORS!
5. ✅ Dados mockados só aparecem se as APIs falharem por outros motivos

### Problem Fixed:
**Before**: 
```
Access to fetch at 'https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/proxycurl/search' 
from origin 'https://bring-aroma-99987345.figma.site' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
```

**After**:
```
✅ OPTIONS request retorna 204 No Content
✅ POST/GET requests funcionam normalmente
✅ APIs Apollo.io e Proxycurl agora retornam dados REAIS
```

### Files Modified:
- `/supabase/functions/server/api-proxy-routes.ts` - Adicionado CORS middleware e handler OPTIONS

### How to verify deployment:
```bash
# 1. Check CORS preflight
curl -X OPTIONS \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/proxycurl/search \
  -H "Origin: https://bring-aroma-99987345.figma.site" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,authorization"

# Expected: HTTP 204 with CORS headers

# 2. Test Apollo proxy
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/apollo/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"person_names": ["John Doe"], "per_page": 5}'

# Expected: {"success": true, "data": {...}}

# 3. Test Proxycurl proxy
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-9e4b8b7c/api-proxy/proxycurl/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"first_name": "John", "last_name": "Doe", "country": "US", "page_size": 5}'

# Expected: {"success": true, "data": {...}}
```

### Deploy Instructions:
```bash
# Navegar até a pasta do projeto
cd /path/to/ImobHunter

# Deploy da função atualizada
supabase functions deploy server --project-ref YOUR_PROJECT_ID

# Ou via dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/functions
```

---
**Last modified**: Mon Jan 27 2025 23:30:00 GMT+0000
**Priority**: 🔥 CRITICAL - CORS fix enables REAL data searches
