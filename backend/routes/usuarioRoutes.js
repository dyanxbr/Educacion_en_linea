const express = require('express');
const router = express.Router();
const multer = require('multer');
const usuarioController = require('../controllers/usuarioController');

// Configurar multer para usar memoria (sin necesidad de carpeta uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ============ DEFINICIÓN DE RUTAS ============

// Obtener todos los usuarios
router.get('/', usuarioController.obtenerTodos);

// Obtener perfil de un usuario específico
router.get('/perfil/:usuario_id', usuarioController.obtenerPerfil);

// Cambiar contraseña
router.put('/cambiar-password/:usuario_id', usuarioController.cambiarPassword);

// Cambiar tema (CLARO/OSCURO)
router.put('/tema/:usuario_id', usuarioController.cambiarTema);

// Actualizar imagen de perfil
router.put('/imagen/:usuario_id', upload.single('imagen'), usuarioController.actualizarImagen);

module.exports = router;