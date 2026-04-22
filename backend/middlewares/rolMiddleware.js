// Uso: rolMiddleware('ADMIN') o rolMiddleware('ADMIN', 'USUARIO')
module.exports = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                error: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}`
            });
        }

        next();
    };
};