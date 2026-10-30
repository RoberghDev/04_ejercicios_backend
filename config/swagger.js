const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "API ejercicio Crear una API REST con ExpressJS Roberto García Huidobro.",
            version: "1.0.0",
            description: "Crea una API REST utilizando Node.js, Express, MongoDB y Mongoose para gestionar una aplicación depelículas y usuarios"
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: [path.join(__dirname, "../routes/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;