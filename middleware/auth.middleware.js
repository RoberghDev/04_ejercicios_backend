const jwt = require("jsonwebtoken");

// VERIFICA EL TOKEN DE SESIÓN DEL USUARIO
const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ mensaje: "Debes iniciar sesión" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("Falta configurar JWT_SECRET");
        return res.status(500).send({ mensaje: "Error de configuración del servidor" });
    }
    // verificación del token
    try {
        const usuario = jwt.verify(authHeader.slice(7), secret);

        if (typeof usuario !== "object" || !usuario.id) {
            return res.status(401).send({ mensaje: "Token no válido" });
        }

        req.usuario = usuario;
        return next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({ mensaje: "Token no válido o caducado" });
        }

        return next(error);
    }
};

module.exports = { verificarToken };