# 🏠 ImobHunter - Sistema Autónomo de Lead Generation

Sistema SaaS de Lead Generation & Nurturing autónomo para o mercado imobiliário.

## 📦 Projeto Supabase

**Project ID:** evdyqlrssgsktctjruuq  
**Project Name:** imob_hunter  
**URL:** https://evdyqlrssgsktctjruuq.supabase.co

## 🚀 Deploy da Edge Function

### Pré-requisitos
- Supabase CLI instalado ✅
- Login feito ✅

### Comandos de Deploy

```bash
# 1. Linkar ao projeto (execute DENTRO da pasta ImobHunter)
supabase link --project-ref evdyqlrssgsktctjruuq

# Se pedir senha, pode pular ou usar:
supabase link --project-ref evdyqlrssgsktctjruuq --password 'temp123'

# 2. Deploy da função server
supabase functions deploy server

# 3. Aguardar 60 segundos e testar
curl https://evdyqlrssgsktctjruuq.supabase.co/functions/v1/make-server/ping
```

### ✅ Resultado Esperado

```json
{
  "status": "alive",
  "version": "1.2.0 - Apollo Direct Route + Header Fix ✅",
  "timestamp": "...",
  "message": "Servidor está funcionando! ✅"
}
```

## 📋 Estrutura do Projeto

```
ImobHunter/
├── supabase/
│   ├── functions/
│   │   └── server/
│   │       ├── index.tsx          (Servidor principal)
│   │       ├── kv_store.tsx       (Sistema de banco de dados)
│   │       ├── env-helper.ts      (Helper para variáveis de ambiente)
│   │       └── ... (outros módulos)
│   └── config.toml                (Configuração do Supabase)
└── README.md
```

## 🔑 Variáveis de Ambiente

As seguintes secrets já estão configuradas no Supabase:

1. SUPABASE_URL
2. SUPABASE_ANON_KEY
3. SUPABASE_SERVICE_ROLE_KEY
4. RESEND_API_KEY
5. APOLLO_API_KEY
6. HUNTER_API_KEY
7. PDL_API_KEY
8. CLEARBIT_API_KEY
9. ROCKETREACH_API_KEY
10. PROXYCURL_API_KEY
11. LUSHA_API_KEY
12. RAPIDAPI_KEY
13. LINKEDIN_CLIENT_ID
14. LINKEDIN_CLIENT_SECRET
15. LINKEDIN_API_KEY
16. PIPL_API_KEY
17. FULLCONTACT_API_KEY
18. SUPABASE_DB_URL

## 📱 Links Úteis

- **Dashboard**: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq
- **Edge Functions**: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/functions
- **Secrets**: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/settings/vault/secrets

## 🆘 Troubleshooting

### Erro ao fazer link
Se aparecer "failed to scan line: expected newline":
- Certifique-se de estar DENTRO da pasta ImobHunter
- Execute: `cd ~/Downloads/ImobHunter`
- Tente novamente o comando de link

### Deploy não funciona
- Aguarde 60 segundos após o deploy
- Verifique os logs em: https://supabase.com/dashboard/project/evdyqlrssgsktctjruuq/logs/edge-functions

### Como ver os logs em tempo real
```bash
supabase functions logs server --follow
```

## 📞 Suporte

Qualquer dúvida, consulte a documentação completa no dashboard do Supabase.
