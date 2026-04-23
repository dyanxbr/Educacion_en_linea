const conexion = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /auth/register
exports.register = async (req, res) => {
    const { nombre_completo, correo, password } = req.body;

    if (!nombre_completo || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        conexion.query(
            'SELECT id FROM usuarios WHERE correo = ?',
            [correo],
            async (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                if (result.length > 0) {
                    return res.status(409).json({ error: 'El correo ya está registrado' });
                }

                const hash = await bcrypt.hash(password, 10);

                const sql = `
                    INSERT INTO usuarios (nombre_completo, correo, password, rol)
                    VALUES (?, ?, ?, 'USUARIO')
                `;

                conexion.query(sql, [nombre_completo, correo, hash], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({
                        mensaje: 'Usuario registrado correctamente',
                        id: result.insertId
                    });
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña requeridos' });
    }

    conexion.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo],
        async (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            if (result.length === 0) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            const usuario = result[0];

            try {
                const passwordValido = await bcrypt.compare(password, usuario.password);

                if (!passwordValido) {
                    return res.status(401).json({ error: 'Credenciales incorrectas' });
                }

                // 🔥 GENERAR TOKEN
                const token = jwt.sign(
                    {
                        id: usuario.id,
                        correo: usuario.correo,
                        rol: usuario.rol
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '8h' }
                );

                // 🔒 quitar password del response
                const { password: _, ...usuarioSinPassword } = usuario;

                res.json({
                    mensaje: 'Login exitoso',
                    token,
                    usuario: usuarioSinPassword
                });

            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        }
    );
};