const express = require('express');
const router = express.Router();
const {
    calificarCurso,
    obtenerCalificacionesCurso,
    obtenerTodasCalificaciones
} = require('../controllers/calificacionController');

// POST /calificaciones/:usuario_id/:curso_id
router.post('/:usuario_id/:curso_id', calificarCurso);

// GET /calificaciones/curso/:curso_id
router.get('/curso/:curso_id', obtenerCalificacionesCurso);

// GET /calificaciones/admin
router.get('/admin', obtenerTodasCalificaciones);

module.exports = router;