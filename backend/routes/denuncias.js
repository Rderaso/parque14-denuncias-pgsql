// ====================================================================
// RUTAS API - DENUNCIAS
// ====================================================================

const express = require('express');
const router = express.Router();
const db = require('../db');

// ====== GET /api/denuncias - Obtener todas las denuncias ======
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                id,
                correlativo,
                lugar,
                tipo,
                descripcion,
                a_quien_se_reporto,
                tu_nombre,
                comision,
                estado,
                fecha_creacion,
                oculta_temporalmente,
                created_at,
                updated_at
            FROM denuncias
            WHERE oculta_temporalmente = FALSE
            ORDER BY fecha_creacion DESC
        `);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Error obteniendo denuncias:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener denuncias'
        });
    }
});

// ====== GET /api/denuncias/:id - Obtener denuncia por ID ======
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT * FROM denuncias WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Denuncia no encontrada'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error obteniendo denuncia:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener denuncia'
        });
    }
});

// ====== POST /api/denuncias - Crear nueva denuncia ======
router.post('/', async (req, res) => {
    try {
        const {
            lugar,
            tipo,
            descripcion,
            a_quien_se_reporto,
            tu_nombre,
            comision
        } = req.body;

        // Validación básica
        if (!lugar || !tipo || !descripcion || !a_quien_se_reporto || !tu_nombre || !comision) {
            return res.status(400).json({
                success: false,
                error: 'Todos los campos son requeridos'
            });
        }

        // Insertar denuncia (el trigger asigna correlativo automáticamente)
        const result = await db.query(`
            INSERT INTO denuncias (
                lugar,
                tipo,
                descripcion,
                a_quien_se_reporto,
                tu_nombre,
                comision
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [lugar, tipo, descripcion, a_quien_se_reporto, tu_nombre, comision]);

        console.log('✅ Denuncia creada:', result.rows[0].correlativo);

        res.status(201).json({
            success: true,
            message: 'Denuncia creada exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error creando denuncia:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear denuncia'
        });
    }
});

// ====== GET /api/denuncias/stats/tipo - Estadísticas por tipo ======
router.get('/stats/tipo', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM estadisticas_por_tipo
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener estadísticas'
        });
    }
});

// ====== GET /api/denuncias/stats/comision - Estadísticas por comisión ======
router.get('/stats/comision', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM estadisticas_por_comision
        `);

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener estadísticas'
        });
    }
});

// ====== PUT /api/denuncias/:id - Actualizar denuncia (estado, etc.) ======
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar que el estado sea válido
        const estadosValidos = ['pendiente', 'proceso', 'resuelto', 'cancelado'];
        if (estado && !estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                error: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`
            });
        }

        // Actualizar el estado
        const result = await db.query(
            'UPDATE denuncias SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Denuncia no encontrada'
            });
        }

        console.log(`✅ Denuncia ${id} actualizada a estado: ${estado}`);

        res.json({
            success: true,
            message: 'Denuncia actualizada exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error actualizando denuncia:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar denuncia'
        });
    }
});

// ====== PUT /api/denuncias/:id/ocultar - Ocultar denuncia ======
router.put('/:id/ocultar', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'UPDATE denuncias SET oculta_temporalmente = TRUE WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Denuncia no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Denuncia ocultada',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error ocultando denuncia:', error);
        res.status(500).json({
            success: false,
            error: 'Error al ocultar denuncia'
        });
    }
});

// ====== DELETE /api/denuncias/:id - Eliminar denuncia ======
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM denuncias WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Denuncia no encontrada'
            });
        }

        console.log(`✅ Denuncia ${id} eliminada exitosamente`);

        res.json({
            success: true,
            message: 'Denuncia eliminada exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('❌ Error eliminando denuncia:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar denuncia'
        });
    }
});

// ====== GET /api/denuncias/correlativo/next - Obtener próximo correlativo ======
router.get('/correlativo/next', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT ultimo_correlativo + 1 as proximo
            FROM correlativo_secuencia
            WHERE id = 1
        `);

        res.json({
            success: true,
            data: {
                proximo_correlativo: result.rows[0].proximo
            }
        });
    } catch (error) {
        console.error('❌ Error obteniendo correlativo:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener correlativo'
        });
    }
});

module.exports = router;
