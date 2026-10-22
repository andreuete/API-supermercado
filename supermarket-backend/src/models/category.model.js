const mongoose = require("mongoose");
const { baseFields, baseOptions, slugPlugin } = require("./base");
const { generateSlug } = require("../utils/slug");

const categorySchema = new mongoose.Schema(
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
      trim: true,
      default: ""
    },
    // Autorreferencia: permite subcategorías
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true
    }
  },
  baseOptions
);

categorySchema.plugin(slugPlugin, { sourceField: "name" });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
module.exports.generateSlug = generateSlug;
