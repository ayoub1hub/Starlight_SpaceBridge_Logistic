// src/environments/environment.ts
export const environment = {
  production: false,

  // API Configuration
  apiUrl: 'http://localhost:8080',

  // Keycloak Configuration
  keycloak: {
    url: 'http://localhost:8079',
    realm: 'ssl-realm',
    clientId: 'ssl-web',
    clientSecret: 'vdd2uGlNY9WXUXRtsyn23fNSjQWDc6mT', 
  },

  // API Endpoints
  endpoints: {
    auth: '/api/auth',
    orders: '/api/orders',
    invoices: '/api/invoices',
    deliveries: '/api/deliveries',
    stock: '/api/stocks',
    suppliers: '/api/suppliers',
    products: '/api/products',
    vente: '/api/vente',
    payments: '/api/payments'
  }
};
