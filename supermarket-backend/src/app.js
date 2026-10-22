require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/database");
const productRoutes = require("./routes/product.routes");
const { notFound, errorHandler } = require("./utils/errorHandler");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Seguridad y logging ────────────────────────────────────────────────────────
app.use(helmet()); // Cabeceras HTTP seguras
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")); // Logging de peticiones

// ── Parseo y CORS ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*"
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente"
  });
});

app.use("/api/products", productRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`API escuchando en http://localhost:${PORT}`);
        console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
      });
    })
    .catch((error) => {
      console.error("No se pudo iniciar la aplicación:", error.message);
      process.exit(1);
    });
}

module.exports = app;
