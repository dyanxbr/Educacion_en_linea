const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host:     'shinkansen.proxy.rlwy.net',
    user:     'root',
    password: 'soZPXuPxaHjWseTPgtwAmUFCyezEvJVm',
    port:     38464,
    database: 'railway',
    ssl:      { rejectUnauthorized: false },
    protocol: 'TCP'
});

conexion.connect((err) => {
    if (err) {
        console.error('❌ Error DB:', err.message);
        process.exit(1);
    }
    console.log('✅ MySQL Railway conectado');
});

module.exports = conexion;