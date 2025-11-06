# Deployment

## Requisitos
- Servidor com Node.js 18+
- Variáveis de ambiente configuradas
- HTTPS habilitado

## Opções de Deploy

### 1. VPS (Digital Ocean, AWS EC2, etc)
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar repositório
git clone https://github.com/francodev1/ai-ecommerce-agent.git
cd ai-ecommerce-agent/backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp ../.env.example .env
nano .env

# Usar PM2 para manter processo no ar
sudo npm install -g pm2
pm2 start src/server.js --name ai-agent
pm2 startup
pm2 save
```

### 2. Heroku
```bash
# No diretório backend
heroku create ai-ecommerce-agent
heroku config:set OPENAI_API_KEY=your_key
heroku config:set EVOLUTION_API_URL=your_url
heroku config:set EVOLUTION_API_KEY=your_key
git push heroku main
```

### 3. Vercel (Serverless)
- Configure como função serverless
- Adicione variáveis de ambiente no painel

## Segurança
- Use HTTPS obrigatório
- Configure firewall para limitar acesso
- Proteja endpoints com autenticação
- Monitore logs regularmente

## Webhook
- Configure o webhook no painel do Evolution API
- URL: `https://seu-dominio.com/webhook`
- Método: POST
