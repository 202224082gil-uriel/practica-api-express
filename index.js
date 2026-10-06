const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Arreglo en memoria (entidad: catálogo de libros)
let libros = [
  { id: 1, nombre: 'Cien años de soledad', autor: 'Gabriel García Márquez' },
  { id: 2, nombre: '1984', autor: 'George Orwell' },
  { id: 3, nombre: 'El principito', autor: 'Antoine de Saint-Exupéry' }
];

// Variable para IDs dinámicos
let nextId = 4;

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor en línea ✅');
});

// GET /api/recursos - Obtener todos
app.get('/api/recursos', (req, res) => {
  res.status(200).json(libros);
});

// GET /api/recursos/:id - Obtener uno por ID
app.get('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const libro = libros.find(l => l.id === id);

  if (!libro) {
    return res.status(404).json({ mensaje: 'Recurso no encontrado' });
  }
  res.status(200).json(libro);
});

// POST /api/recursos - Crear nuevo
app.post('/api/recursos', (req, res) => {
  const { nombre, autor } = req.body;

  if (!nombre || !autor) {
    return res.status(400).json({ mensaje: 'Faltan campos: nombre y autor' });
  }

  const nuevoLibro = {
    id: nextId++,
    nombre,
    autor
  };

  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});

// PUT /api/recursos/:id - Actualizar
app.put('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const libro = libros.find(l => l.id === id);

  if (!libro) {
    return res.status(404).json({ mensaje: 'Recurso no encontrado' });
  }

  const { nombre, autor } = req.body;
  if (nombre) libro.nombre = nombre;
  if (autor) libro.autor = autor;

  res.status(200).json(libro);
});

// DELETE /api/recursos/:id - Eliminar
app.delete('/api/recursos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = libros.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Recurso no encontrado' });
  }

  const eliminado = libros.splice(index, 1)[0];
  res.status(200).json({
    mensaje: 'Recurso eliminado correctamente',
    recurso: eliminado
  });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});