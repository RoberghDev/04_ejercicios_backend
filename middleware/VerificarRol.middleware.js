const logger = require("../config/logger");

const verificarRol = (...rolesPermitidos) => (req, res, next) => {
    if (!req.usuario) {
        logger.warn("Autorización rechazada: no hay un usuario autenticado");
        return res.status(401).send({ mensaje: "Debes iniciar sesión" });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
        logger.warn("Autorización rechazada: el rol del usuario no tiene permiso");
        return res.status(403).send({ mensaje: "No tienes permiso para realizar esta acción" });
    }

    logger.info("Rol del usuario autorizado");
    return next();
};

module.exports = { verificarRol };


