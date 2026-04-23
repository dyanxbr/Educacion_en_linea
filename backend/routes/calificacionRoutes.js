const router = require('express').Router();
const {
    calificar,
    obtenerCalificacionesCurso,
    obtenerTodasCalificaciones
} = require('../controllers/calificacionController');

router.post('/', calificar);
router.get('/curso/:curso_id', obtenerCalificacionesCurso);
router.get('/admin', obtenerTodasCalificaciones);

module.exports = router;