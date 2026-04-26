const conexion = require('../config/db');

exports.crearCurso = (req, res) => {
    const { nombre, profesor_id } = req.body;

    if (!nombre || !profesor_id) {
        return res.status(400).json({ error: 'Nombre y profesor_id son obligatorios' });
    }

    const sql = `INSERT INTO cursos (nombre, profesor_id) VALUES (?, ?)`;

    conexion.query(sql, [nombre, profesor_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Curso creado', id: result.insertId });
    });
};

exports.obtenerCursos = (req, res) => {
    const sql = `
        SELECT
            c.id,
            c.nombre,
            p.id AS profesor_id,
            p.nombre AS profesor,
            p.especialidad,
            COUNT(DISTINCT v.id) AS total_videos,
            IFNULL(ROUND(AVG(cal.puntuacion), 1), 0) AS calificacion_promedio
        FROM cursos c
        LEFT JOIN profesores p ON c.profesor_id = p.id
        LEFT JOIN videos v ON v.curso_id = c.id
        LEFT JOIN calificaciones cal ON cal.curso_id = c.id
        GROUP BY c.id
        ORDER BY c.nombre
    `;

    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.obtenerCurso = (req, res) => {
    const { id } = req.params;

    const sqlCurso = `
        SELECT c.*, p.nombre AS profesor, p.especialidad
        FROM cursos c
        LEFT JOIN profesores p ON c.profesor_id = p.id
        WHERE c.id = ?
    `;

    conexion.query(sqlCurso, [id], (err, cursoResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (cursoResult.length === 0) return res.status(404).json({ error: 'Curso no encontrado' });

        const sqlVideos = `SELECT * FROM videos WHERE curso_id = ? ORDER BY orden`;

        conexion.query(sqlVideos, [id], (err, videosResult) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ ...cursoResult[0], videos: videosResult });
        });
    });
};

exports.actualizarCurso = (req, res) => {
    const { nombre, profesor_id } = req.body;

    const sql = `UPDATE cursos SET nombre = ?, profesor_id = ? WHERE id = ?`;

    conexion.query(sql, [nombre, profesor_id, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json({ mensaje: 'Curso actualizado' });
    });
};

exports.eliminarCurso = (req, res) => {
    conexion.query('DELETE FROM cursos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json({ mensaje: 'Curso eliminado' });
    });
};