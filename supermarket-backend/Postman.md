# Postman

Base URL:

```text
http://localhost:3000
```

---

## 1. Crear producto

**POST** `/api/products`

Request Body:

```json
{
  "nombre": "Yogur natural",
  "categoria": "Lácteos",
  "precio": 0.85,
  "stock": 50,
  "marca": "Granja Verde",
  "descripcion": "Yogur natural sin azúcar añadido."
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "categoria": "Lácteos",
    "precio": 0.85,
    "stock": 50,
    "marca": "Granja Verde",
    "descripcion": "Yogur natural sin azúcar añadido.",
    "slug": "yogur-natural",
    "isActive": false,
    "status": "inactive",
    "createdAt": null,
    "updatedAt": null,
    "deletedAt": null
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
      "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
      "nombre": "Yogur natural",
      "categoria": "Lácteos",
      "precio": 0.85,
      "stock": 50,
      "marca": "Granja Verde",
      "descripcion": "Yogur natural sin azúcar añadido.",
      "slug": "yogur-natural",
      "isActive": false,
      "status": "inactive",
      "createdAt": null,
      "updatedAt": null,
      "deletedAt": null
    }
  ]
}
```

---

## 3. Listar productos activos (`isActive`)

**GET** `/api/products/is-active` (o `/api/products/isActive`)

Response `200`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
      "nombre": "Yogur natural",
      "categoria": "Lácteos",
      "precio": 0.85,
      "stock": 50,
      "marca": "Granja Verde",
      "descripcion": "Yogur natural sin azúcar añadido.",
      "slug": "yogur-natural",
      "isActive": true,
      "status": "active",
      "createdAt": null,
      "updatedAt": null,
      "deletedAt": null
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
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "categoria": "Lácteos",
    "precio": 0.85,
    "stock": 50,
    "marca": "Granja Verde",
    "descripcion": "Yogur natural sin azúcar añadido.",
    "slug": "yogur-natural",
    "isActive": true,
    "status": "active",
    "createdAt": null,
    "updatedAt": null,
    "deletedAt": null
  }
}
```

---

## 5. Obtener producto por ID (`getById`)

**GET** `/api/products/:id`

Ejemplo:
```text
GET /api/products/67d1f8f5b3a1a2b3c4d5e6f7
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "categoria": "Lácteos",
    "precio": 0.85,
    "stock": 50,
    "marca": "Granja Verde",
    "descripcion": "Yogur natural sin azúcar añadido.",
    "slug": "yogur-natural",
    "isActive": false,
    "status": "inactive",
    "createdAt": null,
    "updatedAt": null,
    "deletedAt": null
  }
}
```

---

## 6. Actualizar producto

**PUT** `/api/products/:id`

Request Body:

```json
{
  "nombre": "Yogur natural",
  "categoria": "Lácteos",
  "precio": 0.95,
  "stock": 65,
  "marca": "Granja Verde",
  "descripcion": "Yogur natural sin azúcar añadido."
}
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "categoria": "Lácteos",
    "precio": 0.95,
    "stock": 65,
    "marca": "Granja Verde",
    "descripcion": "Yogur natural sin azúcar añadido.",
    "slug": "yogur-natural",
    "isActive": false,
    "status": "inactive",
    "createdAt": null,
    "updatedAt": "2026-10-08T20:30:00.000Z",
    "deletedAt": null
  }
}
```

---

## 7. Cambiar estado (`changeStatus`)

**PATCH** `/api/products/:id/status` (o `/api/products/:id/change-status`)

Request Body:

```json
{
  "status": "active"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Estado del producto actualizado correctamente",
  "data": {
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "status": "active",
    "updatedAt": "2026-10-08T20:30:00.000Z"
  }
}
```

---

## 8. Alternar o modificar `isActive` (`isActive`)

**PATCH** `/api/products/:id/is-active` (o `/api/products/:id/isActive`)

Request Body (opcional, si se omite invierte el valor actual):

```json
{
  "isActive": true
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Estado activo/inactivo actualizado correctamente",
  "data": {
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "isActive": true,
    "updatedAt": "2026-10-08T20:30:00.000Z"
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
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "isActive": false,
    "deletedAt": "2026-10-08T20:30:00.000Z",
    "updatedAt": "2026-10-08T20:30:00.000Z"
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
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural",
    "isActive": true,
    "deletedAt": null,
    "updatedAt": "2026-10-08T20:30:00.000Z"
  }
}
```

---

## 11. Eliminar permanentemente (hard delete)

**DELETE** `/api/products/:id`

Response `200`:

```json
{
  "success": true,
  "message": "Producto eliminado correctamente",
  "data": {
    "_id": "67d1f8f5b3a1a2b3c4d5e6f7",
    "nombre": "Yogur natural"
  }
}
```

---

## Errores habituales

ID inválido:

```json
{
  "success": false,
  "message": "ID de producto no válido"
}
```

Producto inexistente:

```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```

Error de validación:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    "El precio no puede ser negativo"
  ]
}
```
