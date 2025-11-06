const logger = require('../utils/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const sub = await prisma.subscription.findFirst({ where: { userId } });
    if (!sub) return res.json({ hasSubscription: false });

    return res.json({
      hasSubscription: sub.status === 'active' || sub.status === 'trialing',
      subscription: sub,
    });
  } catch (err) {
    logger.error('getByUserId error: %o', err.message || err);
    res.status(500).json({ error: 'internal_error' });
  }
};

exports.getByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ error: 'email required' });

    const sub = await prisma.subscription.findFirst({ where: { stripeCustomerId: email } });
    // Note: stripeCustomerId may contain the Stripe customer id, not email. This route
    // is provided for convenience in case email was stored in stripeCustomerId by the webhook.
    if (!sub) return res.json({ hasSubscription: false });

    return res.json({
      hasSubscription: sub.status === 'active' || sub.status === 'trialing',
      subscription: sub,
    });
  } catch (err) {
    logger.error('getByEmail error: %o', err.message || err);
    res.status(500).json({ error: 'internal_error' });
  }
};
