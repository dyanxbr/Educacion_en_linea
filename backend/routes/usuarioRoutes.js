const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    obtenerPerfil,
    cambiarPassword,
    cambiarTema,
    actualizarImagen,
    obtenerTodos
} = require('../controllers/usuarioController');

const upload = multer({ dest: 'uploads/' });

// GET /usuarios/perfil?usuario_id=1
router.get('/perfil', obtenerPerfil);

// PUT /usuarios/cambiar-password
router.put('/cambiar-password', cambiarPassword);

// PUT /usuarios/tema
router.put('/tema', cambiarTema);

// PUT /usuarios/imagen
router.put('/imagen', upload.single('imagen'), actualizarImagen);

// GET /usuarios
router.get('/', obtenerTodos);

module.exports = router;