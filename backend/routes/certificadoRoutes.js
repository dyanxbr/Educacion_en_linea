const router = require('express').Router();
const { generarCertificado, misCertificados } = require('../controllers/certificadoController');

router.post('/generar', generarCertificado);
router.get('/mis-certificados', misCertificados);

module.exports = router;