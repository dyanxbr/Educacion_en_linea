
module.exports = (...rolesPermitidos) => {
    return (req, res, next) => {
        next();
    };
};