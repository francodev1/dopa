const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

async function sendWhatsAppMessage(to, text) {
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
    return resp.data;
  } catch (err) {
    logger.error('Error sending WhatsApp message: %o', err.message);
    throw err;
  }
}

module.exports = { sendWhatsAppMessage };
