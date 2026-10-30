const verificarRol = (...rolesPermitidos) => (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).send({ mensaje: "Debes iniciar sesión" });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).send({ mensaje: "No tienes permiso para realizar esta acción" });
    }

    return next();
};

module.exports = { verificarRol };

module.exports = { verificarRol };



