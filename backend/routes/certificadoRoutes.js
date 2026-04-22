const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { generarCertificado, misCertificados } = require('../controllers/certificadoController');

// POST /certificados/generar
router.post('/generar', auth, generarCertificado);

// GET /certificados/mis-certificados
router.get('/mis-certificados', auth, misCertificados);

module.exports = router;