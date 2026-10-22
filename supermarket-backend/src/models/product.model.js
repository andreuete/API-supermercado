const mongoose = require("mongoose");

function generateSlug(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true
    },
    precio: {
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
    marca: {
      type: String,
      required: [true, "La marca es obligatoria"],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true
    },
    createdAt: {
      type: Date,
      default: null
    },
    updatedAt: {
      type: Date,
      default: null
    },
    deletedAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      trim: true,
      default: "inactive"
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

productSchema.pre("save", function (next) {
  if (this.nombre && (!this.slug || this.isModified("nombre"))) {
    this.slug = generateSlug(this.slug || this.nombre);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
module.exports.generateSlug = generateSlug;
