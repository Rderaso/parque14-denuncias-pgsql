// Verificar estructura de la tabla denuncias
require('dotenv').config();
const db = require('./db');

async function verificar() {
    try {
        console.log('🔍 Verificando estructura de tabla denuncias...\n');

        // Ver todas las columnas de la tabla denuncias
        const columns = await db.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'denuncias'
            ORDER BY ordinal_position
        `);

        console.log('📋 Columnas en la tabla denuncias:');
        console.table(columns.rows);

        // Verificar si existe la columna estado
        const tieneEstado = columns.rows.some(col => col.column_name === 'estado');
        console.log(`\n${tieneEstado ? '✅' : '❌'} Columna 'estado' ${tieneEstado ? 'existe' : 'NO existe'}`);

        // Ver esquema completo
        const schema = await db.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_name = 'denuncias'
        `);

        console.log('\n📊 Esquema de la tabla:');
        console.table(schema.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

verificar();
