# ✅ CÓDIGO EN GITHUB - SIGUIENTES PASOS

## 🎉 LO QUE YA ESTÁ LISTO

✅ Código en GitHub: https://github.com/Rderaso/parque14-denuncias-pgsql
✅ 25 archivos subidos correctamente
✅ .env protegido (NO está en GitHub)
✅ Repositorio privado (seguro)

---

## 🚀 PASO 2: DESPLEGAR BACKEND EN RAILWAY (10 minutos)

### 1. Ve a Railway.app
```
https://railway.app
```

### 2. Crear cuenta / Login
- Usa tu cuenta de GitHub para login rápido

### 3. Crear nuevo proyecto
- Click en **"Start a New Project"**
- Selecciona **"Deploy from GitHub repo"**
- Busca: `parque14-denuncias-pgsql`
- Click en el repositorio

### 4. Railway detectará Node.js automáticamente
- Usará el archivo `railway.json` que ya configuramos
- Empezará a hacer el build automáticamente

### 5. Configurar Variables de Entorno (IMPORTANTE ⚠️)
Ve a **Variables** tab y agrega estas 8 variables:

```env
DB_USER=doadmin
DB_PASSWORD=AVNS_hwXcrtQc0NJeynYbzMZ
DB_HOST=one375db-do-user-24616554-0.g.db.ondigitalocean.com
DB_PORT=25060
DB_NAME=defaultdb
DB_SSL=true
PORT=3001
NODE_ENV=production
```

### 6. Agregar CORS_ORIGIN (por ahora temporal)
```env
CORS_ORIGIN=https://localhost:5500,http://127.0.0.1:5500
```
(Lo actualizaremos después con la URL de Cloudflare)

### 7. Obtener URL del Backend
- Ve a **Settings** → **Networking**
- Copia la URL que Railway te da, ejemplo:
  ```
  https://parque14-denuncias-pgsql-production.up.railway.app
  ```
- **GUARDA ESTA URL** ⚠️ (la necesitarás para el siguiente paso)

### 8. Probar que funciona
Abre en tu navegador:
```
https://TU-URL-RAILWAY.up.railway.app/health
```

Deberías ver:
```json
{
  "success": true,
  "status": "ok",
  "database": "connected"
}
```

---

## 🌐 PASO 3: ACTUALIZAR CÓDIGO CON URL DE RAILWAY

### 1. Editar js/api-backend.js

Abre el archivo:
```
C:\Users\HP ENVY\Documents\claude\P14 PGSQL\js\api-backend.js
```

Busca la línea 8 y **reemplaza** la URL:
```javascript
// ANTES:
: 'https://p14-backend-production.up.railway.app/api';

// DESPUÉS (pon tu URL de Railway):
: 'https://TU-URL-RAILWAY.up.railway.app/api';
```

### 2. Commit y Push

```bash
cd "C:\Users\HP ENVY\Documents\claude\P14 PGSQL"

git add js/api-backend.js
git commit -m "🔧 Update: Configurada URL de Railway en producción"
git push
```

---

## ☁️ PASO 4: DESPLEGAR FRONTEND EN CLOUDFLARE PAGES (5 minutos)

### 1. Ve a Cloudflare Pages
```
https://dash.cloudflare.com
```

### 2. Ir a Pages
- En el menú lateral, click en **"Workers & Pages"**
- Click en **"Create application"**
- Selecciona **"Pages"**

### 3. Conectar GitHub
- Click en **"Connect to Git"**
- Autoriza Cloudflare a acceder a GitHub
- Busca y selecciona: `parque14-denuncias-pgsql`

### 4. Configurar Build Settings
```
Build command: (dejar vacío)
Build output directory: /
Root directory: (raíz)
Branch: main
```

### 5. Deploy
- Click en **"Save and Deploy"**
- Espera 2-3 minutos
- Cloudflare te dará una URL como:
  ```
  https://parque14-denuncias-pgsql.pages.dev
  ```
- **GUARDA ESTA URL** ⚠️

---

## 🔄 PASO 5: ACTUALIZAR CORS EN RAILWAY

### 1. Ve a Railway → Variables

### 2. Actualiza la variable CORS_ORIGIN
Reemplaza con tu URL de Cloudflare:
```env
CORS_ORIGIN=https://TU-URL-CLOUDFLARE.pages.dev
```

### 3. Railway se redespliegará automáticamente
- Espera 1-2 minutos

---

## ✅ VERIFICACIÓN FINAL

### 1. Abre tu sitio en Cloudflare
```
https://tu-proyecto.pages.dev
```

### 2. Abre DevTools (F12) → Consola
Deberías ver:
```
✅ API Backend configurada: https://tu-backend.railway.app/api
🔄 Cargando denuncias desde PostgreSQL...
✅ 22 denuncias cargadas desde PostgreSQL
```

### 3. Crea una denuncia de prueba
- Llena el formulario
- Click en "Enviar Denuncia"
- Debería guardar en PostgreSQL
- Debería aparecer en el historial

---

## 📊 TU SISTEMA EN PRODUCCIÓN

Cuando termines, tendrás:

| Componente | URL | Costo |
|------------|-----|-------|
| **Frontend** | https://______.pages.dev | GRATIS |
| **Backend** | https://______.railway.app | GRATIS |
| **PostgreSQL** | Digital Ocean | $15.15/mes |

**TOTAL:** $15.15/mes

---

## 🆘 PROBLEMAS COMUNES

### Railway no inicia
- Revisa los logs en Railway
- Verifica que todas las variables estén correctas
- Verifica que PostgreSQL esté activo en Digital Ocean

### Error CORS
- Actualiza CORS_ORIGIN en Railway con URL exacta de Cloudflare
- NO pongas espacios ni comillas extra
- Redeploy en Railway

### Frontend no carga
- Verifica que `js/api-backend.js` tenga la URL correcta de Railway
- Haz hard refresh (Ctrl + Shift + R)
- Abre DevTools y busca errores en la consola

---

## 📞 CONTACTO

Si tienes problemas:
1. Revisa los logs en Railway
2. Revisa la consola del navegador (F12)
3. Revisa que las URLs sean correctas

---

**¡Tu sistema estará en internet en 20-30 minutos!** 🚀
