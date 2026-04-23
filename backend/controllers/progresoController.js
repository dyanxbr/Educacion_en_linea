const conexion = require('../config/db');

// POST /progreso/ver-video
exports.verVideo = (req, res) => {
    const { usuario_id, video_id } = req.body;

    if (!usuario_id || !video_id) return res.status(400).json({ error: 'usuario_id y video_id son requeridos' });

    const sqlVideo = `SELECT * FROM videos WHERE id = ?`;

    conexion.query(sqlVideo, [video_id], (err, videoResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (videoResult.length === 0) return res.status(404).json({ error: 'Video no encontrado' });

        const video = videoResult[0];

        if (video.orden === 1) {
            return registrarVisto(usuario_id, video_id, res);
        }

        const sqlAnterior = `SELECT v.id FROM videos v WHERE v.curso_id = ? AND v.orden = ?`;

        conexion.query(sqlAnterior, [video.curso_id, video.orden - 1], (err, anteriorResult) => {
            if (err) return res.status(500).json({ error: err.message });
            if (anteriorResult.length === 0) return res.status(400).json({ error: 'No existe el video anterior' });

            const videoAnteriorId = anteriorResult[0].id;

            const sqlProgreso = `SELECT id FROM progreso WHERE usuario_id = ? AND video_id = ? AND visto = TRUE`;

            conexion.query(sqlProgreso, [usuario_id, videoAnteriorId], (err, progresoResult) => {
                if (err) return res.status(500).json({ error: err.message });

                if (progresoResult.length === 0) {
                    return res.status(403).json({ error: 'Debes completar el video anterior antes de continuar' });
                }

                registrarVisto(usuario_id, video_id, res);
            });
        });
    });
};

function registrarVisto(usuario_id, video_id, res) {
    const sqlUpsert = `
        INSERT INTO progreso (usuario_id, video_id, visto)
        VALUES (?, ?, TRUE)
        ON DUPLICATE KEY UPDATE visto = TRUE
    `;

    conexion.query(sqlUpsert, [usuario_id, video_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        conexion.query(
            'INSERT INTO visualizaciones (usuario_id, video_id) VALUES (?, ?)',
            [usuario_id, video_id]
        );

        res.json({ mensaje: 'Video marcado como visto' });
    });
}

// GET /progreso/curso/:curso_id?usuario_id=1
exports.obtenerProgresoCurso = (req, res) => {
    const { usuario_id } = req.query;
    const { curso_id } = req.params;

    if (!usuario_id) return res.status(400).json({ error: 'usuario_id es requerido como query param' });

    const sql = `
        SELECT
            v.id, v.titulo, v.orden, v.url_video,
            CASE WHEN p.visto = TRUE THEN TRUE ELSE FALSE END AS visto
        FROM videos v
        LEFT JOIN progreso p ON p.video_id = v.id AND p.usuario_id = ?
        WHERE v.curso_id = ?
        ORDER BY v.orden
    `;

    conexion.query(sql, [usuario_id, curso_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const total = results.length;
        const vistos = results.filter(v => v.visto).length;

        res.json({
            progreso: results,
            total_videos: total,
            videos_vistos: vistos,
            porcentaje: total > 0 ? Math.round((vistos / total) * 100) : 0,
            completado: total > 0 && total === vistos
        });
    });
};