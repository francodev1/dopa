# 🚀 Quick Start - Deploy Rápido em Produção

## Para quem tem pressa (5 minutos)

### 1. Deploy Backend (Railway - mais rápido)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy (dentro da pasta backend)
cd backend
railway init
railway up

# Adicionar variáveis no dashboard Railway:
# - DATABASE_URL (sua URL Supabase)
# - API_KEY (gerar com: openssl rand -hex 32)
# - STRIPE_SECRET_KEY (chave live do Stripe)
# - OPENAI_API_KEY (sua key OpenAI)
# - WHATSAPP_DRY_RUN=true
# - NODE_ENV=production
```

**URL do backend:** Copie a URL que Railway gerar (ex: `https://seu-app.railway.app`)

### 2. Deploy Frontend (Vercel - 1 clique)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy (dentro da pasta website)
cd website
vercel --prod

# Ou conecte GitHub no dashboard Vercel (ainda mais fácil)
```

**Adicionar variáveis no Vercel:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Clerk production key)
- `CLERK_SECRET_KEY` (Clerk secret)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Stripe live key)
- `STRIPE_SECRET_KEY` (Stripe live secret)
- `STRIPE_WEBHOOK_SECRET` (depois de configurar webhook)
- `BACKEND_URL` (URL do Railway)
- `BACKEND_API_KEY` (mesmo do backend)

### 3. Configurar Webhook Stripe

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique "Add endpoint"
3. URL: `https://seu-site.vercel.app/api/webhooks/stripe`
4. Eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o "Signing secret" (whsec_...)
6. Adicione como `STRIPE_WEBHOOK_SECRET` no Vercel

### 4. Testar

```bash
# Health check backend
curl https://seu-backend.railway.app/health

# Acesse seu site
open https://seu-site.vercel.app

# Faça um checkout de teste
# Verifique logs no Railway e Vercel
```

---

## Alternativas de Deploy

### Backend

**Render (free tier disponível):**
1. Conecte GitHub
2. New Web Service
3. Build: `cd backend && npm install && npx prisma generate`
4. Start: `cd backend && npm start`
5. Adicione variáveis de ambiente

**Fly.io (crédito inicial grátis):**
```bash
flyctl launch
flyctl secrets set DATABASE_URL="..." API_KEY="..."
flyctl deploy
```

### Frontend

**Vercel (recomendado):**
- Melhor para Next.js
- Free tier generoso
- Deploy automático do GitHub

**Netlify:**
- Alternativa sólida
- Também tem free tier

---

## Checklist Pré-Deploy ✅

- [ ] `.env` backend configurado (com DATABASE_URL correto)
- [ ] `npx prisma migrate deploy` executado
- [ ] `npx prisma generate` executado
- [ ] `.env.local` frontend configurado
- [ ] Clerk configurado para produção
- [ ] Stripe em modo live
- [ ] `WHATSAPP_DRY_RUN=true` (até ter provider)
- [ ] API_KEY forte gerado

---

## Pós-Deploy

### Monitoramento (primeiras 24h)

```bash
# Logs Railway
railway logs

# Logs Vercel
vercel logs

# Health check periódico
watch -n 30 'curl -s https://seu-backend/health | jq .'
```

### Métricas a Observar
- Taxa de sucesso de webhooks (deve ser >99%)
- Tempo de resposta do bot (<2s)
- Erros 500 (deve ser zero ou próximo)
- Checkouts completados vs iniciados

---

## Quando Ativar WhatsApp Real

### 1. Escolha Provider
- **Z-API:** Mais simples, painel visual
- **Twilio:** Robusto, documentação excelente
- **Meta Cloud:** Oficial, mais barato em volume

### 2. Teste Manualmente
```bash
# Exemplo Z-API
curl -X POST "https://api.z-api.io/instances/SUA_INSTANCE/messages/send-text" \
  -H "Client-Token: SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "5511999999999",
    "message": "Teste"
  }'
```

### 3. Ative no Backend
Atualize no Railway/Render:
```bash
WHATSAPP_DRY_RUN=false
EVOLUTION_API_URL=https://api.z-api.io/instances/SUA_INSTANCE
EVOLUTION_API_KEY=SEU_TOKEN
EVOLUTION_DEACTIVATE_PATH=/logout  # conferir doc do provider
```

### 4. Deploy e Monitore
```bash
railway up  # ou git push se conectado ao GitHub
railway logs --tail  # acompanhe ao vivo
```

---

## Solução de Problemas Rápidos

### Backend não inicia
```bash
# Verificar logs
railway logs

# Comum: DATABASE_URL incorreto
# Solução: verificar Supabase e recodificar caracteres especiais
```

### Webhook não funciona
```bash
# Testar localmente com Stripe CLI
stripe listen --forward-to https://seu-site.vercel.app/api/webhooks/stripe

# Verificar STRIPE_WEBHOOK_SECRET correto no Vercel
```

### Frontend 500
```bash
# Verificar build
npm run build

# Ver erros
vercel logs --follow
```

---

## Custos Mensais Estimados (iniciar)

- Backend (Railway Starter): **$5/mês**
- Frontend (Vercel Hobby): **Grátis**
- Banco (Supabase Free): **Grátis** (até 500MB)
- OpenAI (100 msg/dia): **~$6/mês**
- WhatsApp provider: **Variável** (~$40-100/mês ou pay-per-message)

**Total mínimo:** ~$11-50/mês para começar

---

## Escalando

Quando tiver muitos usuários:

1. **Backend:** Railway Pro ou VPS (DigitalOcean $12/mês)
2. **Job Queue:** Adicionar Redis + BullMQ
3. **Cache:** Redis para rate limiting
4. **Monitoring:** Sentry, Datadog ou similar
5. **CDN:** Cloudflare (grátis) na frente

---

## Suporte

- 📄 Documentação completa: `PRODUCTION_CHECKLIST.md`
- 🧪 Testes: `backend/scripts/e2e-webhook.sh`
- 🔍 Verificação: `backend/scripts/verify-production.sh`
- 📊 Status: `STATUS_PRODUCAO.md`

**Dúvidas?** Verifique logs primeiro:
- Backend: `railway logs` ou `render logs`
- Frontend: `vercel logs`
- Banco: Supabase Dashboard → Logs

🎉 **Boa sorte com o lançamento!**
