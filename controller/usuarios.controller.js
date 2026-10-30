const Usuario = require("../model/usuario.model");
const Comentario = require("../model/comentarios.model");
const logger = require("../config/logger");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// MUESTRA TODOS LOS USUARIOS DE LA BBDD
const showAll = async (_req, res) => {
	try {
		const resultado = await Usuario.find().select("-password");
		logger.info(`Usuarios consultados: ${resultado.length}`);
		return res.status(200).send(resultado);
	} catch (error) {
		logger.error(`Error al buscar los usuarios: ${error}`);
		return res.status(500).send({ mensaje: "No se pudieron buscar los usuarios" });
	}
};

// FILTRA POR EL ID DEL USUARIO
const findById = async (req, res) => {
	try {
		const resultado = await Usuario.findById(req.params.idUsuario).select("-password");

		if (!resultado) {
			logger.warn("No se encontró el usuario solicitado");
			return res.status(404).send({ mensaje: "No se pudo encontrar al usuario" });
		}

		logger.info("Usuario encontrado");
		return res.status(200).send(resultado);
	} catch (error) {
		logger.error(`Error al buscar al usuario: ${error}`);
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
		logger.info("Usuario creado correctamente");
		return res.status(201).send("usuario creado correctamente")
	} catch (error) {
		logger.error(`Error interno al crear el usuario: ${error}`);
		return res.status(500).send(`error interno: ERROR -> ${error}`)
	}
};

// ELIMINA UN USUARIO
const deleteOneById = async (req, res) => {
	const usuarioId = req.params.idUsuario;

	try {
		const resultado = await Usuario.findByIdAndDelete(usuarioId);

		if (!resultado) {
			logger.warn("No se encontró el usuario que se quería eliminar");
			return res.status(404).send({ mensaje: "El usuario no existe" });
		}

		logger.info("Usuario eliminado correctamente");
		return res.status(200).send({ mensaje: "El usuario ha sido eliminado con éxito" });

	} catch (error) {
		logger.error(`Error al eliminar un usuario: ${error}`);
		return res.status(500).send({ mensaje: "Error al eliminar el usuario" });
	}
};

// ACTUALIZA UN USUARIO
const actualizaUnUsuario = async (req, res) => {
	const { idUsuario } = req.params;
	const { username, email, password } = req.body || {};
	const camposActualizables = { username, email };

	if (username === undefined && email === undefined && password === undefined) {
		logger.warn("Se intentó actualizar un usuario sin proporcionar campos");
		return res.status(400).send({ mensaje: "Debes indicar algún dato para actualizar" });
	}

	if (
		!req.usuario ||
		(String(req.usuario.id) !== idUsuario && !["MOD", "ADMON"].includes(req.usuario.rol))
	) {
		logger.warn("Se denegó la actualización del usuario por falta de permisos");
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
				logger.warn("Se intentó actualizar un usuario con una contraseña vacía");
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
			logger.warn("No se encontró el usuario que se quería actualizar");
			return res.status(404).send({ mensaje: "El usuario no existe" });
		}

		logger.info("Usuario actualizado correctamente");
		return res.status(200).send({
			mensaje: "Usuario actualizado correctamente",
			usuario: usuarioActualizado
		});
	} catch (error) {
		logger.error(`Error al actualizar el usuario: ${error}`);

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
			logger.warn("Intento de inicio de sesión con credenciales incorrectas");
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

		logger.info("Inicio de sesión correcto");
		return res.status(200).json({
			mensaje: "login correcto",
			token: token
		})

	} catch (error) {
		logger.error(`Error al iniciar sesión: ${error}`);
		res.status(500).send("internal server error")
	}
}

// CONSULTA LAS PELICULAS FAVORITAS DEL USUARIO 
const peliculasFavoritas = async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.params.idUsuario).populate("favoritas")

		if (!usuario) {
			logger.warn("No se encontró el usuario al consultar sus películas favoritas");
			return res.status(404).send("usuario no encontrado")
		} else {
			if (!usuario.favoritas || usuario.favoritas.length === 0) {
				logger.warn("El usuario no tiene películas favoritas");
				return res.status(404).send({ "mensaje": "no se encontraron películas" })
			}
		}

		logger.info(`Películas favoritas consultadas: ${usuario.favoritas.length}`);
		return res.status(200).send({ "mensaje": usuario.favoritas })

	} catch (error) {
		logger.error(`Error al consultar las películas favoritas: ${error}`);
		return res.status(500).send("internal server error")
	}
}

// CONSULTA LOS COMENTARIOS REALIZADOS POR EL USUARIO A CADA UNA DE LAS PELÍCULAS
const verComentarios = async (req, res) => {
	try {
		const comentarios = await Comentario.find({ idUsuario: req.params.idUsuario })
			.populate("idPelicula");

		if (comentarios.length > 0) {
			logger.info(`Comentarios del usuario consultados: ${comentarios.length}`);
		} else {
			logger.warn("El usuario no tiene comentarios");
		}
		return res.status(200).send(comentarios);
	} catch (error) {
		logger.error(`Error al buscar los comentarios del usuario: ${error}`);
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
		logger.warn("Se denegó la modificación de favoritas por falta de permisos");
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
			logger.warn("No se encontró el usuario al actualizar sus películas favoritas");
			return res.status(404).send({ mensaje: "El usuario no existe" });
		}

		logger.info("Lista de películas favoritas actualizada");
		return res.status(200).send({
			mensaje: "Película añadida a favoritas",
			favoritas: usuarioActualizado.favoritas
		});
	} catch (error) {
		logger.error(`Error al añadir película a favoritas: ${error}`);
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