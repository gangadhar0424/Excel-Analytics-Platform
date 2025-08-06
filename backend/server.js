const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database connection
const { connectDB } = require('./config/db');

// Import middleware
const { corsMiddleware, errorHandler, rateLimiter } = require('./middleware/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const dataCleaningRoutes = require('./routes/dataCleaningRoutes');
const advancedAnalyticsRoutes = require('./routes/advancedAnalyticsRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');
const exportReportingRoutes = require('./routes/exportReportingRoutes');
const dataIntegrationRoutes = require('./routes/dataIntegrationRoutes');
const securityComplianceRoutes = require('./routes/securityComplianceRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const aiFeaturesRoutes = require('./routes/aiFeaturesRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting for all routes
// app.use(rateLimiter(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
// New Feature: Data Cleaning Tools
app.use('/api/data-cleaning', dataCleaningRoutes);
// New Feature: Advanced Analytics & Visualization
app.use('/api/advanced-analytics', advancedAnalyticsRoutes);
// New Feature: Collaboration & Sharing
app.use('/api/collaboration', collaborationRoutes);
// New Feature: Export & Reporting
app.use('/api/export-reporting', exportReportingRoutes);
// New Feature: Data Source Integrations
app.use('/api/data-integration', dataIntegrationRoutes);
// New Feature: Security & Compliance
app.use('/api/security-compliance', securityComplianceRoutes);
// New Feature: Performance & Scalability
app.use('/api/performance', performanceRoutes);
// New Feature: Notifications
app.use('/api/notifications', notificationsRoutes);
// New Feature: AI-Powered Features
app.use('/api/ai-features', aiFeaturesRoutes);

// File upload routes (to be implemented)
// app.use('/api/upload', uploadRoutes);

// Chart generation routes (to be implemented)
// app.use('/api/charts', chartRoutes);

// Admin routes (to be implemented)
// app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
