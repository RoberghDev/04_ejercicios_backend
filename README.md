# API REST de películas, usuarios y comentarios

Proyecto de clase del ciclo de **Desarrollo de Aplicaciones Web (DAW)**. Es una API REST desarrollada con Node.js y Express para gestionar películas, usuarios y comentarios. Los datos se almacenan en MongoDB mediante Mongoose.

## Tecnologías

- Node.js y Express
- MongoDB y Mongoose
- JWT para la autenticación y bcrypt para cifrar contraseñas
- Swagger UI para consultar y probar los endpoints

## Estructura del proyecto

```text
.
├── config/
│   ├── logger.js                 # Configuración del registro de actividad
│   └── swagger.js                # Configuración de OpenAPI/Swagger
├── controller/                   # Lógica de las operaciones de la API
│   ├── comentarios.controller.js
│   ├── peliculas.controller.js
│   └── usuarios.controller.js
├── middleware/                   # Autenticación, permisos y validación de IDs
│   ├── VerificarRol.middleware.js
│   ├── auth.middleware.js
│   └── verificaciones.middleware.js
├── model/                        # Esquemas y modelos de Mongoose
│   ├── comentarios.model.js
│   ├── peliculas.model.js
│   └── usuario.model.js
├── resources/                    # Datos de ejemplo para cargar en MongoDB
│   ├── Peliculas.db.js
│   └── usuarios.db.js
├── routes/                       # Rutas HTTP y anotaciones de Swagger
│   ├── comentarios.route.js
│   ├── peliculas.routes.js
│   └── usuarios.route.js
├── index.js                      # Configuración e inicio del servidor
├── package.json                  # Dependencias y comandos npm
└── README.md
```

## Requisitos

- Node.js y npm instalados.
- Una instancia de MongoDB accesible desde el proyecto (local o alojada).

## Instalación y ejecución

1. Clona el repositorio y entra en la carpeta del proyecto:

   ```bash
   git clone https://github.com/RoberghDev/04_ejercicios_backend.git
   cd 04_ejercicios_backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto:

   ```env
   MONGODB_URL=mongodb://127.0.0.1:27017/04_ejercicios
   JWT_SECRET=cambia-este-valor-por-una-clave-secreta
   PORT=3000
   ```

   `MONGODB_URL` es obligatorio para iniciar el servidor. `JWT_SECRET` se utiliza para firmar los tokens de inicio de sesión. `PORT` es opcional; si no se define, se usa el puerto `3000`. No publiques el archivo `.env` ni sus valores secretos.

4. Inicia el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

   También puedes iniciarlo sin Nodemon con `npm start`. La API queda disponible cuando se establece la conexión con MongoDB. Para detenerla, pulsa `Ctrl+C` en la terminal.

## Documentación Swagger

Con el servidor **levantado** y conectado a MongoDB, abre:

- [Swagger local](http://localhost:3000/api-docs) (si has configurado otro puerto, sustituye `3000`).
- [Swagger de la instancia publicada](https://zero4-ejercicios-backend-1.onrender.com/api-docs) (depende de que el servicio desplegado esté disponible).

Swagger permite consultar los endpoints, sus parámetros y cuerpos de petición, además de enviar peticiones de prueba. En las operaciones protegidas, usa **Authorize** e introduce el token JWT con el esquema `Bearer`.

## Resumen de la API

La URL base local es `http://localhost:3000`. Todas las rutas de la API devuelven y reciben JSON cuando corresponde.

### Películas — `/api/pelis`

Permite listar películas, buscar por ID, filtrar por género, puntuación mínima, director o duración, crear, actualizar y eliminar registros. También incluye `POST /cargarTodas` para insertar las películas de ejemplo definidas en `resources/Peliculas.db.js`.

Rutas principales:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/pelis/verTodo` | Lista las películas |
| `GET` | `/api/pelis/buscarPorId/:idPelicula` | Busca por ID |
| `GET` | `/api/pelis/genero/:genero` | Filtra por género |
| `GET` | `/api/pelis/puntuacion/:puntuacion` | Filtra por puntuación mínima |
| `GET` | `/api/pelis/director/:director` | Filtra por director |
| `GET` | `/api/pelis/duracion/:duracion` | Filtra por duración mínima |
| `POST` | `/api/pelis/nuevaPelicula` | Crea una película |
| `PUT` | `/api/pelis/actualizar/:idPelicula` | Actualiza una película |
| `DELETE` | `/api/pelis/eliminar/:idPelicula` | Elimina una película |
| `POST` | `/api/pelis/cargarTodas` | Carga las películas de ejemplo |

### Usuarios — `/api/usuarios`

Incluye registro e inicio de sesión, consulta de usuarios, películas favoritas y comentarios. Al iniciar sesión se devuelve un JWT válido durante dos horas. Para las operaciones protegidas, envía ese token en la cabecera `Authorization` con el esquema `Bearer`. La contraseña se cifra al registrar usuarios y no se devuelve en las consultas habituales.

Rutas principales:

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/usuarios/nuevoUsuario` | Registra un usuario |
| `POST` | `/api/usuarios/login` | Inicia sesión y devuelve un JWT |
| `GET` | `/api/usuarios/ver-todos` | Lista usuarios |
| `GET` | `/api/usuarios/usuario/:idUsuario` | Consulta un usuario |
| `GET` | `/api/usuarios/peliculas-favoritas/:idUsuario` | Consulta sus películas favoritas |
| `POST` | `/api/usuarios/favoritas/:idUsuario/:idPelicula` | Añade una película a favoritas (requiere JWT) |
| `PATCH` | `/api/usuarios/actualizar/:idUsuario` | Actualiza datos del usuario (requiere JWT) |
| `GET` | `/api/usuarios/comentarios/:idUsuario` | Consulta los comentarios del usuario |
| `POST` | `/api/usuarios/cargarTodos` | Carga los usuarios de ejemplo |
| `DELETE` | `/api/usuarios/eliminar/:idUsuario` | Elimina un usuario |

El usuario puede modificar sus propios datos y favoritos; los roles `MOD` y `ADMON` también pueden hacerlo para otras cuentas.

### Comentarios — `/api/comentarios`

Permite crear comentarios asociados a un usuario y una película, listarlos y consultarlos por ID. La edición y eliminación requieren un JWT de un usuario con rol `MOD` o `ADMON`.

Rutas principales:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/comentarios/verTodos` | Lista los comentarios |
| `GET` | `/api/comentarios/encontarComentario/:idComentario` | Consulta un comentario por ID |
| `POST` | `/api/comentarios/nuevoComentario/:idUsuario/:idPelicula` | Crea un comentario |
| `PATCH` | `/api/comentarios/editar/:idComentario` | Edita un comentario (requiere rol `MOD` o `ADMON`) |
| `DELETE` | `/api/comentarios/eliminar/:idComentario` | Elimina un comentario (requiere rol `MOD` o `ADMON`) |

Los endpoints de carga insertan los datos de ejemplo incluidos en `resources/`; si se ejecutan varias veces, volverán a insertar esos datos.
