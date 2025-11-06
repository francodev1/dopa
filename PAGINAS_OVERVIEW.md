# 📱 Páginas e Componentes - Overview Visual

## Frontend (Next.js)

### 🏠 Landing Page (`/`)
**Arquivo:** `website/src/app/page.tsx`

**Seções (ordem):**
1. **Hero** - Título principal + CTA adaptativo
   - Se não autenticado: "Começar Agora"
   - Se autenticado sem assinatura: "Assinar Agora"
   - Se com assinatura: mostra status e plano
   
2. **Features** - 6 funcionalidades principais
   - Atendimento 24/7
   - Respostas Inteligentes
   - Rastreamento de Pedidos
   - Catálogo Interativo
   - Analytics em Tempo Real
   - Fácil Integração

3. **How It Works** - 3 passos simples
   - Conectar → Configurar → Atender

4. **Pricing** - 3 planos
   - Starter: R$97/mês
   - Professional: R$197/mês
   - Business: R$397/mês
   - Cada card com botão de checkout

5. **Testimonials** - 3 depoimentos
   - Com fotos, nomes e empresas

6. **FAQ** - 8 perguntas frequentes
   - Acordeon expansível

7. **CTA** - Call to action final
   - Incentivo para começar

8. **Footer** - Links e informações
   - Produto, Empresa, Suporte, Legal

**Status:** ✅ Completo e responsivo

---

### 🔐 Autenticação

#### Login (`/login`)
**Arquivo:** `website/src/app/login/[[...login]]/page.tsx`
- Componente Clerk integrado
- Design customizado com marca
- Redirecionamento automático

#### Signup (`/signup`)
**Arquivo:** `website/src/app/signup/[[...signup]]/page.tsx`
- Formulário Clerk
- Validação automática
- Verificação de email

**Status:** ✅ Funcionando com Clerk

---

### 📊 Dashboard (`/dashboard`)
**Arquivo:** `website/src/app/dashboard/page.tsx`

**Conteúdo:**
- Cabeçalho com boas-vindas personalizado
- 4 cards de métricas (placeholder):
  - Conversas Hoje
  - Satisfação
  - Tempo Médio
  - Taxa de Resolução
- Primeiros Passos (3 ações rápidas):
  - Conectar WhatsApp
  - Configurar IA
  - Ver Analytics

**Proteção:** Requer autenticação (redirect para /login)

**Status:** ✅ Básico funcional (métricas em desenvolvimento)

---

## 🎨 Componentes

### Navbar
**Arquivo:** `website/src/components/sections/Navbar.tsx`

**Funcionalidades:**
- Logo + links de navegação
- Botões de Login/Dashboard (condicional)
- Responsive menu mobile
- Sticky on scroll

**Status:** ✅ Completo

---

### Hero
**Arquivo:** `website/src/components/sections/Hero.tsx`

**Recursos:**
- Animações Framer Motion
- Verificação de assinatura via API
- CTA dinâmico baseado em estado
- Background gradiente
- Responsivo

**Lógica:**
```typescript
// Verifica assinatura do usuário
const response = await fetch('/api/check-subscription')
const { hasSubscription, subscription } = await response.json()

// Adapta botão:
- Não logado → "Começar Agora" (scroll to pricing)
- Logado sem sub → "Assinar Agora" (scroll to pricing)
- Com sub ativa → mostra "Plano: X | Status: Y"
- Com sub cancelada → mostra agendamento de desativação
```

**Status:** ✅ Completo com lógica de subscription

---

### Features
**Arquivo:** `website/src/components/sections/Features.tsx`

**6 Features com ícones:**
- 🤖 Atendimento 24/7
- 💡 Respostas Inteligentes (GPT-4)
- 📦 Rastreamento de Pedidos
- 🛍️ Catálogo Interativo
- 📊 Analytics em Tempo Real
- ⚡ Fácil Integração

**Design:** Grid responsivo 3 colunas → 1 coluna mobile

**Status:** ✅ Completo

---

### HowItWorks
**Arquivo:** `website/src/components/sections/HowItWorks.tsx`

**3 Passos:**
1. Conectar (QR Code / API)
2. Configurar (IA e produtos)
3. Atender (automático 24/7)

**Design:** Timeline visual com números

**Status:** ✅ Completo

---

### Pricing
**Arquivo:** `website/src/components/sections/Pricing.tsx`

**3 Planos:**

| Starter | Professional | Business |
|---------|--------------|----------|
| R$97/mês | R$197/mês | R$397/mês |
| 500 msg/mês | 2000 msg/mês | 10000 msg/mês |
| 1 agente | 3 agentes | 10 agentes |

**Funcionalidades:**
- Botão "Assinar" chama `/api/create-checkout-session`
- Badge "Popular" no Professional
- Lista de recursos por plano
- Responsivo

**Status:** ✅ Completo com checkout funcionando

---

### Testimonials
**Arquivo:** `website/src/components/sections/Testimonials.tsx`

**3 Depoimentos:**
- Ana Silva - Loja de Roupas
- Carlos Santos - Marketplace
- Juliana Costa - E-commerce de Eletrônicos

**Design:** Cards com fotos, quotes e estrelas

**Status:** ✅ Completo (dados mock)

---

### FAQ
**Arquivo:** `website/src/components/sections/FAQ.tsx`

**8 Perguntas:**
1. Como funciona o bot?
2. Preciso de conhecimento técnico?
3. Quanto tempo para configurar?
4. Quais plataformas são suportadas?
5. Posso cancelar a qualquer momento?
6. Como funciona a integração?
7. Tem suporte técnico?
8. Quais são as formas de pagamento?

**Funcionalidade:** Acordeon expansível (Framer Motion)

**Status:** ✅ Completo

---

### CTA (Call to Action)
**Arquivo:** `website/src/components/sections/CTA.tsx`

**Conteúdo:**
- Título impactante
- Subtítulo
- Botão de ação
- Background gradiente

**Status:** ✅ Completo

---

### Footer
**Arquivo:** `website/src/components/sections/Footer.tsx`

**4 Colunas:**
- Produto (Features, Preços, Casos de Uso)
- Empresa (Sobre, Blog, Carreiras)
- Suporte (Ajuda, Docs, Contato)
- Legal (Privacidade, Termos)

**Rodapé:** Copyright + redes sociais

**Status:** ✅ Completo

---

## 🔌 APIs (Routes)

### `/api/create-checkout-session`
**Arquivo:** `website/src/app/api/create-checkout-session/route.ts`

**Método:** POST
**Body:** `{ priceId: string }`

**Fluxo:**
1. Valida autenticação (Clerk)
2. Rate limiting (5 req/min)
3. Valida priceId (whitelist)
4. Cria Stripe Checkout Session
5. Habilita coleta de telefone
6. Retorna URL de checkout

**Segurança:**
- ✅ Auth verificada
- ✅ Rate limiting
- ✅ Whitelist de prices
- ✅ Validação de inputs
- ✅ Logging

**Status:** ✅ Funcionando

---

### `/api/webhooks/stripe`
**Arquivo:** `website/src/app/api/webhooks/stripe/route.ts`

**Método:** POST (recebe do Stripe)

**Fluxo:**
1. Valida assinatura Stripe (webhook secret)
2. Processa evento
3. Extrai phone e customer do checkout
4. Encaminha para backend com API key
5. Retorna sucesso

**Eventos tratados:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Segurança:**
- ✅ Signature validation
- ✅ Payload validation
- ✅ Timeout 10s
- ✅ Logging de erros

**Status:** ✅ Funcionando

---

### `/api/check-subscription`
**Arquivo:** `website/src/app/api/check-subscription/route.ts`

**Método:** GET

**Fluxo:**
1. Verifica autenticação Clerk
2. Pega userId
3. Consulta backend: `GET /api/subscription/user/:userId`
4. Retorna subscription ou null

**Resposta:**
```json
{
  "hasSubscription": true,
  "subscription": {
    "id": "...",
    "plan": "Professional",
    "status": "active",
    "phone": "+5511999999999",
    "currentPeriodEnd": "2025-12-06T...",
    "scheduledDeactivationAt": null
  }
}
```

**Status:** ✅ Funcionando

---

## 🖥️ Backend Endpoints

### `GET /health`
**Resposta:**
```json
{
  "status": "ok",
  "env": "production",
  "timestamp": "2025-11-06...",
  "integrations": {
    "database": true,
    "openai": true,
    "whatsapp": {
      "configured": true,
      "dryRun": true
    },
    "stripe": true
  }
}
```

**Status:** ✅ Funcionando

---

### `POST /api/webhook/stripe`
**Auth:** API Key required
**Body:** Evento Stripe encaminhado

**Fluxo:**
1. Valida API key
2. Processa tipo de evento
3. Upsert subscription no banco
4. Agenda desativação se cancelado
5. Retorna `{ received: true }`

**Status:** ✅ Funcionando e testado

---

### `GET /api/subscription/user/:userId`
**Auth:** API Key required

**Resposta:**
```json
{
  "hasSubscription": false,
  "subscription": {
    "id": "...",
    "userId": "user_...",
    "phone": "+55...",
    "status": "canceled",
    "plan": "Professional",
    "scheduledDeactivationAt": "2025-11-07...",
    "deactivatedAt": null
  }
}
```

**Status:** ✅ Funcionando

---

### `POST /send-message`
**Auth:** API Key required
**Body:** `{ to: string, text: string }`

**Fluxo:**
1. Valida inputs
2. Se dry-run: apenas loga
3. Se não: chama whatsappService.sendWhatsAppMessage
4. Retorna resultado

**Status:** ✅ Funcionando (modo dry-run)

---

### `POST /webhook`
**Body:** Mensagem do WhatsApp

**Fluxo:**
1. Recebe mensagem entrante
2. Verifica comandos especiais:
   - `produto X` → busca no catálogo
   - `rastreio Y` → status do pedido
3. Se não for comando → consulta OpenAI
4. Responde automaticamente
5. Salva contexto de conversa

**Status:** ✅ Funcionando

---

## 🗄️ Banco de Dados (Prisma)

### Model: Subscription
```prisma
model Subscription {
  id                        String    @id @default(cuid())
  userId                    String    @unique
  phone                     String?
  stripeCustomerId          String?
  stripeSubscriptionId      String    @unique
  stripePriceId             String
  status                    String    // active, canceled, etc
  plan                      String?   // Starter, Professional, Business
  scheduledDeactivationAt   DateTime?
  deactivatedAt             DateTime?
  currentPeriodEnd          DateTime?
  canceledAt                DateTime?
  createdAt                 DateTime  @default(now())
  updatedAt                 DateTime  @updatedAt
}
```

**Status:** ✅ Migrado e funcionando

---

## 🎯 Fluxo Completo (Visual)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIO NO SITE                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Landing Page   │ (Hero, Features, Pricing, etc)
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Clerk Login    │ (Autenticação)
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Escolhe Plano  │ (Pricing section)
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────────────┐
        │ Stripe Checkout        │ (coleta email + telefone)
        │ /api/create-checkout   │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │ Pagamento Confirmado   │
        └────────┬───────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│                     STRIPE WEBHOOK                              │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Next.js valida       │ (/api/webhooks/stripe)
        │ assinatura Stripe    │
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Encaminha para       │
        │ Backend Express      │ (POST /api/webhook/stripe)
        └────────┬─────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSA                             │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Upsert Subscription  │ (PostgreSQL via Prisma)
        │ no Banco de Dados    │
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Subscription Ativa   │
        │ User pode usar bot   │
        └──────────────────────┘

═══════════════════════════════════════════════════════════════════

        ┌──────────────────────┐
        │ User CANCELA         │
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Stripe Webhook       │ (subscription.updated)
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Backend atualiza     │
        │ status = "canceled"  │
        │ canceledAt = now     │
        │ scheduledDeactivation│
        │ = +1 dia             │
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Agenda job de        │
        │ desativação          │ (setTimeout + sweep)
        └────────┬─────────────┘
                 │
                 │ (espera 1 dia)
                 │
                 ▼
        ┌──────────────────────┐
        │ Sweep detecta job    │ (a cada 5 min)
        │ scheduledDeactivation│
        │ <= now               │
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ performDeactivation  │
        └────────┬─────────────┘
                 │
                 ├─── DRY-RUN = true ──▶ Apenas loga ação
                 │
                 └─── DRY-RUN = false ─▶ Chama provider.deactivate()
                                         │
                                         ▼
                                    ┌────────────────┐
                                    │ Z-API / Twilio │
                                    │ desativa conta │
                                    └────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Marca deactivatedAt  │
        │ no banco             │
        └──────────────────────┘

═══════════════════════════════════════════════════════════════════

┌────────────────────────────────────────────────────────────────┐
│                     BOT IA EM AÇÃO                              │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Usuário manda msg    │ (WhatsApp)
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Provider envia       │ (webhook entrante)
        │ para /webhook        │
        └────────┬─────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Backend recebe       │
        │ whatsappController   │
        └────────┬─────────────┘
                 │
                 ├─── Comando "produto X" ──▶ ecommerceService.findProduct()
                 │
                 ├─── Comando "rastreio Y" ─▶ ecommerceService.trackOrder()
                 │
                 └─── Outra mensagem ───────▶ aiService.generateReply()
                                              │
                                              ▼
                                         ┌────────────────┐
                                         │ OpenAI GPT-4o  │
                                         │ gera resposta  │
                                         └────────┬───────┘
                 │                               │
                 ▼                               │
        ┌──────────────────────┐◀────────────────┘
        │ Responde usuário     │
        │ whatsappService      │
        │ .sendWhatsAppMessage │
        └────────┬─────────────┘
                 │
                 ├─── DRY-RUN = true ──▶ Apenas loga resposta
                 │
                 └─── DRY-RUN = false ─▶ Envia mensagem real
```

---

## 📊 Resumo de Status

| Componente | Status | Notas |
|------------|--------|-------|
| Landing Page | ✅ | 8 seções completas |
| Autenticação | ✅ | Clerk integrado |
| Dashboard | ✅ | Básico funcional |
| Checkout | ✅ | Stripe com telefone |
| Webhooks | ✅ | Validados e testados |
| Persistência | ✅ | PostgreSQL + Prisma |
| Agendamento | ✅ | 1 dia carência |
| Bot IA | ✅ | OpenAI integrado |
| WhatsApp | ⚠️ | Dry-run ativo |
| Desativação | ⚠️ | Dry-run ativo |

**Legenda:**
- ✅ Pronto para produção
- ⚠️ Funcional mas em modo seguro (dry-run)
- ❌ Não implementado

**Próximo passo:** Deploy e depois ativar WhatsApp real quando tiver provider.
