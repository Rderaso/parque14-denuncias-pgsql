# 🚀 Backend API - Sistema Denuncias Parque 14

Backend Node.js/Express conectado a PostgreSQL en Digital Ocean.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL en Digital Ocean ya configurado
- Tablas ya creadas en la base de datos

## 🔧 Instalación

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

El archivo `.env` ya está creado con las credenciales correctas.

**⚠️ IMPORTANTE**: Nunca subir `.env` a GitHub.

### 3. Iniciar servidor

**Modo desarrollo** (con auto-reload):
```bash
npm run dev
```

**Modo producción**:
```bash
npm start
```

El servidor iniciará en: `http://localhost:3000`

---

## 📡 Endpoints Disponibles

### Health Check
```http
GET /health
```
Verifica que el servidor y la base de datos estén funcionando.

### Obtener todas las denuncias
```http
GET /api/denuncias
```

**Respuesta**:
```json
{
  "success": true,
  "count": 27,
  "data": [...]
}
```

### Crear nueva denuncia
```http
POST /api/denuncias
Content-Type: application/json

{
  "lugar": "Ascensor Torre A",
  "tipo": "Ascensores",
  "descripcion": "El ascensor hace ruidos extraños",
  "a_quien_se_reporto": "Andreina Benítez",
  "tu_nombre": "Rodrigo Deras",
  "comision": "Comisión de Infraestructura"
}
```

### Estadísticas por tipo
```http
GET /api/denuncias/stats/tipo
```

### Estadísticas por comisión
```http
GET /api/denuncias/stats/comision
```

### Obtener próximo correlativo
```http
GET /api/denuncias/correlativo/next
```

---

## 🔒 Seguridad

- ✅ Helmet para headers de seguridad
- ✅ CORS configurado para Cloudflare Pages
- ✅ Rate limiting (100 req/15min)
- ✅ SSL obligatorio para PostgreSQL
- ✅ Validación de inputs

---

## 🧪 Testing

### Test manual con curl:

```bash
# Health check
curl http://localhost:3000/health

# Obtener denuncias
curl http://localhost:3000/api/denuncias

# Crear denuncia
curl -X POST http://localhost:3000/api/denuncias \
  -H "Content-Type: application/json" \
  -d '{
    "lugar": "Test",
    "tipo": "Test",
    "descripcion": "Prueba",
    "a_quien_se_reporto": "Test",
    "tu_nombre": "Test",
    "comision": "Test"
  }'
```

---

## 📦 Deploy en Digital Ocean App Platform

### 1. Crear App en Digital Ocean

1. Ve a https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Conecta tu repositorio GitHub
4. Selecciona la carpeta `backend/`

### 2. Configurar variables de entorno

En Digital Ocean App Platform, agrega:
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `NODE_ENV=production`
- `CORS_ORIGIN=https://sistema-denuncias-p14.pages.dev`

### 3. Deploy

Digital Ocean desplegará automáticamente el backend.

---

## 🐛 Troubleshooting

### Error: "Cannot connect to PostgreSQL"
- Verifica las credenciales en `.env`
- Confirma que SSL esté habilitado
- Verifica que la IP esté permitida en Digital Ocean

### Error: "CORS blocked"
- Agrega tu dominio a `CORS_ORIGIN` en `.env`
- Verifica que el frontend esté en HTTPS

### Error: "Rate limit exceeded"
- Espera 15 minutos
- O ajusta el rate limit en `server.js`

---

## 📚 Estructura del Proyecto

```
backend/
├── .env              # Variables de entorno (NO SUBIR A GIT)
├── .gitignore        # Archivos ignorados por Git
├── package.json      # Dependencias
├── server.js         # Servidor Express principal
├── db.js             # Conexión PostgreSQL
└── routes/
    └── denuncias.js  # Endpoints de denuncias
```

---

## 🔄 Próximos Pasos

1. ✅ Backend creado
2. ⏳ Probar localmente
3. ⏳ Actualizar frontend para usar API
4. ⏳ Desplegar en Digital Ocean App Platform
