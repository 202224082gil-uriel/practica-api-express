const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const upload = require('../config/multer');

router.post('/importar', upload.single('archivo'), batchController.importarDatos);
router.get('/exportar/:formato', batchController.exportarDatos);

module.exports = router;