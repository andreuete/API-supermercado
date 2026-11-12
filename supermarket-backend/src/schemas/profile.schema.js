const { z } = require("zod");

const updateProfileSchema = z.object({
  avatar: z.string().url("El avatar debe ser una URL válida").nullable()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Se debe enviar el avatar para actualizar el perfil" }
);

module.exports = { updateProfileSchema };
