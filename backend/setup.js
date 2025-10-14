// ====================================================================
// SCRIPT PARA CREAR TABLAS AUTOMÁTICAMENTE
// ====================================================================

const db = require('./db');

const setupDatabase = async () => {
    try {
        console.log('🔧 Iniciando setup de base de datos...');

        // Crear tabla denuncias
        await db.query(`
            CREATE TABLE IF NOT EXISTS denuncias (
                id SERIAL PRIMARY KEY,
                correlativo INTEGER NOT NULL UNIQUE,
                lugar VARCHAR(255) NOT NULL,
                tipo VARCHAR(100) NOT NULL,
                descripcion TEXT NOT NULL,
                a_quien_se_reporto VARCHAR(255) NOT NULL,
                tu_nombre VARCHAR(255) NOT NULL,
                comision VARCHAR(100) NOT NULL,
                fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                oculta_temporalmente BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla denuncias creada');

        // Crear índices
        await db.query('CREATE INDEX IF NOT EXISTS idx_denuncias_correlativo ON denuncias(correlativo)');
        await db.query('CREATE INDEX IF NOT EXISTS idx_denuncias_tipo ON denuncias(tipo)');
        await db.query('CREATE INDEX IF NOT EXISTS idx_denuncias_fecha_creacion ON denuncias(fecha_creacion DESC)');
        console.log('✅ Índices creados');

        // Crear tabla correlativo_secuencia
        await db.query(`
            CREATE TABLE IF NOT EXISTS correlativo_secuencia (
                id INTEGER PRIMARY KEY DEFAULT 1,
                ultimo_correlativo INTEGER NOT NULL DEFAULT 0,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT single_row CHECK (id = 1)
            )
        `);
        console.log('✅ Tabla correlativo_secuencia creada');

        // Insertar fila inicial
        await db.query(`
            INSERT INTO correlativo_secuencia (id, ultimo_correlativo)
            VALUES (1, 0)
            ON CONFLICT (id) DO NOTHING
        `);
        console.log('✅ Secuencia inicializada');

        // Crear función asignar_correlativo
        await db.query(`
            CREATE OR REPLACE FUNCTION asignar_correlativo()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.correlativo IS NULL THEN
                    UPDATE correlativo_secuencia
                    SET ultimo_correlativo = ultimo_correlativo + 1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = 1
                    RETURNING ultimo_correlativo INTO NEW.correlativo;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql
        `);
        console.log('✅ Función asignar_correlativo creada');

        // Crear trigger
        await db.query(`
            DROP TRIGGER IF EXISTS trigger_asignar_correlativo ON denuncias
        `);
        await db.query(`
            CREATE TRIGGER trigger_asignar_correlativo
            BEFORE INSERT ON denuncias
            FOR EACH ROW
            EXECUTE FUNCTION asignar_correlativo()
        `);
        console.log('✅ Trigger creado');

        // Crear vista denuncias_activas
        await db.query(`
            CREATE OR REPLACE VIEW denuncias_activas AS
            SELECT id, correlativo, lugar, tipo, descripcion, a_quien_se_reporto, tu_nombre, comision, fecha_creacion
            FROM denuncias
            WHERE oculta_temporalmente = FALSE
            ORDER BY fecha_creacion DESC
        `);
        console.log('✅ Vista denuncias_activas creada');

        console.log('');
        console.log('🎉 Setup completado exitosamente!');
        console.log('');

        // Cerrar conexión
        await db.pool.end();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error en setup:', error);
        process.exit(1);
    }
};

setupDatabase();
