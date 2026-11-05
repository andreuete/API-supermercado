import { z } from 'zod'

/**
 * Esquema de validación para el formulario de Producto (creación y modificación),
 * sincronizado con el modelo de backend y las referencias a Category y Brand.
 */
export const productSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  categoryId: z.string().trim().min(1, 'Selecciona una categoría.'),
  brandId: z.string().trim().min(1, 'Selecciona una marca.'),
  price: z.coerce.number().finite('El precio debe ser un número válido.').min(0, 'El precio no puede ser negativo.'),
  stock: z.coerce.number().int('El stock debe ser un número entero.').min(0, 'El stock no puede ser negativo.'),
  description: z.string().trim().default(''),
  sku: z.string().trim().optional(),
  is_active: z.boolean().optional(),
  status: z.string().optional(),
})

export const productDefaults = {
  name: '',
  categoryId: '',
  brandId: '',
  price: 0,
  stock: 0,
  description: '',
  sku: '',
  is_active: true,
  status: 'published',
}

export const productFields = [
  { name: 'name', label: 'Nombre del producto', placeholder: 'Ej. Leche entera', type: 'text' },
  { name: 'categoryId', label: 'Categoría', placeholder: 'Selecciona una categoría', type: 'select' },
  { name: 'brandId', label: 'Marca', placeholder: 'Selecciona una marca', type: 'select' },
  { name: 'price', label: 'Precio (€)', placeholder: '0,00', type: 'number', min: 0, step: '0.01' },
  { name: 'stock', label: 'Unidades en stock', placeholder: '0', type: 'number', min: 0, step: '1' },
]
