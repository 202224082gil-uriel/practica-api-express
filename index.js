const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db'); 

const productosRoutes = require('./routes/productos');
const batchRoutes = require('./routes/batch');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/recursos', batchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Servidor escuchando en http://localhost:${PORT}`);
});