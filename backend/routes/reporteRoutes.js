const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const rol = require('../middlewares/rolMiddleware');
const {
    cursosPopulares,
    visualizacionesPorVideo,
    comentariosCurso,
    resumenGeneral
} = require('../controllers/reporteController');

// Todos los reportes son solo ADMIN
router.get('/cursos-populares', auth, rol('ADMIN'), cursosPopulares);
router.get('/visualizaciones', auth, rol('ADMIN'), visualizacionesPorVideo);
router.get('/comentarios/:curso_id', auth, rol('ADMIN'), comentariosCurso);
router.get('/resumen', auth, rol('ADMIN'), resumenGeneral);

module.exports = router;