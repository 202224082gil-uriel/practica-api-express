const db = require('../config/db');

const productosController = {
    // GET /api/productos
    getAll: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM productos');
            res.status(200).json(rows);
        } catch (error) {
            console.error('❌ Error en GET all:', error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    },

    // GET /api/productos/:id
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.status(200).json(rows[0]);
        } catch (error) {
            console.error('❌ Error en GET by ID:', error);
            res.status(500).json({ error: 'Error al buscar el producto' });
        }
    },

    // POST /api/productos
    create: async (req, res) => {
        try {
            const { nombre, precio, stock } = req.body;
            console.log('📥 Body recibido:', req.body);

            const [result] = await db.query(
                'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
                [nombre, precio, stock]
            );

            const [nuevo] = await db.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
            res.status(201).json(nuevo[0]);
        } catch (error) {
            console.error('❌ Error en POST:', error);
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    },

    // PUT /api/productos/:id
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, precio, stock } = req.body;
            console.log('📥 Body recibido (PUT):', req.body);

            const [result] = await db.query(
                'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
                [nombre, precio, stock, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const [actualizado] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
            res.status(200).json(actualizado[0]);
        } catch (error) {
            console.error('❌ Error en PUT:', error);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    },

    // DELETE /api/productos/:id
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
        } catch (error) {
            console.error('❌ Error en DELETE:', error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
};

module.exports = productosController;