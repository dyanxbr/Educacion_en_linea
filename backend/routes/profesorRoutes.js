const router = require('express').Router();
const {
    crearProfesor,
    obtenerProfesores,
    obtenerProfesor,
    actualizarProfesor,
    eliminarProfesor
} = require('../controllers/profesorController');

router.get('/', obtenerProfesores);
router.get('/:id', obtenerProfesor);
router.post('/', crearProfesor);
router.put('/:id', actualizarProfesor);
router.delete('/:id', eliminarProfesor);

module.exports = router;