const express = require("express");
const mongoose = require("mongoose");
const peliculasRouter = require("./routes/peliculas.routes");
const usuariosRouter = require("./routes/usuarios.route")
const comentariosRouter = require("./routes/comentarios.route")
require('dotenv').config()

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const logger = require("./config/logger");

// configuración inicial
const app = express();
const mongoUrl = process.env.MONGODB_URL;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/pelis", peliculasRouter);
app.use("/api/usuarios", usuariosRouter)
app.use("/api/comentarios", comentariosRouter)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

if (!mongoUrl) {
  logger.error("Falta la variable MONGODB_URL en el archivo .env");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("Conexión a MongoDB establecida");
    app.listen(port, () => {
      logger.info(`App levantada con éxito en el puerto ${port}`);
      logger.info(`-----Servidor local----------------------------------------------------------------`)
      logger.info(`URL usuarios     -> http://localhost:${port}/api/usuarios`);
      logger.info(`URL películas    -> http://localhost:${port}/api/pelis`);
      logger.info(`URL comentarios  -> http://localhost:${port}/api/comentarios`);
      logger.info(`Documentación    -> http://localhost:${port}/api-docs`);
      logger.info(`-----Servidor en la nube-----------------------------------------------------------`)
      logger.info(`URL usuarios     -> https://zero4-ejercicios-backend-1.onrender.com/api/usuarios`)
      logger.info(`URL peículas     -> https://zero4-ejercicios-backend-1.onrender.com/api/peículas`)
      logger.info(`URL comentarios  -> https://zero4-ejercicios-backend-1.onrender.com/api/comentarios`)
      logger.info(`Documentación    -> https://zero4-ejercicios-backend-1.onrender.com/api-docs`)
    });
  })
  .catch((error) => {
    logger.error(`Error al conectar con la base de datos: ${error}`);
  });
