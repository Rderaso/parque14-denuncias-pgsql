-- ====================================================================
-- MIGRACIÓN: Agregar columna estado a tabla denuncias
-- ====================================================================

-- Agregar columna estado con valor por defecto 'pendiente'
ALTER TABLE denuncias
ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'pendiente';

-- Crear índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_denuncias_estado ON denuncias(estado);

-- Actualizar denuncias existentes que no tengan estado
UPDATE denuncias
SET estado = 'pendiente'
WHERE estado IS NULL;

-- Verificar que se aplicó correctamente
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'denuncias'
  AND column_name = 'estado';

-- Ver primeras 5 denuncias con el nuevo campo
SELECT id, correlativo, lugar, tipo, estado, fecha_creacion
FROM denuncias
ORDER BY fecha_creacion DESC
LIMIT 5;
