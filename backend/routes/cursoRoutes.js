const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const rol = require('../middlewares/rolMiddleware');
const {
    crearCurso,
    obtenerCursos,
    obtenerCurso,
    actualizarCurso,
    eliminarCurso
} = require('../controllers/cursoController');

// GET /cursos  — cualquier autenticado
router.get('/', auth, obtenerCursos);

// GET /cursos/:id
router.get('/:id', auth, obtenerCurso);

// POST /cursos  — solo ADMIN
router.post('/', auth, rol('ADMIN'), crearCurso);

// PUT /cursos/:id  — solo ADMIN
router.put('/:id', auth, rol('ADMIN'), actualizarCurso);

// DELETE /cursos/:id  — solo ADMIN
router.delete('/:id', auth, rol('ADMIN'), eliminarCurso);

module.exports = router;