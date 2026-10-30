const Pelicula = require("../model/peliculas.model");
const PeliculasBBDD = require('../resources/Peliculas.db')

// MUESTRA TODAS LAS PELÍCULAS
const showAll = async (_req, res) => {
	try {
		const resultado = await Pelicula.find();
		res.status(200).send(resultado);
	} catch (error) {
		console.error(`error al mostrar la película. ERROR -> ${error}`);
		res.status(404).json({ error: "No se pudieron obtener las películas" });
	}
};

// BUSCA LA PELÍCULA POR SU ID
const buscarPorId = async (req, res) => {
	try {
		const pelicula = await Pelicula.findById(req.params.idPelicula);

		if (!pelicula) {
			return res.status(404).send({ mensaje: "No se encontró la película" });
		}

		return res.status(200).send(pelicula);
	} catch (error) {
		console.log(`error al buscar la película: ERROR -> ${error}`);
		return res.status(500).send({ mensaje: "error al encontrar la película" });
	}
}

// BUSCA POR FILTRANDO POR GÉNERO
const findByGenre = async (req, res) => {
	try {
		const resultado = await Pelicula.find({ genero: req.params.genero });
		res.status(200).send(resultado);
	} catch (error) {
		console.error(`error al mostrar la película. ERROR -> ${error}`);
		res.status(404).json({ error: "No se pudieron obtener las películas" });
	}
};

// BUSCA FILTRANDO POR LA CALIFICACIÓN EN LA BBDD
const findByMark = async (req, res) => {
	try {
		const resultado = await Pelicula.find({
			puntuacion: { $gte: Number(req.params.puntuacion) },
		});
		res.status(200).send(resultado);
	} catch (error) {
		console.error(`error al mostrar la película. ERROR -> ${error}`);
		res.status(404).json({ error: "No se pudieron obtener las películas" });
	}
};

// FILTRA POR EL DIRECTOR DE LA PELÍCULA
const findByDirector = async (req, res) => {
	try {
		const resultado = await Pelicula.find({ director: req.params.director });

		if (resultado.length > 0) {
			res.status(200).send(resultado);
		} else {
			res.status(404).send({ mensaje: "No se pudo encontrar a ese director" });
		}
	} catch (error) {
		console.error(`error al buscar al director. ERROR -> ${error}`);
		res.status(500).json({ error: "ERROR: No se pudo encontrar a ese director" });
	}
};

// FILTRA POR LA DURACIÓN DE LA PELÍCULA
const findByDuración = async (req, res) => {
	try {
		const duracion = Number(req.params.duracion);
		const resultado = await Pelicula.find({ duracion: { $gte: duracion } });

		if (resultado.length >= 1) {
			res.status(200).send(resultado);
		} else {
			res
				.status(404)
				.send({ mensaje: "no se han encontrado películas con esa duración" });
		}
	} catch (error) {
		console.error(`error al buscar películas por duración. ERROR -> ${error}`);
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
			return res.status(400).send({ mensaje: "La duración debe ser un número válido" });
		}

		const resultado = await Pelicula.find({ duracion: { $gt: tiempoDado } });

		if (resultado.length > 0) {
			return res.status(200).send(resultado);
		}

		return res.status(404).send({
			mensaje: "No se han encontrado películas con una duración mayor",
		});
	} catch (error) {
		console.error(`error al filtrar películas por duración. ERROR -> ${error}`);
		return res.status(500).json({
			error: "No se pudieron encontrar películas con una duración mayor",
		});
	}
}

// CREA UNA NUEVA PELÍCULA
const createOne = async (req, res) => {
	try {
		await Pelicula.create(req.body);
		res.status(200).send({ mensaje: "película creada exitosamente" });
	} catch (error) {
		console.error(`error al crear la película. ERROR -> ${error}`);
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
		res.status(200).send(resultado);
	} catch (error) {
		console.error(`error al actualizar la película. ERROR -> ${error}`);
		res.status(500).json({ error: "No se pudo actualizar la película" });
	}
};

// ELIMINA UNA PELÍCULA
const deleteOne = async (req, res) => {
	try {
		const resultado = await Pelicula.findByIdAndDelete(req.params.idPelicula);

		if (resultado) {
			res.status(200).send({ mensaje: "película borrada exitosamente" });
		} else {
			res.status(404).send({ mensaje: "No se pudo borrar la película" });
		}
	} catch (error) {
		console.error(`error al borrar la película. ERROR -> ${error}`);
		res.status(500).json({ error: "No se pudo borrar la película" });
	}
};

// CARGA LAS PELÍCULAS DE LA BBDD EN ../resources/Pelicilas.db.js
const cargarTodas = async (_req, res) => {
	try {
		const resultado = await Pelicula.insertMany(PeliculasBBDD);
		return res.status(201).json({
			mensaje: "Películas cargadas exitosamente",
			peliculas: resultado,
		});
	} catch (error) {
		console.error(`error al cargar las películas. ERROR -> ${error}`);
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
