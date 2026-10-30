const express = require("express");
const mongoose = require("mongoose");
const peliculasRouter = require("./routes/peliculas.routes");
const usuariosRouter = require("./routes/usuarios.route")
const comentariosRouter = require("./routes/comentarios.route")
require('dotenv').config()

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

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
  console.error("Falta la variable MONGODB_URL en el archivo .env");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Conexión a MongoDB establecida");
    app.listen(port, () => {
      console.log(`=> App levantada con éxito en el puerto ${port}`);
      console.log("-----------------------------------------------------------------");
      console.log(`=> URL usuarios     -> http://localhost:${port}/api/usuarios`);
      console.log(`=> URL peículas     -> http://localhost:${port}/api/peículas`);
      console.log(`=> URL comentarios  -> http://localhost:${port}/api/comentarios`);
      console.log("-----------------------------------------------------------------");
      console.log(`=> Documentación    -> http://localhost:${port}/api-docs`);
      console.log("-----------------------------------------------------------------");
      
    });
  })
  .catch((error) => {
    console.error(`error al levantar la bbdd: ERROR -> ${error}`);
  });
