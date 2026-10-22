const mongoose = require("mongoose");
const { baseFields, baseOptions, slugPlugin } = require("./base");
const { generateSlug } = require("../utils/slug");

// Enfoque B: colección polimórfica de imágenes (entity_type + entity_id)
const imageSchema = new mongoose.Schema(
  {
    ...baseFields,
    url: {
      type: String,
      required: [true, "La URL es obligatoria"],
      trim: true
    },
    entity_type: {
      type: String,
      required: [true, "El tipo de entidad es obligatorio"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["product", "category", "brand"],
        message: "El tipo de entidad '{VALUE}' no es válido"
      }
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "El id de la entidad es obligatorio"]
    },
    alt_text: {
      type: String,
      trim: true,
      default: ""
    }
  },
  baseOptions
);

imageSchema.index({ entity_type: 1, entity_id: 1 });

// El slug se genera a partir del alt_text o, si no existe, del tipo de entidad
imageSchema.pre("validate", function (next) {
  if (!this.slug) {
    const base = this.alt_text || `${this.entity_type}-${this.entity_id}`;
    this.slug = `${generateSlug(base)}-${new mongoose.Types.ObjectId().toString().slice(-6)}`;
  }
  next();
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
module.exports.generateSlug = generateSlug;
