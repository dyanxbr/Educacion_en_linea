const express = require('express');
const router = express.Router();
const multer = require('multer');
const usuarioController = require('../controllers/usuarioController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', usuarioController.obtenerTodos);

router.get('/perfil/:usuario_id', usuarioController.obtenerPerfil);

router.put('/cambiar-password/:usuario_id', usuarioController.cambiarPassword);

router.put('/tema/:usuario_id', usuarioController.cambiarTema);

router.put('/imagen/:usuario_id', upload.single('imagen'), usuarioController.actualizarImagen);

module.exports = router;