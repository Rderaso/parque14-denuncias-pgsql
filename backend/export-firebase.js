// ====================================================================
// SCRIPT PARA EXPORTAR DENUNCIAS DE FIREBASE A JSON
// ====================================================================

// Primero instalar: npm install firebase firebase-admin

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, orderBy, query } = require('firebase/firestore');
const fs = require('fs');

// Configuración de Firebase (credenciales del proyecto)
const firebaseConfig = {
    apiKey: "AIzaSyCc4_abfCR3H8uHdkt-39rQk4hCpU2dfxQ",
    authDomain: "parque14-denuncias.firebaseapp.com",
    projectId: "parque14-denuncias",
    storageBucket: "parque14-denuncias.firebasestorage.app",
    messagingSenderId: "430120097163",
    appId: "1:430120097163:web:1dcb307d71452ce2188b8e"
};

async function exportarDenuncias() {
    try {
        console.log('🔥 Conectando a Firebase...');

        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log('✅ Conexión exitosa a Firebase');
        console.log('📥 Obteniendo denuncias...');

        // Obtener todas las denuncias ordenadas por fecha
        const denunciasRef = collection(db, 'denuncias');
        const q = query(denunciasRef, orderBy('fechaCreacion', 'desc'));
        const querySnapshot = await getDocs(q);

        const denuncias = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Convertir timestamps de Firestore a strings ISO
            const denuncia = {
                id: doc.id,
                ...data,
                fechaCreacion: data.fechaCreacion?.toDate ? data.fechaCreacion.toDate().toISOString() : data.fechaCreacion,
                created_at: data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at,
                updated_at: data.updated_at?.toDate ? data.updated_at.toDate().toISOString() : data.updated_at
            };

            denuncias.push(denuncia);
        });

        console.log(`✅ Se obtuvieron ${denuncias.length} denuncias de Firebase`);

        // Guardar en archivo JSON
        const archivo = 'denuncias-firebase-export.json';
        fs.writeFileSync(archivo, JSON.stringify(denuncias, null, 2), 'utf8');

        console.log('');
        console.log('✅ EXPORTACIÓN EXITOSA');
        console.log(`📄 Archivo guardado: ${archivo}`);
        console.log(`📊 Total de denuncias: ${denuncias.length}`);
        console.log('');
        console.log('📋 Resumen de campos encontrados:');

        // Mostrar resumen de campos
        if (denuncias.length > 0) {
            const camposEjemplo = Object.keys(denuncias[0]);
            console.log('   Campos:', camposEjemplo.join(', '));

            // Mostrar primera denuncia como ejemplo
            console.log('');
            console.log('📝 Ejemplo de la primera denuncia:');
            console.log(JSON.stringify(denuncias[0], null, 2));
        }

        console.log('');
        console.log('🎉 Listo para importar a PostgreSQL!');
        console.log('   Ejecuta: node import-to-postgres.js');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error exportando denuncias:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Ejecutar exportación
exportarDenuncias();
