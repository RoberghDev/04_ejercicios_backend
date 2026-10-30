const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

// VERIFICA EL TOKEN DE SESIÓN DEL USUARIO
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.warn("Petición rechazada: falta el token de autenticación");
        return res.status(401).send({ mensaje: "Debes iniciar sesión" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger.error("Falta configurar JWT_SECRET");
        return res.status(500).send({ mensaje: "Error de configuración del servidor" });
    }
    // verificación del token
    try {
        const usuario = jwt.verify(authHeader.slice(7), secret);

        if (typeof usuario !== "object" || !usuario.id) {
            logger.warn("Petición rechazada: el token no contiene un ID de usuario válido");
            return res.status(401).send({ mensaje: "Token no válido" });
        }

        req.usuario = usuario;
        logger.info("Token verificado correctamente");
        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            logger.warn("Petición rechazada: token inválido o caducado");
            return res.status(401).send({ mensaje: "Token no válido o caducado" });
        }

        logger.error(`Error inesperado al verificar el token: ${error}`);
        return next(error);
    }
};

module.exports = { verificarToken };