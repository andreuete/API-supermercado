const mongoose = require("mongoose");
const { baseFields, baseOptions } = require("./base");
const { generateSlug } = require("../utils/slug");

const userSchema = new mongoose.Schema(
  {
    ...baseFields,
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "El email no es válido"]
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      select: false // no se devuelve por defecto en las consultas (hash)
    },
    full_name: {
      type: String,
      required: [true, "El nombre completo es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"]
    },
    role_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  },
  baseOptions
);

// El slug del usuario se genera desde el email (único) para evitar colisiones entre nombres iguales
userSchema.pre("save", function (next) {
  if (this.email && (!this.slug || this.isModified("email"))) {
    this.slug = generateSlug(this.email.split("@")[0] + "-" + this.email.split("@")[1]);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.generateSlug = generateSlug;
