const mongoose = require("mongoose");
const { baseFields, baseOptions, slugPlugin } = require("./base");
const { generateSlug } = require("../utils/slug");

const brandSchema = new mongoose.Schema(
  {
    ...baseFields,
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    }
  },
  baseOptions
);

brandSchema.plugin(slugPlugin, { sourceField: "name" });

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
module.exports.generateSlug = generateSlug;
