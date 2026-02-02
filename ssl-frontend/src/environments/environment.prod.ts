export const environment = {
  production: true,
  apiUrl: 'https://api.ssl-space.com/api',
  wsUrl: 'wss://api.ssl-space.com/ws',

  // API endpoints
  endpoints: {
    auth: '/auth',
    orders: '/orders',
    deliveries: '/deliveries',
    stock: '/stock',
    products: '/products',
    suppliers: '/suppliers',
    invoices: '/invoices',
    payments: '/payments',
    missions: '/missions',
    notifications: '/notifications',
    reports: '/reports',
    dashboard: '/dashboard'
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },

  // File upload limits
  fileUpload: {
    maxSize: 5242880, // 5MB in bytes
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  },

  // Map configuration (for delivery tracking)
  map: {
    defaultCenter: { lat: 28.5383, lng: -81.3792 }, // NASA Kennedy Space Center
    defaultZoom: 10,
    apiKey: 'YOUR_PRODUCTION_GOOGLE_MAPS_API_KEY' // Replace with actual production key
  },

  // Notification settings
  notification: {
    duration: 3000, // milliseconds
    position: 'top-right'
  },

  // Feature flags
  features: {
    enableNotifications: true,
    enableRealTimeTracking: true,
    enableFileUpload: true,
    enableExport: true,
    enableAdvancedReports: true
  },

  // App metadata
  app: {
    name: 'SSL - Starlight Spacebridge Logistics',
    version: '1.0.0',
    logoUrl: '/assets/images/logo.png'
  }
};
