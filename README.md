# 🛒 Mercado · Sistema de Gestión de Productos de Supermercado

Sistema completo Full Stack para la administración y gestión de catálogo de productos de supermercado. La solución está compuesta por una API RESTful robusta desarrollada en **Node.js, Express y MongoDB**, y una aplicación cliente SPA (Single Page Application) reactiva e interactiva construida con **React, Vite y Tailwind CSS**.

---

## 🚀 Tecnologías Principales

### **Backend**

- **Entorno:** [Node.js](https://nodejs.org/) (v18+)
- **Framework Web:** [Express.js](https://expressjs.com/)
- **Base de Datos / ODM:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Validación de Datos:** [Zod](https://zod.dev/)
- **Seguridad & CORS:** [Helmet](https://helmetjs.github.io/) & [cors](https://github.com/expressjs/cors)
- **Documentación de API:** [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
- **Logging HTTP:** [Morgan](https://github.com/expressjs/morgan)

### **Frontend**

- **Framework / Bundler:** [React 18](https://react.dev/) & [Vite](https://vitejs.dev/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Enrutamiento:** [React Router](https://reactrouter.com/) (con carga perezosa `React.lazy` y `Suspense`)
- **Formularios & Validación:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Notificaciones & Confirmaciones:** [SweetAlert2](https://sweetalert2.github.io/)

---

## 📋 Requisitos Previos

- **Node.js** v18.0.0 o superior
- **npm** (incluido con Node.js)
- **MongoDB** en ejecución local (puerto por defecto `27017`) o una instancia en la nube (MongoDB Atlas).

---

## 📁 Arquitectura Global del Proyecto

```text
supermarket-app/
├── supermarket-backend/          # API RESTful (Express + MongoDB)
│   ├── src/
│   │   ├── config/               # Conexión DB y especificación Swagger
│   │   ├── controllers/          # Controladores HTTP
│   │   ├── middlewares/          # Validaciones Zod, MongoID y manejador de errores
│   │   ├── models/               # Modelos Mongoose
│   │   ├── repositories/         # Capa de persistencia y consultas
│   │   ├── routes/               # Definición de endpoints
│   │   ├── schemas/              # Esquemas de validación Zod
│   │   ├── services/             # Lógica de negocio
│   │   └── utils/                # Utilidades y middleware de errores centralizado
│   ├── seed.js                   # Script para poblar la DB con datos de prueba
│   └── package.json
│
└── supermarket-frontend/         # Cliente SPA (React + Vite + Tailwind)
    ├── src/
    │   ├── components/           # Componentes UI (Layout, Datatable, Forms, etc.)
    │   ├── context/              # Estado global (ProductContext)
    │   ├── hooks/                # Custom hooks (useProducts)
    │   ├── pages/                # Páginas (List, Create, Edit, Detail)
    │   ├── routes/               # Configuración de rutas (AppRoutes)
    │   ├── services/             # Cliente Axios (apiClient, productService)
    │   └── utils/                # Manejo de alertas y errores
    └── package.json

```

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd supermarket-app

```

---

### 2. Configurar y Arrancar el Backend

```bash
cd supermarket-backend

# Instalación de dependencias
npm install

# Configuración de variables de entorno (.env)
# Crea un archivo .env en la raíz de 'supermarket-backend':

```

**Contenido de `supermarket-backend/.env`:**

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/supermarket
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

```

**Ejecución:**

```bash
# Iniciar en modo desarrollo (Nodemon)
npm run dev

# (Opcional) Población inicial de la base de datos (Seed)
npm run seed

```

> La API estará disponible en `http://localhost:3000` y la documentación interactiva Swagger en `http://localhost:3000/api-docs`.
> 
> 

---

### 3. Configurar y Arrancar el Frontend

En una nueva terminal:

```bash
cd supermarket-frontend

# Instalación de dependencias
npm install

# Configuración de variables de entorno (.env)
cp .env.example .env

```

**Contenido de `supermarket-frontend/.env`:**

```env
VITE_API_URL=http://localhost:3000/api/products

```

**Ejecución:**

```bash
npm run dev

```

> Abrir en el navegador la URL que indique Vite (normalmente `http://localhost:5173`).
> 
> 

---

## 📦 Modelo de Datos de Producto

Cada producto dentro del sistema maneja los siguientes campos:

| Campo | Tipo | Requerido | Descripción / Validación |
| --- | --- | --- | --- |
| `_id` / `id` | `ObjectId` | Auto | Identificador único del producto.
| `nombre` | `String` | Sí | Nombre del producto (mín. 2 caracteres).
| `categoria` | `String` | Sí | Categoría del producto.
| `precio` | `Number` | Sí | Valor numérico `≥ 0`.
| `stock` | `Number` | Sí | Número entero `≥ 0`.
| `marca` | `String` | Sí | Marca comercial del producto.
| `descripcion` | `String` | Sí | Descripción detallada.
| `slug` | `String` | Auto | Generado automáticamente a partir del nombre.
| `isActive` | `Boolean` | No | Indica si el producto está activo para la venta (por defecto `false`).
| `status` | `String` | No | Estado funcional (`active`, `inactive`, etc., por defecto `"inactive"`).
| `deletedAt` | `Date / null` | No | Fecha de borrado para borrado lógico (*soft delete*).


---

## 🛣️ Endpoints de la API Backend

Base path: `http://localhost:3000/api/products`

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/` | Lista todos los productos (incluidos inactivos/eliminados lógicamente).|
| `GET` | `/is-active` | Lista únicamente productos activos (`isActive: true` y `deletedAt: null`).|
| `GET` | `/:id` | Obtiene un producto por su `_id`.|
| `GET` | `/slug/:slug` | Obtiene un producto por su `slug`.|
| `POST` | `/` | Crea un nuevo producto (validado con esquema Zod).|
| `PUT` | `/:id` | Actualización completa del producto.|
| `PATCH` | `/:id/soft-delete` | **Borrado lógico:** asigna `deletedAt` y marca `isActive: false`.|
| `PATCH` | `/:id/restore` | **Restaurar:** limpia `deletedAt` y establece `isActive: true`.|
| `PATCH` | `/:id/status` | Modifica el estado funcional (`status`) del producto.|
| `PATCH` | `/:id/is-active` | Alterna o actualiza el flag de `isActive`.|
| `DELETE` | `/:id` | **Eliminación física permanente** (*hard delete*).|

### Rutas de Utilidad del Backend

- `GET /health` - Chequeo de salud de la API.
- `GET /api-docs` - Documentación interactiva con Swagger UI.

---

## ✨ Funcionalidades Destacadas del Frontend

- **Gestión CRUD Completa:** Crear, editar, ver detalle y consultar productos con navegación fluida.
- **Filtros y Búsqueda:** Búsqueda en tiempo real por texto, filtros por estado y paginación.
- **Gestión Avanzada de Estados:** Soporte para alternar estado activo/inactivo, modificar estados personalizados, borrado lógico, restauración y borrado físico permanente con confirmación mediante SweetAlert2.
- **Formularios Robustos:** Validación cliente-servidor sincronizada con Zod y React Hook Form.
- **Feedback de Usuario:** Pantallas de carga con Skeletons, manejo de errores descriptivo y notificaciones informativas.
- **Rendimiento:** Separación de código (*code splitting*) mediante `React.lazy` y `Suspense`.