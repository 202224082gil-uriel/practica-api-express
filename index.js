const express = require('express');
require('dotenv').config();

// Importar conexión a la base de datos (se ejecuta al levantar)
require('./config/db');

const productosRoutes = require('./routes/productos');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

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