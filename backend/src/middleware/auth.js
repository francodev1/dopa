const config = require('../config/config');

function requireApiKey(req, res, next) {
  // Suporta Bearer token e x-api-key header
  const authHeader = req.header('authorization');
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  const key = bearerToken || req.header('x-api-key') || req.query.apiKey;
  
  if (!key || key !== config.apiKey) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  
  next();
}

module.exports = { requireApiKey };
