# 🚀 PARQUE 14 - SISTEMA CON POSTGRESQL

Sistema de denuncias usando PostgreSQL en lugar de Firebase.

---

## 📂 ESTRUCTURA DEL PROYECTO

```
P14 PGSQL/
├── backend/                    # Backend Node.js/Express
│   ├── .env                    # ⚠️ Credenciales PostgreSQL (NO SUBIR A GIT)
│   ├── package.json            # Dependencias del backend
│   ├── server.js               # Servidor principal
│   ├── db.js                   # Conexión PostgreSQL
│   ├── setup.js                # Script para crear tablas
│   ├── routes/
│   │   └── denuncias.js        # Endpoints API
│   └── node_modules/           # Dependencias instaladas
├── js/
│   └── api-backend.js          # Cliente API para frontend
├── index-postgres.html         # Frontend con PostgreSQL
└── README.md                   # Este archivo
```

---

## ⚙️ CONFIGURACIÓN INICIAL

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2. Verificar archivo .env

El archivo `backend/.env` ya contiene las credenciales de PostgreSQL:

```
DB_USER=doadmin
DB_PASSWORD=AVNS_hwXcrtQc0NJeynYbzMZ
DB_HOST=one375db-do-user-24616554-0.g.db.ondigitalocean.com
DB_PORT=25060
DB_NAME=defaultdb
DB_SSL=true
PORT=3001
```

### 3. Crear tablas en PostgreSQL (si no existen)

```bash
cd backend
node setup.js
```

---

## 🚀 INICIAR EL SISTEMA

### 1. Iniciar el backend

```bash
cd backend
npm start
```

El backend estará disponible en: **http://localhost:3001**

### 2. Abrir el frontend

Abrir en el navegador:

```
file:///C:/Users/HP%20ENVY/Documents/claude/P14%20PGSQL/index-postgres.html
```

O con Live Server:

```bash
# Abrir con extensión Live Server de VS Code
# Click derecho en index-postgres.html → Open with Live Server
```

---

## 📡 ENDPOINTS DISPONIBLES

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/api/denuncias` | Obtener todas las denuncias |
| GET | `/api/denuncias/:id` | Obtener denuncia por ID |
| POST | `/api/denuncias` | Crear nueva denuncia |
| GET | `/api/denuncias/stats/tipo` | Estadísticas por tipo |
| GET | `/api/denuncias/stats/comision` | Estadísticas por comisión |
| GET | `/api/denuncias/correlativo/next` | Próximo correlativo |

---

## 🧪 PROBAR EL SISTEMA

### Health Check
```bash
curl http://localhost:3001/health
```

### Obtener denuncias
```bash
curl http://localhost:3001/api/denuncias
```

### Crear denuncia
```bash
curl -X POST http://localhost:3001/api/denuncias \
  -H "Content-Type: application/json" \
  -d '{
    "lugar": "Test",
    "tipo": "Test",
    "descripcion": "Prueba del sistema",
    "a_quien_se_reporto": "Andreina Benítez",
    "tu_nombre": "Sistema",
    "comision": "Comisión de Seguridad"
  }'
```

---

## 📊 DATOS ACTUALES

- **Total de denuncias**: 22
- **Correlativos**: Del #1 al #22
- **Próximo correlativo**: #23

---

## ⚠️ IMPORTANTE

### NO SUBIR A GIT:
- `backend/.env` (contiene credenciales)
- `backend/node_modules/` (se puede reinstalar con npm install)

### Archivo .gitignore ya incluido:
```
backend/.env
backend/node_modules/
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Backend no inicia
```bash
# Verificar que el puerto 3001 esté libre
netstat -ano | findstr :3001

# Si está ocupado, cambiar PORT en backend/.env
```

### Error de conexión a PostgreSQL
```bash
# Verificar credenciales en backend/.env
# Verificar conexión a internet (Digital Ocean requiere internet)
```

### Frontend no carga denuncias
```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:3001/health

# 2. Abrir consola del navegador (F12) y ver errores de CORS
# 3. Verificar que js/api-backend.js tenga la URL correcta
```

---

## 📦 DESPLEGAR EN PRODUCCIÓN

### Backend en Digital Ocean App Platform

1. Crear repositorio Git (si no existe)
2. Push código a GitHub
3. Crear App en Digital Ocean
4. Configurar variables de entorno
5. Obtener URL de producción

### Frontend en Cloudflare Pages

1. Actualizar `js/api-backend.js` con URL de producción
2. Push a GitHub
3. Cloudflare Pages despliega automáticamente

---

## ✅ VENTAJAS VS FIREBASE

1. **Costo**: $0 adicionales (usas DB existente)
2. **Sin límites de cuota**: Millones de consultas sin problema
3. **Mayor control**: Queries SQL complejos
4. **Escalabilidad**: Preparado para crecer
5. **Profesional**: Arquitectura estándar de la industria

---

**🎉 Sistema listo para usar con PostgreSQL**
