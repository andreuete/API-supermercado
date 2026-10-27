const { z } = require("zod");

// ─── Esquema de creación ───────────────────────────────────────────────────────
const createUserSchema = z.object({
  email: z
    .string({ required_error: "El email es obligatorio" })
    .email("El email no es válido")
    .trim(),
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  full_name: z
    .string({ required_error: "El nombre completo es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .trim(),
  role_ids: z
    .array(
      z.string().refine(
        (val) => /^[a-f\d]{24}$/i.test(val),
        { message: "Cada role_id debe ser un ObjectId válido" }
      )
    )
    .optional(),
  is_active: z.boolean().optional(),
  status: z.string().optional()
});

// ─── Esquema de actualización (todos los campos opcionales) ───────────────────
const updateUserSchema = z.object({
  email: z.string().email("El email no es válido").trim().optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim().optional(),
  role_ids: z
    .array(
      z.string().refine(
        (val) => /^[a-f\d]{24}$/i.test(val),
        { message: "Cada role_id debe ser un ObjectId válido" }
      )
    )
    .optional(),
  is_active: z.boolean().optional(),
  status: z.string().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Se debe enviar al menos un campo para actualizar" }
);

// ─── Esquema para cambiar estado ──────────────────────────────────────────────
const changeStatusSchema = z.object({
  status: z
    .string({ required_error: "El estado es obligatorio" })
    .min(1, "El estado no puede estar vacío")
});

module.exports = { createUserSchema, updateUserSchema, changeStatusSchema };
