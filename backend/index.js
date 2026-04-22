require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// 🔹 Conexión a MySQL (Railway)
const conexion = mysql.createConnection({
    host: 'shinkansen.proxy.rlwy.net',
    user: 'root',
    password: 'soZPXuPxaHjWseTPgtwAmUFCyezEvJVm',
    port: 38464,
    database: 'railway', // ⚠️ cambia si tu DB tiene otro nombre
    ssl: {
        rejectUnauthorized: false
    }
});

// 🔹 Probar conexión
conexion.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err);
        return;
    }
    console.log('✅ Conectado a MySQL (Railway)');
});

// 🔹 Ruta raíz
app.get('/', (req, res) => {
    res.send('🚀 API funcionando correctamente');
});

// 🔹 Obtener usuarios
app.get('/usuarios', (req, res) => {
    conexion.query('SELECT * FROM usuarios', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(results);
    });
});

// 🔹 Crear usuario
app.post('/usuario', (req, res) => {
    const { nombre_completo, correo, password, rol } = req.body;

    const sql = `
        INSERT INTO usuarios (nombre_completo, correo, password, rol)
        VALUES (?, ?, ?, ?)
    `;

    conexion.query(sql, [nombre_completo, correo, password, rol], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al crear usuario' });
        }
        res.json({ mensaje: 'Usuario creado', id: result.insertId });
    });
});

// 🔹 Actualizar usuario
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_completo, correo, password, rol } = req.body;

    const sql = `
        UPDATE usuarios 
        SET nombre_completo=?, correo=?, password=?, rol=? 
        WHERE id=?
    `;

    conexion.query(sql, [nombre_completo, correo, password, rol, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json({ mensaje: 'Usuario actualizado' });
    });
});

// 🔹 Eliminar usuario
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    conexion.query('DELETE FROM usuarios WHERE id=?', [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }
        res.json({ mensaje: 'Usuario eliminado' });
    });
});

// 🔹 Puerto
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});