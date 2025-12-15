export const environment = {
  production: false,
  // The API Gateway URL from your README
  apiUrl: 'http://localhost:8080/api',
  appName: 'SSL - Starlight Spacebridge Logistics',
  endpoints: {
    auth: '/auth-service/api/auth',
    orders: '/api/purchase-orders',
    invoices: '/api/invoices',
    deliveries: '/api/livraisons',
    stock: '/api/stocks'
  }
};
