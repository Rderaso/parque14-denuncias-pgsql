# 🚀 GUÍA DE DESPLIEGUE - SISTEMA DENUNCIAS PARQUE 14

## 📦 LO QUE TIENES

✅ Backend Node.js + Express + PostgreSQL
✅ Base de datos PostgreSQL en Digital Ocean
✅ Frontend HTML5 con Bootstrap
✅ API REST completa
✅ Archivos preparados para despliegue

---

## 🎯 DESPLIEGUE EN 3 PASOS

### PASO 1: SUBIR A GITHUB (5 minutos)

```bash
# Navegar al proyecto
cd "C:\Users\HP ENVY\Documents\claude\P14 PGSQL"

# Inicializar Git (si no está iniciado)
git init
git branch -M main

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "🚀 Initial commit: Sistema Denuncias Parque 14 con PostgreSQL"

# Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre sugerido: parque14-denuncias-pgsql
# Descripción: Sistema de denuncias con PostgreSQL y Node.js
# Visibilidad: Private (para proteger credenciales)

# Conectar con GitHub (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/parque14-denuncias-pgsql.git

# Subir código
git push -u origin main
```

**⚠️ IMPORTANTE:** Verifica que `.env` NO se subió:
```bash
# Ejecutar esto y NO deberías ver .env en la lista
git ls-files | findstr .env

# Si aparece .env, DETENTE y ejecuta:
git rm --cached backend/.env
git commit -m "🔒 Remove .env from tracking"
git push
```

---

### PASO 2: DESPLEGAR BACKEND EN RAILWAY (10 minutos)

1. **Ve a Railway.app**
   ```
   https://railway.app
   ```

2. **Conecta GitHub**
   - Click en "Start a New Project"
   - Selecciona "Deploy from GitHub repo"
   - Busca: `parque14-denuncias-pgsql`

3. **Railway detectará automáticamente Node.js**
   - Usará el archivo `railway.json` que ya está configurado

4. **Configurar Variables de Entorno**
   - Ve a: **Variables** tab en Railway
   - Agrega estas variables (copia desde backend/.env):

   ```env
   DB_USER=doadmin
   DB_PASSWORD=AVNS_hwXcrtQc0NJeynYbzMZ
   DB_HOST=one375db-do-user-24616554-0.g.db.ondigitalocean.com
   DB_PORT=25060
   DB_NAME=defaultdb
   DB_SSL=true
   PORT=3001
   NODE_ENV=production
   CORS_ORIGIN=https://parque14-denuncias-pgsql.pages.dev
   ```

5. **Obtener URL del backend**
   - Railway te dará una URL como:
     ```
     https://tu-proyecto-production.up.railway.app
     ```
   - **COPIA ESTA URL** (la necesitarás para el siguiente paso)

---

### PASO 3: ACTUALIZAR Y DESPLEGAR FRONTEND (15 minutos)

#### 3.1 Actualizar URL del Backend en el Código

```bash
# Editar js/api-backend.js línea 8
# Reemplazar:
: 'https://p14-backend-production.up.railway.app/api';

# Con tu URL real de Railway (la que copiaste en Paso 2):
: 'https://TU-URL-RAILWAY.up.railway.app/api';
```

#### 3.2 Commit y Push

```bash
git add js/api-backend.js
git commit -m "🔧 Update: Configurado URL de Railway en producción"
git push
```

#### 3.3 Desplegar Frontend en Cloudflare Pages

1. **Ve a Cloudflare Pages**
   ```
   https://dash.cloudflare.com
   ```

2. **Crear nuevo proyecto**
   - Click en "Pages" → "Create a project"
   - Conecta tu cuenta de GitHub
   - Selecciona: `parque14-denuncias-pgsql`

3. **Configuración del Build**
   ```
   Build command: (dejar vacío)
   Build output directory: /
   Root directory: /
   ```

4. **Deploy**
   - Click en "Save and Deploy"
   - Espera 2-3 minutos
   - Cloudflare te dará una URL como:
     ```
     https://parque14-denuncias-pgsql.pages.dev
     ```

#### 3.4 Actualizar CORS en Railway

1. Ve a Railway → Variables
2. Actualiza `CORS_ORIGIN` con tu URL de Cloudflare:
   ```
   CORS_ORIGIN=https://TU-URL-CLOUDFLARE.pages.dev
   ```
3. Railway se redespliegará automáticamente

---

## ✅ VERIFICACIÓN FINAL

### 1. Probar el Backend

```bash
# Reemplaza con tu URL de Railway
curl https://tu-backend.railway.app/health

# Deberías ver:
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

### 2. Probar el Frontend

1. Abre tu URL de Cloudflare en el navegador
2. Abre DevTools (F12) → Consola
3. Deberías ver:
   ```
   ✅ API Backend configurada: https://tu-backend.railway.app/api
   🔄 Cargando denuncias desde PostgreSQL...
   ✅ 22 denuncias cargadas desde PostgreSQL
   ```

### 3. Crear una Denuncia de Prueba

1. Llena el formulario
2. Click en "Enviar Denuncia"
3. Deberías ver: "✅ Denuncia #23 creada exitosamente"
4. La denuncia debe aparecer en el historial

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error CORS

**Síntoma:** "blocked by CORS policy"

**Solución:**
1. Verifica que `CORS_ORIGIN` en Railway tenga tu URL de Cloudflare
2. Asegúrate de que NO tenga espacios ni comillas extra
3. Redeploy en Railway (click en botón de Deploy)

### Backend no responde

**Síntoma:** "Failed to fetch" o timeout

**Solución:**
1. Ve a Railway → Logs
2. Busca errores de conexión a PostgreSQL
3. Verifica que todas las variables de entorno estén correctas
4. Verifica que Digital Ocean PostgreSQL esté activo

### Frontend no carga denuncias

**Síntoma:** Spinner infinito o "Error cargando denuncias"

**Solución:**
1. Abre DevTools → Consola
2. Busca la URL que está usando (debe ser la de Railway, no localhost)
3. Verifica que `js/api-backend.js` tenga la URL correcta
4. Haz hard refresh (Ctrl + Shift + R)

---

## 💰 COSTOS MENSUALES

| Servicio | Costo | Plan |
|----------|-------|------|
| Railway (Backend) | $0/mes | Free Tier (500 hrs) |
| Cloudflare Pages | $0/mes | Free Unlimited |
| Digital Ocean PostgreSQL | $15.15/mes | Ya activo |
| **TOTAL** | **$15.15/mes** | |

---

## 📊 URLs DE TU SISTEMA

Cuando termines, llena esta tabla para tener todo organizado:

| Componente | URL | Estado |
|------------|-----|--------|
| Frontend | https://__________.pages.dev | ⏳ |
| Backend API | https://__________.railway.app | ⏳ |
| PostgreSQL | one375db-do-user-24616554-0... | ✅ |
| GitHub Repo | https://github.com/___/parque14-denuncias-pgsql | ⏳ |

---

## 🎉 ¡SISTEMA EN PRODUCCIÓN!

Tu sistema estará disponible en:
```
https://tu-proyecto.pages.dev
```

Con:
- ✅ Backend profesional en Railway
- ✅ Frontend en CDN global (Cloudflare)
- ✅ Base de datos PostgreSQL en Digital Ocean
- ✅ HTTPS automático
- ✅ Despliegues automáticos con Git

---

## 📝 COMANDOS PARA ACTUALIZAR EN EL FUTURO

```bash
# Hacer cambios en el código
# ...

# Commit y push
git add .
git commit -m "🔧 Update: descripción del cambio"
git push

# Railway y Cloudflare Pages se actualizan automáticamente
```

---

**Última actualización:** 2025-10-14
**Proyecto:** Sistema de Denuncias Parque 14
**Stack:** Node.js + Express + PostgreSQL + HTML5
