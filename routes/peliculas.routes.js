const express = require("express");
const peliculasController = require("../controller/peliculas.controller");
const { verificarPeliculaPorId } = require("../middleware/verificaciones.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/pelis/verTodo:
 *   get:
 *     summary: Lista todas las películas.
 *     tags: [Películas]
 *     responses:
 *       "200":
 *         description: Lista de películas.
 */
router.get("/verTodo", peliculasController.showAll);

/**
 * @swagger
 * /api/pelis/genero/{genero}:
 *   get:
 *     summary: Filtra películas por género.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: genero
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Películas del género indicado.
 */
router.get("/genero/:genero", peliculasController.findByGenre);

/**
 * @swagger
 * /api/pelis/puntuacion/{puntuacion}:
 *   get:
 *     summary: Busca películas con una puntuación igual o superior a la indicada.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: puntuacion
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       "200":
 *         description: Películas que cumplen la puntuación mínima.
 */
router.get("/puntuacion/:puntuacion", peliculasController.findByMark);

/**
 * @swagger
 * /api/pelis/director/{director}:
 *   get:
 *     summary: Busca películas por director.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: director
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Películas del director.
 *       "404":
 *         description: No se encontraron películas para ese director.
 */
router.get("/director/:director", peliculasController.findByDirector);

/**
 * @swagger
 * /api/pelis/duracion/{duracion}:
 *   get:
 *     summary: Busca películas con una duración igual o superior a la indicada.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: duracion
 *         required: true
 *         schema:
 *           type: number
 *           example: 120
 *     responses:
 *       "200":
 *         description: Películas que cumplen la duración mínima.
 *       "404":
 *         description: No se encontraron películas con esa duración.
 */
router.get("/duracion/:duracion", peliculasController.findByDuración);

/**
 * @swagger
 * /api/pelis/duracion-mayor-que/{tiempoDado}:
 *   get:
 *     summary: Busca películas cuya duración sea mayor que la indicada.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: tiempoDado
 *         required: true
 *         schema:
 *           type: number
 *           example: 120
 *     responses:
 *       "200":
 *         description: Películas con duración superior al valor indicado.
 *       "400":
 *         description: La duración no es un número válido.
 *       "404":
 *         description: No se encontraron películas.
 */
router.get("/duracion-mayor-que/:tiempoDado", peliculasController.filtrarPorDuraciónMayorQue);

/**
 * @swagger
 * /api/pelis/duracionMayorQue/{tiempoDado}:
 *   get:
 *     summary: Busca películas cuya duración sea mayor que la indicada (ruta alternativa).
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: tiempoDado
 *         required: true
 *         schema:
 *           type: number
 *           example: 120
 *     responses:
 *       "200":
 *         description: Películas con duración superior al valor indicado.
 *       "400":
 *         description: La duración no es un número válido.
 *       "404":
 *         description: No se encontraron películas.
 */
router.get("/duracionMayorQue/:tiempoDado", peliculasController.filtrarPorDuraciónMayorQue)

/**
 * @swagger
 * /api/pelis/buscarPorId/{idPelicula}:
 *   get:
 *     summary: Busca una película por su ID.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: idPelicula
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Película encontrada.
 *       "400":
 *         description: El ID no es válido.
 *       "404":
 *         description: La película no existe.
 */
router.get("/buscarPorId/:idPelicula", verificarPeliculaPorId, peliculasController.buscarPorId)

/**
 * @swagger
 * /api/pelis/cargarTodas:
 *   post:
 *     summary: Carga las películas predefinidas en la base de datos.
 *     tags: [Películas]
 *     responses:
 *       "201":
 *         description: Películas cargadas.
 *       "500":
 *         description: No se pudieron cargar las películas.
 */
router.post("/cargarTodas", peliculasController.cargarTodas);

/**
 * @swagger
 * /api/pelis/nuevaPelicula:
 *   post:
 *     summary: Crea una película.
 *     tags: [Películas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [anio]
 *             properties:
 *               titulo:
 *                 type: string
 *                 default: desconocido
 *               director:
 *                 type: string
 *                 default: desconocido
 *               genero:
 *                 type: string
 *                 default: desconocido
 *               anio:
 *                 type: integer
 *                 minimum: 1888
 *               duracion:
 *                 type: number
 *               puntuacion:
 *                 type: number
 *               disponible:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Película creada.
 *       "500":
 *         description: No se pudo crear la película.
 */
router.post("/nuevaPelicula", peliculasController.createOne);

/**
 * @swagger
 * /api/pelis/actualizar/{idPelicula}:
 *   put:
 *     summary: Actualiza los datos de una película.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: idPelicula
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               director:
 *                 type: string
 *               genero:
 *                 type: string
 *               anio:
 *                 type: integer
 *               duracion:
 *                 type: number
 *               puntuacion:
 *                 type: number
 *               disponible:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: Película actualizada.
 *       "400":
 *         description: El ID no es válido.
 *       "404":
 *         description: La película no existe.
 *       "500":
 *         description: No se pudo actualizar la película.
 */
router.put("/actualizar/:idPelicula", verificarPeliculaPorId, peliculasController.updateById);

/**
 * @swagger
 * /api/pelis/eliminar/{idPelicula}:
 *   delete:
 *     summary: Elimina una película por su ID.
 *     tags: [Películas]
 *     parameters:
 *       - in: path
 *         name: idPelicula
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Película eliminada.
 *       "400":
 *         description: El ID no es válido.
 *       "404":
 *         description: La película no existe.
 *       "500":
 *         description: No se pudo eliminar la película.
 */
router.delete("/eliminar/:idPelicula", verificarPeliculaPorId, peliculasController.deleteOne);

module.exports = router;
