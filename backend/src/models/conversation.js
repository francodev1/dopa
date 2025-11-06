// In-memory conversation store (placeholder for DB)
const conversations = new Map();

function saveConversation(id, message) {
  if (!conversations.has(id)) conversations.set(id, []);
  conversations.get(id).push({ timestamp: Date.now(), message });
}

function getConversation(id) {
  return conversations.get(id) || [];
}

module.exports = { saveConversation, getConversation };
