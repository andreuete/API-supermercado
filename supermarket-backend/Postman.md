# Guía de Pruebas con Postman / HTTP Client

Base URL de la API:

```text
http://localhost:3000
```

---

## 1. Crear producto

**POST** `/api/products`

Headers:
```text
Content-Type: application/json
```

Request Body:

```json
{
  "name": "Yogur natural",
  "description": "Yogur natural cremoso sin azúcares añadidos.",
  "category": {
    "id": "672bb1a8f3b2c1a4e5d6f701",
    "slug": "yogures",
    "name": "Yogures"
  },
  "brand": {
    "id": "672bb1a8f3b2c1a4e5d6f702",
    "slug": "danone",
    "name": "Danone"
  },
  "variants": [
    {
      "sku": "YOG-NAT-4U",
      "price": 1.45,
      "stock": 150,
      "attributes": {
        "peso": "125 g",
        "unidades": 4
      },
      "is_active": true,
      "status": "published"
    },
    {
      "sku": "YOG-NAT-8U",
      "price": 2.69,
      "stock": 90,
      "attributes": {
        "peso": "125 g",
        "unidades": 8
      },
      "is_active": true,
      "status": "published"
    }
  ],
  "images": [
    {
      "url": "https://cdn.supermercado.com/products/yogur-natural-1.jpg",
      "alt_text": "Yogur natural - pack 4 unidades"
    }
  ],
  "is_active": true,
  "status": "published"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "description": "Yogur natural cremoso sin azúcares añadidos.",
    "category": {
      "id": "672bb1a8f3b2c1a4e5d6f701",
      "slug": "yogures",
      "name": "Yogures"
    },
    "brand": {
      "id": "672bb1a8f3b2c1a4e5d6f702",
      "slug": "danone",
      "name": "Danone"
    },
    "variants": [
      {
        "sku": "YOG-NAT-4U",
        "price": 1.45,
        "stock": 150,
        "attributes": {
          "peso": "125 g",
          "unidades": 4
        },
        "is_active": true,
        "status": "published",
        "deleted_at": null
      },
      {
        "sku": "YOG-NAT-8U",
        "price": 2.69,
        "stock": 90,
        "attributes": {
          "peso": "125 g",
          "unidades": 8
        },
        "is_active": true,
        "status": "published",
        "deleted_at": null
      }
    ],
    "images": [
      {
        "url": "https://cdn.supermercado.com/products/yogur-natural-1.jpg",
        "alt_text": "Yogur natural - pack 4 unidades"
      }
    ],
    "slug": "yogur-natural",
    "is_active": true,
    "status": "published",
    "deleted_at": null,
    "created_at": "2026-11-05T19:00:00.000Z",
    "updated_at": "2026-11-05T19:00:00.000Z"
  }
}
```

---

## 2. Listar todos los productos

**GET** `/api/products`

Response `200`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "672bb1a8f3b2c1a4e5d6f710",
      "name": "Yogur natural",
      "description": "Yogur natural cremoso sin azúcares añadidos.",
      "category": {
        "id": "672bb1a8f3b2c1a4e5d6f701",
        "slug": "yogures",
        "name": "Yogures"
      },
      "brand": {
        "id": "672bb1a8f3b2c1a4e5d6f702",
        "slug": "danone",
        "name": "Danone"
      },
      "variants": [
        {
          "sku": "YOG-NAT-4U",
          "price": 1.45,
          "stock": 150,
          "attributes": {
            "peso": "125 g",
            "unidades": 4
          },
          "is_active": true,
          "status": "published",
          "deleted_at": null
        }
      ],
      "images": [
        {
          "url": "https://cdn.supermercado.com/products/yogur-natural-1.jpg",
          "alt_text": "Yogur natural - pack 4 unidades"
        }
      ],
      "slug": "yogur-natural",
      "is_active": true,
      "status": "published",
      "deleted_at": null,
      "created_at": "2026-11-05T19:00:00.000Z",
      "updated_at": "2026-11-05T19:00:00.000Z"
    }
  ]
}
```

---

## 3. Listar productos activos (`is_active: true`, `deleted_at: null`)

**GET** `/api/products/is-active` (o `/api/products/isActive`)

Response `200`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "672bb1a8f3b2c1a4e5d6f710",
      "name": "Yogur natural",
      "description": "Yogur natural cremoso sin azúcares añadidos.",
      "category": {
        "id": "672bb1a8f3b2c1a4e5d6f701",
        "slug": "yogures",
        "name": "Yogures"
      },
      "brand": {
        "id": "672bb1a8f3b2c1a4e5d6f702",
        "slug": "danone",
        "name": "Danone"
      },
      "variants": [
        {
          "sku": "YOG-NAT-4U",
          "price": 1.45,
          "stock": 150,
          "attributes": {
            "peso": "125 g",
            "unidades": 4
          },
          "is_active": true,
          "status": "published",
          "deleted_at": null
        }
      ],
      "slug": "yogur-natural",
      "is_active": true,
      "status": "published",
      "deleted_at": null,
      "created_at": "2026-11-05T19:00:00.000Z",
      "updated_at": "2026-11-05T19:00:00.000Z"
    }
  ]
}
```

---

## 4. Obtener producto por Slug (`getBySlug`)

**GET** `/api/products/slug/:slug`

Ejemplo:
```text
GET /api/products/slug/yogur-natural
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "description": "Yogur natural cremoso sin azúcares añadidos.",
    "category": {
      "id": "672bb1a8f3b2c1a4e5d6f701",
      "slug": "yogures",
      "name": "Yogures"
    },
    "brand": {
      "id": "672bb1a8f3b2c1a4e5d6f702",
      "slug": "danone",
      "name": "Danone"
    },
    "variants": [
      {
        "sku": "YOG-NAT-4U",
        "price": 1.45,
        "stock": 150,
        "attributes": {
          "peso": "125 g",
          "unidades": 4
        },
        "is_active": true,
        "status": "published",
        "deleted_at": null
      }
    ],
    "slug": "yogur-natural",
    "is_active": true,
    "status": "published",
    "deleted_at": null,
    "created_at": "2026-11-05T19:00:00.000Z",
    "updated_at": "2026-11-05T19:00:00.000Z"
  }
}
```

---

## 5. Obtener producto por ID (`getById`)

**GET** `/api/products/:id`

Ejemplo:
```text
GET /api/products/672bb1a8f3b2c1a4e5d6f710
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "description": "Yogur natural cremoso sin azúcares añadidos.",
    "category": {
      "id": "672bb1a8f3b2c1a4e5d6f701",
      "slug": "yogures",
      "name": "Yogures"
    },
    "brand": {
      "id": "672bb1a8f3b2c1a4e5d6f702",
      "slug": "danone",
      "name": "Danone"
    },
    "variants": [
      {
        "sku": "YOG-NAT-4U",
        "price": 1.45,
        "stock": 150,
        "attributes": {
          "peso": "125 g",
          "unidades": 4
        },
        "is_active": true,
        "status": "published",
        "deleted_at": null
      }
    ],
    "slug": "yogur-natural",
    "is_active": true,
    "status": "published",
    "deleted_at": null,
    "created_at": "2026-11-05T19:00:00.000Z",
    "updated_at": "2026-11-05T19:00:00.000Z"
  }
}
```

---

## 6. Actualizar producto

**PUT** `/api/products/:id`

Request Body:

```json
{
  "name": "Yogur natural azucarado",
  "description": "Yogur natural con un toque de azúcar de caña."
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural azucarado",
    "description": "Yogur natural con un toque de azúcar de caña.",
    "category": {
      "id": "672bb1a8f3b2c1a4e5d6f701",
      "slug": "yogures",
      "name": "Yogures"
    },
    "brand": {
      "id": "672bb1a8f3b2c1a4e5d6f702",
      "slug": "danone",
      "name": "Danone"
    },
    "variants": [
      {
        "sku": "YOG-NAT-4U",
        "price": 1.45,
        "stock": 150,
        "attributes": {
          "peso": "125 g",
          "unidades": 4
        },
        "is_active": true,
        "status": "published",
        "deleted_at": null
      }
    ],
    "slug": "yogur-natural-azucarado",
    "is_active": true,
    "status": "published",
    "deleted_at": null,
    "created_at": "2026-11-05T19:00:00.000Z",
    "updated_at": "2026-11-05T19:15:00.000Z"
  }
}
```

---

## 7. Cambiar estado (`changeStatus`)

**PATCH** `/api/products/:id/status` (o `/api/products/:id/change-status`)

Valores válidos: `"published"`, `"draft"`, `"archived"`, `"inactive"`.

Request Body:

```json
{
  "status": "archived"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Estado del producto actualizado correctamente",
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "status": "archived",
    "updated_at": "2026-11-05T19:20:00.000Z"
  }
}
```

---

## 8. Alternar o modificar `is_active`

**PATCH** `/api/products/:id/is-active` (o `/api/products/:id/isActive`)

Request Body (opcional, si se omite invierte el valor actual):

```json
{
  "is_active": false
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Estado activo/inactivo actualizado correctamente",
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "is_active": false,
    "updated_at": "2026-11-05T19:25:00.000Z"
  }
}
```

---

## 9. Borrado lógico (`softDelete`)

**PATCH** `/api/products/:id/soft-delete` (o `/api/products/:id/softDelete`)

Response `200`:

```json
{
  "success": true,
  "message": "Producto eliminado lógicamente (soft delete)",
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "is_active": false,
    "deleted_at": "2026-11-05T19:30:00.000Z",
    "updated_at": "2026-11-05T19:30:00.000Z"
  }
}
```

---

## 10. Restaurar producto borrado (`restoreDeleted`)

**PATCH** `/api/products/:id/restore` (o `/api/products/:id/restore-deleted`)

Response `200`:

```json
{
  "success": true,
  "message": "Producto restaurado correctamente",
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "is_active": true,
    "deleted_at": null,
    "updated_at": "2026-11-05T19:35:00.000Z"
  }
}
```

---

## 11. Eliminar producto (`deleteProduct`)

**DELETE** `/api/products/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Producto marcado como eliminado correctamente",
  "data": {
    "_id": "672bb1a8f3b2c1a4e5d6f710",
    "name": "Yogur natural",
    "is_active": false,
    "deleted_at": "2026-11-05T19:40:00.000Z",
    "updated_at": "2026-11-05T19:40:00.000Z"
  }
}
```

El producto permanece en la base de datos y se puede restaurar mediante `PATCH /api/products/:id/restore`.

---

## 12. Gestión de Variantes de Producto

### Añadir variante a producto
**POST** `/api/products/:productId/variants`

Request Body:
```json
{
  "sku": "YOG-NAT-12U",
  "price": 3.99,
  "stock": 40,
  "attributes": {
    "peso": "125 g",
    "unidades": 12
  },
  "is_active": true,
  "status": "published"
}
```

### Consultar variante por SKU
**GET** `/api/products/:productId/variants/YOG-NAT-12U`

### Actualizar variante
**PUT** `/api/products/:productId/variants/YOG-NAT-12U`

Request Body:
```json
{
  "price": 3.79,
  "stock": 55
}
```

### Borrado lógico de variante
**PATCH** `/api/products/:productId/variants/YOG-NAT-12U/soft-delete`

### Restaurar variante
**PATCH** `/api/products/:productId/variants/YOG-NAT-12U/restore`

---

## Errores habituales

### ID inválido (400)
```json
{
  "success": false,
  "message": "ID de producto no válido"
}
```

### Producto inexistente (404)
```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```

### Error de validación Zod (400)
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    "El nombre es obligatorio",
    "La categoría es obligatoria"
  ]
}
```
