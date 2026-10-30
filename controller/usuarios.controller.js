const Usuario = require("../model/usuario.model");
const Comentario = require("../model/comentarios.model");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// MUESTRA TODOS LOS USUARIOS DE LA BBDD
const showAll = async (_req, res) => {
	try {
		const resultado = await Usuario.find().select("-password");
		return res.status(200).send(resultado);
	} catch (error) {
		console.error(`error al buscar los usuarios: ERROR -> ${error}`);
		return res.status(500).send({ mensaje: "No se pudieron buscar los usuarios" });
	}
};

// FILTRA POR EL ID DEL USUARIO
const findById = async (req, res) => {
	try {
		const resultado = await Usuario.findById(req.params.idUsuario).select("-password");

		if (!resultado) {
			return res.status(404).send({ mensaje: "No se pudo encontrar al usuario" });
		}

		return res.status(200).send(resultado);
	} catch (error) {
		console.error(`error al buscar al usuario. ERROR -> ${error}`);
		return res.status(500).json({ error: "No se pudo encontrar al usuario" });
	}
};

// CREA UN NUEVO USUARIO
const signUp = async (req, res) => {
	try {
		const encriptedPassword = await bcrypt.hash(req.body.password, 10)

		const NuevoUsuario = new Usuario({
			username	: req.body.username,
			password	: encriptedPassword,
			email		: req.body.email,
			rol			: req.body.rol
		})

		await NuevoUsuario.save()
		return res.status(201).send("usuario creado correctamente")
	} catch (error) {
		console.log(`error interno: ERROR -> ${error}`)
		return res.status(500).send(`error interno: ERROR -> ${error}`)
	}
};

// ELIMINA UN USUARIO
const deleteOneById = async (req, res) => {
	const usuarioId = req.params.idUsuario;

	try {
		const resultado = await Usuario.findByIdAndDelete(usuarioId);

		if (!resultado) {
			return res.status(404).send({ mensaje: "El usuario no existe" });
		}

		return res.status(200).send({ mensaje: "El usuario ha sido eliminado con éxito" });

	} catch (error) {
		console.error(`error al eliminar un usuario: ERROR -> ${error}`);
		return res.status(500).send({ mensaje: "Error al eliminar el usuario" });
	}
};

// ACTUALIZA UN USUARIO
const actualizaUnUsuario = async (req, res) => {
	const { idUsuario } = req.params;
	const { username, email, password } = req.body || {};
	const camposActualizables = { username, email };

	if (username === undefined && email === undefined && password === undefined) {
		return res.status(400).send({ mensaje: "Debes indicar algún dato para actualizar" });
	}

	if (
		!req.usuario ||
		(String(req.usuario.id) !== idUsuario && !["MOD", "ADMON"].includes(req.usuario.rol))
	) {
		return res.status(403).send({ mensaje: "No tienes permiso para actualizar este usuario" });
	}

	for (const campo of Object.keys(camposActualizables)) {
		if (camposActualizables[campo] === undefined) {
			delete camposActualizables[campo];
		}
	}

	try {
		if (password !== undefined) {
			if (typeof password !== "string" || !password.trim()) {
				return res.status(400).send({ mensaje: "La contraseña no puede estar vacía" });
			}

			camposActualizables.password = await bcrypt.hash(password, 10);
		}

		const usuarioActualizado = await Usuario.findByIdAndUpdate(
			idUsuario,
			{ $set: camposActualizables },
			{ new: true, runValidators: true }
		).select("-password");

		if (!usuarioActualizado) {
			return res.status(404).send({ mensaje: "El usuario no existe" });
		}

		return res.status(200).send({
			mensaje: "Usuario actualizado correctamente",
			usuario: usuarioActualizado
		});
	} catch (error) {
		console.error(`Error al actualizar el usuario: ${error}`);

		if (error.name === "ValidationError") {
			return res.status(400).send({ mensaje: "Los datos del usuario no son válidos" });
		}

		if (error.code === 11000) {
			return res.status(409).send({ mensaje: "El username o email ya está en uso" });
		}

		return res.status(500).send({ mensaje: "Error al actualizar el usuario" });
	}
}

// HACE EL LOGIN DEL USUARIO
const login = async (req, res) => {
	try {
		const usuario = await Usuario.findOne({ username: req.body.username }).select("+password")
		const esContrasenaCorrecta = usuario ? await bcrypt.compare(req.body.password, usuario.password) : false;

		if (!usuario || !esContrasenaCorrecta) {
			return res.status(404).send("error. usuario o contraseña incorrectos")
		}

		// generación de token de firma para el usuario.
		const token = jwt.sign({
			id: usuario._id,
			username: usuario.username,
			rol: usuario.rol
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "2h"
		})

		return res.status(200).json({
			mensaje: "login correcto",
			token: token
		})

	} catch (error) {
		console.log(`ERROR -> ${error}`);
		res.status(500).send("internal server error")
	}
}

// CONSULTA LAS PELICULAS FAVORITAS DEL USUARIO 
const peliculasFavoritas = async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.params.idUsuario).populate("favoritas")

		if (!usuario) {
			return res.status(404).send("usuario no encontrado")
		} else {
			if (!usuario.favoritas || usuario.favoritas.length === 0) {
				return res.status(404).send({ "mensaje": "no se encontraron películas" })
			}
		}

		return res.status(200).send({ "mensaje": usuario.favoritas })

	} catch (error) {
		console.log(`ERROR -> ${error}`);
		return res.status(500).send("internal server error")
	}
}

// CONSULTA LOS COMENTARIOS REALIZADOS POR EL USUARIO A CADA UNA DE LAS PELÍCULAS
const verComentarios = async (req, res) => {
	try {
		const comentarios = await Comentario.find({ idUsuario: req.params.idUsuario })
			.populate("idPelicula");

		return res.status(200).send(comentarios);
	} catch (error) {
		console.error(`Error al buscar los comentarios del usuario: ${error}`);
		return res.status(500).send({ mensaje: "No se pudieron obtener los comentarios del usuario" });
	}
}

// AÑADIR PELÍCULA FAVORITA
const nuevaPeliculaFavorita = async (req, res) => {
	const { idUsuario, idPelicula } = req.params;

	if (
		!req.usuario ||
		(String(req.usuario.id) !== idUsuario && !["MOD", "ADMON"].includes(req.usuario.rol))
	) {
		return res.status(403).send({ mensaje: "No tienes permiso para modificar estas favoritas" });
	}

	try {
		const usuarioActualizado = await Usuario.findByIdAndUpdate(
			idUsuario,
			{ $addToSet: { favoritas: idPelicula } },
			{ new: true }
		)
			.select("-password")
			.populate("favoritas");

		if (!usuarioActualizado) {
			return res.status(404).send({ mensaje: "El usuario no existe" });
		}

		return res.status(200).send({
			mensaje: "Película añadida a favoritas",
			favoritas: usuarioActualizado.favoritas
		});
	} catch (error) {
		console.error(`Error al añadir película a favoritas: ${error}`);
		return res.status(500).send({ mensaje: "No se pudo añadir la película a favoritas" });
	}
}


module.exports = {
	showAll,
	findById,
	signUp,
	deleteOneById,
	actualizaUnUsuario,
	login,
	peliculasFavoritas,
	verComentarios,
	nuevaPeliculaFavorita
};