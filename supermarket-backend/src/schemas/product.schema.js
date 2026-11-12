const { z } = require("zod");

// ─── Esquema de referencia desnormalizada (Category / Brand) ─────────────────
const refSnapshotSchema = z.object({
  id: z
    .string({ required_error: "El id es obligatorio" })
    .refine((val) => /^[a-f\d]{24}$/i.test(val), {
      message: "El id debe ser un ObjectId válido"
    }),
  slug: z
    .string({ required_error: "El slug es obligatorio" })
    .trim()
    .min(1, "El slug no puede estar vacío")
    .toLowerCase(),
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre no puede estar vacío")
});

// ─── Esquema de variante embebida ─────────────────────────────────────────────
const variantInputSchema = z.object({
  sku: z
    .string()
    .trim()
    .toUpperCase()
    .optional(),
  price: z
    .number({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo"),
  stock: z
    .number({ required_error: "El stock es obligatorio", invalid_type_error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  attributes: z.record(z.any()).optional().default({}),
  is_active: z.boolean().optional(),
  status: z.string().optional()
});

// ─── Esquema de imagen embebida ───────────────────────────────────────────────
const embeddedImageSchema = z.object({
  url: z
    .string({ required_error: "La URL es obligatoria" })
    .trim()
    .min(1, "La URL no puede estar vacía"),
  alt_text: z.string().trim().optional().default("")
});

// ─── Esquema de creación ───────────────────────────────────────────────────────
const createProductSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .trim(),

  description: z
    .string({ required_error: "La descripción es obligatoria" })
    .min(1, "La descripción no puede estar vacía")
    .trim(),

  category: refSnapshotSchema,

  brand: refSnapshotSchema,

  variants: z.array(variantInputSchema).optional().default([]),

  images: z.array(embeddedImageSchema).optional().default([]),

  is_active: z.boolean().optional(),

  status: z.enum(["published", "draft", "archived", "inactive"]).optional(),

  slug: z.string().optional()
});

// ─── Esquema de actualización (todos los campos opcionales) ───────────────────
const updateProductSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim().optional(),
    description: z.string().min(1, "La descripción no puede estar vacía").trim().optional(),
    category: refSnapshotSchema.optional(),
    brand: refSnapshotSchema.optional(),
    variants: z.array(variantInputSchema).optional(),
    images: z.array(embeddedImageSchema).optional(),
    is_active: z.boolean().optional(),
    status: z.enum(["published", "draft", "archived", "inactive"]).optional(),
    slug: z.string().optional()
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "Se debe enviar al menos un campo para actualizar" }
  );

// ─── Esquema para cambiar estado ──────────────────────────────────────────────
const changeStatusSchema = z.object({
  status: z
    .string({ required_error: "El estado es obligatorio" })
    .min(1, "El estado no puede estar vacío")
});

module.exports = {
  refSnapshotSchema,
  variantInputSchema,
  embeddedImageSchema,
  createProductSchema,
  updateProductSchema,
  changeStatusSchema
};
