const conexion = require('../config/db');

// GET /videos/:curso_id
exports.obtenerVideos = (req, res) => {
    const { curso_id } = req.params;

    conexion.query(
        'SELECT * FROM videos WHERE curso_id = ? ORDER BY orden ASC',
        [curso_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};