const mongoose = require("mongoose");

// Entidad embebida dentro de Product. No es un modelo/colección independiente.
// No tiene id ni slug: se identifica por `sku`.
const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "El SKU es obligatorio"],
      trim: true,
      uppercase: true
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"]
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero"
      }
    },
    // Atributos dinámicos: volumen, peso, unidades, etc.
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    is_active: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      trim: true,
      default: "inactive"
    },
    deleted_at: {
      type: Date,
      default: null
    }
  },
  { _id: false, versionKey: false }
);

module.exports = variantSchema;
