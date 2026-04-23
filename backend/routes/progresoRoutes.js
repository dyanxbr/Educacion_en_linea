const router = require('express').Router();
const { verVideo, obtenerProgresoCurso } = require('../controllers/progresoController');

router.post('/ver-video', verVideo);
router.get('/curso/:curso_id', obtenerProgresoCurso);

module.exports = router;