// Centralized configuration module
// Reads all configuration from environment variables

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT configuration - must match Auth Service
  jwt: {
    secret: process.env.JWT_SECRET || '8TxBUpTP0MGfXm6KeAt8',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },
  
  // Backend microservices URLs
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'https://dsm-eventos-authservice.onrender.com',
    events: process.env.EVENTS_SERVICE_URL || 'https://dsmeventos-events-service.onrender.com',
    notification: process.env.NOTIFICATION_SERVICE_URL,
    orders: process.env.ORDERS_SERVICE_URL
  },
  
  // Mock configuration
  useMocks: process.env.USE_MOCKS === 'true',
  
  // Validate required environment variables
  validate: function() {
    const required = ['JWT_SECRET'];
    const missing = required.filter(name => !process.env[name]);
    
    if (missing.length > 0) {
      console.warn(`⚠️  Warning: Missing required environment variables: ${missing.join(', ')}`);
      console.warn('Using default values for development. Please configure .env file for production.');
    }
    
    // Log service URLs for debugging
    console.log('\n🔧 Service Configuration:');
    console.log(`   Auth Service: ${this.services.auth || 'NOT CONFIGURED'}`);
    console.log(`   Events Service: ${this.services.events || 'NOT CONFIGURED'}`);
    console.log(`   Notification Service: ${this.services.notification || 'USING MOCKS'}`);
    console.log(`   Orders Service: ${this.services.orders || 'USING MOCKS'}`);
    console.log(`   Use Mocks: ${this.useMocks}\n`);
  }
};
