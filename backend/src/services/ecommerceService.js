// Mock ecommerce service - substitute with real integration

const products = [
  { id: 'p1', name: 'Tênis Esportivo', price: 199.9, stock: 12 },
  { id: 'p2', name: 'Camiseta Básica', price: 59.9, stock: 50 }
];

const orders = [
  { id: 'o1', status: 'Em trânsito', eta: '2025-11-10' },
  { id: 'o2', status: 'Entregue', eta: '2025-10-30' }
];

function findProduct(query) {
  const q = (query || '').toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(q));
}

function getProductById(id) {
  return products.find(p => p.id === id) || null;
}

function trackOrder(orderId) {
  return orders.find(o => o.id === orderId) || null;
}

module.exports = { findProduct, getProductById, trackOrder };
