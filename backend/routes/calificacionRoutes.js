const express = require('express');
const router = express.Router();
const {
    calificarCurso,
    obtenerCalificacionesCurso,
    obtenerTodasCalificaciones
} = require('../controllers/calificacionController');

router.post('/:usuario_id/:curso_id', calificarCurso);

router.get('/curso/:curso_id', obtenerCalificacionesCurso);

router.get('/admin', obtenerTodasCalificaciones);

module.exports = router;