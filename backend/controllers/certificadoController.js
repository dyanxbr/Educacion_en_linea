const conexion = require('../config/db');
const cloudinary = require('cloudinary').v2;
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const os = require('os');

// POST /certificados/generar
exports.generarCertificado = (req, res) => {
    const { usuario_id, curso_id } = req.body;

    if (!usuario_id || !curso_id) return res.status(400).json({ error: 'usuario_id y curso_id son requeridos' });

    const sqlVerificar = `
        SELECT u.nombre_completo, c.nombre AS curso, p.nombre AS profesor, cal.puntuacion
        FROM usuarios u
        JOIN calificaciones cal ON cal.usuario_id = u.id AND cal.curso_id = ?
        JOIN cursos c ON c.id = cal.curso_id
        LEFT JOIN profesores p ON c.profesor_id = p.id
        WHERE u.id = ?
    `;

    conexion.query(sqlVerificar, [curso_id, usuario_id], async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(403).json({ error: 'Debes completar y calificar el curso para obtener el certificado' });
        }

        conexion.query(
            'SELECT archivo_url FROM certificados WHERE usuario_id = ? AND curso_id = ?',
            [usuario_id, curso_id],
            async (err, certExistente) => {
                if (err) return res.status(500).json({ error: err.message });

                if (certExistente.length > 0) {
                    return res.json({ mensaje: 'Ya tienes un certificado para este curso', archivo_url: certExistente[0].archivo_url });
                }

                const { nombre_completo, curso, profesor } = result[0];
                const fecha = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

                try {
                    const pdfPath = path.join(os.tmpdir(), `cert_${usuario_id}_${curso_id}.pdf`);
                    await generarPDF({ nombre_completo, curso, profesor, fecha, pdfPath });

                    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
                        folder: 'certificados',
                        resource_type: 'raw',
                        public_id: `cert_${usuario_id}_${curso_id}`,
                        format: 'pdf'
                    });

                    fs.unlinkSync(pdfPath);

                    const sqlInsert = `INSERT INTO certificados (usuario_id, curso_id, public_id, archivo_url, tipo) VALUES (?, ?, ?, ?, 'PDF')`;

                    conexion.query(sqlInsert, [usuario_id, curso_id, uploadResult.public_id, uploadResult.secure_url], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.status(201).json({ mensaje: '¡Certificado generado! 🎓', archivo_url: uploadResult.secure_url });
                    });
                } catch (err) {
                    res.status(500).json({ error: 'Error generando certificado: ' + err.message });
                }
            }
        );
    });
};

// GET /certificados/mis-certificados?usuario_id=1
exports.misCertificados = (req, res) => {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ error: 'usuario_id es requerido' });

    const sql = `
        SELECT cert.id, cert.archivo_url, cert.tipo, cert.fecha,
               c.nombre AS curso, p.nombre AS profesor
        FROM certificados cert
        JOIN cursos c ON cert.curso_id = c.id
        LEFT JOIN profesores p ON c.profesor_id = p.id
        WHERE cert.usuario_id = ?
        ORDER BY cert.fecha DESC
    `;

    conexion.query(sql, [usuario_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

function generarPDF({ nombre_completo, curso, profesor, fecha, pdfPath }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
        const stream = fs.createWriteStream(pdfPath);

        doc.pipe(stream);

        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f4ff');
        doc.rect(0, 0, doc.page.width, 10).fill('#3b5bdb');
        doc.rect(0, doc.page.height - 10, doc.page.width, 10).fill('#3b5bdb');

        doc.fontSize(36).fillColor('#3b5bdb').font('Helvetica-Bold')
           .text('CERTIFICADO DE FINALIZACIÓN', 0, 80, { align: 'center' });

        doc.moveTo(80, 140).lineTo(doc.page.width - 80, 140).strokeColor('#3b5bdb').lineWidth(2).stroke();

        doc.fontSize(18).fillColor('#333').font('Helvetica').text('Se certifica que', 0, 170, { align: 'center' });
        doc.fontSize(28).fillColor('#1a1a2e').font('Helvetica-Bold').text(nombre_completo, 0, 205, { align: 'center' });
        doc.fontSize(18).fillColor('#333').font('Helvetica').text('ha completado satisfactoriamente el curso', 0, 255, { align: 'center' });
        doc.fontSize(24).fillColor('#3b5bdb').font('Helvetica-Bold').text(`"${curso}"`, 0, 285, { align: 'center' });

        if (profesor) {
            doc.fontSize(16).fillColor('#555').font('Helvetica').text(`Impartido por: ${profesor}`, 0, 330, { align: 'center' });
        }

        doc.fontSize(14).fillColor('#777').font('Helvetica').text(`Fecha de emisión: ${fecha}`, 0, 380, { align: 'center' });
        doc.moveTo(80, 410).lineTo(doc.page.width - 80, 410).strokeColor('#3b5bdb').lineWidth(1).stroke();

        doc.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
}