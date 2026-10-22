const mongoose = require("mongoose");
const { baseFields, baseOptions, slugPlugin } = require("./base");
const { generateSlug } = require("../utils/slug");

const roleSchema = new mongoose.Schema(
  {
    ...baseFields,
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },
    permissions: {
      type: [String],
      default: []
    }
  },
  baseOptions
);

roleSchema.plugin(slugPlugin, { sourceField: "name" });

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
module.exports.generateSlug = generateSlug;
