const Usuario = require("../model/usuario.model");
const Pelicula = require("../model/peliculas.model")
const Comentario = require("../model/comentarios.model")
const mongoose = require("mongoose");
const logger = require("../config/logger");

// VERIFICACIÓN DEL ID DE UN USUARIO
const verificarUsuarioPorId = async (req, res, next) => {
    const { idUsuario } = req.params;

    if (!mongoose.isValidObjectId(idUsuario)) {
        logger.warn("Verificación de usuario rechazada: ID no válido");
        return res.status(400).send({ mensaje: "El ID del usuario no es válido" });
    }

    try {
        const usuario = await Usuario.findById(idUsuario).select("_id");

        if (!usuario) { 
            logger.warn("No se encontró el usuario solicitado");
            return res.status(404).send({ mensaje: "El usuario no existe" });
        }

        logger.info("Verificación del usuario completada");
        return next();

    } catch (error) {
        logger.error(`Error al verificar el usuario: ${error}`);
        return res.status(500).send({ mensaje: "Error al verificar el usuario" });
    }
};

// VERIFICACIÓN DEL ID DE UNA PELÍCULA
const verificarPeliculaPorId = async (req, res, next) => {
    const { idPelicula } = req.params;

    if (!mongoose.isValidObjectId(idPelicula)) {
        logger.warn("Verificación de película rechazada: ID no válido");
        return res.status(400).send({ mensaje: "El ID de la película no es válido" });
    }

    try {
        const pelicula = await Pelicula.findById(idPelicula).select("_id");

        if (!pelicula) {
            logger.warn("No se encontró la película solicitada");
            return res.status(404).send({ mensaje: "La película no existe" });
        }

        logger.info("Verificación de la película completada");
        return next();
    } catch (error) {
        logger.error(`Error al verificar la película: ${error}`);
        return res.status(500).send({ mensaje: "Error al verificar la película" });
    }
};

// VERIFICACIÓN DEL ID DE UN COMENTARIO
const verificarComentarioPorId = async (req, res, next) => {
    const { idComentario } = req.params
    if(!mongoose.isValidObjectId(idComentario)){
        logger.warn("Verificación de comentario rechazada: ID no válido");
        return res.status(400).send({mensaje: "el ID del comentario no es correcto"})
    }

    try {
        const comentario = await Comentario.findById(idComentario).select("_id")
        if(!comentario){
            logger.warn("No se encontró el comentario solicitado");
            return res.status(404).send({mensaje: "el comentario no existe"})
        }

        logger.info("Verificación del comentario completada");
        return next()        

    } catch (error) {
        logger.error(`Error al verificar el comentario: ${error}`);
        return res.status(500).send({ mensaje: "Error al verificar el comentario" });
    }
}

module.exports = { verificarUsuarioPorId, verificarPeliculaPorId,verificarComentarioPorId };
