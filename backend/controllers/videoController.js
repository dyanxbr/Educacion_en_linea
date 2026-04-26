const conexion = require('../config/db');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.crearVideo = async (req, res) => {
    const { titulo, curso_id, orden } = req.body;

    if (!titulo) {
        return res.status(400).json({ error: 'El título es obligatorio' });
    }
    if (!curso_id) {
        return res.status(400).json({ error: 'El curso_id es obligatorio' });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'Debes seleccionar un archivo de video' });
    }

    try {
        // Subir video a Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'videos',
                    resource_type: 'video',
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        const url_video = uploadResult.secure_url;
        const public_id = uploadResult.public_id;

        // Guardar en base de datos (usando tus columnas reales)
        const sql = `INSERT INTO videos (titulo, curso_id, url_video, orden) 
                     VALUES (?, ?, ?, ?)`;

        conexion.query(sql, [titulo, curso_id, url_video, orden || 0], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            res.status(201).json({ 
                mensaje: 'Video creado correctamente', 
                id: result.insertId,
                url_video: url_video,
                titulo: titulo,
                curso_id: curso_id
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al subir el video: ' + err.message });
    }
};

exports.obtenerVideos = (req, res) => {
    const { curso_id } = req.params;

    conexion.query(
        'SELECT id, titulo, url_video, orden FROM videos WHERE curso_id = ? ORDER BY orden ASC',
        [curso_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};

exports.obtenerVideo = (req, res) => {
    const { id } = req.params;

    conexion.query(
        'SELECT id, titulo, url_video, orden, curso_id FROM videos WHERE id = ?',
        [id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: 'Video no encontrado' });
            res.json(results[0]);
        }
    );
};

exports.actualizarVideo = async (req, res) => {
    const { id } = req.params;
    const { titulo, orden } = req.body;

    try {
        let url_video = null;
        let public_id = null;

        // Si se subió un nuevo video
        if (req.file) {
            // Subir nuevo video a Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'videos',
                        resource_type: 'video',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            url_video = uploadResult.secure_url;
            public_id = uploadResult.public_id;

            // Actualizar con nuevo video
            const sql = `UPDATE videos SET titulo = ?, url_video = ?, orden = ? WHERE id = ?`;
            conexion.query(sql, [titulo, url_video, orden, id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) return res.status(404).json({ error: 'Video no encontrado' });
                res.json({ mensaje: 'Video actualizado', url_video: url_video });
            });
        } else {
            // Actualizar solo título y orden
            const sql = `UPDATE videos SET titulo = ?, orden = ? WHERE id = ?`;
            conexion.query(sql, [titulo, orden, id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) return res.status(404).json({ error: 'Video no encontrado' });
                res.json({ mensaje: 'Video actualizado' });
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarVideo = (req, res) => {
    const { id } = req.params;

    conexion.query('DELETE FROM videos WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Video no encontrado' });
        res.json({ mensaje: 'Video eliminado correctamente' });
    });
};

exports.uploadMiddleware = upload.single('video');