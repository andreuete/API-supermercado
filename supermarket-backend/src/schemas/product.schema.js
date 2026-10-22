const { z } = require("zod");

// ─── Esquema de creación ───────────────────────────────────────────────────────
const createProductSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .trim(),

  categoria: z
    .string({ required_error: "La categoría es obligatoria" })
    .min(1, "La categoría no puede estar vacía")
    .trim(),

  precio: z
    .number({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo"),

  stock: z
    .number({ required_error: "El stock es obligatorio", invalid_type_error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  marca: z
    .string({ required_error: "La marca es obligatoria" })
    .min(1, "La marca no puede estar vacía")
    .trim(),

  descripcion: z
    .string({ required_error: "La descripción es obligatoria" })
    .min(1, "La descripción no puede estar vacía")
    .trim(),

  isActive: z.boolean().optional(),

  status: z.string().optional(),

  slug: z.string().optional()
});

// ─── Esquema de actualización (todos los campos opcionales) ───────────────────
const updateProductSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .trim()
    .optional(),

  categoria: z
    .string()
    .min(1, "La categoría no puede estar vacía")
    .trim()
    .optional(),

  precio: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo")
    .optional(),

  stock: z
    .number({ invalid_type_error: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .optional(),

  marca: z
    .string()
    .min(1, "La marca no puede estar vacía")
    .trim()
    .optional(),

  descripcion: z
    .string()
    .min(1, "La descripción no puede estar vacía")
    .trim()
    .optional(),

  isActive: z.boolean().optional(),

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

module.exports = { createProductSchema, updateProductSchema, changeStatusSchema };
