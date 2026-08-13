const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

// Import config
const connectDB = require('./config/database');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const formRoutes = require('./routes/formRoutes');
const responseRoutes = require('./routes/responseRoutes');
const templateRoutes = require('./routes/templateRoutes');

// Initialize express
const app = express();

// ================================================================
//  MIDDLEWARE
// ================================================================

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// ✅ UPDATED CORS - Allow all origins for development
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Total-Count']
}));

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (for uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

// ================================================================
//  ROUTES
// ================================================================

// Health check
app.get('/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(200).json({
        success: true,
        status: 'OK',
        message: 'Forma AI Backend is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: isConnected ? 'Connected' : 'Disconnected',
        database: mongoose.connection.name || 'N/A'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({
        name: 'Forma AI Backend API',
        version: '1.0.0',
        status: 'running',
        database: isConnected ? '✅ Connected' : '❌ Disconnected',
        endpoints: {
            auth: '/api/auth',
            ai: '/api/ai',
            incidents: '/api/incidents',
            forms: '/api/forms'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ai', incidentRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/templates', templateRoutes);

// ================================================================
//  ERROR HANDLING
// ================================================================

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

// Global error handler
app.use(errorHandler);

// ================================================================
//  START SERVER
// ================================================================

const PORT = process.env.PORT || 5000;

// ✅ START SERVER AFTER DATABASE CONNECTION
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        // Then start the server
        const server = app.listen(PORT, () => {
            const isConnected = mongoose.connection.readyState === 1;
            console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   🚀 Forma AI Backend Server Started                                      ║
║                                                                           ║
║   📡 Port:          ${PORT}                                                  ║
║   🌍 Environment:   ${process.env.NODE_ENV || 'development'}                   ║
║   📍 API URL:       http://localhost:${PORT}/api                           ║
║   📊 Database:      ${isConnected ? '✅ Connected' : '❌ Disconnected'}         ║
║   📁 Database Name: ${mongoose.connection.name || 'N/A'}                   ║
║   🔗 Client:        ${process.env.CLIENT_URL || 'http://localhost:5173'}   ║
║                                                                           ║
║   📋 Endpoints:                                                           ║
║   - GET  /health                      Health check                        ║
║   - POST /api/auth/register           Register user                       ║
║   - POST /api/auth/login              Login user                          ║
║   - POST /api/ai/extract              AI extraction                       ║
║   - POST /api/ai/generate             AI form generation                  ║
║   - GET  /api/incidents               Get all incidents                   ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
            `);
        });

        // Graceful shutdown
        process.on('unhandledRejection', (err) => {
            console.error('❌ Unhandled Rejection:', err.message);
            server.close(() => process.exit(1));
        });

        process.on('uncaughtException', (err) => {
            console.error('❌ Uncaught Exception:', err.message);
            server.close(() => process.exit(1));
        });

        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM received. Shutting down...');
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('✅ MongoDB connection closed');
                    process.exit(0);
                });
            });
        });

        process.on('SIGINT', () => {
            console.log('👋 SIGINT received. Shutting down...');
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('✅ MongoDB connection closed');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

// ✅ Call the start function
startServer();

module.exports = app;
