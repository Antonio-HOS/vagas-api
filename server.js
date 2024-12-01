const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const { authenticateToken } = require("./middlewares/authenticateToken");
const usuariosRoutes = require("./routes/usuarios");
const vagasRoutes = require("./routes/vagas");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Versão da especificação OpenAPI
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    info: {
      title: "API de Vagas", // Título da API
      version: "1.0.0", // Versão da API
      description:
        "Documentação da API do meu projeto Node.js com Express e Swagger", // Descrição da API
    },
  },

  // Caminho dos arquivos de definição do Swagger (comentários no código)
  apis: ["./routes/*.js"], // Exemplo: todas as rotas dentro da pasta "routes"
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Rota para exibir a documentação

const app = express();
app.use(bodyParser.json());

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Unable to synchronize the database:", err);
  });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/usuario", usuariosRoutes);
app.use("/api/vagas", authenticateToken, vagasRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
