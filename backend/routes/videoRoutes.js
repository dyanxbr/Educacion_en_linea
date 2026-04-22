const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const rol = require('../middlewares/rolMiddleware');
const {
    agregarVideo,
    obtenerVideosPorCurso,
    actualizarVideo,
    eliminarVideo
} = require('../controllers/videoController');

// GET /videos/curso/:curso_id  — cualquier autenticado
router.get('/curso/:curso_id', auth, obtenerVideosPorCurso);

// POST /videos  — solo ADMIN
router.post('/', auth, rol('ADMIN'), agregarVideo);

// PUT /videos/:id  — solo ADMIN
router.put('/:id', auth, rol('ADMIN'), actualizarVideo);

// DELETE /videos/:id  — solo ADMIN
router.delete('/:id', auth, rol('ADMIN'), eliminarVideo);

module.exports = router;