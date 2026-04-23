require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();

//  Configuración Cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Rutas 
app.use('/auth',           require('./routes/authRoutes'));
app.use('/usuarios',       require('./routes/usuarioRoutes'));
app.use('/profesores',     require('./routes/profesorRoutes'));
app.use('/cursos',         require('./routes/cursoRoutes'));
app.use('/videos',         require('./routes/videoRoutes'));
app.use('/progreso',       require('./routes/progresoRoutes'));
app.use('/calificaciones', require('./routes/calificacionRoutes'));
app.use('/certificados',   require('./routes/certificadoRoutes'));
app.use('/reportes',       require('./routes/reporteRoutes'));

//  Health check    
app.get('/', (req, res) => {
    res.json({ status: 'OK', mensaje: '🚀 API corriendo correctamente' });
});

//  Manejo de rutas no encontradas 
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

//  Arrancar servidor   
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});