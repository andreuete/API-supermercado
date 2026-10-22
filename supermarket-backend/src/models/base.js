const { generateSlug } = require("../utils/slug");

// Campos base compartidos por todas las entidades (excepto Variant)
const baseFields = {
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    index: true
  },
  is_active: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    trim: true,
    enum: {
      values: ["published", "draft", "archived", "inactive"],
      message: "El estado '{VALUE}' no es válido"
    },
    default: "inactive"
  },
  deleted_at: {
    type: Date,
    default: null
  }
};

// Opciones comunes de schema
const baseOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  versionKey: false
};

// Plugin: genera el slug a partir de `sourceField` si no existe o si ese campo cambia
function slugPlugin(schema, { sourceField }) {
  schema.pre("save", function (next) {
    if (this[sourceField] && (!this.slug || this.isModified(sourceField))) {
      this.slug = generateSlug(this.slug || this[sourceField]);
    }
    next();
  });
}

module.exports = { baseFields, baseOptions, slugPlugin };
