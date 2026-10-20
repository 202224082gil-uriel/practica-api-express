const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '', 
    database: process.env.DB_NAME || 'api_practica',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

db.query('SELECT 1')
    .then(() => console.log('✅ Conectado exitosamente a la base de datos MySQL'))
    .catch((err) => console.error('❌ Error al conectar a la base de datos:', err));

module.exports = db;