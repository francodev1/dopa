const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

async function sendWhatsAppMessage(to, text) {
  // Dry-run mode: apenas loga sem enviar
  if (config.whatsappDryRun) {
    logger.info('[DRY-RUN] Would send WhatsApp message', { to, text });
    return { dryRun: true, to, text };
  }

  if (!config.evolutionApiUrl || !config.evolutionApiKey) {
    logger.error('Evolution API not configured.');
    throw new Error('Evolution API not configured');
  }

  try {
    const resp = await axios.post(
      `${config.evolutionApiUrl}/messages`,
      { to, text },
      {
        headers: {
          'Authorization': `Bearer ${config.evolutionApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    logger.info('WhatsApp message sent successfully', { to });
    return resp.data;
  } catch (err) {
    logger.error('Error sending WhatsApp message: %o', err.message);
    throw err;
  }
}

async function deactivateContact(phone) {
  // Dry-run mode: apenas loga sem desativar
  if (config.whatsappDryRun) {
    logger.info('[DRY-RUN] Would deactivate contact', { phone });
    return { dryRun: true, phone, action: 'deactivate' };
  }

  if (!config.evolutionApiUrl || !config.evolutionApiKey) {
    logger.error('Evolution API not configured for deactivation.');
    throw new Error('Evolution API not configured');
  }

  const path = config.evolutionDeactivatePath;

  try {
    const resp = await axios.post(
      `${config.evolutionApiUrl}${path}`,
      { phone },
      {
        headers: {
          'Authorization': `Bearer ${config.evolutionApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    logger.info('Contact deactivated successfully', { phone });
    return resp.data;
  } catch (err) {
    logger.error('Error deactivating contact: %o', err.message);
    throw err;
  }
}

module.exports = { sendWhatsAppMessage, deactivateContact };
