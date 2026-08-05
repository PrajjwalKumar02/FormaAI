// backend/src/server.js
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
const { connectDB } = require('./config');

// Import middleware
const { protect } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const formRoutes = require('./routes/formRoutes');
const responseRoutes = require('./routes/responseRoutes');
const templateRoutes = require('./routes/templateRoutes');

// Initialize express
const app = express();

// ============ MIDDLEWARE ============

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

// ============ DATABASE CONNECTION ============

// Connect to MongoDB
connectDB();

// MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected');
});

// ============ ROUTES ============

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        message: 'Forma AI Backend is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Forma AI Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                me: 'GET /api/auth/me',
                profile: 'PUT /api/auth/profile',
                settings: 'PUT /api/auth/settings'
            },
            ai: {
                extract: 'POST /api/ai/extract',
                generate: 'POST /api/ai/generate',
                analyze: 'POST /api/ai/analyze'
            },
            forms: {
                list: 'GET /api/forms',
                create: 'POST /api/forms',
                detail: 'GET /api/forms/:id',
                update: 'PUT /api/forms/:id',
                delete: 'DELETE /api/forms/:id',
                submit: 'POST /api/forms/:id/submit'
            },
            responses: {
                list: 'GET /api/responses',
                detail: 'GET /api/responses/:id'
            },
            templates: {
                list: 'GET /api/templates',
                create: 'POST /api/templates',
                detail: 'GET /api/templates/:id'
            }
        },
        documentation: 'https://documenter.getpostman.com/view/your-docs'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/templates', templateRoutes);

// ============ ERROR HANDLING ============

// 404 Not Found
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
        availableEndpoints: {
            auth: '/api/auth',
            ai: '/api/ai',
            forms: '/api/forms',
            responses: '/api/responses',
            templates: '/api/templates'
        }
    });
});

// Global error handler
app.use(errorHandler);

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   🚀 Forma AI Backend Server Started                                      ║
║                                                                           ║
║   📡 Port:          ${PORT}                                                  ║
║   🌍 Environment:   ${process.env.NODE_ENV || 'development'}                                           ║
║   📍 API URL:       http://localhost:${PORT}/api                             ║
║   📊 Database:      ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}                                       ║
║   🔗 Client:        ${process.env.CLIENT_URL || 'http://localhost:5173'}                                 ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
    `);
});

// ============ GRACEFUL SHUTDOWN ============

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    if (err.stack) {
        console.error('Stack:', err.stack);
    }
    server.close(() => {
        console.log('💥 Server closed due to unhandled rejection');
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    if (err.stack) {
        console.error('Stack:', err.stack);
    }
    server.close(() => {
        console.log('💥 Server closed due to uncaught exception');
        process.exit(1);
    });
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            console.log('💥 Process terminated');
            process.exit(0);
        });
    });
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('✅ MongoDB connection closed');
            console.log('💥 Process terminated');
            process.exit(0);
        });
    });
});

module.exports = app;
