const dotenv = require('dotenv');
const path = require('path');

// Carrega .env do diretório backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 3001,
  apiKey: process.env.API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  evolutionApiUrl: process.env.EVOLUTION_API_URL,
  evolutionApiKey: process.env.EVOLUTION_API_KEY,
  evolutionDeactivatePath: process.env.EVOLUTION_DEACTIVATE_PATH || '/contacts/deactivate',
  whatsappDryRun: process.env.WHATSAPP_DRY_RUN === 'true',
  adminPhone: process.env.ADMIN_PHONE || null,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development'
};
