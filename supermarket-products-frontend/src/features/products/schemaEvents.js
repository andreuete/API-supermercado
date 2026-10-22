import { z } from 'zod'

/**
 * Espejo de las reglas conocidas del backend. Los campos slug, status,
 * timestamps e isActive se administran en servidor y no forman parte del alta.
 */
export const productSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  categoria: z.string().trim().min(1, 'Selecciona o escribe una categoría.'),
  precio: z.coerce.number().finite('El precio debe ser un número válido.').min(0, 'El precio no puede ser negativo.'),
  stock: z.coerce.number().int('El stock debe ser un entero.').min(0, 'El stock no puede ser negativo.'),
  marca: z.string().trim().min(1, 'La marca es obligatoria.'),
  descripcion: z.string().trim().default(''),
})

export const productDefaults = {
  nombre: '', categoria: '', precio: 0, stock: 0, marca: '', descripcion: '',
}

export const productFields = [
  { name: 'nombre', label: 'Nombre del producto', placeholder: 'Ej. Leche entera', type: 'text' },
  { name: 'categoria', label: 'Categoría', placeholder: 'Ej. Lácteos', type: 'text' },
  { name: 'precio', label: 'Precio (€)', placeholder: '0,00', type: 'number', min: 0, step: '0.01' },
  { name: 'stock', label: 'Stock disponible', placeholder: '0', type: 'number', min: 0, step: '1' },
  { name: 'marca', label: 'Marca', placeholder: 'Ej. Central Lechera', type: 'text' },
]