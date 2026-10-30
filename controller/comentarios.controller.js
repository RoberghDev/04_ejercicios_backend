const Comentario = require("../model/comentarios.model");
const logger = require("../config/logger");
// const ComentariosBBDD = require('../resources/Comentarios.db')

// INSERTAR UN NUEVO COMENTARIO A UNA PELÍCULA
const nuevoComentario = async (req, res) => {
    try {
        const nuevoComentario = new Comentario({
            idUsuario   : req.params.idUsuario,
            idPelicula  : req.params.idPelicula,
            comentario  : req.body.comentario
        })

        await nuevoComentario.save()
        logger.info("Comentario creado correctamente");
        return res.status(201).send({mensaje: "comentario enviado correctamente"})
    } catch (error) {
        logger.error(`Error al crear un comentario: ${error}`);
        return res.status(500).send({mensaje: "error al crear el comentario"})
    }
}

//BUSCAR TODOS LOS COMENTARIOS
const todosLosComentarios = async (req, res) => {
    try {
        const comentarios = await Comentario.find()
        logger.info("comentarios encontrados.")
        return res.status(200).send(comentarios)
    } catch (error) {
        logger.error(`Error al buscar los comentarios: ${error}`);
        return res.status(500).send({mensaje: "error al encontar los comentarios"})
    }
}

// BUSCA UN COMENTARIO POR EL ID
const buscarPorId = async (req, res) => {
    try {
        const comentario = await Comentario.findById(req.params.idComentario)
        logger.info("comentario encontrado")
        return res.status(200).send(comentario)

    } catch (error) {
        logger.error(`Error al buscar el comentario: ${error}`);
        return res.status(500).send({mensaje: "error al encontar el comentario"})
    }
}

// EDITA UN COMENTARIO PROPIO Y/O AGENO
const editarComentario = async (req, res) => {
    const textoComentario = req.body.comentario;

    if (typeof textoComentario !== "string" || !textoComentario.trim()) {
        logger.warn("se ha mandado un comentario vacío.")
        return res.status(400).send({ mensaje: "El comentario no puede estar vacío" });
    }

    try {
        const comentarioActualizado = await Comentario.findByIdAndUpdate(
            req.params.idComentario,
            { comentario: textoComentario.trim() },
            { new: true, runValidators: true }
        );

        if (!comentarioActualizado) {
            logger.warn("se intentó editar un comentario inexistente")
            return res.status(404).send({ mensaje: "El comentario no existe" });
        }

        logger.info("Comentario actualizado correctamente");
        return res.status(200).send(comentarioActualizado);
    } catch (error) {
        logger.error(`Error al editar el comentario: ${error}`);
        return res.status(500).send({ mensaje: "Error al editar el comentario" });
    }
}

// ELIMINA UN COMENTARIO DE LA LISTA DE COMENTARIOS
const eliminarComentario = async (req, res) => {
    try {
        const comentarioID = req.params.idComentario
        const comentarioEliminado = await Comentario.findByIdAndDelete(comentarioID)

        if(!comentarioEliminado){
            logger.warn("Comentario no encontrado al intentar eliminarlo");
            return res.status(404).send({mensaje: "comentario no encontrado."})
        }

        logger.info("Comentario eliminado correctamente");
        return res.status(200).send({mensaje: "comentario eliminado correctamente"})

    } catch (error) {
        logger.error(`Error al eliminar el comentario: ${error}`);
        return res.status(500).send({mensaje: "error al borrar el comentario."})        
    }

}


module.exports = {
    nuevoComentario,
    buscarPorId,
    todosLosComentarios,
    editarComentario,
    eliminarComentario
};
