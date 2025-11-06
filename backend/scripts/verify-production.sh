#!/bin/bash

# Script de Verificação Pré-Produção
# Verifica todos os componentes antes do deploy

set -e

echo "🔍 Verificando configuração para produção..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Função auxiliar
check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $1"
  else
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
  fi
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARNINGS++))
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Verificando Variáveis de Ambiente"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f .env ]; then
  source .env
  check ".env encontrado"
else
  echo -e "${RED}✗${NC} .env não encontrado!"
  ((ERRORS++))
  exit 1
fi

# Verificar variáveis críticas
[ ! -z "$DATABASE_URL" ] && check "DATABASE_URL configurado" || { echo -e "${RED}✗${NC} DATABASE_URL faltando"; ((ERRORS++)); }
[ ! -z "$API_KEY" ] && check "API_KEY configurado" || { echo -e "${RED}✗${NC} API_KEY faltando"; ((ERRORS++)); }
[ ! -z "$STRIPE_SECRET_KEY" ] && check "STRIPE_SECRET_KEY configurado" || { echo -e "${RED}✗${NC} STRIPE_SECRET_KEY faltando"; ((ERRORS++)); }

# Verificar variáveis opcionais mas importantes
[ ! -z "$OPENAI_API_KEY" ] && check "OPENAI_API_KEY configurado (bot IA)" || warn "OPENAI_API_KEY faltando (bot não funcionará)"

# Verificar WhatsApp
if [ "$WHATSAPP_DRY_RUN" = "true" ]; then
  echo -e "${YELLOW}⚠${NC} WHATSAPP_DRY_RUN=true (modo seguro)"
else
  if [ -z "$EVOLUTION_API_URL" ] || [ -z "$EVOLUTION_API_KEY" ]; then
    warn "WHATSAPP_DRY_RUN=false mas credenciais Evolution faltando"
  else
    check "WhatsApp configurado (modo ativo)"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Verificando Dependências"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ -d node_modules ] && check "node_modules instalado" || { echo -e "${RED}✗${NC} node_modules faltando - execute npm install"; ((ERRORS++)); }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Verificando Prisma"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npx prisma validate > /dev/null 2>&1; then
  check "Schema Prisma válido"
else
  echo -e "${RED}✗${NC} Schema Prisma inválido"
  ((ERRORS++))
fi

if [ -d node_modules/.prisma/client ]; then
  check "Prisma Client gerado"
else
  warn "Prisma Client não gerado - execute: npx prisma generate"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Testando Conexão com Banco"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if timeout 5 npx prisma db pull --force > /dev/null 2>&1; then
  check "Conexão com banco OK"
else
  echo -e "${RED}✗${NC} Não foi possível conectar ao banco"
  ((ERRORS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Verificando Estrutura de Arquivos"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FILES=(
  "src/server.js"
  "src/config/config.js"
  "src/services/whatsappService.js"
  "src/services/aiService.js"
  "src/controllers/stripeWebhookController.js"
  "src/controllers/subscriptionController.js"
  "prisma/schema.prisma"
)

for file in "${FILES[@]}"; do
  [ -f "$file" ] && check "$file" || { echo -e "${RED}✗${NC} $file faltando"; ((ERRORS++)); }
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Testando Servidor (5 segundos)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Iniciar servidor em background
timeout 5 node -r dotenv/config src/server.js > /tmp/server-test.log 2>&1 &
SERVER_PID=$!
sleep 2

# Testar health endpoint
HEALTH=$(curl -s http://localhost:3001/health 2>/dev/null || echo '{"status":"error"}')
STATUS=$(echo "$HEALTH" | jq -r '.status' 2>/dev/null || echo "error")

if [ "$STATUS" = "ok" ]; then
  check "Servidor respondendo (/health)"
  
  # Verificar integrações
  DB_OK=$(echo "$HEALTH" | jq -r '.integrations.database' 2>/dev/null)
  OPENAI_OK=$(echo "$HEALTH" | jq -r '.integrations.openai' 2>/dev/null)
  WHATSAPP_OK=$(echo "$HEALTH" | jq -r '.integrations.whatsapp.configured' 2>/dev/null)
  DRY_RUN=$(echo "$HEALTH" | jq -r '.integrations.whatsapp.dryRun' 2>/dev/null)
  
  [ "$DB_OK" = "true" ] && check "  Database integrado" || warn "  Database não configurado"
  [ "$OPENAI_OK" = "true" ] && check "  OpenAI integrado" || warn "  OpenAI não configurado"
  [ "$WHATSAPP_OK" = "true" ] && check "  WhatsApp integrado" || warn "  WhatsApp não configurado"
  [ "$DRY_RUN" = "true" ] && echo -e "  ${YELLOW}⚠${NC} WhatsApp em DRY-RUN (seguro)" || echo -e "  ${GREEN}✓${NC} WhatsApp ATIVO"
else
  echo -e "${RED}✗${NC} Servidor não respondeu corretamente"
  ((ERRORS++))
fi

# Matar processo
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Segurança"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar comprimento da API key
if [ ! -z "$API_KEY" ]; then
  KEY_LENGTH=${#API_KEY}
  if [ $KEY_LENGTH -ge 32 ]; then
    check "API_KEY suficientemente forte (${KEY_LENGTH} chars)"
  else
    warn "API_KEY curta demais (${KEY_LENGTH} chars, recomendado 32+)"
  fi
fi

# Verificar se há secrets no código
if grep -r "sk_test_\|sk_live_\|pk_test_\|pk_live_" src/ 2>/dev/null | grep -v ".env" > /dev/null; then
  warn "Possíveis secrets hardcoded no código!"
else
  check "Nenhum secret hardcoded detectado"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ Nenhum erro crítico encontrado!${NC}"
else
  echo -e "${RED}✗ $ERRORS erro(s) crítico(s) encontrado(s)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}⚠ $WARNINGS aviso(s)${NC}"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}🚀 Sistema pronto para deploy!${NC}"
  if [ "$WHATSAPP_DRY_RUN" = "true" ]; then
    echo -e "${YELLOW}💡 Lembre-se: WhatsApp está em DRY-RUN (seguro para teste)${NC}"
  fi
  exit 0
else
  echo -e "${RED}❌ Corrija os erros antes de fazer deploy${NC}"
  exit 1
fi
