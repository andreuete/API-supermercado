const { z } = require("zod");

// ─── Esquema de creación ───────────────────────────────────────────────────────
const createCategorySchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .trim(),
  description: z.string().optional(),
  parent_id: z
    .string()
    .refine(
      (val) => /^[a-f\d]{24}$/i.test(val),
      { message: "El parent_id debe ser un ObjectId válido" }
    )
    .optional()
    .nullable(),
  is_active: z.boolean().optional(),
  status: z.string().optional(),
  slug: z.string().optional()
});

// ─── Esquema de actualización (todos los campos opcionales) ───────────────────
const updateCategorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim().optional(),
  description: z.string().optional(),
  parent_id: z
    .string()
    .refine(
      (val) => /^[a-f\d]{24}$/i.test(val),
      { message: "El parent_id debe ser un ObjectId válido" }
    )
    .optional()
    .nullable(),
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

module.exports = { createCategorySchema, updateCategorySchema, changeStatusSchema };
