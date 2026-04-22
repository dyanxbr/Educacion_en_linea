const conexion = require('../config/db');

// POST /calificaciones  (solo USUARIO, y solo si terminó el curso)
exports.calificar = (req, res) => {
    const { curso_id, puntuacion, comentario } = req.body;
    const usuario_id = req.usuario.id;

    if (!curso_id || !puntuacion || !comentario) {
        return res.status(400).json({ error: 'curso_id, puntuacion y comentario son obligatorios' });
    }

    if (puntuacion < 1 || puntuacion > 5) {
        return res.status(400).json({ error: 'La puntuación debe ser entre 1 y 5' });
    }

    // Verificar que el usuario completó todos los videos del curso
    const sqlCompletado = `
        SELECT
            COUNT(v.id) AS total,
            SUM(CASE WHEN p.visto = TRUE THEN 1 ELSE 0 END) AS vistos
        FROM videos v
        LEFT JOIN progreso p ON p.video_id = v.id AND p.usuario_id = ?
        WHERE v.curso_id = ?
    `;

    conexion.query(sqlCompletado, [usuario_id, curso_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const { total, vistos } = result[0];

        if (total === 0) {
            return res.status(400).json({ error: 'El curso no tiene videos' });
        }

        if (parseInt(vistos) < parseInt(total)) {
            return res.status(403).json({
                error: `Debes completar todos los videos antes de calificar. Llevas ${vistos}/${total}`
            });
        }

        // Insertar calificación (UNIQUE usuario_id + curso_id evita duplicados en BD)
        const sql = `
            INSERT INTO calificaciones (usuario_id, curso_id, puntuacion, comentario)
            VALUES (?, ?, ?, ?)
        `;

        conexion.query(sql, [usuario_id, curso_id, puntuacion, comentario], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Ya calificaste este curso anteriormente' });
                }
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ mensaje: 'Curso calificado correctamente', id: result.insertId });
        });
    });
};

// GET /calificaciones/curso/:curso_id  — ver calificaciones de un curso
exports.obtenerCalificacionesCurso = (req, res) => {
    const { curso_id } = req.params;

    const sql = `
        SELECT
            cal.id,
            cal.puntuacion,
            cal.comentario,
            cal.fecha,
            u.nombre_completo,
            u.imagen_url
        FROM calificaciones cal
        JOIN usuarios u ON cal.usuario_id = u.id
        WHERE cal.curso_id = ?
        ORDER BY cal.fecha DESC
    `;

    conexion.query(sql, [curso_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// GET /calificaciones/admin  — todas las calificaciones (solo ADMIN)
exports.obtenerTodasCalificaciones = (req, res) => {
    const sql = `
        SELECT
            cal.id,
            cal.puntuacion,
            cal.comentario,
            cal.fecha,
            u.nombre_completo AS usuario,
            c.nombre AS curso
        FROM calificaciones cal
        JOIN usuarios u ON cal.usuario_id = u.id
        JOIN cursos c ON cal.curso_id = c.id
        ORDER BY cal.fecha DESC
    `;

    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};