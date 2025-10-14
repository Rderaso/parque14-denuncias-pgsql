// ====================================================================
// SCRIPT PARA EJECUTAR MIGRACIÓN: Agregar columna estado
// ====================================================================

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const db = require('./db');

async function ejecutarMigracion() {
    try {
        console.log('🚀 Iniciando migración: Agregar columna estado');
        console.log('================================================');

        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, 'agregar-columna-estado.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('📄 Archivo SQL leído correctamente');
        console.log('\nEjecutando queries...\n');

        // Separar el SQL por líneas que no sean comentarios ni vacías
        const queries = sql
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));

        // Ejecutar cada query
        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            if (query.trim()) {
                console.log(`📝 Ejecutando query ${i + 1}/${queries.length}...`);
                const result = await db.query(query);

                // Mostrar resultados si es un SELECT
                if (query.trim().toUpperCase().startsWith('SELECT')) {
                    console.log('✅ Resultado:');
                    console.table(result.rows);
                } else {
                    console.log(`✅ Query completada (${result.rowCount || 0} filas afectadas)`);
                }
                console.log('');
            }
        }

        console.log('================================================');
        console.log('✅ Migración completada exitosamente');
        console.log('================================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error ejecutando migración:', error);
        process.exit(1);
    }
}

ejecutarMigracion();
