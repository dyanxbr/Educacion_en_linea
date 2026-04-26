const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoController');

router.post('/generar', certificadoController.generarCertificado);
router.get('/mis-certificados', certificadoController.misCertificados);

router.get('/test/:usuario_id/:curso_id', certificadoController.testGenerarPdf);
router.get('/verificar-cloudinary', certificadoController.verificarCloudinary);

module.exports = router;