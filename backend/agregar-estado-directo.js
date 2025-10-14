// Agregar columna estado directamente
require('dotenv').config();
const db = require('./db');

async function agregar() {
    try {
        console.log('🚀 Agregando columna estado a tabla denuncias...\n');

        // Agregar columna estado
        await db.query(`
            ALTER TABLE denuncias
            ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'pendiente'
        `);
        console.log('✅ Columna estado agregada');

        // Crear índice
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_denuncias_estado ON denuncias(estado)
        `);
        console.log('✅ Índice creado');

        // Actualizar registros existentes
        const result = await db.query(`
            UPDATE denuncias
            SET estado = 'pendiente'
            WHERE estado IS NULL
        `);
        console.log(`✅ ${result.rowCount} registros actualizados`);

        // Verificar
        const verification = await db.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'denuncias'
              AND column_name = 'estado'
        `);

        console.log('\n📋 Verificación:');
        console.table(verification.rows);

        console.log('\n✅ Migración completada exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

agregar();
