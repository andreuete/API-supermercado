const { z } = require("zod");

// ─── Esquema de creación ───────────────────────────────────────────────────────
const createVariantSchema = z.object({
  sku: z
    .string({ required_error: "El SKU es obligatorio" })
    .min(1, "El SKU no puede estar vacío")
    .trim()
    .toUpperCase(),
  price: z
    .number({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo"),
  stock: z
    .number({ required_error: "El stock es obligatorio", invalid_type_error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  attributes: z.record(z.any()).optional(),
  is_active: z.boolean().optional(),
  status: z.string().optional()
});

// ─── Esquema de actualización (todos los campos opcionales) ───────────────────
const updateVariantSchema = z.object({
  price: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo")
    .optional(),
  stock: z
    .number({ invalid_type_error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .optional(),
  attributes: z.record(z.any()).optional(),
  is_active: z.boolean().optional(),
  status: z.string().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Se debe enviar al menos un campo para actualizar" }
);

module.exports = { createVariantSchema, updateVariantSchema };
