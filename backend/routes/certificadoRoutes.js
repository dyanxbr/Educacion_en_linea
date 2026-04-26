const express = require('express');
const router = express.Router();
const { 
    generarCertificado, 
    misCertificados, 
    testGenerarPdf,
    verificarCloudinary 
} = require('../controllers/certificadoController');

router.post('/generar', generarCertificado);
router.get('/mis-certificados', misCertificados);
router.get('/test/:usuario_id/:curso_id', testGenerarPdf);  // ← Ruta de prueba
router.get('/verificar-cloudinary', verificarCloudinary);   // ← Verificar Cloudinary

module.exports = router;