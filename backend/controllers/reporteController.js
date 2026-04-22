const conexion = require('../config/db');

// GET /reportes/cursos-populares  — cursos ordenados por calificación promedio
exports.cursosPopulares = (req, res) => {
    const sql = `
        SELECT
            c.id,
            c.nombre AS curso,
            p.nombre AS profesor,
            COUNT(DISTINCT cal.id) AS total_calificaciones,
            ROUND(AVG(cal.puntuacion), 2) AS promedio,
            COUNT(DISTINCT vis.usuario_id) AS usuarios_unicos
        FROM cursos c
        LEFT JOIN profesores p ON c.profesor_id = p.id
        LEFT JOIN calificaciones cal ON cal.curso_id = c.id
        LEFT JOIN visualizaciones vis ON vis.video_id IN (
            SELECT id FROM videos WHERE curso_id = c.id
        )
        GROUP BY c.id
        ORDER BY promedio DESC, total_calificaciones DESC
    `;

    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// GET /reportes/visualizaciones  — qué videos se ven más
exports.visualizacionesPorVideo = (req, res) => {
    const sql = `
        SELECT
            v.titulo AS video,
            c.nombre AS curso,
            COUNT(vis.id) AS total_visualizaciones,
            COUNT(DISTINCT vis.usuario_id) AS usuarios_unicos
        FROM visualizaciones vis
        JOIN videos v ON vis.video_id = v.id
        JOIN cursos c ON v.curso_id = c.id
        GROUP BY v.id
        ORDER BY total_visualizaciones DESC
    `;

    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// GET /reportes/comentarios/:curso_id  — comentarios de un curso con detalle
exports.comentariosCurso = (req, res) => {
    const { curso_id } = req.params;

    const sql = `
        SELECT
            u.nombre_completo,
            u.imagen_url,
            cal.puntuacion,
            cal.comentario,
            cal.fecha
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

// GET /reportes/resumen  — resumen general del sistema
exports.resumenGeneral = (req, res) => {
    const queries = {
        totalUsuarios: 'SELECT COUNT(*) AS total FROM usuarios WHERE rol = "USUARIO"',
        totalCursos: 'SELECT COUNT(*) AS total FROM cursos',
        totalProfesores: 'SELECT COUNT(*) AS total FROM profesores',
        totalVisualizaciones: 'SELECT COUNT(*) AS total FROM visualizaciones',
        totalCertificados: 'SELECT COUNT(*) AS total FROM certificados'
    };

    const resultados = {};
    const keys = Object.keys(queries);
    let completados = 0;

    keys.forEach(key => {
        conexion.query(queries[key], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            resultados[key] = result[0].total;
            completados++;

            if (completados === keys.length) {
                res.json(resultados);
            }
        });
    });
};