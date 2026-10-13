const express = require('express');
require('dotenv').config();

// Importar conexión a la base de datos (se ejecuta al levantar)
require('./config/db');

const productosRoutes = require('./routes/productos');

const cors = require('cors');   // ← NUEVA LÍNEA 1

const app = express();

app.use(cors());                // ← NUEVA LÍNEA 2 (habilitar CORS)
app.use(express.json());        // Middleware para parsear JSON

// Ruta base
app.get('/', (req, res) => {
    res.send('🚀 Servidor en línea con base de datos conectada');
});

// Rutas de la API
app.use('/api/productos', productosRoutes);

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Servidor escuchando en http://localhost:${PORT}`);
});