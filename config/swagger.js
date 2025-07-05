const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Swagger configuration
const configSwagger = (app) => {
  const swaggerSpec = swaggerJsDoc({
    swaggerDefinition: {
      openapi: "3.0.1",
      info: {
        title: "Hotel project - ME-AT",
        version: "1.0.0",
        description:
          "A RESTful API named meat-hotel using Node.js + express.js + MongoDB.",
      },
      servers: [{ url: "http://localhost:4000" }],
    },
    apis: [path.join(__dirname, "../routers/v1/**/*.js")],
  });
  // Send request to this route for get api document
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = configSwagger;
