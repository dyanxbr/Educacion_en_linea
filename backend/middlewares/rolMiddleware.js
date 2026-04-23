// Middleware de roles desactivado
// Las rutas son públicas por ahora
module.exports = (...rolesPermitidos) => {
    return (req, res, next) => {
        next();
    };
};