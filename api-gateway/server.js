// API Gateway Server
// Central entry point for all frontend requests
// Routes requests to appropriate backend microservices

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const config = require('./config');

// Routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const ordersRoutes = require('./routes/orders');

// Load environment variables
dotenv.config();

// Validate configuration
config.validate();

const app = express();
const PORT = config.port;

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'API Gateway is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    services: {
      auth: config.services.auth ? 'configured' : 'not configured',
      events: config.services.events ? 'configured' : 'not configured',
      notification: config.services.notification ? 'configured' : 'using mocks',
      orders: config.services.orders ? 'configured' : 'using mocks'
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/orders', ordersRoutes);

// Legacy routes support (for backward compatibility)
app.use('/auth', authRoutes);
app.use('/users', authRoutes);
app.use('/events', eventRoutes);
app.use('/orders', ordersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log(`   CORS Origin: ${config.cors.origin}\n`);
});