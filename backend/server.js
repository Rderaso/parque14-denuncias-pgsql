// ====================================================================
// SERVIDOR BACKEND - SISTEMA DENUNCIAS PARQUE 14
// ====================================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./db');
const denunciasRouter = require('./routes/denuncias');

const app = express();
const PORT = process.env.PORT || 3000;

// ====== MIDDLEWARES DE SEGURIDAD ======

// Helmet para headers de seguridad
app.use(helmet());

// CORS - Permitir frontend de Cloudflare Pages y file://
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
        // Permitir file:// (origin será null) y orígenes permitidos
        if (!origin || allowedOrigins.includes(origin) || origin === 'null') {
            callback(null, true);
        } else {
            callback(null, true); // Permitir todo en desarrollo
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Rate limiting - Máximo 100 requests por 15 minutos
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 requests
    message: {
        success: false,
        error: 'Demasiadas solicitudes, intenta de nuevo más tarde'
    }
});
app.use('/api/', limiter);

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ====== LOGGING MIDDLEWARE ======
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ====== RUTAS ======

// Health check (accesible desde /health y /api/health)
const healthCheck = async (req, res) => {
    try {
        const dbConnected = await db.testConnection();
        if (dbConnected) {
            res.json({
                success: true,
                status: 'ok',
                database: 'connected',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(503).json({
                success: false,
                status: 'error',
                database: 'disconnected',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'error',
            database: 'disconnected',
            error: error.message
        });
    }
};

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'API Sistema de Denuncias Parque 14',
        version: '1.0.0',
        endpoints: {
            denuncias: '/api/denuncias',
            health: '/health'
        }
    });
});

// Rutas de denuncias
app.use('/api/denuncias', denunciasRouter);

// ====== MANEJO DE ERRORES 404 ======
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado'
    });
});

// ====== MANEJO DE ERRORES GLOBALES ======
app.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message
    });
});

// ====== INICIAR SERVIDOR ======
const startServer = async () => {
    try {
        // Test de conexión a base de datos
        console.log('🔍 Verificando conexión a PostgreSQL...');
        const connected = await db.testConnection();

        if (!connected) {
            throw new Error('No se pudo conectar a PostgreSQL');
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('');
            console.log('='.repeat(60));
            console.log('🚀 Servidor Backend iniciado correctamente');
            console.log('='.repeat(60));
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🗄️ Base de datos: ${process.env.DB_HOST}`);
            console.log(`🔒 CORS habilitado para: ${corsOptions.origin}`);
            console.log('='.repeat(60));
            console.log('');
            console.log('Endpoints disponibles:');
            console.log(`  GET    http://localhost:${PORT}/health`);
            console.log(`  GET    http://localhost:${PORT}/api/denuncias`);
            console.log(`  POST   http://localhost:${PORT}/api/denuncias`);
            console.log(`  GET    http://localhost:${PORT}/api/denuncias/stats/tipo`);
            console.log(`  GET    http://localhost:${PORT}/api/denuncias/stats/comision`);
            console.log('');
        });
    } catch (error) {
        console.error('❌ Error fatal al iniciar servidor:', error);
        process.exit(1);
    }
};

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('⚠️ SIGTERM recibido. Cerrando servidor...');
    db.pool.end(() => {
        console.log('✅ Pool de PostgreSQL cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('⚠️ SIGINT recibido. Cerrando servidor...');
    db.pool.end(() => {
        console.log('✅ Pool de PostgreSQL cerrado');
        process.exit(0);
    });
});

startServer();
