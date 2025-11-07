# 🚀 DoP IA - Sistema Completo de E-commerce Inteligente

> **Status:** ✅ PRONTO PARA PRODUZIR | **Modo:** 🔒 Seguro (dry-run)

<div align="center">
  <img src="website/public/logo.svg" alt="DoP IA Logo" width="150"/>
  
  **E-commerce Inteligente com IA**
  
  Automatize 80% do seu atendimento com Inteligência Artificial
</div>

---

## 📖 Documentação Rápida

### 🎯 Comece por AQUI
- **[LEIA_PRIMEIRO.txt](docs/LEIA_PRIMEIRO.txt)** - Resumo visual (30 segundos)
- **[README_PRODUCAO.md](docs/README_PRODUCAO.md)** - Executivo (2 min)

### 🚀 Para Publicar
- **[SETUP_RAILWAY_VERCEL_OPENAI.md](docs/SETUP_RAILWAY_VERCEL_OPENAI.md)** - Setup Railway, Vercel e OpenAI ⭐
- **[QUICK_START.md](docs/QUICK_START.md)** - Deploy em 15 min
- **[PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md)** - Passo a passo

### 📊 Informações Detalhadas
- **[STATUS_PRODUCAO.md](docs/STATUS_PRODUCAO.md)** - Status completo do sistema
- **[PAGINAS_OVERVIEW.md](docs/PAGINAS_OVERVIEW.md)** - Todas as páginas e APIs

### 🔒 Segurança
- **[SECURITY-OWASP.md](docs/SECURITY-OWASP.md)** - Implementações de segurança

### 🔧 Webhooks e Backend
- **[WEBHOOK-BACKEND-GUIDE.md](docs/WEBHOOK-BACKEND-GUIDE.md)** - Guia de webhooks
- **[STATUS-WEBHOOK-BACKEND.md](docs/STATUS-WEBHOOK-BACKEND.md)** - Status de webhooks

---

## ✅ O que está pronto

### 🎨 Frontend (Next.js 16)
- ✅ Landing page com 8 seções
- ✅ Autenticação Clerk
- ✅ Checkout Stripe (3 planos)
- ✅ Dashboard
- ✅ 100% responsivo
- ✅ Segurança OWASP

### ⚙️ Backend (Node.js + Express)
- ✅ API Express
- ✅ Webhooks Stripe
- ✅ PostgreSQL (Supabase)
- ✅ Desativação automática
- ✅ Agendamento (1 dia carência)
- ✅ Logs estruturados
- ✅ Rate limiting

### 🤖 Bot IA
- ✅ OpenAI GPT-4o-mini
- ✅ Comandos: produto, rastreio
- ✅ Contexto de conversação
- ✅ Respostas inteligentes
- ✅ Modo dry-run (seguro)

---

## 🚀 Deploy Rápido (15 min)

Veja [QUICK_START.md](docs/QUICK_START.md) para instruções detalhadas.

### Backend
```bash
cd backend
railway login
railway init
railway up
```

### Frontend
```bash
cd website
vercel --prod
```

### Webhook Stripe
1. Acesse: https://dashboard.stripe.com/webhooks
2. Add: `https://seu-site.vercel.app/api/webhooks/stripe`
3. Eventos: checkout.session.*, customer.subscription.*

---

## 📋 Comandos Úteis

### Backend
```bash
cd backend

# Iniciar
npm start

# Health check
curl http://localhost:3001/health | jq .

# Verificação pré-deploy
./scripts/verify-production.sh

# Teste E2E
./scripts/e2e-webhook.sh

# Prisma Studio
npx prisma studio
```

### Frontend
```bash
cd website

# Dev
npm run dev

# Build
npm run build
```

---

## 🎯 Próximos Passos

1. **Leia:** [docs/LEIA_PRIMEIRO.txt](docs/LEIA_PRIMEIRO.txt)
2. **Siga:** [docs/QUICK_START.md](docs/QUICK_START.md)
3. **Implemente:** [docs/PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md)

---

## 🎉 Status Final

**Sistema 100% pronto para publicar em produção!**

- ✅ Frontend + Backend completos
- ✅ Bot IA funcionando
- ✅ Segurança implementada
- ✅ Documentação completa
- ✅ Modo seguro (dry-run) ativo

**Veja documentação em:** [`docs/`](docs/)
