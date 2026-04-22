const conexion = require('../config/db');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

// GET /usuarios/perfil  (usuario autenticado ve su propio perfil)
exports.obtenerPerfil = (req, res) => {
    const sql = `
        SELECT id, nombre_completo, correo, imagen_url, tema, rol, fecha_registro
        FROM usuarios WHERE id = ?
    `;

    conexion.query(sql, [req.usuario.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(result[0]);
    });
};

// PUT /usuarios/cambiar-password
exports.cambiarPassword = async (req, res) => {
    const { password_actual, password_nueva } = req.body;

    if (!password_actual || !password_nueva) {
        return res.status(400).json({ error: 'Ambas contraseñas son requeridas' });
    }

    conexion.query('SELECT password FROM usuarios WHERE id = ?', [req.usuario.id], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const valido = await bcrypt.compare(password_actual, result[0].password);
        if (!valido) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

        const hash = await bcrypt.hash(password_nueva, 10);

        conexion.query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, req.usuario.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Contraseña actualizada' });
        });
    });
};

// PUT /usuarios/tema
exports.cambiarTema = (req, res) => {
    const { tema } = req.body; // 'CLARO' o 'OSCURO'

    if (!['CLARO', 'OSCURO'].includes(tema)) {
        return res.status(400).json({ error: 'Tema inválido. Use CLARO u OSCURO' });
    }

    conexion.query('UPDATE usuarios SET tema = ? WHERE id = ?', [tema, req.usuario.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: `Tema cambiado a ${tema}` });
    });
};

// PUT /usuarios/imagen  (subir imagen a Cloudinary)
exports.actualizarImagen = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });

        // Si ya tiene imagen, eliminar la anterior de Cloudinary
        conexion.query('SELECT public_id FROM usuarios WHERE id = ?', [req.usuario.id], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const publicIdAnterior = result[0]?.public_id;
            if (publicIdAnterior) {
                await cloudinary.uploader.destroy(publicIdAnterior);
            }

            // Subir nueva imagen
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'usuarios',
                transformation: [{ width: 300, height: 300, crop: 'fill' }]
            });

            conexion.query(
                'UPDATE usuarios SET imagen_url = ?, public_id = ? WHERE id = ?',
                [uploadResult.secure_url, uploadResult.public_id, req.usuario.id],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ mensaje: 'Imagen actualizada', imagen_url: uploadResult.secure_url });
                }
            );
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /usuarios  (solo ADMIN)
exports.obtenerTodos = (req, res) => {
    const sql = `
        SELECT id, nombre_completo, correo, imagen_url, tema, rol, fecha_registro
        FROM usuarios ORDER BY fecha_registro DESC
    `;

    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};