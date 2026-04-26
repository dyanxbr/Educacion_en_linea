const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoController');

// Rutas existentes
router.post('/generar', certificadoController.generarCertificado);
router.get('/mis-certificados', certificadoController.misCertificados);

// Rutas de prueba (agregar solo para depuración)
router.get('/test/:usuario_id/:curso_id', certificadoController.testGenerarPdf);
router.get('/verificar-cloudinary', certificadoController.verificarCloudinary);

module.exports = router;