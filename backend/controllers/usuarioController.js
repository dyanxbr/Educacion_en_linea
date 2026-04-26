const conexion = require('../config/db');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;


exports.obtenerPerfil = (req, res) => {
    const { usuario_id } = req.params;
    
    if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id es requerido' });
    }

    const sql = `SELECT id, nombre_completo, correo, imagen_url, tema, rol, fecha_registro 
                 FROM usuarios WHERE id = ?`;

    conexion.query(sql, [usuario_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(result[0]);
    });
};

exports.cambiarPassword = async (req, res) => {
    const { usuario_id } = req.params;
    const { password_actual, password_nueva } = req.body;

    if (!password_actual || !password_nueva) {
        return res.status(400).json({ 
            error: 'password_actual y password_nueva son requeridos' 
        });
    }

    conexion.query('SELECT password FROM usuarios WHERE id = ?', [usuario_id], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const valido = await bcrypt.compare(password_actual, result[0].password);
        if (!valido) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        const hash = await bcrypt.hash(password_nueva, 10);

        conexion.query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, usuario_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Contraseña actualizada correctamente' });
        });
    });
};

exports.cambiarTema = (req, res) => {
    const { usuario_id } = req.params;
    const { tema } = req.body;

    if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id es requerido' });
    }
    
    if (!['CLARO', 'OSCURO'].includes(tema)) {
        return res.status(400).json({ error: 'Tema inválido. Use CLARO u OSCURO' });
    }

    conexion.query('UPDATE usuarios SET tema = ? WHERE id = ?', [tema, usuario_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: `Tema cambiado a ${tema}` });
    });
};

exports.actualizarImagen = async (req, res) => {
    const { usuario_id } = req.params;
    
    if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id es requerido' });
    }

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió imagen' });
        }

        conexion.query('SELECT public_id FROM usuarios WHERE id = ?', [usuario_id], async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const publicIdAnterior = result[0]?.public_id;
            
            if (publicIdAnterior) {
                await cloudinary.uploader.destroy(publicIdAnterior);
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'usuarios',
                        transformation: [{ width: 300, height: 300, crop: 'fill' }]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            conexion.query(
                'UPDATE usuarios SET imagen_url = ?, public_id = ? WHERE id = ?',
                [uploadResult.secure_url, uploadResult.public_id, usuario_id],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ 
                        mensaje: 'Imagen actualizada correctamente', 
                        imagen_url: uploadResult.secure_url 
                    });
                }
            );
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerTodos = (req, res) => {
    const sql = `SELECT id, nombre_completo, correo, imagen_url, tema, rol, fecha_registro 
                 FROM usuarios ORDER BY fecha_registro DESC`;

    conexion.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};