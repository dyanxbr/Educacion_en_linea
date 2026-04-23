const router = require('express').Router();
const {
    crearCurso,
    obtenerCursos,
    obtenerCurso,
    actualizarCurso,
    eliminarCurso
} = require('../controllers/cursoController');

router.get('/', obtenerCursos);
router.get('/:id', obtenerCurso);
router.post('/', crearCurso);
router.put('/:id', actualizarCurso);
router.delete('/:id', eliminarCurso);

module.exports = router;