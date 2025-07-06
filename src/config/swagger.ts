import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import path from "path"

// Swagger configuration
const configSwagger = (app: any) => {
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
    apis: [path.join(path.dirname("../routers/v1/**/*.js"))],
  });
  // Send request to this route for get api document
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default configSwagger