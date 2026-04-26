// Ruta de prueba para diagnosticar - GET /certificados/test/:usuario_id/:curso_id
exports.testGenerarPdf = async (req, res) => {
    const { usuario_id, curso_id } = req.params;
    
    console.log('=== INICIANDO TEST DE CERTIFICADO ===');
    console.log('Usuario:', usuario_id, 'Curso:', curso_id);
    
    try {
        // 1. Obtener datos del usuario
        const sqlUsuario = `SELECT nombre_completo FROM usuarios WHERE id = ?`;
        conexion.query(sqlUsuario, [usuario_id], async (err, userResult) => {
            if (err) {
                console.error('Error usuario:', err);
                return res.status(500).json({ error: err.message });
            }
            if (userResult.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            // 2. Obtener datos del curso
            const sqlCurso = `
                SELECT c.nombre as curso, p.nombre as profesor 
                FROM cursos c 
                LEFT JOIN profesores p ON c.profesor_id = p.id 
                WHERE c.id = ?
            `;
            
            conexion.query(sqlCurso, [curso_id], async (err, courseResult) => {
                if (err) {
                    console.error('Error curso:', err);
                    return res.status(500).json({ error: err.message });
                }
                if (courseResult.length === 0) {
                    return res.status(404).json({ error: 'Curso no encontrado' });
                }
                
                const nombre_completo = userResult[0].nombre_completo;
                const curso = courseResult[0].curso;
                const profesor = courseResult[0].profesor;
                const fecha = new Date().toLocaleDateString('es-MX');
                
                console.log('Datos:', { nombre_completo, curso, profesor, fecha });
                
                // 3. Generar PDF
                const pdfPath = path.join(os.tmpdir(), `test_cert_${usuario_id}_${curso_id}_${Date.now()}.pdf`);
                console.log('Generando PDF en:', pdfPath);
                
                await generarPDF({ nombre_completo, curso, profesor, fecha, pdfPath });
                
                // 4. Verificar que el PDF se creó
                const stats = fs.statSync(pdfPath);
                console.log('PDF creado, tamaño:', stats.size, 'bytes');
                
                if (stats.size < 1000) {
                    console.error('ERROR: PDF demasiado pequeño, posiblemente corrupto');
                }
                
                // 5. Subir a Cloudinary
                console.log('Subiendo a Cloudinary...');
                const uploadResult = await cloudinary.uploader.upload(pdfPath, {
                    folder: 'certificados',
                    resource_type: 'auto',
                    public_id: `test_cert_${usuario_id}_${curso_id}`,
                });
                
                console.log('Upload exitoso:', uploadResult.secure_url);
                console.log('Public ID:', uploadResult.public_id);
                
                // 6. Limpiar archivo temporal
                fs.unlinkSync(pdfPath);
                
                // 7. Guardar en base de datos (opcional)
                const sqlInsert = `INSERT INTO certificados (usuario_id, curso_id, public_id, archivo_url, tipo) 
                                  VALUES (?, ?, ?, ?, 'PDF')
                                  ON DUPLICATE KEY UPDATE archivo_url = VALUES(archivo_url), public_id = VALUES(public_id)`;
                
                conexion.query(sqlInsert, [usuario_id, curso_id, uploadResult.public_id, uploadResult.secure_url], (err) => {
                    if (err) {
                        console.error('Error guardando en BD:', err);
                    } else {
                        console.log('Guardado en BD correctamente');
                    }
                });
                
                res.json({ 
                    mensaje: 'Test completado', 
                    url: uploadResult.secure_url,
                    tamano: stats.size,
                    public_id: uploadResult.public_id
                });
            });
        });
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            error: error.message, 
            stack: error.stack,
            nombre: error.name
        });
    }
};

// Ruta para verificar credenciales de Cloudinary
exports.verificarCloudinary = (req, res) => {
    try {
        // Verificar configuración (sin exponer secretos completos)
        const config = cloudinary.config();
        res.json({
            cloud_name: config.cloud_name,
            api_key: config.api_key ? 'Configurada' : 'No configurada',
            api_secret: config.api_secret ? 'Configurada' : 'No configurada',
            status: 'OK'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};