# Supermarket Products API

API REST para la gestión de productos de supermercado desarrollada con Node.js, Express, MongoDB y Mongoose. Incluye validación de esquemas con **Zod**, cabeceras de seguridad con **Helmet**, logging de peticiones con **Morgan**, documentación interactiva con **Swagger / OpenAPI**, soporte CORS, borrado lógico (*soft delete*), control de estados y scripts para carga de datos iniciales (*seed*).

---

## 🚀 Tecnologías Principales

- **Entorno:** [Node.js](https://nodejs.org/) (v18+)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Base de Datos / ODM:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Validación de Datos:** [Zod](https://zod.dev/)
- **Seguridad:** [Helmet](https://helmetjs.github.io/)
- **Logging HTTP:** [Morgan](https://github.com/expressjs/morgan)
- **Documentación de API:** [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) & [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- **CORS:** [cors](https://github.com/expressjs/cors)

---

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **MongoDB** en ejecución local (puerto por defecto `27017`) o una instancia accesible en remoto/cloud (MongoDB Atlas).
- **npm** (incluido con Node.js)

---

## ⚙️ Instalación y Configuración

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Variables de entorno:**

   Crea o ajusta el archivo `.env` en la raíz del proyecto con la siguiente configuración:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/supermarket
   CORS_ORIGIN=*
   NODE_ENV=development
   ```

   | Variable | Descripción | Valor por defecto |
   |---|---|---|
   | `PORT` | Puerto en el que escucha el servidor | `3000` |
   | `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://127.0.0.1:27017/supermarket` |
   | `CORS_ORIGIN` | Orígenes permitidos para CORS | `*` |
   | `NODE_ENV` | Entorno de ejecución (`development` o `production` para el formato de logs de Morgan) | `development` |

---

## ▶️ Ejecución

### Modo desarrollo (con recarga automática mediante Nodemon):

```bash
npm run dev
```

### Modo producción / ejecución estándar:

```bash
npm start
```

### URLs de acceso:

- **API Base:** `http://localhost:3000`
- **Documentación Swagger UI:** `http://localhost:3000/api-docs` (o `http://localhost:3000/api/docs`)
- **Health check:** `http://localhost:3000/health`

---

## 🌱 Población de Base de Datos (Seed)

Para vaciar la colección actual e insertar datos de prueba con todos los campos preconfigurados:

```bash
npm run seed
```

---

## 🏛️ Arquitectura del Proyecto

El backend sigue un patrón modular por capas para separar responsabilidades y facilitar su mantenimiento:

```text
supermarket-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Conexión a MongoDB con Mongoose
│   │   └── swagger.js           # Definición OpenAPI y especificación Swagger
│   ├── controllers/
│   │   └── product.controller.js # Manejo de solicitudes HTTP y respuestas
│   ├── middlewares/
│   │   ├── validate.middleware.js        # Middleware de validación con esquemas Zod
│   │   └── validateMongoId.middleware.js # Validación de ObjectId en parámetros (:id)
│   ├── models/
│   │   └── product.model.js     # Modelo Mongoose (hooks de slug y fechas)
│   ├── repositories/
│   │   └── product.repository.js # Capa de persistencia y consultas a MongoDB
│   ├── routes/
│   │   └── product.routes.js    # Definición de rutas y anotaciones Swagger
│   ├── schemas/
│   │   └── product.schema.js    # Esquemas de validación Zod (creación, edición, status)
│   ├── services/
│   │   └── product.service.js   # Lógica de negocio y orquestación
│   ├── utils/
│   │   └── errorHandler.js      # Middleware de errores (Zod, Mongoose, 404, etc.)
│   └── app.js                   # Configuración del servidor Express, Helmet, Morgan y Swagger
├── .env                         # Variables de entorno
├── package.json                 # Dependencias y scripts del proyecto
├── Postman.md                   # Ejemplos detallados de peticiones y respuestas
├── README.md                    # Documentación del proyecto
└── seed.js                      # Script para poblar la base de datos
```

### Capas y componentes:

- **Middlewares (`validateBody`, `validateMongoId`):** Interceptan y validan los cuerpos de las peticiones (Zod) y los identificadores en la URL antes de llamar a los controladores.
- **Controllers:** Reciben la petición Express, invocan los servicios correspondientes y retornan la respuesta JSON estandarizada.
- **Services:** Concentran las reglas de negocio, validaciones complejas y la coordinación con el repositorio.
- **Repositories:** Abstraen el acceso directo a los métodos de Mongoose y MongoDB.
- **Models:** Esquemas Mongoose que definen tipos, validaciones de persistencia y hooks para autogenerar slugs.
- **Error Handler Centralizado:** Gestiona errores de Zod (400), validaciones Mongoose (400), índices únicos/duplicados (409) y rutas no encontradas (404).

---

## 📦 Modelo de Producto

Cada producto gestionado por la API cuenta con la siguiente estructura:

| Campo | Tipo | Obligatorio | Por defecto | Descripción |
|---|---|:---:|---|---|
| `nombre` | `String` | Sí | - | Mínimo 2 caracteres. |
| `categoria` | `String` | Sí | - | Categoría del producto (no vacía). |
| `precio` | `Number` | Sí | - | Número mayor o igual a 0. |
| `stock` | `Number` | Sí | - | Número entero mayor o igual a 0. |
| `marca` | `String` | Sí | - | Marca del producto (no vacía). |
| `descripcion` | `String` | Sí | - | Descripción detallada (no vacía). |
| `slug` | `String` | No | Autogenerado | Slug único generado a partir del nombre o asignado manualmente. |
| `isActive` | `Boolean` | No | `false` | Indica si el producto está activo para la venta. |
| `status` | `String` | No | `"inactive"` | Estado funcional del producto (p. ej. `active`, `inactive`, etc.). |
| `createdAt` | `Date` | No | `null` | Fecha de creación del registro. |
| `updatedAt` | `Date` | No | `null` | Fecha de última actualización. |
| `deletedAt` | `Date` | No | `null` | Marca de tiempo para borrado lógico (*soft delete*). |

---

## 🛣️ Endpoints de la API

Base path: `http://localhost:3000/api/products`

| Método | Endpoint | Middleware / Validación | Descripción |
|---|---|---|---|
| `POST` | `/api/products` | `validateBody(createProductSchema)` | Crea un nuevo producto. |
| `GET` | `/api/products` | - | Lista todos los productos. |
| `GET` | `/api/products/is-active` | - | Lista únicamente productos activos (`isActive: true` y `deletedAt: null`). |
| `GET` | `/api/products/slug/:slug` | - | Busca un producto por su `slug`. |
| `GET` | `/api/products/:id` | `validateMongoId` | Obtiene un producto por su `_id`. |
| `PUT` | `/api/products/:id` | `validateMongoId`, `validateBody(updateProductSchema)` | Actualiza un producto por su `_id` (requiere al menos un campo). |
| `DELETE` | `/api/products/:id` | `validateMongoId` | Eliminación física permanente (*hard delete*). |
| `PATCH` | `/api/products/:id/soft-delete` | `validateMongoId` | Borrado lógico (*soft delete*): asigna `deletedAt` e `isActive: false`. |
| `PATCH` | `/api/products/:id/restore` | `validateMongoId` | Restaura un producto eliminado: asigna `deletedAt: null` e `isActive: true`. |
| `PATCH` | `/api/products/:id/status` | `validateMongoId`, `validateBody(changeStatusSchema)` | Modifica el estado del producto (`status`). |
| `PATCH` | `/api/products/:id/is-active` | `validateMongoId` | Alterna o establece explícitamente el valor de `isActive`. |

### Utilidades adicionales:

- `GET /health` - Comprueba el estado del servicio.
- `GET /api-docs` (o `/api/docs`) - Interfaz Swagger UI para explorar y probar los endpoints interactivamente.

Para ejemplos completos de peticiones y respuestas con cuerpos JSON, consulta [Postman.md](file:///home/andreu/2DAM/Proyecto-Servicios/Proyecto%20Supermercado/v4%20helmet%20morgan%20middleware%20zod/supermarket-backend/Postman.md).

---

## 🛡️ Manejo Centralizado de Errores

Las respuestas siguen un formato JSON homogéneo:

```json
{
  "success": false,
  "message": "Mensaje descriptivo del error",
  "errors": []
}
```

- **Errores Zod (`400 Bad Request`):** Devuelve `message` y un array `errors` con el campo afectado y el motivo del fallo.
- **IDs de MongoDB inválidos (`400 Bad Request`):** Capturados en el middleware `validateMongoId` antes de consultar la base de datos.
- **Validaciones Mongoose (`400 Bad Request`):** Devuelve los mensajes generados por el esquema.
- **Clave duplicada MongoDB (`409 Conflict`):** Captura el código de error `11000`.
- **Ruta no encontrada (`404 Not Found`):** Middleware `notFound` para endpoints inexistentes.
