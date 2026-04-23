const router = require('express').Router();
const multer = require('multer');

// 🔥 SOLO UNA DEFINICIÓN
const upload = multer({ storage: multer.memoryStorage() });

const {
    obtenerPerfil,
    cambiarPassword,
    cambiarTema,
    actualizarImagen,
    obtenerTodos
} = require('../controllers/usuarioController');

// Rutas
router.get('/perfil', obtenerPerfil);
router.put('/cambiar-password', cambiarPassword);
router.put('/tema', cambiarTema);

// 🔥 ESTA USA MULTER
router.put('/imagen', upload.single('imagen'), actualizarImagen);

router.get('/', obtenerTodos);

module.exports = router;