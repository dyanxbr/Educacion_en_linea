const router = require('express').Router();
const {
    cursosPopulares,
    visualizacionesPorVideo,
    comentariosCurso,
    resumenGeneral
} = require('../controllers/reporteController');

router.get('/cursos-populares', cursosPopulares);
router.get('/visualizaciones', visualizacionesPorVideo);
router.get('/comentarios/:curso_id', comentariosCurso);
router.get('/resumen', resumenGeneral);

module.exports = router;