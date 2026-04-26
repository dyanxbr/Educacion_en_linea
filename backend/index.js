require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://illustrious-healing-production.up.railway.app',
    'https://educacion-en-linea-7u34xyixd.vercel.app',
    'https://educacion-en-linea.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log('Origen bloqueado por CORS:', origin);
            return callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth',           require('./routes/authRoutes'));
app.use('/usuarios',       require('./routes/usuarioRoutes'));
app.use('/profesores',     require('./routes/profesorRoutes'));
app.use('/cursos',         require('./routes/cursoRoutes'));
app.use('/videos',         require('./routes/videoRoutes'));
app.use('/progreso',       require('./routes/progresoRoutes'));
app.use('/calificaciones', require('./routes/calificacionRoutes'));
app.use('/reportes',       require('./routes/reporteRoutes'));
app.use('/certificados',   require('./routes/certificadoRoutes'));

app.get('/', (req, res) => {
    res.json({ status: 'OK', mensaje: 'API corriendo correctamente' });
});

app.use((err, req, res, next) => {
    if (err.message === 'No permitido por CORS') {
        return res.status(403).json({ error: err.message });
    }
    next(err);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});