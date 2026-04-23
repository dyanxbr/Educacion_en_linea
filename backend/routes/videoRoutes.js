const router = require('express').Router();
const {
    agregarVideo,
    obtenerVideosPorCurso,
    actualizarVideo,
    eliminarVideo
} = require('../controllers/videoController');

router.get('/curso/:curso_id', obtenerVideosPorCurso);
router.post('/', agregarVideo);
router.put('/:id', actualizarVideo);
router.delete('/:id', eliminarVideo);

module.exports = router;