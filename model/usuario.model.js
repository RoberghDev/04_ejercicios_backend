const { model, Schema } = require("mongoose");

const usuarioSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "el mail no es válido"]
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    favoritas: [{
        type: Schema.Types.ObjectId,
        ref: "Pelicula"
    }],
    rol: {
        type: String,
        required: true,
        trim: true,
        enum: ["USER", "MOD", "ADMON"],
        default: "USER"
    }
}, { timestamps: true });

module.exports = model("Usuario", usuarioSchema);
