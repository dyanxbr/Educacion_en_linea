const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const rol = require('../middlewares/rolMiddleware');
const {
    crearProfesor,
    obtenerProfesores,
    obtenerProfesor,
    actualizarProfesor,
    eliminarProfesor
} = require('../controllers/profesorController');

// GET /profesores  — cualquier autenticado
router.get('/', auth, obtenerProfesores);

// GET /profesores/:id
router.get('/:id', auth, obtenerProfesor);

// POST /profesores  — solo ADMIN
router.post('/', auth, rol('ADMIN'), crearProfesor);

// PUT /profesores/:id  — solo ADMIN
router.put('/:id', auth, rol('ADMIN'), actualizarProfesor);

// DELETE /profesores/:id  — solo ADMIN
router.delete('/:id', auth, rol('ADMIN'), eliminarProfesor);

module.exports = router;