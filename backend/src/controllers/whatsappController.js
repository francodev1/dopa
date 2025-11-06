const whatsappService = require('../services/whatsappService');
const { saveConversation, getConversation } = require('../models/conversation');
const aiService = require('../services/aiService');
const ecommerce = require('../services/ecommerceService');
const logger = require('../utils/logger');

async function handleIncoming(req, res) {
  /*
    Expects JSON:
    {
      from: '<phone>',
      body: '<message>',
      conversationId: '<id>'
    }
  */
  try {
    const { from, body, conversationId } = req.body;
    if (!from || !body) return res.status(400).json({ error: 'from and body required' });

    saveConversation(conversationId || from, { from, message: body });

    // Simple commands handling
    const lower = body.toLowerCase();
    if (lower.startsWith('produto')) {
      const q = body.replace(/produto/i, '').trim();
      const found = ecommerce.findProduct(q);
      const text = found.length ? `Encontrei ${found.length} produtos:\n${found.map(p => `${p.name} - R$${p.price}`).join('\n')}` : 'Nenhum produto encontrado.';
      await whatsappService.sendWhatsAppMessage(from, text);
      return res.json({ ok: true });
    }

    if (lower.startsWith('rastreio')) {
      const id = body.replace(/rastreio/i, '').trim();
      const order = ecommerce.trackOrder(id);
      const text = order ? `Pedido ${order.id}: ${order.status} — previsão ${order.eta}` : 'Pedido não encontrado.';
      await whatsappService.sendWhatsAppMessage(from, text);
      return res.json({ ok: true });
    }

    // Use AI for fallback / FAQ
    const context = getConversation(conversationId || from);
    const reply = await aiService.generateReply(context, body);

    saveConversation(conversationId || from, { from: 'bot', message: reply });
    await whatsappService.sendWhatsAppMessage(from, reply);

    res.json({ ok: true });
  } catch (err) {
    logger.error('handleIncoming error: %o', err.message);
    res.status(500).json({ error: 'internal_error' });
  }
}

module.exports = { handleIncoming };
