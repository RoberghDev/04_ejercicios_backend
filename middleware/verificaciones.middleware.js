const Usuario = require("../model/usuario.model");
const Pelicula = require("../model/peliculas.model")
const Comentario = require("../model/comentarios.model")
const mongoose = require("mongoose");

// VERIFICACIÓN DEL ID DE UN USUARIO
const verificarUsuarioPorId = async (req, res, next) => {
    const { idUsuario } = req.params;

    if (!mongoose.isValidObjectId(idUsuario)) {
        return res.status(400).send({ mensaje: "El ID del usuario no es válido" });
    }

    try {
        const usuario = await Usuario.findById(idUsuario).select("_id");

        if (!usuario) {           
            return res.status(404).send({ mensaje: "El usuario no existe" });
        }

        console.log("verificación del usuario completa");
        return next();

    } catch (error) {
        console.error(`Error al verificar el usuario: ${error}`);
        return res.status(500).send({ mensaje: "Error al verificar el usuario" });
    }
};

// VERIFICACIÓN DEL ID DE UNA PELÍCULA
const verificarPeliculaPorId = async (req, res, next) => {
    const { idPelicula } = req.params;

    if (!mongoose.isValidObjectId(idPelicula)) {
        return res.status(400).send({ mensaje: "El ID de la película no es válido" });
    }

    try {
        const pelicula = await Pelicula.findById(idPelicula).select("_id");

        if (!pelicula) {
            return res.status(404).send({ mensaje: "La película no existe" });
        }

        console.log("verificación de la película completa");
        return next();
    } catch (error) {
        console.error(`Error al verificar la película: ${error}`);
        return res.status(500).send({ mensaje: "Error al verificar la película" });
    }
};

// VERIFICACIÓN DEL ID DE UN COMENTARIO
const verificarComentarioPorId = async (req, res, next) => {
    const { idComentario } = req.params
    if(!mongoose.isValidObjectId(idComentario)){
        return res.status(400).send({mensaje: "el ID del comentario no es correcto"})
    }

    try {
        const comentario = await Comentario.findById(idComentario).select("_id")
        if(!comentario){
            return res.status(404).send({mensaje: "el comentario no existe"})
        }

        console.log("verificacion del comentario completa");
        return next()        

    } catch (error) {
        console.error(`Error al verificar el comentario: ${error}`);
        return res.status(500).send({ mensaje: "Error al verificar el comentario" });
    }
}

module.exports = { verificarUsuarioPorId, verificarPeliculaPorId,verificarComentarioPorId };
