const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const db = require('../config/db'); 

// --- IMPORTAR ---
exports.importarDatos = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo.' });
    }

    const rutaArchivo = req.file.path;
    const extension = req.file.originalname.split('.').pop().toLowerCase();
    let datosParaInsertar = [];

    try {
        if (extension === 'json') {
            const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
            datosParaInsertar = JSON.parse(contenido);
            await insertarEnBD(datosParaInsertar);
            finalizar(req, res, rutaArchivo, datosParaInsertar.length);

        } else if (extension === 'csv') {
            fs.createReadStream(rutaArchivo)
                .pipe(csv())
                .on('data', (fila) => {
                    datosParaInsertar.push(fila);
                })
                .on('end', async () => {
                    try {
                        await insertarEnBD(datosParaInsertar);
                        finalizar(req, res, rutaArchivo, datosParaInsertar.length);
                    } catch (errInsert) {
                        if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
                        res.status(500).json({ error: 'Error insertando en BD: ' + errInsert.message });
                    }
                })
                .on('error', (errCsv) => {
                    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
                    res.status(500).json({ error: 'Error leyendo CSV: ' + errCsv.message });
                });
        } else {
            if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
            return res.status(400).json({ error: 'Formato no soportado. Usa .json o .csv' });
        }
    } catch (error) {
        console.error(error);
        if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
        res.status(500).json({ error: 'Error en el servidor: ' + error.message });
    }
};

async function insertarEnBD(datos) {
    for (const item of datos) {
        // IMPORTANTE: Asegúrate de que los nombres coincidan con tu tabla en phpMyAdmin
        const query = 'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)';
        await db.execute(query, [item.nombre, item.precio, item.cantidad]);
    }
}

function finalizar(req, res, rutaArchivo, cantidad) {
    if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo); 
    res.status(200).json({ mensaje: 'Importación exitosa', registrosInsertados: cantidad });
}

// --- EXPORTAR ---
exports.exportarDatos = async (req, res) => {
    const formato = req.params.formato.toLowerCase();

    try {
        const [registros] = await db.execute('SELECT * FROM productos');

        if (formato === 'json') {
            res.setHeader('Content-Disposition', 'attachment; filename=datos_exportados.json');
            res.setHeader('Content-Type', 'application/json');
            return res.send(JSON.stringify(registros, null, 2));
            
        } else if (formato === 'csv') {
            const parser = new Parser();
            const csvData = parser.parse(registros);
            
            res.setHeader('Content-Disposition', 'attachment; filename=datos_exportados.csv');
            res.setHeader('Content-Type', 'text/csv');
            return res.send(csvData);

        } else {
            return res.status(400).json({ error: 'Formato no válido. Usa json o csv.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al exportar los datos: ' + error.message });
    }
};