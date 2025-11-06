const logger = require('../utils/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const whatsappService = require('../services/whatsappService');
const config = require('../config/config');
const Stripe = require('stripe');
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-10-29.clover' });
  } catch (err) {
    logger.warn('Failed to initialize Stripe client: %o', err.message || err);
    stripe = null;
  }
} else {
  logger.info('STRIPE_SECRET_KEY not set; Stripe client disabled in backend controller');
}

// In-memory scheduler for deactivation jobs (best-effort for dev)
const deactivationTimers = new Map();

function scheduleDeactivation(subscriptionId, whenMs, userId) {
  if (deactivationTimers.has(subscriptionId)) return;
  const delay = Math.max(0, whenMs - Date.now());
  const t = setTimeout(async () => {
    try {
      // Double-check DB status
      const sub = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscriptionId } });
      if (!sub) return;
      if (sub.status === 'active' || sub.status === 'trialing') return; // nothing to do

      // Perform deactivation (notify admin and attempt provider deactivation)
      const adminPhone = config.adminPhone;
      if (adminPhone) {
        await whatsappService.sendWhatsAppMessage(adminPhone, `Auto-desativação executada para assinatura ${subscriptionId} (user: ${userId}). status=${sub.status}`);
      }
      // TODO: call provider API to actually deactivate contact
    } catch (err) {
      logger.error('[DEACT JOB] error', err.message || err);
    } finally {
      deactivationTimers.delete(subscriptionId);
    }
  }, delay);
  deactivationTimers.set(subscriptionId, t);
}

// Best-effort deactivation function that can be called from timers or a periodic job
async function performDeactivation(subscriptionId) {
  try {
    const sub = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscriptionId } });
    if (!sub) return;
    if (sub.deactivatedAt) return; // already deactivated

    // Attempt provider deactivation using phone if available
    if (sub.phone) {
      try {
        await whatsappService.deactivateContact(sub.phone);
        await prisma.subscription.update({ where: { stripeSubscriptionId: subscriptionId }, data: { deactivatedAt: new Date() } });
        logger.info(`[DEACT] Subscription ${subscriptionId} deactivated (phone: ${sub.phone})`);
        return;
      } catch (err) {
        logger.error('[DEACT] Provider deactivation failed', err.message || err);
      }
    }

    // If no phone or provider failed, notify admin
    const adminPhone = config.adminPhone;
    if (adminPhone) {
      try {
        await whatsappService.sendWhatsAppMessage(adminPhone, `Falha ao desativar automaticamente assinatura ${subscriptionId}. Verificar manualmente.`);
      } catch (err) {
        logger.error('[DEACT] Failed to notify admin', err.message || err);
      }
    }
  } catch (err) {
    logger.error('[DEACT] performDeactivation error', err.message || err);
  }
}

/**
 * Webhook do Stripe (chamado pelo Next.js)
 * Recebe notificações de eventos de pagamento/assinatura
 */
exports.handleStripeWebhook = async (req, res) => {
  try {
    const { event, userId, subscriptionId, email, status } = req.body;

    logger.info('[STRIPE WEBHOOK]', {
      event,
      userId,
      subscriptionId,
      email,
      status,
    });

    // TODO: Salvar no banco de dados quando implementar
    // Por enquanto, apenas logamos

    switch (event) {
      case 'subscription.created':
        logger.info(`[STRIPE] Nova assinatura criada para user ${userId}`);
        try {
          if (!subscriptionId) {
            logger.warn('[STRIPE] subscription.created sem subscriptionId');
            break;
          }

          // Phone can be provided directly by the frontend webhook (preferred)
          let phone = req.body.phone || null;
          const custId = req.body.customer || req.body.customerId || req.body.stripeCustomerId || null;
          // If not provided, try to fetch from Stripe customer record
          if (!phone && custId) {
            try {
              const customer = await stripe.customers.retrieve(custId);
              phone = (customer && customer.phone) ? customer.phone : null;
            } catch (err) {
              // ignore customer fetch errors
            }
          }

          // Criar ou upsert da assinatura com phone se disponível
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscriptionId },
            create: {
              userId: userId || null,
              phone: phone || null,
              stripeCustomerId: custId || null,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: req.body.priceId || null,
              status: status || 'active',
              plan: null,
            },
            update: {
              userId: userId || undefined,
              phone: phone || undefined,
              status: status || undefined,
              updatedAt: new Date(),
            },
          });

          // TODO: Enviar email de boas-vindas
          // TODO: Ativar acesso ao WhatsApp bot
        } catch (dbErr) {
          logger.error('[STRIPE] Erro ao persistir subscription.created', dbErr);
        }

        break;

      case 'subscription.updated':
        logger.info(`[STRIPE] Assinatura ${subscriptionId} atualizada para status: ${status}`);
        try {
          if (!subscriptionId) {
            logger.warn('[STRIPE] subscription.updated sem subscriptionId');
            break;
          }

          // Update status and schedule deactivation if needed
          const updateData = {
            status: status || undefined,
            updatedAt: new Date(),
          };

          if (status === 'canceled' || status === 'unpaid') {
            const now = new Date();
            const graceMs = 1 * 24 * 60 * 60 * 1000; // 1 day
            const scheduled = new Date(now.getTime() + graceMs);
            updateData.canceledAt = now;
            updateData.scheduledDeactivationAt = scheduled;
          }

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: updateData,
          });

          if (status === 'canceled' || status === 'unpaid') {
            logger.warn(`[STRIPE] Acesso do usuário ${userId} será desativado após carência`);
            // schedule in-memory job (best-effort)
            const sub = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subscriptionId } });
            if (sub && sub.scheduledDeactivationAt) {
              scheduleDeactivation(subscriptionId, new Date(sub.scheduledDeactivationAt).getTime(), userId);
            }
          }
        } catch (dbErr) {
          logger.error('[STRIPE] Erro ao persistir subscription.updated', dbErr);
        }

        break;

      case 'subscription.canceled':
        logger.warn(`[STRIPE] Assinatura ${subscriptionId} cancelada`);
        try {
          if (!subscriptionId) {
            logger.warn('[STRIPE] subscription.canceled sem subscriptionId');
            break;
          }

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              status: 'canceled',
              canceledAt: new Date(),
              updatedAt: new Date(),
            },
          });

          // TODO: Desativar acesso
          // TODO: Enviar email de feedback
        } catch (dbErr) {
          logger.error('[STRIPE] Erro ao persistir subscription.canceled', dbErr);
        }

        break;

      default:
        logger.info(`[STRIPE] Evento não tratado: ${event}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('[STRIPE WEBHOOK ERROR]', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Expose scheduler for server startup reuse
exports.scheduleDeactivation = scheduleDeactivation;
exports.performDeactivation = performDeactivation;
