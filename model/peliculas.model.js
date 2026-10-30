const { model, Schema } = require("mongoose");

const peliculaSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    default: "desconocido",
  },
  director: {
    type: String,
    required: true,
    default: "desconocido",
  },
  genero: {
    type: String,
    required: true,
    default: "desconocido",
  },
  anio: {
    type: Number,
    required: true,
    min: 1888,
    max: new Date().getFullYear(),
  },
  duracion: {
    type: Number,
    default: 0,
  },
  puntuacion: {
    type: Number,
    default: 0,
  },
  disponible: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Pelicula", peliculaSchema);
