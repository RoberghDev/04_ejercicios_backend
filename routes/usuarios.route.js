const express = require("express");
const usuarioController = require("../controller/usuarios.controller");
const {
    verificarUsuarioPorId,
    verificarPeliculaPorId
} = require("../middleware/verificaciones.middleware");
const { verificarToken } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/usuarios/ver-todos:
 *   get:
 *     summary: Lista todos los usuarios sin incluir sus contraseñas.
 *     tags: [Usuarios]
 *     responses:
 *       "200":
 *         description: Lista de usuarios.
 *       "500":
 *         description: No se pudieron obtener los usuarios.
 */
router.get("/ver-todos", usuarioController.showAll);

/**
 * @swagger
 * /api/usuarios/cargarTodos:
 *   post:
 *     summary: Carga los usuarios predefinidos en la base de datos.
 *     tags: [Usuarios]
 *     responses:
 *       "201":
 *         description: Usuarios cargados correctamente.
 *       "500":
 *         description: No se pudieron cargar los usuarios.
 */
router.post("/cargarTodos", usuarioController.cargarTodos);

/**
 * @swagger
 * /api/usuarios/usuario/{idUsuario}:
 *   get:
 *     summary: Busca un usuario por su ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Usuario encontrado.
 *       "400":
 *         description: El ID no es válido.
 *       "404":
 *         description: El usuario no existe.
 *       "500":
 *         description: No se pudo obtener el usuario.
 */
router.get("/usuario/:idUsuario", verificarUsuarioPorId, usuarioController.findById);

/**
 * @swagger
 * /api/usuarios/peliculas-favoritas/{idUsuario}:
 *   get:
 *     summary: Consulta las películas favoritas de un usuario.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Películas favoritas del usuario.
 *       "400":
 *         description: El ID no es válido.
 *       "404":
 *         description: El usuario no existe o no tiene películas favoritas.
 */
router.get("/peliculas-favoritas/:idUsuario", verificarUsuarioPorId, usuarioController.peliculasFavoritas);

/**
 * @swagger
 * /api/usuarios/comentarios/{idUsuario}:
 *   get:
 *     summary: Consulta los comentarios realizados por un usuario y sus películas.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Comentarios del usuario; puede ser una lista vacía.
 *       "400":
 *         description: El ID no es válido.
 *       "404":
 *         description: El usuario no existe.
 *       "500":
 *         description: No se pudieron obtener los comentarios.
 */
router.get("/comentarios/:idUsuario", verificarUsuarioPorId, usuarioController.verComentarios);

/**
 * @swagger
 * /api/usuarios/nuevoUsuario:
 *   post:
 *     summary: Registra un usuario nuevo.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario1
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario1@example.com
 *               password:
 *                 type: string
 *                 format: password
 *               rol:
 *                 type: string
 *                 enum: [USER, MOD, ADMON]
 *                 default: USER
 *     responses:
 *       "201":
 *         description: Usuario creado.
 *       "500":
 *         description: No se pudo crear el usuario.
 */
router.post("/nuevoUsuario", usuarioController.signUp);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       "200":
 *         description: Inicio de sesión correcto.
 *       "404":
 *         description: Usuario o contraseña incorrectos.
 *       "500":
 *         description: Error interno del servidor.
 */
router.post("/login", usuarioController.login)

/**
 * @swagger
 * /api/usuarios/favoritas/{idUsuario}/{idPelicula}:
 *   post:
 *     summary: Añade una película a las favoritas del usuario autenticado.
 *     description: El propietario de la cuenta puede modificar sus favoritas; MOD y ADMON también pueden hacerlo.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       "200":
 *         description: Película añadida a favoritas.
 *       "401":
 *         description: Token ausente o inválido.
 *       "403":
 *         description: No tiene permiso para modificar las favoritas.
 *       "400":
 *         description: Alguno de los IDs no es válido.
 *       "404":
 *         description: Usuario o película no encontrados.
 *       "500":
 *         description: No se pudo actualizar la lista de favoritas.
 */
router.post(
    "/favoritas/:idUsuario/:idPelicula",
    verificarToken,
    verificarUsuarioPorId,
    verificarPeliculaPorId,
    usuarioController.nuevaPeliculaFavorita
);

/**
 * @swagger
 * /api/usuarios/actualizar/{idUsuario}:
 *   patch:
 *     summary: Actualiza los datos de un usuario.
 *     description: El usuario puede actualizar su propia cuenta; MOD y ADMON pueden actualizar otras cuentas. La contraseña, si se cambia, se guarda cifrada.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       "200":
 *         description: Usuario actualizado.
 *       "400":
 *         description: Datos no válidos o no se indicó ningún campo.
 *       "401":
 *         description: Token ausente o inválido.
 *       "403":
 *         description: No tiene permiso para actualizar ese usuario.
 *       "404":
 *         description: El usuario no existe.
 *       "409":
 *         description: Username o email ya están en uso.
 *       "500":
 *         description: No se pudo actualizar el usuario.
 */
router.patch(
    "/actualizar/:idUsuario",
    verificarToken,
    verificarUsuarioPorId,
    usuarioController.actualizaUnUsuario
);

/**
 * @swagger
 * /api/usuarios/eliminar/{idUsuario}:
 *   delete:
 *     summary: Elimina un usuario por su ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Usuario eliminado.
 *       "400":
 *         description: El ID no es válido.
 *       "404":
 *         description: El usuario no existe.
 *       "500":
 *         description: No se pudo eliminar el usuario.
 */
router.delete("/eliminar/:idUsuario", verificarUsuarioPorId, usuarioController.deleteOneById);

module.exports = router;
