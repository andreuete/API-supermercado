const { z } = require("zod");

// ─── Esquema de creación ───────────────────────────────────────────────────────
const createBrandSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .trim(),
  is_active: z.boolean().optional(),
  status: z.string().optional(),
  slug: z.string().optional()
});

// ─── Esquema de actualización (todos los campos opcionales) ───────────────────
const updateBrandSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim().optional(),
  is_active: z.boolean().optional(),
  status: z.string().optional(),
  slug: z.string().optional()
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

module.exports = { createBrandSchema, updateBrandSchema, changeStatusSchema };
