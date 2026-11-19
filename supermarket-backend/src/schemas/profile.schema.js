const { z } = require("zod");

const updateProfileSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim().optional(),
  email: z.string().email("El email no es válido").trim().optional(),
  avatar: z.string().url("El avatar debe ser una URL válida").nullable().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Se debe enviar al menos un campo para actualizar el perfil" }
);

module.exports = { updateProfileSchema };
