const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

async function generateReply(conversationContext, userMessage) {
  if (!config.openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const systemPrompt = `Você é um assistente de atendimento para e-commerce. Utilize o contexto da conversa para responder de forma curta, clara e objetiva. Ofereça opções de transferência para humano quando apropriado.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...((conversationContext || []).map(m => ({ role: 'user', content: m.message }))),
    { role: 'user', content: userMessage }
  ];

  try {
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${config.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const reply = resp.data.choices && resp.data.choices[0] && resp.data.choices[0].message && resp.data.choices[0].message.content;
    return reply || 'Desculpe, não consegui gerar uma resposta.';
  } catch (err) {
    logger.error('OpenAI error: %o', err.message);
    throw err;
  }
}

module.exports = { generateReply };
