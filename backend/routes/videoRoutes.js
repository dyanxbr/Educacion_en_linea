const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Rutas
router.get('/:curso_id', videoController.obtenerVideos);
router.get('/detalle/:id', videoController.obtenerVideo);
router.post('/', videoController.uploadMiddleware, videoController.crearVideo);
router.put('/:id', videoController.uploadMiddleware, videoController.actualizarVideo);
router.delete('/:id', videoController.eliminarVideo);

module.exports = router;