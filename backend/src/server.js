require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const config = require('./config/config');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requireApiKey } = require('./middleware/auth');
const webhookController = require('./controllers/webhookController');
const stripeWebhookController = require('./controllers/stripeWebhookController');
const subscriptionController = require('./controllers/subscriptionController');
const whatsappService = require('./services/whatsappService');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json({ limit: '200kb' }));
app.use(apiLimiter);

// Routes
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
    integrations: {
      database: !!config.databaseUrl,
      openai: !!config.openaiApiKey,
      whatsapp: {
        configured: !!(config.evolutionApiUrl && config.evolutionApiKey),
        dryRun: config.whatsappDryRun
      },
      stripe: !!process.env.STRIPE_SECRET_KEY
    }
  };
  res.json(health);
});

app.post('/webhook', (req, res) => webhookController.handleIncoming(req, res));

// Webhook do Stripe (recebe notificações do Next.js)
app.post('/api/webhook/stripe', requireApiKey, (req, res) => 
  stripeWebhookController.handleStripeWebhook(req, res)
);

// Public-ish endpoints to query subscription state. Kept behind API key in case
// you want to restrict access; frontend will call Next.js which can talk to backend
app.get('/api/subscription/user/:userId', requireApiKey, (req, res) =>
  subscriptionController.getByUserId(req, res)
);

app.get('/api/subscription/email/:email', requireApiKey, (req, res) =>
  subscriptionController.getByEmail(req, res)
);

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

// If running directly, schedule any pending deactivations
if (require.main === module) {
  // Defer requiring prisma until here to avoid cycles
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const stripeWebhookController = require('./controllers/stripeWebhookController');

  (async () => {
    try {
      const now = new Date();
      const subs = await prisma.subscription.findMany({ where: { scheduledDeactivationAt: { not: null } } });
      for (const s of subs) {
        const when = s.scheduledDeactivationAt ? new Date(s.scheduledDeactivationAt).getTime() : null;
        if (!when) continue;
        if (when <= Date.now()) {
          // run immediately via controller logic: reuse scheduleDeactivation if available
          try { await stripeWebhookController.handleStripeWebhook({ body: { event: 'subscription.deactivation_check', subscriptionId: s.stripeSubscriptionId, userId: s.userId } }, { json: () => {} }); } catch (err) { }
        } else {
          // schedule future job
          try { if (stripeWebhookController.scheduleDeactivation) stripeWebhookController.scheduleDeactivation(s.stripeSubscriptionId, when, s.userId); } catch (err) { }
        }
      }
    } catch (err) {
      console.error('Failed scheduling deactivations', err);
    }
  })();

  // Periodic sweep: every 5 minutes, find due scheduled deactivations and run them.
  const sweepIntervalMs = 5 * 60 * 1000;
  setInterval(async () => {
    try {
      const now = new Date();
      const due = await prisma.subscription.findMany({
        where: {
          scheduledDeactivationAt: { not: null, lte: now },
          deactivatedAt: null,
        }
      });
      for (const s of due) {
        try {
          await stripeWebhookController.performDeactivation(s.stripeSubscriptionId);
        } catch (err) {
          console.error('Error performing deactivation for', s.stripeSubscriptionId, err);
        }
      }
    } catch (err) {
      console.error('Periodic deactivation sweep failed', err);
    }
  }, sweepIntervalMs);
}
