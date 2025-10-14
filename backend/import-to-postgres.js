// ====================================================================
// SCRIPT PARA IMPORTAR DENUNCIAS DE FIREBASE A POSTGRESQL
// ====================================================================

const db = require('./db');
const fs = require('fs');

async function importarDenuncias() {
    try {
        console.log('📥 Importando denuncias de Firebase a PostgreSQL...');
        console.log('');

        // Leer archivo JSON exportado
        const archivo = 'denuncias-firebase-export.json';
        if (!fs.existsSync(archivo)) {
            throw new Error(`❌ No se encontró el archivo ${archivo}. Ejecuta primero: node export-firebase.js`);
        }

        const contenido = fs.readFileSync(archivo, 'utf8');
        const denuncias = JSON.parse(contenido);

        console.log(`📊 Total de denuncias a importar: ${denuncias.length}`);
        console.log('');

        // Verificar conexión a PostgreSQL
        const conexionOk = await db.testConnection();
        if (!conexionOk) {
            throw new Error('❌ No se pudo conectar a PostgreSQL');
        }

        console.log('✅ Conexión a PostgreSQL exitosa');
        console.log('');

        // Contador de importaciones
        let importadas = 0;
        let errores = 0;
        let maxCorrelativo = 0;

        // Importar cada denuncia
        for (const denuncia of denuncias) {
            try {
                // Mapear campos de Firebase a PostgreSQL
                const lugar = denuncia.lugar || 'Sin especificar';
                const tipo = denuncia.tipo || 'General';
                const descripcion = denuncia.descripcion || denuncia.sintesisProblema || 'Sin descripción';
                const a_quien_se_reporto = denuncia.aQuienSeReporto || 'No especificado';
                const tu_nombre = denuncia.tuNombre || 'Anónimo';
                const comision = denuncia.comision || 'Sin comisión';
                const correlativo = denuncia.correlativo || (importadas + 1);
                const fecha_creacion = denuncia.fechaCreacion || denuncia.created_at || denuncia.fecha || new Date().toISOString();
                const oculta_temporalmente = false;

                // Actualizar max correlativo
                if (correlativo > maxCorrelativo) {
                    maxCorrelativo = correlativo;
                }

                // INSERTAR CON CORRELATIVO ESPECÍFICO (bypassea el trigger)
                await db.query(`
                    INSERT INTO denuncias (
                        correlativo,
                        lugar,
                        tipo,
                        descripcion,
                        a_quien_se_reporto,
                        tu_nombre,
                        comision,
                        fecha_creacion,
                        oculta_temporalmente
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                    ON CONFLICT (correlativo) DO NOTHING
                `, [
                    correlativo,
                    lugar,
                    tipo,
                    descripcion,
                    a_quien_se_reporto,
                    tu_nombre,
                    comision,
                    fecha_creacion,
                    oculta_temporalmente
                ]);

                importadas++;
                console.log(`✅ [${importadas}/${denuncias.length}] Importada denuncia #${correlativo}: ${lugar} - ${tipo}`);

            } catch (error) {
                errores++;
                console.error(`❌ Error importando denuncia #${denuncia.correlativo}:`, error.message);
            }
        }

        console.log('');
        console.log('📊 RESULTADO DE LA IMPORTACIÓN:');
        console.log(`   ✅ Importadas: ${importadas}`);
        console.log(`   ❌ Errores: ${errores}`);
        console.log(`   📈 Correlativo máximo: ${maxCorrelativo}`);
        console.log('');

        // Actualizar la secuencia de correlativos para que el próximo sea correcto
        console.log('🔧 Actualizando secuencia de correlativos...');
        await db.query(`
            UPDATE correlativo_secuencia
            SET ultimo_correlativo = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
        `, [maxCorrelativo]);

        console.log(`✅ Secuencia actualizada: próximo correlativo será ${maxCorrelativo + 1}`);
        console.log('');

        // Verificar denuncias importadas
        const resultado = await db.query('SELECT COUNT(*) as total FROM denuncias');
        console.log('');
        console.log('🎉 IMPORTACIÓN COMPLETADA EXITOSAMENTE!');
        console.log(`📊 Total de denuncias en PostgreSQL: ${resultado.rows[0].total}`);
        console.log('');
        console.log('✅ Datos migrados de Firebase a PostgreSQL correctamente');
        console.log('');

        // Cerrar conexión
        await db.pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error en importación:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Ejecutar importación
importarDenuncias();
