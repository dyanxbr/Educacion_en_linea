const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const rol = require('../middlewares/rolMiddleware');
const {
    calificar,
    obtenerCalificacionesCurso,
    obtenerTodasCalificaciones
} = require('../controllers/calificacionController');

// POST /calificaciones  — solo USUARIO (al terminar el curso)
router.post('/', auth, rol('USUARIO'), calificar);

// GET /calificaciones/curso/:curso_id  — cualquier autenticado
router.get('/curso/:curso_id', auth, obtenerCalificacionesCurso);

// GET /calificaciones/admin  — solo ADMIN
router.get('/admin', auth, rol('ADMIN'), obtenerTodasCalificaciones);

module.exports = router;