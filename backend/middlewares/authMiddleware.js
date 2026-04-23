// Middleware de autenticación desactivado
// Las rutas son públicas por ahora
module.exports = (req, res, next) => {
    next();
};