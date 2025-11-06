const config = require('../config/config');

function requireApiKey(req, res, next) {
  const key = req.header('x-api-key') || req.query.apiKey;
  if (!key || key !== config.evolutionApiKey) return res.status(401).json({ error: 'unauthorized' });
  next();
}

module.exports = { requireApiKey };
