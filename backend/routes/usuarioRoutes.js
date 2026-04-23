const router = require('express').Router();
const multer = require('multer');

// 🔥 SOLO ESTA CONFIG
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

// 🔥 IMPORTANTE
router.put('/imagen', upload.single('imagen'), actualizarImagen);

router.get('/', obtenerTodos);

module.exports = router;