const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const rol = require('../middlewares/rolMiddleware');
const multer = require('multer');
const {
    obtenerPerfil,
    cambiarPassword,
    cambiarTema,
    actualizarImagen,
    obtenerTodos
} = require('../controllers/usuarioController');

const upload = multer({ dest: 'uploads/' });

// GET /usuarios/perfil  — usuario autenticado
router.get('/perfil', auth, obtenerPerfil);

// PUT /usuarios/cambiar-password
router.put('/cambiar-password', auth, cambiarPassword);

// PUT /usuarios/tema
router.put('/tema', auth, cambiarTema);

// PUT /usuarios/imagen  — con imagen adjunta
router.put('/imagen', auth, upload.single('imagen'), actualizarImagen);

// GET /usuarios  — solo ADMIN
router.get('/', auth, rol('ADMIN'), obtenerTodos);

module.exports = router;