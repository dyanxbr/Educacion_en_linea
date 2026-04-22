const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const { verVideo, obtenerProgresoCurso } = require('../controllers/progresoController');

// POST /progreso/ver-video
router.post('/ver-video', auth, verVideo);

// GET /progreso/curso/:curso_id  — progreso del usuario autenticado en un curso
router.get('/curso/:curso_id', auth, obtenerProgresoCurso);

module.exports = router;