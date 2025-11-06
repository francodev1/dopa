# Checklist de Produção - AI E-commerce Agent

## ✅ Pré-requisitos Completados

### Backend
- [x] Express server com webhooks Stripe
- [x] Persistência PostgreSQL via Prisma
- [x] Agendamento de desativações (1 dia de carência)
- [x] Modo dry-run para WhatsApp (seguro para teste)
- [x] Logging estruturado com Winston
- [x] Rate limiting e middleware de autenticação
- [x] Endpoints de health check

### Frontend
- [x] Landing page completa com todas seções
- [x] Autenticação Clerk
- [x] Checkout Stripe com coleta de telefone
- [x] Dashboard básico
- [x] Verificação de assinatura

### Bot IA
- [x] Integração OpenAI (GPT-4o-mini)
- [x] Sistema de conversas
- [x] Comandos básicos (produto, rastreio)
- [x] Modo dry-run configurado

---

## 🚀 Deploy Rápido (Modo Seguro)

### 1. Backend - Preparar Ambiente

```bash
cd backend

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Aplicar migrations no banco de produção
npx prisma migrate deploy

# Verificar conexão
npx prisma db pull
```

### 2. Configurar Variáveis de Ambiente

**Backend (.env):**
```bash
# Essenciais
PORT=3001
NODE_ENV=production
DATABASE_URL="postgresql://..."  # Supabase URL
API_KEY="<gerar-chave-segura>"   # openssl rand -hex 32

# Stripe
STRIPE_SECRET_KEY="sk_live_..."  # Chave LIVE do Stripe

# OpenAI (bot)
OPENAI_API_KEY="sk-..."

# WhatsApp - MANTER DRY-RUN ATÉ TESTAR
WHATSAPP_DRY_RUN=true
EVOLUTION_API_URL=https://sua-instancia.z-api.io
EVOLUTION_API_KEY=seu_token_aqui
EVOLUTION_DEACTIVATE_PATH=/logout  # ou /contacts/deactivate

# Admin
ADMIN_PHONE=+5511999999999
```

**Frontend (.env.local):**
```bash
# Clerk (produção)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Backend
BACKEND_URL="https://seu-backend.com"
BACKEND_API_KEY="<mesma-chave-do-backend>"
```

### 3. Testar Localmente Antes de Deploy

```bash
# Backend
cd backend
npm start  # Deve mostrar "Server listening on port 3001"

# Em outro terminal - testar health
curl http://localhost:3001/health

# Verificar dry-run está ativo
# Resposta deve mostrar: "whatsapp": { "dryRun": true }

# Frontend
cd ../website
npm run build
npm start
```

### 4. Deploy Backend (exemplo Render/Railway/Fly.io)

**Render.com:**
1. Criar Web Service
2. Conectar repositório GitHub
3. Build Command: `cd backend && npm install && npx prisma generate`
4. Start Command: `cd backend && npm start`
5. Adicionar todas variáveis de ambiente
6. Deploy

**Railway:**
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login e deploy
cd backend
railway login
railway init
railway up
```

### 5. Deploy Frontend (Vercel - Recomendado)

```bash
cd website

# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Ou conectar GitHub no dashboard Vercel
```

### 6. Configurar Webhooks

**Stripe:**
1. Dashboard Stripe → Developers → Webhooks
2. Adicionar endpoint: `https://seu-frontend.vercel.app/api/webhooks/stripe`
3. Eventos: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copiar WEBHOOK_SECRET e adicionar ao `.env.local`

---

## ⚠️ IMPORTANTE - Modo Seguro

### Fase 1: Deploy Inicial (DRY-RUN)
- ✅ Deploy com `WHATSAPP_DRY_RUN=true`
- ✅ Testar checkout completo
- ✅ Verificar logs de desativação (sem executar)
- ✅ Confirmar webhooks funcionando

### Fase 2: Ativar WhatsApp (quando tiver provider)
1. Obter credenciais do provider (Z-API, Twilio, Meta Cloud)
2. Testar endpoint manualmente:
```bash
curl -X POST "https://sua-api/messages" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to":"+5511999999999","text":"Teste"}'
```
3. Se sucesso, atualizar backend: `WHATSAPP_DRY_RUN=false`
4. Monitorar logs por 24h

---

## 📊 Monitoramento Pós-Deploy

### Health Checks
```bash
# Backend
curl https://seu-backend.com/health

# Resposta esperada:
{
  "status": "ok",
  "env": "production",
  "timestamp": "...",
  "integrations": {
    "database": true,
    "openai": true,
    "whatsapp": {
      "configured": true,
      "dryRun": true  # false quando ativar
    },
    "stripe": true
  }
}
```

### Logs Importantes
```bash
# Ver logs backend (Render/Railway)
railway logs

# Ver logs frontend (Vercel)
vercel logs
```

### Métricas a Monitorar
- [ ] Taxa de erro em webhooks (<1%)
- [ ] Tempo de resposta do bot (<2s)
- [ ] Jobs de desativação executados
- [ ] Erros de provider (quando ativar)

---

## 🔒 Segurança - Verificações Finais

- [ ] API_KEY é forte e única (32+ chars)
- [ ] Webhook signature validation ativa
- [ ] Rate limiting configurado
- [ ] CORS restrito (não usar '*' em prod)
- [ ] HTTPS em todos endpoints
- [ ] Secrets em variáveis de ambiente (nunca no código)
- [ ] Prisma migrations aplicadas
- [ ] Logs não expõem PII completo

---

## 🐛 Troubleshooting Comum

### Backend não inicia
```bash
# Verificar variáveis
node -e "console.log(process.env.DATABASE_URL)"

# Testar conexão DB
npx prisma db pull

# Regenerar Prisma Client
npx prisma generate
```

### Webhook não recebe eventos
1. Verificar URL no Stripe Dashboard
2. Testar com Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
3. Verificar STRIPE_WEBHOOK_SECRET correto

### Desativações não executam
1. Verificar `scheduledDeactivationAt` no banco:
```bash
npx prisma studio
```
2. Verificar logs do sweep periódico
3. Se dry-run, é esperado (apenas logs)

---

## 📈 Próximos Passos (Pós-MVP)

### Curto Prazo
- [ ] Migrar scheduler para Redis + BullMQ
- [ ] Implementar adapters multi-provider
- [ ] Dashboard com métricas reais
- [ ] Testes E2E automatizados

### Médio Prazo
- [ ] Multi-tenant (ProviderConfig por cliente)
- [ ] Customer portal (Stripe)
- [ ] Webhooks incoming do WhatsApp
- [ ] Retry logic robusto

### Longo Prazo
- [ ] Auto-scaling workers
- [ ] Machine learning para classificação
- [ ] Analytics avançado
- [ ] Mobile app

---

## 📞 Suporte

- Logs backend: `backend/logs/combined.log`
- Prisma Studio: `npx prisma studio`
- Health check: `/health` endpoint
- E2E test: `backend/scripts/e2e-webhook.sh`

**Estado atual:** ✅ Pronto para deploy em modo seguro (dry-run)
