const mongoose = require("mongoose");
const { baseFields, baseOptions, slugPlugin } = require("./base");
const { generateSlug } = require("../utils/slug");
const variantSchema = require("./variant.model");

// Referencia desnormalizada (id, slug, name) de Category / Brand
const refSnapshot = (ref) => ({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref,
    required: [true, `El id de ${ref} es obligatorio`]
  },
  slug: { type: String, trim: true, lowercase: true, required: true },
  name: { type: String, trim: true, required: true }
});

// Imagen embebida (Enfoque A)
const embeddedImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: [true, "La URL es obligatoria"], trim: true },
    alt_text: { type: String, trim: true, default: "" }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    ...baseFields,
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true
    },
    category: {
      type: new mongoose.Schema(refSnapshot("Category"), { _id: false }),
      required: [true, "La categoría es obligatoria"]
    },
    brand: {
      type: new mongoose.Schema(refSnapshot("Brand"), { _id: false }),
      required: [true, "La marca es obligatoria"]
    },
    variants: {
      type: [variantSchema],
      default: [],
      validate: {
        validator: function (variants) {
          const skus = variants.map((v) => v.sku);
          return new Set(skus).size === skus.length;
        },
        message: "Los SKU de las variantes no pueden repetirse dentro del producto"
      }
    },
    images: {
      type: [embeddedImageSchema],
      default: []
    }
  },
  baseOptions
);

// Índices para búsqueda/filtrado en tienda
productSchema.index({ "category.id": 1 });
productSchema.index({ "brand.id": 1 });
productSchema.index({ "variants.sku": 1 }, { unique: true, sparse: true });

productSchema.plugin(slugPlugin, { sourceField: "name" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
module.exports.generateSlug = generateSlug;
