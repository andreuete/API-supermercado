const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Supermarket Products API",
      version: "1.0.0",
      description: "API REST para gestionar productos de supermercado."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["nombre", "categoria", "precio", "stock", "marca", "descripcion"],
          properties: {
            _id: { type: "string", example: "67d1f8f5b3a1a2b3c4d5e6f7" },
            nombre: { type: "string", example: "Leche entera" },
            categoria: { type: "string", example: "Lácteos" },
            precio: { type: "number", format: "float", minimum: 0, example: 1.25 },
            stock: { type: "integer", minimum: 0, example: 40 },
            marca: { type: "string", example: "Central Lechera" },
            descripcion: { type: "string", example: "Leche entera pasteurizada." },
            slug: { type: "string", example: "leche-entera" },
            isActive: { type: "boolean", example: false },
            status: { type: "string", example: "inactive" },
            createdAt: { type: "string", format: "date-time", nullable: true, example: null },
            updatedAt: { type: "string", format: "date-time", nullable: true, example: null },
            deletedAt: { type: "string", format: "date-time", nullable: true, example: null }
          }
        },
        ProductInput: {
          type: "object",
          required: ["nombre", "categoria", "precio", "stock", "marca", "descripcion"],
          properties: {
            nombre: { type: "string", example: "Leche entera" },
            categoria: { type: "string", example: "Lácteos" },
            precio: { type: "number", format: "float", minimum: 0, example: 1.25 },
            stock: { type: "integer", minimum: 0, example: 40 },
            marca: { type: "string", example: "Central Lechera" },
            descripcion: { type: "string", example: "Leche entera pasteurizada." },
            slug: { type: "string", example: "leche-entera" },
            isActive: { type: "boolean", example: false },
            status: { type: "string", example: "active" },
            createdAt: { type: "string", format: "date-time", nullable: true },
            updatedAt: { type: "string", format: "date-time", nullable: true },
            deletedAt: { type: "string", format: "date-time", nullable: true }
          }
        },
        ChangeStatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", example: "active" }
          }
        },
        IsActiveInput: {
          type: "object",
          properties: {
            isActive: { type: "boolean", example: true }
          }
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Producto no encontrado" }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js"]
};

module.exports = swaggerJSDoc(options);
