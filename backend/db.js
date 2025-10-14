// ====================================================================
// CONEXIÓN A POSTGRESQL - DIGITAL OCEAN
// ====================================================================

const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de conexiones
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // Digital Ocean requiere SSL
    },
    max: 20, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test de conexión al iniciar
pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL (Digital Ocean)');
});

pool.on('error', (err) => {
    console.error('❌ Error inesperado en PostgreSQL:', err);
    process.exit(-1);
});

// Función para verificar conexión
const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('🔍 Test de conexión exitoso:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('❌ Error en test de conexión:', error.message);
        return false;
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
    testConnection
};
