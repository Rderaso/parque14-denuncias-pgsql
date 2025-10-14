// ====================================================================
// API BACKEND - REEMPLAZO DE FIREBASE CON POSTGRESQL
// ====================================================================

// Detectar automáticamente el entorno (local vs producción)
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'
    ? 'http://localhost:3001/api'  // Desarrollo local
    : 'https://parque14-denuncias-pgsql.onrender.com/api';  // Producción - Backend en Render

// Configuración global del backend
window.backendAPI = {
    baseURL: API_URL,

    // Cargar todas las denuncias
    async cargarDenuncias() {
        try {
            console.log('🔄 Cargando denuncias desde PostgreSQL...');

            const response = await fetch(`${API_URL}/denuncias`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log(`✅ ${data.count} denuncias cargadas desde PostgreSQL`);
                return data.data;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('❌ Error cargando denuncias:', error);
            throw error;
        }
    },

    // Crear nueva denuncia
    async crearDenuncia(denunciaData) {
        try {
            console.log('💾 Creando denuncia en PostgreSQL...', denunciaData);

            const response = await fetch(`${API_URL}/denuncias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(denunciaData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log('✅ Denuncia creada exitosamente:', data.data);
                return data.data;
            } else {
                throw new Error(data.error || 'Error creando denuncia');
            }
        } catch (error) {
            console.error('❌ Error creando denuncia:', error);
            throw error;
        }
    },

    // Obtener próximo correlativo
    async obtenerProximoCorrelativo() {
        try {
            const response = await fetch(`${API_URL}/denuncias/correlativo/next`);
            const data = await response.json();

            if (data.success) {
                return data.proximoCorrelativo;
            }
            return 1;
        } catch (error) {
            console.error('Error obteniendo correlativo:', error);
            return 1;
        }
    },

    // Obtener estadísticas por tipo
    async obtenerEstadisticasPorTipo() {
        try {
            const response = await fetch(`${API_URL}/denuncias/stats/tipo`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return [];
        }
    },

    // Obtener estadísticas por comisión
    async obtenerEstadisticasPorComision() {
        try {
            const response = await fetch(`${API_URL}/denuncias/stats/comision`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return [];
        }
    },

    // Verificar conexión con el backend
    async verificarConexion() {
        try {
            console.log('🔌 Verificando conexión con backend PostgreSQL...');

            const response = await fetch(`${API_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log('✅ Conexión con PostgreSQL exitosa');
                return true;
            } else {
                throw new Error('Backend no disponible');
            }
        } catch (error) {
            console.error('❌ Error verificando conexión:', error);
            throw error;
        }
    },

    // Actualizar estado de una denuncia
    async actualizarEstado(id, nuevoEstado) {
        try {
            console.log(`🔄 Actualizando estado de denuncia ${id} a ${nuevoEstado}...`);

            const response = await fetch(`${API_URL}/denuncias/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                console.log('✅ Estado actualizado exitosamente');
                return data.data;
            } else {
                throw new Error(data.error || 'Error actualizando estado');
            }
        } catch (error) {
            console.error('❌ Error actualizando estado:', error);
            throw error;
        }
    }
};

// Exponer globalmente
window.API_BACKEND_URL = API_URL;

console.log('✅ API Backend configurada:', API_URL);
