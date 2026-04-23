const router = require('express').Router();

const {
    obtenerVideos
} = require('../controllers/videoController');

// GET /videos/1
router.get('/:curso_id', obtenerVideos);

module.exports = router;