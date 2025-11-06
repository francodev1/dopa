const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const config = require('./config/config');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requireApiKey } = require('./middleware/auth');
const webhookController = require('./controllers/webhookController');
const whatsappService = require('./services/whatsappService');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: '200kb' }));
app.use(apiLimiter);

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok', env: config.nodeEnv }));

app.post('/webhook', (req, res) => webhookController.handleIncoming(req, res));

app.post('/send-message', requireApiKey, async (req, res) => {
  try {
    const { to, text } = req.body;
    if (!to || !text) return res.status(400).json({ error: 'to and text are required' });
    const resp = await whatsappService.sendWhatsAppMessage(to, text);
    res.json({ ok: true, resp });
  } catch (err) {
    logger.error('send-message error: %o', err.message);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Export app for testing; only listen when run directly
if (require.main === module) {
  app.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
    console.log(`Server listening on port ${config.port}`);
  });
}

module.exports = app;
