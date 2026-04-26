const conexion = require('../config/db');

exports.crearProfesor = (req, res) => {
    const { nombre, correo, especialidad } = req.body;

    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const sql = `INSERT INTO profesores (nombre, correo, especialidad) VALUES (?, ?, ?)`;

    conexion.query(sql, [nombre, correo || null, especialidad || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Profesor creado', id: result.insertId });
    });
};

exports.obtenerProfesores = (req, res) => {
    conexion.query('SELECT * FROM profesores ORDER BY nombre', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.obtenerProfesor = (req, res) => {
    conexion.query('SELECT * FROM profesores WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Profesor no encontrado' });
        res.json(result[0]);
    });
};

exports.actualizarProfesor = (req, res) => {
    const { nombre, correo, especialidad } = req.body;

    const sql = `UPDATE profesores SET nombre = ?, correo = ?, especialidad = ? WHERE id = ?`;

    conexion.query(sql, [nombre, correo, especialidad, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Profesor no encontrado' });
        res.json({ mensaje: 'Profesor actualizado' });
    });
};

exports.eliminarProfesor = (req, res) => {
    conexion.query('DELETE FROM profesores WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Profesor no encontrado' });
        res.json({ mensaje: 'Profesor eliminado' });
    });
};