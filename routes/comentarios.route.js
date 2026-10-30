const express = require("express");
const comentarioController = require("../controller/comentarios.controller");
const { verificarUsuarioPorId, verificarPeliculaPorId, verificarComentarioPorId } = require("../middleware/verificaciones.middleware");
const { verificarRol } = require("../middleware/VerificarRol.middleware");
const { verificarToken } = require("../middleware/auth.middleware")

const router = express.Router();

/**
 * @swagger
 * /api/comentarios/verTodos:
 *   get:
 *     summary: Lista todos los comentarios.
 *     tags: [Comentarios]
 *     responses:
 *       "200":
 *         description: Lista de comentarios.
 */
router.get(
    "/verTodos", 
    comentarioController.todosLosComentarios
)

/**
 * @swagger
 * /api/comentarios/encontarComentario/{idComentario}:
 *   get:
 *     summary: Busca un comentario por su ID.
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: idComentario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Comentario encontrado.
 *       "404":
 *         description: Comentario no encontrado.
 */
router.get(
    "/encontarComentario/:idComentario",
    verificarComentarioPorId,
    comentarioController.buscarPorId
)

/**
 * @swagger
 * /api/comentarios/editar/{idComentario}:
 *   patch:
 *     summary: Edita un comentario. Requiere rol MOD o ADMON.
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idComentario
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comentario]
 *             properties:
 *               comentario:
 *                 type: string
 *                 example: Texto actualizado
 *     responses:
 *       "200":
 *         description: Comentario actualizado.
 *       "400":
 *         description: El comentario no es válido.
 *       "401":
 *         description: Token ausente o inválido.
 *       "403":
 *         description: El rol no tiene permiso.
 *       "404":
 *         description: Comentario no encontrado.
 */
router.patch(
    "/editar/:idComentario",
    verificarToken,
    verificarComentarioPorId,
    verificarRol("MOD", "ADMON"),
    comentarioController.editarComentario
)

/**
 * @swagger
 * /api/comentarios/nuevoComentario/{idUsuario}/{idPelicula}:
 *   post:
 *     summary: Añade un comentario a una película.
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
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
 *             required: [comentario]
 *             properties:
 *               comentario:
 *                 type: string
 *                 example: Muy buena película.
 *     responses:
 *       "201":
 *         description: Comentario creado.
 *       "400":
 *         description: Alguno de los IDs no es válido.
 *       "404":
 *         description: Usuario o película no encontrados.
 */
router.post(
    "/nuevoComentario/:idUsuario/:idPelicula",
    verificarUsuarioPorId,
    verificarPeliculaPorId,
    comentarioController.nuevoComentario
)

/**
 * @swagger
 * /api/comentarios/eliminar/{idComentario}:
 *   delete:
 *     summary: Elimina un comentario. Requiere rol MOD o ADMON.
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idComentario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Comentario eliminado.
 *       "401":
 *         description: Token ausente o inválido.
 *       "403":
 *         description: El rol no tiene permiso.
 *       "404":
 *         description: Comentario no encontrado.
 */
router.delete(
    "/eliminar/:idComentario",
    verificarToken,
    verificarComentarioPorId,
    verificarRol("MOD", "ADMON"),
    comentarioController.eliminarComentario
)

module.exports = router;
