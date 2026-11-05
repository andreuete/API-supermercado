const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Supermarket Products API",
      version: "1.0.0",
      description: "API REST para gestionar productos y catálogo de supermercado con soporte para variantes, categorías jerárquicas, marcas e imágenes."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ],
    components: {
      schemas: {
        RefSnapshot: {
          type: "object",
          required: ["id", "slug", "name"],
          properties: {
            id: { type: "string", example: "672bb1a8f3b2c1a4e5d6f789" },
            slug: { type: "string", example: "lacteos" },
            name: { type: "string", example: "Lácteos" }
          }
        },
        EmbeddedImage: {
          type: "object",
          required: ["url"],
          properties: {
            url: { type: "string", example: "https://cdn.supermercado.com/products/leche-entera-1.jpg" },
            alt_text: { type: "string", example: "Leche entera - vista principal" }
          }
        },
        Variant: {
          type: "object",
          required: ["sku", "price", "stock"],
          properties: {
            sku: { type: "string", example: "LECH-ENT-1L" },
            price: { type: "number", format: "float", minimum: 0, example: 1.15 },
            stock: { type: "integer", minimum: 0, example: 240 },
            attributes: {
              type: "object",
              example: { volumen: "1 L", unidades: 1 }
            },
            is_active: { type: "boolean", example: true },
            status: { type: "string", example: "published" },
            deleted_at: { type: "string", format: "date-time", nullable: true, example: null }
          }
        },
        VariantInput: {
          type: "object",
          required: ["sku", "price", "stock"],
          properties: {
            sku: { type: "string", example: "LECH-ENT-1L" },
            price: { type: "number", format: "float", minimum: 0, example: 1.15 },
            stock: { type: "integer", minimum: 0, example: 240 },
            attributes: {
              type: "object",
              example: { volumen: "1 L", unidades: 1 }
            },
            is_active: { type: "boolean", example: true },
            status: { type: "string", example: "published" }
          }
        },
        Product: {
          type: "object",
          required: ["name", "description", "category", "brand"],
          properties: {
            _id: { type: "string", example: "672bb1a8f3b2c1a4e5d6f701" },
            name: { type: "string", example: "Leche entera" },
            description: { type: "string", example: "Leche de vaca entera UHT. Fuente de calcio y proteínas." },
            category: { $ref: "#/components/schemas/RefSnapshot" },
            brand: { $ref: "#/components/schemas/RefSnapshot" },
            variants: {
              type: "array",
              items: { $ref: "#/components/schemas/Variant" }
            },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/EmbeddedImage" }
            },
            slug: { type: "string", example: "leche-entera" },
            is_active: { type: "boolean", example: true },
            status: { type: "string", example: "published" },
            deleted_at: { type: "string", format: "date-time", nullable: true, example: null },
            created_at: { type: "string", format: "date-time", example: "2026-11-05T18:00:00.000Z" },
            updated_at: { type: "string", format: "date-time", example: "2026-11-05T18:00:00.000Z" }
          }
        },
        ProductInput: {
          type: "object",
          required: ["name", "description", "category", "brand"],
          properties: {
            name: { type: "string", example: "Leche entera" },
            description: { type: "string", example: "Leche de vaca entera UHT. Fuente de calcio y proteínas." },
            category: { $ref: "#/components/schemas/RefSnapshot" },
            brand: { $ref: "#/components/schemas/RefSnapshot" },
            variants: {
              type: "array",
              items: { $ref: "#/components/schemas/VariantInput" }
            },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/EmbeddedImage" }
            },
            slug: { type: "string", example: "leche-entera" },
            is_active: { type: "boolean", example: true },
            status: { type: "string", example: "published" }
          }
        },
        ChangeStatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", example: "published" }
          }
        },
        IsActiveInput: {
          type: "object",
          properties: {
            is_active: { type: "boolean", example: true }
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
