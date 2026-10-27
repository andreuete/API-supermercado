const { z } = require("zod");

// ─── Esquema de creación ───────────────────────────────────────────────────────
const createImageSchema = z.object({
  url: z
    .string({ required_error: "La URL es obligatoria" })
    .min(1, "La URL no puede estar vacía")
    .trim(),
  entity_type: z
    .enum(["product", "category", "brand"], {
      required_error: "El tipo de entidad es obligatorio",
      invalid_type_error: "El tipo de entidad debe ser: product, category o brand"
    }),
  entity_id: z
    .string({ required_error: "El id de la entidad es obligatorio" })
    .refine(
      (val) => /^[a-f\d]{24}$/i.test(val),
      { message: "El entity_id debe ser un ObjectId válido" }
    ),
  alt_text: z.string().optional(),
  is_active: z.boolean().optional(),
  status: z.string().optional()
});

// ─── Esquema de actualización (todos los campos opcionales) ───────────────────
const updateImageSchema = z.object({
  url: z.string().min(1).trim().optional(),
  entity_type: z.enum(["product", "category", "brand"]).optional(),
  entity_id: z
    .string()
    .refine(
      (val) => /^[a-f\d]{24}$/i.test(val),
      { message: "El entity_id debe ser un ObjectId válido" }
    )
    .optional(),
  alt_text: z.string().optional(),
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

module.exports = { createImageSchema, updateImageSchema, changeStatusSchema };
