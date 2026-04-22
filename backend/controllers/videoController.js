const conexion = require('../config/db');

// POST /videos  (solo ADMIN)
exports.agregarVideo = (req, res) => {
    const { curso_id, titulo, url_video, orden } = req.body;

    if (!curso_id || !titulo || !url_video || orden == null) {
        return res.status(400).json({ error: 'curso_id, titulo, url_video y orden son obligatorios' });
    }

    const sql = `INSERT INTO videos (curso_id, titulo, url_video, orden) VALUES (?, ?, ?, ?)`;

    conexion.query(sql, [curso_id, titulo, url_video, orden], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Video agregado', id: result.insertId });
    });
};

// GET /videos/curso/:curso_id  (videos en orden secuencial)
exports.obtenerVideosPorCurso = (req, res) => {
    const { curso_id } = req.params;

    const sql = `SELECT * FROM videos WHERE curso_id = ? ORDER BY orden ASC`;

    conexion.query(sql, [curso_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// PUT /videos/:id  (solo ADMIN)
exports.actualizarVideo = (req, res) => {
    const { titulo, url_video, orden } = req.body;

    const sql = `UPDATE videos SET titulo = ?, url_video = ?, orden = ? WHERE id = ?`;

    conexion.query(sql, [titulo, url_video, orden, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Video no encontrado' });
        res.json({ mensaje: 'Video actualizado' });
    });
};

// DELETE /videos/:id  (solo ADMIN)
exports.eliminarVideo = (req, res) => {
    conexion.query('DELETE FROM videos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Video no encontrado' });
        res.json({ mensaje: 'Video eliminado' });
    });
};