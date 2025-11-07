#!/bin/bash

# Script de Deploy Automatizado
# Uso: ./deploy.sh [backend|frontend|both]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         🚀 Deploy Automatizado - AI E-commerce              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Função auxiliar
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}✗ $1 não está instalado${NC}"
    echo "  Instale com: npm install -g $2"
    exit 1
  fi
  echo -e "${GREEN}✓ $1 encontrado${NC}"
}

# Função para deploy backend
deploy_backend() {
  echo ""
  echo -e "${YELLOW}📦 DEPLOY BACKEND${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  check_command "railway" "@railway/cli"
  
  echo -e "${BLUE}1. Fazendo login no Railway...${NC}"
  railway login
  
  echo -e "${BLUE}2. Preparando backend...${NC}"
  cd backend
  
  echo -e "${BLUE}3. Inicializando projeto Railway...${NC}"
  railway init
  
  echo -e "${BLUE}4. Fazendo deploy...${NC}"
  railway up
  
  echo ""
  echo -e "${GREEN}✓ Backend deployado!${NC}"
  echo -e "${YELLOW}⚠️  Próximo passo: ADICIONE VARIÁVEIS DE AMBIENTE NO RAILWAY DASHBOARD${NC}"
  echo ""
  echo "Variáveis necessárias:"
  echo "  - DATABASE_URL"
  echo "  - API_KEY"
  echo "  - STRIPE_SECRET_KEY"
  echo "  - OPENAI_API_KEY"
  echo ""
  echo "URL do Railway:"
  railway status
  
  cd ..
}

# Função para deploy frontend
deploy_frontend() {
  echo ""
  echo -e "${YELLOW}🎨 DEPLOY FRONTEND${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  check_command "vercel" "vercel"
  
  echo -e "${BLUE}1. Fazendo login no Vercel...${NC}"
  vercel login
  
  echo -e "${BLUE}2. Preparando frontend...${NC}"
  cd website
  
  echo -e "${BLUE}3. Fazendo build...${NC}"
  npm run build
  
  echo -e "${BLUE}4. Fazendo deploy...${NC}"
  vercel --prod
  
  echo ""
  echo -e "${GREEN}✓ Frontend deployado!${NC}"
  echo -e "${YELLOW}⚠️  Próximo passo: ADICIONE VARIÁVEIS DE AMBIENTE NO VERCEL DASHBOARD${NC}"
  echo ""
  echo "Variáveis necessárias:"
  echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  echo "  - CLERK_SECRET_KEY"
  echo "  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  echo "  - STRIPE_SECRET_KEY"
  echo "  - STRIPE_WEBHOOK_SECRET"
  echo "  - BACKEND_URL (URL do Railway)"
  echo "  - BACKEND_API_KEY"
  
  cd ..
}

# Main
case "${1:-both}" in
  backend)
    deploy_backend
    ;;
  frontend)
    deploy_frontend
    ;;
  both)
    deploy_backend
    echo ""
    read -p "Backend concluído. Pressione ENTER para fazer deploy do frontend..."
    deploy_frontend
    ;;
  *)
    echo "Uso: $0 [backend|frontend|both]"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Deploy completo!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📋 Próximas etapas:"
echo "  1. Adicione variáveis de ambiente nos dashboards"
echo "  2. Configure webhook Stripe"
echo "  3. Teste a aplicação completa"
echo "  4. Monitore logs por 24h"
echo ""
echo "📚 Documentação: docs/DEPLOY_COMPLETO.md"
