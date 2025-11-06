# AI E-commerce Agent

Agente de IA para automação de atendimento em e-commerce.

## Features
- Integração com WhatsApp (Evolution API)
- Assistente de IA (OpenAI GPT-4o-mini)
- Consulta de produtos, rastreamento de pedidos, FAQ e transferência para humano
- Logs estruturados (Winston), rate limiting e segurança (helmet, cors)

## Tecnologias
- Node.js, Express
- OpenAI (GPT-4o-mini via REST)
- Axios, Winston

## Como instalar
1. Copie `.env.example` para `.env` e preencha as variáveis.
2. Abra o diretório `backend` e rode:

```bash
npm install
```

## Como rodar

```bash
npm start
```

## Variáveis de ambiente
- PORT
- OPENAI_API_KEY
- EVOLUTION_API_URL
- EVOLUTION_API_KEY
- DATABASE_URL
- NODE_ENV

## Endpoints (resumo)
- GET /health
- POST /webhook
- POST /send-message

## Roadmap
- Persistir conversas em banco
- Suporte multi-tenant
- Integração com Stripe
