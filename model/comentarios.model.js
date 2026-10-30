const { model, Schema } = require("mongoose");

const appComentariosSchema = new Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    idPelicula: {
        type: Schema.Types.ObjectId,
        ref: "Pelicula",
        required: true
    },
    comentario: {
        type: String,
        required: true
    }
});

module.exports = model("Comentario", appComentariosSchema);