const Pelicula = require("../model/peliculas.model");
const PeliculasBBDD = require('../resources/Peliculas.db')
const logger = require("../config/logger");

// MUESTRA TODAS LAS PELÍCULAS
const showAll = async (_req, res) => {
	try {
		const resultado = await Pelicula.find();
		logger.info(`Películas consultadas: ${resultado.length}`);
		res.status(200).send(resultado);
	} catch (error) {
		logger.error(`Error al mostrar las películas: ${error}`);
		res.status(404).json({ error: "No se pudieron obtener las películas" });
	}
};

// BUSCA LA PELÍCULA POR SU ID
const buscarPorId = async (req, res) => {
	try {
		const pelicula = await Pelicula.findById(req.params.idPelicula);

		if (!pelicula) {
			logger.warn("no se ha encontrado la película")
			return res.status(404).send({ mensaje: "No se encontró la película" });
		}

		logger.info("película encontrada")
		return res.status(200).send(pelicula);
	} catch (error) {
		logger.error(`Error al buscar la película: ${error}`);
		return res.status(500).send({ mensaje: "error al encontrar la película" });
	}
}

// BUSCA POR FILTRANDO POR GÉNERO
const findByGenre = async (req, res) => {
	try {
		const resultado = await Pelicula.find({ genero: req.params.genero });

		if (resultado.length > 0) {
			logger.info(`Películas encontradas para el género solicitado: ${resultado.length}`);
		} else {
			logger.warn("No se encontraron películas para el género solicitado");
		}
		res.status(200).send(resultado);
	} catch (error) {
		logger.error(`Error al filtrar películas por género: ${error}`);
		res.status(404).json({ error: "No se pudieron obtener las películas" });
	}
};

// BUSCA FILTRANDO POR LA CALIFICACIÓN EN LA BBDD
const findByMark = async (req, res) => {
	try {
		const resultado = await Pelicula.find({
			puntuacion: { $gte: Number(req.params.puntuacion) },
		});

		if (resultado.length > 0) {
			logger.info(`Películas encontradas con la puntuación mínima: ${resultado.length}`);
		} else {
			logger.warn("No se encontraron películas con esa puntuación mínima");
		}
		res.status(200).send(resultado);
	} catch (error) {
		logger.error(`Error al filtrar películas por puntuación: ${error}`);
		res.status(404).json({ error: "No se pudieron obtener las películas" });
	}
};

// FILTRA POR EL DIRECTOR DE LA PELÍCULA
const findByDirector = async (req, res) => {
	try {
		const resultado = await Pelicula.find({ director: req.params.director });

		if (resultado.length > 0) {
			logger.info(`Películas encontradas para el director: ${resultado.length}`);
			res.status(200).send(resultado);
		} else {
			logger.warn("no se pudo encontrar la película")
			res.status(404).send({ mensaje: "No se pudo encontrar a ese director" });
		}
	} catch (error) {
		logger.error(`Error al buscar películas por director: ${error}`);
		res.status(500).json({ error: "ERROR: No se pudo encontrar a ese director" });
	}
};

// FILTRA POR LA DURACIÓN DE LA PELÍCULA
const findByDuración = async (req, res) => {
	try {
		const duracion = Number(req.params.duracion);
		const resultado = await Pelicula.find({ duracion: { $gte: duracion } });

		if (resultado.length >= 1) {
			logger.info(`Películas encontradas con esa duración mínima: ${resultado.length}`);
			res.status(200).send(resultado);
		} else {
			logger.warn("No se encontraron películas con esa duración mínima");
			return res.status(404).send({ mensaje: "no se han encontrado películas con esa duración" });
		}
	} catch (error) {
		logger.error(`Error al buscar películas por duración: ${error}`);
		res.status(500).json({
			error: "No se pudieron encontrar películas con esa duración",
		});
	}
};

// FILTRA LAS PELÍCULAS CON UN TIEMPO MAYOR QUE UNO DADO
const filtrarPorDuraciónMayorQue = async (req, res) => {
	try {
		const tiempoDado = Number(req.params.tiempoDado);

		if (!Number.isFinite(tiempoDado)) {
			logger.warn("la duración no es un número válido")
			return res.status(400).send({ mensaje: "La duración debe ser un número válido" });
		}

		const resultado = await Pelicula.find({ duracion: { $gt: tiempoDado } });

		if (resultado.length > 0) {
			logger.info(`Películas encontradas con duración superior al límite: ${resultado.length}`);
			return res.status(200).send(resultado);
		}

		logger.warn("no se han encontrado películas con una duración mayor")
		return res.status(404).send({
			mensaje: "No se han encontrado películas con una duración mayor",
		});
	} catch (error) {
		logger.error(`Error al filtrar películas por duración: ${error}`);
		return res.status(500).json({
			error: "No se pudieron encontrar películas con una duración mayor",
		});
	}
}

// CREA UNA NUEVA PELÍCULA
const createOne = async (req, res) => {
	try {
		await Pelicula.create(req.body);
		logger.info("Película creada correctamente");
		res.status(200).send({ mensaje: "película creada exitosamente" });
	} catch (error) {
		logger.error(`Error al crear la película: ${error}`);
		res.status(500).json({ error: "No se crear la película" });
	}
};

// ACTUALIZA UNA PELÍCULA FILTRANDO POR EL ID
const updateById = async (req, res) => {
	try {
		const resultado = await Pelicula.findByIdAndUpdate(
			req.params.idPelicula,
			req.body,
			{ new: true, runValidators: true },
		);
		if (resultado) {
			logger.info("Película actualizada correctamente");
		} else {
			logger.warn("No se encontró la película que se quería actualizar");
		}
		res.status(200).send(resultado);
	} catch (error) {
		logger.error(`Error al actualizar la película: ${error}`);
		res.status(500).json({ error: "No se pudo actualizar la película" });
	}
};

// ELIMINA UNA PELÍCULA
const deleteOne = async (req, res) => {
	try {
		const resultado = await Pelicula.findByIdAndDelete(req.params.idPelicula);

		if (resultado) {
			logger.info("Película eliminada correctamente");
			res.status(200).send({ mensaje: "película borrada exitosamente" });
		} else {
			logger.warn("No se encontró la película al intentar eliminarla");
			res.status(404).send({ mensaje: "No se pudo borrar la película" });
		}
	} catch (error) {
		logger.error(`Error al borrar la película: ${error}`);
		res.status(500).json({ error: "No se pudo borrar la película" });
	}
};

// CARGA LAS PELÍCULAS DE LA BBDD EN ../resources/Pelicilas.db.js
const cargarTodas = async (_req, res) => {
	try {
		const resultado = await Pelicula.insertMany(PeliculasBBDD);
		logger.info(`Películas cargadas correctamente: ${resultado.length}`);
		return res.status(201).json({
			mensaje: "Películas cargadas exitosamente",
			peliculas: resultado,
		});
	} catch (error) {
		logger.error(`Error al cargar las películas: ${error}`);
		return res.status(500).json({ error: "No se pudieron cargar las películas" });
	}
};

module.exports = {
	showAll,
	findByGenre,
	findByMark,
	createOne,
	updateById,
	deleteOne,
	findByDirector,
	findByDuración,
	filtrarPorDuraciónMayorQue,
	cargarTodas,
	buscarPorId,
};
