# 🛒 Mercado · Sistema de Gestión de Catálogo de Supermercado

Sistema integral Full Stack para la administración y gestión del catálogo de un supermercado. La solución está compuesta por una API RESTful robusta y escalable desarrollada en **Node.js, Express y MongoDB (Mongoose)**, junto con una aplicación cliente reactiva e interactiva desarrollada con **React, Vite y Tailwind CSS**.

---

## 🚀 Tecnologías Principales

### **Backend**
- **Entorno de ejecución:** [Node.js](https://nodejs.org/) (v18+)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Base de Datos / ODM:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Validación de Esquemas:** [Zod](https://zod.dev/)
- **Seguridad & CORS:** [Helmet](https://helmetjs.github.io/), [cors](https://github.com/expressjs/cors) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Documentación de API:** [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) & OpenAPI 3.0
- **Logging HTTP:** [Morgan](https://github.com/expressjs/morgan)

### **Frontend**
- **Framework / Bundler:** [React 18](https://react.dev/) & [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconos & Tipografía:** [Lucide React](https://lucide.dev/) & [@fontsource/manrope](https://fontsource.org/)
- **Enrutamiento:** [React Router](https://reactrouter.com/) (con carga perezosa `React.lazy` y `Suspense`)
- **Formularios & Validación:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Feedback & Alertas:** [SweetAlert2](https://sweetalert2.github.io/)

---

## 📋 Requisitos Previos

- **Node.js** v18.0.0 o superior
- **npm** (incluido con Node.js)
- **MongoDB** en ejecución local (puerto por defecto `27017`) o un cluster en la nube ([MongoDB Atlas](https://www.mongodb.com/atlas)).

---

## 📁 Arquitectura Global del Proyecto

```text
API-supermercado/
├── supermarket-backend/                  # API RESTful (Express + MongoDB)
│   ├── src/
│   │   ├── config/                       # Conexión a MongoDB y especificación Swagger
│   │   ├── controllers/                  # Controladores HTTP (Product, Brand, Category, Image, Role, User, Variant)
│   │   ├── middlewares/                  # Validadores Zod, MongoID y manejador de errores
│   │   ├── models/                       # Modelos Mongoose (Product, Category, Brand, Image, Role, User, Variant)
│   │   ├── repositories/                 # Capa de persistencia y consultas a base de datos
│   │   ├── routes/                       # Definición de rutas y endpoints de la API
│   │   ├── schemas/                      # Esquemas de validación Zod por entidad
│   │   ├── services/                     # Lógica de negocio
│   │   └── utils/                        # Generador de slugs y errorHandler centralizado
│   ├── seed.js                           # Script para poblar la DB con todas las colecciones iniciales
│   └── package.json
│
└── supermarket-products-frontend/        # Cliente SPA (React + Vite + Tailwind CSS)
    ├── src/
    │   ├── components/                   # Componentes UI (Layout, Datatable, Modales, Cards, etc.)
    │   ├── context/                      # Estado global (ProductContext)
    │   ├── hooks/                        # Custom hooks reutilizables (useProducts)
    │   ├── pages/                        # Vistas de la aplicación (Listado, Creación, Edición, Detalle)
    │   ├── routes/                       # Configuración de rutas (AppRoutes)
    │   ├── services/                     # Cliente Axios y servicios de llamada a la API
    │   └── utils/                        # Formateadores y utilidades de alertas
    └── package.json
```

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd API-supermercado
```

---

### 2. Configurar y Arrancar el Backend

```bash
cd supermarket-backend

# Instalación de dependencias
npm install
```

Crea un archivo `.env` en la raíz de `supermarket-backend/`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/supermarket
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

#### **Población de la Base de Datos (Seed)**
El archivo [`seed.js`](file:///home/andreu/2DAM/Proyecto-Servicios/Proyecto Supermercado/API-supermercado/supermarket-backend/seed.js) permite poblar todas las colecciones del sistema (Roles, Usuarios, Categorías jerárquicas, Marcas, Productos con Variantes e Imágenes polimórficas).

> [!IMPORTANT]
> El script comprueba que la base de datos esté vacía para evitar inconsistencias o sobreescrituras accidentales. Si ya existen documentos, devolverá un aviso.
> Asegúrate de sincronizar o limpiar la base de datos antes de ejecutarlo si deseas restaurar los datos iniciales.

```bash
npm run seed
```

#### **Ejecutar el Servidor**
```bash
# Modo desarrollo con recarga en caliente (Nodemon)
npm run dev

# Modo producción
npm start
```

- **API Base:** `http://localhost:3000`
- **Documentación Swagger UI:** `http://localhost:3000/api-docs` (o `/api/docs`)
- **Health Check:** `http://localhost:3000/health`

---

### 3. Configurar y Arrancar el Frontend

En una terminal independiente:

```bash
cd supermarket-products-frontend

# Instalación de dependencias
npm install
```

Crea el archivo `.env` en la raíz de `supermarket-products-frontend/`:

```env
VITE_API_URL=http://localhost:3000/api/products
```

Inicia el entorno de desarrollo:

```bash
npm run dev
```

Abre en tu navegador la dirección indicada por Vite (habitualmente `http://localhost:5173`).

---

## 🗄️ Modelo de Datos y Colecciones (MongoDB / Mongoose)

Tomando como referencia la arquitectura de modelos y el script [`seed.js`](file:///home/andreu/2DAM/Proyecto-Servicios/Proyecto Supermercado/API-supermercado/supermarket-backend/seed.js), el sistema implementa **6 colecciones principales** más subdocumentos embebidos.

### 📌 Campos Comunes (`baseFields`)
La mayoría de colecciones heredan una estructura estandarizada definida en `src/models/base.js`:

| Campo | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `slug` | `String` | Auto | Slug único generado automáticamente para URLs amigables (`index: true`). |
| `is_active` | `Boolean` | `false` | Indicador de disponibilidad operativa/visible. |
| `status` | `String` | `"inactive"` | Estado funcional: `"published"`, `"draft"`, `"archived"`, `"inactive"`. |
| `deleted_at` | `Date / null` | `null` | Fecha para soporte de **borrado lógico (soft delete)**. |
| `created_at` | `Date` | Auto | Marca de tiempo de creación (`timestamps: true`). |
| `updated_at` | `Date` | Auto | Marca de tiempo de última actualización. |

---

### 1. 🛡️ Colección: Roles (`roles`)
Define los perfiles de usuario y los permisos granulares del sistema.

- **Modelo:** `Role` (`src/models/role.model.js`)
- **Generación de slug:** A partir de `name`.

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | Identificador único del rol. |
| `name` | `String` | Sí | Nombre del rol (mínimo 2 caracteres, ej: "Admin de tienda"). |
| `permissions` | `[String]` | No | Lista de cadenas de permisos asignados (por defecto `[]`). |
| *baseFields* | — | — | `slug`, `is_active`, `status`, `deleted_at`, `created_at`, `updated_at`. |

**Roles iniciales en `seed.js`:**
- **Cliente:** `["products:read", "orders:create", "orders:read:own"]`
- **Gestor de inventario:** `["products:read", "products:write", "variants:write", "stock:update"]`
- **Admin de tienda:** `["*"]`

---

### 2. 👤 Colección: Usuarios (`users`)
Gestiona los accesos, autenticación y asociación de roles para los operadores y clientes.

- **Modelo:** `User` (`src/models/user.model.js`)
- **Generación de slug:** Derivado automáticamente del correo electrónico (`usuario-dominio`).
- **Seguridad:** Contraseña hasheada (`bcrypt` / `scrypt`), excluida de consultas por defecto (`select: false`).

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | Identificador único del usuario. |
| `email` | `String` | Sí | Correo electrónico único, en minúsculas y validado con formato regex. |
| `password` | `String` | Sí | Hash criptográfico de la contraseña (`select: false`). |
| `full_name` | `String` | Sí | Nombre completo del usuario (mínimo 2 caracteres). |
| `role_ids` | `[ObjectId]` | No | Array de referencias a documentos de la colección `Role`. |
| *baseFields* | — | — | `slug`, `is_active`, `status`, `deleted_at`, `created_at`, `updated_at`. |

**Usuarios sembrados en `seed.js`:**
| Email | Contraseña | Rol Asignado | Estado |
| --- | --- | --- | --- |
| `admin@supermercado.com` | `Admin1234!` | Admin de tienda | Activo (`published`) |
| `inventario@supermercado.com` | `Inventario1234!` | Gestor de inventario | Activo (`published`) |
| `ana.garcia@example.com` | `Cliente1234!` | Cliente | Activo (`published`) |
| `carlos.lopez@example.com` | `Cliente1234!` | Cliente | Activo (`published`) |
| `marta.perez@example.com` | `Cliente1234!` | Cliente | Inactivo (`inactive`) |

---

### 3. 📂 Colección: Categorías (`categories`)
Estructura jerárquica para la clasificación de productos, con soporte para categorías padre y subcategorías mediante autorreferencia.

- **Modelo:** `Category` (`src/models/category.model.js`)
- **Generación de slug:** A partir de `name`.

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | Identificador único de la categoría. |
| `name` | `String` | Sí | Nombre de la categoría (mínimo 2 caracteres). |
| `description` | `String` | No | Descripción temática o comercial. |
| `parent_id` | `ObjectId / null` | No | Autorreferencia a otra categoría (`ref: "Category"`, `index: true`). `null` para categorías raíz. |
| *baseFields* | — | — | `slug`, `is_active`, `status`, `deleted_at`, `created_at`, `updated_at`. |

**Estructura sembrada en `seed.js`:**
- **Categorías Raíz:** `Lácteos`, `Frutas y verduras`, `Panadería`, `Bebidas`, `Despensa`.
- **Subcategorías:**
  - `Leche`, `Yogures` *(padre: Lácteos)*
  - `Frutas`, `Verduras` *(padre: Frutas y verduras)*
  - `Pan` *(padre: Panadería)*
  - `Agua`, `Refrescos` *(padre: Bebidas)*
  - `Pasta y arroz`, `Aceites` *(padre: Despensa)*

---

### 4. 🏷️ Colección: Marcas (`brands`)
Catálogo de fabricantes y marcas comerciales disponibles en el supermercado.

- **Modelo:** `Brand` (`src/models/brand.model.js`)
- **Generación de slug:** A partir de `name`.

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | Identificador único de la marca. |
| `name` | `String` | Sí | Nombre comercial (mínimo 2 caracteres). |
| *baseFields* | — | — | `slug`, `is_active`, `status`, `deleted_at`, `created_at`, `updated_at`. |

**Marcas sembradas en `seed.js`:**
*Puleva, Danone, Bimbo, Font Vella, Coca-Cola, Gallo, Carbonell, Hacendado.*

---

### 5. 📦 Colección: Productos (`products`)
Entidad central del catálogo que agrupa la información principal del producto, snapshots desnormalizados para optimizar lecturas, variantes de venta embebidas y galería de imágenes.

- **Modelo:** `Product` (`src/models/product.model.js`)
- **Generación de slug:** A partir de `name`.
- **Índices:** `category.id` (1), `brand.id` (1), `variants.sku` (1, único y sparse).

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | Identificador único del producto. |
| `name` | `String` | Sí | Nombre del producto (mínimo 2 caracteres). |
| `description` | `String` | Sí | Descripción detallada del producto. |
| `category` | `Object` | Sí | Snapshot desnormalizado: `{ id: ObjectId (ref Category), slug: String, name: String }`. |
| `brand` | `Object` | Sí | Snapshot desnormalizado: `{ id: ObjectId (ref Brand), slug: String, name: String }`. |
| `variants` | `[VariantSchema]` | No | Lista de variantes comerciales (SKU, precio, stock, atributos). Validadas para SKUs únicos. |
| `images` | `[ImageSchema]` | No | Galería embebida: `[{ url: String, alt_text: String }]` (*Enfoque A*). |
| *baseFields* | — | — | `slug`, `is_active`, `status`, `deleted_at`, `created_at`, `updated_at`. |

#### **Subdocumento: Variantes (`Variant`)**
Las variantes representan los formatos de venta concretos de un producto (p. ej. lata individual vs. pack 24, botellas de 1 L o 5 L):

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `sku` | `String` | Sí | Código de inventario único en mayúsculas (ej. `COC-ZERO-33CL`, `LECH-ENT-1L`). |
| `price` | `Number` | Sí | Precio unitario del producto (`≥ 0`). |
| `stock` | `Number` | Sí | Cantidad disponible en almacén (entero `≥ 0`). |
| `attributes` | `Mixed / Object` | No | Propiedades dinámicas del formato (`volumen`, `peso`, `unidades`, `formato`, etc.). |
| `is_active` | `Boolean` | No | Flag de disponibilidad comercial (`false` por defecto). |
| `status` | `String` | No | Estado de la variante (`"published"`, `"inactive"`, etc.). |
| `deleted_at` | `Date / null` | No | Borrado lógico específico de la variante. |

**Productos incluidos en el `seed.js`:**
13 productos de prueba que cubren lácteos, frutas, panadería, bebidas, pastas y aceites, con variantes multiformato y estados activos, borradores e inactivos.

---

### 6. 🖼️ Colección: Imágenes Centralizadas (`images`)
Colección polimórfica que permite asociar recursos multimedia a distintas entidades del sistema (*Enfoque B*).

- **Modelo:** `Image` (`src/models/image.model.js`)
- **Índice compuesto:** `{ entity_type: 1, entity_id: 1 }`.
- **Generación de slug:** A partir de `alt_text` o concatenación `${entity_type}-${entity_id}` con sufijo aleatorio.

| Campo | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | Identificador único de la imagen. |
| `url` | `String` | Sí | URL accesible del recurso multimedia (CDN o almacenamiento estático). |
| `entity_type` | `String` | Sí | Tipo de entidad asociada. Enum: `"product"`, `"category"`, `"brand"`. |
| `entity_id` | `ObjectId` | Sí | ID del documento referenciado según el `entity_type`. |
| `alt_text` | `String` | No | Texto alternativo para accesibilidad y SEO. |
| *baseFields* | — | — | `slug`, `is_active`, `status`, `deleted_at`, `created_at`, `updated_at`. |

---

## 🛣️ Endpoints de la API Backend

Todos los endpoints principales disponen de soporte para CRUD completo, validación con Zod, filtrado por estado activo, consulta por `id` o por `slug`, cambio de estado (`status`), activación/desactivación (`is-active`), borrado lógico (`soft-delete`) y restauración (`restore`).

### 📦 Productos (`/api/products`)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/products` | Lista todos los productos. |
| `GET` | `/api/products/is-active` | Lista únicamente los productos activos y no eliminados. |
| `GET` | `/api/products/:id` | Consulta un producto por su `ObjectId`. |
| `GET` | `/api/products/slug/:slug` | Consulta un producto por su `slug`. |
| `POST` | `/api/products` | Crea un nuevo producto (validado con Zod). |
| `PUT` | `/api/products/:id` | Actualización total de los datos de un producto. |
| `PATCH` | `/api/products/:id/soft-delete` | Borrado lógico: asigna `deleted_at` y `is_active: false`. |
| `PATCH` | `/api/products/:id/restore` | Restaura un producto borrado lógicamente. |
| `PATCH` | `/api/products/:id/status` | Actualiza el estado (`published`, `draft`, `archived`, `inactive`). |
| `PATCH` | `/api/products/:id/is-active` | Alterna o actualiza el flag booleano de `is_active`. |
| `DELETE` | `/api/products/:id` | Elimina lógicamente el producto. |

### 🔢 Variantes de Producto (`/api/products/:productId/variants`)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/products/:productId/variants` | Lista las variantes de un producto específico. |
| `POST` | `/api/products/:productId/variants` | Añade una nueva variante al producto. |
| `GET` | `/api/products/:productId/variants/:sku` | Consulta una variante por su código SKU. |
| `PUT` | `/api/products/:productId/variants/:sku` | Actualiza el precio, stock o atributos de una variante. |
| `PATCH` | `/api/products/:productId/variants/:sku/soft-delete` | Borrado lógico de la variante. |
| `PATCH` | `/api/products/:productId/variants/:sku/restore` | Restaura la variante eliminada. |
| `DELETE` | `/api/products/:productId/variants/:sku` | Elimina la variante del array del producto. |

### 📂 Categorías (`/api/categories`)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/categories` | Lista todas las categorías. |
| `GET` | `/api/categories/is-active` | Lista únicamente categorías activas. |
| `GET` | `/api/categories/:id` | Obtiene una categoría por su ID. |
| `GET` | `/api/categories/slug/:slug` | Obtiene una categoría por su slug. |
| `POST` | `/api/categories` | Crea una categoría (permite asignar `parent_id` para subcategorías). |
| `PUT` | `/api/categories/:id` | Modifica una categoría. |
| `PATCH` | `/api/categories/:id/soft-delete` | Borrado lógico de la categoría. |
| `PATCH` | `/api/categories/:id/restore` | Restaura una categoría borrada. |
| `PATCH` | `/api/categories/:id/status` | Modifica el estado de la categoría. |
| `PATCH` | `/api/categories/:id/is-active` | Alterna el estado activo de la categoría. |

### 🏷️ Marcas (`/api/brands`)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/brands` | Lista todas las marcas. |
| `GET` | `/api/brands/is-active` | Lista únicamente marcas activas. |
| `GET` | `/api/brands/:id` | Obtiene una marca por ID. |
| `GET` | `/api/brands/slug/:slug` | Obtiene una marca por su slug. |
| `POST` | `/api/brands` | Registra una nueva marca. |
| `PUT` | `/api/brands/:id` | Actualiza la información de una marca. |
| `PATCH` | `/api/brands/:id/soft-delete` | Borrado lógico de la marca. |
| `PATCH` | `/api/brands/:id/restore` | Restaura la marca eliminada. |
| `PATCH` | `/api/brands/:id/status` | Modifica el estado de la marca. |
| `PATCH` | `/api/brands/:id/is-active` | Alterna el flag de marca activa. |

### 🖼️ Imágenes Polimórficas (`/api/images`)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/images` | Lista las imágenes registradas. |
| `GET` | `/api/images/is-active` | Lista imágenes activas. |
| `GET` | `/api/images/:id` | Consulta una imagen por su ID. |
| `GET` | `/api/images/slug/:slug` | Consulta una imagen por su slug. |
| `POST` | `/api/images` | Registra una nueva imagen (`entity_type`: product/category/brand). |
| `PUT` | `/api/images/:id` | Actualiza los datos de la imagen. |
| `PATCH` | `/api/images/:id/soft-delete` | Borrado lógico de la imagen. |
| `PATCH` | `/api/images/:id/restore` | Restaura la imagen. |
| `PATCH` | `/api/images/:id/status` | Modifica el estado de la imagen. |
| `PATCH` | `/api/images/:id/is-active` | Alterna el estado activo de la imagen. |

### 🛡️ Roles (`/api/roles`)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/roles` | Lista todos los roles y sus permisos. |
| `GET` | `/api/roles/is-active` | Lista roles activos. |
| `GET` | `/api/roles/:id` | Consulta un rol por su ID. |
| `GET` | `/api/roles/slug/:slug` | Consulta un rol por su slug. |
| `POST` | `/api/roles` | Crea un nuevo rol con permisos. |
| `PUT` | `/api/roles/:id` | Actualiza el nombre o permisos de un rol. |
| `PATCH` | `/api/roles/:id/soft-delete` | Borrado lógico del rol. |
| `PATCH` | `/api/roles/:id/restore` | Restaura un rol eliminado. |

### 👤 Usuarios (`/api/users`)
| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/api/users` | Lista todos los usuarios registrados. |
| `GET` | `/api/users/is-active` | Lista usuarios con cuenta activa. |
| `GET` | `/api/users/:id` | Obtiene el perfil de un usuario por su ID. |
| `GET` | `/api/users/slug/:slug` | Consulta un usuario por su slug. |
| `POST` | `/api/users` | Da de alta un usuario (hashea contraseña y valida email único). |
| `PUT` | `/api/users/:id` | Actualiza los datos del usuario. |
| `PATCH` | `/api/users/:id/soft-delete` | Desactiva y aplica borrado lógico al usuario. |
| `PATCH` | `/api/users/:id/restore` | Restaura un usuario previamente borrado. |

### 🛠️ Rutas del Sistema
- `GET /health` - Comprobación de estado del servicio API.
- `GET /api-docs` / `GET /api/docs` - Interfaz interactiva de Swagger UI con especificación OpenAPI.

---

## ✨ Funcionalidades Destacadas del Frontend

- **Gestión CRUD Completa:** Interfaz intuitiva para listar, crear, editar y visualizar el detalle de productos.
- **Búsqueda y Filtrado Dinámico:** Búsqueda en tiempo real por texto, filtros por estado (`published`, `draft`, etc.) y paginación rápida.
- **Gestión Avanzada de Estados:** Alternancia directa de disponibilidad (`is_active`), modificación de estados funcionales y operaciones de borrado lógico con opción de restauración inmediata.
- **Formularios Validados:** Doble capa de validación reactiva en cliente y sincronizada con el backend mediante React Hook Form y Zod.
- **Experiencia de Usuario (UX):** Animaciones fluidas, estados de carga mediante *skeletons*, diálogos de confirmación accesibles con SweetAlert2 e iconos contextuales con Lucide React.
- **Optimización:** División de código (*code splitting*) a nivel de ruta utilizando `React.lazy` y `Suspense`.
